// Rix's gait (ui-spec/00-rix.md R4.2): turns one leg's distance into stride-locked steps, so the
// feet never skate. 1 unit = box width ÷ 170; a stride is 2 × `footReach` units. A leg of D px is
// n = max(1, round(D ÷ stride)) strides at a reach r = D ÷ (2 n unit), so the last foot lands
// exactly on the spot. Each step is described by the feet's spread at its two plants: the leading
// foot sits at +dir × spread, the trailing one at −dir × spread. A fresh leg spreads 0 → r … r → 0
// (a half step to start, n − 1 full steps, a half step to stop: n + 1 steps); a leg that runs on
// from a plant with the feet already apart (`from` > 0) has no start step. In each step the walker
// moves (spread before + spread after) × unit px with the step's ease, and the planted foot moves
// the same in units the other way with the same ease, so it stays fixed on the line.
//
// A pace with a `ramp` (the /rix walk buttons' long walks) keeps every stride and that shared ease,
// and changes only the timing: the steps nearest each end take longer (the cadence builds up and
// winds down), and each step's ease is a cubic whose speed at its plants matches the neighbouring
// steps (so the speed never jumps), a `surge` below the step's average (a gentle push per step,
// not a conveyor). It starts and ends at rest. Pure: no DOM.
import { GAIT, type Pace, type Ramp } from "@/lib/rixMotion";

/** The viewBox width: the box is `-30 … 140`. */
const VIEW_WIDTH = 170;
/** A cubic ease stays monotonic (never steps backward) while its end slopes satisfy a² + b² ≤ 9. */
const MONOTONE = 3;

/** A GSAP ease: a named one, or a function of progress. */
export type GaitEase = string | ((progress: number) => number);

export type GaitStep = {
  /** The feet's spread (units) at the step's start and end plants. */
  readonly from: number;
  readonly to: number;
  /** px the walker moves in this step (always ≥ 0; the leg's direction signs it). */
  readonly move: number;
  /** The step's ease: the walker and the planted foot share it. */
  readonly ease: GaitEase;
  /** Seconds from the leg's first step to this one's start, and the step's length. */
  readonly start: number;
  readonly duration: number;
  /** The bob's share of the pace's `bob` (1 without a ramp). */
  readonly bob: number;
};

export type Gait = {
  /** px per viewBox unit. */
  readonly unit: number;
  /** The strides' reach (units). */
  readonly reach: number;
  readonly steps: readonly GaitStep[];
  /** Seconds: the steps' lengths together. */
  readonly duration: number;
  /** A ramp's speed-up (seconds from the first step; 0 without one) and where its slow-down starts. */
  readonly rampUp: number;
  readonly rampDownAt: number;
};

/** px per viewBox unit for a box `width` px wide. */
export const unitOf = (width: number) => width / VIEW_WIDTH;

/** The cubic ease from 0 to 1 whose slope is `a` at the start and `b` at the end (both ≥ 0). */
function hermite(a: number, b: number): (progress: number) => number {
  const size = Math.hypot(a, b);
  const k = size > MONOTONE ? MONOTONE / size : 1;
  const s = a * k;
  const e = b * k;
  const c3 = s + e - 2;
  const c2 = 3 - 2 * s - e;
  return (t) => ((c3 * t + c2) * t + s) * t;
}

/** Each step's length (×`step`): longer toward the leg's ends, over `ramp.steps` (fewer on a short leg). */
function cadence(count: number, fresh: boolean, ramp: Ramp): number[] {
  const span = Math.min(ramp.steps, Math.floor(count / 3));
  return Array.from({ length: count }, (_, i) => {
    const fromEnd = Math.min(fresh ? i : Infinity, count - 1 - i);
    return fromEnd < span ? 1 + ramp.slow * (1 - fromEnd / span) ** 2 : 1;
  });
}

/**
 * The steps for a leg of `distance` px at `pace`, for a box `width` px wide. `from` is the feet's
 * spread (units) at the leg's first plant: 0 for a fresh start, else the leg runs on with no start
 * step (R4.5).
 */
export function gaitFor(distance: number, width: number, pace: Pace, from = 0): Gait {
  const unit = unitOf(width);
  const stride = 2 * pace.footReach * unit;
  // A leg that runs on has already covered `from` units of its first step.
  const rest = Math.max(0, distance - from * unit);
  const n = Math.max(1, Math.round(rest / stride));
  const reach = rest / (2 * n * unit);
  // Running on with no room left for a stride: the stop step alone brings the feet together.
  const spreads = from > 0 && rest < 1 ? [from, 0] : [from, ...Array.from({ length: n }, () => reach), 0];
  const count = spreads.length - 1;
  const moves = Array.from({ length: count }, (_, i) => ((spreads[i] ?? 0) + (spreads[i + 1] ?? 0)) * unit);
  const { ramp } = pace;
  const fresh = from === 0;

  if (!ramp) {
    const steps = moves.map((move, i): GaitStep => {
      const first = i === 0 && fresh;
      const last = i === count - 1;
      return {
        from: spreads[i] ?? 0,
        to: spreads[i + 1] ?? 0,
        move,
        ease: first ? GAIT.start : last ? GAIT.stop : GAIT.mid,
        start: i * pace.step,
        duration: pace.step,
        bob: 1,
      };
    });
    const duration = count * pace.step;
    return { unit, reach, steps, duration, rampUp: 0, rampDownAt: duration };
  }

  const lengths = cadence(count, fresh, ramp).map((factor) => factor * pace.step);
  // Each step's average speed (px/s), and the speed at each plant between steps.
  const speeds = moves.map((move, i) => move / (lengths[i] ?? pace.step));
  const plantSpeed = (i: number) => (1 - ramp.surge) * (((speeds[i] ?? 0) + (speeds[i + 1] ?? 0)) / 2);
  const cruise = stride / pace.step;
  let start = 0;
  let rampUp = 0;
  let rampDownAt = -1;
  const steps = moves.map((move, i): GaitStep => {
    const duration = lengths[i] ?? pace.step;
    const speed = speeds[i] ?? 0;
    // At rest at a fresh start and at the stop; running on, the leg enters at its own pace.
    const enter = i === 0 ? (fresh ? 0 : (1 - ramp.surge) * speed) : plantSpeed(i - 1);
    const leave = i === count - 1 ? 0 : plantSpeed(i);
    const ease = speed > 0 ? hermite(enter / speed, leave / speed) : GAIT.mid;
    const bob = ramp.bobLow + (1 - ramp.bobLow) * Math.min(1, cruise > 0 ? speed / cruise : 1);
    const step: GaitStep = { from: spreads[i] ?? 0, to: spreads[i + 1] ?? 0, move, ease, start, duration, bob };
    const slowed = duration > pace.step + 1e-6;
    if (slowed && rampDownAt < 0 && fresh && i < count / 2) rampUp = start + duration;
    if (slowed && rampDownAt < 0 && i >= count / 2) rampDownAt = start;
    start += duration;
    return step;
  });
  return { unit, reach, steps, duration: start, rampUp, rampDownAt: rampDownAt < 0 ? start : rampDownAt };
}
