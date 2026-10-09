// The takeover title's colour while it or its band moves (ui-spec/07-proofs-band.md §B, "Title
// colour"): each glyph pixel is `text` where it lies over the ink band and `ink` where it lies over
// cream. The title's sides stay inside the band's sides, so the boundary is the band's top and
// bottom edges, worked out in the title's own coordinates from numbers a tween already has. The
// colour depends only on where the two are, never on time, so a flight cut off and reversed needs
// no colour state.
// `titleToneFrame` reads layout, so call it before a tween starts; the rest is plain arithmetic.
import type { TitlePose } from "@/lib/takeoverTitleMorph";

/** The title's and the band's resting geometry the rule needs (px). */
export type ToneFrame = {
  /** The band's top less the title's, at rest: negative, as the band starts above the title. */
  readonly offset: number;
  /** The band's height at rest. */
  readonly bandHeight: number;
  /** The title's box height and font size at rest. */
  readonly height: number;
  readonly fontSize: number;
};

/** Where the band stands: how far below its resting spot its top is, and its height (px). */
export type BandSpan = { readonly y: number; readonly height: number };

/**
 * The title's colour: its own class's (wholly over the band), ink (wholly over cream), or split
 * at the band's edges, `from` and `to` px down the title's own box, `text` between them.
 */
export type TitleTone =
  | { readonly kind: "own" }
  | { readonly kind: "ink" }
  | { readonly kind: "split"; readonly from: number; readonly to: number };

/**
 * Of the title's line box, the share of a font size its glyphs may reach past its top or bottom
 * (the same share lib/takeoverTitleMorph.ts allows above the title for the bar).
 */
const GLYPH_OVERHANG = 0.15;

const INK = "var(--color-ink)";
const TEXT = "var(--color-text)";

/** Reads the resting geometry of `title` and `band`. Both must be at rest, untransformed. */
export function titleToneFrame(title: HTMLElement, band: HTMLElement): ToneFrame {
  const own = title.getBoundingClientRect();
  const ground = band.getBoundingClientRect();
  return {
    offset: ground.top - own.top,
    bandHeight: ground.height,
    height: own.height,
    fontSize: Number.parseFloat(getComputedStyle(title).fontSize) || 0,
  };
}

/**
 * The title's colour when it is posed at `pose` and the band stands at `band` (left out: at rest),
 * both measured from their resting spots in the same column. The band's top and bottom edges land
 * `from` and `to` px down the title's own box (the pose's scale undone, from its top-left corner).
 * While either lies inside the title's line box, grown by the glyphs' overhang, the title is split
 * there; otherwise it is one colour.
 */
export function titleTone(frame: ToneFrame, pose: TitlePose, band?: BandSpan): TitleTone {
  const y = band?.y ?? 0;
  const bandHeight = band?.height ?? frame.bandHeight;
  if (!(pose.scale > 0)) return { kind: "own" };

  const from = (frame.offset + y - pose.y) / pose.scale;
  const to = from + bandHeight / pose.scale;
  const overhang = frame.fontSize * GLYPH_OVERHANG;
  const top = -overhang;
  const bottom = frame.height + overhang;

  if (to <= top || from >= bottom) return { kind: "ink" };
  if (from <= top && to >= bottom) return { kind: "own" };
  return { kind: "split", from, to };
}

/** A CSS length for `value` px, to a hundredth. */
function px(value: number): string {
  return `${Math.round(value * 100) / 100}px`;
}

/**
 * `tone` as inline styles; "" leaves a property to the title's classes. A split paints the title
 * with a gradient clipped to its glyphs, so only the glyphs inside the title's own box show for
 * those frames.
 */
export function toneStyle(tone: TitleTone): { color: string; backgroundImage: string; backgroundClip: string } {
  if (tone.kind === "own") return { color: "", backgroundImage: "", backgroundClip: "" };
  if (tone.kind === "ink") return { color: INK, backgroundImage: "", backgroundClip: "" };
  const from = px(Math.max(0, tone.from));
  const to = px(Math.max(0, tone.to));
  return {
    color: "transparent",
    backgroundImage: `linear-gradient(to bottom, ${INK} 0 ${from}, ${TEXT} ${from} ${to}, ${INK} ${to})`,
    backgroundClip: "text",
  };
}

/** Writes `tone` on `title`. The prefixed clip is for engines that only take `text` that way. */
export function applyTone(title: HTMLElement, tone: TitleTone): void {
  const { color, backgroundImage, backgroundClip } = toneStyle(tone);
  title.style.color = color;
  title.style.backgroundImage = backgroundImage;
  title.style.setProperty("-webkit-background-clip", backgroundClip);
  title.style.setProperty("background-clip", backgroundClip);
}

/** Clears everything `applyTone` set, leaving `title` to its classes. */
export function clearTone(title: HTMLElement): void {
  title.style.color = "";
  title.style.backgroundImage = "";
  title.style.removeProperty("-webkit-background-clip");
  title.style.removeProperty("background-clip");
}
