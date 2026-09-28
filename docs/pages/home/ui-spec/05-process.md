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
**Revised 2026-09-28 (user's choice, relay job):** the 10px violet relay dot becomes the canvas's
cream **job block** (choice 6 is now in). The bots pass it along the ground line and each changes it
on a beat of its full act: stamped, built, checked, folded at the corner. A ghost trail and a lit
ground segment follow it, with cream-flashing chevrons; the job itself then rides the return path
back to step 1, lighting it violet (no separate spark). `RELAY_EVERY` 9 → 20 (the run is ≈18s).
Motion only; the static page is unchanged (§5.7 relay job, layer 10; §5.8 choices 6, 12, 16–24).
**Superseded 2026-09-28** (final numbers, below).
**Revised 2026-09-28 (final numbers, the lead's screen check):** the job stops 2s at each bot (not
3s) and sits on the right of every bot, bots 1 and 4 included (not their left), watched by each bot
on that side; `RELAY_EVERY` 20 → 16 (a run, return included, is ≈13.3s at `lg`, 13.9 at 1440, 14.3 at
4K). `JOB_AT`, `RELAY_WATCH`, `JOB_BEATS` and the acts' own timings are retimed to fit inside the 2s
dwell; the job's hold bob and the watch blink no longer play (no stop leaves enough wait over for
them). Screen-checked at 1024, 1440 and 4K: no console errors, no sideways scroll, the job stays
hidden behind the loop label, and the below-`lg` and reduced-motion revert are clean. §5.7 relay job
(layer 10) and its constants table, §5.8 choices 6, 12, 16–24.
**Revised 2026-09-28 (guard added):** the hover/tap reaction is ignored while a bot is active (any
act — relay/cascade step, timed act, loop-back squash) or already reacting; no queued jump. A napping
bot still wakes and jumps. §5.7 item 8's "interrupts naps and idle acts" is **superseded** (napping
still wakes and jumps; acting and reacting no longer get interrupted).
**Revised 2026-09-28 (lesson card, final numbers, the lead's screen check):** the job no longer rides
the return path itself. After bot 4's change it's done: it slides right along the ground line to the
line's end (trailed by the ghosts and the lit segment), pops once as done and fades out there — no
sideways scroll. At the same moment a new 14px `ProcessLesson` card splits off the job's centre,
fades out leaving bot 4 (hidden the whole time, so it never crosses step 4's text), drops in at the
return path's start and rides it alone (no ghosts) back to bot 1. `RELAY_EVERY` 16 → 16.4 (a run,
return included, is ≈13.7s at `lg`, 14.4 at 1440, 14.7 at 4K). Screen-checked at 1024, 1440 and 3840:
no console errors, no sideways scroll, the lesson never shows through the loop label, and the
below-`lg` and reduced-motion revert are clean. §5.7 relay job/lesson (layer 10), its constants table
and the run table, §5.8 choices 12, 18, 21, 26.
**Revised 2026-09-28 (user's choice, phone relay):** below `lg` the 9s catch cascade is replaced by
the same relay turned vertical: a 16px job drops down the bot column on each bot's right, exits down
toward the return row, and a 10px lesson card rides the column's left edge back up to bot 1. Same
16.4s clock and beats; motion only, the static page is unchanged. §5.9, §5.8 choice 27; the
below-`lg` lines of §5.7 are marked superseded where they stand.

### 5.1 Layout (canvas stacked at every width; no pinned title)

- Section frame (§0.1), `id="process"`. Inner: `{container} flex flex-col gap-14 border-t border-line py-section md:gap-20 lg:gap-24`.
- Header: `<div data-anim="reveal" class="flex max-w-250 flex-col gap-5 lg:gap-7">`: `SectionLabel`
  (`process.number`, `process.label`, `as="p"`), `SectionHeading size="heading"`. **No `stickyTitleXl`**:
  Process leaves the pinned-title pattern, like Proofs.
- Body: `<div class="relative isolate flex max-w-2xl flex-col lg:max-w-none lg:gap-10">` → `ProcessList`, then
  `ProcessReturn`, then `ProcessRelay`. **`isolate` added 2026-09-28** (no visual effect): it keeps the
  relay layer's `z-1` inside the body, below the loop label's `lg:z-10` (5.7).
- **Below `lg` (phone and tablet): rows.** **From `lg`: four across on a ground line.** At 768 four
  columns would be ~158px (titles and lines too cramped) and a 2×2 grid breaks the left-to-right line
  the chevrons and return path depend on; rows keep one reading order. From `lg` columns are ≥211px,
  enough for a 136px bot and a 2–3 line step line.

### 5.2 List and step (`ProcessList`, `ProcessStep`)

- `ProcessList`: `<div class="relative">` → ground line `<div aria-hidden="true" class="absolute inset-x-0 top-27 hidden h-0.5 bg-line lg:block">`,
  then the ground-lit overlay (5.7, added 2026-09-28), then `<ol class="grid lg:grid-cols-4 lg:gap-x-8">` of four `ProcessStep`s.
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
  (same column grid as the list, so the path lines up with the bots). **2026-09-28 (§5.9):** it gains
  `data-anim="process-return-row"` (no visual change).
- Below `lg`: `CornerUpLeftIcon` (new) `size-5 shrink-0 text-accent lg:hidden` (`aria-hidden` via `Icon`), then the label.
- From `lg`: the path box `<div class="contents lg:relative lg:col-span-3 lg:ml-15.5 lg:-mr-24 lg:block lg:h-14 lg:rounded-b-2xl lg:border-2 lg:border-t-0 lg:border-dashed lg:border-accent">`.
  Its left and right borders are centred at x 63 in bot 1's and bot 4's columns (62px in, and 32px
  gap + 64px past column 3), as on the canvas. The vector body's centre is x 64 (viewBox x 50); the
  1px difference is kept to match the canvas. Inside: `ChevronUpIcon` `absolute -left-3.25 -top-2.5 hidden size-6 text-accent lg:block`
  (the arrowhead on step 1's end, and the box's first child), then the label, then the return-lit
  overlay (5.7, added 2026-09-28, last child). `contents` below `lg` lets the label sit in the phone row.
- Label `<p class="{monoLabel} lg:absolute lg:inset-x-0 lg:bottom-0 lg:z-10 lg:translate-y-[calc(50%+1px)] lg:text-center">`
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
The relay's elements (motion only) have their own sizes tables: 5.7 from `lg`, 5.9 below `lg`.

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

The relay adds no text and no slots.

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
  wrapper is `relative isolate` and holds `ProcessRelay` last), `ProcessList.tsx` (ground line, the
  ground-lit overlay, `<ol>`), `ProcessStep.tsx` (bot, chevron, text), `ProcessBot.tsx` (rewritten:
  the rig in 5.6; props `role`, `pose`), `ProcessReturn.tsx` (the path box gains the return-lit
  overlay as its last child), `ProcessRelay.tsx` (**revised 2026-09-28:** the relay layer, in paint
  order the three ghosts, then `ProcessJob`, then `ProcessLesson`), `ProcessJob.tsx` (the job SVG, one
  part), **new (2026-09-28)** `ProcessLesson.tsx` (the 14px lesson card SVG that rides the return, one
  part). Icons unchanged.
  **Motion hooks added to markup (no layout change):** `data-anim="process-list"` on `ProcessList`'s
  root, `process-ground` on the ground line, `process-chevron` on each chevron span (motion scales and
  tints the icon inside, not the masking span), `process-return` on the path box (its first child is
  the arrowhead); **2026-09-28:** `process-relay` (the job), `data-job="…"` on its parts,
  `process-relay-ghost` ×3, `process-ground-lit`, `process-return-lit`, `process-lesson` (the lesson
  card), `data-lesson="…"` on its parts; **§5.9:** `process-return-row` on `ProcessReturn`'s wrapper.
  **Images:** none.
- **Logic files (one job each):** `lib/processBots.ts` (geometry, `botPivots`, `stepBots`),
  `lib/processBotMotion.ts` (the constants table below, nothing else), `lib/processBotRig.ts` (finds a
  bot's hooks, sets pivots, owns the summed channels, `resetBot`), `lib/processBotLife.ts` (breath,
  sway, drift, blinks, looks, taps), `lib/processBotActs.ts` (role acts, jumps, reactions, naps),
  `lib/processBotPointer.ts` (pure mapping: pointer vector → look and lean), `lib/processRelay.ts`
  (waypoints, the relay run and the column cascade), `lib/processRelayJob.ts` (the job's blank start,
  each bot's change, its wait-bob and its slide/pop/fade exit at the ground line's end),
  `lib/processRelayLesson.ts` (**new, 2026-09-28:** the lesson's split-off the job, its leave/enter
  onto the return path and its pop-out at the arrowhead), `lib/processRelayTrail.ts` (ghosts and the
  lit ground segment for hops and the job's exit slide, chevron/arrowhead flashes, the return-lit
  overlay — no ghosts on the return), `lib/processJob.ts` (the job's paths and pivots),
  `lib/processLesson.ts` (**new, 2026-09-28:** the lesson card's path and line). Hook:
  `hooks/useProcessBots.ts` (wires the relay/lesson parts in). `ProcessMotion` is unchanged.
  **§5.9 (2026-09-28):** new `lib/processRelayColumn.ts` (the relay run below `lg`); the column
  cascade leaves `lib/processRelay.ts`.
- **Motion (later), reveals:** `data-anim="reveal"` on the header wrapper and each step's text
  column, never on the `li`, so bots, ground line and chevrons stay put while text rises in.
- **Motion (later), bots.** The 2026-09-26 stop-motion (one 125ms tick, 8fps, stepped, no tweens,
  easing or rotation) is **superseded 2026-09-27** by fully smooth GSAP motion, below. Full motion
  only unless marked. Transforms, `opacity` and `attr` only; no filters.

#### Relay job, trail and lit lines (revised 2026-09-28; replaces the 10px dot and the cream spark)

Motion only, from `lg`. Every element here is decorative: `aria-hidden`, `pointer-events-none`, SVGs
`focusable="false"`, `hidden lg:block`, starting at `opacity-0`. Without JS, under reduced motion and
below `lg`, nothing new is visible. Motion owns `transform` alone on each moving element; negative
margins set the anchor. Flat token fills only, sharp corners, 45° cuts (the bots' language).
**Below `lg`: superseded 2026-09-28 by §5.9.** The layer, ghosts, job and lesson now show at every
width (still `opacity-0` at rest, so without JS and under reduced motion nothing new is visible);
the two lit overlays stay `lg` only. The tree below carries the revised classes.

```
ProcessRelay (last in the body wrapper)
└ div (layer)  aria-hidden="true" class="pointer-events-none absolute inset-0 z-1"   (was `hidden lg:block`, §5.9)
  ├ svg ×3  data-anim="process-relay-ghost" viewBox="0 0 24 24" class="absolute left-0 top-0 -ml-2 -mt-4 size-4 opacity-0 lg:-ml-3 lg:-mt-6 lg:size-6"
  │   └ path d="M0 0H18L24 6V24H0Z" class="fill-cream"
  ├ ProcessJob: svg data-anim="process-relay" viewBox="0 -5 24 29" class="absolute left-0 top-0 -ml-2 -mt-4.75 h-4.75 w-4 overflow-visible opacity-0 lg:-ml-3 lg:-mt-7.25 lg:h-7.25 lg:w-6"
  │   └ the parts below, in paint order
  └ ProcessLesson (new, 2026-09-28): svg data-anim="process-lesson" viewBox="0 0 14 14" class="absolute left-0 top-0 -ml-1.25 -mt-1.25 size-2.5 opacity-0 lg:-ml-1.75 lg:-mt-1.75 lg:size-3.5"
      ├ path data-lesson="base" d="M0 0H11L14 3V14H0Z" class="fill-cream"
      └ path data-lesson="line" d="M2.5 5.5h9v2.5h-9Z" class="fill-accent"
```

The layer sits at `z-1`: above the bots, below the loop label (`lg:z-10`, with a taller `bg-bg`
backing, `lg:px-5 lg:py-3`), so the job (and, after it, the lesson) is fully hidden while it crosses
behind the label and never peeks from behind a bot. **Revised 2026-09-28:** there is no spark, and
the job no longer rides the return path itself — after bot 4's change it's done and slides off along
the ground line; a separate lesson card splits off it and rides the return alone (below).

**The job (`ProcessJob`, inline SVG).** 1 unit = 1px. A 24 × 24 cream sheet with its top-right
corner cut at 45° by 6 (the fold hinge). Anchor: `(x, y)` is its **bottom centre**, and its bottom
sits on the ground line's top edge, like the bots' feet; `transformOrigin: "50% 100%"`. The markup
draws the **finished** job (static = final state, hidden) except the glow, which is hidden even
finished (it's a flash only); at each run start, while hidden, motion sets the blank state (rules
`scaleX` 0, stamp `scale` 0, band/step `scaleY` 0, tick `opacity` 0, fold flat along its hinge,
glow `opacity` 0). Pivots via `svgOrigin`, viewBox units.

| `data-job` | `d` | Fill | Pivot | Change (who, when) |
|---|---|---|---|---|
| `base` | `M0 0H18L24 6V24H0Z` | `fill-cream` | none | always shown |
| `rule` ×2 | `M3 4h11v2.5H3Z` · `M3 9h7v2.5H3Z` | `fill-ink` | 3 5.25 · 3 10.25 | `scaleX` 0 → 1: written (bot 1) |
| `stamp` | `M3 13h5v5H3Z` | `fill-accent` | 5.5 15.5 | `scale` 0 → 1, thumped in: stamped (bot 1) |
| `band` | `M0 19.5h24V24H0Z` | `fill-accent` | 12 24 | `scaleY` 0 → 1: built, strike 1 (bot 2) |
| `step` | `M0 -5h10v5H0Z` | `fill-accent` | 5 0 | `scaleY` 0 → 1: built, strike 2 (bot 2) |
| `tick` | `M11.5 14.5L13 13L15 15L19 11L20.5 12.5L15 18Z` | `fill-ink` | 16 14.5 | `opacity` flicker, `scale` 1.3 → 1: checked (bot 3) |
| `fold` | `M18 0V6H24Z` | `fill-cream-muted` | 18 6 | corner folds over its hinge on the page-flip beat (bot 4) |
| `glow` | same as `base` | `fill-none stroke-accent` | 12 12 | outline flash, full then fading, on check's last flicker (bot 3) |

Every mark reads at 24px: rules and tick are ink on cream, the stamp and band/step violet (the
crew's colour: what the agents added), the fold a muted-cream flap showing the sheet's underside.
The tick's six edges are all 45°. The ghosts are the bare `base` silhouette.

**The lesson (`ProcessLesson`, new 2026-09-28, inline SVG).** 1 unit = 1px. A 14 × 14 cream card,
echoing the job's cut corner at 45° by 3 (the job's is 6), carrying one violet line — a rule kept
from the rulebook. Anchor: `(x, y)` is its **centre** (unlike the job's bottom-centre), so it can
peel up off the sheet and sit centred on the return path's line; `transformOrigin: "50% 50%"`. The
markup draws it finished, hidden at rest; motion never blanks its parts, only the whole card's
`opacity`/`scale`/position.

| `data-lesson` | `d` | Fill | Meaning |
|---|---|---|---|
| `base` | `M0 0H11L14 3V14H0Z` | `fill-cream` | the card |
| `line` | `M2.5 5.5h9v2.5h-9Z` | `fill-accent` | the one kept rule |

**Overlays (added only; the ground line, chevrons and dashed path are unchanged).**
- **Ground lit** (in `ProcessList`, right after the ground line and before `<ol>`, so each chevron's
  `bg-bg` mask still covers it): `<div aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-27 hidden h-0.5 overflow-hidden lg:block">`
  → `<span data-anim="process-ground-lit" class="absolute left-0 top-0 h-0.5 w-32 bg-linear-to-r from-accent/0 to-accent opacity-0">`.
  The clip box is the ground line's own box, so the moving segment never shows past the line or
  widens the page.
- **Return lit** (last child of the `process-return` box, after the label, so the label's `z-10` and
  `bg-bg` span still mask it; the arrowhead stays the first child):
  `<span aria-hidden="true" data-anim="process-return-lit" class="pointer-events-none absolute -inset-x-0.5 top-0.5 -bottom-0.5 hidden rounded-b-2xl border-2 border-t-0 border-accent opacity-0 lg:block">`.
  It covers the dashed border exactly (outer radius 16), solid, so where it's lit the dashes read as
  one violet line. It stops 2px short at the top, clear of the arrowhead's apex.

**Paint order.** The layer's `z-1` inside the `isolate` body puts the job and ghosts **above** the
bots and ground line but **below** the loop label (`lg:z-10`): the job never peeks from behind a
bot, and while it crosses behind the label (on its way along the ground line, and again on the
return) it's fully hidden by the label's taller `bg-bg` backing. At every stop it sits in open
space, fully visible.

#### Sizes: relay job, trail and lit lines

| Element | Phone 360 | Tablet 768 | Desktop 1440 (and `lg` 1024) | 4K 3840 |
|---|---|---|---|---|
| Job (`w-6 h-7.25`) | none | none | 24 × 24, bottom on the line (y 108); step rises 5 above while built | same |
| Job stops | none | none | on the right of every bot: rules, team and check under the hand / hammer / lens (viewBox x 122); update further right (x 126), clear of the wrench | same |
| Job exit (**new 2026-09-28**) | none | none | slides to 14px inside the ground line's right end, pops (scale 1.12), fades | same |
| Lesson (`size-3.5`, **new 2026-09-28**) | none | none | 14 × 14, splits off the job's centre at bot 4, centred on the return path | same |
| Ghosts (`size-6`) | none | none | 3, scale 0.85 / 0.7 / 0.55, opacity 0.45 / 0.28 / 0.14; run every hop and the job's exit slide, never the return | same |
| Ground lit (`w-32 h-0.5`) | none | none | 128 × 2, head under the job's centre; also lights the exit slide | same |
| Chevron light | none | none | icon to `cream` and scale 1.35 | same |
| Return lit | none | none | solid 2px, x 63 → 1083 (lg: 63 → ~794), lit behind the lesson as it rides the path | x 63 → 1239 |

The bots hold 136px from `lg`, so every relay size is fixed; only the leg and path lengths grow.
**Below `lg`: see §5.9** (revised 2026-09-28; the Phone and Tablet "none" above now holds only for
the ground lit, chevron light and return lit; was "nothing new exists below `lg`").

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
| `RELAY_EVERY` / `RELAY_FIRST` | **16.4** (was 9, then 15, then 20, then 16) · 1.5 | relay, start to start (run, return included, ≈ 13.7 at `lg`, 14.4 at 1440, 14.7 at 4K, so about 1.7–2.7s rest between runs); first run after all land. **§5.9:** the same cadence below `lg` (phone run ≈12.9–13.2) |
| ~~`CASCADE_EVERY` / `CASCADE_GAP`~~ | ~~9 · 0.6~~ | **removed 2026-09-28 (§5.9):** below `lg` the relay runs instead of the cascade |
| `RELAY_HOP` / `RELAY_FADE` | 0.7 `power2.inOut` · 0.2 | job hop between stops; job fade in at run start |
| `RELAY_DWELL` | **2.0 / 2.0 / 2.0 / 2.0** (was 0.15, then 2.0/1.6/1.8/2.4, then 3.0/3.0/3.0/3.0) | arrival → departure per stop, every role the same now |
| `RELAY_STRIKES` / `RELAY_GLANCE` | 2 · 5 | team's strikes on a relay catch (timed acts keep 2–3); a busy bot's glance |
| `RELAY_WATCH` / `RELAY_WATCH_BLINK` | 7 / 5 / 7 / 7 (was −7 / 5 / 7 / −7: every bot holds the job on its right now) · 0.4 | look d while the job waits at a bot, toward it; one blink if the wait leaves at least this much — **with the 2s dwell, no stop leaves that much, so the blink never plays now** |
| `RELAY_CLEAR` | 3.5 | no timed act starts within this of a bot's next catch; no nap within `NAP_LENGTH` max + this |
| `JOB_AT` | 122 / 122 / 122 / 126 (was −15 / 122 / 122 / −15: rules and update moved from the bot's left to its right) | each stop's bot viewBox x, always on the bot's right (rules/team/check under the hand, hammer or lens; update 4 units further right so the built step clears the wrench handle) |
| `JOB_POP` | scale 0.6 → 1, 0.3 `back.out(1.7)` | a fresh job appears at stop 1 |
| `JOB_BEATS` | rules marks 0.55, 0.75, stamp 1.05 (was 0.7, 0.9, 1.4) · team 0.37, 1.04 (unchanged) · check 1.08 / 1.13 / 1.25 (unchanged) · update flip 0.95, rewrite 1.35 (was flip 1.96, no separate rewrite beat) | job changes, seconds after arrival; the same moments as the acts (shared with `lib/processBotActs.ts`), retimed to fit inside the 2s `RELAY_DWELL` |
| `JOB_STAMP` / `JOB_BUILD` | part 0.18 `back.out(2.5)`, job 1.08 × 0.88 0.1 `power2.out` · part 0 → 1, 0.12 `back.out(2)` (with `JOB_SQUASH`) | then `SETTLE`; job scaleX × scaleY |
| `JOB_SQUASH` / `JOB_TICK` / `JOB_GLOW` | 1.06 × 0.92, 0.05 `power2.out` · 1.3 → 1, 0.2 `power2.out` · grow 1.15, 0.5 `power1.out` | the small pop on team/check/update; tick pop; check's outline flash and fade |
| `JOB_FOLD` | = `PAGE_FLIP`, 0.35 `power2.in` (was 0.4: `PAGE_FLIP` itself shortened) | update's corner folds over its hinge, same ease and length as the page flip |
| `JOB_BOB` | lift 1.5px, 0.4 `sine.inOut` each way | one lift-and-settle while the job waits at a bot, skipped if the wait's too short — **with the 2s dwell, no stop has enough left over, so it never plays now** |
| `JOB_EXIT` / `JOB_EXIT_INSET` (**new 2026-09-28**) | speed 480px/s `power2.inOut`, min 0.35s · 14px | after bot 4: the job slides right to `JOB_EXIT_INSET` px inside the ground line's end, never quicker than `min` (0.35s at `lg`/1440, 0.46s at 4K); the inset keeps the 24px sheet on the line at the done pop's peak |
| `JOB_DONE` / `JOB_FADE` (**new 2026-09-28**) | scale 1.12, up 0.12 `power2.out` / down 0.3 `back.out(3)` · fade 0.3 `power1.in` | the job's one "done" pop at the line's end, then it fades out where it stands |
| **`JOB_LEAVE` / `JOB_ENTER` / `JOB_OUT` are removed 2026-09-28** | — | superseded by the job's own exit (`JOB_EXIT`/`JOB_DONE`/`JOB_FADE`) and the lesson's own moves (`LESSON_*`, below) |
| `LESSON_SPLIT` (**new 2026-09-28**) | from 0.6, fade 0.15, peel 10px `power2.out`, 0.35 `back.out(1.7)`, hold 0.15 | at bot 4: the lesson pops in off the job's centre, fades in, and peels 10px up off the sheet |
| `LESSON_LEAVE` / `LESSON_ENTER` (**new 2026-09-28**) | lift 4px, 0.2 `power2.in` · from 8px, 0.3 `power2.out` | leaving bot 4 (fades out, hidden while it crosses step 4's text); dropping onto the return path at R0, fading in |
| `LESSON_OUT` (**new 2026-09-28**) | scale 1.3, 0.25 `power2.out` | popping out at the arrowhead as bot 1 takes the loop back |
| `GHOST_LAG` / `GHOST_SCALE` / `GHOST_OPACITY` | 0.03 · 0.85 / 0.7 / 0.55 · 0.45 / 0.28 / 0.14 | trail: per ghost k = 1–3; in 0.1, out 0.15; runs the job's hops and its exit slide, never the return |
| `LIT_LENGTH` / `LIT_IN` / `LIT_FADE` | 128px · 0.1 · 0.5 | ground-lit segment |
| `RETURN_SPEED` / `RETURN_LIT_FADE` | 450px/s `none` · 0.6 | **the lesson's** speed along the return path (was the job's before the 2026-09-28 split); return light fade |
| `CHEVRON_PULSE` | 1.35 · 0.15 up `power2.out` / 0.3 down `power2.inOut`, colour `accent` → `cream` → `accent` | chevrons and the arrowhead |

**Channels.** Each property has one writer (hook table, 5.6). Summed properties (`rig` rotation,
arm rotations) are plain proxy objects combined in one apply function; arm rotation is drift × mix +
act, and an act eases `mix` to 0 while it needs the arm. Eye position is one `look.d` proxy: the
pointer drives it with `quickTo`; looks and acts tween it after killing the previous look tween. A bot
is in one state at a time: entering, idle, acting, reacting or napping. Blinks, looks and taps run
only in idle; acts and naps never overlap; while not idle, the pointer drives lean but not eyes.
The job's `x`/`y`/`scale`/`opacity` and each `data-job` part are written only by the relay timeline.

**The layers** (numbers from the table):

1. **Life (always, per bot, out of phase; starts when the bot lands).** Breathing on a `b` proxy
   (random start progress), sway on `rig`, drift on each arm. Feet stay planted.
2. **Blinks:** close then open via `attr`; sometimes a double blink.
3. **Looks:** when the pointer isn't driving, `look.d` glides to a random target and holds.
4. **Taps:** one foot at a time lifts `TAP_LIFT` (it rises under the strip, so the foot shortens; no gap) and taps twice.
5. **Role acts** (one at a time, never while napping). A relay catch plays the full act; the short
   version runs only after a reaction. After a catch or a reaction, the bot's `ACT_GAP` scheduler
   restarts, so its next random act comes 5–10s later.

Every full act is compressed to end inside the relay's 2s dwell (retimed 2026-09-28, final numbers):

| Role | Full act | Short |
|---|---|---|
| `rules` | look −7; arm-left act +10° (0.4 `power2.out`, clipboard tilts up); marks to scaleX 0 (0.12, stagger 0.05, from 0.3) then re-written left to right (0.25 each `power2.out`, stagger 0.2, from 0.55); two nods at the stamp beat 1.05 and 1.35 (`upper` 0.95 scaleY / 1.03 scaleX, 0.1 down, 0.2 up); look and arm back from 1.3 (0.45 `power2.inOut`), ending **1.75** | marks re-write together (0.3, stagger 0.06), arm +6° and back, one nod |
| `team` | 2–3 strikes (`RELAY_STRIKES` = 2 on a relay catch): anticipation tool −45°, `upper` squash 1.03 × 0.96, look +5, foot-right `x` +1.5 (0.28 `power2.out`); strike tool +30° (0.09 `power4.in`); impact `upper` 1.05 × 0.94 (0.05) then `SETTLE` (0.6 `elastic.out(1, 0.4)` — the settle, not the hit, is most of the act's length); foot-left `x` −1 and back (0.05 / 0.2), sparks: group opacity 1, scale 0.5 → 1.2 about (140,33), sparks fly 4 units along their rays (right; down-right 2.8, 2.8; down), 0.25 `power2.out`, then fade 0.15; after the last impact (hit 1.04 on a catch), tool to 0 (0.35 `back.out(1.6)`), feet `x` 0, look 0 (0.4 `power2.inOut`); the last `upper` `SETTLE` ends the act at **1.69**. Arm-right mix 0 throughout | one strike |
| `check` | rig act tilt +3° (0.4 `power2.out`, leans to the lens); figure-8 scan: tool `x` 0 → 4 → 0 → −4 → 0 (0.35 legs) with `y` 0 → 2.5 → 0 → −2.5 → 0 twice (0.175 legs), tool rotation ±4° with `x`, `sine.inOut`; lens-lit flicker (`LENS_FLICKER`, opacity 1/0 at 1.0/1.08/1.13/1.25, ending 1); 35% chance "found it": an eye pop (scale to `POP_SCALE` over 0.1, back over 0.3) at 1.55, feet down, no hop; tilt (and, on a relay catch, the look onto the job) back from 1.55 (0.4 `power2.inOut`), ending **1.95** | tilt + one flicker |
| `update` | look +5, mixR to 0 (0.2–0.25 `power2.out`); 3 ratchets at 0.1, 0.36, 0.62: tool −30° (`RATCHET.turn` 0.14 `power2.out`) and back (`RATCHET.back` 0.1 `power2.in`), rig act tilt −1.5° with each; then look −7 from `flip − 0.3` (0.3 `power2.inOut`), mixR to 1 at 0.86; page flip at 0.95 (`JOB_BEATS.update.flip`): `page` opacity 1 (0.06), scaleX 1 → 0 about the spine (`PAGE_FLIP` 0.35 `power2.in`), opacity 0 and scaleX 1 (set); `mark` set to scaleX 0 while covered, re-written at 1.35 (`JOB_BEATS.update.rewrite`, 0.3 `power2.out`); look back from 1.5 (0.4 `power2.inOut`), ending **1.9** | one ratchet |

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
   `preventDefault`) on a bot's SVG; `REACT_COOLDOWN` from its start. **Revised 2026-09-28:** ignored
   while a bot is active (any act — its relay step, the cascade step, a timed act, the loop-back
   squash) or already reacting; no queued jump. A napping bot still wakes and jumps on hover or tap
   (unchanged). Eye and lean follow are unchanged. Was: interrupts naps and idle acts.
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
10. **Crew relay: the job and the lesson (revised 2026-09-28, final numbers from the lead's screen
    check).** Loops while live, after all four have landed; first run `RELAY_FIRST` after, then every
    `RELAY_EVERY` (16.4s) start to start. Each bot catches the job at its step, on the right of it
    (bots 1 and 4 included), changes it on a beat of its full act, and — for the rest of its 2s dwell —
    watches it (`RELAY_WATCH`, a glance to the right). The 2s dwell leaves too little over for the hold
    bob (`JOB_BOB`) or a watch blink (`RELAY_WATCH_BLINK`), so neither plays now (open question: see
    `../sections/05-process.md`). After bot 4's change the job is done: it slides right along the
    ground line to `JOB_EXIT_INSET` px inside the line's end, trailed as on a hop, pops once
    (`JOB_DONE`) and fades (`JOB_FADE`) — never past the line, so never a sideways scroll. At the same
    moment a small lesson card splits off the job's centre (`LESSON_SPLIT`), fades out leaving bot 4
    (`LESSON_LEAVE`, hidden the whole time so it never crosses step 4's text), drops in at the return
    path's start (`LESSON_ENTER`) and rides it alone — no ghosts — at `RETURN_SPEED`, lighting it, to
    the arrowhead, where it pops out (`LESSON_OUT`) as bot 1 takes the loop back.
    - **Waypoints (from `lg`)**, measured relative to the relay layer (the body wrapper's box, `z-1`,
      under the loop label's `lg:z-10`), refreshed with the eye centres. **J1–J4**, each bot's stop:
      x = svg left + (`JOB_AT[role]` + 30) / 170 × width, y = ground line top. K1–K3 = chevron
      centres. R0–R7 on the return path's centre line, with xr = R.right − 1, xl = R.left + 1,
      yb = R.bottom − 1: R0 (xr, R.top), R1 (xr, yb − 16), R2 (xr − 4.69, yb − 4.69), R3 (xr − 16, yb),
      R4 (xl + 16, yb), R5 (xl + 4.69, yb − 4.69), R6 (xl, yb − 16), R7 (xl, R.top).
    - **The run** (s; A1–A4 = arrival at each stop, when `arrive(i)` starts the bot's full act; a run,
      return included, is ≈13.7s at `lg`, 14.4s at 1440, 14.7s at 4K):

    | t | Job / lesson | Bot (act beat) | Lights |
    |---|---|---|---|
    | 0 | job set at J1, blank; opacity 0 → 1 (`RELAY_FADE`), `JOB_POP` | | |
    | A1 = 0.2 | | bot 1 full act (ends 1.95) | |
    | A1 + 0.55 / + 0.75 | rule 1 / rule 2 `scaleX` 0 → 1 (`MARK_WRITE`) | clipboard marks 1 / 2 re-written | |
    | A1 + 1.05 | stamp thumps in (`JOB_STAMP`), then `SETTLE` | first nod | |
    | A1 + 1.05 → 2.2 | the job holds (too little of the dwell left for `JOB_BOB` or a watch blink) | bot 1's eyes stay on it (`RELAY_WATCH`) | |
    | 2.2 → 2.9 | hop to J2 | `head(1)`: bot 2 taps a foot | ghosts, ground lit; chevron 1 at its crossing |
    | A2 = 2.9 | | bot 2 full act (ends 4.59) | |
    | A2 + 0.37 / + 1.04 | band / step grow, job pops (`JOB_BUILD` + `JOB_SQUASH`) | strike 1 / strike 2 impact | |
    | 4.9 → 5.6 | hop to J3 | `head(2)` | chevron 2 |
    | A3 = 5.6 | | bot 3 full act (ends 7.55; "found it" pop and tilt-back start 7.15) | |
    | A3 + 1.08 / 1.13 / 1.25 | tick opacity 1 / 0 / 1 + `JOB_TICK`; glow flashes full then fades (`JOB_GLOW`) | lens-lit flicker, same beats | |
    | 7.6 → 8.3 | hop to J4 | `head(3)` | chevron 3 |
    | A4 = 8.3 | | bot 4 full act (ends 10.2) | |
    | A4 + 0.95 | corner folds over its hinge (`JOB_FOLD`, 0.35s), then `JOB_SQUASH` | page flip (same ease and length); mark re-written at A4 + 1.35 | |
    | 10.3 | job slides right to the line's end (`JOB_EXIT`, 0.35s at `lg`/1440, 0.46s at 4K), ghosts and ground lit trail it; lesson splits off the job's centre, fading and peeling in (`LESSON_SPLIT`) | | |
    | 10.65 | job at the line's end, pops as done (`JOB_DONE`, settled 11.07) | | |
    | 10.8 | lesson done splitting (0.35s + 0.15s hold); `head(0)`: the loop heads back to bot 1 | | |
    | 10.8 → 11.0 | lesson fades out leaving bot 4 (`LESSON_LEAVE`, hidden — never crosses step 4's text) | | |
    | 11.07 → 11.37 | job fades out where it stands (`JOB_FADE`) | | |
    | 11.0 → 11.3 | lesson drops in at R0, fading in (`LESSON_ENTER`) | | |
    | 11.3 → 13.72 | lesson rides R0 → R7 at `RETURN_SPEED` (450px/s, linear); no ghosts | | return lit follows the lesson |
    | 13.72 → 13.97 | at R7: lesson pops out, scaling up as it fades (`LESSON_OUT`); `receive(0)`: bot 1 takes it back | | arrowhead pulse; return lit fades |

    - **Hops.** The job tweens J(i) → J(i+1) with `RELAY_HOP`; its exit slide to the ground line's end
      after bot 4 tweens the same way with `JOB_EXIT`'s own duration and ease. Ghost k repeats
      whichever tween `GHOST_LAG` × k later, at `GHOST_SCALE[k]`, fading to `GHOST_OPACITY[k]` (0.1) at
      its start and to 0 (0.15) ending at its arrival; the ghosts paint under the job and fold into it
      at each stop (and at the exit's end). They never run the return leg — the lesson rides that
      alone. The ground-lit span fades in (`LIT_IN`) at hop start, its `x` = job x − `LIT_LENGTH` on
      the same tween (head under the job's centre, the tail behind it), and fades (`LIT_FADE`) on
      arrival — also true of the exit slide. At each chevron's crossing (the existing ease-inverted
      time), its icon pulses `CHEVRON_PULSE`: scale and colour to `cream` together, then back; cream is
      read from `--color-cream` at setup (never a literal), and `clearProps: "color"` returns it to
      `text-accent`. The arrowhead does the same at R7.
    - **The job's exit and the lesson's return (revised 2026-09-28: the job no longer rides the path
      itself).** After bot 4's change, the job slides right along the ground line to
      `JOB_EXIT_INSET` px inside its right end (`JOB_EXIT`), pops once as done about its bottom centre
      (`JOB_DONE`) and fades where it stands (`JOB_FADE`) — it never reaches the return path. At the
      same moment the lesson card splits off the job's centre (`LESSON_SPLIT`: pops in, fades in,
      peels `LESSON_SPLIT.peel` px up off the sheet), then fades out leaving bot 4 (`LESSON_LEAVE`,
      hidden throughout, so it never flies across step 4's text) and drops in at R0 from above, fading
      back in (`LESSON_ENTER`), centred on the path's centre line. It then rides R0 → R7 at
      `RETURN_SPEED` alone — no ghosts — each leg timed by its length. At the ride's start the
      return-lit overlay gets opacity 1 and `clipPath` `inset(0px 0px 0px 100%)`; each leg's tween also
      moves the inset's left edge to (that waypoint's x − R.left − 2)px on the same timing, so the
      dashes turn solid violet behind the lesson. At R7 the arrowhead flashes, the overlay fades
      (`RETURN_LIT_FADE`), and the lesson scales up and fades (`LESSON_OUT`) as bot 1 takes it back
      (`receive(0)`).
    - **Beats run on the relay's clock**, at `JOB_BEATS` after each arrival, the same moments
      `catchRelay` starts the act, so the story holds even when a bot can't act. **Catch priority:**
      the relay publishes each bot's next catch (run start + A(i)); a timed act doesn't start within
      `RELAY_CLEAR` of it and a nap not within `NAP_LENGTH` max + `RELAY_CLEAR`; both retry after
      `BUSY_RETRY`. So a bot is idle at its catch unless the visitor just made it react; then it
      glances at the job (a napping one wakes), as before, and the job still changes.
    - **The job and lesson never cross the text, the label or the page edge:** J1's left edge is 4px
      inside the body, the right-hand stops end ~130px into columns of 211–360px, the job's exit stops
      `JOB_EXIT_INSET` px short of the ground line's right end, and the lit segment is clipped to the
      ground line. The job passes fully hidden behind the loop label while it crosses behind it along
      the ground line; the lesson is hidden throughout its hop off bot 4 (it never flies across step
      4's text) and, like the job before it, passes fully hidden behind the loop label along the
      return path.
    - **Below `lg`:** ~~unchanged. No job, lesson, trail or lit lines. Every `CASCADE_EVERY`, bots 1 → 4
      each catch in turn, `CASCADE_GAP` apart (full act if idle, glance if busy, wake if napping; no
      jump).~~ **Superseded 2026-09-28 by §5.9:** the same run turned vertical (no lit lines).
11. **Pausing and teardown:** every tween, timeline and `delayedCall` the bots and the relay make go
    in one registry; `watchLive` (section off screen or tab hidden) pauses all and resumes them.
    Pointer events are ignored while not live. `gsap.matchMedia()` blocks: full (bots, entrance,
    reactions); full + `lg` (the job/lesson relay, trail and lit lines); full and below `lg` (cascade;
    **superseded 2026-09-28:** the column relay, §5.9); full + fine pointer (follow); reduced (fade).
    On unmount or a mode switch, revert, then `resetBot`
    removes every `transform` attribute and inline style on `[data-bot]`, and the relay's strip removes
    them on the job and its `data-job` parts, the lesson and its `data-lesson` parts, the ghosts, both
    lit overlays, the chevron icons and the arrowhead (inline `color` and `clip-path` included), and
    restores the eyes' `y`/`height` from values stored at setup: the DOM equals the server markup.
    **§5.9:** the strip also covers the phone return icon.
12. **Reduced motion:** no breathing, blinks, looks, taps, acts, naps, relay, pointer, reactions or
    drops. The entrance is `rig` opacity 0 → 1 (`duration.fade`, stagger `stagger.row`) on the same
    trigger, skipped if already passed. The bots show their static pose. The job, lesson, ghosts and
    lit overlays are never shown (decoration; `opacity-0` stays).

- The ground line, chevron spans and return path never move; only the chevron icons and arrowhead
  pulse and tint, and the two overlays light over them (full motion, from `lg`).

### 5.8 Choices for the lead

1. **Tablet is rows, four across from `lg`** (not a 2×2 grid, not four columns at `md`). Reason in 5.1.
2. **Bot stays 136px at 4K,** not larger: the section is capped at 1536 and the type stops growing.
3. ~~**Breath groups inside each frame** (12 hooks per bot) over three outer breath groups.~~
   **Superseded 2026-09-27:** one rig per bot, no frames (5.6).
4. **Return path is a CSS dashed border box** (browser dash rhythm, about 6/6) rather than an SVG
   with exact 8/8 dashes. An SVG can't stretch to the fluid column width without distorting its
   16px corners unless split into three pieces; say if exact 8/8 matters.
5. **Step numbers two-digit ("Step 01")** as on the canvas; the old build showed "Step 1".
6. **The canvas's lone cream job square: in (user's yes, 2026-09-28)**, as the relay's moving job,
   not as the static square at x 824. The static page still shows nothing on the ground line. Was
   "left out, add only on your yes" (2026-09-26).
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
12. **Relay return (revised twice 2026-09-28, final):** a lesson card drops in at the return path's
    top-right start and rides the path itself back to bot 1, splitting off the job at bot 4 rather than
    the job itself riding the path (**superseded 2026-09-28**, choice 26), which itself replaced the
    job flying down across step 4's text to reach the path, or being filed away with a separate spark
    tracing the return (both **superseded 2026-09-28**).
13. **Hammer strike +30° with sparks at (140,33)**; the −45° wind-up draws the head over the body.
14. **Update's `mark` is its own hook** (re-written after the page flip): a small addition to the brief.
15. **No cursor change on bots** (a pointer cursor would suggest a link or an action). Tap uses
    `pointerdown` as briefed, so a scroll that starts on a bot also makes it jump; `pointerup`
    without movement is the alternative.
16. ~~**Chevron pulse is scale only.**~~ **Revised 2026-09-28:** the icon flashes `cream` with the
    scale pulse (lit = one step brighter: `line` → `accent` for lines, `accent` → `cream` for the
    accent icons). The alternative was a violet glow on the line under the chevron only; the icon
    is already violet, so that wouldn't read as lit.
17. **The job paints above the bots and below the loop label** (`z-1` in an `isolate` body, the label
    `lg:z-10` with a taller `bg-bg` backing), **superseding** the earlier "behind the bots" choice
    (`-z-10`, filed into the rulebook): painting behind let it peek from behind a bot's silhouette at
    some stops, and the user preferred it never disappear except fully, behind the label.
18. **The story continues past bot 4, not a separate spark.** With the job no longer filed away at bot
    4, something carries the loop back to bot 1: first the job itself (**superseded 2026-09-28**, see
    choice 26 — it now completes and slides off the ground line instead), now a small lesson card that
    splits off it and rides the dashed path back alone, and the return-lit overlay is its trail.
    **Supersedes** the "cream spark traces the return, no ghosts on it" choice.
19. **The return lights solid violet** (the dashes' gaps fill in), not cream: all lit lines are
    `accent`, and a 1000px cream line would outshine the job.
20. **Team strikes exactly twice on a relay catch** (`RELAY_STRIKES`), one part per strike, so the
    build is deterministic; timed acts keep 2–3. The alternative keeps 2–3 and gives the third strike
    only a squash.
21. **`RELAY_EVERY` 9 → 15 → 20 → 16 → 16.4 (final, from the lead's screen check).** Full acts alone
    take 7.8s of dwell; with three hops and the return ride the run grew to ≈17.3–18.3s once the job
    rode the path itself (rather than being filed away with a quick spark), so 15s could no longer hold
    it, and 20 gave it more room than it needed. Once the dwell dropped to 2s a side (`RELAY_DWELL`,
    choice 25) and the acts were retimed to fit inside it, the run shrank to ≈13.3–14.3s, so
    `RELAY_EVERY` came back down to 16. Splitting the return into its own lesson card (choice 26) added
    the split-off and its own leave/enter around the job's exit, growing the run to ≈13.7–14.7s, so
    `RELAY_EVERY` settled at 16.4 — about 1.7–2.7s clear before the next run starts. The phone cascade
    keeps 9s (`CASCADE_EVERY`) (**superseded 2026-09-28**, choice 27: the phone relay shares 16.4).
25. **`RELAY_DWELL` 3s → 2s, one value for every role** (was 3.0/3.0/3.0/3.0, briefly 2.0/1.6/1.8/2.4
    before that), and **`JOB_AT` moves every stop to the bot's right** (rules and update were on the
    left, under the clipboard and the rulebook; team and check were already on the right, under the
    hammer and the lens). One side for every bot reads more consistently, and update sits 4 units
    further right than the others so the built step clears the wrench. The acts' own timings
    (`RATCHET`, the rules/check/update tail tweens) and `JOB_BEATS` are retimed to land inside the
    shorter dwell; `RELAY_WATCH` becomes uniformly rightward (7/5/7/7, was −7/5/7/−7). The trade-off:
    the dwell no longer leaves enough over for the hold bob (`JOB_BOB`) or a watch blink
    (`RELAY_WATCH_BLINK`), so neither plays now — open question, see the page doc.
22. **Job beats run on the relay's clock, with catch priority** (`RELAY_CLEAR` holds timed acts and
    naps off near a catch) rather than driving the job from inside each act. It keeps one writer per
    job part and the story intact even when a visitor's tap on another bot reacts mid-run (hover/tap
    no longer interrupts an acting bot itself, 2026-09-28). The shared beat times move
    into `lib/processBotMotion.ts` (`JOB_BEATS`) so the acts and the job read the same numbers.
23. **Job is an inline SVG**, not HTML: its marks need `svgOrigin` pivots and 45° paths, like the bots.
24. **Hop time stays fixed at 0.7s,** so legs of different length (at 1440: 450, 340, 230px) move at
    different speeds; the ease hides most of it. Hop time by distance is the alternative.
26. **The job completes at bot 4 instead of riding the return (2026-09-28, final, the lead's screen
    check); a separate lesson card carries the loop back.** After bot 4's fold, the job slides right
    along the ground line to its end, pops once as done and fades there — it never reaches the return
    path, and the three trail ghosts stay with it (its hops and this exit slide), not with the return.
    A new 14px lesson card (a rulebook page: one violet line on cream) splits off the job's centre at
    that moment, fades out hidden leaving bot 4 (so it never crosses step 4's text, unlike a card that
    stayed visible the whole way), drops in at the return path's start and rides it alone — no ghosts —
    back to bot 1. **Supersedes** choice 12's and 18's "the job itself rides the return path" line and
    the `JOB_LEAVE`/`JOB_ENTER`/`JOB_OUT` constants (now `JOB_EXIT`/`JOB_DONE`/`JOB_FADE` for the job's
    exit, `LESSON_SPLIT`/`LESSON_LEAVE`/`LESSON_ENTER`/`LESSON_OUT` for the lesson's).
27. **Phone relay (2026-09-28, the user's choice of a vertical relay; §5.9).** The desktop story
    turned 90° clockwise, replacing the 9s cascade. (a) **The job sits on each bot's right at its
    feet, at 2/3 size (16px)**: the desktop seat at the bots' phone scale (88 vs 136), so each drop
    passes only the next bot's hand and tool, never its face. The alternative, the 24px job centred
    under each bot, drops across the next bot's face and body: the 88px column has no 24px lane clear
    of a bot. **Open for the user.** (b) **No track**: hops with the ghost trail only, so the static
    page is unchanged. The alternatives were a motion-only violet streak, or a static 2px `line` rail
    that would cross every row hairline and run behind every tool. **Open for the user.** (c) **The
    lesson rides up the column's left edge**, from the return row's icon (which flashes as it rises in)
    to bot 1's clipboard: the desktop return turned with the layout (below the line becomes left of the
    column). The alternative, back up the job's lane, crosses every tool again and meets the ghosts. It
    hides leaving bot 4, as on desktop, because the straight way across passes bot 4's face.
    **Superseded 2026-09-28 (user's decision):** the lesson no longer hides leaving bot 4 and rises
    in at a flashing return icon; instead it appears directly in bot 4's rulebook hand (screen
    left), he looks at it briefly (~0.6s), then it lifts off and rides straight up the column's
    left edge to bot 1's clipboard. The return icon no longer flashes. See the page doc. (d) **One
    cadence**: `RELAY_EVERY` 16.4 at every width (a phone run is ≈12.6–12.9s, built and screen-checked
    at 390); `CASCADE_EVERY` / `CASCADE_GAP` go.

### 5.9 Phone relay (below `lg`; new 2026-09-28, user's choice)

The one question stays the same: how do they work? This is the §5.7 relay turned 90° clockwise. The
ground line's left-to-right becomes the bot column's top-to-bottom, and the return (below the line on
desktop) becomes the column's left edge, running back up. It uses the same pieces, beats, 2.0s dwells
and 16.4s cadence. Motion only, full motion only, 0–1023px. **Static page unchanged**: every element
is `opacity-0` at rest, so without JS and under reduced motion nothing new shows.

**Lanes (inside the 88px bot column; the text starts at x 106, the loop label at x 32).**
- **Job lane, on the right.** Stops P1–P4 use §5.7's x formula (svg left + (`JOB_AT[role]` + 30) / 170
  × width: 78.7px, update 80.8), with y = the svg's bottom (its feet line; there is no ground line
  here). The job sits on each bot's right under its hand or tool, as on desktop. It spans x 70.7–88.8,
  ≥17px clear of the text, and ≥6px clear of every bot's body and face (strip C ends at 64.2).
- **Lesson lane, on the left.** x = svg left + (`COLUMN_LESSON_AT.x` + 30) / 170 × width = 7.8px
  (bot 1's clipboard centre). The 10px card spans 2.8–12.8, clear of bots 2 and 3's left arms (from
  13.5) and ≥19px clear of the loop label.

**Markup (web-coder; class strings and one hook, no layout change):**

| Element | Change |
|---|---|
| Relay layer (`ProcessRelay`) | `pointer-events-none absolute inset-0 z-1` (drops `hidden lg:block`) |
| Ghost ×3 | `absolute left-0 top-0 -ml-2 -mt-4 size-4 opacity-0 lg:-ml-3 lg:-mt-6 lg:size-6` |
| Job (`ProcessJob`) | `absolute left-0 top-0 -ml-2 -mt-4.75 h-4.75 w-4 overflow-visible opacity-0 lg:-ml-3 lg:-mt-7.25 lg:h-7.25 lg:w-6` (same viewBox, drawn at 0.655px per unit; the glow's stroke draws 1px) |
| Lesson (`ProcessLesson`) | `absolute left-0 top-0 -ml-1.25 -mt-1.25 size-2.5 opacity-0 lg:-ml-1.75 lg:-mt-1.75 lg:size-3.5` |
| Return row (`ProcessReturn` wrapper) | adds `data-anim="process-return-row"`, still read for the job's exit hairline (`JOB_EXIT_INSET` above its top edge). `CornerUpLeftIcon` stays its first child but plays no part in the relay: **built 2026-09-28,** R0 is bot 4's rulebook (`COLUMN_LESSON_FROM`, read live through his `arm-left` group), not the icon, and the icon never flashes |

The anchors are unchanged (job and ghosts at the bottom centre, lesson at the centre), and the margins
follow the size, so motion still owns `transform` alone. No CSS `scale`, which would scale GSAP's
translate. The ground lit, return lit and chevrons stay `lg` only.

**Layering.** The layer is `z-1` in the `isolate` body at every width: above the bots, as on desktop,
where the job already crosses in front of each catching bot's feet. Both lanes stay out of the text
column and away from the label, so nothing ever passes over or behind text, and nothing needs a mask.

**The run** (s; §5.7's clock: A1–A4 = 0.2 / 2.9 / 5.6 / 8.3, `JOB_BEATS`, acts and `RELAY_WATCH`
unchanged, because the job is on each bot's right as on desktop):

| t | Job / lesson | Bot | Lights |
|---|---|---|---|
| 0 → 10.3 | as §5.7: blank job pops in at P1; written and stamped, built, checked, folded at P1–P4 | full acts, watch looks | none |
| each hop (2.2, 4.9, 7.6; `RELAY_HOP` 0.7) | straight down the job lane P(i) → P(i+1), one row (≈140–200px). Passes in front of the next bot's hand and tool (hammer, lens, wrench) and lands under it | `head(i+1)` foot tap | ghosts trail; no lit line or chevrons |
| 10.3 → 10.65 | exit: drops down its lane to E = (P4.x, return row top − `JOB_EXIT_INSET`), ≈45–95px, `JOB_EXIT` (its 0.35s min) | | ghosts trail |
| 10.65 → 11.37 | `JOB_DONE` pop (settled 11.07), then `JOB_FADE` | | |
| 10.3 → 10.65 | **Built:** the lesson pops in and fades in (0.6 → 1) on bot 4's live rulebook, R0 = `COLUMN_LESSON_FROM` read through his `arm-left` group so it follows his breath, drift and sway (`lessonAppear`, `LESSON_SPLIT`'s pop, no peel) | | |
| 10.65 → 11.25 | bot 4 holds it, looking down-left (`COLUMN_LESSON_HOLD`: 0.3s look, held to 0.6s after the pop settled); busy the whole time, so a tap is ignored (`holdLesson`) | | |
| 11.25 | lesson lifts 4px, no fade (`LESSON_LEAVE`'s lift, via `lessonLift`); bot 4's eyes ease back to rest; bot 1's foot tap starts (`head(0)`) | `head(0)` at 11.25 | |
| 11.25 → ≈12.15–12.65 | lifts off (0.2s), then rides straight up the lesson lane at `RETURN_SPEED` (450px/s, `none`) to R1 = bot 1's clipboard centre (`COLUMN_LESSON_AT`), x easing into the lane over up to 0.3s if the live rulebook sits off it (`COLUMN_LESSON_GLIDE`). ≈421–550px, 0.9–1.2s. No ghosts | | |
| arrival | `LESSON_OUT` over the clipboard (0.25s); `receive(0)` | bot 1 squash | |

A phone run lasts ≈12.6–12.9s (360: 12.92s, 390: 12.80s, 768: 12.64s), inside `RELAY_EVERY` 16.4 with
≈3.5s clear. `RELAY_FIRST` and the `RELAY_CLEAR` catch priority are unchanged, since the arrivals are
the same. Waypoints are re-measured on the list's ResizeObserver and on ScrollTrigger refresh, because
rows reflow with the text; R0 (bot 4's rulebook) is also read live, once more, as the lesson appears.

**Tap and pointer (layer 8, unchanged).** On touch, a tap (`pointerup` within `TAP_SLOP` / `TAP_TIME`,
as built) makes an idle or napping bot jump. An active bot ignores it, with no queue: its catch and
watch, a timed act, or the `receive` squash. A reacting bot ignores it too. The layer is
`pointer-events-none`, so a tap still reaches a bot the job is crossing. Each bot is an 88 × 57 tap
area. Nothing is focusable, so there are no hover, focus-visible or active states. Fine pointers below
`lg` (narrow desktop windows) keep hover and eye follow.

**Reduced motion.** As §5.7 layer 12: the job, lesson and ghosts are never shown at any width, and the
icon never flashes. The bots fade in and keep their static pose.

**Wiring (built, bot 4's handover).** Two `gsap.matchMedia()` blocks run the relay: full + `lg` runs
`relayRun` (§5.7), and full + below `lg` runs the new `columnRun`. `wide` now picks the geometry, not
whether a relay runs. New `lib/processRelayColumn.ts` has one job: the column waypoints (P1–P4, E,
R0 = bot 4's live rulebook, R1 = bot 1's clipboard) and `columnRun`. It reuses `jobStart` / `jobBeat` /
`jobExit` and `ghostHop` from `lib/processRelayJob.ts` / `lib/processRelayTrail.ts`, and two new
`lib/processRelayLesson.ts` helpers built for the pop-in-place handover, shared with nothing on
desktop: `lessonAppear` (the pop-in-and-fade-in, factored out of `lessonSplit`, used here without the
peel) and `lessonLift` (the same 4px lift as `lessonLeave`, without the fade, since the lesson stays
visible on bot 4's hand). It does **not** reuse `lessonSplit`, `lessonLeave` or `flash` — there is no
split-and-peel, no fade-out leaving bot 4, and no icon flash below `lg`. Other changes:
- `lessonEnter` (still `lib/processRelayLesson.ts`, desktop only) never gained a side option: the
  built handover rides straight up from bot 4's hand instead of dropping onto the return path, so
  `lessonEnter` is untouched and desktop-only.
- `lib/processBotMotion.ts` adds `COLUMN_LESSON_AT` = { x −15, y 50 } (bot 1's clipboard centre, the
  lane's x and the ride's end), `COLUMN_LESSON_FROM` = { x −15, y 52 } (bot 4's rulebook centre,
  mapped live through his `arm-left` group), `COLUMN_LESSON_HOLD` (0.6s hold, look/back timings) and
  `COLUMN_LESSON_GLIDE` (0.3s ease into the lane), and drops `CASCADE_EVERY` / `CASCADE_GAP`.
- `cascadeRun` leaves `lib/processRelay.ts`.
- New `holdLesson` cue in `lib/processBotActs.ts`: while the lesson sits on bot 4's rulebook, an idle
  or watching bot 4 looks down-left and holds (busy, so taps are ignored); a busy one glances instead;
  a napping one wakes.
- `hooks/useProcessBots.ts` wires both runs and the `holdLesson` cue. The revert strip no longer needs
  the return icon (it never flashes), so it covers only the job, ghosts and lesson.

#### Sizes: phone relay

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Relay layer | shown over the 320 body | shown over the 672 body | unchanged (desktop relay) | unchanged |
| Job | 16 × 19 box (15.7 × 19 drawn), bottom on the feet line; step rises 3px | same | unchanged, 24 × 29 | unchanged |
| Job stops P1–P4 | right of every bot, x 78.7 (update 80.8) in the 88 column, 57px below each bot's top | same | unchanged (ground line, J1–J4) | unchanged |
| Hop | straight down one row, ≈165–200px, 0.7s | ≈140–165px, 0.7s | unchanged | unchanged |
| Job exit | drops ≈70–95px to 14px above the return row's hairline, pop 1.12, fade | ≈45–70px | unchanged (slides right to the line's end) | unchanged |
| Ghosts (`size-4`) | 16px, scale 0.85 / 0.7 / 0.55, opacity 0.45 / 0.28 / 0.14 | same | unchanged, 24px | unchanged |
| Lesson (`size-2.5`) | 10 × 10, lane x 7.8; pops in on bot 4's rulebook (R0), holds 0.6s, then rides up to bot 1's clipboard (R1), ≈421–550px, 0.9–1.2s | same | unchanged, 14px on the return path | unchanged |
| Return icon | unused by the relay: the lesson starts on bot 4's hand, not the icon, and it never flashes | same | hidden (unchanged) | hidden |
| Ground lit, chevrons, return lit | none | none | unchanged | unchanged |
| Bots | unchanged, 88 × 57 | unchanged | unchanged | unchanged |

**Tokens (all existing):** `fill-cream`, `fill-ink`, `fill-accent`, `fill-cream-muted`,
`stroke-accent` (job, ghosts, lesson); `text-accent` on the icon, flashing to `--color-cream` (read
at setup, never a literal). No new token, no text, no slots.
