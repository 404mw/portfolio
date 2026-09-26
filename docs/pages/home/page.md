# Home

**Last Updated:** 2026-09-26

> **Status:** GSAP motion pass started (Hero, Nav, Marquee, Agents and Process done); next: motion
> for the remaining sections, then deploy

**The one question:** Can they help me?

This is the index for the whole site: one page at `/`, covering the nav, every section and the
footer. Section-level facts live in `sections/`; agents working on one section read this index
plus that section's file only.

## Sections

| # | Section | The one question it answers | Facts source | Status | Doc |
|---|---|---|---|---|---|
| 1 | Nav | Where can I go, and how do I book a call? | `docs/03-facts.md` → Contact | Decided | `sections/01-nav.md` |
| 2 | Hero | Who is this? | `docs/03-facts.md` → Who | Decided | `sections/02-hero.md` |
| 3 | Marquee | (transition, no claim) | none | Decided | `sections/03-marquee.md` |
| 4 | Agents | What can their agents handle for my business? | `docs/03-facts.md` → What the user builds | Decided | `sections/04-agents.md` |
| 5 | Process | How do they work? | `docs/03-facts.md` → How the user works | Built, motion done | `sections/05-process.md` |
| 6 | Web | Can they build my website end-to-end? | `docs/03-facts.md` → What the user can build | Decided | `sections/06-web.md` |
| 7 | Proofs | Have they built something real that people use? | `docs/03-facts.md` → Work that is live | Decided | `sections/07-proofs.md` |
| 8 | Contact | How do I start? | `docs/03-facts.md` → Contact | Decided | `sections/08-contact.md` |
| 9 | Footer | Where else can I find/reach them? | `docs/03-facts.md` → Contact | Decided | `sections/09-footer.md` |

## Current State (site-wide)

All nine sections are built statically; section detail lives in `sections/`. Build, lint and tsc
are green, and the lead re-checked 360/1024/1280/1440/3840 after the latest fixes: every title
column pins from `lg` except Proofs and Process (neither pins), and nothing scrolls sideways. Type
tokens are rem-based (zoom-safe). Every batch has been audited; all HIGH and SHOULD items are fixed
or decided. Counting is wired (Umami Cloud). The GSAP motion pass has started: the Hero, Nav
(progress bar fill), Marquee (loop), Agents (scroll entrance, 6s auto-advance, demo replays) and
Process (bot breathing/frame swaps, header and step reveals) are done (see `sections/02-hero.md`,
`sections/01-nav.md`, `sections/03-marquee.md`, `sections/04-agents.md`, `sections/05-process.md`);
the other sections are next, then deploy.

Site-wide, in `app/globals.css`: the scrollbar is an accent thumb on a transparent track, and text
selection plus image dragging are off (inputs, textarea and contenteditable stay selectable).

## Key Files (site-wide)

- `app/page.tsx` — renders the nine sections in order, then the takeover layer
- `app/layout.tsx` — skip link, `SiteHeader` and `SiteFooter` around `children`
- `app/globals.css` — tokens, spacing, site-wide scrollbar/selection/drag styling
- `content/home.ts`, `content/shared.ts` — page/nav/footer copy, written to the spec's slots
- `docs/pages/home/ui-spec.md` (the spec's index: shared rules §0, the motion summary §10, tokens
  and choices) plus `docs/pages/home/ui-spec/NN-<slug>.md` (each section's spec), `docs/00-constitution.md`,
  `docs/01-design-system.md`, `docs/03-facts.md` — the static-then-GSAP rules, tokens/type scale, the allow list
- `temp/claude-design/Portfolio Redesign v3.dc.html` — reference layout/behaviour (local, gitignored)
- `lib/styles.ts` — shared style helpers: the takeover's cream-side tokens (`pillInk`,
  `focusRingOnCream`, `metaLabelOnCream`) and the split/sticky-title helpers (`splitColumns`,
  `splitGrid` adds `lg:items-start`, `stickyTitle` `lg:sticky lg:top-30 lg:self-start`,
  `stickyTitleXl`, formerly for Process — being removed, see Decisions)
- `lib/routes.ts` — route/anchor targets
- `lib/track.ts`, `lib/analytics.ts`, `components/Analytics.tsx` — the one Book a call tracking
  key and the Umami Cloud counting setup (script only loads once `NEXT_PUBLIC_UMAMI_WEBSITE_ID`
  is set, and only counts on `marwix.dev`)
- `lib/listNumber.ts` — a list row's two-digit number from its zero-based index, shared by
  numbered rows across sections
- `lib/gsap.ts` — the one place GSAP and its plugins (`ScrollTrigger`, `useGSAP`) are registered;
  every motion hook imports GSAP from here
- `lib/motion.ts` — shared motion settings for the GSAP pass: reduced-motion/fine-pointer media
  queries, durations, eases, staggers, `reveal` (the generic scroll entrance, ui-spec §10), and the
  `data-anim` hook query
- `lib/watchLive.ts` — shared: whether an element is on screen and its tab visible, used to pause
  loops/timers (Agents' auto-advance and demo loops, Process' bots) when nobody can see them
- `hooks/useScrollReveal.ts` — the reusable scroll-reveal hook for any section's `data-anim="reveal"`
  elements; used by Hero and Process, still unused (not yet animated) by Contact, Web and Proofs

## Decisions (site-wide)

- 2026-09-24 — Reset to the v3 reference design; one page at `/`, projects opening in a
  full-screen takeover, not on their own routes. Violet accent (not v3's lime), Bricolage
  Grotesque display, v3 greys mapped onto existing tokens.
- 2026-09-24 — Static build first; a GSAP pass adds motion afterwards; each spec element carries a
  "Motion (later)" note. Spacing tokens `--spacing-gutter`/`--spacing-section` added (user's yes);
  the spec's other choices are accepted as written in `ui-spec.md`.
- 2026-09-24 — Copy written for the one-page site in `content/home.ts` and `content/shared.ts`, to
  the spec's slots. Constitution §7 item 3 replaced (user-approved): offers are stated plainly in
  the present tense; no specific client, project or result is claimed unless it's in the facts
  file.
- 2026-09-24 — Repo reset done (old UI, docs, font and helpers deleted, git re-initialised, fresh
  history; initial commit 1b25399). The static build runs section by section: foundation+Nav →
  Hero → Marquee → Agents (both variants) → Process → Web → Proofs+takeover → Contact → Footer,
  reviewed by the user each time; from batch 1 (Hero+Marquee) on, given the 2026-09-30 ship date,
  it moved to user-approved batches of 2–3 sections (batch 2: Agents A+B + Process).
- 2026-09-24 — Type tokens: the home `meta.description` matches `hero.sideLine`'s wording; big
  section headings use slightly looser letter spacing; the 8 fluid type tokens use rem bounds and
  a rem + vw middle so text grows with zoom/font-size settings (WCAG 1.4.4).
- 2026-09-24 — Every Book a call link uses one tracking key (`lib/track.ts`); visits and Book a
  call clicks are counted with Umami Cloud (cookieless), only on `marwix.dev`.
- 2026-09-25 — User's choice: every section after the hero pins its title column like Web (CSS
  sticky at 120px, from `lg` up); Agents pins its left column, Process from `xl`, Contact its left
  column; phone/tablet unpinned; Proofs excluded (reverted layout, see `sections/07-proofs.md`).
  The pattern is written once in `lib/styles.ts` (`splitColumns`, `splitGrid`, `stickyTitle`,
  `stickyTitleXl`). **Process clause superseded 2026-09-26.**
- 2026-09-26 — Process is excluded from the sticky-title pattern, like Proofs: the canvas's
  stacked layout puts the heading above the steps at every width, with no pinned title column.
  `stickyTitleXl` is being removed from `lib/styles.ts` (Process was its only user). See
  `sections/05-process.md`.
- 2026-09-25 — Site-wide, in `app/globals.css` (user's request): the scrollbar is an accent thumb
  on a transparent track; text selection and image dragging are off everywhere (inputs, textarea
  and `[contenteditable]` stay selectable).
- 2026-09-25 — Constitution §5 amended (user's decision): under reduced motion, short opacity
  fades stay and anything that moves turns off (slides, parallax, mouse drift, auto-advance,
  looping pulses); the marquee strip is the one exception, kept looping under reduce (marquee
  exception requested by the user) and pausing on hover in both modes.

## Open Questions (site-wide)

- **To do (user):** create a free Umami Cloud account, add the website marwix.dev and send the
  lead its website ID; it's set as `NEXT_PUBLIC_UMAMI_WEBSITE_ID` in Vercel and needs a redeploy.
- **Constitution:** the user to add the takeover/Book a call exception under §3.
- **To do:** the site has no favicon (`/favicon.ico` 404s).
- **Roll-up:** section-specific open questions remain in `sections/02-hero.md` (4),
  `sections/04-agents.md` (2), `sections/05-process.md` (2), `sections/07-proofs.md` (3) and
  `sections/08-contact.md` (1). The pre-deploy check reads this roll-up and every section file;
  the page ships with none open anywhere.
