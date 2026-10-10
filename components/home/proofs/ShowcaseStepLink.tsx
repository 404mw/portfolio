// The showcase diagram's arrow inside the band, from `md` (ui-spec/07-proofs-spam.md): a hairline and
// a chevron from 12px after this step's figure to 12px before the next one, level with the figure's
// held symbol or prop (its height and start follow the figure kind, lib/showcaseFigures.ts).
// Decorative; the list gives the order.
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
import type { ShowcaseFigureKind } from "@/lib/showcaseDiagram";
import { showcaseFigureClasses } from "@/lib/showcaseFigures";

type ShowcaseStepLinkProps = {
  readonly figure: ShowcaseFigureKind;
};

export function ShowcaseStepLink({ figure }: ShowcaseStepLinkProps) {
  return (
    <span
      className={`absolute hidden h-3 items-center text-muted md:flex md:-right-6 lg:-right-8 xl:-right-12 ${showcaseFigureClasses[figure].link}`}
    >
      <span data-anim="showcase-link" className="h-px flex-1 origin-left bg-muted/50" />
      <span data-anim="showcase-chevron" className="-ml-1.5 shrink-0">
        <ChevronRightIcon className="size-3" />
      </span>
    </span>
  );
}
