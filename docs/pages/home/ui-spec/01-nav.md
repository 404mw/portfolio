# §1 Nav: UI spec

Shared rules and parts (§0): [`../ui-spec.md`](../ui-spec.md). Page doc: [`../sections/01-nav.md`](../sections/01-nav.md).

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
