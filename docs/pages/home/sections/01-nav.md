# Nav

**Last Updated:** 2026-09-25

**The one question:** Where can I go, and how do I book a call?

See `../page.md` for the site-wide index. Spec: `../ui-spec/01-nav.md`.

## Current State

The shared page frame and fixed Nav are built statically: a 2px scroll progress bar (built empty,
still slated for the GSAP pass) sits above a 64px nav row. The Nav turns solid via an observer on
`#top` once the hero passes; it has inline links (Agents · Web · Proofs · Contact) from `md`, a
phone menu below `md`, and a Book a call pill on the right — no brand mark. The phone menu is a
native `<details>`/`<summary>` element, so it opens and closes without JS; JS adds closing the menu
at `md` and up and on a link tap, Escape closing it, and syncing its open state on mount in case it
was opened before hydration. Escape moves focus back to the menu button only when focus was in the
menu or on the page body. While scrolling past the hero, the transparent Nav's links overlap the
big hero name; this stays as-is in the static build and will be fixed by the GSAP pass's hero-text
fade on scroll.

## Key Files

- `components/SiteHeader.tsx` — shared page frame and the fixed Nav
- `components/NavBar.tsx` — the Nav row and progress bar
- `components/NavLinks.tsx` — inline/phone nav links
- `components/NavMenu.tsx` — phone menu panel
- `components/ProgressBar.tsx` — scroll progress bar
- `hooks/useScrolledPast.ts` — observer that flips the Nav solid past `#top`
- `lib/navItems.ts` — nav link data

## Decisions

- 2026-09-24 — Nav: no brand mark. Pinned to the top at every width. Transparent over the hero,
  with a band background and a hairline once past it.
- 2026-09-24 — Scroll progress bar sits at the very top, above the nav. It's scroll-linked, so it
  is built in the GSAP pass; the static build reserves its place.
- 2026-09-24 — Nav links: Agents · Web · Proofs · Contact, each jumping to its section (no
  Process, no hero link).
- 2026-09-24 — Nav's Book a call pill opens the Cal.com link from the facts file in a new tab; it
  counts as a Book a call click.
- 2026-09-24 — Nav on phone: a menu button plus the Book a call pill; the links open in a simple
  panel below the nav (static now, animated in the GSAP pass). From `md` up, the links sit inline.
- 2026-09-24 — Social links are not in the nav (they live in the footer only — see
  `sections/09-footer.md`).
- 2026-09-24 — Section 1 built (static): the shared page frame and the fixed Nav, a 2px progress
  bar above a 64px row. The Nav turns solid via an observer on `#top` once the hero passes. It has
  inline links from `md`, a phone menu below `md`, a Book a call pill on the right and no brand
  mark. The shared parts (skip link, section label and heading, external and Book a call links,
  image and placeholder, icons) are in place for later sections.
- 2026-09-24 — The phone menu is a native `<details>`/`<summary>`, so it opens and closes without
  JS (constitution §5). JS adds these on top: it closes the menu at `md` and up and on a link tap;
  Escape closes it; it syncs its open state on mount in case the menu was opened before hydration.
  `aria-controls` is dropped because `<summary>` exposes its expanded state natively. The nav band
  uses `has-[details[open]]:bg-band`.
- 2026-09-24 — Escape always closes the phone menu. It moves focus back to the menu button only
  when focus was in the menu or on the page body, so it never pulls focus from elsewhere on the
  page. It skips events that are already handled.
- 2026-09-24 — `BookCallLink` has only the `nav` and `hero` variants.
- 2026-09-24 — User's choice: while scrolling past the hero, the transparent Nav's links overlap
  the big name; this stays as is in the static build and is fixed by the GSAP pass's hero-text
  fade on scroll (the Nav decision is unchanged).

## Open Questions

None.
