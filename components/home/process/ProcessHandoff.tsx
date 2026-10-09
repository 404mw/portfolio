// The hand-off to a person (ui-spec §5.11): step 3's flag bot sorts the job before any work, and
// anything sensitive or unusual leaves the row here for a person and never comes back. The last
// child of step 3's `<li>`, in a flow with loops only. Below `wide`: a marker row under the step's
// text, an arrow under ledge 3's right end pointing at the label. From `wide`: a dashed `accent` stem
// carrying the flag's pole upward, its arrowhead pointing up, and the label above it, its text
// ending at the stem, on a `bg` mask at `z-10`; then the motion pass's lit overlay (hidden at
// rest). One label element at every width; the rest is decoration. Never animate `transform` or
// `opacity` on `process-handoff`, `process-handoff-row`, `process-handoff-mark` or step 3's
// `<li>`: motion writes `process-handoff-lit` only, and a stacking context would trap the label's
// `z-10`.
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { ChevronUpIcon } from "@/components/icons/ChevronUpIcon";
import { monoLabel } from "@/lib/styles";

type ProcessHandoffProps = {
  /** Who the job goes to (content/home.ts → `process.flows[set].handoffLabel`). */
  readonly label: string;
};

export function ProcessHandoff({ label }: ProcessHandoffProps) {
  return (
    <div
      data-anim="process-handoff-row"
      className="col-span-2 mt-5 grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-x-4.5 wide:contents"
    >
      <span aria-hidden="true" data-anim="process-handoff-mark" className="justify-self-end wide:hidden">
        <ArrowRightIcon className="size-5 text-accent" />
      </span>
      <div
        data-anim="process-handoff"
        className="contents wide:absolute wide:-top-12 wide:left-27.5 wide:block wide:h-16 wide:w-0.5 wide:border-l-2 wide:border-dashed wide:border-accent"
      >
        <ChevronUpIcon className="absolute -left-3.25 -top-2.5 hidden size-6 text-accent wide:block" />
        <p
          className={`${monoLabel} wide:absolute wide:-right-3 wide:bottom-full wide:z-10 wide:mb-2 wide:whitespace-nowrap wide:text-right`}
        >
          <span className="wide:bg-bg wide:px-3">{label}</span>
        </p>
        <span
          aria-hidden="true"
          data-anim="process-handoff-lit"
          className="pointer-events-none absolute -left-0.5 inset-y-0 hidden w-0.5 bg-accent opacity-0 wide:block"
        />
      </div>
    </div>
  );
}
