# Process

**Last Updated:** 2026-09-28 (bot 4's phone lesson handover is built and screen-checked at 390px)

**The one question:** How do they work?

See `../page.md` for the site-wide index. Spec: `../ui-spec/05-process.md`.

## Current State

The redesign is built and live in code, replacing the old ring/loop: `ProcessSection` stacks the
label and heading above the steps at every width (no pinning), then `ProcessList` (a ground line
from `lg`, four steps across from `lg`, one column of rows below `lg`) and `ProcessReturn` (the
dashed loop path from `lg`, a row with an icon and label below `lg`). `ProcessLoop`, `ProcessRing`
and `ProcessRail` are deleted. Each `ProcessStep` renders a `ProcessBot`: a vector SVG built from
the logo's MW strips, hardcoded in `lib/processBots.ts`, sized 136×88 from `lg` so its feet sit on
the ground line, holding all four frames (idle, blink, act, sleep) as groups with three breath
groups each (body, hand, hat); the SVG is `overflow-visible` so the update wrench's jaw isn't
clipped.

The bots are one static rig each (`lib/processBots.ts` `botRig(role, pose)` and `botPivots`;
`data-bot` hooks: `rig`, feet, `upper`, `body`, `eyes`/`eye`, arms, `tool`, `hat`, plus per-role
extras: marks, sparks, page, lens-lit, zzz). Separate feet are cut from the W tips, so at rest each
looks exactly as before. A hidden `ProcessRelay` layer (the three ghosts, the job, then the lesson
card) and `process-list/ground/chevron/return` hooks sit alongside.

`ProcessMotion` runs `useScrollReveal` and `useProcessBots`, which covers:
- smooth GSAP life: breathing, sway, arm drift, blinks, looks and foot taps
- role acts
- naps with z's (rules and update)
- eyes and lean following the pointer (fine pointers)
- a hover/tap reaction, the only time a bot jumps — hover/tap skipped while acting or reacting
- a once-per-load drop-in
- the crew relay job from `lg`, and a cascade below `lg`, where each bot plays its full role act as
  it's reached

Everything runs in one registry, paused off screen or with the tab hidden. Reduced motion is an
opacity fade in, then the static pose.

Build, lint and tsc were green after the motion build. The lead screen-checked headless Chromium at
1440×900, 360×740 (touch), 3840×2160 and 1440 under reduced motion: no console errors and no
sideways scroll at any size across 14s of motion; bots are visible after the drop-in and also when
the page loads already scrolled past the section; without interaction the body only rises ~1.4
units (breathing, no jumps), while a hover (fine pointer) or tap (touch) jumps ~21 units; the relay
job runs at 1440 and 4K and stays off at 360; under reduced motion the bots only fade in (the rigs
keep just `opacity: 1`, no transforms).

From `lg`, with full motion, the relay runs every 16.4s (final numbers, screen-checked 2026-09-28). A
blank 24px cream job pops in at bot 1, on the right of every bot (rules, team and check hold it at
viewBox x 122, update further right at 126 so the built step clears the wrench), and each bot
changes it on a beat of its own act, stopping 2s at each stop:
- bot 1 writes two rules and stamps it
- bot 2 adds a violet band and a step on its two hammer strikes
- bot 3 flickers a tick in and flashes an outline glow, in sync with its lens flicker
- bot 4 folds the corner on its page-flip beat

The acts themselves are retimed to fit inside the 2s dwell (rules ends 1.75s after its start, team
1.69s, check 1.95s — "found it" pops at 1.55s — update 1.9s). The watching bot's eyes stay on the job
to its right for what's left of the dwell (`RELAY_WATCH`), but 2s no longer leaves enough over for
the job's hold bob or a watch blink, so neither plays now. A 3-ghost trail and a lit ground segment
follow each hop, with the chevrons flashing cream; the job passes behind each bot (relay layer `z-1`,
above the bots, below the `lg:z-10` loop label, which fully hides it while it crosses behind the
label). Arrivals at 1440 land about 0.2/2.9/5.6/8.3s into the run.

At about 10.3s (bot 4's fold settled), the job is complete: it slides right along the ground line to
14px inside the line's end (0.35s at `lg` and 1440, 0.46s at 4K, trailed by the ghosts and the lit
ground segment), pops once as done (settling at 11.07s) and fades out there (gone by 11.37s) — no
sideways scroll. At the same moment a 14px cream lesson card (`ProcessLesson`, a cut corner and one
violet line) splits off the job's centre at bot 4, pops in and peels 10px up off the sheet, fades out
leaving bot 4 at 10.8–11.0s (hidden the whole time, so it never crosses step 4's text), drops in at
the return path's top-right start (R0) at 11.3s, and rides the path itself at 450px/s — no ghosts —
lighting the path violet as it goes. It reaches the arrowhead (R7) at about 13.72s, where the
arrowhead flashes and it pops out as it fades (about 13.97s); bot 1 takes the loop back at that
moment. A run (return included) lasts about 13.7s at `lg`, 14.4s at 1440 and 14.7s at 4K — about 2s
clear before the next run starts. Below `lg` the cascade stays at 9s.

Lead's check in headless Chromium (2026-09-28, final numbers): screen-checked at 1024, 1440 and 3840
— no console errors, no sideways scroll, the lesson never shows through the loop label, and the
below-`lg` and reduced-motion revert are clean (no leftover style, transform, clip or colour on any
relay element).

The relay now also runs below `lg` (built per `ui-spec/05-process.md` §5.9, choice 27), on the same
16.4s clock as desktop (arrivals at 0.2/2.9/5.6/8.3s, 2s stops). The 16px job waits at each bot's
right foot and drops one row per hop down the bot column, trailed by the 16px ghosts; there's no
ground-lit, return-lit, arrowhead or chevrons below `lg`. At 10.3s, as the job exits, a 10px lesson
pops in and fades in (0.6 → 1, settling at 10.65s) on bot 4's live rulebook position
(`COLUMN_LESSON_FROM`, mapped through the `arm-left` group so it follows his breath, drift and sway).
Bot 4 looks down-left at it (0.3s) and holds it (`acting`, so taps are ignored) until 11.25s
(`COLUMN_LESSON_HOLD`, 0.6s after the pop settles); the job itself drops to 14px above the return
row, pops once and fades by about 11.4s. At 11.25s the lesson lifts 4px with no fade (`LESSON_LEAVE`),
bot 4's eyes ease back to rest, and bot 1's foot tap (`head(0)`) starts at that same moment. It then
rides straight up the column's left lane at 450px/s (`RETURN_SPEED`, x easing into the lane over 0.3s
if the live rulebook sits off it — `COLUMN_LESSON_GLIDE`); at bot 1's clipboard it pops out
(`LESSON_OUT`) and bot 1 squashes (`receive`) as it takes the loop back. Removed on phones: the split
and peel at the job, the fade-out leaving bot 4, the rise-in at the return icon and the icon's flash
(it no longer flashes). A phone run is about 12.6–12.9s (360: 12.92s, 390: 12.80s, 768: 12.64s),
leaving about 3.5s clear before the next run. This replaces the old below-`lg` 9s cascade
(`cascadeRun`, `CASCADE_EVERY`/`CASCADE_GAP` are removed, and `catchRelay` no longer takes a `relay`
flag).

Screen-checked at 390px: the lesson appears on bot 4's rulebook, holds, lifts off and rides the left
lane to bot 1; no overlap with step text or the loop label, no sideways scroll, no console errors;
reduced motion shows no relay; resizing across `lg` mid-run reverts cleanly both ways. A recheck at
360 and 768 couldn't run — the dev server returned 500 from separate, in-progress Proofs work
(`content/home.ts` removed `cardShotAlt`, which `ProofsSection.tsx` still reads); pending.

`ProcessRelay.tsx` shows the relay layer at every width now (`pointer-events-none absolute inset-0
z-1`), with the ghosts `size-4` below `lg`; `ProcessJob.tsx` is `h-4.75 w-4` below `lg`;
`ProcessLesson.tsx` is `size-2.5` below `lg`; `ProcessReturn.tsx`'s return row carries
`data-anim="process-return-row"` so the relay can find the icon it flashes. `lessonEnter` now takes
a side argument (above on desktop, below on phones). In `hooks/useProcessBots.ts`, the width picks
the geometry: `wide` (from `lg`) builds `relayParts`/`relayRun` as before, otherwise `columnParts`/
`columnRun` from the new `lib/processRelayColumn.ts` runs the vertical relay, sharing the job,
lesson and trail helpers with desktop.

Lead's check in headless Chromium (2026-09-28): screen-checked at 360, 390, 768, 1023, 1024, 1440 and
3840 — no console errors and no sideways scroll; below `lg` the job, ghosts and lesson never overlap
step text or the loop label; reduced motion shows no relay; resizing across `lg` mid-run reverts
cleanly and restarts in the right geometry; desktop behaviour is unchanged.

## Key Files

- `components/home/process/` — ProcessSection, ProcessList, ProcessStep, ProcessBot, ProcessReturn,
  ProcessMotion
- `lib/processBots.ts` — the bots' vector geometry (body strips, eyes, hats, tools) and each step's
  role/static pose
- `hooks/useProcessBots.ts` (wiring)
- `lib/processBotMotion.ts` (constants)
- `lib/processBotRig.ts` (hooks, pivots, summed channels, reset)
- `lib/processBotLife.ts` (breathing, sway, drift, blinks, looks, taps)
- `lib/processBotActs.ts` (role acts, the reaction jump, relay catches, naps)
- `lib/processBotEntrance.ts` (drop-in)
- `lib/processBotPointer.ts` (pointer to look/lean mapping)
- `lib/processRelay.ts` (relay waypoints and the ground-line job run — including its
  slide-to-line-end exit and the lesson's split-off and ride back along the return path)
- `lib/processRelayColumn.ts` (the same run turned vertical below `lg`: column waypoints,
  `columnRun`, the job's row-by-row drop, the exit drop to the return row, and the lesson's
  appearance on bot 4's live rulebook and its ride up the column's left edge to bot 1's clipboard)
- `lib/processBotCrew.ts` (the one registry that pauses everything)
- `components/home/process/ProcessRelay.tsx` (the relay layer — ghosts, then the job, then the
  lesson card)
- `components/home/process/ProcessJob.tsx` (the job SVG)
- `lib/processJob.ts` (job paths and pivots)
- `components/home/process/ProcessLesson.tsx` (the lesson card SVG)
- `lib/processLesson.ts` (lesson card path and line)
- `lib/processRelayJob.ts` (the job's blank start, per-bot changes, its wait-bob and its
  slide/pop/fade exit)
- `lib/processRelayLesson.ts` (the lesson's split-off/leave/enter for the desktop return, its
  pop-in/lift for bot 4's rulebook below `lg`, and its pop-out at the arrowhead or bot 1's clipboard)
- `lib/processRelayTrail.ts` (ghosts and lit ground segment for hops and the job's exit slide,
  chevron/arrowhead flashes, the return-lit overlay — no ghosts on the return)
- `hooks/useScrollReveal.ts` — the reusable scroll-reveal hook this section uses (also usable by
  other sections; see `../page.md`)
- `lib/watchLive.ts` — on-screen/tab-visible watcher, reused from elsewhere
- `components/icons/ChevronRightIcon.tsx`, `components/icons/CornerUpLeftIcon.tsx`

## Decisions

- 2026-09-24 — Process is a departure from v3: four steps as a loop — written rules → agents do
  the work → they check themselves → lessons update the rules (then back to step 1). Facts: "How
  the user works". Numbered label 02 and a big heading; copywriter words it. **Superseded
  2026-09-25.**
- 2026-09-25 — Process has four steps, set by the user, in order: (1) work starts with the user's
  rules enforced; (2) specialized agents follow those rules or work in a defined boundary; (3) a
  separate agent verifies and validates their work; (4) the workflow is updated each cycle or
  session. The Plan and Design steps from the first canvas draft are dropped. `copywriter` writes
  the step copy in `content/home.ts`. Facts: "How the user works". Replaces the 2026-09-24 loop
  wording (written rules → agents do the work → they check themselves → lessons update the rules)
  and the 2026-09-25 "steps aren't known yet" line.
- 2026-09-25 — The design lives on the Claude Design canvas "Process mascots"
  (https://claude.ai/artifact/7CawmF4tBKgv4ALtJJyE69): desktop and phone boards, a sprite sheet,
  and a reusable Clawd component. One mascot per step: step 1 wears a peaked cap and holds a
  clipboard; step 2 a hard hat and hammer; step 3 a magnifier; step 4 a wrench in one hand and the
  rulebook in the other. Terracotta is the default accent on the canvas, with violet available as
  a tweak. **Superseded 2026-09-25.**
- 2026-09-25 — Clawd is dropped (it's Anthropic's trademark; its guidelines forbid implied
  endorsement and altering the mark). The mascots are now the user's own character, built from
  their new MW logo: three `/` strips cut from one shape whose top edge is an M and bottom edge a
  W, with the two gaps opening into square eyes where they cross the midline (reads the same
  upside down). Logo explored on the Claude Design canvas "MW logo"
  (https://claude.ai/artifact/8WaNGpr3x7qDFw3qupVTio). The canvas "Process mascots"
  (https://claude.ai/artifact/7CawmF4tBKgv4ALtJJyE69) now shows this crew with the current step
  copy — Guardrails, The team, Independent check, Lessons kept — using the site accent (violet),
  with terracotta available as a tweak. Roles unchanged: step 1 a peaked cap and clipboard; step 2
  a hard hat and hammer; step 3 a magnifier; step 4 a wrench and rulebook.
- 2026-09-24 — Process desktop: a ring with the four steps at its quarter points (dot, STEP
  label, title, one line), the heading beside it, direction shown so it reads as a cycle. New
  design beyond v3, so ui-designer specs it. **Superseded 2026-09-25.**
- 2026-09-24 — Process phone: steps stacked in a column on a line down the left, with the line
  curving from step 4 back up to step 1 so it still reads as a loop. **Superseded 2026-09-25.**
- 2026-09-24 — Process static state: the loop line is violet and all four dots are lit. Motion
  (later): GSAP sends a dot travelling round the loop continuously, lighting each step as it
  passes; under reduced motion it stays fully lit. **Superseded 2026-09-25.**
- 2026-09-24 — Process is built as one `<ol>` of four steps that CSS places as a column with a
  bordered return loop below `xl`, or around an `aria-hidden` SVG ring from `xl`; static violet
  lines, all dots lit, `data-anim` hooks in place.
- 2026-09-24 — Audit fix: the process loop label stays available to screen readers at `xl`
  (`xl:sr-only`).
- 2026-09-25 — Process pins its label and heading at 120px from the top from `xl` (two columns
  only from `xl`; CSS sticky, no JS), part of the site-wide split/sticky-title pattern (see
  `../page.md`). Process pins and travels visibly. **Superseded 2026-09-26.**
- 2026-09-25 — Process is being redesigned: the four-step ring (desktop) and the column with a
  return loop (phone) are replaced, per the Claude Design canvas above. Replaces the 2026-09-24
  ring/loop and travelling-dot motion decisions above.
- 2026-09-25 — Each step gets one pixel mascot: Clawd, the Claude Code pixel mascot (a 12×8 cell
  sprite), one per step (no new count beyond the steps); his role in the step shows through
  something he wears or holds; no agent names (facts: "How the user works"). **Superseded
  2026-09-25.**
- 2026-09-25 — Mascot sprite: the MW mark drawn as pixels (15×14) on a 21×18 cell sprite — hats
  above, one arm cell each side, the W's two points are the feet. One mascot per step (no new
  count beyond the steps); the role shows through what it wears or holds; no agent names (facts:
  "How the user works"). **Superseded 2026-09-26.**
- 2026-09-25 — The steps themselves change from the four locked now; the new steps aren't known
  yet. **Superseded 2026-09-25** (same-day decision above locks the four steps).
- 2026-09-25 — Mascots keep Clawd's own colour, terracotta #DA7758 — a new colour token, to be
  added through the `design-tokens` skill before use. **Superseded 2026-09-25.**
- 2026-09-25 — Mascot rendering: inline SVG of `<rect>`s on a 12×8 viewBox with
  `shape-rendering="crispEdges"`, scaled in whole-number cell sizes only. Motion is stop-motion:
  GSAP frame swaps at about 8fps (125ms), moves of whole cells, stepped or no easing, varied holds,
  from a small set of moves (blink, look, bob, shuffle, wave). Never squash, rotate, blur or
  ease-slide. Reduced motion = one static pose. Pause when off screen or the tab is hidden.
  `aria-hidden` unless a label comes from `content/`. **Superseded 2026-09-25.**
- 2026-09-25 — Mascot motion: stop-motion frames are idle, blink, act and sleep. The eyes slide
  along the diagonal gaps — up toward tools held on the right, down toward tools held on the left
  — and a blink closes the eyes back into the gaps. Everything else from the earlier rendering and
  motion rules still holds: whole cells, about 8fps, reduced motion shows one static pose, pause
  when off screen, `aria-hidden`. **Superseded 2026-09-27** (stop-motion framing; the eyes-slide-
  along-the-gaps idea is kept, now as smooth pointer-follow motion — see below).
- 2026-09-25 — The Process redesign is led by the user's Claude Design export: the export's steps,
  what each mascot wears or holds, the mascot colour and whether the site accent changes are all
  taken from the design, not decided ahead of it. **Superseded 2026-09-25** (the export has now
  landed; see the canvas decision above).
- 2026-09-26 — Mascot colour: the body uses the existing violet accent; no new token, and
  terracotta is dropped.
- 2026-09-26 — Layout: the canvas's stacked layout, replacing the sticky-title split — the heading
  sits above the steps at every width, and Process no longer pins its title column (`stickyTitleXl`
  is being removed from `lib/styles.ts`; see `../page.md`). Supersedes the 2026-09-25 pin decision
  above.
- 2026-09-26 — Built per `ui-spec/05-process.md` (rewritten 2026-09-26): below `lg`, a phone row
  shows an 84px bot beside the text, then a return row; from `lg`, four across with 126px bots on
  a 2px ground line, three chevrons between them, and a dashed violet return path from bot 4 to
  bot 1 carrying the loop label. Each bot is one `aria-hidden` SVG with four frame groups (idle,
  blink, act, sleep), only the static pose visible (step 3 `act`, the others `idle`); motion hooks
  only, no motion yet. **Pixel-cell parts superseded 2026-09-26** (4px/6px cells, `crispEdges`,
  whole-cell rects — mascots are now vector, see below; the layout otherwise still holds).
- 2026-09-26 — Step numbers read two digits ("Step 01"), as on the canvas.
- 2026-09-26 — The lone cream "job block" square from the canvas is left out. **Superseded
  2026-09-28.**
- 2026-09-26 — Mascots are a sharp vector, not pixels (the logo is sharp; the mascot was
  pixelated): the body is the logo's own geometry, with square eye holes in the gaps that jump
  along them; hats and tools are flat, sharp-cornered shapes using the logo's 45° language. Roles
  unchanged: a peaked cap and clipboard; a hard hat and hammer; a diamond magnifier; an open-end
  wrench and rulebook. The canvas "Process mascots"
  (https://claude.ai/artifact/7CawmF4tBKgv4ALtJJyE69) shows the vector crew. Supersedes the
  2026-09-25 pixel-sprite decision and the pixel-cell parts of the 2026-09-26 build decision above.
- 2026-09-26 — Motion: the bots breathe — stop-motion, stepped, no tween: rest → half → full →
  half over 2.25s (125ms steps); the body stretches up from the feet, with the hat and tools
  riding along; the four bots run out of phase. Paused off screen or when the tab is hidden; off
  under reduced motion (one static pose). **Superseded 2026-09-27.**
- 2026-09-26 — Motion stays stop-motion frame swaps at about 8fps for blink/act/sleep too (user's
  choice, over smooth tweens). **Superseded 2026-09-27.**
- 2026-09-26 — The bot SVG is `overflow-visible`, not `overflow: hidden`, so the update wrench's
  jaw isn't clipped (lead's decision). `ui-spec/05-process.md` §5.8 choice 8's clipped-jaw choice
  is stale/overridden.
- 2026-09-26 — Process motion built: the header and each step's text reveal on scroll (fade only
  under reduced motion). **Bot part (breathe and swap frames in stop-motion on one shared 125ms
  clock, each looping its own out-of-phase script of blinks, act stretches and occasional naps)
  superseded 2026-09-27.**
- 2026-09-26 — Lead's checks: build and lint are green, with no sideways scroll at 360/768/1440/3840.
  In a real browser, full motion showed breathing and frame swaps; under reduced motion each bot
  stayed in its static pose with no transforms; the reveals ended at opacity 1.
- 2026-09-27 — User's decision: the Process bots move to fully smooth GSAP motion (tweens and
  easing, squash and stretch, rotation), replacing stop-motion. Each bot becomes one rig with
  movable parts (eyes, arms and tools, hat, per-role effects such as sparks, a flipping page and
  floating z's) instead of four frame groups. It gets a living idle (breathing, sway, blinks,
  look-arounds), role acts (clipboard writing, hammer strikes, magnifier scans, wrench ratchets)
  and naps. On top of that come four extras the user chose: the eyes follow the pointer along
  their gaps (fine pointers); a scroll-in entrance where the bots drop onto the ground line; a crew
  relay where an accent dot travels the ground line and return path and each bot reacts as it
  passes (from `lg`; below `lg` the bots react in turn). **"Below `lg` the bots react in turn"
  superseded 2026-09-28** (the crew relay now runs below `lg` too, as a vertical relay — see
  below); and a hover/tap reaction (jump and act).
  **Jump narrowed 2026-09-28** (see below). Reduced motion stays per constitution §5: fades only,
  static poses. Spec:
  `ui-spec/05-process.md` §5.6–5.7 (rewritten 2026-09-27).
- 2026-09-27 — User's decision: the bots get separate feet — the W's two bottom points are cut off
  the strips as their own foot pieces, so at rest the silhouette is exactly the logo, with no
  visible seam. In motion the feet stay planted while the body breathes, squashes and crouches; on
  a jump they leave last and land first; they tap during idle and shuffle during hammer strikes.
  The body now stretches from the top of the feet. Spec: `ui-spec/05-process.md` §5.6–5.7.
- 2026-09-28 — User's change: the bots jump only on user interaction (hover or tap). The relay
  catch (and the cascade below `lg`) no longer hops — a caught bot plays its full role act instead,
  "they play their part when it's their step" — and waking from a nap no longer hops either: it's a
  startle with the feet planted. The magnifier's "found it" is an eye pop, not a hop. The hover/tap
  reaction stays a jump plus the short act. The scroll-in drop stays (it's a fall, not a jump).
- 2026-09-28 — After a relay/cascade catch or a hover/tap reaction, the bot's timed act scheduler
  restarts, so its next random act comes the usual 5–10s after it ends and never stacks right
  behind it (`lib/processBotActs.ts` `nextActAfter`).
- 2026-09-28 — From `lg`, the loop label gets `lg:z-10` (`ProcessReturn.tsx`), so the relay dot
  passes behind it along the return path, as the dashed line does. Animating transform or opacity
  on the `process-return` box or its parent would create a stacking context and break this.
- 2026-09-28 — The relay job is built per ui-spec §5.7 (revised 2026-09-28), with the lead accepting
  its choices 16–24: the job paints behind the bots **(superseded 2026-09-28, see below)**, a cream
  spark traces the return **(superseded 2026-09-28, see below)**, the return lights violet, chevrons
  flash cream, team strikes twice on a relay catch, the relay runs every 15s (the run is about 12s;
  the cascade stays at 9s **(superseded 2026-09-28, see below — the crew relay now runs below `lg`
  too, as a vertical relay)**), and timed acts and naps keep clear of a bot's catch (`RELAY_CLEAR`).
  Supersedes the 2026-09-28 "relay dot becomes the job" plan line and the 2026-09-26 "lone cream job
  block ... left out" line.
- 2026-09-28 — User revises the relay job: the job paints above the bots and below the loop label
  (relay layer `z-1`, label `lg:z-10` with a taller `bg-bg` backing: `lg:px-5 lg:py-3`), so it never
  peeks from behind a bot and is fully hidden while it passes behind the label. It grows to 24px
  with a clear mark from each bot: rules writes two lines and a violet stamp, team adds the band and
  step, check adds the tick with an outline glow, update folds the corner. It stays about 3s at each
  bot **(superseded 2026-09-28, see below)**. After bot 4 the job itself rides the dashed return path
  (replacing the cream spark, which is removed) back to bot 1 **(superseded 2026-09-28, see below —
  the job now stops at the ground line's end and a separate lesson card rides the return; the trail
  ghosts stay with the job, not this return ride)**. Runs are about 20s apart from `lg`
  **(superseded 2026-09-28, see below)**. Supersedes the "job paints behind the bots" and "a cream
  spark traces the return" parts of the earlier 2026-09-28 relay-job entry.
- 2026-09-28 — User revises the relay job's timing and side: it stops 2s at each bot (was 3s), and
  sits on the right of every bot, bots 1 and 4 included (it was on their left — the clipboard and
  the rulebook); each bot watches it on that side. It repeats about every 16s, so the gap between
  runs stays about 2s. Supersedes the "about 3s at each bot" and "Runs are about 20s apart from `lg`"
  lines from the entry above.
- 2026-09-28 — While a bot is active (any act: its relay step, the cascade step, its timed acts, the
  loop-back squash) or already reacting, hover and tap are ignored; there's no queued jump. A napping
  bot still wakes and jumps on hover or tap. Eye and lean follow are unchanged. **Narrows the
  2026-09-27 "hover/tap reaction (jump and act)" extra and its "interrupts naps and idle acts" detail
  in `ui-spec/05-process.md` §5.7 (superseded there, not deleted).**
- 2026-09-28 — User's decision: after bot 4 the job is complete, not carried back. It slides right
  along the ground line to the line's end, pops once as done, and fades out there, with no sideways
  scroll. At the same moment a small lesson card (14px cream card with a cut corner and one violet
  line, like a rulebook page) splits off at bot 4 and rides the dashed return path back to bot 1,
  lighting it, hidden behind the loop label as it passes; bot 1 takes it with the squash at the
  arrowhead. The three trail ghosts stay with the job (its hops and exit slide), not the lesson card
  — the return path carries the lesson card alone, no ghosts. Supersedes the "After bot 4 the job
  itself rides the dashed return path ... back to bot 1" clause in the 2026-09-28 relay-job-revision
  entry above (superseded, not deleted).
- 2026-09-28 — User's decision: the crew relay runs below `lg` too (phones and tablets), as a
  vertical relay per `ui-spec/05-process.md` §5.9 (choice 27). The job is 16px, waiting at each
  bot's right foot and dropping down the bot column past only the next bot's hand and tool.
  There's no track: the ghosts only show the path, and the static page is unchanged. After bot 4,
  the job drops to the return row, pops and fades. **A 10px lesson rises in at the return icon
  (which flashes) and rides the column's left edge up to bot 1's clipboard — superseded
  2026-09-28** (bot 4 hands the lesson over instead; see below). The clock is the
  desktop one. It replaces the 9s cascade below `lg`. Supersedes the 2026-09-27 "below `lg` the
  bots react in turn" clause and the 2026-09-28 "the cascade stays at 9s" clause above (both
  superseded, not deleted).
- 2026-09-28 — User's decision: on phones (below `lg`), bot 4 hands the lesson over. As the job
  leaves, the lesson appears in bot 4's rulebook hand (screen left), and he looks at it briefly
  (about 0.6s); then it lifts off and rides straight up the column's left edge to bot 1's
  clipboard, where bot 1 receives it. This replaces, below `lg`, the lesson splitting and peeling
  off the job beside the wrench, fading there, and rising in at the flashing return icon — the
  icon no longer flashes. The desktop relay is unchanged. Spec: `ui-spec/05-process.md` §5.9,
  choice 27(c) (marked superseded there, not deleted).

## Open Questions

- **Fact:** `docs/03-facts.md` → "How the user works" doesn't yet back the new step wording. The
  gaps are specialized agents, a defined boundary, a separate agent that verifies and validates
  (the facts currently say the agents "check their own work"), rules enforced, and the workflow
  updated each cycle or session. Also, a single "separate agent" may touch the "no counts" line.
- **To build:** the logo itself (nav, favicon, sharing image) isn't on the site yet; adopting it
  is a separate change that needs the user's yes.
- **Review:** the user should judge the feel on a real screen: how often the eyes look around
  (every 0.8–2s), the hammer's pacing, the foot seam during a squash, and full acts on every relay
  step (every 16.4s at every width); whether 2s stays and 16.4s runs feel right.
- **To build:** whether to bring back the hold bob and watch blink (shorter `JOB_BOB` / lower
  `RELAY_WATCH_BLINK`) now that 2s stops leave no time for them.
- **Review:** the cream lesson sits on the cream rulebook during the phone handover, so it reads
  subtly, as the rulebook gaining a violet line; the user should judge whether that's enough contrast.
- **Review:** below `lg`, bots 2 and 3's left arms come within about 0.7px of the lesson's lane (as
  close as 0.2px with sway) but never touch a face or body; the user should judge whether that's too
  tight.
- **To build:** recheck the phone lesson handover at 360 and 768 once the dev server's 500 (from the
  in-progress Proofs `cardShotAlt` removal) is fixed — only 390 has been screen-checked so far.
