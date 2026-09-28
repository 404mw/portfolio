// The proof bots' extrusion depths (ui-spec §7.2.1): a literal table of the vector each solid sweeps
// down-right, in bot units. Body and arms run 3.3 × 4.2 deep, props 2.75 × 3.5. lib/proofBotExtrude.ts
// turns an outline and one of these into its side faces.

/** One depth vector, in bot units. */
export type ProofBotDepthVector = { readonly dx: number; readonly dy: number };

export type ProofBotDepthKind = "body" | "prop";

export const proofBotDepth = {
  body: { dx: 3.3, dy: 4.2 },
  prop: { dx: 2.75, dy: 3.5 },
} as const satisfies Record<ProofBotDepthKind, ProofBotDepthVector>;
