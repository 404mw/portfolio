# §5 Process: UI spec

Shared rules and parts (§0): [`../ui-spec.md`](../ui-spec.md). Page doc: [`../sections/05-process.md`](../sections/05-process.md).

## 5. Process (the one question: how do they work?), a new design beyond v3

### 5.1 Layout

- Section frame, `id="process"`. Inner: `flex flex-col gap-14 md:gap-20 xl:grid xl:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] xl:items-start xl:gap-16 2xl:gap-24`.
- Left: `flex flex-col gap-7`: `SectionLabel` (`process.number`, `process.label`), `SectionHeading size="heading"`.
- **Sticky (2026-09-25):** from `xl` (two columns only from there) the left column adds
  `stickyTitleXl` from `lib/styles.ts` (`xl:sticky xl:top-30 xl:self-start`, 120px), and the grid is
  `xl:items-start`; below `xl` it stays unpinned.
- Right: `ProcessLoop`: a `relative` wrapper (full class list in 5.2: `relative max-w-2xl xl:max-w-none`)
  holding the `<ol>` of four `ProcessStep`s and, from
  `xl`, the `ProcessRing` behind them. **One set of steps in the DOM**; CSS moves them.
- `ProcessStep` text: `STEP n` `{metaLabel} uppercase`, title `<h3 class="font-display font-semibold text-step leading-[1.05] tracking-tight text-balance text-text {condensed}">`,
  line `text-body-lg leading-normal text-muted max-w-70`. Gap `gap-2.5`.

### 5.2 Phone to `lg`: a column with a return line

- `ProcessLoop` wrapper: `relative max-w-2xl xl:max-w-none`. The cap is on the wrapper, not the
  `<ol>`, so the ring stays centred from `xl`.
- `<ol class="grid grid-cols-[3rem_minmax(0,1fr)]">`; each `<li class="relative col-span-2 grid grid-cols-subgrid pb-12 last:pb-0">`
  (padding, not gap, so the rail runs unbroken).
- Col 1 is the rail (`aria-hidden` parts). Its parts are positioned against the `relative` `<li>`,
  not the rail cell, so each segment spans the `li`'s `pb-12` and the loop line is unbroken.
  Dot: `relative z-10 mx-auto mt-2 size-4 rounded-full bg-accent ring-8 ring-accent/15`
  (`data-anim="process-dot"`), dot centre at x 24, y 16. Loop segment per step, `absolute left-1.25 w-5 border-accent`:

| Step | Segment classes | Draws |
|---|---|---|
| 1 | `top-4 bottom-0 border-2 border-b-0 rounded-tl-xl` | the return line turning into dot 1, and the forward line leaving it |
| 2, 3 | `inset-y-0 border-x-2` | forward line (right) and return line (left) |
| 4 | `top-0 h-4 border-2 border-t-0 rounded-bl-xl` | forward line into dot 4, turning back onto the return line |

  The segments' right border (x 23–25) runs through the dot centres; the left border (x 5–7) is the
  return. Together they read as one closed loop. On steps 2 and 3, a `ChevronUpIcon`
  (`absolute left-1.5 top-1/2 size-3 -translate-1/2 text-accent`) sits on the return line to show direction.
- After the list: `<p class="pl-12 pt-4 {metaLabel} xl:sr-only">` with `process.loopLabel`.
- Below `xl` the ring is `hidden`.

### 5.3 From `xl`: the ring (`ProcessRing`, `aria-hidden`)

- `<ol>` becomes `xl:grid xl:grid-cols-[minmax(0,1fr)_18rem_minmax(0,1fr)] xl:grid-rows-[1fr_18rem_1fr] xl:gap-8 2xl:grid-cols-[minmax(0,1fr)_20rem_minmax(0,1fr)] 2xl:grid-rows-[1fr_20rem_1fr]`.
  The `1fr` rows and columns size equally, so the ring cell sits exactly at the wrapper's centre.
  Each `li` takes `xl:col-span-1 xl:block xl:pb-0`. Rails and chevrons are `xl:hidden`. The column
  loop label is `xl:sr-only`, not hidden, so screen readers keep it at `xl`; the ring's copy stays decorative.
- Step placement, clockwise from the top. The cell and `self-*` classes go on the `li`; the
  `text-*` and `items-*` classes go on the step's text column (`flex flex-col gap-2.5`):

| Step | Cell (`li`) | Alignment (text column) |
|---|---|---|
| 1 | `xl:col-start-2 xl:row-start-1 xl:self-end` | `xl:text-center xl:items-center` |
| 2 | `xl:col-start-3 xl:row-start-2 xl:self-center` | `xl:text-left` |
| 3 | `xl:col-start-2 xl:row-start-3 xl:self-start` | `xl:text-center xl:items-center` |
| 4 | `xl:col-start-1 xl:row-start-2 xl:self-center` | `xl:text-right xl:items-end` |

- Ring: `<div class="pointer-events-none absolute inset-0 m-auto hidden size-72 xl:block 2xl:size-80">`, centred without transforms. Inside:
  - `<svg viewBox="0 0 100 100" class="size-full overflow-visible text-accent">`.
  - Loop path, starting at the top, clockwise: `<path data-anim="process-path" d="M50 0 A50 50 0 0 1 50 100 A50 50 0 0 1 50 0" fill="none" stroke="currentColor" stroke-width="2" vector-effect="non-scaling-stroke" />`.
  - Four direction arrowheads between the steps, `fill="currentColor"`, each
    `<path d="M-3 -3 L2.5 0 L-3 3 Z" transform="translate(X Y) rotate(A)" />`:
    `(85.36 14.64) 45°`, `(85.36 85.36) 135°`, `(14.64 85.36) 225°`, `(14.64 14.64) 315°`.
    Each points clockwise along the tangent.
  - Four dots, HTML over the SVG (`data-anim="process-dot"`), each `absolute size-4 rounded-full bg-accent ring-8 ring-accent/15`:
    top `left-1/2 top-0 -translate-1/2`, right `right-0 top-1/2 translate-x-1/2 -translate-y-1/2`,
    bottom `left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2`, left `left-0 top-1/2 -translate-1/2`.
  - Centre: `process.loopLabel` in `absolute inset-0 m-auto grid max-w-32 place-items-center text-center {metaLabel} uppercase`
    (decorative at `xl`; the column label, `xl:sr-only` there, carries it for screen readers).
  - Runner for the GSAP pass: `<span data-anim="process-runner" class="absolute left-1/2 top-0 hidden size-3 -translate-1/2 rounded-full bg-text">`.
- The 32px gap clears each dot's 8px radius plus its 8px halo, so text never touches a dot.

### 5.4 Sizes

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Layout | heading, then column | same, column max 672 | heading 4/12 beside a ring 8/12 | same |
| Heading (`text-heading`) | 44px | 64px | 96px | 104px |
| Ring diameter | n/a | n/a | 288 (`xl`); 320 from 1536 | 320 |
| Side step column | n/a | n/a | ~195 (at 1280) to 250 | ~288 |
| Step title (`text-step`) | 32px | 32px | 32px | 32px |
| Step line | 16px, max 280 | same | same | same |
| Dot | 16 + 8px halo | same | same | same |
| Loop line | 2px `accent` | same | same (non-scaling) | same |

### 5.5 Slots, components, images, motion

| Key (`content/home.ts → process`) | Meaning | Limit |
|---|---|---|
| `process.number` / `process.label` | "02" and the section label | 5 words |
| `process.heading.lead` / `.accent` | The heading; `accent` is its last words, in violet (facts → How the user works) | 6 words in total |
| `process.stepLabel` | "Step" before each number | 1 word |
| `process.steps[0–3].title` | Written rules / agents do the work / they check themselves / lessons update the rules | 4 words |
| `process.steps[0–3].line` | One line on the step, facts level only (no agent names, tools or counts) | 10 words |
| `process.loopLabel` | Says the loop returns to step 1 with better rules | 5 words |

- **Components:** `components/home/process/ProcessSection.tsx`, `ProcessLoop.tsx` (list plus
  placement), `ProcessStep.tsx`, `ProcessRail.tsx` (a step's dot and loop segment), `ProcessRing.tsx`.
  **Images:** none.
- **Motion (later):** the heading and steps reveal on scroll (`data-anim="reveal"`). It sits on the
  left wrapper (label and heading) and on each step's text column, never on the `li`, so the loop
  line never fades. A runner travels
  the loop continuously (ring: along `process-path`; column: down the forward line and back up the
  return, a path built from the rail boxes); the dots dim to `bg-line` and light as it passes.
  There are 8 `process-dot` elements (4 rail, 4 ring); the motion pass animates the visible set.
  Reduced motion: the reveals only fade (no rise); no runner, all dots lit (the static state).
