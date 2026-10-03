# Home: UI spec

**Last Updated:** 2026-10-01
**Sources:** `docs/pages/home/page.md` (decisions 1–44, the source of truth), constitution §2–§9,
`docs/01-design-system.md`, `app/globals.css`, v3 reference (layout and behaviour only),
`docs/03-facts.md`, `docs/04-voice.md`.
**Scope:** the static, final-state page. Every animated element carries a **Motion (later)** line
and the markup hooks the GSAP pass needs. The spec never states page text; it names slots.
**Layout:** this file is the index. It holds the shared rules and parts (§0), the motion hooks
summary (§10), tokens and choices. Each section's spec is its own file under `ui-spec/`; load this
file plus the one section you work on. The § numbers stay as they were (for example §2.1.1).

## Sections

| § | Section | UI spec | Page doc |
|---|---|---|---|
| — | Rix character sheet: the mascot, defined once (new 2026-10-02; used first by §2a option B, later by Process) | [`ui-spec/00-rix.md`](ui-spec/00-rix.md) | [`sections/02a-about.md`](sections/02a-about.md) |
| 1 | Nav | [`ui-spec/01-nav.md`](ui-spec/01-nav.md) | [`sections/01-nav.md`](sections/01-nav.md) |
| 2 | Hero | [`ui-spec/02-hero.md`](ui-spec/02-hero.md) | [`sections/02-hero.md`](sections/02-hero.md) |
| 2a | About (new 2026-10-01; spec only, not built) | [`ui-spec/02a-about.md`](ui-spec/02a-about.md) | [`sections/02a-about.md`](sections/02a-about.md) |
| 2a | About redesign: options A, B, C on `/dev` (temporary, 2026-10-01; the winner folds into `02a-about.md`) | [`ui-spec/02a-about-options.md`](ui-spec/02a-about-options.md) | [`sections/02a-about.md`](sections/02a-about.md) |
| 3 | Marquee | [`ui-spec/03-marquee.md`](ui-spec/03-marquee.md) | [`sections/03-marquee.md`](sections/03-marquee.md) |
| 4 | Agents | [`ui-spec/04-agents.md`](ui-spec/04-agents.md) | [`sections/04-agents.md`](sections/04-agents.md) |
| 5 | Process | [`ui-spec/05-process.md`](ui-spec/05-process.md) | [`sections/05-process.md`](sections/05-process.md) |
| 6 | Web | [`ui-spec/06-web.md`](ui-spec/06-web.md) | [`sections/06-web.md`](sections/06-web.md) |
| 7 | Proofs | [`ui-spec/07-proofs.md`](ui-spec/07-proofs.md) | [`sections/07-proofs.md`](sections/07-proofs.md) |
| 8 | Contact | [`ui-spec/08-contact.md`](ui-spec/08-contact.md) | [`sections/08-contact.md`](sections/08-contact.md) |
| 9 | Footer | [`ui-spec/09-footer.md`](ui-spec/09-footer.md) | [`sections/09-footer.md`](sections/09-footer.md) |

---

## 0. Shared rules and parts

### 0.1 Page frame

- `app/layout.tsx`: `<SkipLink />`, `<SiteHeader />`, `<main id="main" tabIndex={-1}>`,
  `<SiteFooter />`. `app/page.tsx` renders, in order: Hero, Marquee, Agents, Process, Web, Proofs,
  Contact, then the three `<ProjectTakeover />` dialogs and `<TakeoverController />`.
  **About (§2a, decided 2026-10-01):** `<AboutSection />` goes right after Hero, before Marquee.
  Agents' frame is unchanged (still no `border-t`, under the marquee).
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
| `chip` (**new 2026-10-01**) | `inline-flex min-h-11 items-center gap-2 rounded-full border px-4.5 text-body` | the chip shape, no state classes: Contact's need chips (moved out of `NeedChips`) and About's reply chips (§2a), each adding its own state classes |

### 0.4 Shared components (all server unless marked)

| File | Job |
|---|---|
| `components/SkipLink.tsx` | "Skip to content" to `#main`: `sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-60` + `pillPrimary` when focused |
| `components/SectionLabel.tsx` | Number, a 24px hairline (`h-px w-6 bg-muted`, `aria-hidden`), label text, in `monoLabel`. Prop `as` (`h2` for Agents, `p` elsewhere). The hairline replaces v3's em dash (voice rule 10). **2026-10-01:** `number` is optional; without it (About, unnumbered) it renders the hairline, then the label |
| `components/SectionHeading.tsx` | `<h2>` = `lead` + `<span class="text-accent">accent</span>`. Size prop `heading-sm` / `heading` / `heading-xl`. Base: `font-display font-semibold text-balance text-text` + `condensed`; `heading-sm`/`heading`: `leading-[0.95] tracking-[-0.025em]`; `heading-xl`: `leading-[0.9] tracking-[-0.03em]` (loosened from −0.04/−0.045em by the user's choice, 2026-09-24: letters touched at desktop sizes) |
| `components/ExternalLink.tsx` | `<a target="_blank" rel="noopener noreferrer">` plus a `sr-only` suffix from `a11y.newTab` |
| `components/BookCallLink.tsx` | The one Book a call link (Cal.com, `links.bookCall`), built on `ExternalLink`, carrying `data-track="book-call"`: the single place clicks are counted (§11). Prop `variant`: `nav` (1.2) or `hero` (2.1). The Contact row (8.1) is built by the shared contact-row component, not a variant here |
| `components/SiteImage.tsx` | Every image: reads `lib/images.ts`, renders `next/image` with `fill`, `sizes`, `alt`, and an object-position prop. Renders `ImagePlaceholder` when the entry's file is `null` |
| `components/ImagePlaceholder.tsx` | Build-time stand-in: `grid size-full place-items-center border border-dashed` with a mono name label. On cream: `bg-ink/5 border-ink/20 text-cream-muted`; on dark: `bg-band border-line text-muted` |
| `components/icons/{Menu,Close,ArrowRight,ArrowUpRight,Check,ChevronUp,Asterisk}Icon.tsx` | One glyph each: inline SVG, `currentColor`, `aria-hidden="true"`, `focusable="false"` |
| `components/TypingBubble.tsx` (**new 2026-10-01**, §2a) | The three-dot typing bubble, moved out of `ChatDemo` so Agents and About share it: `hidden items-center gap-1.5 rounded-xl bg-line/40 px-4.5 py-4`, three `size-1.5 rounded-full bg-muted`, `aria-hidden`. Prop `side` (`start` adds `self-start rounded-tl-sm`, `end` adds `self-end rounded-br-sm`) and its `data-anim` value |
| `components/WhatsAppLink.tsx` (**new 2026-10-01**, client, §2a.2) | The WhatsApp link, built on `ExternalLink`: server markup uses `links.whatsapp`; after an About pick its `href` carries that group's `whatsappText` (`hooks/useAboutPick.ts`, `lib/whatsapp.ts`). Used by the Contact WhatsApp row and the footer socials; look unchanged |

- `lib/images.ts`: each name → `{ dark: string | null }`. A `null` file fails the ship check, like
  a `[FILL]` marker. Names are listed in each section's file.

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
Process bots (§5.6–5.7, `data-anim="process-bot"`, hooks `data-bot="…"`; revised 2026-09-27 and
2026-09-28): one rig per bot with separate feet, in fully smooth GSAP motion (tweens, easing, squash
and stretch, rotation; transforms, `opacity` and `attr` only), numbers in `lib/processBotMotion.ts`.
Life layer (breathing from the feet tops, sway, arm drift), blinks, look-arounds, foot taps, role
acts every 5–10s, naps (rules and update), eyes and lean following a fine pointer, a hover/tap jump
(the only jump), a once-per-load drop-in entrance on `process-list` (skipped if already passed), and
a crew relay every 16.4s at every width: along the ground line from `lg`, down the bot column below
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
- **To request:** none. (About, §2a, uses existing tokens only.)

## Choices

**About, §2a: answered by the user 2026-10-01 (decided unless marked open):**

1. **Placement — decided:** right after the Hero, before the Marquee (as recommended).
2. **Section number — decided:** About stays **unnumbered** (the user's choice; the recommendation
   was "01"). No `about.number` slot; Agents–Contact keep 01–05; the label shows without a number
   (`SectionLabel`'s `number` is optional, §0.4).
3. **What a pick does — decided, B:** the acknowledgement, plus every existing WhatsApp link (the
   Contact row, the footer) carrying that group's default message (`whatsappText`); no new button.
4. **No-JS path — decided:** native radios with CSS `:has` showing the reply.
5. **Intro shape — decided:** a display heading plus 1–2 lead lines.
6. **One question — decided:** the skim question is "Can he help someone like me?"; the "who I
   am" lines are its set-up.
7. **Reader (constitution §3) — open:** widening the reader beyond small-business owners needs the
   user's own amendment before the preview is built.
8. **Nav link — decided:** none for About.
9. **`?for=` — decided:** applied in the browser after load; the page stays static, a pick doesn't
   rewrite the URL and isn't remembered across reloads.
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

**Open for the user (2026-09-28, phone relay, §5.8 choice 27):** the job's size and seat on
phones (16px on each bot's right, recommended), and whether the column gets a track (none,
recommended).

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
