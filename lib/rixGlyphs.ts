// Rix's emote glyph geometry (ui-spec/00-rix.md R3.2): pixel glyphs in the `!`/`?` style, drawn
// by `RixEmotes` above his head. Each glyph is one path, or a group of named parts; each has its
// fill class (`fill-accent` for `hearts` and `grawlix` only, else `fill-muted`) and each part its
// scale pivot. `partsHidden` glyphs draw their parts at `opacity-0` (their loops show them). All
// values are hardcoded from the spec, in viewBox units; nothing is computed at render.
import type { BotPoint } from "@/lib/processBots";

/** Every emote glyph, in paint order. */
export type RixGlyphName = "alert" | "question" | "hearts" | "sparkle" | "drop" | "dots" | "vein" | "grawlix";

export type RixGlyphFill = "fill-muted" | "fill-accent";

/** One path: its cells (`fill-rule="evenodd"`) and its scale pivot (set with `svgOrigin`). */
export type RixGlyphPath = {
  readonly d: string;
  readonly pivot: BotPoint;
};

/** A glyph part: a path with its `data-emote-part` name. */
export type RixGlyphPart = RixGlyphPath & { readonly part: string };

export type RixGlyph =
  | (RixGlyphPath & { readonly fill: RixGlyphFill })
  | {
      readonly fill: RixGlyphFill;
      readonly parts: readonly RixGlyphPart[];
      /** The parts whose path starts at `opacity-0`. */
      readonly hiddenParts: readonly string[];
    };

const vein = "M94 -16H96V-12H92V-14H94Z M100 -16H102V-14H104V-12H100Z M92 -8H96V-4H94V-6H92Z M100 -8H104V-6H102V-4H100Z";

export const rixGlyphs = {
  alert: { fill: "fill-muted", d: "M98 -15h5v12h-5Z M98 -1h5v5h-5Z", pivot: [100.5, -5] },
  question: {
    fill: "fill-muted",
    d: "M95 -15H105L108 -12V-6L104 -2H101V-5L104 -8V-11H99V-8H95Z M101 0h3v4h-3Z",
    pivot: [101.5, -5],
  },
  hearts: {
    fill: "fill-accent",
    parts: [
      {
        part: "1",
        d: "M98 -14H102V-12H104V-14H108V-12H110V-8H108V-6H106V-4H104V-2H102V-4H100V-6H98V-8H96V-12H98Z",
        pivot: [103, -8],
      },
      {
        part: "2",
        d: "M114 -8H116V-6H118V-8H120V-6H122V-4H120V-2H118V0H116V-2H114V-4H112V-6H114Z",
        pivot: [117, -4],
      },
      { part: "3", d: "M88 -6H90V-4H92V-6H94V-4H96V-2H94V0H92V2H90V0H88V-2H86V-4H88Z", pivot: [91, -2] },
    ],
    hiddenParts: ["1", "2", "3"],
  },
  sparkle: {
    fill: "fill-muted",
    parts: [
      { part: "big", d: "M100 -16h2v10h-2Z M96 -12h4v2h-4Z M102 -12h4v2h-4Z", pivot: [101, -11] },
      { part: "small", d: "M108 -6h2v6h-2Z M106 -4h2v2h-2Z M110 -4h2v2h-2Z", pivot: [109, -3] },
    ],
    hiddenParts: [],
  },
  drop: { fill: "fill-muted", d: "M98 -14H100V-10H102V-6H100V-4H98V-6H96V-10H98Z", pivot: [99, -9] },
  dots: {
    fill: "fill-muted",
    parts: [
      { part: "1", d: "M94 -8h4v4h-4Z", pivot: [96, -6] },
      { part: "2", d: "M101 -8h4v4h-4Z", pivot: [103, -6] },
      { part: "3", d: "M108 -8h4v4h-4Z", pivot: [110, -6] },
    ],
    hiddenParts: ["1", "2", "3"],
  },
  vein: { fill: "fill-muted", d: vein, pivot: [98, -10] },
  grawlix: {
    fill: "fill-accent",
    parts: [
      { part: "vein", d: vein, pivot: [98, -10] },
      {
        part: "hash",
        d: "M108 -15h2v2h-2Z M112 -15h2v2h-2Z M106 -13h10v2h-10Z M108 -11h2v2h-2Z M112 -11h2v2h-2Z M106 -9h10v2h-10Z M108 -7h2v2h-2Z M112 -7h2v2h-2Z",
        pivot: [111, -10],
      },
      {
        part: "at",
        d: "M108 -15h6v2h-6Z M106 -13h2v6h-2Z M114 -13h2v4h-2Z M110 -11h2v2h-2Z M110 -9h6v2h-6Z M108 -7h4v2h-4Z",
        pivot: [111, -10],
      },
      {
        part: "dollar",
        d: "M108 -15h8v2h-8Z M106 -13h2v2h-2Z M110 -13h2v2h-2Z M108 -11h6v2h-6Z M110 -9h2v2h-2Z M114 -9h2v2h-2Z M106 -7h8v2h-8Z",
        pivot: [111, -10],
      },
      {
        part: "star",
        d: "M106 -15h2v2h-2Z M110 -15h2v2h-2Z M114 -15h2v2h-2Z M108 -13h6v2h-6Z M106 -11h10v2h-10Z M108 -9h6v2h-6Z M106 -7h2v2h-2Z M110 -7h2v2h-2Z M114 -7h2v2h-2Z",
        pivot: [111, -10],
      },
    ],
    hiddenParts: ["hash", "at", "dollar", "star"],
  },
} satisfies Readonly<Record<RixGlyphName, RixGlyph>>;

/** The glyphs in paint order. */
export const rixGlyphNames: readonly RixGlyphName[] = [
  "alert",
  "question",
  "hearts",
  "sparkle",
  "drop",
  "dots",
  "vein",
  "grawlix",
];
