# Rix: character sheet (the mascot, defined once)

Shared rules (§0): [`../ui-spec.md`](../ui-spec.md). Rig and Process constants: [`05-process.md`](05-process.md) §5.6–5.7.
About options and the built O4 play: [`02a-about-options.md`](02a-about-options.md). Page doc: [`../sections/02a-about.md`](../sections/02a-about.md).

**Last Updated:** 2026-10-05 (rev 4). Rev 2: the user's decisions of 2026-10-02 (alive and
playful; talk is eyes and body; B walks the shelf; idle plays; named emotions; one source for Rix),
then R12 resolved, P1–P3 approved and P4 dropped, and the poke-mood ladder (R6A). **Rev 3:** the
user's feedback after trying Rix on `/dev` (R12 rows 12–15): pixel glyphs for the emotions (R3.2),
a `love` emotion with pets and the pick's hearts (R3.1, R6B), a stride-locked gait with no dash and
card walks that stop partway (R4.2–R4.6), and no home: he patrols (R4.8). **Rev 4 (2026-10-05,
home's About only; R12 rows 18–24):** a busy tempo for his first 6 live minutes, then a settled one
(R7); short idle beats built from existing moves (R6.8); hover mode: at a hovered or focused card
he keeps moving and talks about that card (R4.9); idle chatter, pre-pick and post-pick, with the
nudges folded in and `NUDGE_MAX` lifted (R5.4, R7); and the pick lock: About's cards can't be
picked from the tantrum's start to the forgive's end (R6A.9), so calm by a pick (R6A.8) is now
playground-only. The `/rix` playground is unchanged (schedulers off). **This file is the single
source for Rix.** A move or rule that isn't here isn't Rix's. Used first by §2a option B. Process
adopts it in a later pass, and until then keeps §5.7 as it stands. Motion only: the static page
doesn't change, apart from the hooks in R1.3 and the lock classes in R6A.9. No new tokens.

**Supersedes / extends (02a-about-options.md is not edited; where they differ, this sheet wins):**
- **O4 "Life: no naps":** B naps (R6.3). The host role gains the zzz group. A and C don't change.
- **O4 poke → the poke ladder (R6A):**
  - Pokes 1–3 play the O4 giggle as built, with `happy` and the typed line (R5.2, from 0.5 not
    0.1). Pokes 4–5 play `annoyed`, and poke 6+ plays the tantrum, flee, sulk and forgive.
  - `POKE_COOLDOWN` (0.9) now gates **acts, not presses**. A press inside it is counted and queued
    (R6A.1), so a rapid clicker reaches the tantrum.
  - A poke no longer always cuts: a tantrum or sulk outranks it (R2.1).
- **O0.1 `RixStatus` "only the poke line":** it now gets the ladder's lines and, when the tantrum
  throws a pick away, `rix.throwAway` (R1.4). **Rev 4:** also `lockLine` and `unlockLine` (R6A.9).
- **O0.2 "only `?for` dispatches an untrusted `change`":** the tantrum's deselect does too (R6A.4).
- **O4 nudge:** the second bounce (0.55) is replaced by talk bobs, and the line types out.
  `NUDGE_BOUNCE.at` becomes `[0.1]`.
- **O4 nudge clock (rev 4):** retired on home's About. The nudge act is now the pre-pick chatter
  act, on the idle talk clock (R7). `NUDGE_MAX` (4, decided 2026-10-01) is lifted: no cap per
  load. The nudges no longer stop on a pick; the chatter switches to the post-pick pool instead.
  Under reduced motion, "one nudge line, once" becomes the faded chatter (R8.1).
- **O0 "never a gate" (rev 4):** still true on arrival and for the whole page, with one exception:
  About's six cards are locked for about 10s while Rix throws a tantrum (R6A.9).
- **`QUIP_IN`:** for typed lines the box shows at once and its characters reveal. `QUIP_HOLD`
  counts from the last character. `QUIP_OUT` and reduced motion are unchanged.
- **`PEEK_SPOT` and the pick's eye pop:** both keep the pop. The peek adds the `surprised` eyes;
  the pick holds the `excited` eyes until 0.6, then shows `love` eyes and the heart burst (R6B.4).
- **B quip placement:** gains a right-side variant (R9). **B shelf:** Rix sits in a walker (R1.3).
- **O4 adaptation table, B column:** replaced by R9. A and C keep O4 as built (R12.3).
- **Rev 2 → rev 3:** home, the stroll home (`STROLL`, `WALK_HOME_AFTER`), the dash
  (`DASH_PACE`, `WALK.dashAbove`) and speed-based leg durations are removed. The flee and the
  stomp walk are capped in distance (R6A.5). The "no glyph for annoyed or angry" rule is removed.
- **Rev 3 → rev 4:** the play clock (`PLAY.first`, `PLAY.gap`, `PLAY.retry`) and the nudge clock
  (`NUDGE_*` except `NUDGE_BOUNCE`) give way to the idle clock (`TEMPO`, `IDLE_MENU`, `IDLE_TALK`,
  R7). The pointer-near skip (`NUDGE_QUIET`) is gone. "Holds `curious` while the target holds" is
  replaced by hover mode (R4.9). R6A.8 applies to the playground only.

---

## R1. Anatomy

### R1.1 Identity (never changes)

- **Rix is the user's gap-eyes MW mark as a character.** He is never Clawd and never any other
  mascot. The body is the three "/" strips plus two feet, all `fill-accent`. At rest his
  silhouette is exactly the logo.
- **The face is the two square eyes, and only them.** The eyes are the logo's gaps, holes drawn
  in `fill-bg`.
  - Nothing is ever added to the face: no mouth, brows, cheeks, lids or blush.
  - Emotion comes only from:
    - the eye rects' `x`/`y`/`width`/`height` (and, for `angry` and `love` only, their
      `rotation`, R3.1; `love` also beats their `scale`)
    - the look, the body, the arms and the feet
    - one emote glyph above the head (R3.2)
- **He is never mirrored.** No `scaleX: -1` on `rig`, `upper` or `body`, because a mirrored MW is
  not the mark. Facing comes from the eyes and the lean (R4.4). The sulk's squeeze (R6A.6) is a
  positive `scaleX` (0.92), so it isn't a mirror.
- **Flat token fills only:** no strokes, gradients, filters or blur, and no colour outside
  `botFills`. Glyphs are `fill-muted`, or `fill-accent` for `hearts` and `grawlix` only.
- **He stands only on `bg`.** The eye holes are `fill-bg`, so he never stands on `band` or `cream`.

### R1.2 Geometry (viewBox `-30 -18 170 110`; 1 unit = box width ÷ 170)

| Part | Where (viewBox units) | Hook / pivot |
|---|---|---|
| Body (strips A, B, C) | x 6–94, y 8–85; centre x 50 | `body` 50 84; `upper` 50 84 |
| Eyes, rest look 0 | L `23,43 14×14`, R `63,43 14×14`; centres 30 50 / 70 50; each sits on a strip gap (x + y = 80 / 120) | `eyes` (translate: x = d + p, y = −d + p); `eye` ×2 |
| Feet | tips 26 90 / 72 92; the box bottom (y 92) is the ground. Walking offsets `x` ±`footReach` (at most ±12, the flee), always inside the box | `foot-left`, `foot-right` |
| Arms | L rect −4..6, R rect 94..104, y 50–56; shoulders 6 53 / 94 53. + rotation: left arm up, right arm down | `arm-left`, `arm-right` |
| Prop slot | right hand, x 106–130, y 23–50; centre 118 36.5 | `prop`, pivot `PROP_PIVOT` 118 50; spin pivot `TOSS.origin` 118 36.5 |
| Left-hand catch | the prop slot moved x −134 (x −28..−4) | juggle only |
| Emote slot | x 86–128, y −16..2, up-right of the head. Hearts rise to y −24; the pick's burst sits over the prop (x 103–133, y 4–24) | `emote` (R3.2) |
| zzz | x 88–126, y −18..6, rising to y −28 | `z` ×3 (Process paths) |
| Whole drawing | `rig`, pivot 50 92 | the peek and sit (`y`), the summed rotation |

### R1.3 Markup (static; nothing renders differently)

```
div data-anim="rix-walker" class="relative shrink-0"        ← in RixButton; the walk's only writer (x)
└ button data-anim="about-rix" (span without JS)            ← as built, + [-webkit-touch-callout:none] (the long-press pet, R6B.1)
  ├ svg data-anim="process-bot" data-role="host"            ← as built, plus:
  │   upper → … RixProps, then RixEmotes: g data-bot="emotes" → one entry per glyph (R3.2):
  │     one-part glyph:  path data-bot="emote" data-emote={name} class="{fill} opacity-0"
  │     multi-part glyph: g data-bot="emote" data-emote={name} class="opacity-0"
  │                         → path data-emote-part={part} class="{fill}" (+ opacity-0 where R3.2 says)
  │   host gains the zzz group (lib/processBots.ts botRig: zzz for rules, update and host)
  └ span data-anim="about-quip-anchor" aria-hidden          ← RixQuip's outer span gains this hook; motion sets data-side
    └ span data-anim="about-quip" → one span data-quip-char per character (Array.from(line))
RixStatus (sibling of the walker, as built)
```

- Character spans are plain inline spans, so lines only break at spaces, as before. Server
  markup is empty, as before.
- Everything in R1.3 is a decorative extra that starts hidden (`opacity-0`), or has no visual
  effect until motion moves it. `{fill}` is the literal class `fill-muted` or `fill-accent`, from
  each glyph's `fill` in `lib/rixGlyphs.ts`.
- The poke ladder (R6A) and the pet (R6B) need no other markup. The toss moves the existing
  `prop`, and the deselect works on the option's own radios.
- **Rev 4:** the beats (R6.8) and hover mode (R4.9) need no new markup. The pick lock (R6A.9)
  adds `group/board` to the board's fieldset and its state classes to the cards; JS sets
  `data-locked` and `aria-disabled` only while a tantrum runs.

### R1.4 Sizes and access

| Where | Classes | Box (px) | 1 unit | Interactive |
|---|---|---|---|---|
| Process, below `lg` / from `lg` | `h-14.25 w-22` / `lg:h-22 lg:w-34` | 88×57 / 136×88 | 0.52 / 0.8 | no |
| About A | `w-51 h-33 md:w-68 md:h-44 lg:w-85 lg:h-55` | 204 / 272 / 340 wide | 1.2 / 1.6 / 2.0 | yes |
| About B and the dev sheet | `w-34 h-22` | 136×88 at every width | 0.8 | yes |
| About C | `w-34 h-22 md:w-51 md:h-33` | 136 / 204 wide | 0.8 / 1.2 | yes |

- **Tap target:** the full box, never under 136×88. The walker moves the box with the drawing.
- **Name:** `about.rix.buttonLabel`. The SVG, quip and emotes are `aria-hidden`.
- **`RixStatus`** (`aria-live="polite"`) gets, as a whole line when the act starts and never
  letter by letter:
  - the ladder's lines: `pokeLines` (1–3), `annoyedLines` (4–5) and `angryLines` (6+)
  - or, when the tantrum throws a pick away, `throwAway` at the release, in place of the angry
    line
  - **rev 4, home's About:** `lockLine`, appended to the tantrum's line (the angry line, or
    `throwAway`), and re-said on a swallowed press; `unlockLine` at the unlock (R6A.9)
  - Never announced: nudges, talk, emotions, glyphs, plays, the patrol, pets and `petLines`, the
    sulk line, the forgive line and the hmph. **Rev 4:** nor the beats, hover mode, its lines
    (`hoverLines`, `hoverAnyLines`, `switchLines`) or the idle chatter (`idleLines`,
    `afterPickLines`).
- **Focus:** nothing Rix does moves focus or scrolls. That includes the deselect: focus stays
  where it is. A focused radio stays focused and tabbable, **including during the pick lock**
  (`aria-disabled`, never `disabled`, R6A.9). While Rix has focus the patrol holds still (R4.8),
  so the ring doesn't wander from a keyboard user.
- **The pet is a pointer extra.** Keyboard users lose nothing: Enter and Space stay pokes.
- **Contrast:** `fill-muted` glyphs on `bg` about 6.9:1; `fill-accent` glyphs about 8.6:1.

---

## R2. Rules of play

### R2.1 Priority (one act at a time)

| Rank | Act | Starts on | If a higher act runs | It cuts | Limits |
|---|---|---|---|---|---|
| 1 | **pick** | a trusted change on the option's group | **Home's About:** never blocked, except by the pick lock: from the tantrum's start to the forgive's end the visitor's press is swallowed and nothing changes (R6A.9). **Playground:** never blocked; during a tantrum, flee or sulk it plays `CALM` first (R6A.8) | everything below (a walk, stretch or flee brakes in place, `WALK_STOP.brake`) | none. `?for` shows the prop with no act |
| 2 | **tantrum** (stomp, toss, flee, sulk, forgive) | poke count ≥ `POKE_LADDER.tantrum`, through its gate (R6A.1) | About: nothing (picks are locked). Playground: a pick turns it into `CALM` | walk or stretch (brake), hover mode, talk (the line is replaced), chatter, beat, play, pet, poke | presses during it don't count (the sulk answers with a hmph). Hover and focus targets, pets, chatter, beats, plays, the patrol and tag are ignored until the forgive ends. On About it locks the picks (R6A.9) |
| 3 | **poke** (happy, annoyed) | click, tap, Enter or Space on Rix | ignored and not counted during a pick, a calm or a tantrum, and before landing | walk or stretch (brake), hover beat, talk (the line is replaced), chatter, beat, play, pet (`love` Out 0.15) (R2.2) | acts `POKE_COOLDOWN` 0.9 apart; presses inside it queue (R6A.1) |
| 4 | **pet** (`love`, R6B) | a fine pointer resting on Rix `PET.hover`, or a touch long-press `PET.press` | ignored during a pick, calm, tantrum, flee, sulk or annoyed hold, and before landing. Otherwise the rest timer restarts when the higher act ends, if the pointer still rests | walk or stretch (brake), chatter, beat, play, perk | one per hover or press; `PET.rest` apart; never counts as a poke |
| 5 | **walk and hover mode** (to a card, R4.9) | a card target held `WALK.dwell`; after a pick | waits, and starts when they end if the target still holds | talk (the line fades out over 0.2), chatter (the arm eases back over 0.3), beat, play, stretch (brake) | `WALK.minDist` 12px; at most `WALK.reach` 200px (R4.1). Hover beats and lines per R4.9 |
| 6 | **talk** | a poke, pet, sulk, forgive or ladder line (the visitor's own doing); a hover line or chatter line (scheduled) | an overlay: the line always types | — | one line at a time. A visitor-driven line cuts the old one; a scheduled line never starts while a line shows (R5.4) |
| 7 | **chatter** (was the nudge; R5.4, R7) | the idle talk clock (`IDLE_TALK`) | waits for the current act and any showing line, then takes the next idle slot. Skipped while a card target holds (hover mode talks instead), the mood isn't neutral, or he naps | — (it waits; it never brakes a stretch) | no cap per load (`NUDGE_MAX` lifted) |
| 8 | **beat or play** (R6, R6.8) | the idle clock (`TEMPO`), a pointer approach (tag), visitor idle (nap, settled phase only) | waits; retried every `TEMPO.retry` | a patrol pause, idle | R7 |
| 9 | **patrol** (R4.8) | busy phase: a stroll from the idle clock. Settled phase: `PATROL.resume` after the last act, then each pause's end | a stretch brakes in place (`WALK_STOP.brake`); the patrol resumes `PATROL.resume` after the higher act ends | idle | R4.8 lists when no stretch starts |
| 10 | **idle** | — | — | — | Process life layers 1–4 |

- **Arrival** (`entering`) blocks everything until landing, then plays its ask (as built).
- **Perk** (hover on Rix) plays from idle or the patrol (a stretch brakes first), as built. It
  never plays during an annoyed mood hold or a sulk.
- **Pet, perk and tag:** tag never dodges a pointer that is over him, so it can't meet a pet. The
  pet's rest timer starts when the perk, or the "caught" after tag, ends.
- **Talk overlay:**
  - It owns `upper y` for the bobs only while no act holds `upper`; otherwise it skips them.
  - It squishes the eyes only while they're neutral, so never on annoyed, angry or love lines.
  - It never owns the rig, arms or feet.
- **Never two acts at once (rev 4):** the idle clock runs one item at a time (a beat, a play, a
  stroll or a chatter act), and hover mode runs one hover beat at a time. Talk stays an overlay.

### R2.2 Cutting

- **`cut()` (extended):** as built, plus:
  - the eye rects back to rest `x`, `width`, `y` and `height`, with `rotation` 0 and `scale` 1
  - the current glyph fades out (0.1); its loop stops and its parts go back to their drawn
    spots (`x`, `y`, `scale`, `opacity` cleared)
  - `rig y` to 0 (from sitting or the peek-a-boo)
  - `upper x` to 0 (the angry shake)
  - the arms' `scaleX` to 1 (the logo pose)
  - `foot-right y` to 0 (love's foot pop)
  - the stage clip is cleared (the peek-a-boo)
  - juggled and balanced props run `PROP_OUT`, except a picked prop, which settles in the hand
- **A tossed prop is never cut.** The toss (R6A.4) always runs to its end, so a thrown emblem
  never freezes mid-air.
- **The walker** never resets in a cut. It holds its `x`.
- **Napping:** a cutter first adds the wake's zzz fade and eyes open (0.15) at its own time 0,
  so a pick still answers at once.
- **Beats and hover beats (rev 4)** are cut like plays: `cut()` returns every channel above to
  rest within 0.1–0.15.

---

## R3. Emotions

### R3.1 The set (11; eye rects in drawn coordinates at rest look 0, before the look moves them)

Rest: L `23,43,14,14` · R `63,43,14,14`. Arms: `actL` + raises the left arm, `actR` − raises the
right arm.

| Emotion | L eye | R eye | Look d / p | Body (`upper`, rig tilt) | Arms `actL` / `actR` | Feet / glyph | In | Out | Used in |
|---|---|---|---|---|---|---|---|---|---|
| **happy** | 23,48,14,4 | 63,48,14,4 | +2 / 0 | bounce or giggle (from the act) | +20 / −20 | — / `sparkle` (only where listed below) | 0.08 `power2.out` | 0.12 `power2.out` | pokes 1–3, juggle success, after a wake, caught at tag, logo pose, calm (1.25), forgive; **rev 4:** the `hop` beat, hover mode on the picked card |
| **excited** | 21,41,18,18 | 61,41,18,18 | +3 / −1 | held `STRETCH` 0.96×1.05 | +60 / −60 (cheer) | two alternating `TAP_LIFT` taps / `sparkle` (the pick: the heart burst instead) | 0.1 `back.out(2)` | 0.25 `power2.inOut` | pick (0–0.6); **rev 4:** the `sparkle` beat, the hover `cheer` |
| **curious** | 23,43,14,14 | 62,40,16,17 | at the target | tilt ±6 toward the target's side | 0 / −15 | — / — (**rev 4:** `question` in the `wonder` beat only) | 0.2 `power2.out` | 0.3 `power2.inOut` | arriving at a card, or stopping partway (the base of hover mode, R4.9); **rev 4:** the `wonder` beat |
| **shy** | 23,47,14,9 | 63,47,14,9 | −5 / +2 | 1.03×0.95, y +1 | −20 / +20 | `foot-right x` −2 / `dots` | 0.25 `power2.out` | 0.3 `power2.inOut` | caught at tag; the forgive's peek; **rev 4:** the `bashful` beat |
| **surprised** | 24,40,12,18 | 64,40,12,18, with `POP_SCALE` pop | 0 / 0 | `SQUASH` 0.06 then `SETTLE` | +25 / −25 | — / `alert` | 0.06 `power4.out` | 0.25 `power2.inOut` | peek spot, wake, juggle drop, tag dodge, peek-a-boo; **rev 4:** the `startle` beat |
| **confused** | 23,43,14,14 | 63,47,14,6 | +4 / 0 | tilt −6 | 0 / −80, ±6 wiggle ×3 (0.1 each) | — / `question` | 0.2 `power2.out` | 0.3 `power2.inOut` | walk target flips 3× in 2s; **rev 4:** the `puzzle` beat |
| **sleepy** | 23,50,14,7 | 63,50,14,7 | 0 / 0 | the yawn and nods (R6.3) | −15 / +15 | — / the zzz (the nap's, from 3.6) | 0.6 `sine.inOut` | 0.2 `power2.out` | before a nap |
| **sad** | 24,49,12,8 | 64,49,12,8 | −3 / +3 (straight down) | y +2, scaleY 0.95; sway timeScale 0.6 | −25 / +25 | — / `drop` | 0.4 `power2.inOut` | 0.35 `power2.inOut` | juggle drop |
| **annoyed** | 23,51,14,6 | 63,52,14,5 | side-eye: at the pointer (fine), else +4 / −1 | stiff: 0.98×1.03, held; breath and sway paused | −25 / +25, held (no drift) | right-foot taps (R6A.2) / `vein` | 0.15 `power2.out` | 0.3 `power2.inOut` | pokes 4–5 and the mood hold; calm (0.35–0.85) |
| **angry** | 23,47,14,8, `rotation` +18 about 30 51 | 63,47,14,8, `rotation` −18 about 70 51 | glare: at the pointer (fine), else 0 / +1 | puffed 1.03×0.97; shake `upper x` ±1.5 (`TANTRUM.shake`) | −40 / +40, ±6 shake (`TANTRUM.arms`) | stomps (R6A.3) / `grawlix` | 0.06 `power4.out` | 0.3 `power2.inOut` (`rotation` → 0 with it) | the tantrum and flee; calm (0–0.35) |
| **love** (new) | 24,44,12,12, `rotation` 45 about 30 50 (a diamond) | 64,44,12,12, `rotation` 45 about 70 50 | dreamy, up: +2 / −1 | melt: 1.03×0.96, y +1; sway: rig tilt ±3 (`LOVE.sway`); the eyes beat (`LOVE.beat`) | −35 / +35, held | `foot-right y` −3 (a foot pop) / `hearts` | 0.2 `back.out(2)` | 0.35 `power2.inOut` (`rotation` → 0 with it) | a pet (R6B.2); the pick, eyes only (R6B.4); **rev 4:** the `fond` beat (eyes and one heart only) |

- **The eyes' tweens** are `attr` on the two rects. The pose eases over max(In, 0.25), and back
  over Out with `back.out(1.6)`.
- **Hold:** an emotion holds for as long as its act says. Blinks pause while one is held, apart
  from sleepy's own slow blink.
- **Pop:** a pop only runs on the neutral, surprised or excited eyes (their centres are within
  1 unit of the pop pivot). Love's beat is its own scale about the same centres.
- **Glyphs per emotion:** the table's glyph shows with the emotion's In, unless the act says
  otherwise:
  - `happy` shows `sparkle` only on pokes 1–3, juggle success and caught at tag. On pokes 1–2,
    one in three shows a single heart instead (R6B.3). Its other uses show no glyph.
  - `excited` shows `sparkle`, except in the pick, which shows the heart burst (R6B.4).
  - **Rev 4:** each beat (R6.8) names its own glyph; a hover `cheer` shows `sparkle`.
- **Checked against the body:** every rect above stays on the strips or over a gap. Any part off
  the body is `bg` on `bg`, so it's invisible and the mark is never cut.
- **`annoyed` vs `sleepy`:** both have low lids. They're now told apart at a glance by the glyph
  (annoyed shows the `vein`; sleepy has none until the nap's zzz), and also:
  - annoyed's lids are uneven (the right eye is 1 unit flatter)
  - annoyed side-eyes the visitor, where sleepy looks at 0
  - annoyed's body is stiff and still, where sleepy droops
- **The rotations** are the only shape changes outside `x`/`y`/`width`/`height`. Both use GSAP
  `rotation` with `svgOrigin` in drawn coordinates, so the look's translate on `eyes` carries
  them. Both stay `fill-bg` rects: no new path or fill, nothing beyond the two eyes.
  - **`angry`'s slant:**
    - Each 14×8 slit rotates about its own centre, so the inner corners sit lowest (L clockwise,
      R anticlockwise).
    - The rotated slits span x 22.1–37.9 / 62.1–77.9 and y 45.0–57.0, all on the strips or over
      a gap.
    - The lead screen-checks the slant at 136px. If it reads as a squint, raise the angle to 22
      (the y span becomes 44.6–57.4, still on the body).
  - **`love`'s diamonds:**
    - Each 12×12 square turns 45° about the eye's centre (30 50 / 70 50, the pop pivots).
    - A heart needs more than one rect per eye, and R1.1 adds nothing to the face. The diamond
      is the closest one rect gets, and it reads as starry-eyed. The hearts above carry the rest.
    - With the look's translate (1, −3) and the beat at 1.12, they span x 21.5–40.5 /
      61.5–80.5 and y 37.5–56.5, all on the strips or over a gap.
    - The lead screen-checks them at 136px (R12 #16).

### R3.2 Emote glyphs (`RixEmotes`, server, host only; geometry in `lib/rixGlyphs.ts`)

Pixel glyphs in the `!`/`?` style: square cells (2 units = 1.6px at 136), no curves, no text, no
emoji characters. Every path is a set of non-overlapping cells, so `fill-rule` doesn't matter.

| `data-emote` | Fill | Part · `d` | Pivot |
|---|---|---|---|
| `alert` (!) | `fill-muted` | `M98 -15h5v12h-5Z M98 -1h5v5h-5Z` | 100.5 −5 |
| `question` (?) | `fill-muted` | `M95 -15H105L108 -12V-6L104 -2H101V-5L104 -8V-11H99V-8H95Z M101 0h3v4h-3Z` | 101.5 −5 |
| `hearts` (new; parts `opacity-0`) | `fill-accent` | **1** (7×6 cells): `M98 -14H102V-12H104V-14H108V-12H110V-8H108V-6H106V-4H104V-2H102V-4H100V-6H98V-8H96V-12H98Z` | 103 −8 |
| | | **2** (5×4): `M114 -8H116V-6H118V-8H120V-6H122V-4H120V-2H118V0H116V-2H114V-4H112V-6H114Z` | 117 −4 |
| | | **3** (5×4): `M88 -6H90V-4H92V-6H94V-4H96V-2H94V0H92V2H90V0H88V-2H86V-4H88Z` | 91 −2 |
| `sparkle` (new) | `fill-muted` | **big:** `M100 -16h2v10h-2Z M96 -12h4v2h-4Z M102 -12h4v2h-4Z` | 101 −11 |
| | | **small:** `M108 -6h2v6h-2Z M106 -4h2v2h-2Z M110 -4h2v2h-2Z` | 109 −3 |
| `drop` (new) | `fill-muted` | `M98 -14H100V-10H102V-6H100V-4H98V-6H96V-10H98Z` | 99 −9 |
| `dots` (new; parts `opacity-0`) | `fill-muted` | **1** `M94 -8h4v4h-4Z` · **2** `M101 -8h4v4h-4Z` · **3** `M108 -8h4v4h-4Z` | 96 −6 · 103 −6 · 110 −6 |
| `vein` (new; 💢-style, four corner cells) | `fill-muted` | `M94 -16H96V-12H92V-14H94Z M100 -16H102V-14H104V-12H100Z M92 -8H96V-4H94V-6H92Z M100 -8H104V-6H102V-4H100Z` | 98 −10 |
| `grawlix` (new) | `fill-accent` | **vein:** the `vein` path above | 98 −10 |
| | (symbols `opacity-0`; drawn in slot A, x 106–116, y −15..−5; slot B is `x` +12. Each frame, slots A and B each show a random symbol, never repeating their own last and never the same as each other) | **hash** (#): `M108 -15h2v2h-2Z M112 -15h2v2h-2Z M106 -13h10v2h-10Z M108 -11h2v2h-2Z M112 -11h2v2h-2Z M106 -9h10v2h-10Z M108 -7h2v2h-2Z M112 -7h2v2h-2Z` | 111 −10 |
| | | **at** (@): `M108 -15h6v2h-6Z M106 -13h2v6h-2Z M114 -13h2v4h-2Z M110 -11h2v2h-2Z M110 -9h6v2h-6Z M108 -7h4v2h-4Z` | 111 −10 |
| | | **dollar** ($): `M108 -15h8v2h-8Z M106 -13h2v2h-2Z M110 -13h2v2h-2Z M108 -11h6v2h-6Z M110 -9h2v2h-2Z M114 -9h2v2h-2Z M106 -7h8v2h-8Z` | 111 −10 |
| | | **star** (*): `M106 -15h2v2h-2Z M110 -15h2v2h-2Z M114 -15h2v2h-2Z M108 -13h6v2h-6Z M106 -11h10v2h-10Z M108 -9h6v2h-6Z M106 -7h2v2h-2Z M110 -7h2v2h-2Z M114 -7h2v2h-2Z` | 111 −10 |

- **In:** `EMOTE_IN` on the glyph (opacity 0 → 1, scale 0.6 → 1, `y` 2 → 0; 0.15 `back.out(2)`).
- **Out:** `EMOTE_OUT` (0.2 `power1.in`). Its loop stops at the Out's start.
- **Loops** (R8): `hearts` → `HEARTS` (or `HEART_ONE`, `HEART_BURST`); `sparkle` → `TWINKLE`;
  `drop` → `DROP_SLIDE`; `dots` → `DOTS`; `vein` → `VEIN_THROB`; `grawlix` → `GRAWLIX`. `alert`
  and `question` don't loop.
- **Rules:**
  - One glyph at a time. A new glyph cuts the old one (`EMOTE_OUT` at 0.1).
  - Never shown together with the zzz.
  - The lead screen-checks the `?`, the `dots` and the `grawlix` at 136px. If the grawlix
    symbols blur together, it drops to slot A only (one symbol at a time).
- **Paint:** everything stays inside the box sideways (x ≤ 133 of 140). Upward, rising hearts
  reach y −24, inside the zzz's allowance (−28, R9).

---

## R4. Walk and patrol

**R4.1 Track.** The shelf is `about-rix-stage`'s box. Positions are walker `x` in px, measured
when each leg starts, never inside a tween.
- **No home.** `x` 0 (the right end, as built) is only where he stands at first paint, and where
  he stays under reduced motion and without JS. The **left end** is minX.
- **Stand spot** for a card: x = clamp(cardCentreX − (startLeft + 0.4706 × width), minX, 0),
  with startLeft = the box's left at `x` 0, and minX = shelfLeft − startLeft. His body centre
  then sits over the card's centre.
- **Reach:** a card walk covers at most `WALK.reach` (200px). If the stand spot is farther, he
  stops at the **partway spot**, current `x` ± 200 toward it. At 360 the whole track is 184px, so
  on phones he always reaches the card; no separate phone value is needed.
- **On resize:** he is clamped to the new shelf (`gsap.set`).
  - Holding a card: he snaps to its recomputed stand or partway spot.
  - Mid-stretch: the stretch brakes, and the patrol resumes with a pause.
  - Sulking: he stays where he is, clamped.
- He never leaves the shelf, so nothing ever scrolls sideways.

**R4.2 Gait (stride-locked: the feet never skate).**
- unit = box width ÷ 170 (0.8 at 136px). Stride = 2 × `footReach` × unit, in px.
- For a leg of D px: n = max(1, round(D ÷ stride)) full strides, and the leg's actual reach is
  r = D ÷ (2 × n × unit), so the last foot lands exactly on the spot.
- **A leg is n + 1 steps:** a half step to start (the feet part), n − 1 full steps, and a half step
  to stop (the feet come together). Duration = (n + 1) × `step`.
- The walker's ease is per step: `power1.in` on the start step, `none` in between, `power1.out`
  on the stop step. The planted foot uses the same ease as its step, so it stays fixed on the
  line, and the half steps give the speed-up and slow-down.
- Cruise speed = 2 × r × unit ÷ `step`. Paces (R8): `WALK` 96 px/s, `PATROL_PACE` 56, `FLEE` 192,
  `STOMP_WALK` 65.
- **Removed:** speed-based durations, the 2.0s cap and the dash.

**R4.3 Step cycle** (one foot per step; the left foot swings first):
- **In a full step** the walker moves 2r × unit px:
  - The planted foot goes `x` +dir·r → −dir·r, with the step's ease (fixed on the line).
  - The swinging foot goes `x` −dir·r → +dir·r (`sine.inOut`). Its `y` goes −`footLift` over the
    first half (`power2.out`) and back to 0 over the second (`power2.in`).
- **The start step:** the feet go from 0 to ±r. **The stop step:** they go from ±r to 0. In each,
  the walker moves r × unit px.
- `upper y` −`bob` at the middle of each step (`sine.inOut` yoyo).
- The arms swing ±`armSwing`, the opposite arm to the swinging foot, with `mixL`/`mixR` 0.
  - **While he holds a prop,** `actR` stays at `carry` (−10) and only the left arm swings.
- **Stomp step** (`STOMP_WALK` only): the foot comes down in `slam` (`power4.in`), not
  `power2.in`, and each plant adds `SQUASH` for `squash` to `upper`, then `SETTLE`.

**R4.4 Facing.**
- The eyes go to `face` in the walking direction (left: d −3, p −3, so the eyes move 6 units
  left; right: d +3, p +3).
- The rig leans by the pace's `lean` into the direction.
- The eyes lead the start by `WALK_START.faceLead`.
- **Turn** (the target flips side mid-walk, or the patrol turns at an end):
  - brake `WALK_STOP.brake` (the feet go to 0 in it)
  - the eyes swing across in `WALK_TURN.eyes`
  - `SQUASH` for 0.06
  - the lean flips, and the new leg starts with its start step. About 0.3s in all.

**R4.5 Target changes.**
- **Same direction:** the current leg ends at its next foot plant, and a new leg runs on from
  there with no start step (the feet are already apart).
- **Opposite:** a turn.
- **Released mid-leg:** he finishes the leg. The patrol resumes `PATROL.resume` after
  `LOOK_RELEASE`.
- **Three flips within 2s:** he stops, shows `confused` for 0.8, then walks to the current target.
- **During a tantrum, flee or sulk:** targets are ignored. After the forgive, a target that still
  holds starts a walk as normal.

**R4.6 Start and stop.**
- **Start:** `ANTICIPATE` (`WALK_START.anticipate`) as the eyes turn, then the start step.
- **Stop:**
  - the stop step brings the feet together
  - `SQUASH` 0.06, then `SETTLE`
  - lean overshoots by ∓`WALK_STOP.overshoot`, then back to 0 (`WALK_STOP.back`)
  - at a card: `curious`, looking at the card (`LOOK_AT`). At the partway spot it's the same:
    curious's tilt leans him toward the far card while he looks at it. He doesn't walk on.
    **Rev 4:** from here hover mode runs (R4.9); he no longer holds still.
  - after a pick's walk: `curious` for 0.8, then the patrol resumes after `PATROL.resume`

**R4.7 Keyboard.** Focus on a card is a target, exactly like hover: he looks at once, then walks
after the dwell (R12.1), then runs hover mode (R4.9). An arrow key is a pick, so he picks in place
first and walks after.

**R4.8 Patrol (replaces home and the stroll home).** When nothing holds his attention he ambles
the shelf slowly, pausing to look around.
- **Rev 4, by phase (R7):** in the **busy phase** the stretches are strolls the idle clock picks
  (`IDLE_MENU.busy`), and the pauses are its busy gaps (`TEMPO.busyGap`), each opening with one
  `PATROL.looks` look; `PATROL.first` and `PATROL.pause` aren't used. In the **settled phase**
  the patrol runs as written below, and idle items start in its pauses.
- **Start:** first paint and landing are unchanged (`x` 0). The first stretch is `PATROL.first`
  (5s) after landing, heading left.
- **A stretch:** a leg of `PATROL.stretch` (96–240px, random) at `PATROL_PACE`, in his heading,
  clamped to the shelf.
- **At an end:** when the room ahead is under `PATROL.minStretch` (48px), the next stretch turns
  round (R4.4 turn) and heads the other way.
- **A pause:** after each stretch, `PATROL.pause` (2.5–6s), with one look picked by
  `PATROL.looks`:
  - the card below him (`LOOK_AT` its centre), 0.4
  - the pointer (fine pointer, if one has been seen; else the card), 0.3
  - out at the visitor (look 0, then a blink), 0.3
- **Idle items** (beats, plays, chatter) start only while he stands (R7). The nap, juggle, sit,
  peek-a-boo, logo pose, balance, the beats and tag all run where he stands. An item that comes
  due mid-stretch waits for the stretch's end.
- **No stretch starts while:**
  - a quip is showing
  - Rix or a card is hovered or focused
  - the mood isn't neutral
  - he naps, or an act is running
  - reduced motion is on (no patrol at all)
- **Interrupts:** anything ranked above it brakes a running stretch in place (`WALK_STOP.brake`).
  A card target then walks him toward that card (R4.1 reach).
- **Resume:** `PATROL.resume` (3s) after the last interrupt ends (a target's release counts from
  `LOOK_RELEASE`). It resumes from where he stands with a pause first. Then it heads toward the
  roomier side, or keeps its heading if that side has at least `PATROL.minStretch`.
- **Carrying a prop:** he patrols carrying it (R4.3).
- **Budgets:** the patrol is a crew timer. It pauses off screen and in a hidden tab (R7).

**R4.9 Hover mode (rev 4; home's About; replaces "holds `curious` while the target holds").**
A card target (a fine pointer's hover, or keyboard focus) held `WALK.dwell` walks him toward the
card as R4.1–R4.6. Once he stops (at the stand spot or partway), or at once if he's within
`WALK.minDist`, he cheers the pick on while the target holds. He never goes still.
- **Base expression,** between beats, looking at the card (`LOOK_AT`):
  - before a pick, or after one on another card: `curious`, tilted toward the card
  - on the picked card: `happy`, no glyph
- **Hover beats:** one every `HOVER.beatGap` (1.2–2.0s) from the last one's end, by
  `HOVER.beats` weights, never the same twice in a row. No beat starts while a line is still
  typing; beats resume in its hold. Each ends back on the base expression.

| Hover beat | Weight | Built from | Length |
|---|---|---|---|
| `hop` | 3 | `HOP` in place, still looking at the card | ≈ 0.6 |
| `point` | 3 | `WAVE_SMALL` on the arm on the card's side: right arm (`actR` −35) for a card right of or under his eye centre, left arm (`actL` +35, same timings) for one on his left | ≈ 0.74 |
| `cheer` | 2 | `excited` In with `sparkle` (`TWINKLE`), hold `HOVER.cheer` 0.6, Out | ≈ 0.95 |
| `perk` | 2 | `PERK` with the eye pop, as the hover perk on Rix | ≈ 0.5 |
| `glance` | 2 | `LOOK_AT` the pointer (fine pointer seen; else look 0, out at the visitor), hold `HOVER.glanceHold` 0.5, a blink, `LOOK_AT` the card | ≈ 1.1 |

- **Hover lines** (typed, R5; shown, never announced):
  - **When:** the first once he has stopped **and** the target has held `HOVER.lineDwell` (0.8s)
    from the hover's start. The next comes `HOVER.lineGap` (1.5–2.5s) after the last line has
    gone. Per hold, at most `HOVER.lines`: 3 before a pick, 1 on another card after a pick, none
    on the picked card (its ack already speaks).
  - **Which, before a pick:** the card's line, a generic line, the card's other line:
    `hoverLines[key][i]`, then `hoverAnyLines[n]`, then `hoverLines[key][i + 1]`. Each pool runs
    in turn across holds (a re-hover carries on from where it stopped). A card line said in the
    last `HOVER.repeatAfter` (20s) is swapped for the next generic line. Never the same line
    twice in a row.
  - **Which, after a pick:** `switchLines`, in turn, on any card but the picked one.
- **Hopping between cards:** a line belongs to its card. When the target leaves that card, a line
  that hasn't started is dropped, and one that's showing fades out (`TALK.walkOut` 0.2), so a line
  never sits over the wrong card. The next card waits its own `HOVER.lineDwell`, so a fast scan
  across the board shows no lines, only the looks and the walk (and `confused` after 3 flips in
  2s, R4.5).
- **Release:** the current hover beat finishes; the base expression goes Out; the idle clock
  resumes after `LOOK_RELEASE` with its next gap (R7). A pick during hover mode cuts it (R2.1).
- **Not on:** touch (no hover; a tap is a pick), the tantrum through the forgive (targets are
  ignored, R4.5), reduced motion (no beats or walk; lines only, R8.1).

---

## R5. Talk

**R5.1 Typing.**
- The quip box shows (`opacity` 1, no rise). Each `data-quip-char` reveals in order, every
  `TALK.char` s, plus `TALK.pause` after `, . ? !`.
- The full line is laid out from the first character, so nothing re-wraps or moves.
- `QUIP_HOLD` (2.4) counts from the last character, then `QUIP_OUT`.

**R5.2 Body talk**, on each word's first character:
- `upper y` `TALK.bob` (up 0.07 `power2.out`, down 0.09 `power2.in`).
- Eye squish: height 14 → `TALK.squish.height`, `y` + `TALK.squish.y`, so they stay centred
  (in 0.06, out 0.08). Only while the eyes are neutral.
- At the start, the eyes glance toward the quip's side (d ∓2, p ∓2) and back at the end. Not
  while the eyes are annoyed, angry, love or hidden (the sulk). **Rev 4:** nor during a hover
  line: he keeps looking at the card.
- **When each line types:**
  - Pokes 1–3 from `TALK.afterPoke` (0.5), nudges from 0.3.
  - Annoyed from `TALK.afterAnnoyed` (0.25), angry from `TALK.afterAngry` (0.15).
  - A pet's line from `TALK.afterPet` (0.6).
  - The sulk line from `TALK.afterSulk` (0.4), the forgive line from `TALK.afterForgive` (0.9).
  - **Rev 4:** a chatter line from `TALK.afterNudge` (0.3) into its chatter act; a hover line
    from 0, when R4.9's dwell is met.

**R5.3 Side.**
- The quip takes the side with room: left (as built), or right when the room on his left is
  under 172px (`max-w-40` + `mr-3`).
- It's set as `data-side` on the anchor when each line starts.
- A walk start fades the current line out (0.2), so a line never changes side mid-line. This
  includes the flee and the stomp walk: the angry line fades as he runs. A patrol stretch never
  starts while a line shows (R4.8).

**R5.4 Line sources (rev 4).** One quip, two kinds of line:
- **Visitor-driven** (pokes, the ladder, a pet, the sulk, the forgive): as before, a new line
  cuts the old one.
- **Scheduled** (hover lines, chatter): never start while a line shows, so no line is cut
  mid-read. Each waits for the quip to be empty and at least `IDLE_TALK.minGap` (1.5s) since the
  last line went. Every line still holds `QUIP_HOLD` 2.4 from its last character.
- **Chatter** (the nudges, folded in): the idle talk clock (R7) gives a chatter act its slot.
  - **Before a pick** (nothing checked, including after the toss): the nudge act as built (`WAVE`,
    one `NUDGE_BOUNCE`, `LOOK_AT` the board's centre) with the next `idleLines` line.
  - **After a pick** (any card, "Not sure yet" included): a look straight down toward the
    examples below (`IDLE_TALK.lookDown`: d −3, p +3, `LOOK_AT` timing) with `WAVE_SMALL`, and
    the next `afterPickLines` line. No line asks for a pick once one is made.
  - Each pool runs in turn and wraps round, never the same line twice in a row.
- **Sizing note:** B's quip is `max-w-40` (160px), two lines: about 20 Geist Mono characters a
  line at `text-nav`, so a line of about 40 characters fits. Over that, the lead's screen check
  decides (`docs/04-voice.md`: no fixed limits).

---

## R6. Plays (idle; all are `play`, rank 8)

| Play | Trigger | Timeline (seconds) | Ends |
|---|---|---|---|
| **R6.1 Juggle** | idle clock | **0:** look up (d 3, p −3, the eyes follow the arcs with p ±1). **0, 0.25, 0.5:** three props `PROP_IN` in the right hand. **Cycle per prop:** a throw over the head (`x` 0 → −134 linear; `y` 0 → −40 `power2.out` / → 0 `power2.in`; 0.5), then a low pass back (`x` → 0, `y` −12; 0.25). A flick on each throw (`actR` −25, 0.08 / 0.12); `actL` +20 on each pass. `JUGGLE.rounds` 2 (≈ 2.0s). Before a pick he juggles the board's first three emblems (R12.6) | each prop `PROP_OUT` in the hand (a picked one stays). `happy` 0.6, with `sparkle` |
| … **with a drop** | 25% of juggles, never the first of the page load | on the last throw the prop misses: `x` −136, then falls to `y` +42 (its bottom on the line; 0.3 `power2.in`) and bounces 6 (0.1 / 0.12). `surprised` 0.3, then `sad` 0.8 with `drop`, looking down-left (d −7, p +1) | the dropped prop fades (0.3); back to neutral |
| **R6.2 Sit** | idle clock | rig `y` +7 (0.3 `power2.inOut`): the body rests on the line and the feet hang 5.6px below it (the 16px gap above the cards). `upper` 1.04×0.96, arms −30 / +30. The feet swing out of phase: `x` ±3, `y` −1 at each end, half-cycle 0.45 `sine.inOut`. The eyes stay with life (looks and blinks) | after `SIT.length` 6–9s: rig `y` 0 (0.25 `back.out(1.6)`), `SQUASH`, `SETTLE` |
| **R6.3 Nap** | the visitor idle `NAP_AFTER` (40s), **in the settled phase only (rev 4; was "nudges finished")**, standing where he is (a patrol pause or idle; never mid-stretch), no quip, mood neutral | **0:** `sleepy`. **0.6:** yawn (`upper` 0.95×1.08 with arms +40 / −40: 0.4 up, 0.4 hold, 0.5 down). **1.9:** two nods (tilt +3 over 0.8 `sine.inOut`, snap back 0.15). **3.6:** sit (R6.2 pose, no swing). Eyes go to the Process slit (`eyeAttr` "slit"), `napLife(true)`, the zzz loop (`startZzz`, exported from processBotActs). He sleeps until the visitor returns; the patrol stops while he sleeps | **wake** (below), then the patrol resumes after `PATROL.resume` |
| **Wake with a start** | the visitor returns: pointer move, pointer down, key, wheel or scroll, focus in, or the option going live again (back on screen, or the tab visible again) | **0:** zzz fade 0.15; `surprised` + `alert`; a hop from sitting (rig `y` +7 → −8, 0.18 `power2.out`, then 0, 0.16 `power2.in`), `SQUASH`, `SETTLE`. **0.3:** look at the pointer, or d 0. **0.6:** `alert` out. **0.8:** double blink. **1.0:** `happy` 0.5. `napLife(false)` | ≈ 1.5s |
| **R6.4 Tag** | fine pointer only: it comes within `TAG.near` × scale of his eye centre, approaching at ≥ `TAG.speed`, not over him | **dodge:** `surprised` 0.06; a hop away from the pointer's side (walker `x` ±48, clamped; `upper y` −10 `STRETCH`, feet −6; 0.3), then `happy`. **No room:** a duck (`upper y` +6, scaleY 0.85, 0.12; hold 0.4; back with `SETTLE`) | after `TAG.dodges` (2) in one 8s session he lets himself be caught: hovering him then plays `shy` 0.8 (with `dots`), then `happy` with `sparkle` (this replaces the perk). Then `TAG.rest` 20s with no dodges |
| **R6.5 Peek-a-boo** (approved) | idle clock; where he stands | **0:** the stage clip `PEEKABOO.clip`. Sink: rig `y` 0 → 88 (0.35 `power2.in`); hold 0.6. **0.95:** rise to 32, eyes only (`PEEK_OUT`). **1.4:** `PEEK_SEARCH`. **2.5:** pop up: `PEEK_HOP` on `y` (32 → −18 → 0), with the clip cleared at the peak; `surprised`, then `happy` 0.4 | ≈ 3.0s; the clip is always cleared (a cut clears it too) |
| **R6.6 Logo pose and wink** (approved) | idle clock | **0:** life share → 0 (0.3), look 0. **0.3:** the arms' `scaleX` 0 about the shoulders (0.2 `power2.in`), so he **is** the mark. Hold 0.8. **1.3:** right-eye wink (shut 0.07, hold 0.25, open 0.12). **1.75:** arms back (0.3 `back.out(2)`), life back, `happy` 0.3 | ≈ 2.1s |
| **R6.7 Balance an emblem** (approved) | idle clock | **0:** a prop (the picked one, or before a pick the board's first) is tossed to his head: `x` −68, `y` −43, 0.4, an arc (`x` linear, `y` `power2.out`). **0.4:** wobble: rig tilt ±3 with the prop counter-rotating ∓8° about `PROP_PIVOT`, 3 × 0.25 half-cycles, arms +30 / −30. **1.15:** back to the hand (0.35), or `PROP_OUT` if not picked; `happy` 0.4 | ≈ 2.5s |

- **Visitor idle** counts live time only: it's a crew timer, so it pauses off screen and in a
  hidden tab.
- **Napping out of view:** if the option leaves the screen while he naps, he wakes with a start
  when it comes back.
- **P4 Foot drum** was rejected (2026-10-02) and isn't built.

### R6.8 Beats (rev 4; idle, rank 8, on the idle clock beside the plays)

Short in-place moments built only from moves already in this sheet. Each emotion uses its own
`EMOTION_TIMING` In and Out and its glyph's own loop (R3.2); `BEAT.hold` is the only new number.
Length = In + hold + Out.

| Beat | Weight | Built from | Glyph | Length |
|---|---|---|---|---|
| `wave` | 2 | `LOOK_AT` look 0 (out at the visitor), `WAVE` at 0.1 | — | ≈ 1.1 |
| `perk` | 2 | `PERK` with the eye pop | — | ≈ 0.5 |
| `hop` | 2 | `happy` In (no glyph), `HOP`, `happy` Out | — | ≈ 0.75 |
| `look` | 2 | `PEEK_SEARCH` (left, hold, right, hold), look 0, a blink | — | ≈ 1.3 |
| `sparkle` | 2 | `excited` with two `TAP_LIFT` taps, hold 0.8 | `sparkle` (`TWINKLE`) | ≈ 1.15 |
| `wonder` | 2 | `curious` at a random card (`LOOK_AT`, tilt toward it), hold 1.0 | `question` | ≈ 1.5 |
| `startle` | 1 | `surprised` with the pop, `SQUASH` then `SETTLE`, hold 0.6 | `alert` | ≈ 0.9 |
| `bashful` | 1 | `shy`, hold 1.4 (one `DOTS` cycle) | `dots` (`DOTS`) | ≈ 1.95 |
| `puzzle` | 1 | `confused` with its arm wiggle, hold 0.8 | `question` | ≈ 1.3 |
| `fond` | 1 | `love` eyes only (diamonds and one `LOVE.beat`; no melt, sway or foot pop), hold 1.0 | one heart (`HEART_ONE`) | ≈ 1.55 |

- **Never the same beat twice in a row,** and never two glyph beats in a row with the same glyph
  (`wonder` and `puzzle` both show `question`).
- A beat may run while a line holds (talk is an overlay); a play may not (R7).
- `fond` never meets a pet: it doesn't start while the pointer is over Rix (R7 gates).

---

## R6A. Moods: the poke ladder (replaces the flat poke)

### R6A.1 Counting, gates and the queue

- **A press** is a click, tap, Enter or Space on Rix. It **counts** (+1) unless one of these
  holds:
  - it's before landing, or during a pick, a calm or a tantrum (ignored)
  - it's during the sulk (a hmph, R6A.6)
  - it's under `POKE_REPEAT` (0.15) after the last counted press
  - it's a held key's repeat (`KeyboardEvent.repeat`), which never counts
  - it's the click that ends a long-press pet (R6B.1), which is swallowed
- **Window:** after `POKE_WINDOW` (4.0) with no counted press, the count goes back to 0 and the
  mood eases to neutral.
- **Other resets:** any trusted pick, the end of a forgive, and the end of a calm.

| Count | Level | Act |
|---|---|---|
| 1–3 | happy | the O4 giggle as built (`happy` with `sparkle`, or one heart on 1–2 (R6B.3); a `pokeLines` line) |
| 4 to `POKE_LADDER.tantrum` − 1 (4–5) | annoyed | R6A.2 |
| ≥ `POKE_LADDER.tantrum` (6) | tantrum | R6A.3–R6A.7 |

- **Gate for happy and annoyed:** their acts start at least `POKE_COOLDOWN` (0.9) after the last
  poke act started.
- **The queue:** a counted press inside the cooldown goes into a queue of one slot. The slot
  always holds the latest level, and it plays when the cooldown ends. Nothing is dropped, so a
  rapid clicker reaches 6.
- **Gate for the tantrum:** it ignores the cooldown. It starts at the first moment the count
  is ≥ 6 **and** `ANNOYED_MIN` (0.6) has passed since this count's first annoyed act started, so
  the warning is always seen.
- **Worked times:** at 5 presses/s it's happy at 0, annoyed at 0.9, tantrum at 1.5. At
  1 press/s it's happy at 0, 1 and 2, annoyed at 3 and 4, and the tantrum at 5.

### R6A.2 Annoyed poke (pokes 4–5; ≈ 0.9s)

| At | Move |
|---|---|
| 0 | `cut()`. `annoyed` In (eyes 0.15 `power2.out`) with the `vein`. Side-eye at the pointer (fine) or +4 / −1 (`LOOK_AT`). Stiffen: `upper` 0.98×1.03 (0.12 `power2.out`); arms −25 / +25, `mixL`/`mixR` 0 (0.15 `power2.out`). `RixStatus` gets the line |
| 0.15 | a huff: `upper y` −1.5 (0.08 `power2.out`), then 0 (0.2 `power2.in`) |
| 0.2, 0.45 | two impatient right-foot taps (`TAP_LIFT`, `TAP_UP` / `TAP_DOWN`) |
| 0.25 | the next `annoyedLines` line types (R5) |
| 0.9 | the act ends. **Mood hold:** the eyes, the stiff pose and the `vein` stay until the window closes, then `annoyed` Out (0.3). A walk or a pick replaces them sooner |

### R6A.3 Tantrum (poke 6+; 1.9s, then the flee)

| At | Move |
|---|---|
| 0 | `cut()` (a walk or stretch brakes, `WALK_STOP.brake`); the mood hold ends. `angry` In, with the `grawlix`. Glare at the pointer (fine) or 0 / +1. The quip is replaced. **Home's About: the picks lock (R6A.9).** `RixStatus` gets the angry line followed by `lockLine`, unless a prop is about to be thrown (R6A.4) |
| 0.1, 0.4, 0.7, 1.0 | stomps, L R L R: the foot `y` `TANTRUM.stomp.lift` −7 (0.12 `power2.out`), slammed to 0 (0.06 `power4.in`). On each slam, `upper` `SQUASH` 0.05, then `SETTLE` |
| 0.1 → 1.9 | shake: `upper x` ±1.5, half-cycle 0.04 `sine.inOut`, yoyo. The arms shake ±6 about −40 / +40, half-cycle 0.08 |
| 0.15 | the next `angryLines` line types |
| 0.55 → 1.45 | the toss, if he holds a prop (R6A.4) |
| 1.9 | the shake stops (`upper x` 0, 0.1). The flee starts (R6A.5), and the angry line fades (R5.3). The `grawlix` stays through the flee and goes out as the sulk turns (R6A.6, 0) |

### R6A.4 The toss and the deselect (only if he holds a picked prop at the tantrum's start)

- **"Just looking" holds no prop,** so nothing is thrown and that pick stays.
- **A `?for` pick** holds a prop, so it is thrown like any other.

| At | Move |
|---|---|
| 0.55 | wind-up: `actR` +25, `mixR` 0 (0.15 `power2.in`). The picked ack fades out (`ACK_OUT`: 0.2 `power1.in`, inline `opacity`). The prop is set to inline `opacity` 1, so it outlives the `:has` state |
| 0.7 | fling: `actR` −80 (0.1 `power3.out`) |
| 0.75 | **release.** The deselect (below). The prop flies (`TOSS`): `x` ±150 units, linear, 0.7, toward the side of the shelf with more room, clamped to that room − 8px. `y` 0 → −36 (0.25 `power2.out`), then → +60 (0.45 `power2.in`). `rotation` 0 → ±540 (signed with `x`) about `TOSS.origin` 118 36.5. `scale` 1 → 0.8 over the toss |
| 0.95 | the arm rejoins the angry pose: `actR` −40 (0.3 `back.out(1.6)`) |
| 1.05 → 1.45 | the prop's `opacity` 1 → 0 (0.4 `power1.in`). At 1.45 its inline motion is stripped, so `:has` (now unchecked) keeps it hidden |

**The deselect** (`lib/aboutDeselect.ts`), all at the release:
1. It sets `checked = false` on the checked radio in the option's group (`input[name=…]:checked`).
2. It dispatches an **untrusted** bubbling `change` on that radio. `useAboutPick` re-reads it
   (null), so every `WhatsAppLink` on that pick name falls back to the default message.
   - The pick act and `AboutStatus` ignore untrusted changes, so nothing plays and no ack is
     announced.
   - The URL's `?for` is never rewritten, as before.
   - **Rev 4:** the pick lock (R6A.9) only swallows trusted input, so the deselect goes through.
3. Motion's remembered previous pick becomes null, so the next pick has no old prop to
   `PROP_OUT`.
4. `RixStatus` gets `about.rix.throwAway`, followed by `lockLine` on home's About (R6A.9).
5. Focus and scroll don't move.

The ack is gone by `:has` (its fade finished at the release). After its inline `opacity` is
cleared, the CSS state owns it.

**Paint:**
- The arc peaks at y −13, inside the box's top (−18).
- It ends 18 units (14.4px) below the line, inside the 16px gap above the cards, at `opacity` 0.
- Sideways it reaches at most 120px past the hand, never past the shelf.

### R6A.5 Flee (from 1.9)

- **Which way:**
  - Fine pointer: toward the shelf end farther from the pointer's last `x`.
  - Touch, keyboard, or no pointer seen: toward the end farther from his own `x`.
- **How far:** at most the pace's `maxDist` (`FLEE` 400px, `STOMP_WALK` 120px), stopping at the
  end if it's nearer. Under `WALK.minDist` of room: no flee, and he sulks where he stands.
- **Fine pointer (`FLEE`):**
  - `ANTICIPATE` with the eyes leading by `WALK_START.faceLead`.
  - A scramble with the R4.2 gait: reach 12, step 0.1 (192 px/s); 400px takes 2.2s.
  - The lean is 7 and the arms flail ±20.
  - The `angry` slits ride the `face` look.
- **Touch and keyboard (`STOMP_WALK`):**
  - He stomps away: reach 9, step 0.22 (65 px/s); 120px takes 2.0s.
  - Each plant uses `footLift` 7, `slam` 0.06 and `squash` 0.05 (R4.3), with lean 2.
  - The arms are held at −40 / +40, with no swing.
- **Stop:** the stop step, `SQUASH` 0.06, `SETTLE`. There's no overshoot and no `curious`: the
  sulk starts at once.

### R6A.6 Sulk (back turned; ≈ 6.4s)

**How "back turned" reads.** He turns away to the side he fled toward (`rix.wall`). If he didn't
flee, it's the shelf end nearer to him. Then:
- The eyes slide to that side and collapse to width 0 at their wall-side edge, like a head
  turning away.
- What's left is the bare mark: the logo with no eyes reads as his back.
- A `scaleX` squeeze reads as a three-quarter turn. He is never mirrored.

| At | Move |
|---|---|
| 0 | the `grawlix` out (`EMOTE_OUT`). `angry` `rotation` → 0 and the rects to rest (0.15). Look to the wall (`face`: d ±3, p ±3, 0.15 `power2.inOut`) |
| 0.15 | the rects collapse (0.25 `power2.in`). **Wall left:** `x` 23 / 63 stay, `width` → 0. **Wall right:** `x` → 37 / 77, `width` → 0. `upper` `scaleX` 0.92 (0.3 `power2.inOut`); slump `upper y` +1.5 and `scaleY` 0.97; arms −20 / +20; rig tilt ±3 toward the wall |
| 0.4 | `sulkLine` types (side per R5.3). Breath at timeScale 0.6; no blinks or looks |
| 0.4 → 6.4 | hold `SULK.hold` (6, live time). He ignores hover, focus, pets, chatter, beats, plays, the patrol, tag and pokes |

- **Hmph** (a press during the sulk, at most one per `HMPH.gap` 0.5):
  - rig tilt ±2, two half-cycles of 0.06 `sine.inOut`
  - `upper` `scaleY` 0.96 (0.06), then `SETTLE`
  - No count, no line, no announcement, and the hold doesn't extend.
  - **Rev 4:** a swallowed press on a locked card during the sulk plays the hmph too (R6A.9).
- **A pet during the sulk** is ignored: no love, no hmph, and the hold doesn't change.

### R6A.7 Forgive (after the sulk; ≈ 1.8s)

| At | Move |
|---|---|
| 0 | the peek back: the rects reopen from the wall edge to `width` 7, with `shy` lids (`y` 47, `height` 9; 0.2 `power2.out`), still looking to the wall |
| 0.2 → 0.7 | a hold, then one blink |
| 0.7 | the turn back: `upper` `scaleX` 1 (0.3 `back.out(1.6)`), rig tilt 0, slump off, look to 0 (0.3 `power2.inOut`) |
| 0.85 | `happy` In (no glyph) |
| 0.9 | a small wave, `WAVE_SMALL`: `actR` −35 (0.2 `power2.out`), two swings ±8 (0.12 `sine.inOut`), back (0.3 `back.out(1.6)`), ≈ 0.74. `forgiveLine` types |
| 1.8 | `happy` Out. Mood neutral, count 0. **Home's About: the picks unlock and `RixStatus` gets `unlockLine` (R6A.9).** If a target holds, hover mode starts (R4.9); if not, the idle clock resumes (R7) from where he stands |

### R6A.8 Calm by a pick (the `/rix` playground only since rev 4; a pick during the tantrum, flee or sulk; 1.6s, then the pick)

> **Rev 4:** on home's About the picks are locked through the tantrum (R6A.9), so this never runs
> there. It stays for the playground's "Calm with prop" button and its other calm paths.

| At | Move |
|---|---|
| 0 | the tantrum is cut (a flee brakes, `WALK_STOP.brake`; the shake stops; the `grawlix` out). From the sulk: the rects reopen from the wall edge to the `angry` slits (0.2) and `upper` `scaleX` 1 (0.3 `back.out(1.6)`). `LOOK_AT` the picked card. The ack shows by `:has` and runs `ACK_IN` at once: the visitor's answer never waits on his mood. `AboutStatus` announces it, as built |
| 0 → 0.35 | still `angry`, looking at the card; the arms ease to −25 / +25 (0.35) |
| 0.35 | `annoyed` (0.25 `power2.inOut`; `rotation` → 0), with no `vein` |
| 0.6 | a sigh: `upper` `scaleY` 1.04 (0.3 `sine.inOut`), then 0.97 (0.35 `sine.inOut`), then `SETTLE` |
| 0.85 | neutral (0.25); arms 0, `mixL`/`mixR` 1 |
| 1.25 | `happy` (0.12), held to 1.6. Mood neutral, count 0 |
| 1.6 | the normal B pick (R9): the pick act where he stands, with `excited`, the bounce, `PROP_IN`, the flourish, and the love eyes and heart burst (R6B.4). Then he walks toward the picked card (at most `WALK.reach`) carrying the prop, and patrols once quiet |

- A toss in flight runs to its end (R2.2). It ends by 1.45 from its release, which is always
  before the calm's `PROP_IN`, so re-picking the same card is safe.

### R6A.9 The pick lock (rev 4; home's About only)

**Span:** from the tantrum's 0 to the forgive's end. Full motion: 1.9 + the flee (0–2.2) + the
sulk (6.4) + the forgive (1.8), about 10–12s of live time. Reduced motion: 0 to
`REDUCED_SULK.end` (7.9). It pauses with the crew off screen and in a hidden tab, like the chain
it follows. Failsafe: it always unlocks after `PICK_LOCK.max` (16s live), and teardown
(`resetRix`) strips `data-locked` and every `aria-disabled`.

**What's locked:** only the visitor's own (trusted) input on About's six radios. Untrusted
changes still apply: the toss's deselect (R6A.4); the "Shown for" tag (another section, not
locked); `?for=` and the session memory, which apply once after mount, before he can land and be
poked, so in practice they never meet the lock (if one did, it applies silently, as built).

**How (chosen: `aria-disabled` plus swallowing, not native `disabled`):**
- Each radio gets `aria-disabled="true"`. Screen readers say each card is unavailable, and the
  radios keep their place in the tab order.
- One capture-phase listener set on the option root, added first, swallows while locked:
  - `click` inside a card (`preventDefault`): the label's click never checks the radio, by
    pointer or tap
  - `keydown` of Space and the four arrow keys on a radio (`preventDefault`): no check and no
    roving move, so arrows do nothing. Tab and Shift+Tab work as normal
  - any trusted `change` that slips through (the safety net): the previous radio is re-checked
    and `stopImmediatePropagation()`, so the memory, `AboutStatus` and the motion never see it
- **Why not `disabled`:** a disabled radio drops out of the tab order and loses focus if it has
  it (focus falls to `body`, breaking R1.4). With all six disabled the group leaves the tab
  order, and a screen reader user can't reach the cards to learn why. `aria-disabled` keeps
  focus where it is, and the visible ring stays.
- **Rix:** card hover and focus are ignored, as R4.5. A swallowed press during the sulk plays the
  hmph (`HMPH.gap`); during the stomp and flee it does nothing.

**Visible state** (`AboutPosterBoard` fieldset gains `group/board`; JS sets `data-locked` only
while locked; no JS, no lock):

| Card part | Unlocked (as built) | Locked |
|---|---|---|
| Label | `cursor-pointer` | `group-data-locked/board:cursor-not-allowed` |
| Span, not checked | `border-line bg-band text-text` | `group-data-locked/board:peer-not-checked:opacity-60` |
| Hover | `peer-not-checked:hover:border-muted` | none: `group-data-locked/board:peer-not-checked:hover:border-line` |
| Active | `peer-not-checked:active:bg-line` | none: `group-data-locked/board:peer-not-checked:active:bg-band` |
| Focus-visible | the 2px `text` outline, offset 4 | unchanged: focus always shows |
| Checked | accent card and tick | unchanged and not dimmed (only "Not sure yet" stays checked through a toss; a prop card is unchecked at the release) |

- **Tokens:** `line`, `band`, `text`, `muted`, `accent`, `on-accent`, and `opacity-60` as a
  utility only. No new token. The `group-data-locked` variant (one attribute) outranks the
  card's own hover and active classes by specificity, so their order doesn't matter.
- **Contrast:** `text` on `band` at 60% over `bg` is about 6.6:1, so dimmed labels stay above
  4.5:1. The tick and the dim mean the state isn't shown by colour alone.
- **Sizes:** nothing moves or resizes. The board is as built at every width (2 × 3 at 360,
  154 × min 144; 3 × 2 from 768, 225 × min 208; 432 × min 256 at 1440; 501 × min 288 at 3840),
  and Rix stays 136×88.
- **Motion (later):** none. The class switch is instant in both motion modes; Rix's tantrum is
  what the eye follows.

**Announcements** (`RixStatus`, polite, one whole line each, so a screen reader hears one
utterance and not two racing ones):
- **Lock:** `lockLine` is appended to the line the tantrum already announces: "{angry line}
  {lockLine}" at 0, or "{throwAway} {lockLine}" at the release (0.75; reduced 0.4) when a prop is
  thrown.
- **A swallowed press:** `lockLine` again, at most once per `PICK_LOCK.remind` (3s). The status
  clears first, so the same text reads again.
- **Unlock:** `unlockLine`, at the forgive's 1.8 (reduced: 7.9).
- `throwAway` no longer says "you can pick again", because the cards are locked at that moment;
  `unlockLine` says it (copywriter).

---

## R6B. Love: the pet and the pick's hearts

### R6B.1 The pet (detection, `lib/rixPet.ts`)

- **Fine pointer:** when the perk (or "caught") ends with the pointer over the Rix button, a rest
  timer of `PET.hover` (1.5s) starts, anchored at the pointer.
  - Moving more than `PET.drift` (8px) from the anchor re-anchors it and restarts the timer.
  - Leaving him cancels it.
  - When the timer completes and the R2.1 gate passes, love plays (R6B.2).
- **Touch or pen:** a `pointerdown` on the button starts `PET.press` (0.6s).
  - Moving more than `PET.slop` (10px), a `pointercancel` (a scroll took over), or lifting
    before 0.6 cancels it. A short tap stays a poke, as built.
  - At 0.6 love plays. The click that ends this press is swallowed: it's never counted.
- **Keyboard:** no pet. Enter and Space stay pokes.
- **Limits:** one pet per hover or press. The next can't start until `PET.rest` (4s) after a love
  ends. It is never a poke, never counted, never announced.
- **Gates:** ignored before landing, and during a pick, calm, tantrum, flee, sulk or annoyed hold.
  A pointer that reaches him while he naps wakes him (R6.3) first, and the pet can follow the
  wake.

### R6B.2 The love act (a pet; ≈ 2.4s)

| At | Move |
|---|---|
| 0 | `cut()` (a stretch brakes). `love` In: the eyes turn into diamonds (0.2 `back.out(2)`), look +2 / −1, melt `upper` 1.03×0.96 and y +1 (0.4 `sine.inOut`), arms −35 / +35 (0.2 `power2.out`), `foot-right y` −3 (0.2 `power2.out`) |
| 0.1 | the `hearts` loop (`HEARTS`) and the eyes' beat (`LOVE.beat`) start |
| 0.3 → end | the sway: rig tilt ±3, half-cycle 0.6 `sine.inOut` |
| 0.6 | the next `petLines` line types (never announced) |
| 2.4 | `love` Out (0.35): no new hearts start, and the rising ones finish. Sway, melt and foot to 0 (0.3 `power2.inOut`). With a fine pointer still resting on him, this waits, up to `LOVE.max` (4.0) |

### R6B.3 The poke heart

- On pokes 1–2, one in three (`PET.pokeHeart` 0.33) shows a single heart (`HEART_ONE`, part 1 of
  `hearts`) instead of the `sparkle`.
- The eyes stay `happy`, and nothing else changes.

### R6B.4 The pick's hearts (B, a pick with a prop; not "Just looking"; not `?for`)

| At | Move |
|---|---|
| 0 → 0.6 | as built: `excited` eyes, the bounce, `PROP_IN` from 0.2. No `sparkle` |
| 0.55 | `HEART_BURST`: the three `hearts` parts pop from the prop's top centre (118 20) and fan out, fading by 1.05 |
| 0.6 | the eyes go from `excited` to `love` (0.15 `power2.out`; the eyes only, with no beat). The body, look, arms and flourish stay the pick's |
| 1.3 | `love` Out (0.35) |

---

## R7. Budgets (all in the crew: everything pauses off screen and in a hidden tab)

**Rev 4 replaces the play clock and the nudge clock on home's About with one idle clock**
(`lib/rixIdle.ts`). The playground keeps its schedulers off.

- **Two phases, by live time** (crew time: on screen, tab visible), counted from landing whatever
  he's doing:
  - **busy:** the first `TEMPO.busy` (360s, 6 minutes)
  - **settled:** after that, for the rest of the page load
- **The idle clock** runs one item at a time: a beat (R6.8), a play (R6), a stroll (one patrol
  stretch, busy phase only) or a chatter act (R5.4).
  - The first item `TEMPO.first` (2s) after the ask ends.
  - **Busy:** the next item `TEMPO.busyGap` (2–4s) after the last item, act or walk ends. Each
    gap opens with one `PATROL.looks` look. Picked by `IDLE_MENU.busy`: beat 10, stroll 4,
    play 3.
  - **Settled:** the next item `TEMPO.settledGap` (10–15s) after the last item, act or walk ends;
    the patrol (R4.8) fills the time between. Picked by `IDLE_MENU.settled`: beat 1, play 2. An
    item due mid-stretch waits for the stretch's end.
  - Inside a kind: plays by `PLAY.weights` (juggle 3, sit 3, peek-a-boo 1, logo pose 1,
    balance 1), beats by `BEAT.weights`.
  - Never the same item twice in a row (by name; "stroll" counts as one name). Plays stay at most
    `PLAY.max` (3) per 60s of live time; past that, a beat goes instead.
- **The idle talk clock** (`IDLE_TALK`) decides when chatter is due: first `IDLE_TALK.first` (4s)
  after landing, then `IDLE_TALK.busyGap` (8–12s) in the busy phase or `IDLE_TALK.settledGap`
  (20–30s) settled, each measured from the last line's end, whatever its source. When due, the
  next idle slot is the chatter act in place of the menu's pick. A hover line or a poke line
  resets it.
- **Gates.** An idle item starts only when all hold; otherwise it waits and re-checks every
  `TEMPO.retry` (0.5s), and a wait doesn't count as an item:
  - landed; no act running; mood neutral; no held emotion; not napping
  - no card target holds (hover mode owns him, R4.9)
  - the pointer isn't over Rix (the perk and the pet own that)
  - for a play, a stroll or a chatter act: no quip is showing
  - for a stroll: Rix doesn't have keyboard focus (the menu picks a beat instead)
- **Dropped in rev 4:** the pointer-near skip (`NUDGE_QUIET`), the "focus inside" skip, the 4s
  retry, `NUDGE_MAX` and the end of chatter on a pick.
- **Hover mode** (R4.9) is visitor-driven and isn't on the idle clock. It runs the same in both
  phases. The idle clock waits while a target holds, then resumes with its gap after
  `LOOK_RELEASE`.
- **Pointer-driven:** tag, the nap and the pet aren't on the clock. Tag is limited by `TAG`, the
  nap needs 40s of visitor idle **in the settled phase**, and the pet is limited by `PET.rest`.
- **Rough ceiling, one idle visible minute:**
  - **busy:** about 10–12 items (about 5–6 beats, 2 strolls and at most 3 plays) and about
    4 chatter lines, plus up to one hover line every 5–6s while a card is held (3 per hold)
  - **settled:** about 4–5 items (at most 3 plays), the slow patrol, and about 2 chatter lines
  - never two acts at once. The ladder and the pet run only on the visitor's own input.

## R8. Move library: new constants for `lib/rixMotion.ts`

- **Imported by name, never copied:**
  - from `lib/processBotMotion.ts`: `ANTICIPATE`, `STRETCH`, `SQUASH`, `SETTLE`, `DROP_SQUASH`,
    `POP_SCALE`, `REACT_COOLDOWN`, `BLINK_*`, `TAP_LIFT` / `TAP_UP` / `TAP_DOWN`, `NAP_*`, `Z_*`,
    `LOOK_MAX`
  - from `lib/rixMotion.ts`, as built: `PEEK_*`, `WAVE`, `PERK`, `POKE`, `POKE_COOLDOWN`,
    `QUIP_*`, `NUDGE_BOUNCE`, `LOOK_*`, `PROP_*`, `ACK_IN`
- **Emotion eye rects and poses** (R3.1) go in `lib/rixEmotions.ts` (geometry, like
  `rixProps.ts`). That includes the angry slits' and love diamonds' `rotation` and `svgOrigin`,
  and the sulk's collapsed rects. **Glyph geometry** (R3.2: paths, parts, pivots, fills) moves to
  the new `lib/rixGlyphs.ts`. Their In/Out timings go here as `EMOTION_TIMING`.
- **Removed (rev 3):** `STROLL`, `WALK_HOME_AFTER`, `DASH_PACE`, and `WALK`'s `speed`, `min`,
  `max`, `ease`, `dashStep`, `dashAbove` and `dashLean`. `Pace` loses `speed`, `min`, `max` and
  `ease`, and gains `footReach` and an optional `maxDist`.
- **Removed (rev 4):** `NUDGE_FIRST`, `NUDGE_EVERY`, `NUDGE_MAX`, `NUDGE_MAX_REDUCED`,
  `NUDGE_QUIET`, `NUDGE_RETRY`, and `PLAY.first`, `PLAY.gap` and `PLAY.retry`. `NUDGE_BOUNCE` stays
  (the pre-pick chatter act).

| Constant | Value |
|---|---|
| **`TEMPO`** (rev 4) | busy 360 (live s from landing) · first 2 (after the ask) · busyGap 2–4 · settledGap 10–15 · retry 0.5 |
| **`IDLE_MENU`** (rev 4) | busy { beat 10, stroll 4, play 3 } · settled { beat 1, play 2 } |
| **`BEAT`** (rev 4) | weights { wave 2, perk 2, hop 2, look 2, sparkle 2, wonder 2, startle 1, bashful 1, puzzle 1, fond 1 } · hold { sparkle 0.8, wonder 1.0, startle 0.6, bashful 1.4, puzzle 0.8, fond 1.0 } · In and Out from `EMOTION_TIMING`; glyph loops by name (R3.2) |
| **`HOP`** (rev 4) | `PICK_BOUNCE` (anticipate 0.1, lift −8, up 0.18, down 0.16, squash 0.06) with the feet at `POKE.feet` −6 (up 0.14 `power2.out`, down 0.12 `power2.in`, as the poke) |
| **`HOVER`** (rev 4) | lineDwell 0.8 · beatGap 1.2–2.0 · lineGap 1.5–2.5 · lines per hold { before 3, switch 1, picked 0 } · repeatAfter 20 · glanceHold 0.5 · cheer 0.6 · beats { hop 3, point 3, cheer 2, perk 2, glance 2 } |
| **`IDLE_TALK`** (rev 4) | first 4 (after landing; reduced: after the stage shows) · busyGap 8–12 · settledGap 20–30 · reducedGap 20–30 (each from the last line's end, any source) · minGap 1.5 · lookDown { d −3, p 3 } |
| **`PICK_LOCK`** (rev 4) | remind 3 · max 16 (live s) |
| `WALK` | dwell 0.25 · **reach 200px** · minDist 12px · step 0.15 · footReach 9 · footLift 4 · bob 1.5 · lean 3 · armSwing 14 · carry −10 · face { d 3, p 3 } (96 px/s at 136px) |
| `GAIT` | unit = box width ÷ 170 · stride = 2 × footReach × unit · n = max(1, round(D ÷ stride)) · r = D ÷ (2 n unit) · steps n + 1 · duration (n + 1) × step · ease { start `power1.in`, mid `none`, stop `power1.out` } |
| `PATROL_PACE` / `PATROL` | footReach 7 · step 0.2 · footLift 3 · bob 1 · lean 1.5 · armSwing 8 (56 px/s) · first 5 · heading left · stretch 96–240px · minStretch 48px · pause 2.5–6 · looks { card 0.4, pointer 0.3, out 0.3 } · resume 3 (**rev 4:** first and pause apply in the settled phase only) |
| `WALK_START` / `WALK_STOP` / `WALK_TURN` | anticipate 0.08, faceLead 0.08 · brake 0.15 `power2.out` (slide 4px), overshoot 1.5 (0.12), back 0.3 `back.out(1.6)` · eyes 0.12 `power2.inOut` |
| `TALK` | char 0.035 · pause 0.14 · bob −1.5 · squish { height 10, y 2 } · afterPoke 0.5 · afterNudge 0.3 (also chatter) · afterAnnoyed 0.25 · afterAngry 0.15 · **afterPet 0.6** · afterSulk 0.4 · afterForgive 0.9 |
| `EMOTION_TIMING` / `EMOTE_IN` / `EMOTE_OUT` | R3.1 In/Out per emotion (11, `love` added) · R3.2 |
| `PET` | hover 1.5 · drift 8px · press 0.6 · slop 10px · rest 4 · pokeHeart 0.33 |
| `LOVE` | length 2.4 · max 4.0 · melt { 1.03×0.96, y 1, 0.4 `sine.inOut` } · arms −35 / 35 (0.2 `power2.out`) · footPop −3 · sway { tilt 3, half 0.6 `sine.inOut`, from 0.3 } · beat { scale 1.12, up 0.1 `power2.out`, down 0.2 `power2.in`, ×2, 0.35 apart, every 1.2 } · heartsAt 0.1 · lineAt 0.6 · pick { eyesAt 0.6 (0.15), outAt 1.3 } |
| `HEARTS` | per part: opacity in 0.15 · scale 0.6 → 1 (0.25 `back.out(2)`) · rise `y` −10 over 1.2 `sine.out` · sway `x` ±2, half 0.3 `sine.inOut` · fade out over the last 0.4 (`power1.in`) · stagger 0.35 (parts 1, 2, 3) · each part restarts at its drawn spot every 1.5 while love holds |
| `HEART_ONE` | part 1 only: `EMOTE_IN`, rise `y` −6 over 0.8 `sine.out`, fade over the last 0.3 |
| `HEART_BURST` | at 0.55 · from 118 20 (offsets from the drawn centres: 1 (+15, +28), 2 (+1, +24), 3 (+27, +22)) · scale 0.4 → 1 · to 1 (0, −10), 2 (+10, −6), 3 (−10, −6), 0.5 `power2.out` · fade 0.3 `power1.in` from 0.2 after the start |
| `TWINKLE` | big and small: scale 0.4 ↔ 1, half 0.25 `sine.inOut`, small 0.25 behind; while held |
| `DROP_SLIDE` | `y` +4 over 0.6 `power1.in`; opacity → 0 over the last 0.2; once |
| `DOTS` | in one by one (opacity 0.1 each, 0.2 apart); out together at 1.0 (0.15); every 1.4 while held |
| `VEIN_THROB` | scale 1.15 (0.1 `power2.out`) then 1 (0.15 `power2.in`) on In, then every 0.9 while held |
| `GRAWLIX` | frame 0.12: each frame, slots A and B (`x` +12) each show a random symbol, never repeating their own last and never the same as each other, by `gsap.set` (no tween) · its vein throbs scale 1.2, half 0.12 `sine.inOut`, yoyo |
| `JUGGLE` | props 3 · stagger 0.25 · throw { x −134, rise −40, 0.5 } · pass { rise −12, 0.25 } · rounds 2 · flick { r −25, l 20, 0.08 / 0.12 } · drop 0.25 · fall { x −136, y 42, 0.3 `power2.in` } · bounce 6 |
| `SIT` | lower 7 · in 0.3 `power2.inOut` · pose 1.04×0.96 · arms −30 / 30 · swing { x 3, y 1, half 0.45 } · length 6–9 · up 0.25 `back.out(1.6)` |
| `NAP_AFTER` / `YAWN` / `NOD` / `WAKE_START` | 40 (settled phase only, rev 4) · R6.3 · tilt 3, 0.8 / 0.15, ×2 · hop −8, 0.18 / 0.16, alert 0.6, glad at 1.0 |
| `TAG` | near 110px · speed 500 px/s · hop 48px, 0.3 · duck 6 / 0.85, hold 0.4 · dodges 2 · session 8 · rest 20 |
| `PEEKABOO` | clip `inset(-100% -100% 0 -100%)` · sink 88, 0.35 `power2.in` · hold 0.6 · rise 32 (`PEEK_OUT`) · then `PEEK_SEARCH`, `PEEK_HOP` · happy 0.4 |
| `LOGO_POSE` | lifeOut 0.3 · arms scaleX 0, 0.2 `power2.in` · hold 0.8 · wink { shut 0.07, hold 0.25, open 0.12 } · back 0.3 `back.out(2)` · happy 0.3 |
| `BALANCE` | to { x −68, y −43, 0.4 } · wobble { tilt 3, prop 8, half 0.25, ×3 } · arms 30 / −30 · back 0.35 · happy 0.4 |
| `PLAY` | ~~first 8 · gap 12–20~~ (rev 4: `TEMPO`) · max 3 per 60 · ~~retry 4~~ (rev 4: `TEMPO.retry`) · weights as R7 |
| `NUDGE_BOUNCE.at` | `[0.1]` (was `[0.1, 0.55]`); the pre-pick chatter act (rev 4) |
| `POKE_WINDOW` / `POKE_REPEAT` / `POKE_LADDER` / `ANNOYED_MIN` | 4.0 · 0.15 (and key repeats never count) · { annoyed 4, tantrum 6 } · 0.6 |
| `POKE_COOLDOWN` (kept) | 0.9, now the gap between poke **acts**; presses inside it queue (R6A.1) |
| `ANNOYED_POKE` | stiff { 0.98×1.03, 0.12 `power2.out` } · arms −25 / 25, 0.15 · huff { y −1.5, at 0.15, 0.08 / 0.2 } · taps at [0.2, 0.45] · length 0.9 |
| `TANTRUM` | stomps at [0.1, 0.4, 0.7, 1.0], L R L R · stomp { lift −7, up 0.12 `power2.out`, slam 0.06 `power4.in`, squash 0.05 } · shake { x 1.5, half 0.04, 0.1 → 1.9 } · arms { l −40, r 40, shake 6, half 0.08 } · fleeAt 1.9 |
| `TOSS` / `ACK_OUT` | windup { r 25, at 0.55, 0.15 `power2.in` } · fling { r −80, at 0.7, 0.1 `power3.out` } · release 0.75 · x 150 (max; roomier side, clamped to room − 8px) · rise −36 (0.25 `power2.out`) · fall +60 (0.45 `power2.in`) · spin 540 · scale 0.8 · fade { at 1.05, 0.4 `power1.in` } · origin "118 36.5" · armBack { at 0.95, 0.3 `back.out(1.6)` } · ack out 0.2 `power1.in`, ending at the release |
| `FLEE` / `STOMP_WALK` | footReach 12 · step 0.1 · footLift 6 · bob 2 · lean 7 · armSwing 20 · **maxDist 400px** (192 px/s) · footReach 9 · step 0.22 · footLift 7 · slam 0.06 `power4.in` · squash 0.05 · lean 2 · arms −40 / 40 · **maxDist 120px** (65 px/s) |
| `SULK` / `HMPH` | slide 0.15 `power2.inOut` · collapse 0.25 `power2.in`, at 0.15 · squeeze 0.92, 0.3 `power2.inOut` · slump { y 1.5, scaleY 0.97 } · arms −20 / 20 · tilt 3 · hold 6 · breath 0.6 · hmph { tilt 2, half 0.06, dip 0.96 (0.06), gap 0.5 } |
| `FORGIVE` / `WAVE_SMALL` | peek { width 7, 0.2 `power2.out` } · hold 0.5 · turnAt 0.7 (0.3 `back.out(1.6)`) · happyAt 0.85 · waveAt 0.9 · length 1.8 · up −35, 0.2 `power2.out` · swing 8, 0.12 `sine.inOut` ×2 · back 0.3 `back.out(1.6)` (rev 4: also the hover `point`, on either arm, and the post-pick chatter act) |
| `CALM` | angryHold 0.35 · annoyedAt 0.35 (0.25) · sigh { at 0.6, in 1.04 0.3, out 0.97 0.35 } · neutralAt 0.85 (0.25) · happyAt 1.25 · pickAt 1.6 · sulkTurn 0.3 `back.out(1.6)` (playground only, rev 4) |

### R8.1 Reduced motion and no JS

| Move | Reduced motion (fades only) |
|---|---|
| arrival, pick | as built: static pose, the prop and ack fade. No heart burst |
| chatter (rev 4; was "one nudge line, once") | the line fades (0.4 in, 2.4 hold, 0.4 out), never announced: first `IDLE_TALK.first` after the stage shows, then every `IDLE_TALK.reducedGap` (20–30s live) in both phases. Pools by the pick state, as R5.4. No act |
| hover lines (rev 4) | detection as R4.9, with no walk: the first line fades in once the target has held `HOVER.lineDwell`, the next per `HOVER.lineGap` and `HOVER.lines`, never announced. A line fades out (0.4) when its card's target leaves. No beats, no look |
| pokes 1–3 | as built: the line fades (0.4 in, 2.4 hold, 0.4 out) and is announced |
| annoyed (4–5) | the `annoyedLines` line fades the same way and is announced. No stiffen, taps, eyes or vein |
| tantrum (6+) | the `angryLines` line fades and is announced (with `lockLine` on About). No stomp, shake, flee, slant or grawlix |
| the toss | no throw. **The deselect still happens:** at 0 the prop and the ack fade out (`duration.fade` 0.4, inline). At 0.4 comes the deselect (R6A.4, steps 1–5), and `throwAway` is announced (with `lockLine` on About). Opacity is allowed, and the pick's state must match full motion |
| sulk, forgive | no turn and no hmph. The sulk window runs `TANTRUM.fleeAt` + `SULK.hold` (7.9s) from the tantrum's start. Presses in it do nothing. The `sulkLine` fades in after the angry line ends (3.2), and the `forgiveLine` fades in at 7.9 |
| the pick lock (rev 4, About) | **applies,** 0 → 7.9: the same `aria-disabled`, swallowing, dimmed classes (an instant class switch, no fade) and announcements; `unlockLine` at 7.9 |
| calm by a pick | the playground only (rev 4): none. The prop and ack fade as built; any Rix line fades out (0.4); mood neutral, count 0 |
| pet | detection as R6B.1. The `petLines` line fades (0.4 in, 2.4 hold, 0.4 out), never announced. No eyes, hearts, melt or sway |
| talk | the whole line fades in (0.4), holds 2.4, fades out (0.4): no typing, no bob. A scheduled line still never starts while one shows (R5.4) |
| walk, patrol, turn, tag | off: he stays at `x` 0 (the first-paint spot) and doesn't look |
| emotions, glyphs | off: the static pose, no glyphs |
| juggle, sit, nap, wake, peek-a-boo, logo pose, balance, beats, hover beats | off |

**No JS:** he stands in the static pose at `x` 0, as a decorative span. The quip is empty, the
zzz and glyphs are hidden, and the picked prop shows by CSS `:has`. There is no poke, pet,
ladder, tantrum, patrol, deselect, chatter or pick lock.

---

## R9. Applying to option B (replaces the B column of O4's adaptation table)

| Moment | B does |
|---|---|
| Arrival | Peeks round the shelf's right end (as built), with `surprised` at the spot. Hops, lands, then the ask (the wave, looking at the board). The idle clock starts `TEMPO.first` after the ask (R7) |
| Hover or focus on a card | Looks at once (as built); a stretch brakes. After `WALK.dwell` he walks toward the card's stand spot, at most `WALK.reach`. He arrives over it, or stops partway, then runs **hover mode (R4.9)** while the target holds: hover beats aimed at the card and typed lines about it (before a pick), a "switching?" line (after one, on another card), happy beats on the picked card. The idle clock resumes after release. Ignored during a tantrum or sulk |
| Pick | The pick act where he stands: `excited` eyes, then `love` eyes and the heart burst (R6B.4). Then he walks toward the picked card (at most `WALK.reach`) carrying the prop, and patrols once quiet. Phones: a tap is the pick, so he walks after it. **From the tantrum's start to the forgive's end the cards are locked (R6A.9)** |
| Poke | The ladder (R6A): happy 1–3, annoyed 4–5, then the tantrum, the toss (if he holds a prop), the flee, the sulk and the forgive |
| Pet | Rest a fine pointer on him 1.5s, or long-press 0.6s on touch: `love` with rising hearts (R6B) |
| Chatter (was the nudge) | On the idle talk clock, from wherever he stands, never mid-stretch. Before a pick: the wave, one bounce and an `idleLines` line, looking at the board's centre. After a pick: a look down toward the examples, the small wave and an `afterPickLines` line (R5.4). No cap |
| Idle | **Busy (first 6 live minutes):** an item every 2–4s: beats, strolls and plays (R7). **Settled:** the patrol (R4.8), with a beat or play every 10–15s in its pauses, and the nap after 40s of visitor idle. Tag with a fine pointer only |

#### Sizes (B; Rix 136×88 at every width, 1 unit = 0.8px)

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Shelf (the walk track) | 320 | 706 | 1328 | 1536 |
| Start (first paint, reduced motion, no JS), box left | 184 | 570 | 1192 | 1400 |
| Travel range (shelf − 136) | 184 | 570 | 1192 | 1400 |
| Stand spots, box left (by column) | 13 · 179 | 48 · 289 · 530 | 152 · 600 · 1048 | 187 · 704 · 1221 |
| Card walk reach | the whole track (184 ≤ 200): he always reaches the card | 200px; farther cards are partway | 200px | 200px |
| Longest card walk (`WALK`, 96 px/s) | 171px: 12 strides, 13 steps, 1.95s | 200px: 14 strides, 15 steps, 2.25s | same | same |
| Patrol stretch (`PATROL_PACE`, 56 px/s) | 96–184px, 2.0–3.4s | 96–240px, 2.0–4.4s | same | same |
| Longest flee (`FLEE`) | 184px, 1.1s | 400px, 2.2s | same | same |
| Longest stomp walk (`STOMP_WALK`) | 120px, 2.0s | same | same | same |
| Toss, sideways (at most 120px, clamped to room − 8px) | from the start 120px left; from col 1, 120px right | 120px | 120px | 120px |
| Quip | left; right at col 1 (171px of room: it fits, or overhangs the container by ≤ 1px into the 20px gutter) | left, or right near col 1 | same | same |
| Paint outside the box | up ≤ 8px (zzz; rising hearts ≤ 4.8px), into the 24px gap under the prompt. Down ≤ 6px (sit feet) and ≤ 14.4px (the toss's fading end), both inside the 16px gap above the cards. None sideways past the shelf | same | same | same |
| Hover `point` (rev 4) | either arm, inside the box (arms span x −4..104) | same | same | same |

- **B quip placement (`AboutPosterShelf`):** `top-2 w-max max-w-40 right-full mr-3 text-right data-[side=right]:right-auto data-[side=right]:left-full data-[side=right]:mr-0 data-[side=right]:ml-3 data-[side=right]:text-left`.
- **States:** as O4.1.
  - Hover on Rix is the perk (a stretch brakes first), or "caught" after tag. There's no perk
    during an annoyed hold or a sulk. Resting there `PET.hover` is a pet.
  - Active is the press: a poke-ladder step, or a hmph in the sulk. A touch held `PET.press` is
    a pet, not a press.
  - The focus ring (`focusRingCard`) travels with the walker, through the flee too. The patrol
    holds still while Rix has focus.
  - **Cards (rev 4):** as §2a.B, plus the locked state (R6A.9).

---

## R10. The `/dev` "Rix sheet" playground (superseded 2026-10-02 by `/rix`)

> **Superseded.** The playground is now the public `/rix` route, specified in
> `docs/pages/rix/ui-spec.md` (file plan in its §0.3). The `sheet` host is renamed `playground`.
> The `Dev*` components, `useRixSheet`, `rixSheet*` and `content/dev.ts` are retired, and `/dev`
> is a 404 stub. The text below is kept as the record of the `/dev` build.
>
> **Rev 4:** nothing changes on the playground. Its schedulers stay off (no idle clock, chatter,
> hover mode or pick lock), and it keeps its Calm and "Tantrum, toss prop" buttons (R6A.8).

- **Place:** the first block on `/dev`, before the option frames. `app/dev/page.tsx` only adds
  `<DevRixSheet />`.
- **Wrapper:** no border. Option A's frame is no longer `first:`, so it gets its own dashed line.
- **Schedulers off:** no nudges, plays, nap timer, tag or follow, and the patrol is off unless
  toggled on. Life stays on: breath, blinks and looks.
- **Buttons:** each button cuts the current move and plays its own. Priority and budgets are
  ignored here.
- **Poking and petting Rix himself** on the sheet run the real ladder (R6A.1: count, window,
  gates and queue) and the real pet detection (R6B.1), so the lead can test both by hand.

```
DevRixSheet (server):  px-gutter → {container} → DevLabel (extracted from DevOptionFrame, which reuses it)
  <section aria-labelledby={labelId} class="px-gutter"> → <div class="{container} flex flex-col gap-10 pt-10 pb-section">
    DevRixStage: <div class="flex flex-col">
      shelf  <div data-anim="about-rix-stage" class="relative flex justify-end border-b-2 border-line"> → Rix (quipKey "rix-sheet", B's quip placement)
      slots  <div aria-hidden="true" class="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4"> × 6
             <div data-rix-slot={i} class="grid h-16 place-items-center rounded-3xl border border-dashed border-line font-mono text-meta text-muted md:h-24">{slotLabel} {i+1}</div>
    readout <p aria-live="polite" class="font-mono text-meta text-muted">{nowPlaying}: {move}</p>
    DevRixControls (client):
      toggles <div class="flex flex-wrap gap-2"> → DevRixButton × 2 (aria-pressed): reduced-motion preview, patrol (new)
      groups  <div class="grid gap-8 md:grid-cols-2 xl:grid-cols-5">            ← was lg:grid-cols-4 (five groups now)
        group <div role="group" aria-labelledby={id} class="flex flex-col gap-3"> → <h3 id class="{monoLabel}"> → <div class="flex flex-wrap gap-2"> of DevRixButton
```

- **Toggles (above the groups):**
  - the **reduced-motion preview** (`aria-pressed`), which runs each button's R8.1 version
  - **patrol** (new, `aria-pressed`, off by default): on, the real R4.8 patrol runs, with plays
    still off. Off, a running stretch brakes.
- **Groups (five):**
  - **Emotions:** 11 buttons, `love` added. Each shows its glyph as R3.1 says.
  - **Moves:**
    - walk to the first slot, the middle (the middle column; on phones the shelf's centre) and
      the last column, following the real reach (partway past 200px)
    - talk (`talkSample`)
    - perk, wave, nudge
    - pick (each press cycles the props, ending with the shrug; plays R6B.4's hearts)
    - **pet** (new): the R6B.2 love act, as if petted
    - replay the arrival
    - **Removed:** walk home (there is no home).
  - **Plays:** juggle, juggle with a drop, sit, nap, wake, tag dodge, tag duck, peek-a-boo, logo
    pose, balance.
  - **Moods:**
    - **poke ×1:** one happy poke
    - **annoyed:** one annoyed poke
    - **tantrum:** no prop, then the flee and sulk
    - **tantrum with a pick:**
      - He takes the next prop first (`gsap.set`, no act), then runs the tantrum with the toss.
      - The sheet has no radios, so the deselect is skipped and the toss alone plays.
    - **sulk:** the turn, the real 6s hold, then the forgive
    - **forgive:** from the sulk pose; it's set first if he isn't sulking
    - **calm by a pick:**
      - The `angry` pose is set first if he isn't angry or sulking.
      - Then `CALM`, then the pick with the next prop.
  - **Glyphs** (new): each shows one glyph on neutral eyes, with its loop, for 2.0s, then
    `EMOTE_OUT`: alert, question, heart (`HEART_ONE`), hearts (`HEARTS`), burst (`HEART_BURST`
    over the empty hand slot), sparkle, drop, dots, vein, grawlix, zzz.
- **`DevRixButton`:** `<button type="button" class="{chip} border-line text-muted {focusRing}">`.

| State | Default | Hover | Focus-visible | Active | Playing / pressed |
|---|---|---|---|---|---|
| Button | `border-line text-muted` | `hover:border-muted hover:text-text` | `focusRing` | `active:bg-band` | `data-[playing]:border-accent data-[playing]:text-accent`; toggles `aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:text-on-accent` |

#### Sizes

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Content | 320 | 706 | 1328 | 1536 |
| Shelf, Rix | 320, 136×88 | 706 | 1328 | 1536 |
| Slots | 2 cols, 154×64, gap 12 | 3 cols, 225×96, gap 16 | 3 cols, 432×96 | 501×96 |
| Toggles | 2 buttons, wrapping | same | same | same |
| Control groups | 1 col, gap 32 | 2 cols, 337 each (the fifth wraps) | 5 cols, 240 each | 282 each |
| Buttons | 44 tall, `text-body`, wrapping | same | same | same |

Contrast: `muted` on `bg` about 6.9:1, `accent` about 8.6:1, `on-accent` on `accent` about 9:1.

**Content (`content/dev.ts → rixSheet`; dev-only copy, written by copywriter):**

| Key | Meaning | Limit |
|---|---|---|
| `letter`, `name`, `line` | the dev label: "R", the sheet's name, what it's for | 1 char · 3 words · 12 words |
| `groups.{emotions,moves,plays,moods,glyphs}` | group headings (**`glyphs` new**) | 3 words each |
| `emotions.{happy,excited,curious,shy,surprised,confused,sleepy,sad,annoyed,angry,love}` | button labels (**`love` new**) | 1 word each |
| `moves.{walkFirst,walkMiddle,walkLast,talk,perk,wave,nudge,pick,pet,arrive}` | button labels (**`pet` new**; `walkHome` removed) | 3 words each |
| `plays.{juggle,juggleDrop,sit,nap,wake,tagDodge,tagDuck,peekaboo,logoPose,balance}` | button labels | 3 words each |
| `moods.{poke,annoyed,tantrum,tantrumPick,sulk,forgive,calm}` | button labels | 3 words each |
| **`glyphs.{alert,question,heart,hearts,burst,sparkle,drop,dots,vein,grawlix,zzz}`** (new) | button labels: one per glyph or loop | 3 words each |
| `slotLabel` · `nowPlaying` · `idle` · `reducedToggle` · **`patrolToggle`** (new) | slot name before its number · readout lead · readout when still · toggle label · patrol toggle label | 1 · 2 · 1 · 4 · 4 words |
| `talkSample` | a sample Rix line at the 30-character limit (two quip lines), no claims | 30 characters |

---

## R11. Files

> **2026-10-02:** the `/dev` playground files below became `components/rix/*`,
> `hooks/useRixPlayground.ts`, `lib/rixPlayground.ts` and `lib/rixPlaygroundMoves.ts` (see
> `docs/pages/rix/ui-spec.md` §0.3). The host is `playground`, not `sheet`.

- **Rev 4 (home's About; one job per file):**
  - **New logic:**
    - `lib/rixIdle.ts`: the idle clock (R7): the phases, the menu, the gaps, the gates and the
      chatter slot. It takes over `lib/rixPlays.ts`'s weighted pick, which folds into it
    - `lib/rixIdleTalk.ts`: the idle talk clock (`IDLE_TALK`): when chatter is due
    - `lib/rixBeats.ts`: the R6.8 beats
    - `lib/rixHover.ts`: hover mode (R4.9): the base expression and the hover beats
    - `lib/rixLines.ts`: which line next (R4.9, R5.4): the pools by pick state, in turn,
      `repeatAfter`, never twice in a row (pure)
    - `lib/aboutPickLock.ts`: the pick lock (R6A.9): `data-locked`, `aria-disabled`, the
      capture-phase swallowing, the reminder and the failsafe
  - **Extended:**
    - `lib/rixFull.ts` (wires the idle clock, idle talk, hover mode and the lock; the nudge and
      play clocks are gone; calm by a pick only on the playground host)
    - `lib/rixFade.ts` (the faded chatter and hover lines, the lock)
    - `lib/rixWander.ts` (hands a stopped card walk to hover mode instead of holding `curious`)
    - `lib/rixPatrol.ts` (busy phase: one stroll on request; settled: as R4.8)
    - `lib/rixPriority.ts` (`beat` at rank 8; `chatter` replaces `nudge` at 7; hover beats ride
      the walk's rank 5)
    - `lib/rixRig.ts` (`RixAct` gains `beat` and `hover`; `nudge` becomes `chatter`;
      `resetRix` strips `data-locked` and `aria-disabled`)
    - `lib/rixTantrum.ts`, `lib/rixForgive.ts`, `lib/rixFadeTantrum.ts` (the lock and unlock
      cues), `lib/rixStatus.ts` (clear, then set, so a repeated line is read again)
    - `lib/rixMotion.ts` (R8, rev 4 rows and removals)
    - `components/home/about/poster/AboutPosterBoard.tsx` (`group/board`) and
      `AboutPosterCard.tsx` (the locked classes, R6A.9)
    - `content/home.ts → about.rix` (the R12.2 slots, copywriter)
  - **Retired:** `lib/rixNudges.ts` (no users left) and `lib/rixPlays.ts` (folded into
    `lib/rixIdle.ts`).
  - **New hooks:** none. The lock's listeners live in `lib/aboutPickLock.ts`, wired by
    `lib/rixFull.ts` and `lib/rixFade.ts` (constitution §9).
- **Extended:**
  - `RixButton` (the walker wrapper; `[-webkit-touch-callout:none]` on the button)
  - `RixQuip` (the anchor hook, character spans, side classes)
  - `RixStatus` (takes the ladder's lines and `throwAway`)
  - `Rix` (renders `RixEmotes`)
  - `components/home/about/RixEmotes.tsx` (rev 3: every R3.2 glyph from `lib/rixGlyphs.ts`;
    multi-part glyphs as a `g` of `data-emote-part` paths; the fill class per glyph)
  - `AboutPosterShelf` (the quip classes)
  - `lib/processBots.ts` (host zzz)
  - `lib/processBotActs.ts` (export `startZzz`)
  - `lib/rixMotion.ts` (R8: `WALK`, `GAIT`, `PATROL_PACE`, `PATROL`, `PET`, `LOVE`, the glyph
    loops, `FLEE` and `STOMP_WALK`; `EmotionName` gains `love`; the R8 removals)
  - `lib/rixEmotions.ts` (`love`; the glyph geometry moves out to `lib/rixGlyphs.ts`)
  - `lib/rixEmote.ts` (each emotion's glyph and its loop; the act may suppress or swap it)
  - `lib/rixRig.ts`:
    - `RixAct` gains `walk`, `play`, `tantrum`, `calm`, `pet` and `patrol`
    - `parts.emotes` holds each glyph and its parts
    - `resetRix` strips the walker, `data-side`, the characters, the glyphs and their parts, the
      eye `rotation` and `scale`, and the stage clip
  - `lib/rixActs.ts` (the poke hands its level to `rixMood`; the poke's sparkle or heart; nudge;
    `cut` per R2.2)
  - `lib/rixPick.ts` (excited, then love eyes and `HEART_BURST`; the calm hands off to it)
  - `lib/rixPeek.ts` (surprised)
  - `lib/rixQuipMotion.ts` (typing via `lib/rixTalk.ts`)
  - `lib/rixStep.ts` (the stride-locked step cycle, R4.3)
  - `lib/rixWalk.ts` (legs from `lib/rixGait.ts`; no dash; the partway stop)
  - `lib/rixTrack.ts` (no home; `startLeft`; the reach and the partway spot)
  - `lib/rixWander.ts` (card walks only, with the reach; home and the stroll removed; hands
    quiet time to the patrol)
  - `lib/rixPriority.ts` (R2.1 ranks: `pet` 4, `patrol` 9)
  - `lib/rixPlays.ts` (plays only while he stands; a stretch doesn't reset the gap)
  - `lib/rixNap.ts` and `lib/rixFull.ts` (the nap anywhere he stands; `atHome` removed; wires
    the patrol and the pet)
  - `lib/rixJuggle.ts` and `lib/rixTag.ts` (the sparkle, the drop and the dots)
  - `lib/rixTantrum.ts` (the flee's `maxDist`), `lib/rixSulk.ts` (the wall is the flee side),
    `lib/rixForgive.ts` (the patrol resumes), `lib/rixCalm.ts` (the partway walk)
  - `lib/rixFade.ts` (the pet line's fade under reduced motion)
  - `lib/rixFeatures.ts` (B gets the patrol, the pet and love; A and C get none)
  - `lib/rixSheet.ts`, `lib/rixSheetMoves.ts`, `hooks/useRixSheet.ts` and
    `components/dev/DevRixControls.tsx` (the glyphs group, love, pet, the patrol toggle;
    `walkHome` removed)
  - `hooks/useAboutRix.ts`:
    - wires B's features
    - the deselect clears the remembered previous pick
    - untrusted changes with nothing checked play nothing
  - `DevOptionFrame` (uses `DevLabel`)
- **New UI:**
  - `components/dev/DevLabel.tsx`, `DevRixSheet.tsx`, `DevRixStage.tsx`, `DevRixControls.tsx`
    (client), `DevRixButton.tsx` (as built in rev 2)
- **New logic** (one job each):
  - **rev 3:**
    - `lib/rixGlyphs.ts` (R3.2 geometry: paths, parts, pivots, fills)
    - `lib/rixGlyphLoops.ts` (`HEARTS`, `HEART_ONE`, `HEART_BURST`, `TWINKLE`, `DROP_SLIDE`,
      `DOTS`, `VEIN_THROB`, `GRAWLIX`)
    - `lib/rixGait.ts` (R4.2: distance → strides, reach and duration; pure)
    - `lib/rixPatrol.ts` (R4.8: stretches, pauses, looks, turns at the ends, resume)
    - `lib/rixPet.ts` (R6B.1: the rest timer, the long-press, the swallowed click, the gates)
    - `lib/rixLove.ts` (R6B.2: the love act)
  - as built in rev 2: `lib/rixEmotions.ts`, `lib/rixEmote.ts`, `lib/rixWalk.ts`,
    `lib/rixStep.ts`, `lib/rixTalk.ts`, `lib/rixPriority.ts`, `lib/rixPlays.ts`,
    `lib/rixJuggle.ts`, `lib/rixSit.ts`, `lib/rixNap.ts`, `lib/rixTag.ts`, `lib/rixPeekaboo.ts`,
    `lib/rixLogoPose.ts`, `lib/rixBalance.ts`, `lib/rixMood.ts`, `lib/rixAnnoyed.ts`,
    `lib/rixTantrum.ts`, `lib/rixToss.ts`, `lib/aboutDeselect.ts`, `lib/rixSulk.ts`,
    `lib/rixForgive.ts`, `lib/rixCalm.ts`, `lib/rixVisitor.ts`, `lib/rixFeatures.ts`
- **New hooks:** none in rev 3. The pet's listeners live in `lib/rixPet.ts` and are wired by
  `lib/rixFull.ts`, like tag and the visitor clock: they aren't React hooks (constitution §9).
- **Content:**
  - `content/home.ts → about.rix` gains the R12.1 slots (copywriter), and in rev 4 the R12.2
    slots.
  - `content/dev.ts → rixSheet` per R10.
- **Images:** none.
- **Retired with `/dev`:** the R10 files and `content/dev.ts → rixSheet`.

## R12. Choices: resolved (the user's answers, 2026-10-02; rev 4 rows 2026-10-05)

| # | Question | Answer |
|---|---|---|
| 1 | Keyboard focus walks him, or only turns his eyes | **Walks, like hover** (R4.7) |
| 2 | After a pick: stroll home after quiet, or stay above the card | **Walk to the picked card, then stroll home once quiet.** Superseded 2026-10-02 by #14 and #15: partway toward the card, then the patrol |
| 3 | A and C keep O4, or take talk, emotions and plays | **A and C unchanged** (O4 as built, flat poke included) |
| 4 | Long walks capped at 2.0s (dash), or a constant 360 px/s | **The 2.0s cap and dash.** Superseded 2026-10-02 by #14 |
| 5 | Emote glyphs `!` and `?`, or eyes only | **Glyphs, as specced** (R3.2); extended by #12 |
| 6 | Juggle with the board's emblems before a pick, or only after | **Emblems before a pick** (R6.1) |
| 7 | The nap after nudges are done + 40s of idle; wake on any return | **As specced** (R6.3); anywhere he stands since #15. **Rev 4:** "nudges done" becomes "the settled phase" (#18) |
| 8 | Tag dodges only fast approaches, ≤ 2 per session | **As specced** (R6.4) |
| 9 | Proposals P1–P4 | **P1 peek-a-boo, P2 logo pose and P3 balance approved** (R6.5–R6.7). **P4 foot drum rejected** and removed |
| 10 | Talk at 0.035s per character; pokes type from 0.5 | **As specced** (R5) |
| 11 | The poke ladder (new) | **Approved as R6A:** happy 1–3, annoyed 4–5, tantrum 6+, toss and deselect, flee, sulk, forgive, calm by a pick. **Rev 4:** calm by a pick is playground-only (#24) |
| 12 | (2026-10-02, after trying `/dev`) Icons for the emotions | **Pixel glyphs** in the `!`/`?` style: hearts and the grawlix in `fill-accent`, the rest `fill-muted`; no emoji characters; one at a time, never with the zzz (R3.2) |
| 13 | (2026-10-02) A love emotion with hearts: when does it play | **Both:** a pet (resting the pointer, or a long-press) and the pick's heart burst (R3.1, R6B) |
| 14 | (2026-10-02) Walks are too long and skate | **A stride-locked gait and "walk partway":** no dash; card walks at most 200px, then he stops and looks (R4.1–R4.6) |
| 15 | (2026-10-02) Slow walking as an idle | **No home: he patrols** the shelf, pausing to look around; plays run in the pauses (R4.8) |
| 16 | (2026-10-02) Love eyes: diamonds, or soft happy slits looking up | **Pulsing diamonds** (R3.1, `LOVE.beat`) |
| 17 | (2026-10-02) Flee distance: capped, or to the far end as before | **Capped: 400px (`FLEE`), 120px (`STOMP_WALK`)** (R6A.5) |
| 18 | (2026-10-05) "It takes forever to do an act" | **Busy for his first 6 live minutes** (an item every 2–4s), **then settled** (a play every 10–15s). Budgets stay crew-timed (R7) |
| 19 | (2026-10-05) He only ever does 5 plays | **New idle beats** from existing moves (wave, perk, hop, looks, emotion and glyph flickers) beside the plays (R6.8) |
| 20 | (2026-10-05) He goes still when a card is hovered | **Hover mode:** he walks over as now, then keeps moving and talks about that card while the hover or focus holds (R4.9) |
| 21 | (2026-10-05) After a pick | **After-pick lines:** "switching?" on another card, idle chatter points at the examples and the contact; no "pick one" lines once picked (R4.9, R5.4) |
| 22 | (2026-10-05) Speak more | **Idle chatter** on its own, pre-pick and post-pick pools; hover and idle lines shown, never announced (R5.4) |
| 23 | (2026-10-05) Nudge cap | **`NUDGE_MAX` lifted** (was 4, decided 2026-10-01); nudges become the pre-pick chatter (R5.4, R7) |
| 24 | (2026-10-05) A pick cuts his tantrum | **Picks are locked on About** from the tantrum's start to the forgive's end; the toss's deselect still happens; calm by a pick is playground-only (R6A.8, R6A.9) |

**Decisions inside the spec, the lead's to review:**
- Under reduced motion, a held pick is still deselected, with a fade (R8.1).
- "Just looking" is never thrown (R6A.4).
- The tantrum waits `ANNOYED_MIN` after the first annoyed act (R6A.1).
- A pet during the sulk is ignored, not an early forgive (R6A.6).
- `happy` shows the sparkle only on pokes 1–3, juggle success and caught at tag, so it doesn't
  sparkle eight times a minute (R3.1).
- The pick shows love eyes from 0.6, so the pick reads as the second love trigger (R6B.4).
- **Rev 4:**
  - The lock uses `aria-disabled` plus swallowing, never native `disabled` (focus, R6A.9).
  - The lock's announcement rides on the tantrum's own line (one utterance, not two).
  - The nap waits for the settled phase, so the busy 6 minutes never fall asleep.
  - After the toss deselects, nothing is picked, so the pre-pick pools come back.
  - Hovering the picked card shows happy beats and no line (its ack already speaks).
  - A hover line belongs to its card and fades when the target leaves it.
  - Scheduled lines never cut a showing line; visitor-driven lines still do.

### R12.1 New content slots (`content/home.ts → about.rix`; copywriter; playful, no claims)

| Key | Meaning | Limit |
|---|---|---|
| **`annoyedLines[3]`** | Warnings on pokes 4–5, shown in turn and wrapping round. Cross but friendly; the hint that he's losing patience | 5 words / 30 characters each |
| **`angryLines[2]`** | The tantrum's outburst on poke 6+, shown in turn. Shown and announced, unless a pick is thrown (then `throwAway` is announced in its place) | 4 words / 24 characters each |
| **`sulkLine`** | One line as he turns his back: he isn't talking to you. Shown, never announced | 3 words / 18 characters |
| **`forgiveLine`** | One line as he turns back and waves: he's over it. Shown, never announced | 4 words / 24 characters |
| **`throwAway`** | Screen-reader only (`RixStatus`), never shown. Says, in the third person ("Rix…"), that he threw the visitor's pick away and that they can pick again. **Rev 4:** drop "you can pick again" (the cards are locked then; `unlockLine` says it) | 12 words / 80 characters |
| **`petLines[2]`** (rev 3) | Shown in turn when he's petted: he's charmed and a little bashful. Shown, never announced. Warm, not soppy; no claims | 3 words / 18 characters each |

The quip limits keep A's quip on one line at 360 and B's within `max-w-40`, as O0.3. **Rev 4:**
`docs/04-voice.md` sets no length limits (2026-10-05); the "Limit" column is a sizing note only.

### R12.2 Rev 4 content slots (`content/home.ts → about.rix`; copywriter; playful, no claims)

Rix's own voice. No line states what MARWIX does or claims a result (the acks carry the offers;
constitution §7). Every shown line fits B's quip: two lines of about 20 characters (R5.4).

| Key | Count | When it's used | Announced | Meaning |
|---|---|---|---|---|
| **`idleLines`** | 6 | Chatter while nothing is checked (before any pick, and after the toss) | no, shown only | Invites a pick: "which one are you?". **Takes in the three `nudgeLines`;** `nudgeLines` is retired |
| **`afterPickLines`** | 5 | Chatter once any card is checked, "Not sure yet" included | no | Points down at the examples below, now set for them, and at booking a call. Never asks for a pick |
| **`hoverLines.service-business`**, **`.online-store`**, **`.discord`**, **`.software-builder`**, **`.website`**, **`.not-sure`** | 2 each (12) | Hover or focus on that card, before a pick (R4.9) | no | Recognises that reader and urges them to tap it, in that card's tone (`docs/04-voice.md` Tone per card). Recognition only, no offer |
| **`hoverAnyLines`** | 4 | Hover or focus on any card before a pick, between that card's own lines (R4.9) | no | Generic cheering for the hovered card: "that one?", "go on" |
| **`switchLines`** | 3 | Hover or focus on a card other than the picked one (one per hold) | no | Playful "switching?": changing is fine |
| **`lockLine`** | 1 | Appended to the tantrum's announced line, and re-said on a swallowed card press (R6A.9) | **yes, screen-reader only, never shown** | Third person: Rix is in a huff, and the cards are locked for a moment |
| **`unlockLine`** | 1 | When the forgive ends (R6A.9) | **yes, screen-reader only, never shown** | Third person: Rix has calmed down, and the cards can be picked again |

- **`pokeLines`:** shown both before and after a pick now. Line 5 ("Fun. Now pick one?") asks for a
  pick, so copywriter rewrites it to read in both states (R5.4: no pick lines once picked).
