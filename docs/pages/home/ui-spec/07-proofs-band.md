# §7 Proofs: the takeover's title band, and the banner's part in open, close and Next: UI spec

Shared rules (§0): [`../ui-spec.md`](../ui-spec.md). The takeover: [`07-proofs.md`](07-proofs.md)
§7.3 and §7.7. The ink stage: [`07-proofs-spam.md`](07-proofs-spam.md). Page doc:
[`../sections/07-proofs.md`](../sections/07-proofs.md).

**Last Updated:** 2026-10-07 (new; static and motion, nothing built).

**Changes** `07-proofs.md` §7.3 in three places only: the column's classes, the `<h2>`'s classes
and one new first child. Everything else there stands.

**The one question** is the section's: have they built something real that people use? The band
is decoration (`aria-hidden`); it adds no words and no claim.

## The user's decisions (2026-10-07; not reopened)

1. **The band stays.** Every takeover has an ink band behind its title: on a direct load, after
   Next, without JavaScript and under reduced motion. The title sits on ink in a light token.
2. **It is the card's banner, grown wider and thinner:** the content column's width, rounded, the
   same hatch and violet floor glow, drawn by the shared `InkStageGround`, never a fork.
3. **Next:** the new project's band rises with its content. The Next title morph is kept; the
   title's colour changes as it lands.

## A. Static

Superseded 2026-10-08 by `07-proofs-sticky-band.md`.

```
div {container} relative grid grid-cols-1 gap-10 pt-gutter md:gap-14 lg:gap-18      the column
├ TakeoverBand → InkStageGround  data-anim="takeover-band"   NEW, first child; absolute, row 1's grid area
├ h2  data-anim="takeover-title"                             second child, in row 1; its margins are the band's padding
├ TakeoverIntro  data-part="intro"                           row 2, unchanged (keeps its hairline and top padding)
└ … parts, TakeoverMeans, TakeoverNextLink                   unchanged
```

- **The band is a sibling before the `<h2>`, not a wrapper.** Both stay direct children of the
  column, so `title.parentElement` is still the column and `bodyPartsOf` still finds every part.
- **Column:** `flex flex-col` becomes `relative grid grid-cols-1`; the gaps stay; `pt-10 md:pt-16 lg:pt-22`
  becomes `pt-gutter`. A grid, because an absolutely positioned child of a grid takes its grid
  area as its box: the band is exactly row 1, which is the title plus the title's margins, at one
  line or two, with no script. Parts lay out as before (one `minmax(0,1fr)` track, stretched).
- **Band (`TakeoverBand`, server):**
  `<InkStageGround glow="floor" anim="takeover-band" className="pointer-events-none inset-0 col-start-1 col-end-2 row-start-1 row-end-2 rounded-3xl" />`.
  Both end lines are needed: for an absolute child `auto` means the column's padding edge.
  `glow="floor"`, because it is the card's own glow and is sized in percent, so it stretches with
  the box and matches the banner pixel for pixel at the card end; `"end"` is rem-sized and would not.
- **Title:** `<h2 class="relative mx-5 mt-5 mb-4 font-display text-takeover leading-[0.88] font-semibold tracking-[-0.045em] text-text md:mx-8 md:mt-7 md:mb-6 lg:mx-12 lg:mt-10 lg:mb-8 {condensed}">`.
  - `text-text` replaces `text-ink` (the token for headings on dark; the closing panel's line
    uses it too).
  - **Margins, not padding.** The morphs measure the `<h2>`'s own box (its line count from its
    height, the Next morph from its corner). Margins leave that box as the text's lines, so
    `lib/takeoverTitleMorph.ts` needs no change. The top margin is larger than the bottom because
    the 0.88 leading leaves more room under the baseline than over the capitals.
  - `relative`, so it paints over the band (a positioned box earlier in the markup).
- **Under the bar, above part 1.** `TakeoverTopBar` is unchanged. The band sits one gutter under
  the bar, so cream frames it evenly on the top and sides, as the card frames its banner. The
  title's resting spot moves at most 8px from today's. When the dialog scrolls, the band passes
  under the bar (`z-10`). Below the band: the column gap, then part 1's hairline, the same order
  as the closing panel and Next.

### Sizes

Banner sizes are with two projects shown, as now.

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Column (`pt-gutter`): bar to band | 20 | 31 | 56 | 56 |
| Band width (the column) | 320 | 706 | 1328 | 1536 |
| Band height, one line | 85 | 132 | 202 | 220 |
| Band height, two lines | 135 | n/a | n/a | n/a |
| Band radius (`rounded-3xl`) | 24 | 24 | 24 | 24 |
| Title (`text-takeover`, `text-text`) | 56px, line 49 | 91px, line 80 | 148px, line 130 | 168px, line 148 |
| Title margins: sides / top / bottom | 20 / 20 / 16 | 32 / 28 / 24 | 48 / 40 / 32 | 48 / 40 / 32 |
| Title measure (was the full column) | 280 | 642 | 1232 | 1440 |
| Title top, under the bar (today) | 40 (40) | 59 (64) | 96 (88) | 96 (88) |
| Card banner, for comparison | 300 × 136 | 309 × 141 | 620 × 282 | 724 × 329 |
| Band against the banner: width / height | 1.07× / 0.63× | 2.3× / 0.94× | 2.1× / 0.72× | 2.1× / 0.67× |
| Shape (banner is 2.2:1) | 3.8:1 | 5.4:1 | 6.6:1 | 7:1 |
| Band to part 1's hairline (column gap) | 40 | 56 | 72 | 72 |
| Top bar | unchanged, about 69 tall | about 81 | about 81 | about 81 |

- **"Thinner" is the title's line plus its margins,** the least it can be. It is shorter than the
  banner at every width with one line. Two lines at 360 (135) match the banner's 136. At 1024:
  171 against a 427 × 194 banner. If three cards are shown again, the banner at 1440 is 391 × 178
  and the band is the taller of the two; the shape still reads thinner.
- **Glow:** rises from the floor over about the lower 40% of the band, strongest right of
  centre. **Hatch:** 1px lines every 13px at 135°, as on the card.
- **Not interactive:** no hover, focus stop or pointer cursor. `aria-hidden`; the `<h2>` and the
  dialog's `aria-labelledby` are unchanged.
- **Contrast:** `text` on `ink` is above 16:1, and about 9:1 over the glow's strongest point
  (estimate). **Nothing sideways:** the band is the column's own cell at every width.
- **Tokens:** `ink`, `text`, `cream`; `accent` and `text` only inside the existing
  `proofBotShades.banner.glow` and `.hatch`; `font-display`, `text-takeover`, `rounded-3xl`,
  `--spacing-gutter`, `--container-site`. **No new token and no new shade.**
- **Content:** no new slot. `proofs.projects.*.title` sizing note: one line in 280px at 360.
  **Images:** none.

## B. Motion (later): open from a card

Full motion, 0.75s, `power4.inOut`, started on the same tick as the clip and the title morph.

- **What moves:** the band starts exactly over the card banner's ground (`[data-anim="proof-banner"]`
  inside the source card, its full rect and its own radius, 12) and ends on its resting rect
  (radius 24). The banner is empty at frame one (the bot has ducked).
- **Technique: plain numbers, no scale.** One tweened object `{ x, y, width, height, radius }`,
  written each frame as `transform: translate`, `width`, `height` and `border-radius`. A scale
  would stretch the hatch and squash the corners. An inset clip of an oversized layer keeps the
  hatch true but pins the glow to the layer, and the banner's rect lies outside the resting rect.
  It holds 60fps because the band is one childless, out-of-flow box: a size change lays out that
  box alone and repaints two gradients, while the dialog already repaints every frame for its
  clip and the title for its optical size. Position is a transform.
- **Inside the clip at every frame (the rule):** the banner's rect is inside the card's rect and
  the resting rect is inside the full box. Every edge of the band and of the clip moves linearly
  in the same eased progress, so holding at both ends holds throughout. Where the clip is cut to
  the screen, the part of the band outside it is off screen too. A fit check reads both ends
  before the tween (1px slack, as `morphFits`).
- **Band and title morph together, or neither does.** If either fit check fails, or there is no
  card title on screen, the open is the built plain one: the content fades and rises whole, the
  band inside it.
- **Order:** in flight the band takes `zIndex 1`, as the title does; it comes first in the
  markup, so the title paints over it and both travel over the rising parts. It is opaque
  throughout. `bodyPartsOf` skips `takeover-band`: it never rises or fades with the parts.
- **The bar:** held at opacity 0 until the title's glyphs and the band's top edge are both below
  it (the later of the two; never before 0.35s), then it fades in over 0.3s as built.
- **Title colour (the rule):** each glyph pixel is `text` where it lies over the band and `ink`
  where it lies over cream. The title's sides stay inside the band's sides at both ends, so the
  boundary is the band's top and bottom edges in the `<h2>`'s own coordinates:
  `A = (bandTop − titleTop) / scale`, `B = (bandBottom − titleTop) / scale`, from the tweened
  numbers, with no layout read in a frame.
  - While A or B lies inside the title's line box (grown by the 0.15em overhang), the `<h2>`
    takes inline `color: transparent`, `background-clip: text` and
    `linear-gradient(to bottom, ink 0 A, text A B, ink B)` from `var(--color-ink)` and
    `var(--color-text)`. Otherwise it has a plain colour: `ink` outside, its own class inside.
  - On open the title starts below the banner in `ink`, the card title's colour. The band's
    floor passes down through it about 0.32–0.43s in at 1440 (estimate), and it lands in `text`.
  - The colour depends on where the two are, not on time, so a flight cut off and reversed needs
    no colour state.
- **Markup it needs:** the two hooks (`takeover-band`, `proof-banner`). No restructuring.

## C. Motion (later): close

Superseded 2026-10-08 by `07-proofs-sticky-band.md`.

The open reversed on the close's clock (0.6s, `power4.inOut`).

- The band travels from where it stands (its resting rect as scrolled, or its numbers mid-open)
  onto the card banner's rect and radius. The dialog's dissolve over the last 0.15s then shows
  the real banner in exactly its place.
- The bar and the parts fade out first (0.2s, as built). The band is not one of them and stays opaque.
- The title's colour follows the same rule, back to `ink` as it leaves the band.
- **Fallbacks, as the title morph's:** card off screen: the dialog fades, no band morph. Dialog
  scrolled so the title is off screen: the plain clip, no morph, the band stays in its content.
  A close mid-open reads the band's numbers before `reset` and starts from them. A plain open cut
  off mid-rise has no morph back.

## D. Motion (later): Next

The slide writes nothing on the band: it rises with its content (`y: H → 0`). The title morph is
as built. The title starts in `ink` over the old Next title; the band rises faster than the title
and its top edge passes up through it (about 0.40–0.58s in, estimate), by the rule in B; it lands
in `text`. A crossfade (different line counts) fades the title in already in `ink`. With no Next
morph, the title rises on its band in `text`. A new hash mid-slide clears it all.

## E. Reduced motion, direct load, no JavaScript

Nothing moves. The band is there, the title is `text` on it, and the content fades as now (open
and Next); close is instant. A direct load and the no-JS `:target` view show the resting state.

**Cleanup:** `reset` clears what B–D write: the band's `transform`, `width`, `height`,
`borderRadius`, `zIndex`, `willChange`; the title's `color`, `backgroundImage`, `backgroundClip`.

## Files

- **New:** `components/home/proofs/TakeoverBand.tsx` (the title's ink band);
  `lib/takeoverBand.ts` (the band's rects as plain numbers: banner rect, resting rect, fit check,
  the progress at which it clears the bar); `lib/takeoverTitleTone.ts` (the title's colour split,
  from the title's pose and the band's rect).
- **Change:** `InkStageGround.tsx` (an optional `anim` prop, set as `data-anim`; nothing else);
  `ProofBanner.tsx` (`anim="proof-banner"` on its ground; output otherwise unchanged);
  `ProjectTakeover.tsx` (the column's classes, `TakeoverBand` before the `<h2>`, the `<h2>`'s
  classes, the header comment); `hooks/useTakeoverMotion.ts` (`bodyPartsOf` skips the band; the
  band's tween on open and close; the colour split on open, close and Next; the bar's hold; `reset`).
- **No change, re-test:** `lib/takeoverTitleMorph.ts`, `lib/takeoverClip.ts`,
  `hooks/useHashTakeover.ts`, `lib/proofBotDuck.ts`, `lib/proofBotShades.ts`, `TakeoverTopBar`,
  `TakeoverIntro`, `TakeoverNextLink`, `content/`.

## Build order and screen checks

- **Static first,** checked under reduced motion, without JavaScript and on a direct load.
  **It must not ship before B–D:** the band is one of the title's siblings, so until the hook
  skips it the built open would fade it in late and fly a light title over cream.
- **Check:** each title on one line in 280px at 360 (a new wrap makes the card morph crossfade);
  the band exactly the title plus margins at 360, 768, 1024, 1440 and 3840, Safari included (the
  grid-area box); a descender ("Design Vault") during the split, which paints only inside the
  title's line box for those frames; no sideways scroll.

## Review (the choices made here)

1. **A sibling in the title's grid cell,** not a wrapper. A wrapper would make the band the
   title's only sibling and break the parts' rise and fade.
2. **`rounded-3xl`,** like the takeover's closing panel and the spam bands; the radius morphs 12
   to 24. The other option was the banner's own 12.
3. **Part 1 keeps its hairline.** The other option was to drop it, as the band already divides.

## Open for the user

1. **The title's colour while the band's edge crosses it** (about 0.1s on open, 0.2s on Next).
   **Recommended: the split at the edge (B),** exact at every frame. Or: one colour for the whole
   title, blended from `ink` to `text` across the crossing. That is simpler and needs no
   `background-clip`, but slivers of the title match their ground for a few frames.
2. **Space above the band. Recommended: one gutter (`pt-gutter`),** so the band is framed like
   the banner in its card and the title lands within 8px of today's spot. Or: keep today's
   40 / 64 / 88, which puts the title 20 to 40px lower and makes the header taller.
