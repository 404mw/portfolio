// The crew relay from `wide` (ui-spec §5.7 "the relay's rebuild", §5.3, §5.3a, §5.3b), on the flow's
// five or six stops. The job (the flow's emblem, or the default sheet) leaves step 1's hand
// (lib/processRelayHand.ts), drops onto the ground line and is passed along it from bot to bot, in
// front of them: each bot catches it at its stop and changes it on a beat of its act
// (lib/processRelayJob.ts), and on each hop a trail of ghosts, a lit ground segment and a chevron
// flash follow it (lib/processRelayTrail.ts). On a fix run the check sends it back over the fix
// arch to the work step (step 4) and takes it again (lib/processRelayFix.ts). On a send run the
// flag bot (step 3) sends it to a person: it climbs the hand-off stem and fades behind the label as
// the stem lights (lib/processRelayHandoff.ts), and the run ends there. After the last bot's change
// the job is done: it slides right to the ground line's end, trailed as on a hop, pops once and
// fades out there (never past the line, so never a sideways scroll).
//
// In a flow with the return, a small lesson card splits off the job at that moment
// (lib/processRelayLesson.ts), fades out leaving the last bot, drops in at the dashed return path's
// right end (below the steps' text, never across it) and rides the path back, lighting it violet,
// passing behind the loop label, with no ghosts; at the arrowhead, on step 2's end, it pops out as
// the arrowhead flashes and the rules bot takes it. A flow with no loops (`data-loops="off"`) has
// no return path and no fix arch in its markup: their absence means "skip those parts", so its run
// is a one-way pass that ends with the job's fade. Below `wide` the same run turns down the bot
// column (lib/processRelayColumn.ts, ui-spec §5.9).
//
// Waypoints are measured from the DOM relative to the relay layer (its box is the body wrapper's;
// the job, ghosts and lesson sit in it). They're read through a getter, so a re-measure after a
// resize reaches every tween that hasn't started yet. The bots' side of the story comes in through
// `cues`; the order and timing of the stops is the plan's (lib/processRelayPlan.ts).
import { gsap } from "@/lib/gsap";
import { animTargets } from "@/lib/motion";
import type { BotRole } from "@/lib/processBots";
import {
  FIX_HOP,
  JOB_AT,
  JOB_DONE,
  JOB_EXIT,
  JOB_EXIT_INSET,
  JOB_HAND_OFF,
  LIT_LENGTH,
  RELAY_HOP,
  RETURN_SPEED,
} from "@/lib/processBotMotion";
import { BOT_VIEWBOX } from "@/lib/processBotPointer";
import { arc, fixLitFade, fixLitSweep } from "@/lib/processRelayFix";
import { findProp, handArrive, handOff, measureHand, type Hand } from "@/lib/processRelayHand";
import {
  findJob,
  jobElements,
  jobExit,
  measureJob,
  type JobParts,
  type JobSize,
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
import { climbStem, findStem, measureStem, type StemParts, type StemWaypoints } from "@/lib/processRelayHandoff";
import { lessonTaker } from "@/lib/processRelayPlan";
import { runVisits, type Course, type RelayCues, type RunOptions } from "@/lib/processRelayRun";
import {
  flash,
  ghostFollow,
  litHop,
  readLights,
  returnLitFade,
  returnLitStart,
  returnLitTo,
  straight,
  type Lights,
  type Mover,
} from "@/lib/processRelayTrail";

/**
 * The `wide` breakpoint (`--breakpoint-wide`, 90rem, 1440px): the ground line, chevrons, return
 * path and fix arch show from here, and the relay runs along them; below it the relay runs down
 * the bot column instead (lib/processRelayColumn.ts).
 */
export const relayQuery = "(min-width: 90rem)";

/** The return path's corner radius (16px) and its 45° point's inset, 16 × (1 − cos 45°). */
const CORNER = 16;
const CORNER_MID = CORNER * (1 - Math.SQRT1_2);
const ORIGIN: Point = { x: 0, y: 0 };

/** A bot the job stops at: its SVG and role, in step order. */
export type RelayStop = { readonly svg: SVGSVGElement; readonly role: BotRole };

/** The return's elements: only in a flow with loops. */
type ReturnParts = {
  /** The dashed path's box (`process-return`), step 2's bot to the last one's. */
  readonly box: HTMLElement;
  readonly lit: HTMLElement;
  /** The arrowhead on step 2's end (the box's first child). */
  readonly arrowhead: Element | null;
  /** The rule card that rides the path after the last bot. */
  readonly lesson: LessonParts;
};

/** The fix loop's elements: only in a flow with loops. */
type FixParts = {
  /** The dashed arch's box (`process-fix`), read for its place only: never written. */
  readonly box: HTMLElement;
  readonly lit: HTMLElement;
};

export type RelayParts = {
  /** The relay layer (the job's parent), every waypoint's coordinate box. */
  readonly layer: HTMLElement;
  readonly job: JobParts;
  readonly ghosts: readonly Element[];
  readonly ground: HTMLElement;
  readonly groundLit: HTMLElement;
  /** The ground-lit segment's clip box (the ground line's box). */
  readonly groundClip: HTMLElement;
  readonly stops: readonly RelayStop[];
  /** Intake's held emblem (`data-bot="prop"`), or null. */
  readonly prop: SVGGElement | null;
  /** The icon inside each chevron span (the span masks the line, so it stays put). */
  readonly icons: readonly Element[];
  /** The flash colours, read from the tokens at setup. */
  readonly lights: Lights | null;
  /** The return, or null in a flow with no loops: then there is no lesson and no ride back. */
  readonly back: ReturnParts | null;
  /** The fix arch, or null in a flow with no loops: then no run is a fix run. */
  readonly fix: FixParts | null;
  /** The hand-off stem, or null in a flow with no loops: then no run is a send run. */
  readonly handoff: StemParts | null;
};

/** Every waypoint, in the relay layer's coordinates. */
export type RelayWaypoints = {
  /** Each bot's stop: stop 1's is the hand at rest, the others the job's bottom centre on the ground line. */
  readonly stops: readonly Point[];
  readonly hand: Hand;
  readonly job: JobSize;
  /** The chevron centres. */
  readonly chevrons: readonly Point[];
  /** The ground-lit clip box's left edge. */
  readonly litLeft: number;
  /** Where the job's exit slide stops: inside the ground line's right end, by its inset. */
  readonly groundEnd: number;
  readonly back: {
    /** R0–R7, on the path's centre line: down the right side, round the corners, along the bottom, up to the arrowhead. */
    readonly path: readonly Point[];
    /** The return-lit overlay's left edge and width. */
    readonly left: number;
    readonly width: number;
  } | null;
  readonly fix: {
    /** The job's anchor `y` at the top of the hop back: hanging inside the arch. */
    readonly apex: number;
    /** The fix-lit overlay's left edge. */
    readonly left: number;
  } | null;
  /** The hand-off stem, or null with none. */
  readonly handoff: StemWaypoints | null;
};

/**
 * The relay's elements inside `root`, or null if the job, its layer or the ground line is missing.
 * The return's and the fix arch's parts are each all there or left out.
 */
export function relayParts(root: HTMLElement, stops: readonly RelayStop[]): RelayParts | null {
  const [job] = animTargets<SVGSVGElement>(root, "process-relay");
  const [ground] = animTargets(root, "process-ground");
  const [groundLit] = animTargets(root, "process-ground-lit");
  const layer = job?.parentElement;
  const groundClip = groundLit?.parentElement;
  if (!job || !ground || !groundLit || !layer || !groundClip) return null;

  const [lesson] = animTargets<SVGSVGElement>(root, "process-lesson");
  const [returnBox] = animTargets(root, "process-return");
  const [returnLit] = animTargets(root, "process-return-lit");
  const [fixBox] = animTargets(root, "process-fix");
  const [fixLit] = animTargets(root, "process-fix-lit");
  return {
    layer,
    job: findJob(job),
    ghosts: animTargets(layer, "process-relay-ghost"),
    ground,
    groundLit,
    groundClip,
    stops,
    prop: findProp(stops[0]),
    icons: animTargets(root, "process-chevron")
      .map((chevron) => chevron.firstElementChild)
      .filter((icon): icon is Element => icon !== null),
    lights: readLights(),
    back:
      lesson && returnBox && returnLit
        ? { box: returnBox, lit: returnLit, arrowhead: returnBox.firstElementChild, lesson: findLesson(lesson) }
        : null,
    fix: fixBox && fixLit ? { box: fixBox, lit: fixLit } : null,
    handoff: findStem(root),
  };
}

/** Every element the relay writes, for the strip on revert (the held emblem is the bot's to reset). */
export function relayElements(parts: RelayParts): Element[] {
  const { back, fix, handoff } = parts;
  return [
    ...jobElements(parts.job),
    ...parts.ghosts,
    parts.groundLit,
    ...parts.icons,
    ...(back ? [...lessonElements(back.lesson), back.lit] : []),
    ...(back?.arrowhead ? [back.arrowhead] : []),
    ...(fix ? [fix.lit] : []),
    ...(handoff ? [handoff.lit] : []),
  ];
}

/** Measures every waypoint. Layout reads only; call on setup and resize. */
export function measureRelay(parts: RelayParts): RelayWaypoints {
  const layer = parts.layer.getBoundingClientRect();
  const inLayer = (x: number, y: number): Point => ({ x: x - layer.left, y: y - layer.top });
  const shareX = (x: number) => (x - BOT_VIEWBOX.x) / BOT_VIEWBOX.width;

  const job = measureJob(parts.job);
  const first = parts.stops[0];
  const groundBox = parts.ground.getBoundingClientRect();
  const ground = (stop: RelayStop) => {
    const box = stop.svg.getBoundingClientRect();
    return inLayer(box.left + shareX(JOB_AT[stop.role]) * box.width, groundBox.top);
  };
  // With no held emblem the job starts on the ground at stop 1, at its own size.
  const hand: Hand =
    parts.prop && first ? measureHand(first.svg, job, layer) : { ...(first ? ground(first) : ORIGIN), scale: 1 };
  const stops = parts.stops.map((stop, i) => (i === 0 ? { x: hand.x, y: hand.y } : ground(stop)));

  const chevrons = parts.icons.map((icon) => {
    const box = (icon.parentElement ?? icon).getBoundingClientRect();
    return inLayer(box.left + box.width / 2, box.top + box.height / 2);
  });
  const litLeft = inLayer(parts.groundClip.getBoundingClientRect().left, 0).x;
  // The job's half width at the done pop's peak stays on the line.
  const inset = Math.max(JOB_EXIT_INSET, Math.ceil((job.width / 2) * JOB_DONE.scale));

  return {
    stops,
    hand,
    job,
    chevrons,
    litLeft,
    groundEnd: inLayer(groundBox.right - inset, 0).x,
    back: parts.back ? measureReturn(parts.back, inLayer) : null,
    fix: parts.fix
      ? {
          apex: inLayer(0, parts.fix.box.getBoundingClientRect().top).y + FIX_HOP.clear + job.height,
          left: inLayer(parts.fix.lit.getBoundingClientRect().left, 0).x,
        }
      : null,
    handoff: parts.handoff ? measureStem(parts.handoff, layer) : null,
  };
}

/** The return path's waypoints and its lit overlay's box. */
function measureReturn(back: ReturnParts, inLayer: (x: number, y: number) => Point) {
  const box = back.box.getBoundingClientRect();
  const right = box.right - 1;
  const left = box.left + 1;
  const bottom = box.bottom - 1;
  const lit = back.lit.getBoundingClientRect();
  return {
    path: [
      inLayer(right, box.top),
      inLayer(right, bottom - CORNER),
      inLayer(right - CORNER_MID, bottom - CORNER_MID),
      inLayer(right - CORNER, bottom),
      inLayer(left + CORNER, bottom),
      inLayer(left + CORNER_MID, bottom - CORNER_MID),
      inLayer(left, bottom - CORNER),
      inLayer(left, box.top),
    ],
    left: inLayer(lit.left, 0).x,
    width: lit.width,
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

/**
 * The hand-off's move: across to `to` on the hop's timing while it drops onto the ground line
 * early (`JOB_HAND_OFF`), so it is on the line well before the next bot.
 */
function dropTo(tl: gsap.core.Timeline, to: PointAt): Mover {
  return (target, at) => {
    tl.to(target, { x: () => to().x, ...RELAY_HOP }, at).to(target, { y: () => to().y, ...JOB_HAND_OFF }, at);
  };
}

/**
 * From `t`, when the last bot is done with the job: the lesson splits off the job (`from` is the
 * job's anchor there), fades out leaving the bot, drops in at R0 and rides the path to R7 at
 * `RETURN_SPEED`, lighting it, with no ghosts; at R7 the arrowhead flashes and the lesson pops out
 * as the rules bot takes the loop back.
 */
function rideReturn(
  tl: gsap.core.Timeline,
  parts: RelayParts,
  back: ReturnParts,
  waypoints: () => RelayWaypoints,
  cues: RelayCues,
  from: PointAt,
  t: number,
) {
  const card = back.lesson.lesson;
  const path = waypoints().back?.path ?? [];
  const takes = lessonTaker(parts.stops.map((stop) => stop.role));
  // The lesson's centre goes on the path line itself.
  const on = (j: number) => () => waypoints().back?.path[j] ?? ORIGIN;
  const insetAt = (j: number) => () => on(j)().x - (waypoints().back?.left ?? 0) - 2;
  const centre = () => {
    const point = from();
    return { x: point.x, y: point.y - waypoints().job.centre };
  };

  // Off the job, then off the last bot (the rules bot hears it coming), then onto the path at R0.
  let at = lessonSplit(tl, card, centre, t);
  tl.call(cues.head, [takes], at);
  at = lessonLeave(tl, card, at);
  at = lessonEnter(tl, card, on(0), at);

  // R0 → R7, linear, each leg timed by its length; the light follows.
  returnLitStart(tl, back.lit, () => waypoints().back?.width ?? 0, at);
  for (let j = 1; j < path.length; j += 1) {
    const a = path[j - 1];
    const b = path[j];
    const to = on(j);
    const duration = a && b ? Math.max(distance(a, b) / RETURN_SPEED, 0.01) : 0.01;
    tl.to(card, { x: () => to().x, y: () => to().y, duration, ease: "none" }, at);
    returnLitTo(tl, back.lit, insetAt(j), duration, at);
    at += duration;
  }

  // At the arrowhead: the flash, the pop out, the rules bot's catch of the loop.
  if (back.arrowhead) flash(tl, back.arrowhead, at, parts.lights);
  returnLitFade(tl, back.lit, at);
  lessonOut(tl, card, at);
  tl.call(cues.receive, [takes], at);
}

/** One relay run with the job (from `wide`). `waypoints` returns the latest measurement. */
export function relayRun(
  parts: RelayParts,
  waypoints: () => RelayWaypoints,
  cues: RelayCues,
  { visits, first }: RunOptions,
): gsap.core.Timeline {
  const { job, ghosts, groundLit, icons, lights, back, fix } = parts;
  const tl = gsap.timeline();
  const now = waypoints();
  if (visits.length < 2 || now.stops.length < 2) return tl;
  const stop = (i: number) => () => waypoints().stops[i] ?? ORIGIN;
  const litX = (at: PointAt) => () => at().x - waypoints().litLeft - LIT_LENGTH;

  // A new job in intake's hand (the lesson hidden); each bot catches and changes it, then it hops on.
  handArrive(tl, parts.prop, first, 0);
  if (back) lessonHide(tl, back.lesson.lesson, 0);

  const course: Course = {
    stop,
    hop: ({ from, to, kind }, t) => {
      const target = stop(to);
      if (kind === "back") {
        // The fix hop: back over the arch, the arch lighting behind it. No ground light, no chevron.
        const fixLeft = () => waypoints().fix?.left ?? 0;
        const move = fix ? arc(tl, target, () => waypoints().fix?.apex ?? target().y) : straight(tl, target, FIX_HOP);
        move(job.job, t);
        ghostFollow(tl, ghosts, stop(from), move, FIX_HOP.duration, t);
        if (fix) fixLitSweep(tl, fix.lit, () => stop(from)().x - fixLeft(), () => target().x - fixLeft(), t);
        return;
      }

      // Out of the hand (read live, dropping onto the line) or along the ground line.
      const start = kind === "hand" ? handOff(tl, parts, waypoints, t) : stop(from);
      const move = kind === "hand" ? dropTo(tl, target) : straight(tl, target);
      if (kind === "retry" && fix) fixLitFade(tl, fix.lit, t);
      move(job.job, t);
      ghostFollow(tl, ghosts, start, move, RELAY_HOP.duration, t);
      litHop(tl, groundLit, litX(start), litX(target), t);
      const a = now.stops[from];
      const b = now.stops[to];
      const chevron = now.chevrons[from];
      const icon = icons[from];
      if (to === from + 1 && a && b && chevron && icon && b.x !== a.x) {
        const crossing = crossTime((chevron.x - a.x) / (b.x - a.x), RELAY_HOP.ease);
        flash(tl, icon, t + RELAY_HOP.duration * crossing, lights);
      }
    },
  };
  const last = runVisits(tl, job, visits, cues, course);
  if (!last) return tl;

  // A send: the flag bot sends the job to a person, up the stem; the run ends there.
  const sent = last.kind === "send" ? parts.handoff : null;
  const sentFrom = now.stops[last.stop];
  if (sent && now.handoff && sentFrom) {
    const fromStop = stop(last.stop);
    const at = { from: sentFrom, stem: now.handoff, size: now.job };
    climbStem(tl, job.job, ghosts, sent.lit, fromStop, () => waypoints().handoff, () => waypoints().job, at, last.leave);
    return tl;
  }

  // The last bot is done. The job leaves right to the ground line's end, trailed as on a hop (the
  // slide timed by its length at setup), pops as done and fades there...
  const t = last.leave;
  const from = stop(last.stop);
  const end = () => {
    const at = from();
    return { x: Math.max(at.x, waypoints().groundEnd), y: at.y };
  };
  const slide = Math.max(0, now.groundEnd - (now.stops[last.stop]?.x ?? now.groundEnd)) / JOB_EXIT.speed;
  const exit = { duration: Math.max(JOB_EXIT.min, slide), ease: JOB_EXIT.ease };
  jobExit(tl, job.job, end, exit.duration, t);
  ghostFollow(tl, ghosts, from, straight(tl, end, exit), exit.duration, t);
  litHop(tl, groundLit, litX(from), litX(end), t, exit);

  // ...while, in a flow with the return, the lesson splits off it and rides the path back to step 2.
  if (back && now.back) rideReturn(tl, parts, back, waypoints, cues, from, t);
  return tl;
}
