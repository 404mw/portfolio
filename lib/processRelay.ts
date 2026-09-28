// The crew relay (ui-spec §5.7 layer 10, revised 2026-09-28). From `lg`, a cream job is passed
// along the ground line from bot to bot, in front of them: each bot catches it at its stop and
// changes it on a beat of its full act (lib/processRelayJob.ts), and on each hop a trail of ghosts,
// a lit ground segment and a chevron flash follow it (lib/processRelayTrail.ts). After bot 4's
// change the job is done: it slides right to the ground line's end, trailed as on a hop, pops once
// and fades out there (never past the line, so never a sideways scroll). At the same moment a small
// lesson card splits off it (lib/processRelayLesson.ts), fades out leaving bot 4, drops in at the
// dashed return path's right end (below step 4's text, never across it) and rides the path back,
// lighting it violet, passing behind the loop label, with no ghosts; at the arrowhead it pops out as
// the arrowhead flashes and bot 1 takes it. Below `lg` the same run turns down the bot column
// (lib/processRelayColumn.ts, ui-spec §5.9).
//
// Waypoints are measured from the DOM relative to the relay layer (its box is the body wrapper's;
// the job, ghosts and lesson sit in it). They're read through a getter, so a re-measure after a
// resize reaches every tween that hasn't started yet. The bots' side of the story comes in through
// `cues`.
import { gsap } from "@/lib/gsap";
import { animTargets } from "@/lib/motion";
import type { BotRole } from "@/lib/processBots";
import {
  JOB_AT,
  JOB_EXIT,
  JOB_EXIT_INSET,
  LIT_LENGTH,
  RELAY_DWELL,
  RELAY_FADE,
  RELAY_HOP,
  RETURN_SPEED,
} from "@/lib/processBotMotion";
import { BOT_VIEWBOX } from "@/lib/processBotPointer";
import {
  findJob,
  jobBeat,
  jobElements,
  jobExit,
  jobHold,
  jobStart,
  type JobParts,
  type Point,
  type PointAt,
} from "@/lib/processRelayJob";
import {
  findLesson,
  lessonElements,
  lessonEnter,
  lessonHide,
  lessonLeave,
  lessonOut,
  lessonSplit,
  type LessonParts,
} from "@/lib/processRelayLesson";
import {
  flash,
  ghostHop,
  litHop,
  readLights,
  returnLitFade,
  returnLitStart,
  returnLitTo,
  type Lights,
} from "@/lib/processRelayTrail";

/**
 * Tailwind's `lg`: the ground line, chevrons and return path show from here, and the relay runs
 * along them; below it the relay runs down the bot column instead (lib/processRelayColumn.ts).
 */
export const relayQuery = "(min-width: 64rem)";

/** The return path's corner radius (16px) and its 45° point's inset, 16 × (1 − cos 45°). */
const CORNER = 16;
const CORNER_MID = CORNER * (1 - Math.SQRT1_2);
/**
 * The sheet's centre above the job's bottom-centre anchor: half its 24px height (lib/processJob.ts).
 * The lesson splits off here.
 */
const SHEET_CENTRE = 12;
const ORIGIN: Point = { x: 0, y: 0 };

/** A bot the job stops at: its SVG and role, in step order. */
export type RelayStop = { readonly svg: SVGSVGElement; readonly role: BotRole };

export type RelayParts = {
  /** The relay layer (the job's parent), every waypoint's coordinate box. */
  readonly layer: HTMLElement;
  readonly job: JobParts;
  /** The rule card that rides the return path after bot 4. */
  readonly lesson: LessonParts;
  readonly ghosts: readonly Element[];
  readonly ground: HTMLElement;
  readonly groundLit: HTMLElement;
  /** The ground-lit segment's clip box (the ground line's box). */
  readonly groundClip: HTMLElement;
  readonly returnBox: HTMLElement;
  readonly returnLit: HTMLElement;
  readonly stops: readonly RelayStop[];
  /** The icon inside each chevron span (the span masks the line, so it stays put). */
  readonly icons: readonly Element[];
  readonly arrowhead: Element | null;
  /** The flash colours, read from the tokens at setup. */
  readonly lights: Lights | null;
};

/** Every waypoint, in the relay layer's coordinates. */
export type RelayWaypoints = {
  /** J1–J4: each bot's stop, bottom centre on the ground line. */
  readonly stops: readonly Point[];
  /** K1–K3: the chevron centres. */
  readonly chevrons: readonly Point[];
  /** The ground-lit clip box's left edge. */
  readonly litLeft: number;
  /** Where the job's exit slide stops: the ground line's right end, less `JOB_EXIT_INSET`. */
  readonly groundEnd: number;
  /** R0–R7, on the path's centre line: down the right side, round the corners, along the bottom, up to the arrowhead. */
  readonly path: readonly Point[];
  /** The return-lit overlay's left edge and width. */
  readonly returnLeft: number;
  readonly returnWidth: number;
};

/** Whichever bot reacts at each moment of a run; bot indexes are in step order. */
export type RelayCues = {
  /** The job heads this bot's way (bot 1's when the lesson leaves bot 4 for the return). */
  readonly head: (index: number) => void;
  /** The job reaches this bot: its catch. */
  readonly arrive: (index: number) => void;
  /** The lesson reaches the arrowhead: this bot takes the loop back. */
  readonly receive: (index: number) => void;
  /**
   * Below `lg`: the lesson pops in on this bot's rulebook and stays `seconds`; the bot looks at it,
   * then back to rest as it lifts off.
   */
  readonly holdLesson: (index: number, seconds: number) => void;
};

/** The relay's elements inside `root`, or null if any is missing. */
export function relayParts(root: HTMLElement, stops: readonly RelayStop[]): RelayParts | null {
  const [job] = animTargets<SVGSVGElement>(root, "process-relay");
  const [lesson] = animTargets<SVGSVGElement>(root, "process-lesson");
  const [ground] = animTargets(root, "process-ground");
  const [groundLit] = animTargets(root, "process-ground-lit");
  const [returnBox] = animTargets(root, "process-return");
  const [returnLit] = animTargets(root, "process-return-lit");
  const layer = job?.parentElement;
  const groundClip = groundLit?.parentElement;
  if (!job || !lesson || !ground || !groundLit || !returnBox || !returnLit) return null;
  if (!layer || !groundClip) return null;
  return {
    layer,
    job: findJob(job),
    lesson: findLesson(lesson),
    ghosts: animTargets(layer, "process-relay-ghost"),
    ground,
    groundLit,
    groundClip,
    returnBox,
    returnLit,
    stops,
    icons: animTargets(root, "process-chevron")
      .map((chevron) => chevron.firstElementChild)
      .filter((icon): icon is Element => icon !== null),
    arrowhead: returnBox.firstElementChild,
    lights: readLights(),
  };
}

/** Every element the relay writes, for the strip on revert. */
export function relayElements(parts: RelayParts): Element[] {
  return [
    ...jobElements(parts.job),
    ...lessonElements(parts.lesson),
    ...parts.ghosts,
    parts.groundLit,
    parts.returnLit,
    ...parts.icons,
    ...(parts.arrowhead ? [parts.arrowhead] : []),
  ];
}

/** Measures every waypoint. Layout reads only; call on setup and resize. */
export function measureRelay(parts: RelayParts): RelayWaypoints {
  const layer = parts.layer.getBoundingClientRect();
  const inLayer = (x: number, y: number): Point => ({ x: x - layer.left, y: y - layer.top });
  const shareX = (x: number) => (x - BOT_VIEWBOX.x) / BOT_VIEWBOX.width;

  const groundBox = parts.ground.getBoundingClientRect();
  const groundTop = groundBox.top;
  const stops = parts.stops.map((stop) => {
    const box = stop.svg.getBoundingClientRect();
    return inLayer(box.left + shareX(JOB_AT[stop.role]) * box.width, groundTop);
  });

  const chevrons = parts.icons.map((icon) => {
    const box = (icon.parentElement ?? icon).getBoundingClientRect();
    return inLayer(box.left + box.width / 2, box.top + box.height / 2);
  });
  const litLeft = inLayer(parts.groundClip.getBoundingClientRect().left, 0).x;

  const box = parts.returnBox.getBoundingClientRect();
  const right = box.right - 1;
  const left = box.left + 1;
  const bottom = box.bottom - 1;
  const path = [
    inLayer(right, box.top),
    inLayer(right, bottom - CORNER),
    inLayer(right - CORNER_MID, bottom - CORNER_MID),
    inLayer(right - CORNER, bottom),
    inLayer(left + CORNER, bottom),
    inLayer(left + CORNER_MID, bottom - CORNER_MID),
    inLayer(left, bottom - CORNER),
    inLayer(left, box.top),
  ];
  const lit = parts.returnLit.getBoundingClientRect();
  return {
    stops,
    chevrons,
    litLeft,
    groundEnd: inLayer(groundBox.right - JOB_EXIT_INSET, 0).x,
    path,
    returnLeft: inLayer(lit.left, 0).x,
    returnWidth: lit.width,
  };
}

/** The share of a tween's duration at which `ease` reaches `progress` (0–1), by bisection. */
function crossTime(progress: number, ease: string): number {
  const curve = gsap.parseEase(ease);
  const target = Math.min(1, Math.max(0, progress));
  let low = 0;
  let high = 1;
  for (let i = 0; i < 24; i += 1) {
    const mid = (low + high) / 2;
    if (curve(mid) < target) low = mid;
    else high = mid;
  }
  return (low + high) / 2;
}

const distance = (a: Point, b: Point) => Math.hypot(b.x - a.x, b.y - a.y);

/** Seconds from a run's start at which the job reaches each stop (A1–A4), for `roles` in order. */
export function relayArrivals(roles: readonly BotRole[]): number[] {
  let t = RELAY_FADE;
  return roles.map((role) => {
    const arrival = t;
    t += RELAY_DWELL[role] + RELAY_HOP.duration;
    return arrival;
  });
}

/**
 * From `t`, when bot 4 is done with the job: the lesson splits off the sheet (`from` is the job's
 * anchor there), fades out leaving bot 4, drops in at R0 and rides the path to R7 at
 * `RETURN_SPEED`, lighting it, with no ghosts; at R7 the arrowhead flashes and the lesson pops out
 * as bot 1 takes the loop back.
 */
function rideReturn(
  tl: gsap.core.Timeline,
  parts: RelayParts,
  waypoints: () => RelayWaypoints,
  cues: RelayCues,
  from: PointAt,
  t: number,
) {
  const { lesson, returnLit, arrowhead, lights } = parts;
  const card = lesson.lesson;
  const path = waypoints().path;
  // The lesson's centre goes on the path line itself.
  const on = (j: number) => () => waypoints().path[j] ?? ORIGIN;
  const insetAt = (j: number) => () => (waypoints().path[j] ?? ORIGIN).x - waypoints().returnLeft - 2;
  const sheet = () => {
    const point = from();
    return { x: point.x, y: point.y - SHEET_CENTRE };
  };

  // Off the job, then off bot 4 (bot 1 hears it coming), then onto the path at R0.
  let at = lessonSplit(tl, card, sheet, t);
  tl.call(cues.head, [0], at);
  at = lessonLeave(tl, card, at);
  at = lessonEnter(tl, card, on(0), at);

  // R0 → R7, linear, each leg timed by its length; the light follows.
  returnLitStart(tl, returnLit, () => waypoints().returnWidth, at);
  for (let j = 1; j < path.length; j += 1) {
    const a = path[j - 1];
    const b = path[j];
    const to = on(j);
    const duration = a && b ? Math.max(distance(a, b) / RETURN_SPEED, 0.01) : 0.01;
    tl.to(card, { x: () => to().x, y: () => to().y, duration, ease: "none" }, at);
    returnLitTo(tl, returnLit, insetAt(j), duration, at);
    at += duration;
  }

  // At the arrowhead: the flash, the pop out, bot 1's catch of the loop.
  if (arrowhead) flash(tl, arrowhead, at, lights);
  returnLitFade(tl, returnLit, at);
  lessonOut(tl, card, at);
  tl.call(cues.receive, [0], at);
}

/** One relay run with the job (from `lg`). `waypoints` returns the latest measurement. */
export function relayRun(parts: RelayParts, waypoints: () => RelayWaypoints, cues: RelayCues): gsap.core.Timeline {
  const { job, lesson, ghosts, groundLit, icons, lights } = parts;
  const tl = gsap.timeline();
  const now = waypoints();
  const roles = parts.stops.map((stop) => stop.role);
  const count = Math.min(roles.length, now.stops.length);
  if (count === 0) return tl;
  const arrivals = relayArrivals(roles);
  const stop = (i: number) => () => waypoints().stops[i] ?? ORIGIN;
  const litX = (i: number) => () => stop(i)().x - waypoints().litLeft - LIT_LENGTH;

  // A fresh blank job at stop 1 (the lesson hidden); each bot catches and changes it, it waits a
  // moment, then hops on.
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
    litHop(tl, groundLit, litX(i), litX(next), t);
    const from = now.stops[i];
    const ahead = now.stops[next];
    const chevron = now.chevrons[i];
    const icon = icons[i];
    if (from && ahead && chevron && icon && ahead.x !== from.x) {
      flash(tl, icon, t + RELAY_HOP.duration * crossTime((chevron.x - from.x) / (ahead.x - from.x), RELAY_HOP.ease), lights);
    }
  }

  // Bot 4 is done. The job leaves right to the ground line's end, trailed as on a hop (the slide
  // timed by its length at setup), pops as done and fades there...
  const last = count - 1;
  const end = () => {
    const at = stop(last)();
    return { x: Math.max(at.x, waypoints().groundEnd), y: at.y };
  };
  const slide = Math.max(0, now.groundEnd - (now.stops[last]?.x ?? now.groundEnd)) / JOB_EXIT.speed;
  const exit = { duration: Math.max(JOB_EXIT.min, slide), ease: JOB_EXIT.ease };
  jobExit(tl, job.job, end, exit.duration, t);
  ghostHop(tl, ghosts, stop(last), end, t, exit);
  litHop(tl, groundLit, litX(last), () => end().x - waypoints().litLeft - LIT_LENGTH, t, exit);

  // ...while the lesson splits off it and rides the return path back to bot 1.
  rideReturn(tl, parts, waypoints, cues, stop(last), t);
  return tl;
}
