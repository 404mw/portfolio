// Shared class strings, so each look is written once (ui-spec §0.3).

/** The site column: full width, capped at `--container-site` (1536px), centred. */
export const container = "mx-auto w-full max-w-(--container-site)";

/** The two-column split (Agents, Web, Contact): stacked below `lg`, two equal columns
 * from `lg`. No cross-axis alignment: use `splitGrid`, or set it where used. */
export const splitColumns = "grid gap-10 md:gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24";

/** `splitColumns` with both columns top-aligned (Web, Contact). */
export const splitGrid = `${splitColumns} lg:items-start`;

/** The title column that pins while the other column scrolls, from `lg`. `self-start` keeps it
 * from being stretched to the row height, which would stop it pinning. */
export const stickyTitle = "lg:sticky lg:top-30 lg:self-start";

/** `stickyTitle` from `xl` (Process, whose split starts at `xl`). */
export const stickyTitleXl = "xl:sticky xl:top-30 xl:self-start";

/** Focus ring on dark: 2px `text` outline, 2px offset. */
export const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text";

/** Focus ring on cream (the takeover): 2px `ink` outline, 2px offset. */
export const focusRingOnCream =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

/** Focus ring for a cream card on dark (proof cards): 2px `text` outline, 4px offset. */
export const focusRingCard =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-text";

/** The display face condensed to width 80. */
export const condensed = "[font-variation-settings:'wdth'_80]";

/** Big-row titles (agent rows, web step rows): condensed display, `text-row`, tight. */
export const rowTitle = `font-display text-row leading-none font-semibold tracking-[-0.035em] ${condensed}`;

/** The display face condensed to width 75: the footer wordmark only. */
export const condensedMark = "[font-variation-settings:'wdth'_75]";

/** Section labels and the hero tag: uppercase mono, 13px, muted. */
export const monoLabel = "font-mono text-nav uppercase tracking-[0.06em] text-muted";

/** Step, panel and card meta: mono, 12px, muted. */
export const metaLabel = "font-mono text-meta text-muted";

/** `metaLabel` on cream (proof cards, the takeover): mono, 12px, `cream-muted`. */
export const metaLabelOnCream = "font-mono text-meta text-cream-muted";

/** The primary pill: accent background, 48px tall. */
export const pillPrimary = `inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 text-body font-semibold text-on-accent hover:bg-text active:bg-muted ${focusRing}`;

/** The secondary pill: `line` border on a see-through background, 48px tall. */
export const pillOutline = `inline-flex min-h-12 items-center justify-center rounded-full border border-line bg-bg/50 px-6 text-body text-text hover:border-accent hover:text-accent active:bg-band ${focusRing}`;

/** The ink pill on cream (takeover Close and Visit): ink background, cream text, accent hover.
 * Height, padding, gap and type are set where it's used. */
export const pillInk = `inline-flex items-center rounded-full bg-ink text-cream hover:bg-accent hover:text-on-accent active:bg-accent/80 ${focusRingOnCream}`;
