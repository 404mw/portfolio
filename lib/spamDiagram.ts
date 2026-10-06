// The spam diagram's steps (ui-spec/07-proofs-spam.md): their keys, in order, and each step's figure.
// Words stay in content/home.ts.
import type { ImageName } from "@/lib/images";

/** The three steps, in the order they happen: it watches, it spots, it shuts it down. */
export const spamStepKeys = ["watch", "spot", "stop"] as const;

export type SpamStepKey = (typeof spamStepKeys)[number];

/** Each step's figure (ui-spec/07-proofs-spam.md, Images): Exile Bot's mascot holding that step's symbol. */
export const spamStepImage = {
  watch: "exileEvaWatch",
  spot: "exileEvaSpot",
  stop: "exileEvaStop",
} as const satisfies Record<SpamStepKey, ImageName>;

/** Whether a step's link ends in a chevron: every step but the last points at the next one. */
export function spamStepPointsOn(index: number): boolean {
  return index < spamStepKeys.length - 1;
}
