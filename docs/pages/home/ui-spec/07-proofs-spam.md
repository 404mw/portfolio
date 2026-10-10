# §7 Proofs: the showcase diagram (part 6, wide slot; Exile with Eva, MARWIX-SKILLS with Rix): UI spec

Shared rules (§0): [`../ui-spec.md`](../ui-spec.md). The takeover and its parts: [`07-proofs.md`](07-proofs.md)
§7.3. Page doc: [`../sections/07-proofs.md`](../sections/07-proofs.md).

**Last Updated:** 2026-10-10 rev 2 (the `rix` kind only: Rix holds each prop, larger and lower, in
a hold placement used by this diagram alone; the band's top drops so more of him breaks out; `idle`
on all three steps). Before that 2026-10-10 (one showcase diagram for every project that has one;
MARWIX-SKILLS gets parts 4, 5 and 6, its diagram drawn with Rix; Exile's view unchanged), and
2026-10-06 (the ink stage, the user's pick of that day). The file name keeps "spam" so existing
links hold.

**Supersedes** `07-proofs.md` §7.3.2 (the diagram) and §7.6.1 (Eva's images). The bordered and ink
tiles are retired; the eye, alert and lock icons are not used. Static, not built.

## 2026-10-10 rev 2: Rix holds the prop (the `rix` kind only; static, not built)

**Screen check (built):** in the shared slot the three props read as small icons beside Rix, not
things he holds: tiny squares at the band's edge at 360, floating right of his hand at 1440. Next
to Eva's large held symbol the diagram looks sparse. **The user (2026-10-10), "do both":** make the
props bigger and lower, in his hand, for this diagram only (the block below, Review 2, third
option). **About, Process, the footer and `/rix` keep the shared slot and look exactly as now.**

**Replaces in the block below:** the Rix figure's markup, viewBox and Poses; the `rix` column of
"Layout per figure kind" and its bullets; the `rix` Sizes table; Review 2 and 5. The rest stands.
Exile is untouched.

### The hold (`ShowcaseRixFigure` only; `lib/rixProps.ts` unchanged)

- **Same shapes, a showcase-only placement.** `ProcessEmblem` is drawn inside a nested `<svg>`
  viewport that maps the three props' shared box (x 106–130, y 26–50) onto a 36-unit square:
  `<svg x="100" y="35" width="36" height="36" viewBox="106 26 24 24" class="overflow-visible">`
  → `<ProcessEmblem emblem={{ name: prop, parts: rixProps[prop].parts }} />` (as built). The
  numbers come from `lib/showcaseFigures.ts → rixShowcaseHold = { x: 100, y: 35, size: 36, viewBox: "106 26 24 24" }`.
- **Where:** x 100–136, y 35–71 (`prompt` 38–68); centre 118 53, on the arm's line (y 50–56).
  The arm shows from the body (x 94) to x 100 and its tip runs under the prop, so he grips it at
  the middle of its left edge. That is the rig's own way of holding (the flag's pole and the
  hammer's handle meet the arm the same way). 6 units clear of the body: the MW is never covered.
- **Scale 1.5** (24 → 36 units): 69px at 1440, the size of Eva's lock with its glow (about
  55–75px). Its centre is 39 units above the floor (46% of his height; Eva's symbol is at about 39%).
- **Static = final state:** no `transform` attribute and no inline `style` anywhere; the nesting is
  plain SVG geometry. Flat `botFills` only, 45° cuts stay 45°, no strokes to scale. Decorative: it
  sits inside the figure's `aria-hidden` SVG, so nothing new is announced.
- **`rixFigureViewBox = "-4 8 140 84"`** (was `-4 8 134 84`): left arm tip x −4, prop edge x 136,
  head y 8, right foot tip y 92. Aspect class `aspect-140/84`.
- **Box widths unchanged** (134 / 160 / 216 / 268): Rix draws 4% smaller (1 unit = 0.96 / 1.14 /
  1.54 / 1.91), and the phone slot, the link starts and the return loop stay as built.

### Pose: `idle` on all three

`look`, `prompt` and `image` all take `idle` (eyes at look 0, y 43–57). Look 7 aims up-right, which
now points above the lowered prop. At look 0 he faces the reader and holds each step out, as Eva
does in all three. The arms stay straight, as built.

### Break-out: yes, from `md`

- **The band's top moves to y 30** (was 22): the band is 62 of his 84 units. Above it: the M's two
  peaks and the valley between them, 22 units (25 / 34 / 42px; Eva's are 28 / 36 / 48).
- **Below it:** the eyes (13 units clear) and the prop (5 units clear: 6 / 8 / 10px), so the eye
  holes and the props' cream parts stay on ink (00-rix R1.1). The prop's top (y 35) is the limit;
  any lower and its cream frame would meet the cream above the band.
- **Phone: still inside the band.** With one-line titles each band is about 123 tall; a break-out
  needs 62 units = 123, which makes Rix about 255 wide. That does not fit beside any text column. The
  text column stays 152 (`pr-37`, shared, unchanged): the new short titles fit on one line.
- Accent on cream above the band is decorative and `aria-hidden`; the screen check confirms the
  peaks' edge reads, as the 14-unit break-out did.

### Classes (`lib/showcaseFigures.ts → showcaseFigureClasses.rix`)

| String | `rix` rev 2 | Was |
|---|---|---|
| Stage | `top-6.25 h-17.75 lg:top-8.5 lg:h-24 xl:top-10.5 xl:h-29.75` | `top-4 h-21 lg:top-6 lg:h-28 xl:top-7 xl:h-35` |
| Figure layer | `md:h-24 lg:h-32.5 xl:h-40.25` | `md:h-25 lg:h-34 xl:h-42` |
| Link | `md:bottom-9.75 md:left-45 lg:bottom-13.5 lg:left-61 xl:bottom-17.25 xl:left-78` | `md:bottom-14.5 …` (lefts unchanged) |

The layer is his box's height (the floor); the stage's top is the layer minus the band. The link's
centre is the prop's centre, 12px after his box to 12px before the next Rix, as before.

### Sizes (the `rix` kind, rev 2; estimates for the screen check)

| Element | Phone 360 | Tablet 768 | 1024 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|---|
| Content / column | 320 / n/a | 706 / 217 | 942 / 295 | 1328 / 424 | 1536 / 493 |
| Rix box (140:84) / 1 unit | 134 × 80 / 0.96, 8 from the band's right | 160 × 96 / 1.14, 8 in | 216 × 130 / 1.54, 16 in | 268 × 161 / 1.91, 32 in | as 1440 |
| Band | three, 320 × about 123 (min 120), radius 24, 40 apart | 706 × 71, 25 under the list's top | 942 × 96, at 34 | 1328 × 119, at 42 | 1536 × 119, at 42 |
| Above the band | none: head about 43 under the band's top | 25 | 34 | 42 | 42 |
| Prop (36 units) / clear of the band's top | 34 / inside | 41 / 6 | 56 / 8 | 69 / 10 | 69 / 10 |
| Prop centre above the floor | 37 | 45 | 60 | 75 | 75 |
| Link (hairline + chevron) | none: 12px down chevron on cream | 61 long | 83 | 160 | 229 |
| Text column | 152 on the band (6 clear of his arm) | 217 on cream | 295 | 320 (`max-w-xs`) | 320 |
| Return | dashed box 320, as built | loop 160 under Rix 3, as built | 216 | 268 | 268 |
| Diagram total | about 620 | about 345 | about 365 | about 375 | about 375 |

At 1023 the link is 139, at 1279 it is 162 (unchanged). **Nothing sideways:** the box widths are as
built (phone x 178–312 of 320; from `md` his box ends at 168 / 232 / 300 in a 217 / 295 / 374+
column), and the prop is the box's right edge.

### Motion (later), the change only

The flourishes keep their pivots in the prop's own units, because the nested viewport keeps them
valid: `palette` and `picture` 118 50, the `caret` 121.5 40. In the figure's viewBox these are
118 71 and 123.25 56. The motion pass checks which pair `svgOrigin` takes inside a nested `<svg>`
with the first flourish, before it builds the rest.

### Files (`web-coder`)

- `lib/showcaseFigures.ts`: the three `rix` strings above, `rixFigureViewBox = "-4 8 140 84"`, a new
  exported `rixShowcaseHold`, and the header comment (band 62 of 84 units, top at y 30; layer
  96 / 130 / 161; the link at the prop's centre).
- `components/home/proofs/ShowcaseRixFigure.tsx`: `aspect-134/84` becomes `aspect-140/84`; wrap
  `ProcessEmblem` in the nested `<svg>` from `rixShowcaseHold`; the header comment.
- `lib/showcaseDiagram.ts`: the three `marwixSkills` poses become `idle`; its comment.
- **Unchanged:** `lib/rixProps.ts`, `ProcessBot.tsx`, `ProcessEmblem.tsx`, `ShowcaseStep`,
  `ShowcaseStepLink`, `ShowcaseStage`, `ShowcaseReturn`, `content/`, every hook, Exile.

### Review (rev 2; the first option is the one specced)

1. **A nested `<svg>` viewport for the hold.** Or: `<g transform="translate(-59 -4) scale(1.5)">`
   (the same placement). That is one attribute, but it is a static transform, and the motion's
   pivots would have to move to 118 71 / 123.25 56.
2. **Scale 1.5 (36 units).** Or: 1.25 (30 units, 57px at 1440). It lets the band's top drop to
   y 33 (25 units out), but the prop stays nearer icon size.
3. **Gripped at the middle of its left edge, on the arm's line.** Or: resting on top of the hand
   (bottom at y 50). That reads as balanced, not held, and its top at y 14 would push the band's
   top to y 11, which means no break-out at all.
4. **Box widths kept; Rix 4% smaller.** Or: units kept (boxes 140 / 168 / 224 / 280). The loop, the
   link starts and the phone slot then change, and on a phone his arm would touch the text.
5. **`idle` on all three.** Or: `act` / `act` / `idle` as built, but look 7 now gazes over the prop.
6. **For the lead:** add a "Showcase hold (07-proofs-spam only)" row to 00-rix R1.2, under the
   prop slot (not edited here).

---

## 2026-10-10: MARWIX-SKILLS gets the rich parts; Rix takes Eva's place (static, not built)

*Rev 2 above replaces this block's Rix figure markup, viewBox and poses, its `rix` layout numbers,
its `rix` Sizes table and Review 2 and 5. Kept as the record.*

**The user (2026-10-10):** "id love to see it rich just like exile's entry. use rix in the place of
exiles mascot", where Eva's place is the three figures in the diagram. Facts: `docs/03-facts.md`,
MARWIX-SKILLS, "What building MARWIX-SKILLS took", "…taught the user" and "How the image skills
work, in order" (all 2026-10-10).

**This change's one question:** does MARWIX-SKILLS' takeover show how its image skills work as
plainly as Exile's shows its spam protection? It does with the same parts, the same diagram and
the site's own mascot doing each step.

### What MARWIX-SKILLS gets

- **Part 4, What it took:** four titled items, `TakeoverTook` as built (07-proofs.md §7.3.1).
- **Part 5, What I learned:** three numbered items, `TakeoverLearned` as built.
- **Part 6, Showcase:** headline, status pill, paragraph (`TakeoverShowcase` as built), then the
  diagram in the wide slot: 1 plans the look, 2 writes the prompt, 3 makes the image, and a return
  line (one edit fixes a wrong image).
- **Part 3 keeps no shots** (07-proofs.md §7.9). It now has all seven parts, like Exile. The
  takeover is about 5,000px at 360 (estimate). On a 4K window it now always scrolls, so §7.9's
  "may not scroll" note no longer applies.
- **No page-doc conflict.** The 2026-10-05 template makes parts 4–6 optional per project, shown
  when the facts carry them, and they now do. Eva's exception covers "the Exile Bot view only; the
  site's own mascot stays everywhere else", and Rix is the site's own mascot.

### One diagram, generalized (constitution §9: rename and extend, no fork)

The `Spam*` parts become `Showcase*`. Exile's rendered output is unchanged apart from the hook
names below and two new attributes. The diagram's motion is not built (nothing in `hooks/` or
`lib/` reads a `spam-*` hook, checked 2026-10-10), so renaming the hooks costs nothing.

| Was | Becomes | Job |
|---|---|---|
| `SpamDiagram.tsx` | `ShowcaseDiagram.tsx` | the wrapper, the stage, the list and the return line; prop `project` (and the words) |
| `SpamStage.tsx` | `ShowcaseStage.tsx` | the one band from `md`; prop `figure` (the kind) |
| `SpamStep.tsx` | `ShowcaseStep.tsx` | one step; it draws the figure its entry names |
| `SpamStepFigure.tsx` | `ShowcaseImageFigure.tsx` | the `image` kind (Eva), unchanged; prop `image` (an `ImageName`) |
| none | `ShowcaseRixFigure.tsx` (**new**) | the `rix` kind: Rix and one held prop |
| `SpamStepLink.tsx` | `ShowcaseStepLink.tsx` | the band's arrow; prop `figure` (its position follows the kind) |
| `SpamStepDown.tsx` | `ShowcaseStepDown.tsx` | the phone's down chevron, unchanged |
| `SpamReturn.tsx` | `ShowcaseReturn.tsx` | the way back; prop `to` (`first` or `last`) |
| `lib/spamDiagram.ts` | `lib/showcaseDiagram.ts` | each project's step keys in order, its figure kind, each step's figure, its return; `showcaseStepPointsOn` |
| none | `lib/showcaseFigures.ts` (**new**) | per figure kind: the stage, figure-layer and link class strings; `rixFigureViewBox` |
| `spam-diagram`, `spam-step`, `spam-tile`, `spam-link`, `spam-chevron`, `spam-return`, `spam-return-head`, `spam-pill` | `showcase-diagram`, `showcase-step`, `showcase-figure`, `showcase-link`, `showcase-chevron`, `showcase-return`, `showcase-return-head`, `showcase-pill` | `data-anim` hooks |

**`lib/showcaseDiagram.ts → showcaseDiagrams`** (data; words stay in `content/home.ts`):

| Project | Figure kind | Steps in order: key → figure | Return (`to`) |
|---|---|---|---|
| `exile` | `image` | `watch` → `exileEvaWatch`; `spot` → `exileEvaSpot`; `stop` → `exileEvaStop` | `first`: back to step 1 (as built) |
| `marwixSkills` | `rix` | `look` → prop `palette`, pose `act`; `prompt` → prop `prompt`, pose `act`; `image` → prop `picture`, pose `idle` | `last`: a loop on step 3 |

- **The figure kind belongs to the diagram, the figure to the step.** One stage cannot fit two
  kinds, so a diagram never mixes them.
- **Types (`lib/proofProject.ts`):** `ProofShowcase` takes its step keys as a type parameter
  (`steps: Record<K, ProofTitledLine>`), and each project's `showcase` is typed with its own
  diagram's keys. A project's steps must have exactly its diagram's keys, and a project with no
  diagram entry (Design Vault) cannot carry a `showcase` (both fail the type check).
- **`ProjectTakeover`** passes `project={projectKey}` and the words to `ShowcaseDiagram`. Part 6
  renders only with a `showcase` block, as built.
- **Markup additions:** `data-figure={kind}` on the `showcase-diagram` wrapper, and
  `data-return={to}` on `showcase-return`. `data-step={key}` stays on each step.

### The Rix figure (`ShowcaseRixFigure`, server, decorative)

- **Markup:** `<span data-anim="showcase-figure" class="absolute right-2 bottom-0 block w-33.5 md:right-auto md:left-2 md:w-40 lg:left-4 lg:w-54 xl:left-8 xl:w-67">`
  → `<ProcessBot role="host" pose={pose} viewBox={rixFigureViewBox} className="block aspect-[134/84] h-auto w-full">`
  → child `<ProcessEmblem emblem={{ name: prop, parts: rixProps[prop].parts }} />`.
- **`ProcessBot` gains one optional prop, `viewBox`** (default `-30 -18 170 110`, unchanged for
  every other use). The figure uses `rixFigureViewBox = "-4 8 134 84"`, Rix's drawn bounds with a
  prop in the slot: left arm tip x −4, prop edge x 130, head y 8, right foot tip y 92. So the box
  is exactly Rix, and its bottom edge is his feet. The units, hooks and pivots are unchanged. The
  SVG keeps `overflow-visible`. Here 1 unit = the box width ÷ 134.
- **The held prop reuses `ProcessEmblem`** (`components/home/process/`), the "prop held in the
  slot, visible at rest" part Process step 1 already uses: `data-bot="prop"`, `data-prop={name}`,
  flat `botFills`. Only its header comment widens. `RixProps` is not used: it is About's
  pick-driven set, every prop hidden.
- **Not drawn:** `RixButton`, quip, emotes, status, walker. **Not interactive:** no button and no
  focus stop. Hidden from assistive tech: the figure layer and the SVG are both `aria-hidden`.
- **Static = final state:** no `transform` and no inline `style` on any hook. The `host` rig's zzz
  group renders hidden (`opacity-0`), as on About.
- **Poses (one per step):**
  - `look` and `prompt`: `act`, eyes at look 7, up-right at the prop. He is at work on it.
  - `image`: `idle`, eyes at look 0, facing the reader. He shows the result.
  - The arms stay straight, as built (the static pose).
- **On the ink stage:** his eye holes stay `fill-bg`. `ink` and `bg` are near the same black, and
  the floor glow fades out below eye height at every width (checked against `banner.glow` and
  `glowEnd`), so the holes still read as holes. **This meets the reason for 00-rix R1.1** ("he
  stands only on `bg`"), but not its letter. See Review 9.
- **`data-anim="process-bot"` stays on the SVG.** `useProcessBots` looks for it only inside the
  Process section's root, and `rixRig` and `footerRixParts` only inside their own button and link,
  so none of them picks up these figures. Re-check this when the motion pass is built.

**Three new props in `lib/rixProps.ts`** (the shared slot x 106–130; all three top out at y 26 or
lower, so the band's top edge clears them; flat token fills, 45° cuts). `RixPropName` gains
`palette`, `prompt` and `picture`, held by no About card. `RixPropPartHook` gains `caret`.

| Name | Step | Parts, in paint order (`d`, colour key) | Pivots |
|---|---|---|---|
| `palette` | `look` | slab `M110 26H126L130 30V46L126 50H110L106 46V30Z` C; swatches `M111 31h6v6h-6Z` B, `M119 31h6v6h-6Z` M, `M111 39h6v6h-6Z` D, `M119 39h6v6h-6Z` I | whole, 118 50 |
| `prompt` | `prompt` | field `M106 28H130V48H106Z` C; typed lines `M109 32h15v3h-15Z` I, `M109 38h9v3h-9Z` I; caret `M120 37h3v6h-3Z` B, hook `caret` | caret, 121.5 40 |
| `picture` | `image` | frame `M106 26H130V50H106Z` C; canvas `M109 29H127V47H109Z` I; hills `M109 47L117 39L121 43L124 40L127 43V47Z` M; sun `M120 32h4v4h-4Z` B | whole, 118 50 |

The three are told apart by shape: four swatches on a cut slab, a text field with a caret, a
framed scene. None reuses `bubble` (the Discord card's emblem), `report`, or the job sheet, which
read as a message or a document. Each prop's centre is y 38, the link's height.

### Layout per figure kind (`lib/showcaseFigures.ts`; the shared classes are as built)

The `<ol>`, the `<li>`, the text block, the phone ground and the phone chevrons are shared and
unchanged (2026-10-06 spec below). Only these strings differ by kind:

| String | Shared part | `image` (Eva, as built) | `rix` |
|---|---|---|---|
| Stage (`ShowcaseStage`) | `inset-x-0 hidden rounded-3xl md:block` | `top-7 h-29 lg:top-9 lg:h-39 xl:top-12 xl:h-50` | `top-4 h-21 lg:top-6 lg:h-28 xl:top-7 xl:h-35` |
| Figure layer | `pointer-events-none absolute inset-0 [clip-path:inset(-50%_0_0_0_round_0_0_1.5rem_1.5rem)] md:relative md:inset-auto md:[clip-path:inset(-50%_-50%_0_-50%)]` | `md:h-36 lg:h-48 xl:h-62` | `md:h-25 lg:h-34 xl:h-42` |
| Link (`ShowcaseStepLink`) | `absolute hidden h-3 items-center text-muted md:flex md:-right-6 lg:-right-8 xl:-right-12` | `md:bottom-12.5 md:left-41 lg:bottom-17.25 lg:left-55 xl:bottom-22.75 xl:left-73` | `md:bottom-14.5 md:left-45 lg:bottom-20.25 lg:left-61 xl:bottom-25.5 xl:left-78` |

- **From `md`, Rix is sized by the column, not by Eva's height.** He is wider than he is tall
  (1.6:1). At Eva's heights he would be 230 / 306 / 395 wide, more than the 217 / 295 / 374
  columns. So his band is set from him instead:
  - the band is 70 of his 84 units tall (top edge at y 22), so the M's two peaks break out above it
    (14 units: 16 / 23 / 28px);
  - his eyes and the prop stay on ink, the prop 5–8px under the edge;
  - the layer height is his height, the stage's top is the layer height minus the band, and his
    feet are on the floor.
- **The link** starts 12px after his prop and ends 12px before the next Rix, at the prop's centre
  (54 units above the floor).
- **Phone: Rix stands inside his band, with no break-out.** The text column keeps its 152px (pr-37),
  so he has a 148px slot. At 134 wide he is 84 tall in a band of 120–146, his head about 60 under
  its top. That is a geometry limit, not a choice made lightly: Review 3.
- He sits 8px from the band's right edge, 6px clear of the text column. His feet are clear of the
  24px bottom corners, and the end glow is under his right side.

### Return line (`ShowcaseReturn`, prop `to`)

The words for MARWIX-SKILLS say the fix is one edit **instead of starting over**. A U back to
step 1 would draw "starting over", so this diagram's way back is a loop on step 3.

- **One markup for both:** `div data-anim="showcase-return" data-return={to}` →
  `span` (the loop) → [arrowhead `span data-anim="showcase-return-head"`, pill
  `strong data-anim="showcase-pill"`]; then the line `p`. Pill, arrowhead and line keep their
  built classes.
- **`first` (Exile):** the outer `div` keeps its built classes, U included. The loop `span` is
  `contents`, so the output is as built.
- **`last` (MARWIX-SKILLS):**
  - The outer `div` is the built phone box (`relative mt-3 flex flex-wrap items-center gap-x-4 gap-y-2.5 rounded-3xl border-2 border-dashed border-ink px-5 py-4`),
    plus `md:mt-7 md:grid md:grid-cols-3 md:items-center md:gap-x-7 md:rounded-none md:border-0 md:p-0`.
  - The loop `span`: `contents md:relative md:col-start-3 md:row-start-1 md:ml-2 md:flex md:w-40 md:justify-center md:rounded-b-3xl md:border-2 md:border-t-0 md:border-dashed md:border-ink md:px-3 md:pt-7.5 md:pb-5 lg:ml-4 lg:w-54 xl:ml-8 xl:w-67`.
    That is an open-topped dashed U exactly under Rix 3, the pill inside, and the arrowhead on its
    left leg pointing back up into step 3.
  - The line adds `md:col-span-2 md:col-start-1 md:row-start-1 md:max-w-md md:justify-self-end md:text-right`:
    it sits beside the loop, under steps 1–2, ending at the gap.
- **Phone, both:** the dashed box under the last band, as built. On a phone it is under step 3,
  so it reads as step 3's.
- **Reading order:** the pill, then the line, in both. From `md` in `last` the line shows left of
  the pill; the label is heard first, which still makes sense.

### Sizes (the `rix` kind; phone first; estimates for the screen check)

| Element | Phone 360 | Tablet 768 | 1024 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|---|
| Content / column | 320 / n/a | 706 / 217 | 942 / 295 | 1328 / 424 | 1536 / 493 |
| Band | three, 320 × about 146 (min 120; two-line titles), radius 24, 40 apart | one, 706 × 84, 16 under the list's top | 942 × 112, at 24 | 1328 × 140, at 28 | 1536 × 140, at 28 |
| Rix box (134:84) / 1 unit | 134 × 84 / 1.0, 8 from the band's right | 160 × 100 / 1.19, 8 in | 216 × 135 / 1.61, 16 in | 268 × 168 / 2.0, 32 in | 268 × 168 / 2.0, 32 in |
| Above the band (the peaks) | none: head about 60 under the band's top | 16 | 23 | 28 | 28 |
| Prop (24 units) / clear of the band's top | 24 / inside | 29 / 5 | 39 / 6 | 48 / 8 | 48 / 8 |
| Link (hairline + chevron) | none: 12px down chevron on cream | 61 long, 64 above the floor | 83, 87 above | 160, 108 above | 229, 108 above |
| Text column | 152 on the band, `text` / `muted` | 217 on cream, 20 under the floor | 295 | 320 (`max-w-xs`) | 320 |
| Step title (`text-summary`) / line (`text-body`) | 20 / 15px | 22.6 / 15 | 24.3 / 15 | 26 / 15 | 26 / 15 |
| Return | dashed box 320, 12 under the bands | loop 160 × 78 under Rix 3; line beside it in 448 | loop 216; line in 448 of 618 | loop 268; line in 448 of 876 | loop 268; line in 448 of 1014 |
| Diagram total | about 690 | about 350 | about 370 | about 380 | about 380 |

At 1023 the column is 295 and the link 139. At 1279 the column is 374 and the link 162. Exile's
sizes are unchanged (2026-10-06 Sizes, below).

**Nothing sideways:**
- On a phone Rix is inside his band (x 178–312 of 320).
- From `md` his box ends at 168 / 232 / 300 in a 217 / 295 / 374+ column, and the loop matches it.
- Links run only from steps 1 and 2, each ending inside the next column.

### States, accessibility, tokens

- **Not interactive:** no hover, focus stop or pointer cursor. A screen reader hears an ordered
  list of three (heading, then line), then the pill and its line, as for Exile.
- **Contrast:** step text as built: `text` on `ink` 16:1+, `muted` on `ink` about 6.9:1, `ink` and
  `cream-muted` on `cream` 17:1 and 4.6:1. Rix and the props carry no text.
- **Tokens:**
  - colours `ink`, `text`, `muted`, `muted/50`, `cream`, `cream-muted`, and `accent` in the glows;
  - Rix's fills through `botFills` only: `fill-accent` (body, swatch, caret, sun), `fill-cream`,
    `fill-muted`, `fill-cream-muted`, `fill-ink`, `fill-bg` (eye holes);
  - fonts `font-display`, `font-body`, `font-mono`; type `text-summary`, `text-body`, `text-meta`;
  - radii `rounded-3xl`, `rounded-b-3xl` (the loop), `rounded-full`.
  - **No new token.**

### Content (`content/home.ts → proofs.projects.marwixSkills`; `copywriter`)

The same keys as Exile's, with its own step keys. Words come only from the facts named above.
**Claude Code is the only tool name allowed** (constitution §7.4). No image model, vendor or
format names, no amounts (the cost is said in words), and no numbers. No length limits; the notes
say what the layout was drawn to hold.

| Key | Meaning | Sizing note |
|---|---|---|
| `whatItTook.headline` | Part 4's heading: what building it took, in one line | as `problem.headline` (07-proofs.md §7.5) |
| `whatItTook.items[]` `{title, line}` | Four, in the facts' order: a library of looks; a prompt for each image model; asks before it spends; tested before each release | title one line in 280 at 1024; line two lines |
| `whatILearned.headline` | Part 5's heading: what building it taught, said as what a client gets | as `problem.headline` |
| `whatILearned.items[]` `{title, line}` | Three, in the facts' order, each said as how the user works now: whatever you don't decide, the model decides (the user's words); image models compose by pattern, not physics, so the look skill sets real sizes, camera and light; a skill that stops to ask is working | title about 16 Acosta characters a line at 360 beside its ordinal, 23 from 1024 |
| `showcase.headline` | Part 6's heading: names the showcase, the image skills at work, in one line | as `problem.headline` |
| `showcase.status` | The showcase's state in a few words, from the facts (such as free and open source, or in the user's own work). No number | one line at 360 |
| `showcase.body` | What the diagram shows: the three image skills working in order inside Claude Code | as `problem.body` |
| `showcase.steps.look` `{title, line}` | Step 1: plans the look with you and reads it back in plain lines | title: one or two lines, about 8 Acosta characters a line in 152 at 360 and 10 in 217 at 768. Line: three lines in 152 at 360 is about 60 characters; a fourth line makes all three bands taller |
| `showcase.steps.prompt` `{title, line}` | Step 2: writes the prompt for the image model chosen | as `look` |
| `showcase.steps.image` `{title, line}` | Step 3: makes the image and converts it for the web | as `look` |
| `showcase.returnLabel` | The loop's pill: one or two words for "one edit" | fits the 160px loop at 768: about 13 characters |
| `showcase.returnLine` | When an image comes out wrong, it fixes it with one edit instead of starting over | two lines beside the loop (448) from 768; three or four in the phone box |

Exile's keys are unchanged (`steps.{watch,spot,stop}`). The figures have no slot: they are
decorative.

### Motion (later)

| Hook | Element | What moves, from where, trigger | Reduced motion |
|---|---|---|---|
| `showcase-diagram` | the wrapper (the band fades with it) | the trigger: plays once as it enters the dialog's view | all of it fades in together |
| `showcase-step` | each `<li>` | steps light in order, 0.25s apart: number, title and line fade up 16px | fade only |
| `showcase-figure` | Eva's box, or Rix's box | the figure rises from below the floor (`y` +40% → 0, soft overshoot), cut by the floor clip; for Rix his prop's flourish then plays once: `palette` tilts −8° and back about 118 50; `prompt`'s `caret` (`data-prop-part`) blinks twice; `picture` pops 0.9 → 1 about 118 50 | fade only, no blink |
| `showcase-link`, `showcase-chevron` | the hairline, its chevron; the phone's down chevron | the hairline draws (`scaleX` 0 → 1), then the chevron fades in, before the next step | shown at once |
| `showcase-return`, `showcase-return-head`, `showcase-pill` | the return | after step 3. `first`: the U wipes in right to left. `last`: the loop draws from its right leg round to the arrowhead (`clip-path` inset). Then the head and pill pop. Phone: the box fades up | fade only |

The pass writes only on `showcase-figure` and Rix's `prop` (and its `caret`), never on his other
`data-bot` hooks. There is no idle loop in a takeover.

### Files (`web-coder`)

- **Rename (keep Exile's output):** the nine files in the table above, plus their imports in
  `ProjectTakeover.tsx` and `lib/proofProject.ts`, and the hook names.
- **Add:** `components/home/proofs/ShowcaseRixFigure.tsx`, `lib/showcaseFigures.ts`.
- **Change:**
  - `ProcessBot.tsx`: the optional `viewBox` prop;
  - `ProcessEmblem.tsx`: the header comment only;
  - `lib/rixProps.ts`: three props, the `caret` hook, the type comment;
  - `lib/proofProject.ts`: the step keys as a type parameter, tied to `showcaseDiagrams`;
  - `ShowcaseDiagram`, `ShowcaseStage`, `ShowcaseStep`, `ShowcaseStepLink`, `ShowcaseReturn`: as
    specified above.
- **Copy (`copywriter`):** `marwixSkills.whatItTook`, `.whatILearned`, `.showcase` (Content).
- **Unchanged:** `TakeoverPart`, `TakeoverTook`, `TakeoverLearned`, `TakeoverItem`,
  `TakeoverShowcase`, `InkStageGround`, `lib/proofBotShades.ts`, `SiteImage`, `lib/images.ts`, the
  Eva files, every hook.
- **Still waiting on the user to delete:** `SpamStepTile.tsx` and the three icons.

### Review (the choices made here; the first option is the one specced)

1. **Rename to `Showcase*`, step keys and figures per project in one lib file.** Or: keep the
   `Spam*` names with a `project` prop. That means fewer renames, but the names would be wrong for
   MARWIX-SKILLS.
2. **Rix is sized by the column (134 / 160 / 216 / 268 wide), and the band is shortened to his
   size, so his two peaks break out (16 / 23 / 28).** Or:
   - Eva's bands with Rix inside them, no break-out (the stage stays one size for both projects);
   - or a new, lower prop slot for this diagram only, which allows Eva's 28 / 36 / 48 break-out but
     moves the props off the slot About, Process and the playground share.
3. **Phone: Rix inside his band, no break-out.** At 1.6:1, breaking out of a 120px band needs him
   218 wide, which leaves the text about 70px. Or:
   - a 100px text column (about 5 Acosta characters a line);
   - or the text under each band on cream, which adds about 250px at 360.
4. **Three new props, no reuse.** Or: `bubble` for the prompt, which needs one fewer prop but
   echoes the Discord card's emblem.
5. **Poses `act`, `act`, `idle`.** Or: `act` on all three (he looks at every prop).
6. **The return is a loop on step 3 (`to: "last"`).** Or: Exile's U back to step 1, unchanged,
   which needs no variant, but its drawing says "starting over" beside words that say the
   opposite.
7. **`ProcessBot` gets a `viewBox` prop, set to Rix's drawn bounds.** Or: the full viewBox placed
   with negative offsets per breakpoint (no change to `ProcessBot`, four arbitrary offsets).
8. **The held prop reuses `ProcessEmblem`.** Or: a new `ShowcaseRixProp.tsx` (an exact copy of
   it: a fork).
9. **Rix on `ink`, eye holes `fill-bg`.** 00-rix R1.1 says he stands only on `bg`. Its reason is
   the holes, which still read as holes on `ink`. **For the lead:** add "or the ink stage" to R1.1
   in `00-rix.md` (not edited here).

---

## The 2026-10-06 spec: the `image` kind (Exile, Eva)

Kept as written. Its names are the ones before the rename (the table above maps them). Its content
sizing notes predate the Acosta font: the 2026-10-10 Content notes above use Acosta widths.

### The user's decisions (2026-10-06)

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

### Layout

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

### Classes (tokens only)

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

### The break-out, the floor cut and z-order

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

### Return line (`SpamReturn`; only the legs change)

- **Phone:** a dashed box `mt-3` under the last band, as built. The pill is over its line.
- **`md` up:** the dashed U as built, with its legs under figure 1's and figure 3's centres
  (offset + half the figure). Replace `md:ml-16 md:mr-[calc((100%-3.5rem)/3-4rem)]` with
  `md:ml-20 md:mr-[calc((100%-3.5rem)/3-5rem)] lg:ml-28 lg:mr-[calc((100%-3.5rem)/3-7rem)] xl:ml-39 xl:mr-[calc((100%-3.5rem)/3-9.75rem)]`
  (legs 80 / 112 / 156). The right margin is at least 137px at every width. Everything else is
  unchanged: the arrowhead `spam-return-head`, the `TEMPORARY` pill `{monoPill} bg-ink text-cream`
  (`spam-pill`) and the line `text-ink`.

### Sizes

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

### States and accessibility

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

### Images (through `SiteImage`)

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

### Motion (later)

| Hook | Element | What moves, from where, trigger | Reduced motion |
|---|---|---|---|
| `spam-diagram` | the wrapper (the band fades with it) | the trigger: plays once as it enters the dialog's view | all of it fades in together |
| `spam-step` | each `<li>` (a phone band included) | steps light in order, 0.25s apart: number, title and line fade up 16px | fade only |
| `spam-tile` (name kept: now Eva's box) | `SpamStepFigure` | Eva rises from below the floor (`y` +40% → 0, soft overshoot), cut by the layer's floor clip, as the card bots rise | fade only |
| `spam-link`, `spam-chevron` | hairline (`origin-left`), its chevron; also the phone's down chevron | the hairline draws (`scaleX` 0 → 1), then the chevron fades in, before the next step | shown at once |
| `spam-return`, `spam-return-head`, `spam-pill` | as built | after step 3: from `md` the U wipes in right to left, then the head and pill pop; on a phone the box fades up | fade only |

### Content (`content/home.ts → proofs.projects.exile.showcase`)

There are no new words and no slot changes. `steps.{watch,spot,stop}.title` / `.line`,
`returnLabel` and `returnLine` are as in `07-proofs.md` §7.5. **Sizing notes:**

- The title should fit on one line beside its number in 152px at 360, about 14 characters at 20px.
- The line should be at most three lines in 152px, about 60 characters. A fourth line makes all
  three bands taller and Eva's break-out smaller.
- From `md`, the line takes two or three lines in 217px.

### Files (`web-coder`)

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

### Review (the choices made here)

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
