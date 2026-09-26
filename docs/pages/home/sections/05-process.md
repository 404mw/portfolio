# Process

**Last Updated:** 2026-09-26

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
clipped. The motion pass is done: `ProcessMotion` (client, renders nothing) mounts
`useScrollReveal` (the header and each step's text fade/rise in on scroll, once) and
`useProcessBots` (each bot's SVG breathes and swaps frames in stop-motion on one shared 125ms
clock via `lib/processBotMotion.ts`'s per-role scripts, paused off screen or with the tab hidden
via `lib/watchLive.ts`, off under reduced motion where every bot stays at its static pose with no
transforms).

## Key Files

- `components/home/process/` — ProcessSection, ProcessList, ProcessStep, ProcessBot, ProcessReturn,
  ProcessMotion
- `lib/processBots.ts` — the bots' vector geometry (body strips, eyes, hats, tools) and each step's
  role/static pose
- `lib/processBotMotion.ts` — the breathing cycle and per-role frame scripts, and the per-bot
  player that steps/resets them
- `hooks/useProcessBots.ts` — the shared 125ms stop-motion clock, gated by `watchLive` and reduced
  motion
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
  when off screen, `aria-hidden`.
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
- 2026-09-26 — The lone cream "job block" square from the canvas is left out.
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
  under reduced motion (one static pose).
- 2026-09-26 — Motion stays stop-motion frame swaps at about 8fps for blink/act/sleep too (user's
  choice, over smooth tweens).
- 2026-09-26 — The bot SVG is `overflow-visible`, not `overflow: hidden`, so the update wrench's
  jaw isn't clipped (lead's decision). `ui-spec/05-process.md` §5.8 choice 8's clipped-jaw choice
  is stale/overridden.
- 2026-09-26 — Process motion built: the header and each step's text reveal on scroll (fade only
  under reduced motion), and the four bots breathe and swap frames in stop-motion on one shared
  125ms clock, each looping its own out-of-phase script of blinks, act stretches and occasional
  naps; paused off screen or with the tab hidden, off under reduced motion.
- 2026-09-26 — Lead's checks: build and lint are green, with no sideways scroll at 360/768/1440/3840.
  In a real browser, full motion showed breathing and frame swaps; under reduced motion each bot
  stayed in its static pose with no transforms; the reveals ended at opacity 1.

## Open Questions

- **Fact:** `docs/03-facts.md` → "How the user works" doesn't yet back the new step wording. The
  gaps are specialized agents, a defined boundary, a separate agent that verifies and validates
  (the facts currently say the agents "check their own work"), rules enforced, and the workflow
  updated each cycle or session. Also, a single "separate agent" may touch the "no counts" line.
- **To build:** the logo itself (nav, favicon, sharing image) isn't on the site yet; adopting it
  is a separate change that needs the user's yes.
