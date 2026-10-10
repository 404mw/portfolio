// The hand-off's exit (ui-spec §5.11e): on a send run the flag bot (step 3) sends the job to a
// person, and the job leaves the row there; no exit slide, no lesson, no return light. From `wide`
// it goes up the dashed elbow (`process-handoff`) in two parts. The climb: it rises straight up from
// its stop in front of the pennant, eases onto the elbow's vertical leg and climbs it to where the
// rounded corner starts. The run: it rounds the corner onto the horizontal leg and rides it right,
// its bottom on the line, to the arrowhead at the list's right end, passing behind the label's `bg`
// mask there (the relay layer's `z-1` is under the label's `z-10`) as it fades over its last
// moments. The elbow's lit overlay (`process-handoff-lit`) lights behind it by `clip-path`, up the
// vertical leg, then along the horizontal one, holds, and fades. Below `wide` it drops: straight
// down the empty bot column from ledge 3 onto the marker (`process-handoff-mark`), then slides a
// little right towards the label as it pops and fades; there is no lit overlay below `wide`. The
// ghosts trail both moves. Only the job, its ghosts and the lit overlay are written: the elbow, the
// marker, their row and step 3's `<li>` are read for their place, never written (a transform or an
// opacity there would trap the label's `z-10`).
import { gsap } from "@/lib/gsap";
import { animTargets } from "@/lib/motion";
import {
  FIX_LIT_FADE,
  HANDOFF_CLIMB,
  HANDOFF_DROP,
  HANDOFF_RUN,
  JOB_DONE,
  JOB_FADE,
} from "@/lib/processBotMotion";
import type { JobSize, Point, PointAt } from "@/lib/processRelayJob";
import { ghostFollow, type Mover } from "@/lib/processRelayTrail";

/** From `wide`: the elbow's box (read only) and its lit overlay. */
export type ElbowParts = { readonly elbow: HTMLElement; readonly lit: HTMLElement };

/** The elbow from `wide`, in the relay layer's coordinates. */
export type ElbowWaypoints = {
  /** The vertical leg's centre line. */
  readonly x: number;
  /** The box's left edge (the vertical leg's outer edge) and its corner's radius. */
  readonly left: number;
  readonly radius: number;
  /** The box's top edge, the horizontal leg's top: the job rides on it. */
  readonly top: number;
  /** The box's right edge: the arrowhead's tip, the list's right end. */
  readonly right: number;
  /** The lit overlay's box. */
  readonly lit: { readonly top: number; readonly bottom: number; readonly right: number };
};

/** The send's waypoints for the job's anchor (its bottom centre). */
type ElbowPath = {
  /** Where the corner starts, on the vertical leg's centre line: the climb's end. */
  readonly corner: Point;
  /** The corner's 45° point, then its end on the horizontal leg's top edge. */
  readonly mid: Point;
  readonly turned: Point;
  /** Where the run ends: the job's right edge on the arrowhead's tip. */
  readonly end: Point;
};

/** The hand-off elbow and its lit overlay inside `root`, or null in a flow with no hand-off. */
export function findElbow(root: HTMLElement): ElbowParts | null {
  const [elbow] = animTargets(root, "process-handoff");
  const [lit] = animTargets(root, "process-handoff-lit");
  return elbow && lit ? { elbow, lit } : null;
}

/** Below `wide`: the hand-off marker inside `root` (read only), or null in a flow with no hand-off. */
export function findMark(root: HTMLElement): HTMLElement | null {
  return animTargets(root, "process-handoff-mark")[0] ?? null;
}

/** Measures the elbow. Layout reads only; call on setup and resize. */
export function measureElbow(parts: ElbowParts, layer: DOMRect): ElbowWaypoints {
  const box = parts.elbow.getBoundingClientRect();
  const lit = parts.lit.getBoundingClientRect();
  const style = getComputedStyle(parts.elbow);
  const line = parseFloat(style.borderLeftWidth) || 2;
  return {
    x: box.left + line / 2 - layer.left,
    left: box.left - layer.left,
    radius: parseFloat(style.borderTopLeftRadius) || 16,
    top: box.top - layer.top,
    right: box.right - layer.left,
    lit: { top: lit.top - layer.top, bottom: lit.bottom - layer.top, right: lit.right - layer.left },
  };
}

/** The marker's centre in the layer's coordinates. Layout reads only; call on setup and resize. */
export function measureMark(mark: HTMLElement, layer: DOMRect): Point {
  const box = mark.getBoundingClientRect();
  return { x: box.left + box.width / 2 - layer.left, y: box.top + box.height / 2 - layer.top };
}

/**
 * The anchor's way round the elbow's corner and along: it comes in on the vertical leg's centre
 * line and goes out on the horizontal leg's top edge, so the turn is a quarter ellipse about the
 * corner's centre, through its 45° point.
 */
function elbowPath(at: ElbowWaypoints, job: JobSize): ElbowPath {
  const cx = at.left + at.radius;
  const cy = at.top + at.radius;
  const turned = { x: cx, y: at.top };
  return {
    corner: { x: at.x, y: cy },
    mid: { x: cx - (cx - at.x) * Math.SQRT1_2, y: cy - at.radius * Math.SQRT1_2 },
    turned,
    end: { x: Math.max(turned.x, at.right - job.width / 2), y: at.top },
  };
}

const distance = (a: Point, b: Point) => Math.hypot(b.x - a.x, b.y - a.y);

/**
 * The share of the overlay's height shown when the climb is at `progress`: 0 until the job's
 * centre reaches the overlay's bottom edge, 1 once it has passed its top. Built from the setup's
 * measurement, so the light runs exactly behind the job on the climb's own ease.
 */
function litShare(from: number, to: number, litTop: number, litBottom: number): gsap.EaseFunction {
  const climb = gsap.parseEase(HANDOFF_CLIMB.ease);
  const height = Math.max(1, litBottom - litTop);
  return (progress) => {
    const centre = from + (to - from) * climb(progress);
    return Math.min(1, Math.max(0, (litBottom - centre) / height));
  };
}

const inset = (top: number, right: number) =>
  `inset(${Math.max(0, top)}px ${Math.max(0, right)}px 0px 0px)`;

/**
 * From `t`, as the flag reaches the top of its raise: the job climbs from `from` up the elbow's
 * vertical leg (`HANDOFF_CLIMB`), rounds the corner and rides the horizontal leg to the arrowhead
 * (`HANDOFF_RUN`), fading behind the label, trailed by the ghosts; the elbow lights behind it, up
 * then along, holds and fades once the job is gone. `elbow` is the latest measurement; `now` the
 * setup's (the run's legs and the light are timed when the run is built). Returns the run time at
 * which everything is done.
 */
export function sendUpElbow(
  tl: gsap.core.Timeline,
  job: SVGSVGElement,
  ghosts: readonly Element[],
  lit: HTMLElement,
  from: PointAt,
  elbow: () => ElbowWaypoints | null,
  size: () => JobSize,
  now: { readonly from: Point; readonly elbow: ElbowWaypoints; readonly size: JobSize },
  t: number,
): number {
  const climb = HANDOFF_CLIMB;
  const { speed, fade, hold } = HANDOFF_RUN;
  const path = () => elbowPath(elbow() ?? now.elbow, size());
  const at = elbowPath(now.elbow, now.size);
  // The run's legs, each timed by its length at setup: the corner's two halves, then along to the end.
  const legs = [
    { to: () => path().mid, end: at.mid, duration: Math.max(0.01, distance(at.corner, at.mid) / speed) },
    { to: () => path().turned, end: at.turned, duration: Math.max(0.01, distance(at.mid, at.turned) / speed) },
    { to: () => path().end, end: at.end, duration: Math.max(0.01, distance(at.turned, at.end) / speed) },
  ];
  const run = legs.reduce((sum, leg) => sum + leg.duration, 0);
  const length = climb.duration + run;
  const runStart = t + climb.duration;

  // The climb (`y` on its ease, `x` onto the leg's line early), then the legs at a constant speed.
  const [driftFrom, driftTo] = climb.drift;
  const send: Mover = (target, start) => {
    tl.to(target, { y: () => path().corner.y, duration: climb.duration, ease: climb.ease }, start).to(
      target,
      { x: () => path().corner.x, duration: climb.duration * (driftTo - driftFrom), ease: climb.driftEase },
      start + climb.duration * driftFrom,
    );
    let leg = start + climb.duration;
    legs.forEach(({ to, duration }) => {
      tl.to(target, { x: () => to().x, y: () => to().y, duration, ease: "none" }, leg);
      leg += duration;
    });
  };
  const out = Math.min(fade, run);
  send(job, t);
  tl.to(job, { opacity: 0, duration: out, ease: "power1.in" }, t + length - out);
  ghostFollow(tl, ghosts, from, send, length, t, out);

  // The light: hidden, then the vertical leg uncovered from the bottom as the job climbs past. Only
  // the overlay's left strip, up to the job's right edge, shows, so the horizontal leg stays dark...
  const box = now.elbow.lit;
  const right = (x: number) => box.right - (x + now.size.width / 2);
  const centre = (y: number) => y - now.size.centre;
  const strip = right(at.corner.x);
  tl.set(lit, { opacity: 1, clipPath: inset(box.bottom - box.top, strip) }, t).to(
    lit,
    {
      clipPath: inset(0, strip),
      duration: climb.duration,
      ease: litShare(centre(now.from.y), centre(at.corner.y), box.top, box.bottom),
    },
    t,
  );
  // ...then, from the corner, the overlay's top uncovered and the horizontal leg lit left to right,
  // up to the job's right edge, leg by leg with the job.
  tl.set(lit, { clipPath: inset(0, strip) }, runStart);
  let leg = runStart;
  legs.forEach(({ end, duration }) => {
    tl.to(lit, { clipPath: inset(0, right(end.x)), duration, ease: "none" }, leg);
    leg += duration;
  });
  const gone = t + length;
  tl.to(lit, { opacity: 0, duration: FIX_LIT_FADE, ease: "none" }, gone + hold);
  return gone + hold + FIX_LIT_FADE;
}

/**
 * From `t`, as the flag reaches the top of its raise (below `wide`): the job falls straight down from
 * `from` until its centre is on the marker's, trailed by the ghosts, then slides `HANDOFF_DROP.slide`
 * px right towards the label as it pops once (`JOB_DONE`, about its bottom centre), and fades.
 * Returns the run time at which it's gone.
 */
export function dropToMark(
  tl: gsap.core.Timeline,
  job: SVGSVGElement,
  ghosts: readonly Element[],
  from: PointAt,
  mark: () => Point,
  size: () => JobSize,
  t: number,
): number {
  const { duration, ease, slide } = HANDOFF_DROP;
  const landY = () => mark().y + size().centre;
  const drop: Mover = (target, at) => {
    tl.to(target, { y: landY, duration, ease }, at);
  };
  drop(job, t);
  ghostFollow(tl, ghosts, from, drop, duration, t);

  const landed = t + duration;
  const popping = JOB_DONE.up.duration + JOB_DONE.down.duration;
  tl.to(job, { x: () => from().x + slide, duration: popping, ease: "power2.out" }, landed)
    .to(job, { scale: JOB_DONE.scale, ...JOB_DONE.up }, landed)
    .to(job, { scale: 1, ...JOB_DONE.down }, landed + JOB_DONE.up.duration)
    .to(job, { opacity: 0, ...JOB_FADE }, landed + popping);
  return landed + popping + JOB_FADE.duration;
}
