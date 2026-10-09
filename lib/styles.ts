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

/** The slant shared by the hero's bottom edge and the marquee strip under it: sets
 * `--slant-drop`, how far a 3° line falls across the viewport's width (tan 3° × 100vw). Geometry,
 * not a design token. Both parts carry this class and read the variable, so they always agree. */
export const slantDrop = "[--slant-drop:5.2408vw]";

/** Focus ring on dark: 2px `text` outline, 2px offset. */
export const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text";

/** Focus ring on cream (the takeover): 2px `ink` outline, 2px offset. */
export const focusRingOnCream =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

/** Focus ring for a cream card on dark (proof cards): 2px `text` outline, 4px offset. */
export const focusRingCard =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-text";

/** Big-row titles (agent rows, web step rows): display face, `text-row`, tight. */
export const rowTitle = "font-display text-row leading-[1.05]";

/** Section labels and the hero tag: uppercase mono, 13px, muted. */
export const monoLabel = "font-mono text-nav uppercase tracking-[0.06em] text-muted";

/** Step, panel and card meta: mono, 12px, muted. */
export const metaLabel = "font-mono text-meta text-muted";

/** `metaLabel` on cream (proof cards, the takeover): mono, 12px, `cream-muted`. */
export const metaLabelOnCream = "font-mono text-meta text-cream-muted";

/** The chip shape, no state classes (Contact's need chips, About's reply chips): 44px tall. */
export const chip = "inline-flex min-h-11 items-center gap-2 rounded-full border px-4.5 text-body";

/** A takeover part's paragraph, on cream: 17px on a 576px measure (ui-spec §7.3.1). */
export const takeoverText = "max-w-xl text-lead leading-normal text-pretty text-ink";

/** A small mono pill's shape, not interactive, no colour classes: the takeover showcase's status
 * line and the diagram's return pill, each adding its own colours (ui-spec §7.3.1, §7.3.2). */
export const monoPill =
  "inline-flex items-center gap-2 rounded-full px-3 py-2 font-mono text-meta leading-none font-medium tracking-[0.06em] uppercase";

/** The primary pill: accent background, 48px tall. */
export const pillPrimary = `inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 text-body font-semibold text-on-accent hover:bg-text active:bg-muted ${focusRing}`;

/** The secondary pill: `line` border on a see-through background, 48px tall. */
export const pillOutline = `inline-flex min-h-12 items-center justify-center rounded-full border border-line bg-bg/50 px-6 text-body text-text hover:border-accent hover:text-accent active:bg-band ${focusRing}`;

/** The ink pill on cream (takeover Close and Visit): ink background, cream text, accent hover.
 * Height, padding, gap and type are set where it's used. */
export const pillInk = `inline-flex items-center rounded-full bg-ink text-cream hover:bg-accent hover:text-on-accent active:bg-accent/80 ${focusRingOnCream}`;
