# §6 Web: UI spec

Shared rules and parts (§0): [`../ui-spec.md`](../ui-spec.md). Page doc: [`../sections/06-web.md`](../sections/06-web.md).

## 6. Web (the one question: can they build my website end to end?)

### 6.1 Layout and classes

- Section frame, `id="web"`. Inner: `splitGrid` from `lib/styles.ts` (`splitColumns` +
  `lg:items-start`: `grid gap-10 md:gap-12 lg:grid-cols-2 lg:items-start lg:gap-16 xl:gap-24`).
- Left (`data-anim="reveal"`): `flex flex-col gap-7` + `stickyTitle` (`lg:sticky lg:top-30 lg:self-start`): `SectionLabel`,
  `SectionHeading size="heading-sm"`, lead `<p class="max-w-sm text-lead leading-normal text-muted">`.
  CSS sticky from `lg`; phone and tablet stack normally.
- Right: `<ol>` of four rows, `group grid grid-cols-[3rem_minmax(0,1fr)] gap-x-4 gap-y-3 border-t border-line py-7` (`data-anim="web-row"`):
  number `pt-3 font-mono text-meta text-accent`; title `<h3 class="font-display font-semibold text-row leading-none tracking-[-0.035em] text-text {condensed}">`;
  line `col-start-2 max-w-md text-body-lg leading-normal text-muted`.

| Row | Default | Hover (decoration; rows aren't interactive) | Focus / active |
|---|---|---|---|
| Number / title / line | `text-accent` / `text-text` / `text-muted` | line `group-hover:text-text` | n/a |

### 6.2 Sizes

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Layout | stacked | stacked | 2 cols, left sticky at 120px | same, in 1536 |
| Heading (`text-heading-sm`) | 40px | 53px | 75px | 80px |
| Lead | 17px, max 384 | same | same | same |
| Row title (`text-row`) | 34px | 44px | 58px | 58px |
| Row line | 16px, max 448 | same | same | same |

### 6.3 Slots, components, images, motion

| Key (`content/home.ts → web`) | Meaning | Limit |
|---|---|---|
| `web.number` / `web.label` | "03" and the section label | 5 words |
| `web.heading.lead` / `.accent` | Heading; last words in violet (facts → What the user can build) | 6 words in total |
| `web.lead` | One line: one person end to end, automations wired in (facts) | 40 words; aim for 15 |
| `web.steps[0–3].title` | Strategy / Design / Build / Launch & care | 1–3 words |
| `web.steps[0–3].line` | One line per step, facts only | 12 words |

- **Components:** `components/home/web/WebSection.tsx`, `WebStepRow.tsx`. **Images:** none.
- **Motion (later):** rows reveal on scroll, staggered 0.1s; hover indent (`padding-left` 0 → 12px)
  on `pointer: fine`; the left column reveals. Under reduced motion the reveals only fade (no
  rise) and the hover indent is off; the line's hover colour stays.
