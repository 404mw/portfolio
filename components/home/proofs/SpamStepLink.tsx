// The spam diagram's arrow inside the band, from `md` (ui-spec/07-proofs-spam.md): a hairline and a
// chevron from 12px after this step's figure to 12px before the next one, at about 39% of the
// figure's height above the floor, level with the symbol in her hand. Decorative; the list gives
// the order.
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";

export function SpamStepLink() {
  return (
    <span className="absolute hidden h-3 items-center text-muted md:bottom-12.5 md:-right-6 md:left-41 md:flex lg:bottom-17.25 lg:-right-8 lg:left-55 xl:bottom-22.75 xl:-right-12 xl:left-73">
      <span data-anim="spam-link" className="h-px flex-1 origin-left bg-muted/50" />
      <span data-anim="spam-chevron" className="-ml-1.5 shrink-0">
        <ChevronRightIcon className="size-3" />
      </span>
    </span>
  );
}
