# §5 Process: UI spec

Shared rules and parts (§0): [`../ui-spec.md`](../ui-spec.md). Page doc: [`../sections/05-process.md`](../sections/05-process.md).

## 5. Process (the one question: how do they work?)

Source: Claude Design canvas "Process mascots" (`Main.dc.html` desktop 1440, `Phone.dc.html` 390,
`Bot.dc.html` vector bot, `Sprites.dc.html` sheet), 2026-09-26. Replaces the ring and column-rail spec.
**Revised 2026-09-26:** the pixel sprite is replaced by a vector bot built from the logo's geometry,
and the bots breathe (motion pass).
**Revised 2026-09-27 (user's decision):** each bot is one rig with separate feet, and the bots move in
fully smooth GSAP motion with four extras (eyes follow the pointer, scroll-in entrance, crew relay,
hover/tap reaction). Replaces the stop-motion rule (§5.6–5.8).
**Revised 2026-09-28 (user's change):** the bots jump only on user interaction (hover or tap). A relay
catch plays the full role act, check's "found it" is an eye pop and waking is a feet-planted startle;
none of them hop. `HOP_UP` / `HOP_FEET` are removed.

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
**2026-09-27:** one rig per bot; the W's two bottom points are cut off as separate feet. The
four `data-frame` groups and the `data-breath` groups are **superseded 2026-09-27**.

- **Markup (one SVG, one rig).** The SVG element is unchanged:
  `<svg viewBox="-30 -18 170 110" aria-hidden="true" focusable="false" data-anim="process-bot" data-role={role} data-pose={pose} class="h-14.25 w-22 shrink-0 overflow-visible lg:mt-5 lg:h-22 lg:w-34">`.
  Inside, one tree in paint order (feet under the strips, then strips → eyes → arms/tools → hat → effects):

  ```
  g rig
  ├ polygon foot-left, polygon foot-right
  └ g upper
    ├ g body → strip A, strip B, strip C, g eyes[data-look] → rect eye, rect eye
    ├ g arm-left → arm rect, left tools (rules: clipboard, clip, 3 × mark; update: rulebook, spine, page edge, mark, page)
    ├ g arm-right → arm rect, g tool (right tool parts; check adds lens-lit after its lens)
    ├ g hat → hat parts
    └ extras: team g sparks → 3 × spark; rules and update g zzz → 3 × z
  ```
  Every hook is `data-bot="<part>"`. The 12 base hook elements (rig, foot-left, foot-right, upper,
  body, eyes, eye ×2, arm-left, arm-right, tool, hat) render on every bot; `tool` and `hat` are empty
  where the role has none. **Static = the pose, complete and visible:** no `transform` attributes, no
  inline styles. Only decorative extras start hidden, with the `opacity-0` class: `sparks`, each `z`,
  `page`, and `lens-lit` when the pose isn't `act` (check's pose is `act`, so its `lens-lit` shows).
- **No background rect.** **Eye holes are filled, not cut:** `fill-bg` rects over the body (no mask,
  no clip-path), valid only while the section sits on `bg`.
- **Poses (static):** `stepBots` = step 1 `rules`/`idle`, step 2 `team`/`idle`, step 3 `check`/`act`,
  step 4 `update`/`idle`. `BotPose` = `idle | act` replaces `BotFrame`; `botFrames` goes.
- **Colour keys → classes** (map in `ProcessBot`): B `fill-accent`, C `fill-cream`, M `fill-muted`,
  D `fill-cream-muted`, I `fill-ink`, L `fill-line`, H `fill-bg`. Flat fills; no gradients, blur or strokes.
- **Paths:** every `<path>` gets `fill-rule="evenodd"`. Hardcode the strings below; nothing is computed at render.

**Hooks and pivots.** All pivots are viewBox units in the element's own rest space (no static
transforms anywhere, so ancestors don't shift them); the animator sets each once with `svgOrigin`.
`botPivots` in `lib/processBots.ts` holds them, so motion code never measures the SVG.

| Hook | Element | Pivot | Moves (the only writers) |
|---|---|---|---|
| `rig` | g | 50 92 (ground centre) | `rotation` = sway + lean + act tilt (summed); entrance `y`, `opacity` |
| `foot-left` | polygon | 26 90 (its tip) | `y` (jump lag, tap), `x` (shuffle) |
| `foot-right` | polygon | 72 92 (its tip) | same |
| `upper` | g | 50 84 (feet tops) | `y` (jump), `scaleX`/`scaleY` (squash, stretch) |
| `body` | g | 50 84 | `scaleY` (breathing) |
| `eyes` | g | none (translate only) | `x` = d − rest, `y` = −(d − rest); d = look along the gap diagonal, −7…7, + = up-right; rest = `data-look` |
| `eye` ×2 | rect | its drawn centre (idle 30 50 / 70 50; check 37 43 / 77 43) | `attr` `y`/`height` (blink, sleep); `scale` (pop) |
| `arm-left` | g | 6 53 (shoulder) | `y` (breath ride); `rotation` = drift × mix + act |
| `arm-right` | g | 94 53 (shoulder) | same |
| `tool` | g | team 112.5 53 · check 101 55 · update 104 53 (grips) | `rotation`; check also `x`/`y` (scan) |
| `hat` | g | 50 10 (brim base) | `y` (breath ride); `rotation` (landing wobble) |
| `mark` | path | its left end, centre y (rules −21 45.5 / −21 51.5 / −21 57.5; update −17 47.5) | `scaleX` (writing) |
| `page` | path | −21 52 (spine edge) | `scaleX`, `opacity` |
| `lens-lit` | path | none | `opacity` |
| `sparks` / `spark` | g / path | 140 33 (strike point) | group `opacity`, `scale`; each spark `x`/`y` outward |
| `z` ×3 | path | its centre (92 2 / 105 −7 / 120 −12) | `x`, `y`, `scale`, `opacity` |

**Body and feet** (all B polygons). Strip A is unchanged; B and C are trimmed by a horizontal cut 7
units above each tip. Each foot is a 14 × 7 right-angled "V" extended 0.5 unit up under its strip
(feet paint first), so the trimmed strip + foot cover exactly the old strip, with no seam. The source's
repeated vertex in A and C is kept (zero-length edge).

| Part | `points` |
|---|---|
| Strip A | `6.00,30.00 28.00,8.00 48.00,28.00 6.00,70.00 6.00,70.00` |
| Strip B (trimmed at y 83) | `74.00,10.00 90.00,26.00 33.00,83.00 19.00,83.00 10.00,74.00` |
| Strip C (trimmed at y 85) | `94.00,70.00 79.00,85.00 65.00,85.00 52.00,72.00 94.00,30.00 94.00,30.00` |
| `foot-left` | `18.50,82.50 33.50,82.50 26.00,90.00` (edges on x − y = −64 and x + y = 116) |
| `foot-right` | `64.50,84.50 79.50,84.50 72.00,92.00` (edges on x − y = −20 and x + y = 164) |

The lowest point (y 92, §5.2's box bottom) is now `foot-right`'s tip; the left tip sits at y 90 as
before. Static render is visually unchanged.

**Eyes** (H, 14 × 14, drawn at the pose): idle 23,43 and 63,43 (`data-look="0"`); check `act` 30,36
and 70,36 (`data-look="7"`). Motion values: blink closed = `y` drawn y + 7, `height` 0; sleep slit =
`y` 52, `height` 3 (only rest-0 bots nap, after the look returns to 0); pop = scale 1.25. Blinks and
slits use `attr` rather than `scaleY` because the slit isn't centred on the eye (52–55 vs centre 50).

**Arms and tools** (in each arm group, in the order listed). Left arm `<rect x="-4" y="50" width="10" height="6">` B;
right arm `<rect x="94" y="50" width={armR} height="6">` B, `armR` 18 for `team`, 10 for the rest.
The old act paths (raised hammer, 15° wrench, cream lens) are **superseded 2026-09-27**.

| Role | Group | Part: `d` (fill) |
|---|---|---|
| `rules` | hat | cap `M26 8L30 -8H70L74 8Z` (M); badge `M46 -4h8v6h-8Z` (C); brim `M18 4h64v6h-64Z` (D) |
| | arm-left | clipboard `M-26 34h22v32h-22Z` (C); clip `M-20 30h10v7h-10Z` (M); `mark` ×3 `M-21 44h12v3h-12Z`, `M-21 50h16v3h-16Z`, `M-21 56h9v3h-9Z` (I) |
| `team` | hat | shell `M26 6L34 -8H66L74 6Z` (C); ridge `M46 -10h8v16h-8Z` (D); brim `M16 4h68v6h-68Z` (C) |
| | tool | hammer head `M100 16h26v12h-26Z` (M); handle `M110 28h5v28h-5Z` (D) |
| `check` | tool | ring `M122 18L138 34L122 50L106 34Z M122 25L113 34L122 43L131 34Z` (C); lens `M122 25L131 34L122 43L113 34Z` (L); `lens-lit` same `d` (C); handle `M110.5 41.5L114.5 45.5L103 57L99 53Z` (M) |
| `update` | tool | wrench handle `M101.88 50.88L123.09 29.67L127.33 33.91L106.12 55.12Z` (M); jaws `M117.44 26.84L130.16 14.11L134.05 18.00L128.40 23.66L133.34 28.60L139.00 22.95L142.89 26.84L130.16 39.56Z` (M) |
| | arm-left | rulebook `M-26 38h22v28h-22Z` (C); spine `M-26 38h5v28h-5Z` (D); page edge `M-8 40h3v24h-3Z` (M); `mark` `M-17 46h8v3h-8Z` (I); `page` `M-21 40h13v24h-13Z` (D, `opacity-0`) |

**Effects** (last in `upper`; decorative, hidden statically).

| Role | Hook | `d` (fill) |
|---|---|---|
| `team` | `sparks` (`opacity-0`) → `spark` ×3 | right `M143 32h7v2h-7Z`; down-right `M142 36L143.5 34.5L148.5 39.5L147 41Z`; down `M139 36h2v7h-2Z` (C) |
| `rules`, `update` | `zzz` → `z` ×3 (`opacity-0` each) | `M88 -2H96V0L92 4H96V6H88V4L92 0H88Z`; `M100 -12H110V-10L104 -4H110V-2H100V-4L106 -10H100Z`; `M114 -18H126V-16L118 -8H126V-6H114V-8L122 -16H114Z` (M) |

Z glyphs are paths, not text: sizes 8, 10, 12 with a 2-unit bar and a 45° diagonal, rising up-right
from the head, clear of the rules hat (brim ends x 82) and the update wrench (jaws from y 14).

**Rotations, confirmed from the geometry** (SVG rotation is clockwise-positive, y down): the wrench
drawn at 45° rotated **−30°** about (104,53) lands exactly on the old 15° act pose (jaw top
111.8,24.0). The hammer strikes forward at **+30°** about its grip; its face (126,22) then sits at
(139.7,32.9), which is the sparks' point. Anticipation at −45° draws the head over strip C (in front
of the body). A positive `rig` rotation leans right; a positive `arm-left` rotation raises the clipboard.

**Breath (motion only; the 2026-09-26 breath table is superseded 2026-09-27).** `body` `scaleY` =
1 + stretch × b about (50,84), b 0 → 1. Riders move by the body's stretch at their height: arms
`y` = −31 × stretch × b (y 53), hat `y` = −76 × stretch × b (y 8). Stretch 0.04 gives arms −1.24 and
hat −3.04; nap stretch 0.06 gives −1.86 and −4.56. The feet never move with breathing.

**Overflow (paint only; SVG overflow and transforms cause no layout shift).** The jaw at x 142.89
(2.3px into the gap at 136 wide, as before); sparks to x 154 with fly-out (11px desktop, 7px phone,
inside the ≥75px spare column width at `lg` and the 18px phone gap); a jump lifts the team ridge to
about y −35 (14px above the box desktop, 9px phone, inside the 20px top margin and the phone row's
24px padding); zzz rise to y −28; the entrance starts 60 units up (48px, faded, transient). Squash
and lean reach x ≈ −36 on the left (5px desktop, 3px phone, into the gutter). No sideways scroll at 360.

### 5.7 Components, images, motion

- **Components (`components/home/process/`):** `ProcessSection.tsx` (frame, header, body; the body
  wrapper gains `relative` and holds `ProcessRelay` last), `ProcessList.tsx` (ground line and `<ol>`),
  `ProcessStep.tsx` (bot, chevron, text), `ProcessBot.tsx` (rewritten: the rig in 5.6; props `role`,
  `pose`), `ProcessReturn.tsx`, **new** `ProcessRelay.tsx` (the relay dot, below). Icons unchanged.
  **Motion hooks added to markup (no layout change):** `data-anim="process-list"` on `ProcessList`'s
  root, `process-ground` on the ground line, `process-chevron` on each chevron span (motion scales the
  icon inside, not the masking span), `process-return` on the path box (its first child is the arrowhead).
  **Images:** none.
- **Relay dot (`ProcessRelay`):** `<span aria-hidden="true" data-anim="process-relay" class="pointer-events-none absolute left-0 top-0 -ml-1.25 -mt-1.25 hidden size-2.5 rounded-full bg-accent opacity-0 shadow-[0_0_12px_3px_color-mix(in_oklab,var(--color-accent)_55%,transparent)] lg:block">`.
  10px, centred on its `x`/`y` by the negative margins (so motion owns `transform` alone); the glow is
  built from the token only. Decoration: `opacity-0` without JS is correct.
- **Logic files (one job each):** `lib/processBots.ts` (geometry, `botPivots`, `stepBots`),
  `lib/processBotMotion.ts` (the constants table below, nothing else), `lib/processBotRig.ts` (finds a
  bot's hooks, sets pivots, owns the summed channels, `resetBot`), `lib/processBotLife.ts` (breath,
  sway, drift, blinks, looks, taps), `lib/processBotActs.ts` (role acts, jumps, reactions, naps),
  `lib/processBotPointer.ts` (pure mapping: pointer vector → look and lean), `lib/processRelay.ts`
  (waypoints and the relay / column cascade). Hook: `hooks/useProcessBots.ts` (rewritten; split out
  `useProcessRelay` if it grows a second job). `ProcessMotion` is unchanged.
- **Motion (later), reveals:** `data-anim="reveal"` on the header wrapper and each step's text
  column, never on the `li`, so bots, ground line and chevrons stay put while text rises in.
- **Motion (later), bots.** The 2026-09-26 stop-motion (one 125ms tick, 8fps, stepped, no tweens,
  easing or rotation) is **superseded 2026-09-27** by fully smooth GSAP motion, below. Full motion
  only unless marked. Transforms, `opacity` and `attr` only; no filters.

**Constants (`lib/processBotMotion.ts`; seconds, viewBox units, degrees unless marked).** Ranges are
picked at random each time; per-role values are listed rules / team / check / update.

| Constant | Value | Use |
|---|---|---|
| `BREATH_STRETCH` / `NAP_STRETCH` | 0.04 / 0.06 | body stretch peak (awake / napping) |
| `BREATH_HALF` | 1.25 / 1.1 / 1.35 / 1.4 | half-cycle, `sine.inOut` yoyo (2.2–2.8s full) |
| `ARM_LIFT` / `HAT_LIFT` | 31 / 76 | breath ride per unit of stretch |
| `SWAY_DEG` / `SWAY_HALF` | 1.2 / 1.5 / 1.0 / 1.3 · 2.6 / 3.0 / 2.8 / 3.4 | rig sway ±, `sine.inOut` yoyo |
| `DRIFT_DEG` / `DRIFT_HALF` | 3 · 1.8–2.4 per arm | arm drift ±, arms out of phase |
| `BLINK_GAP` / `CLOSE` / `OPEN` | 2–6 · 0.07 `power2.in` · 0.12 `power2.out` | blinks |
| `DOUBLE_BLINK` / `DOUBLE_GAP` | 0.2 · 0.1 | chance and gap of a second blink |
| `LOOK_MAX` / `LOOK_HOLD` / `LOOK_MOVE` | 7 · 0.8–2 · 0.35–0.6 `power3.out` | autonomous looks (30% return to rest) |
| `TAP_GAP` / `TAP_LIFT` | 7–14 · 3 | foot taps: up 0.09 `power2.out`, down 0.07 `power2.in`, twice |
| `ACT_GAP` | 5–10 | between role acts |
| `NAP_GAP` / `NAP_LENGTH` / `NAP_TIMESCALE` | 25–40 · 4–5 · 0.55 | rules and update only |
| `Z_RISE` / `Z_STAGGER` | 1.6 · 0.5 | each z: `y` −10, `x` +4, scale 0.6 → 1, opacity 0 → 1 (first 25%) → 0, looping |
| `POINTER_RANGE` / `LEAN_RANGE` / `LEAN_MAX` | 240px · 480px · 2.5 | pointer mapping |
| `EYE_FOLLOW` / `LEAN_FOLLOW` / `POINTER_IDLE` | 0.35 · 0.6 (`power3.out` quickTo) · 2.5 | pointer smoothing and hand-back |
| `ANTICIPATE` / `STRETCH` / `SQUASH` | 1.06 × 0.92 · 0.94 × 1.08 · 1.1 × 0.9 | `upper` scaleX × scaleY |
| `SETTLE` | 0.6 `elastic.out(1, 0.4)` | back to scale 1 after any landing |
| `JUMP_UP` / `JUMP_FEET` | 14 / 10 | upper / feet lift (the hover/tap jump, the only jump) |
| `POP_SCALE` / `REACT_COOLDOWN` | 1.25 · 1.2 | eye pop; reaction cooldown from its start |
| `DROP_FROM` / `DROP_FALL` / `DROP_STAGGER` / `DROP_START` | −60 · 0.45 `power2.in` · 0.15 · `"top 75%"` | entrance |
| `RELAY_EVERY` / `RELAY_HOP` / `RELAY_DWELL` / `RELAY_FADE` | 9 · 0.7 `power2.inOut` · 0.15 · 0.2 | relay (start to start) |
| `RETURN_SPEED` / `CHEVRON_PULSE` / `CASCADE_GAP` | 700px/s `none` · 1.35 · 0.6 | return path, chevron and arrowhead pulse, below-`lg` cascade |

**Channels.** Each property has one writer (hook table, 5.6). Summed properties (`rig` rotation,
arm rotations) are plain proxy objects combined in one apply function; arm rotation is drift × mix +
act, and an act eases `mix` to 0 while it needs the arm. Eye position is one `look.d` proxy: the
pointer drives it with `quickTo`; looks and acts tween it after killing the previous look tween. A bot
is in one state at a time: entering, idle, acting, reacting or napping. Blinks, looks and taps run
only in idle; acts and naps never overlap; while not idle, the pointer drives lean but not eyes.

**The layers** (numbers from the table):

1. **Life (always, per bot, out of phase; starts when the bot lands).** Breathing on a `b` proxy
   (random start progress), sway on `rig`, drift on each arm. Feet stay planted.
2. **Blinks:** close then open via `attr`; sometimes a double blink.
3. **Looks:** when the pointer isn't driving, `look.d` glides to a random target and holds.
4. **Taps:** one foot at a time lifts `TAP_LIFT` (it rises under the strip, so the foot shortens; no gap) and taps twice.
5. **Role acts** (one at a time, never while napping). A relay catch plays the full act; the short
   version runs only after a reaction. After a catch or a reaction, the bot's `ACT_GAP` scheduler
   restarts, so its next random act comes 5–10s later.

| Role | Full act | Short |
|---|---|---|
| `rules` | look −7; arm-left act +10° (0.4 `power2.out`, clipboard tilts up); marks to scaleX 0 (0.12, stagger 0.05) then re-written left to right (0.25 each `power2.out`, stagger 0.2); two nods (`upper` 0.95 scaleY / 1.03 scaleX, 0.1 down, 0.2 up); look and arm back (0.5 `power2.inOut`) | marks re-write together (0.3, stagger 0.06), arm +6° and back, one nod |
| `team` | 2–3 strikes: anticipation tool −45°, `upper` squash 1.03 × 0.96, look +5, foot-right `x` +1.5 (0.28 `power2.out`); strike tool +30° (0.09 `power4.in`); impact `upper` 1.05 × 0.94 (0.05) then `SETTLE`, foot-left `x` −1 and back (0.05 / 0.2), sparks: group opacity 1, scale 0.5 → 1.2 about (140,33), sparks fly 4 units along their rays (right; down-right 2.8, 2.8; down), 0.25 `power2.out`, then fade 0.15; after the last, tool to 0 (0.35 `back.out(1.6)`), feet `x` 0, look 0. Arm-right mix 0 throughout | one strike |
| `check` | rig act tilt +3° (0.4 `power2.out`, leans to the lens); figure-8 scan: tool `x` 0 → 4 → 0 → −4 → 0 (0.35 legs) with `y` 0 → 2.5 → 0 → −2.5 → 0 twice (0.175 legs), tool rotation ±4° with `x`, `sine.inOut`; lens-lit flicker (opacity 1/0 held 0.08, 0.05, 0.12, 0.06, ending 1); 35% chance "found it": an eye pop (scale to `POP_SCALE` over 0.1, back over 0.3), feet down, no hop; tilt back (0.5 `power2.inOut`) | tilt + one flicker |
| `update` | look +5; 3 ratchets: tool −30° (0.22 `power2.out`) and back (0.16 `power2.in`), rig act tilt −1.5° with each; then look −7, page flip: `page` opacity 1 (0.06), scaleX 1 → 0 about the spine (0.4 `power2.in`), opacity 0 and scaleX 1 (set); `mark` set to scaleX 0 while covered, re-written (0.3 `power2.out`); look 0 | one ratchet |

6. **Naps (rules and update):** look to 0 (0.4), eyes to slits (0.3 `power2.inOut`), breathing
   stretch → `NAP_STRETCH` and timeScale → `NAP_TIMESCALE` (0.6), sway timeScale 0.6, zzz loop.
   **Wake** (after `NAP_LENGTH`, or early on pointer hover or a relay pass): zzz fade (0.15), eyes open
   (0.08) and pop (0.1, back 0.3), a feet-planted startle (an `upper` squash at 0.1, then `SETTLE`;
   no hop), a double blink 0.3s later, breathing back (0.6).
   A napping bot ignores pointer look.
7. **Eyes follow the pointer** (full motion and `(pointer: fine)`, section live): on `pointermove`
   (rAF-throttled) each bot takes v = pointer − its eye centre, in page px. Look d = clamp(±7,
   ((vx − vy)/√2) / 240 × 7) (the projection onto the up-right diagonal), via `quickTo`
   `EYE_FOLLOW`; lean = clamp(±2.5, vx / 480 × 2.5) on the rig's lean channel via `quickTo`
   `LEAN_FOLLOW`. Eye centre = svg rect left + 0.4706 × width, top + 0.6182 × height (viewBox 50,50),
   cached in page coordinates and refreshed on resize (ResizeObserver on the list) and ScrollTrigger
   refresh; `pageX`/`pageY` need no scroll refresh. After `POINTER_IDLE` without movement, or on
   pointer leaving the window, lean eases to 0 and autonomous looks resume.
8. **Hover / tap reaction:** `pointerenter` (fine pointer) or `pointerdown` (any pointer, no
   `preventDefault`) on a bot's SVG; `REACT_COOLDOWN` from its start; interrupts naps and idle acts.
   Timeline (s): 0 anticipate `upper` (0.1 `power2.out`); 0.1 `upper` `y` −14 with stretch (0.22
   `power2.out`), eyes pop (0.12, back 0.3); 0.16 feet `y` −10 (0.2 `power2.out`: the body lifts first,
   feet leave last); 0.36 feet down (0.16 `power2.in`, land first at 0.52); 0.34 `upper` down (0.22
   `power2.in`, lands 0.56); 0.56 squash (0.06) then `SETTLE`, hat wobble ±4° (`elastic.out`); then the
   short act. This is the only jump: relay catches, the cascade, "found it" and waking keep the feet
   down. Nothing becomes focusable; no cursor change.
9. **Scroll-in entrance (once per page load):** ScrollTrigger on `process-list`, `DROP_START`. If the
   start is already passed at setup (page loaded lower down, or a matchMedia re-run), the bots are
   simply shown and life starts. Otherwise set per bot: `rig` `y` −60, opacity 0; `upper` stretch
   0.9 × 1.15; eyes closed. On enter, staggered 0.15: fall (opacity to 1 over the first 0.15), feet
   land, `upper` squash 1.12 × 0.86 (0.07) then `SETTLE`, eyes open (0.12), glance d ±5 toward the
   next bot (bot 4 at bot 1; sign from the pointer projection), hold 0.5, back to rest (0.4). Life
   starts on each bot's landing. Revert at any point leaves every bot visible.
10. **Crew relay (loop, while live, after all four have landed; first run 1.5s after):**
    - **From `lg` (the dot):** waypoints measured from the DOM relative to the body wrapper, refreshed
      with the eye centres: F1–F4 = each bot's feet (svg left + 0.4706 × width, ground line top + 1);
      K1–K3 = chevron centres; the return box R with xr = R.right − 1, xl = R.left + 1, yb = R.bottom − 1:
      R0 (xr, R.top), R1 (xr, yb − 16), R2 (xr − 4.69, yb − 4.69), R3 (xr − 16, yb), R4 (xl + 16, yb),
      R5 (xl + 4.69, yb − 4.69), R6 (xl, yb − 16), R7 (xl, R.top) (the arrowhead).
      Run: dot to F1, fade in; bot 1 launches (a squash); hop to F2, F3, F4 (`RELAY_HOP`, dwell
      `RELAY_DWELL`); each chevron's icon pulses scale `CHEVRON_PULSE` (0.15 up, 0.3 down) as the dot
      crosses its x; the bot ahead taps a foot as the dot heads its way. Each bot catches on arrival,
      with no jump: an idle bot plays its **full** role act (a busy bot glances at the dot instead; a
      napping bot wakes). After bot
      4, the dot fades out (0.15), fades in at R0, traces R0 → R7 at `RETURN_SPEED` (segment times by
      length, `none`), the arrowhead pulses, the dot fades at R7 and bot 1 catches it.
    - **Below `lg`:** no dot. Every `RELAY_EVERY`, bots 1 → 4 each catch in turn, `CASCADE_GAP` apart,
      as above (full act if idle, glance if busy, wake if napping; no jump).
11. **Pausing and teardown:** every tween, timeline and `delayedCall` the bots make goes in one
    registry; `watchLive` (section off screen or tab hidden) pauses all and resumes them. Pointer
    events are ignored while not live. `gsap.matchMedia()` blocks: full (bots, entrance, reactions);
    full + `lg` (dot); full and below `lg` (cascade); full + fine pointer (follow); reduced (fade).
    On unmount or a mode switch, revert, then `resetBot` removes every `transform` attribute and inline
    style on `[data-bot]` and the relay, and restores the eyes' `y`/`height` from values stored at
    setup: the DOM equals the server markup.
12. **Reduced motion:** no breathing, blinks, looks, taps, acts, naps, relay, pointer, reactions or
    drops. The entrance is `rig` opacity 0 → 1 (`duration.fade`, stagger `stagger.row`) on the same
    trigger, skipped if already passed. The bots show their static pose.

- The ground line and return path don't move; only the chevron icons and the arrowhead pulse (full motion).

### 5.8 Choices for the lead

1. **Tablet is rows, four across from `lg`** (not a 2×2 grid, not four columns at `md`). Reason in 5.1.
2. **Bot stays 136px at 4K,** not larger: the section is capped at 1536 and the type stops growing.
3. ~~**Breath groups inside each frame** (12 hooks per bot) over three outer breath groups.~~
   **Superseded 2026-09-27:** one rig per bot, no frames (5.6).
4. **Return path is a CSS dashed border box** (browser dash rhythm, about 6/6) rather than an SVG
   with exact 8/8 dashes. An SVG can't stretch to the fluid column width without distorting its
   16px corners unless split into three pieces; say if exact 8/8 matters.
5. **Step numbers two-digit ("Step 01")** as on the canvas; the old build showed "Step 1".
6. **Left out:** `Main.dc.html` still has a lone 16×16 cream square on the ground line right of bot 3
   (x 824, y 92–108), not in the brief. It reads as "the work being checked"; add it only on your yes.
7. Step title limit set to 3 words (the voice file has none; the old spec said 4).
8. **Wrench jaw shown in full with `overflow-visible`** on the SVG (2.3px into the column gap, no
   layout effect) rather than clipped at the viewBox edge (as the canvas renders it).
9. **An `upper` group between `rig` and the body** (2026-09-27): the feet must stay planted while
   the body squashes and jumps, so squash and jump live on `upper` (pivot 50,84) and `rig` keeps
   rotation and the entrance. Sway and lean rotate the whole rig about (50,92), feet included, so no
   seam opens; the tips move at most ~2.7 units at the 6.5° peak (check's lean included). The
   alternative (feet fixed, body tilting on them) opens a 1–2 unit gap at the left foot beyond ~1°.
10. **Eyes inside `body`**, so breathing carries them, rather than a sibling with its own ride. Eye
    rects are **drawn at the pose** with `data-look` rather than drawn idle with a static transform,
    keeping "no transforms in markup". Blinks and slits use `attr`, not `scaleY` (slit off-centre).
11. **Feet cut 7 units above each tip** (equal 14 × 7 feet; the left cut is y 83, the right y 85),
    not one shared cut height, which would make unequal feet. Squash `scaleX` shows a brief ~1-unit
    step at the foot joins; it's transient, so left as is.
12. **Relay return:** the dot fades at bot 4 and reappears at the path's right end, rather than
    flying straight down across step 4's text to reach it.
13. **Hammer strike +30° with sparks at (140,33)**; the −45° wind-up draws the head over the body.
14. **Update's `mark` is its own hook** (re-written after the page flip): a small addition to the brief.
15. **No cursor change on bots** (a pointer cursor would suggest a link or an action). Tap uses
    `pointerdown` as briefed, so a scroll that starts on a bot also makes it jump; `pointerup`
    without movement is the alternative.
16. **Chevron pulse is scale only:** no brighter violet token exists; a flash to `text` is the alternative.
