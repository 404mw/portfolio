// The proof bots' left-hand props (ui-spec §7.2.3), one per project: Exile's game phone, Design
// Vault's swatch fan, MARWIX-SKILLS' puzzle piece. Each prop is pieces in paint order; a piece is
// its solids, then its flat details (act parts included, hidden at rest). Every outline is
// hardcoded from the spec; nothing is computed at render. `grip` is the prop's pivot for the
// motion pass.
import type { BotPoint } from "@/lib/processBots";
import type { ProofBotDetail, ProofBotSolidPart } from "@/lib/proofBotShape";

export type ProofProp = "phone" | "fan" | "puzzle";

/** One piece of a prop; the fan's swatches each carry the `swatch` hook. */
export type ProofPropPiece = {
  readonly hook?: "swatch";
  readonly solids: readonly ProofBotSolidPart[];
  readonly details: readonly ProofBotDetail[];
};

export type ProofPropDrawing = {
  readonly grip: BotPoint;
  readonly pieces: readonly ProofPropPiece[];
};

const path = (d: string) => ({ kind: "path", d }) as const;

const screen = path("M-22 32h16v28h-16Z");
const phoneDot = (cx: number) => ({ kind: "circle", cx, cy: 49.5, r: 0.9 }) as const;

const swatchOutline = path("M-12 26h8v34h-8Z");
const swatchChip = path("M-11 28h6v5h-6Z");
/** A swatch's turn about the fan's rivet (-8 56). */
const fanTurn = (angle: number) => ({ angle, cx: -8, cy: 56 }) as const;

const puzzleStripe = path("M-15 46H-11L-19 60H-23Z");

export const proofBotProps = {
  phone: {
    grip: [-4, 53],
    pieces: [
      {
        solids: [{ geometry: path("M-24 28h20v38h-20Z"), material: "cream" }],
        details: [
          { geometry: screen, fill: { detail: "screen" } },
          { geometry: screen, fill: { detail: "screenLit" }, hook: "screen-lit" },
          { geometry: path("M-17 29.5h6v1.4h-6Z"), fill: { material: "muted", stop: "mid" } },
          { geometry: path("M-14 34L-10 38.5L-14 43L-18 38.5Z"), fill: { material: "violet", stop: "mid" } },
          { geometry: path("M-14 34L-10 38.5H-18Z"), fill: { material: "violet", stop: "light" } },
          { geometry: path("M-21 46.5h13v6h-7l-2.5 2.5v-2.5h-3.5Z"), fill: { material: "cream", stop: "mid" } },
          { geometry: phoneDot(-17.5), fill: { detail: "screen" } },
          { geometry: phoneDot(-14.5), fill: { detail: "screen" } },
          { geometry: phoneDot(-11.5), fill: { detail: "screen" } },
          { geometry: path("M-14 62h4v1.4h-4Z"), fill: { material: "muted", stop: "mid" } },
        ],
      },
    ],
  },
  fan: {
    grip: [-8, 56],
    pieces: [
      {
        hook: "swatch",
        solids: [{ geometry: swatchOutline, material: "ink", rotation: fanTurn(-50) }],
        details: [{ geometry: swatchChip, fill: { material: "violet", stop: "mid" }, rotation: fanTurn(-50) }],
      },
      {
        hook: "swatch",
        solids: [{ geometry: swatchOutline, material: "muted", rotation: fanTurn(-32) }],
        details: [{ geometry: swatchChip, fill: { detail: "screen" }, rotation: fanTurn(-32) }],
      },
      {
        hook: "swatch",
        solids: [{ geometry: swatchOutline, material: "cream", rotation: fanTurn(-14) }],
        details: [{ geometry: swatchChip, fill: { material: "violet", stop: "mid" }, rotation: fanTurn(-14) }],
      },
      {
        hook: "swatch",
        solids: [{ geometry: swatchOutline, material: "violet", rotation: fanTurn(4) }],
        details: [{ geometry: swatchChip, fill: { detail: "screen" }, rotation: fanTurn(4) }],
      },
      {
        solids: [{ geometry: { kind: "circle", cx: -8, cy: 56, r: 2.4 }, material: "ink" }],
        details: [],
      },
    ],
  },
  puzzle: {
    grip: [-6, 52],
    pieces: [
      {
        solids: [
          { geometry: path("M-30 40H-22A4 4 0 1 1 -14 40H-6V48A4 4 0 1 1 -6 56V64H-30Z"), material: "cream" },
        ],
        details: [
          { geometry: puzzleStripe, fill: { material: "violet", stop: "mid" } },
          { geometry: puzzleStripe, fill: { material: "violet", stop: "light" }, hook: "puzzle-lit" },
        ],
      },
    ],
  },
} as const satisfies Record<ProofProp, ProofPropDrawing>;
