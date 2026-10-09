// The fix run's way back below `lg` (ui-spec §5.3a, §5.9): the job goes back from step 5 to step 4
// along the dotted fix line (`process-fix-line`), not up the bot column. From ledge 5 it leaves left
// and lifts to the line's bottom end at bot 5's hand, follows the bottom turn, climbs the line,
// follows the top turn and the arrowhead into bot 4's hand, then drops onto ledge 4 and slides to
// its stop. Its visual centre runs on the line's stroke; the turns are quarter circles of a few
// points each. Behind it the line's lit overlay (`process-fix-line-lit`) lights from the bottom end
// up to the job, by `clip-path`, so the bright part follows it; once the job is past the arrowhead
// the whole line is lit (`fixLitFade` puts it out as the job heads forward). The line is read for
// its box only, never written; the route is rebuilt from the latest measurement on every frame,
// so a resize or a text reflow keeps it on the line.
import { gsap } from "@/lib/gsap";
import type { Timing } from "@/lib/processBotMotion";
import type { Point } from "@/lib/processRelayJob";
import type { Mover } from "@/lib/processRelayTrail";

/** The dotted line's border box, in the relay layer's coordinates. */
export type FixLineBox = {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
};

/** The line's stroke is 2px (`border-2`): its centre runs this far inside the box. */
const STROKE_HALF = 1;
/** `rounded-l-2xl`'s 16px, clamped by the browser to the box's width (10px): the turns' outer radius. */
const RADIUS = 16;
/** The arrowhead's tip, px past the line's right end (tip at x 12 of a 10px box). */
const TIP_PAST = 2;
/** Points inside each quarter turn, besides its two ends. */
const TURN_STEPS = 3;

/** The route back, in the job's anchor space (its bottom centre), with each point's distance along it. */
export type FixRoute = {
  readonly points: readonly Point[];
  /** Distance from the start to each point, px. */
  readonly lengths: readonly number[];
  readonly total: number;
  /** Distance at which the job's centre reaches the line's bottom end, and the arrowhead's tip. */
  readonly enter: number;
  readonly leave: number;
  /** The job's centre above its anchor, px. */
  readonly centre: number;
  readonly box: FixLineBox;
};

/** A quarter turn about `(cx, cy)` from angle `a` to `b` (radians, y down), its inner points only. */
function turn(cx: number, cy: number, r: number, a: number, b: number): Point[] {
  return Array.from({ length: TURN_STEPS }, (_, i) => {
    const angle = a + ((b - a) * (i + 1)) / (TURN_STEPS + 1);
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
}

/**
 * The route from ledge 5's stop (`from`) to ledge 4's (`to`), both job anchors, along `box`'s
 * centre line. `centre` is the job's visual centre above its anchor. Pure arithmetic: no reads.
 */
export function fixRoute(box: FixLineBox, from: Point, to: Point, centre: number): FixRoute {
  const outer = Math.min(RADIUS, box.width, box.height / 2);
  const r = Math.max(0, outer - STROKE_HALF);
  const left = box.left + STROKE_HALF;
  const end = box.left + box.width;
  const top = box.top + STROKE_HALF;
  const bottom = box.top + box.height - STROKE_HALF;
  const turnX = box.left + outer;
  const quarter = Math.PI / 2;

  // The job's centre at each stop; off a ledge at 45° (up to the bottom end, down from the tip).
  const start = { x: from.x, y: from.y - centre };
  const finish = { x: to.x, y: to.y - centre };
  const lift = { x: Math.min(start.x, end + Math.abs(start.y - bottom)), y: start.y };
  const tip = { x: end + TIP_PAST, y: top };
  const drop = { x: Math.min(finish.x, tip.x + Math.abs(finish.y - top)), y: finish.y };

  const line: Point[] = [
    { x: end, y: bottom },
    { x: turnX, y: bottom },
    ...turn(turnX, bottom - r, r, quarter, Math.PI),
    { x: left, y: bottom - r },
    { x: left, y: top + r },
    ...turn(turnX, top + r, r, Math.PI, Math.PI + quarter),
    { x: turnX, y: top },
    tip,
  ];
  const centres = [start, lift, ...line, drop, finish];

  const lengths: number[] = [];
  let total = 0;
  centres.forEach((point, i) => {
    const before = centres[i - 1];
    if (before) total += Math.hypot(point.x - before.x, point.y - before.y);
    lengths.push(total);
  });
  const enter = lengths[2] ?? 0;
  const leave = lengths[2 + line.length - 1] ?? total;

  return {
    points: centres.map((point) => ({ x: point.x, y: point.y + centre })),
    lengths,
    total,
    enter,
    leave,
    centre,
    box,
  };
}

/** The route's anchor point `distance` px along it. */
function pointAt(route: FixRoute, distance: number): Point {
  const { points, lengths } = route;
  const first = points[0] ?? { x: 0, y: 0 };
  for (let i = 1; i < points.length; i += 1) {
    const a = points[i - 1] ?? first;
    const b = points[i] ?? a;
    const from = lengths[i - 1] ?? 0;
    const to = lengths[i] ?? from;
    if (distance <= to || i === points.length - 1) {
      const share = to > from ? Math.min(1, Math.max(0, (distance - from) / (to - from))) : 1;
      return { x: a.x + (b.x - a.x) * share, y: a.y + (b.y - a.y) * share };
    }
  }
  return first;
}

/**
 * The job's (or a ghost's) move along the route over `timing`, one eased progress across its whole
 * length. `route` returns the latest route; it is read on every frame of the move.
 */
export function fixLineMove(tl: gsap.core.Timeline, route: () => FixRoute, timing: Timing): Mover {
  return (target, at) => {
    const setX = gsap.quickSetter(target, "x", "px");
    const setY = gsap.quickSetter(target, "y", "px");
    const run = { progress: 0 };
    tl.to(
      run,
      {
        progress: 1,
        duration: timing.duration,
        ease: timing.ease,
        onUpdate: () => {
          const now = route();
          const point = pointAt(now, now.total * run.progress);
          setX(point.x);
          setY(point.y);
        },
      },
      at,
    );
  };
}

const HIDDEN = "inset(100% 0% 0% 0%)";
const px = (value: number, max: number) => `${Math.min(max, Math.max(0, value)).toFixed(2)}px`;

/**
 * The lit overlay's clip with the job `distance` along the route: nothing before the bottom end;
 * then from the bottom end to the job's centre (along the bottom leg by its left edge, up the line
 * by its top edge); everything once the job is past the arrowhead.
 */
function litClip(route: FixRoute, distance: number): string {
  if (distance < route.enter) return HIDDEN;
  if (distance >= route.leave) return "inset(0px 0px 0px 0px)";
  const { box, centre } = route;
  const point = pointAt(route, distance);
  const y = point.y - centre - box.top;
  const onBottom = y > box.height - Math.min(RADIUS, box.width);
  const x = onBottom ? point.x - box.left : 0;
  return `inset(${px(y, box.height)} 0px 0px ${px(x, box.width)})`;
}

/**
 * From `t`, over the move back (`timing`, the job's own): the line's overlay is shown, clipped to
 * nothing, and lights behind the job on the same eased progress. It stays lit after.
 */
export function fixLineLight(
  tl: gsap.core.Timeline,
  lit: HTMLElement,
  route: () => FixRoute,
  timing: Timing,
  t: number,
) {
  const run = { progress: 0 };
  tl.set(lit, { opacity: 1, clipPath: HIDDEN }, t).to(
    run,
    {
      progress: 1,
      duration: timing.duration,
      ease: timing.ease,
      onUpdate: () => {
        const now = route();
        lit.style.clipPath = litClip(now, now.total * run.progress);
      },
    },
    t,
  );
}
