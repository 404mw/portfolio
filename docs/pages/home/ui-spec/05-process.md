# §5 Process: UI spec

Shared rules and parts (§0): [`../ui-spec.md`](../ui-spec.md). Page doc: [`../sections/05-process.md`](../sections/05-process.md).
The built bot motion (§5.7's constants and layers): [`05-process-motion.md`](05-process-motion.md).
The four-step relay (legacy; superseded by the 2026-10-04 rebuild, 5.7): [`05-process-relay-legacy.md`](05-process-relay-legacy.md).
The phone track (legacy; superseded 2026-10-05, later, by the ledges, 5.9): [`05-process-track-legacy.md`](05-process-track-legacy.md).

**Last Updated:** 2026-10-09. Every choice in 5.8 is decided except the ones marked open.
**2026-10-09 (catch-up to the build and to the user's calls of this date; not a redesign):**
(1) **Across from `wide`.** The flow goes side by side only from 1440 (`--breakpoint-wide:
90rem`, a new breakpoint added with the user's yes, used through the `wide:` variants) and stacks
below that, so 1024 and 1280 now get the stacked layout that phones and tablets get. Every flow
class that was `lg:` (or `xl:`) is now `wide:`. The header's gaps stay on `lg` (`lg:gap-7`, and
the section's `lg:gap-24`). Five- and six-step flows share the 32px gap (`wide:gap-x-8`). The
chevron (`wide:-right-6`), the return's `wide:-mr-24` and `fixBox` (`wide:-right-24`) moved to
`wide:` with it. The relay's `relayQuery` is `(min-width: 90rem)`. Choice 28 (six across at 1024
on a 16px gap) is superseded (5.1, choice 81). (2) **"Rules" is now "standards"** in the copy. Step
2 is "Your standards", and the labels read as in `content/home.ts` (5.5, choice 82). The bot role
keeps its code name, `rules`. (3) The one question is **"Can I trust it with my customers?"**. The
fix loop sits at **step 4 and returns from step 5** (`FIX_STEP = 3`, zero-based). Round 2 (5.11)
is built. (4) The step title is `font-display text-step leading-[1.15]`, with no weight, tracking
or width class (the 2026-10-07 font change). (5) Every Sizes table has the columns phone / tablet
/ desktop / 4K. Desktop below 1440 is stacked, like tablet. In the dated notes below, "`lg`" is
the breakpoint as it was on that date. In the body it reads `wide` wherever the flow is meant.
**2026-10-08 (round 2 of the plain-words overhaul; the user's decisions; static and motion
specced, not built yet):** the one question becomes **"Can I trust it with my customers?"** (was
"How do they work?"). **Control comes first:** in every flow with loops the step that passes the
job to a person moves from the end to step 3, before the work: job arrives → your rules → anything
sensitive or unusual goes to you → the routine job is done → it is checked before it goes out
(→ back to fix) → the flow's last step, if it has one. The fix loop moves one step right (step 5
back to step 4, `FIX_STEP = 3`); the return is unchanged. New: **the hand-off to you**
(`ProcessHandoff`, 5.11), a dashed stem up the flag's pole to a label above the row (a marker row
below `lg`), with one new slot, `handoffLabel`; and an intro line under the heading,
`process.lead`. The relay gains a third kind of run, the job going to you (5.11e). Discord is
unchanged. No new token, role, pose, prop or icon. Choices 69–80 (5.8).
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

## 5. Process (the one question: can I trust it with my customers?)

**2026-10-08:** the question was "How do they work?" until round 2. The reader is an owner who
knows AI only as ChatGPT and fears a job with no person in it; the section answers in this order:
your standards run it, anything sensitive or unusual comes to you, the rest is done and checked
before it goes out (5.11).

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
- **Two loops, one answer.** Under "can I trust it with my customers?" both loops are the
  "checked" half of the answer: the fix loop is inside a job (a check sends work back until it
  passes), the return is between jobs (the lesson goes into the standards). They sit on opposite
  sides of the row, top and bottom, so neither reads as the other. The hand-off to you (5.11) is
  the "a person decides" half. It sits on the top side with the fix loop, to its left, over step
  3; it leaves the row and never comes back, so it reads as a way out, not a loop.

### 5.1 Layout (the header above the flow at every width; no pinned title)

- Section frame (§0.1), `id="process"`. Inner: `{container} flex flex-col gap-14 border-t border-line py-section md:gap-20 lg:gap-24`.
- Header: `<div data-anim="reveal" class="flex max-w-250 flex-col gap-5 lg:gap-7">`: `SectionLabel`
  (`process.number`, `process.label`, `as="p"`), `SectionHeading size="heading"`, then the intro
  line `<p class="max-w-xl text-lead leading-normal text-muted">` = `process.lead` (5.11b). Shared
  voice; the same for every flow. The header's gaps stay on `lg` (2026-10-09).
- **`ProcessFlow`** (client): `<div data-anim="process-flow" data-set={set} data-count={n} data-loops={"on" | "off"} class="flex flex-col gap-8 wide:gap-24">`.
  A flow with loops takes `wide:gap-24` (96px), so the fix and hand-off labels, 76px above the
  list, keep 20px clear of the caption. A flow with no loops takes `wide:gap-12` (48px) and
  carries `data-loops="off"` (5.3b). It reads `useAboutPick()` → `pickSet` → `useShownSet` (§0.5)
  and draws `process.flows[set]`.
  1. **Meta:** `<div class="flex flex-col gap-3">` → `ShownForTag` (radio name
     `process-shown-for`), then the caption `<p data-anim="process-caption" class="{metaLabel}">`
     = `flows[set].caption` (decided, choice 32).
  2. **Body** (keyed by set, so a change remounts it): `<div class="relative isolate flex max-w-2xl flex-col wide:max-w-none wide:gap-10">`
     → `ProcessList`, then `ProcessReturn` (flows with loops only, 5.3b), then `ProcessRelay`.
     `isolate` keeps the relay layer's `z-1` inside the body, below the loop labels' `wide:z-10`.
     The hand-off lives inside step 3's `<li>` (5.11) and the fix loop inside step 4's (5.3a), so
     the body's children are unchanged. Below `wide` the rows stay capped at 672 (`max-w-2xl`),
     at 1024 and 1280 too.
- **Below `wide`: rows**, five or six. **From `wide`: all steps across on a ground line.** The
  classes that depend on the count are literal strings in `lib/processLayout.ts`:

| Count | List and return grid | Chevron | Return path box | Fix box (`fixBox`) |
|---|---|---|---|---|
| 5 | `wide:grid-cols-5 wide:gap-x-8` | `wide:-right-6` | `wide:col-start-2 wide:col-span-3 wide:ml-15.5 wide:-mr-24` | `wide:-right-24` |
| 6 | `wide:grid-cols-6 wide:gap-x-8` | `wide:-right-6` | `wide:col-start-2 wide:col-span-4 wide:ml-15.5 wide:-mr-24` | `wide:-right-24` |

- **2026-10-09:** both counts share the gap, the chevron, the return's right margin and `fixBox`;
  only the column count and the return box's span differ. `fixBox` is placed against the fix
  step's own column (step 4). The return box runs from step 2 to the last step. The hand-off needs
  no count-dependent class (its stem sits 110px into step 3's column at every count, 5.11c).
- **The tight spot: six across at 1440 (2026-10-09, the user's call; supersedes choice 28).**
  Content is 1328px; with the 32px gap a column is 195px, room for the 136px bot. The widest step
  title, "Your standards", sets on two lines; its longer line is about 200px and still clears the
  next title by about 25px (lead-checked at 1440). At 1280 the six-step flows ran "Your
  standards" into "Hard calls" in a 168px column. At 1024 it overflowed a 161px column. So every
  flow stacks below 1440. Five across at 1440 is 240px.
- **Without JavaScript:** the server markup is the `default` flow; the tag is hidden. Both loops
  and the hand-off are static markup, so they show without JavaScript.

### 5.2 List and step (`ProcessList`, `ProcessStep`)

- `ProcessList` (takes the flow's steps, bots, emblem, layout, step label, and the optional
  `fixLabel` and `handoffLabel`):
  `<div data-anim="process-list" class="relative">` → ground line `<div aria-hidden="true" data-anim="process-ground" class="absolute inset-x-0 top-27 hidden h-0.5 bg-line wide:block">`,
  then the ground-lit overlay (hidden), then `<ol class="relative grid {grid}">` of
  `ProcessStep`s. ~~Then `ProcessTrack`~~ (**removed 2026-10-05, later:** the track is superseded
  by the ledges, which live in each step, 5.9). The `<ol>` keeps `relative` (no `z-index`, so no
  stacking context; it was added for the track and is harmless now).
  It passes `ProcessHandoff` (5.11c) to the step at `HANDOFF_STEP` (index 2, step 3) only when it
  has a `handoffLabel`, and `ProcessFixReturn` (5.3a) to the step at `FIX_STEP` (index 3, step 4)
  only when it has a `fixLabel` (5.3b). Both go through `ProcessStep`'s `after`; they are never on
  the same step.
- `<li data-step={i}>`: `relative grid grid-cols-[5.5rem_minmax(0,1fr)] items-start gap-x-4.5 border-t border-line py-6 wide:flex wide:min-w-0 wide:flex-col wide:border-t-0 wide:py-0`
  (phone column 88px; the text column starts at x 106). `relative` at every width places the
  ledge, the hand-off and the phone fix line against the row (choice 60). No `z-index`, so no
  stacking context.
  1. `ProcessBot` (5.6), role and pose from `lib/processFlows.ts` (5.10). Step 1's bot (`intake`)
     gets `ProcessEmblem` as its child: the job, in its hand. Then `ProcessLedge` (5.9), the ledge
     the bot stands on, below `wide` only.
  2. Every step but the last, the chevron to the next step, centred in the gap on the ground line:
     `<span aria-hidden="true" data-anim="process-chevron" class="absolute top-27 hidden h-0.5 w-4 items-center justify-center bg-bg wide:flex {chevron}">`
     holding `ChevronRightIcon` `size-6 shrink-0 text-accent` (glyph 6×12, 2px stroke). The `bg-bg` box masks the line behind it.
  3. Text column `<div data-anim="reveal" class="flex flex-col gap-2 wide:gap-2.5 wide:pt-7.5">`:
     label `<p class="{metaLabel} uppercase tracking-[0.06em]">` = `process.stepLabel` + two-digit number (`01`–`06`);
     title `<h3 class="font-display text-step leading-[1.15] text-balance wrap-break-word text-text">`
     (Acosta has one weight, so no weight, tracking or width class; 2026-10-07);
     line `<p class="text-body-lg leading-normal text-muted wide:max-w-65">`.
  4. `ProcessStep`'s optional prop `after` (a `ReactNode`, rendered as the `<li>`'s last child)
     carries `ProcessHandoff` on step 3 and `ProcessFixReturn` on step 4. `children` stays the
     bot's hand.
- **Feet on the ground line (from `wide`):** the bot's feet (the body's lowest points, viewBox y 92) are
  the viewBox's **bottom edge** (−18 + 110 = 92), so the box bottom is the feet. `wide:mt-5` (20px)
  puts the 88px box's bottom at 108, the ground line's top (`top-27`); the 2px line sits right under
  the feet. The text column's `wide:pt-7.5` is unchanged. **Below `wide`** the same holds on each
  bot's ledge: the 57px box's bottom, 81 under the row's padding top, is the ledge's top (5.9).
- **States:** nothing in the list is interactive or focusable; no hover, focus-visible or active
  states. The only control in §5 is the tag (§0.6).

### 5.3 The return (`ProcessReturn`)

- Wrapper `<div data-anim="process-return-row" class="flex items-center gap-3 border-t border-line pt-6 wide:grid {grid} wide:border-t-0 wide:pt-0">`
  (the list's own column grid, so the path lines up with the bots).
- Below `wide`: `CornerUpLeftIcon` `size-5 shrink-0 text-accent wide:hidden` (`aria-hidden` via `Icon`), then the label.
- From `wide`: the path box `<div data-anim="process-return" class="contents wide:relative {box} wide:block wide:h-14 wide:rounded-b-2xl wide:border-2 wide:border-t-0 wide:border-dashed wide:border-accent">`.
  **It runs from the last bot back to step 2, "Your standards"** (decided, choice 29): the lesson
  goes into the standards, which is what the facts say. Its left and right borders are centred at
  x 63 in step 2's and the last step's columns (62px in, and one gap + 64px past the column before
  last). Inside: `ChevronUpIcon` `absolute -left-3.25 -top-2.5 hidden size-6 text-accent wide:block`
  (the arrowhead on step 2's end, and the box's first child), then the label, then the return-lit
  overlay (hidden, last child). `contents` below `wide` lets the label sit in the phone row.
- Label `<p class="{monoLabel} wide:absolute wide:inset-x-0 wide:z-10 wide:bottom-0 wide:translate-y-[calc(50%+1px)] wide:text-center">`
  with `<span class="wide:bg-bg wide:px-5 wide:py-3">` = `flows[set].loopLabel`. Real text, never `aria-hidden`; one element at every width.
- **Sizing note (2026-10-09):** the current labels run to 35 characters ("Each order improves your
  standards.", 13px mono ≈ 273px): one line at 360 beside the 20px icon (≈ 305 of 320), centred
  on the path from `wide`.
- Dash rhythm is the browser's CSS `dashed` (about 6/6 at 2px).
- Not rendered at all for a flow with no loops (5.3b); the component itself is unchanged.
- **Unchanged by round 2 (2026-10-08).** In five-step flows the last bot is now `check` (step 5),
  so the lesson leaves the check; in six-step flows it leaves `remind` or `ship`, as before.

### 5.3a The fix loop (`ProcessFixReturn`; decision B, 2026-10-03; step 5 → step 4 since round 2)

The agent loop inside a job: when the second check finds a problem or a broken rule, the work goes
back to the agent that did it and is checked again until it passes (facts → How the user works).
**Since round 2 (2026-10-08) it runs from step 5 back to step 4** (`FIX_STEP = 3`, zero-based, in
`lib/processFlows.ts`; `team` is step 4 and `check` step 5 in every flow with loops). It was step
4 → 3 (`FIX_STEP = 2`) before; every class, size and route was placed against the fix step's own
`<li>` and the next row, so the move changed no class. One file,
`components/home/process/ProcessFixReturn.tsx`, props `fixBox` and `label`; rendered as the last
child of step 4's `<li>`. Not rendered for Discord (5.3b).

```
div data-anim="process-fix-row" class="col-span-2 mt-5 pl-4 wide:contents"
├ div aria-hidden="true" data-anim="process-fix-line" class="absolute -bottom-15.75 left-0 top-15 w-2.5 rounded-l-2xl border-2 border-r-0 border-dotted border-accent wide:hidden"   (below wide: bot 5 back up to bot 4)
│ ├ ChevronRightIcon className="absolute -left-1.25 -top-3.25 size-6 text-accent"   (arrowhead onto bot 4's left hand)
│ └ span data-anim="process-fix-line-lit" class="pointer-events-none absolute -inset-y-0.5 -left-0.5 right-0 rounded-l-2xl border-2 border-r-0 border-accent opacity-0"
└ div data-anim="process-fix" class="contents wide:absolute wide:-top-12 wide:left-15.5 {fixBox} wide:block wide:h-10 wide:rounded-t-2xl wide:border-2 wide:border-b-0 wide:border-dashed wide:border-accent"
  ├ ChevronUpIcon className="absolute -bottom-2.5 -left-3.25 hidden size-6 rotate-180 text-accent wide:block"   (arrowhead on step 4's end)
  ├ p class="{monoLabel} wide:absolute wide:bottom-full wide:left-1/2 wide:z-10 wide:mb-2 wide:-translate-x-1/2 wide:whitespace-nowrap wide:text-center"
  │   → span class="wide:bg-bg wide:px-3"                                        ← flows[set].fixLabel
  └ span aria-hidden="true" data-anim="process-fix-lit" class="pointer-events-none absolute -inset-x-0.5 -top-0.5 bottom-0.5 hidden rounded-t-2xl border-2 border-b-0 border-accent opacity-0 wide:block"
```

**2026-10-05, later:** the row was `col-span-2 mt-5 flex items-center gap-3 bg-bg lg:contents`
with `CornerUpLeftIcon` first. The icon goes (the user's decision); `flex items-center gap-3` go
with it (one flow child is left); `bg-bg` goes with the track it masked; `pl-4` and
`process-fix-line` are new. `process-fix` and everything inside it are unchanged.

- **From `wide`: an arch over the gap between bots 4 and 5,** the bottom return turned upside
  down. Its legs are centred at x 63 of step 4's and step 5's columns (`wide:left-15.5` = 62px in;
  the right edge one gap + 64px past step 4's column, from `fixBox`), 40px tall, radius 16, its
  open bottom 8px above the list's top (`-top-12` with `h-10`). The arrowhead points down onto
  step 4's bot. The label sits centred **above** the arch (8px over it, one line), not on its top
  edge: at six across on 1440 the arch is 229px wide, narrower than the current 32-character
  label (≈ 250), so a label on the edge would cover the arch's corners (choice 37).
- **Clearance.** Above: the label's top is 76px above the list; the flow's `wide:gap-24` leaves
  20px to the caption, and the tag pushes everything down in the flow when open, so nothing
  overlaps at any width. The label's right end is about 188px from the list's right edge at 1440
  with five steps (about 346px with six), so `whitespace-nowrap` never reaches the container's
  side. The hand-off label sits to its left at the same height (5.11d gives the gap between them).
  Below: the arrowhead's tip is about 4px above the list; step 4's bot (`team`) has its hat ridge
  26px below the list top at rest and 6px below at the top of a hover jump (14px up), so even a
  jump stays clear. Step 5's leg ends over the `check` bot's head (body top 22px down; its lens is
  off to the right). The arch never touches a step's text, which is under the bots.
- **Below `wide` (the user's decision, 2026-10-05, later; choice 54): a dotted line from bot 5
  back up to bot 4.** The arch on its side: `process-fix-line`, a 2px dotted `accent` bracket open
  to the right, down the bot column's left edge (x 0–10 of the list). Its top end is at bot 4's
  left hand (`top-15`: the end's centre 61 under step 4's padding top = the row's 24 + the arm's
  centre, viewBox y 53, 36.75 into the 57px bot); its bottom end at bot 5's (`-bottom-15.75`:
  centre 62 past step 4's end = bot 5's 1px hairline + 24 + 36.75). Radius `rounded-l-2xl` clamps
  to the 10px width, so each end is a quarter turn into a hand. `ChevronRightIcon` (glyph 6 × 12)
  on the top end points at bot 4's hand, its tip at x 12, 1.5px clear of the hand (x 13.5). **It
  ends at bot 5's hand and never runs below bot 5** (the user's red X): its lowest point is 19px
  above bot 5's feet and ledge.
- **The label beside it, between steps 4 and 5.** The row keeps its place (`col-span-2 mt-5`,
  20 under step 4's text, the `<li>`'s `pb-6` below) and its hook. `pl-4` starts the label at
  x 16, 14px right of the line. Its line is ≈ 20 tall. `pl-4` draws nothing from `wide`, where the
  row is `contents`.
- **Room at 360:** the line, its turns and the arrowhead take x 0–12 of the bot column; the
  `team` and `check` hands start at x 13.5 and the bodies at 18.6, so at rest nothing touches.
  A lean (up to 3px past the column's left edge, 5.6) passes bot 4's hand under the arrowhead for
  a moment; accepted, transient. The current labels (up to 32 characters, "Below your standard?
  Done again.", 13px mono ≈ 250px) end near x 266 of the 320px list: **one line at 360**; a longer
  label wraps (nothing is `nowrap` below `wide`). Only the arrowhead's empty 24px icon box reaches
  3px past the list's left edge, into the gutter: no sideways scroll. On a fix run the job rides
  the line, its left edge 13px from the viewport at 360 (7–8px into the gutter), for a moment:
  still no sideways scroll (5.9 The fix rise).
- **Where it meets the rest.** It crosses step 5's hairline at x 0–2; the hairline (step 5's
  `<li>`, later in paint order) draws over it, uncut: one dot's worth of `line` (choice 59). It
  never meets a ledge (ledges start at x 18) or step text (x 106). It lives in step 4's `<li>`
  (`relative`, 5.2) and reaches 63px past its end into step 5's row; it is absolute, so neither
  row's height changes.
- **One label element at every width,** real text, never `aria-hidden`; a screen reader meets it
  inside step 4, after its line and before step 5. The arch, the dotted line, both arrowheads and
  both lit overlays are decoration (`aria-hidden`).
- **With the relay and the bots.** The label carries `wide:z-10` and its span `wide:bg-bg`, as
  the bottom label does (2026-09-28 decision), and the job hopping back hangs inside the arch, its
  top 4px under the arch's top edge at the peak, so it never reaches the label above. Never
  animate `transform` or `opacity` on step 4's `<li>` or on `process-fix`: either would start a
  stacking context and trap the label's `z-10`. The built relay writes neither (it reads
  `process-fix` for its place only). The `reveal` sits on the text column, not the `<li>`, so it
  is safe. `process-fix-lit` is the lit overlay: shown by `clip-path`, as `process-return-lit`
  is, and faded out by `opacity`. The relay layer is measured from `process-list` and
  `process-return`; the fix hop is measured from `process-fix`. **Below `wide` the same rule:**
  motion writes `process-fix-line-lit` only (`clip-path`, `opacity`), never `process-fix-line` or
  `process-fix-row`. The built relay reads `process-fix-row` for its presence (a flow with a fix
  loop), so the hook stays.
- **Motion (built; `lib/processRelayFix.ts`, `lib/processRelayPlan.ts`, `lib/processRelayFixLine.ts`):**
  on the fix run of the run cycle (`RUN_CYCLE = send, straight, fix`, 5.11e; it replaced
  `FIX_EVERY = 2` in round 2) of a flow with loops, the check finds something. Bot 5's scan stops
  short and it plays its "found it" eye pop (1.3s into a 1.7s stop); the job shakes its "no" (the
  default sheet drops what step 4 built); then the job arcs back over the arch to step 4 in 0.8s,
  peaking 4px under the arch's top edge, while `process-fix-lit` lights right to left behind it by
  `clip-path`. Step 4 redoes its act (2s), the job hops forward again (0.7s) as the light fades
  (0.6s), and bot 5 passes it (lens flicker). A fix run is 5.2s longer from `wide` (5.5s below
  it, where the way back is longer). The fix arrowhead does not pulse. **Below `wide` (the fix
  line route, choice 66):** the job goes back along the dotted line. It leaves ledge 5 heading
  left, rises at 45° to the line's bottom end at bot 5's hand, rounds the bottom turn, climbs the
  line, rounds the top turn through the arrowhead's tip (x 12) into bot 4's hand, drops at 45°
  onto ledge 4 and slides to its stop, in `FIX_LINE_HOP` (1.1s, `power1.inOut`). Behind it
  `process-fix-line-lit` lights from the line's bottom end up to the job by `clip-path`, fully lit
  once the job is past the arrowhead. The line stays lit while step 4 redoes its act and fades
  over `FIX_LIT_FADE` (0.6s) as the job hops forward; ledge 4 lights on the landing as any ledge
  does (5.9 The fix rise). Reduced: nothing moves, nothing lights. Trigger: the relay's clock (5.7).
- **What the label says:** it names the work falling below the reader's standard, in the
  reader's words, as what happens to their customer's job (2026-10-08 meaning; 2026-10-09 wording
  in `content/home.ts`, 5.5). The check step needs no new drawing: its bot already stands in `act`
  with the lens, and the arch's leg lands on it.

### 5.3b A flow with no loops (Discord; the user's decision, 2026-10-04)

A Discord bot isn't a job run through checks: it stays in the server and answers when a member
mentions it. So its flow has no "Second check" step, no loop and no hand-off. It answers the
section's question through its own control step, "Your tone" (choice 72).

**2026-10-08:** Discord's flow is unchanged by round 2 (choice 72): no check, no loops and no
hand-off; under `data-loops="off"` the four `process-handoff*` hooks are absent too. The shared
heading must still hold for it (choice 75).

- **Data-driven; no component names `discord`.**
  - Content: `process.flows.discord` has **no `loopLabel`, no `fixLabel` and no `handoffLabel`**
    (the keys are removed, never left empty). The other four flows have all three.
  - `lib/processFlows.ts`: `hasLoops: { readonly [S in AboutSet]: boolean }` (`discord: false`,
    the rest `true`), tied to the content's type as `flowRoles` is: `true` needs all three labels
    in `process.flows[S]`, `false` needs none, so a label deleted by mistake still fails `tsc`.
    `flowLoops(set)`: `{ loopLabel, fixLabel, handoffLabel }`, or `null` where `hasLoops[set]` is
    `false`. `FIX_STEP = 3`, `HANDOFF_STEP = 2` (5.10).
  - `ProcessFlow`: `loops = flowLoops(set)`. With loops: `wide:gap-24`, `data-loops="on"`,
    `ProcessReturn` rendered, `fixLabel={loops.fixLabel}`, `handoffLabel={loops.handoffLabel}`.
    Without: `wide:gap-12`, `data-loops="off"`, no `ProcessReturn`, no labels. `ProcessList`'s
    labels are optional and a step gets its `after` only when its label is there.
  - Unchanged: `ProcessStep`, `ProcessReturn`, `ProcessFixReturn`, `ProcessHandoff`,
    `ProcessRelay`, `ProcessBot`, `ProcessEmblem` and `lib/processLayout.ts` (`flowLayouts[5]`;
    its `returnBox` and `fixBox` simply go unused).
- **What drops out, at every width:** the hand-off whole (5.11c), the fix loop whole
  (`process-fix-row`, `process-fix`, its arrowhead, label and `process-fix-lit`; below `wide` also
  `process-fix-line` and `process-fix-line-lit`) and the return whole (`process-return-row`,
  `process-return`, its arrowhead, label and `process-return-lit`). From `wide` the 96px caption
  gap the labels needed goes back to 48px. Below `wide` step 3's hand-off row, step 4's fix row
  and the return row go.
- **What stays:** the tag, the caption, five steps, the `bubble` emblem in step 1's hand, and from
  `wide` the ground line with its four chevrons. All five bots stand in `idle` (5.10).
  ~~**2026-10-05:** below `lg` the track (5.9) is drawn here as in every flow.~~
  **2026-10-05, later:** below `wide` each of the five bots stands on its ledge (5.9), as in every
  flow; there is no fix line.
- **From `wide`:** five across (`wide:grid-cols-5 wide:gap-x-8`), bot tops 68px under the caption
  (48 + `wide:mt-5`). The list is the body's only in-flow child (`ProcessRelay` is absolute), so
  the body's `wide:gap-10` adds nothing and the flow ends at the tallest step's text.
- **Below `wide`:** five rows, each under its hairline; the list ends on step 5's `py-6`, with no
  closing hairline (open choice 43).
- **States and reading order:** nothing interactive. The `<ol>` reads five steps and no loop text.
- **Swap:** this flow is shorter than a looped one; the tag keeps its place (`lib/holdInView.ts`, §0.5).

Desktop below 1440 (1024, 1280) is stacked, as the tablet column.

| Element (Discord) | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Layout | tag, caption, 5 rows (content 320) | same, rows capped at 672 | 5 × 240 (gap 32) | 5 × 282 |
| Caption → steps gap | 32 | 32 | 48 (looped flows 96) | 48 |
| Row / column height | ≈ 160 a row, 5 rows ≈ 800 (no hand-off or fix row) | ≈ 140 a row, ≈ 700 | ≈ 300 | ≈ 290 |
| Fix loop: arch, arrowhead, label, row, dotted line | none | none | none | none |
| Return: path, arrowhead, label, phone row and its hairline | none | none | none | none |
| Hand-off: stem, arrowhead, label, phone marker row | none | none | none | none |
| Ledges (5.9) | 5, each 2 × 70 under its bot | same | none | none |
| Under the last step | 24 (`py-6`), then the section's padding | same | 0: the list's bottom is the flow's bottom | same |
| Flow height against a five-step looped flow | ≈ 130 shorter | ≈ 130 shorter | 144 shorter (48 gap, 40 body gap, 56 path) | same |
| Widest bot part | `update`'s wrench jaw, 1.5px past its 88 box, into the 18px gap | same | 2.3px past its 136 box, into the 32px gap; step 5 (`host`) has nothing past its arm | same |

- **Motion, the bots:** no wiring of its own. `update` and `host` already pass `isRole` and have
  their pivots, per-role values and acts, so the built layers run on all five bots (5.7 table).
- **Motion, the relay (built 2026-10-04):** a one-way pass, 11.8s. The job (the `bubble`) leaves
  step 1's hand and hops step 1 → 5 along the ground line (ledge to ledge down the bot column
  below `wide`, 5.9), pops and fades at the line's end (on step 5's ledge below `wide`, its light
  with it). No lesson, no return ride, no arrowhead pulse, no fix hop, no send: under
  `[data-loops="off"]` the fix, return and hand-off hooks don't exist, and the motion code takes
  their absence as "skip", never as an error (`relayParts` and `columnParts` return the run's
  parts with the return and the fix left out, so the run still starts). `process-lesson` stays
  in the hidden relay layer, unused. Every Discord run is a straight run: the run cycle skips the
  send run where there is no `flag` at step 3 and the fix run where there is no fix loop (5.11e).
  Trigger: the relay's clock.

### 5.4 Sizes

Desktop below 1440 (1024, 1280) is stacked: it takes the tablet column, rows capped at 672.

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Layout | header, tag, then 5 or 6 rows (content 320) | same, rows capped at 672 | 5 × 240 · 6 × 195 (gap 32) | 5 × 282 · 6 × 229 (container 1536, gap 32) |
| Heading (`text-heading`, Acosta) | 30px | 43px | 64px | 72px |
| Lead (`text-lead`, `max-w-xl`) | 17px / 1.5, 20 under the heading, full 320 width | 17px, max 576 | same, 28 under the heading (`lg:gap-7`) | same |
| "Shown for" tag | 44 tall (§0.6) | same | same | same |
| Caption (`metaLabel`) | 12px, 12 under the tag | same | same | same |
| Caption → steps gap | 32 | 32 | 96 (`wide:gap-24`) | 96 |
| Bot (box 170:110) | 88×57 (`w-22 h-14.25`) | 88×57 | 136×88 (`wide:w-34 wide:h-22`), top 20, feet at 108 | 136×88 |
| Emblem in step 1's hand (24 units) | 12px | 12px | 19px | 19px |
| Flag (pennant 24 × 16 units) | 12×8, pole 27 tall | same | 19×13, pole 42 tall | same |
| Step label (`metaLabel`) | 12px | 12px | 12px | 12px |
| Step title (`text-step`, leading 1.15) | 24px, text col 214 | 24px | 24px; "Your standards" on two lines, its longer line ≈ 200, ≥ 25 clear of the next title at six across | 24px |
| Step line (`text-body-lg`) | 16px / 1.5, no cap | same | 16px, max 260 (`wide:max-w-65`) | same |
| Row / column height | ≈ 160 a row (step 3 ≈ 200 with its hand-off row, step 4 ≈ 205 with its fix row); 5 rows ≈ 890, 6 ≈ 1050 | ≈ 140 a row (steps 3 and 4 ≈ 180–185); 5 rows ≈ 790, 6 ≈ 930 | ≈ 300 | ≈ 290 |
| Ground line | none (hairline row dividers) | none | 2px `line`, full width, y 108 | same |
| Ledge (`process-ledge`, 5.9) | 2 × 70 `line` under each bot, x 18–88 of the row, its top on the feet (81 under the row's padding top) | same | none (`wide:hidden`) | none |
| Ledge lit (`process-ledge-lit`) | the ledge's box, `accent` from nothing at the left to full at the right; hidden at rest | same | none | none |
| Chevrons | none | none | one in each gap (4 or 5), on the line (`wide:-right-6`) | same |
| Return path | 20px icon + label row, hairline above | same | dashed 2px `accent`, 56 tall, radius 16; 5: x 335 → 1151 · 6: 290 → 1196 | 5: 377 → 1317 · 6: 324 → 1370 |
| Loop label (`monoLabel`) | 13px, left; up to 35 characters ≈ 273, one line (≈ 305 of 320 with the icon) | same | 13px, centred on the path | same |
| Hand-off | 5.11d | 5.11d | 5.11d | 5.11d |
| Fix loop (over steps 4–5) | dotted 2px `accent` line, x 0–10, from bot 4's hand (61 into step 4) to bot 5's (62 past step 4's end): ≈ 207 tall; ends turned, radius 10 | same; ≈ 187 tall | dashed 2px `accent` arch, 40 tall, radius 16, open bottom 8 above the list; 5: x 878 → 1152 · 6: 742 → 971 | 5: 1003 → 1319 · 6: 846 → 1109 |
| Fix label (`monoLabel`) | 13px, from x 16, 20 under step 4's text; up to 32 characters ≈ 250, one line at 360 (of the 304 left), wraps if longer | same | 13px, one line, centred 8 over the arch, ≈ 250 wide | same |
| Fix arrowhead | `ChevronRightIcon` 24 box, glyph 6 × 12, tip at x 12, 1.5 clear of bot 4's hand | same | 24px icon (glyph 12 × 6), tip ≈ 4 above the list, over step 4's bot centre | same |

This table is the four flows with loops; Discord's differences are the table in 5.3b.

**2026-10-09:** brought in line with the build: four columns, the `wide` layout, the fix loop over
steps 4–5 (it was in 5.11d only), and the heading and title sizes after the 2026-10-07 font
change. The 9-character title-word rule (set for the old face and the 144px column at six across
1024) is retired: a new title's longest line is judged on screen at six across 1440 (195px
column). That is a sizing note, not a limit.

136px holds at 4K on purpose: the container caps at 1536 and the step title is a fixed 24px, so a
bigger bot would outgrow its title. `wrap-break-word` is the guard if a word outgrows its column.
Nothing scrolls sideways: the widest bot part is the flag's pennant at x 134, inside the bot's
box. The fix label is centred over the arch from `wide` and wraps below it. The ledges and the
phone fix line sit inside the 88px bot column (only the fix arrowhead's empty icon box reaches 3px
into the gutter at rest; on a fix run the job rides the line 7–8px into it for a moment, 5.9).

### 5.5 Content slots (`content/home.ts → process`)

`<set>` is `default`, `service-business`, `online-store`, `discord` or `software-builder`
(`website` was removed 2026-10-07). `default` is in the shared voice; each card's flow is in its
tone. Flows are illustrations (constitution §7.5); how the user works, as a flow shows it, must
still be in `docs/03-facts.md` → How the user works.

**2026-10-08, round 2 (copywriter writes every line; the step meanings in the new order are in
5.10).** Changed or new slots:

| Key | Meaning (round 2) |
|---|---|
| `process.label` | Unchanged key. The section label; copywriter may align it with the new question (it is not a nav link) |
| `process.heading.lead` / `.accent` | **Rewritten.** Answers "can I trust it with my customers?" in the reader's words: they stay in charge (their standards run the work; the sensitive or unusual comes to them). The reader, not "AI agents", is the subject (voice rules 15–16). Shared voice; must hold for every flow, Discord included (choice 75). Two lines at 360, 768, 1440 and 3840 in `text-heading` (a sizing note) |
| `process.lead` (**new**) | One plain line under the heading, the skim answer: routine jobs are done to their standards and checked before they go out; anything sensitive or unusual (such as refunds and complaints) is passed to them instead. Shared voice. About 3–4 lines at 360, 1–2 from `lg` at `max-w-xl` (a sizing note) |
| `process.flows.<set>.steps[i]` (4 flows with loops) | **Reordered and rewritten** to 5.10's order and meanings. Default, service-business and online-store in plain words ("show the job done, not the chat", rule 15); software-builder in the peer tone |
| `process.flows.<set>.handoffLabel` (**new**; absent on `discord`) | The end of the way out above step 3: who the job goes to, in the card's tone (you; you or your staff; a person). Short: the step's own line says what is sent. One line at 360 (sizing note; widths in 5.11d) |
| `process.flows.<set>.fixLabel` | Key and meaning unchanged (inside a job: the work is done again and checked again until it passes); now between steps 4 and 5. Words in the reader's terms, not the build pipeline's (5.3a) |
| `process.flows.<set>.loopLabel` | Key and meaning unchanged |

**2026-10-09: "rules" is "standards" (the user's call; landed in `content/home.ts`).** The copy as
it stands, for sizing only (copywriter owns it; the spec names slots):

| Slot | `default` | `service-business` | `online-store` | `software-builder` |
|---|---|---|---|---|
| `steps[1].title` | Your standards | Your standards | Your standards | Your standards |
| `fixLabel` | Below your standard? Done again. | Below your standard? Redone. | Below your standard? Rewritten. | Below standard? Rebuild. |
| `loopLabel` | Each job improves your standards. | Each job improves your standards. | Each order improves your standards. | Next build, better standards. |
| `handoffLabel` | To you | To you or your staff | To you | To a person |

Discord keeps "Your tone" at step 2 and has none of the three labels. The `rules` bot role keeps
its code name.

Needs a fact before it ships: "sensitive actions (refunds, complaints) go to a person" is the
user's 2026-10-08 decision; copywriter adds it to `docs/03-facts.md` → How the user works with the
user's permission. Refunds are already backed for the online store ("Taking returns and refund
requests and passing them to a person"); complaints are not, until that line is in. Nothing in a
flow may say the owner sees or approves every reply: that is not in the facts (choice 78).
**2026-10-09:** the facts gained "Sensitive actions, like refunds and complaints, are passed to a
person instead of being handled by an agent" (page doc).

| Key | Meaning | Limit |
|---|---|---|
| `process.number` / `process.label` | "02" and the section label; shared | 5 words |
| `process.heading.lead` / `.accent` | The heading; `accent` is its last words, in violet. Must hold for every flow | 6 words in total |
| `process.stepLabel` | "Step" before each two-digit number | 1 word |
| `process.flows.<set>.caption` | Names the sample job this flow follows, and that it is an example | 5 words / 32 characters |
| `process.flows.<set>.steps[0–4 or 0–5].title` | The step's name, as listed in 5.10 | 2 words / 16 characters |
| `process.flows.<set>.steps[i].line` | One short line on what happens at that step; facts level only (no agent names, tools or counts) | 10 words |
| `process.flows.<set>.loopLabel` (**absent on `discord`**) | Between jobs: what the job taught goes back into the standards, so the next job starts from better standards. Meaning unchanged by decision B and by the 2026-10-09 wording | 5 words / 26 characters (current labels run to 35; they fit, 5.3) |
| `process.flows.<set>.fixLabel` (decision B; **absent on `discord`**) | Inside a job: work below the reader's standard is sent back to the agent that did it, checked again until it passes. In the card's tone. No counts | 5 words / 26 characters (current labels run to 32; they fit, 5.3a) |

The "Limit" column is a sizing note from when the layout was drawn, not a rule (`docs/04-voice.md`
→ Length, 2026-10-05).

The old `process.steps[0–3]` and `process.loopLabel` are replaced by `process.flows`. The relay
adds no text and no slots; neither did the phone track (2026-10-05), and neither do the ledges or
the phone fix line. `loopLabel`, `fixLabel` and `handoffLabel` are required on the four flows with
loops and must be absent on `discord`; `hasLoops` (5.3b) makes either mistake fail `tsc`.

**Discord's slots (2026-10-04), in the Discord tone** (`docs/04-voice.md`). The limits above
hold. Each line needs its fact in `docs/03-facts.md` → For a Discord server; none ships before
its fact is in. No validation, check, "rules" or "standards" wording.

| Key | Working title (the copywriter's wording) | Meaning |
|---|---|---|
| `process.flows.discord.caption` | | The sample is a mention of the bot, and it is an example |
| `process.flows.discord.steps[0]` | Mentioned | A member @-mentions the bot in a channel |
| `process.flows.discord.steps[1]` | Your tone | It replies in the tone the owner set |
| `process.flows.discord.steps[2]` | Remembers | Optional: past chats make the reply personal. The line says it is optional |
| `process.flows.discord.steps[3]` | Connected | It pulls from or posts to the server's business tools and other apps |
| `process.flows.discord.steps[4]` | Always on | It stays in the server around the clock |

### 5.6 The bot (`ProcessBot`, data in `lib/processBots.ts`)

**2026-10-08:** unchanged by round 2. No new role, pose, part, prop or pivot: the hand-off step
is the existing `flag` role in its `act` pose.

The body is the logo itself: the MW outline on a 100 grid, cut into three "/" strips with gap 8
(bands x + y = 36–76, 84–116, 124–164). Vector: **no `crispEdges`, no cells, no run-merging.**
**2026-09-27:** one rig per bot; the W's two bottom points are cut off as separate feet. The
four `data-frame` groups and the `data-breath` groups are **superseded 2026-09-27**.
**2026-10-03:** four roles are added (`intake`, `flag`, `remind`, `ship`; table below). Roles in
use by the flows: `intake`, `rules`, `team`, `check`, `remind`, `flag`, `ship`. ~~`update` is in no
flow; its drawing stays, unused (decided, choice 30). `host` is Rix.~~ **2026-10-04:** Discord's
flow also uses `update` (step 3) and `host` (step 5), both as drawn below, with no new part
(5.10). `host` is also Rix.

- **Markup (one SVG, one rig).** The SVG element:
  `<svg viewBox="-30 -18 170 110" aria-hidden="true" focusable="false" data-anim="process-bot" data-role={role} data-pose={pose} class="shrink-0 overflow-visible h-14.25 w-22 wide:mt-5 wide:h-22 wide:w-34">`
  (Process' size; About's Rix passes its own size classes).
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
(2.3px into the gap at 136 wide, as before); sparks to x 154 with fly-out (11px from `wide`, 7px
below it, inside the 32px gap and the 18px phone gap); a jump lifts the team ridge to about y −35
(14px above the box from `wide`, 9px below it, inside the 20px top margin and the phone row's 24px
padding; from `wide` it stays about 10px under the fix arch's arrowhead, 5.3a); zzz rise to
y −28; the entrance starts 60 units up (48px, faded, transient). Squash
and lean reach x ≈ −36 on the left (5px from `wide`, 3px below it, into the gutter). The flag
rides the right arm's drift (±3° about the shoulder), which sways the pennant's far corner about 3
units, to x ≈ 137, inside the viewBox (140). **In its act (built 2026-10-04)** the flag dips to
30° before the raise, and the pennant's far corner reaches x 154: 11px past the box from `wide`
(inside the 32px gap) and 7px below it (inside the 18px gap), transient. The bell's swing
(x 99–137) and the arrow's thrust (tip at x 131, y 14) stay inside the box. No sideways scroll at
360. **2026-10-08:** the flag bot stands at step 3, under the hand-off stem (5.11c): the pole's
top is 38px under the list's top at rest, the stem's bottom end 16px under it, so 22px apart at
rest and about 8px at the top of a hover jump (14px up).

### 5.7 Components, images, motion

- **Components (`components/home/process/`):** `ProcessSection.tsx` (server: frame, header with
  `process.lead`, `ProcessFlow`, `ProcessAllFlows`, `ProcessMotion`), `ProcessFlow.tsx` (client:
  the pick, the tag, the caption and the keyed body; reads `flowLoops(set)`, sets `data-loops`,
  picks `wide:gap-24` or `wide:gap-12`, renders `ProcessReturn` only with loops, and passes
  `fixLabel`, `handoffLabel` and the layout to `ProcessList`), `ProcessList.tsx` (renders
  `ProcessHandoff` into step `HANDOFF_STEP`'s `after` and `ProcessFixReturn` into step
  `FIX_STEP`'s; both labels optional), `ProcessStep.tsx` (optional `after` prop, the `<li>`'s
  last child), `ProcessReturn.tsx`, `ProcessFixReturn.tsx` (5.3a), `ProcessHandoff.tsx` (5.11c),
  `ProcessLedge.tsx` (server, no props: the ledge and its lit overlay, choice 61),
  `ProcessRelay.tsx`, `ProcessJob.tsx` (each takes props and reads no content itself),
  `ProcessBot.tsx`, `ProcessEmblem.tsx` (the `g data-bot="prop"` in step 1's hand),
  `ProcessLesson.tsx`, `ProcessAllFlows.tsx` (the hidden all-flows list for crawlers, outside
  `ProcessFlow`). Shared: `components/home/pick/ShownForTag.tsx` (§0.6). Icons reused:
  `ChevronUpIcon` (the return's and the stem's arrowheads, rotated for the fix arrowhead),
  `ChevronRightIcon` (chevrons and the phone fix arrowhead), `CornerUpLeftIcon` (the return row),
  `ArrowRightIcon` (the phone hand-off marker). **Images:** none.
  ~~**2026-10-05 (5.9):** new `ProcessTrack.tsx`~~ (deleted 2026-10-05, later, with the track).
  **2026-10-09:** no component added or removed. Every flow class moved from `lg:` (and `xl:`) to
  `wide:` in `ProcessFlow`, `ProcessList`, `ProcessStep`, `ProcessReturn`, `ProcessFixReturn`,
  `ProcessHandoff`, `ProcessLedge`, `ProcessBot` (Process' size), `ProcessRelay` and `ProcessJob`.
  `ProcessSection`'s header keeps `lg:`.
- **Logic:** `lib/processBots.ts`, `lib/processFlows.ts` (each set's roles and poses, 5.10; each
  list's type tied to `process.flows[set].steps`; `FIX_STEP = 3`, `HANDOFF_STEP = 2`, `hasLoops`,
  `flowLoops(set)` with `loopLabel`, `fixLabel` and `handoffLabel`), `lib/processLayout.ts` (the
  5.1 class strings; `FlowLayout` = `grid`, `chevron`, `returnBox`, `fixBox`; one gap for both
  counts since 2026-10-09), `lib/processEmblems.ts` (the default job sheet's parts, and the set →
  emblem lookup over `lib/rixProps.ts`), `lib/processRelay.ts` (`relayQuery = "(min-width:
  90rem)"`, the `wide` breakpoint, since 2026-10-09), `hooks/useAboutPick.ts`,
  `hooks/useShownSet.ts` (§0.5). The relay's files: below.
- **The relay layer stays in the markup, hidden** (`ProcessRelay`, `opacity-0`, decorative), so the
  motion pass adds no elements. For `default` the job is the built sheet (`ProcessJob`, all
  `data-job` parts) and the ghosts its outline. For a card the job draws that card's emblem:
  `<svg data-anim="process-relay" data-emblem={name} viewBox="104 21 28 31" class="absolute left-0 top-0 -ml-2.25 -mt-5 h-5 w-4.5 overflow-visible opacity-0 wide:-ml-3.5 wide:-mt-7.75 wide:h-7.75 wide:w-7">`,
  base parts `data-job="base"`, marks `data-job="mark"`, and the base outline again as
  `data-job="glow"` (`fill-none stroke-accent opacity-0`). The three ghosts draw the emblem's base
  parts. The lesson card is unchanged.
- **Static state** (also without JavaScript and under reduced motion): every bot in its pose, the
  emblem held at step 1, both loops and the hand-off drawn with their labels (none on Discord,
  5.3b), nothing lit on the ground line, the return path, the fix arch or the stem. Below `wide`
  every bot stands on its ledge, unlit, and the dotted fix line and the hand-off marker are drawn,
  unlit (5.3a, 5.9, 5.11c).

**Motion, as built (the motion pass, 2026-10-04; round 2's send run, built by 2026-10-09).**
`ProcessMotion` calls `useScrollReveal` and `useProcessBots`; `ProcessFlow` calls
`hooks/useSwapFade.ts`. The bots' own layers run on five or six bots and on every role, and
the relay is on. The wiring:
1. `BotRole`, and `isRole` in `lib/processBotRig.ts`, accept `intake`, `flag`, `remind`, `ship`.
   (A bot whose role fails `isRole` is skipped and stands still, so this is what brings them in.)
2. `botPivots.tool` gains `flag` 108 53, `remind` 118 20, `ship` 118 50. `rigBot` skips the tool
   pivot for `intake`, as it does for `rules` and `host`.
3. The life tables in `lib/processBotMotion.ts` give the four roles `host`'s values:
   `BREATH_HALF` 1.3, `SWAY_DEG` 1.2, `SWAY_HALF` 3.0. The relay's tables give every role its
   own: `RELAY_DWELL` 1.3 for `intake` (its hand-off beat), 2.0 for `rules`, `team`, `check` and
   `update`, 1.3 for `flag` (its routine catch since round 2; was 1.8), 1.6 for `remind`, 1.2 for
   `ship` and `host`; `JOB_AT` 118 for `intake` (the hand), 126 for `update` and `flag`, 122 for
   the rest.
4. `acts` in `lib/processBotActs.ts` holds every role. `intake`, `flag`, `remind` and `ship` have
   their own acts (`lib/processBotFlowActs.ts`, on the shared moves in `lib/processBotMoves.ts`);
   `host` keeps the nod, timed to the job on a relay catch.
5. One flag, `RELAY_ON`, in `lib/processBotMotion.ts`: **`true` since 2026-10-04.** `fullMotion`
   builds `relayParts` (from `wide`, matched by `relayQuery`) or `columnParts` (below `wide`)
   only when it is true. Runs are paced by `RELAY_REST = 2`, the pause from one run's last tween
   to the next run's start, and cycle `RUN_CYCLE = send, straight, fix` (5.11e). The first run
   starts `RELAY_FIRST = 1.5`s after the last bot lands.
6. `useProcessBots(section, set)`: the shown set is a `useGSAP` dependency (with
   `revertOnUpdate`), so after a swap the hook lets go of the old bots and rigs the new ones.
   `entered` is already true by then, so they are shown at rest and life starts: no second drop.
   The relay starts again on its first-run delay, at the top of the cycle.

| Layer (number in `05-process-motion.md`; hooks) | State | Why, and what it needs |
|---|---|---|
| Reveals (`reveal`: header, step text) | **Keep** | No change. Text mounted by a swap is simply visible. The fix and hand-off labels are outside the text column, so they show without a reveal |
| 1 Life: breathing, sway, arm drift | **Keep**, every role | Wiring 1–3. The flag, bell and arrow sit in `arm-right`, so they sway with its drift; the held emblem sits in `upper`, as Rix's does |
| 2 Blinks | **Keep** | Works on any role |
| 3 Looks | **Keep** | Works on any role; `check` and `flag` rest at look 7 |
| 4 Foot taps | **Keep** | Works on any role |
| 5 Timed role acts (every 5–10s) | **Keep**: `rules`, `team` and `check` play their built acts; `intake`, `flag`, `remind` and `ship` play their own (below). **Discord:** `update` plays its built act (wrench ratchets, then the page flips and the mark is rewritten) and `host` the nod | Wiring 4. No timed act starts within 3.5s (`RELAY_CLEAR`) of the bot's next relay catch. `update` and `host` need no wiring: both are already rigged |
| 6 Naps | **Keep**: `rules`; on Discord also `update` (open choice 42). `host` never naps in Process: `startActs` schedules naps for `rules` and `update` only | No nap starts within 8.5s of the bot's next relay catch; a napping bot wakes on a catch |
| 7 Eyes and lean follow the pointer | **Keep** | Works on any role |
| 8 Hover or tap jump, then the short act | **Keep**; the new roles jump, then play their own short act | Wiring 4. Step 4's jump stays under the fix arch (5.3a); step 3's under the stem (5.6 Overflow); on Discord nothing is above the bots |
| 9 Drop-in entrance | **Keep**, once per page load, five or six bots 0.15s apart | Works on any count. After a swap: wiring 6. Step 4's bot falls past the arch, faded, for a moment; accepted (transient) |
| 11 Pausing off screen and in a hidden tab; teardown | **Keep** | `resetBot` as built; teardown also strips the relay's parts and shows the held emblem again |
| 12 Reduced motion: one fade-in, static poses | **Keep**, unchanged | Works on any count. No relay, nothing lit |
| 10 Crew relay: the job (`process-relay`), ghosts, `process-ground-lit`, chevron pulses, the lesson (`process-lesson`), `process-return-lit`, the return arrowhead's pulse, the catches and watches, `receive`, `holdLesson` | **On: rebuilt 2026-10-04** | Wiring 5. Five or six stops at every width; detail below. The four-step spec is `05-process-relay-legacy.md`. On Discord the return parts don't exist, so its run is a one-way pass (5.3b) |
| The fix hop and `process-fix-lit` | **Built 2026-10-04.** Never on Discord: the overlay isn't in its markup | The fix run of `RUN_CYCLE`, +5.2s from `wide` (+5.5s below it, the way back along the dotted line, 5.3a); the overlay lights by `clip-path`; the fix arrowhead does not pulse (5.3a Motion) |
| ~~The phone track's lit segment (`process-track-lit`)~~ | **Superseded 2026-10-05, later** (built 2026-10-05; the track is removed, 5.9) | With `process-track` and `process-track-lit` gone, the lane is each role's `JOB_AT` on the feet line, the top of its ledge. The ledge pass (2026-10-05) deleted the track's code: `ontoTrack`, `COLUMN_JOB_GLIDE` and `litDrop` |
| The ledges' and the phone fix line's lights (`process-ledge-lit`, `process-fix-line-lit`) | **Built 2026-10-05** (the ledge pass, `lib/processRelayLedge.ts`; the fix line route, `lib/processRelayFixLine.ts`) | Below `wide`, full motion only: the job hops ledge to ledge, each ledge lights while its bot works the job, and on a fix run the job goes back along the dotted fix line, which lights behind it (5.9 Motion, as built) |
| Swap fade (§0.5) | **Built 2026-10-04** | Wrappers: `process-caption` and the keyed body (the flow's last child). `process-flow` itself and the tag are not written |
| The new roles' own acts; the emblem's hand-off from step 1 | **Built 2026-10-04** | `lib/processBotFlowActs.ts`, `lib/processRelayHand.ts`; detail below |
| The send run, the flag's two catches and `process-handoff-lit` (round 2) | **Built** (`lib/processRelayHandoff.ts`, 5.11e) | `RUN_CYCLE` replaces `FIX_EVERY`; the job goes up the stem (from `wide`) or down to the marker (below `wide`) and the run ends there. Never on Discord |

- **Hooks in the markup** (all stay): `reveal`, `process-list`, `process-ground`,
  `process-ground-lit`, `process-chevron`, `process-return`, `process-return-row`,
  `process-return-lit`, `process-relay` and its `data-job` parts, `process-relay-ghost`,
  `process-lesson` and its `data-lesson` parts, `process-bot` and every `data-bot` hook in 5.6;
  `process-flow` (with `data-set`, `data-count`, `data-loops`), `process-caption`, `data-step`,
  `data-bot="prop"` on the held emblem, `data-emblem`, `data-job="mark"`, and `data-role` values
  `intake`, `flag`, `remind`, `ship`, `update`, `host`; `process-fix-row`, `process-fix`,
  `process-fix-lit`; `process-ledge` and `process-ledge-lit` (below `wide`, one pair in every step
  of every flow, Discord included); `process-fix-line` and `process-fix-line-lit` (below `wide`,
  inside `process-fix-row`); `process-handoff-row`, `process-handoff`, `process-handoff-lit` (from
  `wide`) and `process-handoff-mark` (below `wide`), in step 3. Under `data-loops="off"` the
  return, fix and hand-off hooks are all absent. ~~`process-track` and `process-track-lit`~~
  (removed 2026-10-05, later).
- **The relay, as built (2026-10-04; rebuilt from the four-step relay).** Files in `lib/`:
  `processRelayPlan.ts` (the clock: which stop when), `processRelayRun.ts` (one run's story, for
  both widths), `processRelay.ts` (from `wide`, along the ground line; `relayQuery`),
  `processRelayColumn.ts` (below `wide`, 5.9), `processRelayLedge.ts` (below `wide`, the ledge
  hops and the ledge lights, 5.9), `processRelayFixLine.ts` (below `wide`, the way back along the
  dotted fix line and its light, 5.3a, 5.9), `processRelayHand.ts` (the hand-off from step 1),
  `processRelayHandoff.ts` (the send run, 5.11e), `processRelayJob.ts` (the job's changes and
  exit), `processRelayFix.ts` (the fix hop), `processRelayLesson.ts`, `processRelayTrail.ts`; the
  acts in `processBotActs.ts`, `processBotFlowActs.ts` and `processBotMoves.ts`; every number in
  `processBotMotion.ts`.
  - **Clock.** A run visits the flow's five or six stops in step order, each for its role's
    `RELAY_DWELL` (wiring 3), a 0.7s hop apart; a send run ends at step 3. The next run starts
    `RELAY_REST = 2`s after the last one ends; there is no fixed start-to-start time.
  - **Run lengths** (measured 2026-10-09, the default flow at 1440): send 7.48s, straight 15.23s,
    fix 20.45s; Discord about 11.8s, a one-way pass with no lesson and no fix hop (5.3b). The
    six-step flows are not re-measured since round 2. The fix hop adds 5.2s from `wide` and 5.5s
    below it: there the way back is `FIX_LINE_HOP`'s 1.1s, not `FIX_HOP`'s 0.8s. `relayPlan` takes
    the back hop's length as an optional argument (default `FIX_HOP`'s), and `useProcessBots`
    passes `columnBack(column).duration` below `wide` only.
  - **Hand-off from step 1.** The job starts in step 1's hand, as the held emblem
    (`data-bot="prop"`). Intake holds it out, and on its hand-off beat (1.3s) the travelling job
    takes the emblem's place in the same frame, at its size, and the held emblem hides. From
    `wide` the job drops onto the ground line early in that first hop. Below `wide` it drops out
    of the hand onto ledge 1 (`JOB_HAND_OFF`, 0.22s `power2.in`) and hops on to ledge 2 in the
    rest of the hop (5.9). The held emblem returns, popping in as a new job, when the next run
    starts (not on the first run, where it is already held). The static page and every teardown
    have it held.
  - **The job's changes,** each on a beat of the bot's act. On the default sheet: `rules`
    stamps it, `team` builds the band and the step, `check` flickers the tick in and flashes the
    glow. The sheet's `rule` and `fold` marks are not animated: they are what arrived. On an
    emblem (no such marks): `rules` and `check` blink its ink marks, `team` and `check` flash the
    glow. `flag`, `remind`, `ship`, `update` and `host` give a pop and the glow on either job.
  - **The check.** On a relay pass it scans and the lens flickers. Its "found it" eye pop plays
    on the relay only when the job goes back (5.3a); a timed act, off the relay, may still end
    on it.
  - **The fix hop:** the fix run of `RUN_CYCLE`, flows with loops only, +5.2s from `wide` and
    +5.5s below it (5.3a). `process-fix` and step 4's `<li>` are never written.
  - **The return.** As the job leaves the last bot, the lesson splits off it, drops onto
    `process-return` and rides it back, lighting `process-return-lit` by `clip-path`; it ends on
    step 2, not step 1, where the arrowhead pulses and the `rules` bot (the standards step) takes
    it. Below `wide`: 5.9. A send run has no lesson (choice 77).
  - **Below `wide`, the lane.** ~~The track (built 2026-10-05): stops 2…n and the exit took the
    measured centre x of `process-track`, with `ontoTrack`, `COLUMN_JOB_GLIDE` and `litDrop`.~~
    **2026-10-05, later:** the track is removed (5.9). Each stop is the role's `JOB_AT` x on the
    bot's feet line, which is the top of its ledge (x ≈ 70–88 for most roles, ≈ 72–90 for `flag`
    and `update`: within 2px of the ledge's right end). The job hops onto that lane ledge to ledge
    and each ledge lights while it is there (5.9 Motion, as built).
  - **Known limits (from the build check):** below `wide` the lesson's ride up the column's left
    edge (x ≈ 2–13) passes over the dotted fix line's ends and arrowhead between bots 5 and 4,
    accepted (open choice 65); in five-step flows its pop and hold at bot 5 sit over the line's
    bottom end (5.9). From `wide` the job crosses in front of the flag's pennant for about 0.2s on
    the climb (5.11e). Both still await the lead's browser check (page doc). The track's three
    known limits went with the track (choices 50–52 closed).
- **New acts, as built** (`lib/processBotFlowActs.ts`; each in three lengths: timed, short after
  a hover or tap, and the relay catch): `intake` looks at the job, nods, holds it out (0.5s) and
  hands it on (1.3s) on a catch, or brings it back on a timed act; with the job out on the relay
  its hand is empty, so it nods. `flag` dips the flag to 30°, raises it (the top at 0.5s; `tool`
  rotates about 108 53) and waves it; since round 2 its relay catch splits in two (5.11e): a
  routine nod-through and a send. `remind` swings the bell about 118 20 (the first swing peaks at
  0.3s), with a nod. `ship` pulls the arrow back, then sends it up and to the right (0.5s; `tool`
  `x`/`y`). `host` nods; on a catch it looks at the job first (dip at 0.4s).
- **Swap, as built (§0.5):** `process-caption` and the keyed body fade out over 0.15s, the flow
  changes, and they fade in over 0.25s; opacity only, the same under reduced motion.

### 5.8 Choices

**Decided by the user, 2026-10-09:**

81. **The flow goes across from `wide` (1440) — decided.** Below 1440 every flow stacks, as on
    phones and tablets (steps as rows, the hand-off a marker row with an arrow, the job dropping
    onto the marker). New breakpoint `--breakpoint-wide: 90rem` (user's yes;
    `docs/01-design-system.md`). Five and six across share the 32px gap. The header's gaps stay on
    `lg`. Why: "Your standards" overflowed its 161px column at 1024, and at 1280 the six-step
    flows still ran it into "Hard calls" in a 168px column; from 1440 every flow fits (≥ 25px
    between titles; 1600 and 3840 clean). Supersedes 28. (Not chosen: across from `lg` or `xl`.)
82. **"Rules" becomes "standards" — decided** across the home page, except the Discord demo's
    "#rules" channel: the step title, the lead, and every flow's loop and fix labels (5.5). The
    `rules` bot role keeps its code name.

**Decided by the user, 2026-10-03** (also listed in `../ui-spec.md`):

28. ~~**Six across from `lg`, with a 16px gap up to `xl` — decided,** with the 9-character limit
    on step-title words. (Not chosen: rows until 1280 for six-step flows; smaller bots for six.)~~
    **Superseded 2026-10-09 by 81:** six across from 1440 with the 32px gap; the 9-character limit
    is retired (5.4).
29. **The return lands on step 2, "Your standards" (was "your rules") — decided.** (Not on Discord, 38.)
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
    its own label slot. Specced as an arch above the bots and a marker row below the across layout
    (5.3a); the bottom return and its slot's meaning stay. (Not on Discord, 38.) **2026-10-05,
    later:** below the across layout the marker row's icon is replaced by a dotted line (54).
    **2026-10-08:** step 5 → step 4 (69).

**Decided by the user, 2026-10-04** (also listed in `../ui-spec.md`):

38. **The Discord flow has no validation and no loops — decided.** No "Second check" step, no fix
    loop, no bottom return. Its bot stays in the server around the clock, answers when a member
    mentions it, talks in the tone the owner sets, can optionally remember past chats, and
    connects to the server's business tools and other apps. Five steps, in this order: Mentioned,
    Your tone, Remembers, Connected, Always on (5.3b, 5.5, 5.10). The other flows keep their
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

53. **Ledges replace the phone track — decided.** No rail: under every bot below `wide`, a short
    2px `line` ledge it stands on, a piece of the ground line (`process-ground`) cut to the bot's
    width; the job hops ledge to ledge and each ledge lights violet as the job lands, the ground
    line's lit segment made short (5.9). From `wide` nothing changes. Supersedes 44–52.
54. **Below `wide` the fix loop is a dotted line — decided.** The marker row's ↰ icon goes; a
    dotted `accent` line down the bot column's left side runs from the check step's bot up to the
    work step's (bot 5 to bot 4 since round 2; bot 4 to bot 3 when decided), the form the arch
    takes below `wide`, and never below the check's bot. The label stays, one element at every
    width, beside the line; no copy change (5.3a).

**Decided in this spec, 2026-10-05, later (the lead may review; 5.3a, 5.9):**

55. **The ledge runs x 18–88,** from the body's left edge past the right foot (x 57) to the bot
    column's right edge, under the right-hand tool, so the job, which waits beside the feet
    (x ≈ 70–88), lands on it. (Not chosen: x 18–58, the sketch's end at the right foot, `w-10`;
    the job would then land 12px past the ledge's end, in the air, or the lane would move over
    the feet.)
56. **The ledge's lit overlay is the ground-lit gradient,** `from-accent/0 to-accent`, bright at
    the right end under the job. (Not chosen: solid `accent` along the whole ledge.)
57. **The fix line is a bracket with turned ends and an arrowhead onto the work step's bot**
    (bot 4 since round 2), the arch on its side. (Not chosen: a straight dotted line with plain
    ends; it would not say which way the work goes on the static page.)
58. **The fix line is `border-dotted`** below `wide`, as the user asked; the arch from `wide`
    stays `dashed`. (Not chosen: dashed at both widths, or the arch made dotted too.)
59. **The next step's hairline draws over the fix line where they cross** (step 5's since round
    2), uncut. (Not chosen: lifting the line over it with a `z-index`, a new layer for one dot.)
60. **Each `<li>` takes `relative` at every width** to place its ledge and the fix line, with no
    `z-index`. (Not chosen: a wrapper round the bot, an extra element at every width; or the
    ledges drawn in the list and placed per row.)
61. **`ProcessLedge.tsx` is its own file** (constitution §9), like the track was; the fix line
    stays in `ProcessFixReturn.tsx`, as the phone form of the same loop.

**Open for the user (with the recommendation):**

37. **Where the fix label sits from `wide`.** (a) Centred above the arch, with the caption → steps
    gap growing from 48 to 96px so it clears the caption by 20px. (b) On the arch's top edge, like
    the bottom label, with no extra gap; at six across on 1440 the arch (229px) is narrower than
    the current labels (up to ≈ 250), so the label covers its corners and it reads as two legs
    under a label. **Recommended and built: (a).**

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
65. **The lesson over the fix line, below `wide`.** (a) Accepted, as built: it keeps its lane
    (x ≈ 2–13) and rides over the fix line's ends and arrowhead; there is no free lane, both are
    "back up" loops, and it crosses in ≈ 0.45s while the line is unlit. (b) Moved into the
    gutter, left of the list, clear of the line but past the list's edge.

**Decided by the user, 2026-10-05 (the fix line route; built, checked by the lead at 360 and
768):**

66. **Below `wide` the job goes back along the dotted fix line.** The user: "the object should go
    back from the dotted route instead of a step back". On a fix run the job leaves the check's
    ledge (ledge 5 since round 2), rides the dotted line from that bot's hand round both turns and
    through the arrowhead into the work step's bot's hand (bot 4), then drops onto its ledge; the
    line lights behind it (5.3a, 5.9 The fix rise). Replaces the straight rise between the two
    ledges, which stays only as the fallback with no fix line. From `wide` the arch hop is
    unchanged.

**Open for the user, the fix line route (2026-10-05; as built is (a) in each, 5.9 The fix
rise):**

67. **The job in front of bots 5 and 4 on the short legs** (bots 4 and 3 when raised). On the
    legs to and from the line (ledge 5 to bot 5's hand, bot 4's hand to ledge 4) the job crosses in
    front of those bots' legs and feet, for about 0.35s each. (a) Accept it, as built. (b) Keep the
    job off the bots on those legs; the column has no free lane there, so the animator would need
    another way (for example the job passing behind the bots, a paint-order change to the relay
    layer).
68. **The way back's length.** (a) `FIX_LINE_HOP` 1.1s, as built: about the ledge hops' speed
    over the ≈ 330–360px route, the climb up the line ≈ 0.38s at 360; a fix run is +5.5s.
    (b) Closer to `FIX_HOP`'s 0.8s, as from `wide`: quicker and matching the arch, each part of
    the route about a quarter shorter in time; a fix run nearer +5.2s.

**Open for the lead (2026-10-04, Discord; the spec uses the first option of each):**

39. **Step 5 "Always on":** `host`, the bare bot that never naps, or `remind`, whose bell already means "Reminder" in the service-business flow.
40. **Step 4 "Connected":** `ship`, whose arrow shows "posts to" and not "pulls from", or a new `link` role (a plug), which needs a drawing and the user's yes.
41. **Step 3 "Remembers":** `update` as drawn, a wrench beside the book of past chats, or a new book-only role.
42. **Naps on an "always on" flow:** `rules` (step 2) and `update` (step 3) nap as built, or naps are skipped under `data-loops="off"` (new wiring).
43. **Below `wide` the list's end:** no closing hairline under step 5, or `border-b border-line` on the last row.

**Decided by the user, 2026-10-08 (round 2):**

69. **Control comes first — decided.** The one question is "Can I trust it with my customers?";
    in every flow with loops the flag step moves to step 3, before the work, and the check after
    it (5.10). The user chose this over recasting the words only, accepting the bot-order and
    relay rework. The fix loop becomes step 5 → step 4; the return is unchanged.
70. **"Sensitive actions go to a human" — decided** (refunds, complaints and anything unusual are
    passed to a person). The fact is now in `docs/03-facts.md` (5.5).

**Decided by the user, 2026-10-08, round 2 (the first option of each, per the page doc; built):**

71. **Software-builder's flow.** (a) Reorders like the others (feature asked, your standards, to a
    person, built, reviewed, shipped), in its own peer words: one `FIX_STEP`, one `HANDOFF_STEP`,
    one layout and one relay for all four flows with loops. (b) Keeps its build order (built,
    reviewed, flagged, shipped): the fix and hand-off steps become per-flow data, the hand-off stem
    sits right of the arch instead of left, and the relay plans two shapes. **Taken: (a).**
    A builder trusts a flow where a person decides the unusual before agents build it as much as
    an owner does, and (b) doubles the cases to build and check for one card.
72. **Discord's flow.** (a) Unchanged: no check, no loops, no hand-off (the 2026-10-04 decision);
    "Your tone" is its control step. (b) A hand-off step added, which needs its own Discord fact
    and reverses choice 38. **Taken: (a).**
73. **What "to you" looks like.** (a) A dashed `accent` stem rising from the flag's pole to a label
    above the row ("to you"), a marker row below `wide`; no person is drawn; the job runs up the
    stem into the label. (b) No static mark: on a flagged run the job just leaves upward and
    fades. (c) A drawn person at the stem's end: a new drawing, and it reverses "no person is
    drawn" (2026-10-03). **Taken: (a):** the triage reads on the static page, without
    JavaScript and under reduced motion, and needs no new drawing.
74. **The run cycle.** (a) Hand-off run first, then a routine run, then a fix run, repeating, so
    the first thing the relay shows is a job going to you. (b) A routine run first, then the
    hand-off, then the fix. **Taken: (a)** (`RUN_CYCLE`): control is the answer, and most readers
    see one run. The flag bot nodding the routine job through on run 2 still shows the sort.
75. **The heading must hold on Discord, which shows no hand-off.** (a) The heading states the
    control in general terms (their standards run the work, the unusual comes to them): a fact
    about how the user works, true for every card even where Discord's sample flow doesn't draw
    it. (b) The heading speaks only of "your standards" ("your tone" on Discord), which every flow
    draws: weaker against the fear of no person at all. **Taken: (a)** (the 2026-10-09 heading
    states it in general terms).
76. **An intro line under the heading.** (a) In: `process.lead`, as Agents now has, so the
    3–5 second skim gets the answer before the long flow. (b) None: the heading alone.
    **Taken: (a).**
77. **No lesson on a hand-off run.** (a) The run ends at "to you": no exit slide and no lesson
    back to step 2; a person handled it. (b) The lesson still rides back to step 2 from the
    flag. **Taken: (a):** a short, clear run, and no suggestion that the agents handled it.
78. **Approval of every reply.** "You see everything" or "you approve each reply before it goes"
    is not in the facts, so no step shows it. If the user wants such a step, it needs a new fact
    first. **Taken: no such step;** the hand-off and the check carry the answer.

**Decided in this spec, 2026-10-08 (the lead may review; 5.11):**

79. **The hand-off label from `wide` ends at the stem** (right-aligned, extending left over steps
    2–3). (Not chosen: centred on the stem. With the layout as it stood on 2026-10-08, six across
    at 1024, a centred label over about 14 characters would have run into the fix label; at six
    across 1440 there is room either way, about 168px, so the reason is weaker but the choice
    stands as built.)
80. **Below `wide` the hand-off is a marker row under step 3's text,** an `ArrowRightIcon` under
    ledge 3's right end pointing at the label in the text column, so the job drops straight down
    the empty bot column and the lesson's lane (x ≈ 2–13) stays clear. (Not chosen: the icon at
    the row's left edge like the return row's, on the lesson's lane; or `ArrowUpRightIcon`, the
    site's outside-link sign.)

**Earlier choices that still hold** (the relay ones are in the legacy file; the rest are in git
at `37dee00`): the bot stays 136px at 4K (2); the return path is a CSS dashed border box (4);
step numbers are two-digit (5); the wrench jaw shows in full with `overflow-visible` (8); the
`upper` group, the eyes inside `body`, the feet cut 7 units above each tip, the hammer's +30°
strike and the update `mark` hook (9–11, 13, 14); no cursor change on bots (15). **Superseded
2026-10-03:** "four across from `lg`" (1) becomes five or six across (from `wide` since
2026-10-09); the 3-word title limit (7) becomes 2 words / 16 characters.

### 5.9 Phone relay (below `wide`: phones, tablets and desktop below 1440)

**2026-10-08:** with the fix loop at step 5 → 4 the dotted line runs from bot 5's hand up to bot
4's, and in five-step flows the last bot is the check, so the lesson pops in at bot 5's left hand,
right where the dotted line's bottom turn ends: for its 0.35s pop and 0.6s hold it sits over the
unlit line's end (open choice 65's case, now at rest for about a second). The send run's drop is
5.11e.

**Rebuilt 2026-10-04 for five or six steps** (`lib/processRelayColumn.ts`), on the same clock as
the ground-line run (5.7). The job leaves step 1's hand and goes down the bot column,
waiting at each later bot's right foot, trailed by the ghosts (no chevrons). Since 2026-10-05,
later, it stands on each bot's ledge and hops ledge to ledge (below). On a fix run it goes back
from ledge 5 to ledge 4 along the dotted fix line (since the fix line route, 2026-10-05) and hops
down again. After the last bot's change it pops once as done and fades on the last ledge, its
ledge's light with it. In a flow with the return, the lesson pops in at the last bot's bare left
hand over 0.35s while that bot looks down at it, is held there for 0.6s, then lifts off and rides
the column's left edge up to step 2's clipboard, where the `rules` bot takes it. Known limits:
5.7. The four-step version (the lesson from bot 4's rulebook up to bot 1's clipboard; superseded
2026-10-03) is `05-process-relay-legacy.md`.

#### The track (superseded 2026-10-05, later)

Built and checked on 2026-10-05 (choice 44), superseded the same day by the ledges (53). Its spec,
as built, is kept in [`05-process-track-legacy.md`](05-process-track-legacy.md). Removed:
`ProcessTrack.tsx`, `process-track`, `process-track-lit`, and the fix row's `bg-bg` that masked it.
The motion code that rode it (`ontoTrack`, `COLUMN_JOB_GLIDE`, `litDrop`) is deleted in the ledge
pass (2026-10-05); the job's lane is the `JOB_AT` lane on the ledges.

#### The ledges (`ProcessLedge`; the user's choice 53)

The ground line cut into pieces, one under each bot, below `wide` only. One file,
`components/home/process/ProcessLedge.tsx` (server, no props), rendered by `ProcessStep` right
after `ProcessBot`, in every step of every flow (Discord included). Decoration only: no text, no
slot, no image, nothing focusable (so no hover, focus-visible or active state).

```
li data-step={i} class="relative grid … py-6 wide:…"                    (5.2: `relative` at every width)
├ ProcessBot (svg h-14.25 w-22: top 24 under the row's padding top, bottom 81)
├ div aria-hidden="true" data-anim="process-ledge" class="absolute left-4.5 top-20.25 h-0.5 w-17.5 overflow-hidden bg-line wide:hidden"
│ └ span data-anim="process-ledge-lit" class="absolute inset-0 bg-linear-to-r from-accent/0 to-accent opacity-0"
└ chevron (from wide), text column, after                                (unchanged)
```

- **Where, down.** Top at 81 (`top-20.25`): the row's 24px padding + the 57px bot, the box's
  bottom, which is the feet (viewBox y 92; the left foot's tip is 1px above). The bot stands on
  it as it stands on the ground line from `wide`.
- **Where, across.** x 18–88 of the row (`left-4.5 w-17.5`): from the body's left edge (strip A,
  viewBox x 6 = 18.6) past the right foot (x 57) to the bot column's right edge, under the
  right-hand tool, where the job waits (choice 55). `rules`' clipboard and `update`'s book
  (x 2–13) hang past its left end, as they hang in the air from `wide`. In rem, so it holds under
  zoom.
- **How it meets the rest.** 18px short of the text column (x 106); about 75px above the next
  row's hairline (more where the text runs long); never meets the fix line (x 0–12) or a
  hairline. Nothing covers it at rest, and the feet never go below it (taps and jump lag lift
  them).
- **At rest:** 2px `bg-line`, below `wide`, with and without JavaScript and under reduced motion.
  The lit overlay is hidden (`opacity-0`). From `wide` neither shows (`wide:hidden`) and the
  ground line takes over.
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
- **The fix rise** (the fix run of `RUN_CYCLE`; the fix line route, `lib/processRelayFixLine.ts`,
  choice 66): the job goes back along the dotted fix line. It leaves ledge 5 heading left, rises
  at 45° to the line's bottom end at bot 5's hand, rounds the bottom turn, climbs the line, rounds
  the top turn and passes through the arrowhead's tip (x 12) into bot 4's hand, then drops at 45°
  onto ledge 4 and slides to its stop. Each turn is a quarter circle of 3 points, its radius from
  the line's measured width; no MotionPathPlugin. The route is rebuilt from `process-fix-line`'s
  box whenever the column is measured (`measureColumn`: on setup, resize and ScrollTrigger
  refresh) and read on every frame, so a reflow keeps the job on the line. One eased progress
  runs the whole route: `FIX_LINE_HOP`, 1.1s `power1.inOut` (≈ 0.35s leaving ledge 5, ≈ 0.38s up
  the line, ≈ 0.35s settling at 360); from `wide`, `FIX_HOP` stays 0.8s. The ghosts trail the
  route. Ledge 5's light fades as the job leaves it; ledge 4 lights on the landing as any ledge
  does. Length: open choice 68.
- **The fix line's light:** `process-fix-line-lit` follows the job's progress by `clip-path`.
  It is clipped to nothing until the job reaches the line's bottom end, then lit from the bottom
  end up to the job's centre (a left inset along the bottom leg, a top inset up the line), and
  fully lit once the job is past the arrowhead. It holds while step 4 redoes its act and fades
  over `FIX_LIT_FADE` (0.6s, `fixLitFade`) as the job hops forward. The arrowhead does not
  pulse. `process-fix-line` and `process-fix-row` are read, never written.
- **Room on the fix rise.** At 360 the job's left edge comes within 13px of the viewport on the
  line (7–8px into the gutter), for a moment: no sideways scroll. On the short legs to and from
  the line it crosses in front of bots 5 and 4's legs and feet (open choice 67). The lesson and
  the job are never on the line together.
- **Without a fix line** (a fallback; every flow with loops draws one): the old straight rise
  from ledge 5 to ledge 4 on its own lane (x ≈ 67–91) in `FIX_HOP`'s 0.8s, unlit.
- **The exit:** on the last ledge the job pops "done" (`JOB_DONE`: up 0.12s to scale 1.12, back
  0.3s `back.out(3)`) and fades over 0.3s (`JOB_FADE`); that ledge's light fades with it. No
  ghosts on the exit. From `wide` it slides to the line's end, unchanged.
- **The lesson over the fix line (accepted, open choice 65):** the lesson keeps its lane up the
  column's left edge (x ≈ 2–13, `COLUMN_LESSON_AT`) and rides over the fix line's ends and
  arrowhead between bots 5 and 4, 1px beside its leg. There is no free lane, both are "back up"
  loops, and it crosses in ≈ 0.45s while the fix line is unlit.
- **Reduced motion:** no relay, so nothing hops or lights; the ledges and the fix line stay,
  static and unlit (open choice 64). Trigger: the relay's clock (5.7), below `wide` and full
  motion only.
- **Must stay true:** tokens only (`line`, `accent` with a `/0` stop). Motion never writes
  `process-ledge`, `process-fix-line`, `process-fix`, `process-fix-row` or any `<li>` (a
  `transform` or `opacity` on an `<li>` would start a stacking context). No sideways scroll.

#### Sizes: the ledges and the phone fix line (phone first)

Desktop below 1440 (1024, 1280) is stacked and takes the tablet column.

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Ledge (`process-ledge`) | 2 × 70 at x 18–88 of the row, top 81 under the row's padding top (the feet); one per step, 5 or 6 | same | none (`wide:hidden`); the ground line | same |
| Ledge lit (`process-ledge-lit`) | the ledge's 2 × 70, `accent` from nothing at the left to full at the right; hidden at rest | same | none | none |
| Ledge → step text | 18 | 18 | — | — |
| Fix line (`process-fix-line`, 5.3a) | 2px dotted `accent`, x 0–10; ends at bot 4's hand (61 into step 4) and bot 5's (62 past step 4's end): ≈ 207 tall; turns of radius 10 | same x; ≈ 187 tall | none (`wide:hidden`); the arch | same |
| Fix arrowhead | `ChevronRightIcon` `size-6`, glyph 6 × 12, tip at x 12, 1.5 clear of bot 4's hand | same | the arch's `ChevronUpIcon` | same |
| Fix label | 13px mono, from x 16 (14 right of the line), one line at 360: ≈ 250 of the 304 left | same | centred above the arch | same |
| Fix line lit (`process-fix-line-lit`) | the line's box, solid 2px `accent`; hidden at rest | same | none | none |
| Lowest point of the fix line | bot 5's hand, 19 above its feet and ledge | same | — | — |
| The job on the fix line (fix runs only) | left edge 13 from the viewport, 7–8 into the gutter | same, 7–8 into the wider gutter | none: it hops the arch | same |

### 5.10 Flows and roles (`lib/processFlows.ts`, `lib/processEmblems.ts`)

**Revised 2026-10-08 (round 2, choice 69): control comes first.** Step order and meaning are the
user's (2026-10-03, reordered 2026-10-08; Discord's 2026-10-04, unchanged); the wording is the
copywriter's. The 2026-10-03 order (intake, rules, team, check, then flag, remind or ship) is in
git before this date. **2026-10-09:** step 2 reads "Your standards" in all four flows with loops.

| Set (sample job) | Steps | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|---|
| `default` (a job) | 5 | a job arrives: `intake` | your standards: `rules` | to you: `flag` | done: `team` | checked: `check` | |
| `service-business` (a booking) | 6 | request arrives: `intake` | your standards: `rules` | to you or your staff: `flag` | booked: `team` | checked: `check` | reminder: `remind` |
| `online-store` (an order question) | 5 | question arrives: `intake` | your standards: `rules` | refunds and complaints to you: `flag` | answered: `team` | checked: `check` | |
| `discord` (a mention; no loops, 2026-10-04; unchanged) | 5 | mentioned: `intake` | your tone: `rules` | remembers: `update` | connected: `ship` | always on: `host` | |
| `software-builder` (shipping a feature; choice 71) | 6 | feature asked: `intake` | your standards: `rules` | to a person: `flag` | built: `team` | reviewed: `check` | shipped: `ship` |
| ~~`website`~~ | removed 2026-10-07 | | | | | | |

**`flowRoles` (round 2):**
- `default`: `intake, rules, flag, team, check`
- `service-business`: `intake, rules, flag, team, check, remind`
- `online-store`: `intake, rules, flag, team, check`
- `software-builder`: `intake, rules, flag, team, check, ship`
- `discord`: unchanged, `intake, rules, update, ship, host`

`FIX_STEP = 3` (`team`, with `check` next, in all four); `HANDOFF_STEP = 2` (`flag` in all four).
`rolePose` is unchanged (`check` and `flag` in `act`). Every bot, pose, prop and pivot is reused;
**no new role.** The step counts are 5, 6, 5, 5, 6, so `lib/processLayout.ts` and the type ties
hold as they are.

**What each step is for, in the new order (for copywriter; the four flows with loops):**

| Step | Bot | Purpose | Per card |
|---|---|---|---|
| 1 | `intake` holding the job | The customer's job comes in | Booking request; order question; feature asked (peer) |
| 2 | `rules` | It is handled from standards written for this business | Hours, services and standards; delivery and returns policy; the builder's written standards |
| 3 | `flag` raising its flag | The sort, before any work: anything sensitive or unusual is passed to a person instead; routine jobs go on | Unusual bookings to you or your staff; refunds and complaints to you (the fact, 5.5); anything unusual to a person, not an agent (peer) |
| 4 | `team` | The routine job is done, to those standards | Booked; answered; built |
| 5 | `check` | A separate agent checks it before it goes out (facts) | The booking; the reply; the review before it ships |
| 6 | `remind` / `ship` | The flow's own last step, after the check | The customer gets a reminder and can reschedule; the feature ships to production |

- **Poses:** `check` and `flag` in `act`; the rest in `idle`.
- **The return** runs from the last step back to step 2 in every flow but Discord.
- **The fix loop** runs from step 5 back to step 4 in every flow but Discord (`FIX_STEP = 3`,
  2026-10-08; it was step 4 → 3 with `FIX_STEP = 2`): in those four, step 4 is always the `team`
  step and step 5 always `check`, so one constant serves them all. Which flows have loops is
  `hasLoops` (5.3b).
- **The hand-off** leaves the row from step 3 in every flow but Discord (`HANDOFF_STEP = 2`,
  5.11). It goes to a person and does not come back.
- **"Flagged"** means anything unusual goes to a person. The bot raises a flag; no person is drawn.
  **2026-10-08:** it also covers sensitive actions (refunds, complaints; choice 70), and the
  person is named in words by `handoffLabel`, still with no person drawn (choice 73).
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
| ~~`website`~~ | ~~`window`~~ | removed 2026-10-07 |

  The job sheet is the built relay job (`lib/processJob.ts`) moved into the prop slot by (106, 26),
  written out as its own paths so the markup holds no transform. Fills through `botFills`.

### 5.11 The hand-off to you (round 2, new 2026-10-08; built and lead-checked by 2026-10-09)

#### 5.11a What it answers

The fear the section answers is "no person at all". Step 3's flag bot sorts the job before any
work, and the hand-off draws the way out of the row: anything sensitive or unusual leaves here
for a person; routine jobs go on to be done and checked. One question per section holds: the
hand-off and the check are the two halves of "can I trust it?", in reading order.

#### 5.11b Header: the intro line

- `ProcessSection`'s header has, after `SectionHeading`:
  `<p class="max-w-xl text-lead leading-normal text-muted">` = `process.lead`. It sits inside the
  header's `data-anim="reveal"` block, so it reveals with the heading; no hook of its own.
- `text-lead` (17px) as Agents', Web's and Contact's leads; `max-w-xl` (576px) because this header
  is full width, stacked, not a split column. Contrast `muted` on `bg` ≈ 7:1. Its gap to the
  heading stays on `lg` (20 → 28px).
- **Motion:** none beyond the header's existing reveal. Reduced motion: the reveal's fade.

#### 5.11c Markup (`ProcessHandoff`, `components/home/process/ProcessHandoff.tsx`, server, prop `label`)

The last child of step 3's `<li>` (via `ProcessStep`'s `after`), flows with loops only.

```
div data-anim="process-handoff-row" class="col-span-2 mt-5 grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-x-4.5 wide:contents"
├ span aria-hidden="true" data-anim="process-handoff-mark" class="justify-self-end wide:hidden"
│ └ ArrowRightIcon className="size-5 text-accent"                      (below wide: under ledge 3's right end, x 68–88)
└ div data-anim="process-handoff" class="contents wide:absolute wide:-top-12 wide:left-27.5 wide:block wide:h-16 wide:w-0.5 wide:border-l-2 wide:border-dashed wide:border-accent"
  ├ ChevronUpIcon className="absolute -left-3.25 -top-2.5 hidden size-6 text-accent wide:block"   (arrowhead up, away from the bot: the return's arrowhead classes)
  ├ p class="{monoLabel} wide:absolute wide:-right-3 wide:bottom-full wide:z-10 wide:mb-2 wide:whitespace-nowrap wide:text-right"
  │   → span class="wide:bg-bg wide:px-3"                                  ← flows[set].handoffLabel
  └ span aria-hidden="true" data-anim="process-handoff-lit" class="pointer-events-none absolute -left-0.5 inset-y-0 hidden w-0.5 bg-accent opacity-0 wide:block"
```

- **From `wide`: a dashed stem up the flag's pole.** 2px dashed `accent`, 64px tall, from 48px
  above the list's top to 16px below it, at x 110–112 of step 3's column: on the pole's line
  (viewBox x 108 = 110.4px), so the flag's pole carries on upward as the way out. Its bottom end
  is 22px above the pole's top at rest (5.6 Overflow). The arrowhead points up at the top end;
  the label sits 8px above it, its text ending at the stem (choice 79), at the fix label's height
  (76px above the list), on a `bg` mask at `z-10`. It never meets a step's text (under the bots),
  the fix arch (one column right) or the caption (`wide:gap-24`, 20px clear).
- **Below `wide`: a marker row under step 3's text** (choice 80), the row's own two columns: the
  arrow right-aligned in the bot column, under ledge 3's right end, pointing at the label at
  x 106. `mt-5` (20) under the text, ≈ 20 tall, so step 3 grows by about 40, as the fix step does.
  It is clear of the lesson's lane (x ≈ 2–13) and of the ledge (73px above it at 360).
- **The label:** real text, one element at every width, never `aria-hidden`; a screen reader
  meets it inside step 3, after its line. Muted mono on `bg` ≈ 7:1. One line at 360 for the
  current labels (the longest, "To you or your staff", ≈ 156px of the 214px text column); it
  wraps below `wide` if longer (nothing is `nowrap` there).
- **States:** nothing interactive; no hover, focus-visible or active state. No tap target.
- **Never write** `process-handoff`, `process-handoff-row`, `process-handoff-mark` or step 3's
  `<li>` from motion (a `transform` or `opacity` would trap the label's `z-10`); the lit overlay
  is the only writable part.

#### 5.11d Sizes (round 2)

Desktop below 1440 (1024, 1280) is stacked and takes the tablet column.

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Heading (`text-heading`, 2 lines) | 30px | 43px | 64px | 72px |
| Lead (`text-lead`, `max-w-xl`) | 17px / 1.5, 20 under the heading, full 320 width | 17px, max 576 | same, 28 under the heading | same |
| Hand-off stem (2px dashed `accent`, 64 tall, −48 → +16 on the list's top) | none | none | 5: x 655 · 6: x 564 | 5: 738 · 6: 634 |
| Hand-off arrowhead | none | none | `ChevronUpIcon` 24 box on the stem's top end | same |
| Hand-off label (13px mono) | from x 106, 20 under step 3's text; one line (longest ≈ 156) | same | one line, text ending at the stem, bottom 56 above the list; the longest (≈ 156) starts near x 408 at six across, over the gap after step 2 | same |
| Phone marker (`ArrowRightIcon` `size-5`) | x 68–88 of the row, centred on the label's line | same | none | none |
| Step 3 row | ≈ 200 (+40); 5 rows ≈ 890, 6 ≈ 1050 | ≈ 180; 5 rows ≈ 790, 6 ≈ 930 | column ≈ 300 | ≈ 290 |
| Fix arch (over steps 4–5) | dotted line from bot 5's hand to bot 4's, as 5.3a | same | 5: x 878 → 1152 · 6: x 742 → 971 | 5: 1003 → 1319 · 6: 846 → 1109 |
| Hand-off text → fix label (a 32-character fix label, ≈ 250) | — | — | 5: ≈ 235 · 6: ≈ 168 | 5: ≈ 298 · 6: ≈ 218 |
| Return path | unchanged (5.4) | same | same | same |

The tightest spot is six across at 1440: about 168px between the end of the hand-off text and the
start of the longest fix label (about 144px between their `bg` masks). The hand-off label grows to
the left, over steps 2–3, where nothing else is drawn, so any length stays inside the list. No
sideways scroll at any width: the stem and its label are inside step 3's column or to its left,
and the phone marker is inside the 88px bot column. These widths are computed from the classes
and 13px mono; the lead's 2026-10-09 check saw no overlap at 1440, but did not measure
"To you or your staff" (page doc, open).

#### 5.11e Motion (built; `lib/processRelayHandoff.ts`, `lib/processRelayPlan.ts`, on the existing relay)

- **The plan** (`lib/processRelayPlan.ts`). A visit kind, **`send`**: the flag bot keeps the
  job `RELAY_SEND.dwell` (the top of its flag raise, `JOB_BEATS.flag.raise` 0.5s), and the run's
  visits end there. `sendStop(roles)`: `HANDOFF_STEP` where `roles[HANDOFF_STEP] === "flag"`,
  else null (Discord: null). `fixStop` finds the check at index 4 through `FIX_STEP`. A run is a
  send run or a fix run, never both. `lessonTaker` is unchanged (step 2).
- **The run cycle replaces `FIX_EVERY`:** `RUN_CYCLE = send, straight, fix`, repeating from the
  first run after setup or a swap (choice 74). A flow with no send stop skips `send`, a flow with
  no fix stop skips `fix`, so every Discord run is straight. Trigger: the relay's clock
  (`RELAY_FIRST`, `RELAY_REST`).
- **The flag's two catches** (`lib/processBotFlowActs.ts`, built moves only). On a routine
  `catch`: it looks down at the job and nods it on (the moves `host`'s catch uses), its flag
  staying up; `RELAY_DWELL.flag` 1.3. On `send`: its built act (dip to 30°, raise to the top at
  0.5s, wave), the job lifting on the raise.
- **From `wide`, the send exit:** from its stop on the ground line (`JOB_AT` 126) the job rises
  straight up in front of the pennant, eases onto the stem's line, climbs it and passes behind
  the label's `bg` mask at the arrowhead, fading over its last 0.3s. `process-handoff-lit` lights
  bottom to top behind the job by `clip-path` (as `process-fix-lit`), holds, then fades. The
  ghosts trail the climb. The ground-lit and the chevron pulses stop at step 3; no exit slide, no
  lesson, no return light (choice 77). The stem is read from `process-handoff`'s box when the
  course is measured, never written.
- **Below `wide`, the send drop:** the job leaves ledge 3's right end and falls straight down the
  empty bot column (x ≤ 90, so it never crosses the text) onto `process-handoff-mark`, then
  slides right towards the label as it pops (`JOB_DONE`) and fades (`JOB_FADE`). Ledge 3's light
  fades as it drops. No lit overlay below `wide`. The mark is read, never written.
- **The fix run:** unchanged in shape; it plays from bot 5 to bot 4 (the arch over 4–5 from
  `wide`, the dotted line from bot 5 to 4 below it). Every route is measured from `process-fix`
  and `process-fix-line` as built.
- **Run lengths** (measured 2026-10-09, the default flow at 1440): send 7.48s, straight 15.23s,
  fix 20.45s.
- **Known limits, accepted, browser check pending (page doc):** below `wide`, in five-step flows
  the lesson's 0.35s pop and 0.6s hold sit over the dotted fix line's bottom end at bot 5's hand
  (5.9, as choice 65). From `wide`, the job crosses in front of the flag's pennant for about 0.2s
  on the climb (as choice 67).
- **Reduced motion:** no relay, so nothing moves or lights; the stem, arrowhead, marker and label
  are static, and the label shows without a reveal (it is outside the text column, like the fix
  label).
- **Must stay true:** tokens only (`accent`, `bg`); motion writes the job, the ghosts and
  `process-handoff-lit` only. No sideways scroll. No scroll hijacking.

**Tokens (all existing):** `bg`, `band`, `line`, `text`, `muted`, `accent`, `on-accent`, `cream`,
`cream-muted`, `ink`; `font-display` (Acosta), `font-body` (IBM Plex Sans), `font-mono` (IBM Plex
Mono); `text-meta`, `text-nav`, `text-body`, `text-body-lg`, `text-lead`, `text-step`,
`text-heading`; `px-gutter`, `py-section`, `--container-site`; radii `rounded-full`,
`rounded-b-2xl`, `rounded-t-2xl`, `rounded-l-2xl`; breakpoints `md`, `lg` (the header) and
`--breakpoint-wide` (`wide:`, 90rem, the flow). No new colour, font, spacing or radius token
(2026-10-04: the Discord flow adds none; 2026-10-05: the track, then the ledges and the phone fix
line, use `line` and `accent` only, and `rounded-l-2xl` joins the radii; 2026-10-08: round 2 adds
`text-lead` to the list and uses `accent`, `muted` and `bg` for the hand-off). **2026-10-09:**
`--breakpoint-wide: 90rem` is the one new token, added with the user's yes and logged in
`docs/01-design-system.md`.
