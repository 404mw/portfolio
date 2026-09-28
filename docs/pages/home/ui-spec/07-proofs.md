# §7 Proofs: UI spec

Shared rules and parts (§0): [`../ui-spec.md`](../ui-spec.md). Page doc: [`../sections/07-proofs.md`](../sections/07-proofs.md).

## 7. Proofs (the one question: have they built something real that people use?)

Visible name "Projects"; code, file and content keys stay `proofs`. Card template revised
2026-09-28 (user's decisions in `temp/brief.md` and the brief of that date; visual reference
`temp/proof-card-samples.html`, variant A "Ink stage"). The takeover (§7.3) is unchanged.

### 7.1 Section layout

- Section frame (`sectionIds.proofs`), plus `overflow-x-clip` on the `<section>`: a local
  guarantee against sideways scroll (the bot itself never reaches the viewport edge, see §7.2.1).
  Inner: `flex flex-col gap-12 md:gap-16`.
- Header: `flex flex-wrap items-end justify-between gap-6`: left `flex flex-col gap-7`
  (`SectionLabel`, `SectionHeading size="heading"`); right `<p class="{metaLabel}">` with `proofs.hint`.
- Grid: `<ul class="grid gap-x-12 gap-y-8 md:grid-cols-2 lg:grid-cols-3">`, one
  `<li class="pt-[11.2%]">` per project, in the order Exile, Design Vault, MARWIX-SKILLS.
  **The three cards are identical.** Phone: stacked. `md`: two across, MARWIX-SKILLS starts row two
  at the same width, left-aligned. `lg` and up: three across.
  - **Headroom:** the `li`'s top padding is 11.2% of the card's width (percent padding resolves
    against the grid area's width), which is the bot's top break-out (0.112 × banner width − 10px)
    plus a constant 12px, at every width. Clear space above each bot head: `gap-y-8` + 12 = 44px
    between stacked cards; header gap + 12 = 60px (phone) / 76px (`md`+) for the first row.
  - **Column gap** 48px (`gap-x-12`, was `gap-5`) holds the right break-out (≤ 25px) with ≥ 23px clear.

### 7.2 Card (`ProofCard`, server; one component, one set of inputs)

- **Inputs:** `href` (the project's hash), `project` (its `ProofKey`: picks the prop and the bot's
  ids), `number`, `tag`, `title`, `cardLine`, `proofLine`. The same for all three; no stats (~20,
  4k+) and no variant on any card. `shot` and `shotAlt` are gone.
- Each card is one `<a href="#exile">` (`#design-vault`, `#marwix-skills`) with `data-proof-card`,
  `aria-labelledby="{titleId} {openId}"` (unchanged), and
  `group flex h-full flex-col rounded-3xl bg-cream text-ink active:bg-cream/90 {focusRingCard}`.
  **`overflow-hidden` is removed** so the bot can break out; only the bot layer paints outside.
- **Banner** (`ProofBanner`, `aria-hidden="true"`; replaces the 16:10 shot):
  stage `relative m-2.5 aspect-[2.2/1]`, holding in order:
  1. Ground: `absolute inset-0 overflow-hidden rounded-xl bg-ink`, `style.backgroundImage` =
     `bannerGlow`, `bannerHatch` (§7.2.2): a violet glow rising from the floor over a faint 135°
     "/" hatch (1px lines every 13px).
  2. Break-out layer: `<div data-anim="proof-bot-layer" class="pointer-events-none absolute inset-0 [clip-path:inset(-120%_-60%_0_-60%)]">`.
     Its bottom edge is the **floor cut**: nothing paints below the banner floor; above and to the
     sides it lets the bot out. Holds `ProofBot`.
- **Text** (unchanged): `flex flex-1 flex-col gap-2.5 px-6 pt-5.5 pb-6.5`: meta row
  `flex justify-between gap-4 {metaLabelOnCream}` (`0n · tag` left; `proofs.open` + `ArrowUpRightIcon`
  right, `id={openId}`, `group-hover:text-ink`); title
  `<h3 id={titleId} data-anim="proof-card-title" class="font-display font-semibold text-card leading-none tracking-[-0.03em] decoration-1 underline-offset-4 group-hover:underline {condensed}">`
  (the bot layer is a sibling of this block, never inside the h3); line
  `mb-1.5 text-body leading-[1.45] text-cream-muted`; then `ProofLine`.
- **Proof line** (`ProofLine`): `<p class="mt-auto flex items-center gap-2.5 border-t border-ink/15 pt-3 font-mono text-meta leading-[1.3] font-medium tracking-[0.06em] text-ink uppercase">`
  → `<span aria-hidden="true" class="size-1.75 shrink-0 rounded-full bg-accent ring-3 ring-accent/25">`
  then the text. `mt-auto` pins it to the card foot, so the three rules line up across a row.
  Text is `ink` on `cream` (~17:1); the violet dot is decoration only.

| Part | Default | Hover | Focus-visible | Active |
|---|---|---|---|---|
| Card | `bg-cream text-ink` | title underline; open meta `text-ink`; (later) lift −8px | 2px `outline-text`, 4px offset, on dark; the bot may cover a few px of the ring at the top-right, the rest stays visible | `bg-cream/90` |
| Bot | the pose (lean 10°, look 7) | (later) leans +4°, prop act | none: decorative, the card owns focus | none |
| Proof line | `text-ink`, dot `bg-accent` | no change | n/a | n/a |

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

### 7.3 Takeover (`ProjectTakeover`, server markup; `TakeoverController`, client)

- **Element:** one `<dialog id="exile" aria-labelledby={titleId}>` per project (ids from
  `lib/routes.ts`), `fixed inset-0 z-50 m-0 hidden h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain border-0 bg-cream p-0 text-ink open:block [:root:not([data-takeover-js])_&:target]:block`.
  `TakeoverController` sets `data-takeover-js` on `<html>`, which switches the no-JS `:target`
  display off, so with JS only the dialog's `open` state shows it.
- **Behaviour:**
  - The card link sets the hash (a real history entry). `TakeoverController` (`hooks/useHashTakeover.ts`)
    reads the hash on load and on `hashchange`: a project hash calls `showModal()` on its dialog
    (native focus containment; the page behind is inert) and adds `overflow-hidden` to `<html>`.
    The hash is compared raw against the ids, never decoded: a malformed hash means no project.
  - **Every open takeover has a page entry beneath it.** A direct load on a project hash (a shared
    link, `/#design-vault`) rewrites its entry to `#proofs` and pushes the project hash on top, once.
  - **Close** (button), **Esc** (the dialog's `cancel` event, default prevented) and the browser
    **Back** button all end in the same place: `history.back()`. The hash change then closes the
    dialog, and focus returns to that project's card.
  - **Next project** replaces the hash (`location.replace`), so Back always closes rather than
    stepping through projects. It wraps from the last project to the first.
  - Close and Next click handling lives in `lib/takeoverLinks.ts`: Close raises the dialog's
    `cancel` (the Esc path); Next replaces the hash. A modified or non-primary click (new tab, new
    window) keeps the browser default.
  - **No JS:** `:target` shows the dialog; the Close link (`href="#proofs"`) and Back close it,
    and every part is readable.
  - Static: it opens and closes instantly. Screen check: the page doesn't jump on open.
  - The open takeover covers the nav (`z-50` over the header's `z-40`): accepted by the user.
- **Template: seven parts, identical for all three projects, shots included** (inside `data-anim="takeover-content"`):
  1. **Top bar**, `TakeoverTopBar`: `sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-ink/15 bg-cream px-gutter py-3 md:py-4.5 font-mono text-nav text-cream-muted`.
     Solid `bg-cream`, no blur, so its text keeps 4.5:1 over the shots scrolling beneath.
     Left: "PROOF 0n / 03 · tag", uppercase. Right: `TakeoverCloseLink` (client),
     `<a href="#proofs">` with `inline-flex min-h-11 items-center gap-2.5 rounded-full bg-ink px-4 font-mono text-nav font-medium text-cream hover:bg-accent hover:text-on-accent active:bg-accent/80 {focusRingOnCream}`:
     `proofs.takeover.close`, `proofs.takeover.escHint` (`aria-hidden`, `hidden md:inline`), `CloseIcon`.
  2. **Title:** `<h2 class="font-display font-semibold text-takeover leading-[0.88] tracking-[-0.045em] text-ink {condensed}">`.
  3. **Info rows** (`TakeoverInfoRows`): `<dl class="grid grid-cols-[5.5rem_minmax(0,1fr)] content-start gap-x-5 gap-y-3.5 text-body">`,
     labels `<dt class="pt-0.5 font-mono text-meta uppercase text-cream-muted">`: WHAT IT IS, BUILT, IN USE.
     The IN USE `<dd>` holds its line, then `TakeoverStats` when the project has `inUseStats`
     (only Exile does): `<ul class="mt-3 flex flex-wrap gap-x-8 gap-y-3">`, each `<li class="flex flex-col gap-1">`
     with the value `font-display font-semibold text-card leading-none text-ink {condensed}` over the
     label `font-mono text-meta uppercase text-cream-muted`. These are the only numbers in Proofs.
  4. **Summary:** `<p class="text-summary leading-[1.4] tracking-[-0.01em] text-pretty text-ink">`.
     Parts 3 and 4 share `grid gap-10 border-t border-ink/15 pt-8 md:grid-cols-2`.
  5. **Shots** (`TakeoverShots`): `flex flex-col gap-5`: one big `aspect-[2/1] overflow-hidden rounded-3xl`,
     then `grid gap-5 sm:grid-cols-2` of two details `aspect-[4/3] overflow-hidden rounded-3xl`.
  6. **Visit:** `ExternalLink` styled `inline-flex min-h-12 items-center gap-2 self-start rounded-full bg-ink px-6 text-body font-semibold text-cream hover:bg-accent hover:text-on-accent active:bg-accent/80 {focusRingOnCream}`
     with `ArrowUpRightIcon`. Exile → `links.exile` (the only place exile.marwix.dev is linked);
     Design Vault and MARWIX-SKILLS → their GitHub links.
  7. **Next project**, `TakeoverNextLink` (client): `<a href="#design-vault">`,
     `group flex flex-col gap-3 border-t border-ink/15 pt-12 pb-16 {focusRingOnCream}`: label
     `{metaLabel} text-cream-muted uppercase` + `ArrowRightIcon`, then the next title
     `font-display font-semibold text-heading leading-[0.95] tracking-[-0.04em] {condensed} group-hover:text-cream-muted`.
- Content column: `px-gutter` → `{container} flex flex-col gap-10 pt-10 md:gap-14 md:pt-16 lg:gap-18 lg:pt-22`.

### 7.4 Sizes

Card width W; banner width B = W − 20. Every bot size is a fixed fraction of B (one scale).

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Heading (`text-heading`) | 44px | 64px | 96px | 104px |
| Cards (W) | stacked, 320 | 2 across, 329 each; third on row 2 | 3 across, ~411 each | 3 across, 480 each |
| Grid gaps (column / row) | n/a / 32 | 48 / 32 | 48 / n/a | 48 / n/a |
| Row headroom (`li` `pt-[11.2%]`) | 36 | 37 | 46 | 54 |
| Banner (2.2:1) | 300×136 | 309×141 | 391×178 | 460×209 |
| Bot SVG box (112.5% of B, 160:116) | 338×245 | 348×252 | 440×319 | 518×375 |
| Bot scale (px per bot unit, B/142.2) | 2.1 | 2.2 | 2.75 | 3.2 |
| Bot seen: width / height (head to floor) | 216 / 170 | 223 / 175 | 282 / 221 | 332 / 260 |
| Top break-out (past the card's top) | 24 | 25 | 34 | 42 |
| Right break-out (past the card's right) | 12 (capped at gutter − 8) | 14 | 20 | 25 |
| Clear: bot head to the card or header above | 44 / 60 | 44 / 76 | n/a / 76 | n/a / 76 |
| Clear: bot's right to the next card / the viewport | n/a / 8 | 34 / 17 | 28 / 36 | 23 / wide |
| Card title (`text-card`) | 30px | 35px | 44px | 44px |
| Proof line | 12px mono, 1–2 lines; 1px `ink/15` rule; dot 7 + 3px ring | same | same | same |
| Takeover title (`text-takeover`) | 56px | 91px | 148px | 168px |
| IN USE numbers (Exile, `text-card`) | 30px | 35px | 44px | 44px |
| Summary (`text-summary`) | 20px | 22.6px | 26px | 26px |
| Info rows | label col 88 + 20 gap, values 212 | 2 cols with summary | same | same |
| Big shot | 320×160 | 706×353 | 1328×664 | 1536×768 |
| Detail shots | stacked, 320×240 | 343×257 each | 654×490 each | 758×568 each |
| Close / Visit | 44 / 48 tall | same | same | same |

Widest stacked (767): card 706, banner 686×312, bot 388 tall, top break-out 67 (headroom 79),
right break-out capped at 23. At 1024 the cards narrow from ~300 to 282 with the wider gap;
screen check that MARWIX-SKILLS still only wraps at its hyphen.

### 7.5 Content slots (`content/home.ts → proofs`; addresses in `content/home.ts → links`)

| Key | Meaning | Limit |
|---|---|---|
| `proofs.number` / `proofs.label` | "04" and the section label | 5 words |
| `proofs.heading.lead` / `.accent` | "Work that runs"-style heading; last word in violet | 6 words in total |
| `proofs.hint` | Tells the reader a card opens | 6 words |
| `proofs.open` | Card meta "Open" | 1 word |
| `proofs.projects.{exile,designVault,marwixSkills}.tag` | One-word kind (facts only) | 2 words |
| `.title` | The project name, as in facts | fixed |
| `.cardLine` | What it does for its users | 12 words |
| `.proofLine` | **New.** One concrete fact from `docs/03-facts.md` showing it's real and in use, as an outcome, never tech and never a stat: Exile in words (its ~20 / 4k+ stay in the takeover); Design Vault from "public since September 2026" or "MIT licence"; MARWIX-SKILLS from "free and open source". Shown uppercase by CSS | 8 words, ≤ 48 characters (two lines at 360) |
| `.rows.whatItIs` / `.built` / `.inUse` | Facts only; MARWIX-SKILLS BUILT and IN USE stay `[FILL: …]` until the facts file has them | 12 words each |
| `.rows.inUseStats[]` `{value, label}` (Exile only) | "~20" communities and "4k+" commands run, exactly as filled; shown in the takeover's IN USE row only | values fixed; labels 2 words |
| `.summary` | What it does for the people who use it | 40 words |
| `.shotAlts[3]` | What's on each takeover screenshot | 125 characters each |
| `.visitLabel` | Visit button text | 3 words |
| `proofs.takeover.proof` / `.close` / `.escHint` / `.next` | "Project", "Close", "Esc", "Next project" | 2 words each |
| `proofs.takeover.rowLabels.whatItIs` / `.built` / `.inUse` | WHAT IT IS / BUILT / IN USE | 3 words each |
| `links.exile` / `links.designVault` / `links.marwixSkills` | Addresses from facts | fixed |

**Removed:** `.cardShotAlt` (the card has no image).

### 7.6 Images (all through `SiteImage`; `null` placeholders until the user's files arrive; none may ship)

The card has **no image**: its banner is CSS and its bot is inline decorative SVG (like
`ProcessBot`), so neither goes through `SiteImage`. Each project has three images, all in its
takeover: `{project}Shot1`, `{project}Shot2`, `{project}Shot3` (`exile`, `designVault`,
`marwixSkills`). **Remove** `{project}Card` from `lib/images.ts` and `card` from `proofImages()`.

| Name (`lib/images.ts`) | Where | Ratio | Crop | `sizes` |
|---|---|---|---|---|
| `{project}Shot1` | Takeover big | 2:1 | `object-cover object-top` | `min(100vw, 1536px)` |
| `{project}Shot2`, `{project}Shot3` | Takeover details | 4:3 | `object-cover object-center` | `(min-width:1536px) 760px, (min-width:640px) 50vw, 100vw` |

### 7.7 Components and motion

- **Components:** `components/home/proofs/ProofsSection.tsx`, `ProofCard.tsx`, `ProjectTakeovers.tsx`
  (renders the three dialogs and the controller), `ProjectTakeover.tsx`,
  `TakeoverTopBar.tsx`, `TakeoverInfoRows.tsx`, `TakeoverInfoRow.tsx` (one `<dt>`/`<dd>` pair),
  `TakeoverStats.tsx`, `TakeoverShots.tsx`, `ProjectVisitLink.tsx` (the Visit pill),
  `TakeoverCloseLink.tsx` (client), `TakeoverNextLink.tsx` (client), `TakeoverController.tsx`
  (client, renders nothing); `hooks/useHashTakeover.ts`; `lib/proofs.ts` (project order, ids,
  image names, next project); `lib/takeoverLinks.ts` (Close and Next click handling).
- **New, one part per file (all server):** `ProofBanner.tsx` (stage, ground, break-out layer),
  `ProofBot.tsx` (the SVG and its tree), `ProofBotDefs.tsx` (gradients, strip clip, shadow filter),
  `ProofBotSolid.tsx` (one extruded shape), `ProofBotEye.tsx` (one recessed eye), `ProofBotProp.tsx`
  (the project's prop and its act parts), `ProofLine.tsx`. Data: `lib/proofBotBody.ts` (viewBox,
  lean, look, arms, glints; re-exports the Process geometry it reads), `lib/proofBotProps.ts`,
  `lib/proofBotDepth.ts`, `lib/proofBotShades.ts`. `lib/proofs.ts` gains `proofProp(key)` (Exile
  `phone`, Design Vault `fan`, MARWIX-SKILLS `puzzle`) and `proofBotIds(targetId)`, and drops `card`.
  `lib/processBots.ts`: `export` on `strips`, `feet`, `eyesAt` only. Later: `hooks/useProofBots.ts`,
  `lib/proofBotMotion.ts` (numbers).
- **Motion (later), takeover and cards:** cards reveal on scroll (stagger 0.12s); hover lifts a card −8px. Open: the
  dialog's `clip-path` expands from the card's rect (`data-proof-card`) to full screen (0.75s), and
  `takeover-content` rises 40px and fades in after 0.35s. Close: clip back to the card (0.6s), then
  the hash change. Next: content rises 60px and fades in. Reduced motion: no `clip-path`, no rise
  and no lift. Cards only fade in on reveal. On open and on Next the dialog shows at once and
  `takeover-content` fades in without the rise; close is instant, then the hash change.
  (Built; refined by the page doc's 2026-09-26 to 2026-09-28 decisions.)
- **Clip and the break-out:** the clip starts from the `<a>`'s rect only (`cardBox`, unchanged).
  The break-out stays outside it at the first frame and is covered as the clip grows; on close it
  reappears as the clip shrinks. `lib/takeoverClip.ts` and the title morph need no change.
- **Motion (later), the bot:** the bot never follows into the takeover.
  - **Reveal:** as its card reveals (so the three stagger 0.12s), `rise` goes from `y` +84 units
    (feet and all below the floor, hidden by the layer's clip) to 0 with a soft overshoot.
  - **Hover** (fine pointer, with the card's lift): `rig` rotates +4° (lean 10° → 14°), back on
    leave. The prop's act plays once per enter: the phone's `screen-lit` fades in and out; the fan's
    `swatch`es spread apart and close; the puzzle's `prop` tilts and snaps back to its grip with a
    small overshoot as `puzzle-lit` flashes.
  - **Idle:** `body` breathes (`scaleY`), arms drift, blinks (`eye` `scaleY`), and on a fine
    pointer `eyes` follow it along the gap diagonal (−7…7 around rest 7), as the Process bots do.
    Pause off screen, when the tab is hidden and while a takeover is open.
  - **Reduced motion:** no bot movement at all; the bot shows its pose and fades in with its card.
  - Teardown restores the server markup exactly (no leftover `style` or `transform` on hooks).

| Hook (`data-bot`) | Element | Pivot (bot units, rest space) | Moves (the only writers) |
|---|---|---|---|
| `rise` | g, outermost, screen space | none | `y` (reveal) |
| `rig` | g, inside the static lean | 50 92 | `rotation` (hover lean) |
| `body` | g | 50 84 | `scaleY` (breathing) |
| `eyes` | g `data-look="7"` | none (translate only) | `x`/`y` (pointer) |
| `eye` ×2 | g (wall, walls, hole) | 37 43 / 77 43 | `scaleY` (blink) |
| `arm-left` / `arm-right` | g | 6 53 / 94 53 | `rotation` (drift) |
| `prop` | g, inside `arm-left` | grip: phone −4 53, fan −8 56, puzzle −6 52 | `rotation`, `x`/`y` (act) |
| `screen-lit` / `puzzle-lit` | g, `opacity-0` at rest | none | `opacity` |
| `swatch` ×4 | g | −8 56 | `rotation` (spread) |

`data-anim` hooks: `proof-bot-layer` (the break-out layer), `proof-bot` (the SVG, with `data-prop`);
`data-proof-card` and `proof-card-title` unchanged.
