// The crew relay below `lg` (ui-spec §5.9): the §5.7 run turned 90° clockwise, on the same clock
// (arrivals, dwells, job beats, cues). The 16px job waits at each bot's right foot (P1–P4) and hops
// straight down the bot column, trailed by the ghosts (no track, no lit line, no chevrons). After
// bot 4's change it drops to just above the return row's hairline (E), pops once as done and fades.
// At the same moment the lesson pops in on bot 4's rulebook (R0, on his left, the screen's left),
// measured through his live left arm; he looks at it, holds it a moment, and it lifts off and rides
// straight up the column's left edge to bot 1's clipboard (R1), where it pops out as bot 1 takes the
// loop back. The job, ghost and lesson moves are the desktop's own (lib/processRelayJob.ts,
// lib/processRelayLesson.ts, lib/processRelayTrail.ts); bot 4's look is his `holdLesson` cue.
//
// Waypoints are measured from the DOM relative to the relay layer and read through a getter, so a
// re-measure after a resize or a text reflow reaches every tween that hasn't started yet. R0 is read
// once more, live, as the lesson appears.
import { gsap } from "@/lib/gsap";
import { animTargets } from "@/lib/motion";
import {
  COLUMN_LESSON_AT,
  COLUMN_LESSON_FROM,
  COLUMN_LESSON_GLIDE,
  COLUMN_LESSON_HOLD,
  JOB_AT,
  JOB_EXIT,
  JOB_EXIT_INSET,
  LESSON_LEAVE,
  RELAY_DWELL,
  RELAY_HOP,
  RETURN_SPEED,
} from "@/lib/processBotMotion";
import { BOT_VIEWBOX } from "@/lib/processBotPointer";
import { relayArrivals, type RelayCues, type RelayStop } from "@/lib/processRelay";
import {
  findJob,
  jobBeat,
  jobElements,
  jobExit,
  jobHold,
  jobStart,
  type JobParts,
  type Point,
} from "@/lib/processRelayJob";
import {
  findLesson,
  lessonAppear,
  lessonElements,
  lessonHide,
  lessonLift,
  lessonOut,
  type LessonParts,
} from "@/lib/processRelayLesson";
import { ghostHop } from "@/lib/processRelayTrail";

const ORIGIN: Point = { x: 0, y: 0 };

export type ColumnParts = {
  /** The relay layer (the job's parent), every waypoint's coordinate box. */
  readonly layer: HTMLElement;
  readonly job: JobParts;
  /** The rule card that rides back up the column after bot 4. */
  readonly lesson: LessonParts;
  readonly ghosts: readonly Element[];
  readonly stops: readonly RelayStop[];
  /** The return row (`process-return-row`): its top edge is the hairline the job's exit stops above. */
  readonly returnRow: HTMLElement;
  /** Bot 4's left arm (`data-bot="arm-left"`), which holds the rulebook the lesson appears on. */
  readonly hand: SVGGElement | null;
};

/** Every waypoint below `lg`, in the relay layer's coordinates. */
export type ColumnWaypoints = {
  /** P1–P4: each bot's stop, the job's bottom centre on the bot's feet line, under its right hand or tool. */
  readonly stops: readonly Point[];
  /** E: where the job's exit drop stops, `JOB_EXIT_INSET` px above the return row's hairline. */
  readonly exit: Point;
  /** R0: bot 4's rulebook centre (`COLUMN_LESSON_FROM`), where the lesson appears. */
  readonly hand: Point;
  /** R1: bot 1's clipboard centre (`COLUMN_LESSON_AT`), where the ride ends. */
  readonly clipboard: Point;
};

/** The column relay's elements inside `root`, or null if any is missing. */
export function columnParts(root: HTMLElement, stops: readonly RelayStop[]): ColumnParts | null {
  const [job] = animTargets<SVGSVGElement>(root, "process-relay");
  const [lesson] = animTargets<SVGSVGElement>(root, "process-lesson");
  const [returnRow] = animTargets(root, "process-return-row");
  const layer = job?.parentElement;
  if (!job || !lesson || !returnRow || !layer) return null;
  const holder = stops[stops.length - 1]?.svg;
  return {
    layer,
    job: findJob(job),
    lesson: findLesson(lesson),
    ghosts: animTargets(layer, "process-relay-ghost"),
    stops,
    returnRow,
    hand: holder?.querySelector<SVGGElement>('[data-bot="arm-left"]') ?? null,
  };
}

/** Every element the column relay writes, for the strip on revert. */
export function columnElements(parts: ColumnParts): Element[] {
  return [...jobElements(parts.job), ...lessonElements(parts.lesson), ...parts.ghosts];
}

const shareX = (x: number) => (x - BOT_VIEWBOX.x) / BOT_VIEWBOX.width;
const shareY = (y: number) => (y - BOT_VIEWBOX.y) / BOT_VIEWBOX.height;

/**
 * Bot 4's rulebook centre now, in the layer's coordinates: `COLUMN_LESSON_FROM` through the left
 * arm's live matrix (breath, drift, sway, lean), or its rest place in the SVG's box without one.
 * Layout reads only.
 */
function rulebookAt(parts: ColumnParts, layer: DOMRect): Point {
  const matrix = parts.hand?.getScreenCTM();
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

  const stops = parts.stops.map((stop) => {
    const box = stop.svg.getBoundingClientRect();
    return inLayer(box.left + shareX(JOB_AT[stop.role]) * box.width, box.bottom);
  });

  const last = stops[stops.length - 1] ?? ORIGIN;
  const hairline = inLayer(0, parts.returnRow.getBoundingClientRect().top).y;
  const exit = { x: last.x, y: Math.max(last.y, hairline - JOB_EXIT_INSET) };

  const first = parts.stops[0]?.svg.getBoundingClientRect();
  const clipboard = first
    ? inLayer(
        first.left + shareX(COLUMN_LESSON_AT.x) * first.width,
        first.top + shareY(COLUMN_LESSON_AT.y) * first.height,
      )
    : ORIGIN;

  return { stops, exit, hand: rulebookAt(parts, layer), clipboard };
}

const distance = (a: Point, b: Point) => Math.hypot(b.x - a.x, b.y - a.y);

/**
 * From `t`, when bot `holder` (bot 4) is done with the job: the lesson pops in on his rulebook
 * (read live then) as he looks at it, stays `COLUMN_LESSON_HOLD.hold` after the pop, lifts off as
 * his eyes go back (bot 1 hears it coming), rides straight up the lane at `RETURN_SPEED` with no
 * ghosts (easing into the lane over `COLUMN_LESSON_GLIDE` if the rulebook sits off it), and pops
 * out over bot 1's clipboard as bot 1 takes it.
 */
function rideUp(
  tl: gsap.core.Timeline,
  parts: ColumnParts,
  waypoints: () => ColumnWaypoints,
  cues: RelayCues,
  holder: number,
  t: number,
) {
  const card = parts.lesson.lesson;
  const now = waypoints();

  // On bot 4's rulebook, where it is at this moment: one read, before the lesson's set renders.
  let hand = now.hand;
  tl.call(
    () => {
      hand = rulebookAt(parts, parts.layer.getBoundingClientRect());
    },
    [],
    t,
  );
  let at = lessonAppear(tl, card, () => hand, t) + COLUMN_LESSON_HOLD.hold;
  tl.call(cues.holdLesson, [holder, at - t], t);

  // Off the rulebook (bot 1 hears it coming), then R0 → R1, linear, timed by its length at setup.
  tl.call(cues.head, [0], at);
  at = lessonLift(tl, card, at);
  const lifted = { x: now.hand.x, y: now.hand.y - LESSON_LEAVE.lift };
  const duration = Math.max(distance(lifted, now.clipboard) / RETURN_SPEED, 0.01);
  const glide = { duration: Math.min(COLUMN_LESSON_GLIDE.duration, duration), ease: COLUMN_LESSON_GLIDE.ease };
  tl.to(card, { y: () => waypoints().clipboard.y, duration, ease: "none" }, at).to(
    card,
    { x: () => waypoints().clipboard.x, ...glide },
    at,
  );
  at += duration;

  // Over the clipboard: the pop out, bot 1's catch of the loop.
  lessonOut(tl, card, at);
  tl.call(cues.receive, [0], at);
}

/** One relay run below `lg`. `waypoints` returns the latest measurement. */
export function columnRun(
  parts: ColumnParts,
  waypoints: () => ColumnWaypoints,
  cues: RelayCues,
): gsap.core.Timeline {
  const { job, lesson, ghosts } = parts;
  const tl = gsap.timeline();
  const now = waypoints();
  const roles = parts.stops.map((stop) => stop.role);
  const count = Math.min(roles.length, now.stops.length);
  if (count === 0) return tl;
  const arrivals = relayArrivals(roles);
  const stop = (i: number) => () => waypoints().stops[i] ?? ORIGIN;

  // A fresh blank job at stop 1 (the lesson hidden); each bot catches and changes it, then it drops
  // one row to the next bot.
  jobStart(tl, job, stop(0), 0);
  lessonHide(tl, lesson.lesson, 0);
  let t = 0;
  for (let i = 0; i < count; i += 1) {
    const role = roles[i];
    const arrival = arrivals[i];
    if (!role || arrival === undefined) break;
    tl.call(cues.arrive, [i], arrival);
    const settled = jobBeat(tl, job, role, arrival);
    t = arrival + RELAY_DWELL[role];
    jobHold(tl, job.job, stop(i), settled, t);
    if (i === count - 1) break;

    const next = i + 1;
    tl.call(cues.head, [next], t).to(job.job, { x: () => stop(next)().x, y: () => stop(next)().y, ...RELAY_HOP }, t);
    ghostHop(tl, ghosts, stop(i), stop(next), t);
  }

  // Bot 4 is done. The job drops down its lane to just above the return row (timed by its length
  // at setup, never quicker than `JOB_EXIT.min`), trailed as on a hop, pops as done and fades...
  const last = count - 1;
  const exit = () => waypoints().exit;
  const drop = distance(now.stops[last] ?? now.exit, now.exit) / JOB_EXIT.speed;
  const timing = { duration: Math.max(JOB_EXIT.min, drop), ease: JOB_EXIT.ease };
  jobExit(tl, job.job, exit, timing.duration, t);
  ghostHop(tl, ghosts, stop(last), exit, t, timing);

  // ...while the lesson appears in his rulebook hand and rides back up the column to bot 1.
  rideUp(tl, parts, waypoints, cues, last, t);
  return tl;
}
