# §4 Agents: UI spec

Shared rules and parts (§0): [`../ui-spec.md`](../ui-spec.md). Page doc: [`../sections/04-agents.md`](../sections/04-agents.md).

**Last Updated:** 2026-10-05. The fixed four offers are replaced by offers per About card (the
user's decisions of 2026-10-03). The pick, its memory and the "Shown for" tag are shared rules:
`../ui-spec.md` §0.5 and §0.6. Every choice in 4.9 is decided except the ones marked open. No new
motion is built this round; the built motion keeps running where it still works (4.7).
**2026-10-03 (the user's decision A):** the workflow offer's demo is the kind `orchestra` (4.4,
`OrchestraDemo`), on `default` row 4 and `software-builder` row 1 only.
**2026-10-04 (the user's two changes; static, not built yet):**
1. **The orchestra becomes swimlanes** (4.4), replacing the numbered loop: three lanes (Lead, the
   team, the checks), time running down, eight cards joined by L-shaped connectors, the lane's
   title inside every card. The content keys don't change (4.6), only their limits.
2. **Below `lg`, the panel gets a stepper** (4.2a): ‹ and › buttons, the counter, the selected
   offer's title, progress bars and its line, above the status header. The vertical tab list
   hides below `lg`. From `lg` nothing changes. This replaces "list first, then the panel below"
   (2026-09-24).

**2026-10-04, the motion pass (built and checked; this spec brought in line 2026-10-05):** the
stepper's bar fill and text fade (4.2a), the orchestra's token run (4.4), the checklist's own
sequence, the typing dots before every agent line, the pointer panel's pop and the swap fade are
built. State and numbers: 4.7. No layout, copy or token change.

**2026-10-05 (the user's two Discord changes; built and checked the same day):** row 2 "Welcome
and roles" moves from `leads` to `checklist` (4.8; `ChecklistDemo` as built), and row 3
"Moderation" stays `leads` with a done label of its own on each row (4.4: an optional
`rows[i].done` over the shared `statusDone`). No new component, token or motion.

**2026-10-05, later (the user's decision on pacing; built and measured the same day):** the demo
replays are no longer evenly paced. Each work step draws its time at random from a range, and the
time it takes is deducted from the demo's longest time before the rest passes on
(`lib/demoBudget.ts`). The rule, the ranges and the measured times: 4.7, Pacing; the orchestra's:
4.4. The pointer panel and reduced motion are unchanged. No layout, copy, token or markup change.

**2026-10-05, later still (the user's decision on the Report bars; built and checked the same
day):** under a mouse pointer the hovered bar turns the accent and stretches up a little (4.4,
4.7; choices 4.9 36–38). Two markup hooks; no layout, copy or token change.

## 4. Agents (the one question: what can their agents handle for my business?)

The user picked variant A (tab list), 2026-09-24. Variant B's list (`AgentsStack`) ships only as A's `<noscript>` fallback.
**2026-10-03:** the tab list shows the picked card's offers, four or five rows, lead offer first.
With no pick, or "Not sure yet", it shows the `default` set. The server markup holds `default` only.

### 4.1 Shared parts

- `AgentsSection` (server): section frame, `id="agents"`, no `border-t`. Takes no props; it renders
  the tabs layout (4.2) with `AgentsStack` (4.3) as the no-JS fallback.
- `SectionLabel as="h2"` with `agents.number` and `agents.label`. There's no big heading here.
- **`ShownForTag`** (`../ui-spec.md` §0.6) sits right under the label, in one group:
  `<div class="flex flex-col gap-4">` → label, tag. Radio name `agents-shown-for`.
- `AgentRowText`: `grid grid-cols-[1.25rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-2.5`:
  number `font-mono text-meta`; title `font-display font-semibold text-row leading-none tracking-[-0.035em] {condensed}`;
  line `col-start-2 text-lead leading-normal text-muted`.
- `AgentDemoFrame` (the panel): `flex flex-col rounded-3xl border border-line bg-band`. No
  `overflow-hidden`: the panel grows to fit its demo and never clips it. Prop `variant`: `tabs`
  (A's panel) or `stack` (the fallback rows).
  - Header: `flex items-center justify-between gap-4 border-b border-line px-5 py-4 {metaLabel}`: a status dot
    (`size-1.5 rounded-full bg-accent`, `aria-hidden`, `data-anim="demo-status-dot"`) with
    `agents.demoStatus`, and the slug on the right. An optional `header` prop replaces this row's
    content (the pointer panel, 4.4, has no status dot).
  - Body: `relative flex flex-1 flex-col justify-center p-5 md:p-8 xl:p-9`.
  - Size: `min-h-96` below `lg`; from `lg`, `lg:aspect-[10/9]` for `tabs` or `lg:aspect-[16/10]`
    for `stack`, with `lg:min-h-auto`. The ratio is a minimum: a taller demo grows the panel.
  - **New 2026-10-04:** `tabs` adds `max-lg:rounded-t-none`: below `lg` the stepper (4.2a) is the
    card's rounded top, and the frame's top border is the line between them.
- Inner raised surfaces in panels (bubbles, rows, chips) use `bg-line/40`.

### 4.2 Variant A: tab list (`AgentsTabs`, client)

- Layout: `<div data-set={set}>` with `splitColumns` + `noscript:block lg:items-center` (`splitColumns` from `lib/styles.ts`:
  `grid gap-10 md:gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24`).
  `noscript:block` drops the two columns without JS, so the fallback list takes the full width. Left:
  `flex flex-col gap-10` (the label-and-tag group, then the tab list). Right: the stepper (below
  `lg`) and the set's panels, in `agents-panels`. **Phone and tablet (2026-10-04):** label, tag,
  then the panel with the stepper on top; the tab list is hidden.
- **The set.** `AgentsTabs` reads `useAboutPick()` → `pickSet` → `useShownSet` (§0.5) and draws
  `agents.cards[set]`: four rows, or five for `discord` and `website`. The tab list and the panels
  are keyed by set, so a change remounts them; the wrappers (`agents-tablist`, `agents-panels`)
  persist. On a change the selection returns to row 1 (`useRovingTabs` reset key) and focus stays
  where it is.
- **Sticky (2026-09-25):** from `lg` the left column adds `stickyTitle`
  (`lg:sticky lg:top-30 lg:self-start`). The grid keeps `lg:items-center`. Phone and tablet stay unpinned.
- Tab list: `<div role="tablist" aria-orientation="vertical" aria-labelledby={labelId} class="max-lg:hidden noscript:hidden">`
  (**2026-10-04:** `max-lg:hidden`; both are `display: none`, so they never fight). Each row is
  `<button role="tab" aria-labelledby aria-selected aria-controls tabIndex={selected ? 0 : -1}>` with
  `group relative block w-full cursor-pointer border-t border-line py-5 text-left` + `focusRing`, holding `AgentRowText`.
  The row's one-line description renders on the selected row only.
- **Names:** each tab and its panel are named by the row's number and title only, through
  `agentRowIds()` in `lib/agents.ts`. The description is visible but not part of the name.
- Progress line per row: `<span aria-hidden data-anim="agent-progress" class="absolute inset-x-0 -top-px h-px origin-left bg-accent">`,
  full width on the selected row in static, `scale-x-0` on the others.
- Panels wrapper: `<div id={`${idPrefix}-panels`} data-anim="agents-panels" class="noscript:hidden">` (the `id` is
  new, for the stepper's `aria-controls`). In it, the stepper, then one
  `<div role="tabpanel" id aria-labelledby tabIndex={0} class="rounded-3xl max-lg:rounded-t-none">` + `focusRing`
  per offer; the unselected ones have `hidden`. First offer selected on load.
- Keyboard (`hooks/useRovingTabs.ts`): Up/Down move and select (wrapping), Home/End jump, Tab
  moves into the panel. `select` never moves focus (clicks, the stepper, the auto-advance); the
  keyboard path selects and focuses the tab. **New:** `step(delta: 1 | -1)` selects the previous
  or next offer with wrap-around and moves no focus (the stepper's buttons).
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

### 4.2a The stepper, below `lg` (`AgentsStepper`, new 2026-10-04, the user's choice)

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
│ │ └ span data-anim="agents-stepper-title" class="font-display text-summary font-semibold leading-[1.15] tracking-[-0.02em] text-balance text-text"   ← panel.title
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
- **Announcement:** focus stays on the pressed button. The live region gets "Offer 2 of 4: Order
  questions" (the position template, then the title) **only from a press**, never from the
  auto-advance (it would speak every 6s) and never from a set change (the tag's own live region
  speaks then, §0.6). The message clears when the set changes, with the same in-render reset as
  `useRovingTabs`. The visible counter is `aria-hidden`; the `sr-only` position reads in its place.
- **Semantics below `lg`:** the tablist is `display: none`, so no tab is in the tab order or the
  accessibility tree. The panels stay `role="tabpanel"`, still named by the row's number and title
  (`aria-labelledby` may point at hidden ids). Tab order: tag, ‹, ›, the panel. **From `lg`:** the
  stepper is `display: none` and the tab list works as in 4.2. One markup, nothing duplicated.
- **Five offers:** counter "01 / 05", five bars. A set change puts the counter back on 01 with the
  new count; the bars remount.
- **The auto-advance** pauses while focus is in `agents-panels` (built), so a pressed button
  holds the offer. Where a tap gives no focus (iOS Safari), a press restarts the 6s line on the
  new offer, as a click on a tab does.
- **Motion (built 2026-10-04, `hooks/useAgentsMotion.ts`):** the selected offer's bar
  (`agent-progress-bar`) grows `scaleX` 0 → 1 over the 6s, on the same tween as that row's
  `agent-progress`, so the two pause and resume as one. While the auto-advance is held (focus in
  `agents-panels`, or the pointer on it) the bar stops where it is: it shows empty after a press
  of ‹ or ›, which restarts it at 0 and keeps focus on the button. `agents-stepper-title` and
  `agents-stepper-line` fade in over 0.25s (`power2.out`) on a selection change only, never on
  the first paint or a set change; opacity only, the same under reduced motion. Reduced: the
  selected bar stays full, no advance.

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
`report`, `sync`, `checklist` and `orchestra`.

- **ChatDemo** (kind `chat`): `flex flex-col gap-3.5`. It draws an ordered list of 2–4 `messages`,
  so a chat can open with either side.
  - Visitor bubble (`from: "them"`): `self-start max-w-[70%] rounded-xl rounded-bl-sm bg-line/40 px-4.5 py-3.5 text-body-lg text-text`.
  - Before each agent message, the typing dots in their own agent-side bubble (`TypingBubble side="end"`,
    `data-anim="demo-typing"`, `aria-hidden`). Hidden in static; the GSAP pass shows them.
  - Agent message (`from: "agent"`): `self-end flex max-w-[72%] flex-col items-end gap-1.5` → bubble `rounded-xl rounded-br-sm bg-accent px-4.5 py-3.5 text-body-lg text-on-accent`, then its optional meta `{metaLabel}`.
  - **Who speaks:** each bubble starts with a `sr-only` speaker name (`demo.asker` or
    `agents.demoAgent`), so the turn isn't carried by side and colour alone.
- **LeadsDemo** (kind `leads`, a list of people whose rows turn to done): `flex flex-col gap-2.5`, three rows
  `flex items-center justify-between gap-3 rounded-xl border border-line bg-line/40 px-3.5 py-3.5 md:px-4.5 md:py-4`.
  - Left: avatar `grid size-8 md:size-9 shrink-0 place-items-center rounded-full bg-line font-mono text-nav font-medium text-muted` (initials), then `min-w-0` name `text-body font-medium text-text` over source `{metaLabel}`.
  - Right: status pill `DemoStatusPill` (`statusDone`). The `statusNew` pill (`rounded-full border border-line px-3 py-1.5 font-mono text-meta text-muted`) is in the markup with `hidden` (`data-anim="demo-before"`).
  - **A done label per row (new 2026-10-05; the user's choice, for Discord row 3):** a row may
    carry its own `done`. The pill's label is `rows[i].done`, or `statusDone` where the row has
    none; `statusDone` stays required as the fallback, so every other set is unchanged. Every
    outcome keeps the same pill: accent, tick, text. The words tell a timeout from a warning;
    there is no warning colour (one accent only), so the outcome is never colour alone.
  - **How the row holds with pills of different widths:** the pill is `whitespace-nowrap` and
    keeps its own width (48 + 7.2 a character at 12px mono); `justify-between` sets it on the
    row's right edge, so the three pills share a right edge and differ on the left. The name
    and source column (`flex min-w-0 flex-col`) takes what is left and wraps inside it; it gains
    `wrap-break-word`, the guard for a word over its limit (4.6). At 360 the row is 248 inside:
    avatar 32, two 12 gaps, so the text column is 144 − 7.2 × the pill's characters (4.5). As
    today, a row may grow by a line at 360 when its `statusNew` pill swaps to a longer one.
  - **Motion: unchanged.** Each row's hidden `statusNew` pill still swaps to that row's done
    pill (the row's first ordered child), whatever its label.
- **ReportDemo** (kind `report`): `flex h-full flex-col justify-end gap-5`.
  - Title row: `flex items-baseline justify-between`: title `font-display font-semibold text-summary tracking-[-0.02em]`, week `{metaLabel}`.
  - Chart (`aria-hidden`): `grid min-h-40 flex-1 auto-cols-fr grid-flow-col items-end gap-2.5 border-b border-line`;
    8 bars `block rounded-t-md bg-line`, the last `bg-accent`; heights from `bars` as inline `height: n%`.
    `chartAlt` sits in `sr-only` beside it.
  - `DemoStatusPill` (`sent`), `self-start`.
  - **Hooks (2026-10-05):** every bar carries `data-anim="demo-bar"`; the latest (`bg-accent`)
    bar also `data-bar="latest"` (a marker: the hover reads each bar's own fill, not this). The
    bars stay pictures: no `tabindex`, role or cursor, and the chart stays `aria-hidden`. The
    hover says nothing `chartAlt` doesn't, and no text is added.
  - **Motion (built 2026-10-05, the user's choice "Light up and grow"; `lib/agentBarHover.ts`):**
    what moves: the bar under the pointer. Trigger: pointer enter, on `(pointer: fine)` only and
    never from a touch. Its fill fades to `accent` and it stretches `scaleY` 1 → 1.08 from its
    bottom edge, both over 0.25s `power2.out`; on leave both ease back the same way and the
    inline styles are cleared, so the classes own the resting look. **Capped:** no bar's top
    passes the chart's top, so the 95% bar stretches 1.053. The latest bar only stretches.
    Fill and transform only: no layout changes and nothing in 4.5 moves (measured at 1440, a
    225px bar reaches 243px). **Reduced motion:** the fill fades, no stretch; the latest bar
    shows nothing. **Beside the replay:** a bar still growing lights at once and stretches
    after it lands; every replay start or revert resets the bars.
    `BAR_HOVER = { stretch: 1.08, ceiling: 1, seconds: 0.25 }`.
- **SyncDemo** (kind `sync`; the online-store "connected tools" and the discord "custom commands"
  rows): `flex flex-col gap-6 md:gap-9`.
  - Node row: `flex items-center`: three nodes `rounded-xl border border-line bg-line/40 px-3.5 py-4 font-mono text-nav font-medium text-text`,
    with a connector between each pair: `relative h-px flex-1 border-t border-dashed border-line`,
    and a packet `absolute left-1/2 -top-1 size-2 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_12px_var(--color-accent)]` (`data-anim="demo-packet"`, `aria-hidden`).
  - Events: `grid gap-2 sm:grid-cols-3 sm:gap-2.5`; each `flex justify-between gap-2 rounded-xl bg-line/40 p-3.5 sm:flex-col sm:justify-start`: kind `{metaLabel}`, result `text-small text-text`.
  - `DemoStatusPill` (`done`), `self-center`.
- **ChecklistDemo** (kind `checklist`): a short list of work whose boxes turn to ticks. Finished
  state: every box ticked. `flex flex-col gap-5`.
  - Title row `<p class="flex items-baseline justify-between gap-4">`: title
    `font-display font-semibold text-summary tracking-[-0.02em] text-text`, meta `{metaLabel}`.
  - List `<ul class="flex flex-col gap-2.5">` of four
    `<li data-demo-order={i + 1} class="flex items-center gap-3 rounded-xl border border-line bg-line/40 px-3.5 py-3 md:px-4.5 md:py-3.5">`, each holding, in order:
    the empty box `<span data-anim="demo-before" aria-hidden="true" class="hidden size-5 shrink-0 rounded-md border border-muted">`;
    the ticked box `<span data-demo-order={5 + i} class="grid size-5 shrink-0 place-items-center rounded-md bg-accent text-on-accent">` with `CheckIcon` (`size-3`);
    the line `<span class="min-w-0 flex-1 text-body text-text">` = `items[i].text`;
    its result `<span class="shrink-0 {metaLabel}">` = `items[i].note` (real text, so "done" is
    never the tick or the colour alone).
  - `DemoStatusPill` (`done`, order 9), `self-start`. Hooks: the `LeadsDemo` contract (4.7).
  - **Also one person's steps (2026-10-05, the user's choice; Discord row 2):** the title is the
    new member, the meta says they are new, the four lines are what happens to them in order,
    and the pill is the role given. The component is used as built: no prop, class or hook
    changes.
- **OrchestraDemo** (kind `orchestra`; **redrawn 2026-10-04 as swimlanes, the user's choice**; it
  replaces the numbered loop). The one question: how does the workflow run? Three lanes side by
  side, **Lead**, the team (`team.label`), the checks (`checks.label`), the middle lane shaded,
  all in one rounded outline. Time runs down: eight rows, one card per row in one lane, each card
  joined to the next by an L-shaped connector (down from the card's bottom centre, then across
  into the next card's side, with an arrowhead). Then the done pill, centred. Finished state: the
  ticks in row 7 and the pill shown. **One form at every width**; only sizes change (4.5).
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
  Every card's first line is its lane's title (the user's decision): no lane header row.
  Class strings (local to the components):
  - `lanes` = `relative mx-auto grid w-full max-w-150 grid-cols-3 gap-y-4 rounded-xl border border-line py-3 sm:gap-y-5 sm:py-4`
  - `shade` = `absolute inset-y-0 left-1/3 w-1/3 bg-line/40` (the team lane; first child, painted under the cells)
  - `cell` = `relative px-[5%]` + `col-start-1|2|3` + `row-start-1…8` (literal strings from a lookup; one card per row, so every row is placed explicitly)
  - `card` = `relative flex min-w-0 flex-col gap-1 rounded-lg border bg-band px-1.5 pb-1.5 pt-3.5 sm:p-2`; Lead `border-accent`, team and checks `border-line`, row 6 `border-dashed border-accent`
  - `laneTitle` = `font-mono text-meta uppercase leading-4 tracking-[0.06em] wrap-break-word`; Lead `text-accent`, the others `text-muted`
  - `roles` = `flex flex-col items-start gap-1 sm:flex-row sm:flex-wrap`; `role` = `inline-flex max-w-full items-center gap-1 rounded-md bg-line px-1 text-meta leading-4 text-text sm:leading-5`; tick `span data-anim="orch-tick" class="text-accent"` → `CheckIcon size-3`
  - `OrchestraStep` (extended): `div data-anim="orch-step" data-step={n} class="flex items-start gap-1.5"` → badge `absolute -top-2.5 left-1.5 grid size-5 shrink-0 place-items-center rounded-full border bg-band font-mono text-meta leading-none sm:static` (`border-muted text-text`; ⑤ `border-accent text-accent`) → label `min-w-0 font-mono text-meta leading-4 text-text wrap-break-word sm:pt-0.5` (⑤ `text-accent`). **Below `sm` the badge sits on the card's top-left edge** (masked by `bg-band`), so the label gets the card's full width; from `sm` it sits inline before the label, as in the mock. The label wraps (no `whitespace-nowrap`, no `xl:text-nav`).
  - `OrchestraLink` (new): one span per incoming link, in the cell, `absolute -top-4 bottom-1/2 sm:-top-5`: its vertical leg runs from the previous card's bottom (one row gap up) on the previous lane's centre; its horizontal leg ends at this card's side at mid-height.
    From the left: `rounded-bl-lg border-b border-l` with `-left-1/2 right-[95%]` (1 lane) or `left-[-150%] right-[95%]` (2 lanes), arrowhead `ChevronRightIcon absolute -right-1.5 bottom-0 size-4 translate-y-1/2`.
    From the right: `rounded-br-lg border-b border-r` with `left-[95%] -right-1/2` or `left-[95%] right-[-150%]`, arrowhead the same icon `-left-1.5 rotate-180`.
    Straight down (row 3): `left-1/2 h-4 bottom-auto border-l sm:h-5`, arrowhead `ChevronUpIcon absolute -bottom-1.5 left-0 size-4 -translate-x-1/2 rotate-180`.
    Lines `border-muted`, arrowheads `text-muted`; rows 6 and 7: `border-dashed border-accent` at 2px (`border-b-2` + `border-l-2` or `border-r-2`), arrowhead `text-accent`.
    The percentages are of the cell (one lane wide; the card fills 90% of it), so the lines hold at every width with no breakpoint.
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
  │ └ span data-anim="orch-token" class="hidden size-2 rounded-full bg-accent"   (motion pass; nothing in static)
  └ DemoStatusPill label={demo.done} order={12} className="self-center"
  ```
  - **Reading it:** the lane says who acts, the numbers give the order, the arrows the direction.
    The shaded middle lane separates the team from the lead and the checks. The accent dashed
    card and links are the fix, the same language as Process' returns (`05-process.md` §5.3a); row
    5's chips without ticks against row 7's with ticks are the pass, said again by ⑥ and the pill.
  - **Contrast:** lane titles, lines, chevrons and badge rings `muted` on `band` ≈ 6.5:1; labels
    and roles `text` on `band` or `line` above 12:1; Lead's title, ⑤ and the fix links `accent` on
    `band` ≈ 8:1. The pass is said in text (⑥ and the pill), never by the ticks or colour alone.
  - **Text equivalent:** the drawing is `aria-hidden`; `ol.sr-only` reads the six steps in full
    sentences, then the pill reads the outcome. Nothing in it is focusable or interactive.
  - **Motion (built 2026-10-04, `lib/orchestraRun.ts`; paced at random since 2026-10-05, 5s at
    most, inside the 6s slot):** on
    show, the rows pop in by `data-demo-order`; then `orch-token` leaves row 1's card bottom and
    rides each `orch-link` in turn (down, then across). Each card it reaches takes it in and
    flashes: its border goes to `accent` and back with a small scale pulse; a card already in the
    accent (Lead, the fix) lifts its background to `line` instead. At row 5 one `orch-role` chip
    blinks twice as an accent fill (background `accent`, text `on-accent`; not an outline): a
    finding. The token rides the two dashed links (row 6, then row 7); row 7's ticks pop in
    order; the token rides row 8's link back to the Lead; then the pill pops and the token is
    gone. Trigger: the panel showing, as every demo. Reduced: fades by `data-demo-order`, no
    token. The token moves by `x`/`y` only, along each link's two legs, measured from the DOM as
    it reaches the link; no link's `left`/`right` is written, and the links themselves are not
    drawn in (no `clip-path` on them).
    **Pacing (2026-10-05; the rule is in 4.7, Pacing):** the rows still pop in 0.04s apart and
    the token still shows at 0.6s. Each link's ride then takes 0.65–1.3 × its even ride (0.13s
    down, plus 0.17s across one lane or 0.23s across two; both legs at the one drawn pace), and
    the token stays in each card it reaches for a drawn time: 0.04–0.2s; 0.34–0.5s at row 5,
    never shorter than the finding's two blinks; 0.16–0.36s at row 7, as the ticks pop; none at
    row 8, where the pill pops. The token's 0.1s pop out of and into a card, the flashes, the
    blink and the ticks keep their own lengths, and the order never changes. A run takes
    3.74–5s by the constants; measured, 4.55–5.00s (it was about 4.80s every time).
- **DemoStatusPill:** `inline-flex items-center gap-2 rounded-full bg-accent px-3.5 py-2 font-mono text-meta font-medium whitespace-nowrap text-on-accent`, with `CheckIcon` (`size-3`).
- **`AgentPointerPanel`** (kind `pointer`; the website card's "custom websites" row). Not an
  agent demo: it points to section 03. `AgentDemoFrame variant="tabs"` with `header` =
  `agents.pointer.status` on the left and `web.number` on the right (no status dot). Body
  `flex flex-col gap-6`:
  - Heading `<p data-demo-order="1" class="font-display text-card font-semibold leading-[1.05] tracking-[-0.02em] text-balance text-text {condensed}">` = `agents.pointer.heading`.
  - Steps `<ol data-demo-order="2" class="flex flex-col border-t border-line">`: one
    `<li class="flex items-baseline gap-4 border-b border-line py-3">` per `web.steps[i].title`:
    number `{metaLabel}` (`listNumber`), title `text-body-lg text-text`.
  - Link `<a data-demo-order="3" href={routes.web} class="{pillOutline} gap-2 self-start">` =
    `agents.pointer.cta` + `ArrowRightIcon` (`size-4 rotate-90`). Secondary style: Book a call
    stays the only primary action.
- Every timed part carries `data-demo-order="n"` (its place in the sequence) for the GSAP pass.

| Pointer link | Default | Hover | Focus-visible | Active |
|---|---|---|---|---|
| `pillOutline` | `border-line text-text` | `hover:border-accent hover:text-accent` | `focusRing` | `active:bg-band` |

Nothing inside a demo panel is interactive, the checklist and the orchestra included: boxes,
cards, chips and ticks are pictures, not inputs, so they take no hover, focus-visible or active
state. **The one exception (2026-10-05, the user's choice):** the Report chart's bars take a
pointer hover and nothing else. They are still pictures, not inputs: not focusable, no
focus-visible or active state, no tap, no cursor change.

| Report bar | Default | Hover (`(pointer: fine)`) | Hover, reduced motion | Focus-visible, active, touch |
|---|---|---|---|---|
| A bar | `bg-line` | fill fades to `accent`; `scaleY` up to 1.08 | fill fades to `accent`, no stretch | none |
| The latest bar (`data-bar="latest"`) | `bg-accent` | `scaleY` up to 1.08 (1.053 at 95%), fill unchanged | none | none |

### 4.5 Sizes

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Layout | stacked: label, tag, panel with the stepper on top; tab list hidden | same | A: 2 cols (616 each), left pinned at 120, no stepper; fallback: rows 5/7 | A: 720 each; fallback: 5/7 of 1536 |
| Label (`monoLabel`) | 13px | 13px | 13px | 13px |
| "Shown for" tag | 44 tall, 16 under the label (§0.6) | same | same | same |
| Row title (`text-row`) | hidden (tab list) | hidden | 58px | 58px |
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
| Leads done pill (12px mono; `rows[i].done` or `statusDone`; new row 2026-10-05) | 35 tall; 6 characters ≈ 91 wide, 9 ≈ 113, 12 ≈ 134 | same pill | same pill | same pill |
| Leads text column beside it (name over source) | 248 inside the row: 101 / 79 / 58 wide beside a 6 / 9 / 12-character pill; source on 1–2 lines, + ≈ 19 a wrapped line | ≥ 407; one line | ≥ 311 (1024: ≥ 142); one line | ≥ 413; one line |
| Report chart | min 160 tall | same | fills the panel | same |
| Sync nodes | 3 across, ≤ 6 characters each | same | same | same |
| Checklist title (`text-summary`) / meta | 20px / 12px | 23px / 12px | 26px / 12px | 26px / 12px |
| Checklist, whole | ≈ 325–420 tall | ≈ 345 | ≈ 350, inside the panel's 554 | ≈ 350, inside 648 |
| Pointer heading (`text-card`) | 30px | 35px | 44px | 44px |
| Pointer steps / link | 16px rows, 49 tall / pill 48 tall | same | same | same |

**The panel's `lg` minimum, measured (2026-10-03).** `aspect-[10/9]` makes the height 0.9 × the
width. The body box (inside the 52px header, the 2px border and the padding) is then: 1024 ≈
375×277, 1280 ≈ 467×361, 1440 ≈ 544×428, 3840 ≈ 646×522.

**Orchestra, the swimlanes** (estimates from the class sizes, builder copy; check on the build):

| Element | Phone 360 | Tablet 768 | Desktop 1024 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|---|
| Lane set | 278 wide (the body), lanes 92; radius 12, 12 top and bottom inside | 600 (`max-w-150`), lanes 199; 16 inside | 375, lanes 124 | 542, lanes 180 (1280: 467, lanes 155) | 600, lanes 199 |
| Card | 83 wide (90% of the lane); padding 6, top 14 (the badge); text ≈ 69 wide | 179; padding 8; text ≈ 161 | 112; text ≈ 94 | 162; text ≈ 144 | as 768 |
| Lane title (12px mono caps) | one word a line: "Build team", "The checkers" take 2 lines; no word over 8 characters (≈ 63) | 1 line | 1 line up to 11 characters, else 2 | 1 line | 1 line |
| Step badge / label | badge 20 on the card's top-left edge; label 12px in ≈ 69: 1–2 lines, ≤ 9 characters a line | badge inline; label ≈ 135 wide, 1 line | label ≈ 68 wide: most labels take 2 lines | label ≈ 118: 1 line up to 16 characters (1280: 13) | as 768 |
| Role chips | stacked, 16 tall, 4 apart; with tick ≤ 7 characters | in a row, 20 tall, wrapping: row 7 (ticks) 2 rows | team 2 rows, row 5 2, row 7 3 | team 1 row, row 5 1, row 7 2 | as 768 |
| Card height | 58 (one-line title and label) to 150 (row 2) | 58; rows 2 and 7: 82 | 58–120 | 58; rows 2 and 7: 82 | as 768 |
| Row gap, links | 16; lines 1px, fix 2px dashed, corner radius 8, arrowheads 16 | 20 | 20 | 20 | 20 |
| Pill | 35 tall, centred, 16 below | same | same | 20 below | as 1440 |
| Whole, with the pill | ≈ 940 (default copy ≈ 890) | ≈ 740 | ≈ 865 | ≈ 740 (1280 ≈ 795) | ≈ 740 |
| **Orchestra panel** | ≈ 1030 + stepper ≈ **1180** (default ≈ 1130) | ≈ 855 + stepper ≈ **980** | ≈ **980** (min 395) | ≈ **870** (min 554; 1280 ≈ 920, min 487) | ≈ **870** (min 648) |
| No-JS fallback (`stack`) | as phone, no stepper | as tablet | grows the 16:10 panel to ≈ 900 | ≈ 870 (min 460) | ≈ 870 (min 525) |

- **The orchestra now grows the panel at every width** (the user's swimlanes with a title in
  every card: eight cards of two or more lines). The panel's height changes between tabs
  (chat ≈ 384 + stepper; orchestra ≈ 1180 on a phone; 554 → ≈ 870 at 1440). Decided by the lead (4.9, 23–26): the height changes with the demo, and each panel is as tall as its demo.
- **What grows it:** row count (fixed at 8) and line wraps. The lane set caps at 600, so from 768
  the labels sit on one line; at 1024 the lanes are 124 wide and most labels wrap, which is the
  tallest desktop case. Below `sm` the card padding, row gap and chip height are the tightest that
  keep the badge, 12px type and 16px lines.
- From `lg` the panel is taller than the tab list for this offer, so the sticky column pins and
  the panel scrolls past it, as sticky is meant to.
- A five-row list with the tag open is about 700px at 1024, taller than the pinned space (648).
  The column then scrolls with the page at its end.
- **Nothing scrolls sideways:** every link spans lanes inside the lane set, the badge sits inside
  its lane, arrowheads reach 6px into their card. Lane titles and labels take `wrap-break-word`, so
  a word over the limit breaks instead of overflowing; chips take `max-w-full`. The pill
  (≤ 20 characters ≈ 192) fits 278. The stepper's title wraps (`text-balance`) inside ≈ 174.
  A leads row's pill (≤ 12 characters ≈ 134) leaves its text column at least 58 at 360, and the
  pair limit in 4.6 keeps every word inside it (2026-10-05).

### 4.6 Content slots (`content/home.ts → agents`)

`<set>` is `default`, `service-business`, `online-store`, `discord`, `software-builder` or
`website`. The `default` set is written in the shared voice; each card's set in its own tone
(`docs/04-voice.md`, Tone per card). Sample content inside a demo panel may name an everyday
product (constitution §7.4); it never names a real client, business or result (§7.5).

| Key | Meaning | Limit |
|---|---|---|
| `agents.number` / `agents.label` | "01" and the section label (the section's h2); shared voice | 5 words |
| `agents.demoStatus` | "agent running" panel status (sample) | 3 words |
| `agents.demoAgent` | Screen-reader name before each agent bubble | 1 word |
| `agents.stepper.prev` (**new 2026-10-04**) | Screen-reader name of the ‹ button: go to the previous offer in the list | 2 words |
| `agents.stepper.next` (**new**) | Screen-reader name of the › button: go to the next offer | 2 words |
| `agents.stepper.position` (**new**) | Screen-reader only: which offer of how many is shown; `{n}` and `{total}` are filled in code (e.g. "Offer {n} of {total}"). Also starts the press announcement, before the title | 4 words, both placeholders, no end punctuation |
| `agents.cards.<set>[i].title` | The offer's name; also the stepper's title below `lg` | 1–3 words / 20 characters |
| `agents.cards.<set>[i].line` | What the agent does for the reader, in plain present tense (constitution §7.3); also the stepper's line below `lg` | 12 words |
| `agents.cards.<set>[i].slug` | The panel's sample agent name (not on the pointer row) | 1 slug, 16 characters |
| `…demo` for `chat`: `asker`, `messages[2–4] {from, text, meta?}` | `asker`: screen-reader name of the other side. The lines of one short exchange, in order; `meta` is a mono note under an agent line | asker 2 words; text 12 words / 70 characters; meta 4 words |
| `…demo` for `leads`: `rows[3] {initials, name, source, done?}`, `statusNew`, `statusDone` | Three people, where each came from (in a moderation list: what each did), and the pill before and after the agent acts. **`done` (new 2026-10-05, optional):** what the agent did about that one person, for a list whose three rows end differently; it replaces `statusDone` on its row. Set it on all three rows or on none | initials 2 characters; name 3 words / 18 characters, **no word over 6 characters**; source 3 words / 20 characters; statuses 2 words / 12 characters; `done` 3 words / 12 characters, lower case, no end punctuation. **In each row, the pill's characters plus the source's longest word are 20 at most** (the word then fits beside the pill at 360) |
| `…demo` for `report`: `title`, `week`, `bars[8]`, `chartAlt`, `sent` | Report sample: title, period, bar heights (%), hidden chart text, sent status | title 3 words, week 2, alt 12, sent 6 |
| `…demo` for `sync`: `tools[3]`, `events[3] {kind, result}`, `done` | Three linked tools, three events passing data between them, final status | tools 1 word / 6 characters each; events 3 words each; done 4 words |
| `…demo` for `checklist`: `title`, `meta`, `items[4] {text, note}`, `done` | What is worked through, a mono tag, four pieces of work each with its one-word result, the final status | title 3 words; meta 2 words / 14 characters; text 4 words / 28 characters; note 1 word / 8 characters; done 4 words |
| `…demo` for `orchestra`: `lead` | The Lead lane's title, on rows 1, 4 and 8: a plain role word | 1 word / 8 characters |
| `…demo.team`: `{ label, roles[3] }` | `label`: the team lane's title, on rows 2, 3 and 6: the specialists as a group. `roles`: three specialist roles on row 2, plain role words; no agent, tool or model names | label 2 words, **no word over 8 characters** (one word a line at 360); each role 1 word / 8 characters (the old 16-character total is dropped: the chips wrap) |
| `…demo.checks`: `{ label, roles[3] }` | `label`: the checks lane's title, on rows 5 and 7. `roles`: the three checks, review, the rules check and tests, in that order, in the card's words | label 2 words, no word over 8 characters; each role 1 word / **7 characters** (chip and tick fit 69 at 360) |
| `…demo.ring`: `{ out, rules, work, check, fix, pass }` | The six numbered step labels, same meanings as before: ① the lead hands each part out, ② the specialist reads the rules, ③ does the work and reports, ④ the lead sends it to the checks, ⑤ a finding goes back to be fixed and checked again, ⑥ every check passes, back to the lead | each 3 words / 16 characters, **no word over 9 characters, and it must split at a space into two lines of ≤ 9** (at 360). One line from 768. Lower case, no end punctuation |
| `…demo.steps[6]` | Screen-reader only, one full sentence per numbered step, same order and meaning as `ring` | 12 words each |
| `…demo.done` | The pass, on the pill | 4 words / 20 characters |
| `agents.pointer.status` / `heading` / `cta` | The pointer panel's header, its one-line offer, its link text | 3 / 6 / 4 words |

The pointer's step list reuses `web.steps[0–3].title` and `web.number`. No slot is added for it.
**Orchestra copy rules:** facts → How the user works only. No agent, file, tool or model names, and
no counts in any text; the digits 1–6 are generated in code, like Process' step numbers. The
`software-builder` demo may use builders' words; `default` keeps the shared voice.
**For copywriter (2026-10-04):** `default`'s `team.label` "Specialists" (11 characters, one word)
is over the 8-character word limit, and its `ring.fix` "fix, check again" can't split into two
lines of 9; both need rewording. The builder copy fits as it stands. The three `stepper` keys are new.

**Discord's two demos (2026-10-05), in the Discord tone.** Both are illustrations (constitution
§7.5): sample first names and outcomes, no real member or server. The offers are in
`docs/03-facts.md` → For a Discord server (welcoming and roles; routine moderation).
- **Row 2, `checklist`, read as one member's welcome:** `title` a sample new member (a first
  name and an initial); `meta` that they are new; `items` the four steps in order: joined, sent
  to the rules or onboarding, reacted, role given, each `note` its one-word result; `done` that
  the role is given. The checklist's limits hold as they are.
- **Row 3, `leads`, read as three flagged members:** `source` is what each did, `done` what the
  bot did about it (a timeout, a warning, a report to the server's mods); `statusNew` is the
  pill before the bot acts. With `done` on all three rows the set's `statusDone` is never on
  screen; it stays as the fallback.
- **For copywriter (2026-10-05):** the copy in `content/home.ts` fits; nothing is over. Row
  3's third row now pairs the 10-character word in its source with the 9-character pill "mods
  told": 19, inside the pair limit (it was 22 with a 12-character pill). Rows 1 and 2 fit (15
  and 13). Every other `leads` set already meets the pair limit and the 6-character name
  limit.

### 4.7 Components, images, motion

- **Components:** `components/home/agents/AgentsSection.tsx`, `AgentsTabs.tsx` (client, A; renders
  the stepper first in `agents-panels`, which gains an `id`; the tab list gains `max-lg:hidden`),
  **new** `AgentsStepper.tsx` (4.2a; its press-only message is local state),
  `AgentsStack.tsx` (fallback), `AgentRowText.tsx`, `AgentDemoFrame.tsx` (`tabs` gains
  `max-lg:rounded-t-none`), `AgentDemo.tsx`, `ChatDemo.tsx`, `LeadsDemo.tsx`, `ReportDemo.tsx`,
  `SyncDemo.tsx`, `ChecklistDemo.tsx`, `OrchestraDemo.tsx` (**rewritten** as the lane set: the sr
  list, the outline, the shade, the eight rows from `lib/orchestraRows.ts`, the pill), **new**
  `OrchestraRow.tsx` (one cell: its card, title, roles and step, and its incoming link),
  **new** `OrchestraLink.tsx` (one L connector and its arrowhead, by direction, lane count and
  fix), `OrchestraStep.tsx` (extended: badge on the edge below `sm`, label wraps),
  `DemoStatusPill.tsx`, `AgentPointerPanel.tsx`; shared `components/home/pick/ShownForTag.tsx`.
  Icons reused: `ChevronUpIcon`, `ChevronRightIcon` (rotated for left and the ‹ button),
  `CheckIcon`. No new icon.
  `hooks/useRovingTabs.ts` (**gains `step(delta)`**, wrapping, no focus move), `hooks/useAboutPick.ts`,
  `hooks/useShownSet.ts`. `lib/agents.ts` (unchanged types: `OrchestraDemoContent` keeps `lead`,
  `team`, `checks`, `ring`, `steps`, `done`), **new** `lib/orchestraRows.ts` (the eight rows of
  4.4's table), `lib/listNumber.ts`. A small template fill for `stepper.position` goes in `lib/`.
  **Images:** none.
  **2026-10-05 (built), two files changed and no new one:** `LeadsDemo.tsx` (the pill's label
  is `row.done ?? statusDone`: the row's `done`, else `statusDone`; the name and source column
  gains `wrap-break-word`) and `lib/agents.ts` (`LeadsDemoContent`'s rows gain an optional
  `done`; `agentPanelKinds.discord` row 2 is `checklist`, 4.8). `ChecklistDemo.tsx`,
  `DemoStatusPill.tsx` and `AgentDemo.tsx` are unchanged.
- **Static state** (also the no-motion and first-paint state): first offer selected, its row line
  full and (below `lg`) its stepper bar full, every demo finished, dots solid, packets at their
  midpoints, every checklist box ticked, the orchestra's row 7 ticked with its pill shown.
  A leads row with its own `done` shows that label (2026-10-05).

**Motion, as built (the motion pass, 2026-10-04; the 2026-10-03 round built nothing new and kept
what was there).** `AgentsTabs` calls `hooks/useAgentsMotion.ts` (re-run on a set, entrance once,
kinds per set) and `hooks/useSwapFade.ts`. The replays are in `lib/agentDemoSequences.ts`
(`playDemo`, one sequence per kind, the pointer included), the pop every part shares in
`lib/agentDemoPop.ts` (`y 8px, scale .96 → none`, 0.45s, 0.15s after the panel shows), and the
orchestra's run in `lib/orchestraRun.ts`. Every sequence ends inside the 6s slot. Below `lg` the
6s advance times the hidden row's `agent-progress` and the stepper's bar on one tween, and the
stepper follows `selected`.

**Pacing (built 2026-10-05, the user's decision; full motion only).** The replays are not evenly
paced. Each demo has a longest time, and each of its work steps (a chat gap, the typing dots, a
lead handled, a line ticked, a bar's turn, a sync event, a link's ride, a card's hold) draws its
time at random from its own `[min, max]` range. The time a step takes is deducted from what is
left of the longest time, and the rest is passed on to the next step; a step never takes so much
that the steps after it lose their minimum. So no replay passes its longest time, and when early
steps run long the later ones are squeezed. `lib/demoBudget.ts → spendBudget(budget, steps, random)`
does this (seconds in, seconds out; no DOM, no GSAP); the budget is the longest time less the
fixed parts around the steps (the lead-in, the pops), and each range sits beside its sequence.
Every time is fixed when a replay is built: each replay differs, and a paused one resumes
unchanged. **Not drawn:** the parts' first pop-in staggers, Sync's packet loop, the pointer panel
and everything under reduced motion (fades by `data-demo-order`, evenly spaced, no randomness).
In the table, "measured" is the span over 22+ replays on the build; none passed its longest.

| Layer (hooks) | State | Why, and what it needs |
|---|---|---|
| Entrance: label and `agents-row` rows rise, `agents-panels` fades up | **Keep**, once per page load | Below `lg` the rows are hidden; the panels box (with the stepper) still fades up |
| 6s auto-advance and the `agent-progress` line | **Keep** | Wraps on `lines.length`; restarts on row 1 after a set change |
| The stepper bar's fill (`agent-progress-bar`) | **Built 2026-10-04** | Fills on the 6s clock, one tween with the row's line. While the advance is held it stops where it is: empty after a press of ‹ or › (4.2a). Reduced: the selected bar full |
| The stepper's title and line (`agents-stepper-title`, `agents-stepper-line`) | **Built 2026-10-04** | Fade in over 0.25s on a selection change only; the same under reduced motion |
| Pause on hover, on focus, off screen, in a hidden tab | **Keep** | The stepper is inside `agents-panels`, so its focus and hover pause it too |
| Status dot blink, replays of `leads`, `report`, `sync` | **Keep** the dot and what each replay shows. **Paced at random 2026-10-05** (Pacing, above) | `leads`, 3.2s at most (measured 1.89–3.19s): counting from 0.8s, each pill swaps 0.16–0.8s after the last. `report`, 2.4s (1.60–2.39s): each bar grows over 0.6s and starts 0.03–0.25s after the one before. `sync`, 3s (1.95–2.98s): counting from 0.6s, each event pops 0.15–0.7s after the last; the packet loop keeps its even pace. A row's own `done` label (2026-10-05) changes no timing: each `demo-before` pill still swaps to its row's done pill |
| Replay, `chat` | **Built 2026-10-04**: typing dots before every agent line. **Paced at random 2026-10-05**, 5s at most | The dots hold 0.5–1.4s (was 0.85s), then the line; the next part follows each message by 0.3–1.1s. By the constants: 1.55–3.25s for two messages, 1.85–4.35s for three with one agent line, 2.8–5s for four with two (were 2.30s, 3.00s and 4.70s). Measured: 2.05–3.89s with three messages, 3.63–5.00s with four. The budget holds a long exchange inside 5s; the `timeScale` squeeze is gone |
| Replay, `checklist` | **Built 2026-10-04**: its own sequence. **Paced at random 2026-10-05**, 3.4s at most (measured 2.51–3.40s; was 2.75s) | The lines pop in with empty boxes; counting from 0.65s, each box turns to its tick 0.15–0.7s after the last (was 0.35s apart from 1s); the pill pops 0.25s after the last tick starts. Discord row 2 plays it since 2026-10-05, in place of the `leads` replay; nothing new to build |
| Replay, `orchestra` | **Built 2026-10-04**: the token run. **Paced at random 2026-10-05**, 5s at most (measured 4.55–5.00s; was 4.80s) | 4.4 Motion |
| Pointer panel | **Built 2026-10-04**: its heading, steps and link pop in order, 0.84s | The line and the auto-advance still run through its row |
| The Report bars' hover (`demo-bar`) | **Built 2026-10-05** (the user's choice, 4.9 36) | `lib/agentBarHover.ts → bindBarHover(root, stretches)`, bound by `useAgentsMotion` on `(pointer: fine)` only; a touch never lights a bar. Enter: the fill fades to `accent` and the bar stretches `scaleY` to 1.08 from its bottom edge, 0.25s `power2.out`, capped at the chart's top; leave: both ease back and the inline styles are cleared (4.4). Reduced: the fill's fade only. The stretch is the replay's own property, so a bar still growing lights at once and stretches after it lands, and the bars are reset before every replay starts or is reverted. Not paced at random. The pointer is on the panel then, so the 6s advance is held, as for any hover |
| Reduced motion: fades by `data-demo-order`, no advance, full line and bar, solid dot | **Keep** | Works for every kind; no typing dots, no swaps, no packets, no token |
| Swap fade (§0.5) | **Built 2026-10-04** | Wrappers: `agents-tablist`, `agents-stepper` and each `agent-panel`. Not `agents-panels`, whose opacity the entrance owns. The label and the tag don't fade |
| The tag's fade and chevron turn (§0.6) | **Built 2026-10-04** | `hooks/useShownForMotion.ts` |

- **Hooks in the markup:** `agents-tablist`, `agents-row`, `agent-progress`, `agents-panels`,
  `agent-panel`, `demo-status-dot`, `demo-typing`, `demo-before`, `demo-packet`,
  `data-demo-order`, `data-set`, `pick-tag`, `pick-tag-list` (§0.6).
  **New 2026-10-04:** `agents-stepper`, `agents-stepper-title`, `agents-stepper-line`,
  `agent-progress-bar` (one per offer); for `orchestra`: `orch-diagram` (the lane set),
  `orch-lane` (`data-lane="team"`, the shade), `orch-row` (`data-row` 1–8, `data-lane` `lead` |
  `team` | `checks`), `orch-card`, `orch-step` (`data-step` 1–6), `orch-link` (`data-link` = the
  row it enters, 2–8; `data-fix` on 6 and 7), `orch-role`, `orch-tick`, `orch-token`.
  **Removed with the loop:** `orch-lead`, `orch-node`, `orch-arm`, `orch-loop`, `orch-loop-rail`,
  `orch-loop-lit`. Orchestra order: rows 1–7 are 1–7, row 7's ticks 8–10, row 8 is 11, the pill 12.
  **2026-10-05:** no new hook.
  **2026-10-05, later still (the bar hover):** `demo-bar` (every Report bar) and, on the latest
  bar, `data-bar="latest"` (in the markup; nothing reads it yet).
- **As built, for reference:** the entrance rises from `y 56` with opacity 0, rows staggered
  0.08s. Demos replay from the start when their panel shows: parts pop in (`y 8px, scale .96 → none`)
  in `data-demo-order`; Chat shows its dots before every agent line, then the line; Leads swaps
  each `demo-before` pill to the done pill; the Checklist pops its lines with empty boxes, then
  turns each box to its tick; Report's bars grow `scaleY`; Sync's packets travel left→right on a
  loop; the Orchestra runs its token (4.4); the pointer panel's three parts pop in order.

### 4.8 Offers per card and their panels (`lib/agents.ts`)

Lead offer first. Every offer is a line in `docs/03-facts.md` → What the user builds.

| Set | Row | Offer | Panel | The sample shows |
|---|---|---|---|---|
| `default` | 1 | Bookings and scheduling | `leads` | three booking requests, each turning to booked |
| | 2 | Order and delivery questions | `chat` | a customer asks about an order; the agent answers |
| | 3 | Member questions | `chat` | a member asks a repeat question; the agent answers |
| | 4 | The workflow set up in a team | `orchestra` | swimlanes: the lead hands out, the team works from the rules and reports, the lead sends it to the checks, a finding goes back, all checks passed |
| `service-business` | 1 | Bookings and scheduling | `leads` | as default row 1, in the card's tone |
| | 2 | Routine customer messages | `chat` | a routine question, answered |
| | 3 | Appointment reminders, with a reschedule | `chat` | the agent reminds first; the customer moves the slot |
| | 4 | New enquiry follow-up | `leads` | three enquiries, each followed up |
| `online-store` | 1 | Order and delivery questions | `chat` | where an order is |
| | 2 | Sales reports on schedule | `report` | a weekly sales chart, sent |
| | 3 | Store tools connected | `sync` | three store tools passing data |
| | 4 | Returns and refund requests | `leads` | three requests, each passed to a person |
| `discord` | 1 | Member questions | `chat` | a repeat question, answered |
| | 2 | Welcome and roles | `checklist` (**2026-10-05**; was `leads`) | one new member at the top; four steps tick off in order (joined, sent to the rules or onboarding, reacted, role given), then a "role given" pill |
| | 3 | Routine moderation | `leads`, a done label per row (**2026-10-05**) | three flagged members, each ending its own way: a timeout, a warning, a report to the server's mods |
| | 4 | Server activity reports | `report` | a weekly activity chart, sent to the owner |
| | 5 | Custom commands and outside tools | `sync` | the server linked to two outside tools |
| `software-builder` | 1 | The workflow set up in your team | `orchestra` | as default row 4, in builders' words |
| | 2 | Your app or feature, built | `checklist` | four pieces of a feature, each ticked off |
| | 3 | A fast-built app made safe for the public | `checklist` | four problems found, each fixed |
| | 4 | Kept running after launch | `report` | a weekly chart, with fixes sent |
| `website` | 1 | Visitor questions | `chat` | a visitor asks on the site; the agent answers |
| | 2 | Form enquiries followed up | `leads` | three enquiries, each followed up |
| | 3 | Bookings on the site | `leads` | three bookings, each confirmed |
| | 4 | Site reports on schedule | `report` | a weekly visits chart, sent |
| | 5 | Custom websites | `pointer` | no demo: the heading, section 03's steps and a link to it |

- `agentPanelKinds`: `default: ["leads", "chat", "chat", "orchestra"]`,
  `"software-builder": ["orchestra", "checklist", "checklist", "report"]`; **2026-10-05:**
  `discord: ["chat", "checklist", "leads", "report", "sync"]`; the others unchanged.
- The workflow offer's picture: `sync` (superseded by decision A) → a tree → the numbered loop
  (2026-10-03) → **swimlanes** (2026-10-04, the user's choice), which put who acts (the lane) and
  when (the row) on two axes and keep one form at every width.
- `leads` is people only (initials in the circle); work items use `checklist`. **2026-10-05:**
  `checklist` also shows one person's steps in order (Discord row 2: the member is the title,
  the lines are what happens to them), so that panel has no initials circle.

### 4.9 Choices

**Decided by the user, 2026-10-03:**

1. **Demo kinds:** `checklist` added for the software-builder "build" and "rescue" rows;
   "workflow" moves to `orchestra` on `default` row 4 and `software-builder` row 1; `sync` stays
   on the two tools rows.
2. **`ChatDemo`:** an ordered message list.
3. **The pointer panel:** it previews section 03's step titles and links to it.
4. **Bookings:** a list panel, not a chat.
5. **The `default` set:** its own copy in the shared voice.
6. **Vendor names:** allowed inside demo sample content (constitution §7.4).
7. **Motion:** nothing new is built; the built motion keeps running with the wiring in 4.7.
   **2026-10-04:** the motion pass is built (4.7).
8. ~~**The orchestra's shape: a numbered loop.**~~ **Superseded by 15** (2026-10-04).

**Settled or superseded:**

9. ~~How the fix loop is drawn~~ — superseded (now the dashed accent card and links, rows 6–7).
10. **The team's size:** three roles. Settled.
11. **The orchestra this round:** still, showing finished, until the motion pass (settled by the
    2026-10-04 brief: nothing moves this round). **Built 2026-10-04:** it replays its token run
    (4.4).
12. ~~The phone form (rail or small ring)~~, 13. ~~where the report is drawn~~, 14. ~~the fix path
    in the ring~~ — **superseded by 15**: one swimlane form at every width.

**Decided by the user, 2026-10-04:**

15. **The orchestra is swimlanes** (4.4): Lead, team, checks side by side, the middle lane shaded,
    one rounded outline, eight rows joined by L-shaped connectors, the fix row dashed accent, the
    done pill centred under the lanes. Both demos use it; the content keys stay.
16. **Lane titles inside every card at every width**, as the card's first line (Lead's in the
    accent); no lane header row. The team's roles sit in the first team card (row 2).
17. **Below `lg`, arrows in the panel's top block** (4.2a) replace "list first, then the panel
    below" (2026-09-24): ‹ / ›, counter over the title, progress bars, the offer's line. From `lg`
    nothing changes.

**Decided in this spec (the lead may review):**

18. **One shared stepper** outside the per-offer panels (not one per panel): pressing › never
    hides the focused button, so no focus juggling and no duplicate controls.
19. **Wrap-around, never disabled**, matching the auto-advance and Up/Down.
20. **Announce on a press only**, through a `sr-only` live region, with a `sr-only` position in
    place of the visual counter (needs `agents.stepper.position`).
21. **The lane set caps at 600** (the mock's width; was 480): labels sit on one line from 768.
22. **Lead cards keep `border-accent`** (as the mock and today's lead node), with the title in the accent.

**Decided by the lead, 2026-10-04 (were open):**

23. **Panel height per tab — decided (the user's choice):** it changes; each panel is as tall as its demo, with no holding to the tallest.
24. **The step badge below `sm` — decided:** on the card's top-left edge, as specced.
25. **1024 — decided:** the 124px lanes are accepted as they are.
26. **Lead cards — decided:** accent border plus accent title, as in the mock.

**Decided by the user, 2026-10-05 (Discord):**

27. **"Welcome and roles" is a checklist — decided:** one new member at the top, four lines
    (joined, sent to the rules or onboarding, reacted, role given) that tick off one by one, then
    a "role given" pill. No new component (4.4, 4.8).
28. **"Moderation" ends each row its own way — decided:** a timeout, a warning, a report to the
    server's mods. It stays `leads` (4.4, 4.8).

**Decided in this spec, 2026-10-05 (the lead may review):**

29. **The smallest change for 28:** an optional `rows[i].done` over the shared `statusDone`.
    (Not chosen: a list of three done labels beside `rows`, which can fall out of step with
    them; a new demo kind.)
30. **Every outcome keeps the accent pill and its tick;** the words carry the difference. (Not
    chosen: a second pill style for a warning, which needs a colour the system doesn't have.)
31. **Pills keep their own widths,** on a shared right edge, and the text column wraps. (Not
    chosen: one fixed width for the three, which leaves a short label in a wide pill.) The pair
    limit in 4.6 and `wrap-break-word` keep 360 clean.

**Decided by the user, 2026-10-05 (pacing):**

32. **The demo replays are paced at random — decided.** The user: "all animations are linear
    make them dynamic by randomized duration, deduct the time each step took from the max
    duration before passing on to the next one". Asked where, the user chose the Agents demos
    only; no other section's motion changes. Built as the rule in 4.7, Pacing.

**Decided in the build, 2026-10-05 (open for review; the built option is first):**

33. **The orchestra's spread:** a 5s ceiling, as built: runs measured 4.55–5.00s, a narrow span,
    since the ceiling cuts the later draws short (the last link is squeezed most). Or a ceiling
    of about 5.4s: a wider span, with about 0.6s of the 6s slot left.
34. **The token's ride:** its speed varies per link (0.65–1.3 × the even ride) as well as its
    stay in each card, as built. Or the stay only, with every ride at the one even speed.
35. **`report` and `sync` run longer on average,** by about 0.5s and 0.7s, as built with the
    ranges in 4.7. Or their ranges pulled back, so the average matches the even replays of before.

**Decided by the user, 2026-10-05 (the Report bars' hover):**

36. **The Report bars light up and grow under the pointer — decided.** The user: "add hover
    effect on each bar from bar charts". Of three options the user chose "Light up and grow":
    the hovered bar turns violet and stretches up a little, eases back on leave, no text added,
    colour only under reduced motion, nothing on touch screens. Built as 4.4 and 4.7.

**Decided in the build, 2026-10-05 (the bar hover; open for review; the built option is first):**

37. **The latest bar under reduced motion:** it shows no hover at all, as built: it is the
    accent already, and nothing stretches there. Or a second colour for it on hover, so every
    bar answers the pointer; it would have to be an existing token, and the system has one
    accent only.
38. **The tallest bar's cap:** no bar's top passes the chart's top (`ceiling: 1`), as built, so
    the 95% bar stretches 1.053 against 1.08 for the rest. Or the full 1.08 on every bar, which
    puts that bar about 8px into the 20px gap under the title at 1440. In today's copy three of
    the four `report` samples end on the 95% bar, so there the capped bar is also the latest one.
