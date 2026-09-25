# §2 Hero: UI spec

Shared rules and parts (§0): [`../ui-spec.md`](../ui-spec.md). Page doc: [`../sections/02-hero.md`](../sections/02-hero.md).

## 2. Hero (the one question: who is this?)

Redesign, 2026-09-25 (the user's decisions, with the open points settled by the lead the same
day). The portrait sits on the left, looking into the page. MUHAMMAD is layered behind the
portrait and WAQAS in front of it; both lines are right-aligned. A drawn agent network sits behind
everything. Phone and tablet: the name first, then the photo. The desktop layout starts at plain
`lg`. At 768, MUHAMMAD is 512px wide and would leave about 225px for the face. Upright tablets
1024–1279px wide get the `lg` layout with a quiet upper half, and that's accepted.

### 2.1 Layout

#### 2.1.1 Layers and stacking

`<section id="top" class="relative isolate h-svh min-h-160 max-h-300 overflow-hidden">` (height
capped at 1200px, confirmed 2026-09-24). Paint order, bottom to top:

| z | Part |
|---|---|
| `-z-10` | `HeroBackdrop`: network canvas, light pool, vignette, grain (all `aria-hidden`) |
| `z-0` | MUHAMMAD line wrapper (behind the portrait) |
| `z-10` | `HeroPortrait` frame |
| `z-20` | WAQAS line wrapper, row 1 (side line), row 3 (tag and buttons) |

- **One stacking context.** The layering works only because both name lines and the portrait
  share the section's `isolate` context. The content layer, the grid, `HeroStage` and the `<h1>`
  must never get `z-index`, `transform`, `opacity`, `filter` or `will-change`, in the static
  build or in the motion pass. Any of them would flatten both lines onto one layer. The z-indexes
  go only on the two line wrappers, the portrait frame and rows 1 and 3.
- The portrait is a sibling of the `<h1>` inside `HeroStage`, never a child of it. The accessible
  name stays "Muhammad Waqas". Reading order: side line, name, photo, tag, buttons.

#### 2.1.2 Parts and classes

- **Backdrop** (`HeroBackdrop`): `<div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 text-hero">`.
  `text-hero` is there only so its `em` matches the name. The pool and vignette are CSS for every
  reader, with or without JS; the canvas draws only nodes and links. Children, back to front (the
  network is the back layer, so the pool glows over the lines):
  1. **Network:** `HeroNetwork`, `<canvas data-anim="hero-network" class="absolute inset-0 size-full">` (2.5).
  2. **Pool:** `absolute size-[5em] -translate-1/2 rounded-full bg-radial from-accent/15 to-transparent to-70%`,
     centred behind the head with
     `left-[calc(var(--spacing-gutter)+1.365em)] top-[calc(39%+2rem+0.87em)] md:top-[calc(39%+5rem+0.87em)] lg:top-[calc(100%-0.77*min(100%,66vw))] lg:left-[calc(100%-max(var(--spacing-gutter),(100%-var(--container-site))/2)+0.25em-1.331*min(clamp(40rem,100svh,75rem),66vw))]`.
     From `lg` it sits on the head, about 47% across and 30% down the portrait frame (2.1.3):
     x = CR + 0.25em − 1.21S, y = H − 0.7S. With S = 1.1·min(H, 66vw), the classes write these
     as 1.331 and 0.77 times min(…). `left` writes H out as the section's clamp, because a
     horizontal percentage there would measure the width. Below `lg` it's centred on the
     positioner's centre line (1.365em in from the column's left edge) and lands within about
     40px of the head (the head sits 3% of the positioner left of that line, and a line of
     side-line wrap moves it).
  3. **Vignette:** `absolute inset-0 bg-radial-[ellipse_at_center] from-transparent from-45% to-bg`.
  4. **Grain:** `HeroGrain`, `absolute inset-0 size-full opacity-6` (2.5).
- **Content:** `relative h-full px-gutter` → `{container} grid h-full grid-rows-[auto_minmax(0,1fr)_auto] gap-4 pt-24 pb-8 md:pt-28 md:pb-10 lg:relative`.
  The old layer-wide `z-10` and `data-anim="hero-text"` are gone (2.5). From `lg` the grid's
  `lg:relative` makes it the portrait frame's containing block: the full-height site column. It's
  position only, with no z-index, so the stacking rules in 2.1.1 are unchanged.
- **Row 1** (`HeroSideLine`): `<div data-anim="hero-text" class="relative z-20">` → `<div data-anim="hero-fade" class="flex md:justify-end">`
  → `<p data-network-avoid="text" class="flex max-w-70 gap-2.5 text-small leading-[1.55] text-muted">`
  with the dot `mt-1.5 size-2 shrink-0 rounded-full bg-accent` (`aria-hidden`, `data-anim="hero-dot"`).
- **Row 2** (`HeroStage`): `<div class="relative flex min-h-0 flex-col text-hero lg:static lg:self-end">`, holding `HeroName`, then `HeroPortrait`.
  `lg:static` is position only, like the grid's `lg:relative`: from `lg` the frame skips the
  stage and places itself against the grid. The stacking rules are unchanged.
  - `<h1 aria-label="{hero.firstName} {hero.lastName}" class="flex flex-col font-display font-bold uppercase text-hero leading-[0.82] tracking-[-0.015em] text-accent {condensed}">`.
    The `aria-label`, built from `hero.firstName` + `hero.lastName`, keeps the accessible name as two
    words even if the text space between the line wrappers is dropped.
  - Each line: `<span data-anim="hero-text" class="relative block overflow-hidden pb-[0.12em]">` →
    `<span data-anim="hero-line" class="block">`. MUHAMMAD adds `z-0 text-right`; WAQAS adds
    `z-20 text-right`. Both lines sit flush right at every width, with no offset. The text space
    between the wrappers stays. The 0.12em keeps the Q tail inside the clip.
- **`HeroPortrait`**, three boxes (the frame places it, the positioner sizes it, the inner box animates):
  - Frame: `<div data-network-avoid="agents" class="relative z-10 mt-[-0.45em] min-h-0 flex-1 lg:absolute lg:right-[calc(0.748*min(clamp(40rem,100svh,75rem),66vw)-0.25em)] lg:bottom-0 lg:mt-0 lg:aspect-square lg:h-[min(110%,72.6vw)] lg:w-auto lg:flex-none">`.
  - Positioner: `<div class="absolute top-[-19%] left-[1.365em] aspect-square h-[220%] -translate-x-1/2 lg:inset-0 lg:aspect-auto lg:h-full lg:w-full lg:translate-x-0">`.
    Square at every width: below `lg` by `aspect-square`, from `lg` by filling the square frame exactly.
  - Inner: `<div data-anim="hero-portrait" class="relative size-full mask-b-from-75%">`
    → `SiteImage` (`fit="contain"`, `position="bottom"`). The mask replaces the old `from-bg` overlay div.
- **Row 3** (`HeroActions`): `<div data-anim="hero-text" class="relative z-20">` → the existing
  `hero-fade` row, unchanged: `flex flex-col gap-4 md:flex-row md:flex-wrap md:items-end md:justify-between md:gap-5`.
  The tag is `<p data-network-avoid="text" class="{monoLabel}">`, and the buttons are
  `<div data-network-avoid="text" class="flex flex-col gap-2.5 md:flex-row">`: See proofs
  (`pillOutline w-full md:w-auto`, `href="#proofs"`), then `BookCallLink variant="hero"`.

#### 2.1.3 Geometry (below `lg` in `em` of `text-hero`; from `lg` in S, the frame's side)

- **Why (2026-09-25):** the old geometry sized and placed the frame in `em` of the name (3.2em
  wide, its top 1.8em above the name), which left the photo in the bottom ~55% of the hero. The
  user said it was too short. From `lg` the frame now follows the section's height instead, and
  the positioner went square for the near-square photo. Later the same day the user approved the
  portrait 10% bigger at every width (S, the phone and tablet positioner and `sizes`, all ×1.1).
- **Photo:** 2464×2448, near-square, shown `object-contain object-bottom` in a square positioner.
  Measured down the photo: hair top ~8%, eyes ~27%, beard bottom ~49%. The head's centre is about
  47% across and 30% down; the face runs ~34–62% across.
- **Measures:** MUHAMMAD is 4.37em wide (314.7px at 72px) and WAQAS about 2.73em. Each line is
  0.94em tall (0.82em plus 0.12em). Capitals run from about 0.04em to 0.74em down each line. From
  `lg`, the name's bottom sits 6.5rem (104px) above the section's bottom: the 40px padding, the
  48px row 3 and the 16px gap.
- **Below `lg`, name above the photo.** Row 2 is a column: the name, then the frame, which takes the
  rest of the row (F tall) and rises 0.45em, so its top is 1.43em down the stage. The positioner
  is a square 220% of F and starts 19% of F above the frame. That puts the hair line on the
  frame's top, the eyes about 0.41F below it and the beard's bottom about 0.90F down, above the
  frame's bottom and clear of the tag. Its centre sits 1.365em in from the stage's left edge
  (`left-[1.365em]` with `-translate-x-1/2`), so the head sits on the left of the column and looks
  right, into the page. The chest runs on under row 3 and fades out. WAQAS's capitals end 1.68em
  down the stage, above the eyes, so no name line ever crosses them. At 360 WAQAS's left end
  overlaps the hair top; at 768 it sits right of the head.
- **From `lg`, portrait left and name right.** The stage is exactly the `<h1>` box and
  `lg:static`; the frame leaves the flow and is placed against the grid (the full-height column).
  - **Frame:** a square of side S = 1.1·min(H, 66vw) (`lg:h-[min(110%,72.6vw)]`), where H is the
    column's height (the section's, `clamp(40rem, 100svh, 75rem)`), at `bottom-0`. Its right edge
    sits 0.68S − 0.25em in from the column's right edge (CR), written as
    `0.748*min(clamp(40rem,100svh,75rem),66vw)-0.25em`, so it spans CR + 0.25em − 1.68S to
    CR + 0.25em − 0.68S. `right` writes H out as the clamp, because a percentage there would
    measure the width. `em` is the name's, inherited from the stage. The positioner fills the
    frame exactly.
  - **Height:** the frame's top sits H − S down. Where H is the smaller (most desktops), S = 1.1H,
    so the frame starts 0.1H above the section's top and the section's `overflow-hidden` clips
    it; where 66vw is smaller (1024×768) the frame is 743px and starts 25px down. No nav
    clearance is taken off S: the photo's ~8.6% headroom above the hair puts the hair top about
    0.086S below the frame's top. Where H binds, that's about 0.005H above the section's top
    (≈5px at 900 tall), so on desktop the top of the hair runs behind the header, just clipped at
    the section's edge; the user accepted this (2026-09-25). The header band is transparent while
    the hero is in view (1.1). At 1024×768 the hair top sits ≈89px down, below the 67px header.
  - **Offset:** 0.68S grows with S because on tall sections the M sits lower on the figure, where
    the chest is wider. It's fitted so only the M's lower left tucks behind the right shoulder,
    from 1024 to 4K. The frame can run past the column's left edge and off the screen (229px at
    1024×768, 231px at 1440×900); the section's `overflow-hidden` clips it.
  - **MUHAMMAD** (right-aligned, starting at CR − 4.37em) overlaps the frame by 4.62em − 0.68S.
    At 1440×900 that's 214px: its capitals cover the right ~22% of the photo, ~54–67% down, just
    under the beard, over the collar and the right shoulder. Only the M's lower left sits behind
    the shoulder; the rest reads.
  - **WAQAS** (right-aligned, starting at CR − 2.73em) starts 0.68S − 2.98em right of the frame's
    right edge. Where S > 4.38em it's clear of the photo (1440×900 by 101px, 1024×768 by 71,
    1366×768 by 27, 1280×720 by 19, 1920×1080 by 152, 3840×1200 by 242). On short, wide screens
    its left end overlaps the frame's right edge and paints in front of the photo (at the 640px
    height floor: 1280 wide by 40px, 1440 wide by 94). It never runs past the container.
- **Mask:** only the bottom 25% fades out (`mask-b-from-75%`); the left and right edges aren't
  faded (the user's call). The stop is Tailwind's `black`/`transparent` alpha stop, not a colour,
  so it isn't a brand token (constitution §4).
- **Nothing on the face or the controls:** the side line is in row 1, top right; the tag and
  buttons are in row 3, over the faded chest (40% alpha at most). WAQAS stays in row 2, 16px
  above row 3, so it never meets the side line, the tag or the buttons. Below `lg` the positioner
  can be wider than the screen (1231px at 768×1024, starting 425px left of it). The section's
  `overflow-hidden` clips it, so nothing scrolls sideways.

### 2.2 Sizes

| Element | Phone 360×640 | Tablet 768×1024 | Desktop 1440×900 | 4K 3840×1200 (cap) |
|---|---|---|---|---|
| Layout | stacked | stacked | portrait left, name right | same, in the 1536 container |
| Name (`text-hero`) | 72px | 117px | 192px | 220px |
| MUHAMMAD / WAQAS width | 315 / ~197 | 512 / ~320 | 839 / ~524 | 962 / ~601 |
| Line alignment | both right, flush with CR | same | same | same |
| MUHAMMAD x | 25–340 | 225–737 | 545–1384 | 1726–2688 |
| WAQAS x / against the photo | 143–340, left end over the hair top | 417–737, right of the head | 860–1384, 101px clear of the photo | 2087–2688, 242px clear |
| Side line | 14px, left, max 280 (~3 lines) | 14px, right | same | same |
| Portrait (positioner, square) | 374 (frame 170 tall); ~594 at 360×740 | 1231, clipped at the left screen edge | S = 990 (photo 990×984) | S = 1320 (photo 1320×1311) |
| Portrait place | x −69–305 (69 clipped); hair ≈280, eyes ≈350, beard ends ≈432 | x −425–806; hair ≈362, eyes ≈594, beard ends ≈863 | x −231–759 (231 clipped), frame top −90 (hair ≈−5, behind the header, clipped), name top 435 | x 525–1845, frame top −120 (hair ≈−6), name top 682 |
| Face width (~34–62% of photo) | ~105 (to ~166 at 740 tall) | ~345 | ~277 | ~370 |
| M behind the photo | n/a | n/a | lower left only, behind the right shoulder | same |
| Light pool (diameter, centre) | 360, ≈(118, 344) | 585, ≈(191, 582) | 960, (234, 207) | 1100, (1146, 276) |
| Network nodes / agents | 24 / 3 | 40 / 4 | 64 / 5 | 96 / 6 |
| Canvas backing store | 720×1280 (DPR 2) | 1536×2048 | 2880×1800 | DPR capped at ~1.34 → ~5150×1610 |
| Tag | 13px mono | same | same | same |
| Buttons | full width, 48 tall, stacked | auto, one row | same | same |

- **Screen checks:**
  - 360×640: every part fits one screen; WAQAS's capitals end above the eyes, and the beard
    (≈432) clears the tag (row 3 from ≈466).
  - 1024×768: name 146px, name top 390; S = 743 (66vw binds), frame x −229–514, frame top 25
    (hair ≈89); MUHAMMAD x 346–983, 168px over the frame; WAQAS x 585–983, 71px clear of it.
  - 1440×780: S = 858, frame top −78, hair top ≈−4, behind the header and just clipped at the
    section's top; WAQAS x 860–1384 clears the frame's right edge by 11px.
  - 1024×1366 (accepted): the upper half holds only the side line and the network.
  - The M still reads; where WAQAS meets the frame, it's plainly in front of the photo; no halo
    shows round the cutout; nothing scrolls sideways from 360 to 3840.

### 2.3 States

| Element | Default | Hover | Focus-visible | Active |
|---|---|---|---|---|
| See proofs | `border-line bg-bg/50 text-text` | `border-accent text-accent` | `focusRing` | `bg-band` |
| Book a call | `bg-accent text-on-accent` | `bg-text` | `focusRing` | `bg-muted` |
| Name, portrait, backdrop | static, not interactive; the backdrop is `pointer-events-none` | n/a | n/a | n/a |

- Tab order is unchanged: See proofs, then Book a call. Row 3 is `z-20`, so the portrait never
  covers a button or its focus ring. Both pills are 48px tall.

### 2.4 Content slots (`content/home.ts → hero`)

| Key | Meaning | Limit |
|---|---|---|
| `hero.firstName` / `hero.lastName` | "Muhammad" / "Waqas" from facts → Name; uppercased by CSS | fixed |
| `hero.sideLine` | What the user does for the reader, one idea (facts → Who) | 16 words, 88 characters (the user's chosen line; above the voice doc's 12-word hero limit by the user's choice) |
| `hero.tag` | Mono tag naming the two offers (agents, web) | 5 words |
| `hero.seeProofs` | Outline button that jumps to Proofs | 3 words |
| `hero.portraitAlt` | What's in the photo: the user, head and shoulders, in black and white, wearing glasses, looking off to one side | 125 characters |
| Book a call | `nav.bookCall` (shared) | fixed |

### 2.5 Images, components, motion

- **Image:** `portrait` → `/images/portrait.png` (`lib/images.ts` unchanged). The real photo: a
  transparent 2464×2448 cutout, near-square. `SiteImage` with `fit="contain"`, `position="bottom"`
  (`object-contain object-bottom`), `priority`,
  `sizes="(min-width: 64rem) min(max(704px, min(110vh, 1320px)), 72.6vw), (min-width: 48rem) min(1617px, max(387px, calc(220vh - 1023px))), max(375px, calc(220vh - 1035px))"`.
  Each term is the positioner's width, 1.1× the pre-2026-09-25 values. From `lg` it's S: 1.1× the
  section height, with `100vh` standing in for it, held to 704–1320px (1.1× its 640–1200px clamp)
  and capped at 72.6vw. Below `lg` it's 220% of the frame's height: 2.2× the viewport height less
  about 465px on tablets (387–1617px across the section's height range) and 470px on phones (at
  least 375px).
  The positioner is square at every width and the photo near-square, so `object-contain` never
  crops: it leaves 0.65% of the height spare above the hair, and `object-bottom` keeps the photo
  on the positioner's bottom. The pixels under the alpha still hold a light glow. Screen check: the optimised WebP/AVIF keeps its alpha, and no halo
  shows over the name.
- **Network, static (drawn once):**
  - `lib/seededRandom.ts`: a small seeded generator (for example, mulberry32).
  - `lib/heroNetwork.ts` (pure): from one fixed seed, 96 nodes in 0–1 space, so every load and width
    gets the same network. It takes the first 24 / 40 / 64 / 96 nodes by canvas width (<768 / <1024 /
    <1920 / ≥1920), with 3 / 4 / 5 / 6 agents. It scales them to px, and drops plain nodes inside
    text keep-out rects (grown by 16px). It links each node to its two nearest within 160px (120px
    below 768). It picks agent nodes in seeded order, outside the text keep-outs and the portrait frame.
  - `lib/drawHeroNetwork.ts`: draws on a 2D context with colours passed in. Links: 1px `accent` at
    alpha 0.10. Nodes: 1.25px radius, `accent` at 0.30. Agents: 2.5px radius, `accent` at 1, with an
    8px halo at 0.15. Links under text still leave `muted` at about 6:1. Nodes stay out of the side
    line, the tag and the buttons (`data-network-avoid="text"`). The name is not a keep-out, so nodes
    and links can sit behind its letters (open visual call for the user). It takes optional drifted
    node positions (each node's resting place if none are given), and it also draws the pulse dots.
  - `hooks/useHeroNetwork.ts`: reads `--color-accent` through `getComputedStyle`, so no colour
    literal lives in code; if it's empty, nothing is drawn. Measuring lives in
    `lib/heroNetworkLayout.ts`: the canvas size and the `[data-network-avoid]` keep-outs. Every box
    is a layout (offset) box that ignores transforms, so the motion pass can't shift the keep-outs.
    The backing scale, min(DPR, 2, √(3840×2160 ÷ (w×h))), lives in `lib/backingScale.ts`. After
    `document.fonts.ready` the hook starts a `ResizeObserver` on the canvas, and its first
    notification does the first draw. It redraws on later resizes or a devicePixelRatio change (a
    `resolution` matchMedia, re-armed for the new ratio after each change), coalesced to one frame.
    A draw is skipped when the CSS size and ratio match the last one drawn. The static drawing has
    no loop of its own: the hook hands the scene it last drew (network, colour, scale, keep-outs)
    to `hooks/useHeroNetworkMotion.ts`, which runs on `gsap.ticker` (Motion below) and redraws the
    whole canvas each tick: the network at its drifted positions, then the pulses. There's no
    cached snapshot or wipe layer. `lib/heroDrift.ts` (pure) computes the drift and
    `lib/heroPulses.ts` (pure) the pulses' walks.
  - `components/home/hero/HeroNetwork.tsx` (client): the `<canvas aria-hidden="true">`,
    `useHeroNetwork` and `useHeroNetworkMotion`.
  - **Without JS** the canvas stays empty, and the CSS pool, vignette and grain still finish the section.
- **Grain** (`HeroGrain.tsx`, server): `<svg aria-hidden="true" focusable="false">` with one `<filter id="hero-grain">`.
  The filter is `feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"`,
  then `feColorMatrix type="saturate" values="0"`, over a full-size `<rect>`, at `opacity-6`.
  It has no colour values, needs no JS and is painted once.
- **Components:**
  - New: `HeroStage.tsx`, `HeroBackdrop.tsx`, `HeroNetwork.tsx` (client), `HeroGrain.tsx`,
    `HeroMotion.tsx` (client, renders nothing: the entrance, scroll and tilt hooks on `#top`).
  - Changed: `HeroSection.tsx`, `HeroName.tsx`, `HeroPortrait.tsx`, `HeroSideLine.tsx`, `HeroActions.tsx`.
  - Deleted: `HeroGrid.tsx`.
  - All in `components/home/hero/`.
  - Motion files: `lib/gsap.ts` (registers the plugins; the one import point for GSAP),
    `lib/motion.ts` (shared media queries, durations, eases, staggers), `lib/heroDrift.ts`,
    `lib/heroPulses.ts`; `hooks/useElementById.ts`, `hooks/useHeroEntrance.ts`,
    `hooks/useHeroScroll.ts`, `hooks/usePointerTilt.ts`, `hooks/useHeroNetworkMotion.ts`
    (replaces `useHeroPulses`).
- **Doc follow-up (wording only, no token change):** `docs/01-design-system.md` (the
  `--color-line` use and a change-log line) still mentions the hero grid.
- **Motion (built):**
  - Network (`hero-network`), on `gsap.ticker`, redrawn in full each tick:
    - **Drift:** each node drifts slowly and independently on seeded sine loops, 6–10px and
      6–12s per axis with a random phase, easing in over 1.5s, so every line moves on its own.
      The drift is clamped per axis so nodes never enter the text keep-outs' 16px band, and
      agents never enter the portrait frame.
    - **Pulses:** they travel link to link from the agent nodes: a 2px `accent` dot about every
      1.5s per agent, each walking 2–4 hops at 110px/s. They ride the moving links and fade back
      in when motion resumes.
    - Off screen, with the tab hidden, or under reduced motion it shows the plain static drawing:
      no drift and no pulses. The markup doesn't change.
  - Name lines (`hero-line`): rise on load from below their whole clip wrapper (the wrapper's
    height plus 0.3 of the line's height, so no glyph top shows at the start), 1.1s, `power4.out`,
    staggered 0.12s. Under reduced motion: a short opacity fade, no rise.
  - Side line and bottom row (`hero-fade`): fade up from 14px, starting 0.5s before the name lines
    finish; under reduced motion, fade only. Dot (`hero-dot`): opacity 0.25↔1 loop; off under
    reduced motion (the dot stays at full opacity).
  - Portrait (`hero-portrait`, inner box only): fades in on load (kept under reduced motion). On
    scroll, y moves at 0.15× scroll and the scale goes to 1.06. On `pointer: fine`, a 3D tilt
    replaces the ±9px drift (the user's call): it turns to face the pointer, `rotationY` ±3° and
    `rotationX` ±2° at the window's edges, just enough that the person seems to follow the cursor,
    1100px perspective, 0.7s smoothing, no translation. It eases back flat when the pointer leaves
    the window or the hero goes off screen. The mask moves with it. Under reduced motion the
    scroll move, the scale and the tilt are off: the portrait stays still.
  - Text on scroll (`hero-text`, now on four elements: row 1, each name-line wrapper and row 3):
    y at 0.35× scroll, fading to 0 by 75% of the viewport height. The fade is plain `opacity`, not
    `autoAlpha`, so the side line, tag and buttons stay in the tab order. It's never on the stage
    or the `<h1>` (2.1.1). As you scroll, the M slides off the shoulder: the parallax is intended.
    Under reduced motion it's off: the text stays put and fully visible.
