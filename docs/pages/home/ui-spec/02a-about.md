# §2a About: UI spec

Shared rules and parts (§0): [`../ui-spec.md`](../ui-spec.md). Page doc: [`../sections/02a-about.md`](../sections/02a-about.md).

**Last Updated:** 2026-10-01 (new; spec only, nothing built). Sample content this round (local preview).
User's answers 2026-10-01 applied (Choices → About 1–6, 8, 9 decided; 7 open).

## 2a. About (the one question: can he help someone like me?)

Decided 2026-10-01: that is the skim question; the short "who I am" is its set-up, not a second
question. Two parts, read left to right: the "who I am", then the mascot asking the visitor what
they do, styled as **the first message of a chat**. A chatbot widget replaces the static thread
later (adding a free-text box), so the panel already has the widget's three rows: header, thread,
footer. **Never a gate:** no overlay, no scroll lock, no focus move, no scroll on arrival; the page
reads and works fully with no reply picked and without JavaScript.

### 2a.1 Layout

- **Placement (decided 2026-10-01):** right after the Hero, before the Marquee. Section frame
  (§0.1) with its `border-t`, `id="about"` (`lib/routes.ts` gains `about`; no nav link, decided),
  `scroll-mt-20`. Agents keeps its frame as it is (no `border-t`). Inner: `splitGrid` (stacked
  below `lg`, two equal columns from `lg`, top-aligned so a pick only grows the panel downward and
  never moves the text). No sticky column: both columns are short.
- **Left, `AboutIntro`** (`data-anim="reveal"`): `flex flex-col gap-6 lg:gap-8`: `SectionLabel`
  **without a number** (decided 2026-10-01: About is unnumbered; `about.label` only, see §0.4),
  `SectionHeading size="heading-sm"`, then `<div class="flex max-w-100 flex-col gap-3">` of
  `about.lines` as `<p class="text-lead leading-normal text-muted text-pretty">` (heading + 1–2
  lead lines, decided).
- **Right, `AboutChat`** (`data-anim="reveal"`, `data-anim-delay="150"`): `<div class="group/about flex w-full max-w-2xl flex-col">`:
  1. **Mascot** standing on the panel's top edge: `ProcessBot role="host" pose="idle"` with
     `className="block h-22 w-34 -ml-2 md:-ml-1"` (136×88 at every width). The SVG's bottom edge is
     the feet (viewBox y 92), so the feet sit on the panel's 1px top border, as on Process' ground
     line; the margin lines the body's left edge up with the bubbles. It stands on `bg`, so its
     `fill-bg` eye holes stay valid (§5.6).
  2. **Panel** `<section aria-labelledby={titleId} class="rounded-3xl border border-line bg-band">` (Agents' panel language):
     - **Header** (`AboutChatHeader`): `flex items-center gap-2.5 border-b border-line px-5 py-4 {metaLabel}`:
       dot `size-1.5 rounded-full bg-accent` (`aria-hidden`, `data-anim="about-status-dot"`), then
       `<h3 id={titleId}>` `about.chat.title`. The right end stays empty (the widget's later controls go there).
     - **Thread** (`AboutThread`): `flex flex-col gap-3.5 p-5 md:p-6`: the prompt bubble (mascot side,
       `id={promptId}`), `TypingBubble side="start"` (hidden, motion only), then one `AboutReplyPair` per reply.
     - **Footer** (`AboutReplies`): `border-t border-line p-5 md:p-6` → `<fieldset aria-labelledby={promptId} class="flex flex-wrap gap-2">`
       of `AboutReplyChip`s, group replies first, "Just looking" last. **The free-text box goes here
       later**, as the footer's last row under the chips (`flex flex-col gap-4`); nothing is reserved
       or drawn for it now.
- **Bubbles** (`AboutBubble`, prop `from`): text `text-body-lg text-pretty`, `px-4.5 py-3.5 rounded-xl`, `max-w-[85%]`.
  Mascot: `self-start rounded-tl-sm bg-line/40 text-text` (tail toward the mascot above). Visitor:
  `self-end rounded-tr-sm bg-accent text-on-accent`.
- **Reply pair** (`AboutReplyPair`, one per reply, index i): `<div data-anim="about-pair" class="hidden flex-col gap-3.5 {replyShow[i]}">`:
  the visitor echo (the reply's label), then the mascot's `ack`. `replyShow[i]` is a literal string
  from `lib/aboutReplies.ts`, `group-has-[#about-reply-{i}:checked]/about:flex`, written out for
  i = 0–6 so Tailwind sees each class. Only the picked reply's pair shows; picking another swaps it
  (no history, no stacking).
- **Chip** (`AboutReplyChip`): `<label class="group/chip cursor-pointer">` → `<input type="radio" name="about-for" id="about-reply-{i}" value={key} class="peer sr-only">`
  → `<span class="{chip} border-line text-muted …states (2a.3)">` with `CheckIcon` `hidden size-3.5 group-has-checked/chip:block`, then the label.
  `chip` is the shared base in `lib/styles.ts` (§0.3), the same look as Contact's need chips.
  Native radios: arrow keys move and pick; a tap before hydration survives it.

### 2a.2 Picked state, `?for=`, WhatsApp, no JS

- **No pick (default):** prompt and chips only; no radio checked; the page is complete as it is.
- **Picked:** the chip turns accent with a tick, its echo and ack show above the footer, the chips
  stay visible below, so changing the answer is one tap on another chip.
- **WhatsApp (decided 2026-10-01, option B):** a pick also gives every existing WhatsApp link (the
  Contact row, the footer social) that group's `whatsappText` as its default message. No new
  button anywhere; About adds no link of its own. `hooks/useAboutPick.ts` reads the checked radio
  (the one source of truth, `useSyncExternalStore` over `change` events on `name="about-for"`);
  `components/WhatsAppLink.tsx` (client, built on `ExternalLink`) takes its `href` from
  `lib/whatsapp.ts` (pure: number + text → wa.me link) and replaces the plain WhatsApp link in
  `ContactLinks` and the footer socials. Server markup keeps `links.whatsapp` (the default message),
  so it works without JS; no pick or "Just looking" keeps the default.
- **`?for=<key>` (decided: applied in the browser after load)** (`hooks/useAboutFor.ts` via
  `AboutForParam`, renders nothing): on mount it reads `location.search`, compares `for` raw against
  the reply keys, and checks that radio unless one is already checked, then dispatches its `change`
  so the WhatsApp links follow. No scroll, no focus move, no announcement. An unknown key is
  ignored. The page stays static (no `searchParams` in `page.tsx`); the URL isn't rewritten on a
  pick and the pick isn't remembered across reloads.
- **Announcing:** `AboutStatus` (client) is a `<p class="sr-only" aria-live="polite">` set to the ack
  text on a user's change only (never on load or from `?for`).
- **No JS (decided):** visible **and working**: the native radios check, and CSS `:has` shows the
  pair. Only `?for`, the live status and the WhatsApp message change need JS.

### 2a.3 States

| Element | Default | Hover | Focus-visible | Checked | Active |
|---|---|---|---|---|---|
| Reply chip (span) | `border-line text-muted` | `peer-not-checked:hover:border-muted peer-not-checked:hover:text-text` | `peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-text` | `peer-checked:border-accent peer-checked:bg-accent peer-checked:text-on-accent` + tick | `peer-not-checked:active:bg-line` |
| Mascot | pose (look 0) | (later) jump, fine pointer | none: decorative, `aria-hidden` | n/a | (later) jump on tap |
| Header, bubbles | static | n/a | n/a | n/a | n/a |
| WhatsApp links (Contact, footer) | unchanged look; only `href` changes | unchanged | unchanged | n/a | unchanged |

Contrast: `muted` on `band` ~6.6:1, `text` on `line/40` over `band` >12:1, `on-accent` on `accent` ~9:1.
Every chip is 44px tall (`min-h-11`); the check icon means state isn't colour alone.

### 2a.4 Sizes

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Layout | stacked, content 320 | stacked, 706 | 2 cols, 616 each, gap 96 | 2 cols, 720 each |
| Label (`monoLabel`, no number) | 13px | same | same | same |
| Heading (`text-heading-sm`) | 40px | 53px | 75px | 80px |
| Lines (`text-lead`) | 17px, max 400 | same | same | same |
| Mascot (`w-34 h-22`) | 136×88 | same | same | same |
| Panel (`max-w-2xl`) | 320 | 672 | 616 | 672, left in its column |
| Header | 12px mono, ~49 tall | same | same | same |
| Thread / footer padding | 20 | 24 | 24 | 24 |
| Bubble | 16px, max 85% (~238) | max ~571 | max ~524 | max ~571 |
| Chips | 15px, 44 tall, wrap (~3–4 rows of 7) | 1–2 rows | 2 rows | 2 rows |
| Panel height, picked vs not | +~150 (echo + ack) | +~120 | +~120 | +~120 |

Nothing scrolls sideways: chips and bubbles wrap; the mascot's paint overflow (squash −5px, jump
14px up) stays inside the column and the section's `py-section`.

### 2a.5 Content slots (`content/home.ts → about`; sample data this round, replaced before ship)

| Key | Meaning | Limit |
|---|---|---|
| `about.label` | The section label, shown without a number (About is unnumbered) | 5 words |
| `about.heading.lead` / `.accent` | Who I am, in one line; last words violet (facts → Who) | 6 words in total |
| `about.lines[1–2]` | The rest of "who I am": what I do and who for (facts → Who; more facts needed) | 12 words each, 24 total |
| `about.chat.title` | The mascot's name in the panel header; names the panel | 3 words |
| `about.prompt` | The mascot's question about the visitor ("What do you do?"-type) | 8 words |
| `about.replies[5–7]` `{key, label, ack, whatsappText}` | **Plan for 4–6 visitor groups + "Just looking" (last), 7 max.** `key`: the `?for=` value, lowercase slug, fixed once shared. `label`: chip and echo text. `ack`: the mascot's reply tying the group to what I do, no claim outside facts. `whatsappText`: that group's WhatsApp default message ("Just looking" reuses the default in `links.whatsapp`) | label 3 words / 20 characters; ack 14 words / 90 characters; whatsappText 20 words |

No other section's number changes: Agents–Contact keep 01–05.

### 2a.6 Components, images

- **New (`components/home/about/`, server unless marked):** `AboutSection.tsx`, `AboutIntro.tsx`,
  `AboutChat.tsx` (mascot + panel shell), `AboutChatHeader.tsx`, `AboutThread.tsx`, `AboutBubble.tsx`,
  `AboutReplyPair.tsx`, `AboutReplies.tsx`, `AboutReplyChip.tsx`, `AboutStatus.tsx` (client),
  `AboutForParam.tsx` (client, renders nothing), later `AboutMotion.tsx` (client). Shared:
  `components/WhatsAppLink.tsx` (client). Logic: `lib/aboutReplies.ts` (ids, `replyShow[7]`, key
  lookup), `lib/whatsapp.ts`, `hooks/useAboutFor.ts`, `hooks/useAboutPick.ts`.
- **Extended:** `SectionLabel.tsx`: `number` becomes optional; without it the label renders as the
  hairline then the label text (§0.4). `ProcessBot.tsx` gains an optional `className` (size classes;
  default = Process'). `lib/processBots.ts`: `BotRole` gains `host`: no hat, no tools, idle arms,
  looks `idle 0` / `act 7`. Every `Record<BotRole, …>` (`processBotMotion.ts`, `processBotActs.ts`)
  gains a `host` entry. `lib/styles.ts` gains `chip`; `NeedChips` imports it. ChatDemo's typing
  bubble moves to `components/TypingBubble.tsx` (prop `side`), shared, so it isn't forked.
  `ContactLinks` and the footer socials use `WhatsAppLink` for the WhatsApp row.
- **Mascot choice:** the 2D `ProcessBot`, not the 3D `ProofBot`: it already has the full life rig
  and hooks, reads at 136px, and sits on `bg`; the 3D bot is shaded for the ink banner on a cream card.
- **Images:** none (the mascot is inline decorative SVG, like Process).

### 2a.7 Motion (later)

- Intro and panel: `reveal` (panel +150ms). Reduce: fade only.
- Mascot (`data-anim="process-bot"`, `data-role="host"`, the §5.6 `data-bot` hooks, run by
  `hooks/useAboutBot.ts` on the About root, reusing `processBotRig`/`Life`/`Acts`/`Pointer`): drops
  onto the panel edge once at `"top 75%"` (`DROP_*`), then life, blinks, looks, pointer follow and
  the hover/tap jump as Process; no naps. **Host act, a wave:** `arm-right` −55° about 94 53 (0.3
  `power2.out`), ±12° twice (0.15 `sine.inOut`), back (0.4 `back.out(1.6)`), as the prompt appears
  and on each pick. Reduce: static pose, fade in with the panel.
- Prompt (`about-prompt`): after the landing, `about-typing` shows 0.6s, then the bubble pops in
  (`y 8px, scale .96 → none`); chips (`about-chip`) fade up, stagger 0.05s. Static state: all shown.
- Pick (`about-pair` → `about-echo`, `about-ack`): echo pops in, typing 0.5s, ack pops in.
  Reduce: both fade.
- Status dot (`about-status-dot`): opacity 0.25↔1 loop; off under reduce. All pause off screen and
  in a hidden tab (`watchLive`).
