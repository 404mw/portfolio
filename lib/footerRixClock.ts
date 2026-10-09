// The footer Rix's clock (ui-spec/09-footer.md §9.4 "Motion"), full motion: what he does when nobody
// is asking anything of him, one act at a time. Two things come due:
// - a call (the caller says when: the first call, then `IDLE_TALK.settledGap` after the last line
//   ends), which goes first;
// - an idle beat, `TEMPO.settledGap` after the last act ends (`rest`): `perk`, `hop` or `look`, the
//   sheet's glyph-less beats besides the call's own wave, by their `BEAT.weights`, never the same
//   twice in a row.
// Either starts only when the caller's gate holds (`may`: he stands idle); a blocked one re-checks
// every `TEMPO.retry`. Every timer is a crew timer, so the clock stands still off screen and in a
// hidden tab. About's idle clock (lib/rixIdle.ts) is a different one: it has phases, a menu, plays
// and strolls, none of which he has.
import { gsap } from "@/lib/gsap";
import type { Crew } from "@/lib/processBotCrew";
import { BEAT, TEMPO, type BeatName } from "@/lib/rixMotion";
import { weightedPick } from "@/lib/weightedPick";

/** His idle beats between calls. */
export type FooterBeat = Extract<BeatName, "perk" | "hop" | "look">;

const beatWeights: Readonly<Record<FooterBeat, number>> = {
  perk: BEAT.weights.perk,
  hop: BEAT.weights.hop,
  look: BEAT.weights.look,
};

export type FooterRixClock = {
  /** Starts watching: a call that's due goes at once, if the gate holds. */
  readonly start: () => void;
  /** An act ended (or the watch began with no call to make): the next beat is a gap from now. */
  readonly rest: () => void;
  readonly stop: () => void;
};

type FooterRixClockOptions = {
  readonly crew: Pick<Crew, "after" | "now">;
  /** The gate both share (R2.1, R7): he stands idle, no act running. */
  readonly may: () => boolean;
  /** A call is due. */
  readonly callDue: () => boolean;
  /** The call's act and its line. */
  readonly call: () => void;
  readonly beat: (name: FooterBeat) => void;
};

export function footerRixClock({ crew, may, callDue, call, beat }: FooterRixClockOptions): FooterRixClock {
  let timer: gsap.core.Tween | null = null;
  /** When the next beat is due (live time); null until an act has ended, and once it has played. */
  let beatAt: number | null = null;
  let last: FooterBeat | null = null;

  function check() {
    timer = crew.after(TEMPO.retry, check);
    if (!may()) return;
    if (callDue()) {
      call();
      return;
    }
    if (beatAt === null || crew.now() < beatAt) return;
    beatAt = null;
    const name = weightedPick(beatWeights, last ? [last] : []) ?? "perk";
    last = name;
    beat(name);
  }

  return {
    start: () => {
      timer?.kill();
      check();
    },
    rest: () => {
      const [min, max] = TEMPO.settledGap;
      beatAt = crew.now() + gsap.utils.random(min, max);
    },
    stop: () => {
      timer?.kill();
      timer = null;
    },
  };
}
