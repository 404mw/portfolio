# Home

**Last Updated:** 2026-09-24

> **Status:** In build — batch 1 (Hero + Marquee) built and checked; waiting on the user's review

**The one question:** Can they help me?

This is the single page doc for the whole site: one page at `/`, covering the nav, every
section and the footer.

## Sections

| # | Section | The one question it answers | Facts source | Status |
|---|---|---|---|---|
| 1 | Nav | Where can I go, and how do I book a call? | `docs/03-facts.md` → Contact | Decided |
| 2 | Hero | Who is this? | `docs/03-facts.md` → Who | Decided |
| 3 | Marquee | (transition, no claim) | none | Decided |
| 4 | Agents | What can their agents handle for my business? | `docs/03-facts.md` → What the user builds | Decided |
| 5 | Process | How do they work? | `docs/03-facts.md` → How the user works | Decided |
| 6 | Web | Can they build my website end-to-end? | `docs/03-facts.md` → What the user can build | Decided |
| 7 | Proofs | Have they built something real that people use? | `docs/03-facts.md` → Work that is live | Decided |
| 8 | Contact | How do I start? | `docs/03-facts.md` → Contact | Decided |
| 9 | Footer | Where else can I find/reach them? | `docs/03-facts.md` → Contact | Decided |

## Current State

Sections 1–3 (foundation + Nav, Hero, Marquee) are built statically: build, lint and screens are
green at 360/768/1440/3840; the audit is done (0 HIGH, both SHOULDs fixed). `app/page.tsx` renders
`HeroSection` and `MarqueeStrip`, plus a temporary spacer for the sections still to come. Next: the
user reviews batch 1 (Hero + Marquee), then batch 2 (Agents both variants + Process).

## Key Files

- `app/page.tsx` — renders Hero and Marquee, plus a temporary spacer for the remaining sections
- `app/layout.tsx` — renders `SiteHeader` and the skip link; no footer yet
- `content/home.ts` — copy for the page's sections, written to the spec's slots
- `content/shared.ts` — nav and footer copy, written (`footer.social`, `footer.copyrightName`)
- `docs/pages/home/ui-spec.md` — ui-designer's spec, written
- `docs/00-constitution.md` — one page, static-then-GSAP rules
- `docs/01-design-system.md` — tokens, type scale, v3 colour/type mapping
- `docs/03-facts.md` — the allow list, including "What the user can build"
- `temp/claude-design/Portfolio Redesign v3.dc.html` — reference layout and behaviour (local,
  gitignored)
- `components/SiteHeader.tsx` — shared page frame and the fixed Nav
- `components/NavBar.tsx` — the Nav row and progress bar
- `components/NavLinks.tsx` — inline/phone nav links
- `components/NavMenu.tsx` — phone menu panel
- `components/ProgressBar.tsx` — scroll progress bar
- `hooks/useScrolledPast.ts` — observer that flips the Nav solid past `#top`
- `lib/styles.ts` — shared style helpers
- `lib/routes.ts` — route/anchor targets
- `lib/navItems.ts` — nav link data
- `components/home/hero/HeroSection.tsx` — the hero section, `#top`
- `components/home/hero/HeroGrid.tsx` — the hero's faint background grid
- `components/home/hero/HeroPortrait.tsx` — the portrait, fading into the background at its bottom
- `components/home/hero/HeroSideLine.tsx` — the "what I do" line with its violet dot
- `components/home/hero/HeroName.tsx` — the MUHAMMAD/WAQAS h1
- `components/home/hero/HeroActions.tsx` — the mono tag plus See proofs / Book a call row
- `components/home/MarqueeStrip.tsx` — the marquee strip
- `components/icons/AsteriskIcon.tsx` — the marquee's drawn asterisk separator

## Decisions

- 2026-09-24 — Reset to the v3 reference design; one page at `/`; projects open in a full-screen
  takeover, not on their own routes.
- 2026-09-24 — Violet accent (not v3's lime); Bricolage Grotesque display; v3 greys mapped onto
  existing tokens.
- 2026-09-24 — Static build first; a GSAP pass adds motion afterwards; each spec element carries a
  "Motion (later)" note.
- 2026-09-24 — Web section kept; the offer was added to the facts file ("What the user can
  build").
- 2026-09-24 — Proofs: the three real projects only, Exile, Design Vault and MARWIX-SKILLS, as
  cream cards each opening a takeover. Exile's takeover shows its two numbers and is the only
  place linking exile.marwix.dev. No tech stacks, no clients.
- 2026-09-24 — Agents: v3's four offers (customer messages, lead follow-up, recurring reports,
  connected tools), each with v3's demo panel. Bookings is not shown.
- 2026-09-24 — Demo panel content is kept as in v3 (sample messages, first names, times, week
  number), allowed by constitution §7 item 5.
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
- 2026-09-24 — Social links are not in the nav; they live in the footer only, as text links, each
  shown only once filled in the facts file.
- 2026-09-24 — Hero buttons: primary violet Book a call (Cal.com, new tab, counted) and an outline
  "See proofs" jumping to Proofs. (v3's "Get in touch" is dropped.)
- 2026-09-24 — Hero name: MUHAMMAD right-aligned and WAQAS left-aligned, both violet, uppercase,
  in front of the portrait; the portrait's bottom fades into the background.
- 2026-09-24 — Hero portrait: the user is supplying a new photo (dark background, waist-up).
  Build with `public/images/portrait.png` as a stand-in through the image helper; the user swaps
  the file later at the same path. Centred at the bottom, about 58% of the width (max 620px), 88%
  of the height.
- 2026-09-24 — Hero phone stack: side line at the top (left-aligned), name keeping the v3 offset
  at 72px, photo behind the lower half, mono tag above the buttons, buttons full width and
  stacked. It all fits one screen.
- 2026-09-24 — Hero background: v3's faint 64px grid (`line` token at reduced opacity).
- 2026-09-24 — Hero motion (later), for the GSAP pass: name lines rise from below, staggered;
  side line and bottom row fade up; blinking dot; portrait parallax, scale and mouse drift; hero
  text parallax and fade on scroll.
- 2026-09-24 — Marquee items: v3's five — customer messages, lead follow-up, recurring reports,
  connected tools, websites end to end (facts: automation offer and build offer); copywriter may
  tighten the wording; accent asterisk separators.
- 2026-09-24 — Marquee decorative contrast: v3's dim look (`muted` at low opacity) on the band
  strip; the strip is `aria-hidden`, with a visually hidden plain list of the same items exposed
  instead.
- 2026-09-24 — Marquee static state: one clipped still row, with no sideways page scroll. Motion
  (later): the GSAP pass loops it; under reduced motion it stays still.
- 2026-09-24 — Agents section label numbered like v3 ("01", from copywriter); the four offers are
  rows with a number and a big title; the active row shows its one-line description.
- 2026-09-24 — Agents interaction: two variants get built, and the user picks after seeing both.
  A: rows are an accessible tab list, first active, click or tap switches the panel (GSAP later
  adds the 6s auto-advance and progress line, paused on hover or focus, off under reduced motion).
  B: no switching, each row has its own demo panel. Both are separate components; the loser is
  deleted afterwards.
- 2026-09-24 — Agents demo panels show the finished state statically (full conversation, all
  leads followed up, report sent, all tools in sync). Motion (later): GSAP plays each sequence
  from the start when its panel shows.
- 2026-09-24 — Agents on phone: the list first, then the panel below, as in v3.
- 2026-09-24 — Agents panel header keeps v3's mono "agent running" status and slugs
  (support-agent, lead-agent, report-agent, sync-agent); this is sample content inside the
  illustration, under constitution §7 item 5, and isn't a tech-stack list.
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
- 2026-09-24 — Web keeps v3's structure: numbered label 03, heading with its last words in
  violet, one lead line, four numbered rows (Strategy, Design, Build, Launch & care) with one
  line each. Facts: "What the user can build".
- 2026-09-24 — Web layout: from `lg` up the left column (label, heading, lead) is CSS sticky
  while the rows scroll; phone and tablet stack normally.
- 2026-09-24 — Web rows are readable by default: titles in `text`, descriptions in `muted`,
  numbers in violet; hover brightens slightly. Motion (later): the hover indent, plus reveal on
  scroll.
- 2026-09-24 — Proof cards are fully identical: one card design and one set of inputs (shot, tag,
  title, card line) for all three projects, in one grid (three across from `lg`, stacked on
  phone). Cream cards (cream/ink/cream-muted), numbered label 04, heading "Work that runs"-style
  (copywriter). Exile's two numbers appear only in its takeover's IN USE row, not on the card.
- 2026-09-24 — Proofs images: the user supplies a card shot plus takeover shots for all three
  projects — Exile, Design Vault and MARWIX-SKILLS. Placeholders are used while building and none
  may ship. All images go through the image helper.
- 2026-09-24 — Proofs takeover template, the same for every project: (1) top bar "PROOF 0n / 03 ·
  tag" plus a Close button; (2) big title; (3) three info rows WHAT IT IS / BUILT / IN USE, facts
  only; (4) one summary paragraph on what it does for its users; (5) shots, one big and two
  details; (6) a Visit button (Exile: exile.marwix.dev, the only
  place it's linked; Design Vault and MARWIX-SKILLS: their GitHub links); (7) "Next project" at
  the bottom.
- 2026-09-24 — Proofs takeover address: opening sets a hash (#exile, #design-vault,
  #marwix-skills) on the same page. The link can be shared and opens straight to that takeover,
  and the browser Back button closes it. Esc and Close also close it. Focus is trapped inside
  while open and returns to the card on close. Static: it opens and closes instantly. Motion
  (later): v3's clip-path expand from the card and collapse back, content rising in, and
  next-project transition.
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
- 2026-09-24 — Footer row (v3): email on the left; LinkedIn · Instagram · Discord · WhatsApp as
  text links in the middle (each shown only once filled in the facts file); © with the build-time
  year plus the name on the right. It stacks on a phone.
- 2026-09-24 — Footer giant MARWIX wordmark (`--text-footer-mark`, Bricolage `wdth` 75, 800): the
  full word is shown, M and W violet, A R I X dim (decorative, `aria-hidden`). Must not cause
  sideways scroll. Motion (later): v3's scroll reveal (M and W appear, then A R I X slide out);
  reduced motion shows the full word.
- 2026-09-24 — Hero height is full screen, capped at 1200px.
- 2026-09-24 — Spacing tokens `--spacing-gutter` and `--spacing-section` added (user's yes).
- 2026-09-24 — The spec's other choices are accepted as written in
  `docs/pages/home/ui-spec.md`, under "Choices for the lead to review".
- 2026-09-24 — Copy written for the one-page site in `content/home.ts` and `content/shared.ts`,
  to the spec's slots. The nav's social names moved to `footer.social`, and `footer.copyright`
  became `footer.copyrightName`. The Agents demo samples keep v3's vendor names ("instagram DM",
  "Sheets") under constitution §7 item 5.
- 2026-09-24 — Constitution §7 item 3 is replaced (user-approved): offers are stated plainly in
  the present tense; no specific client, project or result is claimed unless it's in the facts
  file. The hero side line is v3's: "I build AI agents that take repetitive work off your team,
  and the websites around them."
- 2026-09-24 — The static build goes section by section: web-coder builds one section, the lead
  runs build, lint and screen checks, the user reviews, then the next section. Order: foundation +
  Nav → Hero → Marquee → Agents (both variants) → Process → Web → Proofs + takeover → Contact →
  Footer.
- 2026-09-24 — Offer lines moved to present tense; `agents.label` is "What my agents handle"; the
  hero side line (16 words) runs over the 12-word limit by the user's choice.
- 2026-09-24 — Repo reset done: the old UI, old page docs, old font and helpers were deleted and
  git was re-initialised (fresh history). The static build runs section by section in this order:
  foundation + Nav → Hero → Marquee → Agents (both variants) → Process → Web → Proofs + takeover →
  Contact → Footer. The user reviews each section before the next starts.
- 2026-09-24 — Section 1 built (static): the shared page frame and the fixed Nav, a 2px progress
  bar above a 64px row. The Nav turns solid via an observer on `#top` once the hero passes. It has
  inline links from `md`, a phone menu below `md`, a Book a call pill on the right and no brand
  mark. The shared parts (skip link, section label and heading, external and Book a call links,
  image and placeholder, icons) are in place for later sections. The spacing tokens
  `--spacing-gutter` and `--spacing-section` are now in `app/globals.css`.
- 2026-09-24 — The phone menu is a native `<details>`/`<summary>`, so it opens and closes without
  JS (constitution §5). JS adds these on top: it closes the menu at `md` and up and on a link tap;
  Escape closes it; it syncs its open state on mount in case the menu was opened before hydration.
  `aria-controls` is dropped because `<summary>` exposes its expanded state natively. The nav band
  uses `has-[details[open]]:bg-band`.
- 2026-09-24 — Escape always closes the phone menu. It moves focus back to the menu button only
  when focus was in the menu or on the page body, so it never pulls focus from elsewhere on the
  page. It skips events that are already handled.
- 2026-09-24 — `BookCallLink` has only the `nav` and `hero` variants. The Contact row's Book a
  call (8.1) will come from a shared contact-row component built in section 8, which carries
  `data-track="book-call"`.
- 2026-09-24 — The user approved the Nav (section 1). With the 2026-09-30 ship date six days out,
  the static build now runs in batches of 2–3 sections, with one user review per batch instead of
  per section. Batch 1: Hero + Marquee.
- 2026-09-24 — Initial git commit made (1b25399) covering docs, content and section 1.
- 2026-09-24 — Proofs: every project gets the same image set, a card shot plus three takeover
  shots (one big, two details), MARWIX-SKILLS included. All three projects stay identical in
  structure and are kept in sync. This replaces the earlier "skipped for MARWIX-SKILLS" in the
  takeover template.
- 2026-09-24 — Hero and Marquee built as static server components
  (`components/home/hero/*`, `components/home/MarqueeStrip.tsx`) per ui-spec §2–§3, carrying every
  `data-anim` hook for the GSAP pass; MUHAMMAD measured at 314.7px within 320 at 360px, so the 72px
  token stands.
- 2026-09-24 — Hero name lines carry `pb-[0.12em]` bottom padding (user's choice) so the Q tail in
  WAQAS isn't clipped.
- 2026-09-24 — Marquee separator is the SVG `AsteriskIcon` (`size-8`, `text-accent`), not a typed
  `✳`, which can render as a colour emoji on Apple devices and ignore the accent colour.
- 2026-09-24 — The home `meta.description` says "websites", matching `hero.sideLine`'s wording.
- 2026-09-24 — User's choice: while scrolling past the hero, the transparent Nav's links overlap
  the big name; this stays as is in the static build and is fixed by the GSAP pass's hero-text
  fade on scroll (the Nav decision is unchanged).

## Open Questions

- **Choice:** Agents: pick variant A (tabs) or B (all shown) after viewing.
- **To build:** Hero — the user's new portrait (pending file); `hero.portraitAlt` needs a check
  once it arrives.
- **To build:** Proofs — the "See proofs" hero button jumps to `#proofs`, which lands with
  section 7; until then it does nothing.
- **Ship check:** `public/images/portrait.png` is a grey stand-in with a real path in
  `lib/images.ts`, so the null-image guard won't catch it; it must be swapped for the user's photo
  (and `hero.portraitAlt` rechecked) before deploy.
- **Fact:** the user is adding MARWIX-SKILLS details (BUILT / IN USE) to `docs/03-facts.md`; its
  rows show `[FILL]` until then and can't ship.
- **To build:** Proofs — Exile, Design Vault and MARWIX-SKILLS screenshots (pending from the
  user); 12 shot alt-text `[FILL]` markers (three projects × card + 3 shots) clear when the
  images arrive.
</content>
