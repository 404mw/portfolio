// Sync demo, finished state (ui-spec §4.4): three linked things (tools, or a workflow's stages)
// joined by dashed connectors, each carrying a data packet, then three events and the done pill.
// Motion hooks: each tool is `data-sync-tool={i}` with a hidden `data-anim="sync-lit"` overlay (its
// lit state); each connector is `data-sync-link={i}` (0 joins tools 0 and 1, 1 joins 1 and 2) with
// its `demo-packet`; each event carries `data-sync-from` and `data-sync-to`, the tool indexes it
// runs between. With no JS the overlays stay invisible and the packets sit mid-connector.
import { Fragment } from "react";
import { DemoStatusPill } from "@/components/home/agents/DemoStatusPill";
import { syncToolIndex, type SyncDemoContent } from "@/lib/agents";
import { metaLabel } from "@/lib/styles";

type SyncDemoProps = { readonly demo: SyncDemoContent };

export function SyncDemo({ demo }: SyncDemoProps) {
  const { tools, events, done } = demo;
  return (
    <div className="flex flex-col gap-6 md:gap-9">
      <ul className="flex items-center">
        {tools.map((tool, index) => (
          <Fragment key={tool}>
            {index > 0 && (
              <li
                aria-hidden="true"
                data-sync-link={index - 1}
                className="relative h-px flex-1 border-t border-dashed border-line"
              >
                <span
                  data-anim="demo-packet"
                  className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_12px_var(--color-accent)]"
                />
              </li>
            )}
            <li
              data-sync-tool={index}
              className="relative rounded-xl border border-line bg-line/40 px-3.5 py-4 font-mono text-nav font-medium text-text"
            >
              {tool}
              <span
                aria-hidden="true"
                data-anim="sync-lit"
                className="pointer-events-none absolute inset-0 rounded-xl border border-accent opacity-0 shadow-[0_0_12px_var(--color-accent)]"
              />
            </li>
          </Fragment>
        ))}
      </ul>
      <ul className="grid gap-2 sm:grid-cols-3 sm:gap-2.5">
        {events.map((event, index) => (
          <li
            key={event.kind}
            data-demo-order={index + 1}
            data-sync-from={syncToolIndex(tools, event.from)}
            data-sync-to={syncToolIndex(tools, event.to)}
            className="flex justify-between gap-2 rounded-xl bg-line/40 p-3.5 sm:flex-col sm:justify-start"
          >
            <span className={metaLabel}>{event.kind}</span>
            <span className="text-small text-text">{event.result}</span>
          </li>
        ))}
      </ul>
      <DemoStatusPill label={done} order={events.length + 1} className="self-center" />
    </div>
  );
}
