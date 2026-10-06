// List demo, finished state (ui-spec §4.4): three people, each row turned to done. The done pill
// reads the row's own label where it has one, else the shared one. The "new" pills are in the
// markup but hidden; the motion pass swaps them for the done pill.
import { DemoStatusPill } from "@/components/home/agents/DemoStatusPill";
import type { LeadsDemoContent } from "@/lib/agents";
import { metaLabel } from "@/lib/styles";

type LeadsDemoProps = { readonly demo: LeadsDemoContent };

export function LeadsDemo({ demo }: LeadsDemoProps) {
  const { rows, statusNew, statusDone } = demo;
  return (
    <ul className="flex flex-col gap-2.5">
      {rows.map((row, index) => (
        <li
          key={row.name}
          data-demo-order={index + 1}
          className="flex items-center justify-between gap-3 rounded-xl border border-line bg-line/40 px-3.5 py-3.5 md:px-4.5 md:py-4"
        >
          <span className="flex min-w-0 items-center gap-3">
            <span
              aria-hidden="true"
              className="grid size-8 shrink-0 place-items-center rounded-full bg-line font-mono text-nav font-medium text-muted md:size-9"
            >
              {row.initials}
            </span>
            <span className="flex min-w-0 flex-col wrap-break-word">
              <span className="text-body font-medium text-text">{row.name}</span>
              <span className={metaLabel}>{row.source}</span>
            </span>
          </span>
          <span
            data-anim="demo-before"
            className="hidden rounded-full border border-line px-3 py-1.5 font-mono text-meta whitespace-nowrap text-muted"
          >
            {statusNew}
          </span>
          <DemoStatusPill label={row.done ?? statusDone} order={rows.length + index + 1} />
        </li>
      ))}
    </ul>
  );
}
