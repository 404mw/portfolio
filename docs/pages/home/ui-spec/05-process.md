# §5 Process: UI spec

Shared rules and parts (§0): [`../ui-spec.md`](../ui-spec.md). Page doc: [`../sections/05-process.md`](../sections/05-process.md).

## 5. Process (the one question: how do they work?)

Source: Claude Design canvas "Process mascots" (`Main.dc.html` desktop 1440, `Phone.dc.html` 390,
`Bot.dc.html` vector bot, `Sprites.dc.html` sheet), 2026-09-26. Replaces the ring and column-rail spec.
**Revised 2026-09-26:** the pixel sprite is replaced by a vector bot built from the logo's geometry,
and the bots breathe (motion pass).

### 5.1 Layout (canvas stacked at every width; no pinned title)

- Section frame (§0.1), `id="process"`. Inner: `{container} flex flex-col gap-14 border-t border-line py-section md:gap-20 lg:gap-24`.
- Header: `<div data-anim="reveal" class="flex max-w-250 flex-col gap-5 lg:gap-7">`: `SectionLabel`
  (`process.number`, `process.label`, `as="p"`), `SectionHeading size="heading"`. **No `stickyTitleXl`**:
  Process leaves the pinned-title pattern, like Proofs.
- Body: `<div class="flex max-w-2xl flex-col lg:max-w-none lg:gap-10">` → `ProcessList`, then `ProcessReturn`.
- **Below `lg` (phone and tablet): rows.** **From `lg`: four across on a ground line.** At 768 four
  columns would be ~158px (titles and lines too cramped) and a 2×2 grid breaks the left-to-right line
  the chevrons and return path depend on; rows keep one reading order. From `lg` columns are ≥211px,
  enough for a 136px bot and a 2–3 line step line.

### 5.2 List and step (`ProcessList`, `ProcessStep`)

- `ProcessList`: `<div class="relative">` → ground line `<div aria-hidden="true" class="absolute inset-x-0 top-27 hidden h-0.5 bg-line lg:block">`,
  then `<ol class="grid lg:grid-cols-4 lg:gap-x-8">` of four `ProcessStep`s.
- `<li>`: `grid grid-cols-[5.5rem_minmax(0,1fr)] items-start gap-x-4.5 border-t border-line py-6 lg:relative lg:flex lg:flex-col lg:border-t-0 lg:py-0`
  (phone column 88px, was 84).
  1. `ProcessBot` (5.6), role and pose from `lib/processBots.ts → stepBots[index]`.
  2. Steps 1–3 only, the chevron to the next step, centred in the 32px gap on the ground line:
     `<span aria-hidden="true" class="absolute top-27 -right-6 hidden h-0.5 w-4 items-center justify-center bg-bg lg:flex">`
     holding `ChevronRightIcon` `size-6 shrink-0 text-accent` (glyph 6×12, 2px stroke). The `bg-bg` box masks the line behind it.
  3. Text column `<div data-anim="reveal" class="flex flex-col gap-2 lg:gap-2.5 lg:pt-7.5">`:
     label `<p class="{metaLabel} uppercase tracking-[0.06em]">` = `process.stepLabel` + two-digit number (`01`–`04`);
     title `<h3 class="font-display font-semibold text-step leading-[1.05] tracking-[-0.02em] text-balance text-text {condensed}">`;
     line `<p class="text-body-lg leading-normal text-muted lg:max-w-65">`.
- **Feet on the ground line (from `lg`):** the bot's feet (the body's lowest points, viewBox y 92) are
  the viewBox's **bottom edge** (−18 + 110 = 92), so the box bottom is the feet. `lg:mt-5` (20px) puts
  the 88px box's bottom at 108, the ground line's top (`top-27`); the 2px line sits right under the
  feet, as in `Main.dc.html` (108px slot, bottom-aligned). The text column's `lg:pt-7.5` is unchanged.
- **States:** nothing in §5 is interactive or focusable; no hover, focus-visible or active states.

### 5.3 The return (`ProcessReturn`)

- Wrapper `<div class="flex items-center gap-3 border-t border-line pt-6 lg:grid lg:grid-cols-4 lg:gap-x-8 lg:border-t-0 lg:pt-0">`
  (same column grid as the list, so the path lines up with the bots).
- Below `lg`: `CornerUpLeftIcon` (new) `size-5 shrink-0 text-accent lg:hidden` (`aria-hidden` via `Icon`), then the label.
- From `lg`: the path box `<div class="contents lg:relative lg:col-span-3 lg:ml-15.5 lg:-mr-24 lg:block lg:h-14 lg:rounded-b-2xl lg:border-2 lg:border-t-0 lg:border-dashed lg:border-accent">`.
  Its left and right borders are centred at x 63 in bot 1's and bot 4's columns (62px in, and 32px
  gap + 64px past column 3), as on the canvas. The vector body's centre is x 64 (viewBox x 50); the
  1px difference is kept to match the canvas. Inside: `ChevronUpIcon` `absolute -left-3.25 -top-2.5 hidden size-6 text-accent lg:block`
  (the arrowhead on step 1's end), then the label. `contents` below `lg` lets the label sit in the phone row.
- Label `<p class="{monoLabel} lg:absolute lg:inset-x-0 lg:bottom-0 lg:translate-y-[calc(50%+1px)] lg:text-center">`
  with `<span class="lg:bg-bg lg:px-4">` = `process.loopLabel`. Real text, never `aria-hidden`; one element at every width.
  The box has no content of its own, so it needs no `aria-hidden`; the two icons carry it.
- Dash rhythm is the browser's CSS `dashed` (about 6/6 at 2px), not the canvas's exact 8/8 (see Choices).

### 5.4 Sizes

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Layout | header, then 4 rows (content 320) | same, rows capped at 672 | header, then 4 columns of 308, gap 32 | same, columns 360 (container 1536) |
| Heading (`text-heading`) | 44px | 64px | 96px | 104px |
| Bot (box 170:110) | 88×57 (`w-22 h-14.25`) | 88×57 | 136×88 (`w-34 h-22`), top 20, feet at 108 | 136×88 |
| Step title (`text-step`) | 32px, text col 214 | 32px | 32px | 32px |
| Step line (`text-body-lg`) | 16px / 1.5, no cap | same | same, max 260 | same |
| Ground line | none (hairline row dividers) | none | 2px `line`, full width, y 108 | same |
| Chevrons | none | none | 3, in the gaps, on the line | same |
| Return path | 20px icon + label row, hairline above | same | dashed 2px `accent`, x 63 → 1083, 56 tall, radius 16 | x 63 → 1239 |
| Loop label (`monoLabel`) | 13px, left | same | 13px, centred on the path | same |

136px holds at 4K on purpose: the container caps at 1536 and the step type stops at 32px, so a
bigger bot would outgrow its title. At `lg` (1024) columns are ~211px; the 136px bot fits. The
phone box is 88 × 56.94 in exact ratio; `h-14.25` (57px) leaves a 0.06px letterbox, invisible.

### 5.5 Content slots (`content/home.ts → process`)

| Key | Meaning | Limit |
|---|---|---|
| `process.number` / `process.label` | "02" and the section label | 5 words |
| `process.heading.lead` / `.accent` | The heading; `accent` is its last words, in violet (facts → How the user works) | 6 words in total |
| `process.stepLabel` | "Step" before each two-digit number | 1 word |
| `process.steps[0].title` | Guardrails: every job starts with the user's rules enforced | 3 words |
| `process.steps[1].title` | The team: specialized agents working to those rules or in a defined boundary | 3 words |
| `process.steps[2].title` | Independent check: a separate agent verifies the work | 3 words |
| `process.steps[3].title` | Lessons kept: the workflow is updated each cycle or session | 3 words |
| `process.steps[0–3].line` | One line on the step, facts level only (no agent names, tools or counts) | 12 words (voice: short line) |
| `process.loopLabel` | The loop returns to step 1 with better rules | 5 words |

### 5.6 The bot (`ProcessBot`, data in `lib/processBots.ts`)

The body is the logo itself: the MW outline on a 100 grid, cut into three "/" strips with gap 8
(bands x + y = 36–76, 84–116, 124–164). Vector: **no `crispEdges`, no cells, no run-merging.**

- **Markup (one SVG, four frame groups, three breath groups each).**
  `<svg viewBox="-30 -18 170 110" aria-hidden="true" focusable="false" data-anim="process-bot" data-role={role} data-pose={pose} class="h-14.25 w-22 shrink-0 lg:mt-5 lg:h-22 lg:w-34">`
  → four `<g data-frame="idle|blink|act|sleep">`, each a complete pose; the static pose's group shows,
  the other three carry `class="invisible"`. Inside every frame, in paint order:
  `<g data-breath="body">` (strips, then eyes), `<g data-breath="hand">` (arms, then tools),
  `<g data-breath="hat">` (hat parts). All three are always rendered (the hat group is empty for
  `check` and `update`), so every bot has the same 12 hooks. Static = breath 0: no `transform` attributes.
- **No background rect.** The canvas paints a `bg` rect behind each bot; ours is transparent.
- **Poses (static):** `stepBots` = step 1 `rules`/`idle`, step 2 `team`/`idle`, step 3 `check`/`act`, step 4 `update`/`idle`.
- **Colour keys → classes** (map in `ProcessBot`): B `fill-accent`, C `fill-cream`, M `fill-muted`,
  D `fill-cream-muted`, I `fill-ink`, L `fill-line`, H `fill-bg` (eye holes).
- **Eye holes are filled, not cut:** each eye is a `fill-bg` rect painted over the body (no mask, no
  clip-path). This holds only because the section sits on `bg`; if the section background changes,
  the eye fill changes with it.
- **Paths:** every `<path>` gets `fill-rule="evenodd"` (only the `check` ring needs it). Hardcode the
  strings below; nothing is computed at render.

**Body group** (every frame): polygons, all B. The source emits V10 (and its mirror) twice in A and
C, a zero-length edge; hardcode as given (dropping the repeat renders the same).

| Part | `points` |
|---|---|
| Strip A | `6.00,30.00 28.00,8.00 48.00,28.00 6.00,70.00 6.00,70.00` |
| Strip B | `74.00,10.00 90.00,26.00 26.00,90.00 10.00,74.00` |
| Strip C | `94.00,70.00 72.00,92.00 52.00,72.00 94.00,30.00 94.00,30.00` |

**Eyes** (H, after the strips). Centres (30,50) and (70,50) sit where the gaps cross the middle; on
`act` they shift ±7 along the gap diagonal.

| Frame | Rects `x,y` (both) | Size |
|---|---|---|
| `idle` | 23,43 and 63,43 | 14×14 |
| `act`, `team` / `check` (up-right) | 30,36 and 70,36 | 14×14 |
| `act`, `rules` / `update` (down-left) | 16,50 and 56,50 | 14×14 |
| `blink` | none | |
| `sleep` (slits) | 23,52 and 63,52 | 14×3 |

**Hand group:** left arm `<rect x="-4" y="50" width="10" height="6">` B; right arm
`<rect x="94" y="50" width={armR} height="6">` B, `armR` 18 for `team`, 10 for the rest. Then the tools.
**Hat group:** the hat parts. Both in the order listed. `blink` and `sleep` use the idle parts.

| Role | Group | Part: `d` (fill) |
|---|---|---|
| `rules` | hat | cap `M26 8L30 -8H70L74 8Z` (M); badge `M46 -4h8v6h-8Z` (C); brim `M18 4h64v6h-64Z` (D) |
| | hand | clipboard `M-26 34h22v32h-22Z` (C); clip `M-20 30h10v7h-10Z` (M); marks `M-21 44h12v3h-12Z`, `M-21 50h16v3h-16Z`, `M-21 56h9v3h-9Z` (I). No act variant: on `act` only the eyes move |
| `team` | hat | shell `M26 6L34 -8H66L74 6Z` (C); ridge `M46 -10h8v16h-8Z` (D); brim `M16 4h68v6h-68Z` (C) |
| | hand | hammer head `M100 16h26v12h-26Z`, act `M100 6h26v12h-26Z` (M); handle `M110 28h5v28h-5Z`, act `M110 18h5v38h-5Z` (D) |
| `check` | hand | ring `M122 18L138 34L122 50L106 34Z M122 25L113 34L122 43L131 34Z` (C); lens `M122 25L131 34L122 43L113 34Z` (L, act C); handle `M110.5 41.5L114.5 45.5L103 57L99 53Z` (M) |
| `update` | hand | wrench handle, 45°: `M101.88 50.88L123.09 29.67L127.33 33.91L106.12 55.12Z`; act 15°: `M101.10 52.22L108.87 23.25L114.66 24.80L106.90 53.78Z` (M) |
| | | wrench jaws, 45°: `M117.44 26.84L130.16 14.11L134.05 18.00L128.40 23.66L133.34 28.60L139.00 22.95L142.89 26.84L130.16 39.56Z`; act 15°: `M102.55 23.62L107.21 6.24L112.52 7.66L110.45 15.39L117.22 17.20L119.29 9.47L124.60 10.90L119.94 28.28Z` (M) |
| | | rulebook `M-26 38h22v28h-22Z` (C); spine `M-26 38h5v28h-5Z` (D); page edge `M-8 40h3v24h-3Z` (M); mark `M-17 46h8v3h-8Z` (I) |

The wrench is rotated about (104,53); the strings above are the resolved results. At 45° the right
jaw tip reaches x 142.89, 2.89 units past the viewBox edge (140); the SVG's default
`overflow: hidden` clips it (~2.3px at 136 wide), as the canvas does (see Choices).

**Breath values** (motion pass only; `sy = 1 + 0.03 · breath`; hand −39·(sy−1), hat −84·(sy−1)).
The body stretches up from its feet (y 92), so the feet never leave the ground line.

| breath | `data-breath="body"` | `"hand"` | `"hat"` |
|---|---|---|---|
| 0 (static) | none | none | none |
| 1 | `translate(0 92) scale(1 1.03) translate(0 -92)` | `translate(0 -1.17)` | `translate(0 -2.52)` |
| 2 | `translate(0 92) scale(1 1.06) translate(0 -92)` | `translate(0 -2.34)` | `translate(0 -5.04)` |

At breath 2 the highest point (the `team` ridge, −10 − 5.04 = −15.04) stays inside the viewBox (−18).

### 5.7 Components, images, motion

- **Components (`components/home/process/`):** `ProcessSection.tsx` (frame, header, body),
  `ProcessList.tsx` (ground line and `<ol>`), `ProcessStep.tsx` (bot, chevron, text),
  `ProcessBot.tsx` (rewritten: the vector SVG; props `role`, `pose`), `ProcessReturn.tsx` (return path or
  row, and the label). Icons: `ChevronRightIcon.tsx` and `CornerUpLeftIcon.tsx` (one glyph each);
  `ChevronUpIcon` reused. Logic: `lib/processBots.ts` (rewritten: the hardcoded polygons, eye rects
  and part paths above, `botParts(role, frame)` returning the three groups' parts, `stepBots`; the
  pixel maps and `botRects` go). **Deleted:** `ProcessLoop.tsx`, `ProcessRing.tsx`, `ProcessRail.tsx`,
  and `stickyTitleXl` in `lib/styles.ts`. **Images:** none.
- **Motion (later), reveals:** `data-anim="reveal"` on the header wrapper and each step's text
  column, never on the `li`, so bots, ground line and chevrons stay put while text rises in.
- **Motion (later), bots:** two stepped layers on one 125ms tick per bot (8fps). No tweens, easing,
  rotation or blur.
  1. **Breathing:** an 18-step cycle, breath 0 for 8 steps, 1 for 2, 2 for 6, 1 for 2 (2.25s). Phase
     offsets 0, 11, 5 and 14 steps for `rules`, `team`, `check`, `update` (at tick t a bot shows the
     cycle's step t + offset), so the crew never breathes in unison. Each change sets the SVG
     `transform` attribute from the breath table on every `[data-breath]` group in that bot, in all
     four frames, so a frame swap keeps the current breath; breath 0 removes it. Breathing runs in
     every frame, `sleep` included.
  2. **Frame swaps:** toggle `invisible` on the `data-frame` groups; holds are multiples of 125ms and
     vary per bot; idle ↔ blink, idle ↔ act (eyes jump along the gaps, tools switch to their act
     paths), an occasional sleep.
  - Pause both when the section is off screen (ScrollTrigger or an observer) and on
    `visibilitychange`. **Reduced motion:** no breathing, no swaps; each bot keeps its static pose at breath 0.
- The ground line, chevrons and return path don't move.

### 5.8 Choices for the lead

1. **Tablet is rows, four across from `lg`** (not a 2×2 grid, not four columns at `md`). Reason in 5.1.
2. **Bot stays 136px at 4K,** not larger: the section is capped at 1536 and the type stops growing.
3. **Breath groups inside each frame** (as briefed: 12 hooks per bot, the motion pass sets all of
   them each breath change) over three outer breath groups each holding four frame parts (3 hooks,
   but a frame swap then toggles three groups). Chose the brief's: each frame stays one complete pose.
4. **Return path is a CSS dashed border box** (browser dash rhythm, about 6/6) rather than an SVG
   with exact 8/8 dashes. An SVG can't stretch to the fluid column width without distorting its
   16px corners unless split into three pieces; say if exact 8/8 matters.
5. **Step numbers two-digit ("Step 01")** as on the canvas; the old build showed "Step 1".
6. **Left out:** `Main.dc.html` still has a lone 16×16 cream square on the ground line right of bot 3
   (x 824, y 92–108), not in the brief. It reads as "the work being checked"; add it only on your yes.
7. Step title limit set to 3 words (the voice file has none; the old spec said 4).
8. **Wrench jaw clipped at the viewBox edge** (as the canvas renders it) rather than
   `overflow-visible` on the SVG (shows the full jaw, 2.3px into the column gap, no layout effect).
