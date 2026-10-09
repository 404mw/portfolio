# §4 Agents: UI spec

Shared rules and parts (§0): [`../ui-spec.md`](../ui-spec.md). Page doc: [`../sections/04-agents.md`](../sections/04-agents.md).
The action line (the "Done" receipt, §4.10): [`04-agents-action.md`](04-agents-action.md).

**Last Updated:** 2026-10-09. Offers per About card (the user's decisions of 2026-10-03), five
sets: `default` and four cards. The pick, its memory and the "Shown for" tag are shared rules:
`../ui-spec.md` §0.5 and §0.6. Every choice in 4.9 is decided except the ones marked open.

**2026-10-09 (the user's calls; this spec brought in line the same day):**
1. **The sync demo runs one dot per event** (4.4, 4.7). The packets no longer loop along the
   connectors. One event at a time, a dot runs from the event's `from` tool to its `to` tool,
   0.4s per connector, crossing one or two connectors in either direction; the `to` tool lights
   through its hidden `sync-lit` overlay and the event's box pops as the dot lands; then the pill
   pops. **New hooks:** `data-sync-tool`, `data-sync-link`, `data-sync-from`, `data-sync-to`, and
   the `sync-lit` overlay in each tool. **The content shape gains `from` and `to` per event**
   (4.6). Built (build and lint green; not yet seen on screen).
2. **The replay ends on the static picture** (4.7): as the pill pops, every packet fades back in
   at its connector's midpoint. Decided; in build (the code carries it; not yet checked on screen).
3. **Online-store row 3 is "Orders to stock"** (Store, Stock, Sheets), replacing "Store tools
   connected" (4.8): each event lands in a different tool and the pill names the owner's benefit.
4. Default "Order questions" passes a refund to Sam, the sample owner, and hand-off receipts name
   Sam: `04-agents-action.md` §4.10.8. No change in this file's layout.

**Earlier rounds, as they stand today:**
- **2026-10-08:** the sticky column opens with an intro (label, a two-part `heading-sm` heading,
  a lead) like Web's (4.1). The `default` set is four everyday-business offers: Bookings, Customer
  messages, Order questions, New enquiries (`leads, chat, chat, leads`); the orchestra is in the
  `software-builder` set only (4.8). Every chat and list demo ends with a "Done" receipt (§4.10).
  The demo status reads "working for you" and the slugs are plain.
- **2026-10-07:** the `website` set and its `pointer` panel are removed with the About card "I need
  a website": no `AgentPointerPanel`, no kind `pointer`, no `agents.pointer.*`, and
  `AgentDemoFrame` has no `header` prop (its `slug` is required). Choice 3 is moot.
- **2026-10-05:** Discord row 2 is a `checklist`, row 3 a `leads` list with a done label per row;
  replays are paced at random (4.7 Pacing); the Report bars light and grow under a fine pointer.
- **2026-10-04:** the orchestra is swimlanes (4.4); below `lg` the panel has a stepper (4.2a); the
  motion pass is built (4.7).

## 4. Agents (the one question: what can their agents handle for my business?)

The user picked variant A (tab list), 2026-09-24. Variant B's list (`AgentsStack`) ships only as
A's `<noscript>` fallback. The tab list shows the picked card's offers, four rows (five for
`discord`), lead offer first. With no pick, or "Just exploring", it shows the `default` set. The
server markup holds `default` only.

### 4.1 Shared parts

- `AgentsSection` (server): section frame, `id="agents"`, no `border-t`. Takes no props; it renders
  the tabs layout (4.2) with `AgentsStack` (4.3) as the no-JS fallback, then the hidden
  `AgentsAllOffers` list (SEO, 2026-10-07).
- **The intro (2026-10-08):** `<div id="agents-intro" class="flex flex-col gap-5">` →
  `SectionLabel` (`agents.number`, `agents.label`, a `p`), `SectionHeading size="heading-sm"
  id="agents-heading"` (`agents.heading.lead` / `.accent`, the section's h2, which names the tab
  list), `<p class="max-w-sm text-lead leading-normal text-muted">` = `agents.lead`.
- **`ShownForTag`** (`../ui-spec.md` §0.6) sits right under the intro, in one group:
  `<div class="flex flex-col gap-5">` → intro, tag. Radio name `agents-shown-for`.
- `AgentRowText`: `grid grid-cols-[1.25rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-2.5`:
  number `font-mono text-meta`; title `block {rowTitle}` (`font-display text-row leading-[1.05]`);
  line `col-start-2 block text-lead leading-normal text-muted`.
- `AgentDemoFrame` (the panel): `flex min-h-96 flex-col rounded-3xl border border-line bg-band lg:min-h-auto`.
  No `overflow-hidden`: the panel grows to fit its demo and never clips it. Props `variant`
  (`tabs`, A's panel, or `stack`, the fallback rows) and `slug` (required).
  - Header: `flex items-center justify-between gap-4 border-b border-line px-5 py-4 {metaLabel}`:
    a status dot (`size-1.5 rounded-full bg-accent`, `aria-hidden`, `data-anim="demo-status-dot"`)
    with `agents.demoStatus`, and the slug on the right.
  - Body: `relative flex flex-1 flex-col justify-center p-5 md:p-8 xl:p-9`.
  - Size: `min-h-96` below `lg`; from `lg`, `lg:aspect-[10/9]` for `tabs` or `lg:aspect-[16/10]`
    for `stack`. The ratio is a minimum: a taller demo grows the panel.
  - `tabs` adds `max-lg:rounded-t-none`: below `lg` the stepper (4.2a) is the card's rounded top,
    and the frame's top border is the line between them.
- Inner raised surfaces in panels (bubbles, rows, chips, sync tools and events) use `bg-line/40`.

### 4.2 Variant A: tab list (`AgentsTabs`, client)

- Layout: `<div data-set={set}>` with `splitColumns` + `noscript:block lg:items-center` (`splitColumns` from `lib/styles.ts`:
  `grid gap-10 md:gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24`).
  `noscript:block` drops the two columns without JS, so the fallback list takes the full width. Left:
  `flex flex-col gap-10` (the intro-and-tag group, then the tab list). Right: the stepper (below
  `lg`) and the set's panels, in `agents-panels`. **Phone and tablet:** intro, tag, then the panel
  with the stepper on top; the tab list is hidden.
- **The set.** `AgentsTabs` reads `useAboutPick()` → `pickSet` → `useShownSet` (§0.5) and draws
  `agentPanels(set)`: four rows, or five for `discord`. The tab list and the panels are keyed by
  set, so a change remounts them; the wrappers (`agents-tablist`, `agents-panels`) persist. On a
  change the selection returns to row 1 (`useRovingTabs` reset key) and focus stays where it is.
- **Sticky:** from `lg` the left column adds `stickyTitle` (`lg:sticky lg:top-30 lg:self-start`).
  The grid keeps `lg:items-center`. Phone and tablet stay unpinned.
- Tab list: `<div role="tablist" aria-orientation="vertical" aria-labelledby="agents-heading" data-anim="agents-tablist" class="max-lg:hidden noscript:hidden">`.
  Each row is `<button role="tab" aria-labelledby aria-selected aria-controls tabIndex={selected ? 0 : -1} data-anim="agents-row">` with
  `group relative block w-full cursor-pointer border-t border-line py-5 text-left` + `focusRing`, holding `AgentRowText`.
  The row's one-line description renders on the selected row only.
- **Names:** each tab and its panel are named by the row's number and title only, through
  `agentRowIds()` in `lib/agents.ts`. The description is visible but not part of the name.
- Progress line per row: `<span aria-hidden data-anim="agent-progress" class="absolute inset-x-0 -top-px h-px origin-left bg-accent">`,
  full width on the selected row in static, `scale-x-0` on the others.
- Panels wrapper: `<div id="agents-panels" data-anim="agents-panels" class="noscript:hidden">`. In it,
  the stepper, then one `<div role="tabpanel" id aria-labelledby tabIndex={0} data-anim="agent-panel" class="rounded-3xl max-lg:rounded-t-none">` + `focusRing`
  per offer; the unselected ones have `hidden`. First offer selected on load.
- Keyboard (`hooks/useRovingTabs.ts`): Up/Down move and select (wrapping), Home/End jump, Tab
  moves into the panel. `select` never moves focus (clicks, the stepper, the auto-advance); the
  keyboard path selects and focuses the tab. `step(delta: 1 | -1)` selects the previous or next
  offer with wrap-around and moves no focus (the stepper's buttons).
- **No-JS fallback:** the tab list and panels take `noscript:hidden`, and a `<noscript>` renders
  variant B's list in their place. The tag and the stepper (inside the panels wrapper) hide too.

| Row part | Default (unselected) | Hover | Focus-visible | Selected | Active |
|---|---|---|---|---|---|
| Number | `text-muted` | same | ring on row | `text-accent` | same as hover |
| Title | `text-muted/60` (3.2:1, large text) | `group-hover:text-muted` | ring on row | `text-text` | same as hover |
| Line | not rendered | n/a | n/a | `text-muted`, visible | n/a |
| Top line | `border-line` | same | same | accent progress line over it | same |
| Tabpanel | no chrome | n/a | `focusRing`, `rounded-3xl` (square top below `lg`) | shown | n/a |

Every tab row is at least 74px tall; the tap target is the whole row.

### 4.2a The stepper, below `lg` (`AgentsStepper`, the user's choice, 2026-10-04)

The one control below `lg` for moving between offers. **One** stepper, the first child of
`agents-panels`, outside the per-offer panels, so its buttons never hide under the reader's focus
and there's never a second set of focusable tabs. It reads `selected`, the set's `panels` and
`step` from `AgentsTabs`. It is not keyed by set: it persists; only its bars are keyed.

```
div data-anim="agents-stepper" class="flex flex-col gap-3 rounded-t-3xl border-x border-t border-line bg-band p-4 lg:hidden"
├ div.flex.items-center.gap-3
│ ├ button type="button" aria-label={agents.stepper.prev} aria-controls={panelsId} class="{stepButton}" → ChevronRightIcon size-4 rotate-180
│ ├ div class="flex min-w-0 flex-1 flex-col items-center gap-0.5 text-center"
│ │ ├ span aria-hidden="true" class="font-mono text-meta text-accent"        → listNumber(i) + " / " + listNumber(count − 1)
│ │ ├ span class="sr-only"                                                  ← agents.stepper.position ({n}, {total})
│ │ └ span data-anim="agents-stepper-title" class="font-display text-summary leading-[1.15] text-balance text-text"   ← panel.title
│ └ button type="button" aria-label={agents.stepper.next} aria-controls={panelsId} class="{stepButton}" → ChevronRightIcon size-4
├ div aria-hidden="true" class="flex gap-1 px-14"
│ └ span key={`${set}-${i}`} class="relative h-0.5 flex-1 overflow-hidden rounded-full bg-line"   × count
│   └ span data-anim="agent-progress-bar" class="absolute inset-0 origin-left bg-accent {i === selected ? '' : 'scale-x-0'}"
├ p data-anim="agents-stepper-line" class="text-center text-body leading-normal text-balance text-muted"   ← panel.line
└ p class="sr-only" aria-live="polite"                                       ← position + ": " + title, after a press only
```
`stepButton` = `grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border border-line text-text hover:border-accent hover:text-accent active:bg-line {focusRing}`.

- **Buttons:** plain buttons named by `agents.stepper.prev` / `next` (no visible text; the chevron
  is `aria-hidden`). They call `step(-1)` / `step(1)`. **They wrap:** › on the last offer goes to
  the first, ‹ on the first to the last, the same as the auto-advance and Up/Down. Never disabled.
- **Announcement:** focus stays on the pressed button. The live region gets "Offer 2 of 4: Customer
  messages" (the position template, then the title) **only from a press**, never from the
  auto-advance and never from a set change (the tag's own live region speaks then, §0.6). The
  message clears when the set changes. The visible counter is `aria-hidden`; the `sr-only`
  position reads in its place.
- **Semantics below `lg`:** the tablist is `display: none`, so no tab is in the tab order or the
  accessibility tree. The panels stay `role="tabpanel"`, still named by the row's number and title.
  Tab order: tag, ‹, ›, the panel. **From `lg`:** the stepper is `display: none` and the tab list
  works as in 4.2. One markup, nothing duplicated.
- **Five offers (Discord):** counter "01 / 05", five bars. A set change puts the counter back on
  01 with the new count; the bars remount.
- **The auto-advance** pauses while focus is in `agents-panels`, so a pressed button holds the
  offer. Where a tap gives no focus (iOS Safari), a press restarts the 6s line on the new offer.
- **Motion (built 2026-10-04, `hooks/useAgentsMotion.ts`):** the selected offer's bar grows
  `scaleX` 0 → 1 over the 6s, on the same tween as that row's `agent-progress`. While the
  auto-advance is held the bar stops where it is: it shows empty after a press of ‹ or ›, which
  restarts it at 0. `agents-stepper-title` and `agents-stepper-line` fade in over 0.25s
  (`power2.out`) on a selection change only; opacity only, the same under reduced motion.
  Reduced: the selected bar stays full, no advance.

| Stepper part | Default | Hover | Focus-visible | Active |
|---|---|---|---|---|
| ‹ / › | `border-line text-text` | `hover:border-accent hover:text-accent` | `focusRing` | `active:bg-line` |
| Counter, title, bars, line | not interactive | n/a | n/a | n/a |

Contrast: `text` on `band` above 15:1; `muted` on `band` ≈ 6.5:1; `accent` (counter) on `band`
≈ 8:1; the selected bar is also the counter's number, so the place is never colour alone.

### 4.3 Variant B layout: A's no-JS fallback only (`AgentsStack`, server)

- Label, then `<ol>` of the `default` set's four `<li class="grid gap-6 border-t border-line py-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-16 lg:py-14">`.
  Each holds `AgentRowText` (title as `<h3>`; number `text-accent`, title `text-text`, line always
  visible) and its own `AgentDemoFrame`. Nothing is interactive. No stepper.

### 4.4 Panels, finished state (sample content under §7 item 5)

Each demo takes its content as a prop (`agents.cards[set][i].demo`). Classes are as built.
`AgentDemo` picks the component by kind (`lib/agents.ts`, 4.8). Six demo kinds: `chat`, `leads`,
`report`, `sync`, `checklist` and `orchestra`. Chat and list demos end with the "Done" receipt
(`DemoActionLine`, §4.10).

- **ChatDemo** (kind `chat`): `flex flex-col gap-3.5`. It draws an ordered list of `messages`, so
  a chat can open with either side; one entry may be the receipt (`from: "action"`, §4.10).
  - Visitor bubble (`from: "them"`): `self-start max-w-[70%] rounded-xl rounded-bl-sm bg-line/40 px-4.5 py-3.5 text-body-lg text-text`.
  - Before each agent message, the typing dots in their own agent-side bubble (`TypingBubble side="end"`,
    `data-anim="demo-typing"`, `aria-hidden`). Hidden in static; the GSAP pass shows them.
  - Agent message (`from: "agent"`): `self-end flex max-w-[72%] flex-col items-end gap-1.5` → bubble `rounded-xl rounded-br-sm bg-accent px-4.5 py-3.5 text-body-lg text-on-accent`, then its optional meta `{metaLabel}`.
  - **Who speaks:** each bubble starts with a `sr-only` speaker name (`demo.asker` or
    `agents.demoAgent`), so the turn isn't carried by side and colour alone.
- **LeadsDemo** (kind `leads`, a list of people whose rows turn to done): `flex flex-col gap-2.5`, three rows
  `flex items-center justify-between gap-3 rounded-xl border border-line bg-line/40 px-3.5 py-3.5 md:px-4.5 md:py-4`,
  then the optional receipt (§4.10).
  - Left: avatar `grid size-8 md:size-9 shrink-0 place-items-center rounded-full bg-line font-mono text-nav font-medium text-muted` (initials), then `flex min-w-0 flex-col wrap-break-word`: name `text-body font-medium text-text` over source `{metaLabel}`.
  - Right: status pill `DemoStatusPill` (`rows[i].done ?? statusDone`). The `statusNew` pill (`rounded-full border border-line px-3 py-1.5 font-mono text-meta text-muted`) is in the markup with `hidden` (`data-anim="demo-before"`).
  - **A done label per row (2026-10-05; Discord row 3):** a row may carry its own `done`; every
    outcome keeps the same pill: accent, tick, text. The words tell a timeout from a warning;
    there is no warning colour (one accent only), so the outcome is never colour alone.
  - **Pills of different widths:** the pill is `whitespace-nowrap` and keeps its own width (48 +
    7.2 a character at 12px mono); `justify-between` sets it on the row's right edge. The text
    column takes what is left and wraps inside it. At 360 the row is 248 inside: the text column
    is 144 − 7.2 × the pill's characters (4.5).
- **ReportDemo** (kind `report`): `flex h-full flex-col justify-end gap-5`.
  - Title row: `flex items-baseline justify-between`: title `font-display text-summary`, week `{metaLabel}`.
  - Chart (`aria-hidden`): `grid min-h-40 flex-1 auto-cols-fr grid-flow-col items-end gap-2.5 border-b border-line`;
    8 bars `block rounded-t-md bg-line`, the last `bg-accent`; heights from `bars` as inline `height: n%`.
    `chartAlt` sits in `sr-only` beside it.
  - `DemoStatusPill` (`sent`), `self-start`.
  - **Hooks (2026-10-05):** every bar carries `data-anim="demo-bar"`; the latest (`bg-accent`)
    bar also `data-bar="latest"`. The bars stay pictures: no `tabindex`, role or cursor, and the
    chart stays `aria-hidden`.
  - **Motion (built 2026-10-05, the user's choice "Light up and grow"; `lib/agentBarHover.ts`):**
    the bar under the pointer, on `(pointer: fine)` only. Its fill fades to `accent` and it
    stretches `scaleY` 1 → 1.08 from its bottom edge, both over 0.25s `power2.out`; on leave both
    ease back and the inline styles are cleared. **Capped:** no bar's top passes the chart's top,
    so the 95% bar stretches 1.053. The latest bar only stretches. **Reduced motion:** the fill
    fades, no stretch; the latest bar shows nothing. Every replay start or revert resets the
    bars. `BAR_HOVER = { stretch: 1.08, ceiling: 1, seconds: 0.25 }`.
- **SyncDemo** (kind `sync`; online-store "Orders to stock" and Discord "Custom commands"): three
  linked tools, three events that each move data from one tool to another, then the pill.
  `flex flex-col gap-6 md:gap-9`.
  ```
  ul class="flex items-center"
  ├ li data-sync-tool={0} class="relative rounded-xl border border-line bg-line/40 px-3.5 py-4 font-mono text-nav font-medium text-text"   ← tools[0]
  │ └ span aria-hidden="true" data-anim="sync-lit" class="pointer-events-none absolute inset-0 rounded-xl border border-accent opacity-0 shadow-[0_0_12px_var(--color-accent)]"
  ├ li aria-hidden="true" data-sync-link={0} class="relative h-px flex-1 border-t border-dashed border-line"   (joins tools 0 and 1)
  │ └ span data-anim="demo-packet" class="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_12px_var(--color-accent)]"
  ├ li data-sync-tool={1} …  ← tools[1]      (with its sync-lit)
  ├ li data-sync-link={1} …  (joins tools 1 and 2, with its demo-packet)
  └ li data-sync-tool={2} …  ← tools[2]      (with its sync-lit)
  ul class="grid gap-2 sm:grid-cols-3 sm:gap-2.5"
  └ li data-demo-order={i + 1} data-sync-from={from index} data-sync-to={to index} class="flex justify-between gap-2 rounded-xl bg-line/40 p-3.5 sm:flex-col sm:justify-start"   × 3
    ├ span class="{metaLabel}"            ← events[i].kind
    └ span class="text-small text-text"   ← events[i].result
  DemoStatusPill label={done} order={4} className="self-center"
  ```
  - **Indexes:** connector `k` joins tools `k` and `k + 1`. Each event's `data-sync-from` /
    `data-sync-to` are the indexes of its `from` / `to` tool names, from `syncToolIndex` in
    `lib/agents.ts`; a name that isn't one of the demo's tools throws, and a load-time check runs
    it over every sync event, so the build fails on a mismatch.
  - **Static (no JS, first paint, reduced motion, after a revert):** each packet sits at its
    connector's midpoint, every `sync-lit` overlay is invisible, all three events and the pill
    are shown.
  - **States:** nothing is interactive: no hover, focus-visible or active state, no cursor.
  - **Contrast:** tool names `text` on `line/40` over `band` above 12:1; event kinds `muted` ≈ 6:1;
    the lit outline is decoration (the event's text says what happened).
  - **Motion (built 2026-10-09, `lib/agentDemoSequences.ts` → `sync()`):** below, 4.7.
- **ChecklistDemo** (kind `checklist`): a short list of work whose boxes turn to ticks. Finished
  state: every box ticked. `flex flex-col gap-5`.
  - Title row `<p class="flex items-baseline justify-between gap-4">`: title
    `font-display text-summary text-text`, meta `{metaLabel}`.
  - List `<ul class="flex flex-col gap-2.5">` of four
    `<li data-demo-order={i + 1} class="flex items-center gap-3 rounded-xl border border-line bg-line/40 px-3.5 py-3 md:px-4.5 md:py-3.5">`, each holding, in order:
    the empty box `<span data-anim="demo-before" aria-hidden="true" class="hidden size-5 shrink-0 rounded-md border border-muted">`;
    the ticked box `<span data-demo-order={5 + i} class="grid size-5 shrink-0 place-items-center rounded-md bg-accent text-on-accent">` with `CheckIcon` (`size-3`);
    the line `<span class="min-w-0 flex-1 text-body text-text">` = `items[i].text`;
    its result `<span class="shrink-0 {metaLabel}">` = `items[i].note` (real text, so "done" is
    never the tick or the colour alone).
  - `DemoStatusPill` (`done`, order 9), `self-start`. Hooks: the `LeadsDemo` contract (4.7).
  - **Also one person's steps (2026-10-05; Discord row 2):** the title is the new member, the meta
    says they are new, the four lines are what happens to them in order, the pill the role given.
- **OrchestraDemo** (kind `orchestra`; `software-builder` row 1 only; swimlanes since 2026-10-04,
  the user's choice). The one question: how does the workflow run? Three lanes side by side,
  **Lead**, the team (`team.label`), the checks (`checks.label`), the middle lane shaded, all in
  one rounded outline. Time runs down: eight rows, one card per row in one lane, each card joined
  to the next by an L-shaped connector (down from the card's bottom centre, then across into the
  next card's side, with an arrowhead). Then the done pill, centred. Finished state: the ticks in
  row 7 and the pill shown. **One form at every width**; only sizes change (4.5).
  ```
   ┌─ lane: Lead ─┬─ lane: team ░░░┬─ lane: checks ┐
   │ [LEAD ① out] │░░░░░░░░░░░░░░░░│               │  r1
   │      └───────┼▶[TEAM roles ②] │               │  r2
   │              │░      ↓       ░│               │
   │              │░ [TEAM ③ work] │               │  r3
   │[LEAD ④ check]◀──────┘        ░│               │  r4
   │      └───────┼────────────────┼▶[CHECKS roles]│  r5  no ticks
   │              │░[TEAM ⑤ fix]◀╌╌┼╌╌╌╌╌╌┘        │  r6  dashed accent card, links in and out
   │              │░      └╌╌╌╌╌╌╌╌┼▶[CHECKS ✓✓✓]  │  r7  ticks, accent
   │[LEAD ⑥ pass]◀┼────────────────┼───────┘       │  r8
   └──────────────┴────────────────┴───────────────┘
                     [✓ done]
  ```
  | Row | Lane (column) | Card holds | Incoming link (from the previous card) |
  |---|---|---|---|
  | 1 | Lead (1) | `lead` · ① `ring.out` | none |
  | 2 | team (2) | `team.label` · `team.roles` chips · ② `ring.rules` | from the left, 1 lane |
  | 3 | team (2) | `team.label` · ③ `ring.work` | straight down |
  | 4 | Lead (1) | `lead` · ④ `ring.check` | from the right, 1 lane |
  | 5 | checks (3) | `checks.label` · `checks.roles` chips, **no ticks** | from the left, 2 lanes |
  | 6 | team (2) | `team.label` · ⑤ `ring.fix`, accent; card `border-dashed border-accent` | from the right, 1 lane, **dashed accent** |
  | 7 | checks (3) | `checks.label` · `checks.roles` chips **with ticks** | from the left, 1 lane, **dashed accent** |
  | 8 | Lead (1) | `lead` · ⑥ `ring.pass` | from the right, 2 lanes |

  The table is data in `lib/orchestraRows.ts` (lane, step key, which roles, ticks, link, fix).
  Every card's first line is its lane's title: no lane header row. Class strings (local to the components):
  - `lanes` = `relative mx-auto grid w-full max-w-150 grid-cols-3 gap-y-4 rounded-xl border border-line py-3 sm:gap-y-5 sm:py-4`
  - `shade` = `absolute inset-y-0 left-1/3 w-1/3 bg-line/40` (the team lane; first child, painted under the cells)
  - `cell` = `relative px-[5%]` + `col-start-1|2|3` + `row-start-1…8` (literal strings from a lookup)
  - `card` = `relative flex min-w-0 flex-col gap-1 rounded-lg border bg-band px-1.5 pb-1.5 pt-3.5 sm:p-2`; Lead `border-accent`, team and checks `border-line`, row 6 `border-dashed border-accent`
  - `laneTitle` = `font-mono text-meta uppercase leading-4 tracking-[0.06em] wrap-break-word`; Lead `text-accent`, the others `text-muted`
  - `roles` = `flex flex-col items-start gap-1 sm:flex-row sm:flex-wrap`; `role` = `inline-flex max-w-full items-center gap-1 rounded-md bg-line px-1 text-meta leading-4 text-text sm:leading-5`; tick `span data-anim="orch-tick" class="text-accent"` → `CheckIcon size-3`
  - `OrchestraStep`: `div data-anim="orch-step" data-step={n} class="flex items-start gap-1.5"` → badge `absolute -top-2.5 left-1.5 grid size-5 shrink-0 place-items-center rounded-full border bg-band font-mono text-meta leading-none sm:static` (`border-muted text-text`; ⑤ `border-accent text-accent`) → label `min-w-0 font-mono text-meta leading-4 text-text wrap-break-word sm:pt-0.5` (⑤ `text-accent`). Below `sm` the badge sits on the card's top-left edge (masked by `bg-band`); from `sm` it sits inline before the label.
  - `OrchestraLink`: one span per incoming link, in the cell, `absolute -top-4 bottom-1/2 sm:-top-5`: its vertical leg runs from the previous card's bottom on the previous lane's centre; its horizontal leg ends at this card's side at mid-height.
    From the left: `rounded-bl-lg border-b border-l` with `-left-1/2 right-[95%]` (1 lane) or `left-[-150%] right-[95%]` (2 lanes), arrowhead `ChevronRightIcon absolute -right-1.5 bottom-0 size-4 translate-y-1/2`.
    From the right: `rounded-br-lg border-b border-r` with `left-[95%] -right-1/2` or `left-[95%] right-[-150%]`, arrowhead the same icon `-left-1.5 rotate-180`.
    Straight down (row 3): `left-1/2 h-4 bottom-auto border-l sm:h-5`, arrowhead `ChevronUpIcon absolute -bottom-1.5 left-0 size-4 -translate-x-1/2 rotate-180`.
    Lines `border-muted`, arrowheads `text-muted`; rows 6 and 7: `border-dashed border-accent` at 2px, arrowhead `text-accent`.
    The percentages are of the cell, so the lines hold at every width with no breakpoint.
  ```
  div.flex.flex-col.gap-4 xl:gap-5
  ├ ol.sr-only → li × 6                                                  ← demo.steps[0–5]
  ├ div aria-hidden="true" data-anim="orch-diagram" class="{lanes}"
  │ ├ span data-anim="orch-lane" data-lane="team" class="{shade}"
  │ ├ div data-anim="orch-row" data-row="1" data-lane="lead" data-demo-order="1" class="{cell} col-start-1 row-start-1"
  │ │ └ div data-anim="orch-card" class="{card} border-accent" → p.{laneTitle} ← demo.lead; OrchestraStep 1 ← demo.ring.out
  │ ├ div … data-row="2" data-lane="team" data-demo-order="2" class="{cell} col-start-2 row-start-2"
  │ │ ├ OrchestraLink from="left" lanes={1} data-anim="orch-link" data-link="2"
  │ │ └ card → title ← demo.team.label; ul.{roles} → li.{role} data-anim="orch-role" × 3 ← demo.team.roles[i]; OrchestraStep 2 ← demo.ring.rules
  │ ├ … rows 3–8 as the table (row 7's roles carry the ticks, data-demo-order 8–10)
  │ └ span data-anim="orch-token" class="hidden size-2 rounded-full bg-accent"   (motion only; nothing in static)
  └ DemoStatusPill label={demo.done} order={12} className="self-center"
  ```
  - **Reading it:** the lane says who acts, the numbers give the order, the arrows the direction.
    The accent dashed card and links are the fix, the same language as Process' returns
    (`05-process.md` §5.3a); row 5's chips without ticks against row 7's with ticks are the pass,
    said again by ⑥ and the pill.
  - **Contrast:** lane titles, lines, chevrons and badge rings `muted` on `band` ≈ 6.5:1; labels
    and roles `text` on `band` or `line` above 12:1; Lead's title, ⑤ and the fix links `accent` on
    `band` ≈ 8:1. The pass is said in text (⑥ and the pill), never by the ticks or colour alone.
  - **Text equivalent:** the drawing is `aria-hidden`; `ol.sr-only` reads the six steps in full
    sentences, then the pill reads the outcome. Nothing in it is focusable or interactive.
  - **Motion (built 2026-10-04, `lib/orchestraRun.ts`; paced at random since 2026-10-05, 5s at
    most):** the rows pop in by `data-demo-order`; then `orch-token` leaves row 1's card bottom and
    rides each `orch-link` in turn (down, then across). Each card it reaches flashes: its border
    goes to `accent` and back with a small scale pulse; a card already in the accent lifts its
    background to `line` instead. At row 5 one `orch-role` chip blinks twice as an accent fill (a
    finding). The token rides the two dashed links (rows 6, 7); row 7's ticks pop in order; the
    token rides row 8's link back to the Lead; then the pill pops and the token is gone. Trigger:
    the panel showing. Reduced: fades by `data-demo-order`, no token. The token moves by `x`/`y`
    only, measured from the DOM; the links are never written.
    **Pacing:** the rows pop in 0.04s apart and the token shows at 0.6s. Each link's ride takes
    0.65–1.3 × its even ride (0.13s down, plus 0.17s across one lane or 0.23s across two), and the
    token stays in each card for a drawn time: 0.04–0.2s; 0.34–0.5s at row 5; 0.16–0.36s at row 7;
    none at row 8. Measured 4.55–5.00s.
- **DemoStatusPill:** `inline-flex items-center gap-2 rounded-full bg-accent px-3.5 py-2 font-mono text-meta font-medium whitespace-nowrap text-on-accent`, with `CheckIcon` (`size-3`).
- ~~**`AgentPointerPanel`** (kind `pointer`)~~ **Removed 2026-10-07** with the `website` set; the
  component, its replay and `AgentDemoFrame`'s `header` prop are gone.
- Every timed part carries `data-demo-order="n"` (its place in the sequence) for the GSAP pass.

Nothing inside a demo panel is interactive: boxes, cards, chips, ticks, tools and events are
pictures, not inputs, so they take no hover, focus-visible or active state. **The one exception
(2026-10-05, the user's choice):** the Report chart's bars take a pointer hover and nothing else.
They are still pictures: not focusable, no focus-visible or active state, no tap, no cursor change.

| Report bar | Default | Hover (`(pointer: fine)`) | Hover, reduced motion | Focus-visible, active, touch |
|---|---|---|---|---|
| A bar | `bg-line` | fill fades to `accent`; `scaleY` up to 1.08 | fill fades to `accent`, no stretch | none |
| The latest bar (`data-bar="latest"`) | `bg-accent` | `scaleY` up to 1.08 (1.053 at 95%), fill unchanged | none | none |

### 4.5 Sizes

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Layout | stacked: intro, tag, panel with the stepper on top; tab list hidden | same | A: 2 cols (616 each), left pinned at 120, no stepper; fallback: rows 5/7 | A: 720 each; fallback: 5/7 of 1536 |
| Label (`monoLabel`) | 13px | 13px | 13px | 13px |
| Heading (`text-heading-sm`, 2 lines) / lead (`text-lead`, `max-w-sm`) | 25px / 17px | 28px / 17px | 40px / 17px | 56px / 17px |
| "Shown for" tag | 44 tall, 20 under the intro (§0.6) | same | same | same |
| Row title (`text-row`) | hidden (tab list) | hidden | ≈ 32px | 44px |
| Row line (`text-lead`) | in the stepper instead (15px) | same | 17px | 17px |
| Tab list, 4 rows / 5 rows | hidden | hidden | ≈ 430 / 530 | same as 1440 |
| Stepper | 320 wide, padding 16, ≈ 148 tall (line on 2 lines) | 706 wide, ≈ 125 (line on 1 line) | hidden | hidden |
| Stepper ‹ / › | 44 circle, chevron 16 | same | — | — |
| Stepper counter / title | 12px mono / 20px display, centred in ≈ 174, up to 2 lines | 12px / 23px | — | — |
| Stepper bars | 2 tall, 4 apart, 56 in from each side; 4 bars ≈ 40 wide, 5 ≈ 32 | 4 ≈ 137, 5 ≈ 109 | — | — |
| Stepper line (`text-body`) | 15px muted, centred, ≤ 3 lines | 1–2 lines | — | — |
| Panel | 320 wide, min 384 tall, + the stepper | 706 wide, min 384, + the stepper | A: min 616×554 (1024: 439×395; 1280: 541×487); fallback: min ~737×460 | A: min 720×648; fallback: min ~840×525 |
| Panel padding | 20 | 32 | 36 | 36 |
| Chat bubble text | 16px | 16px | 16px | 16px |
| List row (leads) | 60 tall, circle 32 | 68, circle 36 | same | same |
| Leads done pill (12px mono) | 35 tall; 6 characters ≈ 91 wide, 9 ≈ 113, 12 ≈ 134 | same | same | same |
| Leads text column beside it | 248 inside the row: 101 / 79 / 58 wide beside a 6 / 9 / 12-character pill | ≥ 407; one line | ≥ 311 (1024: ≥ 142); one line | ≥ 413; one line |
| Report chart | min 160 tall | same | fills the panel | same |
| Sync tools (13px mono, padding 14 × 16) | 3 across, ≤ 6 characters each (≈ 75 wide); connectors ≈ 52 each | same tools; connectors ≈ 233 | connectors ≈ 155 (1024: ≈ 70) | connectors ≈ 205 |
| Sync dot (`demo-packet`) / lit overlay (`sync-lit`) | 8px dot, 12px glow / the tool's own box, 1px `accent` outline, 12px glow | same | same | same |
| Sync events | stacked, 3 rows, kind left and result right | 3 across (`sm:`), kind over result | same | same |
| Checklist title (`text-summary`) / meta | 20px / 12px | 23px / 12px | 26px / 12px | 26px / 12px |
| Checklist, whole | ≈ 325–420 tall | ≈ 345 | ≈ 350, inside the panel's 554 | ≈ 350, inside 648 |

**The panel's `lg` minimum, measured (2026-10-03).** `aspect-[10/9]` makes the height 0.9 × the
width. The body box (inside the 52px header, the 2px border and the padding) is then: 1024 ≈
375×277, 1280 ≈ 467×361, 1440 ≈ 544×428, 3840 ≈ 646×522.

**Sync at 360 (the tightest):** the body is 278 wide; three six-character tools at ≈ 75 leave two
connectors of about 26 each, and the travelling dot still crosses each end to end. A longer tool
name shortens the connectors (one line each, a sizing note); nothing scrolls sideways because the
connectors are `flex-1` and shrink first. The lit overlay is the tool's own box (`inset-0`), so it
adds no size; its glow is paint only.

**Orchestra, the swimlanes** (estimates from the class sizes, builder copy; measured 2026-10-04 in
the page doc):

| Element | Phone 360 | Tablet 768 | Desktop 1024 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|---|
| Lane set | 278 wide (the body), lanes 92; radius 12, 12 top and bottom inside | 600 (`max-w-150`), lanes 199; 16 inside | 375, lanes 124 | 542, lanes 180 (1280: 467, lanes 155) | 600, lanes 199 |
| Card | 83 wide (90% of the lane); padding 6, top 14 (the badge); text ≈ 69 wide | 179; padding 8; text ≈ 161 | 112; text ≈ 94 | 162; text ≈ 144 | as 768 |
| Lane title (12px mono caps) | one word a line; no word over 8 characters (≈ 63) | 1 line | 1 line up to 11 characters, else 2 | 1 line | 1 line |
| Step badge / label | badge 20 on the card's top-left edge; label 12px in ≈ 69: 1–2 lines, ≤ 9 characters a line | badge inline; label ≈ 135 wide, 1 line | label ≈ 68 wide: most labels take 2 lines | label ≈ 118: 1 line up to 16 characters (1280: 13) | as 768 |
| Role chips | stacked, 16 tall, 4 apart; with tick ≤ 7 characters | in a row, 20 tall, wrapping: row 7 (ticks) 2 rows | team 2 rows, row 5 2, row 7 3 | team 1 row, row 5 1, row 7 2 | as 768 |
| Card height | 58 (one-line title and label) to 150 (row 2) | 58; rows 2 and 7: 82 | 58–120 | 58; rows 2 and 7: 82 | as 768 |
| Row gap, links | 16; lines 1px, fix 2px dashed, corner radius 8, arrowheads 16 | 20 | 20 | 20 | 20 |
| Pill | 35 tall, centred, 16 below | same | same | 20 below | as 1440 |
| Whole, with the pill | ≈ 940 | ≈ 740 | ≈ 865 | ≈ 740 (1280 ≈ 795) | ≈ 740 |
| **Orchestra panel** | ≈ 1030 + stepper ≈ **1180** | ≈ 855 + stepper ≈ **980** | ≈ **980** (min 395) | ≈ **870** (min 554; 1280 ≈ 920, min 487) | ≈ **870** (min 648) |
| No-JS fallback (`stack`) | as phone, no stepper | as tablet | grows the 16:10 panel to ≈ 900 | ≈ 870 (min 460) | ≈ 870 (min 525) |

- **The panel's height changes between tabs** (the user, 2026-10-04): each panel is as tall as its
  demo (chat ≈ 384–560 + stepper on a phone; orchestra ≈ 1180; 554 → ≈ 870 at 1440).
- From `lg` the orchestra panel is taller than the sticky column, so the column pins and the panel
  scrolls past it, as sticky is meant to.
- The sticky column (intro, tag, four rows) is 686px tall, 806 with its 120px top, at 1024×768:
  38px over the screen (open, page doc). It fits at 1440 and 3840.
- **Nothing scrolls sideways:** orchestra links span lanes inside the lane set, labels and titles
  take `wrap-break-word`, chips `max-w-full`; the pill (≤ 20 characters ≈ 192) fits 278; the
  stepper's title wraps inside ≈ 174; a leads row's pill leaves its text column at least 58 at 360;
  sync connectors shrink before the tools do.

### 4.6 Content slots (`content/home.ts → agents`)

`<set>` is `default`, `service-business`, `online-store`, `discord` or `software-builder`
(`website` removed 2026-10-07). The `default` set is written in the shared voice; each card's set
in its own tone (`docs/04-voice.md`, Tone per card). Sample content inside a demo panel may name
an everyday product (constitution §7.4); it never names a real client, business or result (§7.5).
The "Limit" column is a sizing note from when the layout was drawn, not a rule (`docs/04-voice.md`
→ Length, 2026-10-05).

| Key | Meaning | Limit (sizing note) |
|---|---|---|
| `agents.number` / `agents.label` | "01" and the section label; shared voice | 5 words |
| `agents.heading.lead` / `.accent` (2026-10-08) | The section's h2, two lines; `accent` its second line in violet | two lines in `heading-sm` |
| `agents.lead` (2026-10-08) | The bridge line: the page's one definition of "AI agent", by comparison with ChatGPT (facts → What an AI agent is) | about 3–4 lines in `max-w-sm` |
| `agents.demoStatus` | The panel status ("working for you") | 3 words |
| `agents.demoAgent` | Screen-reader name before each agent bubble | 1 word |
| `agents.demoAction` | Screen-reader name before each receipt (§4.10) | 1 word |
| `agents.stepper.prev` / `.next` | Screen-reader names of the ‹ and › buttons | 2 words |
| `agents.stepper.position` | Screen-reader only: which offer of how many; `{n}` and `{total}` filled in code. Also starts the press announcement | 4 words, both placeholders, no end punctuation |
| `agents.cards.<set>[i].title` | The offer's name; also the stepper's title below `lg` | 1–3 words / 20 characters |
| `agents.cards.<set>[i].line` | What the agent does for the reader, in plain present tense (constitution §7.3); also the stepper's line below `lg` | 12 words |
| `agents.cards.<set>[i].slug` | The panel's sample agent name, plain words ("your bookings") | 16 characters |
| `…demo` for `chat`: `asker`, `messages[] {from, text, meta?}` or `{from: "action", text, where}` | `asker`: screen-reader name of the other side. The lines of one short exchange, in order, with one receipt (§4.10) | text 12 words / 70 characters; meta 4 words |
| `…demo` for `leads`: `rows[3] {initials, name, source, done?}`, `statusNew`, `statusDone`, `action?` | Three people, where each came from (in a moderation list: what each did), the pill before and after the agent acts, and the closing receipt (§4.10). `done` replaces `statusDone` on its row; set it on all three rows or on none | initials 2 characters; name 18 characters, no word over 6; source 20 characters; statuses 12 characters; **the pill's characters plus the source's longest word are 20 at most** |
| `…demo` for `report`: `title`, `week`, `bars[8]`, `chartAlt`, `sent` | Report sample: title, period, bar heights (%), hidden chart text, sent status (who it went to and when) | title 3 words, week 2, alt 12, sent 6 |
| `…demo` for `sync`: `tools[3]`, `events[3] {kind, result, from, to}`, `done` | Three linked tools. Three events, each moving data between two of them: `kind` what happened, `result` the action in the tool it landed in, **`from` the tool it starts at, `to` the tool it lands in (2026-10-09)**. `done` the final status, a state or the owner's benefit | tools 1 word / 6 characters each; events 3 words each; `from` and `to` must each be one of `tools` exactly (the build fails otherwise) and differ; done 4 words |
| `…demo` for `checklist`: `title`, `meta`, `items[4] {text, note}`, `done` | What is worked through, a mono tag, four pieces of work each with its one-word result, the final status | title 3 words; meta 14 characters; text 28 characters; note 8 characters; done 4 words |
| `…demo` for `orchestra`: `lead` | The Lead lane's title, on rows 1, 4 and 8: a plain role word | 8 characters |
| `…demo.team`: `{ label, roles[3] }` | The team lane's title (rows 2, 3, 6) and three specialist roles (row 2); no agent, tool or model names | label no word over 8 characters; each role 8 characters |
| `…demo.checks`: `{ label, roles[3] }` | The checks lane's title (rows 5, 7) and the three checks: review, the standards check and tests, in the card's words | label no word over 8 characters; each role 7 characters |
| `…demo.ring`: `{ out, rules, work, check, fix, pass }` | The six numbered step labels: ① the lead hands each part out, ② the specialist reads the standards, ③ does the work and reports, ④ the lead sends it to the checks, ⑤ a finding goes back to be fixed and checked again, ⑥ every check passes, back to the lead | 16 characters; splits at a space into two lines of ≤ 9 at 360; lower case, no end punctuation |
| `…demo.steps[6]` | Screen-reader only, one full sentence per numbered step | 12 words each |
| `…demo.done` | The pass, on the pill | 20 characters |

**The two sync demos (2026-10-09), as wired:**

| Set, row | `tools` | Events: `kind` → `result` (`from` → `to`, connectors crossed) | `done` |
|---|---|---|---|
| `online-store` 3, "Orders to stock" | Store, Stock, Sheets | new order → stock count lowered (Store → Stock, 1) · order paid → added to your sales sheet (Store → Sheets, 2) · item shipped → order marked shipped (Stock → Store, 1, right to left) | the owner's benefit: nothing copied by hand |
| `discord` 5, "Custom commands" | Server, Sheets, Twitch | /signup used → row in Sheets (Server → Sheets, 1) · /stock used → read from Sheets (Sheets → Server, 1, right to left) · stream goes live → posted in #live (Twitch → Server, 2, right to left) | all up to date |

Both cross four connectors in all, which sets their replay length (4.7). Wording is copywriter's,
in `content/home.ts`; the `key`s are `kind`, so each event's `kind` is unique within its demo.

**Orchestra copy rules:** facts → How the user works only. No agent, file, tool or model names, and
no counts in any text; the digits 1–6 are generated in code. The `software-builder` demo may use
builders' words.

**Discord's demos, in the Discord tone.** Illustrations (constitution §7.5): sample first names
and outcomes, no real member or server. Row 2 (`checklist`) is one member's welcome: `title` a
sample new member, `meta` that they are new, `items` joined, sent to the rules or onboarding,
reacted, role given; `done` that the role is given. Row 3 (`leads`) is three flagged members:
`source` what each did, `done` what the bot did about it; `statusNew` is "flagged".

### 4.7 Components, images, motion

- **Components:** `components/home/agents/AgentsSection.tsx`, `AgentsTabs.tsx` (client, A),
  `AgentsStepper.tsx` (4.2a), `AgentsStack.tsx` (fallback), `AgentsAllOffers.tsx` (hidden,
  SEO), `AgentRowText.tsx`, `AgentDemoFrame.tsx`, `AgentDemo.tsx`, `ChatDemo.tsx`, `LeadsDemo.tsx`,
  `ReportDemo.tsx`, `SyncDemo.tsx` (**2026-10-09:** each tool carries `data-sync-tool` and its
  `sync-lit` overlay, each connector `data-sync-link`, each event `data-sync-from` and
  `data-sync-to`), `ChecklistDemo.tsx`, `OrchestraDemo.tsx`, `OrchestraRow.tsx`,
  `OrchestraLink.tsx`, `OrchestraStep.tsx`, `DemoStatusPill.tsx`, `DemoActionLine.tsx` (§4.10);
  shared `components/home/pick/ShownForTag.tsx`, `components/SectionLabel.tsx`,
  `components/SectionHeading.tsx`, `components/TypingBubble.tsx`. Icons reused: `ChevronUpIcon`,
  `ChevronRightIcon`, `CheckIcon`. No new icon. **Images:** none.
  `hooks/useRovingTabs.ts`, `hooks/useAboutPick.ts`, `hooks/useShownSet.ts`,
  `hooks/useAgentsMotion.ts`, `hooks/useSwapFade.ts`. `lib/agents.ts` (the kinds and content
  shapes; **2026-10-09:** `SyncDemoContent.events[]` gains `from` and `to`; `syncToolIndex(tools,
  name)` and the load-time check over every sync event), `lib/orchestraRows.ts`,
  `lib/listNumber.ts`, `lib/fillTemplate.ts`.
- **Static state** (also the no-motion and first-paint state): first offer selected, its row line
  full and (below `lg`) its stepper bar full, every demo finished, dots solid, sync packets at
  their connector midpoints with every `sync-lit` hidden, every checklist box ticked, the
  orchestra's row 7 ticked with its pill shown, every receipt ticked.

**Motion, as built.** `AgentsTabs` calls `hooks/useAgentsMotion.ts` (re-run on a set, entrance
once, kinds per set) and `hooks/useSwapFade.ts`. The replays are in `lib/agentDemoSequences.ts`
(`playDemo`, one sequence per kind), the pop every part shares in `lib/agentDemoPop.ts`
(`y 8px, scale .96 → none`, 0.45s, 0.15s after the panel shows), the receipt in
`lib/agentDemoReceipt.ts` and the orchestra's run in `lib/orchestraRun.ts`. Every sequence ends
inside the 6s slot. Below `lg` the 6s advance times the hidden row's `agent-progress` and the
stepper's bar on one tween. **No replay loops** since 2026-10-09 (`loops` is empty for every kind).

**Pacing (built 2026-10-05, the user's decision; full motion only).** Each demo has a longest time,
and each of its work steps (a chat gap, the typing dots, a lead handled, a line ticked, a bar's
turn, the wait before a sync dot, a link's ride, a card's hold) draws its time at random from its
own `[min, max]` range. The time a step takes is deducted from what is left, and the rest is passed
on; a step never takes so much that the steps after it lose their minimum. `lib/demoBudget.ts →
spendBudget(budget, steps, random)` does this. Every time is fixed when a replay is built.
**Not drawn:** the parts' first pop-in staggers, the sync dot's crossings (0.4s each, fixed) and
everything under reduced motion (fades by `data-demo-order`, evenly spaced, no randomness).

**The sync replay (built 2026-10-09, the user's call; `sync()` in `lib/agentDemoSequences.ts`,
numbers in `SYNC`).** Trigger: the panel showing, as every demo.
1. **Start:** every packet and every `sync-lit` overlay is set hidden (`opacity: 0`) as the
   sequence is built, so no packet shows at its midpoint for a frame. The events and the pill are
   popped by the sequence.
2. **Each event, one at a time, in order.** The first dot sets off at 0.35s (`workAt`). Its route
   is the connectors from `data-sync-from` to `data-sync-to`: one or two, left to right when `to`
   is further right, right to left when it is further left. Each connector's own packet crosses
   it end to end in 0.4s (`cross`), linear, by `x` (with `xPercent: -50` holding the centring);
   on a two-connector route the second packet takes over at the middle tool with no gap and no
   fade, so it reads as one dot. The dot fades in over the route's first 0.12s and out over its
   last 0.12s (`packetFade`). Each crossing reads its connector's width as it starts.
3. **The landing:** as the dot lands, the `to` tool's `sync-lit` rises over 0.15s, holds 0.2s
   and fades over 0.5s (`litUp`, `litHold`, `litOut`), and the event's box pops (`POP_FROM`,
   0.45s). The next dot sets off a drawn wait of [0.2, 0.7]s after that pop starts.
4. **The end:** the pill pops 0.2s before the last event's pop ends (`pillLap`). **As it pops,
   every packet fades back in at its connector's midpoint, all together and without travel, over
   0.3s** (`packetBack`; decided 2026-10-09, in build), so the replay ends on the static picture.
5. **Length:** four crossings in both demos, so 3.2–4.0s by design (`longest` 4s; was 3s with
   the packet loop). Not yet measured on screen.
- **Writers:** `x`, `xPercent` and `opacity` on `demo-packet`; `opacity` on `sync-lit`; the pop on
  the events and pill. Tools, connectors and the `data-sync-*` attributes are read, never written.
- **Reduced motion:** unchanged: the events and pill fade in by `data-demo-order`; the packets stay
  at their midpoints, nothing travels and nothing lights.
- **Revert** (a selection change, a set change, teardown) gives the static finished state.
- **Known limits (open for review in the page doc):** on a two-connector route the dot jumps
  across the middle tool's width at the hand-off between the two packets; the replay has no loop
  to pause off screen, so like chat, leads, checklist and report it can finish while off screen.

| Layer (hooks) | State | Why, and what it needs |
|---|---|---|
| Entrance: the intro (one block) and `agents-row` rows rise, `agents-panels` fades up | **Keep**, once per page load | Below `lg` the rows are hidden; the panels box (with the stepper) still fades up |
| 6s auto-advance and the `agent-progress` line | **Keep** | Wraps on the row count; restarts on row 1 after a set change |
| The stepper bar's fill (`agent-progress-bar`) | **Built 2026-10-04** | One tween with the row's line; stops where it is while held. Reduced: the selected bar full |
| The stepper's title and line | **Built 2026-10-04** | Fade in over 0.25s on a selection change only; the same under reduced motion |
| Pause on hover, on focus, off screen, in a hidden tab | **Keep** | The stepper is inside `agents-panels`, so its focus and hover pause it too |
| Status dot blink | **Keep** | Opacity, while the demo is live; solid under reduced motion |
| Replay, `leads` | **Paced at random 2026-10-05**, 3.2s at most (4.4s with a receipt) | Counting from 0.8s, each pill swaps 0.16–0.8s after the last; then the receipt (§4.10). Measured 1.89–3.19s without a receipt |
| Replay, `report` | **Paced at random 2026-10-05**, 2.4s at most | Each bar grows over 0.6s and starts 0.03–0.25s after the one before. Measured 1.60–2.39s |
| Replay, `sync` (`demo-packet`, `sync-lit`, `data-sync-*`) | **Rebuilt 2026-10-09**: one dot per event, 4s at most; the packets' return at the end in build | Above. Replaces the packet loop (left → right on a loop, which wasn't tied to the events) |
| Replay, `chat` | **Built 2026-10-04**, typing dots before every agent line. **Paced at random 2026-10-05**, 5s at most (4.5s with a receipt) | The dots hold 0.5–1.4s, then the line; the next part follows each message by 0.3–1.1s. Measured 2.05–3.89s with three messages, 3.63–5.00s with four |
| Replay, `checklist` | **Paced at random 2026-10-05**, 3.4s at most | Counting from 0.65s, each box turns to its tick 0.15–0.7s after the last; the pill 0.25s after the last tick. Measured 2.51–3.40s |
| Replay, `orchestra` | **Built 2026-10-04**, the token run. **Paced at random 2026-10-05**, 5s at most | 4.4 Motion. Measured 4.55–5.00s |
| The receipt (`demo-action`) | **Built 2026-10-08** | §4.10.5 |
| The Report bars' hover (`demo-bar`) | **Built 2026-10-05** | `lib/agentBarHover.ts → bindBarHover`, `(pointer: fine)` only (4.4) |
| Reduced motion: fades by `data-demo-order`, no advance, full line and bar, solid dot | **Keep** | No typing dots, no swaps, no packets moving, no tool lit, no token |
| Swap fade (§0.5) | **Built 2026-10-04** | Wrappers: `agents-tablist`, `agents-stepper` and each `agent-panel`. Not `agents-panels`, whose opacity the entrance owns. The intro and the tag don't fade |
| The tag's fade and chevron turn (§0.6) | **Built 2026-10-04** | `hooks/useShownForMotion.ts` |

- **Hooks in the markup:** `agents-tablist`, `agents-row`, `agent-progress`, `agents-panels`,
  `agent-panel`, `agents-stepper`, `agents-stepper-title`, `agents-stepper-line`,
  `agent-progress-bar`, `demo-status-dot`, `demo-typing`, `demo-before`, `demo-packet`,
  `demo-bar` (and `data-bar="latest"`), `demo-action`, `demo-action-pending`, `demo-action-tick`,
  `data-demo-order`, `data-set`, `pick-tag`, `pick-tag-list` (§0.6). **Sync (2026-10-09):**
  `data-sync-tool` (each tool, its index), `sync-lit` (the overlay in each tool),
  `data-sync-link` (each connector, its index), `data-sync-from` and `data-sync-to` (each event,
  tool indexes). **Orchestra:** `orch-diagram`, `orch-lane` (`data-lane="team"`), `orch-row`
  (`data-row` 1–8, `data-lane`), `orch-card`, `orch-step` (`data-step` 1–6), `orch-link`
  (`data-link` 2–8; `data-fix` on 6 and 7), `orch-role`, `orch-tick`, `orch-token`. Orchestra
  order: rows 1–7 are 1–7, row 7's ticks 8–10, row 8 is 11, the pill 12.

### 4.8 Offers per card and their panels (`lib/agents.ts`)

Lead offer first. Every offer is a line in `docs/03-facts.md` → What the user builds. Titles as in
`content/home.ts` today.

| Set | Row | Title | Panel | The sample shows |
|---|---|---|---|---|
| `default` (2026-10-08) | 1 | Bookings | `leads` | three booking requests, each turning to booked; receipt to the calendar |
| | 2 | Customer messages | `chat` | an opening-hours question, answered, then booked; receipt |
| | 3 | Order questions | `chat` | **(2026-10-09)** a refund request the agent passes to Sam, the owner; hand-off receipt (§4.10.8) |
| | 4 | New enquiries | `leads` | three enquiries, each followed up; receipt |
| `service-business` | 1 | Bookings | `leads` | as default row 1, in the card's tone |
| | 2 | Customer messages | `chat` | a routine question, answered, then booked |
| | 3 | Reminders | `chat` | the agent reminds first; the customer moves the slot |
| | 4 | New enquiries | `leads` | three enquiries, each followed up |
| `online-store` | 1 | Order questions | `chat` | where an order is; a tracking link sent |
| | 2 | Sales reports | `report` | a weekly sales chart, sent to Sam |
| | 3 | **Orders to stock** (2026-10-09; was "Store tools connected") | `sync` | Store, Stock, Sheets: each order event lands in a different tool (4.6); the pill names the owner's benefit |
| | 4 | Returns | `leads` | three requests, each passed on; receipt to Sam |
| `discord` | 1 | Member questions | `chat` | an @mention, answered with a past chat recalled |
| | 2 | Welcome and roles | `checklist` | one new member; four steps tick off in order, then "role given" |
| | 3 | Moderation | `leads`, a done label per row | three flagged members, each ending its own way |
| | 4 | Activity reports | `report` | a weekly activity chart, sent to the owner |
| | 5 | Custom commands | `sync` | Server, Sheets, Twitch: commands and a stream event moving data both ways (4.6) |
| `software-builder` | 1 | Workflow setup | `orchestra` | swimlanes: the lead hands out, the team works to the standards and reports, the checks, a finding goes back, all checks passed |
| | 2 | App or feature | `checklist` | four pieces of a feature, each ticked off |
| | 3 | Production ready | `checklist` | four problems found, each fixed |
| | 4 | After launch | `report` | a weekly chart, with fixes shipped |

- `agentPanelKinds` (type-tied to `agents.cards`): `default: ["leads", "chat", "chat", "leads"]`,
  `"service-business": ["leads", "chat", "chat", "leads"]`, `"online-store": ["chat", "report",
  "sync", "leads"]`, `discord: ["chat", "checklist", "leads", "report", "sync"]`,
  `"software-builder": ["orchestra", "checklist", "checklist", "report"]`.
- The workflow offer's picture: `sync` (superseded by decision A) → a tree → the numbered loop
  (2026-10-03) → **swimlanes** (2026-10-04, the user's choice).
- `leads` is people only (initials in the circle); work items use `checklist`, which also shows
  one person's steps in order (Discord row 2).
- The action line (a receipt row saying what the agent did and where it went) is specced in its
  own file, `04-agents-action.md` (§4.10, choices 39–48).

### 4.9 Choices

**Decided by the user, 2026-10-03:**

1. **Demo kinds:** `checklist` added for the software-builder "build" and "rescue" rows; the
   workflow offer moves to `orchestra`; `sync` stays on the two tools rows.
2. **`ChatDemo`:** an ordered message list.
3. ~~**The pointer panel**~~ — moot since 2026-10-07 (the `website` set is removed).
4. **Bookings:** a list panel, not a chat.
5. **The `default` set:** its own copy in the shared voice.
6. **Vendor names:** allowed inside demo sample content (constitution §7.4).
7. **Motion:** built in the 2026-10-04 motion pass (4.7).
8. ~~The orchestra's shape: a numbered loop.~~ Superseded by 15.

**Settled or superseded:** 9 (how the fix loop is drawn) is superseded by the swimlanes' dashed
card and links; 10 (three team roles) settled; 11 (the orchestra still until the motion pass)
built 2026-10-04; 12–14 superseded by 15.

**Decided by the user, 2026-10-04:**

15. **The orchestra is swimlanes** (4.4).
16. **Lane titles inside every card at every width**; no lane header row.
17. **Below `lg`, arrows in the panel's top block** (4.2a) replace "list first, then the panel below".

**Decided in this spec (the lead may review):** 18. one shared stepper outside the per-offer
panels; 19. wrap-around, never disabled; 20. announce on a press only; 21. the lane set caps at
600; 22. Lead cards keep `border-accent`.

**Decided by the lead, 2026-10-04:** 23. panel height per tab changes (the user's choice);
24. the step badge on the card's top-left edge below `sm`; 25. the 124px lanes at 1024 accepted;
26. Lead cards: accent border plus accent title.

**Decided by the user, 2026-10-05 (Discord):** 27. "Welcome and roles" is a checklist;
28. "Moderation" ends each row its own way. **Decided in this spec:** 29. an optional
`rows[i].done` over `statusDone`; 30. every outcome keeps the accent pill; 31. pills keep their
own widths, with the pair limit in 4.6.

**Decided by the user, 2026-10-05 (pacing):** 32. the demo replays are paced at random (Agents only).

**Decided in the build, 2026-10-05 (open for review; the built option is first):**

33. **The orchestra's spread:** a 5s ceiling (runs 4.55–5.00s), or about 5.4s.
34. **The token's ride:** its speed varies per link as well as its stay, or the stay only.
35. **`report` runs longer on average** (about 0.5s), as built, or its range pulled back. (Sync's
    half of this choice is moot: its replay was rebuilt on 2026-10-09, 3.2–4.0s.)

**Decided by the user, 2026-10-05 (the Report bars):** 36. the bars light up and grow under the
pointer. **Open for review:** 37. the latest bar shows no hover under reduced motion (as built), or
a second colour; 38. the tallest bar's cap at the chart's top (as built), or the full 1.08.

**Choices 39–48** (the action line, decided 2026-10-08): `04-agents-action.md` §4.10.7.

**Decided by the user, 2026-10-09:**

49. **The sync demo runs one dot per event — decided.** No packet loop. Each event's dot runs from
    its `from` tool to its `to` tool, one or two connectors, either direction, 0.4s a connector;
    the `to` tool lights and the event's box pops as it lands; then the pill (4.7). Why: the loop
    wasn't tied to the events, and "item shipped" lands back in the Store while the dots only ran
    left to right. Reduced motion and the no-JS finished state are unchanged.
50. **The replay ends on the static picture — decided:** the packets fade back in at their
    midpoints as the pill pops (4.7 step 4). In build.
51. **Online-store row 3 is "Orders to stock" — decided:** Store, Stock, Sheets; each event lands in
    a different tool (new order → Stock, order paid → Sheets, item shipped → Store); the card and
    pill name the owner's benefit (nothing typed by hand), within the facts (tools connected so data
    moves between them).

**Decided in the build, 2026-10-09 (open for review; the built option is first):**

52. **The hand-off on a two-connector route:** the second connector's packet takes over at the
    middle tool with no gap and no fade, so the dot jumps the middle tool's width (≈ 75px at
    360) in one frame, as built. Or the dot fades out at the middle tool and in on the far side.
    The page doc asks for a screen check before choosing.
