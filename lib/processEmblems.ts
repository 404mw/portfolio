// The job each flow follows (ui-spec §5.10): the emblem step 1's bot holds, and the relay's job.
// A card's flow uses that card's emblem (lib/rixProps.ts, through `aboutReplyProp`); `default`
// uses the plain job sheet: the built relay job (lib/processJob.ts) moved into the prop slot by
// (106, 26), written out as its own paths so the markup holds no transform. Colour keys map
// through `botFills`. All in the bots' viewBox, prop slot x 106–130, y 23–50.
import type { AboutSet } from "@/lib/aboutPick";
import { aboutReplyProp } from "@/lib/aboutReplies";
import { rixProps, type RixPropName, type RixPropPart } from "@/lib/rixProps";

export type FlowEmblem = {
  /** `data-prop` on the held emblem, `data-emblem` on the relay's job; `job` is the sheet. */
  readonly name: "job" | RixPropName;
  readonly parts: readonly RixPropPart[];
};

/** The plain job sheet: `default`'s job. */
export const jobSheet: FlowEmblem = {
  name: "job",
  parts: [
    { d: "M106 26H124L130 32V50H106Z", colour: "C" }, // sheet
    { d: "M109 30h11v2.5h-11Z", colour: "I" }, // rule
    { d: "M109 35h7v2.5h-7Z", colour: "I" }, // rule
    { d: "M124 26V32H130Z", colour: "D" }, // fold
  ],
};

/** The job a set's flow follows. */
export function processEmblem(set: AboutSet): FlowEmblem {
  if (set === "default") return jobSheet;
  const name = aboutReplyProp[set] ?? null;
  return name === null ? jobSheet : { name, parts: rixProps[name].parts };
}
