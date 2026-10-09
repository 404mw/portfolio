// The takeover's title band in flight (ui-spec/07-proofs-band.md §B and §C): the ink band behind a
// takeover's title is its card's banner, grown wider and thinner. On open it starts exactly over
// the banner's ground and travels to rest, and on close it travels back. Here are its two ends as
// plain numbers for GSAP, the check that it stays inside the dialog's clip, and when it clears the
// sticky bar. The band is written as an offset, a size and a radius, never a scale: a scale would
// stretch its hatch and squash its corners.
// `bandMorph` reads layout, so call it before a tween starts, never inside one.
import type { ScreenBox } from "@/lib/takeoverTitleMorph";

/**
 * The band's box, measured from its resting spot: its top-left corner's offset, its size and its
 * corner radius (px). GSAP tweens these numbers.
 */
export type BandRect = { x: number; y: number; width: number; height: number; radius: number };

export type BandMorph = {
  /** The band at rest: no offset, its own size and radius. */
  readonly rest: Readonly<BandRect>;
  /** The band exactly over the card banner's ground, with the banner's radius. */
  readonly banner: Readonly<BandRect>;
  /** The band's resting corner on screen (px), which both boxes are measured from. */
  readonly left: number;
  readonly top: number;
};

/** Px of rounding the fit check forgives (as the title's, lib/takeoverTitleMorph.ts). */
const FIT_SLACK = 1;

function radiusOf(el: HTMLElement): number {
  return Number.parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
}

/**
 * The two ends of `band`'s flight: at rest, and over `banner` (the card banner's ground) as it
 * sits on screen now. Null when either has no size. `band` must be at rest when this reads it,
 * with no inline size or transform.
 */
export function bandMorph(band: HTMLElement, banner: HTMLElement): BandMorph | null {
  const rest = band.getBoundingClientRect();
  const source = banner.getBoundingClientRect();
  if (rest.width === 0 || rest.height === 0 || source.width === 0 || source.height === 0) return null;
  return {
    rest: { x: 0, y: 0, width: rest.width, height: rest.height, radius: radiusOf(band) },
    banner: {
      x: source.left - rest.left,
      y: source.top - rest.top,
      width: source.width,
      height: source.height,
      radius: radiusOf(banner),
    },
    left: rest.left,
    top: rest.top,
  };
}

/** Where `rect` sits on screen (viewport px). */
function screenBoxOf(morph: BandMorph, rect: Readonly<BandRect>): ScreenBox {
  const left = morph.left + rect.x;
  const top = morph.top + rect.y;
  return { top, right: left + rect.width, bottom: top + rect.height, left };
}

/**
 * Whether the band stays inside the dialog's clip as it goes from `start` to `end` while the clip
 * goes from `startClip` to `endClip` on the same ease and duration. Every edge of both is linear
 * in that shared progress, so an edge that is inside at both ends is inside throughout. An edge
 * where the clip is cut to the screen at both ends (`screen`: the dialog's own box) passes too:
 * the clip never leaves the screen's edge there, so whatever of the band lies beyond it is off
 * screen.
 */
export function bandFits(
  morph: BandMorph,
  start: Readonly<BandRect>,
  end: Readonly<BandRect>,
  startClip: ScreenBox,
  endClip: ScreenBox,
  screen: ScreenBox,
): boolean {
  const from = screenBoxOf(morph, start);
  const to = screenBoxOf(morph, end);
  /** `inward` is +1 where a larger number is further inside the clip (top, left), else -1. */
  const holds = (edge: keyof ScreenBox, inward: 1 | -1) => {
    const inside =
      (from[edge] - startClip[edge]) * inward >= -FIT_SLACK && (to[edge] - endClip[edge]) * inward >= -FIT_SLACK;
    const cutToScreen =
      Math.abs(startClip[edge] - screen[edge]) <= FIT_SLACK && Math.abs(endClip[edge] - screen[edge]) <= FIT_SLACK;
    return inside || cutToScreen;
  };
  return holds("top", 1) && holds("left", 1) && holds("right", -1) && holds("bottom", -1);
}

/**
 * Open from a card: the flight's eased progress (0–1) at which the band's top edge is below the
 * sticky bar's bottom edge (`barBottom`, on screen), as the band travels from the banner to rest
 * and the bar stays put. 0 when it starts below the bar, so the bar never covers it.
 */
export function bandBarClearProgress(morph: BandMorph, barBottom: number): number {
  const startTop = morph.top + morph.banner.y;
  const restTop = morph.top;
  if (startTop >= barBottom) return 0;
  if (restTop <= barBottom) return 1;
  return (barBottom - startTop) / (restTop - startTop);
}

/** A CSS length for `value` px, to a hundredth. */
function px(value: number): string {
  return `${Math.round(value * 100) / 100}px`;
}

/**
 * Puts `band` in flight: above the takeover's parts as they rise (the title comes later in the
 * markup, so it still paints over the band), on its own layer.
 */
export function liftBand(band: HTMLElement): void {
  band.style.zIndex = "1";
  band.style.willChange = "transform";
}

/** Writes `rect` on `band`: its offset as a transform, its size and its corner radius. */
export function applyBand(band: HTMLElement, rect: Readonly<BandRect>): void {
  band.style.transform = `translate(${px(rect.x)}, ${px(rect.y)})`;
  band.style.width = px(rect.width);
  band.style.height = px(rect.height);
  band.style.borderRadius = px(rect.radius);
}

/** Clears everything `liftBand` and `applyBand` set, leaving `band` to its classes. */
export function clearBand(band: HTMLElement): void {
  band.style.transform = "";
  band.style.width = "";
  band.style.height = "";
  band.style.borderRadius = "";
  band.style.zIndex = "";
  band.style.willChange = "";
}
