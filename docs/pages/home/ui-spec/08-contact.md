# §8 Contact: UI spec

Shared rules and parts (§0): [`../ui-spec.md`](../ui-spec.md). Page doc: [`../sections/08-contact.md`](../sections/08-contact.md).

## 8. Contact (the one question: how do I start?)

### 8.1 Layout

- Section frame, `id="contact"`. Inner: `splitGrid`, Web's two-column layout (6.1).
- Left (`data-anim="reveal"`): `flex flex-col gap-8`: `SectionLabel`, `SectionHeading size="heading-xl"`,
  lead `<p class="max-w-100 text-lead leading-normal text-muted">`, then `ContactLinks`:
  `<ul class="max-w-100 border-t border-line">`, three rows, each `<a>`
  `flex min-h-12 items-center justify-between gap-4 border-b border-line text-body text-text`:
  label left, kind right (`text-muted`, with `ArrowUpRightIcon` on the two new-tab rows).
  1. Book a call: the shared contact-row component, carrying `data-track="book-call"` so it's counted the same way as `BookCallLink` (new tab, no "30-minute" label).
  2. Email: `links.email` (mailto); its label is `links.emailAddress`.
  3. WhatsApp: `ExternalLink` to `links.whatsapp` (click-to-chat).
- **Sticky (2026-09-25):** from `lg` the left column adds `stickyTitle` (`lg:sticky lg:top-30 lg:self-start`, 120px) while the
  builder scrolls; phone and tablet stay unpinned.
- Right, `BriefBuilder` (client), `data-anim="reveal"`: `<form aria-labelledby={headingId} class="flex flex-col gap-8 rounded-3xl border border-line bg-band p-6 md:p-8 lg:p-10">`,
  `onSubmit` prevented; nothing is posted. `headingId` is an `sr-only` `<h3>` from `contact.brief.heading`.

### 8.2 Brief builder parts

- **(01) Needs, multi-select chips** (`NeedChips`): `<fieldset>` + `<legend class="{metaLabel} uppercase mb-3.5">`;
  chips `flex flex-wrap gap-2`, each `<button type="button" aria-pressed>`
  `inline-flex min-h-11 items-center gap-2 rounded-full border px-4.5 text-body` + `focusRing`.
  AI agents pressed on load. A pressed chip shows `CheckIcon` (`size-3.5`), so state isn't colour alone.
- **(02) Timeline, single select** (`TimelineSegments`): `<fieldset>` + `<legend>`; track
  `grid grid-cols-3 rounded-xl border border-line bg-bg p-1`; each option is a native
  `<input type="radio" name="timeline" class="peer sr-only">` inside its `<label class="grid cursor-pointer">`,
  followed by a `<span class="grid min-h-11 place-items-center rounded-lg px-2 text-center text-small">` carrying the segment look.
  Arrow keys move between options natively. This month checked on load.
- **(03) Repeat, textarea** (`RepeatField`): `<label for>` in `{metaLabel} uppercase`;
  `<textarea rows="4" class="min-h-30 w-full resize-y rounded-xl border border-muted/70 bg-bg px-4.5 py-4 text-body-lg leading-normal text-text placeholder:text-muted focus-visible:border-accent {focusRing}">`
  with placeholder `contact.brief.placeholders[0]`. `maxLength` 500, so the mailto stays a safe length.
- **Uncontrolled:** the radios and the textarea are uncontrolled; `hooks/useBriefState.ts` reads
  them back from the form on mount, so a choice or text entered before hydration survives it.
- **Send** (`SendBriefLink`): `<a href={mailto}>`
  `flex items-center justify-between gap-4 rounded-full bg-accent py-2 pr-2 pl-7 text-lead font-semibold text-on-accent hover:bg-text active:bg-muted {focusRing}`:
  the label plus `sr-only` `contact.brief.sendHint`, then `grid size-11 place-items-center rounded-full bg-bg text-accent` holding `ArrowRightIcon`.
  The mailto goes to `links.emailAddress` with the subject and body from `lib/brief.ts`, built from
  the choices and the `contact.brief.mail.*` slots. The server markup carries the default choices'
  mailto, so it works without JS.
- **Summary:** `<p aria-live="polite" class="text-center {metaLabel}">`: pressed needs joined by
  " + ", a " · ", then the timeline; `contact.brief.summaryEmpty` when no need is pressed.
- **No JS:** the chips, timeline, textarea and summary take `noscript:hidden` (Send can't follow
  them); Send keeps the default brief's mailto.

| Control | Default | Hover | Focus-visible | Pressed / checked | Active |
|---|---|---|---|---|---|
| Chip | `border-line text-muted` | `border-muted text-text` | `focusRing` | `border-accent bg-accent text-on-accent` + check | `bg-line` (unpressed) |
| Segment | `text-muted` | `peer-not-checked:hover:text-text` (unchecked only) | `peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-text` | `peer-checked:bg-text peer-checked:text-bg` | `peer-not-checked:active:bg-line` (unchecked only) |
| Textarea | `border-muted/70` | same | `border-accent` + `focusRing` | n/a | n/a |
| Send | `bg-accent text-on-accent` | `bg-text` | `focusRing` | n/a | `bg-muted` |
| Contact row | `text-text`, kind `text-muted` | label `text-accent` | `focusRing` | n/a | `bg-band` |

### 8.3 Sizes

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Layout | stacked | stacked | 2 cols (616 each) | 2 cols (720 each) |
| Heading (`text-heading-xl`) | 52px | 75px | 112px | 124px |
| Lead / links | 17px / 15px, rows 48 tall, max 400 | same | same | same |
| Builder padding | 24 | 32 | 40 | 40 |
| Chips | 15px, 44 tall, wrap | same | same | same |
| Segments | 3 × ~88, 44 tall | 3 × ~210 | 3 × ~176 | 3 × ~210 |
| Textarea | min 120 tall, 16px | same | same | same |
| Send | 60 tall, full width | same | same | same |

### 8.4 Content slots (`content/home.ts → contact`)

| Key | Meaning | Limit |
|---|---|---|
| `contact.number` / `contact.label` | "05" and the section label | 5 words |
| `contact.heading.lead` / `.accent` | Heading; last words in violet | 6 words in total |
| `contact.lead` | Build a short brief, then talk it through on a call | 40 words; aim for 15 |
| `contact.links.bookCall.kind` | Right-hand kind for the Book a call row (its label is `nav.bookCall`) | 2 words |
| `contact.links.email.kind` | "Email" | 1 word |
| `contact.links.whatsapp.label` / `.kind` | WhatsApp row text and kind | 5 / 2 words |
| `contact.brief.heading` | The builder's accessible name (sr-only) | 4 words |
| `contact.brief.needs.legend` / `.options[5]` | "01 / What do you need?"; AI agents, Automations, Website, Web app, Not sure yet | 6 words; 3 words each |
| `contact.brief.timeline.legend` / `.options[3]` | "02 / Timeline"; ASAP, This month, Exploring | 3 words; 2 words each |
| `contact.brief.repeat.label` / `.placeholders[4]` | "03 / What do you repeat every week?"; sample phrases, the first shown statically | 8 words; 5 words each |
| `contact.brief.send` / `.sendHint` | "Send brief"; hidden "opens your email app" | 2 / 5 words |
| `contact.brief.summaryEmpty` | Shown when no need is picked | 5 words |
| `contact.brief.mail.subjectPrefix` / `.need` / `.timeline` / `.repeat` / `.none` | Email subject and body labels (no em dashes) | 5 words each |
| `contact.brief.mail.repeatEmpty` | Email body line when the textarea is empty ("Left blank") | 5 words |

### 8.5 Components, images, motion

- **Components:** `components/home/contact/ContactSection.tsx`, `ContactLinks.tsx`,
  `ContactRow.tsx` (the shared contact row: label, kind, optional new tab and tracking key),
  `BriefBuilder.tsx` (client), `NeedChips.tsx`, `TimelineSegments.tsx`, `RepeatField.tsx`,
  `SendBriefLink.tsx`; `hooks/useBriefState.ts`; `lib/brief.ts` (mailto and summary, pure);
  `lib/track.ts` (the one tracking key, `book-call`). **Images:** none.
- **Motion (later):** the left column and the builder reveal on scroll (builder delayed 0.15s). The
  placeholder (`data-anim="brief-placeholder"`) rotates through `placeholders` every 2.4s, and stops
  on focus or once typed in; the first phrase stays under reduced motion.
