// The showcase diagrams (ui-spec/07-proofs-spam.md, 2026-10-10): for each project that has one, its
// figure kind, its step keys in order with each step's figure, and where its way back goes. The
// kind belongs to the diagram (one stage fits one kind), the figure to the step. Words stay in
// content/home.ts.
import type { ImageName } from "@/lib/images";
import type { BotPose } from "@/lib/processBots";
import type { ProofKey } from "@/lib/proofs";
import type { RixPropName } from "@/lib/rixProps";

/** The figure kinds: Eva's images (Exile) or Rix holding a prop (MARWIX-SKILLS). */
export type ShowcaseFigureKind = "image" | "rix";

/** Where the way back goes: a U back to step 1, or a loop on the last step. */
export type ShowcaseReturnTo = "first" | "last";

/** An `image` step: its key and the figure's image. */
export type ShowcaseImageStep = { readonly key: string; readonly image: ImageName };

/** A `rix` step: its key, the prop Rix holds and his pose. */
export type ShowcaseRixStep = { readonly key: string; readonly prop: RixPropName; readonly pose: BotPose };

export type ShowcaseDiagramData =
  | { readonly figure: "image"; readonly steps: readonly ShowcaseImageStep[]; readonly returnTo: ShowcaseReturnTo }
  | { readonly figure: "rix"; readonly steps: readonly ShowcaseRixStep[]; readonly returnTo: ShowcaseReturnTo };

export const showcaseDiagrams = {
  // It watches, it spots, it shuts it down; the shutdown undoes itself, back to step 1.
  exile: {
    figure: "image",
    steps: [
      { key: "watch", image: "exileEvaWatch" },
      { key: "spot", image: "exileEvaSpot" },
      { key: "stop", image: "exileEvaStop" },
    ],
    returnTo: "first",
  },
  // It plans the look, writes the prompt, makes the image; a wrong image is one edit on step 3.
  // Rix stays `idle` on all three (rev 2): facing the reader, he holds each step out.
  marwixSkills: {
    figure: "rix",
    steps: [
      { key: "look", prop: "palette", pose: "idle" },
      { key: "prompt", prop: "prompt", pose: "idle" },
      { key: "image", prop: "picture", pose: "idle" },
    ],
    returnTo: "last",
  },
} as const satisfies Partial<Record<ProofKey, ShowcaseDiagramData>>;

/** A project that has a showcase diagram. */
export type ShowcaseProject = keyof typeof showcaseDiagrams;

/** A showcase project's step keys, in its diagram's order. */
export type ShowcaseStepKey<P extends ShowcaseProject> = (typeof showcaseDiagrams)[P]["steps"][number]["key"];

/** True when the project has a showcase diagram. */
export function hasShowcaseDiagram(key: ProofKey): key is ShowcaseProject {
  return key in showcaseDiagrams;
}

/** Whether a step's link ends in a chevron: every step but the last points at the next one. */
export function showcaseStepPointsOn(index: number, stepCount: number): boolean {
  return index < stepCount - 1;
}
