// The takeover head's condense (ui-spec/07-proofs-sticky-band.md §B): as the takeover scrolls, its
// title band shrinks from the full band to a slim ink strip hanging from the top bar, and the title
// shrinks to the proof card title's size inside it. The pose is a pure function of the dialog's
// `scrollTop`, so a close at any moment reads exactly one pose. Here are the frame it's built on
// (measured once per refresh), the progress for a scroll, and the band's box and the title's pose
// at a progress, as plain numbers. The band is written as a size and a radius, never a scale (a
// scale would stretch its hatch); its width and position never change.
// The condensed title is the heading scaled, in its own typography; a close from there blends it
// into the card title's (`condensedTypeAt`), so the hand-off starts without a jump.
// `condenseFrame` reads layout, so call it with the pose cleared, never inside a tween.
import type { BandRect } from "@/lib/takeoverBand";
import { typeAt, type TitlePose, type TitleType } from "@/lib/takeoverTitleMorph";

/** What the condense is measured from: the takeover's own parts and any card's. */
export type CondenseParts = {
  /** The sticky top bar (`takeover-bar`). */
  readonly bar: HTMLElement;
  /** The column the head sits in (its top padding is where the head starts). */
  readonly column: HTMLElement;
  /** The sticky head (`takeover-head`), its band (`takeover-band`) and its title (`takeover-title`). */
  readonly head: HTMLElement;
  readonly band: HTMLElement;
  readonly title: HTMLElement;
  /** Any proof card title (`proof-card-title`) and banner (`proof-banner`): the slim size and radius. */
  readonly cardTitle: HTMLElement;
  readonly banner: HTMLElement;
};

/** The condense's numbers (px, except `scale`). */
export type CondenseFrame = {
  /** The head's sticky top, `bar − tuck`: the band's top `tuck` px sit under the bar. */
  readonly stick: number;
  /** The `scrollTop` at which the head sticks, and the scroll over which it condenses (`D = H`). */
  readonly start: number;
  readonly distance: number;
  /** The full band: the head's height and width, and its corner radius. */
  readonly height: number;
  readonly width: number;
  readonly radius: number;
  /** The card banner's radius: the slim strip's radius and how far it tucks under the bar. */
  readonly tuck: number;
  /** The slim title's scale (card title size over the title's) and the slim strip's visible height. */
  readonly scale: number;
  readonly visible: number;
  /** The title's top and side margins at rest. */
  readonly marginTop: number;
  readonly marginX: number;
  /** The dialog's `scroll-padding-top` while it condenses: bar, slim strip and 16px. */
  readonly scrollPadding: number;
};

/** The band's box and the title's pose at one progress. */
export type CondensePose = {
  readonly progress: number;
  readonly band: Readonly<BandRect>;
  readonly title: TitlePose;
};

/** Px kept clear between the slim strip and a focused element scrolled into view. */
const FOCUS_GAP = 16;

function numberOf(value: string): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function lerp(from: number, to: number, progress: number): number {
  return from + (to - from) * progress;
}

/**
 * The frame for `parts`, or null when the head, title or card title has no size. The head, band
 * and title must be at rest (no inline size, radius or transform); the bar's height and every
 * size read here are scroll-independent, so the head may be stuck.
 */
export function condenseFrame(parts: CondenseParts): CondenseFrame | null {
  const head = parts.head.getBoundingClientRect();
  const bar = parts.bar.getBoundingClientRect().height;
  const title = getComputedStyle(parts.title);
  const fontSize = numberOf(title.fontSize);
  const cardSize = numberOf(getComputedStyle(parts.cardTitle).fontSize);
  if (head.width === 0 || head.height === 0 || !(fontSize > 0) || !(cardSize > 0)) return null;

  const tuck = numberOf(getComputedStyle(parts.banner).borderTopLeftRadius);
  const scale = Math.min(1, cardSize / fontSize);
  const visible = head.height * scale;
  return {
    stick: bar - tuck,
    start: numberOf(getComputedStyle(parts.column).paddingTop) + tuck,
    distance: head.height,
    height: head.height,
    width: head.width,
    radius: numberOf(getComputedStyle(parts.band).borderTopLeftRadius),
    tuck,
    scale,
    visible,
    marginTop: numberOf(title.marginTop),
    marginX: numberOf(title.marginLeft),
    scrollPadding: bar + visible + FOCUS_GAP,
  };
}

/** How far the head has condensed (0 full, 1 slim) at `scrollTop`. */
export function condenseProgress(frame: CondenseFrame, scrollTop: number): number {
  if (!(frame.distance > 0)) return 0;
  return Math.min(1, Math.max(0, (scrollTop - frame.start) / frame.distance));
}

/**
 * The pose at `progress`: the band keeps its width and place and goes from the full height to the
 * tuck plus the slim strip, its radius from its own to the banner's; the title scales from its
 * top-left corner to the card title's size, its margins scaling with it, and moves down by the tuck.
 * Both are linear in `progress` and the title is inside the band at both ends, so throughout.
 */
export function condensePose(frame: CondenseFrame, progress: number): CondensePose {
  const shrink = (1 - frame.scale) * progress;
  return {
    progress,
    band: {
      x: 0,
      y: 0,
      width: frame.width,
      height: lerp(frame.height, frame.tuck + frame.visible, progress),
      radius: lerp(frame.radius, frame.tuck, progress),
    },
    title: {
      x: -frame.marginX * shrink,
      y: (frame.tuck + frame.marginTop * frame.scale - frame.marginTop) * progress,
      scale: 1 - shrink,
    },
  };
}

/**
 * A close starting from a condensed pose: the title's typography at `scale` when the close is
 * `ratio` (0–1) of the way to the card title. At 0 it's the title's own (the optical size of its
 * resting font size, its own tracking), which is how the condense draws it at any scale; at 1 it's
 * `type`'s at `scale`, which is the card title's own at the card title's scale. Both lerp on
 * `ratio` between those two.
 */
export function condensedTypeAt(
  type: TitleType,
  scale: number,
  ratio: number,
): { fontVariationSettings: string; letterSpacing: string } {
  const matched = typeAt(type, scale);
  const em = type.restEm + (Number.parseFloat(matched.letterSpacing) - type.restEm) * ratio;
  const opsz = lerp(type.fontSize, type.fontSize * scale, ratio);
  const axis = `"opsz" ${Math.round(opsz * 100) / 100}`;
  return {
    fontVariationSettings: type.axes ? `${type.axes}, ${axis}` : axis,
    letterSpacing: `${Math.round(em * 1e5) / 1e5}em`,
  };
}
