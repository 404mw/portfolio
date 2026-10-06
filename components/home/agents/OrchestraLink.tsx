// One L-shaped connector in the orchestra swimlanes (ui-spec §4.4), drawn inside the cell it
// enters: its vertical leg drops from the previous card's bottom (one row gap up) on the previous
// lane's centre, and its horizontal leg ends at this card's side, mid-height, with an arrowhead.
// Straight down (same lane) is a short vertical line into the card's top. Every offset is a
// percentage of the cell (one lane wide; the card fills its middle 90%), so the lines hold at every
// width with no breakpoint. The fix links are 2px dashed accent. A picture: the caller's diagram is
// `aria-hidden`. `data-link` is the row it enters; `data-fix` marks the fix, for the motion pass.
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
import { ChevronUpIcon } from "@/components/icons/ChevronUpIcon";
import type { OrchestraLinkFrom } from "@/lib/orchestraRows";

type OrchestraLinkProps = {
  readonly from: OrchestraLinkFrom;
  /** How many lanes the horizontal leg crosses (1 or 2); ignored straight down. */
  readonly lanes: 1 | 2;
  /** The fix: 2px dashed accent. */
  readonly fix?: boolean;
  /** The row this link enters (2–8). */
  readonly row: number;
};

/** The span's box and its corner, per direction and lane count. */
const shape: Record<Exclude<OrchestraLinkFrom, "down">, Record<1 | 2, string>> = {
  left: {
    1: "-top-4 bottom-1/2 sm:-top-5 -left-1/2 right-[95%] rounded-bl-lg",
    2: "-top-4 bottom-1/2 sm:-top-5 left-[-150%] right-[95%] rounded-bl-lg",
  },
  right: {
    1: "-top-4 bottom-1/2 sm:-top-5 left-[95%] -right-1/2 rounded-br-lg",
    2: "-top-4 bottom-1/2 sm:-top-5 left-[95%] right-[-150%] rounded-br-lg",
  },
};

/** The two borders that draw the legs: plain 1px muted, or the fix's 2px dashed accent. */
const legs: Record<Exclude<OrchestraLinkFrom, "down">, Record<"plain" | "fix", string>> = {
  left: { plain: "border-b border-l border-muted", fix: "border-b-2 border-l-2 border-dashed border-accent" },
  right: { plain: "border-b border-r border-muted", fix: "border-b-2 border-r-2 border-dashed border-accent" },
};

export function OrchestraLink({ from, lanes, fix = false, row }: OrchestraLinkProps) {
  const hooks = { "data-anim": "orch-link", "data-link": row, ...(fix ? { "data-fix": "" } : {}) };
  const arrow = fix ? "text-accent" : "text-muted";

  if (from === "down") {
    return (
      <span
        {...hooks}
        className={`absolute -top-4 left-1/2 h-4 sm:-top-5 sm:h-5 ${fix ? "border-l-2 border-dashed border-accent" : "border-l border-muted"}`}
      >
        <ChevronUpIcon className={`absolute -bottom-1.5 left-0 size-4 -translate-x-1/2 rotate-180 ${arrow}`} />
      </span>
    );
  }

  return (
    <span {...hooks} className={`absolute ${shape[from][lanes]} ${legs[from][fix ? "fix" : "plain"]}`}>
      <ChevronRightIcon
        className={`absolute bottom-0 size-4 translate-y-1/2 ${from === "left" ? "-right-1.5" : "-left-1.5 rotate-180"} ${arrow}`}
      />
    </span>
  );
}
