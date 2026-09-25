# Home: UI spec

**Last Updated:** 2026-09-25
**Sources:** `docs/pages/home/page.md` (decisions 1–44, the source of truth), constitution §2–§9,
`docs/01-design-system.md`, `app/globals.css`, v3 reference (layout and behaviour only),
`docs/03-facts.md`, `docs/04-voice.md`.
**Scope:** the static, final-state page. Every animated element carries a **Motion (later)** line
and the markup hooks the GSAP pass needs. The spec never states page text; it names slots.
**Layout:** this file is the index. It holds the shared rules and parts (§0), the motion hooks
summary (§10), tokens and choices. Each section's spec is its own file under `ui-spec/`; load this
file plus the one section you work on. The § numbers stay as they were (for example §2.1.1).

## Sections

| § | Section | UI spec | Page doc |
|---|---|---|---|
| 1 | Nav | [`ui-spec/01-nav.md`](ui-spec/01-nav.md) | [`sections/01-nav.md`](sections/01-nav.md) |
| 2 | Hero | [`ui-spec/02-hero.md`](ui-spec/02-hero.md) | [`sections/02-hero.md`](sections/02-hero.md) |
| 3 | Marquee | [`ui-spec/03-marquee.md`](ui-spec/03-marquee.md) | [`sections/03-marquee.md`](sections/03-marquee.md) |
| 4 | Agents | [`ui-spec/04-agents.md`](ui-spec/04-agents.md) | [`sections/04-agents.md`](sections/04-agents.md) |
| 5 | Process | [`ui-spec/05-process.md`](ui-spec/05-process.md) | [`sections/05-process.md`](sections/05-process.md) |
| 6 | Web | [`ui-spec/06-web.md`](ui-spec/06-web.md) | [`sections/06-web.md`](sections/06-web.md) |
| 7 | Proofs | [`ui-spec/07-proofs.md`](ui-spec/07-proofs.md) | [`sections/07-proofs.md`](sections/07-proofs.md) |
| 8 | Contact | [`ui-spec/08-contact.md`](ui-spec/08-contact.md) | [`sections/08-contact.md`](sections/08-contact.md) |
| 9 | Footer | [`ui-spec/09-footer.md`](ui-spec/09-footer.md) | [`sections/09-footer.md`](sections/09-footer.md) |

---

## 0. Shared rules and parts

### 0.1 Page frame

- `app/layout.tsx`: `<SkipLink />`, `<SiteHeader />`, `<main id="main" tabIndex={-1}>`,
  `<SiteFooter />`. `app/page.tsx` renders, in order: Hero, Marquee, Agents, Process, Web, Proofs,
  Contact, then the three `<ProjectTakeover />` dialogs and `<TakeoverController />`.
- In-page ids live in `lib/routes.ts` (overwritten; one job: link targets): `top`, `agents`,
  `process`, `web`, `proofs`, `contact`, and the takeover hashes `exile`, `design-vault`,
  `marwix-skills`. Every section takes `scroll-mt-20` (80px) to clear the fixed header.
- **Section frame** (Process, Web, Proofs, Contact, and Agents without the top line):
  `<section id class="px-gutter scroll-mt-20">` → `<div class="{container} py-section border-t border-line">`.
  The hairline spans the content width. Agents drops `border-t` (the marquee's bottom line is above it).
- **Spacing tokens (approved 2026-09-24):** `--spacing-gutter` (`clamp(20px, 4vw, 56px)`) gives
  `px-gutter`; `--spacing-section` (`clamp(80px, 12vw, 160px)`) gives `py-section`. They're used
  for every page gutter and section rhythm; there are no arbitrary gutter or section values anywhere.
- **No sideways scroll:** `body` gets `overflow-x-clip`; every full-bleed decorative part clips as
  well: the hero's backdrop (light pool, network canvas, vignette, grain) and portrait by the
  hero's `overflow-hidden`, the marquee, and the footer wordmark.

### 0.2 File plan

- **Deleted before the build:** everything in `components/`, and `lib/breakpoints.ts`,
  `lib/currentPage.ts`, `lib/focusFirstLink.ts`, `lib/navIds.ts`, `lib/words.ts`. Nothing here depends on them.
- **Kept and overwritten:** `hooks/useDisclosure.ts`, `hooks/useOnMediaMatch.ts`, `lib/styles.ts`,
  `lib/routes.ts`, `lib/navItems.ts`, `lib/socialItems.ts`, `content/home.ts`.
- **Used as they stand:** `lib/images.ts` (extended, 0.4), `lib/isFilled.ts`, `lib/currentYear.ts`,
  `lib/fonts.ts`, `content/shared.ts` (its slots are rewritten by copywriter).

### 0.3 `lib/styles.ts` (overwritten; shared class strings only)

| Name | Classes | Use |
|---|---|---|
| `container` | `mx-auto w-full max-w-(--container-site)` | `--container-site` 1536px |
| `focusRing` | `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text` | on dark |
| `focusRingOnCream` | same, with `focus-visible:outline-ink` | the takeover |
| `focusRingCard` | `focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-text` | the cream proof cards, on dark |
| `condensed` | `[font-variation-settings:'wdth'_80]` | display face |
| `rowTitle` | `font-display text-row leading-none font-semibold tracking-[-0.035em]` + `condensed` | big-row titles: Agents rows, Web step rows |
| `condensedMark` | `[font-variation-settings:'wdth'_75]` | footer wordmark only |
| `monoLabel` | `font-mono text-nav uppercase tracking-[0.06em] text-muted` | section labels, hero tag |
| `metaLabel` | `font-mono text-meta text-muted` | step, panel and card meta |
| `metaLabelOnCream` | `font-mono text-meta text-cream-muted` | meta on cream (proof cards, the takeover) |
| `pillPrimary` | `inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 text-body font-semibold text-on-accent hover:bg-text active:bg-muted` + `focusRing` | primary pill |
| `pillOutline` | `inline-flex min-h-12 items-center justify-center rounded-full border border-line bg-bg/50 px-6 text-body text-text hover:border-accent hover:text-accent active:bg-band` + `focusRing` | secondary pill |
| `pillInk` | `inline-flex items-center rounded-full bg-ink text-cream hover:bg-accent hover:text-on-accent active:bg-accent/80` + `focusRingOnCream` | ink pill on cream (takeover Close and Visit); height, padding, gap and type set where used |

### 0.4 Shared components (all server unless marked)

| File | Job |
|---|---|
| `components/SkipLink.tsx` | "Skip to content" to `#main`: `sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-60` + `pillPrimary` when focused |
| `components/SectionLabel.tsx` | Number, a 24px hairline (`h-px w-6 bg-muted`, `aria-hidden`), label text, in `monoLabel`. Prop `as` (`h2` for Agents, `p` elsewhere). The hairline replaces v3's em dash (voice rule 10) |
| `components/SectionHeading.tsx` | `<h2>` = `lead` + `<span class="text-accent">accent</span>`. Size prop `heading-sm` / `heading` / `heading-xl`. Base: `font-display font-semibold text-balance text-text` + `condensed`; `heading-sm`/`heading`: `leading-[0.95] tracking-[-0.025em]`; `heading-xl`: `leading-[0.9] tracking-[-0.03em]` (loosened from −0.04/−0.045em by the user's choice, 2026-09-24: letters touched at desktop sizes) |
| `components/ExternalLink.tsx` | `<a target="_blank" rel="noopener noreferrer">` plus a `sr-only` suffix from `a11y.newTab` |
| `components/BookCallLink.tsx` | The one Book a call link (Cal.com, `links.bookCall`), built on `ExternalLink`, carrying `data-track="book-call"`: the single place clicks are counted (§11). Prop `variant`: `nav` (1.2) or `hero` (2.1). The Contact row (8.1) is built by the shared contact-row component, not a variant here |
| `components/SiteImage.tsx` | Every image: reads `lib/images.ts`, renders `next/image` with `fill`, `sizes`, `alt`, and an object-position prop. Renders `ImagePlaceholder` when the entry's file is `null` |
| `components/ImagePlaceholder.tsx` | Build-time stand-in: `grid size-full place-items-center border border-dashed` with a mono name label. On cream: `bg-ink/5 border-ink/20 text-cream-muted`; on dark: `bg-band border-line text-muted` |
| `components/icons/{Menu,Close,ArrowRight,ArrowUpRight,Check,ChevronUp,Asterisk}Icon.tsx` | One glyph each: inline SVG, `currentColor`, `aria-hidden="true"`, `focusable="false"` |

- `lib/images.ts`: each name → `{ dark: string | null }`. A `null` file fails the ship check, like
  a `[FILL]` marker. Names are listed in each section's file.

---

## 10. Motion hooks, summary

Every `data-anim` element's static state is its final state. The GSAP pass uses `gsap.matchMedia()`
and does nothing under `prefers-reduced-motion: reduce`. Generic scroll reveal: `data-anim="reveal"`,
with an optional `data-anim-delay` (ms), from `y: 56, opacity: 0`.

## Tokens

- **Approved 2026-09-24:** `--spacing-gutter: clamp(20px, 4vw, 56px)` and
  `--spacing-section: clamp(80px, 12vw, 160px)`. Both are in `app/globals.css` `@theme` and the
  `docs/01-design-system.md` change log.
- **To request:** none.

## Choices

**Open for the lead:** Proof cards at `md` go two across, with MARWIX-SKILLS alone on row two at
the same width, left-aligned, so all three stay identical. The alternatives were one column
until `lg` (each card about 600px tall at 768) or stretching the third card across both columns
(which would make it different from the other two).

**Accepted by the user, 2026-09-24:**

1. Process ring from `xl` with a 4/8 split; the column below `xl`.
2. Hero height capped at 1200px (confirmed).
3. Hero name at 360px: screen check; if MUHAMMAD clips, the fix is a 16px phone gutter or `wdth 75` on phone.
4. Nav solid state from a client observer; server markup starts transparent.
5. Agents variant A without JS falls back to B's list inside `<noscript>`.
6. Takeover: native `<dialog>` with `:target` as the no-JS path; Next replaces the hash.
7. Timeline uses native radio inputs; chips are `aria-pressed` buttons.
8. Textarea border `muted/70`.
9. Opacity modifiers on tokens for v3's in-between greys (`line/40`, `ink/15`, `muted/30`, `muted/60`).
10. Report title `text-summary`; Send brief `text-lead`.
11. Radii: 24px for panels and cards, 12px inside.
12. New tab for Visit, WhatsApp and the footer socials, with a hidden hint.
13. Static accents: the selected row's line full, sync packets at their midpoints, and the progress bar empty under reduced motion.
14. Loop line 2px.
15. Section labels use a hairline instead of v3's em dash.
