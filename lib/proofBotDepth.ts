// The proof bots' extrusion steps (ui-spec §7.2.1, §7.2.2): a literal table, farthest step first.
// Step i of n sits at (0.55i, 0.7i) bot units and mixes its side shade at
// `100 − 100(i−1)/(n−1)`% `sideNear` over `sideFar`. Body and arms have 6 steps, props 5.

/** One depth step: its offset in bot units and its `sideNear` share, in percent. */
export type ProofBotDepthStep = { readonly dx: number; readonly dy: number; readonly near: number };

export type ProofBotDepthKind = "body" | "prop";

export const proofBotDepth = {
  body: [
    { dx: 3.3, dy: 4.2, near: 0 },
    { dx: 2.75, dy: 3.5, near: 20 },
    { dx: 2.2, dy: 2.8, near: 40 },
    { dx: 1.65, dy: 2.1, near: 60 },
    { dx: 1.1, dy: 1.4, near: 80 },
    { dx: 0.55, dy: 0.7, near: 100 },
  ],
  prop: [
    { dx: 2.75, dy: 3.5, near: 0 },
    { dx: 2.2, dy: 2.8, near: 25 },
    { dx: 1.65, dy: 2.1, near: 50 },
    { dx: 1.1, dy: 1.4, near: 75 },
    { dx: 0.55, dy: 0.7, near: 100 },
  ],
} as const satisfies Record<ProofBotDepthKind, readonly ProofBotDepthStep[]>;
