# Home: UI spec

**Last Updated:** 2026-10-09
**Sources:** `docs/pages/home/page.md` (decisions 1–44, the source of truth), constitution §2–§9,
`docs/01-design-system.md`, `app/globals.css`, v3 reference (layout and behaviour only),
`docs/03-facts.md`, `docs/04-voice.md`.
**Scope:** the static, final-state page. Every animated element carries a **Motion (later)** line
and the markup hooks the GSAP pass needs. The spec never states page text; it names slots.
**Layout:** this file is the index. It holds the shared rules and parts (§0), the motion hooks
summary (§10), tokens and choices. Each section's spec is its own file under `ui-spec/`; load this
file plus the one section you work on. The § numbers stay as they were (for example §2.1.1).

**2026-10-03 (the per-card redesign of About, Agents and Process; static round, not built yet):**
the shared rules are §0.5 (the pick) and §0.6 (the "Shown for" tag). Section detail:
`ui-spec/02a-about-options.md` §2a.R, `ui-spec/04-agents.md`, `ui-spec/05-process.md`. No new
motion is built this round, and the built motion that still works keeps running; §10 says which.
The user answered every open choice on 2026-10-03 (Choices, below).

**2026-10-03, later (the user's decisions A and B; static, not built yet):** (A) the workflow
offer's demo becomes a new kind, `orchestra` (a lead over a team and the checkers, with the fix
loop), on `default` row 4 and `software-builder` row 1 (`ui-spec/04-agents.md` §4.4, §4.8);
(B) every Process flow gains a second return, the fix loop from step 4 back to step 3, with its
own label slot (`ui-spec/05-process.md` §5.3a). Both use existing tokens only.

**2026-10-03, later still (the user's choice):** the `orchestra` demo was redrawn as a numbered
loop. **Superseded 2026-10-04** (below).

**2026-10-04 (the user's two changes; static, not built yet):** (1) the `orchestra` demo becomes
**swimlanes**: Lead, the team and the checks side by side, the middle lane shaded, eight rows in
one rounded outline joined by L-shaped connectors, the fix row dashed accent, the lane's title
inside every card at every width; the content keys stay, with new limits
(`ui-spec/04-agents.md` §4.4–4.6). (2) **Below `lg`, Agents' panel gets a stepper** on top
(‹ / ›, counter, the offer's title, progress bars, its line) and the vertical tab list hides; from
`lg` nothing changes (`ui-spec/04-agents.md` §4.2a). Existing tokens only. Three new copy keys
(`agents.stepper.*`). The four layout questions were decided by the lead the same day (Choices, below).

**2026-10-04, later (the user's decision on Process; static, not built yet):** the Discord flow
has no validation and no loops: no "Second check" step, no fix loop, no bottom return. Its five
steps are Mentioned, Your tone, Remembers, Connected, Always on, drawn with existing bots
(`intake`, `rules`, `update`, `ship`, `host`). A flow draws its loops only where
`lib/processFlows.ts → hasLoops[set]` is true; `process.flows.discord` has no `loopLabel` and no
`fixLabel`. The other five flows are unchanged (`ui-spec/05-process.md` §5.3b, §5.10). No new token.

**2026-10-04, the motion pass (built and checked; the specs brought in line 2026-10-05):** the
motion the notes above call "not built yet" is built for the pick, Agents and Process: the swap
fade (§0.5), the tag's fade and chevron turn (§0.6), Agents' stepper bar, orchestra token run,
checklist sequence, typing dots and pointer pop (`ui-spec/04-agents.md` §4.7), and Process' relay
on five or six stops with the fix hop, the hand-off from step 1 and the new roles' acts
(`ui-spec/05-process.md` §5.7). Summary: §10. No layout, copy or token change.

**2026-10-05 (the user's decisions on the project takeover; static, not built yet):** a project's
takeover is several short parts in place of the single summary: what it is, the problem, what I
built, what it took and a showcase (both optional per project), and what this means for you,
ending on its own Book a call. Parts 2 to 6 each carry a small mono label over a headline written
for that project. Exile Bot's showcase has a drawn diagram. The closing line is the one part of a
takeover that follows the pick (§0.5). Existing tokens only; two new shared class strings (§0.3).
Detail and the decided choices: `ui-spec/07-proofs.md` §7.3–§7.8.

**2026-10-05, later (the user's decision on Process, final; static, not built yet):** below `lg`
the phone track is **replaced by ledges**: under every bot a short 2px `line` ledge it stands on,
a piece of the ground line cut to the bot's width, with a hidden lit overlay the job will light as
it lands. The fix loop below `lg` drops the marker row's icon for a dotted `accent` line down the
bot column's left side, from bot 4 up to bot 3, with the same label beside it. From `lg` nothing
changes. Existing tokens only; no copy change (`ui-spec/05-process.md` §5.3a, §5.9, §5.8 53–61).

**2026-10-05, later still (the user's decision on the project takeover; static, not built yet):**
an optional takeover part, **What I learned**, goes right after What it took and before the
showcase, with the same mono label and own headline. Exile Bot has three lessons, numbered, each
said as how the user works now; Design Vault skips it for now, so its takeover is unchanged. The
showcase becomes part 6 and the closing panel part 7: Exile has seven parts, Design Vault four.
It reuses the took item (renamed `TakeoverItem`, with an optional ordinal). Existing tokens only;
one new optional content block and one new part label (`ui-spec/07-proofs.md` §7.3.1, §7.5,
§7.8 16–19).

**2026-10-05, the ledge motion and the fix line route (Process; built, checked by the lead at 360
and 768):** the ledges and the dotted fix line the Process note above calls "not built yet" are
built, static, then motion. Below `lg` the job hops ledge to ledge in small thrown arcs, each
ledge lights while its bot works the job, and the job pops and fades on the last ledge. On a fix
run the job goes back along the dotted fix line (the user's request), which lights behind it
(`FIX_LINE_HOP` 1.1s, `lib/processRelayFixLine.ts`); a fix run below `lg` is +5.5s. From `lg`
nothing changes. No markup, copy or token change. Six calls are open for the user (Choices,
below; `ui-spec/05-process.md` §5.8 62–65, 67–68). Summary: §10.

**2026-10-09 (the user's choices on the sharing image; static, not built yet):** the home sharing
image is redrawn to pair with `/rix`'s: the wordmark, the name, a role line and `marwix.dev` down
the left, Rix on a floor line mid-right (§0.7). `/rix`'s image is unchanged. The user delegated
the layout calls; the lead settled them the same day and added Rix's speech bubble with a done
message (Choices 45–49). Existing tokens only; three new copy keys (`meta.ogLine`,
`meta.ogBubble`, `meta.ogAlt`); `meta.description` is rewritten to name every audience.

## Sections

| § | Section | UI spec | Page doc |
|---|---|---|---|
| — | Rix character sheet: the mascot, defined once (new 2026-10-02; used first by §2a option B, later by Process) | [`ui-spec/00-rix.md`](ui-spec/00-rix.md) | [`sections/02a-about.md`](sections/02a-about.md) |
| 1 | Nav | [`ui-spec/01-nav.md`](ui-spec/01-nav.md) | [`sections/01-nav.md`](sections/01-nav.md) |
| 2 | Hero | [`ui-spec/02-hero.md`](ui-spec/02-hero.md) | [`sections/02-hero.md`](sections/02-hero.md) |
| 2a | About, the old chat spec (2026-10-01; no longer rendered on `/`) | [`ui-spec/02a-about.md`](ui-spec/02a-about.md) | [`sections/02a-about.md`](sections/02a-about.md) |
| 2a | About, option B "Poster board": the live build, and its 2026-10-03 redesign in §2a.R (options A and C and `/dev` are kept there as a record) | [`ui-spec/02a-about-options.md`](ui-spec/02a-about-options.md) | [`sections/02a-about.md`](sections/02a-about.md) |
| 3 | Marquee | [`ui-spec/03-marquee.md`](ui-spec/03-marquee.md) | [`sections/03-marquee.md`](sections/03-marquee.md) |
| 4 | Agents (offers per card, 2026-10-03; the `orchestra` demo as swimlanes and the phone stepper, 2026-10-04) | [`ui-spec/04-agents.md`](ui-spec/04-agents.md) | [`sections/04-agents.md`](sections/04-agents.md) |
| 5 | Process (a flow per card, 2026-10-03; the fix loop, decision B; Discord without loops, 2026-10-04; ledges and a dotted fix line below `lg`, 2026-10-05): layout, flows, the bot | [`ui-spec/05-process.md`](ui-spec/05-process.md) | [`sections/05-process.md`](sections/05-process.md) |
| 5 | Process, the built bot motion (§5.7's constants and layers, moved 2026-10-03) | [`ui-spec/05-process-motion.md`](ui-spec/05-process-motion.md) | [`sections/05-process.md`](sections/05-process.md) |
| 5 | Process, the four-step crew relay (legacy: superseded 2026-10-03; the relay was rebuilt for the flows on 2026-10-04, `ui-spec/05-process.md` §5.7) | [`ui-spec/05-process-relay-legacy.md`](ui-spec/05-process-relay-legacy.md) | [`sections/05-process.md`](sections/05-process.md) |
| 5 | Process, the phone track (legacy: built 2026-10-05, superseded the same day by the ledges, `ui-spec/05-process.md` §5.9) | [`ui-spec/05-process-track-legacy.md`](ui-spec/05-process-track-legacy.md) | [`sections/05-process.md`](sections/05-process.md) |
| 6 | Web | [`ui-spec/06-web.md`](ui-spec/06-web.md) | [`sections/06-web.md`](sections/06-web.md) |
| 7 | Proofs (the takeover in parts, with a headline per part, 2026-10-05; the optional What I learned part, later the same day; the Exile view's three shots, 18+ / 3.9K+ and Eva step tiles at 96 / 128px on existing tokens, 2026-10-06, §7.3.2, §7.6, §7.8 20–33) | [`ui-spec/07-proofs.md`](ui-spec/07-proofs.md) | [`sections/07-proofs.md`](sections/07-proofs.md) |
| 7 | Proofs, the spam diagram as an ink stage with Eva (supersedes §7.3.2 and §7.6.1, 2026-10-06) | [`ui-spec/07-proofs-spam.md`](ui-spec/07-proofs-spam.md) | [`sections/07-proofs.md`](sections/07-proofs.md) |
| 7 | Proofs, the card bot (§7.2.1–§7.2.3, moved 2026-10-06, text unchanged) | [`ui-spec/07-proofs-bot.md`](ui-spec/07-proofs-bot.md) | [`sections/07-proofs.md`](sections/07-proofs.md) |
| 7 | Proofs, the takeover's title band and the banner's part in open, close and Next (2026-10-07) | [`ui-spec/07-proofs-band.md`](ui-spec/07-proofs-band.md) | [`sections/07-proofs.md`](sections/07-proofs.md) |
| 7 | Proofs, the sticky band that condenses as the takeover scrolls (2026-10-07; amends 07-proofs-band.md §A placement and §C fallbacks) | [`ui-spec/07-proofs-sticky-band.md`](ui-spec/07-proofs-sticky-band.md) | [`sections/07-proofs.md`](sections/07-proofs.md) |
| 8 | Contact | [`ui-spec/08-contact.md`](ui-spec/08-contact.md) | [`sections/08-contact.md`](sections/08-contact.md) |
| 9 | Footer | [`ui-spec/09-footer.md`](ui-spec/09-footer.md) | [`sections/09-footer.md`](sections/09-footer.md) |

---

## 0. Shared rules and parts

### 0.1 Page frame

- `app/layout.tsx`: `<SkipLink />`, `<SiteHeader />`, `<main id="main" tabIndex={-1}>`,
  `<SiteFooter />`. `app/page.tsx` renders, in order: Hero, Marquee, Agents, Process, Web, Proofs,
  Contact, then the three `<ProjectTakeover />` dialogs and `<TakeoverController />`.
  **About (§2a, decided 2026-10-01):** `<AboutSection />` goes right after Hero, before Marquee.
  Agents' frame is unchanged (still no `border-t`, under the marquee). **2026-10-02:** the About
  on `/` is `<AboutPosterSection />` (option B).
- In-page ids live in `lib/routes.ts` (overwritten; one job: link targets): `top`, `agents`,
  `process`, `web`, `proofs`, `contact`, and the takeover hashes `exile`, `design-vault`,
  `marwix-skills`. Every section takes `scroll-mt-20` (80px) to clear the fixed header.
  **2026-10-01:** `about` is added (§2a); no nav link for it (decided).
- **Section frame** (Process, Web, Proofs, Contact, About, and Agents without the top line):
  `<section id class="px-gutter scroll-mt-20">` → `<div class="{container} py-section border-t border-line">`.
  The hairline spans the content width. Agents drops `border-t` (the marquee's bottom line is above it).
- **Spacing tokens (approved 2026-09-24):** `--spacing-gutter` (`clamp(20px, 4vw, 56px)`) gives
  `px-gutter`; `--spacing-section` (`clamp(80px, 12vw, 160px)`) gives `py-section`. They're used
  for every page gutter and section rhythm; there are no arbitrary gutter or section values anywhere.
- **No sideways scroll:** `body` gets `overflow-x-clip`; every full-bleed decorative part clips as
  well: the hero's backdrop (light pool, network canvas, vignette, grain) and portrait by the
  hero's `overflow-hidden`, the marquee, and the footer wordmark.

### 0.2 File plan

- **Deleted before the build:** everything in `components/`, and `lib/breakpoints.ts`,
  `lib/currentPage.ts`, `lib/focusFirstLink.ts`, `lib/navIds.ts`, `lib/words.ts`. Nothing here depends on them.
- **Kept and overwritten:** `hooks/useDisclosure.ts`, `hooks/useOnMediaMatch.ts`, `lib/styles.ts`,
  `lib/routes.ts`, `lib/navItems.ts`, `lib/socialItems.ts`, `content/home.ts`.
- **Used as they stand:** `lib/images.ts` (extended, 0.4), `lib/isFilled.ts`, `lib/currentYear.ts`,
  `lib/fonts.ts`, `content/shared.ts` (its slots are rewritten by copywriter).

### 0.3 `lib/styles.ts` (overwritten; shared class strings only)

| Name | Classes | Use |
|---|---|---|
| `container` | `mx-auto w-full max-w-(--container-site)` | `--container-site` 1536px |
| `focusRing` | `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text` | on dark |
| `focusRingOnCream` | same, with `focus-visible:outline-ink` | the takeover |
| `focusRingCard` | `focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-text` | the cream proof cards, on dark |
| `condensed` | `[font-variation-settings:'wdth'_80]` | display face |
| `rowTitle` | `font-display text-row leading-none font-semibold tracking-[-0.035em]` + `condensed` | big-row titles: Agents rows, Web step rows |
| `condensedMark` | `[font-variation-settings:'wdth'_75]` | footer wordmark only |
| `monoLabel` | `font-mono text-nav uppercase tracking-[0.06em] text-muted` | section labels, hero tag |
| `metaLabel` | `font-mono text-meta text-muted` | step, panel and card meta |
| `metaLabelOnCream` | `font-mono text-meta text-cream-muted` | meta on cream (proof cards, the takeover) |
| `pillPrimary` | `inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 text-body font-semibold text-on-accent hover:bg-text active:bg-muted` + `focusRing` | primary pill |
| `pillOutline` | `inline-flex min-h-12 items-center justify-center rounded-full border border-line bg-bg/50 px-6 text-body text-text hover:border-accent hover:text-accent active:bg-band` + `focusRing` | secondary pill |
| `pillInk` | `inline-flex items-center rounded-full bg-ink text-cream hover:bg-accent hover:text-on-accent active:bg-accent/80` + `focusRingOnCream` | ink pill on cream (takeover Close and Visit); height, padding, gap and type set where used |
| `chip` (**new 2026-10-01**) | `inline-flex min-h-11 items-center gap-2 rounded-full border px-4.5 text-body` | the chip shape, no state classes: Contact's need chips (moved out of `NeedChips`) and About's reply chips (§2a), each adding its own state classes. **2026-10-03:** also the "Shown for" tag's options (§0.6) |
| `takeoverText` (**new 2026-10-05**) | `max-w-xl text-lead leading-normal text-pretty text-ink` | a takeover part's paragraph, on cream: 17px on a 576px measure (§7.3.1) |
| `monoPill` (**new 2026-10-05**) | `inline-flex items-center gap-2 rounded-full px-3 py-2 font-mono text-meta leading-none font-medium tracking-[0.06em] uppercase` | a small mono pill's shape, not interactive, no colour classes: the takeover showcase's status line and the diagram's return pill, each adding its own colours (§7.3.1, §7.3.2) |

### 0.4 Shared components (all server unless marked)

| File | Job |
|---|---|
| `components/SkipLink.tsx` | "Skip to content" to `#main`: `sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-60` + `pillPrimary` when focused |
| `components/SectionLabel.tsx` | Number, a 24px hairline (`h-px w-6 bg-muted`, `aria-hidden`), label text, in `monoLabel`. Prop `as` (`h2` for Agents, `p` elsewhere). The hairline replaces v3's em dash (voice rule 10). **2026-10-01:** `number` is optional; without it (About, unnumbered) it renders the hairline, then the label |
| `components/SectionHeading.tsx` | `<h2>` = `lead` + `<span class="text-accent">accent</span>`. Size prop `heading-sm` / `heading` / `heading-xl`. Base: `font-display font-semibold text-balance text-text` + `condensed`; `heading-sm`/`heading`: `leading-[0.95] tracking-[-0.025em]`; `heading-xl`: `leading-[0.9] tracking-[-0.03em]` (loosened from −0.04/−0.045em by the user's choice, 2026-09-24: letters touched at desktop sizes) |
| `components/ExternalLink.tsx` | `<a target="_blank" rel="noopener noreferrer">` plus a `sr-only` suffix from `a11y.newTab` |
| `components/BookCallLink.tsx` | The one Book a call link (Cal.com, `links.bookCall`), built on `ExternalLink`, carrying `data-track="book-call"`: the single place clicks are counted (§11). Prop `variant`: `nav` (1.2) or `hero` (2.1). The Contact row (8.1) is built by the shared contact-row component, not a variant here. **2026-10-05:** `hero` is also the Book a call that ends each project takeover, on its ink panel (§7.3.3); no new variant |
| `components/SiteImage.tsx` | Every image: reads `lib/images.ts`, renders `next/image` with `fill`, `sizes`, `alt`, and an object-position prop. Renders `ImagePlaceholder` when the entry's file is `null` |
| `components/ImagePlaceholder.tsx` | Build-time stand-in: `grid size-full place-items-center border border-dashed` with a mono name label. On cream: `bg-ink/5 border-ink/20 text-cream-muted`; on dark: `bg-band border-line text-muted` |
| `components/icons/{Menu,Close,ArrowRight,ArrowUpRight,Check,ChevronUp,Asterisk}Icon.tsx` | One glyph each: inline SVG, `currentColor`, `aria-hidden="true"`, `focusable="false"` |
| `components/TypingBubble.tsx` (**new 2026-10-01**, §2a) | The three-dot typing bubble, moved out of `ChatDemo` so Agents and About share it: `hidden items-center gap-1.5 rounded-xl bg-line/40 px-4.5 py-4`, three `size-1.5 rounded-full bg-muted`, `aria-hidden`. Prop `side` (`start` adds `self-start rounded-tl-sm`, `end` adds `self-end rounded-br-sm`) and its `data-anim` value |
| `components/WhatsAppLink.tsx` (**new 2026-10-01**, client, §2a.2) | The WhatsApp link, built on `ExternalLink`: server markup uses `links.whatsapp`; after an About pick its `href` carries that group's `whatsappText` (`hooks/useAboutPick.ts`, `lib/whatsapp.ts`). Used by the Contact WhatsApp row and the footer socials; look unchanged |
| `components/home/pick/ShownForTag.tsx` (**new 2026-10-03**, client, §0.6) | The "Shown for: <card>" tag at the top of Agents and Process: a disclosure that opens the six cards in place and sets the pick |
| `components/home/pick/ShownForOption.tsx` (**new 2026-10-03**, §0.6) | One card in the tag's list: a native radio under a `chip` |

- `lib/images.ts`: each name → `{ dark: string | null }`. A `null` file fails the ship check, like
  a `[FILL]` marker. Names are listed in each section's file.

### 0.5 The pick (new 2026-10-03; shared by §2a, §4 and §5, and since 2026-10-05 by §7's takeover)

A visitor's About card is "the pick". It changes six things and nothing else: About's ack, the
emblem Rix holds, Agents' offers and panels, Process' flow, the WhatsApp message, and (since
2026-10-05, constitution §3) the closing line of each project's takeover.

- **Card keys** (the radio `value`, the `?for=` value and every per-card content key), in board
  order: `service-business`, `online-store`, `discord`, `software-builder`, `website`, `not-sure`.
- **One source of truth:** the checked radio in About's group (`name="about-for"`).
  `hooks/useAboutPick.ts` reads it, as built. Nothing copies the pick into React state.
- **Sets.** `lib/aboutPick.ts → pickSet(key)`: no pick or `not-sure` gives `default`; any other key
  gives itself. Agents and Process draw `agents.cards[set]` and `process.flows[set]`.
- **The takeover's closing line (new 2026-10-05, `ui-spec/07-proofs.md` §7.3.3).** Each project
  takeover's last part shows `proofs.projects.<project>.meansForYou[set]`, falling back to its
  `default` line when that card has none. It reads the set with `useShownSet` like Agents and
  Process, and it is that part's heading. Nothing else in a takeover follows the pick, and a
  takeover has no "Shown for" tag: the pick can't change while the modal is open.
- **Setting the pick from outside About** (the tag §0.6, `?for=`, the memory):
  `lib/aboutPick.ts → setAboutPick(key)` checks that radio and dispatches an untrusted, bubbling
  `change`, as `useAboutFor` does today. So Rix shows the emblem with no act, and About's status
  stays silent. `lib/aboutDeselect.ts` (the tantrum) is unchanged: both sections fall to `default`.
- **Remembered for the visit:** `lib/aboutMemory.ts` (session storage only, every call in
  `try/catch`). Key `marwix:about-for` holds the pick; it is written on every `change` in the
  group and removed when nothing is checked. `hooks/useAboutRemember.ts` does the writing.
- **`?for=` overrides the memory** (decided 2026-10-03). `hooks/useAboutFor.ts`, once after
  mount: if `?for` is a known key **and** differs from `marwix:about-for-link` (the last link
  value applied this visit), apply it and store it there. Otherwise apply the remembered pick, if
  any. So a shared link wins on arrival, and the visitor's own later pick survives a reload. The
  URL is never rewritten. No scroll, no focus move, no announcement.
- **Without JavaScript:** the server markup holds the `default` set only, in both sections. Each
  tag is hidden (`noscript:hidden`). About's ack still shows by CSS `:has`; its "set for you"
  line is `noscript:hidden`, so it never claims a change that didn't happen. A takeover shows its
  `default` closing line.
- **Swap.** One persistent wrapper per section carries `data-set={set}`; its children are keyed by
  set, so a change remounts them. `hooks/useShownSet.ts` returns the set to draw, read from one
  shared store, `lib/shownSet.ts`, so Agents' tab list, Process' flow and the bots' motion all
  change in one commit. **Motion (built 2026-10-04):** the store keeps the old set while the
  wrappers fade out over 0.15s (linear), swaps, then fades the new markup in over 0.25s
  (`power2.out`); opacity only, identical under reduced motion. `hooks/useSwapFade.ts` registers
  each section's wrappers (`ui-spec/04-agents.md` §4.7, `ui-spec/05-process.md` §5.7); the markup
  didn't change for it. A pick during the fade-out only retargets the swap (if it is back on the
  shown set, nothing swaps and the wrappers fade back in); a pick during the fade-in starts a new
  fade-out from the opacity reached; a pick of the set already shown does nothing. (Agents'
  stepper, §4.2a, persists through a swap; only its bars remount.) **2026-10-05, not built:** each
  takeover's closing line registers its own `<h3>` with `useSwapFade`, for the rare swap that
  lands while a takeover is open (a direct load on a project hash with `?for=`, a reload with a
  remembered pick); normally the pick changes while the dialog is closed.
- **A swap never moves the visitor.** No focus move, no scroll. When a pick made in a tag changes
  heights above that tag (Process' tag changes Agents), `lib/holdInView.ts` holds the tag's
  summary where it was, twice: at the pick (About's ack changes height at once), and again at the
  swap's commit after the fade-out, scrolling by the difference in the same frame and checking
  once more after the paint. Instant, never smooth. Browsers with scroll anchoring get a
  difference of 0.
- **After a reload** the page paints `default`, then swaps, with the same fade, once the memory
  is read. Accepted.

### 0.6 The "Shown for" tag (`ShownForTag`, new 2026-10-03)

One control, used at the top of Agents (§4.1) and Process (§5.1). It states the pick and changes
it in place: the list opens in the flow under the tag (no overlay, no scrim, as option C's blank).

- **Markup** (client; `hooks/useDisclosure.ts` gives Escape and the focus return):
  ```
  div.flex.flex-col
  ├ details data-anim="pick-tag" class="group/tag noscript:hidden"
  │ ├ summary class="inline-flex min-h-11 max-w-full cursor-pointer list-none items-center gap-2.5 rounded-full border border-line py-2 pl-3.5 pr-4 text-left hover:border-muted active:bg-band group-open/tag:border-accent [&::-webkit-details-marker]:hidden {focusRing}"
  │ │ ├ AboutPropGlyph prop={emblem of the pick, or null} className="size-5 shrink-0"
  │ │ ├ span class="font-mono text-nav text-muted"            ← shownFor.label
  │ │ ├ span class="min-w-0 text-body font-medium text-text"   ← the card's label, or shownFor.everyone
  │ │ └ ChevronUpIcon className="size-4 shrink-0 rotate-180 text-muted group-open/tag:rotate-0"
  │ └ fieldset data-anim="pick-tag-list" class="mt-3 flex min-w-0 flex-wrap gap-2"
  │   ├ legend class="sr-only"                                 ← shownFor.legend
  │   └ ShownForOption ×6 (board order)
  └ p class="sr-only" aria-live="polite"                       ← shownFor.announce + the card's label
  ```
- **`ShownForOption`:** `<label class="group/opt cursor-pointer">` → `<input type="radio" class="peer sr-only" name={`${sectionId}-shown-for`} value={key} checked={pick === key}>` →
  `<span class="{chip} {states}">` holding `CheckIcon` (`hidden size-3.5 group-has-checked/opt:block`)
  and the card's label (`about.replies[i].label`, no new slot). The radio name is the section's own,
  never `about-for`: the three groups stay separate and JS keeps them in step.
- **Behaviour:** choosing an option calls `setAboutPick(key)` (§0.5), so both sections, About's
  radio and the WhatsApp links follow. A **pointer** choice closes the list and focuses the summary
  (`preventScroll`). An **arrow-key** change selects live and keeps the list open. **Escape**, or
  focus or a press leaving the tag, closes it. With no pick, no option is checked.
- **Name and role:** the summary is the disclosure button; its text ("Shown for: <card>") is its
  name and gives the current value. The list is a radio group named by the legend. After a change
  made in this tag, only this tag's live region speaks.
- **Tap targets:** summary and every option are 44px tall (`min-h-11`).

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Summary pill | 44 tall, up to 320 wide (longest label ≈ 296); wraps inside the pill if text is enlarged | 44 tall, hugs its text | same | same |
| Emblem / prefix / value / chevron | 20 / 13 mono / 15 / 16 | same | same | same |
| List (open) | 12 below the tag; 3 rows of chips, ≈ 148 tall | 1–2 rows | Agents (616 column): 2 rows; Process (full width): 1 row | Agents (720): 2 rows; Process: 1 row |
| Option chip | 44 tall, 15px | same | same | same |

| Part | Default | Hover | Focus-visible | Open / checked | Active |
|---|---|---|---|---|---|
| Summary | `border-line`, value `text-text` | `hover:border-muted` | `focusRing` | open: `group-open/tag:border-accent`, chevron points up | `active:bg-band` |
| Option (span) | `border-line text-muted` | `peer-not-checked:hover:border-muted peer-not-checked:hover:text-text` | `peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-text` | `peer-checked:border-accent peer-checked:bg-accent peer-checked:font-medium peer-checked:text-on-accent`, plus the tick | `peer-not-checked:active:bg-band` |

Contrast: `muted` on `bg` about 6.9:1; `text` on `bg` above 16:1; `on-accent` on `accent` about
9:1. The tick and the changed label mean the state is never colour alone.

| Key (`content/home.ts → shownFor`) | Meaning | Limit |
|---|---|---|
| `shownFor.label` | The tag's prefix: says the examples under it are shown for someone; carries its own punctuation | 2 words / 12 characters |
| `shownFor.everyone` | The value with no pick: the examples are the general mix | 2 words / 12 characters |
| `shownFor.legend` | Screen-reader name of the list: choose who the examples are for | 5 words |
| `shownFor.announce` | Screen-reader only: said before the card's label after a change made in a tag | 5 words |

- **Tokens:** `line`, `muted`, `text`, `band`, `accent`, `on-accent`; `font-mono`, `font-body`;
  `text-nav`, `text-body`; `rounded-full`. No new token.
- **Motion (built 2026-10-04, `hooks/useShownForMotion.ts`):** on open the list (`pick-tag-list`)
  fades 0 → 1 over 0.2s (`power2.out`), opacity only, in both modes; it stays in the flow at its
  full height (no height tween). Closing is the native instant close. The chevron turns 180° over
  0.2s on open and back on close; under reduced motion it just switches. The markup above was
  enough; it never moves focus and never changes `open`.
- **Images:** none (the emblem is the inline `AboutPropGlyph`).

### 0.7 Sharing image (`app/opengraph-image.tsx`; new 2026-10-09, built 2026-10-09, not deployed)

The site-wide preview, redrawn to pair with `/rix`'s (`docs/pages/rix/ui-spec.md` §0.5): the same
frame, floor line and Rix, but it leads with the name, and Rix reports a finished job in a speech
bubble. `/rix`'s image is unchanged. It stays the default preview for every route without its own.

- **Format:** 1200×630 PNG, `ImageResponse` from `next/og`; `size` and `contentType` as now.
  Colours are `lib/tokens.ts` names only (the image can't read CSS, so no Tailwind classes).
  `alt` is `meta.ogAlt`, replacing `siteName`. Background `colors.bg`; 80px clear on every side.
- **Faces:** the wordmark and the name are Acosta 400 (`assets/fonts/acosta.otf`, as now). The role
  line, the bubble and the address are body text: **IBM Plex Sans 400** (choice 45), from
  `assets/fonts/ibm-plex-sans-latin-400.woff`, read from disk like Acosta, as a second font
  (Satori reads WOFF but not WOFF2, so the site's `ibm-plex-sans-latin-700.woff2` can't stand in;
  `ibm-plex-sans-OFL.txt` covers it). Acosta has no punctuation, so none of the three would
  render in it.

| Part | Top-left (x, y) and box | Type | Colour (`tokens.colors`) | Source |
|---|---|---|---|---|
| Wordmark | 80, 80; ≈ 194×36 | Acosta 36px, line height 1 | `text`, M and W in `accent` (as the footer, §9.1; the user's call, 2026-10-09) | `footer.wordmark`, drawn by `components/og/OgWordmark.tsx` (shared with `/rix`; letters from `lib/wordmarkLetters.ts`) |
| Name, line 1 | 80, 168; ≈ 580×72 measured (x 80–660) | Acosta 72px, uppercase (as the hero), line height 1 | `accent` (as the hero name) | `hero.firstName` |
| Name, line 2 | 80, 240; ends at ≈ x 455 measured (≈ 375 wide) | same | `accent` | `hero.lastName` |
| Bubble | right edge at x 844, top 268; hugs its text, at most 288 wide (x 556–844), ≈ 52 tall | Plex Sans 400, 18px, line height 1.3, one line | fill `accent`; text and tick `onAccent` | `meta.ogBubble`, drawn by `components/og/OgDoneBubble.tsx` |
| Role line | 80, 360; 540 wide, at most 2 lines (≈ 78 tall) | Plex Sans 400, 30px, line height 1.3 | `text` | `meta.ogLine` |
| Floor line | x 80–1120 at y 500, 2px | none | `line` | none |
| Rix | 620, 280; box 340×220 (1 unit = 2px), feet on the floor | `RixOgFigure` | its own (`accent`, eyes `bg`) | none |
| Address | 80, 522; 28 tall | Plex Sans 400, 28px, line height 1 | `muted` | `new URL(siteUrl).host` (`marwix.dev`) |

- **Widths (measured on the render, 2026-10-09):** Acosta's capitals run wider than the 0.9em
  estimate: MUHAMMAD spans x 80–660 and WAQAS ends at about x 455. Line 1 sits above the bubble
  and line 2 ends at least 100 left of it; the role line stays inside x 80–620.
- **The bubble (choice 49):** the agent's chat bubble from the Agents demos (`ChatDemo`:
  `rounded-xl rounded-br-sm bg-accent px-4.5 py-3.5 text-on-accent`): radius 12 with the
  bottom-right corner 4, padding 14 top and bottom, 18 left and right, `accent` fill. It opens with
  the done tick of `DemoStatusPill` (`checkPath` from `components/icons/CheckIcon.tsx`, on a 24
  viewBox, drawn at 18px, stroke `onAccent` width 2, round caps and joins), a 10 gap, then the
  text. It sits over Rix's head: its bottom edge (y 320) is 12px above the head's left peak
  (x 736, y 332) and 16 above the right one (x 828, y 336), and its right edge is 28 left of the
  heart (x 872), so its small bottom-right corner points down at him. Clear of the name's first
  line by 28, of the second by at least 100 and of the role line by 40, all inside the square
  zone. Moved from a right edge at x 744 after the lead's screen check (2026-10-09): there it read
  as a label beside the name, not Rix speaking.
  **Satori:** `OgDoneBubble` is one absolutely placed `div` (`display: flex`, `alignItems:
  center`, background colour, per-corner radii), one inline `<svg>` with that single `<path>`, and
  the text in a `span` with `whiteSpace: nowrap`. No tail shape, shadow, filter or `tw`. It's a
  picture: nothing to hover, focus or tap.
- **Rix:** `RixOgFigure` as is (same idle host pose, heart part 1), at 2px a unit, the size he
  stands on `/rix` from `lg`. His drawn figure spans x 672–900, y 288–500; the role line's 540
  width keeps 52px clear of his left arm. Only that file's header comment changes, to name both
  images.
- **Not confused with `/rix`:** home leads with the name, violet capitals at 72px over two lines,
  plus a role line, and Rix speaks a done message; he is two thirds of `/rix`'s size and stands
  mid-right, with floor to spare on his right; the address has no path. `/rix` leads with "Play
  with Rix" in mixed case, Rix large at the right edge, silent.
- **Crops:** 1.91:1 (Facebook, LinkedIn, WhatsApp's large card) shows it all; X's 2:1 takes 15px
  off the top and bottom, inside the margin. A **square centre crop** (x 285–915; small WhatsApp,
  iMessage and Telegram thumbnails) keeps Rix on his floor and his bubble whole, and most of the
  name ("AMMAD", then "AS"); the wordmark, the role line's start and the address are cut.
  Accepted: at thumbnail size the text is unreadable and the platform prints the title beside it,
  so Rix and a done bubble are what identify the link. That is why Rix stands at x 620, not 1120.
- **Contrast:** `accent` on `bg` about 8.6:1, `onAccent` on `accent` about 9:1, `text` above
  16:1, `muted` about 6.9:1. The tick means the bubble's state isn't colour alone.
- **Motion:** none (a static PNG). **Images:** none beyond Rix's and the tick's inline SVG.
- **Files:** `app/opengraph-image.tsx` (rewritten), `components/og/OgWordmark.tsx` (new, also
  used by `app/rix/opengraph-image.tsx`, same output), `components/og/OgDoneBubble.tsx` (new),
  `components/icons/CheckIcon.tsx` (exports `checkPath`), `content/home.ts → meta` (three new
  keys, `description` rewritten), `assets/fonts/ibm-plex-sans-latin-400.woff` (new),
  `components/rix/RixOgFigure.tsx` (comment only). The page doc follows (constitution §1).

| Key (`content/home.ts → meta`) | Meaning | Limit |
|---|---|---|
| `meta.title` | Unchanged: the name and what the user offers | 60 characters |
| `meta.description` (rewritten) | Search and sharing line: names every audience (service businesses, online stores, Discord servers) plus websites and web apps, from the facts only, ending on the ask | 155 characters |
| `meta.ogLine` (new) | The image's role line under the name: what the user does, in one plain idea (the description carries the audiences) | Sizing: 2 lines in 540px at 30px, about 70 characters |
| `meta.ogBubble` (new) | Rix's done message: a job an agent just finished for a business, in the demos' sample style (such as a booking confirmed). The job is one the facts list; no names, numbers or prices | Sizing: one line in the bubble, about 24 characters |
| `meta.ogAlt` (new) | What the image shows: the MARWIX wordmark, the user's name, the role line's idea, and Rix, the violet MW mascot, standing on a line with a speech bubble saying a job is done | 125 characters |

The name has no new slot: it is `hero.firstName` and `hero.lastName` (choice 46).

---

## 10. Motion hooks, summary

Every `data-anim` element's static state is its final state. The GSAP pass uses `gsap.matchMedia()`.
Under `prefers-reduced-motion: reduce` (constitution §5) it keeps short opacity fades and turns off
anything that moves: an entrance that slides, rises or scales becomes a short opacity fade;
parallax, mouse drift, scale on scroll, hover lifts and indents, auto-advance, looping pulses and
typing effects are off, leaving the static final state. Two exceptions: the marquee keeps looping
(it pauses on hover in both modes), and the nav progress bar still tracks scroll position, set
directly with no scrub smoothing (1.5). Generic scroll reveal: `data-anim="reveal"`,
with an optional `data-anim-delay` (ms), from `y: 56, opacity: 0`; under reduce, from `opacity: 0` only.
**2026-10-03 (per-card redesign; the user's decision: build no new motion, keep what is there).**
Whatever built motion still works on the new structure keeps running, with only the small wiring
it needs; anything that works only with exactly four steps is left off, not rebuilt, until the
motion pass.
**2026-10-04 (the motion pass, built and checked).** What that round left off is built. The
bullets below give the state as built.
- **The pick (§0.5, §0.6):** the swap fades on one tween for every section (`lib/shownSet.ts`):
  0.15s out, linear, then 0.25s in, `power2.out`; opacity only, the same under reduced motion.
  The tag's list fades in over 0.2s and its chevron turns 180° (no turn under reduced motion).
- **About:** all of Rix's motion, unchanged. The four new emblems pop in with no flourish.
- **Agents (`useAgentsMotion`):** the entrance, the 6s auto-advance and progress line (the
  row count is read from the DOM, so four or five rows both work), the status dot, and the demo
  replays. **Built 2026-10-04:** below `lg` the stepper's bar fills on the same 6s tween as the
  hidden row's line, and its title and line fade in over 0.25s on a selection change (§4.2a);
  the `orchestra` demo runs its token down the swimlanes and through the fix (4.80s, §4.4); the
  checklist has its own sequence (2.75s); chat shows typing dots before every agent line; the
  pointer panel pops (0.84s). **Built 2026-10-05 (the user's decision):** the demo replays are
  paced at random: each work step draws its time from a range, and the time it takes is deducted
  from the demo's longest time before the rest passes on (`lib/demoBudget.ts`), so the 4.80s and
  2.75s above are now 5s and 3.4s at most, while the pointer panel and reduced motion are
  unchanged (§4.7, Pacing). **Built 2026-10-05, later (the user's decision):** on a fine pointer
  the Report demo's hovered bar fades to `accent` and stretches up a little (`scaleY` to 1.08,
  0.25s), with the fill's fade only under reduced motion and nothing on touch (§4.4). Wiring and
  the layer table: `ui-spec/04-agents.md` §4.7.
- **Process (`useScrollReveal`, `useProcessBots`):** the bots' own layers: life, blinks,
  looks, taps, timed role acts, naps, pointer follow, the hover or tap jump, the drop-in and the
  reduced-motion fade. **Built 2026-10-04:** the crew relay is on (`RELAY_ON = true`), rebuilt for
  the flows' five or six stops at every width (the job from step 1's hand, ghosts, lit lines,
  chevron and return-arrowhead pulses, the lesson back to step 2, the catches); on every second
  run of a flow with loops the job hops back over the fix arch, lighting `process-fix-lit`; the
  roles `intake`, `flag`, `remind`, `ship` and `host` have their own acts. Runs are paced by
  their rest, not by a fixed clock: the next starts `RELAY_REST = 2`s after the last ends. The
  Discord flow carries `data-loops="off"` on `process-flow` and has no `process-return*` or
  `process-fix*` hooks at all, so nothing there is ever lit and its run is a one-way pass
  (`ui-spec/05-process.md` §5.3b). ~~**Built 2026-10-05:** below `lg` the bot column has a track
  (`process-track`) and the job rides it, with its lit segment (`process-track-lit`).~~
  **Superseded 2026-10-05, later:** the track is removed (its spec is
  `ui-spec/05-process-track-legacy.md`) and its motion code (`ontoTrack`, `COLUMN_JOB_GLIDE`,
  `litDrop`) is deleted. **Built 2026-10-05 (the ledge pass, `lib/processRelayLedge.ts`; checked
  by the lead at 360 and 768):** below `lg` the job drops out of step 1's hand onto ledge 1 and
  hops ledge to ledge in small thrown arcs (a 6px lift, `LEDGE_HOP.lift`); each ledge's
  `process-ledge-lit` fades in over 0.15s as the job lands, holds while its bot works the job
  and fades over 0.35s as it hops off (ledge 1 only flashes on the hand-off); on the last ledge
  the job pops and fades, that ledge's light with it. **Built 2026-10-05 (the fix line route,
  the user's request, `lib/processRelayFixLine.ts`):** on a fix run below `lg` the job no longer
  rises straight from ledge 4 to ledge 3; it goes back along the dotted fix line, from bot 4's
  hand round both turns and through the arrowhead into bot 3's hand, then drops onto ledge 3,
  in `FIX_LINE_HOP` (1.1s, `power1.inOut`). `process-fix-line-lit` lights behind it from the
  line's bottom end up, by `clip-path`, holds while step 3 redoes its act and fades over 0.6s as
  the job hops forward. A fix run is +5.5s below `lg` (+5.2s from `lg`, where the arch hop's
  `FIX_HOP` stays 0.8s). Static hooks `process-ledge`, `process-fix-line` and `process-fix-row`
  are read, never written; nothing hops or lights under reduced motion, and from `lg` none of
  these parts is on screen (`ui-spec/05-process.md` §5.3a, §5.9). Wiring, run lengths and the
  layer table: `ui-spec/05-process.md` §5.7.
- **Projects, the takeover's parts (2026-10-05; static, nothing new built):** the built open,
  close and Next motion needs no change, because every part is a sibling of the takeover's
  heading and so rises and fades with it. Later: as the reader scrolls the dialog (the dialog is
  the scroller, not the page), a part's head (`takeover-part-head`: the eyebrow and headline),
  then its body and wide slot fade up; took items and, from 2026-10-05 later, the What I learned
  lessons fade up in turn (`takeover-item`, scoped by the part's `data-part`); shots settle
  inside their frames (`takeover-shot`); the showcase diagram lights its three steps in order and
  then wipes in its return line (`showcase-diagram`, `showcase-step`, `showcase-step-text`,
  `showcase-return`, `showcase-return-loop`). Under reduced
  motion all of it only fades. The closing line (`takeover-means-line`) takes the pick's swap
  fade and nothing else. Hooks and the per-part notes: `ui-spec/07-proofs.md` §7.7.
- **Still not built:** the new emblems' flourishes (About); the takeover's part reveals
  (Projects; the showcase diagram's sequence is built, 2026-10-10). (Process' ledge and phone fix line lights are built,
  2026-10-05.)

The Process paragraph below describes the four-step build. Its bot layers are
`ui-spec/05-process-motion.md`; its relay is `ui-spec/05-process-relay-legacy.md`. Its relay
clock and run lengths are superseded by the 2026-10-04 rebuild (`ui-spec/05-process.md` §5.7).
Process bots (§5.6–5.7, `data-anim="process-bot"`, hooks `data-bot="…"`; revised 2026-09-27 and
2026-09-28): one rig per bot with separate feet, in fully smooth GSAP motion (tweens, easing, squash
and stretch, rotation; transforms, `opacity` and `attr` only), numbers in `lib/processBotMotion.ts`.
Life layer (breathing from the feet tops, sway, arm drift), blinks, look-arounds, foot taps, role
acts every 5–10s, naps (rules and update), eyes and lean following a fine pointer, a hover/tap jump
(the only jump), a once-per-load drop-in entrance on `process-list` (skipped if already passed), and
a crew relay ~~every 16.4s~~ (**since 2026-10-04** the next run starts `RELAY_REST = 2`s after the
last one ends) at every width: along the ground line from `lg`, down the bot column below
`lg` (§5.9). From `lg` (**revised 2026-09-28, final numbers from the lead's screen check**): a 24px
cream job block (`process-relay`, parts `data-job="…"`) passed bot to bot along the
ground line, on the right of every bot (bots 1 and 4 included), above the bots and below the loop
label (`lg:z-10`, which hides it fully while it passes behind it), each bot changing it on a beat of
its full act (written, stamped, built, checked, folded at the corner) and watching it on that side
while it waits, stopping 2s at each stop (too little of that left over for the hold bob or a watch
blink, so neither plays); a ghost trail (`process-relay-ghost`) and a lit ground segment
(`process-ground-lit`) follow each hop, with `process-chevron` icons flashing `cream`. After bot 4's
change the job is complete: it slides right along the ground line to its end, pops once as done and
fades out there (no separate spark, and never past the line, so never a sideways scroll). At the same
moment a small 14px cream lesson card (`process-lesson`, parts `data-lesson="…"`) splits off the
job's centre, fades out hidden leaving bot 4 (never crossing step 4's text), drops in at the return
path's start and rides it alone — no ghosts — lighting it (`process-return-lit`) as it goes, back to
bot 1. A run (return included) lasts about 13.7s at `lg`, 14.4s at 1440 and 14.7s at 4K, about 1.7–2.7s
clear before the next run. **Below `lg` (revised 2026-09-28, the user's choice, §5.9):** the same
run turned vertical, on the same clock and beats, replacing the 9s catch cascade. The layer drops
`hidden lg:block`, the job and ghosts draw at 16px and the lesson at 10px. The job drops straight
down the bot column, sitting on each bot's right at its feet, and passes only the next bot's hand
and tool, trailed by the ghosts (no lit line, no chevrons). After bot 4 it drops to just above the
return row, pops and fades. ~~The lesson splits off, hides as it leaves bot 4, and rises in at the
return row's icon (the first child of `process-return-row`, which flashes `cream`).~~ **Superseded
2026-09-28 (user's decision):** the lesson appears directly in bot 4's rulebook hand (screen left)
as the job leaves, bot 4 looks at it briefly (~0.6s), then it lifts off and rides straight up. The
return icon no longer flashes. It then rides the
column's left edge up to bot 1's clipboard, where bot 1 takes it back. A phone run lasts about
12.9–13.2s, and nothing ever passes over text. Each caught bot plays its
full role act with its feet planted. All pause off screen and when the tab is hidden (`watchLive`);
teardown restores the server markup exactly. Under reduce: no movement at all; the entrance is an
opacity fade only, each bot shows its static pose, and the job, lesson, trail and lit lines never
show, at any width.
**Supersedes** the 2026-09-26 stop-motion rule (one 125ms tick, 8fps, stepped, no tweens, easing or
rotation), the 2026-09-27 relay dot, the 2026-09-28 filed-into-the-rulebook/cream-spark version of
the relay job, the 2026-09-28 20s/3s-dwell/left-of-the-bots numbers, and the 2026-09-28 16s/job-rides-
the-return version (each superseded the same day, the last by the lead's screen check), and the
below-`lg` 9s catch cascade (2026-09-28, the phone relay, §5.9).
**About (§2a.7, new 2026-10-01, not built):** the intro and the chat panel use `reveal` (panel
+150ms). The mascot is a `ProcessBot` with `data-role="host"` (the same `process-bot` and
`data-bot` hooks), run by `hooks/useAboutBot.ts` on the About root with the Process rig, life,
acts and pointer modules: a once-per-load drop onto the panel's top edge, then life, blinks, looks,
pointer follow and the hover/tap jump; no naps; its act is a wave (`arm-right`), played as the
prompt appears and on each pick. `about-typing` (the shared `TypingBubble`) shows before the
prompt (`about-prompt`) and before each ack; `about-chip`s fade up staggered; on a pick the
`about-pair`'s `about-echo` then `about-ack` pop in. `about-status-dot` loops its opacity. All
pause off screen and in a hidden tab. Under reduce: no mascot movement (static pose, fades in with
the panel), no typing step, no pulse; bubbles and chips only fade.

## Tokens

- **Approved 2026-09-24:** `--spacing-gutter: clamp(20px, 4vw, 56px)` and
  `--spacing-section: clamp(80px, 12vw, 160px)`. Both are in `app/globals.css` `@theme` and the
  `docs/01-design-system.md` change log.
- **To request:** none. (About, §2a, uses existing tokens only. The 2026-10-03 redesign of About,
  Agents and Process also uses existing tokens only, as do decisions A and B. **2026-10-04:** the
  swimlanes use `band`, `line` (and `line/40` for the shaded lane), `muted`, `text`, `accent`,
  `on-accent`; the stepper uses `band`, `line`, `muted`, `text`, `accent`; `font-mono`,
  `font-display`, `font-body`; `text-meta`, `text-summary`, `text-body`. No new token. The
  Discord flow without loops only removes parts; it adds no token. **2026-10-05:** the takeover's
  parts and the spam diagram use `cream`, `ink` (and `ink/15`), `cream-muted`, `accent`,
  `on-accent`, and `text` and `muted` on the closing ink panel; `font-display`, `font-body`,
  `font-mono`; `text-card`, `text-step`, `text-summary`, `text-lead`, `text-body-lg`, `text-body`,
  `text-meta`. No new token. **2026-10-05, later:** Process' ledges and phone fix line use `line`
  and `accent` (with a `/0` gradient stop) and the `rounded-l-2xl` radius. No new token.
  **2026-10-05, later still:** the takeover's What I learned part uses `ink`, `ink/15`,
  `cream-muted`, `font-display`, `font-body`, `font-mono`, `text-step`, `text-summary`,
  `text-body-lg` and `text-meta`. No new token. **2026-10-09:** the sharing image (§0.7) uses
  `lib/tokens.ts` `bg`, `text`, `muted`, `line`, `accent` and `onAccent` (the bubble's text and
  tick), the chat bubble's radii (12, with one 4 corner), and the design system's display
  (Acosta) and body (IBM Plex Sans) families. No new token.)

## Choices

**Decided by the user, 2026-10-03 (the per-card redesign).** The section file in brackets holds
the detail.

1. **The Software builder card's label — decided:** "Developer or team". The key stays
   `software-builder`. "Developer" is 9 characters, inside the word limit. (§2a.R)
2. **`?for=` against the memory — decided:** the link wins the first time that link value is seen
   in a visit; after that the visitor's own pick is remembered. (§0.5)
3. **The ack — decided:** two parts. The card's ack, plus one shared "set for you" line
   (`about.ackSet`) hidden without JavaScript. (§2a.R)
4. **Emblems — decided:** four new ones (parcel, speech bubble, code, browser window), in the
   bots' style. (§2a.R)
5. **The tag's list — decided:** it opens in the flow and pushes content down; no overlay. (§0.6)
6. **The tag without JavaScript — decided:** hidden. (§0.6)
7. **Demo kinds — decided:** a fifth kind, `checklist`, is added: four lines whose boxes turn to
   ticks. The software-builder "build" and "rescue" rows use it. ~~"workflow" stays on `sync`~~:
   **superseded by 18.** (§4.4, §4.8)
8. **`ChatDemo` — decided:** it takes an ordered list of messages, so the reminder demo opens with
   the agent. (§4.4)
9. **The website card's last panel — decided:** it previews section 03's four step titles and
   links to it. (§4.4)
10. **Six bots across at 1024 — decided:** a 16px gap up to `xl` (144px columns, 136px bots), and
    no step-title word over 9 characters. (§5.1)
11. **The return loop — decided:** it lands on step 2, "your rules". It stays, alongside the fix
    loop (19). Not on Discord since 2026-10-04 (29). (§5.3)
12. **Bot roles — decided:** `intake`, `flag`, `remind` and `ship` are added; ~~`update` is in no
    flow and its drawing stays in code~~ (since 2026-10-04 `update` is Discord's step 3, 29);
    `team` does every "done" step. (§5.6, §5.10)
13. **Motion this round — decided:** "don't build new for now, keep whatever is there already".
    Built motion that works on the new structure keeps running; the four-step relay is off until
    the motion pass. **2026-10-04: the motion pass is built;** the relay runs again, on the
    flows' five or six stops. (§10, §4.7, §5.7)
14. **The sample-job caption under Process' tag — decided:** in. (§5.1)
15. **Step 1's bot holds the job on the static page — decided:** yes: the card's emblem, or the
    plain job sheet by default. (§5.10)
16. **Vendor names in demo samples — decided:** allowed. Constitution §7.4 now exempts sample
    content inside a demo panel that names an everyday product ("instagram DM", "Sheets"). (§4.6)
17. **"Second check" — settled by the facts:** `docs/03-facts.md` now says "A separate agent
    checks the work before it goes out", so the step needs no special wording. (§5.10)
18. **The workflow demo (decision A, 2026-10-03) — decided:** a sixth kind, `orchestra`, replaces
    `sync` on `default` row 4 and `software-builder` row 1: a lead, a team and the checkers, the
    fix loop and an "all checks passed" pill; plain role words, no names or counts. Its drawing:
    ~~one tree~~, then ~~a numbered loop~~ (2026-10-03), **now swimlanes (27, 2026-10-04)**.
    (§4.4–4.9)
19. **The fix loop (decision B, 2026-10-03) — decided:** every flow gets a second return, step 4
    → step 3, with its own label slot (`fixLabel`) naming the rule break; the bottom return and its
    label's meaning stay. Not on Discord since 2026-10-04 (29). (§5.3a)

**Decided by the user, 2026-10-04 (Agents):**

27. **The orchestra is swimlanes:** Lead, the team and the checks side by side, the middle lane
    shaded, one rounded outline, eight rows joined by L-shaped connectors, the fix row dashed
    accent, the done pill centred; the lane's title inside every card at every width, no header
    row; the team's roles in the first team card. Both demos; content keys unchanged. (§4.4, §4.9 15–16)
28. **Agents below `lg`: a stepper on the panel** (‹ / ›, counter, title, bars, the offer's line)
    in place of the vertical tab list, which hides below `lg`. Replaces "list first, then the
    panel below" (2026-09-24). From `lg` nothing changes. (§4.2a, §4.9 17)

**Decided by the user, 2026-10-04 (Process):**

29. **The Discord flow has no validation and no loops:** no "Second check" step, no fix loop and
    no bottom return. Five steps, in this order: Mentioned, Your tone, Remembers, Connected,
    Always on. Which flows have loops is data (`lib/processFlows.ts → hasLoops`, with
    `process.flows.discord` carrying no `loopLabel` or `fixLabel`); the other five flows keep
    their check and both loops. (§5.3b, §5.8 38, §5.10)

**Decided by the user, 2026-10-05 (all three built and checked the same day):**

30. **Process: a track down the bot column below `lg`.** A thin `line` rail the job rides, with
    a lit segment that follows the job on every hop, the fix rise and the exit drop. From `lg`
    the ground line is unchanged. This closes the 2026-09-28 open item on whether the column
    gets a track (below). Three calls from its build are open for the user (below).
    (§5.9, §5.8 44–52) **Superseded 2026-10-05, later, by 36;** its three open calls are closed.
31. **Agents: Discord's "Welcome and roles" is a checklist.** One new member at the top, four
    steps that tick off in order, then a "role given" pill; `ChecklistDemo` as built, no new
    component. (§4.4, §4.8, §4.9 27)
32. **Agents: Discord's "Moderation" ends each row its own way.** It stays `leads`, with an
    optional done label per row over the shared `statusDone`: a timeout, a warning, a report to
    the server's mods. (§4.4, §4.6, §4.9 28–31)

**Decided by the user, 2026-10-05, later (Agents' pacing; built the same day):**

33. **Agents: the demo replays are paced at random.** The user: "all animations are linear make
    them dynamic by randomized duration, deduct the time each step took from the max duration
    before passing on to the next one"; asked where, the Agents demos only. Each work step draws
    its time from a range, deducted from the demo's longest time before the rest passes on; the
    pointer panel and reduced motion are unchanged. Three calls from its build are open for
    review, built with the first option of each: the orchestra's spread, the token's ride speed,
    and `report` and `sync` running longer on average. (§4.7 Pacing, §4.4, §4.9 32–35)

**Decided by the user, 2026-10-05, later still (Agents, the Report bars' hover; built the same day):**

34. **Agents: the Report demo's bars light up and grow under the pointer.** The user: "add hover
    effect on each bar from bar charts"; of three options, "Light up and grow": the hovered bar
    turns violet and stretches up a little, eases back on leave, no text added, colour only
    under reduced motion, nothing on touch screens. Two calls from its build are open for
    review, built with the first option of each: the latest bar showing no hover under reduced
    motion, and the tallest bar's cap at the chart's top. (§4.4, §4.7, §4.9 36–38)

**Decided by the user, 2026-10-05 (Projects, the takeover; static, not built yet):**

35. **A project's takeover is several short parts, not one summary.** The same order on every
    project: what it is, the problem, what I built, what it took and a showcase (both only where
    the project has the facts), and what this means for you, ending on Book a call. Parts 2 to 6
    each have a small mono label, the same on every project, over a headline written for that
    project in the display face; the headline is the part's heading. The closing line follows
    the pick and is part 6's headline. Exile Bot's showcase is drawn as three numbered steps and
    a dashed way back. The eleven choices raised with it are all decided, with none left open:
    `ui-spec/07-proofs.md` §7.8. (§7.3–§7.8, §0.5) **Extended by 37:** the showcase is now part
    6 and the closing panel part 7.

**Decided by the user, 2026-10-05, later (Process, final; static, not built yet):**

36. **Process: ledges replace the phone track, and the phone fix loop is a dotted line.** Below
    `lg`, under every bot, a short 2px `line` ledge it stands on, a piece of the ground line cut
    to the bot's width; the job will hop ledge to ledge, each ledge lighting violet as it lands.
    The fix loop's ↰ icon goes for a dotted `accent` line down the bot column's left side, from
    bot 4 up to bot 3 and never below bot 4, with the same label beside it; no copy change. From
    `lg` nothing changes. Supersedes 30. Seven layout calls made in the spec are open for the
    lead's review: `ui-spec/05-process.md` §5.8 55–61. (§5.3a, §5.9, §5.8 53–54) **Built
    2026-10-05,** static, then the ledge motion; four calls from the motion's build are open
    for the user (below; §5.8 62–65). The fix run's way back: 38.

**Decided by the user, 2026-10-05, later still (Projects, the takeover; static, not built yet):**

37. **An optional takeover part, What I learned.** Its own part with the same mono label
    (`partLabels.whatILearned`) and own headline, right after What it took and before the
    showcase and the closing panel. Exile Bot has it, three lessons from the facts, each said as
    how the user works now; Design Vault skips it for now. Exile has seven parts, Design Vault
    four. Settled in the spec at the lead's request, none open: the took item is reused (renamed
    `TakeoverItem`) and told apart by ordinals 01–03 and one column on the 576 measure; 48 hours
    and 700+ stay in the lines' text, not emphasised; the part is drawn compact on phones (about
    620px at 360). (`ui-spec/07-proofs.md` §7.3.1, §7.5, §7.8 16–19)

**Decided by the user, 2026-10-05 (Process, the fix line route; built, checked by the lead at 360
and 768):**

38. **Process: below `lg` the fix run's job goes back along the dotted fix line.** The user: "the
    object should go back from the dotted route instead of a step back". The job leaves ledge 4,
    rides the dotted line from bot 4's hand round both turns and through the arrowhead into bot
    3's hand, then drops onto ledge 3; the line lights behind it. `FIX_LINE_HOP` 1.1s
    (`lib/processRelayFixLine.ts`); a fix run below `lg` is +5.5s (was +5.2s). It replaces the
    straight rise from ledge 4 to ledge 3, kept only as the fallback with no fix line. From `lg`
    the arch hop is unchanged. Two calls from its build are open for the user (below; §5.8
    67–68). (§5.3a, §5.9, §5.8 66)

**Decided by the user, 2026-10-09 (the sharing image, §0.7; built 2026-10-09, not deployed):**

44. **The home sharing image pairs with `/rix`'s.** It shows the MARWIX wordmark (M and W in the
    accent, as the footer; the user's call later the same day), the user's name, a short line
    about what they do, `marwix.dev`, and Rix standing on a floor line at the side. Only the home
    image changes; `/rix`'s stays as it is. The home `meta.description` is rewritten to name every
    audience; the title is unchanged.

**Decided by the lead, 2026-10-09 (the sharing image, §0.7; the user delegated: "be creative,
decide for me"):**

45. **The role line's, the bubble's and the address's face:** IBM Plex Sans 400, from a new
    `assets/fonts/ibm-plex-sans-latin-400.woff` (the body face, as lead lines are on the page;
    takes punctuation and the dot in `marwix.dev`). Rejected: Acosta only (no new file, but no
    punctuation, about 40 characters over two lines, no glyph for the address's dot).
46. **The name's source:** `hero.firstName` and `hero.lastName` (the page's own name, already two
    lines, as the `<h1>`). Rejected: `footer.copyrightName` (one string, the copyright line's
    slot). No new slot either way.
47. **Rix's place:** mid-right at x 620–960 and smaller than on `/rix`, so his whole figure (and
    his bubble, 49) survives a square thumbnail. Rejected: the right edge like `/rix`, which cuts
    him in half in a square crop.
48. **The name's colour:** `accent`, as the hero name, which sets it apart from `/rix`'s `text`
    heading. Rejected: `text`.
49. **The lead's addition: Rix speaks a done message.** A small speech bubble over his head, left
    of the heart, drawn as the Agents demos' agent chat bubble (`accent` fill, `onAccent` text,
    one small corner toward him) with the done pill's tick, carrying one short sample job
    finished for a business (`meta.ogBubble`). It ties the image to what the user sells and
    survives the square crop. To make room in the square zone, the name drops from 80 to 72px;
    Rix's box is unchanged. **2026-10-09, after the lead's screen check:** its right edge moved
    from x 744 to x 844; at 744 it read as a label beside the name, not Rix speaking.

**Settled or superseded (decisions A and B, 2026-10-03):**

20. ~~The orchestra's fix loop~~ — superseded (now the dashed accent row 6 and its links). (§4.9, 9)
21. ~~The orchestra's team size~~ — settled: three roles. (§4.9, 10)
22. **The orchestra this round — settled:** still, showing finished, until the motion pass (the
    2026-10-04 brief). **Built 2026-10-04:** it replays its token run (§4.4). (§4.9, 11)
23. **The Process fix label from `lg` (open for the user):** above the arch, with the caption →
    steps gap growing from 48 to 96px (recommended), or on the arch's top edge with no extra gap.
    (§5.8, 37)
24. ~~The orchestra on phones~~, 25. ~~where the team report is drawn~~, 26. ~~the fix path in the
    ring~~ — **superseded by 27**: one swimlane form at every width.

**Decided by the lead, 2026-10-04 (Agents, were open; detail in `ui-spec/04-agents.md` §4.9 23–26):**

- **Panel height per tab — decided (the user's choice):** it changes; each panel is as tall as its demo, with no holding to the tallest.
- **The step badge below `sm` — decided:** on the card's top-left edge, as specced.
- **1024 — decided:** the 124px lanes are accepted as they are.
- **Lead cards — decided:** accent border plus accent title, as in the mock.

**About, §2a: answered by the user 2026-10-01 (decided unless marked open):**

1. **Placement — decided:** right after the Hero, before the Marquee (as recommended).
2. **Section number — decided:** About stays **unnumbered** (the user's choice; the recommendation
   was "01"). No `about.number` slot; Agents–Contact keep 01–05; the label shows without a number
   (`SectionLabel`'s `number` is optional, §0.4).
3. **What a pick does — decided, B:** the acknowledgement, plus every existing WhatsApp link (the
   Contact row, the footer) carrying that group's default message (`whatsappText`); no new button.
   **Extended 2026-10-03:** a pick also sets Agents' offers and Process' flow (§0.5).
   **Extended 2026-10-05:** and the closing line of each project's takeover (§0.5).
4. **No-JS path — decided:** native radios with CSS `:has` showing the reply.
5. **Intro shape — decided:** a display heading plus 1–2 lead lines.
6. **One question — decided:** the skim question is "Can he help someone like me?"; the "who I
   am" lines are its set-up.
7. **Reader (constitution §3) — decided 2026-10-03:** the user rewrote §3 as five audiences.
8. **Nav link — decided:** none for About.
9. **`?for=` — decided:** applied in the browser after load; the page stays static, a pick doesn't
   rewrite the URL and isn't remembered across reloads. **Superseded in part 2026-10-03:** the
   pick is remembered for the visit, and `?for=` overrides the memory (§0.5).
10. **Redesign — decided 2026-10-01:** About is no longer a chat. Three options (A Stage, B Poster
    board, C Fill in the blank) are built on `/dev`, and the user picks one there after the build.
    - **Reduced motion:** one nudge, a single fade-in line.
    - **Nudges stop** after 4, or on any pick.
    - **The group props** are samples until the real groups come in.
    - **`/dev`** runs under `next dev` only and 404s in every build.
    - **The lead's defaults** stand.
    - **`about.chat.title`** stays until the old build is removed.

    See [`ui-spec/02a-about-options.md`](ui-spec/02a-about-options.md) §2a.O7.

**Open for the lead:** Proof cards at `md` go two across, with MARWIX-SKILLS alone on row two at
the same width, left-aligned, so all three stay identical. The alternatives were one column
until `lg` (each card about 600px tall at 768) or stretching the third card across both columns
(which would make it different from the other two).

**Open for the lead (2026-10-04, Process, the Discord flow; `ui-spec/05-process.md` §5.8 39–43,
specced with the first option of each):** step 5's bot (`host` or `remind`); step 4's bot (`ship`
or a new `link` role); step 3's bot (`update` with its wrench, or a new book-only role); naps on
an "always on" flow (as built, or skipped under `data-loops="off"`); the list's end below `lg`
(no closing hairline, or one).

**Open for the lead (2026-10-05, later, Process, the ledges and the phone fix line;
`ui-spec/05-process.md` §5.8 55–61, specced with the first option of each):** the ledge's length
(to the column's right edge, under the job, or to the right foot as sketched); its light (the
ground-lit gradient, or solid); the fix line's form (a bracket with an arrowhead onto bot 3, or a
plain line); dotted below `lg` against the arch's dashes; step 4's hairline over the line; each
row `relative`; `ProcessLedge.tsx` as its own file.

**Answered (2026-10-03, Agents panel heights):** the 10:9 minimum at 1024 leaves a body of about
375×277, so the checklist demo (≈ 350) grows the panel there. **2026-10-04:** answered by the
lead's panel-height decision above: each panel is as tall as its demo.

**Open for the user (2026-09-28, phone relay, §5.8 choice 27):** the job's size and seat on
phones (16px on each bot's right, recommended). ~~Whether the column gets a track (none,
recommended).~~ **Closed 2026-10-05:** the user chose a track, and it is built (Choices 30;
`ui-spec/05-process.md` §5.9). **2026-10-05, later:** the track is superseded by ledges
(Choices 36).

~~**Open for the user (2026-10-05, Process, the phone track; `ui-spec/05-process.md` §5.8 50–52,
built with the first option of each):** the job's corner meeting the flag pole's foot and, on
Discord's step 3, the wrench handle's low end (accept, shift the two tools, or let those stops
sit off the track); the hand-off's tolerance (accept up to about 3.2px off for about 0.05s, or
hold 3px); the lit segment's bright end on a drop (on the job's feet line, or on its centre).~~
**Closed 2026-10-05, later:** moot, the track is superseded (Choices 36).

**Open for the user (2026-10-05, Process, the ledge motion; `ui-spec/05-process.md` §5.8 62–65,
built with the first option of each):** the hop's lift (6px above the higher ledge, a small
throw, or none: a straight fall from ledge to ledge); ledge 1 on the hand-off (a quick flash, in
over 0.15s and out over 0.35s, or held as the other ledges are while their bot works the job);
ledge lights under reduced motion (none, or a short opacity fade with no hop and no loop); the
lesson over the fix line below `lg` (accept it riding over the line's ends and arrowhead for
about 0.45s while the line is unlit, or move it into the gutter, past the list's edge).

**Open for the user (2026-10-05, Process, the fix line route; `ui-spec/05-process.md` §5.8
67–68, built with the first option of each):** the job crossing in front of bots 4 and 3's legs
and feet on the short legs to and from the line, about 0.35s each (accept, or keep it off the
bots, which needs another way, such as passing behind them); the way back's length
(`FIX_LINE_HOP` 1.1s, a fix run +5.5s, or closer to `FIX_HOP`'s 0.8s as from `lg`, a fix run
nearer +5.2s).

**Accepted by the user, 2026-09-27:**

- Process bots move in fully smooth GSAP motion, with eyes following the pointer, a scroll-in
  entrance, a crew relay and a hover/tap reaction, and each bot gets separate feet (§5.6–5.8).
  The 2026-09-26 stop-motion rule is **superseded 2026-09-27**.

**Accepted by the user, 2026-09-24:**

1. Process ring from `xl` with a 4/8 split; the column below `xl`. **Superseded 2026-09-26** by the
   stacked canvas with mascots (§5).
2. Hero height capped at 1200px (confirmed).
3. Hero name at 360px: screen check; if MUHAMMAD clips, the fix is a 16px phone gutter or `wdth 75` on phone.
4. Nav solid state from a client observer; server markup starts transparent.
5. Agents variant A without JS falls back to B's list inside `<noscript>`.
6. Takeover: native `<dialog>` with `:target` as the no-JS path; Next replaces the hash.
7. Timeline uses native radio inputs; chips are `aria-pressed` buttons.
8. Textarea border `muted/70`.
9. Opacity modifiers on tokens for v3's in-between greys (`line/40`, `ink/15`, `muted/30`, `muted/60`).
10. Report title `text-summary`; Send brief `text-lead`.
11. Radii: 24px for panels and cards, 12px inside.
12. New tab for Visit, WhatsApp and the footer socials, with a hidden hint.
13. Static accents: the selected row's line full and sync packets at their midpoints, also under reduced motion. The progress bar is empty without JS; under reduced motion it still tracks scroll position, set directly with no smoothing (constitution §5, amended 2026-09-25).
14. Loop line 2px.
15. Section labels use a hairline instead of v3's em dash.
