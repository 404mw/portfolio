// One step of the spam diagram (ui-spec/07-proofs-spam.md). On a phone the `<li>` is its own ink
// band: Eva at the right end with her head breaking out above it, the ordinal, title and line on the
// band, and a down arrow on cream under it (steps 1 and 2). From `md` the `<li>` is a column over the
// shared band (`SpamStage`): Eva on the band's floor, the band's arrow to the next step (steps 1 and
// 2), then the text on cream below. The heading and line are in the markup once for both layouts.
// The figure layer's clip lets Eva out above (and, from `md`, the arrow sideways) but never below the
// floor. The ordinal and arrows are decoration: the list gives the order.
import { InkStageGround } from "@/components/home/proofs/InkStageGround";
import { SpamStepDown } from "@/components/home/proofs/SpamStepDown";
import { SpamStepFigure } from "@/components/home/proofs/SpamStepFigure";
import { SpamStepLink } from "@/components/home/proofs/SpamStepLink";
import { listNumber } from "@/lib/listNumber";
import { spamStepPointsOn, type SpamStepKey } from "@/lib/spamDiagram";
import { condensed, metaLabel } from "@/lib/styles";

type SpamStepProps = {
  readonly step: SpamStepKey;
  readonly index: number;
  readonly title: string;
  readonly line: string;
};

export function SpamStep({ step, index, title, line }: SpamStepProps) {
  const pointsOn = spamStepPointsOn(index);

  return (
    <li
      data-anim="spam-step"
      data-step={step}
      className="relative flex min-h-30 items-center py-3 pr-37 pl-5 md:block md:min-h-0 md:p-0"
    >
      <InkStageGround glow="end" className="inset-0 rounded-3xl md:hidden" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [clip-path:inset(-50%_0_0_0_round_0_0_1.5rem_1.5rem)] md:relative md:inset-auto md:h-36 md:[clip-path:inset(-50%_-50%_0_-50%)] lg:h-48 xl:h-62"
      >
        <SpamStepFigure step={step} />
        {pointsOn && <SpamStepLink />}
      </div>
      <div className="relative flex min-w-0 flex-1 flex-col gap-1.5 md:gap-2 md:pt-5">
        <div className="flex items-baseline gap-3">
          <span aria-hidden="true" className={`${metaLabel} shrink-0 font-medium tracking-[0.06em] md:text-cream-muted`}>
            {listNumber(index)}
          </span>
          <h4
            className={`min-w-0 font-display text-summary leading-[1.05] font-semibold tracking-[-0.02em] text-text md:text-ink ${condensed}`}
          >
            {title}
          </h4>
        </div>
        <p className="max-w-xs text-body leading-normal text-muted md:text-cream-muted">{line}</p>
      </div>
      {pointsOn && <SpamStepDown />}
    </li>
  );
}
