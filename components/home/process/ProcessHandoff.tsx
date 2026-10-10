// The hand-off to a person (ui-spec §5.11): step 3's flag bot sorts the job before any work, and
// anything sensitive or unusual leaves the row here for a person and never comes back. The last
// child of step 3's `<li>`, in a flow with loops only. Below `wide`: a marker row under the step's
// text, an arrow under ledge 3's right end pointing at the label. From `wide`: a dashed `accent`
// elbow, one box with a left and a top border. Its left border carries the flag's pole straight up
// (x 110–112 of step 3's column, from 16px below the list's top) past the fix arch and its label;
// a rounded corner turns it right, and its top border runs 112px above the list's top, over the
// fix arch's label, to the list's right end (the right edge from `handoffBox`), where a
// right-pointing arrowhead's tip stops: the job leaves the flow. The label sits above that right
// end, its text ending at the tip, on a `bg` mask at `z-10`; then the motion pass's lit overlay
// (the same shape, solid, hidden at rest). One label element at every width; the rest is
// decoration. Never animate `transform` or `opacity` on `process-handoff`, `process-handoff-row`,
// `process-handoff-mark` or step 3's `<li>`: motion writes `process-handoff-lit` only, and a
// stacking context would trap the label's `z-10`.
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
import { monoLabel } from "@/lib/styles";

type ProcessHandoffProps = {
  /** The elbow's right edge (lib/processLayout.ts). */
  readonly handoffBox: string;
  /** Who the job goes to (content/home.ts → `process.flows[set].handoffLabel`). */
  readonly label: string;
};

export function ProcessHandoff({ handoffBox, label }: ProcessHandoffProps) {
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
        className={`contents wide:absolute wide:-top-28 wide:left-27.5 ${handoffBox} wide:block wide:h-32 wide:rounded-tl-2xl wide:border-l-2 wide:border-t-2 wide:border-dashed wide:border-accent`}
      >
        <ChevronRightIcon className="absolute -right-2 -top-3.25 hidden size-6 text-accent wide:block" />
        <p
          className={`${monoLabel} wide:absolute wide:-right-3 wide:bottom-full wide:z-10 wide:mb-2 wide:whitespace-nowrap wide:text-right`}
        >
          <span className="wide:bg-bg wide:px-3">{label}</span>
        </p>
        <span
          aria-hidden="true"
          data-anim="process-handoff-lit"
          className="pointer-events-none absolute -left-0.5 -top-0.5 bottom-0 right-0 hidden rounded-tl-2xl border-l-2 border-t-2 border-accent opacity-0 wide:block"
        />
      </div>
    </div>
  );
}
