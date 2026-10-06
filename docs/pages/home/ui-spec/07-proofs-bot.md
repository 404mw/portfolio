# §7 Proofs: the card bot (§7.2.1–§7.2.3)

**Last Updated:** 2026-10-06 (new file). These three subsections moved here from
[`07-proofs.md`](07-proofs.md), unchanged, so that file stays a size one edit can rewrite. The §
numbers stay as they were.

Shared rules and parts (§0): [`../ui-spec.md`](../ui-spec.md). The card and its banner: `07-proofs.md`
§7.2; sizes: §7.4; the bot's motion and hooks: §7.7. Page doc: [`../sections/07-proofs.md`](../sections/07-proofs.md).

#### 7.2.1 The bot (`ProofBot`, server, static SVG; decorative)

- **Element:** `<svg viewBox="-40 -30 160 116" aria-hidden="true" focusable="false" data-anim="proof-bot" data-prop={prop}`
  `class="absolute bottom-0 left-[min(0px,calc(var(--spacing-gutter)+2px-7.6%))] aspect-[160/116] h-auto w-[112.5%] overflow-visible [mask-image:linear-gradient(to_top,transparent,var(--color-ink)_10%)]">`.
  The SVG's bottom edge is the floor (y 86). The mask fades the last 10% (≈12 units) of the body
  to transparent, so it sinks into the glow; the feet sit below the floor, cut by the layer.
- **Break-out containment:** at `left: 0` the bot's right edge sits at 107.6% of the banner, so it
  passes the card's right edge by 7.6% of the banner − 10px. The `min()` shifts the bot left only
  when that would come within 8px of the viewport (break-out capped at gutter − 8px). This engages
  only on stacked phones (12px at 360, 23px at 767); from `md` it never does. The bot is never
  clipped, and the section's `overflow-x-clip` only trims the empty SVG box and the shadow tail.
- **Geometry, read-only from `lib/processBots.ts`:** `strips`, `feet` and `eyesAt` (add `export`
  only; values, `botRig` and `ProcessBot.tsx` unchanged); pivots from `botPivots` (`rig` 50 92,
  `body` 50 84, `eye[7]` 37 43 / 77 43, `armLeft` 6 53, `armRight` 94 53). Arms are the Process
  idle arms, `-4 50 10 6` and `94 50 10 6`, kept as a constant in `lib/proofBotBody.ts`.
  Pose: lean 10°, look 7 (`eyesAt[7]`), as in the approved sample.
- **Tree** (paint order; no `transform` on any `data-bot` element; the lean is a static wrapper):

  ```
  defs (ProofBotDefs)            ids `proof-bot-{targetId}-{name}`: always start with "p", never hex-like
  g rise                         screen-space; the reveal's y
  └ g filter=url(#…-shadow)
    └ g transform="rotate(10 50 92)"   the pose; no hook
      └ g rig
        ├ g arm-left   → arm solid; g prop → prop solids, details, act parts
        ├ g body       → depth of feet + strips (all), feet fronts, strip fronts,
        │                g eyes[data-look=7] → g eye ×2, glint ×2 (clipped to the strips)
        └ g arm-right  → arm solid
  ```
  The left arm paints before the body (its depth tucks under strip A); the right arm paints after
  it (its front covers strip C's side face where it leaves it). That's the sample's occlusion,
  with each arm free to move alone.
- **Solid** (`ProofBotSolid`, one extruded shape): its depth steps, farthest first, each the shape
  in `<g transform="translate(0.55i 0.7i)">` filled with that step's side mix, then the front, filled
  with its material's gradient and a 0.7 stroke of `rim`. Body and arms: 6 steps (3.3 × 4.2 units
  deep); props: 5. The depth stays shallow and its sides dark, so the MW mark's diagonal gaps read.
  A rotated piece (fan swatch) puts its rotation on each path inside the translate, so depth always
  runs down-right. Flat details: plain fill, no depth, no rim.
- **Precomputed, not computed:** shape strings are hardcoded in `lib/proofBotBody.ts` and
  `lib/proofBotProps.ts`; the depth steps (offset and mix % per step) are a literal table in
  `lib/proofBotDepth.ts`. The server maps them to markup; nothing runs on the client.
- **Eye** (`ProofBotEye`, recessed hole, 14 × 14 at `eyesAt[7]` x y): wall `M x y h14 v14 h-14Z` in
  `eyeWall`; top wall `M x y H x+14 V y+4.2 H x+3.3 Z` in `eyeWallTop`; left wall
  `M x y L x+3.3 y+4.2 V y+14 H x Z` in `eyeWallLeft`; hole `(x+3.3, y+4.2) 10.7 × 9.8` in `eyeHole`.
- **Light:** from the top-left. Front gradient `userSpaceOnUse` (−30 0) → (100 92), stops 0 light,
  .45 mid, 1 shade. Rim (−20 0) → (80 80), `rim` at .8 → 0 by .6. Glints: radial `glint`,
  ellipses `cx 32 cy 26 rx 24 ry 9 rotate(-45 32 26)` and `cx 78 cy 30 rx 12 ry 5 rotate(-45 78 30)`
  at .7. Shadow: `feDropShadow dx 2.5 dy 5 stdDeviation 3.5`, `shadow` at .5, region −40% / 180%.
- **Colour is applied through `style`** (`fill`, `stopColor`, `floodColor`) from §7.2.2, never
  as presentation attributes, and **never on a `data-bot` element**: GSAP clears hook styles, so
  hooks wrap coloured shapes.

#### 7.2.2 Shade roles (`lib/proofBotShades.ts`; no new tokens)

Every value is a token expression. `mix(a p%, b)` = `color-mix(in oklab, var(--color-a) p%, var(--color-b))`.
The file exports one named table, so a future token swaps a role in one place.

| Material | light (0) | mid (.45) | shade (1) | sideNear | sideFar |
|---|---|---|---|---|---|
| `violet` (body, arms) | `mix(accent 40%, cream)` | `accent` | `mix(accent 75%, ink)` | `mix(accent 50%, ink)` | `mix(accent 18%, ink)` |
| `cream` (phone, puzzle, swatch) | `text` | `cream` | `mix(cream 84%, ink)` | `mix(cream 66%, ink)` | `mix(cream-muted 80%, ink)` |
| `ink` (swatch, rivet) | `mix(line 75%, muted)` | `mix(band 50%, line)` | `ink` | `ink` | `bg` |
| `muted` (swatch) | `mix(muted 50%, cream)` | `muted` | `mix(muted 76%, ink)` | `mix(cream-muted 85%, ink)` | `line` |

- **Depth step** i of n (1 nearest): `color-mix(in oklab, {sideNear} {100 − 100(i−1)/(n−1)}%, {sideFar})`;
  n 6 → 100/80/60/40/20/0%, n 5 → 100/75/50/25/0%.
- **Eyes:** `eyeWall` `mix(accent 22%, ink)`, `eyeWallTop` `mix(accent 12%, ink)`, `eyeWallLeft`
  `mix(accent 30%, ink)`, `eyeHole` `ink`.
- **Light:** `rim` and `glint` `cream` (alpha by `stop-opacity`); `shadow` `bg` (`flood-opacity` .5).
- **Details:** `screen` `ink`; `screenLit` `mix(accent 30%, ink)`; violet details `violet.mid`/`.light`.
- **Banner:** `bannerHatch` `repeating-linear-gradient(135deg, color-mix(in oklab, var(--color-text) 5%, transparent) 0 1px, transparent 1px 13px)`;
  `bannerGlow` `radial-gradient(90% 110% at 62% 125%, color-mix(in oklab, var(--color-accent) 34%, transparent), transparent 62%)`.

#### 7.2.3 Props (`lib/proofBotProps.ts`; left hand; geometry from the sample)

| Prop, `data-prop` | Solids (material) | Flat details | Act part (hook) | Grip pivot |
|---|---|---|---|---|
| `phone` (Exile): a game on a phone with a chat on top; no Discord or game art | `M-24 28h20v38h-20Z` (cream) | screen `M-22 32h16v28h-16Z` `screen`; speaker `M-17 29.5h6v1.4h-6Z` `muted.mid`; gem `M-14 34L-10 38.5L-14 43L-18 38.5Z` `violet.mid`; gem top `M-14 34L-10 38.5H-18Z` `violet.light`; bubble `M-21 46.5h13v6h-7l-2.5 2.5v-2.5h-3.5Z` `cream.mid`; dots r 0.9 at (−17.5 / −14.5 / −11.5, 49.5) `screen`; home bar `M-14 62h4v1.4h-4Z` `muted.mid` | `screen-lit`: the screen shape in `screenLit`, `opacity-0`, painted right after the screen | −4 53 |
| `fan` (Design Vault) | 4 swatches `M-12 26h8v34h-8Z` rotated about −8 56 by −50 (ink), −32 (muted), −14 (cream), 4 (violet); rivet circle −8 56 r 2.4 (ink), last | chip `M-11 28h6v5h-6Z` per swatch: `violet.mid`, `screen`, `violet.mid`, `screen` | `swatch` ×4: each swatch's own group, no transform | −8 56 |
| `puzzle` (MARWIX-SKILLS) | `M-30 40H-22A4 4 0 1 1 -14 40H-6V48A4 4 0 1 1 -6 56V64H-30Z` (cream) | stripe `M-15 46H-11L-19 60H-23Z` `violet.mid` | `puzzle-lit`: the stripe in `violet.light`, `opacity-0` | −6 52 |
