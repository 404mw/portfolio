// Rix's emotion geometry (ui-spec/00-rix.md R3): which emote glyph each emotion shows (their
// geometry is lib/rixGlyphs.ts, R3.2), and for the motion pass the eleven emotions' eye rects, looks
// and poses (R3.1), the angry slits' and love diamonds' rotation and pivots, and the sulk's
// collapsed rects (R6A.6).
// Their In/Out timings are `EMOTION_TIMING` in lib/rixMotion.ts. All values are hardcoded from the
// spec, in drawn viewBox units at rest look 0 (the look's translate on `eyes` carries them);
// nothing is computed at render.
import type { RixGlyphName } from "@/lib/rixGlyphs";
import type { EmotionName } from "@/lib/rixMotion";

/** The emote glyphs (geometry in lib/rixGlyphs.ts), one at a time. */
export type RixEmoteName = RixGlyphName;

/** An eye rect's `x`, `y`, `width`, `height`. */
export type EyeRect = readonly [x: number, y: number, width: number, height: number];
export type EyePair = readonly [left: EyeRect, right: EyeRect];

/** The eyes as drawn (rest look 0). */
export const restEyes: EyePair = [
  [23, 43, 14, 14],
  [63, 43, 14, 14],
];

/** Where an emotion's eyes look: fixed (d along the gap diagonal, p across it), or at something. */
export type EmotionLook =
  | { readonly d: number; readonly p: number }
  | { readonly at: "target" }
  /** At the pointer (fine), else `d` / `p`. */
  | { readonly at: "pointer"; readonly d: number; readonly p: number };

export type EmotionShape = {
  readonly eyes: EyePair;
  readonly look: EmotionLook;
  /** `upper`'s held pose. */
  readonly upper?: { readonly scaleX?: number; readonly scaleY?: number; readonly y?: number };
  /** Rig tilt (degrees; curious's sign comes from the target's side). */
  readonly tilt?: number;
  /** `actL` / `actR` (+ raises the left arm, − raises the right). */
  readonly arms: readonly [number, number];
  /** `foot-right x`. */
  readonly footRight?: number;
  /** `foot-right y` (love's foot pop). */
  readonly footRightY?: number;
  readonly emote?: RixEmoteName;
  /** Life's share while held (annoyed is stiff: no breath, sway or drift). */
  readonly life?: number;
};

export const rixEmotions: Readonly<Record<EmotionName, EmotionShape>> = {
  happy: {
    eyes: [
      [23, 48, 14, 4],
      [63, 48, 14, 4],
    ],
    look: { d: 2, p: 0 },
    arms: [20, -20],
  },
  excited: {
    eyes: [
      [21, 41, 18, 18],
      [61, 41, 18, 18],
    ],
    look: { d: 3, p: -1 },
    upper: { scaleX: 0.96, scaleY: 1.05 },
    arms: [60, -60],
    emote: "sparkle",
  },
  curious: {
    eyes: [
      [23, 43, 14, 14],
      [62, 40, 16, 17],
    ],
    look: { at: "target" },
    tilt: 6,
    arms: [0, -15],
  },
  shy: {
    eyes: [
      [23, 47, 14, 9],
      [63, 47, 14, 9],
    ],
    look: { d: -5, p: 2 },
    upper: { scaleX: 1.03, scaleY: 0.95, y: 1 },
    arms: [-20, 20],
    footRight: -2,
    emote: "dots",
  },
  surprised: {
    eyes: [
      [24, 40, 12, 18],
      [64, 40, 12, 18],
    ],
    look: { d: 0, p: 0 },
    arms: [25, -25],
    emote: "alert",
  },
  confused: {
    eyes: [
      [23, 43, 14, 14],
      [63, 47, 14, 6],
    ],
    look: { d: 4, p: 0 },
    tilt: -6,
    arms: [0, -80],
    emote: "question",
  },
  sleepy: {
    eyes: [
      [23, 50, 14, 7],
      [63, 50, 14, 7],
    ],
    look: { d: 0, p: 0 },
    arms: [-15, 15],
  },
  sad: {
    eyes: [
      [24, 49, 12, 8],
      [64, 49, 12, 8],
    ],
    look: { d: -3, p: 3 },
    upper: { scaleY: 0.95, y: 2 },
    arms: [-25, 25],
    emote: "drop",
  },
  annoyed: {
    eyes: [
      [23, 51, 14, 6],
      [63, 52, 14, 5],
    ],
    look: { at: "pointer", d: 4, p: -1 },
    upper: { scaleX: 0.98, scaleY: 1.03 },
    arms: [-25, 25],
    life: 0,
    emote: "vein",
  },
  angry: {
    eyes: [
      [23, 47, 14, 8],
      [63, 47, 14, 8],
    ],
    look: { at: "pointer", d: 0, p: 1 },
    upper: { scaleX: 1.03, scaleY: 0.97 },
    arms: [-40, 40],
    emote: "grawlix",
  },
  love: {
    eyes: [
      [24, 44, 12, 12],
      [64, 44, 12, 12],
    ],
    look: { d: 2, p: -1 },
    upper: { scaleX: 1.03, scaleY: 0.96, y: 1 },
    arms: [-35, 35],
    footRightY: -3,
    emote: "hearts",
  },
};

/** Angry's slant: each slit turns about its own centre, inner corners lowest (L +, R −). */
export const ANGRY_SLANT = 18;
export const angryOrigins = ["30 51", "70 51"] as const;
/** The eyes' pop pivots at rest look 0 (the rig's own), restored once the slant is gone. */
export const eyeOrigins = ["30 50", "70 50"] as const;
/** Love's diamonds: each 12×12 square turns 45° about the eye's centre (the pop pivots). */
export const LOVE_TURN = 45;

/** Each eye's `rotation` (L, R) and its pivot (`svgOrigin`, drawn coordinates). */
export type EyeTurn = { readonly rotation: readonly [number, number]; readonly origins: readonly [string, string] };

/** The eye turn for an emotion's rects: angry's slant and love's diamonds; none for the rest. */
export function eyeTurn(name: EmotionName): EyeTurn | null {
  if (name === "angry") return { rotation: [ANGRY_SLANT, -ANGRY_SLANT], origins: angryOrigins };
  if (name === "love") return { rotation: [LOVE_TURN, LOVE_TURN], origins: eyeOrigins };
  return null;
}

/** The emotions whose eyes a pop may run on (centres within 1 unit of the pop pivot). */
export const poppable: readonly (EmotionName | null)[] = [null, "surprised", "excited"];

/** The wall Rix sulks at: the shelf end he's at. */
export type Wall = "left" | "right";

/** The sulk's collapsed rects (R6A.6): width 0 at the wall-side edge, at rest `y` and `height`. */
export function sulkEyes(wall: Wall): EyePair {
  const [left, right] = restEyes;
  const edge = (rect: EyeRect) => (wall === "left" ? rect[0] : rect[0] + rect[2]);
  return [
    [edge(left), left[1], 0, left[3]],
    [edge(right), right[1], 0, right[3]],
  ];
}

/** The forgive's peek back (R6A.7): from the wall edge to `width`, with shy's lids. */
export function peekEyes(wall: Wall, width: number): EyePair {
  const [shyLeft, shyRight] = rixEmotions.shy.eyes;
  const x = (rest: EyeRect) => (wall === "left" ? rest[0] : rest[0] + rest[2] - width);
  return [
    [x(restEyes[0]), shyLeft[1], width, shyLeft[3]],
    [x(restEyes[1]), shyRight[1], width, shyRight[3]],
  ];
}
