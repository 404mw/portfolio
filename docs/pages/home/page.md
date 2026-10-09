# Home

**Last Updated:** 2026-10-09

> **Status:** In build. Round 2 (Agents' "Done" receipt line and Process recast around control, with
> their motion) is built (2026-10-08) and lead-checked (2026-10-09: lint, `tsc` and build pass; no
> sideways scroll or page errors at 360, 768, 1024, 1440, 3840). Copy round 1 (2026-10-08, plain words for everyday business owners) is in
> Hero, Marquee, About, Agents, Web and Contact; Agents now opens with a heading and lead; lint,
> `tsc` and build green and lead-checked (360, 768, 1440, 3840, reduced motion). All nine sections are built; the per-card redesign of About, Agents and
> Process is built (2026-10-03): the About pick sets Agents' offers and Process' flow. The motion
> pass for Agents and Process (relay, demo sequences, swap fade) is built and lead-checked
> (2026-10-04); Process' phone ledges and Agents' new Discord demos are built and lead-checked
> (2026-10-05). The Rix playground is built at /rix (doc: `docs/pages/rix/page.md`). The project
> takeover is rebuilt static as up to seven parts and lead-checked (2026-10-05). Open: the user's calls on
> copy and the ledges, the takeover's motion pass (parts 5 and 6 and the `useTakeoverMotion`
> re-test), the code-auditor pass on the Exile Bot three-shot round (before the push), and the
> open items below. The site-wide font swap (Acosta, IBM Plex Sans, IBM Plex Mono) and its size
> retune are built and lead-checked in Edge (2026-10-07; Safari, Firefox and real devices not yet).

**The one question:** Can they help me?

This is the index for the whole site: one page at `/`, covering the nav, every section and the
footer. Section-level facts live in `sections/`; agents working on one section read this index
plus that section's file only.

## Sections

Rows are in render order (Nav, Hero, Marquee, About, Agents, ...); the numbers and file names are
kept as they were, so Marquee (3) renders before About (2a).

| # | Section | The one question it answers | Facts source | Status | Doc |
|---|---|---|---|---|---|
| 1 | Nav | Where can I go, and how do I book a call? | `docs/03-facts.md` → Contact | Built, motion done | `sections/01-nav.md` |
| 2 | Hero | Who is this? | `docs/03-facts.md` → Who | Built, motion done; round 1 copy in (side line, tag) | `sections/02-hero.md` |
| 3 | Marquee | (transition, no claim) | none | Built, motion done; seven job items (2026-10-08) | `sections/03-marquee.md` |
| 2a | About | Can he help someone like me? | `docs/03-facts.md` → Who (more needed) | Built, per-card pick (five cards); new heading and plain intro lines (2026-10-08); the Rix playground is built at /rix | `sections/02a-about.md` |
| 4 | Agents | What can their agents handle for my business? | `docs/03-facts.md` → What the user builds | Built per card; heading and lead in the sticky column, phone stepper, entrance, auto-advance, demo replays and swap fade run; orchestra in the developer set only; round 1 copy in; "Done" receipt line on every chat and list demo (round 2) | `sections/04-agents.md` |
| 5 | Process | Can I trust it with my customers? | `docs/03-facts.md` → How the user works | Built per card; recast around control (round 2): hand-off at step 3, send / straight / fix relay; bot life and swap fade run | `sections/05-process.md` |
| 6 | Web | Can they build my website end-to-end? | `docs/03-facts.md` → What the user can build | Built, motion done | `sections/06-web.md` |
| 7 | Projects (formerly Proofs) | Have they built something real that people use? | `docs/03-facts.md` → Work that is live | Built, motion done | `sections/07-proofs.md` |
| 8 | Contact | How do I start? | `docs/03-facts.md` → Contact | Built, motion done | `sections/08-contact.md` |
| 9 | Footer | Where else can I find/reach them? | `docs/03-facts.md` → Contact | Built, motion done | `sections/09-footer.md` |

## Current State (site-wide)

All nine sections are built statically; section detail lives in `sections/`. Lint, `tsc` and the
production build are green (lead check, 2026-10-09, after round 2; the orphan `AgentPointerPanel.tsx` is gone).
That check (headless Chromium, 360, 768, 1024, 1440, 3840) found no sideways scroll and no page
errors; the earlier 2026-10-08 check (reduced motion, 360, 768, 1440, 3840) found no overflowing
leaf text in hero, about and agents. Round 2 (built 2026-10-08): every Agents chat or list demo ends
with a "Done" receipt (empty box, then tick) and Process is recast around control (label "You stay
in charge", heading "Hard calls / come to you.", a hand-off to a person at step 3, a relay that
cycles send, straight and fix); browser checks still pending are listed in `sections/05-process.md`. There is no separate lead screen
check of the five-card About board's layout (rows of 2, 2, 1 on phones; 3, 2 from `md`). Last
full production-build check (lead, 2026-10-03): 360, 768, 1024, 1440 and 3840 had no sideways
scroll, no tap target under 44px and no console errors. Every title column pins from
`lg` except Proofs and Process (neither pins). Type tokens are rem-based (zoom-safe). Counting is
wired (Umami Cloud).

The About pick (the checked radio in About's group, five cards) is the one source for three sections: About's
ack and Rix's emblem, Agents' offers and panels, and Process' five- or six-step flow. Agents and
Process swap with a fade (0.15s out, 0.25s in, opacity only, the same under reduced motion) from one
shared store (`lib/shownSet.ts`), so they and the bots change in one commit
(`lib/aboutPick.ts` `pickSet` gives `default` or a card's set). A "Shown for" tag
(`components/home/pick/ShownForTag.tsx`) sits in Agents and Process and changes the pick in place.
The pick is remembered for the visit in session storage (`lib/aboutMemory.ts`), and a `?for=` link
wins the first time that value is seen (`hooks/useAboutFor.ts`). Without JavaScript both sections
render the `default` set and the tags are hidden. Lead-checked: `?for=` sets both sections, the tag
sets the pick everywhere by pointer and by keyboard, and the pick survives a reload.

The GSAP motion pass is complete for the nine sections: the Hero
(section 2), Nav's progress bar fill and band/menu fades (1), the Marquee's loop (3), Agents'
scroll entrance, 6s auto-advance, stepper bars, demo sequences, Report bar hover and swap fade (4), Process' smooth
bot life, header/step reveals, crew relay and swap fade (5; `RELAY_ON = true`), Web's row
reveal and hover indent (6), Proofs' card reveal/lift and the
takeover's clip-path open/close/Next-slide motion (7), Contact's column reveal and rotating brief
placeholder (8), and the Footer's wordmark reveal (9). The lead browser-checked 360/1024/1440/3840
in full and reduced motion: nothing scrolls sideways at any point (including mid footer animation),
no console errors, and no reveal is left stuck hidden; the Proofs takeover's open/Esc/Back
mid-open/Next/double-Esc/direct-load+Back all end in the right state at 360 and 1440. The Agents
and Process motion pass was lead-checked 2026-10-04 (lint, tsc and build green; 360, 768, 1024,
1440 and 3840 in full and reduced motion: no sideways scroll, no console errors, nothing left dimmed
after a swap). Next: deploy prep (a pre-push audit).

Site-wide, in `app/globals.css`: the scrollbar is an accent thumb on a transparent track, and text
selection plus image dragging are off (inputs, textarea and contenteditable stay selectable), and
any text that does get selected (form fields, browsers that ignore `user-select`) shows the accent
background with the opposite of its own colour: light text (`text`, `cream`, `muted`) selects as ink
(about 9:1), dark text (`ink`, `on-accent`, `bg`, `cream-muted`) as off-white (about 2:1, only on
cream and accent surfaces). Text-colour classes set an inherited `--selection-text` in `@layer base`
that `::selection` reads, so the nearest class wins at any depth; checked and pressed states have
their own selectors, and hover-only or opacity-suffixed colours inherit the parent's. The
favicon is served from `app/icon.svg` and `app/apple-icon.png` (the mascot mark).

Fonts (built 2026-10-07, uncommitted): display is Acosta (`assets/fonts/acosta.otf`, 400 only, no
axes, letters and digits only), body IBM Plex Sans (variable), labels and meta IBM Plex Mono
(400/500), loaded in `lib/fonts.ts`. Display punctuation falls through the `--font-display` stack to
IBM Plex Sans Bold (`displayPunct`, local static 700 file); Acosta's automatic fallback is off. The
`condensed` helpers and the weight classes on display text are gone. Display size tokens are about
1.8x smaller than under Bricolage, tracking normal, leading 1.0 to 1.15 (footer mark 0.9,
`--text-footer-mark` 17.5vw, `--text-hero` `clamp(2.4375rem, 1.25rem + 5.278vw, 7rem)` so MUHAMMAD
clears the portrait); the About poster card title steps `text-body` / `md:text-summary` /
`lg:text-card`; both sharing images use Acosta. Lead-checked 2026-10-07 on the dev server (Edge via
Playwright): lint and build pass; `/` and `/rix` at 360, 768, 1440 and 3840 under reduced motion
have no sideways scroll, no console errors and no display text wider than its box (section headings
on two lines, row and card titles on one); step and row titles for the Discord, software-builder,
online-store and service-business sets fit at 360, 1024 and 1440; full motion at 360 and 1440: the
Exile Bot takeover opens and closes in the right end state and the footer reveal completes. Not
checked: Safari, Firefox, real devices, the Design Vault takeover, the takeover's Next slide.

Footer Rix (2026-10-07, built, static and motion, lead-checked): Rix stands on the footer's top
hairline as the only entry to `/rix`, and calls the visitor with typed lines; browser checks beyond
Edge are open. See `sections/09-footer.md`.

Built and verified 2026-09-26: the Proofs section is renamed Proofs → Projects in every visible
word (nav link, section label, the hero's "See projects" button, the takeover top bar) and its
anchor is `#projects` (`lib/routes.ts` `sectionIds.proofs = "projects"`); code, file and content key
names stay `proofs`. The takeover's Next now slides the old project up and out while the new dialog
stays in place and its content slides up in its place, with the Next link's title morphing into the
new heading and the new top bar fading in once the title clears it (`hooks/useTakeoverMotion.ts`,
`lib/takeoverTitleMorph.ts`); every takeover opens at its top, even right after one was scrolled to
the bottom (`hooks/useHashTakeover.ts`). Build and lint are green; flow tests pass and the lead
checked the slide frame strips and the no-crash repro. See `sections/07-proofs.md`.

Built and verified 2026-09-27: opening a project from its card now morphs the card's title into the
takeover heading too (`lib/takeoverTitleMorph.ts`, `lib/takeoverClip.ts`, `ProofCard.tsx`), on the
same clip timing; the lead confirmed it in headless Chromium for all three cards, full and reduced
motion, at 360/1440. See `sections/07-proofs.md`. The footer wordmark's dim letters (A R I X) now
wipe on a slower, easing-out stagger (`hooks/useWordmarkReveal.ts`, function stagger, not a stagger
object, to dodge a GSAP 3.15 ease quirk); verified in Chromium. See `sections/09-footer.md`.

Built and verified 2026-09-28: closing a project now morphs the takeover heading back into its
card title too (`hooks/useTakeoverMotion.ts`, `lib/takeoverTitleMorph.ts`), matching the card
title's optical size and letter spacing at both hand-offs so the text boxes line up within 1px, and
ending with a 0.15s fade of the whole dialog so the card dissolves in underneath. See
`sections/07-proofs.md`.

Built and verified 2026-09-28: proof cards now show a CSS "ink stage" banner and a static,
server-rendered 3D SVG bot (the Process bot's MW geometry, extruded and shaded from existing
tokens only) in place of the card screenshot (`components/home/proofs/ProofBanner.tsx`,
`ProofBot.tsx` and its parts, `lib/proofBotBody.ts`, `lib/proofBotDepth.ts`,
`lib/proofBotShades.ts`, `lib/proofBotProps.ts`). Build and lint are green; the lead confirmed no
sideways scroll at eight widths from 360 to 3840 and that 360/768/1440/3840 match the approved
sample. See `sections/07-proofs.md`.

Built and verified 2026-09-28: MARWIX-SKILLS is temporarily hidden, card and takeover, behind one
flag (`hiddenProofs` in `lib/proofs.ts`); its content and code stay. With two projects shown
(Exile, Design Vault), the cards sit two across from `md` up at full width, no empty third slot.
Build and lint are green; the lead confirmed no sideways scroll at eight widths from 360 to 3840.
See `sections/07-proofs.md` for an open build question from this change (arm/card clearance at
1440/3840, with the larger two-card bot).

Built and verified 2026-09-28: the proof card bots are animated with GSAP (ui-spec §7.7) — they rise
with their card's reveal, lean +4° and play their prop's act on hover, and breathe/drift/blink/follow
the pointer while idle, reusing the Process bots' numbers and registry; they pause off screen, in a
hidden tab or while a takeover is open. Reduced motion: no movement, each bot fades in with its
card. Build and lint are green, no console errors; the lead confirmed the rise, hover acts, a
takeover open/close, reduced motion and no sideways scroll at 360/767/1440/3840 (headless
Chromium), and noted the hover lean sharpens the existing Exile/Design Vault arm-clearance question
at 1440. See `sections/07-proofs.md`.

Built and verified 2026-09-28: the proof card bots' depth is now one continuous extrusion —
one flat-shaded side quad per depth-facing edge (`lib/proofBotExtrude.ts`) — replacing the stacked
depth-copy steps that showed stair steps and colour bands at two-across sizes. Lead-verified on a
production build: solid side faces with no stair steps at 1440 and in a 3840 close-up, the motion
test passes, and no sideways scroll at 360/767/1440/3840. See `sections/07-proofs.md`.

The workflow offer's `orchestra` demo (three swimlanes, eight rows) and Process' step 5-to-4 fix
loop are built, with motion (the orchestra's token run; the fix hop on every second relay run).
Below `lg`, Agents swaps its tab list for one shared stepper above the panel (‹ / ›, counter and
title, bars filling on the 6s clock, the offer's line). Lead-checked 2026-10-04 at 360 to 3840: no
sideways scroll, no console errors, no clipped text in the chart. See `sections/04-agents.md` and
`sections/05-process.md`.

Process' Discord flow is the one flow with no loops: five steps (Mentioned, Your tone, Remembers,
Connected, Always on), no return and no fix loop (`hasLoops` / `flowLoops` in `lib/processFlows.ts`,
`data-loops="off"`); the other four flows keep both loops. Agents' Discord "Member questions" demos
use an @mention and a reply that recalls a past chat, and "Custom commands" shows Server, Sheets and
Twitch; "Welcome and roles" is a ticking checklist and "Moderation" a three-person list with a done
pill per row. Lead-checked 2026-10-04 on a production build at 360 to 3840: lint and build pass, no
sideways scroll, no console errors, set switching re-rigs the bots cleanly.

Below `lg`, Process stands each bot on its own short ledge (`ProcessLedge`) and draws the fix loop as
a dotted bracket from bot 5 up to bot 4; under full motion the relay's job hops ledge to ledge, each
ledge lighting as it lands; on the fix run the job goes back along the dotted fix line, which lights
behind it (reduced motion: static only).
Lead-checked 2026-10-05 in headless Chromium on a production build, static at 360 to 3840 and full
motion at 360 and 768: no sideways scroll, no console errors, the job within about 4px of every
ledge; Safari, Firefox and real devices unchecked. See `sections/05-process.md`.

The project takeover is rebuilt static as up to seven parts (intro and rows, problem, built, took,
learned, showcase, and an ink "means for you" panel with its own Book a call; took, learned and
showcase only for Exile Bot). Lead-checked 2026-10-05: lint, tsc and build pass, no sideways scroll,
no console errors, and open, Next and Esc end in the right state. See `sections/07-proofs.md`.

Exile Bot's takeover (2026-10-06): three screenshots in the one shared layout, the spam diagram's
steps showing Eva, Exile Bot's mascot, on an ink stage (one band from `md`, one band per step on
phones; shared `InkStageGround`, spec `ui-spec/07-proofs-spam.md`), and in-use numbers 18+ and 3.9K+.
Lead-checked on the production build (lint and build pass; 360, 768, 1440 and 3840 have no sideways
scroll; every image loads; the proof card banner is unchanged). No code-auditor pass yet; it runs
before the push. See `sections/07-proofs.md`.

Built and lead-checked 2026-10-06: under full motion a plain click or Enter on a proof card first
ducks its bot below the banner floor, then opens the takeover; bots stay down while any takeover is
open and rise back after. Lint and build pass; checked in Edge at 1440. See `sections/07-proofs.md`.

SEO pass (2026-10-07, built, not deployed): every page gets a canonical link through
`pageMetadata` (`alternates.canonical` is the page's own path; `app/page.tsx` passes `path: "/"`);
`app/sitemap.ts` stamps each published route with the build date; `/` renders one JSON-LD graph
(`StructuredData`: a WebSite node and a Person node, strings from `content/shared.ts` and
`lib/site.ts` only; the person's role and description are `structured`, in the third person on
purpose); and Agents and Process each server-render all four card sets in a `hidden` wrapper
(`AgentsAllOffers`: title and line; `ProcessAllFlows`: caption and steps), built from `about.replies`
through `pickSet` (`lib/cardSets.ts`), so crawlers and AI models can read offers that otherwise
appear only after a pick, without showing or being read twice. Home `meta.title` is "Muhammad Waqas | AI
Agents and Automations" (`content/home.ts`). Checked only in the built HTML: the canonical on `/` and `/rix`,
the JSON-LD parses, the four sets' text is present, and the hidden wrappers are `display: none` by
Tailwind's `[hidden]` rule. Not checked in a browser, and not yet on the live site.

## Key Files (site-wide)

- `app/page.tsx` — renders the nine sections in order, then the takeover layer
- `app/layout.tsx` — skip link, `SiteHeader` and `SiteFooter` around `children`
- `app/globals.css` — tokens, spacing, site-wide scrollbar/selection/drag styling
- `content/home.ts`, `content/shared.ts` — page/nav/footer copy, written to the spec's slots
- `docs/pages/home/ui-spec.md` (the spec's index: shared rules §0, including the pick §0.5 and the
  "Shown for" tag §0.6, the motion summary §10, tokens and choices) plus
  `docs/pages/home/ui-spec/NN-<slug>.md` (each section's spec; Process also has
  `05-process-motion.md`, the bots' built motion, and `05-process-relay-legacy.md`, the earlier
  four-step relay spec), `docs/00-constitution.md`,
  `docs/01-design-system.md`, `docs/03-facts.md` — the static-then-GSAP rules, tokens/type scale, the allow list
- `temp/claude-design/Portfolio Redesign v3.dc.html` — reference layout/behaviour (local, gitignored;
  missing on disk 2026-10-03, see Open Questions)
- `lib/fonts.ts`, `app/layout.tsx`, `app/globals.css` (`--font-display`, `--font-body`,
  `--font-mono`), `app/opengraph-image.tsx`, `app/rix/opengraph-image.tsx`, `assets/fonts/acosta.otf`
  (and `assets/fonts/ibm-plex-sans-latin-700.woff2`) — the site's fonts (2026-10-07 decision; Acosta,
  IBM Plex Sans, IBM Plex Mono, Plex Sans Bold for display punctuation)
- `lib/styles.ts` — shared style helpers: the takeover's cream-side tokens (`pillInk`,
  `focusRingOnCream`, `metaLabelOnCream`) and the split/sticky-title helpers (`splitColumns`,
  `splitGrid` adds `lg:items-start`, `stickyTitle` `lg:sticky lg:top-30 lg:self-start`) and
  `slantDrop` (`[--slant-drop:5.2408vw]`, the hero's 3° cut and the marquee under it; a plain CSS
  custom property, not a design token)
- `lib/aboutPick.ts`, `lib/aboutMemory.ts`, `lib/holdInView.ts`, `lib/shownSet.ts`,
  `hooks/useShownSet.ts`, `hooks/useSwapFade.ts`, `hooks/useShownForMotion.ts`,
  `hooks/useAboutRemember.ts`, `hooks/useCloseOnLeave.ts`, `components/home/pick/` (including
  `ShownForTag.tsx`) — the shared pick: the set it maps to, setting it from outside About, the
  session memory, the shared set store and its swap fade (`shownSet.ts`; `useSwapFade` names a
  section's fading wrappers), keeping the tag in view (`holdInView` holds twice: at the pick and at
  the swap's commit), the set Agents and Process read, the "Shown for" list's open fade and chevron
  turn (`useShownForMotion`), and the tag (see `sections/02a-about.md`)
- `lib/routes.ts` — route/anchor targets
- `lib/track.ts`, `lib/analytics.ts`, `components/Analytics.tsx` — the one Book a call tracking
  key and the Umami Cloud counting setup (script only loads once `NEXT_PUBLIC_UMAMI_WEBSITE_ID`
  is set, and only counts on `marwix.dev`)
- `lib/pageMetadata.ts`, `lib/structuredData.ts`, `components/StructuredData.tsx` — the SEO pass:
  each page's canonical link, and the home page's JSON-LD (the site and the person)
- `lib/cardSets.ts` — the About cards that have their own set (every reply whose `pickSet` is not
  `default`), with labels; feeds Agents' and Process' hidden all-sets lists
- `lib/listNumber.ts` — a list row's two-digit number from its zero-based index, shared by
  numbered rows across sections
- `lib/gsap.ts` — the one place GSAP and its plugins (`ScrollTrigger`, `useGSAP`) are registered;
  every motion hook imports GSAP from here
- `lib/motion.ts` — shared motion settings for the GSAP pass: reduced-motion/fine-pointer media
  queries, durations, eases, staggers, `reveal` (the generic scroll entrance, ui-spec §10), and the
  `data-anim` hook query
- `lib/watchLive.ts` — shared: whether an element is on screen and its tab visible, used to pause
  loops/timers (Agents' auto-advance and demo loops, Process' bots, Contact's brief placeholder)
  when nobody can see them
- `hooks/useScrollReveal.ts` — the reusable scroll-reveal hook for any section's `data-anim="reveal"`
  elements; used by Process, Web, Proofs and Contact (each via its own motion component); clears
  the element's inline transform/opacity once it has revealed, so a sticky column carries no
  leftover transform
- `lib/revealBatch.ts` — the shared staggered list reveal (`ScrollTrigger.batch`, same from-state
  as the generic reveal), used by Web's rows and Proofs' cards
- `components/WhatsAppLink.tsx` — the shared WhatsApp link, its `href` following an About pick;
  used by Contact's side row (`ContactRow`/`ContactLinks`) and the footer (`FooterLinks`)
- `components/TypingBubble.tsx` — the shared typing-dots bubble, used by Agents' `ChatDemo`
- `lib/styles.ts` `chip` — the shared chip shape (44px tall), used by Contact's need chips

## Decisions (site-wide)

- 2026-10-09 — User's call: the word "rules" is replaced by "standards" everywhere on the home page except the Discord demo's "#rules" channel (Process step, lead, loop and fix labels in every flow; the software-builder card incl. the Review gate role; the Exile Bot proof line). Copywriter writing; the facts file is unchanged ("standards" paraphrases its "rules"). Supersedes the "your rules" wording in the 2026-10-08 Process decision. See `sections/04-agents.md`, `05-process.md`, `07-proofs.md`.
- 2026-10-09 — User's calls: the facts line "Sensitive actions, like refunds and complaints, are passed to a person instead of being handled by an agent" stands as worded; the new round 1 Marquee and About lines stay (nothing restored); home `meta.title` stays "Muhammad Waqas | AI Agents and Automations" and need not echo the description; the software-builder "inside your team" line stays (see `sections/04-agents.md`, `05-process.md`).
- 2026-10-09 — Lead's call (user delegated): audit copy fixes where the facts or voice rule 17 didn't back the wording: Process default step 3 ("passed to you, not handled by an agent"), Agents online-store "Orders to stock" line and demo result ("Sheet updated"), Web label ("Websites and web apps"), Exile takeover and proof line ("from plan to launch"; "Agents that each do one part"). "To you or your staff" stays. See `sections/04-agents.md`, `05-process.md`, `06-web.md`, `07-proofs.md`.

- 2026-10-08 — User's calls: the shared voice is written first for everyday business owners who know AI only as a chat box (ChatGPT); developer and Discord content stays inside their own cards. "AI agent" stays, defined once in Agents by comparison with ChatGPT, then the copy talks in jobs; tone is calm proof (their job done, they stay in charge), no grand claims. Round 1: words plus Agents' heading and bridge line; round 2: demos show the action taken (a "Done" receipt) and Process is recast around control, one question "Can I trust it with my customers?" (built; heading changed to "Hard calls / come to you." on 2026-10-09). `docs/04-voice.md` gained the chat-box reader line and rules 15-17 (show the job done; define "AI agent" once; builders' words only in the software-builder card); `docs/03-facts.md` gained "What an AI agent is", around-the-clock lines for service business and online store, and the new default set line. See `sections/02-hero.md`, `02a-about.md`, `03-marquee.md`, `04-agents.md`, `05-process.md`, `06-web.md`, `08-contact.md`.
- 2026-10-07 — User's call: the entry to `/rix` moves from a footer-row link to a second Rix standing on the footer's top line; see `sections/09-footer.md`.
- 2026-10-07 — User's call: the fonts change for the whole site: display text (name, headings, big display text, the MARWIX wordmark, the sharing images) is Acosta (single weight, local `assets/fonts/acosta.otf`, Befonts, commercial use allowed), body is IBM Plex Sans, labels and meta are IBM Plex Mono; replaces Bricolage Grotesque, Geist and Geist Mono. Why: the user chose Acosta from five candidates; IBM Plex beat Space Grotesk because its capital I reads as a lowercase l ("AI" looks like "Al"). Acosta is about twice as wide as condensed Bricolage, so size tokens, tracking and leading were retuned the same day (see `docs/01-design-system.md`).
- 2026-10-07 — User's call: display punctuation renders in IBM Plex Sans Bold (a local static 700 file, `displayPunct`) because Acosta has letters and digits only.
- 2026-10-07 — User-approved SEO pass: `marwix.dev` (no www) is the site's main address (set in Vercel; `www` still needs its redirect); every page gets a canonical link through `lib/pageMetadata.ts`; the sitemap carries a last-changed date; the home page carries JSON-LD (the site and the person, from `content/shared.ts` → `structured`, `footer.copyrightName` and `links`, facts-file claims only); home `meta.title` is set so a search for the name has something to match (now "Muhammad Waqas | AI Agents and Automations", the user's edit in `content/home.ts`). Why: the live site had no canonical, no structured data, and gave search engines an address that redirected.
- 2026-10-07 — Skipped on purpose in the SEO pass: an FAQ section (the common questions are barred by the facts file), `llms.txt`, and any new route (constitution §2).
- 2026-10-07 — User's call: every project takeover gets a permanent ink band behind its title, and
  the card's ink banner morphs into it on open (reverse on close). See `sections/07-proofs.md`.
- 2026-10-07 — User's call: the About card "I need a website" is removed (it isn't a profession, so
  it doesn't answer "What do you do?"); About has five cards and four audiences, and Web serves
  anyone who needs a website. See `sections/02a-about.md`.
- 2026-10-07 — User's call (mockup option "A1"): the Marquee strip moves from below About to
  between Hero and About (Hero → Marquee → About → Agents → …), sitting under the hero's 3° slanted
  bottom edge; same angle at every width. Built and lead-checked 2026-10-07 (360 to 3840: no
  sideways scroll, no console errors; reduced motion and Safari unchecked). See
  `sections/02-hero.md` and `sections/03-marquee.md`.
- 2026-09-24 — Reset to the v3 reference design; one page at `/`, projects opening in a
  full-screen takeover, not on their own routes. Violet accent (not v3's lime), v3 greys mapped onto existing tokens.
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
- 2026-09-24 — Type tokens: big
  section headings use slightly looser letter spacing; the 8 fluid type tokens use rem bounds and
  a rem + vw middle so text grows with zoom/font-size settings (WCAG 1.4.4).
- 2026-09-24 — Every Book a call link uses one tracking key (`lib/track.ts`); visits and Book a
  call clicks are counted with Umami Cloud (cookieless), only on `marwix.dev`.
- 2026-09-25 — User's choice: every section after the hero pins its title column like Web (CSS
  sticky at 120px, from `lg` up); Agents pins its left column, Process from `xl`, Contact its left
  column; phone/tablet unpinned; Proofs excluded (reverted layout, see `sections/07-proofs.md`).
  The pattern is written once in `lib/styles.ts` (`splitColumns`, `splitGrid`, `stickyTitle`).
  **Process clause superseded 2026-09-26.**
- 2026-09-26 — Process is excluded from the sticky-title pattern, like Proofs: the canvas's
  stacked layout puts the heading above the steps at every width, with no pinned title column.
  `stickyTitleXl` is gone from `lib/styles.ts`. See `sections/05-process.md`.
- 2026-09-25 — Site-wide, in `app/globals.css` (user's request): the scrollbar is an accent thumb
  on a transparent track; text selection and image dragging are off everywhere (inputs, textarea
  and `[contenteditable]` stay selectable).
- 2026-10-05 — User's choice: selected text sits on the accent background and takes the opposite of
  its own colour (light text turns ink, dark text turns off-white), via an inherited
  `--selection-text` (a local variable, not a theme token) set by text-colour classes in
  `app/globals.css`; it only shows in form fields and browsers that ignore `user-select`.
- 2026-09-25 — Constitution §5 amended (user's decision): under reduced motion, short opacity
  fades stay and anything that moves turns off (slides, parallax, mouse drift, auto-advance,
  looping pulses); the marquee strip is the one exception, kept looping under reduce (marquee
  exception requested by the user) and pausing on hover in both modes.
- 2026-09-26 — The site favicon is the mascot mark: the violet MW "gap eyes" body with the eyes cut
  as holes, no hat or tools. Ships as `app/icon.svg` plus `app/apple-icon.png` (180px, on the bg
  colour); sources are the SVGs in `temp/A-GAP_EYES/` (gitignored). The OG image is unchanged.
- 2026-09-26 — User's choice: the section is renamed Proofs → Projects in every visible word (nav
  link, section label, the hero's "See projects" button, the takeover top bar "PROJECT 0n / 03")
  and the page anchor (`#proofs` → `#projects`; not live yet, so no shared links break). Code, file
  and content key names stay `proofs`. See `sections/07-proofs.md`.
- 2026-09-28 — User's choice: proof cards are redesigned on one template — an "Ink stage" banner
  with a 3D ProcessBot (holding a per-project prop) replaces the card screenshot, with one proof
  line added below the card line. See `sections/07-proofs.md`.
- 2026-09-28 — User's choice: MARWIX-SKILLS is hidden temporarily (card and takeover) behind one
  flag; content and code stay. Two shown projects sit two across from `md` up, full width, no empty
  third slot. See `sections/07-proofs.md`.
- 2026-10-02 — The user amended constitution §2 to allow one extra route, `/rix`: a public Rix
  playground with its own page doc at `docs/pages/rix/`.
- 2026-10-01 — Launch is on hold until the new About section (see `sections/02a-about.md`) is
  spec'd, built and approved.
- 2026-10-03 — Blocker resolved: at the user's instruction the constitution was amended (§3 five
  audiences and per-card tone; §7.3 results stated in the facts' words with no figure; §7.4 demo
  samples may name an everyday product and the builder card may use builders' words; §7.5 Process
  flows are illustrations) and `docs/03-facts.md` was rewritten per card; `docs/04-voice.md` gained
  a "Tone per card" table.
- 2026-10-03 — The per-card redesign of About, Agents and Process is built, static (specs:
  `ui-spec.md` §0.5–0.6 and its Choices, all decided). The About pick also drives Agents
  (offers and demos per card) and Process (a flow per card); Marquee, Web, Projects and Contact stay
  the same for everyone. Each card's own content has its own tone (`docs/04-voice.md`); the rest of
  the page keeps one voice. Details in `sections/02a-about.md`, `sections/04-agents.md` and
  `sections/05-process.md`.
- 2026-10-03 — Site-wide pick: remembered for the visit (session); a `?for=` link wins the first
  time that value is seen in a visit; a "Shown for: …" tag on Agents and Process opens an in-flow
  list of the six cards and switches in place; the tag is hidden without JavaScript, where both
  sections show the default set; Rix's tantrum still deselects.
- 2026-10-07 — User's call: About's fifth card is labelled "Just exploring" (was "Not sure yet"); Contact's brief option keeps "Not sure yet". See `sections/02a-about.md`.
- 2026-10-05 — User's call: Rix on About is livelier and talks more (`ui-spec/00-rix.md` rev 4),
  and card picks are locked from a tantrum's start until the forgive ends; home no longer allows
  "a pick is never blocked". See `sections/02a-about.md`.
- 2026-10-04 — Set swaps fade (0.15s out, swap, 0.25s in; opacity only, the same under reduced
  motion) from one shared store (`lib/shownSet.ts`), so Agents, Process and the bots change in one
  commit, with `holdInView` holding the tag again when the swap lands; the "Shown for" list fades in
  over 0.2s on open with the chevron turning (no turn under reduced motion).
- 2026-10-04 — The Process crew relay is back on (`RELAY_ON = true`), rebuilt for five or six steps,
  paced by `RELAY_REST` (2s after each run), not a fixed rhythm; see `sections/05-process.md`.
- 2026-10-03 — The workflow offer gets an `orchestra` demo (lead, team, checks, drawn as swimlanes
  since 2026-10-04) and every Process flow but Discord a second return line (step 4 back to step 3);
  two lines were added to `docs/03-facts.md` under "How the user works", with the user's permission.
  See `sections/04-agents.md` and `sections/05-process.md`.
- 2026-10-04 — Four lines were added to `docs/03-facts.md` under "For a Discord server", with the
  user's permission (around the clock and answers mentions; a tone the owner sets; an optional record
  of past chats; connects to business tools and other apps). Process' Discord flow (no check, no
  loops) and Agents' Discord demos follow them; see `sections/05-process.md` and
  `sections/04-agents.md`.
- 2026-10-05 — User's calls on Process' phone ledges (a ledge under each bot below `lg`, the job hopping between them) and on
  Agents' Discord demos (a welcome checklist; moderation with a done pill per row, a 20-character
  pill limit): see `sections/05-process.md` and `sections/04-agents.md`.
- 2026-10-05 — Agents' demo steps get randomized durations (Agents only, not the Process relay),
  built and lead-checked: see `sections/04-agents.md`.
- 2026-10-05 — Exile's card line, In use row and summary state its real use (Idle Heroes players'
  Discord communities); spam protection only in the takeover (showcase and, from 2026-10-06, a
  screenshot), stated as live in the communities that use it (the user's facts correction,
  2026-10-05); the Marquee typo "Webs apps"
  is fixed. See `sections/07-proofs.md` and `sections/03-marquee.md`.
- 2026-10-06 — The user's Exile Bot takeover calls: three screenshots, in-use numbers 18+ and 3.9K+,
  a status pill with no count, and Eva (Exile Bot's mascot) in the spam diagram's step tiles as the
  one exception to "no generated art on the site", Exile Bot view only. See `sections/07-proofs.md`.
- 2026-10-05 — The project is named "Exile Bot" (title, summary, visit button; tag now "Discord
  platform"); no key, hash or file renamed. See `sections/07-proofs.md`.
- 2026-10-05 — With the user's permission, docs/03-facts.md gained: the corrected Exile use, a
  "What the user can do for a business: shown by Exile" block (four capabilities, not on the page
  yet), the booking page showing free hours in the visitor's own time zone, and "the user's location
  or time zone" on the Never list.
- 2026-10-05 — User's call: each project takeover is rebuilt into up to seven parts (same structure,
  optional parts, Exile Bot has all seven and Design Vault four; only its closing line follows the
  About pick; each takeover ends with its own Book a call, covered by constitution §3). See
  `sections/07-proofs.md`.
- 2026-10-05 — User's call: the site's copy has no fixed length limits. `docs/04-voice.md` 'Length
  limits' table is replaced by a 'Length' section saying so; a 'Limit' column in any UI spec is a
  sizing note, not a rule; whether words fit is judged on the lead's screen check.

## Open Questions (site-wide)

- **To do (user):** create a free Umami Cloud account, add the website marwix.dev and send the
  lead its website ID; it's set as `NEXT_PUBLIC_UMAMI_WEBSITE_ID` in Vercel and needs a redeploy.
- **To do (user):** in Vercel, set `www.marwix.dev` to redirect to `marwix.dev` (it currently
  serves the page too).
- **To do (user):** add the site to Google Search Console (Domain property; the user adds the TXT
  record in Cloudflare themselves, constitution §10) and Bing Webmaster Tools, then submit the
  sitemap, after the SEO pass is deployed.
- **Choice:** constitution §13's ship date (2026-09-30) has passed; the user decides the new one.
- **Choice:** the reference design file `temp/claude-design/Portfolio Redesign v3.dc.html` is
  missing on disk (constitution §5 names it); the user restores it or says to drop it.
- **Roll-up:** section-specific open questions remain in `sections/02-hero.md` (5),
  `sections/02a-about.md` (10), `sections/03-marquee.md` (1), `sections/04-agents.md` (17),
  `sections/05-process.md` (25), `sections/07-proofs.md` (34), `sections/08-contact.md` (1) and `sections/09-footer.md` (3). The
  pre-deploy check reads this roll-up and every section file; the page ships with none open
  anywhere.
- **To build:** `lib/takeoverTitleMorph.ts` still carries logic for Bricolage's `opsz`/`wdth` axes
  and em letter spacing that no longer does anything; it works, but gsap-animator should trim it.
- **To do (user):** delete `assets/fonts/GeistMono-ExtraBold.ttf` and
  `assets/fonts/GeistMono-OFL.txt`, which nothing reads now (the project's hook lets only the user
  delete files).
- **To do (user):** `.claude/skills/design-tokens/SKILL.md` and `.claude/agents/ui-designer.md`
  still name the old fonts.
- **To build:** the ui-spec files still quote the old sizes and fonts (e.g. `ui-spec.md`
  `condensedMark`, `ui-spec/09-footer.md` "25vw", `ui-spec/00-rix.md`, `docs/pages/rix/ui-spec.md`);
  ui-designer updates them.
- **To build:** `ui-spec/05-process.md` (§5.4 Sizes and elsewhere: "across from 1024", `lg:` names) and `ui-spec/04-agents.md` (`AgentPointerPanel`, kind `pointer`, `agents.pointer.*`, removed 2026-10-07) are out of date; ui-designer updates them (see `sections/05-process.md`, `04-agents.md`).
- **Choice:** the hero portrait is taller on phones and tablets than before (about 100px at 360)
  because the name block above it is shorter: keep, or bring back the old size.
- **To build:** Safari, Firefox and real-device check of the new fonts, plus the Design Vault
  takeover and the takeover's Next slide, which the 2026-10-07 check did not cover.
- **Fact:** the About copy (`content/home.ts` → `about`) is still SAMPLE (see
  `sections/02a-about.md`).
- **Review (rolled up):** Agents: sticky column at 1024x768 re-measured 2026-10-09, still 38px over;
  the reminder chat's "reminder sent" note was dropped. Process (flow side by side from `wide`, 1440,
  since 2026-10-09): layout lead-checked 2026-10-09; browser check pending (animation at 1440 and 3840, two accepted
  overlaps), and "To you or your staff" may be too long at 1440 (not measured).
