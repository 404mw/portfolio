// The proof bot's body (ui-spec §7.2.1): the viewBox, the static pose (lean 10°, look 7), the arms,
// the eye recess and the glints. The MW strips, feet and eyes are the Process bots' geometry, read
// from lib/processBots.ts unchanged and re-exported here with the pivots the motion pass will use.
import { botPivots, eyesAt, feet, strips } from "@/lib/processBots";
import type { ProofBotSolidPart } from "@/lib/proofBotShape";

export { botPivots, feet, strips };

/** The SVG's viewBox; its bottom edge (y 86) is the banner floor. */
export const proofBotViewBox = "-40 -30 160 116";

/** The static lean: 10° about the rig pivot (50 92). A plain wrapper, never a hook. */
export const proofBotLean = `rotate(10 ${botPivots.rig[0]} ${botPivots.rig[1]})`;

/** The rest look along the gap diagonal, and its two eyes' top-left corners (14 × 14 each). */
export const proofBotLook = 7;
export const proofBotEyes: readonly { readonly x: number; readonly y: number }[] = eyesAt[proofBotLook].flatMap(
  (eye) => (eye.kind === "rect" ? [{ x: eye.x, y: eye.y }] : []),
);

/** The eye recess: how far the hole sits in from the eye's top-left corner (the body's depth). */
export const proofBotEyeDepth = { x: 3.3, y: 4.2, size: 14 } as const;

/** The Process idle arms, each a violet solid. */
export const proofBotArms = {
  left: { geometry: { kind: "rect", x: -4, y: 50, width: 10, height: 6 }, material: "violet" },
  right: { geometry: { kind: "rect", x: 94, y: 50, width: 10, height: 6 }, material: "violet" },
} as const satisfies Record<"left" | "right", ProofBotSolidPart>;

/** The body's two glints, clipped to the strips; the second at .7. */
export const proofBotGlints = [
  { cx: 32, cy: 26, rx: 24, ry: 9, transform: "rotate(-45 32 26)", opacity: 1 },
  { cx: 78, cy: 30, rx: 12, ry: 5, transform: "rotate(-45 78 30)", opacity: 0.7 },
] as const;

/** The body's solids in paint order: the feet, then the three strips, all violet. */
export const proofBotBodyParts: readonly ProofBotSolidPart[] = [...feet, ...strips].map((geometry) => ({
  geometry,
  material: "violet",
}));
