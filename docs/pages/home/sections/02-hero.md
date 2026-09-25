# Hero

**Last Updated:** 2026-09-25 (network nodes drift; pulses ride the moving links)

**The one question:** Who is this?

See `../page.md` for the site-wide index. Spec: `../ui-spec/02-hero.md`.

## Current State

The Hero has been rebuilt to ui-spec §2 (2026-09-25): the portrait sits between the two name lines
in one stacking context, masks replace the fade overlay, and a seeded agent network drawn once on
a canvas, with a CSS light pool, vignette and grain, replaces the grid. The network's canvas and
keep-outs are measured from untransformed layout boxes (`lib/heroNetworkLayout.ts`), so the GSAP
motion pass can move the hero wrappers without breaking them; it also redraws on a device-pixel-ratio
change. The first draw comes only from the ResizeObserver's guaranteed first notification, and a
draw is skipped when the canvas's CSS size and pixel ratio match the last one drawn, so load and a
zoom change each draw once; the backing-store scale maths lives in `lib/backingScale.ts`. The h1
carries an `aria-label` built from the name keys. Build, lint and tsc are green; the audit found 0
HIGH, and both SHOULDs (portrait alt, transform-proof keep-outs) plus its NITs are fixed.

The hero now has its first GSAP motion pass (`HeroMotion`, rendered by `HeroSection`, renders
nothing). Full motion: the portrait fades in; the two name lines rise from past their whole clip
wrapper, staggered; the side line and bottom row fade up 14px; the side line's dot blinks between
full and dim while the hero is in view; on scroll, `hero-text` wrappers move at 0.35× and fade out
(plain `opacity`, so the side line, tag and buttons stay in the tab order and the accessibility
tree; the lead checked this — opacity 0, visibility visible) by 75% of the viewport, and the portrait
moves at 0.15× and scales to 1.06; the portrait also tilts subtly in 3D to face the pointer on fine
pointers (up to ±3° `rotationY` left/right, ±2° `rotationX` up/down, 1100px perspective, smoothed
over 0.7s, easing flat when the pointer leaves the window or the hero leaves the screen; it never
moves, so it composes with the scroll parallax/scale). The canvas network's nodes each drift
slowly and independently on `gsap.ticker` (seeded sine loops, 6–10px, 6–12s per axis, random
phase, easing in over 1.5s), so every line moves on its own, clamped so nodes never enter the text
boxes nor agents the portrait frame; travelling pulses (2px accent dots, ~1.5s per agent, 2–4 hops
at 110px/s) ride the moving links. The whole network redraws each tick; off screen, with the tab
hidden, or under reduced motion it shows the plain static drawing. Reduced motion keeps only short
opacity fades; the blink, scroll parallax, pointer tilt and network motion are off. The lead
screen-checked full and reduced motion at 1440×900 (`:3000`): both match spec, no sideways scroll,
entrance clean; the lead also checked the tilt (corners 2.96°/1.96°, centre flat), combining with
scroll with no errors; nodes moved about 10–15px independently over 3s with the lines following,
at 145fps with no errors, and the canvas stayed identical across 6s under reduced motion.

The portrait's positioner (`HeroPortrait`) is square at every width (the photo is 2464×2448). Below
`lg` it's 220% of the frame, starting 19% above it, centred on WAQAS. From `lg` the frame is a
square of side S = 1.1·min(column height, 66vw) pinned at the site column's bottom (`HeroStage` is
`lg:static`, the `HeroSection` grid `lg:relative`), with its right edge 0.68S − 0.25em in from the
column's right edge, so S — and the offset — grow with the section height; only the M's lower left
tucks behind the right shoulder, from 1024 to 4K. `HeroBackdrop` paints back to front: the network,
then the light pool (glowing over the lines), then the vignette and grain; the pool scales with S
so it stays centred on the head: `top` 100% − 0.77S, `left` CR + 0.25em − 1.331S (CR = the column's
right edge). The image's `sizes` hint tracks the rendered
width, including viewport height, scaled ×1.1. The portrait's inner box has only the bottom mask
(`mask-b-from-75%`); left and right are not faded. The lead screen-checked this with the real photo
(2464×2448, near-square) at 360×640, 768×1024, 1024×768, 1024×1366, 1440×900, 1920×1080, 1920×1200
and 3840×1200; at the 10%-bigger size, the user accepted that on desktop (1366, 1440, 1920, 3840)
the top of the hair now runs behind the nav links or touches the top edge.

## Key Files

- `components/home/hero/HeroSection.tsx` — the hero section, `#top`
- `components/home/hero/HeroStage.tsx` — the name + portrait stage; imports `HeroName` and
  `HeroPortrait` itself
- `components/home/hero/HeroBackdrop.tsx` — the light pool, agent network and vignette/grain
- `components/home/hero/HeroNetwork.tsx` — the client canvas agent network; also runs the node
  drift and travelling pulses over the static draw
- `components/home/hero/HeroGrain.tsx` — the SVG grain overlay
- `components/home/hero/HeroMotion.tsx` — client, renders nothing; runs the entrance, scroll
  parallax and portrait pointer tilt on `#top`'s `data-anim` hooks
- `hooks/useHeroNetwork.ts` — draws the seeded agent network on the canvas after fonts load, from
  the ResizeObserver's first notification, redrawing on resize or a device-pixel-ratio change but
  skipping a redraw when the canvas size and ratio match the last draw; keep-outs read from
  `[data-network-avoid]` inside the section; returns a ref to the last drawn scene (network,
  colour, scale and the keep-out rects) for the motion
- `hooks/useHeroEntrance.ts` — the load entrance (portrait fade, name-line rise, fade-ups, dot
  blink); reduced motion swaps it for short opacity fades
- `hooks/useHeroScroll.ts` — the scroll parallax/fade on `hero-text` and the portrait; full motion
  only
- `hooks/usePointerTilt.ts` — shared 3D pointer-tilt (facing the pointer, never moves) for a
  section's `data-anim` element; fine pointers, full motion only
- `hooks/usePointerDrift.ts` — unused, awaiting the user's delete (replaced by
  `usePointerTilt.ts`)
- `hooks/useHeroNetworkMotion.ts` — runs the network's node drift and travelling pulses on
  `gsap.ticker`, paused off screen or when the tab is hidden; full motion only; replaces
  `useHeroPulses.ts`
- `hooks/useHeroPulses.ts` — unused (emptied to a placeholder), awaiting the user's delete
- `hooks/useElementById.ts` — shared: a ref to a DOM element by id, filled before other motion
  hooks run
- `lib/heroDrift.ts` — the network's per-node drift offsets: seeded sine loops clamped clear of the
  keep-outs, eased in from rest
- `lib/heroPulses.ts` — the pulses' pure walk/position data, following the current (drifted) link
  endpoints; shared with `drawHeroNetwork.ts`
- `lib/heroNetworkLayout.ts` — measures the canvas and keep-out boxes from untransformed layout
  offsets (so the motion pass's transforms can't move them); DOM measuring only
- `lib/backingScale.ts` — the canvas backing-store scale maths (device pixel ratio, capped at 2 and
  at 3840×2160 backing pixels)
- `lib/seededRandom.ts` — the seeded RNG shared by the network draw
- `lib/heroNetwork.ts` — the network's node/edge layout data (agent nodes are the first seeded
  nodes outside the portrait frame and text keep-outs)
- `lib/drawHeroNetwork.ts` — the canvas draw routine, links/nodes/agents at given (or resting)
  positions, then the pulse layer
- `components/home/hero/HeroPortrait.tsx` — the portrait, edge-masked, sibling of the h1
- `components/home/hero/HeroSideLine.tsx` — the "what I do" line with its violet dot
- `components/home/hero/HeroName.tsx` — the MUHAMMAD/WAQAS h1
- `components/home/hero/HeroActions.tsx` — the mono tag plus See proofs / Book a call row

## Decisions

- 2026-09-24 — Hero buttons: primary violet Book a call (Cal.com, new tab, counted) and an outline
  "See proofs" jumping to Proofs. (v3's "Get in touch" is dropped.)
- 2026-09-24 — Hero phone stack: side line at the top (left-aligned), name keeping the v3 offset
  at 72px, photo behind the lower half, mono tag above the buttons, buttons full width and
  stacked. It all fits one screen. (The photo-behind-the-lower-half part is superseded by the
  2026-09-25 hero redesign decision below: below `lg` the name sits above the photo.)
- 2026-09-24 — Hero height is full screen, capped at 1200px.
- 2026-09-24 — The hero side line is v3's: "I build AI agents that take repetitive work off your
  team, and the websites around them."
- 2026-09-24 — The hero side line (16 words) runs over the 12-word limit by the user's choice.
- 2026-09-24 — Hero built as a static server component (`components/home/hero/*`) per ui-spec §2,
  carrying every `data-anim` hook for the GSAP pass; MUHAMMAD measured at 314.7px within 320 at
  360px, so the 72px token stands.
- 2026-09-24 — Hero name lines carry `pb-[0.12em]` bottom padding (user's choice) so the Q tail in
  WAQAS isn't clipped.
- 2026-09-25 — Hero redesigned around the user's new portrait (user's decisions, open points
  settled by the lead): MUHAMMAD sits behind the portrait and WAQAS in front, both still violet,
  one h1 reading "Muhammad Waqas". From `lg` the portrait is on the left looking into the page,
  MUHAMMAD right-aligned with its M tucked behind the beard; below `lg` the name sits above the
  photo with WAQAS over the hair top, never crossing the eyes.
  A canvas agent network
  (drawn once, seeded) with a CSS light pool, vignette and SVG grain replaces the 64px grid; the
  GSAP pass adds travelling pulses, which turn off under reduced motion per §5. Spec: ui-spec §2.
- 2026-09-25 — The portrait file is delivered: `public/images/portrait.png`, a transparent
  2464×2448 (near-square) black-and-white cutout; `hero.portraitAlt` rewritten for it ("Muhammad
  Waqas, head and shoulders, in black and white, with glasses, a beard and a dark collared shirt,
  looking to one side."), correcting an earlier "waist-up" description (the photo is cropped at
  mid-chest); the alt is at the 125-character limit.
- 2026-09-25 — The hero portrait's positioner is square at every width (photo 2464×2448). Below
  `lg` it's 200% of the frame, starting 17% above it. From `lg` the frame is a square of side
  S = min(column height, 66vw) at the column's bottom, its right edge 0.68S − 0.25em from
  the column's right edge — S grows with the section because on tall sections the M sits lower,
  where the chest is wider, keeping only the M's left edge behind the right shoulder from 1024 to
  4K. `sizes` tracks the rendered width,
  including viewport height. Replaces the earlier "square pinned bottom-left, height
  min(column − 5rem, 68vw)" decision, which used a fixed 68vw cap instead of scaling S with
  section height. (2026-09-25 update, user's request: the portrait is about 10% bigger — S was
  min(column height − 5rem, 60vw), below `lg` the positioner was 185% starting 16% above; the
  photo's transparent headroom keeps the hair clear of the nav.)
- 2026-09-25 — Hero rebuilt to ui-spec §2: the network seed is 20260925; link reach is 120px below
  768, 160px above; agent nodes are the first seeded nodes outside the portrait frame and text
  keep-outs; keep-outs come from `[data-network-avoid]` inside the section; `HeroStage` imports
  `HeroName` and `HeroPortrait` itself.
- 2026-09-25 — Audit fixes: hero network keep-outs are now measured from untransformed layout
  boxes (`lib/heroNetworkLayout.ts`), so the GSAP motion pass can move the hero wrappers without
  breaking the keep-outs; the canvas also redraws on a device-pixel-ratio change; the h1 gets an
  `aria-label` built from the name keys; the portrait's `sizes` hint was corrected to track the
  rendered width at every breakpoint (phone `max(341px, calc(200vh - 941px))`, tablet
  `min(1470px, max(352px, calc(200vh - 930px)))`, desktop `min(max(640px, min(100vh, 1200px)),
  66vw)`), not a fixed fallback.
- 2026-09-25 — Re-audit closed (0 HIGH): the hero network's first draw now comes only from the
  ResizeObserver's first notification, and a draw is skipped when the canvas size and pixel ratio
  match the last one drawn, so load and zoom each draw once; the backing-store scale maths moved
  to `lib/backingScale.ts`.
- 2026-09-25 — The hero portrait has no fade on its left or right edges (the user's call,
  repeated); only the bottom fade (`mask-b-from-75%`) stays. Replaces the "right ~22% / left mask"
  part of the 2026-09-25 hero-redesign decision.
- 2026-09-25 — Both hero name lines are right-aligned at every width (user's request): WAQAS drops
  its `lg:ml-[calc(100%-4.6em)]` offset and is `text-right`. From `lg` WAQAS clears the frame's
  right edge once S > 4.38em (its left end still paints over the photo's right edge at 1366×768,
  1280×720 and 1440×780, by up to 42px); MUHAMMAD still tucks behind the shoulder. Replaces the
  "WAQAS offset to start over the chest" part of the earlier name decision.
- 2026-09-25 — User's request: the hero portrait is 10% bigger at every breakpoint (from `lg`,
  S = 1.1·min(column height, 66vw), frame `lg:h-[min(110%,72.6vw)]`, right offset and bottom
  anchor unchanged so it grows upward; below `lg` the positioner is 220% starting 19% above the
  frame; `sizes` scaled ×1.1). User approved the result, accepting that on desktop (1366, 1440,
  1920, 3840) the top of the hair now runs behind the nav links or touches the top edge. Replaces
  the "S = min(column height, 66vw) (a trial +10% bigger was reverted)" line.
- 2026-09-25 — First GSAP motion pass added (GSAP 3.15 + `@gsap/react`), per ui-spec §2.5 and the
  amended constitution §5: portrait fade-in, name lines rising from past their clip, side
  line/bottom row fade-up, blinking dot, scroll parallax and fade (`autoAlpha`) on the hero text,
  portrait parallax/scale, a pointer effect on fine pointers, and canvas network pulses on
  `gsap.ticker`; reduced motion keeps short opacity fades only.
- 2026-09-25 — User's change: the portrait's pointer effect is a 3D tilt facing the pointer, not a
  sideways drift — 1100px perspective, smoothed over 0.7s, easing flat when the pointer leaves the
  window or the hero leaves the screen; it never moves, so it combines with the unchanged scroll
  parallax/scale; fine pointers and full motion only. Replaces the ±9px sideways drift.
- 2026-09-25 — From `lg`, the light pool (`HeroBackdrop`) now scales with the 1.1× portrait so it
  stays centred on the head: `top` 100% − 0.77·min(H,66vw), `left` CR + 0.25em − 1.331·min(H,66vw).
  The lead checked the pool centre equals the head centre at 1440×900, 1920×1080 and 1024×768.
  Replaces the fixed "CR + 0.25em − 1.21S" pool offset.
- 2026-09-25 — User's request: the portrait's pointer tilt is subtler, just enough that the person
  seems to follow the cursor — ±3° `rotationY` and ±2° `rotationX` (was ±10°/±6°). The lead checked
  2.96°/1.96° at the corners and flat at the centre. Everything else about the tilt is unchanged.
- 2026-09-25 — User's request: `HeroBackdrop` now paints network → light pool → vignette → grain,
  so the pool glows over the network's lines. Replaces the earlier pool-then-network order.
- 2026-09-25 — User's request: the hero network's nodes each drift slowly and independently
  (seeded sine loops, 6–10px, 6–12s per axis, random phase, easing in over 1.5s), so every line
  moves on its own, and pulses ride the moving links. Drift is clamped so nodes never enter the
  text boxes, nor agents the portrait frame. The canvas redraws in full each tick on
  `gsap.ticker`; the cached static snapshot is dropped. Off screen, tab hidden, or under reduced
  motion it shows the plain static drawing. The lead checked at 1440×900: nodes moved ~10–15px
  independently over 3s with the lines following, at 145fps with no errors, and the canvas stayed
  identical across 6s under reduced motion.

## Open Questions

- **Review:** the h1 isn't a network keep-out, so faint nodes can sit behind the name letters — a
  visual call for the user to make.
- **Review:** between `md` and `lg` a bright agent node can land on the photo below the frame
  (audit NIT) — for the user to judge on screen.
- **Review:** on a slow load the finished hero can flash before the entrance runs, since content
  can't be hidden before JS by the rules — for the user to judge.
- **Review:** network pulses follow links that can pass under the text keep-outs, so 2px accent
  dots at full strength can move under the side line, tag and buttons, where the still nodes are
  kept out — should pulses be kept off those areas too?
