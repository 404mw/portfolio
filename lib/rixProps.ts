// Rix's props (ui-spec 02a-about-options §2a.O0.1): the small emblem he holds in his right hand
// for each group, in the bots' viewBox (-30 -18 170 110), just right of the hand tip and inside
// x ≤ 130. Flat token fills with 45° cuts. `flourish` names the part the pick act moves and
// gives its pivot, so the motion never measures the SVG. Shared by RixProps and AboutPropGlyph, and
// (`palette`, `prompt`, `picture`) by the MARWIX-SKILLS showcase diagram (ui-spec/07-proofs-spam.md).
import type { BotColour } from "@/lib/processBots";

/**
 * The cards' emblems (02a-about-options §2a.R2): `calendar`, `parcel`, `bubble`, `code`.
 * `shield`, `send`, `report` and `envelope` are held by no card; they stay for the motion pass.
 * `palette`, `prompt` and `picture` are held by no card: they are the MARWIX-SKILLS showcase's three
 * steps (look, prompt, image), each topping out at y 26 or lower so the ink band's edge clears them.
 */
export type RixPropName =
  | "calendar"
  | "parcel"
  | "bubble"
  | "code"
  | "shield"
  | "send"
  | "report"
  | "envelope"
  | "palette"
  | "prompt"
  | "picture";

/** A flourish part's hook (`data-prop-part`); "whole" props flourish as one group. */
export type RixPropPartHook = "tick" | "bar" | "flap" | "caret";

export type RixPropPart = {
  readonly d: string;
  readonly colour: BotColour;
  readonly hook?: RixPropPartHook;
};

export type RixProp = {
  readonly parts: readonly RixPropPart[];
  /** Each flourish part's pivot in viewBox units, in part order ("whole" = the group's). */
  readonly pivots: readonly (readonly [number, number])[];
};

export const rixProps: Record<RixPropName, RixProp> = {
  calendar: {
    parts: [
      { d: "M106 26H130V48H106Z", colour: "C" },
      { d: "M106 26H130V31H106Z", colour: "I" },
      { d: "M110 23h3v5h-3Z M123 23h3v5h-3Z", colour: "M" },
      { d: "M112 39L114.5 36.5L117 39L122.5 33.5L125 36L117 44Z", colour: "I", hook: "tick" },
    ],
    pivots: [[118.5, 38.5]],
  },
  parcel: {
    parts: [
      { d: "M106 30H130V50H106Z", colour: "C" }, // box
      { d: "M106 30L110 26H126L130 30Z", colour: "M" }, // lid
      { d: "M116 26h4v12h-4Z", colour: "I" }, // tape
      { d: "M109 43h7v3h-7Z", colour: "D" }, // label
    ],
    pivots: [[118, 50]],
  },
  bubble: {
    parts: [
      { d: "M106 24H130V42H118L112 48V42H106Z", colour: "C" },
      { d: "M110 29h16v3h-16Z", colour: "I" },
      { d: "M110 35h10v3h-10Z", colour: "I" },
    ],
    pivots: [[118, 50]],
  },
  code: {
    parts: [
      { d: "M106 24H130V48H106Z", colour: "C" }, // tile
      { d: "M115 30L109 36L115 42L117 40L113 36L117 32Z", colour: "I" },
      { d: "M121 30L127 36L121 42L119 40L123 36L119 32Z", colour: "I" },
    ],
    pivots: [[118, 50]],
  },
  shield: {
    parts: [
      { d: "M106 24H130V38L118 50L106 38Z", colour: "C" },
      { d: "M111 35L114 32L117 35L123 29L126 32L117 41Z", colour: "I" },
    ],
    pivots: [[118, 50]],
  },
  send: {
    parts: [{ d: "M106 44L120 30H113V25H130V42H125V35L111 49Z", colour: "C" }],
    pivots: [[118, 50]],
  },
  report: {
    parts: [
      { d: "M106 24H124L130 30V50H106Z", colour: "C" },
      { d: "M124 24V30H130Z", colour: "D" },
      { d: "M110 42h4v5h-4Z", colour: "B", hook: "bar" },
      { d: "M116 37h4v10h-4Z", colour: "B", hook: "bar" },
      { d: "M122 33h4v14h-4Z", colour: "B", hook: "bar" },
    ],
    pivots: [
      [112, 47],
      [118, 47],
      [124, 47],
    ],
  },
  envelope: {
    parts: [
      { d: "M106 30H130V48H106Z", colour: "C" },
      { d: "M106 30H130L118 42Z", colour: "D", hook: "flap" },
    ],
    pivots: [[118, 30]],
  },
  palette: {
    parts: [
      { d: "M110 26H126L130 30V46L126 50H110L106 46V30Z", colour: "C" }, // slab
      { d: "M111 31h6v6h-6Z", colour: "B" }, // swatches
      { d: "M119 31h6v6h-6Z", colour: "M" },
      { d: "M111 39h6v6h-6Z", colour: "D" },
      { d: "M119 39h6v6h-6Z", colour: "I" },
    ],
    pivots: [[118, 50]],
  },
  prompt: {
    parts: [
      { d: "M106 28H130V48H106Z", colour: "C" }, // field
      { d: "M109 32h15v3h-15Z", colour: "I" }, // typed lines
      { d: "M109 38h9v3h-9Z", colour: "I" },
      { d: "M120 37h3v6h-3Z", colour: "B", hook: "caret" },
    ],
    pivots: [[121.5, 40]],
  },
  picture: {
    parts: [
      { d: "M106 26H130V50H106Z", colour: "C" }, // frame
      { d: "M109 29H127V47H109Z", colour: "I" }, // canvas
      { d: "M109 47L117 39L121 43L124 40L127 43V47Z", colour: "M" }, // hills
      { d: "M120 32h4v4h-4Z", colour: "B" }, // sun
    ],
    pivots: [[118, 50]],
  },
};

/** The "just looking" glyph (no prop, Rix shrugs): the logo's gap eyes, drawn as base parts. */
export const lookingGlyph: readonly RixPropPart[] = [
  { d: "M107 36h10v10h-10Z M119 24h10v10h-10Z", colour: "C" },
];

/** True for a base part (the glyph's main fill); marks are the ink, cream-muted and accent parts. */
export function isBasePart(part: RixPropPart): boolean {
  return part.colour === "C" || part.colour === "M";
}
