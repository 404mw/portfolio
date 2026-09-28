// The process bots' motion constants (ui-spec §5.7 constants table): seconds, viewBox units and
// degrees unless marked. Ranges are `[min, max]`, picked at random each time; per-role values are
// keyed by role. Nothing else lives here: the rig, life, acts, pointer and relay files read these.
import type { BotRole } from "@/lib/processBots";

type PerRole = Readonly<Record<BotRole, number>>;
/** A `[min, max]` range, picked at random each time it's used. */
export type Range = readonly [min: number, max: number];
/** A tween's duration and ease. */
export type Timing = { readonly duration: number; readonly ease: string };
/** An `upper` scaleX × scaleY pair. */
export type Scale2 = { readonly scaleX: number; readonly scaleY: number };

// Life: breathing, sway, arm drift.
/** Body stretch peak while awake / napping. */
export const BREATH_STRETCH = 0.04;
export const NAP_STRETCH = 0.06;
/** Half a breath (`sine.inOut` yoyo), per role. */
export const BREATH_HALF: PerRole = { rules: 1.25, team: 1.1, check: 1.35, update: 1.4 };
/** How far the arms / hat ride up per unit of body stretch (their height above the feet tops). */
export const ARM_LIFT = 31;
export const HAT_LIFT = 76;
/** Rig sway ± and its half-cycle (`sine.inOut` yoyo), per role. */
export const SWAY_DEG: PerRole = { rules: 1.2, team: 1.5, check: 1.0, update: 1.3 };
export const SWAY_HALF: PerRole = { rules: 2.6, team: 3.0, check: 2.8, update: 3.4 };
/** Arm drift ± and its half-cycle, picked per arm so the arms run out of phase. */
export const DRIFT_DEG = 3;
export const DRIFT_HALF: Range = [1.8, 2.4];
/** Life eases in over this when a bot lands, so breath and sway never pop in at a random phase. */
export const LIFE_IN: Timing = { duration: 0.8, ease: "sine.inOut" };
export const LIFE_EASE = "sine.inOut";

// Blinks.
export const BLINK_GAP: Range = [2, 6];
export const BLINK_CLOSE: Timing = { duration: 0.07, ease: "power2.in" };
export const BLINK_OPEN: Timing = { duration: 0.12, ease: "power2.out" };
/** Chance of a second blink, and the pause before it. */
export const DOUBLE_BLINK = 0.2;
export const DOUBLE_GAP = 0.1;
/** A closed eye: drawn y + this, height 0. */
export const BLINK_SHUT = 7;

// Looks.
export const LOOK_MAX = 7;
export const LOOK_HOLD: Range = [0.8, 2];
export const LOOK_MOVE: Range = [0.35, 0.6];
export const LOOK_EASE = "power3.out";
/** Chance a look goes back to the bot's rest look. */
export const LOOK_REST_CHANCE = 0.3;

// Foot taps.
export const TAP_GAP: Range = [7, 14];
export const TAP_LIFT = 3;
export const TAP_UP: Timing = { duration: 0.09, ease: "power2.out" };
export const TAP_DOWN: Timing = { duration: 0.07, ease: "power2.in" };
export const TAP_COUNT = 2;

// Acts and naps.
export const ACT_GAP: Range = [5, 10];
/** When an act or nap comes due while the bot is busy, it tries again after this. */
export const BUSY_RETRY: Range = [1, 2];
/** Rules and update only. */
export const NAP_GAP: Range = [25, 40];
export const NAP_LENGTH: Range = [4, 5];
export const NAP_TIMESCALE = 0.55;
export const NAP_SWAY_TIMESCALE = 0.6;
/** How long breathing and sway take to slow into / speed out of a nap. */
export const NAP_EASE_IN = 0.6;
/** Each z: rises `Z_RISE`, the three `Z_STAGGER` apart, looping. */
export const Z_RISE = 1.6;
export const Z_STAGGER = 0.5;
export const Z_TRAVEL = { x: 4, y: -10 } as const;
export const Z_SCALE_FROM = 0.6;
/** Share of a z's rise spent fading in. */
export const Z_FADE_IN = 0.25;

// Pointer follow (px are page px).
export const POINTER_RANGE = 240;
export const LEAN_RANGE = 480;
export const LEAN_MAX = 2.5;
export const EYE_FOLLOW = 0.35;
export const LEAN_FOLLOW = 0.6;
export const FOLLOW_EASE = "power3.out";
/** Seconds without movement before the pointer hands the eyes back. */
export const POINTER_IDLE = 2.5;

// Squash and stretch on `upper`.
export const ANTICIPATE: Scale2 = { scaleX: 1.06, scaleY: 0.92 };
export const STRETCH: Scale2 = { scaleX: 0.94, scaleY: 1.08 };
export const SQUASH: Scale2 = { scaleX: 1.1, scaleY: 0.9 };
/** Back to scale 1 after any landing. */
export const SETTLE: Timing = { duration: 0.6, ease: "elastic.out(1, 0.4)" };

// The jump (the hover/tap reaction, the only jump): upper / feet lift. Eye pop (reaction, "found
// it", waking).
export const JUMP_UP = 14;
export const JUMP_FEET = 10;
export const POP_SCALE = 1.25;
/** Seconds from a reaction's start before the bot reacts again. */
export const REACT_COOLDOWN = 1.2;
/** A tap: released within this many px of where it went down, and this many seconds. */
export const TAP_SLOP = 8;
export const TAP_TIME = 0.4;

// Scroll-in entrance.
export const DROP_FROM = -60;
export const DROP_FALL: Timing = { duration: 0.45, ease: "power2.in" };
export const DROP_STAGGER = 0.15;
export const DROP_START = "top 75%";
/** Fade in over the first part of the fall. */
export const DROP_FADE = 0.15;
export const DROP_STRETCH: Scale2 = { scaleX: 0.9, scaleY: 1.15 };
export const DROP_SQUASH: Scale2 = { scaleX: 1.12, scaleY: 0.86 };
export const DROP_SQUASH_TIME = 0.07;
export const DROP_EYES_OPEN = 0.12;
/** The landing glance toward the next bot: look distance, hold, and the move back to rest. */
export const DROP_GLANCE = 5;
export const DROP_GLANCE_HOLD = 0.5;
export const DROP_GLANCE_BACK = 0.4;

// Crew relay (from `lg`) and the below-`lg` cascade.
/** Start to start. */
export const RELAY_EVERY = 9;
/** After the last bot lands. */
export const RELAY_FIRST = 1.5;
export const RELAY_HOP: Timing = { duration: 0.7, ease: "power2.inOut" };
export const RELAY_DWELL = 0.15;
export const RELAY_FADE = 0.2;
export const RELAY_FADE_OUT = 0.15;
/** Return path speed, px per second, linear. */
export const RETURN_SPEED = 700;
export const CHEVRON_PULSE = { scale: 1.35, up: 0.15, down: 0.3 } as const;
export const CASCADE_GAP = 0.6;
/** A busy bot glances at the passing dot instead of catching it. */
export const RELAY_GLANCE = 5;
