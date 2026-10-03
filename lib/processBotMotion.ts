// The process bots' motion constants (ui-spec §5.7 constants table): seconds, viewBox units and
// degrees unless marked. Ranges are `[min, max]`, picked at random each time; per-role values are
// keyed by role. Nothing else lives here: the rig, life, acts, pointer and relay files read these.
import type { BotRole } from "@/lib/processBots";

type PerRole = Readonly<Record<BotRole, number>>;
/** A `[min, max]` range, picked at random each time it's used. */
export type Range = readonly [min: number, max: number];
/** A tween's duration and ease. */
export type Timing = { readonly duration: number; readonly ease: string };
/** Only a timing's `duration` and `ease`, so a config's other keys (`at`, `width`…) never reach a tween. */
export const timed = ({ duration, ease }: Timing): Timing => ({ duration, ease });
/** An `upper` scaleX × scaleY pair. */
export type Scale2 = { readonly scaleX: number; readonly scaleY: number };

// Life: breathing, sway, arm drift.
/** Body stretch peak while awake / napping. */
export const BREATH_STRETCH = 0.04;
export const NAP_STRETCH = 0.06;
/** Half a breath (`sine.inOut` yoyo), per role. */
export const BREATH_HALF: PerRole = { rules: 1.25, team: 1.1, check: 1.35, update: 1.4, host: 1.3 };
/** How far the arms / hat ride up per unit of body stretch (their height above the feet tops). */
export const ARM_LIFT = 31;
export const HAT_LIFT = 76;
/** Rig sway ± and its half-cycle (`sine.inOut` yoyo), per role. */
export const SWAY_DEG: PerRole = { rules: 1.2, team: 1.5, check: 1.0, update: 1.3, host: 1.2 };
export const SWAY_HALF: PerRole = { rules: 2.6, team: 3.0, check: 2.8, update: 3.4, host: 3.0 };
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

// Act beats the relay job shares (§5.7 `JOB_BEATS`): the acts and the job read the same numbers,
// so each job change lands on its bot's beat. Seconds from the act's start (= the job's arrival).
/** A clipboard mark (and a job rule) being written. */
export const MARK_WRITE: Timing = { duration: 0.25, ease: "power2.out" };
/** Check's lens-lit flicker: off, on, off, on at these act times; it ends lit. */
export const LENS_FLICKER = [1.0, 1.08, 1.13, 1.25] as const;
/** Update's page flip about the spine; the job's corner folds over with the same ease and length. */
export const PAGE_FLIP: Timing = { duration: 0.35, ease: "power2.in" };
/**
 * Every beat, and the job's pop and `SETTLE` after it, lands inside `RELAY_DWELL` (2s), so the job
 * has settled before it hops on: rules' stamp settles at 1.75, team's step at 1.69, check's tick
 * at 1.9, update's fold at 1.95.
 */
export const JOB_BEATS = {
  /** Clipboard marks 1 and 2 re-written (and the job's rules); the first nod (the stamp). */
  rules: { marks: [0.55, 0.75], stamp: 1.05 },
  /** Strike impacts 1 and 2 (band, then step); later strikes keep the same spacing. */
  team: [0.37, 1.04],
  /** The lens (and the job's tick) on, off, on; the glow flashes on the last. */
  check: [LENS_FLICKER[1], LENS_FLICKER[2], LENS_FLICKER[3]],
  /** The page flips (the job's corner folds over with it); the mark is re-written. */
  update: { flip: 0.95, rewrite: 1.35 },
} as const;

// Crew relay: along the ground line from `lg`, down the bot column below it (§5.9), one clock.
/**
 * Relay start to start, at every width. From `lg` a run ends when the return light has faded after
 * the lesson reaches the arrowhead: ≈ 13.7s at `lg`, 14.4 at 1440, 14.7 at 4K (bot 4 lets go at
 * 10.3, the lesson is on the path at 11.3 and rides it for 1.8 / 2.5 / 2.8s, then 0.6 of fade), so
 * about 2s rest at 1440 (2.7 at `lg`, 1.7 at 4K; the column caps at 1536px, so 4K is the longest
 * run). Below `lg` it ends when the lesson pops out at bot 1's clipboard: ≈ 12.6–12.9s (bot 4
 * holds it until 11.25, then it lifts off his rulebook and rides ≈ 420–550px up the column, 0.9–1.2s).
 */
export const RELAY_EVERY = 16.4;
/** After the last bot lands. */
export const RELAY_FIRST = 1.5;
export const RELAY_HOP: Timing = { duration: 0.7, ease: "power2.inOut" };
/** Arrival to departure at each stop (update: to the job leaving right and the lesson splitting off). */
/** The host (About) never joins the relay; its entry only completes the record. */
export const RELAY_DWELL: PerRole = { rules: 2.0, team: 2.0, check: 2.0, update: 2.0, host: 2.0 };
/** A fresh job fades in at stop 1. */
export const RELAY_FADE = 0.2;
/** Team's strikes on a relay catch (timed acts keep 2–3). */
export const RELAY_STRIKES = 2;
/** A busy bot glances at the passing job instead of catching it. */
export const RELAY_GLANCE = 5;
/**
 * After its act on a relay catch, the bot keeps its eyes on the job until it leaves (look d, per
 * role: every bot holds the job on its right, so every look is toward the right), with one blink
 * if the wait is at least `RELAY_WATCH_BLINK`.
 */
export const RELAY_WATCH: PerRole = { rules: 7, team: 5, check: 7, update: 7, host: 7 };
export const RELAY_WATCH_BLINK = 0.4;
/** No timed act starts within this of a bot's next catch; no nap within `NAP_LENGTH` max + this. */
export const RELAY_CLEAR = 3.5;
/** The lesson's speed along the return path, px per second, linear. */
export const RETURN_SPEED = 450;
export const RETURN_LIT_FADE = 0.6;
/** Chevron icons and the arrowhead: scale and `cream` up, then back to scale 1 and `accent`. */
export const CHEVRON_PULSE = {
  scale: 1.35,
  up: { duration: 0.15, ease: "power2.out" },
  down: { duration: 0.3, ease: "power2.inOut" },
} as const;

// The relay job.
/**
 * Each stop's bot viewBox x (the job's centre), always on the bot's right: under the right hand
 * (rules), the hammer (team) and the lens (check); update's sits 4 units further right, so the
 * built step (5px above the sheet) keeps ~5 units clear of the wrench handle's low end at (106, 55).
 */
export const JOB_AT: PerRole = { rules: 122, team: 122, check: 122, update: 126, host: 122 };
/** A fresh job appears at stop 1. */
export const JOB_POP = { from: 0.6, duration: 0.3, ease: "back.out(1.7)" } as const;
/** The small pop that marks a change (team, check, update): the job squashes, then `SETTLE`. */
export const JOB_SQUASH = { scaleX: 1.06, scaleY: 0.92, duration: 0.05, ease: "power2.out" } as const;
/** Bot 1's stamp: it thumps in from scale 0 while the job squashes harder, then `SETTLE`. */
export const JOB_STAMP = {
  part: { duration: 0.18, ease: "back.out(2.5)" },
  job: { scaleX: 1.08, scaleY: 0.88, duration: 0.1, ease: "power2.out" },
} as const;
/** Team's build: the band or step grows 0 → 1 (with `JOB_SQUASH`). */
export const JOB_BUILD: Timing = { duration: 0.12, ease: "back.out(2)" };
/** Check's tick pops from this scale. */
export const JOB_TICK = { from: 1.3, duration: 0.2, ease: "power2.out" } as const;
/** Check's outline glow: full on the tick's last flicker, then fades as it grows a little. */
export const JOB_GLOW = { grow: 1.15, duration: 0.5, ease: "power1.out" } as const;
/** Update's corner fold flips over its hinge with the page (then `JOB_SQUASH` as it lands). */
export const JOB_FOLD: Timing = PAGE_FLIP;
/** While the job waits after its change: one small lift and back (px, each way). */
export const JOB_BOB = { lift: 1.5, duration: 0.4, ease: "sine.inOut" } as const;
/**
 * After bot 4 the job is done and leaves right along the ground line: at about the hops' average
 * speed (a 340px hop in `RELAY_HOP`'s 0.7s, px per second), never quicker than `min` seconds, with
 * the hops' ease. That's 0.35s at `lg` and 1440 (≈ 75 / 170px), 0.46s at 4K (≈ 220px).
 */
export const JOB_EXIT = { speed: 480, min: 0.35, ease: "power2.inOut" } as const;
/**
 * Where the exit slide stops: this far (px) inside the ground line's right end, so the 24px sheet
 * (half is 12) stays on the line even at the done pop's peak (12 × `JOB_DONE.scale` ≈ 13.4).
 */
export const JOB_EXIT_INSET = 14;
/** At the line's end, one "done" pop about the bottom centre: up to `scale`, then `back.out` to 1. */
export const JOB_DONE = {
  scale: 1.12,
  up: { duration: 0.12, ease: "power2.out" },
  down: { duration: 0.3, ease: "back.out(3)" },
} as const;
/** Then the job fades out where it stands. */
export const JOB_FADE: Timing = { duration: 0.3, ease: "power1.in" };

// The relay lesson (the small rule card that rides the return path back to bot 1).
/**
 * At bot 4, as the job leaves: the lesson splits off the sheet's centre, popping in from `from`
 * about its own centre (`ease`) as it fades in over `fade`, and peeling `peel` px up off the sheet
 * (`peelEase`) over the same `duration`; it waits `hold` before it leaves. Below `lg` the same pop,
 * without the peel or `hold`, puts it on bot 4's rulebook.
 */
export const LESSON_SPLIT = {
  from: 0.6,
  fade: 0.15,
  peel: 10,
  duration: 0.35,
  ease: "back.out(1.7)",
  peelEase: "power2.out",
  hold: 0.15,
} as const;
/**
 * Leaving bot 4: a small lift as it fades out. Step 4's text lies between bot 4 and the path's
 * start, so the lesson crosses it hidden instead of flying over the words. Below `lg` the same lift,
 * without the fade, takes it off bot 4's rulebook.
 */
export const LESSON_LEAVE = { lift: 4, duration: 0.2, ease: "power2.in" } as const;
/** Joining the return at R0: fades in, dropping from this far above (px). */
export const LESSON_ENTER = { from: 8, duration: 0.3, ease: "power2.out" } as const;
/** At the arrowhead: a small scale up about its centre as it fades out. */
export const LESSON_OUT = { scale: 1.3, duration: 0.25, ease: "power2.out" } as const;
/**
 * Below `lg` (§5.9): bot 1's clipboard centre, in bot viewBox units. Its `x` is the lesson's lane up
 * the column's left edge; the point itself is where the ride ends and the lesson pops out.
 */
export const COLUMN_LESSON_AT = { x: -15, y: 50 } as const;
/**
 * Below `lg`: bot 4's rulebook centre (its `M-26 38h22v28h-22Z` in lib/processBots.ts), in bot
 * viewBox units, mapped through the live `arm-left` group, so it rides the arm's breath, drift and
 * sway. The lesson pops in here (`LESSON_SPLIT`'s pop, without the peel). Its `x` is the clipboard's,
 * so the ride starts in the lane.
 */
export const COLUMN_LESSON_FROM = { x: -15, y: 52 } as const;
/**
 * Below `lg`: once the lesson has popped in on the rulebook, bot 4 holds it `hold` s, looking at it
 * (look −`LOOK_MAX`, down-left, over `look` from the pop's start); as it lifts off (`LESSON_LEAVE`'s
 * lift, without the fade) his eyes go back to rest over `back`.
 */
export const COLUMN_LESSON_HOLD = {
  hold: 0.6,
  look: { duration: 0.3, ease: LOOK_EASE },
  back: { duration: 0.4, ease: "power2.inOut" },
} as const;
/** Below `lg`: if the live rulebook sits off the lane, the lesson eases into it over the ride's start. */
export const COLUMN_LESSON_GLIDE: Timing = { duration: 0.3, ease: "power2.out" };

// The trail and lit lines.
/** Ghost k (1–3) runs the job's hop this much × k later. */
export const GHOST_LAG = 0.03;
export const GHOST_SCALE = [0.85, 0.7, 0.55] as const;
export const GHOST_OPACITY = [0.45, 0.28, 0.14] as const;
export const GHOST_IN = 0.1;
export const GHOST_OUT = 0.15;
/** The ground-lit segment (px, its `w-32`), its fade in at a hop's start and out on arrival. */
export const LIT_LENGTH = 128;
export const LIT_IN = 0.1;
export const LIT_FADE = 0.5;
