// The hand-off to a person (ui-spec §5.11): step 3's flag bot sorts the job before any work, and
// anything sensitive or unusual leaves the row here for a person and never comes back. The last
// child of step 3's `<li>`, in a flow with loops only. Below `lg`: a marker row under the step's
// text, an arrow under ledge 3's right end pointing at the label. From `lg`: a dashed `accent` stem
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
      className="col-span-2 mt-5 grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-x-4.5 lg:contents"
    >
      <span aria-hidden="true" data-anim="process-handoff-mark" className="justify-self-end lg:hidden">
        <ArrowRightIcon className="size-5 text-accent" />
      </span>
      <div
        data-anim="process-handoff"
        className="contents lg:absolute lg:-top-12 lg:left-27.5 lg:block lg:h-16 lg:w-0.5 lg:border-l-2 lg:border-dashed lg:border-accent"
      >
        <ChevronUpIcon className="absolute -left-3.25 -top-2.5 hidden size-6 text-accent lg:block" />
        <p
          className={`${monoLabel} lg:absolute lg:-right-3 lg:bottom-full lg:z-10 lg:mb-2 lg:whitespace-nowrap lg:text-right`}
        >
          <span className="lg:bg-bg lg:px-3">{label}</span>
        </p>
        <span
          aria-hidden="true"
          data-anim="process-handoff-lit"
          className="pointer-events-none absolute -left-0.5 inset-y-0 hidden w-0.5 bg-accent opacity-0 lg:block"
        />
      </div>
    </div>
  );
}
