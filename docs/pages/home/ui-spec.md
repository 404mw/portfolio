# Home: UI spec

**Last Updated:** 2026-09-24
**Sources:** `docs/pages/home/page.md` (decisions 1–44, the source of truth), constitution §2–§9,
`docs/01-design-system.md`, `app/globals.css`, v3 reference (layout and behaviour only),
`docs/03-facts.md`, `docs/04-voice.md`.
**Scope:** the static, final-state page. Every animated element carries a **Motion (later)** line
and the markup hooks the GSAP pass needs. The spec never states page text; it names slots.

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
- **No sideways scroll:** `body` gets `overflow-x-clip`; every full-bleed decorative part (hero
  grid, marquee, footer wordmark) clips itself as well.

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
| `condensed` | `[font-variation-settings:'wdth'_80]` | display face |
| `condensedMark` | `[font-variation-settings:'wdth'_75]` | footer wordmark only |
| `monoLabel` | `font-mono text-nav uppercase tracking-[0.06em] text-muted` | section labels, hero tag |
| `metaLabel` | `font-mono text-meta text-muted` | step, panel and card meta |
| `pillPrimary` | `inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 text-body font-semibold text-on-accent hover:bg-text active:bg-muted` + `focusRing` | primary pill |
| `pillOutline` | `inline-flex min-h-12 items-center justify-center rounded-full border border-line bg-bg/50 px-6 text-body text-text hover:border-accent hover:text-accent active:bg-band` + `focusRing` | secondary pill |

### 0.4 Shared components (all server unless marked)

| File | Job |
|---|---|
| `components/SkipLink.tsx` | "Skip to content" to `#main`: `sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-60` + `pillPrimary` when focused |
| `components/SectionLabel.tsx` | Number, a 24px hairline (`h-px w-6 bg-muted`, `aria-hidden`), label text, in `monoLabel`. Prop `as` (`h2` for Agents, `p` elsewhere). The hairline replaces v3's em dash (voice rule 10) |
| `components/SectionHeading.tsx` | `<h2>` = `lead` + `<span class="text-accent">accent</span>`. Size prop `heading-sm` / `heading` / `heading-xl`. Base: `font-display font-semibold text-balance text-text` + `condensed`; `heading-sm`/`heading`: `leading-[0.95] tracking-[-0.04em]`; `heading-xl`: `leading-[0.9] tracking-[-0.045em]` |
| `components/ExternalLink.tsx` | `<a target="_blank" rel="noopener noreferrer">` plus a `sr-only` suffix from `a11y.newTab` |
| `components/BookCallLink.tsx` | The one Book a call link (Cal.com, `links.bookCall`), built on `ExternalLink`, carrying `data-track="book-call"`: the single place clicks are counted (§11). Prop `variant`: `nav` (1.2) or `hero` (2.1). The Contact row (8.1) is built by the shared contact-row component, not a variant here |
| `components/SiteImage.tsx` | Every image: reads `lib/images.ts`, renders `next/image` with `fill`, `sizes`, `alt`, and an object-position prop. Renders `ImagePlaceholder` when the entry's file is `null` |
| `components/ImagePlaceholder.tsx` | Build-time stand-in: `grid size-full place-items-center border border-dashed` with a mono name label. On cream: `bg-ink/5 border-ink/20 text-cream-muted`; on dark: `bg-band border-line text-muted` |
| `components/icons/{Menu,Close,ArrowRight,ArrowUpRight,Check,ChevronUp,Asterisk}Icon.tsx` | One glyph each: inline SVG, `currentColor`, `aria-hidden="true"`, `focusable="false"` |

- `lib/images.ts`: each name → `{ dark: string | null }`. A `null` file fails the ship check, like
  a `[FILL]` marker. Names are listed per section below.

---

## 1. Nav (the one question: where can I go, and how do I book a call?)

### 1.1 Layout

- `SiteHeader`: `<header class="fixed inset-x-0 top-0 z-40">`, pinned at every width. Children, top
  to bottom: `ProgressBar` (2px, reserved) then `NavBar`.
- `ProgressBar`: `<div aria-hidden data-anim="progress" class="h-0.5 origin-left scale-x-0 bg-accent">`.
  Static: empty (scaled to 0), but its 2px is always reserved above the nav row.
- `NavBar` (client): `<nav aria-label={nav.label} class="px-gutter border-b border-transparent data-[solid=true]:border-line data-[solid=true]:bg-band has-[details[open]]:bg-band">`
  → inner `{container} flex h-16 items-center justify-between gap-4`.
  - `data-solid` is `false` while the hero is in view, `true` once past it
    (`hooks/useScrolledPast.ts`: an IntersectionObserver on `#top`, `rootMargin: "-67px 0px 0px"`).
    Server markup starts `false`. The switch is instant.
  - Left: `NavLinks` (`hidden md:flex`) or `NavMenu` (`md:hidden`). Right: `BookCallLink variant="nav"`.
  - No brand mark. Header height: 2 + 64 + 1 (the nav's bottom border) = **67px**.
- `NavMenu` (client): a native `<details class="group md:hidden">` so it works without JS; its
  `<summary>` is the menu button, and the panel below the nav row is
  `<div id="nav-menu" class="absolute inset-x-0 top-full border-b border-line bg-band px-gutter">`,
  shown by the native open state. The icon swaps by CSS (`group-open`). Rows: `<ul>` of 4 links, each `flex min-h-12 items-center border-t border-line text-body-lg text-text first:border-t-0`.
  - Uses `hooks/useDisclosure.ts` (Escape closes and returns focus) and `hooks/useOnMediaMatch.ts`,
    passing Tailwind's `md` query `"(min-width: 48rem)"` as a constant in `NavMenu`, so the menu
    closes at `md`. A link click closes it.

### 1.2 Classes and states

| Element | Classes | Hover | Focus-visible | Active / selected |
|---|---|---|---|---|
| Inline link (md+) | `inline-flex h-11 items-center rounded-full px-3 text-small text-muted` | `text-text` | `focusRing` | `bg-band` |
| Link list | `flex items-center gap-1 lg:gap-3` | n/a | n/a | n/a |
| Menu button (`<summary>`) | `inline-flex size-11 list-none items-center justify-center rounded-full text-text`, marker hidden, `aria-label` from `nav.menu.open`/`close` (expanded state is native) | `bg-band` | `focusRing` | `bg-line`; open: `CloseIcon` |
| Menu row link | as 1.1 | `text-accent` | `focusRing` with `focus-visible:outline-offset-[-2px]` (inset) | `bg-line` |
| Book a call (`variant="nav"`) | `pillPrimary` with `min-h-11 px-5 text-small` | `bg-text` | `focusRing` | `bg-muted` |

### 1.3 Sizes

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Gutter / content | 20 / 320 | 31 / 706 | 56 / 1328 | content 1536, centred |
| Header | 67 (2 + 64 + 1) | 67 | 67 | 67 |
| Links | in panel, 48 rows, 16px | inline, 44 tall, 14px | same | same |
| Menu button | 44×44, 20px glyph | hidden | hidden | hidden |
| Book a call | ~120×44, 14px/600 | same | same | same |

### 1.4 Content slots (`content/shared.ts`; rewrites the old `nav`)

| Key | Meaning | Limit (proposed; copywriter confirms) |
|---|---|---|
| `nav.label` | Accessible name of the nav landmark | 2 words |
| `nav.skipLink` | Skip link text | 4 words |
| `nav.links.agents` / `.web` / `.proofs` / `.contact` | The four jump links | 1 word each |
| `nav.menu.open` / `nav.menu.close` | Menu button name, closed / open | 3 words |
| `nav.bookCall` | Pill text; always "Book a call" (voice 13) | fixed |
| `a11y.newTab` | Hidden suffix on new-tab links | 5 words |
| `links.*` | Addresses (facts), unchanged | fixed |

### 1.5 Components and motion

- New: `components/SiteHeader.tsx`, `ProgressBar.tsx`, `NavBar.tsx` (client), `NavLinks.tsx`,
  `NavMenu.tsx` (client), plus `hooks/useScrolledPast.ts`. `lib/navItems.ts` is overwritten with the
  four in-page items.
- **Motion (later):** progress fill scales `scaleX` 0→1, scrubbed by page scroll
  (`data-anim="progress"`); stays at 0 under reduced motion. Nav band fades in on the solid switch.
  Menu panel (`data-anim="nav-panel"`) fades and drops 8px on open. Jump links may get a GSAP
  scroll-to; none in static (no `scroll-behavior: smooth`).
- **Images:** none.

---

## 2. Hero (the one question: who is this?)

### 2.1 Layout

- `<section id="top" class="relative isolate h-svh min-h-160 max-h-300 overflow-hidden">`
  (height capped at 1200px: user-confirmed 2026-09-24), three layers:
  1. `HeroGrid` (`aria-hidden`): `absolute inset-0 -z-10 opacity-40 bg-size-[4rem_4rem] bg-[linear-gradient(to_right,var(--color-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-line)_1px,transparent_1px)]`. v3's faint 64px grid.
  2. `HeroPortrait`: `absolute inset-x-0 bottom-0 mx-auto h-3/5 w-5/6 max-w-md md:h-[88%] md:w-[min(38.75rem,58vw)] md:max-w-none`,
     with an inner `data-anim="hero-portrait"` box `relative size-full` holding the image and the
     fade: `absolute inset-x-0 bottom-0 h-[38%] bg-linear-to-t from-bg to-transparent` (`aria-hidden`).
  3. Text layer (`data-anim="hero-text"`): `relative z-10 h-full px-gutter` → `{container} grid h-full grid-rows-[auto_1fr_auto] pt-24 pb-8 md:pt-28 md:pb-10`.
- Row 1, side line: `flex md:justify-end` → `<p class="flex max-w-70 gap-2.5 text-small leading-[1.55] text-muted">`
  with a dot `mt-1.5 size-2 shrink-0 rounded-full bg-accent` (`aria-hidden`, `data-anim="hero-dot"`).
  Phone: left-aligned (decision); md+: right, as v3.
- Row 2, name: `<h1 class="flex flex-col justify-center font-display font-bold uppercase text-hero leading-[0.82] tracking-[-0.015em] text-accent {condensed}">`.
  Each line is `<span class="block overflow-hidden pb-[0.12em]">` → `<span data-anim="hero-line" class="block">`.
  The 0.12em bottom padding keeps the Q tail in WAQAS inside the clip (user's choice, 2026-09-24).
  MUHAMMAD `text-right`, WAQAS `text-left`. A text space sits between the two wrappers so the
  accessible name reads "Muhammad Waqas". The name paints in front of the portrait.
- Row 3: `flex flex-col gap-4 md:flex-row md:flex-wrap md:items-end md:justify-between md:gap-5`
  (`data-anim="hero-fade"`, as is row 1): tag `<p class="{monoLabel}">`, then buttons
  `flex flex-col gap-2.5 md:flex-row`: See proofs (`pillOutline`, `href="#proofs"`), then
  `BookCallLink variant="hero"` (`pillPrimary`). Both `w-full md:w-auto`. DOM order is the visual order.
- **Phone:** side line, name, tag, stacked buttons all fit one 640px screen; the photo sits behind
  the lower half, and the fade keeps the buttons legible.

### 2.2 Sizes

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Section height | 100svh, min 640 | 100svh | 100svh (900) | capped 1200 |
| Name (`text-hero`) | 72px | 100px | 187px | 220px |
| Side line | 14px, left, max 280 | 14px, right | same | same |
| Portrait box | 60% h × 83% w, max 448 (~300×444 on 740) | 88% h × 58vw (~445×901) | 620×792 | 620×1056 |
| Tag | 13px mono | same | same | same |
| Buttons | full width, 48 tall, stacked | auto, row | same | same |

- **Screen check:** MUHAMMAD at 72px must fit 320px. If it clips, raise it to the lead (see
  Choices); the type is never shrunk below the token and never scrolls sideways.

### 2.3 States

| Element | Default | Hover | Focus-visible | Active |
|---|---|---|---|---|
| See proofs | `border-line bg-bg/50 text-text` | `border-accent text-accent` | `focusRing` | `bg-band` |
| Book a call | `bg-accent text-on-accent` | `bg-text` | `focusRing` | `bg-muted` |

### 2.4 Content slots (`content/home.ts → hero`)

| Key | Meaning | Limit |
|---|---|---|
| `hero.firstName` / `hero.lastName` | "Muhammad" / "Waqas" from facts → Name; uppercased by CSS | fixed |
| `hero.sideLine` | What the user does for the reader, one idea (facts → Who) | 16 words, 88 characters (the user's chosen line; above the voice doc's 12-word hero limit by the user's choice) |
| `hero.tag` | Mono tag naming the two offers (agents, web) | 5 words |
| `hero.seeProofs` | Outline button that jumps to Proofs | 3 words |
| `hero.portraitAlt` | What's in the photo: the user, waist-up, dark background | 125 characters |
| Book a call | `nav.bookCall` (shared) | fixed |

### 2.5 Images, components, motion

- **Image:** `portrait` → `/images/portrait.png` (stand-in; the user swaps the file at the same
  path). `SiteImage` with `object-cover object-top`, `priority`, `sizes="(min-width: 768px) min(620px, 58vw), 83vw"`.
  The box sets the crop: face and shoulders stay in view at every width.
- **Components:** `components/home/hero/HeroSection.tsx`, `HeroGrid.tsx`, `HeroPortrait.tsx`,
  `HeroSideLine.tsx`, `HeroName.tsx`, `HeroActions.tsx` (tag and buttons).
- **Motion (later):**
  - Name lines (`hero-line`): rise from `translateY(105%)` inside their clipped wrappers, staggered 0.12s, on load.
  - Side line and bottom row (`hero-fade`): fade up from 14px, after the name, on load.
  - Dot (`hero-dot`): opacity 0.25↔1 loop.
  - Portrait (`hero-portrait`): fades in on load; on scroll, y at 0.15× scroll and scale to 1.06;
    mouse drift ±9px x on `pointer: fine`. It animates the inner box; the outer box only positions.
  - Text layer (`hero-text`): y at 0.35× scroll and fades to 0 by 75% of the viewport height.

---

## 3. Marquee (transition, no claim)

### 3.1 Layout and classes

- `<div class="overflow-hidden border-y border-line bg-band py-5.5">`, full bleed.
- Visible strip, `aria-hidden="true"`: `<div data-anim="marquee-track" class="flex w-max">` holding
  **two identical sets**, each `<div data-anim="marquee-set" class="flex shrink-0 items-center gap-14 pr-14">`.
  Items: `font-display font-medium text-marquee leading-none tracking-[-0.02em] whitespace-nowrap text-muted/30 {condensed}`.
  After each item, a separator `AsteriskIcon` (`components/icons/AsteriskIcon.tsx`, an eight-spoke
  asterisk) with `size-8 shrink-0 text-accent`, `aria-hidden`. Drawn, not a typed `✳`, which can
  show as a colour emoji on Apple devices and ignore the accent colour.
- Screen readers get `<ul class="sr-only">` of the same five items instead.
- Static: one still row starting at the left edge, clipped on the right. Never scrolls sideways.
- Contrast: the strip is decorative (`aria-hidden`), so `muted/30` is exempt; the real list is hidden text.

### 3.2 Sizes

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Strip height | 22 + 40 + 22 = 84 | 84 | 84 | 84 |
| Item text | 40px | 40px | 40px | 40px |
| One set | ~2400px wide, so two sets always overfill 3840 | same | same | same |

### 3.3 Slots, components, motion

| Key (`content/home.ts → marquee`) | Meaning | Limit |
|---|---|---|
| `marquee.items` (5) | Customer messages, lead follow-up, recurring reports, connected tools, websites end to end (facts: automation and build offers) | 4 words each |

- **Component:** `components/home/MarqueeStrip.tsx`. **Images:** none.
- **Motion (later):** `marquee-track` moves x 0 → −50% linearly (~28s), looping; still under reduced motion.

---

## 4. Agents (the one question: what can their agents handle for my business?)

Both variants are built; the user picks one, and the loser is deleted (page doc).

### 4.1 Shared parts

- `AgentsSection` (server): section frame, `id="agents"`, no `border-t`. Takes `variant: "tabs" | "stack"`.
- `SectionLabel as="h2"` with `agents.number` and `agents.label`. There's no big heading here.
- `AgentRowText`: `grid grid-cols-[1.25rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-2.5`:
  number `font-mono text-meta`; title `font-display font-semibold text-row leading-none tracking-[-0.035em] {condensed}`;
  line `col-start-2 text-lead leading-normal text-muted`.
- `AgentDemoFrame` (the panel): `flex flex-col overflow-hidden rounded-3xl border border-line bg-band`.
  - Header: `flex items-center justify-between border-b border-line px-5 py-4 {metaLabel}`: a status dot
    (`size-1.5 rounded-full bg-accent`, `aria-hidden`, `data-anim="demo-status-dot"`) with
    `agents.demoStatus`, and the slug on the right.
  - Body: `relative flex flex-1 flex-col justify-center p-5 md:p-8 xl:p-9`.
  - Size: `min-h-96` below `lg`; `lg:aspect-[10/9] lg:min-h-0` in variant A,
    `lg:aspect-[16/10] lg:min-h-0` in variant B.
- Inner raised surfaces in panels (bubbles, rows, nodes, cards) use `bg-line/40`.

### 4.2 Variant A: tab list (`AgentsTabs`, client)

- Layout: `grid gap-10 md:gap-12 lg:grid-cols-2 lg:items-center lg:gap-16 xl:gap-24`. Left:
  `flex flex-col gap-10` (label, tab list). Right: the four panels stacked in one cell. Phone and
  tablet: the list first, then the panel below.
- Tab list: `<div role="tablist" aria-orientation="vertical" aria-labelledby={labelId}>`. Each row is
  `<button role="tab" aria-selected aria-controls tabIndex={selected ? 0 : -1}>` with
  `relative block w-full border-t border-line py-5 text-left` + `focusRing`, holding `AgentRowText`.
  The row's one-line description renders on the selected row only.
- Progress line per row: `<span aria-hidden data-anim="agent-progress" class="absolute inset-x-0 -top-px h-px origin-left bg-accent">`,
  full width on the selected row in static, `scale-x-0` on the others.
- Panels: one `<div role="tabpanel" id aria-labelledby tabIndex={0}>` per offer; the three
  unselected have `hidden`. First offer selected on load.
- Keyboard (`hooks/useRovingTabs.ts`): Up/Down move and select, Home/End jump, Tab moves into the panel.
- **No-JS fallback:** the tab list and panels take `noscript:hidden` (Tailwind ≥4.1,
  `@media (scripting: none)`), and a `<noscript>` renders variant B's list in their place.

| Row part | Default (unselected) | Hover | Focus-visible | Selected |
|---|---|---|---|---|
| Number | `text-muted` | same | ring on row | `text-accent` |
| Title | `text-muted/60` (3.2:1, large text) | `text-muted` | ring on row | `text-text` |
| Line | not rendered | n/a | n/a | `text-muted`, visible |
| Top line | `border-line` | same | same | accent progress line over it |

### 4.3 Variant B: every row with its panel (`AgentsStack`, server)

- Label, then `<ol>` of four `<li class="grid gap-6 border-t border-line py-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-16 lg:py-14">`.
  Each holds `AgentRowText` (title as `<h3>`; number `text-accent`, title `text-text`, line always
  visible) and its own `AgentDemoFrame`. Nothing is interactive.

### 4.4 Demo panels, finished state (all server; sample content under §7 item 5)

- **ChatDemo** (`support-agent`): `flex flex-col gap-3.5`.
  - Customer bubble: `self-start max-w-[70%] rounded-xl rounded-bl-sm bg-line/40 px-4.5 py-3.5 text-body-lg text-text`.
  - Typing dots: `hidden` in static (`data-anim="demo-typing"`: three `size-1.5 rounded-full bg-muted`).
  - Agent reply: `self-end flex max-w-[72%] flex-col items-end gap-1.5` → bubble `rounded-xl rounded-br-sm bg-accent px-4.5 py-3.5 text-body-lg text-on-accent`, then meta `{metaLabel}`.
  - Second customer bubble as the first.
- **LeadsDemo** (`lead-agent`): `flex flex-col gap-2.5`, three rows
  `flex items-center justify-between gap-3 rounded-xl border border-line bg-line/40 px-3.5 py-3.5 md:px-4.5 md:py-4`.
  - Left: avatar `grid size-8 md:size-9 shrink-0 place-items-center rounded-full bg-line font-mono text-nav font-medium text-muted` (initials), then `min-w-0` name `text-body font-medium text-text` over source `{metaLabel}`.
  - Right: status pill `DemoStatusPill` ("followed up"). The "new" pill (`rounded-full border border-line px-3 py-1.5 font-mono text-meta text-muted`) is in the markup with `hidden` (`data-anim="demo-before"`).
- **ReportDemo** (`report-agent`): `flex h-full flex-col justify-end gap-5`.
  - Title row: `flex items-baseline justify-between`: title `font-display font-semibold text-summary tracking-[-0.02em]`, week `{metaLabel}`.
  - Chart (`aria-hidden`): `flex min-h-40 flex-1 items-end gap-2.5 border-b border-line`; 8 bars
    `flex-1 rounded-t-md bg-line`, the last `bg-accent`; heights from `report.bars` as inline `height: n%`.
    `report.chartAlt` sits in `sr-only` beside it.
  - `DemoStatusPill` ("sent to team · Mon 09:00"), `self-start`.
- **SyncDemo** (`sync-agent`): `flex flex-col gap-6 md:gap-9`.
  - Tool row: `flex items-center`: three nodes `rounded-xl border border-line bg-line/40 px-3.5 py-4 font-mono text-nav font-medium text-text`,
    with a connector between each pair: `relative h-px flex-1 border-t border-dashed border-line`,
    and a packet `absolute left-1/2 -top-1 size-2 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_12px_var(--color-accent)]` (`data-anim="demo-packet"`, `aria-hidden`).
  - Events: `grid gap-2 sm:grid-cols-3 sm:gap-2.5`; each `flex justify-between gap-2 rounded-xl bg-line/40 p-3.5 sm:flex-col sm:justify-start`: kind `{metaLabel}`, result `text-small text-text`.
  - `DemoStatusPill` ("all tools in sync"), `self-center`.
- **DemoStatusPill:** `inline-flex items-center gap-2 rounded-full bg-accent px-3.5 py-2 font-mono text-meta font-medium whitespace-nowrap text-on-accent`, with `CheckIcon` (`size-3`).
- Every timed part carries `data-demo-order="n"` (its place in the sequence) for the GSAP pass.

### 4.5 Sizes

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Layout | stacked | stacked | A: 2 cols (616 each); B: rows 5/7 | A: 720 each; B: 5/7 of 1536 |
| Row title (`text-row`) | 34px | 34px | 58px | 58px |
| Row line | 17px | 17px | 17px | 17px |
| Panel | 320 wide, min 384 tall | 706 wide, min 384 | A: 616×554; B: ~737×460 | A: 720×648; B: ~840×525 |
| Panel padding | 20 | 32 | 36 | 36 |
| Chat bubble text | 16px | 16px | 16px | 16px |

### 4.6 Content slots (`content/home.ts → agents`)

| Key | Meaning | Limit |
|---|---|---|
| `agents.number` / `agents.label` | "01" and the section label (the section's h2) | 5 words |
| `agents.items[0–3].title` | Customer messages / Lead follow-up / Recurring reports / Connected tools | 1–3 words (giant rows) |
| `agents.items[0–3].line` | What the agent does for the reader, the offer in plain present tense (constitution §7.3) | 12 words (automation row) |
| `agents.items[0–3].slug` | support-agent / lead-agent / report-agent / sync-agent (sample) | 1 slug |
| `agents.demoStatus` | "agent running" panel status (sample) | 3 words |
| `agents.demos.chat.customer` / `.reply` / `.replyMeta` / `.thanks` | The four chat lines (sample) | 12 words each |
| `agents.demos.leads.rows[3]` `{initials, name, source}` | Sample first names and where each lead came from | 3 words each |
| `agents.demos.leads.statusNew` / `.statusDone` | "new" / "followed up" | 2 words |
| `agents.demos.report.title` / `.week` / `.bars[8]` / `.chartAlt` / `.sent` | Report sample: title, week number, bar heights (%), hidden chart text, sent status | title 3 words, alt 12, sent 6 |
| `agents.demos.sync.tools[3]` / `.events[3]` `{kind, result}` / `.done` | Tool names, three sync events, final status | 3 words each |

### 4.7 Components, images, motion

- **Components:** `components/home/agents/AgentsSection.tsx`, `AgentsTabs.tsx` (client, A),
  `AgentsStack.tsx` (B), `AgentRowText.tsx`, `AgentDemoFrame.tsx`, `AgentDemo.tsx` (picks the demo
  by kind), `ChatDemo.tsx`, `LeadsDemo.tsx`, `ReportDemo.tsx`, `SyncDemo.tsx`, `DemoStatusPill.tsx`;
  `hooks/useRovingTabs.ts`. **Images:** none.
- **Motion (later):**
  - A: 6s auto-advance; the selected row's `agent-progress` grows `scaleX` 0→1 over 6s; paused on
    hover or focus-within; off under reduced motion. The line fades up when its row is selected.
  - Status dot: opacity blink loop.
  - Each demo replays from the start when its panel shows (A: on select; B: on entering view, once):
    parts pop in (`y 8px, scale .96 → none`) in `data-demo-order`. Chat: typing dots show, then hide
    before the reply. Leads: each `demo-before` pill swaps to "followed up", staggered. Report: bars
    grow `scaleY` from the bottom, staggered, then the pill pops. Sync: packets travel left→right
    along their connector on a loop, then events and the pill pop.

---

## 5. Process (the one question: how do they work?), a new design beyond v3

### 5.1 Layout

- Section frame, `id="process"`. Inner: `flex flex-col gap-14 md:gap-20 xl:grid xl:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] xl:items-center xl:gap-16 2xl:gap-24`.
- Left: `flex flex-col gap-7`: `SectionLabel` (`process.number`, `process.label`), `SectionHeading size="heading"`.
- Right: `ProcessLoop`: a `relative` wrapper holding the `<ol>` of four `ProcessStep`s and, from
  `xl`, the `ProcessRing` behind them. **One set of steps in the DOM**; CSS moves them.
- `ProcessStep` text: `STEP n` `{metaLabel} uppercase`, title `<h3 class="font-display font-semibold text-step leading-[1.05] tracking-tight text-balance text-text {condensed}">`,
  line `text-body-lg leading-normal text-muted max-w-70`. Gap `gap-2.5`.

### 5.2 Phone to `lg`: a column with a return line

- `<ol class="grid max-w-2xl grid-cols-[3rem_minmax(0,1fr)]">`; each `<li class="col-span-2 grid grid-cols-subgrid pb-12 last:pb-0">`
  (padding, not gap, so the rail runs unbroken).
- Col 1 is the rail (`relative`, `aria-hidden` parts): dot `relative z-10 mx-auto mt-2 size-4 rounded-full bg-accent ring-8 ring-accent/15`
  (`data-anim="process-dot"`), dot centre at x 24, y 16. Loop segment per step, `absolute left-1.25 w-5 border-accent`:

| Step | Segment classes | Draws |
|---|---|---|
| 1 | `top-4 bottom-0 border-2 border-b-0 rounded-tl-xl` | the return line turning into dot 1, and the forward line leaving it |
| 2, 3 | `inset-y-0 border-x-2` | forward line (right) and return line (left) |
| 4 | `top-0 h-4 border-2 border-t-0 rounded-bl-xl` | forward line into dot 4, turning back onto the return line |

  The segments' right border (x 23–25) runs through the dot centres; the left border (x 5–7) is the
  return. Together they read as one closed loop. On steps 2 and 3, a `ChevronUpIcon`
  (`absolute left-1.5 top-1/2 size-3 -translate-1/2 text-accent`) sits on the return line to show direction.
- After the list: `<p class="pl-12 pt-4 {metaLabel}">` with `process.loopLabel`.
- Below `xl` the ring is `hidden`.

### 5.3 From `xl`: the ring (`ProcessRing`, `aria-hidden`)

- `<ol>` becomes `xl:grid xl:grid-cols-[minmax(0,1fr)_18rem_minmax(0,1fr)] xl:grid-rows-[1fr_18rem_1fr] xl:gap-8 2xl:grid-cols-[minmax(0,1fr)_20rem_minmax(0,1fr)] 2xl:grid-rows-[1fr_20rem_1fr]`.
  The `1fr` rows and columns size equally, so the ring cell sits exactly at the wrapper's centre.
  Rails, the loop label and chevrons are `xl:hidden`; `li` padding resets with `xl:pb-0`.
- Step placement, clockwise from the top:

| Step | Cell | Alignment |
|---|---|---|
| 1 | `xl:col-start-2 xl:row-start-1` | `xl:self-end xl:text-center xl:items-center` |
| 2 | `xl:col-start-3 xl:row-start-2` | `xl:self-center xl:text-left` |
| 3 | `xl:col-start-2 xl:row-start-3` | `xl:self-start xl:text-center xl:items-center` |
| 4 | `xl:col-start-1 xl:row-start-2` | `xl:self-center xl:text-right xl:items-end` |

- Ring: `<div class="pointer-events-none absolute inset-0 m-auto hidden size-72 xl:block 2xl:size-80">`, centred without transforms. Inside:
  - `<svg viewBox="0 0 100 100" class="size-full overflow-visible text-accent">`.
  - Loop path, starting at the top, clockwise: `<path data-anim="process-path" d="M50 0 A50 50 0 0 1 50 100 A50 50 0 0 1 50 0" fill="none" stroke="currentColor" stroke-width="2" vector-effect="non-scaling-stroke" />`.
  - Four direction arrowheads between the steps, `fill="currentColor"`, each
    `<path d="M-3 -3 L2.5 0 L-3 3 Z" transform="translate(X Y) rotate(A)" />`:
    `(85.36 14.64) 45°`, `(85.36 85.36) 135°`, `(14.64 85.36) 225°`, `(14.64 14.64) 315°`.
    Each points clockwise along the tangent.
  - Four dots, HTML over the SVG (`data-anim="process-dot"`), each `absolute size-4 rounded-full bg-accent ring-8 ring-accent/15`:
    top `left-1/2 top-0 -translate-1/2`, right `right-0 top-1/2 translate-x-1/2 -translate-y-1/2`,
    bottom `left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2`, left `left-0 top-1/2 -translate-1/2`.
  - Centre: `process.loopLabel` in `absolute inset-0 m-auto grid max-w-32 place-items-center text-center {metaLabel} uppercase`
    (decorative at `xl`; the same slot is the visible column label below `xl`).
  - Runner for the GSAP pass: `<span data-anim="process-runner" class="absolute left-1/2 top-0 hidden size-3 -translate-1/2 rounded-full bg-text">`.
- The 32px gap clears each dot's 8px radius plus its 8px halo, so text never touches a dot.

### 5.4 Sizes

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Layout | heading, then column | same, column max 672 | heading 4/12 beside a ring 8/12 | same |
| Heading (`text-heading`) | 44px | 50px | 94px | 104px |
| Ring diameter | n/a | n/a | 288 (`xl`); 320 from 1536 | 320 |
| Side step column | n/a | n/a | ~195 (at 1280) to 250 | ~288 |
| Step title (`text-step`) | 32px | 32px | 32px | 32px |
| Step line | 16px, max 280 | same | same | same |
| Dot | 16 + 8px halo | same | same | same |
| Loop line | 2px `accent` | same | same (non-scaling) | same |

### 5.5 Slots, components, images, motion

| Key (`content/home.ts → process`) | Meaning | Limit |
|---|---|---|
| `process.number` / `process.label` | "02" and the section label | 5 words |
| `process.heading.lead` / `.accent` | The heading; `accent` is its last words, in violet (facts → How the user works) | 6 words in total |
| `process.stepLabel` | "Step" before each number | 1 word |
| `process.steps[0–3].title` | Written rules / agents do the work / they check themselves / lessons update the rules | 4 words |
| `process.steps[0–3].line` | One line on the step, facts level only (no agent names, tools or counts) | 10 words |
| `process.loopLabel` | Says the loop returns to step 1 with better rules | 5 words |

- **Components:** `components/home/process/ProcessSection.tsx`, `ProcessLoop.tsx` (list plus
  placement), `ProcessStep.tsx`, `ProcessRail.tsx` (a step's dot and loop segment), `ProcessRing.tsx`.
  **Images:** none.
- **Motion (later):** the heading and steps reveal on scroll (`data-anim="reveal"`). A runner travels
  the loop continuously (ring: along `process-path`; column: down the forward line and back up the
  return, a path built from the rail boxes); the dots dim to `bg-line` and light as it passes.
  Reduced motion: no runner, all dots lit (the static state).

---

## 6. Web (the one question: can they build my website end to end?)

### 6.1 Layout and classes

- Section frame, `id="web"`. Inner: `grid gap-10 md:gap-12 lg:grid-cols-2 lg:items-start lg:gap-16 xl:gap-24`.
- Left (`data-anim="reveal"`): `flex flex-col gap-7 lg:sticky lg:top-30`: `SectionLabel`,
  `SectionHeading size="heading-sm"`, lead `<p class="max-w-sm text-lead leading-normal text-muted">`.
  CSS sticky from `lg`; phone and tablet stack normally.
- Right: `<ol>` of four rows, `group grid grid-cols-[3rem_minmax(0,1fr)] gap-x-4 gap-y-3 border-t border-line py-7` (`data-anim="web-row"`):
  number `pt-3 font-mono text-meta text-accent`; title `<h3 class="font-display font-semibold text-row leading-none tracking-[-0.035em] text-text {condensed}">`;
  line `col-start-2 max-w-md text-body-lg leading-normal text-muted`.

| Row | Default | Hover (decoration; rows aren't interactive) | Focus / active |
|---|---|---|---|
| Number / title / line | `text-accent` / `text-text` / `text-muted` | line `group-hover:text-text` | n/a |

### 6.2 Sizes

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Layout | stacked | stacked | 2 cols, left sticky at 120px | same, in 1536 |
| Heading (`text-heading-sm`) | 40px | 40px | 72px | 80px |
| Lead | 17px, max 384 | same | same | same |
| Row title (`text-row`) | 34px | 34px | 58px | 58px |
| Row line | 16px, max 448 | same | same | same |

### 6.3 Slots, components, images, motion

| Key (`content/home.ts → web`) | Meaning | Limit |
|---|---|---|
| `web.number` / `web.label` | "03" and the section label | 5 words |
| `web.heading.lead` / `.accent` | Heading; last words in violet (facts → What the user can build) | 6 words in total |
| `web.lead` | One line: one person end to end, automations wired in (facts) | 40 words; aim for 15 |
| `web.steps[0–3].title` | Strategy / Design / Build / Launch & care | 1–3 words |
| `web.steps[0–3].line` | One line per step, facts only | 12 words |

- **Components:** `components/home/web/WebSection.tsx`, `WebStepRow.tsx`. **Images:** none.
- **Motion (later):** rows reveal on scroll, staggered 0.1s; hover indent (`padding-left` 0 → 12px)
  on `pointer: fine`; the left column reveals.

---

## 7. Proofs (the one question: have they built something real that people use?)

### 7.1 Section layout

- Section frame, `id="proofs"`. Inner: `flex flex-col gap-12 md:gap-16 lg:gap-20`.
- Header: `flex flex-wrap items-end justify-between gap-6`: left `flex flex-col gap-7`
  (`SectionLabel`, `SectionHeading size="heading"`); right `<p class="{metaLabel}">` with `proofs.hint`.
- Grid: `<ul class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">`, one `<li>` per project, in the
  order Exile, Design Vault, MARWIX-SKILLS. **The three cards are identical.** Phone: stacked.
  `md`: two across, and MARWIX-SKILLS starts the second row at the same card width, left-aligned.
  `lg` and up: three across.

### 7.2 Card (`ProofCard`, server; one component, one set of inputs)

- **Inputs:** `href` (the project's hash), `number`, `tag`, `title`, `cardLine`, `shot` (an image
  name) and `shotAlt`. The same for all three; no numbers and no variant on any card.
- Each card is one `<a href="#exile">` (`#design-vault`, `#marwix-skills`) with `data-proof-card`,
  `aria-labelledby="{titleId} {openId}"`, and
  `group flex h-full flex-col overflow-hidden rounded-3xl bg-cream text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-text`.
- Shot: `m-2.5 aspect-[16/10] overflow-hidden rounded-xl`, holding `SiteImage`.
- Text: `flex flex-1 flex-col gap-2.5 px-6 pt-5.5 pb-6.5`: meta row `flex justify-between {metaLabel} text-cream-muted`
  (`0n · tag` left; `proofs.open` plus `ArrowUpRightIcon` right, `id={openId}`); title
  `<h3 class="font-display font-semibold text-card leading-none tracking-[-0.03em] {condensed}">`;
  line `text-body leading-[1.45] text-cream-muted`.

| Card part | Default | Hover | Focus-visible | Active |
|---|---|---|---|---|
| Card | `bg-cream text-ink` | title `underline decoration-1 underline-offset-4`; open meta `text-ink` | 2px `outline-text`, 4px offset (on dark) | `bg-cream/90` |

### 7.3 Takeover (`ProjectTakeover`, server markup; `TakeoverController`, client)

- **Element:** one `<dialog id="exile" aria-labelledby={titleId}>` per project (ids from
  `lib/routes.ts`), `hidden target:block fixed inset-0 z-50 m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain border-0 bg-cream p-0 text-ink`.
- **Behaviour:**
  - The card link sets the hash (a real history entry). `TakeoverController` (`hooks/useHashTakeover.ts`)
    reads the hash on load and on `hashchange`: a project hash calls `showModal()` on its dialog
    (native focus containment; the page behind is inert) and adds `overflow-hidden` to `<html>`.
  - **Close** (button), **Esc** (the dialog's `cancel` event, default prevented) and the browser
    **Back** button all end in the same place: if the takeover was opened from the page,
    `history.back()`; if the page loaded straight on the hash, `location.replace("#proofs")`. The
    hash change then closes the dialog, and focus returns to that project's card.
  - A shared link (`/#design-vault`) opens straight to that takeover.
  - **Next project** replaces the hash (`location.replace`), so Back always closes rather than
    stepping through projects. It wraps from the last project to the first.
  - **No JS:** `:target` shows the dialog; the Close link (`href="#proofs"`) and Back close it,
    and every part is readable.
  - Static: it opens and closes instantly. Screen check: the page doesn't jump on open.
- **Template: seven parts, identical for all three projects, shots included** (inside `data-anim="takeover-content"`):
  1. **Top bar**, `TakeoverTopBar`: `sticky top-0 z-10 flex items-center justify-between bg-cream/85 backdrop-blur-md px-gutter py-3 md:py-4.5 font-mono text-nav text-cream-muted`.
     Left: "PROOF 0n / 03 · tag", uppercase. Right: `TakeoverCloseLink` (client),
     `<a href="#proofs">` with `inline-flex min-h-11 items-center gap-2.5 rounded-full bg-ink px-4 font-mono text-nav font-medium text-cream hover:bg-accent hover:text-on-accent active:bg-accent/80 {focusRingOnCream}`:
     `proofs.takeover.close`, `proofs.takeover.escHint` (`aria-hidden`, `hidden md:inline`), `CloseIcon`.
  2. **Title:** `<h2 class="font-display font-semibold text-takeover leading-[0.88] tracking-[-0.045em] text-ink {condensed}">`.
  3. **Info rows** (`TakeoverInfoRows`): `<dl class="grid grid-cols-[5.5rem_minmax(0,1fr)] content-start gap-x-5 gap-y-3.5 text-body">`,
     labels `<dt class="pt-0.5 font-mono text-meta uppercase text-cream-muted">`: WHAT IT IS, BUILT, IN USE.
     The IN USE `<dd>` holds its line, then `TakeoverStats` when the project has `inUseStats`
     (only Exile does): `<ul class="mt-3 flex flex-wrap gap-x-8 gap-y-3">`, each `<li class="flex flex-col gap-1">`
     with the value `font-display font-semibold text-card leading-none text-ink {condensed}` over the
     label `font-mono text-meta uppercase text-cream-muted`. These are the only numbers in Proofs.
  4. **Summary:** `<p class="text-summary leading-[1.4] tracking-[-0.01em] text-pretty text-ink">`.
     Parts 3 and 4 share `grid gap-10 border-t border-ink/15 pt-8 md:grid-cols-2`.
  5. **Shots** (`TakeoverShots`): `flex flex-col gap-5`: one big `aspect-[2/1] overflow-hidden rounded-3xl`,
     then `grid gap-5 sm:grid-cols-2` of two details `aspect-[4/3] overflow-hidden rounded-3xl`.
  6. **Visit:** `ExternalLink` styled `inline-flex min-h-12 items-center gap-2 self-start rounded-full bg-ink px-6 text-body font-semibold text-cream hover:bg-accent hover:text-on-accent active:bg-accent/80 {focusRingOnCream}`
     with `ArrowUpRightIcon`. Exile → `links.exile` (the only place exile.marwix.dev is linked);
     Design Vault and MARWIX-SKILLS → their GitHub links.
  7. **Next project**, `TakeoverNextLink` (client): `<a href="#design-vault">`,
     `group flex flex-col gap-3 border-t border-ink/15 pt-12 pb-16 {focusRingOnCream}`: label
     `{metaLabel} text-cream-muted uppercase` + `ArrowRightIcon`, then the next title
     `font-display font-semibold text-heading leading-[0.95] tracking-[-0.04em] {condensed} group-hover:text-cream-muted`.
- Content column: `px-gutter` → `{container} flex flex-col gap-10 pt-10 md:gap-14 md:pt-16 lg:gap-18 lg:pt-22`.

### 7.4 Sizes

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Heading (`text-heading`) | 44px | 50px | 94px | 104px |
| Cards | stacked, 320 wide | 2 across, 343 each; third on row 2 | 3 across, ~429 each | 3 across, ~499 each |
| Card shot (16:10) | 300×188 | 323×202 | ~409×256 | ~479×299 |
| Card title (`text-card`) | 30px | 30px | 43px | 44px |
| Takeover title (`text-takeover`) | 56px | 77px | 144px | 168px |
| IN USE numbers (Exile, `text-card`) | 30px | 30px | 43px | 44px |
| Summary (`text-summary`) | 20px | 20px | 26px | 26px |
| Info rows | label col 88 + 20 gap, values 212 | 2 cols with summary | same | same |
| Big shot | 320×160 | 706×353 | 1328×664 | 1536×768 |
| Detail shots | stacked, 320×240 | 343×257 each | 654×490 each | 758×568 each |
| Close / Visit | 44 / 48 tall | same | same | same |

### 7.5 Content slots (`content/home.ts → proofs`; addresses in `content/home.ts → links`)

| Key | Meaning | Limit |
|---|---|---|
| `proofs.number` / `proofs.label` | "04" and the section label | 5 words |
| `proofs.heading.lead` / `.accent` | "Work that runs"-style heading; last word in violet | 6 words in total |
| `proofs.hint` | Tells the reader a card opens | 6 words |
| `proofs.open` | Card meta "Open" | 1 word |
| `proofs.projects.{exile,designVault,marwixSkills}.tag` | One-word kind (facts only) | 2 words |
| `.title` | The project name, as in facts | fixed |
| `.cardLine` | What it does for its users | 12 words |
| `.cardShotAlt` | What's on the card screenshot | 125 characters |
| `.rows.whatItIs` / `.built` / `.inUse` | Facts only; MARWIX-SKILLS BUILT and IN USE stay `[FILL: …]` until the facts file has them | 12 words each |
| `.rows.inUseStats[]` `{value, label}` (Exile only) | "~20" communities and "4k+" commands run, exactly as filled; shown in the takeover's IN USE row | values fixed; labels 2 words |
| `.summary` | What it does for the people who use it | 40 words |
| `.shotAlts[3]` | What's on each takeover screenshot | 125 characters each |
| `.visitLabel` | Visit button text | 3 words |
| `proofs.takeover.proof` / `.close` / `.escHint` / `.next` | "Proof", "Close", "Esc", "Next project" | 2 words each |
| `proofs.takeover.rowLabels.whatItIs` / `.built` / `.inUse` | WHAT IT IS / BUILT / IN USE | 3 words each |
| `links.exile` / `links.designVault` / `links.marwixSkills` | Addresses from facts | fixed |

### 7.6 Images (all through `SiteImage`; `null` placeholders until the user's files arrive; none may ship)

Every project has the same four images: `{project}Card`, `{project}Shot1`, `{project}Shot2` and
`{project}Shot3`, where the project is `exile`, `designVault` or `marwixSkills`.

| Name (`lib/images.ts`) | Where | Ratio | Crop | `sizes` |
|---|---|---|---|---|
| `{project}Card` | Card shot | 16:10 | `object-cover object-top` | `(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw` |
| `{project}Shot1` | Takeover big | 2:1 | `object-cover object-top` | `min(100vw, 1536px)` |
| `{project}Shot2`, `{project}Shot3` | Takeover details | 4:3 | `object-cover object-center` | `(min-width:640px) 50vw, 100vw` |

### 7.7 Components and motion

- **Components:** `components/home/proofs/ProofsSection.tsx`, `ProofCard.tsx`, `ProjectTakeover.tsx`,
  `TakeoverTopBar.tsx`, `TakeoverInfoRows.tsx`, `TakeoverStats.tsx`, `TakeoverShots.tsx`,
  `TakeoverCloseLink.tsx` (client), `TakeoverNextLink.tsx` (client), `TakeoverController.tsx`
  (client, renders nothing); `hooks/useHashTakeover.ts`.
- **Motion (later):** cards reveal on scroll (stagger 0.12s); hover lifts a card −8px. Open: the
  dialog's `clip-path` expands from the card's rect (`data-proof-card`) to full screen (0.75s), and
  `takeover-content` rises 40px and fades in after 0.35s. Close: clip back to the card (0.6s), then
  the hash change. Next: content rises 60px and fades in. Reduced motion: instant.

---

## 8. Contact (the one question: how do I start?)

### 8.1 Layout

- Section frame, `id="contact"`. Inner: `grid gap-10 md:gap-12 lg:grid-cols-2 lg:items-start lg:gap-16 xl:gap-24`.
- Left (`data-anim="reveal"`): `flex flex-col gap-8`: `SectionLabel`, `SectionHeading size="heading-xl"`,
  lead `<p class="max-w-100 text-lead leading-normal text-muted">`, then `ContactLinks`:
  `<ul class="max-w-100 border-t border-line">`, three rows, each `<a>`
  `flex min-h-12 items-center justify-between gap-4 border-b border-line text-body text-text`:
  label left, kind right (`text-muted`, with `ArrowUpRightIcon` on the two new-tab rows).
  1. Book a call: the shared contact-row component, carrying `data-track="book-call"` so it's counted the same way as `BookCallLink` (new tab, no "30-minute" label).
  2. Email: `links.email` (mailto); its label is `links.emailAddress`.
  3. WhatsApp: `ExternalLink` to `links.whatsapp` (click-to-chat).
- Right, `BriefBuilder` (client), `data-anim="reveal"`: `<form aria-labelledby={headingId} class="flex flex-col gap-8 rounded-3xl border border-line bg-band p-6 md:p-8 lg:p-10">`,
  `onSubmit` prevented; nothing is posted. `headingId` is an `sr-only` heading from `contact.brief.heading`.

### 8.2 Brief builder parts

- **(01) Needs, multi-select chips** (`NeedChips`): `<fieldset>` + `<legend class="{metaLabel} uppercase mb-3.5">`;
  chips `flex flex-wrap gap-2`, each `<button type="button" aria-pressed>`
  `inline-flex min-h-11 items-center gap-2 rounded-full border px-4.5 text-body` + `focusRing`.
  AI agents pressed on load. A pressed chip shows `CheckIcon` (`size-3.5`), so state isn't colour alone.
- **(02) Timeline, single select** (`TimelineSegments`): `<fieldset>` + `<legend>`; track
  `grid grid-cols-3 rounded-xl border border-line bg-bg p-1`; each option is a native
  `<input type="radio" name="timeline" class="peer sr-only">` inside its `<label class="grid min-h-11 cursor-pointer place-items-center rounded-lg px-2 text-center text-small">`.
  Arrow keys move between options natively. This month checked on load.
- **(03) Repeat, textarea** (`RepeatField`): `<label for>` in `{metaLabel} uppercase`;
  `<textarea rows="4" class="min-h-30 w-full resize-y rounded-xl border border-muted/70 bg-bg px-4.5 py-4 text-body-lg leading-normal text-text placeholder:text-muted focus-visible:border-accent {focusRing}">`
  with placeholder `contact.brief.placeholders[0]`.
- **Send** (`SendBriefLink`): `<a href={mailto}>`
  `flex items-center justify-between gap-4 rounded-full bg-accent py-2 pr-2 pl-7 text-lead font-semibold text-on-accent hover:bg-text active:bg-muted {focusRing}`:
  the label plus `sr-only` `contact.brief.sendHint`, then `grid size-11 place-items-center rounded-full bg-bg text-accent` holding `ArrowRightIcon`.
  The mailto goes to `links.emailAddress` with the subject and body from `lib/brief.ts`, built from
  the choices and the `contact.brief.mail.*` slots. The server markup carries the default choices'
  mailto, so it works without JS.
- **Summary:** `<p aria-live="polite" class="text-center {metaLabel}">`: pressed needs joined by
  " + ", a " · ", then the timeline; `contact.brief.summaryEmpty` when no need is pressed.

| Control | Default | Hover | Focus-visible | Pressed / checked | Active |
|---|---|---|---|---|---|
| Chip | `border-line text-muted` | `border-muted text-text` | `focusRing` | `border-accent bg-accent text-on-accent` + check | `bg-line` (unpressed) |
| Segment | `text-muted` | `text-text` | `peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-text` | `peer-checked:bg-text peer-checked:text-bg` | `bg-line` |
| Textarea | `border-muted/70` | same | `border-accent` + `focusRing` | n/a | n/a |
| Send | `bg-accent text-on-accent` | `bg-text` | `focusRing` | n/a | `bg-muted` |
| Contact row | `text-text`, kind `text-muted` | label `text-accent` | `focusRing` | n/a | `bg-band` |

### 8.3 Sizes

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Layout | stacked | stacked | 2 cols (616 each) | 2 cols (720 each) |
| Heading (`text-heading-xl`) | 52px | 58px | 108px | 124px |
| Lead / links | 17px / 15px, rows 48 tall, max 400 | same | same | same |
| Builder padding | 24 | 32 | 40 | 40 |
| Chips | 15px, 44 tall, wrap | same | same | same |
| Segments | 3 × ~88, 44 tall | 3 × ~210 | 3 × ~176 | 3 × ~210 |
| Textarea | min 120 tall, 16px | same | same | same |
| Send | 60 tall, full width | same | same | same |

### 8.4 Content slots (`content/home.ts → contact`)

| Key | Meaning | Limit |
|---|---|---|
| `contact.number` / `contact.label` | "05" and the section label | 5 words |
| `contact.heading.lead` / `.accent` | Heading; last words in violet | 6 words in total |
| `contact.lead` | Build a short brief, then talk it through on a call | 40 words; aim for 15 |
| `contact.links.bookCall.kind` | Right-hand kind for the Book a call row (its label is `nav.bookCall`) | 2 words |
| `contact.links.email.kind` | "Email" | 1 word |
| `contact.links.whatsapp.label` / `.kind` | WhatsApp row text and kind | 5 / 2 words |
| `contact.brief.heading` | The builder's accessible name (sr-only) | 4 words |
| `contact.brief.needs.legend` / `.options[5]` | "01 / What do you need?"; AI agents, Automations, Website, Web app, Not sure yet | 6 words; 3 words each |
| `contact.brief.timeline.legend` / `.options[3]` | "02 / Timeline"; ASAP, This month, Exploring | 3 words; 2 words each |
| `contact.brief.repeat.label` / `.placeholders[4]` | "03 / What do you repeat every week?"; sample phrases, the first shown statically | 8 words; 5 words each |
| `contact.brief.send` / `.sendHint` | "Send brief"; hidden "opens your email app" | 2 / 5 words |
| `contact.brief.summaryEmpty` | Shown when no need is picked | 5 words |
| `contact.brief.mail.subjectPrefix` / `.need` / `.timeline` / `.repeat` / `.none` | Email subject and body labels (no em dashes) | 5 words each |

### 8.5 Components, images, motion

- **Components:** `components/home/contact/ContactSection.tsx`, `ContactLinks.tsx`,
  `BriefBuilder.tsx` (client), `NeedChips.tsx`, `TimelineSegments.tsx`, `RepeatField.tsx`,
  `SendBriefLink.tsx`; `hooks/useBriefState.ts`; `lib/brief.ts` (mailto and summary, pure). **Images:** none.
- **Motion (later):** the left column and the builder reveal on scroll (builder delayed 0.15s). The
  placeholder (`data-anim="brief-placeholder"`) rotates through `placeholders` every 2.4s, and stops
  on focus or once typed in; the first phrase stays under reduced motion.

---

## 9. Footer (the one question: where else can I find or reach them?)

### 9.1 Layout and classes

- `<footer class="overflow-hidden border-t border-line pt-10">` (full-bleed hairline).
- Row: `px-gutter` → `{container} flex flex-col items-start gap-6 text-small text-muted md:flex-row md:flex-wrap md:items-center md:justify-between`:
  1. Email: `<a href={links.email}>` `inline-flex min-h-11 items-center text-body-lg text-text hover:text-accent {focusRing}`.
  2. Socials: `<ul class="flex flex-wrap gap-x-6">`, LinkedIn · Instagram · Discord · WhatsApp as
     text `ExternalLink`s, `inline-flex min-h-11 items-center hover:text-text {focusRing}`. Each shows
     only when its address passes `lib/isFilled.ts` (`lib/socialItems.ts` overwritten: text only, no icons).
  3. `<p>`: `©`, `currentYear()` (build time, `lib/currentYear.ts`), then `footer.copyrightName`.
- Wordmark (`FooterWordmark`, `aria-hidden`, full bleed, outside the container):
  `mt-10 flex w-full justify-center whitespace-nowrap select-none font-display font-extrabold text-footer-mark leading-[0.78] tracking-[-0.05em] {condensedMark}`.
  Six `<span class="block">` letters: M and W `text-accent` (`data-anim="mark-accent"`); A R I X
  `text-line` (dim) with `max-w-[1em] overflow-x-clip` (`data-anim="mark-rest"`). The full word
  shows in static. It spans about 84vw, so it clears the edges at every width, and the footer clips as a guard.

| Element | Default | Hover | Focus-visible | Active |
|---|---|---|---|---|
| Email | `text-text` | `text-accent` | `focusRing` | `text-muted` |
| Social link | `text-muted` | `text-text` | `focusRing` | `text-text` |
| © / wordmark | static | n/a | n/a | n/a |

### 9.2 Sizes

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Row | stacked, left | one row, wraps if needed | one row | one row in 1536 |
| Email / links / © | 16 / 14 / 14px, 44 tall | same | same | same |
| Wordmark (`25vw`) | 90px (~302 wide) | 192px | 360px | 960px |

### 9.3 Slots, components, images, motion

| Key (`content/shared.ts → footer`) | Meaning | Limit |
|---|---|---|
| `footer.social.linkedin` / `.instagram` / `.discord` / `.whatsapp` | Link text: the platform name | 1 word |
| `footer.copyrightName` | "Muhammad Waqas" (facts → Name); © and year come from code | fixed |
| `footer.wordmark` | "MARWIX" (facts → Brand); the component splits the letters | fixed |
| `links.emailAddress`, `links.email`, `links.*` | Addresses (facts) | fixed |

- **Components:** `components/SiteFooter.tsx`, `FooterLinks.tsx`, `FooterWordmark.tsx`. **Images:** none.
- **Motion (later):** when 35% of the footer is in view, M and W fade and rise from
  `translateY(18%) scale(.9)`; then A R I X open from `max-width: 0` to `1em` and fade in, staggered
  0.1s. Reduced motion: the full word, still.

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
