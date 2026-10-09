// One relay run's story, shared by both geometries (ui-spec §5.7, §5.3a): the plan's visits in
// order (lib/processRelayPlan.ts). At each, the bot's cue and the job's change on its beats
// (lib/processRelayJob.ts); between them, a hop, which the geometry draws: along the ground line
// from `wide` (lib/processRelay.ts), down the bot column below it (lib/processRelayColumn.ts). The
// first hop is the hand-off out of intake's hand; on a fix run one hop goes back to the work step
// and the next one forward again; on a send run the visits end at the flag (step 3). What happens
// after the last stop (the exit and the return, or the send's way out) is the geometry's own.
import type { gsap } from "@/lib/gsap";
import { jobBeat, jobHold, type JobParts, type PointAt } from "@/lib/processRelayJob";
import type { Visit } from "@/lib/processRelayPlan";

/** Whichever bot reacts at each moment of a run; bot indexes are in step order. */
export type RelayCues = {
  /** The job heads this bot's way (the rules bot's, when the lesson leaves for the return). */
  readonly head: (index: number) => void;
  /**
   * The job reaches this bot: its catch (`find`: the check finds something on a fix run; `send`:
   * the flag sends it to a person on a send run). It stays `dwell` seconds.
   */
  readonly arrive: (index: number, kind: Visit["kind"], dwell: number) => void;
  /** The lesson reaches the arrowhead (or the clipboard): this bot takes the loop back. */
  readonly receive: (index: number) => void;
  /**
   * Below `wide`: the lesson pops in at this bot's left hand and stays `seconds`; the bot looks at
   * it, then back to rest as it lifts off.
   */
  readonly holdLesson: (index: number, seconds: number) => void;
};

/** One run's own settings: its visits, and whether it is the first since setup (the emblem is already held). */
export type RunOptions = { readonly visits: readonly Visit[]; readonly first: boolean };

/**
 * A hop between two stops. `hand`: out of intake's hand (the run's first). `back`: the fix hop,
 * check to the work step. `retry`: the hop forward again after it. `on`: every other.
 */
export type Hop = {
  readonly from: number;
  readonly to: number;
  readonly kind: "hand" | "on" | "back" | "retry";
};

/** What a geometry supplies. */
export type Course = {
  /** Stop `index`'s point, read when a tween first renders (stop 1's is the hand at rest). */
  readonly stop: (index: number) => PointAt;
  /** Adds the job's move for `hop` from `t`, with its trail and lights. */
  readonly hop: (hop: Hop, t: number) => void;
};

/**
 * Adds every visit and hop of `visits` to `tl`. Returns the last visit (the job is done when it
 * leaves it), or null if there is nothing to run.
 */
export function runVisits(
  tl: gsap.core.Timeline,
  job: JobParts,
  visits: readonly Visit[],
  cues: RelayCues,
  course: Course,
): Visit | null {
  visits.forEach((visit, i) => {
    tl.call(cues.arrive, [visit.stop, visit.kind, visit.leave - visit.at], visit.at);
    // The first visit's job is still the emblem in intake's hand: nothing to change or bob yet.
    if (i > 0) jobHold(tl, job.job, course.stop(visit.stop), jobBeat(tl, job, visit), visit.leave);

    const next = visits[i + 1];
    if (!next) return;
    const before = visits[i - 1];
    const kind: Hop["kind"] =
      i === 0 ? "hand" : next.stop < visit.stop ? "back" : before && before.stop > visit.stop ? "retry" : "on";
    tl.call(cues.head, [next.stop], visit.leave);
    course.hop({ from: visit.stop, to: next.stop, kind }, visit.leave);
  });
  return visits[visits.length - 1] ?? null;
}
