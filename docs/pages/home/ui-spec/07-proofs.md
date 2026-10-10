# §7 Proofs: UI spec

Shared rules and parts (§0): [`../ui-spec.md`](../ui-spec.md). Page doc: [`../sections/07-proofs.md`](../sections/07-proofs.md).

**Last Updated:** 2026-10-10 (MARWIX-SKILLS gets parts 4, 5 and 6 with Rix on the showcase
diagram: see [`07-proofs-spam.md`](07-proofs-spam.md), which wins where this file differs).
Before that, 2026-10-09 (MARWIX-SKILLS goes live with no screenshots and its card is shown
again: a project has no shots, two or three, and the grid is three across from `lg` again; §7.9,
§7.8 40–46. Before that, 2026-10-07: Design Vault's two shots: a project has two or three shots,
the two-shot layout stacks two 2:1 frames, light screenshots allowed. Before that, 2026-10-06: the
Exile takeover: three shots, new in-use numbers, Eva on the diagram's tiles; §7.2.1–§7.2.3 moved,
unchanged, to [`07-proofs-bot.md`](07-proofs-bot.md); later, the spam diagram redrawn as the ink
stage and moved to [`07-proofs-spam.md`](07-proofs-spam.md)).

## 7. Proofs (the one question: have they built something real that people use?)

Visible name "Projects"; code, file and content keys stay `proofs`. Card template revised
2026-09-28 (user's decisions in `temp/brief.md` and the brief of that date; visual reference
`temp/proof-card-samples.html`, variant A "Ink stage"). **The takeover's template was revised
2026-10-05** (the user's decision: several short parts replace the single summary; §7.3–§7.7,
static, not built yet). **Later that day the user added an optional part, What I learned**
(part 5, §7.3.1; static, not built yet): the parts after it renumber, so the showcase is now part
6 and the closing panel part 7. Cards, banner and bots are unchanged.

**2026-10-06 (the user's three decisions on the Exile takeover; source
`temp/project-images/brief.md`, with the shot subjects confirmed later that day; static, not
built yet).** (1) Exile shows three shots, not two, in the layout Design Vault uses (§7.3.1 part
3, §7.6). (2) Its in-use numbers become 18+ and 3.9K+, and the showcase's status carries no count
(§7.5). (3) The diagram's three tiles show Eva, Exile Bot's own mascot, and grow to 96 / 128px
(§7.3.2, §7.6.1). Nothing else in the section changes. The choices made in the spec are open for
review: §7.8 23–33.

**2026-10-07 (the user's decisions on Design Vault's shots; static, not built yet).** (1) A
project has two or three shots, not always three: three is the big 2:1 over two 4:3 details
(Exile keeps exactly this), two is two 2:1 frames stacked (§7.3.1 part 3). (2) Design Vault has
two, its Palettes and Fonts views, light-theme screenshots (§7.6). (3) Light screenshots are
allowed: a shot's pixels are image content, not the site's theme. MARWIX-SKILLS (hidden) keeps
three placeholder slots. Open for review: §7.8 38–39.

**2026-10-09 (the user's decision; static, not built yet).** (1) MARWIX-SKILLS goes live with no
screenshots: its takeover has no shots block at all, for this project only. Exile (three shots)
and Design Vault (two) stay exactly as they are. (2) Its card is shown again (`hiddenProofs` in
`lib/proofs.ts` is empty), so the grid is three cards again. Supersedes the 2026-10-07 line above
on MARWIX-SKILLS' placeholder slots. Spec: §7.9. Open for review: §7.8 42–46.

### 7.1 Section layout

- Section frame (`sectionIds.proofs`), plus `overflow-x-clip` on the `<section>`: a local
  guarantee against sideways scroll (the bot itself never reaches the viewport edge, see §7.2.1).
  Inner: `flex flex-col gap-12 md:gap-16`.
- Header: `flex flex-wrap items-end justify-between gap-6`: left `flex flex-col gap-7`
  (`SectionLabel`, `SectionHeading size="heading"`); right `<p class="{metaLabel}">` with `proofs.hint`.
- Grid: `<ul class="grid gap-x-12 gap-y-8 {proofGridColumns}">` (`lib/proofs.ts`), one
  `<li class="pt-[11.2%]">` per shown project, in the order Exile, Design Vault, MARWIX-SKILLS.
  **Since 2026-10-09 all three are shown,** so `proofGridColumns` gives `md:grid-cols-2 lg:grid-cols-3`.
  **The three cards are identical.** Phone: stacked. `md` up to `lg`: two across, MARWIX-SKILLS
  alone on row two at the same width, left-aligned. `lg` and up: three across. (With only two
  shown, `proofGridColumns` stays two across from `md`, no empty slot; that case is dormant while
  `hiddenProofs` is empty.)
  - **Headroom:** the `li`'s top padding is 11.2% of the card's width (percent padding resolves
    against the grid area's width), which is the bot's top break-out (0.112 × banner width − 10px)
    plus a constant 12px, at every width. Clear space above each bot head: `gap-y-8` + 12 = 44px
    between stacked cards; header gap + 12 = 60px (phone) / 76px (`md`+) for the first row.
  - **Column gap** 48px (`gap-x-12`, was `gap-5`) holds the right break-out (≤ 25px) with ≥ 23px clear.

### 7.2 Card (`ProofCard`, server; one component, one set of inputs)

- **Inputs:** `href` (the project's hash), `project` (its `ProofKey`: picks the prop and the bot's
  ids), `number`, `tag`, `title`, `cardLine`, `proofLine`. The same for all three; no stats (18+,
  3.9K+) and no variant on any card. `shot` and `shotAlt` are gone.
- Each card is one `<a href="#exile">` (`#design-vault`, `#marwix-skills`) with `data-proof-card`,
  `aria-labelledby="{titleId} {openId}"` (unchanged), and
  `group flex h-full flex-col rounded-3xl bg-cream text-ink active:bg-cream/90 {focusRingCard}`.
  **`overflow-hidden` is removed** so the bot can break out; only the bot layer paints outside.
- **Banner** (`ProofBanner`, `aria-hidden="true"`; replaces the 16:10 shot):
  stage `relative m-2.5 aspect-[2.2/1]`, holding in order:
  1. Ground: `absolute inset-0 overflow-hidden rounded-xl bg-ink`, `style.backgroundImage` =
     `bannerGlow`, `bannerHatch` (§7.2.2): a violet glow rising from the floor over a faint 135°
     "/" hatch (1px lines every 13px).
  2. Break-out layer: `<div data-anim="proof-bot-layer" class="pointer-events-none absolute inset-0 [clip-path:inset(-120%_-60%_0_-60%)]">`.
     Its bottom edge is the **floor cut**: nothing paints below the banner floor; above and to the
     sides it lets the bot out. Holds `ProofBot`.
- **Text** (unchanged): `flex flex-1 flex-col gap-2.5 px-6 pt-5.5 pb-6.5`: meta row
  `flex justify-between gap-4 {metaLabelOnCream}` (`0n · tag` left; `proofs.open` + `ArrowUpRightIcon`
  right, `id={openId}`, `group-hover:text-ink`); title
  `<h3 id={titleId} data-anim="proof-card-title" class="font-display font-semibold text-card leading-none tracking-[-0.03em] decoration-1 underline-offset-4 group-hover:underline {condensed}">`
  (the bot layer is a sibling of this block, never inside the h3); line
  `mb-1.5 text-body leading-[1.45] text-cream-muted`; then `ProofLine`.
- **Proof line** (`ProofLine`): `<p class="mt-auto flex items-center gap-2.5 border-t border-ink/15 pt-3 font-mono text-meta leading-[1.3] font-medium tracking-[0.06em] text-ink uppercase">`
  → `<span aria-hidden="true" class="size-1.75 shrink-0 rounded-full bg-accent ring-3 ring-accent/25">`
  then the text. `mt-auto` pins it to the card foot, so the three rules line up across a row.
  Text is `ink` on `cream` (~17:1); the violet dot is decoration only.

| Part | Default | Hover | Focus-visible | Active |
|---|---|---|---|---|
| Card | `bg-cream text-ink` | title underline; open meta `text-ink`; (later) lift −8px | 2px `outline-text`, 4px offset, on dark; the bot may cover a few px of the ring at the top-right, the rest stays visible | `bg-cream/90` |
| Bot | the pose (lean 10°, look 7) | (later) leans +4°, prop act | none: decorative, the card owns focus | none |
| Proof line | `text-ink`, dot `bg-accent` | no change | n/a | n/a |

#### 7.2.1–7.2.3 The bot, its shade roles and its props

Moved 2026-10-06, unchanged, to [`07-proofs-bot.md`](07-proofs-bot.md): §7.2.1 the bot
(`ProofBot`), §7.2.2 shade roles (`lib/proofBotShades.ts`), §7.2.3 props (`lib/proofBotProps.ts`).
The § numbers stay, so every "§7.2.1", "§7.2.2" and "§7.2.3" in this file points there.

### 7.3 Takeover (`ProjectTakeover`, server markup; `TakeoverController`, client)

- **Element:** one `<dialog id="exile" aria-labelledby={titleId}>` per project (ids from
  `lib/routes.ts`), `fixed inset-0 z-50 m-0 hidden h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain border-0 bg-cream p-0 text-ink open:block [:root:not([data-takeover-js])_&:target]:block`.
  `TakeoverController` sets `data-takeover-js` on `<html>`, which switches the no-JS `:target`
  display off, so with JS only the dialog's `open` state shows it.
- **Behaviour:**
  - The card link sets the hash (a real history entry). `TakeoverController` (`hooks/useHashTakeover.ts`)
    reads the hash on load and on `hashchange`: a project hash calls `showModal()` on its dialog
    (native focus containment; the page behind is inert) and adds `overflow-hidden` to `<html>`.
    The hash is compared raw against the ids, never decoded: a malformed hash means no project.
  - **Every open takeover has a page entry beneath it.** A direct load on a project hash (a shared
    link, `/#design-vault`) rewrites its entry to `#proofs` and pushes the project hash on top, once.
  - **Close** (button), **Esc** (the dialog's `cancel` event, default prevented) and the browser
    **Back** button all end in the same place: `history.back()`. The hash change then closes the
    dialog, and focus returns to that project's card.
  - **Next project** replaces the hash (`location.replace`), so Back always closes rather than
    stepping through projects. It wraps from the last project to the first.
  - Close and Next click handling lives in `lib/takeoverLinks.ts`: Close raises the dialog's
    `cancel` (the Esc path); Next replaces the hash. A modified or non-primary click (new tab, new
    window) keeps the browser default.
  - **No JS:** `:target` shows the dialog; the Close link (`href="#proofs"`) and Back close it,
    and every part is readable.
  - Static: it opens and closes instantly. Screen check: the page doesn't jump on open.
  - The open takeover covers the nav (`z-50` over the header's `z-40`): accepted by the user.
    Since 2026-10-05 each takeover ends with its own Book a call (constitution §3; §7.3.3).
- **Template (the user's decisions, 2026-10-05; supersedes the seven-part template of 2026-09-24).**
  The single summary paragraph is gone. Every project has the same parts in the same order; parts
  4, 5 and 6 render only when the project has their content key (no heading, no gap, no filler).
  Parts 2 to 7 each open with a small mono label (the eyebrow, the same words on every project)
  over a short headline written for that project in the display face. **Exile has all seven
  parts; Design Vault has four** (1, 2, 3, 7: no took, no lessons, no showcase), so its takeover
  is unchanged by part 5. **MARWIX-SKILLS has all seven too** (2026-10-10,
  [`07-proofs-spam.md`](07-proofs-spam.md)), and its part 3 still has no shots (2026-10-09, §7.9).

  ```
  dialog
  └ div data-anim="takeover-content"
    ├ TakeoverTopBar                              data-anim="takeover-bar"   (unchanged)
    └ div.px-gutter → div {container} flex flex-col gap-10 pt-10 md:gap-14 md:pt-16 lg:gap-18 lg:pt-22
      ├ h2 data-anim="takeover-title"             (unchanged, first child)
      ├ TakeoverIntro   data-part="intro"    1 What it is: the intro line + TakeoverInfoRows (no eyebrow, no headline)
      ├ TakeoverPart    data-part="problem"  2 eyebrow, headline; one paragraph
      ├ TakeoverPart    data-part="built"    3 eyebrow, headline; one paragraph; wide: TakeoverShots, ProjectVisitLink
      │                                        (no shots: no wide; ProjectVisitLink after the paragraph, §7.9)
      ├ TakeoverPart    data-part="took"     4 eyebrow, headline; TakeoverTook                       (only with `whatItTook`)
      ├ TakeoverPart    data-part="learned"  5 eyebrow, headline; TakeoverLearned                    (only with `whatILearned`)
      ├ TakeoverPart    data-part="showcase" 6 eyebrow, headline; TakeoverShowcase; wide: ShowcaseDiagram (only with `showcase`)
      ├ TakeoverMeans   data-part="means"    7 eyebrow, the closing line as its headline (TakeoverMeansLine), BookCallLink
      └ TakeoverNextLink                          (unchanged, last child)
  ```
  - **Kept exactly as built:** the top bar (`sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-ink/15 bg-cream px-gutter py-3 md:py-4.5 font-mono text-nav text-cream-muted`,
    `TakeoverCloseLink` with `proofs.takeover.close`, `.escHint`, `CloseIcon`); the title
    `<h2 class="font-display font-semibold text-takeover leading-[0.88] tracking-[-0.045em] text-ink {condensed}">`
    (the card and Next morphs measure it: no class, wrapper or position change); the column's
    classes; `TakeoverNextLink` (`group flex flex-col gap-3 border-t border-ink/15 pt-12 pb-16 {focusRingOnCream}`).
  - **Every part is a direct child of the column, a sibling of the `<h2>`.** `useTakeoverMotion`
    raises and fades "the heading's siblings" on open and fades them on close (`bodyPartsOf`), so a
    part nested one level deeper would miss both. No part wraps the `<h2>`. Part 5 is a
    `TakeoverPart` like 2–4, so it needs nothing new here.
  - **Skim path (constitution §2).** Each part answers one small question (what is it, what was
    wrong before, what changed, what did it take, what did building it teach them that I benefit
    from, what else can it do, what does it mean for me) with one headline and at most one short
    paragraph or one visual. **The skim is the headlines:** a reader who reads only the
    display-face lines gets the title, then one line per part, written for this project, ending on
    the closing line with Book a call beside it. From `lg` those lines run down one left rail. The
    mono eyebrows only say which part this is, so a reader of a second project already knows the
    order. Exile, the longest, is about 4,200px at 360 without part 5 (the lead's figure) and
    about 4,850px with it (an estimate; screen check). Part 5 is drawn compact for that reason.
    **Since 2026-10-06** about 5,100px (an estimate: +180 for the third shot, +72 for the taller
    diagram rows; screen check).

#### 7.3.1 The part frame (`TakeoverPart`, server) and part 1 (`TakeoverIntro`, server)

- **`TakeoverPart`** (parts 2–6; props `part`, `label`, `headline`, `children`, `wide?`):
  `<section data-anim="takeover-part" data-part={part} aria-labelledby={headlineId}`
  `class="grid gap-x-10 gap-y-6 border-t border-ink/15 pt-8 md:pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">`.
  - Head: `<div data-anim="takeover-part-head" class="flex min-w-0 flex-col gap-3">` holding:
    - Eyebrow: `<p class="{metaLabelOnCream} font-medium tracking-[0.06em] uppercase">` (`partLabels.*`;
      a plain paragraph, not a heading).
    - Headline: `<h3 id={headlineId} class="max-w-xl font-display text-step leading-[1.05] font-semibold tracking-[-0.02em] text-balance text-ink {condensed}">`.
      **The headline is the part's heading** and names its `<section>`; `headlineId` from
      `takeoverPartId(targetId, part)`.
  - Body: `<div data-anim="takeover-part-body" class="flex min-w-0 flex-col items-start gap-6 lg:pt-7.5">`.
    The 30px at `lg` drops the body's first line level with the headline, under the eyebrow's row.
  - Wide slot (optional; shots, the diagram): `<div data-anim="takeover-part-wide" class="mt-3 flex min-w-0 flex-col gap-6 lg:col-span-2">`.
  - Below `lg`: head, body, wide stack in one column. From `lg`: the head in the left third, the
    body in the right two thirds, wide across both.
  - **The headline's size:** `text-step`, 32px at every width, with `leading-[1.05]` and
    `text-balance`. In the left third it wraps to two or three lines (about 23 characters a line
    at 1024, 33 at 1440); 32px keeps three lines to about 100px tall, still clearly the largest
    type in the part (body 17px, took, lesson and step titles 20–26px) and clearly below the
    title. A fluid size was not used: `text-card` reaches 38–44px in the rail and would wrap the
    same line to four.
- **Paragraphs** (parts 2, 3 and 6), new `takeoverText` in `lib/styles.ts`:
  `max-w-xl text-lead leading-normal text-pretty text-ink` (17px, a 576px measure, about 68
  characters a line).
- **Part 1, `TakeoverIntro`** (no eyebrow and no headline: the `<h2>` is its heading, and the rows
  carry WHAT IT IS):
  `<div data-anim="takeover-part" data-part="intro" class="grid gap-x-10 gap-y-8 border-t border-ink/15 pt-8 md:pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">`
  - Intro, first in the markup: `<p data-anim="takeover-intro" class="max-w-2xl text-summary leading-[1.4] tracking-[-0.01em] text-pretty text-ink lg:col-start-2 lg:row-start-1">`.
  - Rows: `<div data-anim="takeover-rows" class="max-w-xl lg:col-start-1 lg:row-start-1">` holding
    `TakeoverInfoRows` unchanged (`grid grid-cols-[5.5rem_minmax(0,1fr)] content-start gap-x-5 gap-y-3.5 text-body`,
    `TakeoverStats` in IN USE). Phone and tablet: intro, then rows. From `lg` the rows sit in the
    rail, level with the intro. The Exile stats stay here and nowhere else.
- **Part 2:** body = one `<p class="{takeoverText}">` (`problem.body`).
- **Part 3:** body = one `<p class="{takeoverText}">` (`whatIBuilt.body`); wide = `TakeoverShots`,
  then `ProjectVisitLink` (unchanged: `pillInk min-h-12 gap-2 self-start px-6 text-body font-semibold`,
  `ArrowUpRightIcon`). **Visit sits here, under the shots:** the shots show the thing and the
  button lets the reader check it is live, it keeps its old place after the shots, and it stays
  an ink pill well above the one accent button (Book a call), so the two never compete. Exile →
  `links.exile` (still the only place exile.marwix.dev is linked). **A project with no shots
  (MARWIX-SKILLS, 2026-10-09) has no wide slot at all:** Visit is the body's last child, under the
  paragraph (§7.9).
  - `TakeoverShots`, **two layouts, picked from the project's shot count** (the user, 2026-10-07;
    replaces 2026-10-06's "one layout, three shots, for every project"). A project with no shots
    draws no `TakeoverShots` (2026-10-09, §7.9). Every frame is
    `data-anim="takeover-shot" relative overflow-hidden rounded-3xl`, so the motion pass is the
    same for both, and every image is a `SiteImage` with `placeholderTone="cream"`.
    - **Three shots** (Exile), unchanged: `flex flex-col gap-5`,
      one `aspect-2/1` (`sizes="min(100vw, 1536px)"`), then `grid gap-5 sm:grid-cols-2` of two
      `aspect-4/3` (§7.6 for their `sizes`).
    - **Two shots** (Design Vault): `flex flex-col gap-5` of two `aspect-2/1` frames, each the full
      column width with `sizes="min(100vw, 1536px)"`, the same frame as the three-shot big shot.
      The same at every width, 360 to 4K: no side-by-side breakpoint.
    - **Types, for `web-coder`:** `ProofShots<T>` becomes a tuple of two or three; a project's
      shots and its `shotAlts` stay the same length (the length check in `lib/proofs.ts` stays),
      and `TakeoverShots` draws the two-shot layout for two and the three-shot layout for three.
      **2026-10-09:** a project's shots and alts are `ProofShotSet<T>` (none, two or three);
      `ProofShots<T>` stays the two-or-three tuple `TakeoverShots` draws (§7.9).
    - Each shot's `position` comes from `lib/proofs.ts`: its slot's default unless the shot sets
      its own (Exile's three do, §7.6). Defaults: three shots, big `top` and details `center`;
      two shots, `top` for both.
- **Part 4, `TakeoverTook`:** `<ul class="grid w-full gap-x-10 gap-y-7 sm:grid-cols-2">`, each
  `TakeoverItem` (no `number`) `<li data-anim="takeover-item" class="flex flex-col gap-2 border-t border-ink/15 pt-4">`:
  `<h4 class="font-display text-summary leading-[1.1] font-semibold tracking-[-0.02em] text-ink {condensed}">`
  over `<p class="text-body-lg leading-normal text-cream-muted">`. No icons, no numbers.
  (`TakeoverItem` is today's `TakeoverTookItem`, renamed because part 5 shares it; its markup
  without `number` is unchanged, and only its hook name changes, from `takeover-took-item`.)
- **Part 5, `TakeoverLearned`** (new 2026-10-05, later; optional, only with `whatILearned`). Its
  one question: **what did building this teach them that I benefit from?** Each lesson is said as
  how the user works now, so it reads as proof for the client, not a diary. Body only, no wide slot.
  - List: `<ol class="flex w-full max-w-xl flex-col gap-6">`, one `TakeoverItem` per lesson in
    content order, with `number={listNumber(index)}` (`lib/listNumber.ts`).
  - **`TakeoverItem` with `number`:** the same `<li data-anim="takeover-item" class="flex flex-col gap-2 border-t border-ink/15 pt-4">`;
    the title becomes a row, `<div class="flex items-baseline gap-3">` →
    `<span aria-hidden="true" class="{metaLabelOnCream} shrink-0 font-medium tracking-[0.06em]">`
    (the ordinal, "01"–"03") + the same `<h4>` with `min-w-0` added; then the same `<p>`, full width
    under the row (no hanging indent: on a phone the line keeps all 320px).
  - **Told apart from part 4 at a glance:** the item type and hairline stay the same, so the
    takeover keeps one item look, but part 5 is **numbered** (the diagram's ordinals, `aria-hidden`;
    the `<ol>` gives the order) and **one column on the 576px reading measure at every width**,
    where part 4 is unnumbered and two across, filling the body, from `sm`. On a phone both are one
    column: the ordinals, the eyebrow and the part's own headline tell them apart.
  - **The numbers 48 hours and 700+ stay in the lines' text,** in the same type as the words (no
    bold, no figure, no accent). They are written exactly as filled.
  - **Compact on phones:** the ordinal shares the title's line, the line runs full width, items
    sit 24px apart (part 4's are 28). About 620px for Exile's three lessons at 360 (§7.4).
- **Part 6, `TakeoverShowcase`** (the body): a status line, then one `<p class="{takeoverText}">`
  (`showcase.body`).
  Status: `<p class="{monoPill} border border-ink/15 text-cream-muted">` → `<span aria-hidden="true" class="size-1.5 rounded-full bg-current">`
  + `showcase.status`. It says the feature is live, in words: **no number and no count of
  communities** (the user, 2026-10-06; the 18+ counts the calculations and simulations use and
  stays in IN USE). A reader who sees only the headline and the diagram still knows it's real,
  running work (facts, 2026-10-05; confirmed by the user 2026-10-06).
  New `monoPill` in `lib/styles.ts` (a shape, not interactive): `inline-flex items-center gap-2 rounded-full px-3 py-2 font-mono text-meta leading-none font-medium tracking-[0.06em] uppercase`.
  Wide = `ShowcaseDiagram` (§7.3.2).

#### 7.3.2 The showcase diagram (`ShowcaseDiagram`, server; part 6 for Exile and MARWIX-SKILLS; sample D in `temp/spam-diagram-samples.html`; tiles redrawn 2026-10-06)

Moved and redrawn 2026-10-06 (the user's pick: the ink stage from `md`, one band per step below it): [`07-proofs-spam.md`](07-proofs-spam.md), which supersedes this subsection.

#### 7.3.3 Part 7: the closing line, the pick and Book a call (`TakeoverMeans`, server)

- **`TakeoverMeans`** (the ink panel, like the cards' ink stage; it does not use the rail):
  `<section data-anim="takeover-part" data-part="means" aria-labelledby={headlineId}`
  `class="grid gap-x-10 gap-y-8 rounded-3xl bg-ink px-6 py-10 text-text md:px-10 md:py-14 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-end lg:px-14 lg:py-16">`.
  - Head: `<div data-anim="takeover-part-head" class="flex min-w-0 flex-col gap-4">` holding the
    eyebrow `<p class="{metaLabel} font-medium tracking-[0.06em] uppercase">` (`partLabels.meansForYou`;
    `muted` on `ink`, about 6.9:1) and `TakeoverMeansLine`.
  - Button: `<div data-anim="takeover-book" class="w-full md:w-auto lg:justify-self-end"><BookCallLink variant="hero" /></div>`.
  - Below `lg`: eyebrow, the line, then the button. From `lg`: the line on the left two thirds,
    the button at the panel's bottom right.
- **The closing line is part 7's headline.** There is no separate headline key and no paragraph:
  one line, then the button. Two lines here would answer the same question twice.
- **`TakeoverMeansLine`** (client; the only part of a takeover that follows the About pick,
  constitution §3): `<h3 id={headlineId} data-anim="takeover-means-line" data-set={set} class="max-w-3xl font-display text-card leading-[1.05] font-semibold tracking-[-0.025em] text-balance text-text {condensed}">`
  showing `lines[set] ?? lines.default`. It is one size up from the other headlines (`text-card`,
  30–44px) because it is the panel's only text and has the wide column.
  - **Source, the same as Agents and Process:** `const set = useShownSet()` (`hooks/useShownSet.ts`
    → `lib/shownSet.ts`; ui-spec §0.5). `lib/aboutPick.ts → pickSet` gives `default` for no pick
    and for "Not sure yet". The server markup, and the page without JavaScript, show `default`
    (`serverShownSet`). Nothing is copied into React state; nothing else in the takeover reads it.
  - The `<h3>` registers itself with `useSwapFade`, so a swap that lands while a takeover is open
    (a direct load on `/?for=discord#exile`, a reload with a remembered pick) fades like the other
    sections. Normally the pick changes while the dialog is closed and nothing is seen.
  - No "Shown for" tag, no live region, no focus or scroll move: the line is written to its
    reader, and the pick cannot change while the modal is open.
- **Book a call:** `BookCallLink variant="hero"` as built: `pillPrimary w-full md:w-auto`,
  `nav.bookCall`, `links.bookCall`, `bookCallTrackProps` (`lib/track.ts`, the one key), a new tab
  with the `a11y.newTab` suffix. No new variant. It needs the ink panel: on cream `pillPrimary`'s
  hover (`bg-text`) and `focusRing` (`outline-text`) would both vanish.

#### 7.3.4 States, tokens and accessibility (the takeover)

| Element | Default | Hover | Focus-visible | Active |
|---|---|---|---|---|
| Close (unchanged) | `bg-ink text-cream` | `bg-accent text-on-accent` | 2px `outline-ink`, 2px offset | `bg-accent/80` |
| Visit (unchanged, `pillInk`) | `bg-ink text-cream` | `bg-accent text-on-accent` | 2px `outline-ink`, 2px offset | `bg-accent/80` |
| Book a call (on the ink panel) | `bg-accent text-on-accent` | `bg-text` | 2px `outline-text`, 2px offset | `bg-muted` |
| Next project (unchanged) | title `text-ink` | title `text-cream-muted` | 2px `outline-ink`, 2px offset | n/a |
| Eyebrows, headlines, rows, shots, took and lesson items, lesson ordinals, pills, the diagram (its Eva tiles included), the closing line | not interactive: no hover, no focus stop, no pointer cursor | | | |

- **Tokens:** colours `cream`, `ink`, `cream-muted`, `accent`, `on-accent`, and `text` and `muted`
  on the ink panel only; `ink/15` hairlines. Fonts `font-display`, `font-body`, `font-mono`. Type
  `text-takeover`, `text-heading`, `text-card`, `text-step`, `text-summary`, `text-lead`,
  `text-body-lg`, `text-body`, `text-nav`, `text-meta`. Radii `rounded-3xl` (shots, the panel, the
  return line), `rounded-xl` (tiles), `rounded-full` (pills). Spacing `gutter`, `--container-site`.
  **No new token** (part 5 uses only `ink`, `cream-muted`, `ink/15`, `text-summary`,
  `text-body-lg`, `text-meta` and the three fonts). **2026-10-06:** the Eva tiles use `ink` and
  `rounded-xl` only. The colours inside the Eva files are an image's pixels, like a screenshot's,
  not tokens. No new token. **2026-10-07:** the two-shot layout uses `rounded-3xl` and the
  existing spacing only; Design Vault's light pixels are image content, not tokens. No new token.
  **2026-10-09:** the no-shot part 3 uses only classes already in the part. No new token.
- **Contrast:** `ink` on `cream` about 17:1; `cream-muted` on `cream` about 4.6:1 (eyebrows, took
  and lesson lines, lesson ordinals, step numbers, step lines, the status); `text` on `ink` above
  16:1; `muted` on `ink` about 6.9:1 (the panel's eyebrow); `on-accent` on `accent` about 9:1.
  Accent is a fill only (hovers, Book a call), never text or a line on cream; since 2026-10-06 no
  tile is accent. The Eva tiles carry no text.
- **Headings:** `<h2>` title → `<h3>` the headline of each of parts 2–7 (part 7's is the closing
  line) → `<h4>` took items, lessons and diagram steps. An eyebrow is a `<p>` just before its
  headline, never a heading. Part 1 has no `<h3>`. Each of parts 2–7 is a `<section aria-labelledby>`
  named by its headline. A screen reader hears part 5 as its eyebrow, its heading, then an ordered
  list of three (heading, then line); the ordinals are not read twice.
- **Keyboard:** tab order is Close, Visit, Book a call, Next; focus stays inside the modal. Part 5
  adds no focus stop, and neither do the Eva tiles.
  **Tap targets:** Close 44, Visit 48, Book a call 48 (full width at 360), Next taller than 44.
- **Sideways scroll:** every grid track is `minmax(0, …)`, every flex child that holds text is
  `min-w-0` (the lesson's and the step's `<h4>` beside its ordinal included), the phone step row is
  96 + 16 + a `minmax(0,1fr)` text column (208 at 360), the return line's margins are positive at
  every width from `md` (a column is at least 217px, so the right margin is at least 153), and
  pills wrap with their row.

### 7.4 Sizes

Card width W; banner width B = W − 20. Every bot size is a fixed fraction of B (one scale).
Characters a line are estimates from the type sizes, for the screen check to confirm.
**The type rows below predate the 2026-10-07 font change (Acosta);** the card and takeover title
sizes as the tokens set them now are in §7.9's Sizes.

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Heading (`text-heading`) | 44px | 64px | 96px | 104px |
| Cards (W) | stacked, 320 | 2 across, 329 each; third on row 2 | 3 across, ~411 each | 3 across, 480 each |
| Grid gaps (column / row) | n/a / 32 | 48 / 32 | 48 / n/a | 48 / n/a |
| Row headroom (`li` `pt-[11.2%]`) | 36 | 37 | 46 | 54 |
| Banner (2.2:1) | 300×136 | 309×141 | 391×178 | 460×209 |
| Bot SVG box (112.5% of B, 160:116) | 338×245 | 348×252 | 440×319 | 518×375 |
| Bot scale (px per bot unit, B/142.2) | 2.1 | 2.2 | 2.75 | 3.2 |
| Bot seen: width / height (head to floor) | 216 / 170 | 223 / 175 | 282 / 221 | 332 / 260 |
| Top break-out (past the card's top) | 24 | 25 | 34 | 42 |
| Right break-out (past the card's right) | 12 (capped at gutter − 8) | 14 | 20 | 25 |
| Clear: bot head to the card or header above | 44 / 60 | 44 / 76 | n/a / 76 | n/a / 76 |
| Clear: bot's right to the next card / the viewport | n/a / 8 | 34 / 17 | 28 / 36 | 23 / wide |
| Card title (`text-card`) | 30px | 35px | 44px | 44px |
| Proof line | 12px mono, 1–2 lines; 1px `ink/15` rule; dot 7 + 3px ring | same | same | same |
| **Takeover** (content width) | 320 | 706 | 1328 | 1536 |
| Takeover title (`text-takeover`) | 56px | 91px | 148px | 168px |
| Part rhythm: column gap + the part's top padding | 40 + 32 | 56 + 40 | 72 + 40 | 72 + 40 |
| Part layout (parts 2–6) | eyebrow, headline, then content, one column | same | rail 429 + 40 gap + content 859 | rail 499 + 40 + content 997 |
| Part eyebrow (mono `text-meta`, uppercase) | 12px, one line, 12 above the headline | same | same, at the rail's top | same |
| Part headline (`text-step`, max 576) | 32px in 320: about 24 characters a line | 32px in 576: about 44 a line | 32px in the 429 rail: about 33 a line | 32px in the 499 rail: about 38 a line |
| Headline to body | 24 below the headline | 24 | body beside it, its first line level with the headline (30 down) | same |
| Intro (`text-summary`, max 672) | 20px in 320 | 22.6px in 672 | 26px in 672 | 26px in 672 |
| Info rows | label col 88 + 20 gap, values 212 | values 468 (max 576), under the intro | in the rail, values 321 | in the rail, values 391 |
| IN USE numbers (Exile, `text-card`) | 30px | 35px | 44px | 44px |
| Paragraphs (`text-lead`, max 576) | 17px in 320 | 17px in 576 | same | same |
| Shots, three-shot layout (Exile): big (2:1) | 320×160 | 706×353 | 1328×664 | 1536×768 |
| Shots, three-shot layout (Exile): details (4:3) | stacked, 320×240 each | 343×257 each | 654×490 each | 758×568 each |
| Shots, two-shot layout (Design Vault, 2026-10-07): two 2:1, stacked, 20 apart | 320×160 each (340 tall in all) | 706×353 each | 1328×664 each | 1536×768 each |
| Shots, none (MARWIX-SKILLS, 2026-10-09) | no frame, no wide slot; §7.9 | same | same | same |
| Visit | 48 tall, hugs its text | same | same | same |
| Took items | 1 column, 320 | 2 columns, 333 each | 2 columns in the content, 409 each | 479 each |
| Took title (`text-summary`) / line (`text-body-lg`) | 20px / 16px | 22.6px / 16px | 26px / 16px | 26px / 16px |
| Lessons list (part 5, `max-w-xl`) | 1 column, 320; items 24 apart | 1 column, 576 | 1 column, 576 at the content's left (content 859) | 1 column, 576 (content 997) |
| Lesson ordinal (mono `text-meta`) | 12px, about 15 wide, 12 before the title, on its baseline | same | same | same |
| Lesson title (`text-summary`) | 20px in about 293 (beside the ordinal): about 30 characters a line | 22.6px in about 549: about 50 a line | 26px in about 549: about 44 a line | same |
| Lesson line (`text-body-lg`) | 16px in 320 (full width, under the title): about 42 characters a line | 16px in 576: about 75 a line | same | same |
| Part 5, Exile (three lessons; top padding to the last line) | about 580 (620 with the column gap) | about 480 | about 420 (the body beside the head is the taller) | about 420 |
| Status and return pills | 12px mono, 28 tall, one line | same | same | same |
| Diagram steps (2026-10-06, the ink stage: [`07-proofs-spam.md`](07-proofs-spam.md), Sizes) | one ink band per step, 320 × 120, 40 apart; text on the band | one ink band 706 × 116 behind 3 columns of 217, 28 gaps; text on cream below | band 1328 × 200, columns 424 | band 1536 × 200, columns 493 |
| Eva figure (was the tile; [`07-proofs-spam.md`](07-proofs-spam.md)) | 148, at the band's right end, head 28 above the band | 144, 28 above the band | 248, 48 above the band | 248, 48 above the band |
| Step number (mono `text-meta`) | 12px, about 15 wide, 12 before the title, on its baseline | same | same | same |
| Step title (`text-summary`) | 20px in the 152 text column on its band, `text` | 22.6px in 217, on cream | 26px in 424 | 26px in 493 |
| Step line (`text-body`, max 320) | 15px in 152, `muted` on the band: about 21 characters a line | 15px in 217: about 29 a line | 15px in 320 | 15px in 320 |
| Step link and chevron | none: a 12px down chevron on cream between bands | in the band, at the symbol's height: about 77 long; 12px chevron on steps 1 and 2 | about 180 long | about 249 long |
| Return line | dashed box 320 wide, 2px, radius 24, 12 under the bands; pill over its line | dashed U 489 wide, its legs under figures 1 and 3 (80 in), 28 under the steps; pill and line centred | U 904 wide (legs 156 in) | U 1043 wide |
| Return line's text (`text-body`) | 15px | 15px | 15px | 15px |
| Closing panel (radius 24) | 320, padding 24 / 40, inner 272; one column | 706, padding 40 / 56, inner 626; one column | 1328, padding 56 / 64: line column 784 + 40 + button column 392 | 1536: line column 923 + 40 + button column 461 |
| Closing eyebrow (mono `text-meta`, `muted`) | 12px, 16 above the line | same | same | same |
| Closing line, part 7's headline (`text-card`, max 768) | 30px in 272: about 22 characters a line | 35px in 626: about 43 a line | 44px in 768: about 42 a line | 44px in 768: about 42 a line |
| Book a call | 48 tall, 272 wide, 32 under the line | 48 tall, hugs its text, under the line | 48 tall, at the panel's bottom right | same |
| Close | 44 tall | same | same | same |
| Next title (`text-heading`) | 44px | 64px | 96px | 104px |

Widest stacked (767): card 706, banner 686×312, bot 388 tall, top break-out 67 (headroom 79),
right break-out capped at 23. At 1024 the cards narrow from ~300 to 282 with the wider gap.
**MARWIX-SKILLS' card title still wraps only at its hyphen** (re-checked 2026-10-09 against the
Acosta sizes, §7.9): at 1024, its tightest text column (234), "MARWIX-" is about 179 wide. Screen
check.

Takeover at 1024 (the rail's first width, content 942): rail 301 + 40 + content 601. The part
headline has about 23 characters a line there, its tightest column with 360's 24: a 45-character
headline is two lines, a 65-character one three. Info-row values 193 (the two stats may wrap to
two rows); took items 280 each; the lessons list 576 of the 601 content column. The closing panel
is 942 with an inner 830: line column 527 at 38px (about 33 characters a line) beside a 263 button
column. At 640 (the three-shot details' first two-across width, content 589): the big shot
589×294, the details 284×213 each; the two-shot layout's frames are 589×294 each at every width
from there to `lg`. The diagram at 1024: see [`07-proofs-spam.md`](07-proofs-spam.md) (Sizes).
Screen check all of these, and the whole Exile takeover at 360 for length (about 5,100px
since 2026-10-06).

**The diagram's phone row (2026-10-06).** Superseded the same day: one ink band per step, sized
in [`07-proofs-spam.md`](07-proofs-spam.md).

### 7.5 Content slots (`content/home.ts → proofs`; addresses in `content/home.ts → links`)

No length limits (`docs/04-voice.md`, Length). The last column is a sizing note: what the layout
was drawn to hold. Whether words fit is judged on the screen check. Each of parts 2–6 is one
object under the project (its headline and its content together), so an optional part is one
optional key and can never be half there.

| Key | Meaning | Sizing note |
|---|---|---|
| `proofs.number` / `proofs.label` | "04" and the section label | one line |
| `proofs.heading.lead` / `.accent` | "Work that runs"-style heading; last word in violet | drawn for about 6 words |
| `proofs.hint` | Tells the reader a card opens | one line |
| `proofs.open` | Card meta "Open" | one word |
| `proofs.projects.{exile,designVault,marwixSkills}.tag` | The kind of thing it is (facts only); also in the top bar | drawn for 2 words |
| `.title` | The project name, as in facts | fixed |
| `.cardLine` | What it does for its users | drawn for two lines at 360 |
| `.proofLine` | One concrete fact from `docs/03-facts.md` showing it's real and in use, as an outcome, never tech and never a stat. Shown uppercase by CSS | two lines at 360, about 48 characters |
| `.rows.whatItIs` / `.built` / `.inUse` | Facts only: what kind of thing it is, who built it and since when, where it is used. MARWIX-SKILLS BUILT and IN USE stay `[FILL: …]` until the facts file has them | 2–3 lines in a 193px column at 1024 |
| `.rows.inUseStats[]` `{value, label}` (Exile only) | **Changed 2026-10-06 (the user):** "18+" communities and "3.9K+" commands run (were "~20" and "4k+"), exactly as filled in `docs/03-facts.md`, which must carry the new figures before the copy changes (constitution §7.2). They are floors, raised only when the user says the live Exile site shows more. They count the calculations and simulations use, are shown in the IN USE row only, and are never borrowed by the showcase. The only stat figures in the takeover: the lessons' 48 hours and 700+ sit inside their lines' text (§7.3.1 part 5) | values fixed; labels one line |
| `.intro` | **New.** Part 1's lead: what it does and who for, in a sentence or two. It takes over `summary`'s opening job, and does not repeat the rows. Part 1 has no headline | two lines at 1440 (about 105 characters); four at 360 |
| `.problem.headline` | **New.** Part 2's heading, written for this project: the problem in one line, the line a skimming reader takes away | 32px display: about 24 characters a line at 360 and in the 1024 rail, 33 at 1440. Two lines there is about 45 characters, three about 65 |
| `.problem.body` | **New.** Part 2's paragraph: who had the problem and what they did before (Exile: "The problem it solved"; Design Vault: "Why it was built"). It adds to the headline, it doesn't repeat it | one short paragraph: about 68 characters a line from 768, 38 at 360 |
| `.whatIBuilt.headline` | **New.** Part 3's heading: what changed for the people who use it, in one line | as `.problem.headline` |
| `.whatIBuilt.body` | **New.** Part 3's paragraph, the words beside the screenshots. It takes over `summary`'s "what it does for its users" job. **For a project with no shots (MARWIX-SKILLS) it is the part's only content above Visit,** so it carries "what changed" alone (§7.9) | as `.problem.body` |
| `.whatItTook.headline` | **New, optional block.** Part 4's heading: what building and running it took, in one line, in plain words. Absent for Design Vault: the part is not drawn. MARWIX-SKILLS has it (2026-10-10, four items) | as `.problem.headline` |
| `.whatItTook.items[]` `{title, line}` | The capabilities, no tool or vendor name. Exile: four, in the facts' order (connecting outside services, the payment setup, hosting and upkeep, the website built alone) | title one line (about 27 characters at 1024); line two lines in a 280px column |
| `.whatILearned.headline` | **New 2026-10-05, later; optional block.** Part 5's heading: what building this taught the user, said as what a client gets from it, in one line. Exile and MARWIX-SKILLS (2026-10-10, three items); absent for Design Vault (skipped for now, the user): the part is not drawn | as `.problem.headline` |
| `.whatILearned.items[]` `{title, line}` | One lesson each, said as how the user works now (first person, present tense), never as a diary entry. `title`: the way of working; `line`: the proof from the facts. Exile: three, in the facts' order: builds the system first (the agent workflow that built and runs a live app); treats real people's data as a responsibility (only what it needs, EU servers with encrypted backups, deleted on request within 48 hours, policy and terms covering US law and the GDPR; never "GDPR compliant" or certified); keeps heavy pages fast (one public page carries 700+ images; never how). 48 hours and 700+ exactly as filled. No tool or vendor names | title one line at 360 beside its ordinal (about 30 characters); line two to three lines at 360 (about 80–120 characters), which is two lines in the 576 measure from 768. Longer lines are what make this part tall on a phone |
| *Rows `.showcase.*` below are Exile's.* | MARWIX-SKILLS' showcase keys (`look`, `prompt`, `image`; its own status, body and return words) are in [`07-proofs-spam.md`](07-proofs-spam.md) (2026-10-10) | |
| `.showcase.headline` | **New, optional block.** Part 6's heading: names the showcase in one line | as `.problem.headline` |
| `.showcase.status` | **Changed 2026-10-06 (the user).** Part 6's state in a few words: the spam protection is live. **No number and no count of communities;** nothing here borrows the IN USE figures. The fact behind it is unchanged: it is active in the communities that use Exile Bot | one line at 360, about 34 characters |
| `.showcase.body` | What the showcase is and why it is shown: Exile's spam protection, active in communities, as the automation showcase. With the steps and the return line, it takes over `summary`'s spam sentences. No count of communities here either | as `.problem.body` |
| `.showcase.steps.{watch,spot,stop}.title` | The diagram's three step names, in order: it watches, it spots, it shuts it down | one line beside its number: about 18 characters (190px at 768, 181px at 360) |
| `.showcase.steps.{watch,spot,stop}.line` | One line per step, from the facts: messages as they arrive; a hijacked account spamming; shut down on its own. No sample names or messages | three lines at 768, about 85 characters; at 360 the column is 208px, about 28 characters a line |
| `.showcase.returnLabel` | The pill on the way back: one word for "temporary" | one word |
| `.showcase.returnLine` | Why it is safe to leave alone: the stop lifts on its own, so a false alarm undoes itself | two lines at 768, about 58 characters a line |
| `.meansForYou.default` | **New.** Part 7's closing line, which is also its heading, for no pick, "Not sure yet" and no JavaScript: what this project means for a reader, in the shared voice. One line; Book a call follows it | 30–44px display: about 22 characters a line at 360, 42 from 768. A 65-character line is three lines on a phone and two from tablet |
| `.meansForYou.{service-business,online-store,discord,software-builder,website}` | **New.** The same line for each About card, in that card's tone (`docs/04-voice.md`), traced to "What the user can do for a business: shown by Exile Bot" or "What the user builds". Never offers spam protection, never a number. A key left out falls back to `default` | as `default` |
| `.shotAlts[]` | What's on each takeover screenshot, within the facts: **one per shot; none, two or three per project** (2026-10-09; Exile three, Design Vault two, **MARWIX-SKILLS none: `shotAlts: []`, no markers**). Exile: `[0]` the Exile Bot website's home page, with a calculation result card; `[1]` the owner dashboard's home view; `[2]` the dashboard's spam and raid protection settings, with protection on. Design Vault (**changed 2026-10-07**, now two): `[0]` its Palettes view, a grid of saved colour palettes, each card showing its swatches and the colours' names; `[1]` its Fonts view, a grid of saved fonts, each card a preview of the typeface over its name. Nothing read off a shot: no number, no community's name, no ID, no font's or colour's name, no hex value, no date (§7.6) | a sentence each |
| `.visitLabel` | Visit button text | one line at 360 |
| `proofs.takeover.proof` / `.close` / `.escHint` / `.next` | "Project", "Close", "Esc", "Next project" | 2 words each |
| `proofs.takeover.rowLabels.whatItIs` / `.built` / `.inUse` | WHAT IT IS / BUILT / IN USE | fits the 88px label column |
| `proofs.takeover.partLabels.problem` / `.whatIBuilt` / `.whatItTook` / `.whatILearned` / `.showcase` / `.meansForYou` | The six mono eyebrows, the same on every project: they name the part (the problem, what I built, what it took, what I learned, showcase, what this means for you). `.whatILearned` is **new 2026-10-05, later** ("What I learned", the user's words). Shown uppercase by CSS | one line at 360, about 38 characters |
| `nav.bookCall` (`content/shared.ts`) | The shared Book a call label; no new key | fixed |
| `links.exile` / `links.designVault` / `links.marwixSkills` | Addresses from facts | fixed |

- **Retired:** `.summary`. Its jobs go to `.intro` (what it is and does), `.whatIBuilt.body` (what
  it does for its users) and, for Exile, `.showcase.*` (the spam protection). ~~`exile.shotAlts[2]`
  goes with its shot.~~ **2026-10-06:** `exile.shotAlts[2]` is back, with the third shot.
  **2026-10-07:** `designVault.shotAlts[2]` goes with its shot. **2026-10-09:** the three
  `marwixSkills.shotAlts` markers go; the key stays as `[]`. **Removed earlier:** `.cardShotAlt`.
- **Eva's tiles have no content slot** (2026-10-06): the three images are decorative, with an
  empty alt (§7.6.1). No key is added for them.
- **Design Vault** has no `whatILearned` (the user, 2026-10-05: skipped for now), so its takeover
  is unchanged: parts 1, 2, 3 and 7.
- **MARWIX-SKILLS** (shown again 2026-10-09) keeps one shape with the others. Its `intro`, `rows`,
  `problem`, `whatIBuilt`, `meansForYou.default` and `meansForYou["software-builder"]` are filled
  in `content/home.ts` today (the BUILT / IN USE note in the rows line above is stale);
  **`shotAlts: []`** (§7.9). **2026-10-10:** it also gets `whatItTook` (4), `whatILearned` (3) and
  `showcase` (keys `look`, `prompt`, `image`), per [`07-proofs-spam.md`](07-proofs-spam.md). With
  the three alt markers gone, no `[FILL:` marker is left on the project, so it can ship
  (constitution §8).
- **One shape for all three:** a `ProofProject` type (required `tag`, `title`, `cardLine`,
  `proofLine`, `rows`, `intro`, `problem` `{headline, body}`, `whatIBuilt` `{headline, body}`,
  `meansForYou.default`, `shotAlts` (`ProofShotSet<string>` since 2026-10-09: none, two or three,
  as long as the project's shots), `visitLabel`; optional `whatItTook` `{headline, items}`,
  `whatILearned` `{headline, items}`, `showcase` `{headline, status, body, steps, returnLabel, returnLine}`,
  and the five card keys of `meansForYou`) that `content/home.ts` satisfies. `whatILearned` is
  typed `ProofLearned`, the same shape as `ProofTook` (`{ headline, items: readonly ProofTitledLine[] }`)
  but its own name, so either part can change later without touching the other.

### 7.6 Images (all through `SiteImage`; `null` placeholders until the user's files arrive; none may ship)

The card has **no image** (its banner is CSS, its bot inline SVG). The diagram's steps and return
line are markup; since 2026-10-06 its three tiles hold images (§7.6.1). Every screenshot is in a
takeover's part 3, in `TakeoverShots`; no other part has one (part 5 has none). **A project has
none, two or three shots** (the user, 2026-10-09; before that two or three, 2026-10-07, and three,
2026-10-06): Exile three, Design Vault two, MARWIX-SKILLS none. **Remove** `designVaultShot3`
from `lib/images.ts` (done 2026-10-07). **2026-10-09: remove** `marwixSkillsShot1`–`3` from
`lib/images.ts`, the last `null` shot entries; nothing else names them. Shots and alts stay
equal-length tuples per project, so they can't drift.

| Name (`lib/images.ts`) | Shows (alt-text meaning) | Where | Ratio | Crop | `sizes` |
|---|---|---|---|---|---|
| `exileShot1` | The Exile Bot website's home page, with a calculation result card | big | 2:1 | `object-cover object-center` | `min(100vw, 1536px)` |
| `exileShot2` | Exile Bot's owner dashboard, its home view: what is running and the most used commands | detail | 4:3 | `object-cover object-top` | `(min-width:1536px) 760px, (min-width:640px) 50vw, 100vw` |
| `exileShot3` | The dashboard's spam and raid protection settings, with protection on | detail | 4:3 | `object-cover object-left` | as `exileShot2` |
| `designVaultShot1` | Design Vault's Palettes view: a grid of saved colour palettes, each card showing its swatches and the colours' names | two-shot, first | 2:1 | `object-cover object-top` | `min(100vw, 1536px)` |
| `designVaultShot2` | Design Vault's Fonts view: a grid of saved fonts, each card a preview of the typeface over its name | two-shot, second | 2:1 | `object-cover object-top` | `min(100vw, 1536px)` |
| ~~`marwixSkillsShot1`–`3`~~ | **Removed 2026-10-09:** MARWIX-SKILLS has no shots (§7.9) | n/a | n/a | n/a | n/a |

`placeholderTone="cream"` on all. 1648 is where the 1536 column stops growing (1536 + two 56px
gutters). An alt says what is on the screen and stays inside the facts: no number read off a
screenshot, no name the facts don't allow.

**Exile's three files (the user, 2026-10-06, confirmed later that day).** They are used as
supplied, not cropped first; the frame's `object-cover` does the cropping. Sources are in
`temp/project-images/screenshots/` and go to `public/images/exile/`. There is no separate Discord
calculation shot: the home page shows a result card. Pixel positions are read off the files.

| Name | Source → file | Source | The frame keeps | The frame cuts |
|---|---|---|---|---|
| `exileShot1` | `exile-home.webp` → `home.webp` | 1908×728 (2.62:1), no nav bar | the full height and the middle 1456px (x 226–1682): the whole headline, the stats strip, the result card, the character's face | 226px on each side: empty grid on the left, a sliver of the character's right shoulder and arm |
| `exileShot2` | `exile-dashboard-home.webp` → `dashboard.webp` | 1920×1848 (1.04:1) | the full width and the top 1440px: the nav, the welcome card, Quick Actions, Active Systems (what is running), the first four rows of Recent Activity and Top Commands | the bottom 408px: the fifth row of both lists, sliced, and all of Recommendations |
| `exileShot3` | `exile-dashboard-spamraid.webp` → `spam-raid.webp` | 1920×951 (2.02:1) | the full height and the left 1268px: the page's title and intro, "Protection is on", the whole Detection Profile card | the right 652px, a third of the page: the two status boxes, the whole Quick Overview card, Cross-server enforcement |

- **`exileShot1`, `center`:** no height is cut, so `top` no longer matters. What the frame keeps
  is 1456×728, 80px under the big slot's 1536×768: from 1648 up it is stretched 5.5%, and on a 2×
  laptop it has about half the pixels the slot can show (§7.8 31).
- **`exileShot2`, `top`:** the page starts whole, from its nav. `center` would slice the welcome
  card through its title and the character's head; `bottom` would start mid-card. With `top` the
  frame shows the community's name, its server ID, member count, uptime and credits balance, which
  the brief's dropped crop had left out (§7.8 32).
- **`exileShot3`, `left`:** a 4:3 frame loses a third of a 2:1 page whatever the position.
  `SiteImage`'s present positions all centre it sideways, which slices both columns mid-sentence
  (x 326–1594 cuts the page title, every label on the left and every line of Quick Overview).
  `left` keeps one column whole and readable, and needs one key added to `SiteImage`'s position
  map (`left: "object-left"`; constitution §9, extend). What it loses is the page's plain-words
  summary, so this is the user's call (§7.8 33).
- **Per-shot position:** `lib/proofs.ts` holds a shot's position beside its name. A shot without
  one keeps its slot's default (three shots: big `top`, details `center`; two shots: `top` for
  both), so Design Vault sets none.
- **`exileShot3` puts spam protection in part 3,** ahead of the showcase (part 6) that introduces
  it. That is the user's call (§7.8 20); its alt names the page and adds no claim.

**Design Vault's two files (the user, 2026-10-07).** Light-theme screenshots, used as supplied,
not cropped first. Sources are in `temp/project-images/design-vault/` and go to
`public/images/design-vault/`. Both are about 2:1, so the frame cuts almost nothing and `top`
(the slot default) shows no difference from `center`.

| Name | Source → file | Source | The frame keeps | The frame cuts |
|---|---|---|---|---|
| `designVaultShot1` | `DV_palettes.png` → `palettes.webp` | 1907×947 (2.01:1) | the full height and the middle 1894px: the app bar, the Palettes title, the search row, six whole palette cards and the tops of three more | about 6px at each side, empty page margin |
| `designVaultShot2` | `DV_fonts.png` → `fonts.webp` | 1906×948 (2.01:1) | the full height and the middle 1896px: the app bar, the Fonts title, the search and licence row, three whole font cards and three more cut above their foot | 5px at each side, empty page margin |

- **The alts read nothing off the shots:** no palette's or colour's name, no hex value, no font's
  name, weight or date, though the shots show them. The Fonts alt leaves out the licence each
  card shows: the facts say the vault keeps fonts, not their licences (§7.8 39).
- **At 360 the frames are 320×160:** the palette swatches and font previews read as shapes, the
  card text does not. The shots show the thing; the paragraph beside them says it. Screen check.
- **`lib/images.ts`:** the files go in the entries' `dark` key, which names the site theme the
  image is shown in (the only one in v1), not the shot's own colours.

**Source sizes (new 2026-10-06, so an under-sized file is caught before it ships).** A slot is
largest from 1648 up, 4K included. `next/image` never enlarges a file, so one under the minimum
is stretched by the browser at 4K. The size that counts is the part of the file the frame keeps.

| Slot | Largest drawn | Minimum kept area (1×) | Target (2×) | Files supplied |
|---|---|---|---|---|
| Big shot, 2:1 (both of the two-shot layout's frames too) | 1536×768 | 1536×768 | 3072×1536 | `exileShot1` 1456×728: **under the minimum**. `designVaultShot1` 1894×947 and `designVaultShot2` 1896×948 kept (2026-10-07): over the minimum, under the target, so both ship |
| Detail shot, 4:3 | 758×568 | 760×570 | 1520×1140 | `exileShot2` 1920×1440: over the target. `exileShot3` 1268×951: over the minimum, under the target |
| Eva tile, 1:1 (§7.6.1) | 128×128 | 384×384 (3×, for phones) | none | 520×520: passes |

- **A file under the minimum fails the ship check,** like a `null` entry, unless the user accepts
  it by name here (§7.8 31). The target keeps a shot sharp on a 2× screen; a file between the two
  ships.
- **A file's ratio decides its crop.** `object-cover` trims a wider file at the sides and a
  taller one at the top or bottom, by the shot's position. The frame is the only crop.
- **The shots are screenshots in `rounded-3xl` frames on cream:** Exile's are dark-theme, Design
  Vault's light-theme (the user, 2026-10-07). A screenshot's pixels are image content, like Eva's
  colours (§7.3.4), not the site's theme; constitution §5's "dark only" governs the site's theme
  and is unchanged. **Edge risk, for the lead's screen check:** Design Vault's white app bar and
  pale page sit close to `cream` in lightness, so the frames' rounded edges, and the 20px gap
  between the two stacked shots, may barely read. Check at 360 and 1440. A hairline is proposed,
  not decided (§7.8 38).

#### 7.6.1 Eva on the diagram's tiles (new 2026-10-06; the Exile view only)

Superseded 2026-10-06 (the user's pick, the ink stage): the figures' files, sizes, `sizes` strings and alt are in [`07-proofs-spam.md`](07-proofs-spam.md) (Images).

### 7.7 Components and motion

- **Components:** `components/home/proofs/ProofsSection.tsx`, `ProofCard.tsx`, `ProjectTakeovers.tsx`
  (renders the three dialogs and the controller), `ProjectTakeover.tsx`,
  `TakeoverTopBar.tsx`, `TakeoverInfoRows.tsx`, `TakeoverInfoRow.tsx` (one `<dt>`/`<dd>` pair),
  `TakeoverStats.tsx`, `TakeoverShots.tsx`, `ProjectVisitLink.tsx` (the Visit pill),
  `TakeoverCloseLink.tsx` (client), `TakeoverNextLink.tsx` (client), `TakeoverController.tsx`
  (client, renders nothing); `hooks/useHashTakeover.ts`; `lib/proofs.ts` (project order, ids,
  image names, next project); `lib/takeoverLinks.ts` (Close and Next click handling).
- **New, one part per file (all server):** `ProofBanner.tsx` (stage, ground, break-out layer),
  `ProofBot.tsx` (the SVG and its tree), `ProofBotDefs.tsx` (gradients, strip clip, shadow filter),
  `ProofBotSolid.tsx` (one extruded shape), `ProofBotEye.tsx` (one recessed eye), `ProofBotProp.tsx`
  (the project's prop and its act parts), `ProofLine.tsx`. Data: `lib/proofBotBody.ts` (viewBox,
  lean, look, arms, glints; re-exports the Process geometry it reads), `lib/proofBotProps.ts`,
  `lib/proofBotDepth.ts`, `lib/proofBotShades.ts`. `lib/proofs.ts` gains `proofProp(key)` (Exile
  `phone`, Design Vault `fan`, MARWIX-SKILLS `puzzle`) and `proofBotIds(targetId)`, and drops `card`.
  `lib/processBots.ts`: `export` on `strips`, `feet`, `eyesAt` only. Later: `hooks/useProofBots.ts`,
  `lib/proofBotMotion.ts` (numbers).
- **Takeover parts (2026-10-05), to add,** one part per file in `components/home/proofs/`:
  `TakeoverPart.tsx` (the frame of parts 2–6: eyebrow and headline, body, wide slot),
  `TakeoverIntro.tsx` (part 1), `TakeoverTook.tsx` (part 4) and `TakeoverItem.tsx` (one titled
  line, parts 4 and 5), `TakeoverShowcase.tsx` (part 6's status and paragraph), the `Showcase*` diagram files
  (`ShowcaseDiagram.tsx`, `ShowcaseStep.tsx`, `ShowcaseImageFigure.tsx`, `ShowcaseReturn.tsx`, …:
  the list is in [`07-proofs-spam.md`](07-proofs-spam.md), 2026-10-10), `TakeoverMeans.tsx`
  (part 7's ink panel), `TakeoverMeansLine.tsx` (client: the closing line, part 7's `<h3>`).
  `components/icons/EyeIcon.tsx`, `AlertIcon.tsx`, `LockIcon.tsx` (deleted 2026-10-06, below).
  `lib/showcaseDiagram.ts` (was `lib/spamDiagram.ts`: step keys and order per project). A `ProofProject` type beside the content it describes.
- **Part 5, What I learned (2026-10-05, later), the changes:**
  - **New:** `components/home/proofs/TakeoverLearned.tsx` (server; part 5's body: the `<ol>`,
    one `TakeoverItem` per lesson with its ordinal).
  - **Rename and extend:** `TakeoverTookItem.tsx` → `TakeoverItem.tsx` (one job: a titled line
    in a takeover part). Adds the optional `number` prop (§7.3.1 part 5); `data-anim` becomes
    `takeover-item`. Without `number` its markup is today's.
  - **Change:** `TakeoverTook.tsx` (the import only); `ProjectTakeover.tsx` (render part 5 between
    took and showcase when `whatILearned` is present, `part="learned"`, `label={labels.whatILearned}`,
    `headlineId={takeoverPartId(id, "learned")}`; header comment); `TakeoverPart.tsx` (comment
    only: parts 2 to 6; its `part` type follows `TakeoverPartKey`); `lib/proofs.ts`
    (`TakeoverPartKey` gains `"learned"`); `lib/proofProject.ts` (`ProofLearned`, optional
    `whatILearned`); `content/home.ts` (`copywriter`: `proofs.projects.exile.whatILearned`,
    `proofs.takeover.partLabels.whatILearned`).
  - **Reused unchanged:** `TakeoverPart`'s markup, `lib/listNumber.ts`, `metaLabelOnCream` and
    `condensed` from `lib/styles.ts`. **No change, re-test:** `hooks/useTakeoverMotion.ts` (part
    5 is a sibling of the `<h2>`, so it rises and fades with the others; check Next from the
    bottom of a taller Exile takeover).
- **To change:** `ProjectTakeover.tsx` (the new tree, §7.3; reads the optional keys),
  `TakeoverShots.tsx` (two or three shots, the two layouts, `data-anim="takeover-shot"`, the
  two-shot `sizes`), `lib/proofs.ts` (shot count per project, `ShotTriple` → a two-or-three tuple,
  `takeoverPartId(targetId, part)`), `lib/images.ts` (drop `exileShot3`), `lib/styles.ts` (add
  `takeoverText`, `monoPill`), `content/home.ts` (`copywriter`). (**Superseded in part
  2026-10-06,** below: one shot layout, a three-tuple, `exileShot3` back. **Then 2026-10-07,**
  below: two layouts again, a two-or-three tuple, the two-shot layout redrawn as two stacked 2:1
  frames.) **Reused unchanged:**
  `TakeoverTopBar`, `TakeoverCloseLink`, `TakeoverInfoRows`, `TakeoverInfoRow`, `TakeoverStats`,
  `ProjectVisitLink`, `TakeoverNextLink`, `BookCallLink` (`hero`), `ChevronRightIcon`,
  `hooks/useShownSet.ts`, `hooks/useSwapFade.ts`, `lib/shownSet.ts`, `lib/aboutPick.ts`,
  `lib/track.ts`, `lib/listNumber.ts`. **No change, re-test:** `hooks/useTakeoverMotion.ts`,
  `lib/takeoverTitleMorph.ts`, `lib/takeoverClip.ts`, `hooks/useHashTakeover.ts` (the dialogs are
  taller: run the open, close-while-scrolled, Next-from-the-bottom and direct-load flows again).
- **The Exile changes (2026-10-06; static, nothing built), the files:**
  - **Change (`web-coder`):** `components/home/proofs/SpamStepTile.tsx` (an Eva image on an ink
    tile, 96 / 128; the icons and the tone map go; header comment); `SpamStep.tsx` (the grid's
    columns and rows, the head, the number on the title's row); `SpamReturn.tsx` (the two leg
    offsets; header comment); `TakeoverShots.tsx` (the two-shot branch and its length check go;
    each shot's position read from `lib/proofs.ts`; header comment); `components/SiteImage.tsx`
    (one key, `left: "object-left"`, in its position map; nothing else); `lib/spamDiagram.ts`
    (add `spamStepImage`); `lib/images.ts` (re-add `exileShot3`, give the three Exile shots their
    files, add the three Eva entries, comment); `lib/proofs.ts` (`proofShotNames.exile` gains
    `exileShot3`; `ProofShots<T>` becomes a tuple of three; a shot's position beside its name;
    comments).
  - **Add, in `public/images/exile/`:** `home.webp`, `dashboard.webp`, `spam-raid.webp` (§7.6);
    `eva-watch.png`, `eva-spot.png`, `eva-stop.png` (§7.6.1).
  - **Delete:** `components/icons/EyeIcon.tsx`, `AlertIcon.tsx`, `LockIcon.tsx`. Only
    `SpamStepTile.tsx` imports them (checked across `components/`, `lib/`, `hooks/`, `app/` and
    `content/`, 2026-10-06), and an icon with no user is dead code (constitution §12). The shared
    `Icon.tsx` frame and every other icon stay.
  - **Copy (`copywriter`, `content/home.ts`):** `exile.rows.inUseStats[].value`,
    `exile.showcase.status`, the three `exile.shotAlts` (§7.5).
  - **Unchanged:** `ImagePlaceholder.tsx`, `SpamDiagram.tsx`, `TakeoverShowcase.tsx`,
    `TakeoverStats.tsx`, `ProjectTakeover.tsx`, `lib/proofProject.ts` (its `shotAlts` follows
    `ProofShots`), `lib/styles.ts`, every hook.
  - **Not these agents':** `docs/03-facts.md` (the two numbers) and the page docs
    (`page-doc-manager`, at the lead's word).
- **Design Vault's shots (2026-10-07; static, nothing built), the files:**
  - **Change (`web-coder`):** `components/home/proofs/TakeoverShots.tsx` (draws the layout the
    count picks: two shots, two stacked 2:1 frames; three, as built; header comment);
    `lib/proofs.ts` (`ProofShots<T>` a tuple of two or three; `proofShotNames.designVault` drops
    `designVaultShot3`; slot defaults per layout, two shots `top` and `top`; `proofImages` maps
    the names a project has instead of three fixed indexes; comments); `lib/images.ts`
    (`designVaultShot1` → `/images/design-vault/palettes.webp`, `designVaultShot2` →
    `/images/design-vault/fonts.webp`, delete `designVaultShot3`; its "three each" comment).
  - **Add, in `public/images/design-vault/`:** `palettes.webp`, `fonts.webp` (§7.6).
  - **Copy (`copywriter`, `content/home.ts`):** the two `designVault.shotAlts` (§7.5).
  - **Unchanged:** `SiteImage.tsx`, `ImagePlaceholder.tsx`, `ProjectTakeover.tsx`,
    `lib/proofProject.ts` (its `shotAlts` follows `ProofShots`), every hook. MARWIX-SKILLS keeps
    three `null` slots (superseded 2026-10-09: none, §7.9). If §7.8 38 takes the hairline, only
    `TakeoverShots.tsx`'s frame class changes.
- **MARWIX-SKILLS live without shots (2026-10-09; static, nothing built), the files:** §7.9
  (Components).
- **Motion (later), takeover and cards:** cards reveal on scroll (stagger 0.12s); hover lifts a card −8px. Open: the
  dialog's `clip-path` expands from the card's rect (`data-proof-card`) to full screen (0.75s), and
  `takeover-content` rises 40px and fades in after 0.35s. Close: clip back to the card (0.6s), then
  the hash change. Next: content rises 60px and fades in. Reduced motion: no `clip-path`, no rise
  and no lift. Cards only fade in on reveal. On open and on Next the dialog shows at once and
  `takeover-content` fades in without the rise; close is instant, then the hash change.
  (Built; refined by the page doc's 2026-09-26 to 2026-09-28 decisions.)
- **Motion (later), the takeover's parts (2026-10-05; nothing built).** The built open, close and
  Next motion needs no change: every part is one of the heading's siblings, so it rises and fades
  with them. The later pass adds reveals as the reader scrolls **the dialog** (the dialog is the
  scroller, not the page), once per open, on the inner hooks below. It never writes on
  `takeover-part` (the open and close own it), on `takeover-title`, or opacity on
  `takeover-means-line` (the swap fade owns it), and `reset(dialog)` must clear what it sets. A
  part already in view when the takeover opens takes the open's rise only.

| Hook (`data-anim`) | Element | Motion (later): what moves, from where, trigger | Reduced motion |
|---|---|---|---|
| `takeover-part` + `data-part` | each part, a direct child of the column (`data-part` `learned` for part 5) | none new: the open's rise and the close's fade, as built | as built |
| `takeover-intro`, `takeover-rows` | part 1's lead and rows wrapper | none new (above the fold on open) | n/a |
| `takeover-part-head` | the wrapper around a part's eyebrow and headline (parts 2–7) | fades up 24px as its part enters the dialog's view | fade only |
| `takeover-part-body`, `takeover-part-wide` | a part's content, its full-width slot (no wide slot in a part 3 without shots: Visit rides in the body, 2026-10-09) | fade up 24px, 0.08s and 0.16s after the head | fade only |
| `takeover-shot` | each shot's clipped frame (two or three per project since 2026-10-07; both layouts' frames carry it; none in MARWIX-SKILLS since 2026-10-09) | the image scales 1.06 → 1 inside the frame as it enters (the frame is the clip) | fade only |
| `takeover-item` (was `takeover-took-item`) | each took item (part 4) and each lesson (part 5); scope by the part's `data-part` | fade up 16px, 0.08s apart, with the part's body; a lesson's ordinal moves with its item, never alone | fade only |
| `showcase-diagram` (was `spam-diagram`; hooks renamed 2026-10-10, [`07-proofs-spam.md`](07-proofs-spam.md)) | the diagram | the trigger: plays once when it enters | all of it fades in together |
| `showcase-step`, `showcase-figure` (was `spam-tile`) | each step; the wrapper around the figure slot (Eva or Rix) | **Superseded 2026-10-10 by [`07-proofs-spam.md`](07-proofs-spam.md):** the figure rises from the floor (not a scale 0.8 → 1 pop), steps light 0.6s apart as built. Was: steps light in order, 0.25s apart: the figure pops (scale 0.8 → 1), Eva or Rix with it and never on her own; its number, title and line fade up | no pop |
| `showcase-link`, `showcase-chevron` | the hairline (`origin-left`), the chevron's wrapper | the hairline draws (`scaleX` 0 → 1), then the chevron fades in, before the next step | shown at once |
| `showcase-return`, `showcase-return-head`, `showcase-pill` | the dashed line, its arrowhead, the pill | after step 3: from `md` the line wipes in right to left (`clip-path` inset), then the arrowhead and the pill pop; on a phone the box fades up | fade only |
| `takeover-means-line` | the closing line's `<h3>`, inside part 7's `takeover-part-head` | the pick's swap fade only (0.15s out, 0.25s in; `lib/shownSet.ts`); the reveal writes on the head around it | the same |
| `takeover-book` | the wrapper around Book a call | fades up 24px, 0.08s after the panel's head | fade only |

- **Clip and the break-out:** the clip starts from the `<a>`'s rect only (`cardBox`, unchanged).
  The bot ducks out of the way first (user's choice, 2026-10-06; replaces "the break-out is covered
  as the clip grows"), so nothing of it is ever outside the clip. `lib/takeoverClip.ts` and the
  title morph need no change.
- **The title band (2026-10-07):** the title sits on an ink band (the column's classes, the
  `<h2>`'s classes and one new first child change, superseding "Kept exactly as built" in §7.3 for
  those), and the card banner morphs into the band on open and back on close, the title's colour
  following it: [`07-proofs-band.md`](07-proofs-band.md).
- **Motion (later), the bot:** the bot never follows into the takeover.
  - **Duck** (full motion; built, `lib/proofBotDuck.ts`): a plain click or Enter on a card first
    takes its `rise` to `y` +84 (below the floor) in 0.25s `power2.in`, then sets the hash, so the
    open starts 0.25s later. Every open takeover's bot is down by any route (a hash load, Next);
    once no takeover is open they all rise back with the reveal's rise (0.9s `back.out(1.3)`).
    Reduced motion: no duck, no delay.
  - **Reveal:** as its card reveals (so the three stagger 0.12s), `rise` goes from `y` +84 units
    (feet and all below the floor, hidden by the layer's clip) to 0 with a soft overshoot.
  - **Hover** (fine pointer, with the card's lift): `rig` rotates +4° (lean 10° → 14°), back on
    leave. The prop's act plays once per enter: the phone's `screen-lit` fades in and out; the fan's
    `swatch`es spread apart and close; the puzzle's `prop` tilts and snaps back to its grip with a
    small overshoot as `puzzle-lit` flashes.
  - **Idle:** `body` breathes (`scaleY`), arms drift, blinks (`eye` `scaleY`), and on a fine
    pointer `eyes` follow it along the gap diagonal (−7…7 around rest 7), as the Process bots do.
    Pause off screen, when the tab is hidden and while a takeover is open.
  - **Reduced motion:** no bot movement at all; the bot shows its pose and fades in with its card.
  - Teardown restores the server markup exactly (no leftover `style` or `transform` on hooks).

| Hook (`data-bot`) | Element | Pivot (bot units, rest space) | Moves (the only writers) |
|---|---|---|---|
| `rise` | g, outermost, screen space | none | `y` (reveal, duck, rise back after close) |
| `rig` | g, inside the static lean | 50 92 | `rotation` (hover lean) |
| `body` | g | 50 84 | `scaleY` (breathing) |
| `eyes` | g `data-look="7"` | none (translate only) | `x`/`y` (pointer) |
| `eye` ×2 | g (wall, walls, hole) | 37 43 / 77 43 | `scaleY` (blink) |
| `arm-left` / `arm-right` | g | 6 53 / 94 53 | `rotation` (drift) |
| `prop` | g, inside `arm-left` | grip: phone −4 53, fan −8 56, puzzle −6 52 | `rotation`, `x`/`y` (act) |
| `screen-lit` / `puzzle-lit` | g, `opacity-0` at rest | none | `opacity` |
| `swatch` ×4 | g | −8 56 | `rotation` (spread) |

`data-anim` hooks: `proof-bot-layer` (the break-out layer), `proof-bot` (the SVG, with `data-prop`);
`data-proof-card` and `proof-card-title` unchanged. Takeover: `takeover-content`, `takeover-bar`,
`takeover-title` and `takeover-next-title` unchanged; the new ones are in the table above.

### 7.8 Decided 2026-10-05 (the takeover), 2026-10-06 (the Exile view; items 23–33 are open for review), 2026-10-07 (Design Vault's shots; items 38–39 are open for review) and 2026-10-09 (MARWIX-SKILLS live without shots; items 42–46 are open for review)

2026-10-10 (MARWIX-SKILLS' rich takeover, Rix on the showcase diagram): its choices are Review 1–9 in [`07-proofs-spam.md`](07-proofs-spam.md), open for review.

Part numbers below follow the renumbering of 2026-10-05, later (What I learned is part 5, the
showcase part 6, the closing panel part 7).

**By the user:**

1. **Visit sits under the shots,** at the end of part 3. It stays with the proof and away from
   Book a call.
2. **No "Shown for" note in the takeover.** The closing line is written to its reader, and the
   pick can't change inside the modal.
3. ~~**Exile's two shots sit side by side from 640:** the website wide (2:1), the Discord result a
   square (1:1). No empty slot; the website is 872 wide at 1440.~~ **Superseded 2026-10-06 (20):**
   Exile shows three shots in the shared layout.
4. **Each of parts 2 to 7 has a small mono label and, under it, a headline written for that
   project in the display face.** The labels are the same six on every project
   (`proofs.takeover.partLabels.*`). The headline is the part's heading; the label is its eyebrow.
   This replaces the first draft's shared display-face labels.
5. **Part 1 has no label and no headline of its own.** The title is its heading, and the first
   row already reads WHAT IT IS.
6. **The closing part is an ink panel,** so the shared accent Book a call works unchanged and is
   the one accent button in the takeover.
7. **The showcase keeps its status line** (`showcase.status`): a skimming reader sees that it's
   live before the diagram. (Since 2026-10-06 with no count of communities, 21.)
8. **The diagram goes three across from 768** (columns 217px), rows below that.
9. **The return line is 2px dashed ink,** like the site's other loop lines.
10. **A missing card line falls back to the default line,** so nothing is filled in where the
    facts can't carry a line for some card.
11. **The diagram's step numbers 01–03 stay,** as ordinals hidden from screen readers. (Since
    2026-10-06 on the title's line, 26.)

**Settled in the spec from decision 4, at the lead's request:**

12. **Key shape:** each of parts 2–6 is one object under the project (`problem`, `whatIBuilt`,
    `whatItTook`, `whatILearned`, `showcase`), holding its `headline` beside its content. An
    optional part is one optional key.
13. **Part 7's closing line is its headline.** `meansForYou` keeps its shape (one line per set);
    there is no separate headline key and no paragraph in part 7.
14. **Headline sizes:** 32px (`text-step`) in parts 2–6, where it wraps to two or three lines in
    the left third; the closing line one size up (`text-card`, 30–44px) in its wide column.
15. **Part 7 doesn't use the rail:** from `lg` the line takes the left two thirds and Book a call
    sits at the panel's bottom right.

**By the user, 2026-10-05, later (What I learned):**

16. **An optional part, What I learned,** with the same label and own-headline pattern
    (`partLabels.whatILearned`), right after What it took and before the showcase and the closing
    panel. Exile has it (three lessons, from the facts); Design Vault skips it for now. Exile has
    seven parts, Design Vault four. Each lesson is said as how the user works now.

**Settled in the spec from decision 16, at the lead's request:**

17. **The lesson reuses the took item** (`TakeoverTookItem` renamed `TakeoverItem`, with an
    optional ordinal), so the takeover keeps one item look. It is told apart by **numbered items
    in one column on the 576 measure**, against took's unnumbered two-across grid. Not chosen:
    the same grid unnumbered (back to back with part 4 it reads as one list), and three across
    from `md` (about 173px columns at 1024, too narrow for the lines).
18. **48 hours and 700+ are not emphasised;** they stay in the lines' text. Setting them as
    figures would need a figure slot split out of the copy, only two of the three lessons have
    one, and it would make a second stat block competing with IN USE's 18+ and 3.9K+.
19. **Compact on phones:** the ordinal on the title's line, the line full width, 24px between
    items, no wide slot and no image. About 620px at 360 for Exile.

**By the user, 2026-10-06 (the Exile view; source `temp/project-images/brief.md`, with the shot
subjects confirmed through the lead later that day):**

20. **Exile shows three screenshots, not two,** in the layout Design Vault uses: the Exile Bot
    website's home page wide (2:1), then two 4:3 details, the dashboard's home view and the
    dashboard's spam and raid protection settings. There is no separate Discord calculation shot,
    because the home page shows a result card. The files are used as supplied, not cropped first.
    Reverses 2026-09-28, decision 3, and the brief's own lines that the settings page is not
    shown and that the dashboard arrives cropped.
21. **The in-use numbers are 18+ communities and 3.9K+ commands run,** matching the live Exile
    site, which the home-page shot shows. They are floors, and they belong to the calculations and
    simulations use only. **The showcase's status carries no count of communities;** it still
    says the spam protection is live (the user confirmed the fact the same day).
22. **Eva, Exile Bot's own mascot, is on the diagram's three tiles,** holding each step's symbol,
    in place of the icons. In the user's words this is the one exception to "no generated art on
    the site", and it covers the Exile view only; the site's own mascot stays everywhere else.
    The tile grows to fit her.

**Settled in the spec from decisions 20–22 (open for the lead's and the user's review; specced
with the first option of each):**

23. ~~**The two-shot layout is removed,** from the spec and from `TakeoverShots.tsx`, and
    `ProofShots` becomes a tuple of three. Or: keep it unused for a later project (dead code
    until then).~~ **Superseded by the user, 2026-10-07 (34):** a project has two or three shots,
    and the two-shot layout returns, redrawn as two stacked 2:1 frames.
24. ~~**Eva's crop: the tight set.** Or: the waist-up set, whose cut needs no checking but whose
    symbol is about a quarter smaller at the same tile (§7.6.1).~~ **Superseded by the user's pick,
    2026-10-06 (the ink stage):** the three 491px files in `public/images/exile/` are used as they
    are ([`07-proofs-spam.md`](07-proofs-spam.md), Images).
25. ~~**Tile sizes: 96 below `md`, 128 from `md`,** the same at 1440 and 4K. Or: 128 on phones too
    (a 176px text column, about 24 characters a line); or the tile above the text on phones
    (about 350px more height); or 160 from `lg`.~~ **Superseded by the user's pick, 2026-10-06:**
    no tiles; Eva is 148 on phones and 144 / 192 / 248 from `md` / `lg` / `xl`
    ([`07-proofs-spam.md`](07-proofs-spam.md), Sizes).
26. **The step number sits on the title's line,** as a lesson's does. Or: beside or under the
    tile as before, which makes the phone row 22px taller and puts a number in the link's row.
    **Decided by the user's pick, 2026-10-06: kept,** at every width (on the band on phones, on
    cream from `md`; [`07-proofs-spam.md`](07-proofs-spam.md)).
27. ~~**All three tiles are ink; step 2 loses its accent fill.** Or: keep step 2 violet, after
    checking Eva's edges and glows on violet; or no tile, Eva straight on cream.~~ **Superseded by
    the user's pick, 2026-10-06:** no tiles; one ink band from `md`, one ink band per step below
    it ([`07-proofs-spam.md`](07-proofs-spam.md)).
28. **The Eva images are decorative,** with an empty alt and no content slot. Or: an alt naming
    her, which needs a line in the facts file and a slot for `copywriter`.
29. **Clear margin under Eva's cut is trimmed from the file's canvas** on the way into `public/`.
    Or: the user re-exports the three files with the cut on the bottom edge.
30. **Screenshot sizes: a 1× minimum (1536×768, 760×570) that must be met, and a 2× target.** Or:
    hold every shot to the 2× target.
31. **`exileShot1` ships as supplied, 80px under the minimum** (1456×728 kept; stretched 5.5% from
    1648 up, soft on 2× laptops). Or: the user retakes it at 2:1 and double resolution, as the
    brief first planned.
32. **`exileShot2` is anchored to its top,** so the dashboard starts whole and the frame shows
    the community's name, server ID, member count, uptime and credits balance. Or: `bottom`,
    which hides the name, the member count and the balance but starts mid-card and still shows
    the server ID; or a file cropped first.
33. **`exileShot3` is anchored to its left in the 4:3 slot,** losing the right third of the page
    (the status boxes and Quick Overview) and adding a `left` position to `SiteImage`. Or: the
    user retakes the page in a narrower window, near 4:3, so it reflows and nothing is cut; or
    another slot or layout for this shot, which is the user's call and is not drawn here.

**By the user, 2026-10-07 (Design Vault's shots; source `temp/project-images/design-vault/`):**

34. **The shot count is per project: two or three.** Three is the big 2:1 over two 4:3 details
    (Exile keeps exactly this); two is two 2:1 frames stacked at the full column width, the same
    at every width (no side-by-side breakpoint). Supersedes 23. (Widened 2026-10-09 to none, two
    or three, 40.)
35. **Design Vault has two shots,** its Palettes view and its Fonts view, supplied as light-theme
    files about 2:1 and anchored `top` (the slot default). `designVaultShot3` is removed. Both
    are over the big slot's 1× minimum and under its 2× target, so both ship.
36. **Light screenshots are allowed.** A shot's pixels are image content; constitution §5's
    "dark only" governs the site's theme.
37. ~~**MARWIX-SKILLS (hidden) keeps three placeholder slots** for now.~~ **Superseded by the
    user, 2026-10-09 (40):** MARWIX-SKILLS has no shots.

**Settled in the spec from decisions 34–37 (open for the lead's review):**

38. **A hairline round the shot frames, if the pale shots lose their edge on cream.** Specced
    without one; the lead decides after the screen check at 360 and 1440. **Recommended:** if
    Design Vault's frames don't hold their edge, add `border border-ink/15` (the takeover's
    existing hairline) to **every** shot frame, Exile's too, so the frames keep one look; against
    the dark shots it barely shows. The border sits inside the frame's box (`border-box`), so the
    2:1 and 4:3 ratios and the `data-anim` clip are unchanged, and the image is 2px smaller each
    way. Or: no hairline, letting the swatches and cards give the frames their shape; or the
    hairline on light shots only (a per-shot flag in `lib/proofs.ts`, and two frame looks).
39. **The Fonts alt leaves out the licence** each card shows, because the facts say the vault
    keeps fonts, not their licences. Or: add one line to `docs/03-facts.md` (the user's) so the alt
    can say each font is kept with its licence.

**By the user, 2026-10-09 (MARWIX-SKILLS goes live):**

40. **MARWIX-SKILLS goes live without screenshots.** Its takeover has no shots block at all, for
    this project only. Exile (three shots) and Design Vault (two) stay exactly as they are.
    Supersedes 37, and for MARWIX-SKILLS the 2026-09-24 page-doc decision that it "gets takeover
    shots like the others". A project now has none, two or three shots.
41. **The MARWIX-SKILLS card is shown again:** `hiddenProofs` in `lib/proofs.ts` becomes `[]`. The
    grid is three cards (§7.1); MARWIX-SKILLS is 03 of 03, and Next wraps from it to Exile.

**Settled in the spec from decisions 40–41 (open for the lead's review):**

42. **No shots means part 3 closes up; nothing fills the space.** The part keeps its frame
    (hairline, eyebrow, headline, paragraph) and drops the wide slot entirely; Visit moves into
    the body, 24px under the paragraph. Not chosen: (b) Visit alone in the wide slot, which from
    `lg` puts it under the rail, a column away from the paragraph it backs, after an `mt-3` row
    with nothing above it; (c) a stand-in visual (an ink stage with the puzzle bot, or a drawn
    "skill at work"), which is new content outside the facts (constitution §12) and would echo
    the card rather than show the thing.
43. **Data shape: an empty tuple, not an optional key.** `ProofShots<T>` stays the two-or-three
    tuple `TakeoverShots` draws; a new `ProofShotSet<T>` (`readonly [] | ProofShots<T>`) types a
    project's shot names and `shotAlts`, and MARWIX-SKILLS has `[]` on both sides, so the
    existing `length` tie still checks them (a written alt with no shot, or a shot with no alt,
    fails the type check). Not chosen: `shotAlts?` optional and no `proofShotNames` entry, like
    the optional parts: the tie between the two files would need a conditional type, and a
    missing key reads as forgotten where `[]` reads as decided.
44. **Three cards at `md`: the third sits alone on row two, left-aligned, at the same width,**
    as built before the hide (`proofGridColumns` unchanged). Not chosen: centre the lone card on
    row two (one more class string, and the cards no longer share a left edge), or stack until
    `lg` (cards 706 wide at 768, bots 388 tall).
45. **The titles keep their one break chance.** Neither the card `<h3>` nor the takeover `<h2>`
    may gain `wrap-break-word`, `break-words`, `break-all` or `hyphens-auto` (none has one today),
    so "MARWIX-SKILLS" breaks only after its hyphen, at every width (§7.9). Where the card and
    the takeover set it on different line counts (768 to about 1550), the built title morph
    crossfades (0.15s), as for any project.
46. **No new token, component or content slot.** The change is one flag, one type, three image
    entries removed, one content array emptied, and Visit's place in part 3.

### 7.9 MARWIX-SKILLS live, with no shots (the user, 2026-10-09; static, not built yet)

This change's one question: **does a takeover with no screenshots still read as finished?** It
does if part 3 closes up around what it has (eyebrow, headline, paragraph, Visit) and keeps no
empty frame. Exile and Design Vault are unchanged. The v3 reference has no zero-shot case; this
follows the takeover's own part pattern.

- **The card is back.** `hiddenProofs = []`. Every consumer reads `shownProofKeys`, so the card,
  its takeover, the numbers (MARWIX-SKILLS 03, the total 03), Next (Design Vault → MARWIX-SKILLS →
  Exile) and `#marwix-skills` return with no other change. The grid is §7.1's; §7.4's card and bot
  rows hold again. The two-shown arm-clearance note (page doc, Open Questions) doesn't apply while
  three are shown: at 1440 a bot's right clears the next card by 28.
- **Part 3 without shots.** `TakeoverPart` gets no `wide`: no `takeover-part-wide` div, no `mt-3`
  row, no empty gap. `ProjectVisitLink` is the body's last child, after the paragraph; the body's
  `flex flex-col items-start gap-6` puts it 24px under the last line. Below `lg`: eyebrow,
  headline, paragraph, Visit in one column. From `lg`: head in the rail; paragraph and Visit beside
  it, Visit's left edge on the paragraph's. The part is as tall as its words, like part 2 plus a
  button.
- **Why it doesn't look broken:** each part keeps the same hairline, eyebrow and headline, so a
  headline skim finds no hole; the ink band at the top and the ink panel at the bottom frame the
  takeover; the gap after part 3 is the usual 40 / 56 / 72. ~~MARWIX-SKILLS shows parts 1, 2, 3
  and 7, like Design Vault.~~ **2026-10-10:** it shows all seven parts, like Exile.
- **Takeover height:** ~~on a 4K window it may not scroll~~ **2026-10-10:** the takeover is now
  about 5,000px at 360 (estimate) and always scrolls at 4K ([`07-proofs-spam.md`](07-proofs-spam.md)).
  Screen check.
- **Titles:** "MARWIX-SKILLS" has one break chance, after the hyphen (§7.8 45). Widths are
  estimates: Acosta letters about 0.9em, the IBM Plex Sans Bold hyphen about 0.35em. At 360 the
  takeover title is two lines, as Design Vault's is, so its condensed strip is the taller one
  there (page doc, Open Questions).
- **Motion (later):** nothing new. No wide slot means no `takeover-part-wide` and no `takeover-shot`
  hooks; Visit moves with `takeover-part-body` (fade up 24px, 0.08s after the head). The parts'
  reveal finds hooks per part and never assumes part 3 has a wide slot. Open, close, Next and the
  card bot (puzzle, built) are unchanged.
- **States:** Visit as §7.3.4 (`bg-ink text-cream`; hover `bg-accent text-on-accent`;
  focus-visible 2px `outline-ink`, 2px offset; active `bg-accent/80`). Card as §7.2. Tab order
  Close, Visit, Book a call, Next.
- **Tokens:** `cream`, `ink`, `cream-muted`, `ink/15`, `text` (title on the band), `accent` and
  `on-accent` (Visit hover, Book a call); `font-display` (Acosta), `font-body` (IBM Plex Sans),
  `font-mono` (IBM Plex Mono); `text-card`, `text-takeover`, `text-step`, `text-lead`, `text-body`;
  `rounded-3xl`, `rounded-full`. None new.
- **Content slots:** `proofs.projects.marwixSkills.shotAlts` becomes `[]` (no alt: no shot). No new
  slot. Every other MARWIX-SKILLS slot is already filled.
- **Images:** none. `marwixSkillsShot1`–`3` leave `lib/images.ts`.
- **Components (reuse; nothing new):**
  - `lib/proofs.ts`: `hiddenProofs = []` (flag and comment stay); add `ProofShotSet<T>`;
    `proofShotNames` typed with it, `marwixSkills: []`, the `length` tie to `shotAlts` unchanged;
    `proofImages(key).shots` and `proofShotsWithAlts` return `ProofShotSet`; `zipShots` pairs two
    empties to `[]` and still throws on any length mismatch; `slotPositions` and
    `proofShotPositions` unchanged.
  - `lib/proofProject.ts`: `shotAlts: ProofShotSet<string>`.
  - `lib/images.ts`: delete `marwixSkillsShot1`–`3`.
  - `ProjectTakeover.tsx`: the one place that decides. Shots → part 3's `wide` is `TakeoverShots`
    then Visit, as built. None → no `wide`; Visit follows the paragraph in the children.
  - `TakeoverShots.tsx`: still draws only two or three; it is never given none, so it never
    renders an empty wrapper (header comment).
  - `content/home.ts` (`copywriter`): `marwixSkills.shotAlts: []`. It lands with the type change,
    or the type check fails.

#### Sizes (§7.9; Acosta sizes from the current tokens)

| Element | Classes (phone first) | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|---|
| Grid | `grid gap-x-12 gap-y-8 md:grid-cols-2 lg:grid-cols-3` (`proofGridColumns`) | 1 column | 2 across; MARWIX-SKILLS alone on row 2, left | 3 across | 3 across |
| Card W / its text column (`px-6`) | `li` `pt-[11.2%]`; card unchanged | 320 / 272 | 329 / 281 | 411 / 363 | 480 / 432 |
| Card title, MARWIX-SKILLS | `font-display text-card leading-none decoration-1 underline-offset-4 group-hover:underline` | 25px, about 279 whole: one line or "MARWIX-" (144) / "SKILLS" | 28.8px: two lines, "MARWIX-" 165 | 35px: two lines, "MARWIX-" 201 | 36px: one line, 401 |
| Takeover title box (band − title margins) | `h2` unchanged: `mx-5 mt-5 mb-4 … md:mx-8 … lg:mx-12 …` | 280 | 643 | 1232 | 1440 |
| Takeover title, MARWIX-SKILLS | `font-display text-takeover leading-none text-text` | 34px: two lines, "MARWIX-" 196 | 52.9px: one line, 590 | 84px: one line, 937 | 100px: one line, 1115 |
| Part 3 frame, no shots | `TakeoverPart`, no `wide` | one column, 320 | one column, 706 | rail 429 + 40 + body 859 | rail 499 + 40 + body 997 |
| Paragraph | `{takeoverText}` (`max-w-xl text-lead leading-normal text-pretty text-ink`) | 17px in 320 | 17px in 576 | 17px in 576 | 17px in 576 |
| Visit, the body's last child | `{pillInk} min-h-12 gap-2 self-start px-6 text-body font-semibold` | 48 tall, about 240 wide, 24 under the paragraph | same | same, left edge on the paragraph's | same |
| Part 3 height (hairline to Visit's foot) | | about 520 | about 370 | about 300 | about 300 |
| Gap to part 7 | column `gap-10 md:gap-14 lg:gap-18` | 40 | 56 | 72 | 72 |
| Whole MARWIX-SKILLS takeover | Stale since 2026-10-10 (parts 4–6 added): about 5,000 at 360, always scrolls at 4K; other widths not re-estimated ([`07-proofs-spam.md`](07-proofs-spam.md)) | about 5,000 | not re-estimated | not re-estimated | scrolls |

Tightest card column is 1024 (234, "MARWIX-" 179); the takeover title flips from one line to two
near 580 (box 475 at 560, 549 at 640). Heights and widths are estimates for the screen check at
360, 768, 1024, 1440 and 3840.
