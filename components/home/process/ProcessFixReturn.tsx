// The fix loop (ui-spec §5.3a): inside a job, when the second check (step 5) finds a problem or a
// broken rule, the work goes back to step 4 and is checked again until it passes. The last child
// of step 4's `<li>` (`FIX_STEP`). Below `wide`: a marker row at the end of the step holding the
// label, which wraps, 14px right of a dotted `accent` bracket down the bot column's left edge, from
// bot 4's hand to bot 5's, placed against step 4's `relative` `<li>` and reaching into step 5's
// row; its arrowhead points onto bot 4, then its lit overlay (hidden at rest). From `wide`: a dashed
// arch over the gap between bots 4 and 5, its legs on their centres (the right edge from `fixBox`),
// the arrowhead down onto bot 4, and the label centred above it on a `bg` mask at `z-10`, so a
// relay job passing later goes behind it. Then the motion pass's lit overlay (hidden at rest). One
// label element at every width; the rest is decoration. Never animate `transform` or `opacity` on
// `process-fix`, `process-fix-line`, `process-fix-row` or step 4's `<li>`: motion writes the lit
// overlays only, and a stacking context would trap the label's `z-10`.
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
import { ChevronUpIcon } from "@/components/icons/ChevronUpIcon";
import { monoLabel } from "@/lib/styles";

type ProcessFixReturnProps = {
  /** The arch's right edge (lib/processLayout.ts). */
  readonly fixBox: string;
  readonly label: string;
};

export function ProcessFixReturn({ fixBox, label }: ProcessFixReturnProps) {
  return (
    <div data-anim="process-fix-row" className="col-span-2 mt-5 pl-4 wide:contents">
      <div
        aria-hidden="true"
        data-anim="process-fix-line"
        className="absolute -bottom-15.75 left-0 top-15 w-2.5 rounded-l-2xl border-2 border-r-0 border-dotted border-accent wide:hidden"
      >
        <ChevronRightIcon className="absolute -left-1.25 -top-3.25 size-6 text-accent" />
        <span
          data-anim="process-fix-line-lit"
          className="pointer-events-none absolute -inset-y-0.5 -left-0.5 right-0 rounded-l-2xl border-2 border-r-0 border-accent opacity-0"
        />
      </div>
      <div
        data-anim="process-fix"
        className={`contents wide:absolute wide:-top-12 wide:left-15.5 ${fixBox} wide:block wide:h-10 wide:rounded-t-2xl wide:border-2 wide:border-b-0 wide:border-dashed wide:border-accent`}
      >
        <ChevronUpIcon className="absolute -bottom-2.5 -left-3.25 hidden size-6 rotate-180 text-accent wide:block" />
        <p
          className={`${monoLabel} wide:absolute wide:bottom-full wide:left-1/2 wide:z-10 wide:mb-2 wide:-translate-x-1/2 wide:whitespace-nowrap wide:text-center`}
        >
          <span className="wide:bg-bg wide:px-3">{label}</span>
        </p>
        <span
          aria-hidden="true"
          data-anim="process-fix-lit"
          className="pointer-events-none absolute -inset-x-0.5 -top-0.5 bottom-0.5 hidden rounded-t-2xl border-2 border-b-0 border-accent opacity-0 wide:block"
        />
      </div>
    </div>
  );
}
