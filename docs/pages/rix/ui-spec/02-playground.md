# §2 Playground: UI spec

Shared rules (§0, and §0.4 for what runs): [`../ui-spec.md`](../ui-spec.md). Rix himself:
[`../../home/ui-spec/00-rix.md`](../../home/ui-spec/00-rix.md) (R10 is the base). Page doc:
[`../sections/02-playground.md`](../sections/02-playground.md).

## 2. Playground (the one question: how do I make Rix act?)

### 2.1 Layout and classes

```
RixPlayground (server)  <section id="rix-playground" aria-labelledby="rix-playground-title" class="px-gutter">
                        → <div class="{container} pt-6 pb-section md:pt-8">
  <h2 id="rix-playground-title" class="sr-only">{playground.heading}</h2>
  <noscript><p class="{metaLabel} mb-6">{playground.noScript}</p></noscript>
  RixControls (client, owns useRixPlayground; children = <RixStage/>)
    band   <div class="z-10 bg-bg pb-4 [@media(min-height:40rem)]:sticky [@media(min-height:40rem)]:top-17">
      RixStage → AboutPosterShelf className="pt-20" quipKey="rix-playground"
                 size="w-51 h-33 md:w-68 md:h-44 lg:w-85 lg:h-55"  quipText="text-nav md:text-body-lg"
                 quipPlacement="bottom-full left-0 mb-4 w-max max-w-40 text-left md:mb-5 md:max-w-56 lg:mb-6 lg:max-w-72"
      RixReadout  <p aria-live="polite" class="mt-6 font-mono text-meta text-muted md:mt-8 lg:mt-10">{nowPlaying}: {label | idle}</p>
    rest   <div class="mt-8 flex flex-col gap-8">
      toggle  <div class="flex flex-wrap gap-2 motion-reduce:hidden"> → RixPlayButton aria-pressed={patrol}: {patrolToggle}
      note    <p class="hidden max-w-xl text-body text-muted motion-reduce:block">{reducedNote}</p>
      groups  <div class="grid gap-8 md:grid-cols-2 xl:grid-cols-5 motion-reduce:xl:grid-cols-2">
        RixGroup  <div role="group" aria-labelledby={id} class="flex flex-col gap-3"> → <h3 id class="{monoLabel}"> → <div class="flex flex-wrap gap-2"> RixPlayButton ×n
```

- **The stage** is the 2px `line` floor with Rix at its right end. It has no slots and no props on
  the floor (choice 2, resolved 2026-10-02). The 80px headroom (`pt-20`) holds the quip.
- **The quip** sits above Rix, left-aligned to his box, at every width. It has no `data-[side]`
  classes, so R5.3's side has no effect. Its width is never more than the box's, so it can't
  overhang the container.
- **The band** stays in view while the buttons scroll, on viewports at least 40rem tall, so Rix is
  always seen (and live) when a button is pressed. It sits under the header (`z-40`).
- **`RixPlayButton`:**
  `<button type="button" class="{chip} cursor-pointer disabled:cursor-default {states} {focusRing}">`.
  It's `disabled` until hydrated (`useHydrated`), so the layout doesn't shift on hydration.
- **Walk buttons** go to the left end (`minX`), the centre and the right end (`x` 0), the whole way
  at `WALK` (choice 3, resolved 2026-10-02). `curious` looks at the end he walked to.

| Element | Default | Hover | Focus-visible | Active | Playing / pressed |
|---|---|---|---|---|---|
| Rix (`about-rix`) | static idle | the perk; a fine pointer resting `PET.hover` is a pet | `focusRingCard`, travelling with the walker | a poke-ladder step (a hmph in the sulk); a touch held `PET.press` is a pet | n/a |
| `RixPlayButton` | `border-line text-muted` | `enabled:hover:border-muted enabled:hover:text-text` | `focusRing` | `active:bg-band` | `data-[playing]:border-accent data-[playing]:text-accent`; toggle `aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:text-on-accent` |

### 2.2 Sizes (Rix: 1 unit = box width ÷ 170)

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Content / shelf | 320 | 706 | 1328 | 1536 |
| **Rix box, unit** | **204×132, 1.2** | **272×176, 1.6** | **340×220, 2.0** (from `lg`) | **340×220, 2.0** (choice 5, resolved 2026-10-02) |
| Track (shelf − box) | 116 | 434 | 988 (602 at 1024) | 1196 |
| Quip: size, max width, gap above box | 13px, 160, 16 | 16px, 224, 20 | 16px, 288, 24 | same |
| Paint above the box (zzz, 10 units) / below the floor (toss end, 18 units) | 12 / 21.6 | 16 / 28.8 | 20 / 36 | same |
| Floor to readout | 24 | 32 | 40 | 40 |
| Sticky band height | 273 | 325 | 377 | 377 |
| Walk to the far end (`WALK`, stride-locked) | 5 strides, 0.9s | 15, 2.4s | 27, 4.2s | 33, 5.1s |
| Note (2026-10-03): the buttons use `WALK_FAR` (ramped cadence), so measured far-walk times are 1.05 / 2.59 / 4.39 / 5.29s; the row above is ~0.15–0.19s low | | | | |
| Patrol stretch | 96–116 (clamped) | 96–240 | 96–240 | 96–240 |
| Flee / stomp walk (capped) | 116 / 116 | 400 / 120 | 400 / 120 | 400 / 120 |
| Groups | 1 col, gap 32 | 2 cols, 337 | 5 cols, 240 (`xl`) | 5 cols, 282 |
| Buttons | 44 tall, `text-body`, wrapping | same | same | same |

- **No sideways scroll:**
  - The glyphs, juggle, balance and peek all paint inside the box sideways (R3.2, R6).
  - The quip is at most 160 / 224 / 288 wide, inside the 204 / 272 / 340 box.
  - The toss is clamped to the room minus 8px, and walks are clamped to the shelf.
- **The 360 track:** 116px clears `PATROL.minStretch` (48) and the shortest stretch (96).
- **Contrast:** `muted` on `bg` is about 6.9:1, `accent` about 8.6:1, and `on-accent` on `accent`
  about 9:1.

### 2.3 Content slots (`content/rix.ts → playground`; copywriter; playful, no claims)

| Key | Meaning | Limit |
|---|---|---|
| `heading` | Screen-reader heading for the controls | 4 words |
| `groups.{emotions,moves,plays,moods,glyphs}` | Group headings | 2 words each |
| `emotions.{happy,excited,curious,shy,surprised,confused,sleepy,sad,annoyed,angry,love}` | Button labels | 1 word each |
| `moves.{walkLeft,walkCentre,walkRight,talk,perk,wave,pick,pet,arrive}` | Button labels. `walk*` replace `walkFirst`, `walkMiddle` and `walkLast`; `nudge` is dropped. `pick` says "prop", not "pick" | 3 words each |
| `plays.{juggle,juggleDrop,sit,nap,wake,tagDodge,tagDuck,peekaboo,logoPose,balance}` | Button labels | 3 words each |
| `moods.{poke,annoyed,tantrum,tantrumPick,sulk,forgive,calm}` | Button labels; `tantrumPick` and `calm` say "prop" | 3 words each |
| `glyphs.{alert,question,heart,hearts,burst,sparkle,drop,dots,vein,grawlix,zzz}` | Button labels | 2 words each |
| `nowPlaying` · `idle` | The readout's lead · the readout when he's still | 2 · 1 word |
| `patrolToggle` | Toggle: let him wander the floor | 4 words |
| `talkSample` | The Talk button's line, two quip lines at most | 30 characters |
| `reducedNote` | Shown only under reduced motion: his moving tricks are off because the device asks for less motion, and talk, props and moods still work | 16 words |
| `noScript` | The buttons need JavaScript | 12 words |

- **Dropped from `rixSheet`:** `letter`, `name`, `line`, `slotLabel`, `reducedToggle`.
- **Rix's own lines and `buttonLabel`** stay in `about.rix` (§0.4).

### 2.4 Reduced motion, components, images, motion

- **Reduced motion (choice 1, resolved 2026-10-02: hide the moving buttons and show the note):**
  `lib/rixPlayground.ts` flags each command `reduced: true` when it has an R8.1 version: `talk`,
  `pick` and `pet`, and all seven moods.
  - Other buttons get `motion-reduce:hidden`. A group with none (emotions, plays, glyphs) hides
    whole.
  - The note shows, and the patrol toggle hides.
- **Components:** `RixPlayground`, `RixStage`, `RixControls`, `RixReadout`, `RixGroup` and
  `RixPlayButton`, all in `components/rix/`. `AboutPosterShelf`, `Rix`, `RixButton` and `RixQuip`
  are extended (index §0.3). **Images:** none.
- **Motion (later):**
  - **Rix:** per `00-rix.md` with §0.4's switches, with the hooks unchanged (R1.3). The
    `about-rix-stage` is the band's shelf.
  - **The band:** `data-anim="reveal"` with `data-anim-delay="150"` on load. Under reduced
    motion it fades only.
  - The buttons, readout and toggle don't move.
