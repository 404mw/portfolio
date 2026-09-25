# Contact

**Last Updated:** 2026-09-25

**The one question:** How do I start?

See `../page.md` for the site-wide index. Spec: `../ui-spec/08-contact.md`.

## Current State

Contact pins its left column at 120px from the top from `lg` (CSS `sticky`, no JS), using the
shared `splitColumns`/`stickyTitle` helpers in `lib/styles.ts` (see `../page.md`). Contact pins
but barely moves because its left column is about as tall as the right one.

Contact built: side links from one `ContactRow` (Book a call row counted), a client brief builder
whose radios and textarea are uncontrolled and read back on mount; without JS, the controls Send
can't carry are hidden and Send keeps the default brief mailto. Timeline hover/active style only
unchecked segments. An empty "what do you repeat" answer reads "Left blank" (`mail.repeatEmpty`).
Textarea capped at 500 characters.

## Key Files

- `components/home/contact/` — ContactSection, ContactLinks, ContactRow (shared by all side rows
  including Book a call), BriefBuilder (client), NeedChips, TimelineSegments, RepeatField,
  SendBriefLink
- `hooks/useBriefState.ts` — the brief's uncontrolled radios/textarea read back on mount, so a
  choice made before hydration survives it
- `lib/brief.ts` — the brief's default choices, the summary line and the mailto builder (surrogate-safe
  encoding); `mail.repeatEmpty` covers an empty "what do you repeat" answer

## Decisions

- 2026-09-24 — Contact structure from v3: numbered label 05, big heading with its last words in
  violet, one lead line; beside it a brief-builder panel.
- 2026-09-24 — Contact side links: three rows, Book a call (Cal.com, new tab, counted; no
  "30-minute" label), the email address (mailto), WhatsApp click-to-chat (facts link). Other
  socials stay in the footer.
- 2026-09-24 — Contact brief builder: (01) "what do you need" multi-select chips: AI agents /
  Automations / Website / Web app / Not sure yet, with AI agents preselected; (02) timeline,
  single-select: ASAP / This month / Exploring, with This month preselected; (03) a textarea,
  "what do you repeat every week". A summary line of the choices under the button. Chips and
  segments are real buttons with aria-pressed/radio semantics, keyboard reachable, tap targets at
  least 44px.
- 2026-09-24 — Send brief builds a mailto to hello@marwix.dev with the subject and body
  pre-filled from the choices (as v3). No backend, nothing stored. Clicks can be counted.
- 2026-09-24 — Contact static state: the textarea placeholder shows the first sample phrase.
  Motion (later): GSAP rotates the placeholder phrases, and reveals the section on scroll.
- 2026-09-24 — The Contact row's Book a call comes from a shared contact-row component
  (`ContactRow`), carrying `data-track="book-call"`.
- 2026-09-24 — Contact built: side links from one `ContactRow` (Book a call row counted), a client
  brief builder whose radios and textarea are uncontrolled and read back on mount; without JS,
  the controls Send can't carry are hidden and Send keeps the default brief mailto. Timeline
  hover/active style only unchecked segments. An empty "what do you repeat" answer reads "Left
  blank" (`mail.repeatEmpty`). Textarea capped at 500 characters.
- 2026-09-25 — Contact pins its left column at 120px from the top from `lg` (CSS sticky, no JS),
  part of the site-wide split/sticky-title pattern (see `../page.md`).

## Open Questions

- **Review:** Contact pins but has almost no travel (its left column is about as tall as the right
  one). The user can judge whether that's fine.
