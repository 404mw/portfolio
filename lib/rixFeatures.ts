// Which Rix gets what (ui-spec/00-rix.md R9, R10, R12.3). Both hosts get the whole character
// sheet: emotions and emote glyphs, the walk, typed talk, the plays, the nap, tag, the poke ladder,
// the pet and love, and the patrol. Home's About Rix (`b`) runs every scheduler and patrols from
// landing. The /rix playground (docs/pages/rix/ui-spec.md §0.4) turns every scheduler off (no
// nudges, plays, nap timer, tag or walks to targets; the patrol waits for its toggle) and keeps
// life; its buttons play the moves, and poking or petting him runs the real ladder and pet. Its
// quip sits above him (no R5.3 side); with no cards its patrol pauses look at the pointer, out at
// the visitor or down the floor to a shelf end, and a tossed prop lands on the floor line.
import type { AboutOption } from "@/lib/aboutScope";

/** A Rix instance: home's About Rix, or the /rix playground's. */
export type RixHost = AboutOption | "playground";

export type RixFeatures = {
  /** Nudges, the play clock, the nap timer, tag and walks to hovered or focused targets. */
  readonly schedulers: boolean;
  /** R4.8: the patrol, from landing (`auto`) or behind the playground's toggle (`toggle`). */
  readonly patrol: "auto" | "toggle";
  /** R5.3: the quip takes the side with room (`side`), or sits above him at every width (`above`). */
  readonly quip: "side" | "above";
  /**
   * What lies below the shelf: B's cards, or the playground's bare floor. It sets R4.8's pause looks
   * (a card below him among them, or a shelf end instead) and where a toss lands (R6A.4: into the
   * gap above the cards, or on the floor line, so no paint leaves the stage).
   */
  readonly stage: "cards" | "floor";
};

export const rixFeatures: Readonly<Record<RixHost, RixFeatures>> = {
  b: { schedulers: true, patrol: "auto", quip: "side", stage: "cards" },
  playground: { schedulers: false, patrol: "toggle", quip: "above", stage: "floor" },
};
