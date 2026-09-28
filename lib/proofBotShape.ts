// The proof bots' shape vocabulary (ui-spec §7.2.1): one drawn outline in bot units, and the two
// ways a part uses it: an extruded solid in a material, or a flat detail in one shade. The body
// reads its outlines from lib/processBots.ts, whose shapes fit this type as they are.
import type { ProofBotFill, ProofBotMaterial } from "@/lib/proofBotShades";

/** One outline: a polygon, a rect, a path or a circle, in bot units. */
export type ProofBotGeometry =
  | { readonly kind: "polygon"; readonly points: string }
  | {
      readonly kind: "rect";
      readonly x: number;
      readonly y: number;
      readonly width: number;
      readonly height: number;
    }
  | { readonly kind: "path"; readonly d: string }
  | { readonly kind: "circle"; readonly cx: number; readonly cy: number; readonly r: number };

/** A static rotation, `rotate(angle cx cy)`, in degrees and bot units. */
export type ProofBotRotation = { readonly angle: number; readonly cx: number; readonly cy: number };

/** The SVG `transform` a rotation draws as. */
export const proofBotRotate = ({ angle, cx, cy }: ProofBotRotation) => `rotate(${angle} ${cx} ${cy})`;

/** One extruded shape: side faces in its material's side ramp, then a lit front. */
export type ProofBotSolidPart = {
  readonly geometry: ProofBotGeometry;
  readonly material: ProofBotMaterial;
  /** A static rotation on the outline itself, applied before extruding, so depth runs down-right. */
  readonly rotation?: ProofBotRotation;
};

/** Motion hooks on a flat detail's wrapper, hidden (`opacity-0`) at rest. */
export type ProofBotDetailHook = "screen-lit" | "puzzle-lit";

/** One flat detail: plain fill, no depth, no rim. */
export type ProofBotDetail = {
  readonly geometry: ProofBotGeometry;
  readonly fill: ProofBotFill;
  readonly rotation?: ProofBotRotation;
  readonly hook?: ProofBotDetailHook;
};
