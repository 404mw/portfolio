// What every Agents demo replay shares (ui-spec §4.7, Motion): the shape a replay returns, the pop
// each part plays (y 8px, scale .96 → none), its length, the pause before the first part, and the
// timeline those pops sit on. The sequences themselves are in lib/agentDemoSequences.ts and
// lib/orchestraRun.ts.
import { gsap } from "@/lib/gsap";
import { ease } from "@/lib/motion";

export type DemoPlayback = {
  /** The one-off sequence. */
  readonly sequence: gsap.core.Timeline;
  /** Loops that keep running after it (Sync's packets), for pausing off screen. */
  readonly loops: readonly gsap.core.Animation[];
};

/** Where every part pops in from. */
export const POP_FROM = { opacity: 0, y: 8, scale: 0.96 } as const;
/** Seconds one part takes to pop in. */
export const POP_SECONDS = 0.45;
/** Seconds from the panel showing to its first part. */
export const LEAD_IN = 0.15;

/** A sequence whose tweens are pops unless they say otherwise. */
export function newSequence() {
  return gsap.timeline({ defaults: { duration: POP_SECONDS, ease: ease.out } });
}
