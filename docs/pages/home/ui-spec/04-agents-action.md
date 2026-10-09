# §4.10 Agents: the action line (UI spec)

Part of [`04-agents.md`](04-agents.md) (§4.10, after §4.9 Choices; kept in its own file for the
edit). Shared rules: [`../ui-spec.md`](../ui-spec.md). Page doc: [`../sections/04-agents.md`](../sections/04-agents.md).

**Last Updated:** 2026-10-08. Round 2 of the plain-words overhaul (the user's decision: every demo
shows the action taken; voice rules 15–17). Static spec, not built yet. Existing tokens, classes
and icons only. Choices 39–48 at the end are open for the user, each with a recommendation.

**The one question it adds to a panel:** what did the agent actually do? A chat on its own looks
like ChatGPT ("it's just a chatbot"). The action line is a small receipt in the demo that says the
job is done and where the reader finds it: "Booked Thu 10:00" in "your calendar".

### 4.10.1 Where it appears, per demo kind

| Kind | Needs it? | Why |
|---|---|---|
| `chat` | **Yes**, one per chat | Bubbles alone read as a chatbot. The receipt sits in the ordered message list, at the point the job got done (it can follow the customer's "yes please", not just an agent line) |
| `leads` | **Yes**, one per list, except Discord moderation | The pills say the verb ("booked", "followed up", "passed on") but not where the result went. One closing receipt under the list says it ("in your calendar"). Moderation's own pills per row (timed out, warned, mods told) are already three actions: nothing added |
| `report` | No | The pill already says the action and where it went ("sent to you · Mon 09:00") |
| `sync` | No | Each event's result is an action in a place ("Stock updated", "Row in Sheets", "Customer told") |
| `checklist` | No | Each line's note is its result, and the pill is the outcome ("role given") |
| `orchestra` | No | Builders' content; the pill is the outcome ("all checks green") |

**Rows that get one (11 of the 21):**

| Set | Row | Kind | Slot |
|---|---|---|---|
| `default` | 1 Bookings | `leads` | `agents.cards.default[0].demo.action` |
| | 2 Customer messages | `chat` | `agents.cards.default[1].demo.messages[i]`, `from: "action"` |
| | 3 Order questions | `chat` | `agents.cards.default[2].demo.messages[i]` |
| | 4 New enquiries | `leads` | `agents.cards.default[3].demo.action` |
| `service-business` | 1 Bookings | `leads` | `…["service-business"][0].demo.action` |
| | 2 Customer messages | `chat` | `…["service-business"][1].demo.messages[i]` |
| | 3 Reminders | `chat` | `…["service-business"][2].demo.messages[i]` |
| | 4 New enquiries | `leads` | `…["service-business"][3].demo.action` |
| `online-store` | 1 Order questions | `chat` | `…["online-store"][0].demo.messages[i]` |
| | 4 Returns | `leads` | `…["online-store"][3].demo.action` |
| `discord` | 1 Member questions | `chat` | `…discord[0].demo.messages[i]` |

None in `software-builder`. `discord` rows 2–5 and `online-store` rows 2–3: nothing new (above).

### 4.10.2 Layout and classes (new `components/home/agents/DemoActionLine.tsx`, server)

One UI part: a full-width row, not on either speaker's side, so it never reads as a third bubble.
Its outline is `accent` with no fill (agent bubbles are filled `accent`, visitor bubbles `line/40`),
and it has the Checklist's ticked box on the left: "done" in the panel's own language.

```
p data-anim="demo-action" data-demo-order={n} class="flex w-full items-start gap-3 rounded-xl border border-accent px-3.5 py-3 md:px-4.5"
├ span data-anim="demo-action-pending" aria-hidden="true" class="mt-0.5 hidden size-5 shrink-0 rounded-md border border-muted"
├ span data-anim="demo-action-tick" aria-hidden="true" class="mt-0.5 grid size-5 shrink-0 place-items-center rounded-md bg-accent text-on-accent" → CheckIcon size-3
└ span class="flex min-w-0 flex-1 flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 wrap-break-word"
  ├ span class="sr-only"                               ← agents.demoAction + ": "
  ├ span class="text-body font-medium text-text"       ← action.text
  └ span class="font-mono text-meta text-muted"        ← action.where
```

- **Chat:** the row is one entry of `ChatDemo`'s flex column (`gap-3.5`), in list order. It counts
  one place in `data-demo-order`, like a visitor line (no typing dots before it).
- **Leads:** `LeadsDemo` returns `div.flex.flex-col.gap-2.5` → the existing `ul`, then the row
  (`order` = after the last pill). Without `action` it renders the `ul` alone, as today.
- **One line or two:** `flex-wrap` puts `where` beside `text` when both fit and under it when
  not. No breakpoint is needed. The tick sits on the first line (`mt-0.5`: a 20px box on a 23px line).
- **States:** not interactive. No hover, focus-visible or active state, no tap target, no cursor
  (the rule of §4.4: demo parts are pictures).
- **Contrast:** `text` on `band` above 15:1; `muted` on `band` ≈ 6.5:1; the `accent` outline on
  `band` ≈ 8:1; `on-accent` on `accent` well above 4.5:1. The tick is never the only sign: the text says done.
- **Icon:** `CheckIcon` (existing). There's no calendar or mail icon and none is added. `where` says the place in words.

### 4.10.3 Content shape (`lib/agents.ts`, `content/home.ts`)

- New type `DemoAction = { readonly text: string; readonly where: string }`.
- `ChatDemoContent.messages` becomes a union: `{ from: "them" | "agent"; text; meta? }` or
  `{ from: "action"; text; where }`. Exactly one `action` entry per chat in the 11 rows above.
- `LeadsDemoContent` gains `action?: DemoAction` (optional, so moderation and every other list stay valid).
- New shared key `agents.demoAction`: the screen-reader name read before every action line, so
  it's heard as a thing done, not a line said ("Done: Booked Thu 10:00 your calendar"). One word, shared voice.

| Slot | Meaning (for copywriter) |
|---|---|
| `action.text` | What the agent did, past tense, verb first, with the sample's detail: "Booked Thu 10:00", "Tracking link sent", "Moved to Thu 10:00", "Passed to you" (voice rule 15) |
| `action.where` | Where the reader finds the result, in their own words: "your calendar", "your inbox", "your orders". It may name an everyday product (§7.4). Lower case, no end punctuation |
| `agents.demoAction` | Screen-reader only: names the row as an action taken, before its text |

**Sizing notes at 360 (not rules, voice "Length"):** the row's text column is 216px. `text` fits
one line up to about 28 characters (15px); `where` fits one line up to about 30 (12px mono). Longer
copy wraps and the row grows by a line, which is fine. From 768 both sit on one line up to about 70
characters together; at 1024 (the narrowest desktop panel) up to about 36.
**Copy check, no new slot:** `report`'s `sent` and `sync`'s event results already say the job and
the place; keep them that way when rewording ("all up to date" is a state, so the events carry the action).

### 4.10.4 Sizes

| Element | Phone 360 | Tablet 768 | Desktop 1440 (1024) | 4K 3840 |
|---|---|---|---|---|
| Row width (the demo body) | 278 | 640 | 544 (375) | 646 |
| Row padding / radius | 14 × 12 / 12 | 18 × 12 / 12 | same | same |
| Tick box / check | 20 / 12 | same | same | same |
| `text` (`text-body`, 500) / `where` (`text-meta` mono) | 15px / 12px, stacked | 15 / 12, one line | 15 / 12, one line (1024: one line to ≈ 36 characters together) | 15 / 12, one line |
| Row height | ≈ 70 (two lines) | ≈ 49 | ≈ 49 (1024: 49–70) | ≈ 49 |
| Added to a chat (row + `gap-3.5`) | + ≈ 84 | + ≈ 63 | + ≈ 63 | + ≈ 63 |
| Added to a list (row + `gap-2.5`) | + ≈ 80 | + ≈ 59 | + ≈ 59 | + ≈ 59 |

**Panel heights (estimates; check on the build).** Heights follow each demo (the user,
2026-10-04), so nothing is held to the tallest. At 360 a three-message chat panel goes from about
the 384 minimum to about 470, the reminder chat (four messages and the receipt) to about 560, and a
list to about 410–430, each plus the stepper. At 1440 the 554 minimum (body 428) still holds the
lists and three-message chats; the reminder chat may grow the panel by up to about 60. At 1024
(body 277) every chat and list with a receipt grows the panel, by about 60–110. 3840 is as 1440
(body 522). **Nothing scrolls sideways:** the row is `w-full` with `min-w-0` text and
`wrap-break-word`, so a long word breaks inside 216 at 360.

### 4.10.5 Motion (later; for gsap-animator) and screen readers

- **Hooks:** `demo-action` (the row, with `data-demo-order`), `demo-action-pending` (the empty box,
  `hidden` in static), `demo-action-tick` (the ticked box, no `data-demo-order` of its own). These
  are distinct from `demo-before` on purpose: `leads()` and `checklist()` find their rows by
  `demo-before`, so the receipt must never match that.
- **What moves:** the row pops (`POP_FROM`, 0.45s) at its place in order, showing the empty box.
  After a drawn hold of **[0.45, 0.9]s** from the row's start (the agent doing the job), the empty
  box hides and the tick pops in its place (`TICK_FROM`, 0.3s, `back.out(2)`, as the Checklist's
  ticks). Trigger: the panel showing, as every replay.
- **Chat:** the hold is one more step in `spendBudget`. The gap after the row (if it isn't last)
  is `CHAT.gap`. Longest time **4.5s** for a chat with a receipt (choice 46), so it's on screen at
  least 1.5s before the 6s advance. By the constants, a four-message chat with a receipt needs
  3.4s at least.
- **Leads:** after the last pill's swap, a gap of **[0.2, 0.5]s**, then the row and its hold.
  Longest time **4.4s** for a list with a receipt (3.2s without, unchanged). Minimums sum to 1.13s
  of the 3.3s budget (4.4 less `workAt` 0.8 and the tick 0.3).
- **The 6s clock holds:** 4.5s and 4.4s are both inside it. The orchestra, report, sync and checklist are unchanged.
- **Reduced motion:** the row fades in at its `data-demo-order`, ticked, with no hold, no pending
  box and no tick pop (the existing `fadeIn`).
- **Static (no JS, first paint, the no-JS `AgentsStack` fallback):** the row is shown, ticked.
- **Screen readers:** as the rest of the panel. The finished demo is in the DOM and read in
  order inside its `tabpanel`; nothing is announced while it replays (no live region). The receipt
  is a `<p>` in reading order, after the line before it, with the `sr-only` `agents.demoAction`
  prefix. The boxes are `aria-hidden`.

### 4.10.6 Components

- **New:** `components/home/agents/DemoActionLine.tsx` (props `action: DemoAction`, `order: number`).
- **Extended:** `ChatDemo.tsx` (renders the `action` entry; order counting +1), `LeadsDemo.tsx`
  (wrapper, optional receipt), `lib/agents.ts` (`DemoAction`, the chat union, `LeadsDemoContent.action?`),
  `lib/agentDemoSequences.ts` (`chat()` and `leads()` play the receipt; new ranges beside `CHAT` and `LEADS`).
- **Unchanged:** `AgentDemoFrame`, `DemoStatusPill`, `ReportDemo`, `SyncDemo`, `ChecklistDemo`,
  `OrchestraDemo`, `AgentsAllOffers` (title and line only), `TypingBubble`. Images: none.

### 4.10.7 Choices for the user (recommended option first)

39. **The look:** an `accent` outline with no fill and the ticked box (recommended: it reads as
    "done" in a 3s skim and can't be taken for either bubble). Or an inset `bg-bg` row with a
    `line` border and only the tick in the accent (quieter, but closer to the visitor bubble).
40. **Width:** the full width of the demo (recommended: no speaker side, so it isn't a message).
    Or on the agent's side under its bubble (reads as the agent's footnote, more chat-like).
41. **Place in a chat:** its own entry in the ordered list (recommended: the booking happens after
    the customer's "yes please", not after an agent line). Or attached to an agent message.
42. **How many:** one per demo (recommended: one job, one receipt, one skim). Or one per job (the
    reminder chat would show "reminder sent" and "moved").
43. **Lists (`leads`):** a closing receipt on the five booking, enquiry and returns lists
    (recommended: the pills say the verb, the receipt says where it landed). Or nothing in lists
    (the pills already show actions; only the six chats change).
44. **Report, sync, checklist, orchestra:** nothing new, a copy check only (recommended). Or the
    receipt added to every demo for sameness (a second "done" next to their pills).
45. **The motion beat:** empty box, a short hold, then the tick (recommended: the reader sees the
    agent do it). Or a plain pop with the tick already in.
46. **Chat ceiling:** 4.5s for a chat with a receipt (recommended: the receipt stays at least 1.5s
    before the advance). Or 5s as now (the receipt can land at 5s, leaving 1s).
47. **The chat `meta` note** ("agent reply · 2s") where a receipt follows: dropped (recommended:
    it's a chat detail, and the receipt is the one note that matters). Or kept. The copy is copywriter's and the user's call.
48. **Screen-reader name:** a new `agents.demoAction` (recommended: "Done: …" is heard as an
    action). Or reuse `agents.demoAgent` ("Agent: Booked…", heard as a line the agent said).
