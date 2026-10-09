// Report demo, finished state (ui-spec §4.4): the period's chart, the latest bar in the accent,
// then the "sent" pill. The chart is decorative; its text alternative sits beside it.
// Bars sit in a grid, not a flex row, so their percentage heights resolve against the chart's
// height at every width (a flex row has no definite height below `lg`). Each bar carries
// `demo-bar` for the motion pass's hover; the latest also carries `data-bar="latest"`.
import { DemoStatusPill } from "@/components/home/agents/DemoStatusPill";
import type { ReportDemoContent } from "@/lib/agents";
import { metaLabel } from "@/lib/styles";

type ReportDemoProps = { readonly demo: ReportDemoContent };

export function ReportDemo({ demo }: ReportDemoProps) {
  const { title, week, bars, chartAlt, sent } = demo;
  const lastBar = bars.length - 1;
  return (
    <div className="flex h-full flex-col justify-end gap-5">
      <p className="flex items-baseline justify-between gap-4">
        <span className="font-display text-summary leading-[1.15] text-text">
          {title}
        </span>
        <span className={metaLabel}>{week}</span>
      </p>
      <div
        aria-hidden="true"
        className="grid min-h-40 flex-1 auto-cols-fr grid-flow-col items-end gap-2.5 border-b border-line"
      >
        {bars.map((height, index) => (
          <span
            key={index}
            data-demo-order={index + 1}
            data-anim="demo-bar"
            data-bar={index === lastBar ? "latest" : undefined}
            style={{ height: `${height}%` }}
            className={`block rounded-t-md ${index === lastBar ? "bg-accent" : "bg-line"}`}
          />
        ))}
      </div>
      <p className="sr-only">{chartAlt}</p>
      <DemoStatusPill label={sent} order={bars.length + 1} className="self-start" />
    </div>
  );
}
