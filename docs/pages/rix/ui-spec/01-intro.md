# §1 Intro: UI spec

Shared rules (§0): [`../ui-spec.md`](../ui-spec.md). Page doc: [`../sections/01-intro.md`](../sections/01-intro.md).

## 1. Intro (the one question: what is this page?)

### 1.1 Layout and classes

- **`RixIntro`** (server):
  - outer: `<section id={sectionIds.top} aria-labelledby="rix-title" class="px-gutter pt-17">`.
    The 68px top padding clears the 67px fixed header. `id="top"` was approved 2026-10-02: it
    drives the nav's solid switch (index §0.1).
  - inner: `<div class="{container} flex flex-col gap-4 pt-12 md:gap-5 md:pt-16 lg:pt-20">`.
- **Title:** `SectionHeading` with `as="h1"`, `size="heading"`, `id="rix-title"`, `lead` and
  `accent`.
  - As built: `font-display font-semibold text-balance text-text` plus `condensed`, and
    `text-heading leading-[0.95] tracking-[-0.025em]`.
  - The accent words are `text-accent`.
- **Line:** `<p class="max-w-xl text-lead text-muted text-pretty">`.
- There's no label, image or control, and nothing is interactive, so there are no states.

### 1.2 Sizes

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Top of page to the title | 116 (68 + 48) | 132 | 148 | 148 |
| Title (`text-heading`) | 44px | ≈64px | ≈96px | 104px (cap) |
| Line (`text-lead`) | 17px, 320 wide | 17px, ≤ 576 | same | same |
| Gap, title to line | 16 | 20 | 20 | 20 |

Contrast: `text` on `bg` is about 17:1, `muted` about 6.9:1, and `accent` about 8.6:1.

### 1.3 Content slots (`content/rix.ts → intro`; copywriter; no claims)

| Key | Meaning | Limit |
|---|---|---|
| `intro.heading.lead` + `intro.heading.accent` | The page's name: Rix, the MW mascot, to play with. Accent is the last word or two. The sharing image reuses it (§0.5) | 4 words / 20 characters together |
| `intro.line` | One line saying what to do here: press a button to make him act, or poke or pet him. No testing talk (the dev `line` must not ship) | 12 words |

### 1.4 Components, images, motion

- **Components:** `components/rix/RixIntro.tsx` (new). `SectionHeading` gains `as`. **Images:**
  none.
- **Motion (later):** the title, then the line, use `data-anim="reveal"` (the line with
  `data-anim-delay="100"`), rising from `y: 56` with a fade on load. Under reduced motion they
  fade only. No extra markup is needed.
