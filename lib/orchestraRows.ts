// The orchestra swimlanes' eight rows (ui-spec §4.4, the table): time runs down, one card per row
// in one lane, each joined to the previous card by an L-shaped link. Data only; the classes live
// in OrchestraRow and OrchestraLink. `order` is the card's `data-demo-order` (rows 1–7 are 1–7,
// row 7's ticks take 8–10, row 8 is 11, the pill 12), for the motion pass.
import type { OrchestraRing } from "@/lib/agents";

export type OrchestraLane = "lead" | "team" | "checks";

/** Where a card's incoming link comes from: a lane to the left or right, or straight down. */
export type OrchestraLinkFrom = "left" | "right" | "down";

export type OrchestraRowSpec = {
  /** 1–8, the grid row and the `data-row` hook. */
  readonly row: number;
  readonly lane: OrchestraLane;
  readonly order: number;
  /** The numbered step in the card: its digit and its label's key in `ring`. */
  readonly step?: { readonly n: number; readonly key: keyof OrchestraRing };
  /** The lane whose three roles show as chips in the card. */
  readonly roles?: "team" | "checks";
  /** Row 7: each role chip carries its tick. */
  readonly ticks?: boolean;
  /** The incoming link from the previous card; none on row 1. */
  readonly link?: { readonly from: OrchestraLinkFrom; readonly lanes: 1 | 2 };
  /** The fix (rows 6 and 7): accent dashed link; row 6's card is accent dashed too. */
  readonly fix?: boolean;
};

/** The first tick's `data-demo-order`; the next two follow it. */
export const ORCHESTRA_TICK_ORDER = 8;
/** The done pill's `data-demo-order`. */
export const ORCHESTRA_PILL_ORDER = 12;

export const orchestraRows: readonly OrchestraRowSpec[] = [
  { row: 1, lane: "lead", order: 1, step: { n: 1, key: "out" } },
  { row: 2, lane: "team", order: 2, roles: "team", step: { n: 2, key: "rules" }, link: { from: "left", lanes: 1 } },
  { row: 3, lane: "team", order: 3, step: { n: 3, key: "work" }, link: { from: "down", lanes: 1 } },
  { row: 4, lane: "lead", order: 4, step: { n: 4, key: "check" }, link: { from: "right", lanes: 1 } },
  { row: 5, lane: "checks", order: 5, roles: "checks", link: { from: "left", lanes: 2 } },
  { row: 6, lane: "team", order: 6, step: { n: 5, key: "fix" }, link: { from: "right", lanes: 1 }, fix: true },
  { row: 7, lane: "checks", order: 7, roles: "checks", ticks: true, link: { from: "left", lanes: 1 }, fix: true },
  { row: 8, lane: "lead", order: 11, step: { n: 6, key: "pass" }, link: { from: "right", lanes: 2 } },
];
