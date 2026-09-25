# Process

**Last Updated:** 2026-09-25

**The one question:** How do they work?

See `../page.md` for the site-wide index. Spec: `../ui-spec/05-process.md`.

## Current State

Process pins its label and heading at 120px from the top from `xl` (two columns only from `xl`;
CSS `sticky`, no JS), using the shared `stickyTitleXl` helper in `lib/styles.ts` (see
`../page.md`). Process pins and travels visibly. It's built as one `<ol>` of four steps that CSS
places as a column with a bordered return loop below `xl`, or around an `aria-hidden` SVG ring
from `xl`; static violet lines, all dots lit, `data-anim` hooks in place.

## Key Files

- `components/home/process/` — ProcessSection, ProcessLoop, ProcessStep, ProcessRail, ProcessRing

## Decisions

- 2026-09-24 — Process is a departure from v3: four steps as a loop — written rules → agents do
  the work → they check themselves → lessons update the rules (then back to step 1). Facts: "How
  the user works". Numbered label 02 and a big heading; copywriter words it.
- 2026-09-24 — Process desktop: a ring with the four steps at its quarter points (dot, STEP
  label, title, one line), the heading beside it, direction shown so it reads as a cycle. New
  design beyond v3, so ui-designer specs it.
- 2026-09-24 — Process phone: steps stacked in a column on a line down the left, with the line
  curving from step 4 back up to step 1 so it still reads as a loop.
- 2026-09-24 — Process static state: the loop line is violet and all four dots are lit. Motion
  (later): GSAP sends a dot travelling round the loop continuously, lighting each step as it
  passes; under reduced motion it stays fully lit.
- 2026-09-24 — Process is built as one `<ol>` of four steps that CSS places as a column with a
  bordered return loop below `xl`, or around an `aria-hidden` SVG ring from `xl`; static violet
  lines, all dots lit, `data-anim` hooks in place.
- 2026-09-24 — Audit fix: the process loop label stays available to screen readers at `xl`
  (`xl:sr-only`).
- 2026-09-25 — Process pins its label and heading at 120px from the top from `xl` (two columns
  only from `xl`; CSS sticky, no JS), part of the site-wide split/sticky-title pattern (see
  `../page.md`). Process pins and travels visibly.

## Open Questions

- **Review:** phone return-line arrows are barely visible — for the user to judge.
