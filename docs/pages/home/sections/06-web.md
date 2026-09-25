# Web

**Last Updated:** 2026-09-25

**The one question:** Can they build my website end-to-end?

See `../page.md` for the site-wide index. Spec: `../ui-spec/06-web.md`.

## Current State

Web built: two columns from `lg` (left sticky at 120px from the top, CSS only, no JS), four
static step rows; stacks below `lg`. No client JS. Web pins and travels visibly, using the shared
`splitColumns`/`stickyTitle` helpers in `lib/styles.ts` (see `../page.md`).

## Key Files

- `components/home/web/` — WebSection (sticky left column from `lg`), WebStepRow (the four
  numbered rows)

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
- 2026-09-24 — Web built: two columns from `lg` (left sticky at 120px, CSS only), four static step
  rows; stacks below `lg`. No client JS.
- 2026-09-24 — Web step 1 reads "First, I plan what your site needs to do." (first person).
- 2026-09-25 — Web pins its left column (label, heading, lead) at 120px from the top from `lg`
  (CSS sticky, no JS), part of the site-wide split/sticky-title pattern (see `../page.md`). Web
  pins and travels visibly.

## Open Questions

None.
