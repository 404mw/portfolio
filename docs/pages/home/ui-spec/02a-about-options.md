# §2a About, three options (A, B, C) on `/dev`: UI spec

Shared rules and parts (§0): [`../ui-spec.md`](../ui-spec.md). Current built spec: [`02a-about.md`](02a-about.md).
Page doc: [`../sections/02a-about.md`](../sections/02a-about.md). Rix's rig: [`05-process.md`](05-process.md) §5.6–5.7.

**Last Updated:** 2026-10-01 (new, temporary). The user compares A, B and C on `/dev`. The winner is
merged into `02a-about.md`; this file, `/dev` and the two losing options are deleted. `/` keeps the
current About build until the user picks. The user's answers (2026-10-01) are applied: O7 is decided.

> **Superseded 2026-10-03:** `/dev` is deleted. `useAboutPick(name)`, `WhatsAppLink`'s `pickName`
> and `pageMetadata`'s `noindex` (lines ~88, 93, 389-390, 405, 432, 435) no longer exist;
> `useAboutPick` now always reads home's About group. Kept as the record of the option build.

## 2a.O0 Shared by every option

**The one question:** "Can he help someone like me?", with the short "who I am" as its set-up.
**Not a chat (the user's decision, 2026-10-01):** no bubbles, no thread, no chat header, no typing
dots and no "from Rix" panel. The chat panel is retired and is not one of the options. The options
have the same content and the same behaviour. They differ in layout and in how Rix relates to the
picks. **Rules carried over unchanged from §2a.2:**
- **Never a gate:** no overlay, scroll lock, focus move or scroll on arrival.
- **Works without JS:** native radios and CSS `:has`.
- **`?for=`** is applied after load.
- **A pick** sets the WhatsApp links through `WhatsAppLink` and `useAboutPick`.
- **Size and access:** phone first from 360 to 3840 with no sideways scroll, tap targets of at
  least 44px, contrast of at least 4.5:1.
- **Tokens:** only existing tokens; this file needs no new one.

- **Frame (§0.1):** `<section id={scope.sectionId} data-about-option={scope.option} class="scroll-mt-20 px-gutter">`
  → `<div class="group/about {container} border-t border-line py-section">`. Each option root
  carries its own `group/about`, and the options are siblings, never nested. The `/dev` wrapper
  never uses `group/about`.
- **Intro:** `AboutIntro` (`data-anim="reveal"`) as built, plus a `layout` prop: `stack` (C; the
  current look), `center` (A) or `split` (B). The option body after it gets
  `data-anim="reveal" data-anim-delay="150"`.
- **Acks:** `AboutAck` renders one `<p data-anim="about-ack" class="hidden {replyShow.block[i]} text-summary leading-snug text-pretty text-text">`
  per reply. Only the picked reply's ack shows; another pick swaps it. Each option sets its own
  placement classes. `AboutStatus` (one per option) announces the ack on a trusted pick only (as built).
- **Rix's name** appears only in `about.rix.buttonLabel` (and in any line copywriter writes). No
  option uses `about.chat.title`. It stays in content while `/` renders the chat build, and is
  removed together with the old build (decided 2026-10-01).

### O0.1 Rix (`RixButton`, `RixProps`, `RixQuip`, `RixStatus`)

- **`RixButton`** (client): `<button type="button" data-anim="about-rix" aria-label={about.rix.buttonLabel} class="relative block shrink-0 cursor-pointer rounded-2xl {focusRingCard} {size}">`
  → `children` = the server `ProcessBot role="host" pose="idle" className="block size-full"`
  (`data-anim="process-bot" data-role="host"`, all §5.6 `data-bot` hooks), then `RixQuip`.
  **Without JS** (and in server markup) it renders the same box as a `<span>`, decorative. A
  hydrated flag (`useSyncExternalStore`: `false` on the server, `true` on the client) swaps in the
  `<button>`, so no-JS visitors never meet a dead control. Motion setup waits for the button.
  `RixStatus` (client, a sibling) is a `<p class="sr-only" aria-live="polite">` that holds the
  current poke line, and only that.
- **`ProcessBot`** gains optional `children`, rendered last inside `upper`. Process passes none.
- **`RixProps`** (server; geometry in the new `lib/rixProps.ts`): `<g data-bot="props">` holds, for
  each reply with a prop, `<g data-bot="prop" data-prop={name} data-prop-for={i} class="opacity-0 {replyShow.opacity[i]}">`.
  **The picked group's prop shows in Rix's right hand with no JS** (CSS `:has`). The props are
  flat token fills with 45° cuts (the bots' language). Each one sits just right of the hand tip
  (x 104, y 50–56), clear of strip C and inside the viewBox (x ≤ 130).
  The reply-key → prop map lives in `lib/aboutReplies.ts` (sample keys; real groups need their own).

| `data-prop` | Sample group | Parts `d` (fill) | Flourish part, pivot |
|---|---|---|---|
| `calendar` | small-business | base `M106 26H130V48H106Z` (C); band `M106 26H130V31H106Z` (I); rings `M110 23h3v5h-3Z M123 23h3v5h-3Z` (M); `tick` `M112 39L114.5 36.5L117 39L122.5 33.5L125 36L117 44Z` (I) | `tick`, 118.5 38.5 |
| `shield` | communities | shield `M106 24H130V38L118 50L106 38Z` (C); tick `M111 35L114 32L117 35L123 29L126 32L117 41Z` (I) | whole, 118 50 |
| `send` | startups | arrow, up-right `M106 44L120 30H113V25H130V42H125V35L111 49Z` (C) | whole, 118 50 |
| `report` | agencies | sheet `M106 24H124L130 30V50H106Z` (C); fold `M124 24V30H130Z` (D); `bar` ×3 `M110 42h4v5h-4Z` · `M116 37h4v10h-4Z` · `M122 33h4v14h-4Z` (B) | each `bar`, 112 47 · 118 47 · 124 47 |
| `envelope` | creators | body `M106 30H130V48H106Z` (C); `flap` `M106 30H130L118 42Z` (D) | `flap`, 118 30 |
| none | just-looking | no prop: a shrug (O4) | |

Flourish parts carry `data-prop-part="tick|bar|flap"`. Every path gets `fill-rule="evenodd"`, as on Process.

- **`RixQuip`**: `<span data-anim="about-quip" aria-hidden="true" class="pointer-events-none absolute font-mono text-nav leading-snug text-text opacity-0 {placement}">`.
  It is empty in server markup, and motion writes the line into it. **It is never a bubble:** no
  background, border or tail. Its placement is set per option, always inside the option's own
  free space, so a quip never moves the layout or crosses text.

### O0.2 Three options on one page: scoping

- **New `lib/aboutScope.ts`** (pure): `aboutScope(option?: "a" | "b" | "c")` →
  `{ option, sectionId, name, id(part) }`. On `/` (no option) it returns `about`, `about-for` and
  `about-<part>`, so the home markup is unchanged. On `/dev` it returns `about-a`, `about-for-a`
  and `about-a-<part>` (likewise `b` and `c`). Parts: `prompt`, `sentence`.
- **`lib/aboutReplies.ts`:** the fixed name and id constants move into the scope. `replyShow` is
  rewritten to be scope-free and keyed on the radio's `data-reply`:
  `replyShow.{block,flex,inline,opacity}[i]` = `group-has-[[data-reply='i']:checked]/about:<display>`,
  written out for i = 0–6, so Tailwind sees each literal. `:checked` only matches inputs, so the
  props' `data-prop-for` never collides. `checkedAboutKey(name)` and `isAboutChange(event, name)`
  take the group name.
- **Radios:** `name={scope.name}` and `data-reply={i}`. They need no ids, because each label wraps
  its input.
- **Hooks and parts that take the scope:**
  - `useAboutPick(name = home)`
  - `useAboutAnnouncement(name)`
  - `useAboutFor(scope)`, which checks `input[name=…][value=key]`, unless one is already checked,
    and dispatches an untrusted `change`
  - `AboutStatus scope` and `AboutForParam scope`
  - `WhatsAppLink`, which gains an optional `pickName` (default home)
- **`/`:** Contact and the footer use the default scope, so nothing changes there. **`/dev`:** the
  footer keeps the default message, because there are no home radios. Under each option,
  `DevWhatsAppCheck` passes that option's `name`. `/dev?for=communities` pre-picks all three
  options, each through its own `AboutForParam`.
- **Motion** binds per option root (its own `watchLive`, timers and registry), so the three Rixes
  never share state.

### O0.3 Content slots (`content/home.ts → about`; sample this round)

| Key | Meaning | Limit |
|---|---|---|
| `label`, `heading`, `lines`, `prompt`, `replies[] {key,label,ack,whatsappText}` | As §2a.5. `prompt` is A's stage title, B's board title and C's lead line | as §2a.5 |
| **`rix.buttonLabel`** (new) | Rix's accessible name: an invitation to poke him; holds his name | 3 words |
| **`rix.pokeLines[5]`** (new) | Cheeky lines on a poke, shown in turn and wrapping round; no claims | 5 words / 30 characters each |
| **`rix.nudgeLines[3]`** (new) | Short "tap one" nudges, shown in turn | 4 words / 24 characters each |
| **`sentence.lead`** (new, C only) | The words before the blank; must read with every `phrase` | 3 words / 12 characters |
| **`sentence.placeholder`** (new, C only) | The blank before a pick ("pick one"-type) | 2 words / 14 characters |
| **`replies[i].phrase`** (new, C only) | The reply as it reads after `sentence.lead` ("run an online community"-type) | 4 words / 24 characters |
| `chat.title` | Kept for now: `/` still renders the chat build. No option uses it; removed together with the old build | as §2a.5 |

The quip limits keep A's quip on one line at 360 (30 mono characters ≈ 234px).

## 2a.A Option A, "Stage": Rix big, with the picks around him

**What makes it different:** a centred, character-first stage. Rix is two and a half times
Process size and stands on a plinth. From `lg` the picks flank him in two stacks, and he looks
from side to side at them.

- **Layout:** `AboutIntro layout="center"` (`items-center text-center`, lines `mx-auto max-w-140`).
  The body is `mt-14 md:mt-20 flex flex-col items-center text-center`.
  1. **Prompt:** `<h3 id={scope.id('prompt')} data-anim="about-prompt" class="mb-8 max-w-160 font-display text-card font-semibold leading-[1.05] tracking-[-0.02em] text-balance text-text {condensed}">`.
  2. **The fieldset is the stage:** `<fieldset aria-labelledby={prompt} class="flex w-full flex-wrap justify-center gap-2 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-x-12">`.
     Its children, in DOM order:
     - **Left list:** `<div class="contents lg:flex lg:flex-col lg:items-end lg:gap-3">` holding
       chips 0 to ⌈n/2⌉−1.
     - **Rix column:** `<div data-anim="about-rix-stage" class="order-first mb-6 flex basis-full flex-col items-center lg:order-none lg:mb-0 lg:basis-auto">`
       → `RixButton` (`w-51 h-33 md:w-68 md:h-44 lg:w-85 lg:h-55`), then the floor
       `<div aria-hidden="true" class="h-0.5 w-full bg-line">`. Rix's feet (the SVG's bottom edge)
       sit on it. Below `lg` the floor spans the stage; from `lg` it is a 340px plinth.
     - **Right list:** the rest of the chips, with "Just looking" last:
       `<div class="contents lg:flex lg:flex-col lg:items-start lg:gap-3">`.

     Rix sits inside the fieldset, so the tab order is either Rix then the radio group, or the
     group then Rix. Both are logical.
  3. **Chips:** `AboutReplyChip` as built, with `scope`, `data-reply` and the §2a.3 states.
  4. **Acks:** `AboutAck` with `mx-auto mt-10 max-w-2xl text-center`. A pick only adds height below
     the stage.
- **Quip placement:** `left-1/2 top-0 -translate-x-1/2 whitespace-nowrap`, centred in the SVG's
  headroom above the head (viewBox y −18 to 8, which is 31, 42 and 52px tall at the three sizes),
  on one line. The translate is static and sits on a wrapper span. Motion owns only the inner
  `about-quip`.

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Layout | centred, content 320 | 706 | 1328 | 1536 |
| Heading / lines | 40 / 17, lines max 560 | 53 | 75 | 80 |
| Prompt (`text-card`) | 30, max 640 | 35 | 44 | 44 |
| Rix | 204×132 | 272×176 | 340×220 | 340×220 |
| Floor | 2px, 320 | 706 | 340 (plinth) | 340 |
| Chips (44 tall) | under the floor, centred wrap, ~3 rows | ~2 rows | 3 + 3 stacks, sides 446 each, gap 48 | sides 550 |
| Ack (`text-summary`) | 20, max 672 | 23 | 26 | 26 |

- **States:** chips as §2a.3. Rix as O4.1. Everything else is static.
- **No JS:** the chips check, `:has` shows the ack and Rix holds the prop. Rix is a span and the
  quip stays empty.
- **Hooks:** `about-prompt`, `about-rix-stage` (peek clip box), `about-rix`, `about-quip`,
  `about-chip`, `about-ack`, plus the §5.6 `data-bot` hooks and the props.

## 2a.B Option B, "Poster board": a wall of cards with Rix on the shelf

**What makes it different:** the picks are tall poster cards, each carrying its group's emblem
(the same prop Rix holds). Rix is small, at Process size, standing at the right end of a shelf
above the board, so every card sits on his natural down-left look.

- **Layout:** `AboutIntro layout="split"` (`splitColumns lg:items-end`: label and heading on the
  left, lines on the right). Body: `mt-14 md:mt-20 lg:mt-24 flex flex-col`.
  1. **Prompt:** `<h3 id={prompt} data-anim="about-prompt" class="max-w-160 font-display text-card font-semibold leading-[1.05] tracking-[-0.02em] text-balance text-text {condensed}">`.
  2. **Shelf:** `<div data-anim="about-rix-stage" class="relative mt-6 flex justify-end border-b-2 border-line">`
     → `RixButton` (`w-34 h-22`, 136×88 at every width) with its feet on the 2px line and its right
     edge on the container's edge.
     **Quip placement:** `right-full top-2 mr-3 w-max max-w-40 text-right`, at most 2 lines, in
     the empty shelf space left of Rix.
  3. **Board:** `<fieldset aria-labelledby={prompt} class="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">`
     of `AboutPosterCard`s, groups first and "Just looking" last.
  4. **Acks:** `AboutAck` with `mt-8 md:mt-10 max-w-3xl`. Before each ack sits
     `<span aria-hidden="true" class="mb-4 block h-0.5 w-6 bg-accent">`, the section label's
     hairline in accent.
- **Card (`AboutPosterCard`):** `<label data-anim="about-chip" class="group/card block cursor-pointer">` →
  `<input type="radio" class="peer sr-only" name data-reply value>` →
  `<span class="flex h-full min-h-36 flex-col justify-between rounded-3xl border p-4 md:min-h-52 md:p-5 lg:min-h-64 lg:p-6 2xl:min-h-72 {states}">`.
  The card holds:
  - **Top row:** `flex items-start justify-between`, with `AboutPropGlyph` (`size-10 md:size-12 lg:size-14`)
    and `CheckIcon` (`hidden size-4 group-has-checked/card:block`).
  - **Label:** `<span class="font-display text-summary font-semibold leading-[1.05] tracking-[-0.02em] text-balance md:text-card {condensed}">`.
- **`AboutPropGlyph`** (server; same paths as `lib/rixProps.ts`): `<svg viewBox="104 21 28 31" aria-hidden focusable="false">`.
  - **Fills:** base parts (C) `fill-muted group-has-checked/card:fill-on-accent`; marks (I, D, B)
    `fill-band group-has-checked/card:fill-accent`.
  - **"Just looking" glyph:** the gap eyes, `M107 36h10v10h-10Z M119 24h10v10h-10Z` (base).

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Intro | stacked | stacked | split, bottom-aligned | same |
| Prompt (`text-card`) | 30 | 35 | 44 | 44 |
| Rix | 136×88, right end | same | same | same |
| Shelf | 2px, 320 | 706 | 1328 | 1536 |
| Quip | max 160, ≤2 lines | same | same | same |
| Cards | 2 cols, 154×144 | 3 cols, 225×208 | 3 cols, 432×256 | 501×288 |
| Glyph / label | 40 / 20 (`text-summary`) | 48 / 35 (`text-card`) | 56 / 44 | 56 / 44 |
| Ack | 20, max 768 | 23 | 26 | 26 |

At 768, "freelancer" at 35px is about 168px, which fits the 193px label width. Card labels wrap
by word and never break mid-word.

| Card (span) | Default | Hover | Focus-visible | Checked | Active |
|---|---|---|---|---|---|
| | `border-line bg-band text-text` | `peer-not-checked:hover:border-muted` | `peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-text` | `peer-checked:border-accent peer-checked:bg-accent peer-checked:text-on-accent`, plus the tick and the glyph's checked fills | `peer-not-checked:active:bg-line` |

Contrast: `text` on `band` above 14:1; `on-accent` on `accent` about 9:1. The tick means the
checked state isn't shown by colour alone.
- **No JS:** the cards check and `:has` shows the ack and Rix's prop. Rix stays static at the right end.
- **Hooks:** as A, plus `about-chip` on each card.

## 2a.C Option C, "Fill in the blank": an inline sentence picker

**What makes it different:** the answer is one large display sentence, "{lead} [phrase ▾].",
whose blank opens a list of phrases in place (a native `<details>`, no overlay). Rix stands above
the sentence and looks at the blank, or at the phrase under the pointer or focus.

- **Layout:** `splitGrid` from `lg` (`AboutIntro layout="stack"` on the left). The right column is
  `flex w-full max-w-2xl flex-col`; below `lg` it stacks under the intro.
  1. **Rix row:** `<div data-anim="about-rix-stage" class="relative flex border-b-2 border-line">`
     → `RixButton` (`w-34 h-22 md:w-51 md:h-33`, `-ml-1`), feet on the line.
     **Quip placement:** `left-full top-2 ml-3 w-max max-w-40 md:top-6`, at most 2 lines.
  2. **Prompt:** `<p id={prompt} data-anim="about-prompt" class="mt-6 text-lead leading-normal text-muted">`.
  3. **Sentence (`AboutSentence`):** `<details data-anim="about-blank" class="group/blank mt-3">` →
     `<summary class="list-none cursor-pointer rounded-lg font-display text-card font-semibold leading-[1.15] tracking-[-0.02em] text-text {condensed} [&::-webkit-details-marker]:hidden {focusRingCard}">`.
     The summary holds `sentence.lead`, a space, then the blank:
     `<span class="border-b-2 border-accent text-accent">`. The blank contains:
     - the placeholder `<span class="group-has-[[data-reply]:checked]/about:hidden">`
     - one `<span class="hidden {replyShow.inline[i]}">` per phrase
     - `ChevronUpIcon` (`ml-2 inline size-[0.55em] rotate-180 group-open/blank:rotate-0`).

     The blank is normal text, so a long phrase wraps and nothing scrolls sideways at 360.
  4. **List** (inside the `details`, after the summary):
     `<fieldset aria-labelledby={prompt} class="mt-4 flex flex-col border-t border-line">` of
     `AboutPhraseRow`. Each row is `<label data-anim="about-chip" class="group/row cursor-pointer">`
     → radio `peer sr-only` →
     `<span class="flex min-h-14 items-center justify-between gap-3 border-b border-line px-1 font-display text-summary {condensed} {states}">`,
     holding the phrase and `CheckIcon` (`hidden size-4 group-has-checked/row:block`).
  5. **Acks:** `AboutAck` with `mt-6 max-w-xl`, after the `details`. While the list is closed, the
     ack reads straight on from the sentence.
- **With JS (`AboutBlankControl`, client, renders nothing; `hooks/useAboutBlank.ts`):**
  - A **pointer** pick closes the list and focuses the summary with `preventScroll`. This focus move
    follows the visitor's own action, never arrival.
  - An **arrow-key** change never closes the list. **Escape** closes it and focuses the summary.
  - `?for` leaves the list closed. **Without JS** the `details` toggles natively, and after a pick
    the list stays open until the summary is tapped.

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Layout | stacked, 320 | stacked, column max 672 | 2 cols, 616 each | 720 each |
| Rix | 136×88 | 204×132 | 204×132 | 204×132 |
| Quip | max 160, ≤2 lines (column leaves 172) | same | same | same |
| Prompt (`text-lead`) | 17 | 17 | 17 | 17 |
| Sentence (`text-card`) | 30, wraps | 35 | 44 | 44 |
| Rows (`text-summary`, 56 tall) | 20 | 23 | 26 | 26 |
| Ack | 20, max 576 | 23 | 26 | 26 |

| Element | Default | Hover | Focus-visible | Checked / open | Active |
|---|---|---|---|---|---|
| Summary blank | `text-accent border-accent` | `group-hover/blank:text-text group-hover/blank:border-text` | `focusRingCard` on the summary | open: chevron up | `active:opacity-80` |
| Row (span) | `text-muted` | `peer-not-checked:hover:text-text` | `peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-text` | `peer-checked:text-accent` + tick | `peer-not-checked:active:bg-band` |

Contrast: `muted` on `bg` about 6.9:1; `accent` on `bg` about 8.6:1.
- **Hooks:** as A, plus `about-blank` (details) and `about-chip` (rows).

## 2a.O4 Rix play (shared; each option adapts it as the table below shows)

New numbers go in `lib/rixMotion.ts`; Process constants are imported, never copied. All of this
is full motion only unless marked. It uses transforms, `opacity`, `attr` and `clip-path` only.
`hooks/useAboutRix.ts` runs per option root, reusing `processBotRig`, `Life` and `Pointer`.
- **Life:** Process layers 1–4 (host constants), no naps, no timed acts (the nudge replaces them).
- **Pointer follow:** layer 7, with `POINTER_RANGE` and `LEAN_RANGE` × (Rix width / 136).
- **Pausing:** everything goes in one registry, paused by `watchLive` (off screen or tab hidden).
- **Teardown:** `resetBot`, plus a strip of inline styles on the props, the quip, the stage's
  `clip-path` and the acks, so the DOM equals the server markup.
- **Not used for Rix:** Process's hover jump and tap jump (the perk and the poke replace them).

| Constant | Value | Use |
|---|---|---|
| `PEEK_START` | `"top 75%"` on `about-rix-stage`, once | If it has already passed at setup, Rix is shown at rest and life starts |
| `PEEK_HIDDEN` → `PEEK_AT` | A `rig y` 88 → 32 · B `rig x` 176 → 60, rig −8° · C `rig x` −176 → −50, rig +8° | viewBox units. At `PEEK_AT` only the head and both eyes clear the edge |
| `PEEK_CLIP` | A `inset(-100% -100% 0 -100%)` · B `inset(-100% 0 -100% -100%)` · C `inset(-100% -100% -100% 0)` | Set on the stage at setup and cleared at the hop's peak. Its edge is the floor (A), the shelf's right end (B) or the row's left end (C) |
| `PEEK_OUT` | 0.45 `power2.out` | hidden → peek |
| `PEEK_SEARCH` | look −7 (0.25 `power3.out`), hold 0.3, look +7 (0.3 `power3.out`), hold 0.25 | looking around |
| `PEEK_SPOT` | look 0 (0.15 `power3.out`); eye pop to `POP_SCALE` (0.1, back 0.3); duck 6 units back toward hidden (0.15 `power2.in`) | spots the visitor |
| `PEEK_HOP` | `ANTICIPATE` 0.1 `power2.out`; travel 0.45: axis to 0 (`power2.inOut`), with `rig y` −18 (0.22 `power2.out`) then 0 (0.23 `power2.in`), `STRETCH` on the rise; lean to 0 over 0.3. A rises on `y` alone: 38 → −18 → 0 | hops into place |
| `PEEK_LAND` | `DROP_SQUASH` 0.07, then `SETTLE` | Life starts here |
| `WAVE` | `arm-right` −55° about 94 53 (0.3 `power2.out`), ±12° twice (0.15 `sine.inOut`), back to 0 (0.4 `back.out(1.6)`); 1.0s | The ask, 0.1 after landing; also the nudge |
| `PERK` | eye pop (0.1 / 0.3); `upper` 0.97 × 1.04 (0.12 `power2.out`), then `SETTLE`; cooldown `REACT_COOLDOWN` | `pointerenter` on Rix, fine pointer, while idle |
| `POKE_COOLDOWN` | 0.9 from start | Pokes during it (or before landing) are ignored |
| `QUIP_IN` / `HOLD` / `OUT` | `opacity` 0 → 1 with `y` 4 → 0 (0.25 `power2.out`) · 2.4 · `opacity` → 0 (0.3 `power1.in`) | A new quip cuts the old one |
| `NUDGE_FIRST` / `NUDGE_EVERY` | 15–20 after landing · 15–20, random each time | Only while live and nothing is picked |
| `NUDGE_MAX` | 4 (decided 2026-10-01) | After the 4th nudge there are no more for this page load |
| `NUDGE_QUIET` / `NUDGE_RETRY` | 4 · 4 | If the pointer was over the picks or Rix within 4s, focus is inside the option, or Rix is acting, skip and retry in 4s (a skip doesn't count toward `NUDGE_MAX`) |
| `LOOK_AT` / `LOOK_PERP` | 0.3 `power3.out`, held while hovered or focused, released 0.6 after leaving · ±3 | Eyes look at a target (below) |
| `PROP_IN` / `PROP_OUT` | `opacity` 0 → 1 (0.12), `scale` 0.4 → 1 about 118 50 (0.3 `back.out(2)`) · old prop `scale` → 0.4 and `opacity` → 0 (0.15 `power2.in`) | then `clearProps`; CSS `:has` keeps the rest state |
| `ACK_IN` | `y` 8 → 0, `opacity` 0 → 1, 0.35 `power2.out` | on each pick |

- **Arrival:** peek out 0–0.45 → search 0.45–1.55 → spot 1.55 (pop until 1.95, duck 1.6–1.75) →
  hop 1.85 (travel 1.95–2.4; clip cleared at 2.17) → land 2.4 → ask 2.5. The ask is `WAVE` plus a
  glance at the picks (`LOOK_AT` their centre, back 0.4 once the wave ends). The prompt and picks
  are not hidden for it: they arrive with the body's `reveal`, so the peek never delays the content.
- **Look at a pick:** `pointerenter` (fine pointer) or `focusin` on a chip, card, row or C's
  summary. Take v = target centre − Rix's eye centre (svg left + 0.4706 × width,
  top + 0.6182 × height), with R = 240 × width/136.
  - d = clamp(±7, ((vx − vy)/√2)/R × 7)
  - p = clamp(±`LOOK_PERP`, ((vx + vy)/√2)/R × 3)
  - eyes `x` = d − rest + p, `y` = −(d − rest) + p
  - lean as layer 7

  `p` is the new host-only perpendicular channel (`look.p`), kept (decided 2026-10-01), so targets
  below Rix read. The lead checks on screen that the eyes stay on the body; drop `LOOK_PERP` to 2
  if one clips. The target look wins over pointer follow.
- **Poke** (click, tap, Enter or Space on `RixButton`), a giggle bounce, timings in seconds:
  - **0:** `ANTICIPATE` (0.08 `power2.out`). Happy squint: each eye `attr` `y` drawn + 5,
    `height` 4 (0.08).
  - **0.08:** `upper y` −10 with `STRETCH` (0.18 `power2.out`).
  - **0.12:** feet `y` −6 (0.14 `power2.out`).
  - **0.26:** feet down (0.12 `power2.in`) and `upper` down (0.16 `power2.in`).
  - **0.42:** `SQUASH` (0.06), then `SETTLE`.
  - **0.45:** giggle, rig act tilt ±4° three times (0.07 each, `sine.inOut` yoyo, ending 0.87).
  - **0.9:** eyes open (0.12 `power2.out`).

  The quip, the next `rix.pokeLines` line in turn, comes in at 0.1. `RixStatus` gets the same line,
  so it is announced. A poke kills any nudge in progress (the arm eases back over 0.3) and restarts
  the nudge clock.
- **Nudge:** at 0 the quip comes in (the next `rix.nudgeLines` line, never announced) and `WAVE`
  runs. Two bounces start at 0.1 and 0.55, feet planted: `ANTICIPATE` 0.08, `upper y` −6 `STRETCH`
  (0.16 `power2.out`), down (0.14 `power2.in`), `SQUASH` 0.06, then `SETTLE`. The look depends on
  the option (table). **It stops for good after `NUDGE_MAX` (4) nudges, or on any pick** (decided
  2026-10-01), including "Just looking" and `?for`, and is never rescheduled. Its timer pauses with
  the registry (off screen, hidden tab) and resumes with the time it had left.
- **Pick** (a change on the option's group; an untrusted `?for` change shows the prop with no act):
  - **0:** eye pop, and `LOOK_AT` the picked control.
  - **0.05:** `ANTICIPATE` 0.1.
  - **0.15:** a happy bounce, feet planted: `upper y` −8 with `STRETCH` (0.18 `power2.out`), down
    (0.16 `power2.in`), at 0.49 `SQUASH` 0.06, then `SETTLE`.
  - **0.2:** `arm-right` −30° (0.25 `power2.out`) and `PROP_IN`. The old prop runs `PROP_OUT`
    first.
  - **0.5–1.1:** the flourish (below).
  - **1.2:** arm back (0.4 `back.out(1.6)`), ending about 1.6.

  The ack runs `ACK_IN` at 0.3. Flourishes:
  - **calendar:** `tick` `scale` 0 → 1 (0.2 `back.out(2.5)`) at 0.55, then a nod at 0.75
    (`upper` scaleY 0.95, 0.1 down, 0.2 up).
  - **shield:** a block. Prop `x` −3, then a thump to +2 (0.08 `power2.out`) and back
    (0.3 `back.out(2)`). Rig tilt −3° (0.2) and back (0.4). Look +7.
  - **send:** prop `x` +6 and `y` −6 (0.16 `power2.out`), then back (0.3 `back.out(1.6)`).
  - **report:** the bars' `scaleY` 0 → 1 about their bottoms, stagger 0.08 from 0.5 (0.15 `back.out(2)`).
  - **envelope:** `flap` `scaleY` 0 → 1 about 118 30 (0.2 `power2.out`) at 0.5, then the prop
    `y` −4 (0.12) and back (0.25 `back.out(1.6)`).
  - **just looking:** no bounce and no prop. A shrug: `arm-left` +35° and `arm-right` −35°
    (0.2 `power2.out`) with `upper y` −2, held 0.4, then back (0.35 `back.out(1.6)`). Look +7,
    then 0 (0.3).
- **Reduced motion:**
  - **Movement off:** no peek, clip, life, look, perk, bounce, wave or flourish. Rix shows his
    static pose and fades in with the body's `reveal`.
  - **Poke:** Rix stays still. The quip fades in (`duration.fade` 0.4), holds 2.4s, fades out (0.4),
    and is announced.
  - **Nudge (decided 2026-10-01):** one fade-in line, once only, at the first nudge time. It is the
    same fade as the poke quip. There are no repeats, and none at all after a pick.
  - **Pick:** the prop and the ack fade in (0.4) from their `:has` state, with no act.

| Adaptation | A, Stage | B, Poster board | C, Fill in the blank |
|---|---|---|---|
| Peek edge | rises from behind its floor | leans round the shelf's right end | leans round the row's left end |
| Look targets | the chip under the pointer or focus (left stack d < 0, right d > 0) | the card under the pointer or focus (down-left) | the summary while the list is closed; the row under the pointer or focus while open |
| Nudge look | alternates the left and right stacks | the board's centre | the blank |
| Quip | centred in his headroom, 1 line | left of him, right-aligned, ≤2 lines | right of him, ≤2 lines |
| Size | 204 / 272 / 340 | 136 | 136 / 204 from `md` |

### O4.1 Rix states (every option)

| Element | Default | Hover | Focus-visible | Active |
|---|---|---|---|---|
| `RixButton` | the static pose, `cursor-pointer`, no chrome | `PERK` (full motion, fine pointer); none under reduce | `focusRingCard` (2px `text`, offset 4), `rounded-2xl` | the poke (bounce or quip fade) |

The tap target is the full SVG box: at least 136×88, never under 44. The button's name is
`rix.buttonLabel`; the SVG and the quip are `aria-hidden`.

## 2a.O5 The `/dev` route (temporary; deleted after the pick)

- **`app/dev/page.tsx` only imports and renders (§9):** `<DevOnly><DevOptions>` holding three
  `<DevOptionFrame option="a|b|c">` frames, each wrapping its option's section `</DevOptions></DevOnly>`.
  - **Metadata:** `pageMetadata({ ...devMeta, path: "/dev", noindex: true })`. `lib/pageMetadata.ts`
    gains an optional `noindex`, which gives `robots: { index: false, follow: false }`.
  - **Not listed anywhere:** not in `lib/publishedRoutes.ts` (so not in the sitemap), and no nav link.
  - **`components/dev/DevOnly.tsx`** (server) calls `notFound()` when
    `process.env.NODE_ENV === "production"` and otherwise renders its children. So `/dev` exists
    only under `next dev`, and 404s in every build, including Vercel previews. There is no env
    flag and no preview deploy (decided 2026-10-01).
- **`DevOptions`:** `<div class="flex flex-col pt-20">`, which clears the fixed header.
- **`DevOptionFrame`:** `<div class="border-t-2 border-dashed border-accent first:border-t-0">`, so
  each frame is clearly not a site hairline. It holds:
  - **Dev label:** `px-gutter` → `{container} flex flex-wrap items-baseline gap-x-4 gap-y-1 pt-10 font-mono`,
    with:
    - the letter `<span class="grid size-8 place-items-center rounded-full bg-accent text-nav font-medium text-on-accent">`
    - the name `text-nav uppercase tracking-[0.06em] text-text`
    - the line `text-meta text-muted`
  - **The option** (its own section frame).
  - **`DevWhatsAppCheck`:** `px-gutter pb-10` → `{container}` → `<WhatsAppLink pickName={scope.name} class="inline-flex min-h-11 items-center {metaLabel} underline underline-offset-4 hover:text-text {focusRing}">`.
    It opens WhatsApp with that option's message (hover shows the link).
- **Content `content/dev.ts`:** `meta { title, description }`, `options.{a,b,c} { letter, name, line }`
  (name 3 words, line 12 words) and `whatsappCheck` (5 words). Suggested names: A "Stage", B "Poster
  board", C "Fill in the blank".
- **On `/dev`:** the site header's in-page links don't resolve (temporary, accepted). The footer
  WhatsApp link keeps its default message.

## 2a.O6 Components and files

- **Shared new (`components/home/about/`):**
  - `RixButton.tsx` (client)
  - `RixProps.tsx`
  - `RixQuip.tsx`
  - `RixStatus.tsx` (client)
  - `AboutAck.tsx`
  - `AboutPropGlyph.tsx` (B only)
- **Option-only new:**
  - A: `stage/AboutStageSection.tsx`, `stage/AboutStage.tsx` (fieldset grid), `stage/AboutStageRix.tsx` (Rix and floor)
  - B: `poster/AboutPosterSection.tsx`, `poster/AboutPosterShelf.tsx`, `poster/AboutPosterBoard.tsx`, `poster/AboutPosterCard.tsx`
  - C: `sentence/AboutSentenceSection.tsx`, `sentence/AboutSentenceRix.tsx`, `sentence/AboutSentence.tsx`, `sentence/AboutPhraseRow.tsx`, `sentence/AboutBlankControl.tsx` (client, renders nothing)
- **Dev (`components/dev/`):** `DevOnly.tsx`, `DevOptions.tsx`, `DevOptionFrame.tsx`, `DevWhatsAppCheck.tsx`.
- **Extended:**
  - `AboutIntro` (`layout`)
  - `AboutReplyChip` (`scope`, `data-reply`)
  - `AboutStatus` and `AboutForParam` (`scope`)
  - `ProcessBot` (`children`)
  - `WhatsAppLink` (`pickName`)
  - `lib/aboutReplies.ts` (O0.2, and the prop map)
  - `hooks/useAboutPick.ts`, `useAboutFor.ts` and `useAboutAnnouncement.ts` (name or scope)
  - `lib/pageMetadata.ts` (`noindex`)
  - `ChevronUpIcon` is reused (rotated) in C; there is no new icon.
- **Logic new:**
  - `lib/aboutScope.ts`
  - `lib/rixProps.ts` (prop paths and pivots)
  - later `lib/rixMotion.ts`, `lib/rixPeek.ts`, `lib/rixActs.ts`, `hooks/useAboutRix.ts`
  - `hooks/useAboutBlank.ts` (C)
- **Retired after the pick:**
  - `AboutChat`, `AboutChatHeader`, `AboutThread`, `AboutBubble`, `AboutReplyPair` and `AboutReplies`
  - `about.chat.title`
  - the losing option's files and slots (`sentence.*` and `phrase` if C loses)
  - all of `/dev`, `components/dev/` and `content/dev.ts`

  `TypingBubble` stays (Agents uses it). The winner keeps `scope` with its home default.
- **Images:** none. Rix, the props and the glyphs are inline decorative SVG.

## 2a.O7 Choices (answered by the user 2026-10-01; all decided)

1. **Which option — decided later:** the user picks A, B or C on `/dev` after the build.
2. **Nudge under reduced motion — decided:** one fade-in line, once (the default).
3. **Nudge cap — decided:** it stops after 4 nudges (`NUDGE_MAX`), and on any pick, including
   "Just looking".
4. **Props — decided:** the group props are samples, kept as specced (calendar, shield, send
   arrow, report, envelope; a shrug for "Just looking") until the real groups come in.
5. **`/dev` — decided:** dev only under `next dev`, 404 in every build; no env flag or preview deploy.
6. **Lead's choices — decided, all defaults:**
   - C's blank is a `<details>` disclosure (not a `<select>` or an always-open list).
   - Rix without JS is a decorative span.
   - The show-on-pick classes key on `data-reply` (not per-option ids).
   - Rix's lines float near him, with no name tag.
   - Hover is a perk and a tap is the poke (no Process hover or tap jump).
   - The host-only perpendicular eye look stays; the lead screen-checks it.
7. **`about.chat.title` — decided:** kept in content for now, because `/` still renders the chat
   build until the user picks. It is removed together with the old build.
