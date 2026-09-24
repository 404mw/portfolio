// Shared class strings, so each look is written once (ui-spec §0.3).

/** The site column: full width, capped at `--container-site` (1536px), centred. */
export const container = "mx-auto w-full max-w-(--container-site)";

/** Focus ring on dark: 2px `text` outline, 2px offset. */
export const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text";

/** Focus ring on cream (the takeover): 2px `ink` outline, 2px offset. */
export const focusRingOnCream =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

/** The display face condensed to width 80. */
export const condensed = "[font-variation-settings:'wdth'_80]";

/** The display face condensed to width 75: the footer wordmark only. */
export const condensedMark = "[font-variation-settings:'wdth'_75]";

/** Section labels and the hero tag: uppercase mono, 13px, muted. */
export const monoLabel = "font-mono text-nav uppercase tracking-[0.06em] text-muted";

/** Step, panel and card meta: mono, 12px, muted. */
export const metaLabel = "font-mono text-meta text-muted";

/** The primary pill: accent background, 48px tall. */
export const pillPrimary = `inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 text-body font-semibold text-on-accent hover:bg-text active:bg-muted ${focusRing}`;

/** The secondary pill: `line` border on a see-through background, 48px tall. */
export const pillOutline = `inline-flex min-h-12 items-center justify-center rounded-full border border-line bg-bg/50 px-6 text-body text-text hover:border-accent hover:text-accent active:bg-band ${focusRing}`;
