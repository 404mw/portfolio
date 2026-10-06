// The ledges below `lg` (ui-spec §5.9 "The ledges", §5.3a): the job's hop from ledge to ledge and
// each ledge's light. Every hop lifts the job a little above the higher ledge and drops it onto the
// other, as a thrown arc (`LEDGE_HOP`); on the hand-off it first drops out of the hand onto ledge 1.
// Each ledge's lit overlay (`process-ledge-lit`, the ground-lit gradient cut to the ledge) fades in
// as the job lands, holds while that bot works it, and fades as it hops off. The way back along the
// dotted fix line and its light are lib/processRelayFixLine.ts's. Only the ledge lights and the job
// (with its ghosts) are written: `process-ledge` and the `<li>`s are read for their place, never
// written.
import type { gsap } from "@/lib/gsap";
import { animTargets } from "@/lib/motion";
import { JOB_HAND_OFF, LEDGE_HOP, LEDGE_LIT, type Timing } from "@/lib/processBotMotion";
import type { Point, PointAt } from "@/lib/processRelayJob";
import type { Mover } from "@/lib/processRelayTrail";

/** Each stop's ledge-lit overlay, in step order (from the stop's `<li>`), or null if its step has none. */
export function findLedgeLights(svgs: readonly SVGSVGElement[]): (HTMLElement | null)[] {
  return svgs.map((svg) => {
    const step = svg.closest("li");
    return step ? (animTargets(step, "process-ledge-lit")[0] ?? null) : null;
  });
}

/**
 * The share of a hop from `from` to `to` spent rising to its peak (`lift` px above the higher of
 * the two): a thrown arc's, by the square roots of the rise and the fall. Read from the setup's
 * measurement, so the timeline's beats are fixed when it is built.
 */
export function riseShare(from: Point, to: Point): number {
  const peak = Math.min(from.y, to.y) - LEDGE_HOP.lift;
  const rise = Math.sqrt(Math.max(0, from.y - peak));
  const fall = Math.sqrt(Math.max(0, to.y - peak));
  return rise + fall > 0 ? rise / (rise + fall) : 0.5;
}

/**
 * One hop from ledge to ledge over `timing`: `x` to `to` across the whole hop on its ease; `y` up to
 * the peak for `rise` of it (`LEDGE_HOP.up`), then down onto `to` (`LEDGE_HOP.down`). Points are
 * read when each tween first renders, so a re-measure reaches it.
 */
export function ledgeHop(tl: gsap.core.Timeline, from: PointAt, to: PointAt, timing: Timing, rise: number): Mover {
  const up = timing.duration * rise;
  return (target, at) => {
    tl.to(target, { x: () => to().x, duration: timing.duration, ease: timing.ease }, at)
      .to(target, { y: () => Math.min(from().y, to().y) - LEDGE_HOP.lift, duration: up, ease: LEDGE_HOP.up }, at)
      .to(target, { y: () => to().y, duration: timing.duration - up, ease: LEDGE_HOP.down }, at + up);
  };
}

/**
 * The hand-off's move: out of the hand straight down onto ledge 1 (`landing`) over `JOB_HAND_OFF`,
 * then a hop on to `to` in what is left of `timing`.
 */
export function handToLedge(
  tl: gsap.core.Timeline,
  landing: PointAt,
  to: PointAt,
  timing: Timing,
  rise: number,
): Mover {
  const drop = Math.min(JOB_HAND_OFF.duration, timing.duration);
  const hop = ledgeHop(tl, landing, to, { duration: timing.duration - drop, ease: timing.ease }, rise);
  return (target, at) => {
    tl.to(target, { x: () => landing().x, y: () => landing().y, ...JOB_HAND_OFF, duration: drop }, at);
    hop(target, at + drop);
  };
}

/** At `t` the job lands on this ledge: its light fades in. */
export function ledgeOn(tl: gsap.core.Timeline, lit: Element | null | undefined, t: number) {
  if (lit) tl.to(lit, { opacity: 1, ...LEDGE_LIT.on }, t);
}

/** From `t` the job leaves this ledge (or fades on it, with `timing`): its light fades out. */
export function ledgeOff(
  tl: gsap.core.Timeline,
  lit: Element | null | undefined,
  t: number,
  timing: Timing = LEDGE_LIT.off,
) {
  if (lit) tl.to(lit, { opacity: 0, duration: timing.duration, ease: timing.ease }, t);
}
