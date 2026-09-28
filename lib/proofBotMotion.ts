// The proof card bots' motion constants (ui-spec §7.7, "Motion (later), the bot"): seconds, bot
// viewBox units and degrees unless marked. The idle life (breath, drift, blinks) and the pointer
// follow reuse the Process bots' numbers, re-exported here so the proof bot files read one place.
// Nothing else lives here.
import type { Timing } from "@/lib/processBotMotion";

export {
  BLINK_CLOSE,
  BLINK_GAP,
  BLINK_OPEN,
  BREATH_STRETCH,
  DOUBLE_BLINK,
  DOUBLE_GAP,
  DRIFT_DEG,
  DRIFT_HALF,
  EYE_FOLLOW,
  FOLLOW_EASE,
  LIFE_EASE,
  LIFE_IN,
  POINTER_IDLE,
  type Range,
  type Timing,
} from "@/lib/processBotMotion";

// The reveal: `rise` comes up from below the banner floor as its card reveals.
/** The rise's from-state: this far below rest, feet and all under the floor (the layer's clip). */
export const RISE_FROM = 84;
/** The rise itself, a soft overshoot, starting this long after its card's reveal starts. */
export const RISE: Timing & { readonly delay: number } = { duration: 0.9, ease: "back.out(1.3)", delay: 0.15 };

// Idle.
/** Half a breath (`sine.inOut` yoyo); between the Process roles' 1.1 and 1.4. */
export const BREATH_HALF = 1.3;
/** A shut eye's `scaleY` about its centre: a thin slit of the hole. */
export const BLINK_SCALE = 0.1;
/**
 * The pointer's reference point as a share of the SVG box: the body centre (50, 50) turned by the
 * static 10° lean about (50, 92), ≈ (57.3, 50.6), in the viewBox `-40 -30 160 116`.
 */
export const PROOF_EYE_POINT = { x: (57.3 + 40) / 160, y: (50.6 + 30) / 116 } as const;
/** The eyes' rest look (`data-look`): the translate is the look minus this. */
export const REST_LOOK = 7;

// Hover (fine pointer, with the card's lift).
/** The rig's extra lean on hover (10° → 14°), and the ease there and back. */
export const HOVER_LEAN = 4;
export const LEAN_IN: Timing = { duration: 0.45, ease: "power2.out" };
export const LEAN_OUT: Timing = { duration: 0.55, ease: "power2.inOut" };

// The prop acts, once per enter.
/** Phone: `screen-lit` fades in, holds, fades out. */
export const SCREEN_LIT = {
  in: { duration: 0.18, ease: "power2.out" },
  hold: 0.35,
  out: { duration: 0.45, ease: "power1.in" },
} as const;
/** Fan: each swatch turns this much further out about the rivet, then closes. Paint order. */
export const SWATCH_SPREAD = [-9, -3, 3, 9] as const;
export const FAN = {
  open: { duration: 0.28, ease: "power2.out" },
  hold: 0.18,
  close: { duration: 0.5, ease: "back.out(1.6)" },
} as const;
/** Puzzle: `prop` tilts and lifts off its grip, then snaps back with a small overshoot. */
export const PUZZLE = {
  tilt: -14,
  lift: -2,
  up: { duration: 0.22, ease: "power2.out" },
  snap: { duration: 0.45, ease: "back.out(2.6)" },
  /** `puzzle-lit` flashes as it snaps. */
  flash: { in: 0.08, out: { duration: 0.4, ease: "power1.in" } },
} as const;
