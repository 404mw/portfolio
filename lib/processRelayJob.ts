// The relay job's changes per stop (ui-spec §5.7 "the relay's rebuild", §5.3a): the job is the
// `default` sheet (lib/processJob.ts) or the card's emblem (`data-emblem`). It leaves intake's
// hand looking exactly like the emblem held there, and each later bot changes it on the beat of
// its act (`JOB_BEATS`, the same numbers the acts read), each with a small pop (a squash about the
// bottom centre). On the sheet: rules thumps a stamp on, team adds the band and the step, check
// flickers the tick in and flashes the outline glow; the two rules and the folded corner are what
// arrived, so they stay as drawn. An emblem has no such marks, so there rules blinks its ink marks,
// team's second strike and check's pass flash the glow, and check blinks the marks with its lens.
// Every other role (flag, remind, ship, update, host) gives a pop and the glow, on either job. On a
// fix run's find the job shakes its "no" and the sheet drops what team built, to be built again.
// After the last bot it's done: it slides to the line's end, pops once, and fades out there. Only
// the relay timeline writes the job and its `data-job` parts. Pivots are constants via `svgOrigin`;
// the only thing measured is the job's own drawn size (`measureJob`, on setup and resize).
import { gsap } from "@/lib/gsap";
import {
  JOB_BEATS,
  JOB_BOB,
  JOB_BUILD,
  JOB_DONE,
  JOB_EXIT,
  JOB_FADE,
  JOB_FOLD,
  JOB_GLOW,
  JOB_HAND,
  JOB_HAND_OFF,
  JOB_MARK_BLINK,
  JOB_SHAKE,
  JOB_SQUASH,
  JOB_STAMP,
  JOB_TICK,
  RELAY_FIND,
  SETTLE,
} from "@/lib/processBotMotion";
import { jobPivots } from "@/lib/processJob";
import type { Visit } from "@/lib/processRelayPlan";

export type Point = { readonly x: number; readonly y: number };
/** Reads a waypoint when a tween first renders, so a re-measure reaches it. */
export type PointAt = () => Point;

export type JobParts = {
  /** The job SVG (`data-anim="process-relay"`), anchored at its bottom centre. */
  readonly job: SVGSVGElement;
  /** A card's emblem (`data-emblem`), not the default sheet. */
  readonly emblem: boolean;
  /** The sheet's marks the bots add; null on an emblem. */
  readonly stamp: SVGElement | null;
  readonly band: SVGElement | null;
  readonly step: SVGElement | null;
  readonly tick: SVGElement | null;
  /** An emblem's ink marks (`data-job="mark"`); none on the sheet. */
  readonly marks: readonly SVGElement[];
  /** The outline flash: one on the sheet, one per base part on an emblem. */
  readonly glows: readonly SVGElement[];
};

/** The job's `data-job` parts. */
export function findJob(job: SVGSVGElement): JobParts {
  const one = (name: string) => job.querySelector<SVGElement>(`[data-job="${name}"]`);
  const all = (name: string) => Array.from(job.querySelectorAll<SVGElement>(`[data-job="${name}"]`));
  return {
    job,
    emblem: job.dataset.emblem !== undefined,
    stamp: one("stamp"),
    band: one("band"),
    step: one("step"),
    tick: one("tick"),
    marks: all("mark"),
    glows: all("glow"),
  };
}

/** Every element the job motion writes, for the strip on revert. */
export function jobElements(parts: JobParts): Element[] {
  const { job, stamp, band, step, tick, marks, glows } = parts;
  const written: (Element | null)[] = [job, stamp, band, step, tick, ...marks, ...glows];
  return written.filter((element): element is Element => element !== null);
}

/** An emblem's centre in its own viewBox (the prop slot, x 106–130, y 23–50): the glow's pivot. */
const EMBLEM_CENTRE = [118, 36.5] as const;
/** The sheet's centre above its bottom edge, viewBox units (half its 24). */
const SHEET_HALF = 12;

/** The job's drawn size, read from the layout (setup and resize only). */
export type JobSize = {
  /** Its box's width, px. */
  readonly width: number;
  /** Its box's height, px. */
  readonly height: number;
  /** One viewBox unit, px. */
  readonly unit: number;
  /** Its visual centre above the anchor (the box's bottom centre), px: where the lesson splits off. */
  readonly centre: number;
  /** The hand's height in bot viewBox units (`JOB_HAND`): the anchor that covers the held emblem. */
  readonly hand: number;
};

/** Measures the job's box. Its transforms don't count: these are the CSS sizes. */
export function measureJob(parts: JobParts): JobSize {
  const style = getComputedStyle(parts.job);
  const width = parseFloat(style.width) || 0;
  const height = parseFloat(style.height) || 0;
  const box = parts.job.viewBox.baseVal;
  const unit = box.width > 0 && box.height > 0 ? Math.min(width / box.width, height / box.height) : 1;
  const centre = parts.emblem ? box.y + box.height - EMBLEM_CENTRE[1] : SHEET_HALF;
  return { width, height, unit, centre: centre * unit, hand: parts.emblem ? JOB_HAND.emblem : JOB_HAND.sheet };
}

const origin = ([x, y]: readonly [number, number]) => `${x} ${y}`;

/** A pop on the whole job about its bottom centre, then `SETTLE`. Returns when it has settled. */
function pop(tl: gsap.core.Timeline, job: SVGSVGElement, to: gsap.TweenVars & { duration: number }, at: number) {
  tl.to(job, { ...to }, at).to(job, { scaleX: 1, scaleY: 1, ...SETTLE }, at + to.duration);
  return at + to.duration + SETTLE.duration;
}

/** The outline glow: full at `at`, then it fades as it grows a little. Returns when it's gone. */
function glow(tl: gsap.core.Timeline, glows: readonly SVGElement[], at: number) {
  if (glows.length === 0) return at;
  tl.set(glows, { opacity: 1, scale: 1 }, at).to(
    glows,
    { opacity: 0, scale: JOB_GLOW.grow, duration: JOB_GLOW.duration, ease: JOB_GLOW.ease },
    at,
  );
  return at + JOB_GLOW.duration;
}

/** Where the job leaves the hand: the point, and the scale that makes it the held emblem's size. */
export type HandAt = () => Point & { readonly scale: number };

/**
 * The hand-off (`t`): the job appears where intake holds the emblem, at the emblem's size, in the
 * state it arrived in (the bots' marks not made yet, the glow off), then grows to its own size over
 * `JOB_HAND_OFF` as it leaves. No fade: it takes the held emblem's place in the same frame.
 */
export function jobStart(tl: gsap.core.Timeline, parts: JobParts, hand: HandAt, t: number) {
  const { job, emblem, stamp, band, step, tick, marks, glows } = parts;
  if (stamp) tl.set(stamp, { svgOrigin: origin(jobPivots.stamp), scale: 0 }, t);
  if (band) tl.set(band, { svgOrigin: origin(jobPivots.band), scaleY: 0 }, t);
  if (step) tl.set(step, { svgOrigin: origin(jobPivots.step), scaleY: 0 }, t);
  if (tick) tl.set(tick, { svgOrigin: origin(jobPivots.tick), scale: 1, opacity: 0 }, t);
  if (marks.length > 0) tl.set(marks, { opacity: 1 }, t);
  if (glows.length > 0) {
    tl.set(glows, { svgOrigin: origin(emblem ? EMBLEM_CENTRE : jobPivots.glow), scale: 1, opacity: 0 }, t);
  }
  tl.set(
    job,
    {
      x: () => hand().x,
      y: () => hand().y,
      transformOrigin: "50% 100%",
      scale: () => hand().scale,
      rotation: 0,
      opacity: 1,
    },
    t,
  ).to(job, { scale: 1, duration: JOB_HAND_OFF.duration, ease: "power2.out" }, t);
}

/** The find (`at`): the job shakes its "no"; the sheet drops what team built. Returns when it's still. */
function refuse(tl: gsap.core.Timeline, parts: JobParts, at: number): number {
  const { turns, step: each, ease, drop } = JOB_SHAKE;
  turns.forEach((rotation, i) => tl.to(parts.job, { rotation, duration: each, ease }, at + i * each));
  [parts.band, parts.step].forEach((part) => {
    if (part) tl.to(part, { scaleY: 0, ...drop }, at);
  });
  return at + turns.length * each;
}

/**
 * The change this visit's bot makes to the job, on its act's beats after the arrival. Returns the
 * run time at which the change (and its pop) has settled. Intake's makes none: the job is still in
 * its hand.
 */
export function jobBeat(tl: gsap.core.Timeline, parts: JobParts, visit: Visit): number {
  const { job, emblem, stamp, band, step, tick, marks, glows } = parts;
  const arrival = visit.at;
  /** A pop and the glow on one beat: the roles with no mark of their own. */
  const flash = (beat: number) => Math.max(pop(tl, job, JOB_SQUASH, arrival + beat), glow(tl, glows, arrival + beat));

  switch (visit.role) {
    case "intake":
      return arrival;
    case "rules": {
      const at = arrival + JOB_BEATS.rules.stamp;
      if (stamp) tl.to(stamp, { scale: 1, ...JOB_STAMP.part }, at);
      if (marks.length > 0) tl.set(marks, { opacity: 0 }, at).set(marks, { opacity: 1 }, at + JOB_MARK_BLINK);
      return pop(tl, job, JOB_STAMP.job, at);
    }
    case "team": {
      const built = [band, step];
      let settled = arrival;
      JOB_BEATS.team.forEach((beat, i) => {
        const part = built[i];
        if (part) tl.to(part, { scaleY: 1, ...JOB_BUILD }, arrival + beat);
        settled = pop(tl, job, JOB_SQUASH, arrival + beat);
      });
      if (emblem) glow(tl, glows, arrival + JOB_BEATS.team[1]);
      return settled;
    }
    case "check": {
      if (visit.kind === "find") return refuse(tl, parts, arrival + RELAY_FIND.pop);
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
      if (marks.length > 0) tl.set(marks, { opacity: 0 }, arrival + off).set(marks, { opacity: 1 }, arrival + again);
      return flash(again);
    }
    case "update":
      return flash(JOB_BEATS.update.flip + JOB_FOLD.duration);
    case "flag":
      return flash(JOB_BEATS.flag.raise);
    case "remind":
      return flash(JOB_BEATS.remind.ring);
    case "ship":
      return flash(JOB_BEATS.ship.send);
    case "host":
      return flash(JOB_BEATS.host.nod);
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
 * From `t`, when the last bot lets go: the finished job slides to `to` (the line's end) over
 * `seconds` with the hops' ease, pops once as done about its bottom centre (the origin `jobStart`
 * set), then fades out where it stands. Below `lg` `seconds` is 0: it pops and fades on the last
 * ledge. Returns the run time at which it's gone.
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
