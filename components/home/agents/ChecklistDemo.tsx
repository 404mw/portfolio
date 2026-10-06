// Checklist demo, finished state (ui-spec §4.4): a short list of work whose boxes turn to ticks,
// every box ticked, then the done pill. Each line's result is real text, so "done" is never the
// tick or the colour alone. The boxes are pictures of boxes, not inputs: nothing is interactive.
// Same motion contract as `LeadsDemo`: a row is an ordered part holding a hidden `demo-before`
// (the empty box), and its first ordered child (the ticked box) is what the row turns into.
import { DemoStatusPill } from "@/components/home/agents/DemoStatusPill";
import { CheckIcon } from "@/components/icons/CheckIcon";
import type { ChecklistDemoContent } from "@/lib/agents";
import { metaLabel } from "@/lib/styles";

type ChecklistDemoProps = { readonly demo: ChecklistDemoContent };

export function ChecklistDemo({ demo }: ChecklistDemoProps) {
  const { title, meta, items, done } = demo;
  return (
    <div className="flex flex-col gap-5">
      <p className="flex items-baseline justify-between gap-4">
        <span className="font-display text-summary font-semibold tracking-[-0.02em] text-text">
          {title}
        </span>
        <span className={metaLabel}>{meta}</span>
      </p>
      <ul className="flex flex-col gap-2.5">
        {items.map((item, index) => (
          <li
            key={item.text}
            data-demo-order={index + 1}
            className="flex items-center gap-3 rounded-xl border border-line bg-line/40 px-3.5 py-3 md:px-4.5 md:py-3.5"
          >
            <span
              data-anim="demo-before"
              aria-hidden="true"
              className="hidden size-5 shrink-0 rounded-md border border-muted"
            />
            <span
              data-demo-order={items.length + index + 1}
              className="grid size-5 shrink-0 place-items-center rounded-md bg-accent text-on-accent"
            >
              <CheckIcon className="size-3" />
            </span>
            <span className="min-w-0 flex-1 text-body text-text">{item.text}</span>
            <span className={`shrink-0 ${metaLabel}`}>{item.note}</span>
          </li>
        ))}
      </ul>
      <DemoStatusPill label={done} order={items.length * 2 + 1} className="self-start" />
    </div>
  );
}
