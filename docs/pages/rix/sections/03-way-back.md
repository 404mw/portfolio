# Way back

**Last Updated:** 2026-10-03

**The one question:** Where do I go from here?

See `../page.md` for the site-wide index. Spec: `../ui-spec/03-way-back.md`.

## Current State

Built. `RixWayBack` has the heading "Done playing? Let's talk." (`SectionHeading`) over a top hairline,
then the shared Book a call pill (`BookCallLink`, `hero` variant) and a "Back to home" outline link to
`/`. Stacked on phones, a row from `md`, heading left and pills right from `lg`. The heading, then
the actions, reveal on scroll (`RixReveal`; fade only under reduced motion).

## Key Files

- `components/rix/RixWayBack.tsx` — the section
- `components/BookCallLink.tsx`, `lib/track.ts` — the tracked Book a call link
- `content/rix.ts` → `wayBack` — heading and link text

## Decisions

- 2026-10-02 — A short heading ("Done playing? Let's talk.") plus Book a call and "Back to home"; the site nav and footer also stay.

## Open Questions

None.
