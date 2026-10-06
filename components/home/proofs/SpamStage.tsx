// The spam diagram's one ink band from `md` (ui-spec/07-proofs-spam.md): drawn behind the step list,
// its top edge the figures' overhang down from the list's top (28 / 36 / 48) and its bottom edge the
// figures' floor (heights 116 / 156 / 200), so every waist cut sits on it. Hidden on a phone, where
// each step draws its own band. Decorative.
import { InkStageGround } from "@/components/home/proofs/InkStageGround";

export function SpamStage() {
  return (
    <InkStageGround
      glow="floor"
      className="inset-x-0 top-7 hidden h-29 rounded-3xl md:block lg:top-9 lg:h-39 xl:top-12 xl:h-50"
    />
  );
}
