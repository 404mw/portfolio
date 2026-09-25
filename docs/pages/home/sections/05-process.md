# Process

**Last Updated:** 2026-09-25

**The one question:** How do they work?

See `../page.md` for the site-wide index. Spec: `../ui-spec/05-process.md`.

## Current State

The static ring build is still live in code: Process pins its label and heading at 120px from the
top from `xl` (two columns only from `xl`; CSS `sticky`, no JS), using the shared `stickyTitleXl`
helper in `lib/styles.ts` (see `../page.md`). It's built as one `<ol>` of four steps that CSS
places as a column with a bordered return loop below `xl`, or around an `aria-hidden` SVG ring
from `xl`; static violet lines, all dots lit, `data-anim` hooks in place. The Claude Design export
has landed (see Decisions) with the four steps and mascots, now redesigned around the user's own
MW logo (Clawd dropped); the mascot colour is still open (see Open Questions), and the redesign
itself isn't built yet.

## Key Files

- `components/home/process/` — ProcessSection, ProcessLoop, ProcessStep, ProcessRail, ProcessRing

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
  `../page.md`). Process pins and travels visibly.
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
  "How the user works").
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

## Open Questions

- **Fact:** `docs/03-facts.md` → "How the user works" doesn't yet back the new step wording. The
  gaps are specialized agents, a defined boundary, a separate agent that verifies and validates
  (the facts currently say the agents "check their own work"), rules enforced, and the workflow
  updated each cycle or session. Also, a single "separate agent" may touch the "no counts" line.
- **Choice:** mascot colour — the existing violet accent (canvas default, no new token) or
  terracotta (would need a new token via `design-tokens` and the user's yes).
- **To build:** the logo itself (nav, favicon, sharing image) isn't on the site yet; adopting it
  is a separate change that needs the user's yes.
