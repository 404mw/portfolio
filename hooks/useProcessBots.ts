// The process bots' smooth motion (ui-spec §5.6–5.7, §10), on the `[data-anim="process-bot"]` SVGs
// inside `section`. This hook only wires things up; the moves live in lib/:
//
// - lib/processBotRig.ts: each bot's hooks, pivots, summed channels and `resetBot`.
// - lib/processBotLife.ts: breathing, sway, drift, blinks, looks, foot taps.
// - lib/processBotActs.ts: role acts, jumps, the hover/tap reaction, naps.
// - lib/processBotEntrance.ts: the once-per-load drop onto the ground line.
// - lib/processBotPointer.ts: pointer → look and lean.
// - lib/processRelayPlan.ts: the relay's clock, which stop the job visits when (five or six stops,
//   and the fix hop on every `FIX_EVERY`-th run of a flow that draws the fix loop).
// - lib/processRelay.ts: the relay job run along the ground line (from `lg`; the shared story in
//   lib/processRelayRun.ts, the hand-off out of step 1's hand in lib/processRelayHand.ts, the job's
//   changes and exit in lib/processRelayJob.ts, the fix hop in lib/processRelayFix.ts, the lesson
//   that rides the return in lib/processRelayLesson.ts, its trail and lit lines in
//   lib/processRelayTrail.ts).
// - lib/processRelayColumn.ts: the same run down the bot column (below `lg`, ui-spec §5.9), hopping
//   ledge to ledge with each ledge and the dotted fix line lighting (lib/processRelayLedge.ts).
// - lib/processBotCrew.ts: the one registry every bot animation and scheduler runs in.
//
// Full motion: all of it. The registry and the per-frame channel writer run only while the section
// is on screen and the tab visible (`watchLive`); pointer events are ignored otherwise. Pointer
// follow needs a fine pointer too. Reduced motion: no movement at all; the entrance is an opacity
// fade only, and every bot shows its static pose. The entrance's from-state is set here in JS only,
// and skipped if the list is already scrolled past (once per page load, across matchMedia re-runs).
// On unmount, a new flow (`set`) or any mode change everything is killed and every bot, the job and
// its parts, the lesson and its parts, the ghosts, the lit overlays (ground, return and fix; below
// `lg` each ledge's and the fix line's), chevron
// icons and arrowhead go back to the server markup exactly: hidden again, with the emblem held in
// step 1's hand (it is a `data-bot` part, so `resetBot` shows it; the last bot's lesson hold is a
// bot act, so `resetBot` puts its eyes back too). Crossing `lg` is a mode change: the run in the
// old geometry is reverted and the new one starts on the usual first-run delay. A flow with no
// loops has no return and no fix parts: the relay still runs, as a one-way pass.
// Catch priority: the relay publishes each bot's next catches, so timed acts and naps keep clear of them.
//
// Tweens made later by handlers and schedulers are deliberately outside the matchMedia context (it
// would otherwise collect every tween the bots ever make); the registry and `resetBot` clean them up.
import { useRef, type RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { animTargets, duration, ease, finePointerQuery, motionQuery, stagger } from "@/lib/motion";
import { catchRelay, holdLesson, react, receive, startActs } from "@/lib/processBotActs";
import { createCrew, type Crew } from "@/lib/processBotCrew";
import { dropIn, hideForDrop } from "@/lib/processBotEntrance";
import { startLife, tap } from "@/lib/processBotLife";
import {
  DROP_START,
  EYE_FOLLOW,
  FIX_EVERY,
  FOLLOW_EASE,
  LEAN_FOLLOW,
  POINTER_IDLE,
  RELAY_FIRST,
  RELAY_ON,
  RELAY_REST,
  TAP_SLOP,
  TAP_TIME,
} from "@/lib/processBotMotion";
import { eyeCentre, pointerLean, pointerLook } from "@/lib/processBotPointer";
import { findBot, pointerShare, resetBot, rigBot, setState, stripMotion, type Bot } from "@/lib/processBotRig";
import {
  measureRelay,
  relayElements,
  relayParts,
  relayQuery,
  relayRun,
  type RelayStop,
  type RelayWaypoints,
} from "@/lib/processRelay";
import {
  columnBack,
  columnElements,
  columnParts,
  columnRun,
  measureColumn,
  type ColumnWaypoints,
} from "@/lib/processRelayColumn";
import { catchTimes, fixStop, relayPlan, type Visit } from "@/lib/processRelayPlan";
import type { RelayCues, RunOptions } from "@/lib/processRelayRun";
import { watchLive } from "@/lib/watchLive";

type Flag = { current: boolean };

type EntranceHandlers = {
  /** Set the from-state (the list is still below `DROP_START`). */
  readonly hide: () => void;
  /** The list reached `DROP_START`: play the entrance. */
  readonly play: () => void;
  /** Already passed (at setup, or on a later run): just show the bots. */
  readonly show: () => void;
};

const seconds = () => performance.now() / 1000;

/** The once-per-page-load entrance trigger on `list`. Returns its cleanup. */
function onceInView(list: HTMLElement, entered: Flag, handlers: EntranceHandlers): () => void {
  if (entered.current) {
    handlers.show();
    return () => {};
  }
  let setup = true;
  let fired = false;
  const fire = (skip: boolean) => {
    if (fired) return;
    fired = true;
    entered.current = true;
    if (skip) handlers.show();
    else handlers.play();
  };
  const trigger = ScrollTrigger.create({
    trigger: list,
    start: DROP_START,
    once: true,
    onEnter: () => fire(setup),
  });
  if (trigger.scroll() >= trigger.start) fire(true);
  setup = false;
  if (fired) {
    trigger.kill();
    return () => {};
  }
  handlers.hide();
  return () => trigger.kill();
}

/** Reduced motion: the bots fade in once, in their static pose; nothing moves. */
function fadeMotion(list: HTMLElement, bots: readonly Bot[], entered: Flag): () => void {
  const rigs = bots.map((bot) => bot.parts.rig);
  let fade: gsap.core.Tween | null = null;
  const stopEntrance = onceInView(list, entered, {
    hide: () => gsap.set(rigs, { opacity: 0 }),
    play: () => {
      fade = gsap.to(rigs, { opacity: 1, duration: duration.fade, ease: ease.out, stagger: stagger.row });
    },
    show: () => {},
  });
  return () => {
    stopEntrance();
    fade?.kill();
    stripMotion(rigs);
  };
}

type FullOptions = {
  readonly root: HTMLElement;
  readonly list: HTMLElement;
  readonly bots: readonly Bot[];
  readonly entered: Flag;
  /** The relay's geometry: along the ground line from `lg`, down the bot column below it. */
  readonly wide: boolean;
  /** A fine pointer: eyes and lean follow it, and hovering reacts. */
  readonly fine: boolean;
};

/** Pointer follow for every bot. Returns `measure` (cache the eye centres), `frame` and cleanup. */
function followPointer(bots: readonly Bot[], crew: Crew) {
  const eyes: { x: number; y: number }[] = [];
  const lookTo = bots.map((bot) => gsap.quickTo(bot.ch, "pointerLook", { duration: EYE_FOLLOW, ease: FOLLOW_EASE }));
  const leanTo = bots.map((bot) => gsap.quickTo(bot.ch, "lean", { duration: LEAN_FOLLOW, ease: FOLLOW_EASE }));
  let client: { x: number; y: number } | null = null;
  let lastMove = -Infinity;
  let active = false;
  let raf = 0;

  const measure = () => {
    bots.forEach((bot, i) => {
      eyes[i] = eyeCentre(bot.parts.svg.getBoundingClientRect(), window.scrollX, window.scrollY);
    });
  };

  const follow = () => {
    raf = 0;
    if (!client || !crew.isLive()) return;
    const x = client.x + window.scrollX;
    const y = client.y + window.scrollY;
    bots.forEach((bot, i) => {
      const eye = eyes[i];
      if (!eye) return;
      lookTo[i](pointerLook(x - eye.x, y - eye.y));
      leanTo[i](pointerLean(x - eye.x));
      if (!bot.pointer) {
        bot.pointer = true;
        crew.run(pointerShare(bot));
      }
    });
    active = true;
  };
  const request = () => {
    if (!raf) raf = requestAnimationFrame(follow);
  };

  /** Hands the eyes back to the bots' own looks and eases the lean to 0. */
  const release = () => {
    client = null;
    if (!active) return;
    active = false;
    bots.forEach((bot, i) => {
      bot.pointer = false;
      crew.run(pointerShare(bot));
      leanTo[i](0);
    });
  };

  const onMove = (event: PointerEvent) => {
    if (event.pointerType === "touch" || !crew.isLive()) return;
    client = { x: event.clientX, y: event.clientY };
    lastMove = seconds();
    request();
  };
  const onScroll = () => {
    if (active) request();
  };
  const onOut = (event: PointerEvent) => {
    if (!event.relatedTarget) release();
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("pointerout", onOut);

  return {
    measure,
    /** Per frame, while live: hand back after `POINTER_IDLE` without movement. */
    frame: () => {
      if (active && seconds() - lastMove > POINTER_IDLE) release();
    },
    stop: () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerout", onOut);
      if (raf) cancelAnimationFrame(raf);
      [...lookTo, ...leanTo].forEach((to) => to.tween.kill());
    },
  };
}

/** Hover (fine pointer) and tap reactions on each bot's SVG. Returns the cleanup. */
function listenForReactions(bots: readonly Bot[], crew: Crew, fine: boolean): () => void {
  const detach = bots.map((bot) => {
    const { svg } = bot.parts;
    let down: { id: number; x: number; y: number; at: number } | null = null;
    const onEnter = (event: PointerEvent) => {
      if (fine && event.pointerType !== "touch" && crew.isLive()) react(bot, crew);
    };
    const onDown = (event: PointerEvent) => {
      down = { id: event.pointerId, x: event.clientX, y: event.clientY, at: seconds() };
    };
    const onUp = (event: PointerEvent) => {
      const start = down;
      down = null;
      if (!start || start.id !== event.pointerId || !crew.isLive()) return;
      const moved = Math.hypot(event.clientX - start.x, event.clientY - start.y);
      if (moved < TAP_SLOP && seconds() - start.at < TAP_TIME) react(bot, crew);
    };
    const onCancel = () => {
      down = null;
    };
    svg.addEventListener("pointerenter", onEnter);
    svg.addEventListener("pointerdown", onDown);
    svg.addEventListener("pointerup", onUp);
    svg.addEventListener("pointercancel", onCancel);
    return () => {
      svg.removeEventListener("pointerenter", onEnter);
      svg.removeEventListener("pointerdown", onDown);
      svg.removeEventListener("pointerup", onUp);
      svg.removeEventListener("pointercancel", onCancel);
    };
  });
  return () => detach.forEach((off) => off());
}

/** Full motion: rigs, life, acts, entrance, reactions, pointer follow and the relay. */
function fullMotion({ root, list, bots, entered, wide, fine }: FullOptions): () => void {
  const crew = createCrew();
  bots.forEach(rigBot);

  // Pointer follow (fine pointer only) and the relay's parts, in the geometry the width picks.
  const pointer = fine ? followPointer(bots, crew) : null;
  const stops: RelayStop[] = bots.map((bot) => ({ svg: bot.parts.svg, role: bot.role }));
  // With the relay off (`RELAY_ON`) neither is built: no run starts and the catch clock is empty.
  const relay = RELAY_ON && wide ? relayParts(root, stops) : null;
  const column = RELAY_ON && !wide ? columnParts(root, stops) : null;
  let waypoints: RelayWaypoints | null = null;
  let columnWaypoints: ColumnWaypoints | null = null;
  const measure = () => {
    pointer?.measure();
    if (relay) waypoints = measureRelay(relay);
    if (column) columnWaypoints = measureColumn(column);
  };
  measure();
  const resize = new ResizeObserver(measure);
  resize.observe(list);
  ScrollTrigger.addEventListener("refresh", measure);

  // One writer per frame for every bot's summed channels, while live.
  const frame = () => {
    pointer?.frame();
    bots.forEach((bot) => bot.apply());
  };
  let ticking = false;
  const tick = (on: boolean) => {
    if (on === ticking) return;
    ticking = on;
    if (on) gsap.ticker.add(frame);
    else gsap.ticker.remove(frame);
  };
  const stopWatching = watchLive(root, (live) => {
    crew.setLive(live);
    tick(live);
  });

  // The relay's clock: the flow's stops in step order, and on every `FIX_EVERY`-th run (2, 4, 6…)
  // the fix hop, in a flow that draws the fix loop (never one with `data-loops="off"`).
  const roles = bots.map((bot) => bot.role);
  const fixAt = relay?.fix || column?.fixes ? fixStop(roles) : null;
  // The hop back's length is the geometry's: below `lg` the longer way along the dotted fix line.
  const back = column ? columnBack(column).duration : undefined;
  const planFor = (run: number): readonly Visit[] =>
    relayPlan(roles, fixAt !== null && run % FIX_EVERY === FIX_EVERY - 1 ? fixAt : null, back);

  // Catch priority: each bot's next catch is a run start plus one of its arrivals in that run's
  // plan (the work step and the check are caught twice on a fix run), on one clock at every width.
  const running = relay !== null || column !== null;
  let runs = 0;
  let runAt = -Infinity;
  let nextRunAt = Infinity;
  let catches: readonly (readonly number[])[] = [];
  let nextCatches = running ? catchTimes(planFor(0), bots.length) : [];
  const untilCatch = (bot: Bot) => {
    const i = bots.indexOf(bot);
    const now = crew.now();
    const due = [
      ...(catches[i] ?? []).map((arrival) => runAt + arrival),
      ...(nextCatches[i] ?? []).map((arrival) => nextRunAt + arrival),
    ].find((at) => at >= now);
    return due === undefined ? Infinity : due - now;
  };

  // The relay, once all the bots have landed: along the ground line from `lg`, down the bot column
  // below it. Runs differ in length, so the next one starts `RELAY_REST` after this one ends.
  let relayTimer: gsap.core.Tween | null = null;
  let relayPlaying: gsap.core.Timeline | null = null;
  const cues: RelayCues = {
    head: (i) => bots[i] && tap(bots[i], crew),
    arrive: (i, kind, dwell) => bots[i] && catchRelay(bots[i], crew, 1, kind, dwell),
    receive: (i) => bots[i] && receive(bots[i], crew),
    holdLesson: (i, seconds) => bots[i] && holdLesson(bots[i], crew, seconds),
  };
  /** One run in this width's geometry, or null if its waypoints aren't measured yet. */
  const oneRun = (options: RunOptions): gsap.core.Timeline | null => {
    const latest = waypoints;
    if (relay && latest) return relayRun(relay, () => waypoints ?? latest, cues, options);
    const latestColumn = columnWaypoints;
    if (column && latestColumn) return columnRun(column, () => columnWaypoints ?? latestColumn, cues, options);
    return null;
  };
  const runRelay = () => {
    relayPlaying?.kill();
    const visits = planFor(runs);
    const run = oneRun({ visits, first: runs === 0 });
    if (run) {
      // The plan counts only for a run that plays: the fix hop falls on every second real run.
      runAt = crew.now();
      catches = catchTimes(visits, bots.length);
      runs += 1;
      nextCatches = catchTimes(planFor(runs), bots.length);
    }
    relayPlaying = run ? crew.run(run) : null;
    const wait = (run?.duration() ?? 0) + RELAY_REST;
    nextRunAt = crew.now() + wait;
    relayTimer = crew.after(wait, runRelay);
  };
  const startRelay = () => {
    if (!running) return;
    relayTimer?.kill();
    nextRunAt = crew.now() + RELAY_FIRST;
    relayTimer = crew.after(RELAY_FIRST, runRelay);
  };

  // The entrance, then life and acts per bot.
  const land = (bot: Bot) => startLife(bot, crew);
  const settle = (bot: Bot) => {
    crew.run(setState(bot, "idle"));
    startActs(bot, crew, untilCatch);
  };
  let drop: gsap.core.Timeline | null = null;
  const stopEntrance = onceInView(list, entered, {
    hide: () => bots.forEach(hideForDrop),
    play: () => {
      drop = dropIn(bots, { land, settle, done: startRelay });
    },
    show: () => {
      bots.forEach((bot) => {
        land(bot);
        settle(bot);
      });
      startRelay();
    },
  });

  const stopReactions = listenForReactions(bots, crew, fine);

  return () => {
    stopWatching();
    stopEntrance();
    stopReactions();
    pointer?.stop();
    resize.disconnect();
    ScrollTrigger.removeEventListener("refresh", measure);
    tick(false);
    drop?.kill();
    crew.kill();
    bots.forEach(resetBot);
    if (relay) stripMotion(relayElements(relay));
    if (column) stripMotion(columnElements(column));
  };
}

/**
 * `set` is the flow the section shows (ui-spec §5.7 wiring 6): a change remounts the bots, so the
 * hook lets go of the old ones and rigs the new ones. `entered` is already true by then, so they
 * are shown at rest and life starts: no second drop-in.
 */
export function useProcessBots(section: RefObject<HTMLElement | null>, set: string) {
  // Once per page load: survives matchMedia re-runs (resizing across `lg`, switching motion).
  const entered = useRef(false);

  useGSAP(
    () => {
      const root = section.current;
      if (!root) return;
      const [list] = animTargets(root, "process-list");
      const bots = animTargets<SVGSVGElement>(root, "process-bot")
        .map(findBot)
        .filter((bot): bot is Bot => bot !== null);
      if (!list || bots.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add(
        { full: motionQuery.full, reduced: motionQuery.reduced, wide: relayQuery, fine: finePointerQuery },
        (context) => {
          const { full = false, wide = false, fine = false } = context.conditions ?? {};
          return full
            ? fullMotion({ root, list, bots, entered, wide, fine })
            : fadeMotion(list, bots, entered);
        },
      );

      return () => mm.revert();
    },
    { scope: section, dependencies: [set], revertOnUpdate: true },
  );
}
