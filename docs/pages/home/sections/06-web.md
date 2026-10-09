# Web

**Last Updated:** 2026-10-08

**The one question:** Can they build my website end-to-end?

See `../page.md` for the site-wide index. Spec: `../ui-spec/06-web.md`.

## Current State

Web built: two columns from `lg` (left sticky at 120px from the top, CSS only, no JS), four
static step rows; stacks below `lg`. Its lead (`web.lead`, round 1 copy, 2026-10-08) reads "One
person, from plan to launch: your website or web app, ready to take bookings and answer visitors
from the start." Web pins and travels visibly, using the shared
`splitColumns`/`stickyTitle` helpers in `lib/styles.ts` (see `../page.md`).

The GSAP motion pass is built: `WebMotion` mounts the generic reveal on the left column and
`useWebRows` on the four rows. The rows rise 56px and fade in, staggered 0.1s apart, via the
shared `lib/revealBatch.ts` (`ScrollTrigger.batch`, same from-state as the generic reveal). On a
fine pointer, a hovered row's `padding-left` eases 0→12px and back (`gsap.quickTo`). Reduced
motion: fades only, no rise, no indent. Everything shows as built with no JS.

## Key Files

- `components/home/web/` — WebSection (sticky left column from `lg`), WebStepRow (the four
  numbered rows), WebMotion (client, mounts the reveal and `useWebRows`, renders nothing)
- `hooks/useWebRows.ts` — the rows' staggered reveal and fine-pointer hover indent
- `lib/revealBatch.ts` — shared `ScrollTrigger.batch` staggered list reveal (used here and by
  Proofs' cards)

## Decisions

- 2026-09-24 — Web section kept; the offer was added to the facts file ("What the user can
  build").
- 2026-09-24 — Web keeps v3's structure: numbered label 03, heading with its last words in
  violet, one lead line, four numbered rows (Strategy, Design, Build, Launch & care) with one
  line each. Facts: "What the user can build".
- 2026-09-24 — Web layout: from `lg` up the left column (label, heading, lead) is CSS sticky
  while the rows scroll; phone and tablet stack normally.
- 2026-09-24 — Web rows are readable by default: titles in `text`, descriptions in `muted`,
  numbers in violet; hover brightens slightly. Motion (later): the hover indent, plus reveal on
  scroll.
- 2026-09-24 — Web step 1 reads "First, I plan what your site needs to do." (first person).
- 2026-09-25 — Web pins its left column (label, heading, lead) at 120px from the top from `lg`
  (CSS sticky, no JS), part of the site-wide split/sticky-title pattern (see `../page.md`). Web
  pins and travels visibly.
- 2026-09-26 — The GSAP motion pass is built (ui-spec §6.3): generic reveal on the left column,
  rows reveal 56px rise + fade staggered 0.1s (`lib/revealBatch.ts`), hover indent 0→12px on fine
  pointer; reduced motion keeps fades only, no indent.
- 2026-09-26 — Bug fix: `lib/revealBatch.ts` now runs its reveal tween through the calling
  matchMedia branch's `context.add`, not useGSAP's `contextSafe`; `contextSafe` could crash with a
  stack overflow when the page loaded already scrolled to Web (e.g. `/#web`), since its context
  ended up containing itself.

- 2026-10-08 — User's call (`../page.md`): the lead now ends "ready to take bookings and answer visitors from the start."

## Open Questions

None.
