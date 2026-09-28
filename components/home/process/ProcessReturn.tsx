// The loop's return to step 1 (ui-spec §5.3). Below `lg`: an icon and the label in a row.
// From `lg`: a dashed path from bot 4's centre back to bot 1's, with an arrowhead on step 1's
// end (the box's first child) and the label centred on its bottom edge, then the relay's
// return-lit overlay (hidden at rest; last, under the label). One label element at every width.
// Below `lg` the row's top edge (found via `process-return-row`) is the hairline the relay's job
// drops to after bot 4 (ui-spec §5.9).
import { ChevronUpIcon } from "@/components/icons/ChevronUpIcon";
import { CornerUpLeftIcon } from "@/components/icons/CornerUpLeftIcon";
import { process } from "@/content/home";
import { monoLabel } from "@/lib/styles";

export function ProcessReturn() {
  return (
    <div
      data-anim="process-return-row"
      className="flex items-center gap-3 border-t border-line pt-6 lg:grid lg:grid-cols-4 lg:gap-x-8 lg:border-t-0 lg:pt-0"
    >
      <CornerUpLeftIcon className="size-5 shrink-0 text-accent lg:hidden" />
      <div
        data-anim="process-return"
        className="contents lg:relative lg:col-span-3 lg:ml-15.5 lg:-mr-24 lg:block lg:h-14 lg:rounded-b-2xl lg:border-2 lg:border-t-0 lg:border-dashed lg:border-accent"
      >
        <ChevronUpIcon className="absolute -left-3.25 -top-2.5 hidden size-6 text-accent lg:block" />
        <p
          className={`${monoLabel} lg:absolute lg:inset-x-0 lg:z-10 lg:bottom-0 lg:translate-y-[calc(50%+1px)] lg:text-center`}
        >
          <span className="lg:bg-bg lg:px-5 lg:py-3">{process.loopLabel}</span>
        </p>
        <span
          aria-hidden="true"
          data-anim="process-return-lit"
          className="pointer-events-none absolute -inset-x-0.5 top-0.5 -bottom-0.5 hidden rounded-b-2xl border-2 border-t-0 border-accent opacity-0 lg:block"
        />
      </div>
    </div>
  );
}
