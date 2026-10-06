# §7 Proofs: the spam diagram (Exile's part 6, wide slot): UI spec

Shared rules (§0): [`../ui-spec.md`](../ui-spec.md). The takeover and its parts: [`07-proofs.md`](07-proofs.md)
§7.3. Page doc: [`../sections/07-proofs.md`](../sections/07-proofs.md).

**Last Updated:** 2026-10-06 (new: the user's pick of that day).

**Supersedes** `07-proofs.md` §7.3.2 (the diagram) and §7.6.1 (Eva's images). The bordered and ink
tiles are retired; the eye, alert and lock icons are not used. Static, not built.

## The user's decisions (2026-10-06)

- **From `md`: approach 2, "Ink stage", as drawn in `temp/eva-diagram-samples.html`.** One ink
  band across the three columns, with the proof card banner's floor glow and hatch. Three Evas
  stand on its floor and their heads break out above its top edge. The arrows run inside the
  band, and each step's number, title and line sit on cream 20px below it.
- **Below `md`: option C from `temp/eva-phone-samples.html`, with one change.** There is one
  full-width band per step, with a small down arrow on cream between bands. Eva stands at the
  right end of each band and the step's text sits on the band in `text` / `muted`. **The
  change:** Eva's head breaks out above each band, as it does on desktop.
- **Scope (unchanged from 2026-10-06):** Eva is the one exception to "no generated art on the
  site", for the Exile view only. The site's own mascot stays everywhere else.

**The one question:** how does the spam protection work? Three steps in order, then the way back.
Real text drawn as a picture, with no sample names or messages. Its static state is its final state.

## Layout

**Tablet (768–1023) uses the desktop band, not phone C.** Phone C at 706px would be three
706-wide slabs with roughly 540px of empty ink between the words and Eva. The band's 217px columns
hold a 144px figure, which is larger than the 128 the user called fully legible. The band keeps
decision 8 (three across from 768) and the dashed return U, and the step text keeps the 217px
column it has today. The figure is a little smaller at `md` (144) than on a phone (148). Each
layout stays proportionate on its own, so this was accepted.

**One structure, restyled at `md`.** Each step's heading and line are in the markup once. The
phone ground and the desktop band are decorative siblings, never a copy of the text.

```
div data-anim="spam-diagram"  relative min-w-0
├ SpamStage                         md+ only: the one band (absolute, aria-hidden)
├ ol                                relative grid auto-rows-fr gap-y-10 pt-7 md:grid-cols-3 md:gap-x-7 md:gap-y-0 md:pt-0
│ └ SpamStep ×3   li data-anim="spam-step" data-step={key}
│   ├ InkStageGround glow="end"     phone only: this step's band (absolute, aria-hidden)
│   ├ div (figure layer)            aria-hidden; the floor cut
│   │ ├ SpamStepFigure              data-anim="spam-tile": Eva
│   │ └ SpamStepLink                md+ only, steps 1–2: hairline + chevron in the band
│   ├ div (text)                    number + h4 title, p line
│   └ SpamStepDown                  phone only, steps 1–2: chevron on cream under the band
└ SpamReturn                        dashed box (phone) / dashed U (md+)
```

- **Phone (below `md`).** The `<ol>`'s `pt-7` (28) holds the first Eva's break-out. `auto-rows-fr`
  gives the three bands one height, so the three overhangs match. The `<li>` is the band:
  `relative flex min-h-30 items-center py-3 pr-37 pl-5`. The text column runs from 20px in to the
  figure box's left edge, 152px at 360. The figure's own transparent margin (about 10px at 148)
  keeps the text clear of the symbol's glow. Bands are 40px apart.
- **`md` up.** The `<li>` resets: `md:block md:min-h-0 md:p-0`. The figure layer is in flow at
  the top of the column (as tall as the figure), then the text with `md:pt-5`. `SpamStage` is drawn
  behind the `<ol>`. Its top edge is the overhang down from the `<ol>`'s top and its bottom edge is
  the figure's floor, so every waist cut sits on it.

## Classes (tokens only)

- **`InkStageGround`** (new; the shared ink ground, also used by the card banner, so it is never
  forked): `<div aria-hidden="true" class="absolute overflow-hidden bg-ink {className}" style={{ backgroundImage: `${glow}, ${hatch}` }}>`.
  Props: `glow: "floor" | "end"`; `className` carries the position, radius and visibility.
  - `"floor"` is `proofBotShades.banner.glow`, the card's glow, reused unchanged. `hatch` is
    `proofBotShades.banner.hatch`, also unchanged.
  - `"end"` is a **new shade expression, not a new token** (a choice, see Review 2):
    `banner.glowEnd = radial-gradient(12rem 9rem at calc(100% - 4rem) 130%, color-mix(in oklab, ${token("accent")} 34%, transparent), transparent 62%)`.
    At 320 wide this is C's glow `60% 120% at 80% 130%`. The rem form keeps it under Eva on wider
    phones, where a percentage would drift left of her.
  - `ProofBanner` renders `<InkStageGround glow="floor" className="inset-0 rounded-xl" />` in
    place of its inline ground `<div>`. Its output is unchanged.
- **`SpamStage`**: `<InkStageGround glow="floor" className="inset-x-0 top-7 hidden h-29 rounded-3xl md:block lg:top-9 lg:h-39 xl:top-12 xl:h-50" />`.
- **`SpamStep`**:
  - `<li data-anim="spam-step" data-step={key} class="relative flex min-h-30 items-center py-3 pr-37 pl-5 md:block md:min-h-0 md:p-0">`.
  - Phone ground: `<InkStageGround glow="end" className="inset-0 rounded-3xl md:hidden" />`.
  - Figure layer: `<div aria-hidden="true" class="pointer-events-none absolute inset-0 [clip-path:inset(-50%_0_0_0_round_0_0_1.5rem_1.5rem)] md:relative md:inset-auto md:h-36 md:[clip-path:inset(-50%_-50%_0_-50%)] lg:h-48 xl:h-62">`.
    It holds `SpamStepFigure` and, on steps 1 and 2 (`spamStepPointsOn(index)`), `SpamStepLink`.
  - Text: `<div class="relative flex min-w-0 flex-1 flex-col gap-1.5 md:gap-2 md:pt-5">`, which holds:
    - the row `<div class="flex items-baseline gap-3">`;
    - the number `<span aria-hidden="true" class="{metaLabel} shrink-0 font-medium tracking-[0.06em] md:text-cream-muted">`
      (`listNumber(index)`);
    - the title `<h4 class="min-w-0 font-display text-summary leading-[1.05] font-semibold tracking-[-0.02em] text-text md:text-ink {condensed}">`;
    - then the line `<p class="max-w-xs text-body leading-normal text-muted md:text-cream-muted">`.
- **`SpamStepFigure`** (replaces `SpamStepTile`; still the one swappable slot, props `step` only):
  `<span data-anim="spam-tile" class="absolute right-0 bottom-0 block size-37 origin-bottom md:right-auto md:left-2 md:size-36 lg:left-4 lg:size-48 xl:left-8 xl:size-62">`
  holding `<SiteImage name={spamStepImage[step]} alt="" sizes="(min-width: 1280px) 248px, (min-width: 1024px) 192px, (min-width: 768px) 144px, 148px" fit="contain" position="bottom" />`.
- **`SpamStepLink`** (`md` up, inside the band):
  - The wrapper: `<span class="absolute hidden h-3 items-center text-muted md:flex md:bottom-12.5 md:left-41 md:-right-6 lg:bottom-17.25 lg:left-55 lg:-right-8 xl:bottom-22.75 xl:left-73 xl:-right-12">`.
  - Inside it, the hairline `<span data-anim="spam-link" class="h-px flex-1 origin-left bg-muted/50">`.
  - Then the chevron `<span data-anim="spam-chevron" class="-ml-1.5 shrink-0"><ChevronRightIcon className="size-3" /></span>`.
  - Placement: the link starts 12px after the figure box and stops 12px before the next one. It
    runs at about 39% of the figure's height above the floor, level with the symbol in her hand.
- **`SpamStepDown`** (phone, steps 1 and 2): `<span aria-hidden="true" data-anim="spam-chevron" class="absolute -bottom-6.5 left-5 text-cream-muted md:hidden"><ChevronUpIcon className="size-3 rotate-180" /></span>`.
  It is centred in the 40px gap, using the site's down-arrow pattern (`ChevronUpIcon` rotated, as
  in `ShownForTag` and `OrchestraLink`).

## The break-out, the floor cut and z-order

- **No `overflow-hidden` on anything that holds Eva.** On a phone the figure layer is the band's
  own box. Its `clip-path` inset is −50% at the top, which lets her head out by 60px of room
  against the 28px she uses. It is 0 at the right and bottom, and its bottom corners are rounded
  24 like the band's. So her waist cut stops exactly on the floor, and the right shoulder is
  trimmed by the band's corner. This is `ProofBanner`'s break-out-layer pattern.
- From `md` the clip opens sideways (−50%) so the link can reach into the next column. Its bottom
  inset stays 0: the floor.
- **Seat:** the figure box is bottom-anchored and square, and the file's bottom row is the waist
  cut, so the cut lands on the band's floor at every width. On a phone the overhang is 148 − the
  band's height. If copy makes the bands taller than 120 (`auto-rows-fr` keeps all three equal),
  the overhang shrinks by the same amount. Hence the sizing note under Content.
- **Paint order:** `SpamStage` comes first in the wrapper and the `<ol>` is `relative` after it,
  so steps paint over the band. In each `<li>` the order is ground, then figure layer, then text
  (`relative`). The text paints above the ground, and the link paints above the band. Text and
  Eva never overlap: on a phone the text stops at the figure box (`pr-37`), and from `md` the text
  is below the floor.
- **Clearance:** on a phone, Eva's hair is about 20px clear of the band above. The down arrow is at
  x 20–32 and Eva is at x 172–320, so they never meet. The first Eva's box stays inside the
  `<ol>`'s `pt-7`, 36px under the paragraph. From `md`, the box top is the `<ol>`'s top, with her
  hair 48px under the part above.
- **Nothing sideways at 360:** every element sits inside the 320 `<ol>`. The figure is `right-0`
  inside the band, the clip's right inset is 0, and the arrow is 20px in. From `md`, only steps 1
  and 2 have a link, and each ends inside the next column.

## Return line (`SpamReturn`; only the legs change)

- **Phone:** a dashed box `mt-3` under the last band, as built. The pill is over its line.
- **`md` up:** the dashed U as built, with its legs under figure 1's and figure 3's centres
  (offset + half the figure). Replace `md:ml-16 md:mr-[calc((100%-3.5rem)/3-4rem)]` with
  `md:ml-20 md:mr-[calc((100%-3.5rem)/3-5rem)] lg:ml-28 lg:mr-[calc((100%-3.5rem)/3-7rem)] xl:ml-39 xl:mr-[calc((100%-3.5rem)/3-9.75rem)]`
  (legs 80 / 112 / 156). The right margin is at least 137px at every width. Everything else is
  unchanged: the arrowhead `spam-return-head`, the `TEMPORARY` pill `{monoPill} bg-ink text-cream`
  (`spam-pill`) and the line `text-ink`.

## Sizes

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Content / column | 320 / n/a | 706 / 217 | 1328 / 424 | 1536 / 493 |
| Band | three, 320 × 120 (min), radius 24 | one, 706 × 116, top 28, radius 24 | 1328 × 200, top 48 | 1536 × 200, top 48 |
| Eva figure (square box) | 148, flush right | 144, 8 in from the column | 248, 32 in | 248, 32 in |
| Overhang: box above the band / hair seen | 28 (19%) / about 20 | 28 (19%) / about 21 | 48 (19%) / about 35 | 48 / about 35 |
| Text column | 152 on the band, 20 in, `text` / `muted` | 217 on cream, 20 under the floor | 320 (`max-w-xs`) | 320 |
| Step title / line | 20 / 15px | 22.6 / 15px | 26 / 15px | 26 / 15px |
| Gaps | 28 above band 1; bands 40 apart; arrow 12px, 14 under each floor | columns 28 | 28 | 28 |
| Link (hairline + chevron) | none | about 77, 56 above the floor | about 180, 97 above | about 249, 97 above |
| Return line | dashed box 320, 12 under | U 489 wide, legs 80 in | U 904, legs 156 in | U 1043, legs 156 in |
| Diagram total (estimate) | about 600 (bands 468 + 12 + box 119) | about 404 | about 456 | about 456 |

`lg` (1024, column 295): figure 192, 16 in; band 156 at top 36; overhang 36; link about 107; legs
112. `xl` starts at 1280 (column 374, link about 130). "Hair seen" is read off the files, where
the head starts about 5% down the box; screen check it. The phone diagram is about 60px taller
than the 96px-tile rows, so the Exile takeover at 360 is about 5,160px (estimate).

## States and accessibility

- **Not interactive:** no hover, no focus stop, no pointer cursor. The bands, figures, links and
  arrows are `aria-hidden`, and every image has `alt=""`. A screen reader hears an ordered list of
  three items (heading, then line) and then "Temporary" and its line. Each heading is heard once.
- **Contrast:** `text` on `ink` is above 16:1 and `muted` on `ink` about 6.9:1. The end glow
  reaches under the text column only near the floor, at under 5% violet. `ink` on `cream` is
  about 17:1 and `cream-muted` on `cream` about 4.6:1. Accent is used only in the glow, never for
  text or a line.
- **Tokens:**
  - colours `ink`, `text`, `muted`, `muted/50`, `cream`, `cream-muted`, and `accent` inside the
    glow expressions only;
  - fonts `font-display`, `font-body`, `font-mono`;
  - type `text-summary`, `text-body`, `text-meta`;
  - radii `rounded-3xl` (bands, the return line), `rounded-xl` (the card banner) and
    `rounded-full` (pill).
  - **No new token.**

## Images (through `SiteImage`)

| Name (`lib/images.ts`) | File (`public/images/exile/`) | Step | Shows |
|---|---|---|---|
| `exileEvaWatch` | `eva-watch.png` | `watch` | Eva holding an eye in a scan ring |
| `exileEvaSpot` | `eva-spot.png` | `spot` | Eva holding a chat bubble with an exclamation mark |
| `exileEvaStop` | `eva-stop.png` | `stop` | Eva holding a closed padlock |

- **Files:** 491 × 491 transparent PNGs. The bottom row is the waist cut. Use them as they are.
  They are mapped by `lib/spamDiagram.ts → spamStepImage`, which is unchanged.
- **Resolution:** the largest figure is 248 CSS px. At 1×, 491 is twice that. At 2× it needs 496,
  so 491 is 1% short: an invisible 1.01× stretch. The phone's 148 at 3× needs 444, so it passes.
  **Recommendation: the files are enough; keep them.** Re-export only if a larger original
  exists. A 744px file would cover 3×, which desktops rarely are.
- **`sizes`:** `(min-width: 1280px) 248px, (min-width: 1024px) 192px, (min-width: 768px) 144px, 148px`.
  `fit="contain"`, `position="bottom"`, not `priority`.
- **Decorative, `alt=""`:** the step's heading and line already say what she shows. Naming Eva
  would state something the facts file does not hold.

## Motion (later)

| Hook | Element | What moves, from where, trigger | Reduced motion |
|---|---|---|---|
| `spam-diagram` | the wrapper (the band fades with it) | the trigger: plays once as it enters the dialog's view | all of it fades in together |
| `spam-step` | each `<li>` (a phone band included) | steps light in order, 0.25s apart: number, title and line fade up 16px | fade only |
| `spam-tile` (name kept: now Eva's box) | `SpamStepFigure` | Eva rises from below the floor (`y` +40% → 0, soft overshoot), cut by the layer's floor clip, as the card bots rise | fade only |
| `spam-link`, `spam-chevron` | hairline (`origin-left`), its chevron; also the phone's down chevron | the hairline draws (`scaleX` 0 → 1), then the chevron fades in, before the next step | shown at once |
| `spam-return`, `spam-return-head`, `spam-pill` | as built | after step 3: from `md` the U wipes in right to left, then the head and pill pop; on a phone the box fades up | fade only |

## Content (`content/home.ts → proofs.projects.exile.showcase`)

There are no new words and no slot changes. `steps.{watch,spot,stop}.title` / `.line`,
`returnLabel` and `returnLine` are as in `07-proofs.md` §7.5. **Sizing notes:**

- The title should fit on one line beside its number in 152px at 360, about 14 characters at 20px.
- The line should be at most three lines in 152px, about 60 characters. A fourth line makes all
  three bands taller and Eva's break-out smaller.
- From `md`, the line takes two or three lines in 217px.

## Files (`web-coder`)

- **Add** (`components/home/proofs/`):
  - `InkStageGround.tsx` (the shared ink ground);
  - `SpamStage.tsx` (the band from `md`);
  - `SpamStepFigure.tsx` (Eva);
  - `SpamStepLink.tsx` (the band's arrow);
  - `SpamStepDown.tsx` (the phone's down arrow).
- **Change:**
  - `SpamDiagram.tsx`: the wrapper becomes `relative`, renders `SpamStage`, takes the `<ol>`
    classes above, and gets a new header comment;
  - `SpamStep.tsx`: the `<li>` becomes the band, plus the figure layer, the text colours and the
    arrows;
  - `SpamReturn.tsx`: the legs and the header comment;
  - `ProofBanner.tsx`: renders `InkStageGround`; its output is unchanged;
  - `lib/proofBotShades.ts`: adds `banner.glowEnd`;
  - `lib/spamDiagram.ts`: a comment only ("tile image" becomes "figure").
- **Delete:**
  - `SpamStepTile.tsx` (replaced);
  - `components/icons/EyeIcon.tsx`, `AlertIcon.tsx` and `LockIcon.tsx`, which have no importer
    (checked 2026-10-06).
- **Unchanged:** `lib/images.ts`, `SiteImage.tsx`, the six Exile files, `ChevronRightIcon`,
  `ChevronUpIcon`, `lib/styles.ts` (`metaLabel`, `condensed`, `monoPill`), `TakeoverShowcase.tsx`,
  `content/`, every hook.

## Review (the choices made here)

1. **Phone figure 148, overhang 28 (19%, desktop's ratio), bands 40 apart (C had 20).** The other
   option was 128 / 8 as drawn in C. That is barely a break-out: about 1px of hair, and the user
   asked for more.
2. **A right-anchored end glow (`banner.glowEnd`, a new shade expression from tokens, not a
   token).** The other option was to reuse the card's floor glow unchanged on the phone bands.
   That needs nothing new, but its centre sits at 62%, under the symbol and the text rather than
   under her.
3. **Fixed figure steps (144 / 192 / 248 at `md` / `lg` / `xl`).** The other option was a fluid
   figure, 58.5% of the column through a container-query `calc`, which would make the figure 289
   at 4K. Fixed steps are exact numbers and keep the drawn 248 at 1440 and 4K.
4. **One shared `InkStageGround`, which `ProofBanner` adopts.** The other option was to copy the
   ground's classes and style into the diagram: one fewer change to the card, but a fork
   (constitution §9).
5. **Eva rises from the floor in the motion pass,** matching the card bots. The other option was
   to keep the old pop (scale 0.8 → 1 from `origin-bottom`).
