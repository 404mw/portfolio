// The loop's return to step 1 (ui-spec §5.3). Below `lg`: an icon and the label in a row.
// From `lg`: a dashed path from bot 4's centre back to bot 1's, with an arrowhead on step 1's
// end and the label centred on its bottom edge. One label element at every width.
import { ChevronUpIcon } from "@/components/icons/ChevronUpIcon";
import { CornerUpLeftIcon } from "@/components/icons/CornerUpLeftIcon";
import { process } from "@/content/home";
import { monoLabel } from "@/lib/styles";

export function ProcessReturn() {
  return (
    <div className="flex items-center gap-3 border-t border-line pt-6 lg:grid lg:grid-cols-4 lg:gap-x-8 lg:border-t-0 lg:pt-0">
      <CornerUpLeftIcon className="size-5 shrink-0 text-accent lg:hidden" />
      <div className="contents lg:relative lg:col-span-3 lg:ml-15.5 lg:-mr-24 lg:block lg:h-14 lg:rounded-b-2xl lg:border-2 lg:border-t-0 lg:border-dashed lg:border-accent">
        <ChevronUpIcon className="absolute -left-3.25 -top-2.5 hidden size-6 text-accent lg:block" />
        <p
          className={`${monoLabel} lg:absolute lg:inset-x-0 lg:bottom-0 lg:translate-y-[calc(50%+1px)] lg:text-center`}
        >
          <span className="lg:bg-bg lg:px-4">{process.loopLabel}</span>
        </p>
      </div>
    </div>
  );
}
