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

/** One extruded shape: depth steps in its material's side ramp, then a lit front. */
export type ProofBotSolidPart = {
  readonly geometry: ProofBotGeometry;
  readonly material: ProofBotMaterial;
  /** A static rotation on the outline itself, inside each depth step, so depth runs down-right. */
  readonly transform?: string;
};

/** Motion hooks on a flat detail's wrapper, hidden (`opacity-0`) at rest. */
export type ProofBotDetailHook = "screen-lit" | "puzzle-lit";

/** One flat detail: plain fill, no depth, no rim. */
export type ProofBotDetail = {
  readonly geometry: ProofBotGeometry;
  readonly fill: ProofBotFill;
  readonly transform?: string;
  readonly hook?: ProofBotDetailHook;
};
