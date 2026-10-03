// Rix's play clock (ui-spec/00-rix.md R7), full motion, option B: the first play `PLAY.first` after
// landing, then `PLAY.gap` after any act, play or walk ends (a patrol stretch doesn't reset it: the
// caller skips `rest` for it); plays start only while he stands (a patrol pause or idle, never
// mid-stretch: the caller's `may`); at most `PLAY.max` per `PLAY.per`
// seconds of live time; never the same play twice in a row; picked by `PLAY.weights`. A play
// that comes due while it can't start (an act runs, the mood isn't neutral) or while things are
// busy (`quiet`: the pointer near the picks or Rix, focus inside, a quip showing) is skipped and
// retried after `PLAY.retry`. Tag and the nap aren't on this clock. The timer is a crew timer, so
// it pauses off screen and in a hidden tab.
import { gsap } from "@/lib/gsap";
import { PLAY, type PlayName } from "@/lib/rixMotion";

export type PlayClock = {
  /** On landing: the first play `PLAY.first` from now. */
  readonly start: () => void;
  /** An act, play or walk ended: the next play a gap from now. */
  readonly rest: () => void;
  readonly stop: () => void;
};

type PlayClockOptions = {
  readonly crew: { readonly after: (seconds: number, callback: () => void) => gsap.core.Tween; readonly now: () => number };
  /** True when a play may start now (idle, no act, mood neutral). */
  readonly may: () => boolean;
  /** True when a play now would interrupt the visitor. */
  readonly quiet: () => boolean;
  /** Plays `name`. */
  readonly play: (name: PlayName) => void;
};

const names = Object.keys(PLAY.weights) as PlayName[];

/** A weighted pick, never `last`. */
function choose(last: PlayName | null): PlayName {
  const pool = names.filter((name) => name !== last);
  const total = pool.reduce((sum, name) => sum + PLAY.weights[name], 0);
  let roll = Math.random() * total;
  for (const name of pool) {
    roll -= PLAY.weights[name];
    if (roll <= 0) return name;
  }
  return pool[pool.length - 1] ?? "sit";
}

export function playClock({ crew, may, quiet, play }: PlayClockOptions): PlayClock {
  let timer: gsap.core.Tween | null = null;
  let started = false;
  let first = true;
  let last: PlayName | null = null;
  let history: number[] = [];

  const schedule = (delay: number) => {
    timer?.kill();
    timer = crew.after(delay, fire);
  };

  function fire() {
    timer = null;
    if (!may() || quiet()) {
      schedule(PLAY.retry);
      return;
    }
    const now = crew.now();
    history = history.filter((at) => now - at < PLAY.per);
    if (history.length >= PLAY.max) {
      schedule(Math.max(PLAY.retry, (history[0] ?? now) + PLAY.per - now));
      return;
    }
    const name = choose(last);
    last = name;
    first = false;
    history.push(now);
    play(name);
  }

  return {
    start: () => {
      if (started) return;
      started = true;
      schedule(PLAY.first);
    },
    rest: () => {
      if (!started || first) return;
      schedule(gsap.utils.random(PLAY.gap[0], PLAY.gap[1]));
    },
    stop: () => {
      timer?.kill();
      timer = null;
    },
  };
}
