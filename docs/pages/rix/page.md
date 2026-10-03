# Rix

**Last Updated:** 2026-10-03

> **Status:** In build

**The one question:** None. `/rix` is the one extra route that `docs/00-constitution.md` §2 allows
(amended 2026-10-02): the Rix playground, where a visitor presses buttons to make the mascot act out
its emotions, moves and plays. It makes no claims, so it answers no "can they help me?" question.

Section detail lives in `sections/`; agents working on one section read this index plus that
section's file only. Rix himself (the gap-eyes MW mascot) is defined in
`docs/pages/home/ui-spec/00-rix.md`.

## Sections

| # | Section | The one question it answers | Facts source | Status | Doc |
|---|---|---|---|---|---|
| 1 | Intro | What is this page? | none (no claims) | Built | `sections/01-intro.md` |
| 2 | Playground | How do I make Rix act? | none (no claims) | Built | `sections/02-playground.md` |
| 3 | Way back | Where do I go from here? | `docs/03-facts.md` → Contact | Built | `sections/03-way-back.md` |

## Current State (site-wide)

Built: `app/rix/page.tsx` renders Intro, Playground and Way back, with metadata from `content/rix.ts`
through `lib/pageMetadata.ts` and a sharing image (`app/rix/opengraph-image.tsx`, `RixOgFigure`).
`lib/publishedRoutes.ts` lists `/` and `/rix`, so `/rix` is in the sitemap. The footer's
"Play with Rix" link sits between the socials and © (`components/FooterLinks.tsx`). The `/dev` route and its
files are deleted. Lint is green and tsc has no errors outside `.next/`; `npm run build` is pending
(see Open Questions). A screen check at 360/768/1440/3840 passed before the motion pass; the
re-check after it is pending.

## Key Files (site-wide)

- `app/rix/page.tsx` — imports and renders the sections; exports metadata through
  `lib/pageMetadata.ts`
- `app/rix/opengraph-image.tsx`, `components/rix/RixOgFigure.tsx` — the sharing image
- `components/rix/*`, `hooks/useRixPlayground.ts`, `lib/rixPlayground.ts`,
  `lib/rixPlaygroundMoves.ts`, `lib/botTokenColours.ts` — the playground's code
- `content/rix.ts` — the page's copy
- `app/layout.tsx` — the site nav and footer wrap this route unchanged
- `lib/publishedRoutes.ts`, `app/sitemap.ts` — the sitemap's route list
- `lib/pageMetadata.ts` — title, description and sharing image

## Decisions (site-wide)

- 2026-10-03: /rix motion: sections reveal on data-anim="reveal" (fade only under reduced motion); walk buttons use a ramped, stride-locked walk (WALK_FAR: cadence eased over 3 steps at each end, speed-matched at each plant with a 12% per-step push, lean into the start, speed-scaled bob); the quip sits above with an upward glance; patrol pause looks on the bare floor are pointer / out / a shelf end; a tossed prop lands on the floor line (TOSS.floorY) so no paint leaves the stage.
- 2026-10-02 — `/rix` exists as the one extra route (constitution §2): a public Rix playground that
  makes no claims.
- 2026-10-02 — Entry is a footer link only: not in the nav, not on the About shelf (see
  `docs/pages/home/sections/09-footer.md`).
- 2026-10-02 — Content is a short title and one line, a big Rix on a stage, the button groups
  (Tricks, Symbols), a patrol toggle, and a way back; the site nav and footer stay.
- 2026-10-02 — Home nav links become `/#agents` etc. so they work from `/rix`; the footer's
  "Play with Rix" link (`footer.rixLink`) points to `/rix`.
- 2026-10-02 — Indexed: own title, description and sharing image, and listed in `sitemap.xml`.

## Open Questions (site-wide)

- **Choice:** the footer link's placement (between the socials and ©) needs the user's confirmation.
- **To build:** screen re-check of `/rix` (and `/`) after the motion pass (listed in
  `sections/02-playground.md`). `npm run build` currently fails only on a stale
  `.next/dev/types/validator.ts` that references the deleted `app/dev`; it clears once the dev
  server regenerates it or `.next/dev` is removed.
- **Roll-up:** section-specific open questions remain in `sections/02-playground.md` (1). The
  About Fact copy on home is still SAMPLE (see `docs/pages/home/sections/02a-about.md`). The
  pre-deploy check reads this roll-up and every section file; the page ships with none open.
