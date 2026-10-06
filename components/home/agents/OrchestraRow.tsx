// One row of the orchestra swimlanes (ui-spec §4.4): the cell in its lane and row, holding its
// incoming link and its card. The card's first line is its lane's title (Lead's in the accent),
// then the lane's role chips where the row has them (row 7's with ticks), then its numbered step.
// Lead cards take the accent border; the fix card (row 6) a dashed accent one. A picture inside
// the caller's `aria-hidden` diagram; the `orch-*` hooks and `data-demo-order` are for the motion pass.
import { OrchestraLink } from "@/components/home/agents/OrchestraLink";
import { OrchestraStep } from "@/components/home/agents/OrchestraStep";
import { CheckIcon } from "@/components/icons/CheckIcon";
import type { OrchestraDemoContent } from "@/lib/agents";
import { ORCHESTRA_TICK_ORDER, type OrchestraLane, type OrchestraRowSpec } from "@/lib/orchestraRows";

type OrchestraRowProps = {
  readonly spec: OrchestraRowSpec;
  readonly demo: OrchestraDemoContent;
};

/** The cell's column per lane (literal strings, so Tailwind sees them). */
const column: Record<OrchestraLane, string> = {
  lead: "col-start-1",
  team: "col-start-2",
  checks: "col-start-3",
};

/** The cell's grid row, 1–8 (literal strings, so Tailwind sees them). */
const gridRow: Record<number, string> = {
  1: "row-start-1",
  2: "row-start-2",
  3: "row-start-3",
  4: "row-start-4",
  5: "row-start-5",
  6: "row-start-6",
  7: "row-start-7",
  8: "row-start-8",
};

const cell = "relative px-[5%]";
const card = "relative flex min-w-0 flex-col gap-1 rounded-lg border bg-band px-1.5 pb-1.5 pt-3.5 sm:p-2";
const laneTitle = "font-mono text-meta uppercase leading-4 tracking-[0.06em] wrap-break-word";
const roles = "flex flex-col items-start gap-1 sm:flex-row sm:flex-wrap";
const role = "inline-flex max-w-full items-center gap-1 rounded-md bg-line px-1 text-meta leading-4 text-text sm:leading-5";

export function OrchestraRow({ spec, demo }: OrchestraRowProps) {
  const { row, lane, order, step, link, fix = false, ticks = false } = spec;
  const title = lane === "lead" ? demo.lead : demo[lane].label;
  // Only the fix card itself (row 6, the one with a step) is dashed; row 7's checks card is plain.
  const cardBorder = fix && step ? "border-dashed border-accent" : lane === "lead" ? "border-accent" : "border-line";
  const roleNames = spec.roles ? demo[spec.roles].roles : [];

  return (
    <div
      data-anim="orch-row"
      data-row={row}
      data-lane={lane}
      data-demo-order={order}
      className={`${cell} ${column[lane]} ${gridRow[row]}`}
    >
      {link && <OrchestraLink from={link.from} lanes={link.lanes} fix={fix} row={row} />}
      <div data-anim="orch-card" className={`${card} ${cardBorder}`}>
        <p className={`${laneTitle} ${lane === "lead" ? "text-accent" : "text-muted"}`}>{title}</p>
        {roleNames.length > 0 && (
          <ul className={roles}>
            {roleNames.map((name, index) => (
              <li key={name} data-anim="orch-role" className={role}>
                {name}
                {ticks && (
                  <span
                    data-anim="orch-tick"
                    data-demo-order={ORCHESTRA_TICK_ORDER + index}
                    className="text-accent"
                  >
                    <CheckIcon className="size-3" />
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
        {step && <OrchestraStep step={step.n} label={demo.ring[step.key]} accent={fix} />}
      </div>
    </div>
  );
}
