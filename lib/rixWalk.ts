// Rix's walk along the shelf (ui-spec/00-rix.md R4), full motion, character sheet only: one leg to a
// walker `x` (R4.1, clamped to the shelf and to the pace's `maxDist`), stride-locked by the gait
// (R4.2, lib/rixGait.ts) and stepped by lib/rixStep.ts, facing by the eyes and the lean, never a
// mirror (R4.4), the start and stop (R4.6), and target changes mid-leg (R4.5): the same way runs on
// from the next foot plant with no start step; the other way is a turn (brake, eyes across, squash,
// the lean flips, a fresh leg). At a card's stop the caller's hover mode takes him over (R4.9) if
// the card's target still holds; if not he glances at it, `curious`, and lets go. A cut brakes a
// walk where it is (lib/rixActs.ts `cut`). The walker is the walk's only writer; a cut never resets
// it. There's no dash: every pace has its own step.
import type { gsap } from "@/lib/gsap";
import { ANTICIPATE, SETTLE, SQUASH } from "@/lib/processBotMotion";
import { cut, feet, play, releaseHold, timeline } from "@/lib/rixActs";
import { emotionIn } from "@/lib/rixEmote";
import { gaitFor } from "@/lib/rixGait";
import {
  CURIOUS_GLANCE,
  LOOK_BACK,
  TALK,
  WALK,
  WALK_PACE,
  WALK_START,
  WALK_STOP,
  WALK_TURN,
  type Pace,
} from "@/lib/rixMotion";
import { propFor, type Rix, type RixAct } from "@/lib/rixRig";
import { addSteps, type Foot, type Plant } from "@/lib/rixStep";
import { lookAt, sideOf } from "@/lib/rixTargets";
import { clampX, measureTrack, type Track } from "@/lib/rixTrack";

export type WalkOptions = {
  /** The leg's pace; the walk's own by default. */
  readonly pace?: Pace;
  /** The card he's walking toward: he stops looking at it (over it, or partway). */
  readonly card?: Element | null;
  /** At the card's stop: hands him to hover mode (R4.9); false if it didn't take him (a `curious` glance instead). */
  readonly hover?: (card: Element) => boolean;
  /** The flee (R6A.5): no cut first (the angry pose rides along), a plain brake, then `onArrive`. */
  readonly flee?: boolean;
  /** The act it plays as (`walk`; the flee is part of the `tantrum`; a stretch is the `patrol`). */
  readonly act?: RixAct;
  /** Called as he stops. */
  readonly onArrive?: () => void;
};

/** The leg under way, so a retarget can run on from its next plant. */
type Leg = {
  readonly tl: gsap.core.Timeline;
  readonly dir: -1 | 1;
  readonly plants: readonly Plant[];
  /** The stop step's end (seconds into `tl`) and the walker's `x` there. */
  readonly end: number;
  readonly x: number;
};

/** Where a leg starts: the walker's `x`, the feet's spread and the foot that swings first. */
type Start = { readonly x: number; readonly spread: number; readonly swing: Foot };

const legs = new WeakMap<Rix, Leg>();

const carrying = (rix: Rix) => rix.picked !== null && propFor(rix, rix.picked) !== undefined;

/** `x` clamped to the shelf and to the pace's `maxDist` from `from`. */
function aim(track: Track, x: number, from: number, pace: Pace): number {
  const to = clampX(track, x);
  if (pace.maxDist === undefined || Math.abs(to - from) <= pace.maxDist) return to;
  return from + Math.sign(to - from) * pace.maxDist;
}

/**
 * The stop (R4.6): a squash and settle, the lean overshoots and comes back (to curious's tilt, set
 * by the stop, when he stops at a card), the arms and eyes back to rest. The feet are already
 * together: the stop step brought them in.
 */
function stop(rix: Rix, tl: gsap.core.Timeline, at: number, dir: -1 | 1, atCard: boolean) {
  const { parts, ch, restLook } = rix.bot;
  tl.call(
    () => {
      rix.walkDir = 0;
      legs.delete(rix);
    },
    [],
    at,
  )
    .to(feet(rix.bot), { x: 0, y: 0, duration: WALK_STOP.feet, ease: "power2.out" }, at)
    .to(parts.upper, { ...SQUASH, y: 0, duration: WALK_STOP.squash, ease: "power2.out" }, at)
    .to(parts.upper, { scaleX: 1, scaleY: 1, ...SETTLE }, at + WALK_STOP.squash)
    .to(rix.bot.ch, { tilt: -dir * WALK_STOP.overshoot, duration: WALK_STOP.overshootTime, ease: "power2.out" }, at)
    .to(ch, { actL: 0, actR: 0, mixL: 1, mixR: 1, ...WALK_STOP.back }, at);
  if (atCard) return;
  tl.to(ch, { tilt: 0, ...WALK_STOP.back }, at + WALK_STOP.overshootTime).to(ch, { look: restLook, perp: 0, ...LOOK_BACK }, at);
}

/** The flee's stop (R6A.5): a squash and settle that outlive the act; no overshoot. */
function fleeStop(rix: Rix, tl: gsap.core.Timeline, at: number, onArrive?: () => void) {
  const { parts, ch } = rix.bot;
  tl.call(
    () => {
      rix.walkDir = 0;
      legs.delete(rix);
      rix.crew.run(
        timeline()
          .to(feet(rix.bot), { x: 0, y: 0, ...WALK_STOP.brake }, 0)
          .to(ch, { tilt: 0, ...WALK_STOP.brake }, 0)
          .to(parts.upper, { ...SQUASH, y: 0, duration: WALK_STOP.squash, ease: "power2.out" }, 0)
          .to(parts.upper, { scaleX: 1, scaleY: 1, ...SETTLE }, WALK_STOP.squash),
      );
      onArrive?.();
    },
    [],
    at,
  );
}

/** Curious at a card nobody holds (R4.6, after a pick's walk): a glance, then he lets go. */
function glanceCurious(rix: Rix, card: Element) {
  rix.crew.run(emotionIn(rix, "curious", { look: lookAt(rix, [card]), side: sideOf(rix, card) }));
  rix.hold = "curious";
  rix.crew.after(CURIOUS_GLANCE, () => {
    if (rix.hold === "curious" && rix.hovering === null) releaseHold(rix);
  });
}

/**
 * Builds and plays one leg from `start` to `to` (`dir`), its steps from `at`. `lead` is how the leg
 * begins: `fresh` (the eyes lead and an anticipation), `turn` (brake, eyes across, squash) or `on`
 * (running on from a plant: nothing, the feet are already apart).
 */
function leg(
  rix: Rix,
  tl: gsap.core.Timeline,
  start: Start,
  to: number,
  dir: -1 | 1,
  pace: Pace,
  lead: "fresh" | "turn" | "on",
  at: number,
  options: WalkOptions,
): gsap.core.Timeline {
  const { bot } = rix;
  const { parts, ch } = bot;
  const act = options.act ?? "walk";
  const face = { look: dir * WALK.face.d, perp: dir * WALK.face.p };
  let begin = at;
  if (lead === "turn") {
    tl.to(ch, { ...face, ...WALK_TURN.eyes }, at)
      .to(parts.upper, { ...SQUASH, duration: WALK_TURN.squash, ease: "power2.out" }, at)
      .to(parts.upper, { scaleX: 1, scaleY: 1, duration: 0.09, ease: "power2.out" }, at + WALK_TURN.squash)
      .to(ch, { tilt: dir * pace.lean, ...WALK_TURN.eyes }, at);
    begin = at + WALK_TURN.eyes.duration;
  } else if (lead === "fresh") {
    tl.to(ch, { ...face, ...WALK_TURN.eyes }, at)
      .to(parts.upper, { ...ANTICIPATE, duration: WALK_START.anticipate, ease: "power2.out" }, at)
      .to(parts.upper, { scaleX: 1, scaleY: 1, duration: 0.1, ease: "power2.out" }, at + WALK_START.anticipate)
      .to(ch, { tilt: dir * pace.lean, duration: 0.15, ease: "power2.out" }, at);
    begin = at + WALK_START.faceLead;
  }
  rix.walkDir = dir;
  const width = measureTrack(rix).width;
  const gait = gaitFor(Math.abs(to - start.x), width, pace, start.spread);
  const plants = addSteps(rix, tl, begin, gait, { x: start.x, dir, pace, carrying: carrying(rix), swing: start.swing });
  const end = begin + gait.duration;
  legs.set(rix, { tl, dir, plants, end, x: to });

  if (options.flee) {
    fleeStop(rix, tl, end, options.onArrive);
  } else {
    const { card, hover } = options;
    stop(rix, tl, end, dir, Boolean(card));
    tl.call(
      () => {
        options.onArrive?.();
        if (card && !(hover?.(card) ?? false)) glanceCurious(rix, card);
      },
      [],
      end + WALK_STOP.overshootTime,
    );
  }
  play(rix, tl, act);
  return tl;
}

/**
 * Walks Rix toward walker `x` (clamped to the shelf, and to the pace's `maxDist`). Returns the
 * leg's timeline, or null if he's already within `WALK.minDist` of it (he only looks).
 */
export function walkTo(rix: Rix, x: number, options: WalkOptions = {}): gsap.core.Timeline | null {
  const { bot } = rix;
  const pace = options.pace ?? WALK_PACE;
  const act = options.act ?? "walk";
  const track = measureTrack(rix);
  const current = legs.get(rix);
  const continuing = rix.act === act && rix.walkDir !== 0 && current !== undefined && bot.busy === current.tl;

  // Same way (R4.5): the leg under way ends at its next plant and a new one runs on from there.
  if (continuing && current) {
    const now = current.tl.time();
    const plant = current.plants.find((each) => each.time > now + 1e-3);
    const from = plant?.x ?? current.x;
    const to = aim(track, x, from, pace);
    const dir: -1 | 1 = to < from ? -1 : 1;
    if (dir === current.dir && Math.abs(to - from) >= (plant ? 0 : WALK.minDist)) {
      rix.quipOut(TALK.walkOut);
      const handOver = () => {
        current.tl.kill();
        const tl = timeline();
        const start: Start = plant ? { x: plant.x, spread: plant.spread, swing: plant.swing } : { x: from, spread: 0, swing: "left" };
        leg(rix, tl, start, to, dir, pace, plant ? "on" : "fresh", 0, options);
      };
      current.tl.call(handOver, [], plant?.time ?? current.end);
      return current.tl;
    }
  }

  // A brake first if he's moving (a turn, or a cut of a stretch): it carries him `brakeSlide` on.
  const moving = rix.walkDir;
  const fromX = moving !== 0 ? clampX(track, track.x + moving * WALK_STOP.brakeSlide) : track.x;
  const to = aim(track, x, fromX, pace);
  if (Math.abs(to - fromX) < WALK.minDist) return null;
  const dir: -1 | 1 = to < fromX ? -1 : 1;
  const turning = continuing && moving !== dir;

  const tl = timeline();
  let at = 0;
  if (turning || options.flee) {
    bot.busy?.kill();
    bot.busy = null;
    if (turning) {
      tl.to(rix.walker, { x: fromX, ...WALK_STOP.brake }, 0).to(feet(bot), { x: 0, y: 0, ...WALK_STOP.brake }, 0);
      at = WALK_STOP.brake.duration;
    }
  } else {
    const settle = cut(rix);
    if (settle) tl.add(settle, 0);
    if (moving !== 0) at = WALK_STOP.brake.duration;
  }
  rix.quipOut(TALK.walkOut);
  return leg(rix, tl, { x: fromX, spread: 0, swing: "left" }, to, dir, pace, turning ? "turn" : "fresh", at, options);
}
