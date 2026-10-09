# Design system

**Last Updated:** 2026-10-07

The look of `marwix.dev`. Layout and behaviour follow the reference design
(`temp/claude-design/Portfolio Redesign v3.dc.html`); **colours and type come only from this
file**, never from the reference. Values change only with the user's yes and a line in the change
log at the bottom. `app/globals.css` implements them; the `design-tokens` skill keeps the two in
step.

## Colour

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#0B0B0A` | Page background |
| `--color-band` | `#141413` | Raised surfaces on dark: panels, the marquee strip, inputs |
| `--color-text` | `#F2F1EC` | Body and headings on dark |
| `--color-muted` | `#9A9993` | Secondary text on dark, section labels, meta text |
| `--color-line` | `#2A2A27` | Hairlines and borders on dark |
| `--color-cream` | `#EEECE5` | Proof cards and the project takeover |
| `--color-ink` | `#0E0E0C` | Text on cream |
| `--color-cream-muted` | `#6B6A63` | Secondary text on cream |
| `--color-accent` | `#B69CFF` | The only accent: violet |
| `--color-on-accent` | `#0B0B0A` | Text on the accent |

**One accent only.** Violet takes every place the reference uses its lime: the hero name, the
accent words in headings, active states, the progress bar, primary buttons, focus of attention.

**Mapping the reference's greys.** The reference's many near-black and grey steps collapse onto the
tokens above: its panels, marquee strip and inputs use `band`; every hairline and its dashed
lines use `line`; the hero backdrop (light pool and agent network, which replaced v3's grid) is
`accent` at reduced strength (a Tailwind `/` opacity modifier or canvas `globalAlpha`, never a raw
value); all its secondary and meta greys use `muted`, keeping 4.5:1 contrast; its
cream cards and takeover use `cream`, `ink` and `cream-muted`. Dimmed, inactive text (the
reference's dark grey list rows) is `muted` at reduced opacity only where it isn't body text.

## Type

All families load with `next/font` in `lib/fonts.ts`: Acosta and the punctuation face from local
files in `assets/fonts/`, the two IBM Plex families from Google Fonts.

| Role | Family | Weight | Notes |
|---|---|---|---|
| Name, headings, big display text, the MARWIX wordmark (page and sharing images) | Acosta | 400 only | Local `assets/fonts/acosta.otf` (Befonts: commercial use allowed). One weight, no axes: display text carries no weight class. Very wide (about 0.9em per character; cap height 0.85em). Hero name uppercase. Letter spacing normal. Leading 1.0 for one-line titles and the hero, 1.05 for section headings and rows, 1.15 for smaller titles, 0.9 for the footer wordmark |
| Punctuation inside display text | IBM Plex Sans Bold | 700 only | Acosta holds letters and digits only. Any other character in display text falls through the `--font-display` stack to a bold-only local family (`assets/fonts/ibm-plex-sans-latin-700.woff2`, OFL), so it renders bold at any requested weight |
| Body | IBM Plex Sans | 400 / 500 / 600 | Variable. 15px / 1.55 base |
| Labels, meta | IBM Plex Mono | 400 / 500 | Section labels uppercase with 0.06em tracking |

### Text-size tokens

Phone-first: each `clamp()` minimum is the 360px size, and the maximum caps it at 4K. Bounds are
in rem (1rem = 16px at default settings), and the middle term mixes rem + vw, so the fluid tokens
scale with browser zoom and the font-size setting; the fixed px tokens scale with zoom.

| Token | Value | Use |
|---|---|---|
| `--text-meta` | `12px` | Mono meta: step numbers, card meta, panel labels |
| `--text-nav` | `13px` | Section labels, pill text, small mono lines |
| `--text-small` | `14px` | Nav links, the hero side line, footer links |
| `--text-body` | `15px` | Body text, buttons |
| `--text-body-lg` | `16px` | Descriptions under rows and steps, chat bubbles |
| `--text-lead` | `17px` | Lead lines under headings |
| `--text-summary` | `clamp(1.25rem, 1.106rem + 0.64vw, 1.625rem)` | The takeover's summary paragraph |
| `--text-step` | `24px` | Process step titles, takeover part titles |
| `--text-card` | `clamp(1.5625rem, 1.354rem + 0.926vw, 2.25rem)` | Proof card titles, the About prompt and (from `lg`) its cards |
| `--text-row` | `clamp(1.375rem, 1.172rem + 0.904vw, 2.75rem)` | Agent list rows and web step rows |
| `--text-marquee` | `28px` | The marquee strip |
| `--text-heading-sm` | `clamp(1.5625rem, 1.224rem + 1.506vw, 3.5rem)` | The About and Web section headings |
| `--text-heading` | `clamp(1.875rem, 1.167rem + 3.148vw, 4.5rem)` | Section headings (how I work, projects) |
| `--text-heading-xl` | `clamp(1.875rem, 1.536rem + 1.506vw, 4rem)` | The contact heading |
| `--text-takeover` | `clamp(2.125rem, 1.083rem + 4.63vw, 6.25rem)` | The takeover's project title |
| `--text-hero` | `clamp(2.4375rem, 1.25rem + 5.278vw, 7rem)` | The hero name |
| `--text-footer-mark` | `17.5vw` | The giant footer wordmark |

The display sizes are set so that, in Acosta, the hero name fits a 360px phone, each section
heading sets on two lines in its column, and row and card titles stay on one line. A heading
token's size follows its column's width, not its name: `heading-xl` sits in a half-width column,
so it is smaller than `heading` on desktop.

## Layout

- **Page gutter:** `--spacing-gutter`, `clamp(20px, 4vw, 56px)` side padding (`px-gutter`).
- **Section rhythm:** `--spacing-section`, `clamp(80px, 12vw, 160px)` vertical padding
  (`py-section`), a `line` hairline between sections.
- **Max width:** `--container-site` (1536px), shared by the nav and every section. Nothing may
  scroll sideways at any width.
- **Buttons:** pills (radius 999px). Primary: `accent` background, `on-accent` text, 600 weight.
  Secondary: `line` border, `text` colour. Tap targets at least 44px.
- **Panels and cards:** large radii (20–24px for panels and cards, 12–14px inside them).

Section-by-section layout lives in `docs/pages/home/ui-spec.md`.

## Rules

- Dark only in v1. Motion comes in the GSAP pass, after the static page (constitution §5).
- Every image goes through one helper or component, so a light-theme version can be added later.
- Contrast is at least 4.5:1 for body text, and tap targets are at least 44px.

## Change log

- 2026-09-23 — v1 set from the old approved render (since retired).
- 2026-09-24 — Reset to the v3 reference design (user's yes). Display font is now Bricolage
  Grotesque, replacing Big Shoulders Display; Geist Mono gains 400 and 500. Colours: the v3 greys
  map onto the existing tokens, with no new colour; `--color-hero-glow` is removed (v3's hero uses
  a grid). Text sizes: the old section sizes (`name`, `name-desktop`, `heading-desktop`, `stat`,
  `stat-desktop`, `row-desktop`, `wordmark`) are removed; `nav`, `body` and `lead` stay; v3's
  scale is added (`meta`, `small`, `body-lg`, `summary`, `step`, `card`, `row`, `marquee`,
  `heading-sm`, `heading`, `heading-xl`, `takeover`, `hero`, `footer-mark`).
- 2026-09-24 — Added `--spacing-gutter: clamp(20px, 4vw, 56px)` and
  `--spacing-section: clamp(80px, 12vw, 160px)` (user's yes). Reason: the page gutter and
  section padding repeat on every section; the values were already set above.
- 2026-09-24 — Fluid type tokens moved to rem bounds with a rem + vw middle (user's yes). Reason:
  pure-vw type doesn't grow with browser zoom (WCAG 1.4.4). Sizes at 360px and at the max are
  unchanged; mid widths are slightly larger.
- 2026-10-07 — Fonts changed for the whole site (user's yes). Display is Acosta, replacing
  Bricolage Grotesque; body is IBM Plex Sans, replacing Geist; labels and meta are IBM Plex Mono,
  replacing Geist Mono. The wordmark moves from Geist Mono 800 to Acosta, on the page and in both
  sharing images. Reason: the user chose Acosta from five candidates; IBM Plex was picked over
  Space Grotesk because Space Grotesk's capital I reads as a lowercase l ("AI" looks like "Al").
  Acosta has no punctuation, so display punctuation comes from IBM Plex Sans Bold (user's yes).
  Acosta is about 1.8 times as wide as condensed Bricolage, so ten display size tokens were
  retuned from measured renders (`step`, `card`, `row`, `marquee`, `heading-sm`, `heading`,
  `heading-xl`, `takeover`, `hero`, `footer-mark`); display letter spacing is now normal, display
  weight classes and the `wdth` width settings are gone, and leading is looser (1.0–1.15).
  `summary` and the body-size tokens are unchanged. No token was added or removed.
