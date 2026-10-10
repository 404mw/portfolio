// The showcase diagram's one ink band from `md` (ui-spec/07-proofs-spam.md): drawn behind the step
// list, its bottom edge the figures' floor. Its top and height follow the figure kind
// (lib/showcaseFigures.ts): Eva's overhang, or Rix's band with his peaks above it. Hidden on a
// phone, where each step draws its own band. Decorative.
import { InkStageGround } from "@/components/home/proofs/InkStageGround";
import type { ShowcaseFigureKind } from "@/lib/showcaseDiagram";
import { showcaseFigureClasses } from "@/lib/showcaseFigures";

type ShowcaseStageProps = {
  readonly figure: ShowcaseFigureKind;
};

export function ShowcaseStage({ figure }: ShowcaseStageProps) {
  return (
    <InkStageGround
      glow="floor"
      className={`inset-x-0 hidden rounded-3xl md:block ${showcaseFigureClasses[figure].stage}`}
    />
  );
}
