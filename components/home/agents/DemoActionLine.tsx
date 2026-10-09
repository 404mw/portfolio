// The action line, finished state (ui-spec 04-agents-action §4.10): a small receipt inside a demo
// that says what the agent did and where the reader finds it. Full width and on neither speaker's
// side, so it never reads as a third bubble: an `accent` outline with no fill, and the Checklist's
// ticked box on the left. A picture, not a control: no hover, focus or tap target. The empty box
// is in the markup but hidden; the motion pass swaps it for the tick. Its own hooks
// (`demo-action-*`), never `demo-before`, so the list and checklist replays don't take it for a row.
import { CheckIcon } from "@/components/icons/CheckIcon";
import { agents } from "@/content/home";
import type { DemoAction } from "@/lib/agents";
import { metaLabel } from "@/lib/styles";

type DemoActionLineProps = {
  readonly action: DemoAction;
  /** Its place in the demo's sequence (`data-demo-order`). */
  readonly order: number;
};

export function DemoActionLine({ action, order }: DemoActionLineProps) {
  return (
    <p
      data-anim="demo-action"
      data-demo-order={order}
      className="flex w-full items-start gap-3 rounded-xl border border-accent px-3.5 py-3 md:px-4.5"
    >
      <span
        data-anim="demo-action-pending"
        aria-hidden="true"
        className="mt-0.5 hidden size-5 shrink-0 rounded-md border border-muted"
      />
      <span
        data-anim="demo-action-tick"
        aria-hidden="true"
        className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-md bg-accent text-on-accent"
      >
        <CheckIcon className="size-3" />
      </span>
      <span className="flex min-w-0 flex-1 flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 wrap-break-word">
        <span className="sr-only">{agents.demoAction}: </span>
        <span className="text-body font-medium text-text">{action.text}</span>
        <span className={metaLabel}>{action.where}</span>
      </span>
    </p>
  );
}
