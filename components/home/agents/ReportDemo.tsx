// Recurring reports demo, finished state (ui-spec §4.4): the week's chart, this week in the
// accent, then the "sent" pill. The chart is decorative; its text alternative sits beside it.
// Bars sit in a grid, not a flex row, so their percentage heights resolve against the chart's
// height at every width (a flex row has no definite height below `lg`).
import { DemoStatusPill } from "@/components/home/agents/DemoStatusPill";
import { agents } from "@/content/home";
import { metaLabel } from "@/lib/styles";

export function ReportDemo() {
  const { title, week, bars, chartAlt, sent } = agents.demos.report;
  const lastBar = bars.length - 1;
  return (
    <div className="flex h-full flex-col justify-end gap-5">
      <p className="flex items-baseline justify-between gap-4">
        <span className="font-display text-summary font-semibold tracking-[-0.02em] text-text">
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
