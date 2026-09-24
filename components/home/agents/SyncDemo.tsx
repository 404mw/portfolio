// Connected tools demo, finished state (ui-spec §4.4): three tools joined by dashed
// connectors, each carrying a data packet, then three sync events and the "in sync" pill.
import { Fragment } from "react";
import { DemoStatusPill } from "@/components/home/agents/DemoStatusPill";
import { agents } from "@/content/home";
import { metaLabel } from "@/lib/styles";

export function SyncDemo() {
  const { tools, events, done } = agents.demos.sync;
  return (
    <div className="flex flex-col gap-6 md:gap-9">
      <ul className="flex items-center">
        {tools.map((tool, index) => (
          <Fragment key={tool}>
            {index > 0 && (
              <li aria-hidden="true" className="relative h-px flex-1 border-t border-dashed border-line">
                <span
                  data-anim="demo-packet"
                  className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_12px_var(--color-accent)]"
                />
              </li>
            )}
            <li className="rounded-xl border border-line bg-line/40 px-3.5 py-4 font-mono text-nav font-medium text-text">
              {tool}
            </li>
          </Fragment>
        ))}
      </ul>
      <ul className="grid gap-2 sm:grid-cols-3 sm:gap-2.5">
        {events.map((event, index) => (
          <li
            key={event.kind}
            data-demo-order={index + 1}
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
