// One step of the showcase diagram (ui-spec/07-proofs-spam.md). On a phone the `<li>` is its own ink
// band: the figure at the right end, the ordinal, title and line on the band, and a down arrow on
// cream under it (every step but the last). From `md` the `<li>` is a column over the shared band
// (`ShowcaseStage`): the figure on the band's floor, the band's arrow to the next step, then the
// text on cream below. The heading and line are in the markup once for both layouts. It draws the
// figure its entry names: Eva's image (`image` kind) or Rix with a prop (`rix` kind); the layer's
// height follows the kind. The layer's clip lets the figure out above (and, from `md`, the arrow
// sideways) but never below the floor. The ordinal and arrows are decoration: the list gives the
// order.
import { InkStageGround } from "@/components/home/proofs/InkStageGround";
import { ShowcaseImageFigure } from "@/components/home/proofs/ShowcaseImageFigure";
import { ShowcaseRixFigure } from "@/components/home/proofs/ShowcaseRixFigure";
import { ShowcaseStepDown } from "@/components/home/proofs/ShowcaseStepDown";
import { ShowcaseStepLink } from "@/components/home/proofs/ShowcaseStepLink";
import { listNumber } from "@/lib/listNumber";
import type { ShowcaseFigureKind, ShowcaseImageStep, ShowcaseRixStep } from "@/lib/showcaseDiagram";
import { showcaseFigureClasses } from "@/lib/showcaseFigures";
import { metaLabel } from "@/lib/styles";

type ShowcaseStepProps = {
  readonly figure: ShowcaseFigureKind;
  readonly entry: ShowcaseImageStep | ShowcaseRixStep;
  readonly index: number;
  /** Whether this step points at the next one (every step but the last). */
  readonly pointsOn: boolean;
  readonly title: string;
  readonly line: string;
};

export function ShowcaseStep({ figure, entry, index, pointsOn, title, line }: ShowcaseStepProps) {
  return (
    <li
      data-anim="showcase-step"
      data-step={entry.key}
      className="relative flex min-h-30 items-center py-3 pr-37 pl-5 md:block md:min-h-0 md:p-0"
    >
      <InkStageGround glow="end" className="inset-0 rounded-3xl md:hidden" />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 [clip-path:inset(-50%_0_0_0_round_0_0_1.5rem_1.5rem)] md:relative md:inset-auto md:[clip-path:inset(-50%_-50%_0_-50%)] ${showcaseFigureClasses[figure].layer}`}
      >
        {"image" in entry ? (
          <ShowcaseImageFigure image={entry.image} />
        ) : (
          <ShowcaseRixFigure prop={entry.prop} pose={entry.pose} />
        )}
        {pointsOn && <ShowcaseStepLink figure={figure} />}
      </div>
      <div data-anim="showcase-step-text" className="relative flex min-w-0 flex-1 flex-col gap-1.5 md:gap-2 md:pt-5">
        <div className="flex items-baseline gap-3">
          <span aria-hidden="true" className={`${metaLabel} shrink-0 font-medium tracking-[0.06em] md:text-cream-muted`}>
            {listNumber(index)}
          </span>
          <h4 className="min-w-0 font-display text-summary leading-[1.15] text-text md:text-ink">{title}</h4>
        </div>
        <p className="max-w-xs text-body leading-normal text-muted md:text-cream-muted">{line}</p>
      </div>
      {pointsOn && <ShowcaseStepDown />}
    </li>
  );
}
