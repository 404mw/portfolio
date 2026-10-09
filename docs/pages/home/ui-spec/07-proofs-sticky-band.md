# §7 Proofs: the takeover's sticky band, condensing as the takeover scrolls: UI spec

Shared rules (§0): [`../ui-spec.md`](../ui-spec.md). The band as built:
[`07-proofs-band.md`](07-proofs-band.md). Page doc: [`../sections/07-proofs.md`](../sections/07-proofs.md).

**Last Updated:** 2026-10-07 (new; static and motion, nothing built).

**Amends** `07-proofs-band.md` in two places only: §A's placement (the band and title move into
one sticky head; the column goes back to flex) and §C's fallbacks (the scrolled-off and
narrow-window plain closes are gone, and so is the band landing on the banner). B, D and E stand.

**The one question** stays the section's. The strip is the title the reader already has, kept on
screen. It adds no words, no claim and no second heading.

## The user's decision (2026-10-07; not reopened)

Keep the title and its band on screen while the takeover scrolls, so every close can morph back
into the card. **A band that shrinks as you scroll:** full at the top, then a slim sticky ink
strip with a smaller title under the bar. A close from any point (full, mid-shrink or slim)
morphs back into the card banner and title.

## A. Static

```
div {container} flex flex-col gap-10 pt-gutter md:gap-14 lg:gap-18                    the column (was relative grid grid-cols-1)
├ TakeoverHead  div data-anim="takeover-head"                                      NEW wrapper, first child
│ ├ TakeoverBand → InkStageGround  data-anim="takeover-band"   absolute inset-0 inside the head
│ └ h2  data-anim="takeover-title"                             classes unchanged; its margins are the band's padding
├ TakeoverIntro  data-part="intro"                                                 unchanged
└ … parts, TakeoverMeans, TakeoverNextLink                                         unchanged
```

- **One sticky wrapper, not two sticky siblings.** An absolute box can't be sticky, so the band
  would need `sticky` too, sharing row 1 with the h2. That depends on how engines bound a sticky
  grid item (the grid area by the spec's letter, the grid container in practice) and moves
  `InkStageGround`'s `absolute` out to all its callers. A wrapper sticks the pair as one box in
  every engine and leaves `InkStageGround` alone. Its one cost: `bodyPartsOf` reads the head
  (Files). This reverses `07-proofs-band.md` Review 1.
- **Column:** back to `flex flex-col` (as before 2026-10-07). The grid trick isn't needed: the
  band takes the head's box. A flex item also bounds its sticky range by the whole column. The
  head is a flex item, so it holds the h2's margins (no collapse). Its box is the title plus its
  margins, at one line or two, exactly as row 1 was.
- **Head (`TakeoverHead`, server; props `id`, `title`):**
  `<div data-anim="takeover-head" class="pointer-events-none relative z-1 [[data-condense]_&]:sticky [[data-condense]_&]:top-(--takeover-stick)">`.
  - **Sticky only while the condense runs.** The motion sets `data-condense` and
    `--takeover-stick` on the dialog (C). Without them (no JS, reduced motion, before setup) the
    head is `relative` and scrolls away, as it does today. CSS alone never makes it sticky,
    because a sticky full band would hold 81 + 156 = 237px of a 1440 × 900 screen.
  - `z-1`: above the later positioned parts (shot frames, the spam stage) when they pass under
    it, and below the bar (`z-10`). A slim strip tucks under the bar's edge (C).
  - `pointer-events-none`: once the head is stuck, its in-flow box stays full height but only the
    strip is drawn. Content under the clear part (Visit, Book a call) must stay clickable. The
    head holds nothing interactive.
- **Band:** `<InkStageGround glow="floor" anim="takeover-band" className="pointer-events-none inset-0 rounded-3xl" />`.
  The grid placement classes go. **Title:** classes as built (`relative mx-5 mt-5 mb-4 font-display text-takeover leading-none text-text md:mx-8 md:mt-7 md:mb-6 lg:mx-12 lg:mt-10 lg:mb-8`).
- **At rest nothing looks different** at any width, with or without JS. Never `overflow: hidden`
  on the content, the column or the head while the head is sticky. `overflow: clip` (already used
  by the morphs) is safe.
- **Not interactive** (`aria-hidden` band; the h2 and `aria-labelledby` unchanged); no hover or focus states.
- **Contrast:** `text` on `ink` is above 16:1, and about 9:1 over the glow's strongest point
  (estimate). The slim title sits lower in the glow, so screen-check it.

## B. The condense (motion, full motion only)

**Scroll-linked, not a snap.** The pose is a pure function of the dialog's `scrollTop`, like the
title's colour rule, which depends on position, not time. A close at any moment reads exactly one
pose. There's no threshold to flap around, and it is literally "shrinks as you scroll".

- **Trigger:** `ScrollTrigger.create({ scroller: dialog, start: s0, end: s0 + D, onUpdate })`,
  with start and end as functions, so a refresh re-measures. No `scrub` smoothing, which would
  make the pose depend on time. It's created outside any GSAP context, like the open's tweens,
  and killed by hand.
- **Numbers** (measured with the pose cleared). `B` is the bar's height. `g` is the column's top
  padding. `H` is the band's height. `F` is the h2's font size, and `mt`, `mb` and `mx` are its
  margins. `C` is a proof card title's font size (`text-card`, read from any
  `proof-card-title`). `r` is the card banner's radius (12, read from `proof-banner`).
  - `s = C / F` (the slim title is the card title's size)
  - `V = H · s` (the strip's visible height)
  - `T = B − r` (the sticky top)
  - `s0 = g + r` (the scroll at which the head sticks)
  - `D = H`
  - `p = clamp((scrollTop − s0) / D, 0, 1)`
- **Band** (written with `applyBand`, as plain numbers): x 0, y 0, the column width,
  `height = lerp(H, r + V, p)`, `radius = lerp(24, r, p)`. Only the height and radius change.
  Width and position never do. No scale, because a scale stretches the hatch. It stays one
  childless, out-of-flow box, so a frame lays out that box alone. The head's in-flow height never
  changes, so content never shifts and scroll anchoring has nothing to do.
- **Title** (by transform only, `gsap.set`, so the close's existing reads get it):
  `transformOrigin 0 0`, `scale = 1 − (1 − s)·p`, `x = −mx(1 − s)·p`, `y = (r + mt·s − mt)·p`.
  The band and title are linear in one `p` and the title is inside the band at both ends, so it's
  inside throughout. **Its colour stays `text`; no tone is written.** No `will-change` while it's
  stuck (a cached raster scaled down shimmers).
- **The tuck:** stuck at `T`, the band's top `r` px sit under the bar. The slim strip hangs from
  the bar's hairline with square-looking top corners and rounded bottom corners (12). Content
  can't flash through a gap or the top corners, with no extra cream element.
- **At slim:** the hatch is unchanged (1px every 13px at 135°, true at any size, as no scale).
  The floor glow is sized in percent, so it rises over the strip's lower 40%, about 21px at
  360: a violet floor line under the title.
- **At `p = 0` the condense clears its inline styles** rather than writing rest values.
- **Scroll padding:** while the condense runs, the dialog takes inline
  `scroll-padding-top: B + V + 16px`. Tabbing back up then never parks a focused link under the
  strip (WCAG 2.4.11).
- **Refresh** (resize, font load): clear the pose, re-measure, set `--takeover-stick` and the
  padding again, re-apply for the current scroll.
- **Markup it needs:** `takeover-head`, `data-condense` and `--takeover-stick` on the dialog. Nothing else.

## C. Lifecycle: open, Next, close

- **Open (as built, unchanged on screen).** A full-motion open (card morph, plain or fade) sets
  `data-condense`, `--takeover-stick` (measured `B − r`) and the scroll padding at its start; the
  open's reads come first and are at `scrollTop` 0, so nothing moves. The condense writes nothing
  while the open owns the band and title. At the open's end it applies the pose for the current
  scroll once. If the reader scrolled during the 0.75s, that is one catch-up step (accepted:
  rare). **Direct load** (`how === "load"`): it starts at once. **Entering full motion with a
  takeover open** starts its condense.
- **Next (as built, unchanged on screen).** The old project is usually slim (its Next link is at
  the bottom). Its condense is **frozen where it stands**: the trigger is killed, and its pose,
  `data-condense` and `--takeover-stick` are kept. It slides away slim, with its dialog, under its
  bar. So `replacing` no longer clears the old dialog's band and title at the slide's start (today's
  `reset(previous)` there would snap a scrolled strip back to full and unstick it). It's cleared
  when the old dialog closes at the slide's end. The new project starts at `scrollTop` 0 with the
  full band. The title morph and the band rising with the content are as built. Its condense
  starts when the slide ends. A new hash mid-slide settles both as built and clears both.
- **Close from any state (full, mid-condense, slim).**
  1. `freezeScroll` first (as built).
  2. Take the pose from the condense's function at the frozen `scrollTop`, not from the last
     write, so a close mid-fling starts exactly there. `start` (the title) comes from the h2's
     transform as built. `standing` (the band) is the open's flying rect if one is in flight, else
     the condense's rect, else rest.
  3. Kill the trigger and **keep the head sticky**. `reset(dialog, true)` now also holds
     `data-condense` and `--takeover-stick`, so the at-rest reads are of the full band at the
     stuck spot (the frame `standing` and `start` are measured in).
  4. **Morph:** `cardMorphBack` and `bandFlight` as built. The band goes from `standing` to the
     banner rect (radius 12 → 12 from slim). The title goes from `start` to the card title. At
     slim its size already is the card title's, so that leg is a pure slide. 0.6s `power4.inOut`
     on the clip's clock. The bar and parts fade over 0.2s (this uncovers the band's tucked top
     as it starts to move). The band stays opaque. The colour split follows the band (frame
     measured at rest; slim start reads `text`). The dissolve is the last 0.15s. Both fit checks
     always pass at the start now: the strip is never above the screen.
  5. **Every other path re-applies the pose first**, so nothing snaps to full size while fading.
  6. At the end, `done()` closes the dialog at its top (`useHashTakeover`), then `reset` clears
     everything, stickiness included.
- **The plain clip (`plainOut`) stays only for:**
  - (a) a card on screen whose title isn't: it's cut by the screen's edge (likely on a phone after
    Next) or has no `proof-card-title`;
  - (b) a failing title or band fit check;
  - (c) a plain open cut off mid-rise.

  Each fades the content from its opacity over 0.2s, then dissolves over the last 0.15s.
  **No card on screen:** the dialog fades (as built).
- **Removed:**
  - the "heading scrolled off screen" close and the narrow band-window close, which can't happen
    while the head is stuck;
  - `bandLanding` and `plainOut`'s landing branch. With the band now always on screen, moving it
    to the banner would pop it.
- **Cleanup:** `reset` kills the trigger and clears the band (`clearBand`) and title
  (`transform`, `transformOrigin`). It also removes `data-condense`, `--takeover-stick` and
  `scroll-padding-top`. Hold-mode keeps the stickiness (close), and the Next freeze keeps the pose.

## D. Reduced motion, no JavaScript, direct load

**Not sticky, as today.** Under reduced motion the close is instant, so a sticky strip buys
nothing, and the band scrolls away with the content. A crossfading strip would need a second,
slim copy of the title (a duplicate heading in the DOM) for a purely decorative gain. **No JS:**
the head is `relative`. CSS gives exactly today's layout and the bar stays sticky. A direct load
with full motion gets the condense (C). `07-proofs-band.md` §E stands.

## Sizes

Computed from the tokens after the 2026-10-07 font change (Acosta, `leading-none`). The band
spec's 85 / 202 predate it. Screen-check every row.

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Top bar `B` (measured; Close's 44 + padding + hairline) | 69 | 81 | 81 | 81 |
| Head's sticky top `T = B − 12` | 57 | 69 | 69 | 69 |
| Full title (`text-takeover`) | 34 | 52.9 | 84 | 100 |
| Full band `H`: one line (two lines) | 70 (104) | 105 | 156 | 172 |
| Band width, both states (the column) | 320 | 706 | 1328 | 1536 |
| Condense starts at `scrollTop` (`g + 12`) | 32 | 43 | 68 | 68 |
| Condense distance `D = H`; ends at `scrollTop` | 70; 102 (104; 136) | 105; 148 | 156; 224 | 172; 240 |
| Slim title (`text-card`, the card title's size) and scale `s` | 25 (0.735) | 28.8 (0.544) | 35 (0.417) | 36 (0.36) |
| Slim strip, visible under the bar `V = H·s` | 51.5 (76.5) | 57 | 65 | 62 |
| Slim band height, tucked 12 included | 63.5 (88.5) | 69 | 77 | 74 |
| Slim padding: top / bottom / left (margins × `s`) | 14.7 / 11.8 / 14.7 | 15.2 / 13.1 / 17.4 | 16.7 / 13.3 / 20 | 14.4 / 11.5 / 17.3 |
| Radius, full → slim | 24 → 12 | 24 → 12 | 24 → 12 | 24 → 12 |
| Bar + slim strip, share of the screen | 120.5 = 18.8% of 640 (145.5 = 22.7%) | 138 = 13.5% of 1024 | 146 = 16.2% of 900 | 143 = 6.6% of 2160 |
| `scroll-padding-top` (`B + V + 16`) | 136.5 (161) | 154 | 162 | 159 |

- **Phone budget:** one line keeps bar plus strip under 20% of 360 × 640. A two-line title (the
  strip keeps the h2's line breaks, because it is a scale) costs 22.7%. That is one more reason
  for the existing sizing note: **`proofs.projects.*.title`, one line in 280px at 360.** Check
  "Design Vault" at 34px in Acosta, which may wrap.
- **Nothing sideways:** the band never changes width or x. **Tap targets:** Close (44) is unchanged
  and never covered; the strip isn't interactive.
- **Short landscape phones** (640 × 360): bar plus strip is about 118px, a third of the height.
  Accepted (Review 5).

## Files

- **New:**
  - `components/home/proofs/TakeoverHead.tsx`: the sticky head (band and title).
  - `lib/takeoverCondense.ts`: the frame, `p` from `scrollTop`, and the band rect and title pose
    at `p`, as plain numbers.
  - `lib/takeoverCondenseTrigger.ts`: one dialog's condense on its own scroll: start, freeze,
    stop, re-measure on refresh, and the dialog's attribute, variable and padding.
- **Change:**
  - `ProjectTakeover.tsx`: the column's classes, `TakeoverHead` in place of `TakeoverBand` and the
    h2, and the header comment.
  - `TakeoverBand.tsx`: drop the four grid classes; update the comment.
  - `hooks/useTakeoverMotion.ts`:
    - `bodyPartsOf` becomes the head's siblings: `head.parentElement.children` without the head,
      the same set as today;
    - the condense in `opened`, `replacing`, `closing`, `reset` and the matchMedia branch;
    - the close's `standing`, the hold and the re-applied pose;
    - remove `bandLanding` and the landing branch;
    - update the comments.
- **No change, re-test:** `lib/takeoverBand.ts` (reused: `applyBand`, `clearBand`),
  `lib/takeoverTitleMorph.ts`, `lib/takeoverTitleTone.ts`, `lib/takeoverClip.ts`,
  `hooks/useHashTakeover.ts`, `InkStageGround.tsx`, `TakeoverTopBar.tsx`, `content/`.

## Build split and screen checks

- **`web-coder`, static (A):** `TakeoverHead`, the column, the band's classes and the gated sticky
  classes.
  - Check under reduced motion, without JS and on a direct load at 360, 768, 1024, 1440 and
    3840: the band rect is identical to today's, with no visual change.
  - Set `data-condense` and `--takeover-stick: 57px` by hand: the full band sticks with 12px
    under the bar, and links under the head's clear part still click.
  - **Not shipped before `gsap-animator`'s `bodyPartsOf` change.** With the wrapper, the old one
    returns no parts, so they would neither rise on open nor fade on close.
- **`gsap-animator`, motion (B, C):** the two lib files and the hook changes. Check at 360 and 1440
  (plus 768 and 3840 at rest and slim):
  - close from full, mid-condense, slim and mid-fling (wheel, trackpad, touch); close mid-open;
  - Next from slim (the old strip slides away slim with no snap) and then close the new one;
  - open, then scroll at once;
  - resize while slim; a reduced-motion switch while slim;
  - Tab and Shift-Tab: focus is never under the strip;
  - the band is never outside the clip; no inline style, attribute or listener left; no sideways
    scroll;
  - the ink strip over the spam stage and the closing panel (its edge must read).

## Review (the choices made here)

1. **A sticky wrapper plus a one-line `bodyPartsOf` change,** over sticky on the h2 and band
   separately (A).
2. **Scroll-linked over a threshold snap** (B).
3. **`D` = the full band's height, starting when the head sticks.** The other option, the band's
   bottom edge riding the content 1:1, is only 6.5px of scroll at 360: the title would jump from
   34 to 25 at once.
4. **Column width, rounded, tucked 12 under the bar,** over a full-width square deck. It keeps the
   card banner's shape family (and its radius, 12), and the tuck needs no cream mat.
5. **Short landscape phones accepted.** The other option is to skip the sticky head below a
   viewport height. Those closes would then fall back to the plain clip again.
6. **Ink over ink:** where the strip passes over the spam stage (from `md`) or the closing panel,
   only its floor glow marks its edge. If the screen check finds it weak, the fix is a `line`
   hairline on the band (no new token).

## Open for the user

1. **Where the slim strip sits. Recommended: hanging from the bar** (as specced). Or: merged into
   the bar, the bar's label giving way to the title. That saves 52–65px of height. But the full
   band runs under Close, so it would have to pull in sideways within the first 20px of scroll,
   or pass behind the bar and come back out. Both take more moving parts.
2. **The strip's size on phones. Recommended: the title at the card title's size** (25px; strip
   about 52px; bar plus strip 18.8% of 360 × 640; the close from slim is a pure slide). Or: a
   smaller title, about 18px (strip about 40px, about 17%), with a small scale-down in the close.
3. **Reduced motion. Recommended: not sticky** (D). Or: sticky, with full and slim swapping by an
   opacity crossfade at the stick point. That needs a duplicate slim title in the DOM.
