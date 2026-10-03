# Intro

**Last Updated:** 2026-10-03

**The one question:** What is this page?

See `../page.md` for the site-wide index. Spec: `../ui-spec/01-intro.md`.

## Current State

Built. `RixIntro` is the page's `#top` section: an `h1` ("Play with" + accent "Rix", via
`SectionHeading`) and one line, "Press a button and Rix acts it out. Poke or pet him." (copy in
`content/rix.ts` → `intro`). Both reveal on load through `RixReveal` (`data-anim="reveal"`, the line
delayed 100ms; fade only under reduced motion). The top padding clears the fixed header.

## Key Files

- `components/rix/RixIntro.tsx` — the section
- `components/rix/RixReveal.tsx` — the section's load/scroll reveal, renders nothing
- `components/SectionHeading.tsx` — the shared heading
- `content/rix.ts` → `intro` — title and line

## Decisions

- 2026-10-03: /rix motion: sections reveal on data-anim="reveal" (fade only under reduced motion); walk buttons use a ramped, stride-locked walk (WALK_FAR: cadence eased over 3 steps at each end, speed-matched at each plant with a 12% per-step push, lean into the start, speed-scaled bob); the quip sits above with an upward glance; patrol pause looks on the bare floor are pointer / out / a shelf end; a tossed prop lands on the floor line (TOSS.floorY) so no paint leaves the stage.
- 2026-10-02 — A short title and one line only; no claims. The title is "Play with Rix".
- 2026-10-02 — The Intro carries `id="top"` so the nav's solid-band observer works on `/rix`.

## Open Questions

None.
