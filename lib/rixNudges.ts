// Rix's nudge clock on one Rix instance (ui-spec 02a-about-options §2a.O4 "Nudge"): the first
// nudge `NUDGE_FIRST` after landing, then every `NUDGE_EVERY`, random each time; at most `max` per
// page load (4 in full motion, decided 2026-10-01; one under reduced motion). A nudge that comes
// due while things are busy (`quiet`) is skipped and retried after `NUDGE_RETRY`; a skip doesn't
// count. Any pick stops the clock for good. `memo` survives motion-mode re-runs, so the count and
// the stop hold for the whole page load. The timer runs in the crew, so it pauses off screen and
// in a hidden tab and resumes with the time it had left.
import { gsap } from "@/lib/gsap";
import type { Crew } from "@/lib/processBotCrew";
import type { Range } from "@/lib/processBotMotion";
import { NUDGE_EVERY, NUDGE_FIRST, NUDGE_RETRY } from "@/lib/rixMotion";

/** Per page load: how many nudges have played, and whether a pick has ended them. */
export type NudgeMemo = { count: number; done: boolean };

export type NudgeClock = {
  /** Starts the clock (on landing, or when the stage comes into view under reduced motion). */
  readonly start: () => void;
  /** A poke: the next nudge comes a full `NUDGE_EVERY` from now. */
  readonly restart: () => void;
  /** A pick: no more nudges this page load. */
  readonly end: () => void;
  /** Teardown: stops the timer without ending the nudges. */
  readonly stop: () => void;
};

type NudgeOptions = {
  readonly max: number;
  /** True when a nudge now would interrupt the visitor or Rix. */
  readonly quiet: () => boolean;
  /** Plays nudge number `count` (0-based). */
  readonly nudge: (count: number) => void;
};

const pick = ([min, max]: Range) => gsap.utils.random(min, max);

export function nudgeClock(crew: Crew, memo: NudgeMemo, { max, quiet, nudge }: NudgeOptions): NudgeClock {
  let timer: gsap.core.Tween | null = null;
  let started = false;
  const over = () => memo.done || memo.count >= max;

  const schedule = (delay: number) => {
    timer?.kill();
    timer = over() ? null : crew.after(delay, fire);
  };
  function fire() {
    timer = null;
    if (over()) return;
    if (quiet()) {
      schedule(NUDGE_RETRY);
      return;
    }
    const count = memo.count;
    memo.count += 1;
    nudge(count);
    schedule(pick(NUDGE_EVERY));
  }

  return {
    start: () => {
      if (started) return;
      started = true;
      schedule(pick(NUDGE_FIRST));
    },
    restart: () => {
      if (started) schedule(pick(NUDGE_EVERY));
    },
    end: () => {
      memo.done = true;
      timer?.kill();
      timer = null;
    },
    stop: () => {
      timer?.kill();
      timer = null;
    },
  };
}
