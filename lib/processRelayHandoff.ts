// The hand-off's exit (ui-spec §5.11e): on a send run the flag bot (step 3) sends the job to a
// person, and the job leaves the row there; no exit slide, no lesson, no return light. From `lg`
// it climbs: it rises straight up from its stop in front of the pennant, eases onto the dashed
// stem's line (`process-handoff`), climbs it and passes behind the label's `bg` mask at the
// arrowhead (the relay layer's `z-1` is under the label's `z-10`), fading over its last moments,
// while the stem's lit overlay (`process-handoff-lit`) lights bottom to top behind it by
// `clip-path`, holds, and fades. Below `lg` it drops: straight down the empty bot column from ledge
// 3 onto the marker (`process-handoff-mark`), then slides a little right towards the label as it
// pops and fades; there is no lit overlay below `lg`. The ghosts trail both moves. Only the job, its
// ghosts and the lit overlay are written: the stem, the marker, their row and step 3's `<li>` are
// read for their place, never written (a transform or an opacity there would trap the label's
// `z-10`).
import { gsap } from "@/lib/gsap";
import { animTargets } from "@/lib/motion";
import { FIX_LIT_FADE, HANDOFF_CLIMB, HANDOFF_DROP, JOB_DONE, JOB_FADE } from "@/lib/processBotMotion";
import type { JobSize, Point, PointAt } from "@/lib/processRelayJob";
import { ghostFollow, type Mover } from "@/lib/processRelayTrail";

/** From `lg`: the stem's box (read only) and its lit overlay. */
export type StemParts = { readonly stem: HTMLElement; readonly lit: HTMLElement };

/** The stem from `lg`, in the relay layer's coordinates. */
export type StemWaypoints = {
  /** The stem's centre line. */
  readonly x: number;
  /** The stem's top end, under the arrowhead and the label. */
  readonly top: number;
  /** The lit overlay's top and bottom edges. */
  readonly litTop: number;
  readonly litBottom: number;
};

/** The hand-off stem and its lit overlay inside `root`, or null in a flow with no hand-off. */
export function findStem(root: HTMLElement): StemParts | null {
  const [stem] = animTargets(root, "process-handoff");
  const [lit] = animTargets(root, "process-handoff-lit");
  return stem && lit ? { stem, lit } : null;
}

/** Below `lg`: the hand-off marker inside `root` (read only), or null in a flow with no hand-off. */
export function findMark(root: HTMLElement): HTMLElement | null {
  return animTargets(root, "process-handoff-mark")[0] ?? null;
}

/** Measures the stem. Layout reads only; call on setup and resize. */
export function measureStem(parts: StemParts, layer: DOMRect): StemWaypoints {
  const stem = parts.stem.getBoundingClientRect();
  const lit = parts.lit.getBoundingClientRect();
  return {
    x: stem.left + stem.width / 2 - layer.left,
    top: stem.top - layer.top,
    litTop: lit.top - layer.top,
    litBottom: lit.bottom - layer.top,
  };
}

/** The marker's centre in the layer's coordinates. Layout reads only; call on setup and resize. */
export function measureMark(mark: HTMLElement, layer: DOMRect): Point {
  const box = mark.getBoundingClientRect();
  return { x: box.left + box.width / 2 - layer.left, y: box.top + box.height / 2 - layer.top };
}

/**
 * The share of the light shown when the climb is at `progress`: 0 until the job's centre reaches
 * the overlay's bottom edge, 1 once it has passed its top. Built from the setup's measurement, so
 * the light runs exactly behind the job on the climb's own ease.
 */
function litShare(from: number, to: number, litTop: number, litBottom: number): gsap.EaseFunction {
  const climb = gsap.parseEase(HANDOFF_CLIMB.ease);
  const height = Math.max(1, litBottom - litTop);
  return (progress) => {
    const centre = from + (to - from) * climb(progress);
    return Math.min(1, Math.max(0, (litBottom - centre) / height));
  };
}

const insetTop = (top: number) => `inset(${Math.max(0, top)}px 0px 0px 0px)`;

/**
 * From `t`, as the flag reaches the top of its raise: the job climbs from `from` up the stem and
 * fades behind the label, trailed by the ghosts, the stem lighting behind it; the light holds and
 * fades once the job is gone. `stem` is the latest measurement; `now` the setup's (the light's
 * timing is fixed when the run is built). Returns the run time at which everything is done.
 */
export function climbStem(
  tl: gsap.core.Timeline,
  job: SVGSVGElement,
  ghosts: readonly Element[],
  lit: HTMLElement,
  from: PointAt,
  stem: () => StemWaypoints | null,
  size: () => JobSize,
  now: { readonly from: Point; readonly stem: StemWaypoints; readonly size: JobSize },
  t: number,
): number {
  const { duration, ease, drift, driftEase, fade, under, hold } = HANDOFF_CLIMB;
  // The job's anchor is its bottom centre: its centre ends `under` px above the stem's top.
  const endY = (at: StemWaypoints, job: JobSize) => at.top - under + job.centre;
  const top = () => {
    const at = stem() ?? now.stem;
    return { x: at.x, y: endY(at, size()) };
  };
  const [driftFrom, driftTo] = drift;
  const climb: Mover = (target, at) => {
    tl.to(target, { y: () => top().y, duration, ease }, at).to(
      target,
      { x: () => top().x, duration: duration * (driftTo - driftFrom), ease: driftEase },
      at + duration * driftFrom,
    );
  };
  climb(job, t);
  tl.to(job, { opacity: 0, duration: fade, ease: "power1.in" }, t + duration - fade);
  ghostFollow(tl, ghosts, from, climb, duration, t);

  // The light: hidden at its full height, then uncovered from the bottom as the job climbs past.
  const { litTop, litBottom } = now.stem;
  const height = litBottom - litTop;
  const centre = (y: number) => y - now.size.centre;
  const gone = t + duration;
  tl.set(lit, { opacity: 1, clipPath: insetTop(height) }, t)
    .to(
      lit,
      {
        clipPath: insetTop(0),
        duration,
        ease: litShare(centre(now.from.y), centre(endY(now.stem, now.size)), litTop, litBottom),
      },
      t,
    )
    .to(lit, { opacity: 0, duration: FIX_LIT_FADE, ease: "none" }, gone + hold);
  return gone + hold + FIX_LIT_FADE;
}

/**
 * From `t`, as the flag reaches the top of its raise (below `lg`): the job falls straight down from
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
