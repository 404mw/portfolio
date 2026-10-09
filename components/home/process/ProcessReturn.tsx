// The loop's return to step 2, "your rules" (ui-spec §5.3): what the job taught goes back into the
// rules. Below `wide`: an icon and the label in a row. From `wide`: a dashed path from the last bot's
// centre back to step 2's, on the list's own column grid, with an arrowhead on step 2's end (the
// box's first child) and the label centred on its bottom edge, then the relay's return-lit overlay
// (hidden at rest; last, under the label). One label element at every width.
import { ChevronUpIcon } from "@/components/icons/ChevronUpIcon";
import { CornerUpLeftIcon } from "@/components/icons/CornerUpLeftIcon";
import type { FlowLayout } from "@/lib/processLayout";
import { monoLabel } from "@/lib/styles";

type ProcessReturnProps = {
  readonly layout: FlowLayout;
  readonly loopLabel: string;
};

export function ProcessReturn({ layout, loopLabel }: ProcessReturnProps) {
  return (
    <div
      data-anim="process-return-row"
      className={`flex items-center gap-3 border-t border-line pt-6 wide:grid ${layout.grid} wide:border-t-0 wide:pt-0`}
    >
      <CornerUpLeftIcon className="size-5 shrink-0 text-accent wide:hidden" />
      <div
        data-anim="process-return"
        className={`contents wide:relative ${layout.returnBox} wide:block wide:h-14 wide:rounded-b-2xl wide:border-2 wide:border-t-0 wide:border-dashed wide:border-accent`}
      >
        <ChevronUpIcon className="absolute -left-3.25 -top-2.5 hidden size-6 text-accent wide:block" />
        <p
          className={`${monoLabel} wide:absolute wide:inset-x-0 wide:z-10 wide:bottom-0 wide:translate-y-[calc(50%+1px)] wide:text-center`}
        >
          <span className="wide:bg-bg wide:px-5 wide:py-3">{loopLabel}</span>
        </p>
        <span
          aria-hidden="true"
          data-anim="process-return-lit"
          className="pointer-events-none absolute -inset-x-0.5 top-0.5 -bottom-0.5 hidden rounded-b-2xl border-2 border-t-0 border-accent opacity-0 wide:block"
        />
      </div>
    </div>
  );
}
