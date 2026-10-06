// Rix's idle talk clock (ui-spec/00-rix.md R5.4, R7, R8.1), both motion modes, home's About: when
// chatter is due. The first comes `IDLE_TALK.first` after landing (reduced motion: after the stage
// shows); after that each gap (the caller's: `busyGap`, `settledGap` or `reducedGap`) counts from
// the last line's end, whatever said it, so a hover line or a poke line pushes the chatter back.
// Chatter is never due while a line shows. In full motion the idle clock (lib/rixIdle.ts) asks
// `due` and gives chatter its next slot; reduced motion has no idle clock, so `every` checks on a
// crew timer instead. There's no cap per page load, and a pick doesn't end it: the caller picks the
// pool by the pick state (lib/rixLines.ts).
import { gsap } from "@/lib/gsap";
import type { Crew } from "@/lib/processBotCrew";
import type { Range } from "@/lib/processBotMotion";
import { IDLE_TALK, TEMPO } from "@/lib/rixMotion";
import type { QuipMotion } from "@/lib/rixQuipMotion";

export type IdleTalk = {
  /** Landing, or the stage showing: the first chatter `IDLE_TALK.first` from now. */
  readonly start: () => void;
  /** Chatter is due: the quip is empty and the gap since the last line has passed. */
  readonly due: () => boolean;
  /** Calls `say` each time chatter is due and `may` allows, checking every `TEMPO.retry`. */
  readonly every: (may: () => boolean, say: () => void) => void;
  readonly stop: () => void;
};

type IdleTalkOptions = {
  readonly crew: Pick<Crew, "after" | "now">;
  readonly quip: Pick<QuipMotion, "showing" | "lastEnd">;
  /** The gap to the next chatter, for the phase or motion mode now. */
  readonly gap: () => Range;
};

export function idleTalk({ crew, quip, gap }: IdleTalkOptions): IdleTalk {
  /** When chatter is next due (live time); null until `start`. */
  let at: number | null = null;
  /** The last line end the gap was counted from. */
  let counted = quip.lastEnd();
  let timer: gsap.core.Tween | null = null;

  const due = () => {
    if (at === null || quip.showing()) return false;
    const ended = quip.lastEnd();
    if (ended !== null && ended !== counted) {
      counted = ended;
      const [min, max] = gap();
      at = ended + gsap.utils.random(min, max);
    }
    return crew.now() >= at;
  };

  return {
    start: () => {
      at ??= crew.now() + IDLE_TALK.first;
    },
    due,
    every: (may, say) => {
      const check = () => {
        if (due() && may()) say();
        timer = crew.after(TEMPO.retry, check);
      };
      timer?.kill();
      timer = crew.after(TEMPO.retry, check);
    },
    stop: () => {
      timer?.kill();
      timer = null;
    },
  };
}
