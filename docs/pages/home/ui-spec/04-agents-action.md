# §4.10 Agents: the action line (UI spec)

Part of [`04-agents.md`](04-agents.md) (§4.10, after §4.9 Choices; kept in its own file for the
edit). Shared rules: [`../ui-spec.md`](../ui-spec.md). Page doc: [`../sections/04-agents.md`](../sections/04-agents.md).

**Last Updated:** 2026-10-09. Built, static and motion (2026-10-08), lead-checked 2026-10-09 (lint,
`tsc`, build; no sideways scroll or page errors at 360, 768, 1024, 1440, 3840). Choices 39–48 were
decided by the user on 2026-10-08, all first options (§4.10.7). Existing tokens, classes and icons
only.
**2026-10-09 (the user's calls; this spec brought in line the same day):** hand-off receipts and
the replies before them name the person the job goes to, the fictional sample owner **Sam**, with
a role ("Passed to Sam, the owner", "Sam's inbox"), never "you" (§4.10.3, §4.10.8). The default
set's "Order questions" chat now shows the agent passing a refund request to Sam (§4.10.8). The
online-store sync events and report stamp were reworded (§4.10.1). No layout, class, hook or motion
change.

**The one question it adds to a panel:** what did the agent actually do? A chat on its own looks
like ChatGPT ("it's just a chatbot"). The action line is a small receipt in the demo that says the
job is done and where the reader finds it: "Booked Sat 10:00" in "your calendar".

### 4.10.1 Where it appears, per demo kind

| Kind | Has it? | Why |
|---|---|---|
| `chat` | **Yes**, one per chat | Bubbles alone read as a chatbot. The receipt sits in the ordered message list, at the point the job got done (it can follow the customer's "yes please", not just an agent line) |
| `leads` | **Yes**, one per list, except Discord moderation | The pills say the verb ("booked", "followed up", "passed on") but not where the result went. One closing receipt under the list says it ("your calendar"). Moderation's own pills per row (timed out, warned, mods told) are already three actions: nothing added |
| `report` | No | The pill already says the action and where it went ("sent to Sam · Mon 09:00" on online-store, "sent to owner · Mon 09:00" on Discord) |
| `sync` | No | Each event's result is an action in a place ("Stock count lowered", "Added to your sales sheet", "Order marked shipped"; Discord "Row in Sheets", "Posted in #live") |
| `checklist` | No | Each line's note is its result, and the pill is the outcome ("role given") |
| `orchestra` | No | Builders' content; the pill is the outcome ("all checks green") |

**Rows that have one (11 of the 21):**

| Set | Row | Kind | Slot |
|---|---|---|---|
| `default` | 1 Bookings | `leads` | `agents.cards.default[0].demo.action` |
| | 2 Customer messages | `chat` | `agents.cards.default[1].demo.messages[i]`, `from: "action"` |
| | 3 Order questions (the refund hand-off, §4.10.8) | `chat` | `agents.cards.default[2].demo.messages[i]` |
| | 4 New enquiries | `leads` | `agents.cards.default[3].demo.action` |
| `service-business` | 1 Bookings | `leads` | `…["service-business"][0].demo.action` |
| | 2 Customer messages | `chat` | `…["service-business"][1].demo.messages[i]` |
| | 3 Reminders | `chat` | `…["service-business"][2].demo.messages[i]` |
| | 4 New enquiries | `leads` | `…["service-business"][3].demo.action` |
| `online-store` | 1 Order questions (the tracking link) | `chat` | `…["online-store"][0].demo.messages[i]` |
| | 4 Returns (a hand-off to Sam) | `leads` | `…["online-store"][3].demo.action` |
| `discord` | 1 Member questions | `chat` | `…discord[0].demo.messages[i]` |

None in `software-builder`. `discord` rows 2–5 and `online-store` rows 2–3: nothing (above).

### 4.10.2 Layout and classes (`components/home/agents/DemoActionLine.tsx`, server)

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
  └ span class="{metaLabel}"                           ← action.where   (metaLabel = font-mono text-meta text-muted)
```

- **Chat:** the row is one entry of `ChatDemo`'s flex column (`gap-3.5`), in list order. It counts
  one place in `data-demo-order`, like a visitor line (no typing dots before it).
- **Leads:** `LeadsDemo` returns `div.flex.flex-col.gap-2.5` → the `ul`, then the row (`order` =
  after the last pill). Without `action` it renders the `ul` alone (Discord moderation).
- **One line or two:** `flex-wrap` puts `where` beside `text` when both fit and under it when
  not. No breakpoint. The tick sits on the first line (`mt-0.5`: a 20px box on a 23px line).
- **States:** not interactive. No hover, focus-visible or active state, no tap target, no cursor
  (the rule of §4.4: demo parts are pictures).
- **Contrast:** `text` on `band` above 15:1; `muted` on `band` ≈ 6.5:1; the `accent` outline on
  `band` ≈ 8:1; `on-accent` on `accent` well above 4.5:1. The tick is never the only sign: the text says done.
- **Icon:** `CheckIcon` (existing). No calendar or mail icon; `where` says the place in words.

### 4.10.3 Content shape (`lib/agents.ts`, `content/home.ts`)

- Type `DemoAction = { readonly text: string; readonly where: string }`.
- `ChatDemoContent.messages` is a union: `{ from: "them" | "agent"; text; meta? }` or
  `{ from: "action"; text; where }`. Exactly one `action` entry per chat in the 11 rows above.
- `LeadsDemoContent` has `action?: DemoAction` (optional, so moderation stays valid).
- Shared key `agents.demoAction`: the screen-reader name read before every action line, so it's
  heard as a thing done, not a line said ("Done: Booked Sat 10:00 your calendar").

| Slot | Meaning (for copywriter) |
|---|---|
| `action.text` | What the agent did, past tense, verb first, with the sample's detail: "Booked Sat 10:00", "Tracking link sent", "Moved to Thu 10:00" (voice rule 15). **A hand-off names the person it went to** (2026-10-09): the fictional sample owner and their role, "Passed to Sam, the owner"; never "Passed to you" |
| `action.where` | Where the result is found: "your calendar", "your orders", "your messages" when it stays with the reader; the named person's place for a hand-off ("Sam's inbox"). It may name an everyday product (§7.4). Lower case except a name, no end punctuation |
| `agents.demoAction` | Screen-reader only: names the row as an action taken, before its text |

**Naming rule (the user's call, 2026-10-09):** inside a demo, whoever a job is passed to is named,
as a sample person with a role, so the reader sees who decides. Sam is the one sample owner across
the default and online-store demos (the "Order questions" chat, the "Returns" receipt and the Sales
report stamp "sent to Sam · Mon 09:00"). Discord's report stamp stays "sent to owner · Mon 09:00"
(no Sam there). "You" stays wherever the page speaks to the visitor: card lines, the Agents lead
and Process' `handoffLabel` and lead. Sam is sample content (constitution §7.5): no real person.

**Sizing notes at 360 (not rules, voice "Length"):** the row's text column is 216px. `text` fits
one line up to about 28 characters (15px): "Passed to Sam, the owner" (24) is one line; "Passed to Sam,
the owner, to decide" (35) takes two. `where` fits one line up to about 30 (12px mono). Longer copy
wraps and the row grows by a line, which is fine. From 768 both sit on one line up to about 70
characters together; at 1024 (the narrowest desktop panel) up to about 36.
**Copy check, no new slot:** `report`'s `sent` and `sync`'s event results already say the job and
the place; keep them that way when rewording ("all up to date" and "nothing to copy over" are
states, so the events carry the action).

### 4.10.4 Sizes

| Element | Phone 360 | Tablet 768 | Desktop 1440 (1024) | 4K 3840 |
|---|---|---|---|---|
| Row width (the demo body) | 278 | 640 | 544 (375) | 646 |
| Row padding / radius | 14 × 12 / 12 | 18 × 12 / 12 | same | same |
| Tick box / check | 20 / 12 | same | same | same |
| `text` (`text-body`, 500) / `where` (`text-meta` mono) | 15px / 12px, stacked | 15 / 12, one line | 15 / 12, one line (1024: one line to ≈ 36 characters together) | 15 / 12, one line |
| Row height | ≈ 70 (two lines); ≈ 93 for a three-line hand-off ("…, to decide" + `where`) | ≈ 49 | ≈ 49 (1024: 49–70) | ≈ 49 |
| Added to a chat (row + `gap-3.5`) | + ≈ 84 | + ≈ 63 | + ≈ 63 | + ≈ 63 |
| Added to a list (row + `gap-2.5`) | + ≈ 80 (Returns ≈ 103) | + ≈ 59 | + ≈ 59 | + ≈ 59 |

**Panel heights (estimates; heights follow each demo, the user, 2026-10-04).** At 360 a
three-message chat panel goes from about the 384 minimum to about 470; the four-entry chats (the
default "Order questions" hand-off, the reminder chat with five) to about 520–560; a list to about
410–430, each plus the stepper. At 1440 the 554 minimum (body 428) holds the lists and the
three- and four-entry chats; the reminder chat may grow the panel by up to about 60. At 1024
(body 277) every chat and list with a receipt grows the panel, by about 60–110. 3840 is as 1440
(body 522). **Nothing scrolls sideways:** the row is `w-full` with `min-w-0` text and
`wrap-break-word`, so a long word breaks inside 216 at 360.

### 4.10.5 Motion (built 2026-10-08, `lib/agentDemoReceipt.ts`) and screen readers

- **Hooks:** `demo-action` (the row, with `data-demo-order`), `demo-action-pending` (the empty box,
  `hidden` in static), `demo-action-tick` (the ticked box, no `data-demo-order` of its own). They
  are distinct from `demo-before` on purpose: `leads()` and `checklist()` find their rows by
  `demo-before`, so the receipt never matches that.
- **What moves:** the row pops (`POP_FROM`, 0.45s) at its place in order, showing the empty box.
  After a drawn hold of **[0.45, 0.9]s** (`RECEIPT_HOLD`) from the row's start (the agent doing
  the job), the empty box hides and the tick pops in its place (`TICK_FROM`, 0.3s, `back.out(2)`,
  as the Checklist's ticks; shared through `lib/agentDemoPop.ts`). Trigger: the panel showing, as
  every replay.
- **Chat:** the hold is one more step in `spendBudget`. The gap after the row (if it isn't last)
  is `CHAT.gap`. Longest time **4.5s** for a chat with a receipt, so it's on screen at least 1.5s
  before the 6s advance. The default "Order questions" hand-off (them, agent, receipt, them) plays
  as any chat: typing dots, the agent line, the receipt and its tick, then the customer's reply.
- **Leads:** after the last pill's swap, a gap of **[0.2, 0.5]s**, then the row and its hold.
  Longest time **4.4s** for a list with a receipt (3.2s without).
- **The 6s clock holds:** 4.5s and 4.4s are both inside it. Orchestra, report, sync and checklist
  are unaffected.
- **Reduced motion:** the row fades in at its `data-demo-order`, ticked, with no hold, no pending
  box and no tick pop (the shared `fadeIn`).
- **Static (no JS, first paint, the no-JS `AgentsStack` fallback):** the row is shown, ticked.
- **Screen readers:** the finished demo is in the DOM and read in order inside its `tabpanel`;
  nothing is announced while it replays (no live region). The receipt is a `<p>` in reading order
  with the `sr-only` `agents.demoAction` prefix. The boxes are `aria-hidden`.

### 4.10.6 Components

- `components/home/agents/DemoActionLine.tsx` (props `action: DemoAction`, `order: number`).
- `ChatDemo.tsx` renders the `action` entry (order counting +1); `LeadsDemo.tsx` wraps the list
  with the optional receipt; `lib/agents.ts` holds `DemoAction`, the chat union and
  `LeadsDemoContent.action?`; `lib/agentDemoSequences.ts` (`chat()`, `leads()`) and
  `lib/agentDemoReceipt.ts` play it.
- Untouched by it: `AgentDemoFrame`, `DemoStatusPill`, `ReportDemo`, `SyncDemo`, `ChecklistDemo`,
  `OrchestraDemo`, `AgentsAllOffers` (title and line only), `TypingBubble`. Images: none.

### 4.10.7 Choices (decided by the user, 2026-10-08: the first option of each)

39. **The look:** an `accent` outline with no fill and the ticked box. (Not chosen: an inset
    `bg-bg` row with a `line` border and only the tick in the accent.)
40. **Width:** the full width of the demo. (Not chosen: on the agent's side under its bubble.)
41. **Place in a chat:** its own entry in the ordered list. (Not chosen: attached to an agent message.)
42. **How many:** one per demo. (Not chosen: one per job.)
43. **Lists (`leads`):** a closing receipt on the five booking, enquiry and returns lists. (Not
    chosen: nothing in lists.)
44. **Report, sync, checklist, orchestra:** nothing new, a copy check only. (Not chosen: the
    receipt on every demo.)
45. **The motion beat:** empty box, a short hold, then the tick. (Not chosen: a plain pop.)
46. **Chat ceiling:** 4.5s for a chat with a receipt. (Not chosen: 5s.)
47. **The chat `meta` note** where a receipt follows: dropped. (Not chosen: kept.)
48. **Screen-reader name:** a new `agents.demoAction` ("Done"). (Not chosen: reuse `agents.demoAgent`.)

### 4.10.8 The hand-off receipt (the user's calls, 2026-10-09)

The default set's "Order questions" (row 3) was a happy-path answer like every other default
demo. It now shows the agent stopping: owners who know only ChatGPT fear a bot improvising with
their customers, and this demo answers that inside Agents (facts: refunds passed to a person).

| Entry | `from` | Holds (wording in `content/home.ts`) |
|---|---|---|
| 1 | `them` | The customer asks for a refund on a damaged order |
| 2 | `agent` | The agent says refunds are decided by Sam, the owner, and that it has passed the request on with the order details |
| 3 | `action` | `text` "Passed to Sam, the owner"; `where` "Sam's inbox" |
| 4 | `them` | The customer's short thanks |

- **No new UI:** the same `ChatDemo` and `DemoActionLine`, as online-store "Returns" already uses
  for its hand-off. Kinds stay `leads, chat, chat, leads` for the default set.
- **The card's line** (`agents.cards.default[2].line`) covers both halves: routine order questions
  answered, refund requests passed to you (the card line speaks to the visitor, so "you").
- **Online-store "Order questions"** keeps its tracking-link chat ("Tracking link sent", "your orders").
- **Online-store "Returns"** receipt: `text` "Passed to Sam, the owner, to decide", `where`
  "Sam's inbox" (was "Passed to you to decide").
- **Motion (built):** unchanged; it plays as any four-entry chat with a receipt (§4.10.5).

**Tokens used here:** `accent`, `on-accent`, `text`, `muted`, `line`, `band`; `font-body`,
`font-mono`; `text-body`, `text-meta`; radii `rounded-xl`, `rounded-md`. No new token.
