// The takeover's title morphs (ui-spec §7.7, Motion): where a takeover's title has to start so it
// sits exactly over the title it grows out of (a proof card's title on open, the old takeover's
// "Next project" title on Next), as plain numbers for GSAP, plus the checks and timings built on
// them. Everything here reads layout, so call it before a tween starts, never inside one.
//
// A card title and a takeover title share a face but not its setting: the display face has an
// optical-size axis (`opsz`) that the browser sets to the font size, so the big title is drawn
// narrower and tighter than the small one, and the two are tracked differently. Scaled alone, the
// big title lands up to ~40px narrower than the card title. So a card morph also carries a
// `TitleType`: the title's typography as a function of its scale, which at the card title's scale
// is exactly the card title's (its optical size and tracking) and at rest exactly its own, so the
// two titles are the same glyphs at both hand-offs.

/**
 * The title's typography as it scales (see `typeAt`): its own font size and letter spacing at
 * rest, the source title's letter spacing and scale, and its other variation axes (`"wdth" 80`).
 * Letter spacing is in em; the optical size follows the on-screen font size.
 */
export type TitleType = {
  readonly fontSize: number;
  readonly restEm: number;
  readonly fromEm: number;
  readonly fromScale: number;
  readonly axes: string;
};

export type TitleMorph = {
  /** Offset (px) from the title's resting spot to the title it grows out of, on screen. */
  readonly x: number;
  readonly y: number;
  /** The source title's font size over the title's; below 1, as the title is the larger type. */
  readonly scale: number;
  /** The two wrap to different line counts, so a straight hand-off would pop: crossfade instead. */
  readonly crossfade: boolean;
  /** The title's top (px, on screen) at rest, and its font size (px). */
  readonly top: number;
  readonly fontSize: number;
  /** The typography match, when the morph asked for one and it's safe (see `titleMorph`). */
  readonly type: TitleType | null;
};

/** A box on screen (px, viewport coordinates). */
export type ScreenBox = { readonly top: number; readonly right: number; readonly bottom: number; readonly left: number };

/** Of the title's line box, the share of a font size its glyphs may still reach above its top. */
const GLYPH_OVERHANG = 0.15;
/** Px of rounding the fit check forgives. */
const FIT_SLACK = 1;

/**
 * Next: the slide's eased progress (0–1) at which the flying title's glyphs are clear below the
 * sticky bar's bottom edge (`barBottom`, on screen at rest), as both rise the dialog's `height`
 * together. The bar sits `height·(1−p)` below rest and the title at the lerp of its start and rest
 * tops.
 */
export function barClearProgress(morph: TitleMorph, height: number, barBottom: number): number {
  const startTop = morph.top + morph.y;
  const margin = morph.fontSize * GLYPH_OVERHANG;
  const span = height - startTop + morph.top;
  if (span <= 0) return 1;
  // The share of the rise still to go when the glyphs' top meets the bar's bottom.
  const remaining = (morph.top - margin - barBottom) / span;
  return Math.min(1, Math.max(0, 1 - remaining));
}

/**
 * Open from a card: the morph's eased progress (0–1) at which the title's glyphs are clear below
 * the sticky bar's bottom edge (`barBottom`, on screen), as the title lerps from the card title to
 * rest and the bar stays put. The glyphs' top (line top less the overhang, which scales with the
 * title) is linear in progress, so this solves one line. 0 when they start clear of the bar, so
 * the bar never covers them.
 */
export function barClearProgressOnOpen(morph: TitleMorph, barBottom: number): number {
  const overhang = morph.fontSize * GLYPH_OVERHANG;
  const startGlyphs = morph.top + morph.y - overhang * morph.scale;
  const restGlyphs = morph.top - overhang;
  if (startGlyphs >= barBottom) return 0;
  if (restGlyphs <= barBottom) return 1;
  return (barBottom - startGlyphs) / (restGlyphs - startGlyphs);
}

/** A title's transform away from its resting spot: offset (px) and scale from its top-left corner. */
export type TitlePose = { readonly x: number; readonly y: number; readonly scale: number };

/** The title untransformed, at rest. */
const REST: TitlePose = { x: 0, y: 0, scale: 1 };

/**
 * `type`'s typography at `scale`, as inline styles: the optical size of the on-screen font size
 * (the title's size times its scale), and letter spacing lerped from its own (at scale 1) to the
 * source's (at the source's scale). Scale alone decides it, so it's continuous wherever a tween
 * is cut and picked up again.
 */
export function typeAt(type: TitleType, scale: number): { fontVariationSettings: string; letterSpacing: string } {
  const span = 1 - type.fromScale;
  const share = Math.abs(span) < 1e-3 ? 0 : Math.min(1, Math.max(0, (1 - scale) / span));
  const em = type.restEm + (type.fromEm - type.restEm) * share;
  const opsz = `"opsz" ${Math.round(type.fontSize * scale * 100) / 100}`;
  return {
    fontVariationSettings: type.axes ? `${type.axes}, ${opsz}` : opsz,
    letterSpacing: `${Math.round(em * 1e5) / 1e5}em`,
  };
}

/** Writes `type`'s typography at `scale` on `title`. */
export function applyType(title: HTMLElement, type: TitleType, scale: number): void {
  const { fontVariationSettings, letterSpacing } = typeAt(type, scale);
  title.style.fontVariationSettings = fontVariationSettings;
  title.style.letterSpacing = letterSpacing;
}

/** Runs `read` with `title` set in `type` at `scale` (when there is one), then puts it back. */
function withType<T>(title: HTMLElement, type: TitleType | null, scale: number, read: () => T): T {
  if (!type) return read();
  const { fontVariationSettings, letterSpacing } = title.style;
  applyType(title, type, scale);
  const result = read();
  title.style.fontVariationSettings = fontVariationSettings;
  title.style.letterSpacing = letterSpacing;
  return result;
}

/** The box of `el`'s text (its line boxes' union, via a Range), or null when it has none. */
function textBoxOf(el: HTMLElement): DOMRect | null {
  const range = document.createRange();
  range.selectNodeContents(el);
  const text = range.getBoundingClientRect();
  return text.width > 0 && text.height > 0 ? text : null;
}

/**
 * Whether `title`'s text lies inside `frame` when the title is posed at `pose` (and, given a
 * `type`, set in its typography at that pose's scale). The text's box is its line boxes' union
 * (a Range over it), mapped through the pose's offset and scale from the title's top-left corner.
 * `title` must be untransformed when this reads it.
 */
export function textFits(title: HTMLElement, pose: TitlePose, frame: ScreenBox, type: TitleType | null = null): boolean {
  const rest = title.getBoundingClientRect();
  const text = withType(title, type, pose.scale, () => textBoxOf(title));
  if (!text) return false;

  const posed: ScreenBox = {
    top: rest.top + pose.y + (text.top - rest.top) * pose.scale,
    right: rest.left + pose.x + (text.right - rest.left) * pose.scale,
    bottom: rest.top + pose.y + (text.bottom - rest.top) * pose.scale,
    left: rest.left + pose.x + (text.left - rest.left) * pose.scale,
  };
  return inside(posed, frame);
}

/**
 * Whether `title`'s text lies inside `start` where the morph begins and inside `end` at rest.
 * Every edge of the moving text is linear in the morph's progress (its offset and scale both lerp
 * on it), so when a clip lerps from `start` to `end` on the same ease and duration, holding at
 * both ends means the text stays inside the clip throughout. The same holds for any two poses, so
 * the close checks its own two ends with `textFits`.
 */
export function morphFits(morph: TitleMorph, title: HTMLElement, start: ScreenBox, end: ScreenBox): boolean {
  return textFits(title, morph, start, morph.type) && textFits(title, REST, end);
}

function inside(box: ScreenBox, frame: ScreenBox): boolean {
  return (
    box.top >= frame.top - FIT_SLACK &&
    box.right <= frame.right + FIT_SLACK &&
    box.bottom <= frame.bottom + FIT_SLACK &&
    box.left >= frame.left - FIT_SLACK
  );
}

/** Line boxes in a block of text: its height over its line height (px, else a multiple of font size). */
function lineCount(el: HTMLElement, height: number, fontSize: number): number {
  const raw = Number.parseFloat(getComputedStyle(el).lineHeight);
  const lineHeight = !Number.isFinite(raw) ? fontSize : raw < fontSize / 2 ? raw * fontSize : raw;
  return lineHeight > 0 ? Math.max(1, Math.round(height / lineHeight)) : 1;
}

/** `el`'s variation settings other than `opsz` (e.g. `"wdth" 80`); "" for none. */
function axesOf(el: HTMLElement): string {
  const settings = getComputedStyle(el).fontVariationSettings;
  if (settings === "normal") return "";
  return settings
    .split(",")
    .map((axis) => axis.trim())
    .filter((axis) => axis !== "" && !axis.includes("opsz"))
    .join(", ");
}

/** `el`'s letter spacing in em ("normal" is 0). */
function letterSpacingEm(el: HTMLElement, fontSize: number): number {
  const raw = Number.parseFloat(getComputedStyle(el).letterSpacing);
  return Number.isFinite(raw) ? raw / fontSize : 0;
}

/**
 * The typography match from `from` (drawn at `scale` of `title`'s size) to `title`, or null when
 * it can't make them the same glyphs (a fixed optical size, or other axes that differ) or it's
 * unsafe: set in `from`'s typography at its own size, `title` would wrap to a different number of
 * lines (a title near its container's edge), which would shift the page under it.
 */
function titleType(from: HTMLElement, title: HTMLElement, scale: number, fontSize: number): TitleType | null {
  const own = getComputedStyle(title);
  const source = getComputedStyle(from);
  if (own.fontOpticalSizing !== "auto" || source.fontOpticalSizing !== "auto") return null;
  const axes = axesOf(title);
  if (axes !== axesOf(from)) return null;

  const type: TitleType = {
    fontSize,
    restEm: letterSpacingEm(title, fontSize),
    fromEm: letterSpacingEm(from, fontSize * scale),
    fromScale: scale,
    axes,
  };
  const lines = lineCount(title, title.getBoundingClientRect().height, fontSize);
  const matchedLines = withType(title, type, scale, () =>
    lineCount(title, title.getBoundingClientRect().height, fontSize),
  );
  return matchedLines === lines ? type : null;
}

/**
 * How `title` (at rest, untransformed) has to start to sit over `from` (the title it grows out of).
 * Null when `from` isn't on screen or either is unmeasurable: the caller skips the morph.
 * With `matchType` (the card morph), the two are lined up by their text boxes rather than their
 * element boxes (their line heights differ) and, unless they wrap differently, the morph carries
 * a `TitleType` so the title is set in the source's typography at the source's scale; the offset
 * is measured with it in place. Without it (Next), element boxes and no typography change.
 */
export function titleMorph(
  from: HTMLElement,
  title: HTMLElement,
  options: { readonly matchType?: boolean } = {},
): TitleMorph | null {
  const start = from.getBoundingClientRect();
  const end = title.getBoundingClientRect();
  const onScreen =
    start.width > 0 &&
    start.height > 0 &&
    start.bottom > 0 &&
    start.top < window.innerHeight &&
    start.right > 0 &&
    start.left < window.innerWidth;
  if (!onScreen || end.width === 0 || end.height === 0) return null;

  const startSize = Number.parseFloat(getComputedStyle(from).fontSize);
  const endSize = Number.parseFloat(getComputedStyle(title).fontSize);
  if (!(startSize > 0) || !(endSize > 0)) return null;

  const scale = startSize / endSize;
  const crossfade = lineCount(from, start.height, startSize) !== lineCount(title, end.height, endSize);
  if (!options.matchType) {
    return { x: start.left - end.left, y: start.top - end.top, scale, crossfade, top: end.top, fontSize: endSize, type: null };
  }

  const type = crossfade ? null : titleType(from, title, scale, endSize);
  const source = textBoxOf(from);
  const own = withType(title, type, scale, () => textBoxOf(title));
  if (!source || !own) return null;
  // The title's text box, scaled from its top-left corner, lands on the source's text box.
  return {
    x: source.left - end.left - (own.left - end.left) * scale,
    y: source.top - end.top - (own.top - end.top) * scale,
    scale,
    crossfade,
    top: end.top,
    fontSize: endSize,
    type,
  };
}
