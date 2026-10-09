# Agents

**Last Updated:** 2026-10-08

> **Status:** In build. Offers and panels follow the About pick (five sets: default and four
> cards; the website set and `pointer` panel were removed 2026-10-07); lint, `tsc` and the
> production build are green (lead check, 2026-10-08). The section now opens like Web, with the
> label, a two-part heading and a lead in the sticky column; round 1 copy is in. The SEO pass's hidden all-offers list is built, checked
> in the built HTML only, not deployed. The swimlane orchestra and the
> phone stepper are built, and their motion is built and lead-checked (2026-10-04): the stepper
> bars, the orchestra's token run, the checklist sequence, typing dots before every
> agent line, and the swap fade; the randomized replay timing is built and lead-checked
> (2026-10-05); the Report bar hover is built and lead-checked (2026-10-05). Open: the user's calls
> on copy and on the timing.

**The one question:** What can their agents handle for my business?

See `../page.md` for the site-wide index. Spec: `../ui-spec/04-agents.md` (§4.8 offers and
panels, §4.7 motion); the pick and the tag are in `../ui-spec.md` §0.5–0.6.

## Current State

The sticky column opens like Web's: an intro wrapper (`id agents-intro`) holding the label
(`SectionLabel`, now a `p`), the section's h2 (`SectionHeading`, `size="heading-sm"`, `id
agents-heading`: "Booked, replied," / "followed up.", on two lines) and the lead (`max-w-sm
text-lead text-muted`: ChatGPT answers you, an AI agent works for you). The h2 names the tab list
(`aria-labelledby`). The "Shown for" tag sits under the intro, then the tab list. The heading and
lead do not fade on a set swap. `heading-sm` (the user's call) is what lets the column fit.

Offers are per About card. `AgentsTabs` reads the shown set (`useShownSet`, the About pick through
`pickSet`: `default` with no pick, for Just exploring and in the server markup) and draws
`agentPanels(set)` from `lib/agents.ts`: each row of `agents.cards[set]` in `content/home.ts` paired
with its panel kind (`agentPanelKinds`, type-tied to the row's `demo`, so a missing or wrong panel
fails `tsc`; a row with no `demo` is now a type error). The sets are default, service-business,
online-store, discord and software-builder: four rows each, five for discord only. Kinds: `chat`, `leads`, `report`, `sync`, the new `checklist`
(`ChecklistDemo.tsx`: pieces of work, each with a one-word result its box turns to a tick for), and
`orchestra` (`OrchestraDemo.tsx`, the workflow offer: `software-builder` row 1 only; the default
set is `leads`, `chat`, `chat`, `leads`: Bookings, Customer messages, Order questions, New
enquiries):
swimlanes, one form at every width. Three lanes (Lead, the team, the checks) in one rounded outline,
the team's lane shaded, time running down through eight rows from `lib/orchestraRows.ts`
(`OrchestraRow.tsx`, one card per row in its lane's column and the grid row). Each card opens with
its lane's title (Lead's in the accent, with an accent border), then the lane's three role chips
where the row has them (row 2 the team's; rows 5 and 7 the checks', row 7's with ticks), then its
numbered step (`OrchestraStep.tsx`; the badge sits on the card edge below `sm`). Rows: ① to ④, the
checks without ticks, ⑤ the fix, the checks with ticks, ⑥. Only the fix card (row 6) is dashed
accent; row 7's checks card uses `border-line`. `OrchestraLink.tsx` draws each L-shaped connector
(percentages of the cell, no breakpoints; the links on rows 6 and 7 are dashed accent). The done
pill is centred below. The drawing is `aria-hidden`, with an `sr-only` list of the steps. In the
static markup it shows finished (the token is `hidden`); the builder's check roles are Review,
Rules and Tests. The `orch-*` hooks and `orch-token` are what `lib/orchestraRun.ts`
animates.

The demo status pill reads "working for you" (`agents.demoStatus`) and the slugs are plain ("your
bookings", "your messages"...). The Discord "Member questions" demo is a chat with an @mention
and a reply that recalls a past chat; the discord "Welcome and roles" demo (row 2,
`agentPanelKinds.discord`: `checklist`) ticks one new member's story through to the pill "role
given"; "Moderation" (row 3, `leads`) is a three-person list whose rows each carry their own done pill
(`LeadsDemoContent.rows[].done?`, falling back to the shared `statusDone`; `LeadsDemo` shows
`row.done ?? statusDone`), before pill "flagged"; the discord "Custom commands" demo shows Server,
Sheets and Twitch. There is no `pointer` kind any more: its arm of `AgentPanel`, its playback in
`lib/agentDemoSequences.ts` and `AgentDemoFrame`'s `header` prop are gone (`AgentDemoFrame`'s `slug`
is required), and `AgentPanelKind` remains as an alias of `AgentDemoKind`. `ChatDemo`
takes an ordered message list (either side can open it). Row copy lives in `agents.cards.<set>`
(`agents.pointer` is gone); `agents.demoAgent` is
the shared "Agent" name; `agents.stepper` holds the stepper's button names and "Offer {n} of
{total}" (filled by `lib/fillTemplate.ts`).

Below `lg` the tab list hides and one shared `AgentsStepper` is the first child of the panels
wrapper, above the panels: ‹ and › buttons (wrapping, moving no focus, via `useRovingTabs`' `step`)
round the counter ("01 / 04", `aria-hidden`; an `sr-only` position reads instead) and the selected
offer's title, progress bars (one per offer, `agent-progress-bar`; full at rest, the selected one
filling on the 6s clock under full motion), and the offer's line.
A live region speaks the position and title only after a press, never on the auto-advance, and
clears on a set change. The panel below it has square top corners (`AgentDemoFrame`, `max-lg`); its
height follows its demo, from a 384px minimum below `lg`.

The "Shown for" tag (`ShownForTag`, sectionId `agents`) sits under the intro in the sticky
column. The tab list and panels are keyed by set, so a pick remounts them inside the two persistent
wrappers; the root carries `data-set`; a new set puts the selection back on row 1 and moves no focus
(`useRovingTabs(count, set)`). Swaps fade: `useSwapFade` registers `agents-tablist`,
`agents-stepper` and every `agent-panel` with the shared store (`lib/shownSet.ts`), which fades them
out (0.15s), changes the set in one commit for Agents, Process and the bots, and fades them in
(0.25s); opacity only, the same under reduced motion. `agents-panels` is not a wrapper (the
entrance owns its opacity), and the intro (label, heading, lead) and the tag never fade. Without JavaScript the
tag, tab list and panels hide and `AgentsStack`, which draws the `default` set, shows in a
`<noscript>`.

Agents ships variant A (the tab list) only; `AgentsSection` takes no props and `AgentsStack` is
its no-JS fallback (passed as `AgentsTabs`' `fallback`). Agents pins its title
column (intro + tag + tab list) at 120px from the top from `lg` (CSS `sticky`, no JS), using the shared
`splitColumns`/`stickyTitle` helpers in `lib/styles.ts` (see `../page.md`). Because the sticky
column carries `self-start`, the Agents grid stays `lg:items-center`, so its demo panel is centred
where it's shorter than the tab list (1024). With the heading and lead the left column is taller
than the panel (web-coder's measure, 2026-10-08: 686px, 806 with the 120px top, at 1024x768 and
1440x900; 789 at 3840).
Lead check 2026-10-08 (production build, headless Chromium, reduced motion): lint, tsc and build
green; at 360, 768, 1440 and 3840 no sideways scroll, no page errors, no overflowing leaf text in
hero, about or agents; the heading sets on two lines. The pinned column fits at 1440 and 3840 and
is 38px over at 1024x768 (see Open Questions).

The GSAP motion pass is done (`hooks/useAgentsMotion.ts`, browser-verified 2026-09-26 at 1440 and
360). A once-only scroll entrance (the intro block, as one, and the tab rows rise from `y` 56px,
staggered; the panel fades up; the option is `introId`, was `labelId`) plays when the section scrolls in and starts the selected row's demo. Full motion then
auto-advances every 6s, the selected row's progress line growing `scaleX` 0→1; it pauses on
pointer hover over the tab list or panel, on keyboard focus in the tab list, on any focus inside
the panel, and while the section is off screen or the tab hidden (`lib/watchLive.ts`), resuming
where it stopped; a click selects without stealing focus and restarts the line for the new row.
Below `lg` the stepper's bar for the selected offer is on the same tween as the row's line (one
clock, pausing together), and the stepper's title and line fade in over 0.25s on a selection change
only (not on first paint or a set change).
Each panel's demo replays from its start when its panel shows (`lib/agentDemoSequences.ts`; the
shared pop and `newSequence` are in `lib/agentDemoPop.ts`, parts popping y 8px and scale .96, 0.45s
each). Replays are paced at random: each work step draws its time from a `[min, max]` range out of
the demo's budget (`spendBudget` in `lib/demoBudget.ts`: in order, each step capped so the later
ones keep their minimums, the sum never over the longest time), drawn at build so every replay
differs. Longest times and ranges (seconds): chat 5 (gap after each message [0.3, 1.1], typing-dots
hold [0.5, 1.4]); leads 3.2 (each pill swap after [0.16, 0.8], from 0.8); checklist 3.4 (each tick
after [0.15, 0.7], from 0.65; the pill 0.25 after the last tick); report 2.4 (gap before each next
bar [0.03, 0.25]; each bar grows 0.6); sync 3 (each event after [0.15, 0.7], from 0.6; the packet
loop is untouched); orchestra 5 (ride pace [0.65, 1.3] times each link, dwells per card
[0.04, 0.2], finding [0.34, 0.5], ticks [0.16, 0.36]). Measured
over 22+ replays: chat 2.05-3.89 with three messages, 3.63-5.00 with four; leads 1.89-3.19;
checklist 2.51-3.40; report 1.60-2.39; sync 1.95-2.98; orchestra 4.55-5.00; none passed its
longest. Chat shows typing dots before each agent line, then the line; Leads' pills flip from
"new" to "followed up"; the Checklist pops its lines with empty boxes, turns each to its tick, then
pops the pill; Report's bars grow; Sync's packets loop along their connectors; the Orchestra
(`lib/orchestraRun.ts`) pops its rows in, then a token rides each link, flashing each card it reaches, the finding is an accent
fill blink on one check chip, the token rides the two dashed fix links, row 7's ticks pop in order,
the last link runs back to the Lead, then the pill pops. When earlier steps run long, later ones are squeezed (most visible in the
four-message chat's second reply and the orchestra's last link). A set change re-runs the hook (`revertOnUpdate`, dependency `set`): rows, lines,
panels and dots are read again, the entrance plays once per page load, and later the selected row
plays at once. A status dot in the panel header blinks
(opacity) while the demo is live. Under reduced motion, only opacity fades remain: no
auto-advance, the progress line and bars stay full, demos show their finished state fading in by
order (no typing dots, no token), and the status dot stays solid. Verified: advances 1→2 after 6s, hover pauses it (1440), a click
resets the timer and advances 6s later, reduced motion never advances with the line full, no
sideways scroll, no console errors beyond the known favicon 404 (2026-09-26, before the per-card
build). Lead check 2026-10-03 (production build): no sideways scroll, no tap target under 44px and
no console errors at 360, 768, 1024, 1440 and 3840; the tag sets the pick by pointer and keyboard.
Lead check 2026-10-04 (after the motion pass): lint, tsc and build are green; at 360, 768, 1024,
1440 and 3840, in full and reduced motion, no sideways scroll, no console errors and nothing left
dimmed after a swap.
Lead check 2026-10-05 (production build, headless Chromium, after the randomized timing): lint, tsc
and build green. Discord set at 1440, five replays of each of the five panels: steps land at
different times on every replay (the Welcome checklist's last tick 2.04-2.86s, Moderation's last
pill 2.01-2.67s) and every replay ended by 3.1s. Agents and Process at 360 and 1440, full and
reduced motion, default / software-builder / discord: no sideways scroll, no console errors,
nothing left dimmed. Judged by numbers only, not by eye.
Lead check 2026-10-04 (production build, after the swimlanes and stepper): lint and build pass. At
360, 768, 1024, 1440 and 3840, default and software-builder sets: no sideways scroll, no console
errors, no clipped or spilling text in the chart; the stepper shows below `lg` and the tab list from
`lg`. Orchestra chart (w×h): 278×838 (default) / 278×886 (builder) at 360; 600×686 at 768; 373×846 /
373×814 at 1024; 542×686 at 1440; 600×686 at 3840. Orchestra panel height: 982 / 1030 at 360; 854
at 768; 1014 / 982 at 1024; 866 at 1440 and 3840. Other panels: 384–470 below `lg` (the panel only);
395 / 473 at 1024; 554 at 1440; 648 at 3840.

Report bar hover (built, lead-checked 2026-10-05): the bars carry `data-anim="demo-bar"` (the
violet latest bar also `data-bar="latest"`) and stay decorative. On a fine pointer
(`useAgentsMotion` binds `bindBarHover`), the hovered bar fades to the accent and stretches `scaleY`
1.08 from the chart's floor over 0.25s `power2.out`, capped so no bar passes the chart's top; the
latest bar only stretches. Reduced motion fades the fill only; touch does nothing. A bar still
growing in the replay lights at once and stretches once it lands; every replay start or revert
resets the bars first. At 1024 and 1440 a hovered bar grew (225 to 243px at 1440) and none was left
lit after fast sweeps.

## Key Files

- `components/home/agents/` — AgentsSection, AgentsTabs (the set's tab list and panels, with the
  tag), AgentsStack (the `default` set as the no-JS fallback), AgentRowText, AgentDemoFrame,
  AgentsStepper (the shared stepper below `lg`), AgentDemo (picks the panel by kind), ChatDemo (its
  typing dots are the shared `components/TypingBubble.tsx`), LeadsDemo, ReportDemo, SyncDemo,
  ChecklistDemo, OrchestraDemo (the swimlanes), OrchestraRow (one row's card), OrchestraLink (one
  L-shaped connector), OrchestraStep (one numbered step), DemoStatusPill
- `lib/orchestraRows.ts` — the swimlanes' eight rows as data (lane, step, roles, ticks, link, fix)
  and the `data-demo-order` constants
- `lib/fillTemplate.ts` — fills `{n}`-style placeholders in the stepper's content strings
- `components/home/agents/AgentsAllOffers.tsx` — the `hidden` server-rendered list of every card
  set's offers (title and line), for search engines and AI models; rendered by `AgentsSection`
  after `AgentsTabs`
- `lib/cardSets.ts` — the card sets and their labels, derived from `about.replies` through
  `pickSet`
- `components/home/pick/ShownForTag.tsx` — the "Shown for" tag (see `sections/02a-about.md`)
- `hooks/useShownSet.ts` — the set the tab list draws (the About pick through `pickSet`)
- `hooks/useRovingTabs.ts` — roving-tabindex keyboard behaviour for variant A's tablist; `select`
  and `step` (the stepper's wrapping ‹ / ›) never move focus, only the keyboard path does; the selection resets to row 1 when its `resetKey`
  (the set) changes
- `hooks/useAgentsMotion.ts` — the section's motion: scroll entrance, 6s auto-advance (row line and
  stepper bar on one tween) with pause/resume, demo replay per selection, the stepper text fade,
  status-dot blink, re-run on a new set; reduced motion keeps fades only
- `hooks/useSwapFade.ts` — names the wrappers that fade across a set swap (the store is
  `lib/shownSet.ts`)
- `lib/shownSet.ts` — the shared shown-set store and swap fade (Agents, Process, the bots)
- `lib/agentDemoSequences.ts` — each demo kind's replay sequence, built from its finished static
  state and `data-demo-order`; reduced motion fades parts in by order instead
- `lib/agentDemoPop.ts` — what every replay shares: `DemoPlayback`, the pop, `LEAD_IN`,
  `newSequence`
- `lib/agentBarHover.ts` — `bindBarHover` and `BAR_HOVER`: the Report bars' hover (accent fill,
  `scaleY` stretch from the floor, capped at the chart's top); `reset` and `unbind`
- `lib/demoBudget.ts` — `spendBudget(budget, steps, random)`: shares a demo's longest time between
  its steps' `[min, max]` ranges (no DOM, no GSAP)
- `lib/orchestraRun.ts` — the orchestra's token run down the swimlanes
- `lib/watchLive.ts` — shared: whether an element is on screen and the tab visible, used to pause
  the auto-advance and demo loops
- `lib/motion.ts` — shared motion settings used here: `motionQuery`, `duration`, `ease`, `stagger`,
  `blinkDim`, `reveal` (the generic scroll entrance, from ui-spec §10), `animTargets`
- `lib/agents.ts` — the demo kinds and each kind's content shape, the panel kind per row per set
  (`agentPanelKinds`, type-tied to `agents.cards`), `agentPanels(set)`, and the row ids a tab and
  its panel share
- `lib/aboutPick.ts` — `pickSet`, the pick-to-set mapping

## Decisions

- 2026-09-24 — Agents section label numbered like v3 ("01", from copywriter); the offers are
  rows with a number and a big title; the active row shows its one-line description.
- 2026-09-24 — Agents interaction: rows are an accessible tab list, first active, click or tap
  switches the panel (6s auto-advance and progress line, paused on hover or focus, off under
  reduced motion per §5).
- 2026-09-24 — Agents demo panels show the finished state statically (full conversation, all
  leads followed up, report sent, all tools in sync). Motion (later): GSAP plays each sequence
  from the start when its panel shows.
- 2026-10-08 — User's call (`../page.md`): the demo status reads "working for you" and the slugs are plain (your bookings, your messages...), not dev-style. Supersedes the 2026-09-24 decision keeping v3's "agent running" and slugs.
- 2026-09-24 — The Agents demo samples keep v3's vendor names ("instagram DM", "Sheets") under
  constitution §7.4 (as amended 2026-10-03).
- 2026-09-24 — `agents.label` is "What my agents handle".
- 2026-09-24 — Demos show their finished state with `data-demo-order` and `data-anim` hooks for the
  GSAP pass.
- 2026-09-24 — Audit fixes: the demo panel's aspect ratio is a minimum (it grows instead of
  clipping; was clipping at 1024px); agent tabs and panels are named by number and title only; the
  tab hook's select no longer moves focus (only the keyboard does), so the GSAP auto-advance can't
  steal focus; demo kinds are type-tied to `agents.cards`.
- 2026-09-24 — Agents ships variant A (the tab list) only; `AgentsStack` stays as its no-JS
  `<noscript>` fallback. The temporary variant-B preview at `#agents-b` is removed;
  `AgentsSection` takes no props.
- 2026-09-25 — Agents pins its left column (label + tab list) at 120px from the top from `lg` (CSS
  sticky, no JS), part of the site-wide split/sticky-title pattern (see `../page.md`). Because the
  sticky column carries `self-start`, the Agents grid stays `lg:items-center`, so its demo panel is
  centred again where it's shorter than the tab list (1024).
- 2026-09-26 — Agents motion pass: a once-only scroll entrance (label and rows rise, staggered;
  panel fades up, from ui-spec §10's generic reveal — the section's own spec had none), 6s
  auto-advance with a growing progress line (paused on hover, keyboard focus, off screen or hidden
  tab), each demo replaying on show with a blinking status dot; reduced motion keeps opacity fades
  only (no advance, full line, finished demos).
- 2026-10-03 — Offers are per About card, in per-set rows `agents.cards.<set>` (the card key, or
  `default`), lead offer first, each row's panel mapped in ui-spec §4.8; four rows, five for Discord
  and website. Replaces v3's four fixed offers.
- 2026-10-08 — User's call (`../page.md`): the default set (no pick or Just exploring) is four everyday-business offers: Bookings, Customer messages, Order questions, New enquiries (kinds leads, chat, chat, leads). The orchestra stays only in the software-builder set. Supersedes the 2026-10-03 default set.
- 2026-10-08 — User's call: Agents gets a SectionHeading ("Booked, replied, / followed up.") as its h2 and a lead line (the bridge, defining "AI agent" by comparison with ChatGPT) in the sticky column, in an intro wrapper the entrance raises as one block; the label becomes a p. Online-store "Connected tools" is now "Orders to stock". - 2026-10-08 — User's call: Agents' heading is `heading-sm`, not `heading`, so the sticky column fits.
- 2026-10-08 — User's calls (spec `../ui-spec/04-agents-action.md` §4.10, choices 39–48, all first options): every chat and people-list demo ends with an action line, a "Done" receipt of what got done and where it went: accent outline with a tick box, full width, its own entry in the chat list, one per demo, on the five lists too; copy check only for report, sync, checklist and orchestra; empty box then tick motion; 4.5s chat ceiling; chat meta dropped where a receipt follows; sr word `agents.demoAction` "Done". Six chats (default 2 and 3, service-business 2 and 3, online-store 1, discord 1) and five lists (default 1 and 4, service-business 1 and 4, online-store 4). Discord "Custom commands" pill "all tools in sync" becomes "all up to date". Web-coder is building it.
- 2026-10-03 — Demo kinds: the four built (chat, leads, report, sync) are reused with new sample
  content; a new `checklist` kind (four lines whose boxes turn to ticks) serves the software-builder
  "build" and "rescue" rows; `ChatDemo` takes an ordered message list so the reminder demo opens
  with the agent.
- 2026-10-03 — The workflow offer (`agents.cards["software-builder"][0]`; 2026-10-08: no longer in
  the default set) is an `orchestra` demo ("Workflow setup"), plain role words, not names
  (ui-spec §4.4).
- 2026-10-04 — The orchestra demo is swimlanes (user's pick from hub and spokes, step log and
  swimlanes), replacing the numbered loop (choices 24-26): three lanes (Lead, team, checks), time
  running down, eight rows: ① to ④, the checks without ticks, ⑤ the fix in dashed accent, the checks
  with ticks, ⑥.
- 2026-10-04 — Swimlane layout: lane titles sit inside every card at every width, with no lane
  header row; the team's roles sit in the first team card; the step badge is on the card edge below
  `sm`; 124px lanes are accepted at 1024; Lead cards have an accent border and title (lead, from the
  spec).
- 2026-10-04 — Agents on phones (below `lg`): the vertical tab list hides and the demo panel gets a
  stepper on top (‹ "01 / 04" + title ›, progress bars, the selected offer's line), because buttons
  above the demo made a tap change a panel off-screen (user's reason); one shared stepper, arrows
  wrap at the ends, and the announcement only follows a press (lead, from the spec).
- 2026-10-04 — The Discord demos show the bot's new facts lines: "Member questions" (discord set)
  uses an @mention with a reply that recalls a past chat; "Custom commands"
  shows connections to business tools and apps (Server, Sheets, Twitch); card lines reworded to
  match; demo kinds and shapes unchanged.
- 2026-10-04 — Panel height changes with each tab's demo; panels are not held to the tallest (user).
- 2026-10-04 — Copy: `agents.stepper` ("Previous offer" / "Next offer" / "Offer {n} of {total}");
  the orchestra's "fix, check again" is "fix, recheck" to meet the swimlane limits; builder roles
  stay "UI / Backend / Data" (copywriter).
- 2026-10-07 — The website set and its `pointer` panel (only that set used it) are removed with the
  About card "I need a website" (user's call, see `02a-about.md`); five sets remain: default and
  four cards.
- 2026-10-03 — Demo samples may name an everyday product ("instagram DM", "Sheets"), under
  constitution §7.4 as amended.
- 2026-10-03 — A "Shown for: …" tag at the top of the section states the pick and opens an in-flow
  list of the six cards that switches in place; it is hidden without JavaScript, where the default
  set shows.
- 2026-10-03 — Each card's offers and demos are written in that audience's tone
  (`docs/04-voice.md` Tone per card); the section's own label and chrome keep the shared voice.
  Cheaper and faster claims use the facts' words, with no figure.
- 2026-10-04 — Set swaps fade (0.15s out, swap, 0.25s in; opacity only, the same under reduced
  motion) from one shared store (`lib/shownSet.ts`), so Agents, Process and the bots change in one
  commit; `holdInView` holds the tag again when the swap lands. In Agents the wrappers are
  `agents-tablist`, `agents-stepper` and every `agent-panel`, never `agents-panels` or the label/tag.
- 2026-10-04 — Agents motion pass (user: "do motion now"), built: the stepper bars fill over the 6s
  auto-advance in step with the row line; the stepper's title and line fade 0.25s on a selection
  change only; the workflow chart plays a token run along the swimlane links (the finding is an
  accent fill blink on the chip); the checklist has its own sequence; chat shows typing dots before
  every agent line; the pointer panel's parts pop in. Reduced motion keeps fades only.
- 2026-10-05 — The Agents demos' steps are no longer evenly paced: on each replay every "work" step (a chat reply's typing, a pill's swap, a tick, a bar, an event, the orchestra token's stops) takes a random time drawn from the demo's max duration, the time used is deducted and the rest passed on, so each replay is paced differently and still ends inside the 6s offer clock (user: "all animations are linear make them dynamic by randomized duration, deduct the time each step took from the max duration before passing on to the next one"; asked where, they chose the Agents demos only, not the Process relay). Reduced motion is unchanged (fades by order).
- 2026-10-05 — Discord "Welcome and roles" is a `checklist` demo telling one new member's story (joins the server, sent to #rules, reacts to the rules, gets the Member role; pill "role given"), replacing the three-person list (user's request and their pick of "ticking steps" over a chat or a stepping list).
- 2026-10-05 — Discord "Moderation" keeps the three-person list with new examples and a done pill per row: swore at a member → timed out; not in English → warned; suspicious activity → mods told; the before pill is "flagged" (user's request). `LeadsDemoContent` rows take an optional `done` over the shared `statusDone`.
- 2026-10-05 — New copy limit for the people list (ui-spec `04-agents` §4.6): a row's done pill plus the longest word of its source is 20 characters at most, so nothing runs under the pill at 360; "sent to mods" became "mods told" to meet it.
- 2026-10-05 — The Report demo's bars react to the pointer: the hovered bar turns the accent colour and stretches up a little, easing back when the pointer leaves; colour only under reduced motion, nothing on touch screens, no text or figure added (user: "add hover effect on each bar from bar charts"; of three options they chose "light up and grow"). The bars stay pictures: not focusable, the chart stays `aria-hidden`. The one exception to the spec's rule that demo parts take no hover (ui-spec 04-agents §4.5).

- 2026-10-07 — SEO pass (user-approved): every card set's offers (title and line) are also rendered on the server in a `hidden` block, `AgentsAllOffers`, under the card's label, so search engines and AI models can read the four card sets, which until now reached the page only after a click; no visual or motion change, the tab list, panels and swap are untouched.

## Open Questions

- **Choice:** the developer card's row titles: copywriter's alternatives exist; the user picks.
- **To build:** motion pass for the action line (spec `../ui-spec/04-agents-action.md` §4.10 motion): gsap-animator sequences the empty box then tick, the 4.5s chat ceiling and the dropped chat meta (web-coder is building the static line).
- **Review:** the software-builder Agents row 1 line "I set up the agent workflow I use inside your team." assumes a team (voice rule 17) but is the facts' wording; the user's call.
- **Review:** the reminder chat's "reminder sent" meta was dropped where a receipt follows; it could come back.
- **Review:** "Twitch" as the sample app in the Discord "Custom commands" demo.
- **Note:** `AgentsStack` ships only as A's no-JS fallback; its markup is also in the page payload
  for JS visitors (audit NIT, accepted for now).
- **Review:** with the heading and lead the pinned column is 806px (with its 120px top) at
  1024x768, 38px over the screen, so the last tab row sits below the fold while pinned; it fits at
  1440 and 3840. The user judges: keep, or shorten the column at that size.
- **Choice:** Discord moderation row 2: "not in English" or "broke English-only" (copywriter's
  alternatives).
- **Choice:** Discord welcome step: "Sent to #rules" or "Sent to #onboarding".
- **Choice:** Discord welcome step: note "agreed" or "reacted".
- **Choice:** Discord moderation row 3: "mods told" or "reported".
- **Choice:** Discord moderation before pill: "flagged" or "new".
- **Review:** the orchestra has the smallest spread between replays (4.55-5.00s); raise its longest
  time to about 5.4s, or leave it.
- **Review:** the orchestra token's ride speed now varies per link; keep it, or vary only the
  dwells.
- **Review:** Report and Sync now run about 0.5s and 0.7s longer on average; keep, or pull back.
- **Review:** the latest (already violet) bar shows no hover at all under reduced motion; a signal
  would need a second colour.
- **Review:** the tallest bar's stretch is capped at 1.053 against 1.08 for the rest; raising the
  ceiling would put it about 8px into the 20px gap under the title at 1440.
- **Note:** the bar hover binds on `(pointer: fine)` only; Firefox, Safari and a real mouse are
  unchecked (the lead check used headless Chromium).
