# Process

**Last Updated:** 2026-10-09

> **Status:** In build. Round 2 (recast around control: new heading, lead, step order, hand-off at
> step 3, send / straight / fix relay) is built and lead-checked (lint, `tsc`, build; no sideways
> scroll or page errors at 360, 768, 1024, 1440, 3840; 2026-10-09). Process shows a five- or six-step flow per About card (five flows: default
> and four cards; the website flow was removed 2026-10-07; lint, `tsc` and the production build are
> green, 2026-10-07; the SEO pass's hidden all-flows list is built, checked in the built HTML only,
> not deployed); the bots' life, the
> crew relay (rebuilt for five or six steps), the swap fade and the phone ledges (static and their
> motion, the job hopping ledge to ledge) are built and lead-checked in headless Chromium
> (2026-10-04, 2026-10-05; Safari, Firefox and real devices unchecked). Open: the user's calls on
> copy, the new emblems and the ledges, and the known limits below.

**The one question:** Can I trust it with my customers?

See `../page.md` for the site-wide index. Spec: `../ui-spec/05-process.md` (§5.10 flows and
roles, §5.7 motion); the bots' built motion is `../ui-spec/05-process-motion.md`; the earlier
four-step relay spec is `../ui-spec/05-process-relay-legacy.md`; the pick and the tag are in
`../ui-spec.md` §0.5–0.6.

## Current State

The label is "You stay in charge" and the heading "Hard calls / **come to you.**" (second line
accent; two lines at 360, 768, 1440 and 3840, one line at 1024). The lead (`process.lead`): "Routine
jobs are done to your standards and checked before they go out. Refunds, complaints and anything unusual
are passed to you instead."

`ProcessSection` (server) stacks the label and heading above `ProcessFlow` at every width (no
pinning), with `ProcessMotion` (renders nothing) after them. `ProcessFlow` (client) reads the shown
set (`useShownSet`, the About pick through `pickSet`: `default` with no pick, for Just exploring and in
the server markup) and draws, in a wrapper carrying `data-set` and `data-count`: the "Shown for" tag
(`ShownForTag`, sectionId `process`), the flow's sample-job caption (`process.flows[set].caption`),
then a body keyed by set, so a pick remounts it. The body is `isolate` and holds `ProcessList`,
`ProcessReturn` and the hidden `ProcessRelay` layer. Swaps fade: `ProcessFlow` has a ref on the
`process-flow` root and `useSwapFade` registers `process-caption` and the keyed body (the flow's
last child) with the shared store (`lib/shownSet.ts`), which fades them out (0.15s), changes the set
in one commit for Agents, Process and the bots, and fades them in (0.25s); opacity only, the same
under reduced motion. The tag never fades. Without JavaScript the tag hides and the `default` flow
shows.

Flows are `process.flows.<set>` in `content/home.ts` (caption, steps with title and line, and, for
the four flows with loops, `loopLabel` and `fixLabel`). Default, online-store and discord
have five steps; service-business and software-builder have six. Bots per step are
`lib/processFlows.ts` `flowRoles` (type-tied to the steps, so a step can't exist without its bot):
four flows run Job arrives (intake) → Your standards (rules bot) → Hard calls (flag) → Done (team) →
Checked (check); service-business then adds remind and software-builder ship (the software-builder
copy is reordered in peer words). Each looped flow has a `handoffLabel` ("To you", "To you or your
staff", "To a person"). Discord is its own
flow, a bot's behaviour and not a job run through checks: Mentioned, Your tone, Remembers,
Connected, Always on (caption "Example: a member's @mention"), with bots intake, rules, update, ship,
host. `rolePose` stands `check` and `flag` in `act` and every other role in `idle`;
`flowSteps(set)` gives each step its copy, role and pose.

Loops: `hasLoops` in `lib/processFlows.ts` (type-tied to whether a flow's copy has both labels) is
`false` for discord only; `flowLoops(set)` returns the labels or `null`. `ProcessFlow` puts
`data-loops="on"` or `"off"` on the wrapper and passes the fix label to `ProcessList` and the return
to `ProcessReturn` only when there are loops, so discord renders no return and no fix elements. The
return loop's label is the flow's `loopLabel`, and its path lands on step 2 (the standards step).

Layout: `lib/processLayout.ts` `flowLayouts` holds the classes that depend on the step count (grid,
chevron offset, return box), as literal strings for Tailwind. Below `wide` (1440px, `--breakpoint-wide`, `@media (min-width:90rem)`) the steps are rows (an
88px bot beside the text, then a return row with an icon and the label); from `wide` they stand across
a 2px ground line with chevrons between them and a dashed return path from the last bot back to
step 2's, carrying the label. Below `wide` each bot stands on its own ledge (see Phone ledges). Five and six across both use a 32px gap (`wide:gap-x-8`), with the 136×88 bots; six fit at 1440 with a 25px minimum title gap (lead-checked). Only the section heading and lead gaps still change at `lg`. `ProcessReturn` takes the layout and
the label; its label carries `wide:z-10`.

The job is the picked card's emblem: `lib/processEmblems.ts` `processEmblem(set)` returns the card's
emblem (`aboutReplyProp`, geometry in `lib/rixProps.ts`) or, for `default`, the plain job sheet.
`ProcessEmblem.tsx` draws it in step 1's (intake) bot's hand, visible at rest
(`data-bot="prop"`, `data-prop`). `ProcessRelay` holds three ghosts, the job (`ProcessJob`) and the
lesson (`ProcessLesson`) at `opacity-0`, aria-hidden, which the relay moves.

Bots: each is a vector SVG built from the logo's MW strips (`lib/processBots.ts`; roles
`rules`, `team`, `check`, `update`, `host`, `intake`, `flag`, `remind`, `ship`; `update` and `host`
are used in the Discord flow), with separate feet cut from the W tips, so at rest each looks exactly
as the logo. `data-bot` hooks: rig, feet, upper, body, eyes, arms, tool, hat, plus per-role extras.
The SVG is `overflow-visible`.

Motion (`ProcessMotion` runs `useScrollReveal` and `useProcessBots(section, set)`): header and step
text reveal on scroll; the bots get smooth GSAP life (breathing, sway, arm drift, blinks, looks, foot
taps), role acts (the new roles `intake`, `flag`, `remind` and `ship` play the host's nod,
`lib/processBotFlowActs.ts`), naps, eyes and lean following the pointer (fine pointers), a hover or tap
reaction (the only time a bot jumps, skipped while acting or reacting) and a once-per-load drop-in.
Everything runs in one registry, paused off screen or with the tab hidden. On a new set the hook
re-runs (`revertOnUpdate`, dependency `set`): it lets go of the old bots and rigs the new ones,
already shown at rest with life started, no second drop-in. Reduced motion is an opacity fade in,
then the static pose.

The crew relay is on (`RELAY_ON = true` in `lib/processBotMotion.ts`), once the bots have landed
(from `RELAY_FIRST` 1.5s). `lib/processRelayPlan.ts` gives a run's visits in step order (one stop per
step, each for its role's `RELAY_DWELL`, a `RELAY_HOP` apart); `processRelayRun.ts` plays them on one
story shared by both geometries: along the ground line from `wide` (`lib/processRelay.ts`, `relayQuery = "(min-width: 90rem)"`), ledge to
ledge down the bot column below it (`processRelayColumn.ts`, `processRelayLedge.ts`). Step 1's held emblem (`data-bot="prop"`) is the job:
at the hand-off (`processRelayHand.ts`) the travelling job takes its place and the emblem hides, and
it returns, popping in, when the next run starts. At each stop the bot catches the job and the job
changes on the bot's beat (`processRelayJob.ts`; the new roles `intake`, `flag`, `remind`, `ship` and
`host` have their own acts in `lib/processBotFlowActs.ts`), then it hops on, bots tapping as it
heads their way. After the last bot the job slides on to the line's end (from `wide`; below it, on
the last ledge) and pops "done" and fades. In a flow with the return, the lesson splits off at the last bot and rides the return back; it ends on
step 2 (`lessonTaker`: the rules bot). Discord is a one-way pass: no lesson and no fix hop. There is
no fixed rhythm: the next run starts `RELAY_REST` (2s) after the last one ends. Runs cycle send →
straight → fix (`RUN_CYCLE` in `lib/processBotMotion.ts`; a flow without the loop skips what it
lacks). Hand-off: `components/home/process/ProcessHandoff.tsx` at step 3 (`HANDOFF_STEP = 2`),
labelled by `handoffLabel`; from `wide` a dashed stem going up, below `wide` a marker row with an arrow.
On a send run the flag bot raises its flag and the job climbs the stem
(`lib/processRelayHandoff.ts`), or drops onto the marker on phones. Run lengths, default flow at
1440: send 7.48s, straight 15.23s, fix 20.45s; Discord about 11.8s (older measures for the six-step
flows are stale). Reduced motion has no relay.

Fix loop: in every flow with loops, step 4 (the team step, `FIX_STEP = 3` zero-based in
`lib/processFlows.ts`, rendered after it by `ProcessList`) ends with `ProcessFixReturn`
(`process.flows.<set>.fixLabel`, the box's right edge from `flowLayouts[n].fixBox`), the work going
back from the check at step 5 (`FIX_STEP + 1`, `fixStop` in `lib/processRelayPlan.ts`) to step 4. From
`wide` a dashed arch stands over bots 4 and 5 with its label above
it, on a `bg` mask at `z-10`, and the caption-to-steps gap is `wide:gap-24`; below `wide` it is a marker
row at the end of step 4 holding the label, beside a dotted `accent` bracket (`process-fix-line`,
with an arrowhead onto bot 4) down the bot column's left edge from bot 5's hand up to bot 4's. It
shows at rest. On each fix run in the cycle (`RUN_CYCLE`), only in a flow with loops, the check at step 5 finds something (its eyes pop, "found it", only
on this run), the job shakes and goes back over the arch to step 4, which redoes its act, then
forward to the check again (`processRelayFix.ts` from `wide`; the hop adds 5.2s there, 5.5s below
`wide`). `process-fix-lit` lights with a `clip-path` reveal, the same technique as
`process-return-lit`; below `wide` `process-fix-line-lit` lights behind the job along the dotted line
and fades as the job hops forward (see Phone ledges). Motion never writes `process-fix`
or step 4's `<li>`. The Discord flow has no fix loop, and its caption gap is `wide:gap-12` (48px).

Phone ledges: below `wide` each step's bot stands on its own ledge, `ProcessLedge` (placed by
`ProcessStep` after the bot; every `<li>` is `relative` with no z-index): a 2px `bg-line` bar
(`process-ledge`) at x 18–88 of the row, its top on the bot's feet, hidden from `wide` where the ground
line does this job, holding a lit overlay (`process-ledge-lit`, the ground-lit gradient,
`opacity-0` at rest). There is no vertical rail. The ledges and the dotted fix line show at rest,
without JavaScript and under reduced motion. Under full motion the job hops ledge to ledge
(`lib/processRelayColumn.ts`, `lib/processRelayLedge.ts`): each hop is a thrown arc, `LEDGE_HOP` (6px
lift above the higher ledge, rise and fall split by the square roots of their heights); stops 2…n
land at each bot's `JOB_AT` on its ledge's top; at the hand-off the job drops out of the hand onto
ledge 1 over `JOB_HAND_OFF`, then hops on. Each `process-ledge-lit` fades in as the job lands and out
as it hops off (`LEDGE_LIT`: 0.15s in, 0.35s out); ledge 1 only flashes at the hand-off; on the last
ledge the job pops "done" and fades with its light and there is no exit slide. On the fix run the
job goes back along the dotted fix line (`lib/processRelayFixLine.ts`): left off ledge 5, up the
bracket, through the arrowhead into bot 4's hand, onto ledge 4, in `FIX_LINE_HOP` (1.1s
`power1.inOut`). The route is measured from the bracket's box (`process-fix-line`, read only) at
setup, resize and refresh, and turns 3 points per quarter circle; `process-fix-line-lit` lights
behind the job by `clip-path` and fades as the job hops forward; the ghosts trail the route. A flow
with no fix line falls back to the straight rise from ledge 5 to 4 (`FIX_HOP`, 0.8s), unlit. From
`wide` the fix hop is unchanged. The lesson keeps its lane up the left edge, over the
fix line's ends. A step with no lit overlay just doesn't light. Under reduced motion nothing hops
or lights (the relay runs only under full motion). Without the exit drop, Discord's phone run ends
about 0.35–0.5s sooner than its 11.8s; the other flows' phone run lengths are not re-measured.

Lead check 2026-10-09 (Claude in Chrome, exact-size iframes, :3000 dev server; lint, `tsc` and build pass): 360, 768, 1024, 1279 and 1439 are stacked, and at 1024 the "To you" marker sits under step 3's line with no overlap once the reveal settles. At 1440 the five-step flows are across with a 32px gap; service-business and software-builder are six across with a 25px minimum title gap, "Your standards" fits, and the stem, fix loop and lesson clear the text. At 3840 it is six across with a 32px gap. No sideways scroll at any width checked. With JavaScript off (1440) every section and all text shows. The browser extension disconnected before the animation frame capture.

Lead check 2026-10-05 (production build, headless Chromium): lint, tsc and build green. Static at
360, 768, 1024, 1440 and 3840, for three sets: ledges flush under the feet (x 18–88), the fix line
dotted from bot 3 to bot 4, its label on one line, no sideways scroll, no console errors, and from
1024 unchanged. Full motion at 360 and 768: the job lands on every ledge in order within about 4px,
each ledge lights in turn; on the fix run (every second run, `FIX_EVERY`) the job goes 4 to 3 to 4.
Safari, Firefox and real devices are unchecked.

Lead check 2026-10-05 (production build, headless Chromium, service-business, fix run along the
line): lint, tsc and build green. At 360 and 768 the job's centre is 0–1.4px off the line on the
climb, the light fills behind it, no sideways scroll, no console errors. Real devices unchecked.

Lead check 2026-10-04 (production build, Discord flow): lint and build pass. At 360, 768, 1024,
1440 and 3840 discord shows five steps with bots intake, rules, update, ship, host, `data-loops="off"`,
no return and no fix elements, no sideways scroll and no console errors; online-store and default
still show both loops (`data-loops="on"`). Section height, discord vs a five-step flow with loops:
1249 vs 1359 at 360; 1179 vs 1264 at 768; 868 vs 1022 at 1024; 937 vs 1081 at 1440; 945 vs 1089 at
3840. Switching sets by the tag (Discord, Online store, Discord, Developer or team, Discord) at 1440
re-rigs the bots with no errors.

Lead check 2026-10-03 (production build, after the fix loop): both loops render at 360, 768, 1024,
1440 and 3840 (top arch and label from `wide`, marker row in step 3 below it), no sideways scroll, no
console errors; tsc, lint and build are green.

Lead check 2026-10-03 (production build): at 360, 768, 1024, 1440 and 3840 no sideways scroll, no
tap target under 44px and no console errors; `?for=` sets the flow; six steps fit at 1024; the tag
sets the pick by pointer and keyboard; with no JavaScript the `default` flow renders and the tag
hides.

## Key Files

- `components/home/process/` — ProcessSection, ProcessFlow (the set's flow and the tag),
  ProcessList, ProcessStep, ProcessBot, ProcessEmblem (the job in step 1's hand), ProcessReturn,
  ProcessFixReturn (the fix loop, step 5 back to 4; dotted bracket below `wide`), ProcessLedge (the
  phone ledge under each bot below `wide`),
  ProcessRelay, ProcessJob, ProcessLesson, ProcessMotion
- `components/home/process/ProcessHandoff.tsx` — the hand-off at step 3 (dashed stem from `wide`,
  marker row with an arrow below); `lib/processRelayHandoff.ts` — the flag raise and the job's climb
  or drop on a send run
- `components/home/process/ProcessAllFlows.tsx` — the `hidden` server-rendered list of every flow
  (caption, step titles and lines), for search engines and AI models
  (rendered by `ProcessSection` after `ProcessFlow`, outside it)
- `lib/cardSets.ts` — the card sets and their labels, derived from `about.replies` through
  `pickSet`
- `components/home/pick/ShownForTag.tsx` — the "Shown for" tag (see `sections/02a-about.md`)
- `hooks/useShownSet.ts` — the set the flow draws (the About pick through `pickSet`)
- `lib/aboutPick.ts` — `pickSet`, the pick-to-set mapping
- `lib/processFlows.ts` — each set's roles per step, `hasLoops` and `flowLoops`, `rolePose`,
  `flowSteps`, `HANDOFF_STEP = 2`, `FIX_STEP = 3`
- `lib/processLayout.ts` — the step-count-dependent layout classes
- `lib/processEmblems.ts` — the job each flow follows (the card's emblem, or the job sheet)
- `lib/rixProps.ts` — the emblems' geometry (shared with About)
- `lib/processBots.ts` — the bots' vector geometry (body strips, eyes, hats, tools), the roles and
  their static poses; also the bare `host` role used by About's mascot
- `components/home/process/ProcessFlow.tsx` also names the swap-fade wrappers (`useSwapFade`)
- `hooks/useSwapFade.ts`, `lib/shownSet.ts`, `hooks/useShownForMotion.ts` — the shared swap fade
  and the tag's open fade (see `../page.md`)
- `hooks/useProcessBots.ts` (wiring: the relay's runs, `RELAY_REST`, `RUN_CYCLE`)
- `lib/processBotMotion.ts` (constants, including `RELAY_ON`, `RELAY_REST`, `RUN_CYCLE`)
- `lib/processBotRig.ts` (hooks, pivots, summed channels, reset)
- `lib/processBotLife.ts` (breathing, sway, drift, blinks, looks, taps)
- `lib/processBotActs.ts` (role acts, the reaction jump, relay catches, naps)
- `lib/processBotFlowActs.ts` (the acts of `intake`, `flag`, `remind`, `ship`; `host` uses the nod)
- `lib/processBotMoves.ts` (shared bot moves)
- `lib/processBotEntrance.ts` (drop-in)
- `lib/processBotPointer.ts` (pointer to look/lean mapping)
- `lib/processBotCrew.ts` (the one registry that pauses everything)
- `lib/processRelayPlan.ts` (a run's visits and clock), `lib/processRelayRun.ts` (the story both
  geometries share), `lib/processRelay.ts` (ground line, from `wide`), `lib/processRelayColumn.ts`
  (bot column, below `wide`), `lib/processRelayLedge.ts` (the ledge hop and each ledge's light, below
  `wide`), `lib/processRelayFixLine.ts` (the way back along the dotted fix line and its light, below
  `wide`), `lib/processRelayJob.ts` (the job's changes on each bot's beat),
  `lib/processRelayHand.ts` (the emblem hand-off), `lib/processRelayFix.ts` (the fix hop),
  `lib/processRelayLesson.ts`, `lib/processRelayTrail.ts`, `lib/processJob.ts`,
  `lib/processLesson.ts` — the crew relay (on)
- `hooks/useScrollReveal.ts` — the reusable scroll-reveal hook this section uses (see `../page.md`)
- `lib/watchLive.ts` — on-screen/tab-visible watcher, reused from elsewhere
- `components/icons/ChevronRightIcon.tsx`, `components/icons/CornerUpLeftIcon.tsx`

## Decisions

- 2026-10-09 — User's call: the Process flow goes side by side from `wide` (1440px, new token `--breakpoint-wide: 90rem`), not `lg` or `xl`; below 1440 it uses the stacked layout phones and tablets get (steps stacked, the hand-off a marker row with an arrow, the job dropping onto the marker). Why: "Your standards" (24px display) overflowed its 161px column at 1024, and at 1280 the six-step flows still ran it into "Hard calls" in a 168px column; from 1440 every flow fits (gap 25px; 1600 and 3840 clean). Six-step flows at 1440 and up use the 32px gap. Section heading spacing still changes at `lg`. Supersedes the `lg` breakpoint in the 2026-10-08 hand-off wording below.
- 2026-10-09 — User's call: "rules" becomes "standards" across the home page, except the Discord demo's "#rules" channel: the step "Your rules" → "Your standards", the lead, and the loop and fix labels in every flow (landed in `content/home.ts`; facts file unchanged). Supersedes the "your rules" wording in the 2026-10-08 line below, which stays as history. See `../page.md`.
- 2026-10-07 — SEO pass (user-approved): the same for flows: `ProcessAllFlows`, a `hidden` server-rendered block with each card's caption and step titles and lines, placed outside `ProcessFlow` so the swap fade's `lastElementChild` is unchanged.
- 2026-10-07 — The website flow is removed with the About card "I need a website" (user's call, see
  `02a-about.md`); five flows remain: default and four cards.
- 2026-10-05 — User's request ("the object should go back from the dotted route instead of a step back"): below `wide` the fix run's job goes back along the dotted fix line (left off ledge 4, up the bracket, through the arrowhead into bot 3's hand, onto ledge 3) in 1.1s `power1.inOut` (`FIX_LINE_HOP`), with `process-fix-line-lit` lighting behind it, instead of rising straight up the bot column.
- 2026-10-05 — User's call: below `wide` the phone track is cut. A short 2px `bg-line` ledge under every bot replaces the vertical rail, and the emblem hops ledge to ledge, each ledge lighting violet as it lands (built). The fix loop's ↰ icon becomes a dotted `accent` bracket on the left from step 4's bot up to step 3's bot, with the label "Breaks your rules? Redone." beside it. Nothing changes from `wide`. Spec: `ui-spec/05-process.md` §5.3a, §5.7, §5.9, choices 53–61; the old track spec is `ui-spec/05-process-track-legacy.md`.
- 2026-10-03 — Process no longer shows one fixed "how I work" flow. Each About card gets its own
  flow, `process.flows.<set>`, showing the agent doing that visitor's job (following the card's lead
  offer), with the user's rules; every flow but Discord has a separate check and the lesson loop
  built into the steps. Flows are illustrations (constitution §7.5).
- 2026-10-04 — The Discord flow has no check and no loops: it shows the bot's own behaviour in five
  steps (Mentioned, Your tone, Remembers, Connected, Always on), with no "Second check", fix return
  or bottom return loop, and `process.flows.discord` has no `loopLabel` or `fixLabel`; the other
  four flows keep the check and both loops (user's reason: a Discord bot doesn't validate or loop;
  it stays in chat around the clock, answers mentions in a set tone, can remember past chats and
  connects to other apps). Its bots are intake, rules, update, ship, host (ui-spec §5.10); data is
  `hasLoops` and `flowLoops(set)` in `lib/processFlows.ts` and `data-loops` on the flow wrapper.
- 2026-10-08 — User's calls (spec `../ui-spec/05-process.md` §5.10, §5.11, choices 69–80, all first options): the one question becomes "Can I trust it with my customers?"; Process is recast with control first: label "You stay in charge", a heading (since 2026-10-09 "Hard calls / come to you."), a new `process.lead` line. Order: job arrives, your rules, hard calls / to you (flag), done (team), checked (check, fix loop back to step 4), then remind / ship for six-step flows; software-builder reorders too in peer words; Discord unchanged. The hand-off is a dashed accent stem with a label from `lg` and a marker row with an arrow below `lg` (breakpoint now `wide`, see the first 2026-10-09 line), no person drawn; each looped flow gains `handoffLabel` ("To you", "To you or your staff", "To a person"). Supersedes the earlier step order, the "AI agents run / every job." heading and the `FIX_EVERY` fix-hop cadence. The online-store "complaints" line stands: the facts gained "Sensitive actions, like refunds and complaints, are passed to a person instead of being handled by an agent". Built.
- 2026-10-09 — Lead's call (user delegated; audit copy fix): the default flow's step 3 line reads "Anything sensitive or unusual is passed to you, not handled by an agent." (was "...before any work starts"; the facts don't back that). Landed in `content/home.ts`. "To you or your staff" stays as voice (user approved, round 2); its width at 1440 is still an open question.
- 2026-10-09 — User's call: the software-builder first step's "inside your team" stays; builders' words belong in that card (voice rule 17).
- 2026-10-09 — Heading "Hard calls / **come to you.**" (second line accent) supersedes "Your rules run it. / You make the hard calls."; it sets on two lines at 360, 768, 1440 and 3840 and one at 1024.
- 2026-10-03 — "Second check" is backed by the facts line "A separate agent checks the work before
  it goes out"; "flag" means anything unusual goes to a person, drawn as a bot raising a flag (no
  person is drawn); the return loop lands on step 2, "your rules".
- 2026-10-03 — Bot roles: new `intake`, `flag`, `remind`, `ship`; `rules`, `team` and `check` stay
  (`team` does every "done" step); `update` and `host` are used in the Discord flow only.
- 2026-10-03 — Every flow but Discord gets a second return line along the top, from step 4 "Second
  check" back to step 3 (the work step): a problem or broken rule sends the work back until it
  passes. Its label (`fixLabel`) sits above the arch from `wide`, the caption-to-steps gap becomes
  `wide:gap-24`, and below `wide` it's a marker row at the end of step 3. The bottom loop (last step to
  step 2) is unchanged; step 4 lines read "…against your rules" (ui-spec §5.3a).
- 2026-10-03 — The job the bots pass is the picked card's emblem (the one Rix carries), or the plain
  job sheet by default; step 1's bot holds it on the static page. Each flow has a "sample job"
  caption under the tag.
- 2026-10-03 — The same "Shown for: …" tag as Agents; each flow is written in its card's tone. The
  tag is hidden without JavaScript, where the default flow shows.
- 2026-10-04 — Set swaps fade (0.15s out, swap, 0.25s in; opacity only, the same under reduced
  motion) from one shared store (`lib/shownSet.ts`), so Agents, Process and the bots change in one
  commit; `holdInView` holds the tag again when the swap lands; the "Shown for" list fades in over
  0.2s on open with the chevron turning (no turn under reduced motion). In Process the wrappers are
  `process-caption` and the keyed body.
- 2026-10-04 — The new roles have their own acts (`intake`, `flag`, `remind`, `ship`, `host`); the
  check's "found it" eye pop plays on the relay only when the job really goes back.
- 2026-10-04 — Discord's relay is a one-way pass (no lesson, no fix hop), 11.8s.
- 2026-10-04 — Step 1's held emblem (`data-bot="prop"`) hides at the hand-off and returns when the
  next run starts; the job is the emblem travelling.
- 2026-10-04 — The fix hop plays only in flows with loops; `process-fix-lit` lights with a `clip-path` reveal, like `process-return-lit` (the cadence is now `RUN_CYCLE`, see the 2026-10-08 line).
- 2026-10-04 — The crew relay is back on (`RELAY_ON = true`; user: "do motion now"), rebuilt for five
  or six steps. The fixed 16.4s rhythm (`RELAY_EVERY`) is gone: the next run starts `RELAY_REST = 2`
  seconds after the last one ends, because run length now differs per flow. Discord's naps stay as
  built (rules and update), the lead's default for ui-spec choice 42. Reduced motion is unchanged.
- 2026-09-28 — The bots jump only on user interaction (hover or tap); a caught bot plays its full
  role act instead; waking from a nap is a startle with the feet planted; the magnifier's "found it"
  is an eye pop. While a bot is active or reacting, hover and tap are ignored (a napping bot still
  wakes and jumps), and its timed-act scheduler restarts after any catch or reaction
  (`lib/processBotActs.ts` `nextActAfter`). The scroll-in drop stays (a fall, not a jump).
- 2026-09-28 — From `wide`, the loop label carries `wide:z-10` (`ProcessReturn.tsx`) so a relay job
  passes behind it as the dashed line does. Animating transform or opacity on the `process-return`
  box or its parent would create a stacking context and break this.
- 2026-09-27 — The bots have separate feet: the W's two bottom points are cut off the strips as
  their own pieces, so at rest the silhouette is exactly the logo. In motion the feet stay planted
  while the body breathes, squashes and crouches; on a jump they leave last and land first; they tap
  during idle and shuffle during hammer strikes. The body stretches from the top of the feet.
- 2026-09-27 — The bots move with fully smooth GSAP motion (tweens, easing, squash and stretch,
  rotation), one rig each with movable parts: a living idle, role acts and naps, plus four extras:
  eyes follow the pointer along their gaps (fine pointers), a scroll-in drop onto the ground line, a
  crew relay (on, see above), and a hover/tap reaction. Reduced motion stays per constitution §5:
  fades only, static poses. Spec: `ui-spec/05-process-motion.md`.
- 2026-09-26 — Process motion: the header and each step's text reveal on scroll (fade only under
  reduced motion).
- 2026-09-26 — The bot SVG is `overflow-visible`, not `overflow: hidden`, so the update wrench's
  jaw isn't clipped (lead's decision). `ui-spec/05-process.md` §5.8 choice 8's clipped-jaw choice
  is stale/overridden.
- 2026-09-26 — Mascots are a sharp vector, not pixels: the body is the logo's own geometry, with
  square eye holes in the gaps; hats and tools are flat, sharp-cornered shapes using the logo's 45°
  language. The canvas "Process mascots" (https://claude.ai/artifact/7CawmF4tBKgv4ALtJJyE69) shows
  the vector crew; its step-to-role mapping is superseded by the flows above (the drawings stay).
- 2026-09-26 — Mascot colour: the body uses the existing violet accent; no new token.
- 2026-09-26 — Layout: the canvas's stacked layout — the heading sits above the steps at every
  width, and Process does not pin its title column (excluded from the sticky-title pattern, like
  Proofs; `stickyTitleXl` is gone from `lib/styles.ts`; see `../page.md`).
- 2026-09-26 — Step numbers read two digits ("Step 01"), as on the canvas.
- 2026-09-25 — Clawd (Anthropic's trademark) is dropped; the mascots are the user's own character,
  built from their MW logo: three `/` strips cut from one shape whose top edge is an M and bottom
  edge a W, with the two gaps opening into square eyes where they cross the midline. Logo explored
  on the canvas "MW logo" (https://claude.ai/artifact/8WaNGpr3x7qDFw3qupVTio).

## Open Questions

- **To build:** browser check pending: the Process animation run-through at 1440 and 3840, and the two spec-accepted overlaps (the job crossing the pennant for about 0.2s; in the stacked layout the lesson over the end of the dotted fix line).
- **Review:** `handoffLabel` "To you or your staff" (service-business only) may be too long at 1440 six-across (width not measured); fallback "You or your staff".
- **Review:** Discord step 5 role: `host` (spec's first option) or `remind` (ui-spec §5.8 choice 39).
- **Review:** Discord step 4 role: `ship` (first option) or a new plug role (choice 40).
- **Review:** Discord step 3 role: `update` with its wrench (first option) or a book-only role
  (choice 41).
- **Review:** whether the bots nap on an "always on" flow (choice 42; the lead took the spec's first
  option).
- **Review:** a closing hairline under the last row below `wide` (choice 43; first option taken).
- **Review:** the relay's pacing, the phone lesson's contrast and arm clearance, and rechecks at
  360 and 768 return with the rebuilt relay; the user judges them on a real screen.
- **Note:** known limits: `jobPivots.rules` and `jobPivots.fold` in `lib/processJob.ts` are unused entries
  (only the user deletes things); not checked: Safari, Firefox, real devices, the
  hammer's lowest strike frame against the job.
- **To build:** the logo itself (nav, favicon, sharing image) isn't on the site yet; adopting it
  is a separate change that needs the user's yes.
- **Review:** the user should judge the feel of the bots on a real screen: how often the eyes look
  around (every 0.8–2s), the hammer's pacing, the foot seam during a squash.
- **Choice:** ledge length below `wide`: x 18–88 (lead's default, choice 55), or the sketch's
  right-foot end, x 18–58.
- **Choice:** the ledge's light as a gradient (lead's default, choice 56), or solid accent.
- **Choice:** the fix line as a bracket with an arrowhead (lead's default, choice 57), or a plain
  straight dotted line.
- **Choice:** the fix line dotted on phone (lead's default, choice 58), against the dashed arch from
  `wide`.
- **Choice:** step 4's hairline paints over the dotted line (lead's default, choice 59), or the line
  lifts above it.
- **Choice:** each step's `<li>` becomes `relative` (lead's default, choice 60).
- **Choice:** `ProcessLedge` in its own file (lead's default, choice 61).
- **Choice:** the hop's 6px lift (`LEDGE_HOP.lift`), or 0 if the job touches the leaving bot's tool
  on a real screen.
- **Choice:** ledge 1's flash at the hand-off quick (as built, 0.15s in, 0.35s out), or held longer.
- **Choice:** the ledge's light under reduced motion none (as built, per spec), or a fade.
- **Choice:** the lesson riding over the fix line's ends below `wide` accepted (as built), or moved
  into the gutter.
- **Choice:** below `wide` the job crosses in front of bots 4 and 3's legs and feet on the short legs
  to and from the fix line: accept (as built), or reroute.
- **Choice:** the way back's 1.1s (`FIX_LINE_HOP`, as built), or closer to the old 0.8s.
- **To build:** `ui-spec/05-process.md` is out of date (§5.4 Sizes and elsewhere: "across from 1024", `lg:` names; the breakpoint is `wide`, 1440); ui-designer updates it.
