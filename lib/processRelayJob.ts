// The relay job's changes per stop (ui-spec §5.7 layer 10, "The job" and "The run"): the blank job
// set at each run's start while hidden, its pop at stop 1, and each bot's change on the beat of its
// act (`JOB_BEATS`, the same numbers the acts read), each with a small pop (a squash about the
// bottom centre): rules writes two lines and thumps a stamp on, team adds the band and the step,
// check flickers the tick in and flashes the outline glow, update folds the corner over. While the
// job waits for its next hop it lifts and settles once, so it reads as held. After bot 4 it's done:
// it slides right to the ground line's end, pops once, and fades out there. Only the relay timeline
// writes the job and its `data-job` parts. Pivots come from `jobPivots` via `svgOrigin`; nothing is
// measured.
import { gsap } from "@/lib/gsap";
import type { BotRole } from "@/lib/processBots";
import {
  JOB_BEATS,
  JOB_BOB,
  JOB_BUILD,
  JOB_DONE,
  JOB_EXIT,
  JOB_FADE,
  JOB_FOLD,
  JOB_GLOW,
  JOB_POP,
  JOB_SQUASH,
  JOB_STAMP,
  JOB_TICK,
  MARK_WRITE,
  RELAY_FADE,
  SETTLE,
} from "@/lib/processBotMotion";
import { jobPivots } from "@/lib/processJob";

export type Point = { readonly x: number; readonly y: number };
/** Reads a waypoint when a tween first renders, so a re-measure reaches it. */
export type PointAt = () => Point;

export type JobParts = {
  /** The job SVG (`data-anim="process-relay"`), anchored at its bottom centre. */
  readonly job: SVGSVGElement;
  readonly base: SVGElement | null;
  readonly rules: readonly SVGElement[];
  readonly stamp: SVGElement | null;
  readonly band: SVGElement | null;
  readonly step: SVGElement | null;
  readonly tick: SVGElement | null;
  readonly fold: SVGElement | null;
  readonly glow: SVGElement | null;
};

/** The job's `data-job` parts. */
export function findJob(job: SVGSVGElement): JobParts {
  const one = (name: string) => job.querySelector<SVGElement>(`[data-job="${name}"]`);
  return {
    job,
    base: one("base"),
    rules: Array.from(job.querySelectorAll<SVGElement>('[data-job="rule"]')),
    stamp: one("stamp"),
    band: one("band"),
    step: one("step"),
    tick: one("tick"),
    fold: one("fold"),
    glow: one("glow"),
  };
}

/** Every element the job motion writes, for the strip on revert. */
export function jobElements(parts: JobParts): Element[] {
  const { job, base, rules, stamp, band, step, tick, fold, glow } = parts;
  const written: (Element | null)[] = [job, base, ...rules, stamp, band, step, tick, fold, glow];
  return written.filter((element): element is Element => element !== null);
}

const origin = ([x, y]: readonly [number, number]) => `${x} ${y}`;

/**
 * The corner flap's `transform` attribute, `k` of the way through its fold over the hinge: at 0 it
 * lies flat along the hinge (zero area, so invisible); at 1 it's as drawn. The hinge is the sheet's
 * 45° cut, through (18, 0) along (1, 1): the flap keeps its length along the hinge and scales by `k`
 * across it, which is a fold seen from the front. Every matrix entry is linear in `k`, so GSAP's
 * number-by-number tween of the string between 0 and 1 is the fold itself.
 */
function foldAt(k: number): string {
  const along = (1 + k) / 2;
  const across = (1 - k) / 2;
  return `matrix(${along} ${across} ${across} ${along} ${18 * across} ${-18 * across})`;
}

/** A pop on the whole job about its bottom centre, then `SETTLE`. Returns when it has settled. */
function pop(tl: gsap.core.Timeline, job: SVGSVGElement, to: gsap.TweenVars & { duration: number }, at: number) {
  tl.to(job, { ...to }, at).to(job, { scaleX: 1, scaleY: 1, ...SETTLE }, at + to.duration);
  return at + to.duration + SETTLE.duration;
}

/** Run start (`t`): the blank job set at stop 1 while hidden, then faded and popped in. */
export function jobStart(tl: gsap.core.Timeline, parts: JobParts, at: PointAt, t: number) {
  const { job, rules, stamp, band, step, tick, fold, glow } = parts;
  tl.set(job, { x: () => at().x, y: () => at().y, transformOrigin: "50% 100%", scale: JOB_POP.from, opacity: 0 }, t);
  rules.forEach((rule, i) => {
    const pivot = jobPivots.rules[i];
    if (pivot) tl.set(rule, { svgOrigin: origin(pivot), scaleX: 0 }, t);
  });
  if (stamp) tl.set(stamp, { svgOrigin: origin(jobPivots.stamp), scale: 0 }, t);
  if (band) tl.set(band, { svgOrigin: origin(jobPivots.band), scaleY: 0 }, t);
  if (step) tl.set(step, { svgOrigin: origin(jobPivots.step), scaleY: 0 }, t);
  if (tick) tl.set(tick, { svgOrigin: origin(jobPivots.tick), scale: 1, opacity: 0 }, t);
  if (fold) tl.set(fold, { attr: { transform: foldAt(0) } }, t);
  if (glow) tl.set(glow, { svgOrigin: origin(jobPivots.glow), scale: 1, opacity: 0 }, t);
  tl.to(job, { opacity: 1, duration: RELAY_FADE, ease: "none" }, t).to(
    job,
    { scale: 1, duration: JOB_POP.duration, ease: JOB_POP.ease },
    t,
  );
}

/**
 * The change `role` makes to the job, on its act's beats after `arrival`. Returns the run time at
 * which the change (and its pop) has settled.
 */
export function jobBeat(tl: gsap.core.Timeline, parts: JobParts, role: BotRole, arrival: number): number {
  const { job, rules, stamp, band, step, tick, fold, glow } = parts;
  switch (role) {
    case "rules": {
      const beats = JOB_BEATS.rules;
      rules.forEach((rule, i) => {
        const beat = beats.marks[i];
        if (beat !== undefined) tl.to(rule, { scaleX: 1, ...MARK_WRITE }, arrival + beat);
      });
      if (stamp) tl.to(stamp, { scale: 1, ...JOB_STAMP.part }, arrival + beats.stamp);
      return pop(tl, job, JOB_STAMP.job, arrival + beats.stamp);
    }
    case "team": {
      let settled = arrival;
      [band, step].forEach((part, i) => {
        const beat = JOB_BEATS.team[i];
        if (!part || beat === undefined) return;
        tl.to(part, { scaleY: 1, ...JOB_BUILD }, arrival + beat);
        settled = pop(tl, job, JOB_SQUASH, arrival + beat);
      });
      return settled;
    }
    case "check": {
      const [on, off, again] = JOB_BEATS.check;
      if (tick) {
        tl.set(tick, { opacity: 1 }, arrival + on)
          .set(tick, { opacity: 0 }, arrival + off)
          .set(tick, { opacity: 1 }, arrival + again)
          .fromTo(
            tick,
            { scale: JOB_TICK.from },
            { scale: 1, duration: JOB_TICK.duration, ease: JOB_TICK.ease, immediateRender: false },
            arrival + on,
          );
      }
      if (glow) {
        tl.set(glow, { opacity: 1, scale: 1 }, arrival + again).to(
          glow,
          { opacity: 0, scale: JOB_GLOW.grow, duration: JOB_GLOW.duration, ease: JOB_GLOW.ease },
          arrival + again,
        );
      }
      return Math.max(pop(tl, job, JOB_SQUASH, arrival + again), arrival + again + JOB_GLOW.duration);
    }
    case "update": {
      const { flip } = JOB_BEATS.update;
      if (fold) {
        tl.fromTo(
          fold,
          { attr: { transform: foldAt(0) } },
          { attr: { transform: foldAt(1) }, ...JOB_FOLD, immediateRender: false },
          arrival + flip,
        );
      }
      return pop(tl, job, JOB_SQUASH, arrival + flip + JOB_FOLD.duration);
    }
  }
}

/**
 * While the job waits at `at` between `from` and `until` (run times), it lifts `JOB_BOB.lift` and
 * settles back once, centred in the wait; skipped if the wait is too short to hold it.
 */
export function jobHold(tl: gsap.core.Timeline, job: SVGSVGElement, at: PointAt, from: number, until: number) {
  const length = JOB_BOB.duration * 2;
  if (until - from < length) return;
  const start = from + (until - from - length) / 2;
  const timing = { duration: JOB_BOB.duration, ease: JOB_BOB.ease };
  tl.to(job, { y: () => at().y - JOB_BOB.lift, ...timing }, start).to(
    job,
    { y: () => at().y, ...timing },
    start + JOB_BOB.duration,
  );
}

/**
 * From `t`, when bot 4 lets go: the finished job slides to `to` (the ground line's right end) over
 * `seconds` with the hops' ease, pops once as done about its bottom centre (the origin `jobStart`
 * set), then fades out where it stands. Returns the run time at which it's gone.
 */
export function jobExit(tl: gsap.core.Timeline, job: SVGSVGElement, to: PointAt, seconds: number, t: number): number {
  const done = t + seconds;
  const settled = done + JOB_DONE.up.duration + JOB_DONE.down.duration;
  tl.to(job, { x: () => to().x, y: () => to().y, duration: seconds, ease: JOB_EXIT.ease }, t)
    .to(job, { scale: JOB_DONE.scale, ...JOB_DONE.up }, done)
    .to(job, { scale: 1, ...JOB_DONE.down }, done + JOB_DONE.up.duration)
    .to(job, { opacity: 0, ...JOB_FADE }, settled);
  return settled + JOB_FADE.duration;
}
