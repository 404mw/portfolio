// The crew relay below `wide` (ui-spec §5.9, §5.3a, §5.3b): the ground-line run turned 90° clockwise,
// on the same clock (the plan's visits, dwells, job beats and cues). Every bot stands on its own
// ledge (`process-ledge`); there is no rail between them. The job leaves step 1's hand
// (lib/processRelayHand.ts), drops onto ledge 1 and hops down the bot column from ledge to ledge,
// landing at each later bot's right foot (its role's `JOB_AT` on the feet line, the ledge's top),
// trailed by the ghosts (no chevrons). Each ledge's light fades in as the job lands and out as it
// hops off (lib/processRelayLedge.ts). On a fix run it goes back from ledge 5 to ledge 4 along the
// dotted fix line, up from bot 5's hand and through the arrowhead into bot 4's, the line lighting
// behind it (lib/processRelayFixLine.ts), and hops down again as that light fades. On a send run
// the flag bot (step 3) sends it to a person: it drops from ledge 3 straight down the bot column
// onto the hand-off marker, pops and fades there (lib/processRelayHandoff.ts), and the run ends.
// After the last bot's change it pops once as done and fades on the last ledge, its light with it.
//
// In a flow with the return, at that moment the lesson pops in at the last bot's bare left hand
// (on the screen's left), measured through its live left arm; the bot looks at it, holds it a
// moment, and it lifts off and rides straight up the column's left edge to the rules bot's
// clipboard (step 2), where it pops out as the rules bot takes the loop back. A flow with no loops
// has no return row and no fix line: their absence means "no lesson" and "no fix run", never "no
// run". A step without its ledge light simply doesn't light. The job, ghost and lesson moves are
// the desktop's own (lib/processRelayJob.ts, lib/processRelayLesson.ts, lib/processRelayTrail.ts);
// the last bot's look is its `holdLesson` cue.
//
// Waypoints are measured from the DOM relative to the relay layer and read through a getter, so a
// re-measure after a resize or a text reflow reaches every tween that hasn't started yet. The
// lesson's start is read once more, live, as it appears.
import { gsap } from "@/lib/gsap";
import { animTargets } from "@/lib/motion";
import {
  COLUMN_LESSON_AT,
  COLUMN_LESSON_FROM,
  COLUMN_LESSON_GLIDE,
  COLUMN_LESSON_HOLD,
  FIX_HOP,
  FIX_LINE_HOP,
  JOB_AT,
  JOB_FADE,
  JOB_HAND_OFF,
  LEDGE_LIT,
  LESSON_LEAVE,
  RELAY_HOP,
  RETURN_SPEED,
  type Timing,
} from "@/lib/processBotMotion";
import { BOT_VIEWBOX } from "@/lib/processBotPointer";
import type { RelayStop } from "@/lib/processRelay";
import { fixLitFade } from "@/lib/processRelayFix";
import { fixLineLight, fixLineMove, fixRoute, type FixLineBox, type FixRoute } from "@/lib/processRelayFixLine";
import { findProp, handArrive, handOff, measureHand, type Hand } from "@/lib/processRelayHand";
import { dropToMark, findMark, measureMark } from "@/lib/processRelayHandoff";
import { findJob, jobElements, jobExit, measureJob, type JobParts, type JobSize, type Point } from "@/lib/processRelayJob";
import {
  findLedgeLights,
  handToLedge,
  ledgeHop,
  ledgeOff,
  ledgeOn,
  riseShare,
} from "@/lib/processRelayLedge";
import {
  findLesson,
  lessonAppear,
  lessonElements,
  lessonHide,
  lessonLift,
  lessonOut,
  type LessonParts,
} from "@/lib/processRelayLesson";
import { lessonTaker } from "@/lib/processRelayPlan";
import { runVisits, type Course, type RelayCues, type RunOptions } from "@/lib/processRelayRun";
import { ghostFollow } from "@/lib/processRelayTrail";

const ORIGIN: Point = { x: 0, y: 0 };

/** The return's elements below `wide`: only in a flow with loops. */
type ColumnReturn = {
  /** The rule card that rides back up the column after the last bot. */
  readonly lesson: LessonParts;
  /** The last bot's left arm (`data-bot="arm-left"`): the lesson appears at its hand. */
  readonly arm: SVGGElement | null;
};

export type ColumnParts = {
  /** The relay layer (the job's parent), every waypoint's coordinate box. */
  readonly layer: HTMLElement;
  readonly job: JobParts;
  readonly ghosts: readonly Element[];
  readonly stops: readonly RelayStop[];
  /** Intake's held emblem (`data-bot="prop"`), or null. */
  readonly prop: SVGGElement | null;
  /** Each stop's ledge light (`process-ledge-lit`), in step order; null where a step has none. */
  readonly ledges: readonly (HTMLElement | null)[];
  /** The return, or null in a flow with no loops: then there is no lesson and no ride back. */
  readonly back: ColumnReturn | null;
  /** The flow draws the fix loop (its marker row is in step 4): a run may be a fix run. */
  readonly fixes: boolean;
  /**
   * The dotted fix line (`process-fix-line`), read for its box only: the way back runs along it.
   * Null: the job rises straight from ledge 5 to ledge 4 instead.
   */
  readonly fixPath: HTMLElement | null;
  /** The dotted fix line's lit overlay (`process-fix-line-lit`), or null: then the way back lights nothing. */
  readonly fixLine: HTMLElement | null;
  /** The hand-off marker (`process-handoff-mark`, read only), or null: then no run is a send run. */
  readonly handoff: HTMLElement | null;
};

/** Every waypoint below `wide`, in the relay layer's coordinates. */
export type ColumnWaypoints = {
  /**
   * Each bot's stop: stop 1's is the hand at rest, the others the job's bottom centre on the bot's
   * feet line (its ledge's top), under the bot's right hand or tool.
   */
  readonly stops: readonly Point[];
  /** Where the hand-off lands: ledge 1, under the held emblem, on step 1's feet line. */
  readonly landing: Point;
  readonly hand: Hand;
  readonly job: JobSize;
  /** The dotted fix line's border box, or null with no line. */
  readonly fix: FixLineBox | null;
  /** The hand-off marker's centre, or null with none. */
  readonly handoff: Point | null;
  readonly back: {
    /** Just off the last bot's left hand (`COLUMN_LESSON_FROM`), where the lesson appears. */
    readonly hand: Point;
    /** The rules bot's clipboard centre (`COLUMN_LESSON_AT`), where the ride ends. */
    readonly clipboard: Point;
  } | null;
};

/**
 * The column relay's elements inside `root`, or null if the job or its layer is missing. The
 * return's parts are all there or left out.
 */
export function columnParts(root: HTMLElement, stops: readonly RelayStop[]): ColumnParts | null {
  const [job] = animTargets<SVGSVGElement>(root, "process-relay");
  const layer = job?.parentElement;
  if (!job || !layer) return null;

  const [lesson] = animTargets<SVGSVGElement>(root, "process-lesson");
  const [returnRow] = animTargets(root, "process-return-row");
  const [fixPath] = animTargets(root, "process-fix-line");
  const [fixLine] = animTargets(root, "process-fix-line-lit");
  const holder = stops[stops.length - 1]?.svg;
  return {
    layer,
    job: findJob(job),
    ghosts: animTargets(layer, "process-relay-ghost"),
    stops,
    prop: findProp(stops[0]),
    ledges: findLedgeLights(stops.map((stop) => stop.svg)),
    back:
      lesson && returnRow
        ? {
            lesson: findLesson(lesson),
            arm: holder?.querySelector<SVGGElement>('[data-bot="arm-left"]') ?? null,
          }
        : null,
    fixes: animTargets(root, "process-fix-row").length > 0,
    fixPath: fixPath ?? null,
    fixLine: fixLine ?? null,
    handoff: findMark(root),
  };
}

/** The hop back's timing below `wide`: along the fix line, or the straight rise without one. */
export function columnBack(parts: ColumnParts): Timing {
  return parts.fixPath ? FIX_LINE_HOP : { duration: FIX_HOP.duration, ease: FIX_HOP.ease };
}

/** Every element the column relay writes, for the strip on revert (the held emblem is the bot's to reset). */
export function columnElements(parts: ColumnParts): Element[] {
  return [
    ...jobElements(parts.job),
    ...parts.ghosts,
    ...parts.ledges.filter((lit): lit is HTMLElement => lit !== null),
    ...(parts.fixLine ? [parts.fixLine] : []),
    ...(parts.back ? lessonElements(parts.back.lesson) : []),
  ];
}

const shareX = (x: number) => (x - BOT_VIEWBOX.x) / BOT_VIEWBOX.width;
const shareY = (y: number) => (y - BOT_VIEWBOX.y) / BOT_VIEWBOX.height;

/**
 * Just off the last bot's left hand now, in the layer's coordinates: `COLUMN_LESSON_FROM` through
 * the left arm's live matrix (breath, drift, sway, lean), or its rest place in the SVG's box
 * without one. Layout reads only.
 */
function leftHandAt(parts: ColumnParts, layer: DOMRect): Point {
  const matrix = parts.back?.arm?.getScreenCTM();
  if (matrix) {
    const at = new DOMPoint(COLUMN_LESSON_FROM.x, COLUMN_LESSON_FROM.y).matrixTransform(matrix);
    return { x: at.x - layer.left, y: at.y - layer.top };
  }
  const box = parts.stops[parts.stops.length - 1]?.svg.getBoundingClientRect();
  if (!box) return ORIGIN;
  return {
    x: box.left + shareX(COLUMN_LESSON_FROM.x) * box.width - layer.left,
    y: box.top + shareY(COLUMN_LESSON_FROM.y) * box.height - layer.top,
  };
}

/** Measures every waypoint. Layout reads only; call on setup, resize and refresh. */
export function measureColumn(parts: ColumnParts): ColumnWaypoints {
  const layer = parts.layer.getBoundingClientRect();
  const inLayer = (x: number, y: number): Point => ({ x: x - layer.left, y: y - layer.top });

  const job = measureJob(parts.job);
  const first = parts.stops[0];
  // The bot's feet line is its ledge's top: the job stands on it at its role's `JOB_AT`.
  const feet = (stop: RelayStop) => {
    const box = stop.svg.getBoundingClientRect();
    return inLayer(box.left + shareX(JOB_AT[stop.role]) * box.width, box.bottom);
  };
  const landing = first ? feet(first) : ORIGIN;
  // With no held emblem the job starts on ledge 1, at its own size.
  const hand: Hand = parts.prop && first ? measureHand(first.svg, job, layer) : { ...landing, scale: 1 };
  const stops = parts.stops.map((stop, i) => (i === 0 ? { x: hand.x, y: hand.y } : feet(stop)));

  const rules = parts.stops[lessonTaker(parts.stops.map((stop) => stop.role))]?.svg.getBoundingClientRect();
  const clipboard = rules
    ? inLayer(
        rules.left + shareX(COLUMN_LESSON_AT.x) * rules.width,
        rules.top + shareY(COLUMN_LESSON_AT.y) * rules.height,
      )
    : ORIGIN;

  const line = parts.fixPath?.getBoundingClientRect();
  const fix = line
    ? { left: line.left - layer.left, top: line.top - layer.top, width: line.width, height: line.height }
    : null;

  return {
    stops,
    landing,
    hand,
    job,
    fix,
    handoff: parts.handoff ? measureMark(parts.handoff, layer) : null,
    back: parts.back ? { hand: leftHandAt(parts, layer), clipboard } : null,
  };
}

const distance = (a: Point, b: Point) => Math.hypot(b.x - a.x, b.y - a.y);

/**
 * From `t`, when bot `holder` (the last) is done with the job: the lesson pops in at its left hand
 * (read live then) as it looks at it, stays `COLUMN_LESSON_HOLD.hold` after the pop, lifts off as
 * its eyes go back (the rules bot hears it coming), rides straight up the lane at `RETURN_SPEED`
 * with no ghosts (easing into the lane over `COLUMN_LESSON_GLIDE` if the hand sits off it), and
 * pops out over the rules bot's clipboard as that bot takes it.
 */
function rideUp(
  tl: gsap.core.Timeline,
  parts: ColumnParts,
  back: ColumnReturn,
  waypoints: () => ColumnWaypoints,
  cues: RelayCues,
  holder: number,
  t: number,
) {
  const card = back.lesson.lesson;
  const now = waypoints().back;
  if (!now) return;
  const takes = lessonTaker(parts.stops.map((stop) => stop.role));
  const clipboard = () => waypoints().back?.clipboard ?? now.clipboard;

  // At the last bot's hand, where it is at this moment: one read, before the lesson's set renders.
  let hand = now.hand;
  tl.call(
    () => {
      hand = leftHandAt(parts, parts.layer.getBoundingClientRect());
    },
    [],
    t,
  );
  let at = lessonAppear(tl, card, () => hand, t) + COLUMN_LESSON_HOLD.hold;
  tl.call(cues.holdLesson, [holder, at - t], t);

  // Off the hand (the rules bot hears it coming), then up to the clipboard, linear, timed by its
  // length at setup.
  tl.call(cues.head, [takes], at);
  at = lessonLift(tl, card, at);
  const lifted = { x: now.hand.x, y: now.hand.y - LESSON_LEAVE.lift };
  const duration = Math.max(distance(lifted, now.clipboard) / RETURN_SPEED, 0.01);
  const glide = { duration: Math.min(COLUMN_LESSON_GLIDE.duration, duration), ease: COLUMN_LESSON_GLIDE.ease };
  tl.to(card, { y: () => clipboard().y, duration, ease: "none" }, at).to(card, { x: () => clipboard().x, ...glide }, at);
  at += duration;

  // Over the clipboard: the pop out, the rules bot's catch of the loop.
  lessonOut(tl, card, at);
  tl.call(cues.receive, [takes], at);
}

/** One relay run below `wide`. `waypoints` returns the latest measurement. */
export function columnRun(
  parts: ColumnParts,
  waypoints: () => ColumnWaypoints,
  cues: RelayCues,
  { visits, first }: RunOptions,
): gsap.core.Timeline {
  const { job, ghosts, ledges, fixLine, back } = parts;
  const tl = gsap.timeline();
  const now = waypoints();
  if (visits.length < 2 || now.stops.length < 2) return tl;
  const stop = (i: number) => () => waypoints().stops[i] ?? ORIGIN;
  const landing = () => waypoints().landing;
  const backTiming = columnBack(parts);

  // The way back along the fix line, from stop `from` to stop `to`: rebuilt only when a new
  // measurement comes in (or null with no line).
  let routed: { readonly at: ColumnWaypoints; readonly route: FixRoute } | null = null;
  const routeBack = (from: number, to: number) => (): FixRoute | null => {
    const latest = waypoints();
    if (!latest.fix) return null;
    if (routed?.at !== latest) {
      const start = latest.stops[from] ?? ORIGIN;
      const end = latest.stops[to] ?? ORIGIN;
      routed = { at: latest, route: fixRoute(latest.fix, start, end, latest.job.centre) };
    }
    return routed.route;
  };

  // A new job in intake's hand (the lesson hidden); each bot catches and changes it on its ledge,
  // lit while it's there, then it hops down to the next bot's ledge (on a fix run: once back up a
  // row, the fix line lighting, and down again).
  handArrive(tl, parts.prop, first, 0);
  if (back) lessonHide(tl, back.lesson.lesson, 0);

  const course: Course = {
    stop,
    hop: ({ from, to, kind }, t) => {
      const timing = kind === "back" ? backTiming : RELAY_HOP;
      const target = stop(to);
      const end = now.stops[to] ?? ORIGIN;
      const route = kind === "back" ? routeBack(from, to) : null;
      const first = route?.();

      if (route && first) {
        // Back to the work step along the dotted line, which lights behind the job; it fades as the
        // job heads on. The last measured route stands in if a later one has no line.
        const along = () => route() ?? first;
        const move = fixLineMove(tl, along, timing);
        move(job.job, t);
        ghostFollow(tl, ghosts, stop(from), move, timing.duration, t);
        ledgeOff(tl, ledges[from], t);
        if (fixLine) fixLineLight(tl, fixLine, along, timing, t);
      } else if (kind === "hand") {
        // Out of the hand (read live) onto ledge 1, which flashes as the job touches it, then on.
        const start = handOff(tl, parts, waypoints, t);
        const touch = t + Math.min(JOB_HAND_OFF.duration, timing.duration);
        const move = handToLedge(tl, landing, target, timing, riseShare(now.landing, end));
        move(job.job, t);
        ghostFollow(tl, ghosts, start, move, timing.duration, t);
        ledgeOn(tl, ledges[from], touch);
        ledgeOff(tl, ledges[from], touch + LEDGE_LIT.on.duration);
      } else {
        const rise = riseShare(now.stops[from] ?? ORIGIN, end);
        const move = ledgeHop(tl, stop(from), target, timing, rise);
        move(job.job, t);
        ghostFollow(tl, ghosts, stop(from), move, timing.duration, t);
        ledgeOff(tl, ledges[from], t);
        // With no fix line the way back is this straight rise, unlit.
        if (kind === "retry" && fixLine) fixLitFade(tl, fixLine, t);
      }
      ledgeOn(tl, ledges[to], t + timing.duration);
    },
  };
  const last = runVisits(tl, job, visits, cues, course);
  if (!last) return tl;

  // A send: the flag bot sends the job to a person, down onto the marker; its ledge's light fades
  // as it drops, and the run ends there.
  const mark = now.handoff;
  if (last.kind === "send" && mark) {
    const markAt = () => waypoints().handoff ?? mark;
    dropToMark(tl, job.job, ghosts, stop(last.stop), markAt, () => waypoints().job, last.leave);
    ledgeOff(tl, ledges[last.stop], last.leave);
    return tl;
  }

  // The last bot is done. With no rail below it the job stays on its ledge: it pops as done and
  // fades there, its ledge's light fading with it...
  const t = last.leave;
  const gone = jobExit(tl, job.job, stop(last.stop), 0, t);
  ledgeOff(tl, ledges[last.stop], gone - JOB_FADE.duration, JOB_FADE);

  // ...while, in a flow with the return, the lesson appears at its hand and rides back up to step 2.
  if (back && now.back) rideUp(tl, parts, back, waypoints, cues, last.stop, t);
  return tl;
}
