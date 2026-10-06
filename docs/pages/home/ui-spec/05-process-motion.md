# §5.7 Process: the bots' built motion

Shared rules (§0, §10): [`../ui-spec.md`](../ui-spec.md). Layout, flows and the bot's drawing: [`05-process.md`](05-process.md).
The four-step relay (legacy, off): [`05-process-relay-legacy.md`](05-process-relay-legacy.md).
Page doc: [`../sections/05-process.md`](../sections/05-process.md). Rix builds on these layers: [`00-rix.md`](00-rix.md).

**Last Updated:** 2026-10-05 (new file 2026-10-03). These are the parts of `05-process.md` §5.7 that describe
the bots' own motion, moved here unchanged when that file was rewritten for the per-card flows.
They are built (`hooks/useProcessBots.ts`, `lib/processBot*.ts`) and stay the spec for the roles
`rules`, `team`, `check`, `update` and, through `00-rix.md`, `host`. § numbers are kept: a
reference to "§5.7 layer 7" or "§5.7 constants" lands here.

- **Still running** (kept through the 2026-10-03 round, the user's decision: build nothing new,
  keep what is there): every layer below, on five or six bots. The layer table and the six
  wiring changes are in `05-process.md` §5.7.
- **Layer 10, the crew relay, is on** (`RELAY_ON = true` since the 2026-10-04 motion pass). It
  was rebuilt for the per-card flows: five or six stops, the fix hop, a one-way pass on a flow
  with no loops, and runs paced by `RELAY_REST = 2` (the next run starts 2s after the last one
  ends). Its spec is `05-process.md` §5.7 and §5.9. The four-step relay it replaced (its markup,
  sizes, run table and relay constants, and the old phone relay) is `05-process-relay-legacy.md`.
  The text below names relay catches and relay constants where an act depends on them; with the
  relay on those branches run.
- **New roles** (`intake`, `flag`, `remind`, `ship`, 2026-10-03) take `host`'s values in the life
  tables (breath and sway). **Since 2026-10-04** each has its own act and its own relay values
  (`05-process.md` §5.7), no longer the host's `nod`. `update` is in the Discord flow (step 3,
  2026-10-04), so its act and its nap play on the page.

## Motion (later), bots

The 2026-09-26 stop-motion (one 125ms tick, 8fps, stepped, no tweens,
easing or rotation) is **superseded 2026-09-27** by fully smooth GSAP motion, below. Full motion
only unless marked. Transforms, `opacity` and `attr` only; no filters.

**Constants (`lib/processBotMotion.ts`; seconds, viewBox units, degrees unless marked).** Ranges are
picked at random each time; per-role values are listed rules / team / check / update.

| Constant | Value | Use |
|---|---|---|
| `BREATH_STRETCH` / `NAP_STRETCH` | 0.04 / 0.06 | body stretch peak (awake / napping) |
| `BREATH_HALF` | 1.25 / 1.1 / 1.35 / 1.4 | half-cycle, `sine.inOut` yoyo (2.2–2.8s full) |
| `ARM_LIFT` / `HAT_LIFT` | 31 / 76 | breath ride per unit of stretch |
| `SWAY_DEG` / `SWAY_HALF` | 1.2 / 1.5 / 1.0 / 1.3 · 2.6 / 3.0 / 2.8 / 3.4 | rig sway ±, `sine.inOut` yoyo |
| `DRIFT_DEG` / `DRIFT_HALF` | 3 · 1.8–2.4 per arm | arm drift ±, arms out of phase |
| `BLINK_GAP` / `CLOSE` / `OPEN` | 2–6 · 0.07 `power2.in` · 0.12 `power2.out` | blinks |
| `DOUBLE_BLINK` / `DOUBLE_GAP` | 0.2 · 0.1 | chance and gap of a second blink |
| `LOOK_MAX` / `LOOK_HOLD` / `LOOK_MOVE` | 7 · 0.8–2 · 0.35–0.6 `power3.out` | autonomous looks (30% return to rest) |
| `TAP_GAP` / `TAP_LIFT` | 7–14 · 3 | foot taps: up 0.09 `power2.out`, down 0.07 `power2.in`, twice |
| `ACT_GAP` | 5–10 | between role acts |
| `NAP_GAP` / `NAP_LENGTH` / `NAP_TIMESCALE` | 25–40 · 4–5 · 0.55 | rules and update only |
| `Z_RISE` / `Z_STAGGER` | 1.6 · 0.5 | each z: `y` −10, `x` +4, scale 0.6 → 1, opacity 0 → 1 (first 25%) → 0, looping |
| `POINTER_RANGE` / `LEAN_RANGE` / `LEAN_MAX` | 240px · 480px · 2.5 | pointer mapping |
| `EYE_FOLLOW` / `LEAN_FOLLOW` / `POINTER_IDLE` | 0.35 · 0.6 (`power3.out` quickTo) · 2.5 | pointer smoothing and hand-back |
| `ANTICIPATE` / `STRETCH` / `SQUASH` | 1.06 × 0.92 · 0.94 × 1.08 · 1.1 × 0.9 | `upper` scaleX × scaleY |
| `SETTLE` | 0.6 `elastic.out(1, 0.4)` | back to scale 1 after any landing |
| `JUMP_UP` / `JUMP_FEET` | 14 / 10 | upper / feet lift (the hover/tap jump, the only jump) |
| `POP_SCALE` / `REACT_COOLDOWN` | 1.25 · 1.2 | eye pop; reaction cooldown from its start |
| `DROP_FROM` / `DROP_FALL` / `DROP_STAGGER` / `DROP_START` | −60 · 0.45 `power2.in` · 0.15 · `"top 75%"` | entrance |

The relay's rows of this table (`RELAY_*`, `JOB_*`, `LESSON_*`, `GHOST_*`, `LIT_*`, `RETURN_*`,
`CHEVRON_PULSE`) are in `05-process-relay-legacy.md`. The `host` column (and so the four new
roles): `BREATH_HALF` 1.3, `SWAY_DEG` 1.2, `SWAY_HALF` 3.0.

**Channels.** Each property has one writer (hook table, 5.6). Summed properties (`rig` rotation,
arm rotations) are plain proxy objects combined in one apply function; arm rotation is drift × mix +
act, and an act eases `mix` to 0 while it needs the arm. Eye position is one `look.d` proxy: the
pointer drives it with `quickTo`; looks and acts tween it after killing the previous look tween. A bot
is in one state at a time: entering, idle, acting, reacting or napping. Blinks, looks and taps run
only in idle; acts and naps never overlap; while not idle, the pointer drives lean but not eyes.
The job's `x`/`y`/`scale`/`opacity` and each `data-job` part are written only by the relay timeline.

**The layers** (numbers from the table):

1. **Life (always, per bot, out of phase; starts when the bot lands).** Breathing on a `b` proxy
   (random start progress), sway on `rig`, drift on each arm. Feet stay planted.
2. **Blinks:** close then open via `attr`; sometimes a double blink.
3. **Looks:** when the pointer isn't driving, `look.d` glides to a random target and holds.
4. **Taps:** one foot at a time lifts `TAP_LIFT` (it rises under the strip, so the foot shortens; no gap) and taps twice.
5. **Role acts** (one at a time, never while napping). A relay catch plays the full act; the short
   version runs only after a reaction. After a catch or a reaction, the bot's `ACT_GAP` scheduler
   restarts, so its next random act comes 5–10s later.

Every full act is compressed to end inside the relay's 2s dwell (retimed 2026-09-28, final numbers):

| Role | Full act | Short |
|---|---|---|
| `rules` | look −7; arm-left act +10° (0.4 `power2.out`, clipboard tilts up); marks to scaleX 0 (0.12, stagger 0.05, from 0.3) then re-written left to right (0.25 each `power2.out`, stagger 0.2, from 0.55); two nods at the stamp beat 1.05 and 1.35 (`upper` 0.95 scaleY / 1.03 scaleX, 0.1 down, 0.2 up); look and arm back from 1.3 (0.45 `power2.inOut`), ending **1.75** | marks re-write together (0.3, stagger 0.06), arm +6° and back, one nod |
| `team` | 2–3 strikes (`RELAY_STRIKES` = 2 on a relay catch): anticipation tool −45°, `upper` squash 1.03 × 0.96, look +5, foot-right `x` +1.5 (0.28 `power2.out`); strike tool +30° (0.09 `power4.in`); impact `upper` 1.05 × 0.94 (0.05) then `SETTLE` (0.6 `elastic.out(1, 0.4)` — the settle, not the hit, is most of the act's length); foot-left `x` −1 and back (0.05 / 0.2), sparks: group opacity 1, scale 0.5 → 1.2 about (140,33), sparks fly 4 units along their rays (right; down-right 2.8, 2.8; down), 0.25 `power2.out`, then fade 0.15; after the last impact (hit 1.04 on a catch), tool to 0 (0.35 `back.out(1.6)`), feet `x` 0, look 0 (0.4 `power2.inOut`); the last `upper` `SETTLE` ends the act at **1.69**. Arm-right mix 0 throughout | one strike |
| `check` | rig act tilt +3° (0.4 `power2.out`, leans to the lens); figure-8 scan: tool `x` 0 → 4 → 0 → −4 → 0 (0.35 legs) with `y` 0 → 2.5 → 0 → −2.5 → 0 twice (0.175 legs), tool rotation ±4° with `x`, `sine.inOut`; lens-lit flicker (`LENS_FLICKER`, opacity 1/0 at 1.0/1.08/1.13/1.25, ending 1); 35% chance "found it": an eye pop (scale to `POP_SCALE` over 0.1, back over 0.3) at 1.55, feet down, no hop; tilt (and, on a relay catch, the look onto the job) back from 1.55 (0.4 `power2.inOut`), ending **1.95** | tilt + one flicker |
| `update` | look +5, mixR to 0 (0.2–0.25 `power2.out`); 3 ratchets at 0.1, 0.36, 0.62: tool −30° (`RATCHET.turn` 0.14 `power2.out`) and back (`RATCHET.back` 0.1 `power2.in`), rig act tilt −1.5° with each; then look −7 from `flip − 0.3` (0.3 `power2.inOut`), mixR to 1 at 0.86; page flip at 0.95 (`JOB_BEATS.update.flip`): `page` opacity 1 (0.06), scaleX 1 → 0 about the spine (`PAGE_FLIP` 0.35 `power2.in`), opacity 0 and scaleX 1 (set); `mark` set to scaleX 0 while covered, re-written at 1.35 (`JOB_BEATS.update.rewrite`, 0.3 `power2.out`); look back from 1.5 (0.4 `power2.inOut`), ending **1.9** | one ratchet |

6. **Naps (rules and update):** look to 0 (0.4), eyes to slits (0.3 `power2.inOut`), breathing
   stretch → `NAP_STRETCH` and timeScale → `NAP_TIMESCALE` (0.6), sway timeScale 0.6, zzz loop.
   **Wake** (after `NAP_LENGTH`, or early on pointer hover or a relay pass): zzz fade (0.15), eyes open
   (0.08) and pop (0.1, back 0.3), a feet-planted startle (an `upper` squash at 0.1, then `SETTLE`;
   no hop), a double blink 0.3s later, breathing back (0.6).
   A napping bot ignores pointer look.
7. **Eyes follow the pointer** (full motion and `(pointer: fine)`, section live): on `pointermove`
   (rAF-throttled) each bot takes v = pointer − its eye centre, in page px. Look d = clamp(±7,
   ((vx − vy)/√2) / 240 × 7) (the projection onto the up-right diagonal), via `quickTo`
   `EYE_FOLLOW`; lean = clamp(±2.5, vx / 480 × 2.5) on the rig's lean channel via `quickTo`
   `LEAN_FOLLOW`. Eye centre = svg rect left + 0.4706 × width, top + 0.6182 × height (viewBox 50,50),
   cached in page coordinates and refreshed on resize (ResizeObserver on the list) and ScrollTrigger
   refresh; `pageX`/`pageY` need no scroll refresh. After `POINTER_IDLE` without movement, or on
   pointer leaving the window, lean eases to 0 and autonomous looks resume.
8. **Hover / tap reaction:** `pointerenter` (fine pointer) or `pointerdown` (any pointer, no
   `preventDefault`) on a bot's SVG; `REACT_COOLDOWN` from its start. **Revised 2026-09-28:** ignored
   while a bot is active (any act — its relay step, the cascade step, a timed act, the loop-back
   squash) or already reacting; no queued jump. A napping bot still wakes and jumps on hover or tap
   (unchanged). Eye and lean follow are unchanged. Was: interrupts naps and idle acts.
   Timeline (s): 0 anticipate `upper` (0.1 `power2.out`); 0.1 `upper` `y` −14 with stretch (0.22
   `power2.out`), eyes pop (0.12, back 0.3); 0.16 feet `y` −10 (0.2 `power2.out`: the body lifts first,
   feet leave last); 0.36 feet down (0.16 `power2.in`, land first at 0.52); 0.34 `upper` down (0.22
   `power2.in`, lands 0.56); 0.56 squash (0.06) then `SETTLE`, hat wobble ±4° (`elastic.out`); then the
   short act. This is the only jump: relay catches, the cascade, "found it" and waking keep the feet
   down. Nothing becomes focusable; no cursor change.
9. **Scroll-in entrance (once per page load):** ScrollTrigger on `process-list`, `DROP_START`. If the
   start is already passed at setup (page loaded lower down, or a matchMedia re-run), the bots are
   simply shown and life starts. Otherwise set per bot: `rig` `y` −60, opacity 0; `upper` stretch
   0.9 × 1.15; eyes closed. On enter, staggered 0.15: fall (opacity to 1 over the first 0.15), feet
   land, `upper` squash 1.12 × 0.86 (0.07) then `SETTLE`, eyes open (0.12), glance d ±5 toward the
   next bot (bot 4 at bot 1; sign from the pointer projection), hold 0.5, back to rest (0.4). Life
   starts on each bot's landing. Revert at any point leaves every bot visible.
10. **Crew relay: the job and the lesson.** **On since 2026-10-04** (`RELAY_ON = true`): rebuilt
    for the per-card flows, five or six stops, with the next run starting `RELAY_REST = 2`s after
    the last one ends. Its spec is `05-process.md` §5.7 (and §5.9 below `lg`). The four-step
    version, superseded 2026-10-03, is `05-process-relay-legacy.md`.
11. **Pausing and teardown:** every tween, timeline and `delayedCall` the bots and the relay make go
    in one registry; `watchLive` (section off screen or tab hidden) pauses all and resumes them.
    Pointer events are ignored while not live. `gsap.matchMedia()` blocks: full (bots, entrance,
    reactions); full + `lg` (the job/lesson relay, trail and lit lines); full and below `lg` (cascade;
    **superseded 2026-09-28:** the column relay, §5.9); full + fine pointer (follow); reduced (fade).
    On unmount or a mode switch, revert, then `resetBot`
    removes every `transform` attribute and inline style on `[data-bot]`, and the relay's strip removes
    them on the job and its `data-job` parts, the lesson and its `data-lesson` parts, the ghosts, both
    lit overlays, the chevron icons and the arrowhead (inline `color` and `clip-path` included), and
    restores the eyes' `y`/`height` from values stored at setup: the DOM equals the server markup.
    **§5.9:** the strip also covers the phone return icon and, since the ledge pass (2026-10-05),
    the ledges' and the phone fix line's lit overlays (`process-ledge-lit`, `process-fix-line-lit`).
12. **Reduced motion:** no breathing, blinks, looks, taps, acts, naps, relay, pointer, reactions or
    drops. The entrance is `rig` opacity 0 → 1 (`duration.fade`, stagger `stagger.row`) on the same
    trigger, skipped if already passed. The bots show their static pose. The job, lesson, ghosts and
    lit overlays are never shown (decoration; `opacity-0` stays).

- The ground line, chevron spans and return path never move; only the chevron icons and arrowhead
  pulse and tint, and the two overlays light over them (full motion, from `lg`). Below `lg`
  (since the ledge pass, 2026-10-05) the ledges and the dotted fix line never move either; only
  their lit overlays light (full motion, `05-process.md` §5.9).

## Sizes

Motion adds no layout. The bots keep their static sizes at every width (`05-process.md` §5.4):

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Bot box | 88×57 | 88×57 | 136×88 | 136×88 |
| 1 viewBox unit | 0.52px | 0.52px | 0.8px | 0.8px |
| Jump (`JUMP_UP` 14 units) | 7px | 7px | 11px | 11px |
| Pointer range (`POINTER_RANGE`) | fine pointers only | same | 240px | 240px |

## States

No element here is focusable. The hover or tap reaction (layer 8) is decoration on a fine pointer
or a touch, with no cursor change, no focus-visible and no active style.
