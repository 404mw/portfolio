// The spam diagram's one swappable figure (ui-spec/07-proofs-spam.md): Exile Bot's mascot holding the
// step's symbol, in a bottom-anchored square box so the file's waist cut lands on the band's floor.
// 148 flush right on a phone; 144 / 192 / 248 at `md` / `lg` / `xl`, 8 / 16 / 32 in from the column.
// Decorative: the step's heading and line say what it shows. Takes the step key only, so a later
// change replaces this file's contents and nothing else.
import { SiteImage } from "@/components/SiteImage";
import { spamStepImage, type SpamStepKey } from "@/lib/spamDiagram";

type SpamStepFigureProps = {
  readonly step: SpamStepKey;
};

export function SpamStepFigure({ step }: SpamStepFigureProps) {
  return (
    <span
      data-anim="spam-tile"
      className="absolute right-0 bottom-0 block size-37 origin-bottom md:right-auto md:left-2 md:size-36 lg:left-4 lg:size-48 xl:left-8 xl:size-62"
    >
      <SiteImage
        name={spamStepImage[step]}
        alt=""
        sizes="(min-width: 1280px) 248px, (min-width: 1024px) 192px, (min-width: 768px) 144px, 148px"
        fit="contain"
        position="bottom"
      />
    </span>
  );
}
