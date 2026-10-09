// The process bots' motion constants (ui-spec §5.7 constants table): seconds, viewBox units and
// degrees unless marked. Ranges are `[min, max]`, picked at random each time; per-role values are
// keyed by role. Nothing else lives here: the rig, life, acts, pointer and relay files read these.
import type { BotRole } from "@/lib/processBots";

type PerRole = Readonly<Record<BotRole, number>>;
/**
 * The roles added 2026-10-03 (`intake`, `flag`, `remind`, `ship`) take the host's value in the life
 * tables (breath and sway). The relay's tables (`JOB_AT`, `RELAY_DWELL`, `RELAY_WATCH`,
 * `JOB_BEATS`) give every role its own.
 */
const likeHost = (host: number) => ({ host, intake: host, flag: host, remind: host, ship: host });
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
export const BREATH_HALF: PerRole = { rules: 1.25, team: 1.1, check: 1.35, update: 1.4, ...likeHost(1.3) };
/** How far the arms / hat ride up per unit of body stretch (their height above the feet tops). */
export const ARM_LIFT = 31;
export const HAT_LIFT = 76;
/** Rig sway ± and its half-cycle (`sine.inOut` yoyo), per role. */
export const SWAY_DEG: PerRole = { rules: 1.2, team: 1.5, check: 1.0, update: 1.3, ...likeHost(1.2) };
export const SWAY_HALF: PerRole = { rules: 2.6, team: 3.0, check: 2.8, update: 3.4, ...likeHost(3.0) };
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
 * Every beat, and the job's pop and `SETTLE` after it, lands inside the role's `RELAY_DWELL`, so
 * the job has settled before it hops on: rules' stamp settles at 1.75, team's second strike at
 * 1.69, check's tick at 1.9, update's pop at 1.95 (of 2s); flag's at 1.05 (of 1.3), remind's at
 * 0.95 (of 1.6), ship's at 1.15 and host's at 1.05 (of 1.2). On a send the flag keeps the job
 * only to the top of its raise (`RELAY_SEND`), where the job lifts off for the hand-off.
 */
export const JOB_BEATS = {
  /** The held job goes out at arm's length; then it is handed on (the job leaves the hand: intake's dwell). */
  intake: { out: 0.5, hand: 1.3 },
  /** Clipboard marks 1 and 2 re-written; the first nod (the job's stamp). */
  rules: { marks: [0.55, 0.75], stamp: 1.05 },
  /** Strike impacts 1 and 2 (band, then step); later strikes keep the same spacing. */
  team: [0.37, 1.04],
  /** The lens (and the job's tick) on, off, on; the glow flashes on the last. */
  check: [LENS_FLICKER[1], LENS_FLICKER[2], LENS_FLICKER[3]],
  /** The page flips; the mark is re-written. The job pops as the page lands (`PAGE_FLIP` after `flip`). */
  update: { flip: 0.95, rewrite: 1.35 },
  /** The flag reaches the top of its raise (a send); the nod's dip (a routine pass). */
  flag: { raise: 0.5, nod: 0.4 },
  /** The bell's first swing peaks. */
  remind: { ring: 0.3 },
  /** The arrow's thrust up and out. */
  ship: { send: 0.5 },
  /** The nod's dip. */
  host: { nod: 0.4 },
} as const;

// Crew relay: along the ground line from `wide`, down the bot column below it (§5.9), on one clock
// (lib/processRelayPlan.ts).
/**
 * The relay's switch. Off, `useProcessBots` builds no relay parts, so no run ever starts and the
 * bots keep only their own life. On since the relay was rebuilt for the per-card flows: five or
 * six stops, the fix hop, and the one-way pass of a flow with no loops.
 */
export const RELAY_ON: boolean = true;
/**
 * The pause between runs: the next run starts this long after the last one ends (its last tween:
 * the return light's fade, or the job's own fade in a flow with no return). Runs differ in length
 * (five or six stops, with or without the fix hop, the return's width), so the relay is paced by
 * its rest, not by a fixed start-to-start time.
 */
export const RELAY_REST = 2;
/**
 * The runs' cycle (ui-spec §5.11e, choice 74), from the first run after setup or a swap: the job
 * goes to a person (`send`), a routine job goes through (`straight`), the check finds something
 * (`fix`), and again. A flow with no send stop skips `send`, one with no fix stop skips `fix`, so
 * every run of a flow with no loops (Discord) is straight.
 */
export const RUN_CYCLE = ["send", "straight", "fix"] as const;
export type RunKind = (typeof RUN_CYCLE)[number];
/** After the last bot lands. */
export const RELAY_FIRST = 1.5;
export const RELAY_HOP: Timing = { duration: 0.7, ease: "power2.inOut" };
/**
 * Arrival to departure at each stop. Intake's is the hand-off beat (the job leaves its hand); the
 * last stop's ends as the job leaves for the line's end. The new roles' acts are shorter than the
 * builders', so their stops are too.
 */
export const RELAY_DWELL: PerRole = {
  intake: JOB_BEATS.intake.hand,
  rules: 2.0,
  team: 2.0,
  check: 2.0,
  update: 2.0,
  flag: 1.3,
  remind: 1.6,
  ship: 1.2,
  host: 1.2,
};
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
export const RELAY_WATCH: PerRole = {
  intake: 7,
  rules: 7,
  team: 5,
  check: 7,
  update: 7,
  flag: 7,
  remind: 5,
  ship: 7,
  host: 7,
};
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
 * Each stop's bot viewBox x (the job's centre), always on the bot's right. Intake's is its hand:
 * the held emblem's centre line (the prop slot, x 106–130), where the travelling job takes over.
 * Every other stop is on the ground: under the right hand (rules, host), the hammer (team), the
 * lens (check), the bell and the arrow, each of which ends above the job's top. Update's and
 * flag's sit 4 units further right: clear of the wrench handle's low end at (106, 55) and of the
 * flag pole's foot at (106–110, 56), which the sheet's built step (from x − 15, 5px above the sheet)
 * would otherwise touch.
 */
export const JOB_AT: PerRole = {
  intake: 118,
  rules: 122,
  team: 122,
  check: 122,
  update: 126,
  flag: 126,
  remind: 122,
  ship: 122,
  host: 122,
};
/**
 * The hand's height, bot viewBox y: where the travelling job's anchor (its box's bottom centre)
 * goes so it covers the held emblem exactly. The sheet's box ends on the sheet's bottom edge (the
 * held sheet's is y 50); an emblem's box (`104 21 28 31`) ends at y 52.
 */
export const JOB_HAND = { sheet: 50, emblem: 52 } as const;
/**
 * The hand-off: the travelling job takes the held emblem's place at the emblem's size, then grows
 * to its own over `duration` as it leaves; from `wide` it also drops onto the ground line over the
 * same time (the fall's ease), early in the hop, so it is on the line before it reaches the next
 * bot: even at six across on 1440, where that bot's clipboard starts about 112px from the hand.
 */
export const JOB_HAND_OFF: Timing = { duration: 0.22, ease: "power2.in" };
/**
 * Below `wide` (§5.9), every hop from ledge to ledge: the job lifts `lift` px above the higher of its
 * two ledges and drops onto the other, as a thrown arc. The hop's time is split between the rise
 * and the fall by the square roots of their heights (a short lift and a long drop down the column),
 * each half on its quadratic ease (`power1`);
 * `x` runs the whole hop on the hop's own ease. On the hand-off the job first drops out of the hand
 * onto ledge 1 over `JOB_HAND_OFF`, then hops on in the rest of `RELAY_HOP`.
 */
export const LEDGE_HOP = { lift: 6, up: "power1.out", down: "power1.in" } as const;
/**
 * Below `wide`: a ledge's lit overlay (`process-ledge-lit`) fades in over `on` as the job lands on it,
 * holds while that bot works the job, and fades over `off` as the job hops off. On the hand-off
 * ledge 1 only flashes (`on`, then `off`) as the job touches it; on the last ledge it fades with
 * the job (`JOB_FADE`).
 */
export const LEDGE_LIT = {
  on: { duration: 0.15, ease: "power1.out" },
  off: { duration: 0.35, ease: "power1.in" },
} as const;
/** A new job arrives in intake's hand at each run's start (not the first: it is already held). */
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
/** Update's page flip: the job pops (`JOB_SQUASH`) as the page lands. */
export const JOB_FOLD: Timing = PAGE_FLIP;
/** A mark on an emblem job blinks off for this long on rules' stamp beat (check uses its lens beats). */
export const JOB_MARK_BLINK = 0.08;

// The fix hop (ui-spec §5.3a): on a fix run the check finds something and sends the job back.
/**
 * The check's stop when it finds something: its eyes pop at `pop` (the "found it" pop) and the job
 * leaves again at `dwell`, back to the work step.
 */
export const RELAY_FIND = { pop: 1.3, dwell: 1.7 } as const;
/**
 * The job's "no": on the find it shakes about its bottom centre through `turns` (degrees), `step`
 * each; on the sheet the work step's marks (band and step) drop off over `drop`, to be built again.
 */
export const JOB_SHAKE = {
  turns: [-7, 6, -4, 0],
  step: 0.07,
  ease: "sine.inOut",
  drop: { duration: 0.15, ease: "power2.in" },
} as const;
/**
 * The hop back, from `wide`: one arc up into the fix arch and down to the work step's stop. `x` runs
 * the whole hop on `ease`; `y` rises on `up` for the first half and falls on `down` for the second.
 * At the top the job hangs inside the arch, its top `clear` px under the arch's top edge, so it
 * never reaches the label above. From `wide` only: below it the job goes back along the dotted fix
 * line (`FIX_LINE_HOP`).
 */
export const FIX_HOP = {
  duration: 0.8,
  ease: "power2.inOut",
  up: "power2.out",
  down: "power2.in",
  clear: 4,
} as const;
/**
 * The way back below `wide` (lib/processRelayFixLine.ts): from ledge 5 left and up to the dotted fix
 * line's bottom end, round its turns, up it and through the arrowhead into bot 4's hand, then down
 * onto ledge 4. One eased progress over the whole route (about 330–360px), so it starts slowly off
 * ledge 5, is quickest on the climb and settles onto ledge 4; on `power1.inOut`, gentler than the
 * hops' `power2`, so the climb up the line gets about 0.4s of the 1.1 and the two short legs
 * beside the bots about 0.35s each. Longer than `FIX_HOP` for the longer route: about the ledge
 * hops' speed.
 */
export const FIX_LINE_HOP: Timing = { duration: 1.1, ease: "power1.inOut" };
/** The fix arch's lit overlay (below `wide`: the fix line's) fades once the job heads forward again. */
export const FIX_LIT_FADE = 0.6;

// The hand-off (ui-spec §5.11e): on a send run the flag bot sends the job to a person.
/**
 * The flag's stop on a send: it keeps the job to the top of its raise (`JOB_BEATS.flag.raise`),
 * then the job lifts off and the run's visits end there.
 */
export const RELAY_SEND = { dwell: JOB_BEATS.flag.raise } as const;
/**
 * From `wide`, the climb: the job rises from its stop up the hand-off stem (`process-handoff`) and
 * passes behind the label's `bg` mask at the arrowhead, `y` over the whole climb on `ease`; `x`
 * eases onto the stem's line between `drift` (shares of the climb), so it first rises straight up
 * in front of the pennant. It fades over its last `fade` seconds, and ends with its centre `under`
 * px above the stem's top (inside the label's mask). The lit overlay (`process-handoff-lit`) lights
 * bottom to top behind it, holds `hold` once the job is gone, then fades over `FIX_LIT_FADE`.
 */
export const HANDOFF_CLIMB = {
  duration: 0.9,
  ease: "power2.inOut",
  drift: [0.15, 0.55],
  driftEase: "power1.inOut",
  fade: 0.3,
  under: 14,
  hold: 0.6,
} as const;
/**
 * Below `wide`, the drop: the job falls straight down the bot column from ledge 3 onto the hand-off
 * marker (`process-handoff-mark`), its centre on the marker's, then slides `slide` px right
 * towards the label as it pops (`JOB_DONE`) and fades (`JOB_FADE`).
 */
export const HANDOFF_DROP = { duration: 0.45, ease: "power1.in", slide: 16 } as const;
/** While the job waits after its change: one small lift and back (px, each way). */
export const JOB_BOB = { lift: 1.5, duration: 0.4, ease: "sine.inOut" } as const;
/**
 * After the last bot the job is done and leaves right along the ground line: at about the hops'
 * average speed (a 340px hop in `RELAY_HOP`'s 0.7s, px per second), never quicker than `min`
 * seconds, with the hops' ease. The slide is short: what is left of the last column past the stop.
 */
export const JOB_EXIT = { speed: 480, min: 0.35, ease: "power2.inOut" } as const;
/**
 * Where the exit slide stops: at least this far (px) inside the ground line's right end, so the
 * 24px sheet (half is 12) stays on the line even at the done pop's peak (12 × `JOB_DONE.scale` ≈
 * 13.4). A wider job (an emblem's 28px box) stops half its own width × `JOB_DONE.scale` inside.
 * From `wide` only: below it the job has no slide, it pops and fades on the last ledge.
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

// The relay lesson (the small rule card that rides the return back to step 2, "your standards"), in a
// flow that has the return.
/**
 * At the last bot, as the job leaves: the lesson splits off the job's centre, popping in from
 * `from` about its own centre (`ease`) as it fades in over `fade`, and peeling `peel` px up off the
 * job (`peelEase`) over the same `duration`; it waits `hold` before it leaves. Below `wide` the same
 * pop, without the peel or `hold`, puts it at the last bot's left hand.
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
 * Leaving the last bot: a small lift as it fades out. That step's text lies between the bot and
 * the path's start, so the lesson crosses it hidden instead of flying over the words. Below `wide`
 * the same lift, without the fade, takes it off the last bot's hand.
 */
export const LESSON_LEAVE = { lift: 4, duration: 0.2, ease: "power2.in" } as const;
/** Joining the return at R0: fades in, dropping from this far above (px). */
export const LESSON_ENTER = { from: 8, duration: 0.3, ease: "power2.out" } as const;
/** At the arrowhead: a small scale up about its centre as it fades out. */
export const LESSON_OUT = { scale: 1.3, duration: 0.25, ease: "power2.out" } as const;
/**
 * Below `wide` (§5.9): the rules bot's clipboard centre (step 2), in bot viewBox units. Its `x` is
 * the lesson's lane up the column's left edge; the point itself is where the ride ends and the
 * lesson pops out.
 */
export const COLUMN_LESSON_AT = { x: -15, y: 50 } as const;
/**
 * Below `wide`: just off the last bot's bare left hand (its arm ends at x −4, y 50–56; the last bot
 * holds a flag or an arrow in its right hand and nothing in its left), in bot viewBox units, mapped
 * through the live `arm-left` group, so it rides the arm's breath, drift and sway. The lesson pops
 * in here (`LESSON_SPLIT`'s pop, without the peel). Its `x` is the clipboard's, so the ride starts
 * in the lane.
 */
export const COLUMN_LESSON_FROM = { x: -15, y: 53 } as const;
/**
 * Below `wide`: once the lesson has popped in at its hand, the last bot holds it `hold` s, looking at
 * it (look −`LOOK_MAX`, down-left, over `look` from the pop's start); as it lifts off
 * (`LESSON_LEAVE`'s lift, without the fade) its eyes go back to rest over `back`.
 */
export const COLUMN_LESSON_HOLD = {
  hold: 0.6,
  look: { duration: 0.3, ease: LOOK_EASE },
  back: { duration: 0.4, ease: "power2.inOut" },
} as const;
/** Below `wide`: if the live hand sits off the lane, the lesson eases into it over the ride's start. */
export const COLUMN_LESSON_GLIDE: Timing = { duration: 0.3, ease: "power2.out" };

// The trail and lit lines.
/** Ghost k (1–3) runs the job's hop this much × k later. */
export const GHOST_LAG = 0.03;
export const GHOST_SCALE = [0.85, 0.7, 0.55] as const;
export const GHOST_OPACITY = [0.45, 0.28, 0.14] as const;
export const GHOST_IN = 0.1;
export const GHOST_OUT = 0.15;
/** The ground-lit segment (px, its `w-32`), its fade in at a hop's start and out on arrival (from `wide`). */
export const LIT_LENGTH = 128;
export const LIT_IN = 0.1;
export const LIT_FADE = 0.5;
