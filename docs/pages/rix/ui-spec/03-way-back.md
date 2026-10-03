# §3 Way back: UI spec

Shared rules (§0): [`../ui-spec.md`](../ui-spec.md). Page doc: [`../sections/03-way-back.md`](../sections/03-way-back.md).

## 3. Way back (the one question: where do I go from here?)

### 3.1 Layout and classes

- **`RixWayBack`** (server):
  - outer: `<section id="rix-way-back" aria-labelledby="rix-way-back-title" class="px-gutter">`
  - inner: `<div class="{container} flex flex-col gap-8 border-t border-line py-section lg:flex-row lg:items-end lg:justify-between">`
- **Heading:** `SectionHeading` with `size="heading-sm"`, `id="rix-way-back-title"`, `lead` and
  `accent` (choice 4, resolved 2026-10-02: a short heading and two buttons).
- **Actions:** `<div class="flex flex-col gap-3 md:flex-row lg:shrink-0">`, holding:
  1. `BookCallLink variant="hero"` (`pillPrimary w-full md:w-auto`). It spreads `bookCallTrackProps`
     (`lib/track.ts`, `data-umami-event="book-call"`), so it counts as the same action as every
     other Book a call link. Its label is the shared `nav.bookCall`.
  2. Back to home: `<Link href="/" class="{pillOutline} w-full md:w-auto">`. It's a plain
     same-tab link with no icon.
- The site footer follows, with its own full-bleed hairline.

| Element | Default | Hover | Focus-visible | Active |
|---|---|---|---|---|
| Book a call | `bg-accent text-on-accent` | `bg-text` | `focusRing` | `bg-muted` |
| Back to home | `border-line bg-bg/50 text-text` | `border-accent text-accent` | `focusRing` | `bg-band` |

### 3.2 Sizes

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Layout | heading, then the pills stacked | heading, then the pills in a row | heading left, pills right, bottoms aligned | same, in 1536 |
| Heading (`text-heading-sm`) | 40px | ≈53px | ≈75px | 80px (cap) |
| Pills | 320×48 each, gap 12 | auto × 48, gap 12 | same | same |
| Padding (`py-section`) | 80 | ≈92 | 160 | 160 |

Contrast: `on-accent` on `accent` is about 9:1, and `text` on `bg` about 17:1.

### 3.3 Content slots (`content/rix.ts → wayBack`; copywriter)

| Key | Meaning | Limit |
|---|---|---|
| `wayBack.heading.lead` + `wayBack.heading.accent` | Done playing, so here's what's next: a nudge toward booking or heading home. No claims | 6 words together |
| `wayBack.home` | The link back to the home page | 3 words |
| `nav.bookCall` (`content/shared.ts`, as is) | "Book a call" (voice rule 13) | fixed |

### 3.4 Components, images, motion

- **Components:** `components/rix/RixWayBack.tsx` (new). It reuses `SectionHeading`,
  `BookCallLink` and `pillOutline`. **Images:** none.
- **Motion (later):** the heading uses `data-anim="reveal"`, and the actions use `reveal` with
  `data-anim-delay="150"`. Under reduced motion they fade only.
