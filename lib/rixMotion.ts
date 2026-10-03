// Rix's motion constants (ui-spec 02a-about-options §2a.O4 table, ui-spec/00-rix.md): seconds,
// viewBox units and degrees unless marked; ranges are `[min, max]`, picked at random each time.
// Only Rix's own numbers live here; everything Process already defines (squash and stretch, the
// settle, the eye pop, the reaction cooldown, the follow ranges) is imported from
// lib/processBotMotion.ts, never copied.
import type { Range, Timing } from "@/lib/processBotMotion";

/** Rix's width at Process size (px): his follow ranges and look radius scale by width / this. */
export const RIX_BASE_WIDTH = 136;

// Arrival: the peek, then the hop into place.
/** On `about-rix-stage`, once per page load; if already passed at setup, Rix is shown at rest. */
export const PEEK_START = "top 75%";

export type PeekEdge = {
  /** The rig's x: fully hidden behind the edge, then the peek (only the head and both eyes clear it). */
  readonly hidden: number;
  readonly at: number;
  /** The rig lean while peeking (rides the act tilt channel). */
  readonly tilt: number;
  /** The stage's clip while he's behind the edge: the shelf's right end. */
  readonly clip: string;
};

/** He leans round the shelf's right end. */
export const PEEK_EDGE: PeekEdge = { hidden: 176, at: 60, tilt: -8, clip: "inset(-100% 0 -100% -100%)" };

/** Hidden → peek. */
export const PEEK_OUT: Timing = { duration: 0.45, ease: "power2.out" };
/** Looking around: left, hold, right, hold. */
export const PEEK_SEARCH = {
  look: 7,
  left: { duration: 0.25, ease: "power3.out" },
  holdLeft: 0.3,
  right: { duration: 0.3, ease: "power3.out" },
  holdRight: 0.25,
} as const;
/** Spots the visitor: look to 0, eye pop, and a small duck back toward hidden. */
export const PEEK_SPOT = {
  look: { duration: 0.15, ease: "power3.out" },
  popUp: 0.1,
  popBack: 0.3,
  duck: 6,
  duckAt: 0.05,
  duckMove: { duration: 0.15, ease: "power2.in" },
} as const;
/** The hop: anticipate, then travel to rest with a rise and fall; the lean straightens. */
export const PEEK_HOP = {
  /** From the spot's start. */
  at: 0.3,
  anticipate: { duration: 0.1, ease: "power2.out" },
  travel: { duration: 0.45, ease: "power2.inOut" },
  rise: -18,
  up: { duration: 0.22, ease: "power2.out" },
  down: { duration: 0.23, ease: "power2.in" },
  lean: { duration: 0.3, ease: "power2.inOut" },
} as const;
/** The landing squash (Process's `DROP_SQUASH`, for this long), then `SETTLE`. Life starts here. */
export const PEEK_LAND_SQUASH = 0.07;
/** The ask after landing: the wave, with a glance at the picks. */
export const ASK_AFTER_LAND = 0.1;

// Moves.
/** The wave on `arm-right` (about 94 53): up, two swings, back. 1.0s. */
export const WAVE = {
  up: { angle: -55, duration: 0.3, ease: "power2.out" },
  swing: { by: 12, duration: 0.15, ease: "sine.inOut" },
  back: { duration: 0.4, ease: "back.out(1.6)" },
} as const;
/** The hover perk: `upper` widens a little and stands taller, then `SETTLE`. */
export const PERK = { scaleX: 0.97, scaleY: 1.04, duration: 0.12, ease: "power2.out" } as const;
/** Seconds from a poke's start before another poke plays (pokes before landing are ignored too). */
export const POKE_COOLDOWN = 0.9;
/** The giggle bounce's numbers (its beats are in lib/rixActs.ts, from the spec's timeline). */
export const POKE = {
  lift: -10,
  feet: -6,
  tilt: 4,
  tiltHalf: 0.07,
} as const;
/** A bounce with the feet planted: anticipate, lift with `STRETCH`, down, `SQUASH`, then `SETTLE`. */
export type Bounce = {
  readonly anticipate: number;
  readonly lift: number;
  readonly up: number;
  readonly down: number;
  readonly squash: number;
};
/** A nudge's bounce (00-rix.md R8): one, at `at`; the talk bobs replace a second. */
export const NUDGE_BOUNCE = {
  at: 0.1,
  anticipate: 0.08,
  lift: -6,
  up: 0.16,
  down: 0.14,
  squash: 0.06,
} as const;
/** A pick's happy bounce, from 0.05 (its squash lands at 0.49). */
export const PICK_BOUNCE = { at: 0.05, anticipate: 0.1, lift: -8, up: 0.18, down: 0.16, squash: 0.06 } as const;
/** The pick's beats: the arm holds the prop out (and `PROP_IN`), the flourish, the arm back. */
export const PICK_ARM = {
  at: 0.2,
  angle: -30,
  out: { duration: 0.25, ease: "power2.out" },
  backAt: 1.2,
  back: { duration: 0.4, ease: "back.out(1.6)" },
} as const;
/** The shrug ("just looking", no prop, no bounce): arms out and up, the body lifts a touch, a look up-right. */
export const SHRUG = {
  at: 0.2,
  left: 35,
  right: -35,
  lift: -2,
  out: { duration: 0.2, ease: "power2.out" },
  hold: 0.4,
  back: { duration: 0.35, ease: "back.out(1.6)" },
  look: 7,
  lookBack: { duration: 0.3, ease: "power2.inOut" },
} as const;
/** Each prop's flourish (seconds from the pick), in the 0.5–1.1 window. */
export const FLOURISH = {
  /** The tick pops in, then a nod. */
  calendar: { tickAt: 0.55, tick: { duration: 0.2, ease: "back.out(2.5)" }, nodAt: 0.75, nod: 0.95, down: 0.1, up: 0.2 },
  /** A block: the shield draws back, thumps forward and settles; the rig tilts into it; eyes up-right. */
  shield: {
    at: 0.5,
    back: { x: -3, duration: 0.15, ease: "power2.out" },
    thump: { x: 2, duration: 0.08, ease: "power2.out" },
    settle: { duration: 0.3, ease: "back.out(2)" },
    tilt: -3,
    tiltIn: 0.2,
    tiltBack: 0.4,
    look: 7,
  },
  /** The arrow shoots up-right and comes back. */
  send: { at: 0.5, x: 6, y: -6, out: { duration: 0.16, ease: "power2.out" }, back: { duration: 0.3, ease: "back.out(1.6)" } },
  /** The bars grow from their bottoms. */
  report: { at: 0.5, stagger: 0.08, grow: { duration: 0.15, ease: "back.out(2)" } },
  /** The flap folds down, then the envelope hops. */
  envelope: {
    at: 0.5,
    fold: { duration: 0.2, ease: "power2.out" },
    hopAt: 0.7,
    lift: -4,
    up: { duration: 0.12, ease: "power2.out" },
    down: { duration: 0.25, ease: "back.out(1.6)" },
  },
} as const;

// The quip.
export const QUIP_HOLD = 2.4;
export const QUIP_OUT: Timing = { duration: 0.3, ease: "power1.in" };

// Nudges.
export const NUDGE_FIRST: Range = [15, 20];
export const NUDGE_EVERY: Range = [15, 20];
/** No more nudges for this page load after this many (decided 2026-10-01). Reduced motion: one. */
export const NUDGE_MAX = 4;
export const NUDGE_MAX_REDUCED = 1;
/** Skip a nudge if the pointer was over the picks or Rix this recently; retry after `NUDGE_RETRY`. */
export const NUDGE_QUIET = 4;
export const NUDGE_RETRY = 4;

// Looks at a target (a pick under the pointer or focus).
export const LOOK_AT: Timing = { duration: 0.3, ease: "power3.out" };
/** Released this long after the target loses the pointer and focus, eased back over `LOOK_BACK`. */
export const LOOK_RELEASE = 0.6;
export const LOOK_BACK: Timing = { duration: 0.4, ease: "power2.inOut" };
/** The perpendicular eye channel's limit (drop to 2 if an eye clips the body on screen). */
export const LOOK_PERP = 3;

// The prop and the ack on a pick.
/** The prop's scale pivot (viewBox), just below the hand. */
export const PROP_PIVOT = "118 50";
export const PROP_IN = { from: 0.4, fade: 0.12, duration: 0.3, ease: "back.out(2)" } as const;
export const PROP_OUT = { to: 0.4, duration: 0.15, ease: "power2.in" } as const;
export const ACK_IN = { y: 8, at: 0.3, duration: 0.35, ease: "power2.out" } as const;

// ---------------------------------------------------------------------------------------------
// The character sheet (ui-spec/00-rix.md R8): home's About Rix and the /dev Rix sheet. px are CSS px.

// Emotions (R3). Each emotion's In and Out; the pose eases over max(In, `POSE_MIN`) and back over
// Out with `POSE_BACK`.
export type EmotionName =
  | "happy"
  | "excited"
  | "curious"
  | "shy"
  | "surprised"
  | "confused"
  | "sleepy"
  | "sad"
  | "annoyed"
  | "angry"
  | "love";
export const EMOTION_TIMING: Readonly<Record<EmotionName, { readonly in: Timing; readonly out: Timing }>> = {
  happy: { in: { duration: 0.08, ease: "power2.out" }, out: { duration: 0.12, ease: "power2.out" } },
  excited: { in: { duration: 0.1, ease: "back.out(2)" }, out: { duration: 0.25, ease: "power2.inOut" } },
  curious: { in: { duration: 0.2, ease: "power2.out" }, out: { duration: 0.3, ease: "power2.inOut" } },
  shy: { in: { duration: 0.25, ease: "power2.out" }, out: { duration: 0.3, ease: "power2.inOut" } },
  surprised: { in: { duration: 0.06, ease: "power4.out" }, out: { duration: 0.25, ease: "power2.inOut" } },
  confused: { in: { duration: 0.2, ease: "power2.out" }, out: { duration: 0.3, ease: "power2.inOut" } },
  sleepy: { in: { duration: 0.6, ease: "sine.inOut" }, out: { duration: 0.2, ease: "power2.out" } },
  sad: { in: { duration: 0.4, ease: "power2.inOut" }, out: { duration: 0.35, ease: "power2.inOut" } },
  annoyed: { in: { duration: 0.15, ease: "power2.out" }, out: { duration: 0.3, ease: "power2.inOut" } },
  angry: { in: { duration: 0.06, ease: "power4.out" }, out: { duration: 0.3, ease: "power2.inOut" } },
  love: { in: { duration: 0.2, ease: "back.out(2)" }, out: { duration: 0.35, ease: "power2.inOut" } },
};
export const POSE_MIN = 0.25;
export const POSE_BACK = "back.out(1.6)";
/** Confused's arm wiggle: ±`by`, `count` half-cycles of `half`. */
export const CONFUSED_WIGGLE = { by: 6, half: 0.1, count: 3 } as const;
/** Sad slows the sway to this. */
export const SAD_SWAY = 0.6;
export const EMOTE_IN = { scale: 0.6, y: 2, duration: 0.15, ease: "back.out(2)" } as const;
export const EMOTE_OUT: Timing = { duration: 0.2, ease: "power1.in" };
/** A new glyph cuts the old one over this; so does a cut (R2.2). */
export const EMOTE_CUT = 0.1;

// The glyph loops (R3.2, R8). Units are viewBox units.
/** Love's rising hearts: each part rises and sways, restarting at its drawn spot every `every`. */
export const HEARTS = {
  fadeIn: 0.15,
  pop: { from: 0.6, duration: 0.25, ease: "back.out(2)" },
  rise: { y: -10, duration: 1.2, ease: "sine.out" },
  sway: { x: 2, half: 0.3, ease: "sine.inOut" },
  fadeOut: { duration: 0.4, ease: "power1.in" },
  stagger: 0.35,
  every: 1.5,
} as const;
/** A poke's single heart (part 1): `EMOTE_IN`, a rise, then a fade over the last `fade`. */
export const HEART_ONE = { rise: { y: -6, duration: 0.8, ease: "sine.out" }, fade: 0.3 } as const;
/** The pick's burst: the three hearts pop from the prop's top centre and fan out. */
export const HEART_BURST = {
  at: 0.55,
  /** Each part's offset from its drawn centre to the prop's top centre (118 20). */
  from: [
    [15, 28],
    [1, 24],
    [27, 22],
  ],
  /** Each part's move from there. */
  to: [
    [0, -10],
    [10, -6],
    [-10, -6],
  ],
  scale: 0.4,
  move: { duration: 0.5, ease: "power2.out" },
  fade: { at: 0.2, duration: 0.3, ease: "power1.in" },
} as const;
export const TWINKLE = { scale: 0.4, half: 0.25, ease: "sine.inOut", lag: 0.25 } as const;
export const DROP_SLIDE = { y: 4, duration: 0.6, ease: "power1.in", fade: 0.2 } as const;
export const DOTS = { fade: 0.1, gap: 0.2, outAt: 1.0, out: 0.15, every: 1.4 } as const;
export const VEIN_THROB = {
  scale: 1.15,
  up: { duration: 0.1, ease: "power2.out" },
  down: { duration: 0.15, ease: "power2.in" },
  every: 0.9,
} as const;
/** Slot B sits `slotB` units right of slot A; each frame both show a random symbol from `order`. */
export const GRAWLIX = {
  frame: 0.12,
  slotB: 12,
  order: ["hash", "at", "dollar", "star"],
  vein: { scale: 1.2, half: 0.12, ease: "sine.inOut" },
} as const;

// Love and the pet (R3.1, R6B).
export const PET = {
  /** A fine pointer resting on him this long is a pet. */
  hover: 1.5,
  /** px the resting pointer may drift before the rest timer restarts. */
  drift: 8,
  /** A touch held this long is a pet. */
  press: 0.6,
  /** px a touch may move before the press is cancelled. */
  slop: 10,
  /** Seconds after a love ends before the next pet. */
  rest: 4,
  /** Pokes 1–2: the chance of a single heart in place of the sparkle. */
  pokeHeart: 0.33,
  /** Pokes up to this count may show the heart. */
  pokeHeartMax: 2,
} as const;
export const LOVE = {
  length: 2.4,
  max: 4.0,
  melt: { scaleX: 1.03, scaleY: 0.96, y: 1, duration: 0.4, ease: "sine.inOut" },
  arms: { l: -35, r: 35, duration: 0.2, ease: "power2.out" },
  footPop: { y: -3, duration: 0.2, ease: "power2.out" },
  sway: { tilt: 3, half: 0.6, ease: "sine.inOut", from: 0.3 },
  /** A double pulse every `every`. */
  beat: {
    scale: 1.12,
    up: { duration: 0.1, ease: "power2.out" },
    down: { duration: 0.2, ease: "power2.in" },
    count: 2,
    gap: 0.35,
    every: 1.2,
  },
  heartsAt: 0.1,
  lineAt: 0.6,
  /** Love's Out: the body back over this. */
  back: { duration: 0.3, ease: "power2.inOut" },
  /** The resting check's period while love waits on a resting pointer. */
  poll: 0.1,
  /** The pick's love eyes (R6B.4). */
  pick: { eyesAt: 0.6, eyes: { duration: 0.15, ease: "power2.out" }, outAt: 1.3 },
} as const;

// Walk (R4). px are CSS px; the gait (lib/rixGait.ts) turns a distance into stride-locked steps.
/** One leg's pace: the step cycle's numbers. Cruise speed = 2 × footReach × unit ÷ step. */
export type Pace = {
  /** Seconds per step. */
  readonly step: number;
  readonly lean: number;
  readonly armSwing: number;
  readonly footLift: number;
  /** The feet's reach from centre (viewBox units, at most 12). */
  readonly footReach: number;
  readonly bob: number;
  /** The farthest one leg of this pace goes (px). */
  readonly maxDist?: number;
  /** The stomp step (`STOMP_WALK`): the foot slams down, each plant squashes `upper`. */
  readonly stomp?: { readonly slam: Timing; readonly squash: number };
  /** Arms held at actL / actR instead of swinging. */
  readonly arms?: readonly [number, number];
  /** A long walk's feel (`WALK_RAMP`): ramped cadence, a speed surge per step, a lean into it. */
  readonly ramp?: Ramp;
};
/**
 * A long walk's feel (lib/rixGait.ts): the stride stays locked (every step keeps its reach, and the
 * planted foot shares the walker's ease), only the cadence and the speed curve change.
 */
export type Ramp = {
  /** Steps at each end whose cadence slows toward the end (fewer on a short leg: a third of its steps). */
  readonly steps: number;
  /** The end step's extra duration (×`step`), fading out over `steps` (quadratic). */
  readonly slow: number;
  /** The walker's speed at each plant, below its step's average by this share: a gentle push per step. */
  readonly surge: number;
  /** Extra lean (degrees) into the speed-up; half of it comes off as he slows. */
  readonly lean: number;
  /** The bob at a standstill, as a share of `bob`: it grows with the speed to the full bob at cruise. */
  readonly bobLow: number;
};
export const WALK = {
  dwell: 0.25,
  /** The farthest a card walk goes (px): past it he stops partway (R4.1). */
  reach: 200,
  minDist: 12,
  step: 0.15,
  footReach: 9,
  footLift: 4,
  bob: 1.5,
  lean: 3,
  armSwing: 14,
  /** `actR` while he carries a prop: only the left arm swings. */
  carry: -10,
  face: { d: 3, p: 3 },
} as const;
/** The gait's eases per step (R4.2): the start step speeds up, the stop step slows down. */
export const GAIT = { start: "power1.in", mid: "none", stop: "power1.out", swing: "sine.inOut" } as const;
export const WALK_START = { anticipate: 0.08, faceLead: 0.08 } as const;
export const WALK_STOP = {
  brake: { duration: 0.15, ease: "power2.out" },
  /** How far (px) a brake carries him on. */
  brakeSlide: 4,
  overshoot: 1.5,
  overshootTime: 0.12,
  back: { duration: 0.3, ease: "back.out(1.6)" },
  feet: 0.1,
  squash: 0.06,
} as const;
export const WALK_TURN = { eyes: { duration: 0.12, ease: "power2.inOut" }, squash: 0.06 } as const;
/** Three target flips within `window` s: he stops, `confused` for `hold`, then walks on. */
export const WALK_FLIPS = { count: 3, window: 2, hold: 0.8 } as const;
/** How long he shows `curious` at a card nobody holds (after a pick's walk) before letting go. */
export const CURIOUS_GLANCE = 0.8;
export const WALK_PACE: Pace = {
  step: WALK.step,
  lean: WALK.lean,
  armSwing: WALK.armSwing,
  footLift: WALK.footLift,
  footReach: WALK.footReach,
  bob: WALK.bob,
};
/** The /rix walk buttons' feel: the whole stage width at `WALK`, eased in and out over 3 steps. */
export const WALK_RAMP: Ramp = { steps: 3, slow: 0.4, surge: 0.12, lean: 1.5, bobLow: 0.6 };
/** The /rix walk buttons' pace: `WALK_PACE` with `WALK_RAMP` (home's card walks stay `WALK_PACE`). */
export const WALK_FAR: Pace = { ...WALK_PACE, ramp: WALK_RAMP };
/** The patrol's amble (56 px/s at 136px). */
export const PATROL_PACE: Pace = { step: 0.2, footReach: 7, footLift: 3, bob: 1, lean: 1.5, armSwing: 8 };
export const PATROL = {
  /** The first stretch, after landing. */
  first: 5,
  /** The first stretch's heading (left). */
  heading: -1,
  stretch: [96, 240] as Range,
  /** Less room than this ahead (px) and he turns round. */
  minStretch: 48,
  pause: [2.5, 6] as Range,
  /** The pause's look: at the card below him, the pointer, or out at the visitor. */
  looks: { card: 0.4, pointer: 0.3, out: 0.3 },
  /** The bare floor's (the /rix playground, no cards): the pointer, out at the visitor, or a shelf end. */
  floorLooks: { pointer: 0.35, out: 0.3, end: 0.35 },
  /** When the pause's look starts (after the stop's own look back), and how long it holds at most. */
  lookAt: 0.35,
  lookHold: 1.8,
  /** Seconds after the last interrupt ends before he patrols again. */
  resume: 3,
  /** The quiet check's period while something holds him. */
  poll: 0.5,
  /** The playground toggle's first stretch. */
  toggle: 0.5,
} as const;
/** A scramble from a fine pointer (192 px/s). */
export const FLEE: Pace = { step: 0.1, footReach: 12, footLift: 6, bob: 2, lean: 7, armSwing: 20, maxDist: 400 };
/** A stomp away on touch and keyboard (65 px/s). */
export const STOMP_WALK: Pace = {
  step: 0.22,
  footReach: 9,
  footLift: 7,
  bob: WALK.bob,
  lean: 2,
  armSwing: 0,
  maxDist: 120,
  stomp: { slam: { duration: 0.06, ease: "power4.in" }, squash: 0.05 },
  arms: [-40, 40],
};
/** Curious tilts toward the target's side. */
export const CURIOUS_TILT = 6;

// Talk (R5).
export const TALK = {
  char: 0.035,
  pause: 0.14,
  pauseAfter: ",.?!",
  bob: -1.5,
  bobUp: { duration: 0.07, ease: "power2.out" },
  bobDown: { duration: 0.09, ease: "power2.in" },
  squish: { height: 10, y: 2, in: 0.06, out: 0.08 },
  glance: 2,
  afterPoke: 0.5,
  afterNudge: 0.3,
  afterAnnoyed: 0.25,
  afterAngry: 0.15,
  afterPet: 0.6,
  afterSulk: 0.4,
  afterForgive: 0.9,
  /** A walk start fades the current line out over this. */
  walkOut: 0.2,
  /** Room (px) his left side needs for the quip (`max-w-40` + `mr-3`), else it goes right. */
  sideRoom: 172,
} as const;

// Plays (R6).
export const JUGGLE = {
  props: 3,
  stagger: 0.25,
  throw: { x: -134, rise: -40, duration: 0.5 },
  pass: { rise: -12, duration: 0.25 },
  rounds: 2,
  flick: { r: -25, l: 20, out: 0.08, back: 0.12 },
  look: { d: 3, p: -3, follow: 1 },
  drop: 0.25,
  fall: { x: -136, y: 42, duration: 0.3, ease: "power2.in" },
  bounce: 6,
  bounceTimes: [0.1, 0.12],
  fade: 0.3,
  dropLook: { d: -7, p: 1 },
  surprised: 0.3,
  sad: 0.8,
  happy: 0.6,
} as const;
export const SIT = {
  lower: 7,
  in: { duration: 0.3, ease: "power2.inOut" },
  pose: { scaleX: 1.04, scaleY: 0.96 },
  arms: [-30, 30],
  swing: { x: 3, y: 1, half: 0.45 },
  length: [6, 9] as Range,
  up: { duration: 0.25, ease: "back.out(1.6)" },
} as const;
/** Seconds of visitor idle (live time) before the nap. */
export const NAP_AFTER = 40;
export const YAWN = {
  at: 0.6,
  pose: { scaleX: 0.95, scaleY: 1.08 },
  arms: [40, -40],
  up: 0.4,
  hold: 0.4,
  down: 0.5,
} as const;
export const NOD = { at: 1.9, tilt: 3, down: 0.8, snap: 0.15, count: 2 } as const;
export const NAP_SIT_AT = 3.6;
export const WAKE_START = {
  zzzOut: 0.15,
  hop: -8,
  up: 0.18,
  down: 0.16,
  lookAt: 0.3,
  alert: 0.6,
  blinkAt: 0.8,
  glad: 1.0,
  happy: 0.5,
} as const;
export const TAG = {
  near: 110,
  speed: 500,
  hop: 48,
  hopTime: 0.3,
  hopLift: -10,
  hopFeet: -6,
  duck: 6,
  duckScale: 0.85,
  duckIn: 0.12,
  duckHold: 0.4,
  dodges: 2,
  session: 8,
  rest: 20,
  shy: 0.8,
} as const;
export const PEEKABOO = {
  clip: "inset(-100% -100% 0 -100%)",
  sink: 88,
  sinkMove: { duration: 0.35, ease: "power2.in" },
  hold: 0.6,
  rise: 32,
  riseAt: 0.95,
  searchAt: 1.4,
  popAt: 2.5,
  happy: 0.4,
} as const;
export const LOGO_POSE = {
  lifeOut: 0.3,
  armsAt: 0.3,
  arms: { duration: 0.2, ease: "power2.in" },
  hold: 0.8,
  winkAt: 1.3,
  wink: { shut: 0.07, hold: 0.25, open: 0.12 },
  backAt: 1.75,
  back: { duration: 0.3, ease: "back.out(2)" },
  happy: 0.3,
} as const;
export const BALANCE = {
  to: { x: -68, y: -43, duration: 0.4 },
  wobbleAt: 0.4,
  wobble: { tilt: 3, prop: 8, half: 0.25, count: 3 },
  arms: [30, -30],
  backAt: 1.15,
  back: 0.35,
  happy: 0.4,
} as const;
export type PlayName = "juggle" | "sit" | "peekaboo" | "logoPose" | "balance";
export const PLAY = {
  first: 8,
  gap: [12, 20] as Range,
  max: 3,
  per: 60,
  retry: 4,
  weights: { juggle: 3, sit: 3, peekaboo: 1, logoPose: 1, balance: 1 } as Readonly<Record<PlayName, number>>,
} as const;

// Moods: the poke ladder (R6A).
export const POKE_WINDOW = 4.0;
export const POKE_REPEAT = 0.15;
export const POKE_LADDER = { annoyed: 4, tantrum: 6 } as const;
export const ANNOYED_MIN = 0.6;
export const ANNOYED_POKE = {
  stiff: { scaleX: 0.98, scaleY: 1.03, duration: 0.12, ease: "power2.out" },
  arms: { l: -25, r: 25, duration: 0.15, ease: "power2.out" },
  huff: { y: -1.5, at: 0.15, up: 0.08, down: 0.2 },
  taps: [0.2, 0.45],
  length: 0.9,
} as const;
export const TANTRUM = {
  stomps: [0.1, 0.4, 0.7, 1.0],
  stomp: { lift: -7, up: { duration: 0.12, ease: "power2.out" }, slam: { duration: 0.06, ease: "power4.in" }, squash: 0.05 },
  shake: { x: 1.5, half: 0.04, from: 0.1, to: 1.9, stop: 0.1 },
  arms: { l: -40, r: 40, shake: 6, half: 0.08 },
  fleeAt: 1.9,
} as const;
export const TOSS = {
  windup: { r: 25, at: 0.55, duration: 0.15, ease: "power2.in" },
  fling: { r: -80, at: 0.7, duration: 0.1, ease: "power3.out" },
  release: 0.75,
  x: 150,
  /** px kept clear of the shelf's end. */
  inset: 8,
  rise: { y: -36, duration: 0.25, ease: "power2.out" },
  fall: { y: 60, duration: 0.45, ease: "power2.in" },
  /**
   * The fall's end on a bare-floor stage (the /rix playground): the spinning prop (corners ≤ 18.1
   * units from `origin`, × `scale` at the end) lands on the floor line (viewBox y 92) and no lower,
   * so no paint leaves the stage. Home's B falls to `fall.y`, into the gap above the cards.
   */
  floorY: 41,
  spin: 540,
  scale: 0.8,
  fade: { at: 1.05, duration: 0.4, ease: "power1.in" },
  origin: "118 36.5",
  armBack: { at: 0.95, duration: 0.3, ease: "back.out(1.6)" },
} as const;
export const ACK_OUT: Timing = { duration: 0.2, ease: "power1.in" };
export const SULK = {
  slide: { duration: 0.15, ease: "power2.inOut" },
  collapse: { at: 0.15, duration: 0.25, ease: "power2.in" },
  squeeze: { scaleX: 0.92, duration: 0.3, ease: "power2.inOut" },
  slump: { y: 1.5, scaleY: 0.97 },
  arms: [-20, 20],
  tilt: 3,
  lineAt: 0.4,
  hold: 6,
  breath: 0.6,
} as const;
export const HMPH = { tilt: 2, half: 0.06, dip: 0.96, dipTime: 0.06, gap: 0.5 } as const;
export const FORGIVE = {
  peek: { width: 7, duration: 0.2, ease: "power2.out" },
  hold: 0.5,
  blinkAt: 0.45,
  turnAt: 0.7,
  turn: { duration: 0.3, ease: "back.out(1.6)" },
  look: { duration: 0.3, ease: "power2.inOut" },
  happyAt: 0.85,
  waveAt: 0.9,
  length: 1.8,
} as const;
export const WAVE_SMALL = {
  up: { angle: -35, duration: 0.2, ease: "power2.out" },
  swing: { by: 8, duration: 0.12, ease: "sine.inOut" },
  back: { duration: 0.3, ease: "back.out(1.6)" },
} as const;
export const CALM = {
  angryHold: 0.35,
  arms: { l: -25, r: 25, duration: 0.35 },
  annoyedAt: 0.35,
  annoyed: 0.25,
  sigh: { at: 0.6, in: 1.04, inTime: 0.3, out: 0.97, outTime: 0.35 },
  neutralAt: 0.85,
  neutral: 0.25,
  happyAt: 1.25,
  happy: 0.12,
  pickAt: 1.6,
  reopen: 0.2,
  sulkTurn: { duration: 0.3, ease: "back.out(1.6)" },
} as const;

// Reduced motion (R8.1).
/** The reduced sulk window starts the sulk line here (after the angry line's fade), and ends at `end`. */
export const REDUCED_SULK = { lineAt: 3.2, end: TANTRUM.fleeAt + SULK.hold } as const;
