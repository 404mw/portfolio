# §4 Agents: UI spec

Shared rules and parts (§0): [`../ui-spec.md`](../ui-spec.md). Page doc: [`../sections/04-agents.md`](../sections/04-agents.md).

## 4. Agents (the one question: what can their agents handle for my business?)

The user picked variant A (tab list), 2026-09-24. Variant B's list (`AgentsStack`) ships only as A's `<noscript>` fallback.

### 4.1 Shared parts

- `AgentsSection` (server): section frame, `id="agents"`, no `border-t`. Takes no props; it renders
  the tabs layout (4.2) with `AgentsStack` (4.3) as the no-JS fallback.
- `SectionLabel as="h2"` with `agents.number` and `agents.label`. There's no big heading here.
- `AgentRowText`: `grid grid-cols-[1.25rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-2.5`:
  number `font-mono text-meta`; title `font-display font-semibold text-row leading-none tracking-[-0.035em] {condensed}`;
  line `col-start-2 text-lead leading-normal text-muted`.
- `AgentDemoFrame` (the panel): `flex flex-col rounded-3xl border border-line bg-band`. No
  `overflow-hidden`: the panel grows to fit its demo and never clips it. Prop `variant`: `tabs`
  (A's panel) or `stack` (the fallback rows).
  - Header: `flex items-center justify-between gap-4 border-b border-line px-5 py-4 {metaLabel}`: a status dot
    (`size-1.5 rounded-full bg-accent`, `aria-hidden`, `data-anim="demo-status-dot"`) with
    `agents.demoStatus`, and the slug on the right.
  - Body: `relative flex flex-1 flex-col justify-center p-5 md:p-8 xl:p-9`.
  - Size: `min-h-96` below `lg`; from `lg`, `lg:aspect-[10/9]` for `tabs` or `lg:aspect-[16/10]`
    for `stack`, with `lg:min-h-auto`. The ratio is a minimum: a taller demo grows the panel
    rather than clipping (it clipped at 1024px before).
- Inner raised surfaces in panels (bubbles, rows, nodes, cards) use `bg-line/40`.

### 4.2 Variant A: tab list (`AgentsTabs`, client)

- Layout: `splitColumns` + `noscript:block lg:items-center` (`splitColumns` from `lib/styles.ts`:
  `grid gap-10 md:gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24`).
  `noscript:block` drops the two columns without JS, so the fallback list takes the full width. Left:
  `flex flex-col gap-10` (label, tab list). Right: the four panels stacked in one cell. Phone and
  tablet: the list first, then the panel below.
- **Sticky (2026-09-25):** from `lg` the left column (label, tab list) adds `stickyTitle`
  (`lg:sticky lg:top-30 lg:self-start`, 120px). The grid keeps `lg:items-center`, so the panel stays
  centred; `lg:self-start` stops the left column stretching to the row height, so it can pin. Phone
  and tablet stay unpinned.
- Tab list: `<div role="tablist" aria-orientation="vertical" aria-labelledby={labelId}>`. Each row is
  `<button role="tab" aria-labelledby aria-selected aria-controls tabIndex={selected ? 0 : -1}>` with
  `group relative block w-full cursor-pointer border-t border-line py-5 text-left` + `focusRing`, holding `AgentRowText`.
  `group` drives the title's hover colour. The row's one-line description renders on the selected row only.
- **Names:** each tab and its panel are named by the row's number and title only. Both take
  `aria-labelledby` pointing at the number and title ids, built by `agentRowIds()` in
  `lib/agents.ts` (`AgentRowText` takes a `labelId` and sets them). The description stays visible
  in the selected tab but isn't part of the name.
- Progress line per row: `<span aria-hidden data-anim="agent-progress" class="absolute inset-x-0 -top-px h-px origin-left bg-accent">`,
  full width on the selected row in static, `scale-x-0` on the others.
- Panels: one `<div role="tabpanel" id aria-labelledby tabIndex={0} class="rounded-3xl">` + `focusRing`
  per offer (the radius matches the frame, so the ring follows its corners); the three
  unselected have `hidden`. First offer selected on load.
- Keyboard (`hooks/useRovingTabs.ts`): Up/Down move and select, Home/End jump, Tab moves into the panel.
  The hook has two paths: `select`, which never moves focus (clicks, and the GSAP pass's
  auto-advance), and a keyboard path that selects and focuses the tab.
- **No-JS fallback:** the tab list and panels take `noscript:hidden` (Tailwind ≥4.1,
  `@media (scripting: none)`), and a `<noscript>` renders variant B's list in their place.

| Row part | Default (unselected) | Hover | Focus-visible | Selected |
|---|---|---|---|---|
| Number | `text-muted` | same | ring on row | `text-accent` |
| Title | `text-muted/60` (3.2:1, large text) | `group-hover:text-muted` | ring on row | `text-text` |
| Line | not rendered | n/a | n/a | `text-muted`, visible |
| Top line | `border-line` | same | same | accent progress line over it |

### 4.3 Variant B layout: A's no-JS fallback only (`AgentsStack`, server)

- Label, then `<ol>` of four `<li class="grid gap-6 border-t border-line py-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-16 lg:py-14">`.
  Each holds `AgentRowText` (title as `<h3>`; number `text-accent`, title `text-text`, line always
  visible) and its own `AgentDemoFrame`. Nothing is interactive.

### 4.4 Demo panels, finished state (all server; sample content under §7 item 5)

- **ChatDemo** (`support-agent`): `flex flex-col gap-3.5`.
  - Customer bubble: `self-start max-w-[70%] rounded-xl rounded-bl-sm bg-line/40 px-4.5 py-3.5 text-body-lg text-text`.
  - Typing dots: in their own agent-side bubble, `hidden items-center gap-1.5 self-end rounded-xl rounded-br-sm bg-line/40 px-4.5 py-4`
    (`data-anim="demo-typing"`, `aria-hidden`), holding three `size-1.5 rounded-full bg-muted`.
    Hidden in static; the GSAP pass shows it.
  - Agent reply: `self-end flex max-w-[72%] flex-col items-end gap-1.5` → bubble `rounded-xl rounded-br-sm bg-accent px-4.5 py-3.5 text-body-lg text-on-accent`, then meta `{metaLabel}`.
  - Second customer bubble as the first.
- **LeadsDemo** (`lead-agent`): `flex flex-col gap-2.5`, three rows
  `flex items-center justify-between gap-3 rounded-xl border border-line bg-line/40 px-3.5 py-3.5 md:px-4.5 md:py-4`.
  - Left: avatar `grid size-8 md:size-9 shrink-0 place-items-center rounded-full bg-line font-mono text-nav font-medium text-muted` (initials), then `min-w-0` name `text-body font-medium text-text` over source `{metaLabel}`.
  - Right: status pill `DemoStatusPill` ("followed up"). The "new" pill (`rounded-full border border-line px-3 py-1.5 font-mono text-meta text-muted`) is in the markup with `hidden` (`data-anim="demo-before"`).
- **ReportDemo** (`report-agent`): `flex h-full flex-col justify-end gap-5`.
  - Title row: `flex items-baseline justify-between`: title `font-display font-semibold text-summary tracking-[-0.02em]`, week `{metaLabel}`.
  - Chart (`aria-hidden`): `grid min-h-40 flex-1 auto-cols-fr grid-flow-col items-end gap-2.5 border-b border-line`;
    8 bars `block rounded-t-md bg-line`, the last `bg-accent`; heights from `report.bars` as inline `height: n%`.
    A grid, not a flex row with `flex-1` bars, so the percentage heights resolve below `lg`.
    `report.chartAlt` sits in `sr-only` beside it.
  - `DemoStatusPill` ("sent to team · Mon 09:00"), `self-start`.
- **SyncDemo** (`sync-agent`): `flex flex-col gap-6 md:gap-9`.
  - Tool row: `flex items-center`: three nodes `rounded-xl border border-line bg-line/40 px-3.5 py-4 font-mono text-nav font-medium text-text`,
    with a connector between each pair: `relative h-px flex-1 border-t border-dashed border-line`,
    and a packet `absolute left-1/2 -top-1 size-2 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_12px_var(--color-accent)]` (`data-anim="demo-packet"`, `aria-hidden`).
  - Events: `grid gap-2 sm:grid-cols-3 sm:gap-2.5`; each `flex justify-between gap-2 rounded-xl bg-line/40 p-3.5 sm:flex-col sm:justify-start`: kind `{metaLabel}`, result `text-small text-text`.
  - `DemoStatusPill` ("all tools in sync"), `self-center`.
- **DemoStatusPill:** `inline-flex items-center gap-2 rounded-full bg-accent px-3.5 py-2 font-mono text-meta font-medium whitespace-nowrap text-on-accent`, with `CheckIcon` (`size-3`).
- Every timed part carries `data-demo-order="n"` (its place in the sequence) for the GSAP pass.

### 4.5 Sizes

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Layout | stacked | stacked | A: 2 cols (616 each); fallback: rows 5/7 | A: 720 each; fallback: 5/7 of 1536 |
| Row title (`text-row`) | 34px | 44px | 58px | 58px |
| Row line | 17px | 17px | 17px | 17px |
| Panel | 320 wide, min 384 tall | 706 wide, min 384 | A: min 616×554; fallback: min ~737×460 | A: min 720×648; fallback: min ~840×525 |
| Panel padding | 20 | 32 | 36 | 36 |
| Chat bubble text | 16px | 16px | 16px | 16px |

- From `lg`, panel sizes are minimums: a taller demo grows the panel. The fallback (B) sizes apply
  only without JS.

### 4.6 Content slots (`content/home.ts → agents`)

| Key | Meaning | Limit |
|---|---|---|
| `agents.number` / `agents.label` | "01" and the section label (the section's h2) | 5 words |
| `agents.items[0–3].title` | Customer messages / Lead follow-up / Recurring reports / Connected tools | 1–3 words (giant rows) |
| `agents.items[0–3].line` | What the agent does for the reader, the offer in plain present tense (constitution §7.3) | 12 words (automation row) |
| `agents.items[0–3].slug` | support-agent / lead-agent / report-agent / sync-agent (sample) | 1 slug |
| `agents.demoStatus` | "agent running" panel status (sample) | 3 words |
| `agents.demos.chat.customer` / `.reply` / `.replyMeta` / `.thanks` | The four chat lines (sample) | 12 words each |
| `agents.demos.leads.rows[3]` `{initials, name, source}` | Sample first names and where each lead came from | 3 words each |
| `agents.demos.leads.statusNew` / `.statusDone` | "new" / "followed up" | 2 words |
| `agents.demos.report.title` / `.week` / `.bars[8]` / `.chartAlt` / `.sent` | Report sample: title, week number, bar heights (%), hidden chart text, sent status | title 3 words, alt 12, sent 6 |
| `agents.demos.sync.tools[3]` / `.events[3]` `{kind, result}` / `.done` | Tool names, three sync events, final status | 3 words each |

### 4.7 Components, images, motion

- **Components:** `components/home/agents/AgentsSection.tsx`, `AgentsTabs.tsx` (client, A),
  `AgentsStack.tsx` (fallback), `AgentRowText.tsx`, `AgentDemoFrame.tsx`, `AgentDemo.tsx` (picks the demo
  by kind), `ChatDemo.tsx`, `LeadsDemo.tsx`, `ReportDemo.tsx`, `SyncDemo.tsx`, `DemoStatusPill.tsx`;
  `hooks/useRovingTabs.ts`; `lib/agents.ts` (the demo kind per offer, its type tied to
  `agents.items` so an offer can't be added or removed without its demo; the row ids from
  `agentRowIds()`); `lib/listNumber.ts` (0 → "01", shared by numbered rows). **Images:** none.
- **Motion (later):**
  - A: 6s auto-advance; the selected row's `agent-progress` grows `scaleX` 0→1 over 6s; paused on
    hover or focus-within. Under reduced motion there's no auto-advance and no growth: the selected
    row's line is full (the static state). The line fades up when its row is selected; under
    reduced motion it only fades.
  - Status dot: opacity blink loop; off under reduced motion (a solid dot).
  - Each demo replays from the start when its panel shows (on select):
    parts pop in (`y 8px, scale .96 → none`) in `data-demo-order`. Chat: typing dots show, then hide
    before the reply. Leads: each `demo-before` pill swaps to "followed up", staggered. Report: bars
    grow `scaleY` from the bottom, staggered, then the pill pops. Sync: packets travel left→right
    along their connector on a loop, then events and the pill pop.
  - Under reduced motion each demo shows its finished state (4.4): its parts fade in by
    `data-demo-order` with no pop, rise or scale. No typing dots, the Leads pills already read
    "followed up", the bars stand at full height and the packets rest at their midpoints.
