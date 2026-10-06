# §5 Process: UI spec

Shared rules and parts (§0): [`../ui-spec.md`](../ui-spec.md). Page doc: [`../sections/05-process.md`](../sections/05-process.md).
The built bot motion (§5.7's constants and layers): [`05-process-motion.md`](05-process-motion.md).
The four-step relay (legacy; superseded by the 2026-10-04 rebuild, 5.7): [`05-process-relay-legacy.md`](05-process-relay-legacy.md).
The phone track (legacy; superseded 2026-10-05, later, by the ledges, 5.9): [`05-process-track-legacy.md`](05-process-track-legacy.md).

**Last Updated:** 2026-10-05. Every choice in 5.8 is decided except the ones marked open.
**2026-10-04 (the user's decision):** the Discord flow has no validation and no loops: no "Second
check" step, no fix loop, no bottom return. Its five steps are Mentioned, Your tone, Remembers,
Connected, Always on (5.3b, 5.10). The other five flows keep their check and both loops. Not built yet.
**2026-10-03, later (the user's decision B):** a second return, the **fix loop**, on every flow
that has loops (all but Discord since 2026-10-04): from step 4 "Second check" back to step 3 (the
work step), drawn as a dashed arch above the bots from `lg` and as a marker row in step 3 below
`lg` (5.3a). The bottom return stays.
**2026-10-04, the motion pass (built and checked; this spec brought in line 2026-10-05):** the
relay is on again (`RELAY_ON = true`), rebuilt for five or six stops at every width, with the
hand-off from step 1, the fix hop and a one-way pass on Discord; `intake`, `flag`, `remind`,
`ship` and `host` have their own acts; the swap fades. State and numbers: 5.7. No layout, copy or
token change.
**2026-10-05 (the user's decision; built and checked the same day, static and motion):** below
`lg` the bot column gets a **track**: a thin `line` rail the job rides, with a lit segment that
follows it (5.9, choice 44). From `lg` nothing changes: the ground line stays as it is. No copy
or token change. Three calls from the build are open for the user (5.8, 50–52).
**Superseded the same day (below).**
**2026-10-05, later (the user's decision, final; built and checked the same day, static, then
motion):** below `lg` the
track is **replaced by ledges**: under every bot a short 2px `line` ledge it stands on, a piece of
the ground line cut to the bot's width, with a lit overlay (hidden) that the job lights as it
lands (5.9, choice 53). The fix loop below `lg` drops the marker row's icon and draws a dotted
`accent` line down the bot column's left side from bot 4 up to bot 3, the label beside it (5.3a,
choice 54). From `lg` nothing changes. No copy or token change. Choices 50–52 are closed (moot).
**2026-10-05, the ledge motion (built; checked by the lead at 360 and 768):** below `lg` the job
hops ledge to ledge in small thrown arcs, each ledge lights while its bot works the job, the fix
rise lights the dotted line bottom to top, and the job pops and fades on the last ledge (5.9
Motion, as built; 5.3a). The track's motion code (`ontoTrack`, `COLUMN_JOB_GLIDE`, `litDrop`) is
deleted. From `lg` nothing changes. No markup, copy or token change. Four calls are open for the
user (5.8, 62–65).
**2026-10-05, the fix line route (the user's request: "the object should go back from the dotted
route instead of a step back"; built, checked by the lead at 360 and 768):** below `lg` the fix
run's job no longer rises straight from ledge 4 to ledge 3: it goes back along the dotted fix
line, which lights behind it (5.3a, 5.9 The fix rise, choice 66). A fix run below `lg` is +5.5s
(was +5.2s). From `lg` nothing changes. No markup, copy or token change. Two calls are open for
the user (5.8, 67–68).

## 5. Process (the one question: how do they work?)

Source: Claude Design canvas "Process mascots" (`Main.dc.html` desktop 1440, `Phone.dc.html` 390,
`Bot.dc.html` vector bot, `Sprites.dc.html` sheet), 2026-09-26; vector bots with separate feet in
smooth GSAP motion since 2026-09-27; the crew relay (the job, then the lesson card) since 2026-09-28.

**Revised 2026-10-03 (the user's decisions; static round).** The four fixed steps are replaced by
a flow per About card: the agent doing that visitor's job, in five or six steps, one bot per step.
The row adapts to the count. One step is a bot raising a flag (no person is drawn). The job the
bots pass is the picked card's emblem. Every flow but Discord (5.3b) keeps the return loop and,
since decision B, the fix loop. The section carries the "Shown for" tag (`../ui-spec.md` §0.5,
§0.6). No new motion is built this round; the bots' built motion keeps running and the relay is
off (5.7).
- **Superseded here:** the four-step layout (old 5.1–5.5; in git at `37dee00`) and the four-step
  relay (old 5.7 layer 10 with its markup, sizes and run tables, old 5.9 the phone relay, old 5.8
  choices 6, 12 and 16–27), which is kept in `05-process-relay-legacy.md` for the motion rebuild.
- **Still valid:** the bot (5.6), and the bots' own motion (life, blinks, looks, acts, naps,
  pointer follow, the hover or tap jump, the drop-in), now in `05-process-motion.md`.
- **Two loops, one question.** Both answer "how do they work?": the fix loop is inside a job (a
  check sends work back until it passes), the return is between jobs (the lesson goes into the
  rules). They sit on opposite sides of the row, top and bottom, so neither reads as the other.

### 5.1 Layout (stacked at every width; no pinned title)

- Section frame (§0.1), `id="process"`. Inner: `{container} flex flex-col gap-14 border-t border-line py-section md:gap-20 lg:gap-24`.
- Header: `<div data-anim="reveal" class="flex max-w-250 flex-col gap-5 lg:gap-7">`: `SectionLabel`
  (`process.number`, `process.label`, `as="p"`), `SectionHeading size="heading"`. Shared voice;
  the same for every flow.
- **`ProcessFlow`** (new, client): `<div data-anim="process-flow" data-set={set} data-count={n} data-loops={"on" | "off"} class="flex flex-col gap-8 lg:gap-24">`.
  **Changed (decision B):** `lg:gap-12` → `lg:gap-24` (48 → 96px), so the fix label above the
  arch (76px above the list) keeps 20px clear of the caption. **2026-10-04:** a flow with no
  loops keeps `lg:gap-12` and carries `data-loops="off"` (5.3b). It reads `useAboutPick()` →
  `pickSet` → `useShownSet` (§0.5) and draws `process.flows[set]`.
  1. **Meta:** `<div class="flex flex-col gap-3">` → `ShownForTag` (radio name
     `process-shown-for`), then the caption `<p data-anim="process-caption" class="{metaLabel}">`
     = `flows[set].caption` (decided, choice 32).
  2. **Body** (keyed by set, so a change remounts it): `<div class="relative isolate flex max-w-2xl flex-col lg:max-w-none lg:gap-10">`
     → `ProcessList`, then `ProcessReturn` (flows with loops only, 5.3b), then `ProcessRelay`.
     `isolate` keeps the relay layer's `z-1` inside the body, below the loop labels' `lg:z-10`.
     The fix loop lives inside step 3's `<li>` (5.3a), so the body's children are unchanged.
- **Below `lg`: rows**, five or six. **From `lg`: all steps across on a ground line.** The classes
  that depend on the count are literal strings in `lib/processLayout.ts`:

| Count | List and return grid | Chevron | Return path box | Fix box (new, `fixBox`) |
|---|---|---|---|---|
| 5 | `lg:grid-cols-5 lg:gap-x-8` | `lg:-right-6` | `lg:col-start-2 lg:col-span-3 lg:ml-15.5 lg:-mr-24` | `lg:-right-24` |
| 6 | `lg:grid-cols-6 lg:gap-x-4 xl:gap-x-8` | `lg:-right-4 xl:-right-6` | `lg:col-start-2 lg:col-span-4 lg:ml-15.5 lg:-mr-20 xl:-mr-24` | `lg:-right-20 xl:-right-24` |

- **The tight spot, six across at 1024 (decided, choice 28).** Content is 942px. With the usual
  32px gap a column is 130px, narrower than the 136px bot. With a 16px gap from `lg` to `xl` it is
  144px: the bot fits with 8px to spare, and neighbouring bots stay 24px apart. From `xl` (1280)
  the gap is 32px again and a column is 170px. Five across at 1024 is 163px with the 32px gap.
- **Without JavaScript:** the server markup is the `default` flow; the tag is hidden. Both loops
  are static markup, so they show without JavaScript.

### 5.2 List and step (`ProcessList`, `ProcessStep`)

- `ProcessList` (takes the flow's steps, bots, emblem, grid classes and the fix label as props;
  **2026-10-04:** `fixLabel` is optional):
  `<div data-anim="process-list" class="relative">` → ground line `<div aria-hidden="true" data-anim="process-ground" class="absolute inset-x-0 top-27 hidden h-0.5 bg-line lg:block">`,
  then the ground-lit overlay (unchanged, hidden), then `<ol class="relative grid {grid}">` of
  `ProcessStep`s. ~~Then `ProcessTrack`~~ (**removed 2026-10-05, later:** the track is superseded
  by the ledges, which live in each step, 5.9). The `<ol>` keeps `relative` (no `z-index`, so no
  stacking context; it was added for the track and is harmless now).
  It passes `ProcessFixReturn` (5.3a) to the step at `FIX_STEP` (index 2) only, and only when
  it has a `fixLabel` (5.3b).
- `<li data-step={i}>`: `grid grid-cols-[5.5rem_minmax(0,1fr)] items-start gap-x-4.5 border-t border-line py-6 relative lg:flex lg:min-w-0 lg:flex-col lg:border-t-0 lg:py-0`
  (phone column 88px; the text column starts at x 106). **2026-10-05, later:** `lg:relative`
  becomes `relative`, so the ledge and the phone fix line are placed against the row below `lg`
  (choice 60). No `z-index`, so no stacking context; from `lg` the `<li>` was already
  `relative`, so nothing changes there.
  1. `ProcessBot` (5.6), role and pose from `lib/processFlows.ts` (5.10). Step 1's bot (`intake`)
     gets `ProcessEmblem` as its child: the job, in its hand. **New 2026-10-05, later:** then
     `ProcessLedge` (5.9), the ledge the bot stands on, below `lg` only.
  2. Every step but the last, the chevron to the next step, centred in the gap on the ground line:
     `<span aria-hidden="true" data-anim="process-chevron" class="absolute top-27 hidden h-0.5 w-4 items-center justify-center bg-bg lg:flex {chevron}">`
     holding `ChevronRightIcon` `size-6 shrink-0 text-accent` (glyph 6×12, 2px stroke). The `bg-bg` box masks the line behind it.
  3. Text column `<div data-anim="reveal" class="flex flex-col gap-2 lg:gap-2.5 lg:pt-7.5">`:
     label `<p class="{metaLabel} uppercase tracking-[0.06em]">` = `process.stepLabel` + two-digit number (`01`–`06`);
     title `<h3 class="font-display font-semibold text-step leading-[1.05] tracking-[-0.02em] text-balance wrap-break-word text-text {condensed}">`;
     line `<p class="text-body-lg leading-normal text-muted lg:max-w-65">`.
  4. **New, step 3 only:** `ProcessStep`'s new optional prop `after` (a `ReactNode`, rendered as
     the `<li>`'s last child) carries `ProcessFixReturn`. `children` stays the bot's hand.
- **Feet on the ground line (from `lg`):** the bot's feet (the body's lowest points, viewBox y 92) are
  the viewBox's **bottom edge** (−18 + 110 = 92), so the box bottom is the feet. `lg:mt-5` (20px) puts
  the 88px box's bottom at 108, the ground line's top (`top-27`); the 2px line sits right under the
  feet. The text column's `lg:pt-7.5` is unchanged. **Below `lg`** the same holds on each bot's
  ledge: the 57px box's bottom, 81 under the row's padding top, is the ledge's top (5.9).
- **States:** nothing in the list is interactive or focusable; no hover, focus-visible or active
  states. The only control in §5 is the tag (§0.6).

### 5.3 The return (`ProcessReturn`)

- Wrapper `<div data-anim="process-return-row" class="flex items-center gap-3 border-t border-line pt-6 lg:grid {grid} lg:border-t-0 lg:pt-0">`
  (the list's own column grid, so the path lines up with the bots).
- Below `lg`: `CornerUpLeftIcon` `size-5 shrink-0 text-accent lg:hidden` (`aria-hidden` via `Icon`), then the label.
- From `lg`: the path box `<div data-anim="process-return" class="contents lg:relative {box} lg:block lg:h-14 lg:rounded-b-2xl lg:border-2 lg:border-t-0 lg:border-dashed lg:border-accent">`.
  **It now runs from the last bot back to step 2, "your rules"** (decided, choice 29): the lesson
  goes into the rules, which is what the facts say. Its left and right borders are centred at x 63
  in step 2's and the last step's columns (62px in, and one gap + 64px past the column before last).
  Inside: `ChevronUpIcon` `absolute -left-3.25 -top-2.5 hidden size-6 text-accent lg:block`
  (the arrowhead on step 2's end, and the box's first child), then the label, then the return-lit
  overlay (unchanged, hidden, last child). `contents` below `lg` lets the label sit in the phone row.
- Label `<p class="{monoLabel} lg:absolute lg:inset-x-0 lg:bottom-0 lg:z-10 lg:translate-y-[calc(50%+1px)] lg:text-center">`
  with `<span class="lg:bg-bg lg:px-5 lg:py-3">` = `flows[set].loopLabel`. Real text, never `aria-hidden`; one element at every width.
- Dash rhythm is the browser's CSS `dashed` (about 6/6 at 2px).
- **Unchanged by decision B.** Its slot keeps its meaning (5.5). **2026-10-04:** not rendered at
  all for a flow with no loops (5.3b); the component itself is unchanged.

### 5.3a The fix loop (`ProcessFixReturn`, new 2026-10-03, decision B)

The agent loop inside a job: when the second check finds a problem or a broken rule, the work goes
back to the agent that did it and is checked again until it passes (facts → How the user works).
One file, `components/home/process/ProcessFixReturn.tsx`, props `fixBox` and `label`; rendered
as the last child of step 3's `<li>` (`FIX_STEP = 2` in `lib/processFlows.ts`: the `team` step in
every flow with loops; the `check` step is always the next). Not rendered for Discord (5.3b).

```
div data-anim="process-fix-row" class="col-span-2 mt-5 pl-4 lg:contents"
├ div aria-hidden="true" data-anim="process-fix-line" class="absolute -bottom-15.75 left-0 top-15 w-2.5 rounded-l-2xl border-2 border-r-0 border-dotted border-accent lg:hidden"   (phone: bot 4 back up to bot 3)
│ ├ ChevronRightIcon className="absolute -left-1.25 -top-3.25 size-6 text-accent"   (arrowhead onto bot 3's left hand)
│ └ span data-anim="process-fix-line-lit" class="pointer-events-none absolute -inset-y-0.5 -left-0.5 right-0 rounded-l-2xl border-2 border-r-0 border-accent opacity-0"
└ div data-anim="process-fix" class="contents lg:absolute lg:-top-12 lg:left-15.5 {fixBox} lg:block lg:h-10 lg:rounded-t-2xl lg:border-2 lg:border-b-0 lg:border-dashed lg:border-accent"
  ├ ChevronUpIcon className="absolute -bottom-2.5 -left-3.25 hidden size-6 rotate-180 text-accent lg:block"   (arrowhead on step 3's end)
  ├ p class="{monoLabel} lg:absolute lg:bottom-full lg:left-1/2 lg:z-10 lg:mb-2 lg:-translate-x-1/2 lg:whitespace-nowrap lg:text-center"
  │   → span class="lg:bg-bg lg:px-3"                                        ← flows[set].fixLabel
  └ span aria-hidden="true" data-anim="process-fix-lit" class="pointer-events-none absolute -inset-x-0.5 -top-0.5 bottom-0.5 hidden rounded-t-2xl border-2 border-b-0 border-accent opacity-0 lg:block"
```

**2026-10-05, later:** the row was `col-span-2 mt-5 flex items-center gap-3 bg-bg lg:contents`
with `CornerUpLeftIcon` first. The icon goes (the user's decision); `flex items-center gap-3` go
with it (one flow child is left); `bg-bg` goes with the track it masked; `pl-4` and
`process-fix-line` are new. `process-fix` and everything inside it are unchanged.

- **From `lg`: an arch over the gap between bots 3 and 4,** the bottom return turned upside down.
  Its legs are centred at x 63 of step 3's and step 4's columns (`lg:left-15.5` = 62px in; the
  right edge one gap + 64px past step 3's column, from `fixBox`), 40px tall, radius 16, its open
  bottom 8px above the list's top (`-top-12` with `h-10`). The arrowhead points down onto step 3's
  bot. The label sits centred **above** the arch (8px over it, one line), not on its top edge: at
  six across on 1024 the arch is 162px wide, narrower than a 26-character label, so a label on
  the edge would cover the arch's corners (open choice 37).
- **Clearance.** Above: the label's top is 76px above the list; the flow's `lg:gap-24` leaves
  20px to the caption, and the tag pushes everything down in the flow when open, so nothing
  overlaps at any width. The label is centred over the middle of the row, at least 260px from
  either edge of the list at 1024 (five steps; about 340px with six), so `whitespace-nowrap`
  never reaches the container's side.
  Below: the arrowhead's tip is about 4px above the list; step 3's bot (`team`) has its hat ridge
  26px below the list top at rest and 6px below at the top of a hover jump (14px up), so even a
  jump stays clear. Step 4's leg ends over the `check` bot's head (body top 22px down; its lens is
  off to the right). The arch never touches a step's text, which is under the bots.
- **Below `lg` (revised 2026-10-05, later, the user's decision; choice 54): a dotted line from
  bot 4 back up to bot 3.** The arch on its side: `process-fix-line`, a 2px dotted `accent`
  bracket open to the right, down the bot column's left edge (x 0–10 of the list). Its top end
  is at bot 3's left hand (`top-15`: the end's centre 61 under step 3's padding top = the row's
  24 + the arm's centre, viewBox y 53, 36.75 into the 57px bot); its bottom end at bot 4's
  (`-bottom-15.75`: centre 62 past step 3's end = bot 4's 1px hairline + 24 + 36.75). Radius
  `rounded-l-2xl` clamps to the 10px width, so each end is a quarter turn into a hand.
  `ChevronRightIcon` (glyph 6 × 12) on the top end points at bot 3's hand, its tip at x 12, 1.5px
  clear of the hand (x 13.5). **It ends at bot 4's hand and never runs below bot 4** (the user's
  red X): its lowest point is 19px above bot 4's feet and ledge.
- **The label beside it, between steps 3 and 4.** The row keeps its place (`col-span-2 mt-5`,
  20 under step 3's text, the `<li>`'s `pb-6` below) and its hook. `pl-4` starts the label at
  x 16, 14px right of the line. Its height is unchanged (the label's line ≈ 20, as the 20px icon
  was), so step 3 keeps its height. `pl-4` draws nothing from `lg`, where the row is `contents`.
- **Room at 360:** the line, its turns and the arrowhead take x 0–12 of the bot column; the
  `team` and `check` hands start at x 13.5 and the bodies at 18.6, so at rest nothing touches.
  A lean (up to 3px past the column's left edge, 5.6) passes bot 3's hand under the arrowhead for
  a moment; accepted, transient. The label (≤ 26 characters, 13px mono ≈ 225px) ends near x 241
  of the 320px list (328 with a 16px gutter): **one line at 360**; it wraps if a longer label
  comes (nothing is `nowrap` below `lg`). Only the arrowhead's empty 24px icon box reaches 3px
  past the list's left edge, into the gutter: no sideways scroll. **2026-10-05 (the fix line
  route):** on a fix run the job rides the line, its left edge 13px from the viewport at 360
  (7–8px into the gutter), for a moment: still no sideways scroll (5.9 The fix rise).
- **Where it meets the rest.** It crosses step 4's hairline at x 0–2; the hairline (step 4's
  `<li>`, later in paint order) draws over it, uncut: one dot's worth of `line` (choice 59). It
  never meets a ledge (ledges start at x 18) or step text (x 106). It lives in step 3's `<li>`
  (`relative`, 5.2) and reaches 63px past its end into step 4's row; it is absolute, so neither
  row's height changes.
- **One label element at every width,** real text, never `aria-hidden`; a screen reader meets it
  inside step 3, after its line and before step 4. The arch, the dotted line, both arrowheads and
  both lit overlays are decoration (`aria-hidden`).
- **With the relay (on, `RELAY_ON = true`, since 2026-10-04) and the bots.** The label carries
  `lg:z-10` and its span `lg:bg-bg`, as the bottom label does (2026-09-28 decision), and the job
  hopping back hangs inside the arch, its top 4px under the arch's top edge at the peak, so it
  never reaches the label above. Never animate `transform` or `opacity` on step 3's `<li>` or on
  `process-fix`: either would start a stacking context and trap the label's `z-10`. The built
  relay writes neither (it reads `process-fix` for its place only). The `reveal`
  sits on the text column, not the `<li>`, so it is safe. `process-fix-lit` is the lit overlay:
  shown by `clip-path`, as `process-return-lit` is, and faded out by `opacity`. The relay layer
  is measured from `process-list` and `process-return`; the fix hop is measured from `process-fix`.
  **Below `lg` the same rule:** motion writes `process-fix-line-lit` only (`clip-path`,
  `opacity`), never `process-fix-line` or `process-fix-row`. The built relay reads
  `process-fix-row` for its presence (a flow with a fix loop), so the hook stays.
- **Motion (built 2026-10-04, `lib/processRelayFix.ts`, `lib/processRelayPlan.ts`):** on every
  second run (`FIX_EVERY = 2`: runs 2, 4, 6…) of a flow with loops, the check finds something.
  Bot 4's scan stops short and it plays its "found it" eye pop (1.3s into a 1.7s stop); the job
  shakes its "no" (the default sheet drops what step 3 built); then the job arcs back over the
  arch to step 3 in 0.8s, peaking 4px under the arch's top edge, while `process-fix-lit` lights
  right to left behind it by `clip-path`. Step 3 redoes its act (2s), the job hops forward again
  (0.7s) as the light fades (0.6s), and bot 4 passes it (lens flicker). A fix run is 5.2s longer
  from `lg` (5.5s below it, where the way back is longer).
  The fix arrowhead does not pulse. ~~Below `lg` the job rises straight from bot 4 to bot 3 up
  the bot column and drops back.~~ ~~**Below `lg` (built 2026-10-05, the ledge pass,
  `lib/processRelayLedge.ts`):** the job rises from ledge 4 to ledge 3 on its own lane (x ≈
  67–91) in the same 0.8s (`FIX_HOP`: ≈ 0.66s climbing, ≈ 0.14s settling), while
  `process-fix-line-lit` lights the dotted line bottom to top over the climb.~~ **Below `lg`
  (built 2026-10-05, the fix line route, `lib/processRelayFixLine.ts`; choice 66):** the job
  goes back along the dotted line. It leaves ledge 4 heading left, rises at 45° to the line's
  bottom end at bot 4's hand, rounds the bottom turn, climbs the line, rounds the top turn
  through the arrowhead's tip (x 12) into bot 3's hand, drops at 45° onto ledge 3 and slides to
  its stop, in `FIX_LINE_HOP` (1.1s, `power1.inOut`). Behind it `process-fix-line-lit` lights
  from the line's bottom end up to the job by `clip-path`, fully lit once the job is past the
  arrowhead. The line stays lit while step 3 redoes its act and fades over `FIX_LIT_FADE`
  (0.6s) as the job hops forward; ledge 3 lights on the landing as any ledge does (5.9 The fix
  rise). Reduced: nothing moves, nothing lights. Trigger: the relay's clock (5.7).
- **Rule violations:** the label carries them (decision B; e.g. "Rule broken? Back to fix."). The
  check step needs no new drawing: its bot already stands in `act` with the lens, and the arch's
  leg lands on it. Recommended copy change (copywriter's call): step 4's `line` names the rules,
  e.g. "checks the work against your rules before it goes out", within its 10 words.

### 5.3b A flow with no loops (Discord; the user's decision, 2026-10-04)

A Discord bot isn't a job run through checks: it stays in the server and answers when a member
mentions it. So its flow has no "Second check" step and neither loop. The question is unchanged:
how does it work?

- **Data-driven; no component names `discord`.**
  - Content: `process.flows.discord` has **no `loopLabel` and no `fixLabel`** (the keys are
    removed, never left empty). The other five flows keep both.
  - `lib/processFlows.ts`: **new** `hasLoops: { readonly [S in AboutSet]: boolean }` (`discord:
    false`, the rest `true`), tied to the content's type as `flowRoles` is: `true` needs both
    labels in `process.flows[S]`, `false` needs neither, so a label deleted by mistake still fails
    `tsc`. **New** `flowLoops(set)`: `{ loopLabel, fixLabel }`, or `null` where `hasLoops[set]` is
    `false`. `flowRoles.discord` changes (5.10). `FIX_STEP` and `rolePose` are unchanged.
  - `ProcessFlow`: `loops = flowLoops(set)`. With loops: `lg:gap-24`, `data-loops="on"`,
    `ProcessReturn` rendered, `fixLabel={loops.fixLabel}`. Without: `lg:gap-12`,
    `data-loops="off"`, no `ProcessReturn`, no `fixLabel`. `ProcessList`'s `fixLabel` is optional
    and step `FIX_STEP` gets its `after` only when it is there.
  - Unchanged: `ProcessStep`, `ProcessReturn`, `ProcessFixReturn`, `ProcessRelay`, `ProcessBot`,
    `ProcessEmblem` and `lib/processLayout.ts` (`flowLayouts[5]`; its `returnBox` and `fixBox`
    simply go unused).
- **What drops out, at every width:** the fix loop whole (`process-fix-row`, `process-fix`, its
  arrowhead, label and `process-fix-lit`; below `lg` also `process-fix-line` and
  `process-fix-line-lit`) and the return whole (`process-return-row`,
  `process-return`, its arrowhead, label and `process-return-lit`). From `lg` the 96px caption gap
  the arch needed goes back to 48px. Below `lg` step 3's marker row and the return row go.
- **What stays:** the tag, the caption, five steps, the `bubble` emblem in step 1's hand, and from
  `lg` the ground line with its four chevrons. All five bots stand in `idle` (5.10).
  ~~**2026-10-05:** below `lg` the track (5.9) is drawn here as in every flow.~~
  **2026-10-05, later:** below `lg` each of the five bots stands on its ledge (5.9), as in every
  flow; there is no fix line.
- **From `lg`:** five across (`lg:grid-cols-5 lg:gap-x-8`), bot tops 68px under the caption
  (48 + `lg:mt-5`). The list is the body's only in-flow child (`ProcessRelay` is absolute), so the
  body's `lg:gap-10` adds nothing and the flow ends at the tallest step's text.
- **Below `lg`:** five rows, each under its hairline; the list ends on step 5's `py-6`, with no
  closing hairline (open choice 43).
- **States and reading order:** nothing interactive. The `<ol>` reads five steps and no loop text.
- **Swap:** this flow is shorter than a looped one; the tag keeps its place (`lib/holdInView.ts`, §0.5).

| Element (Discord) | Phone 360 | Tablet 768 | Small desktop 1024 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|---|
| Layout | tag, caption, 5 rows (content 320) | same, rows capped at 672 | 5 columns of 163 (gap 32) | 5 × 240 | 5 × 282 |
| Caption → steps gap | 32 | 32 | 48 (looped flows 96) | 48 | 48 |
| Row / column height | ≈ 160 a row, 5 rows ≈ 800 (no marker in step 3) | ≈ 140 a row, ≈ 700 | ≈ 340 | ≈ 300 | ≈ 290 |
| Fix loop: arch, arrowhead, label, marker row, dotted line | none | none | none | none | none |
| Return: path, arrowhead, label, phone row and its hairline | none | none | none | none | none |
| Ledges (5.9; was the phone track) | 5, each 2 × 70 under its bot | same | none | none | none |
| Under the last step | 24 (`py-6`), then the section's padding | same | 0: the list's bottom is the flow's bottom | same | same |
| Flow height against a five-step looped flow | ≈ 90 shorter | ≈ 90 shorter | 144 shorter (48 gap, 40 body gap, 56 path) | same | same |
| Widest bot part | `update`'s wrench jaw, 1.5px past its 88 box, into the 18px gap | same | 2.3px past its 136 box, into the 32px gap; step 5 (`host`) has nothing past its arm | same | same |

- **Motion, the bots:** no wiring of its own. `update` and `host` already pass `isRole` and have
  their pivots, per-role values and acts, so the built layers run on all five bots (5.7 table).
- **Motion, the relay (built 2026-10-04):** a one-way pass, 11.8s. The job (the `bubble`) leaves
  step 1's hand and hops step 1 → 5 along the ground line (ledge to ledge down the bot column
  below `lg`, 5.9), pops and fades at the line's end (on step 5's ledge below `lg`, its light
  with it). No lesson, no return ride, no arrowhead pulse, no fix hop: under
  `[data-loops="off"]` the six fix and return hooks don't exist, and the motion code takes their
  absence as "skip", never as an error (`relayParts` and `columnParts` return the run's parts
  with the return and the fix left out, so the run still starts). `process-lesson` stays in the
  hidden relay layer, unused. Trigger: the relay's clock.

### 5.4 Sizes

| Element | Phone 360 | Tablet 768 | Small desktop 1024 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|---|
| Layout | header, tag, then 5 or 6 rows (content 320) | same, rows capped at 672 | 5 columns of 163 (gap 32) · 6 columns of 144 (gap 16) | 5 × 240 · 6 × 195 (gap 32) | 5 × 282 · 6 × 229 (container 1536) |
| Heading (`text-heading`) | 44px | 64px | 76px | 96px | 104px |
| "Shown for" tag | 44 tall (§0.6) | same | same | same | same |
| Caption (`metaLabel`) | 12px, 12 under the tag | same | same | same | same |
| Caption → steps gap | 32 | 32 | 96 (was 48) | 96 | 96 |
| Bot (box 170:110) | 88×57 (`w-22 h-14.25`) | 88×57 | 136×88 (`w-34 h-22`), top 20, feet at 108 | 136×88 | 136×88 |
| Emblem in step 1's hand (24 units) | 12px | 12px | 19px | 19px | 19px |
| Flag (pennant 24 × 16 units) | 12×8, pole 27 tall | same | 19×13, pole 42 tall | same | same |
| Step label (`metaLabel`) | 12px | 12px | 12px | 12px | 12px |
| Step title (`text-step`) | 32px, text col 214 | 32px | 32px, up to 2 lines | 32px | 32px |
| Step line (`text-body-lg`) | 16px / 1.5, no cap | same | 16px, about 4 lines at 144 | max 260 | same |
| Row / column height | ≈ 160 a row (step 3 ≈ 205 with its marker); 5 rows ≈ 845, 6 ≈ 1005 | ≈ 140 a row (step 3 ≈ 185) | ≈ 340 | ≈ 300 | ≈ 290 |
| Ground line | none (hairline row dividers) | none | 2px `line`, full width, y 108 | same | same |
| Ledge (`process-ledge`, new 2026-10-05, later, 5.9; replaces the phone track) | 2 × 70 `line` under each bot, x 18–88 of the row, its top on the feet (81 under the row's padding top) | same | none (`lg:hidden`) | none | none |
| Ledge lit (`process-ledge-lit`) | the ledge's box, `accent` from nothing at the left to full at the right; hidden at rest | same | none | none | none |
| Chevrons | none | none | one in each gap (4 or 5), on the line | same | same |
| Return path | 20px icon + label row, hairline above | same | dashed 2px `accent`, 56 tall, radius 16; 5: x 258 → 842 · 6: x 223 → 861 | 5: 335 → 1151 · 6: 290 → 1196 | 5: 377 → 1317 · 6: 324 → 1370 |
| Loop label (`monoLabel`) | 13px, left | same | 13px, centred on the path | same | same |
| Fix loop | dotted 2px `accent` line, x 0–10, from bot 3's hand (61 into step 3) to bot 4's (62 past step 3's end): ≈ 207 tall; ends turned, radius 10 | same; ≈ 187 tall | dashed 2px `accent` arch, 40 tall, radius 16, open bottom 8 above the list; 5: x 452 → 649 · 6: x 382 → 544 | 5: 606 → 880 · 6: 515 → 744 | 5: 689 → 1005 · 6: 585 → 848 |
| Fix label (`monoLabel`) | 13px, from x 16, 20 under step 3's text; one line at 360 (≈ 225 of the 304 left), wraps if longer | same | 13px, one line, centred 8 over the arch, ≤ 26 characters ≈ 225 wide | same | same |
| Fix arrowhead | `ChevronRightIcon` 24 box, glyph 6 × 12, tip at x 12, 1.5 clear of bot 3's hand | same | 24px icon (glyph 12 × 6), tip ≈ 4 above the list, over step 3's bot centre | same | same |

This table is the five flows with loops; Discord's differences are the table in 5.3b.

136px holds at 4K on purpose: the container caps at 1536 and the step type stops at 32px, so a
bigger bot would outgrow its title. No step title word may pass 9 characters, so it fits the 144px
column at 32px; `wrap-break-word` is the guard if one does. Nothing scrolls sideways: the new
roles' widest part is the flag's pennant at x 134, inside the bot's box; the fix label is centred
in the middle of the row and wraps below `lg`; the ledges and the phone fix line sit inside the
88px bot column (only the fix arrowhead's empty icon box reaches 3px into the gutter at rest; on a
fix run the job rides the line 7–8px into it for a moment, 5.9).

### 5.5 Content slots (`content/home.ts → process`)

`<set>` is `default`, `service-business`, `online-store`, `discord`, `software-builder` or
`website`. `default` is in the shared voice; each card's flow is in its tone. Flows are
illustrations (constitution §7.5); how the user works, as a flow shows it, must still be in
`docs/03-facts.md` → How the user works.

| Key | Meaning | Limit |
|---|---|---|
| `process.number` / `process.label` | "02" and the section label; shared | 5 words |
| `process.heading.lead` / `.accent` | The heading; `accent` is its last words, in violet. Must hold for every flow | 6 words in total |
| `process.stepLabel` | "Step" before each two-digit number | 1 word |
| `process.flows.<set>.caption` | Names the sample job this flow follows, and that it is an example | 5 words / 32 characters |
| `process.flows.<set>.steps[0–4 or 0–5].title` | The step's name, as listed in 5.10 | 2 words / 16 characters, no word over 9 characters |
| `process.flows.<set>.steps[i].line` | One short line on what happens at that step; facts level only (no agent names, tools or counts) | 10 words |
| `process.flows.<set>.loopLabel` (**absent on `discord`**) | Between jobs: what the job taught goes back into the rules, so the next job starts from better rules. **Meaning unchanged by decision B;** the current lines ("Next job, better rules.") already read as between jobs, so no rewrite is needed | 5 words / 26 characters |
| `process.flows.<set>.fixLabel` (new, decision B; **absent on `discord`**) | Inside a job: a problem or a broken rule sends the work back to the agent that did it, checked again until it passes. Names the rule break (the user asked for it shown), in the card's tone (e.g. "Rule broken? Back to fix."). No counts | 5 words / 26 characters |

The old `process.steps[0–3]` and `process.loopLabel` are replaced by `process.flows`. The relay
adds no text and no slots; neither did the phone track (2026-10-05), and neither do the ledges or
the phone fix line (2026-10-05, later: `fixLabel` keeps its key and meaning; one line at 360 is a
sizing note, not a limit). `loopLabel` and `fixLabel`
are required on the five flows with loops and must be absent on `discord`; `hasLoops` (5.3b)
makes either mistake fail `tsc`.

**Discord's slots (2026-10-04), in the Discord tone** (`docs/04-voice.md`). The limits above
hold. Each line needs its fact in `docs/03-facts.md` → For a Discord server (lines being added
2026-10-04); none ships before its fact is in. No validation, check or "rules" wording.

| Key | Working title (the copywriter's wording) | Meaning |
|---|---|---|
| `process.flows.discord.caption` | | The sample is a mention of the bot, and it is an example |
| `process.flows.discord.steps[0]` | Mentioned | A member @-mentions the bot in a channel |
| `process.flows.discord.steps[1]` | Your tone | It replies in the tone the owner set |
| `process.flows.discord.steps[2]` | Remembers | Optional: past chats make the reply personal. The line says it is optional |
| `process.flows.discord.steps[3]` | Connected | It pulls from or posts to the server's business tools and other apps |
| `process.flows.discord.steps[4]` | Always on | It stays in the server around the clock |

### 5.6 The bot (`ProcessBot`, data in `lib/processBots.ts`)

The body is the logo itself: the MW outline on a 100 grid, cut into three "/" strips with gap 8
(bands x + y = 36–76, 84–116, 124–164). Vector: **no `crispEdges`, no cells, no run-merging.**
**2026-09-27:** one rig per bot; the W's two bottom points are cut off as separate feet. The
four `data-frame` groups and the `data-breath` groups are **superseded 2026-09-27**.
**2026-10-03:** four roles are added (`intake`, `flag`, `remind`, `ship`; table below). Roles in
use by the flows: `intake`, `rules`, `team`, `check`, `remind`, `flag`, `ship`. ~~`update` is in no
flow; its drawing stays, unused (decided, choice 30). `host` is Rix.~~ **2026-10-04:** Discord's
flow also uses `update` (step 3) and `host` (step 5), both as drawn below, with no new part
(5.10). `host` is also Rix.

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
    ├ extras: team g sparks → 3 × spark; rules and update g zzz → 3 × z
    └ children (intake only): ProcessEmblem → g prop[data-prop] → the flow's emblem parts
  ```
  Every hook is `data-bot="<part>"`. The 12 base hook elements (rig, foot-left, foot-right, upper,
  body, eyes, eye ×2, arm-left, arm-right, tool, hat) render on every bot; `tool` and `hat` are empty
  where the role has none. **Static = the pose, complete and visible:** no `transform` attributes, no
  inline styles. Only decorative extras start hidden, with the `opacity-0` class: `sparks`, each `z`,
  `page`, and `lens-lit` when the pose isn't `act` (check's pose is `act`, so its `lens-lit` shows).
  The emblem (`prop`) is visible: it is the job, held.
- **No background rect.** **Eye holes are filled, not cut:** `fill-bg` rects over the body (no mask,
  no clip-path), valid only while the section sits on `bg`.
- **Poses (static):** from `lib/processFlows.ts` (5.10): `check` and `flag` stand in `act` (eyes
  up-right, on the lens and on the flag); every other role in `idle`. `stepBots` is removed.
- **Colour keys → classes** (map in `lib/botFills.ts`): B `fill-accent`, C `fill-cream`, M `fill-muted`,
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
| `tool` | g | team 112.5 53 · check 101 55 · update 104 53 (grips) · **flag 108 53 · remind 118 20 · ship 118 50** | `rotation`; check (scan) and ship (the arrow's thrust) also `x`/`y` |
| `hat` | g | 50 10 (brim base) | `y` (breath ride); `rotation` (landing wobble) |
| `mark` | path | its left end, centre y (rules −21 45.5 / −21 51.5 / −21 57.5; update −17 47.5) | `scaleX` (writing) |
| `page` | path | −21 52 (spine edge) | `scaleX`, `opacity` |
| `lens-lit` | path | none | `opacity` |
| `sparks` / `spark` | g / path | 140 33 (strike point) | group `opacity`, `scale`; each spark `x`/`y` outward |
| `z` ×3 | path | its centre (92 2 / 105 −7 / 120 −12) | `x`, `y`, `scale`, `opacity` |
| **`prop`** (intake) | g | 118 50 (as Rix's `PROP_PIVOT`) | `x`, `y`, `rotation` (intake's act: the hold out); `opacity`, `scale` (the relay only: the hand-off and the new job's pop, 5.7) |

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

**Eyes** (H, 14 × 14, drawn at the pose): idle 23,43 and 63,43 (`data-look="0"`); `act` for check
and flag 30,36 and 70,36 (`data-look="7"`). Motion values: blink closed = `y` drawn y + 7, `height` 0; sleep slit =
`y` 52, `height` 3 (only rest-0 bots nap, after the look returns to 0); pop = scale 1.25. Blinks and
slits use `attr` rather than `scaleY` because the slit isn't centred on the eye (52–55 vs centre 50).

**Arms and tools** (in each arm group, in the order listed). Left arm `<rect x="-4" y="50" width="10" height="6">` B;
right arm `<rect x="94" y="50" width={armR} height="6">` B, `armR` 18 for `team`, 12 for `flag`
(the hand meets the pole), 10 for the rest.
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

**New roles (2026-10-03).** No hats, no left-hand tools, no zzz. All parts sit inside the viewBox
(x ≤ 134, y ≥ 4), so nothing paints past the bot's box.

| Role | Group | Part: `d` (fill) | Reads as |
|---|---|---|---|
| `intake` | children | the flow's emblem, `g data-bot="prop" data-prop={name}` (`ProcessEmblem`, 5.10) in the prop slot (x 106–130, y 23–50) | a bare bot holding the job that just arrived |
| `flag` | tool | pole `M106 4h4v52h-4Z` (M); pennant `M110 6H134L126 14L134 22H110Z` (C); mark `M117 9h3v6h-3Z M117 17h3v2h-3Z` (I) | a bot raising a flag: this one needs a person |
| `remind` | tool | bell `M114 22H122L126 26V38L130 42V45H106V42L110 38V26Z` (C); loop `M116 18h4v4h-4Z` (M); clapper `M115 45h6v4h-6Z` (M) | a bot ringing a bell: the reminder |
| `ship` | tool | arrow `M106 44L120 30H113V25H130V42H125V35L111 49Z` (C), the `send` prop's path | a bot sending it out: shipped |

`looks` for the four: `idle` 0, `act` 7.

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
inside the spare column width and the 18px phone gap; at six across on 1024 they reach 4px into
the 16px gap, still short of the next column); a jump lifts the team ridge to
about y −35 (14px above the box desktop, 9px phone, inside the 20px top margin and the phone row's
24px padding; from `lg` it stays about 10px under the fix arch's arrowhead, 5.3a); zzz rise to
y −28; the entrance starts 60 units up (48px, faded, transient). Squash
and lean reach x ≈ −36 on the left (5px desktop, 3px phone, into the gutter). The flag rides the
right arm's drift (±3° about the shoulder), which sways the pennant's far corner about 3 units,
to x ≈ 137, inside the viewBox (140). **In its act (built 2026-10-04)** the flag dips to 30°
before the raise, and the pennant's far corner reaches x 154: 11px past the box from `lg` (inside
even the 16px gap of six across at 1024) and 7px on a phone (inside the 18px gap), transient. The
bell's swing (x 99–137) and the arrow's thrust (tip at x 131, y 14) stay inside the box. No
sideways scroll at 360.

### 5.7 Components, images, motion

- **Components (`components/home/process/`):** `ProcessSection.tsx` (server: frame, header,
  `ProcessFlow`, `ProcessMotion`), **new** `ProcessFlow.tsx` (client: the pick, the tag, the
  caption and the keyed body; **changed:** `lg:gap-24`, and it passes `flow.fixLabel` and the
  layout's `fixBox` to `ProcessList`), `ProcessList.tsx` (**changed:** renders
  `ProcessFixReturn` into step `FIX_STEP`'s `after`), `ProcessStep.tsx` (**changed:** optional
  `after` prop, the `<li>`'s last child), `ProcessReturn.tsx` (unchanged), **new**
  `ProcessFixReturn.tsx` (5.3a), `ProcessRelay.tsx`, `ProcessJob.tsx` (each now takes props and
  reads no content itself), `ProcessBot.tsx` (unchanged; `children` already exists), **new**
  `ProcessEmblem.tsx` (the `g data-bot="prop"` in step 1's hand), `ProcessLesson.tsx`
  (unchanged). Shared: `components/home/pick/ShownForTag.tsx` (§0.6). Icons reused:
  `ChevronUpIcon` (rotated for the fix arrowhead), `CornerUpLeftIcon`. **Images:** none.
  **2026-10-04 (5.3b), two files change and no new one:** `ProcessFlow.tsx` reads
  `flowLoops(set)`, sets `data-loops`, picks the gap and renders `ProcessReturn` only with loops;
  `ProcessList.tsx`'s `fixLabel` is optional.
  ~~**2026-10-05 (5.9), one new file and two changes:** new `ProcessTrack.tsx`; `ProcessList.tsx`
  renders it before the `<ol>`, which gains `relative`; `ProcessFixReturn.tsx`'s row gains
  `bg-bg`.~~ **2026-10-05, later (5.3a, 5.9), one new file, one deleted, three changes:**
  **deleted** `ProcessTrack.tsx` (`ProcessList.tsx` no longer renders it; the `<ol>` keeps
  `relative`); **new** `ProcessLedge.tsx` (server, no props: the ledge and its lit overlay,
  choice 61), rendered by `ProcessStep.tsx` right after `ProcessBot`; `ProcessStep.tsx`'s `<li>`
  takes `relative` at every width; `ProcessFixReturn.tsx` drops `CornerUpLeftIcon` and the
  row's `bg-bg`, `flex items-center gap-3`, gains `pl-4` and the phone fix line with its lit
  overlay. Icons: `ChevronRightIcon` (also the phone fix arrowhead); `CornerUpLeftIcon` now in
  `ProcessReturn` only.
- **Logic:** `lib/processBots.ts` (four new roles; `stepBots` goes), **new** `lib/processFlows.ts`
  (each set's roles, poses and emblem, 5.10; each list's type tied to `process.flows[set].steps`;
  **new** `FIX_STEP = 2`; **2026-10-04:** `hasLoops`, `flowLoops(set)` and the new
  `flowRoles.discord`), `lib/processLayout.ts` (the 5.1 class strings; `FlowLayout` **gains**
  `fixBox`), **new** `lib/processEmblems.ts` (the default job sheet's parts, and the set → emblem
  lookup over `lib/rixProps.ts`), `hooks/useAboutPick.ts`, `hooks/useShownSet.ts` (§0.5).
- **The relay layer stays in the markup, hidden** (`ProcessRelay`, `opacity-0`, decorative), so the
  motion pass adds no elements. For `default` the job is the built sheet (`ProcessJob`, all
  `data-job` parts) and the ghosts its outline. For a card the job draws that card's emblem:
  `<svg data-anim="process-relay" data-emblem={name} viewBox="104 21 28 31" class="absolute left-0 top-0 -ml-2.25 -mt-5 h-5 w-4.5 overflow-visible opacity-0 lg:-ml-3.5 lg:-mt-7.75 lg:h-7.75 lg:w-7">`,
  base parts `data-job="base"`, marks `data-job="mark"`, and the base outline again as
  `data-job="glow"` (`fill-none stroke-accent opacity-0`). The three ghosts draw the emblem's base
  parts. The lesson card is unchanged.
- **Static state** (also without JavaScript and under reduced motion): every bot in its pose, the
  emblem held at step 1, both loops drawn with their labels (neither on Discord, 5.3b), nothing
  lit on the ground line, the return path or the fix arch. ~~**2026-10-05:** below `lg` the track
  is drawn, unlit.~~ **2026-10-05, later:** below `lg` every bot stands on its ledge, unlit, and
  the dotted fix line is drawn, unlit (5.3a, 5.9).

**Motion, as built (the motion pass, 2026-10-04; the 2026-10-03 round built nothing new and left
the relay off).** `ProcessMotion` calls `useScrollReveal` and `useProcessBots`; `ProcessFlow`
calls `hooks/useSwapFade.ts`. The bots' own layers run on five or six bots and on every role, and
the relay is on. The wiring, with what the motion pass changed:
1. `BotRole`, and `isRole` in `lib/processBotRig.ts`, accept `intake`, `flag`, `remind`, `ship`.
   (A bot whose role fails `isRole` is skipped and stands still, so this is what brings them in.)
2. `botPivots.tool` gains `flag` 108 53, `remind` 118 20, `ship` 118 50. `rigBot` skips the tool
   pivot for `intake`, as it does for `rules` and `host`.
3. The life tables in `lib/processBotMotion.ts` give the four roles `host`'s values:
   `BREATH_HALF` 1.3, `SWAY_DEG` 1.2, `SWAY_HALF` 3.0. **2026-10-04:** the relay's tables give
   every role its own: `RELAY_DWELL` 1.3 for `intake` (its hand-off beat), 2.0 for `rules`,
   `team`, `check` and `update`, 1.8 for `flag`, 1.6 for `remind`, 1.2 for `ship` and `host`;
   `JOB_AT` 118 for `intake` (the hand), 126 for `update` and `flag`, 122 for the rest.
4. `acts` in `lib/processBotActs.ts` holds every role. **2026-10-04:** `intake`, `flag`,
   `remind` and `ship` have their own acts (`lib/processBotFlowActs.ts`, on the shared moves in
   `lib/processBotMoves.ts`), no longer the host's `nod`; `host` keeps the nod, timed to the job
   on a relay catch.
5. One flag, `RELAY_ON`, in `lib/processBotMotion.ts`: **`true` since 2026-10-04.** `fullMotion`
   builds `relayParts` (from `lg`) or `columnParts` (below `lg`) only when it is true.
   `RELAY_EVERY` is gone: runs are paced by `RELAY_REST = 2`, the pause from one run's last tween
   to the next run's start. The first run starts `RELAY_FIRST = 1.5`s after the last bot lands.
6. `useProcessBots(section, set)`: the shown set is a `useGSAP` dependency (with
   `revertOnUpdate`), so after a swap the hook lets go of the old bots and rigs the new ones.
   `entered` is already true by then, so they are shown at rest and life starts: no second drop.
   The relay starts again on its first-run delay.

| Layer (number in `05-process-motion.md`; hooks) | State | Why, and what it needs |
|---|---|---|
| Reveals (`reveal`: header, step text) | **Keep** | No change. Text mounted by a swap is simply visible. The fix marker is outside the text column, so it shows without a reveal |
| 1 Life: breathing, sway, arm drift | **Keep**, every role | Wiring 1–3. The flag, bell and arrow sit in `arm-right`, so they sway with its drift; the held emblem sits in `upper`, as Rix's does |
| 2 Blinks | **Keep** | Works on any role |
| 3 Looks | **Keep** | Works on any role; `check` and `flag` rest at look 7 |
| 4 Foot taps | **Keep** | Works on any role |
| 5 Timed role acts (every 5–10s) | **Keep**: `rules`, `team` and `check` play their built acts. **Built 2026-10-04:** `intake`, `flag`, `remind` and `ship` play their own (below). **Discord:** `update` plays its built act (wrench ratchets, then the page flips and the mark is rewritten) and `host` the nod | Wiring 4. No timed act starts within 3.5s (`RELAY_CLEAR`) of the bot's next relay catch. `update` and `host` need no wiring: both are already rigged |
| 6 Naps | **Keep**: `rules`; on Discord also `update` (open choice 42). `host` never naps in Process: `startActs` schedules naps for `rules` and `update` only | No nap starts within 8.5s of the bot's next relay catch; a napping bot wakes on a catch |
| 7 Eyes and lean follow the pointer | **Keep** | Works on any role |
| 8 Hover or tap jump, then the short act | **Keep**; the new roles jump, then play their own short act | Wiring 4. Step 3's jump stays under the fix arch (5.3a); on Discord nothing is above the bots |
| 9 Drop-in entrance | **Keep**, once per page load, five or six bots 0.15s apart | Works on any count. After a swap: wiring 6. Step 3's bot falls past the arch, faded, for a moment; accepted (transient) |
| 11 Pausing off screen and in a hidden tab; teardown | **Keep** | `resetBot` as built; teardown also strips the relay's parts and shows the held emblem again |
| 12 Reduced motion: one fade-in, static poses | **Keep**, unchanged | Works on any count. No relay, nothing lit |
| 10 Crew relay: the job (`process-relay`), ghosts, `process-ground-lit`, chevron pulses, the lesson (`process-lesson`), `process-return-lit`, the return arrowhead's pulse, the catches and watches, `receive`, `holdLesson` | **On: rebuilt 2026-10-04** | Wiring 5. Five or six stops at every width; detail below. The four-step spec is `05-process-relay-legacy.md`. On Discord the return parts don't exist, so its run is a one-way pass (5.3b) |
| The fix hop and `process-fix-lit` | **Built 2026-10-04.** Never on Discord: the overlay isn't in its markup | Every second run, +5.2s from `lg` (+5.5s below it, the way back along the dotted line, 5.3a); the overlay lights by `clip-path`; the fix arrowhead does not pulse (5.3a Motion) |
| ~~The phone track's lit segment (`process-track-lit`)~~ | **Superseded 2026-10-05, later** (built 2026-10-05; the track is removed, 5.9) | With `process-track` and `process-track-lit` gone, the lane is each role's `JOB_AT` on the feet line, the top of its ledge. The ledge pass (2026-10-05) deleted the track's code: `ontoTrack`, `COLUMN_JOB_GLIDE` and `litDrop` |
| The ledges' and the phone fix line's lights (`process-ledge-lit`, `process-fix-line-lit`) | **Built 2026-10-05** (the ledge pass, `lib/processRelayLedge.ts`; the fix line route, `lib/processRelayFixLine.ts`) | Below `lg`, full motion only: the job hops ledge to ledge, each ledge lights while its bot works the job, and on a fix run the job goes back along the dotted fix line, which lights behind it (5.9 Motion, as built) |
| Swap fade (§0.5) | **Built 2026-10-04** | Wrappers: `process-caption` and the keyed body (the flow's last child). `process-flow` itself and the tag are not written |
| The new roles' own acts; the emblem's hand-off from step 1 | **Built 2026-10-04** | `lib/processBotFlowActs.ts`, `lib/processRelayHand.ts`; detail below |

- **Hooks in the markup** (all stay): `reveal`, `process-list`, `process-ground`,
  `process-ground-lit`, `process-chevron`, `process-return`, `process-return-row`,
  `process-return-lit`, `process-relay` and its `data-job` parts, `process-relay-ghost`,
  `process-lesson` and its `data-lesson` parts, `process-bot` and every `data-bot` hook in 5.6.
  **New:** `process-flow` (with `data-set`, `data-count`), `process-caption`, `data-step`,
  `data-bot="prop"` on the held emblem, `data-emblem`, `data-job="mark"`, and `data-role` values
  `intake`, `flag`, `remind`, `ship`; **decision B:** `process-fix-row`, `process-fix`,
  `process-fix-lit`. **2026-10-04:** `data-loops` (`on` / `off`) on `process-flow`. Under
  `data-loops="off"` the three `process-return*` and the three `process-fix*` hooks are absent;
  `data-role` values `update` and `host` appear in Process. ~~**2026-10-05:** `process-track` and
  `process-track-lit`~~ (removed 2026-10-05, later). **2026-10-05, later:** `process-ledge` and
  `process-ledge-lit` (below `lg`, one pair in every step of every flow, Discord included);
  `process-fix-line` and `process-fix-line-lit` (below `lg`, inside `process-fix-row`, flows with
  loops only, so absent under `data-loops="off"` with the other fix hooks).
- **The relay, as built (2026-10-04; rebuilt from the four-step relay).** Files in `lib/`:
  `processRelayPlan.ts` (the clock: which stop when), `processRelayRun.ts` (one run's story, for
  both widths), `processRelay.ts` (from `lg`, along the ground line), `processRelayColumn.ts`
  (below `lg`, 5.9), `processRelayLedge.ts` (**new 2026-10-05:** below `lg`, the ledge hops and
  the ledge lights, 5.9; its straight fix rise, `fixLineRise`, is removed in the fix line route),
  `processRelayFixLine.ts` (**new 2026-10-05, the fix line route:** below `lg`, the way back
  along the dotted fix line and its light, 5.3a, 5.9), `processRelayHand.ts` (the hand-off),
  `processRelayJob.ts` (the job's changes and exit), `processRelayFix.ts` (the fix hop),
  `processRelayLesson.ts`, `processRelayTrail.ts`; the acts in `processBotActs.ts`,
  `processBotFlowActs.ts` and `processBotMoves.ts`; every number in `processBotMotion.ts`.
  - **Clock.** A run visits the flow's five or six stops in step order, each for its role's
    `RELAY_DWELL` (wiring 3), a 0.7s hop apart. The next run starts `RELAY_REST = 2`s after the
    last one ends; there is no fixed start-to-start time.
  - **Run lengths** (return included): five steps ≈ 14.7–16.0s (≈ 19.9–21.2s with the fix hop
    from `lg`); six steps ≈ 16.9–18.5s (≈ 22.1–23.7s with it from `lg`); Discord 11.8s, a one-way
    pass with no lesson and no fix hop (5.3b). The fix hop adds 5.2s from `lg` and 5.5s below it:
    there the way back is `FIX_LINE_HOP`'s 1.1s, not `FIX_HOP`'s 0.8s. `relayPlan` takes the
    back hop's length as an optional third argument (default `FIX_HOP`'s), and `useProcessBots`
    passes `columnBack(column).duration` below `lg` only.
  - **Hand-off.** The job starts in step 1's hand, as the held emblem (`data-bot="prop"`).
    Intake holds it out, and on its hand-off beat (1.3s) the travelling job takes the emblem's
    place in the same frame, at its size, and the held emblem hides. From `lg` the job drops
    onto the ground line early in that first hop. Below `lg` it drops out of the hand onto
    ledge 1 (`JOB_HAND_OFF`, 0.22s `power2.in`) and hops on to ledge 2 in the rest of the hop
    (5.9). The held emblem returns, popping in as a new
    job, when the next run starts (not on the first run, where it is already held). The static
    page and every teardown have it held.
  - **The job's changes,** each on a beat of the bot's act. On the default sheet: `rules`
    stamps it, `team` builds the band and the step, `check` flickers the tick in and flashes the
    glow. The sheet's `rule` and `fold` marks are not animated: they are what arrived. On an
    emblem (no such marks): `rules` and `check` blink its ink marks, `team` and `check` flash the
    glow. `flag`, `remind`, `ship`, `update` and `host` give a pop and the glow on either job.
  - **The check.** On a relay pass it scans and the lens flickers. Its "found it" eye pop plays
    on the relay only when the job goes back (5.3a); a timed act, off the relay, may still end
    on it.
  - **The fix hop:** every second run (`FIX_EVERY = 2`), flows with loops only, +5.2s from `lg`
    and +5.5s below it (5.3a). `process-fix` and step 3's `<li>` are never written.
  - **The return.** As the job leaves the last bot, the lesson splits off it, drops onto
    `process-return` and rides it back, lighting `process-return-lit` by `clip-path`; it ends on
    step 2, not step 1, where the arrowhead pulses and the rules bot takes it. Below `lg`: 5.9.
  - **Below `lg`, the lane.** ~~The track (built 2026-10-05): stops 2…n and the exit took the
    measured centre x of `process-track`, with `ontoTrack`, `COLUMN_JOB_GLIDE` and `litDrop`.~~
    **2026-10-05, later:** the track is removed (5.9). Each stop is the role's `JOB_AT` x on the
    bot's feet line, which is the top of its ledge (x ≈ 70–88 for most roles, ≈ 72–90 for `flag`
    and `update`: within 2px of the ledge's right end). **The ledge pass (2026-10-05):** the job
    hops onto that lane ledge to ledge and each ledge lights while it is there (5.9 Motion, as
    built); `ontoTrack`, `COLUMN_JOB_GLIDE` and `litDrop` are deleted.
  - **Known limits (from the build check):** below `lg` the job crosses the fix marker row's
    label for about 0.1s, and the lesson crosses that row's icon; with six steps at 1024 the
    job's exit slide is only 1–6px. **2026-10-05, later:** the icon is gone; the lesson's ride
    up the column's left edge (x ≈ 2–13) now passes over the dotted fix line's ends and
    arrowhead between bots 4 and 3: accepted in the ledge pass (5.9 Motion, as built; open
    choice 65). The track's three known limits (the job
    against the flag pole and the wrench on the track's lane, the hand-off's tolerance, the lit
    segment's bright end) went with the track (choices 50–52 closed).
- **New acts, as built** (`lib/processBotFlowActs.ts`; each in three lengths: timed, short after
  a hover or tap, and the relay catch): `intake` looks at the job, nods, holds it out (0.5s) and
  hands it on (1.3s) on a catch, or brings it back on a timed act; with the job out on the relay
  its hand is empty, so it nods. `flag` dips the flag to 30°, raises it (the top at 0.5s; `tool`
  rotates about 108 53) and waves it. `remind` swings the bell about 118 20 (the first swing
  peaks at 0.3s), with a nod. `ship` pulls the arrow back, then sends it up and to the right
  (0.5s; `tool` `x`/`y`). `host` nods; on a catch it looks at the job first (dip at 0.4s).
- **Swap, as built (§0.5):** `process-caption` and the keyed body fade out over 0.15s, the flow
  changes, and they fade in over 0.25s; opacity only, the same under reduced motion.

### 5.8 Choices

**Decided by the user, 2026-10-03** (also listed in `../ui-spec.md`):

28. **Six across from `lg`, with a 16px gap up to `xl` — decided,** with the 9-character limit
    on step-title words. (Not chosen: rows until 1280 for six-step flows; smaller bots for six.)
29. **The return lands on "your rules", step 2 — decided.** (Not on Discord, 38.)
30. **New roles `intake`, `flag`, `remind`, `ship` — decided** (5.6). ~~`update` (wrench and
    rulebook) is in no flow; its drawing stays in the code, unused, for the motion pass to keep
    or delete.~~ **2026-10-04:** `update` is Discord's step 3 (38, open choice 41).
31. **One worker for every "done" step — as specced:** `team` (hard hat and hammer) does booked,
    answered, built and done.
32. **A sample-job caption under the tag — decided:** in (one slot per flow).
33. **Step 1's bot holds the job on the static page — decided:** the card's emblem, or the plain
    job sheet in `default`.
34. **Motion this round — decided:** "don't build new for now, keep whatever is there already".
    The bots' built layers keep running; the relay is off until the motion pass (5.7).
    **2026-10-04:** the motion pass is built; the relay is on (5.7).
35. **This file was split.** The bots' built motion is `05-process-motion.md`; the four-step
    relay's text is `05-process-relay-legacy.md`.
36. **A second return, the fix loop, step 4 → step 3 on every flow — decided (decision B),** with
    its own label slot carrying the rule break. Specced as an arch above the bots from `lg` and a
    marker row in step 3 below `lg` (5.3a); the bottom return and its slot's meaning stay.
    (Not on Discord, 38.) **2026-10-05, later:** below `lg` the marker row's icon is replaced by
    a dotted line (54).

**Decided by the user, 2026-10-04** (also listed in `../ui-spec.md`):

38. **The Discord flow has no validation and no loops — decided.** No "Second check" step, no fix
    loop, no bottom return. Its bot stays in the server around the clock, answers when a member
    mentions it, talks in the tone the owner sets, can optionally remember past chats, and
    connects to the server's business tools and other apps. Five steps, in this order: Mentioned,
    Your tone, Remembers, Connected, Always on (5.3b, 5.5, 5.10). The other five flows keep their
    check and both loops unchanged.

**Decided by the user, 2026-10-05:**

44. **A track down the bot column below `lg` — decided:** "a thin vertical line down the bot
    column that the emblem rides, lighting up as it passes" (5.9). It answers the old open
    choice 27 (whether the phone column gets a track; "none" was recommended and built). From
    `lg` the ground line is unchanged. **Built 2026-10-05,** static and motion (5.7, 5.9).
    **Superseded 2026-10-05, later, by 53.**

**Decided in this spec, 2026-10-05 (the lead may review; 5.9). Superseded with the track (53);
kept as a record, the track's spec is `05-process-track-legacy.md`:**

45. **The track's x is the hand's line** (x 76–78, the prop slot's centre), and below `lg` the
    job's lane takes its x from the track. (Not chosen: x 78–80, where most stops are measured
    today, with no change to the stops; the held emblem would sit 2.4px off the line's centre.)
46. **It starts 2px under the held emblem,** so the emblem reads as sitting on its rail. (Not
    chosen: starting at step 1's feet line, 20px lower, the way the job drops onto the ground
    line from `lg`.)
47. **The fix marker row masks it** with `bg-bg`. (Not chosen: moving the marker row into the
    text column, which would also end the job's 0.1s pass over the label, but changes 5.3a and
    wraps the label at 360.)
48. **On the fix rise the lit segment turns over and fades on arrival.** (Not chosen: the
    stretch between bots 3 and 4 staying lit while step 3 redoes its work, as the arch does
    from `lg`.)
49. **Its own file,** `ProcessTrack.tsx` (constitution §9), though the ground line is inline in
    `ProcessList`.

**~~Open for the user~~ Closed 2026-10-05, later (moot: the track is superseded, 53).** The
animator's three calls from the track's build, as they stood:

50. **The job against the flag pole and the wrench, below `lg`.** With those stops on the
    track, the job's top-left corner meets the flag pole's foot and, on Discord's step 3, the
    low end of the wrench's handle. (a) Accept it, as built. (b) Shift the two tools clear of
    the track: a change to their drawings (5.6), which the bots share at every width. (c) Let
    those stops sit off the track, at their own `JOB_AT` x as before.
51. **The hand-off's tolerance.** (a) As built: the job leaves the hand up to about 3.2px off
    the track for about 0.05s, then eases onto it (`COLUMN_JOB_GLIDE`); that is over 5.9's 3px
    twice in 30. Accept it, and widen the tolerance above step 1's feet line to match. (b) Keep
    3px as a hard limit; the animator brings the hand-off inside it.
52. **The lit segment's bright end on a drop.** (a) On the job's feet line, as built: the
    brightest 18px is then behind the job. (b) On the job's centre: about half of that stays
    behind it.

**Decided by the user, 2026-10-05, later (final):**

53. **Ledges replace the phone track — decided.** No rail: under every bot below `lg`, a short
    2px `line` ledge it stands on, a piece of the ground line (`process-ground`) cut to the bot's
    width; the job hops ledge to ledge and each ledge lights violet as the job lands, the ground
    line's lit segment made short (5.9). From `lg` nothing changes. Supersedes 44–52.
54. **Below `lg` the fix loop is a dotted line — decided.** The marker row's ↰ icon goes; a
    dotted `accent` line down the bot column's left side runs from step 4's bot up to step 3's,
    the phone form of the arch, and never below step 4. The label stays, one element at every
    width, beside the line between steps 3 and 4; no copy change (5.3a).

**Decided in this spec, 2026-10-05, later (the lead may review; 5.3a, 5.9):**

55. **The ledge runs x 18–88,** from the body's left edge past the right foot (x 57) to the bot
    column's right edge, under the right-hand tool, so the job, which waits beside the feet
    (x ≈ 70–88), lands on it. (Not chosen: x 18–58, the sketch's end at the right foot, `w-10`;
    the job would then land 12px past the ledge's end, in the air, or the lane would move over
    the feet.)
56. **The ledge's lit overlay is the ground-lit gradient,** `from-accent/0 to-accent`, bright at
    the right end under the job. (Not chosen: solid `accent` along the whole ledge.)
57. **The fix line is a bracket with turned ends and an arrowhead onto bot 3,** the arch on its
    side. (Not chosen: a straight dotted line with plain ends; it would not say which way the
    work goes on the static page.)
58. **The fix line is `border-dotted`** below `lg`, as the user asked; the arch from `lg` stays
    `dashed`. (Not chosen: dashed at both widths, or the arch made dotted too.)
59. **Step 4's hairline draws over the fix line where they cross,** uncut. (Not chosen: lifting
    the line over it with a `z-index`, a new layer for one dot.)
60. **Each `<li>` takes `relative` at every width** to place its ledge and the fix line, with no
    `z-index`. (Not chosen: a wrapper round the bot, an extra element at every width; or the
    ledges drawn in the list and placed per row.)
61. **`ProcessLedge.tsx` is its own file** (constitution §9), like the track was; the fix line
    stays in `ProcessFixReturn.tsx`, as the phone form of the same loop.

**Open for the user (with the recommendation):**

37. **Where the fix label sits from `lg`.** (a) Centred above the arch, with the caption → steps
    gap growing from 48 to 96px so it clears the caption by 20px. (b) On the arch's top edge, like
    the bottom label, with no extra gap; at six across on 1024 the arch (162px) is narrower than
    the label, so the label covers its corners and it reads as two legs under a label.
    **Recommended: (a).**

**Open for the user, the ledge motion (2026-10-05; as built is (a) in each, 5.9 Motion):**

62. **The hop's lift.** (a) Each hop lifts `LEDGE_HOP.lift` 6px above the higher ledge before it
    drops, so it reads as a small throw, as built. (b) 0: the job falls straight from ledge to
    ledge with no lift.
63. **Ledge 1 on the hand-off.** (a) A quick flash: in over 0.15s and straight out over 0.35s as
    the job touches it on its way out of the hand, as built. (b) Held, as the other ledges are
    while their bot works the job.
64. **Ledge lights under reduced motion.** (a) None: there is no relay, so nothing lights, as
    built. (b) A short `opacity` fade on the ledges with no hop, which constitution §5 allows as a
    fade as long as it does not loop (a loop would be a looping pulse).
65. **The lesson over the fix line, below `lg`.** (a) Accepted, as built: it keeps its lane
    (x ≈ 2–13) and rides over the fix line's ends and arrowhead; there is no free lane, both are
    "back up" loops, and it crosses in ≈ 0.45s while the line is unlit. (b) Moved into the
    gutter, left of the list, clear of the line but past the list's edge.

**Decided by the user, 2026-10-05 (the fix line route; built, checked by the lead at 360 and
768):**

66. **Below `lg` the job goes back along the dotted fix line.** The user: "the object should go
    back from the dotted route instead of a step back". On a fix run the job leaves ledge 4,
    rides the dotted line from bot 4's hand round both turns and through the arrowhead into
    bot 3's hand, then drops onto ledge 3; the line lights behind it (5.3a, 5.9 The fix rise).
    Replaces the straight rise from ledge 4 to ledge 3, which stays only as the fallback with no
    fix line. From `lg` the arch hop is unchanged.

**Open for the user, the fix line route (2026-10-05; as built is (a) in each, 5.9 The fix
rise):**

67. **The job in front of bots 4 and 3 on the short legs.** On the legs to and from the line
    (ledge 4 to bot 4's hand, bot 3's hand to ledge 3) the job crosses in front of those bots'
    legs and feet, for about 0.35s each. (a) Accept it, as built. (b) Keep the job off the bots
    on those legs; the column has no free lane there, so the animator would need another way
    (for example the job passing behind the bots, a paint-order change to the relay layer).
68. **The way back's length.** (a) `FIX_LINE_HOP` 1.1s, as built: about the ledge hops' speed
    over the ≈ 330–360px route, the climb up the line ≈ 0.38s at 360; a fix run is +5.5s.
    (b) Closer to `FIX_HOP`'s 0.8s, as from `lg`: quicker and matching the arch, each part of
    the route about a quarter shorter in time; a fix run nearer +5.2s.

**Open for the lead (2026-10-04, Discord; the spec uses the first option of each):**

39. **Step 5 "Always on":** `host`, the bare bot that never naps, or `remind`, whose bell already means "Reminder" in the service-business flow.
40. **Step 4 "Connected":** `ship`, whose arrow shows "posts to" and not "pulls from", or a new `link` role (a plug), which needs a drawing and the user's yes.
41. **Step 3 "Remembers":** `update` as drawn, a wrench beside the book of past chats, or a new book-only role.
42. **Naps on an "always on" flow:** `rules` (step 2) and `update` (step 3) nap as built, or naps are skipped under `data-loops="off"` (new wiring).
43. **Below `lg` the list's end:** no closing hairline under step 5, or `border-b border-line` on the last row.

**Earlier choices that still hold** (the relay ones are in the legacy file; the rest are in git
at `37dee00`): the bot stays 136px at 4K (2); the return path is a CSS dashed border box (4);
step numbers are two-digit (5); the wrench jaw shows in full with `overflow-visible` (8); the
`upper` group, the eyes inside `body`, the feet cut 7 units above each tip, the hammer's +30°
strike and the update `mark` hook (9–11, 13, 14); no cursor change on bots (15). **Superseded
2026-10-03:** "four across from `lg`" (1) becomes five or six across; the 3-word title limit (7)
becomes 2 words / 16 characters.

### 5.9 Phone relay

**Rebuilt 2026-10-04 for five or six steps** (`lib/processRelayColumn.ts`), on the same clock as
the ground-line run (5.7). The job leaves step 1's hand and goes down the bot column,
waiting at each later bot's right foot, trailed by the ghosts (no chevrons; as built, no line
under it: it rode the track from 2026-10-05; **since 2026-10-05, later, it stands on each bot's
ledge and hops ledge to ledge, below**). On a
fix run it goes back from ledge 4 to ledge 3 along the dotted fix line (since the fix line route,
2026-10-05; before, it rose straight up the column) and hops down again; ~~the marker row's icon does not
flash~~ (the icon is gone, 5.3a). ~~After the last bot it drops to just above the return row's
hairline (on Discord, the list's end), pops once and fades.~~ **Since the ledge pass
(2026-10-05):** after the last bot's change it pops once as done and fades on the last ledge,
its ledge's light with it. In a flow with the return, the lesson
pops in at the last bot's bare left hand over 0.35s while that bot looks down at it, is held there
for 0.6s, then lifts off and rides the column's left edge up to step 2's clipboard, where the
rules bot takes it. Known limits: 5.7. The four-step version (the lesson from bot 4's rulebook up
to bot 1's clipboard; superseded 2026-10-03) is `05-process-relay-legacy.md`.

#### The track (superseded 2026-10-05, later)

Built and checked on 2026-10-05 (choice 44), superseded the same day by the ledges (53). Its spec,
as built, is kept in [`05-process-track-legacy.md`](05-process-track-legacy.md). Removed:
`ProcessTrack.tsx`, `process-track`, `process-track-lit`, and the fix row's `bg-bg` that masked it.
The motion code that rode it (`ontoTrack`, `COLUMN_JOB_GLIDE`, `litDrop`) is deleted in the ledge
pass (2026-10-05); the job's lane is the `JOB_AT` lane on the ledges.

#### The ledges (`ProcessLedge`, new 2026-10-05, later; the user's choice 53)

The ground line cut into pieces, one under each bot, below `lg` only. One file,
`components/home/process/ProcessLedge.tsx` (server, no props), rendered by `ProcessStep` right
after `ProcessBot`, in every step of every flow (Discord included). Decoration only: no text, no
slot, no image, nothing focusable (so no hover, focus-visible or active state).

```
li data-step={i} class="grid … py-6 relative lg:…"                     (5.2: `relative` at every width)
├ ProcessBot (svg h-14.25 w-22: top 24 under the row's padding top, bottom 81)
├ div aria-hidden="true" data-anim="process-ledge" class="absolute left-4.5 top-20.25 h-0.5 w-17.5 overflow-hidden bg-line lg:hidden"
│ └ span data-anim="process-ledge-lit" class="absolute inset-0 bg-linear-to-r from-accent/0 to-accent opacity-0"
└ chevron (from lg), text column, after                                 (unchanged)
```

- **Where, down.** Top at 81 (`top-20.25`): the row's 24px padding + the 57px bot, the box's
  bottom, which is the feet (viewBox y 92; the left foot's tip is 1px above). The bot stands on
  it as it stands on the ground line from `lg`.
- **Where, across.** x 18–88 of the row (`left-4.5 w-17.5`): from the body's left edge (strip A,
  viewBox x 6 = 18.6) past the right foot (x 57) to the bot column's right edge, under the
  right-hand tool, where the job waits (choice 55). `rules`' clipboard and `update`'s book
  (x 2–13) hang past its left end, as they hang in the air from `lg`. In rem, so it holds under
  zoom.
- **How it meets the rest.** 18px short of the text column (x 106); about 75px above the next
  row's hairline (more where the text runs long); never meets the fix line (x 0–12) or a
  hairline. Nothing covers it at rest, and the feet never go below it (taps and jump lag lift
  them).
- **At rest:** 2px `bg-line`, below `lg`, with and without JavaScript and under reduced motion.
  The lit overlay is hidden (`opacity-0`). From `lg` neither shows (`lg:hidden`) and the ground
  line is unchanged.
- **The lit overlay** is the ground line's lit segment made short: the same gradient, cut to the
  ledge (the ledge is its own clip box, `overflow-hidden`), bright at the right end, under the
  job (choice 56).

**Motion, as built (the ledge pass, 2026-10-05; `lib/processRelayLedge.ts`,
`lib/processRelayColumn.ts`, numbers in `lib/processBotMotion.ts`; checked by the lead at 360
and 768).** It uses the markup above and in 5.3a as it stands; nothing was added.
- **The job hops ledge to ledge.** Out of step 1's hand it drops onto ledge 1 (`JOB_HAND_OFF`,
  0.22s `power2.in`), then hops to ledge 2 in the rest of `RELAY_HOP` (0.7s). Every later hop is
  a thrown arc: the job lifts `LEDGE_HOP.lift` (6px) above the higher of its two ledges, then
  drops onto the next bot's ledge in its `JOB_AT` lane (the right end, on the feet line). The
  rise and the fall share the hop by the square roots of their heights: for a ≈ 170px row, ≈
  0.12s up (`power1.out`) and ≈ 0.58s down (`power1.in`); `x` runs the whole hop on
  `power2.inOut`. The ghosts trail the arc. No rail is drawn between ledges: the job crosses the
  open column, beside the step text (x ≤ 91; the text starts at 106). Lift: open choice 62.
- **Each ledge lights while its bot works:** `process-ledge-lit` fades in over 0.15s
  (`power1.out`) as the job lands, holds while that bot works the job, and fades over 0.35s
  (`power1.in`) as the job hops off (`LEDGE_LIT`). Ledge 1 flashes in and straight out as the
  job touches it on the hand-off (open choice 63). Each light is found through its stop's
  `<li>`. Writers: `opacity` on `process-ledge-lit` only; `process-ledge` is read for its place,
  never written.
- **The fix rise** (every second run, `FIX_EVERY = 2`; rebuilt 2026-10-05, the fix line route,
  `lib/processRelayFixLine.ts`, choice 66): the job goes back along the dotted fix line. It
  leaves ledge 4 heading left, rises at 45° to the line's bottom end at bot 4's hand, rounds the
  bottom turn, climbs the line, rounds the top turn and passes through the arrowhead's tip
  (x 12) into bot 3's hand, then drops at 45° onto ledge 3 and slides to its stop. Each turn is
  a quarter circle of 3 points, its radius from the line's measured width; no MotionPathPlugin.
  The route is rebuilt from `process-fix-line`'s box whenever the column is measured
  (`measureColumn`: on setup, resize and ScrollTrigger refresh) and read on every frame, so a
  reflow keeps the job on the line. One eased progress runs the whole route: `FIX_LINE_HOP`,
  1.1s `power1.inOut` (≈ 0.35s leaving ledge 4, ≈ 0.38s up the line, ≈ 0.35s settling at 360);
  from `lg`, `FIX_HOP` stays 0.8s. The ghosts trail the route. Ledge 4's light fades as the job
  leaves it; ledge 3 lights on the landing as any ledge does. Length: open choice 68.
- **The fix line's light:** `process-fix-line-lit` follows the job's progress by `clip-path`.
  It is clipped to nothing until the job reaches the line's bottom end, then lit from the bottom
  end up to the job's centre (a left inset along the bottom leg, a top inset up the line), and
  fully lit once the job is past the arrowhead. It holds while step 3 redoes its act and fades
  over `FIX_LIT_FADE` (0.6s, `fixLitFade`) as the job hops forward. The arrowhead does not
  pulse. `process-fix-line` and `process-fix-row` are read, never written.
- **Room on the fix rise.** At 360 the job's left edge comes within 13px of the viewport on the
  line (7–8px into the gutter), for a moment: no sideways scroll. On the short legs to and from
  the line it crosses in front of bots 4 and 3's legs and feet (open choice 67). The lesson and
  the job are never on the line together.
- **Without a fix line** (a fallback; every flow with loops draws one): the old straight rise
  from ledge 4 to ledge 3 on its own lane (x ≈ 67–91) in `FIX_HOP`'s 0.8s, unlit.
- **The exit:** on the last ledge the job pops "done" (`JOB_DONE`: up 0.12s to scale 1.12, back
  0.3s `back.out(3)`) and fades over 0.3s (`JOB_FADE`); that ledge's light fades with it. No
  ghosts on the exit. From `lg` it slides to the line's end, unchanged.
- **The lesson over the fix line (accepted, open choice 65):** the lesson keeps its lane up the
  column's left edge (x ≈ 2–13, `COLUMN_LESSON_AT`) and rides over the fix line's ends and
  arrowhead between bots 4 and 3, 1px beside its leg. There is no free lane, both are "back up"
  loops, and it crosses in ≈ 0.45s while the fix line is unlit.
- **Reduced motion:** no relay, so nothing hops or lights; the ledges and the fix line stay,
  static and unlit (open choice 64). Trigger: the relay's clock (5.7), below `lg` and full motion
  only.
- **Must stay true:** tokens only (`line`, `accent` with a `/0` stop). Motion never writes
  `process-ledge`, `process-fix-line`, `process-fix`, `process-fix-row` or any `<li>` (a
  `transform` or `opacity` on an `<li>` would start a stacking context). No sideways scroll.

#### Sizes: the ledges and the phone fix line (phone first)

| Element | Phone 360 | Tablet 768 | 1024 to 3840 |
|---|---|---|---|
| Ledge (`process-ledge`) | 2 × 70 at x 18–88 of the row, top 81 under the row's padding top (the feet); one per step, 5 or 6 | same | none (`lg:hidden`); the ground line, unchanged |
| Ledge lit (`process-ledge-lit`) | the ledge's 2 × 70, `accent` from nothing at the left to full at the right; hidden at rest | same | none |
| Ledge → step text | 18 | 18 | — |
| Fix line (`process-fix-line`, 5.3a) | 2px dotted `accent`, x 0–10; ends at bot 3's hand (61 into step 3) and bot 4's (62 past step 3's end): ≈ 207 tall; turns of radius 10 | same x; ≈ 187 tall | none (`lg:hidden`); the arch, unchanged |
| Fix arrowhead | `ChevronRightIcon` `size-6`, glyph 6 × 12, tip at x 12, 1.5 clear of bot 3's hand | same | the arch's `ChevronUpIcon`, unchanged |
| Fix label | 13px mono, from x 16 (14 right of the line), one line at 360: ≈ 225 of the 304 left | same | unchanged |
| Fix line lit (`process-fix-line-lit`) | the line's box, solid 2px `accent`; hidden at rest | same | none |
| Lowest point of the fix line | bot 4's hand, 19 above its feet and ledge | same | — |
| The job on the fix line (fix runs only) | left edge 13 from the viewport, 7–8 into the gutter | same, 7–8 into the wider gutter | none: it hops the arch |

### 5.10 Flows and roles (`lib/processFlows.ts`, `lib/processEmblems.ts`)

Step order and meaning are the user's (2026-10-03; Discord's 2026-10-04); the wording is the
copywriter's.

| Set (sample job) | Steps | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|---|
| `default` (a job) | 5 | a job arrives: `intake` | your rules: `rules` | done: `team` | second check: `check` | flagged: `flag` | |
| `service-business` (a booking) | 6 | request arrives: `intake` | your rules: `rules` | booked: `team` | second check: `check` | reminder: `remind` | flagged: `flag` |
| `online-store` (an order question) | 5 | question arrives: `intake` | your rules: `rules` | answered: `team` | second check: `check` | flagged: `flag` | |
| `discord` (a mention; no loops, 2026-10-04) | 5 | mentioned: `intake` | your tone: `rules` | remembers: `update` | connected: `ship` | always on: `host` | |
| `software-builder` (shipping a feature) | 6 | feature asked: `intake` | your rules: `rules` | built: `team` | second check: `check` | flagged: `flag` | shipped: `ship` |
| `website` (a visitor's enquiry) | 5 | visitor asks: `intake` | your rules: `rules` | answered: `team` | second check: `check` | flagged: `flag` | |

- **Poses:** `check` and `flag` in `act`; the rest in `idle`.
- **The return** runs from the last step back to step 2 in every flow but Discord.
- **The fix loop** runs from step 4 back to step 3 in every flow but Discord (`FIX_STEP = 2`): in
  those five, step 3 is always the `team` step and step 4 always `check`, so one constant serves
  them all. Which flows have loops is `hasLoops` (5.3b).
- **"Flagged"** means anything unusual goes to a person. The bot raises a flag; no person is drawn.
- **"Second check"** is backed by the facts: "A separate agent checks the work before it goes
  out" (`docs/03-facts.md` → How the user works). It needs no special wording. The fix loop is
  backed by "When a check finds a problem or a broken rule, the work goes back to the agent that
  did it and is checked again, until it passes."
- **Discord's bots (2026-10-04).** `flowRoles.discord = ["intake", "rules", "update", "ship", "host"]`.
  Every drawing exists (5.6); no new role, part or pivot. `rolePose` is unchanged, so all five are `idle`.

| Step | Role | Pose | Drawn | Reads as |
|---|---|---|---|---|
| 1 Mentioned | `intake` | `idle` | bare bot holding the `bubble` emblem | the mention that just came in |
| 2 Your tone | `rules` | `idle` | cap, clipboard with three lines | the tone the owner wrote down |
| 3 Remembers | `update` | `idle` | book in the left hand, wrench in the right | its book of past chats; the built act flips a page and writes a line |
| 4 Connected | `ship` | `idle` | arrow pointing up and out | reaching out to the server's apps |
| 5 Always on | `host` | `idle` | bare bot, eyes open | the bot itself, still in the chat |

- **Emblem (the job; `ProcessEmblem` and the relay's job):**

| Set | Emblem | Parts |
|---|---|---|
| `default` | the job sheet | sheet `M106 26H124L130 32V50H106Z` (C); rules `M109 30h11v2.5h-11Z` · `M109 35h7v2.5h-7Z` (I); fold `M124 26V32H130Z` (D) |
| `service-business` | `calendar` | `lib/rixProps.ts` |
| `online-store` | `parcel` | `lib/rixProps.ts` (`02a-about-options.md` R.2) |
| `discord` | `bubble` | same |
| `software-builder` | `code` | same |
| `website` | `window` | same |

  The job sheet is the built relay job (`lib/processJob.ts`) moved into the prop slot by (106, 26),
  written out as its own paths so the markup holds no transform. Fills through `botFills`.

**Tokens (all existing):** `bg`, `band`, `line`, `text`, `muted`, `accent`, `on-accent`, `cream`,
`cream-muted`, `ink`; `font-display`, `font-body`, `font-mono`; `text-meta`, `text-nav`,
`text-body`, `text-body-lg`, `text-step`, `text-heading`; `px-gutter`, `py-section`,
`--container-site`; radii `rounded-full`, `rounded-b-2xl`, `rounded-t-2xl`, `rounded-l-2xl`. No new
token (2026-10-04: the Discord flow adds none; 2026-10-05: the phone track used `line` and `accent`
only; 2026-10-05, later: the ledges and the phone fix line use `line` and `accent` only, and
`rounded-l-2xl` joins the radii).
