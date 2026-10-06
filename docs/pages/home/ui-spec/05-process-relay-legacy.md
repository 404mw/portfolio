# §5 Process: the four-step crew relay (legacy, superseded 2026-10-03)

Current spec: [`05-process.md`](05-process.md). The bots' own motion (still live): [`05-process-motion.md`](05-process-motion.md).

> **Superseded 2026-10-03.** This is the relay as built for four fixed steps (rules, team, check,
> update): the job, its trail and lit lines, the lesson card, the return run and the phone relay.
> The per-card flows (five or six steps, new roles, the return landing on step 2) replace it. It is
> switched off in code this round (`RELAY_ON`, `05-process.md` §5.7) and **not** rebuilt until the
> motion pass. Kept here so the rebuild has the built numbers and reasons in the tree.
>
> **How this file was made:** the relay parts of `05-process.md` as it stood at commit `37dee00`,
> copied by hand (the tool that wrote it has no shell). For a byte-exact source, run
> `git show 37dee00:docs/pages/home/ui-spec/05-process.md`. Carried here: the relay markup, job,
> lesson, overlays and sizes (old §5.7), the relay rows of the constants table, layer 10, the relay
> choices (old §5.8: 6, 12, 16–27) and the phone relay (old §5.9). Not carried: the revision notes
> at the top of the old file and the old four-step layout (§5.1–5.5); both are in git. "Bot 4" is
> the old `update` bot (wrench and rulebook), which is in no flow now.

#### Relay job, trail and lit lines (revised 2026-09-28; replaces the 10px dot and the cream spark)

Motion only, from `lg`. Every element here is decorative: `aria-hidden`, `pointer-events-none`, SVGs
`focusable="false"`, `hidden lg:block`, starting at `opacity-0`. Without JS, under reduced motion and
below `lg`, nothing new is visible. Motion owns `transform` alone on each moving element; negative
margins set the anchor. Flat token fills only, sharp corners, 45° cuts (the bots' language).
**Below `lg`: superseded 2026-09-28 by §5.9.** The layer, ghosts, job and lesson now show at every
width (still `opacity-0` at rest, so without JS and under reduced motion nothing new is visible);
the two lit overlays stay `lg` only. The tree below carries the revised classes.

```
ProcessRelay (last in the body wrapper)
└ div (layer)  aria-hidden="true" class="pointer-events-none absolute inset-0 z-1"   (was `hidden lg:block`, §5.9)
  ├ svg ×3  data-anim="process-relay-ghost" viewBox="0 0 24 24" class="absolute left-0 top-0 -ml-2 -mt-4 size-4 opacity-0 lg:-ml-3 lg:-mt-6 lg:size-6"
  │   └ path d="M0 0H18L24 6V24H0Z" class="fill-cream"
  ├ ProcessJob: svg data-anim="process-relay" viewBox="0 -5 24 29" class="absolute left-0 top-0 -ml-2 -mt-4.75 h-4.75 w-4 overflow-visible opacity-0 lg:-ml-3 lg:-mt-7.25 lg:h-7.25 lg:w-6"
  │   └ the parts below, in paint order
  └ ProcessLesson (new, 2026-09-28): svg data-anim="process-lesson" viewBox="0 0 14 14" class="absolute left-0 top-0 -ml-1.25 -mt-1.25 size-2.5 opacity-0 lg:-ml-1.75 lg:-mt-1.75 lg:size-3.5"
      ├ path data-lesson="base" d="M0 0H11L14 3V14H0Z" class="fill-cream"
      └ path data-lesson="line" d="M2.5 5.5h9v2.5h-9Z" class="fill-accent"
```

The layer sits at `z-1`: above the bots, below the loop label (`lg:z-10`, with a taller `bg-bg`
backing, `lg:px-5 lg:py-3`), so the job (and, after it, the lesson) is fully hidden while it crosses
behind the label and never peeks from behind a bot. **Revised 2026-09-28:** there is no spark, and
the job no longer rides the return path itself — after bot 4's change it's done and slides off along
the ground line; a separate lesson card splits off it and rides the return alone (below).

**The job (`ProcessJob`, inline SVG).** 1 unit = 1px. A 24 × 24 cream sheet with its top-right
corner cut at 45° by 6 (the fold hinge). Anchor: `(x, y)` is its **bottom centre**, and its bottom
sits on the ground line's top edge, like the bots' feet; `transformOrigin: "50% 100%"`. The markup
draws the **finished** job (static = final state, hidden) except the glow, which is hidden even
finished (it's a flash only); at each run start, while hidden, motion sets the blank state (rules
`scaleX` 0, stamp `scale` 0, band/step `scaleY` 0, tick `opacity` 0, fold flat along its hinge,
glow `opacity` 0). Pivots via `svgOrigin`, viewBox units.

| `data-job` | `d` | Fill | Pivot | Change (who, when) |
|---|---|---|---|---|
| `base` | `M0 0H18L24 6V24H0Z` | `fill-cream` | none | always shown |
| `rule` ×2 | `M3 4h11v2.5H3Z` · `M3 9h7v2.5H3Z` | `fill-ink` | 3 5.25 · 3 10.25 | `scaleX` 0 → 1: written (bot 1) |
| `stamp` | `M3 13h5v5H3Z` | `fill-accent` | 5.5 15.5 | `scale` 0 → 1, thumped in: stamped (bot 1) |
| `band` | `M0 19.5h24V24H0Z` | `fill-accent` | 12 24 | `scaleY` 0 → 1: built, strike 1 (bot 2) |
| `step` | `M0 -5h10v5H0Z` | `fill-accent` | 5 0 | `scaleY` 0 → 1: built, strike 2 (bot 2) |
| `tick` | `M11.5 14.5L13 13L15 15L19 11L20.5 12.5L15 18Z` | `fill-ink` | 16 14.5 | `opacity` flicker, `scale` 1.3 → 1: checked (bot 3) |
| `fold` | `M18 0V6H24Z` | `fill-cream-muted` | 18 6 | corner folds over its hinge on the page-flip beat (bot 4) |
| `glow` | same as `base` | `fill-none stroke-accent` | 12 12 | outline flash, full then fading, on check's last flicker (bot 3) |

Every mark reads at 24px: rules and tick are ink on cream, the stamp and band/step violet (the
crew's colour: what the agents added), the fold a muted-cream flap showing the sheet's underside.
The tick's six edges are all 45°. The ghosts are the bare `base` silhouette.

**The lesson (`ProcessLesson`, new 2026-09-28, inline SVG).** 1 unit = 1px. A 14 × 14 cream card,
echoing the job's cut corner at 45° by 3 (the job's is 6), carrying one violet line — a rule kept
from the rulebook. Anchor: `(x, y)` is its **centre** (unlike the job's bottom-centre), so it can
peel up off the sheet and sit centred on the return path's line; `transformOrigin: "50% 50%"`. The
markup draws it finished, hidden at rest; motion never blanks its parts, only the whole card's
`opacity`/`scale`/position.

| `data-lesson` | `d` | Fill | Meaning |
|---|---|---|---|
| `base` | `M0 0H11L14 3V14H0Z` | `fill-cream` | the card |
| `line` | `M2.5 5.5h9v2.5h-9Z` | `fill-accent` | the one kept rule |

**Overlays (added only; the ground line, chevrons and dashed path are unchanged).**
- **Ground lit** (in `ProcessList`, right after the ground line and before `<ol>`, so each chevron's
  `bg-bg` mask still covers it): `<div aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-27 hidden h-0.5 overflow-hidden lg:block">`
  → `<span data-anim="process-ground-lit" class="absolute left-0 top-0 h-0.5 w-32 bg-linear-to-r from-accent/0 to-accent opacity-0">`.
  The clip box is the ground line's own box, so the moving segment never shows past the line or
  widens the page.
- **Return lit** (last child of the `process-return` box, after the label, so the label's `z-10` and
  `bg-bg` span still mask it; the arrowhead stays the first child):
  `<span aria-hidden="true" data-anim="process-return-lit" class="pointer-events-none absolute -inset-x-0.5 top-0.5 -bottom-0.5 hidden rounded-b-2xl border-2 border-t-0 border-accent opacity-0 lg:block">`.
  It covers the dashed border exactly (outer radius 16), solid, so where it's lit the dashes read as
  one violet line. It stops 2px short at the top, clear of the arrowhead's apex.

**Paint order.** The layer's `z-1` inside the `isolate` body puts the job and ghosts **above** the
bots and ground line but **below** the loop label (`lg:z-10`): the job never peeks from behind a
bot, and while it crosses behind the label (on its way along the ground line, and again on the
return) it's fully hidden by the label's taller `bg-bg` backing. At every stop it sits in open
space, fully visible.

#### Sizes: relay job, trail and lit lines

| Element | Phone 360 | Tablet 768 | Desktop 1440 (and `lg` 1024) | 4K 3840 |
|---|---|---|---|---|
| Job (`w-6 h-7.25`) | none | none | 24 × 24, bottom on the line (y 108); step rises 5 above while built | same |
| Job stops | none | none | on the right of every bot: rules, team and check under the hand / hammer / lens (viewBox x 122); update further right (x 126), clear of the wrench | same |
| Job exit (**new 2026-09-28**) | none | none | slides to 14px inside the ground line's right end, pops (scale 1.12), fades | same |
| Lesson (`size-3.5`, **new 2026-09-28**) | none | none | 14 × 14, splits off the job's centre at bot 4, centred on the return path | same |
| Ghosts (`size-6`) | none | none | 3, scale 0.85 / 0.7 / 0.55, opacity 0.45 / 0.28 / 0.14; run every hop and the job's exit slide, never the return | same |
| Ground lit (`w-32 h-0.5`) | none | none | 128 × 2, head under the job's centre; also lights the exit slide | same |
| Chevron light | none | none | icon to `cream` and scale 1.35 | same |
| Return lit | none | none | solid 2px, x 63 → 1083 (lg: 63 → ~794), lit behind the lesson as it rides the path | x 63 → 1239 |

The bots hold 136px from `lg`, so every relay size is fixed; only the leg and path lengths grow.
**Below `lg`: see §5.9** (revised 2026-09-28; the Phone and Tablet "none" above now holds only for
the ground lit, chevron light and return lit; was "nothing new exists below `lg`").

#### Relay constants (the relay rows of §5.7's table; `lib/processBotMotion.ts`)

Seconds, viewBox units, degrees unless marked. Per-role values are listed rules / team / check / update.

| Constant | Value | Use |
|---|---|---|
| `RELAY_EVERY` / `RELAY_FIRST` | **16.4** (was 9, then 15, then 20, then 16) · 1.5 | relay, start to start (run, return included, ≈ 13.7 at `lg`, 14.4 at 1440, 14.7 at 4K, so about 1.7–2.7s rest between runs); first run after all land. **§5.9:** the same cadence below `lg` (phone run ≈12.9–13.2) |
| ~~`CASCADE_EVERY` / `CASCADE_GAP`~~ | ~~9 · 0.6~~ | **removed 2026-09-28 (§5.9):** below `lg` the relay runs instead of the cascade |
| `RELAY_HOP` / `RELAY_FADE` | 0.7 `power2.inOut` · 0.2 | job hop between stops; job fade in at run start |
| `RELAY_DWELL` | **2.0 / 2.0 / 2.0 / 2.0** (was 0.15, then 2.0/1.6/1.8/2.4, then 3.0/3.0/3.0/3.0) | arrival → departure per stop, every role the same now |
| `RELAY_STRIKES` / `RELAY_GLANCE` | 2 · 5 | team's strikes on a relay catch (timed acts keep 2–3); a busy bot's glance |
| `RELAY_WATCH` / `RELAY_WATCH_BLINK` | 7 / 5 / 7 / 7 (was −7 / 5 / 7 / −7: every bot holds the job on its right now) · 0.4 | look d while the job waits at a bot, toward it; one blink if the wait leaves at least this much — **with the 2s dwell, no stop leaves that much, so the blink never plays now** |
| `RELAY_CLEAR` | 3.5 | no timed act starts within this of a bot's next catch; no nap within `NAP_LENGTH` max + this |
| `JOB_AT` | 122 / 122 / 122 / 126 (was −15 / 122 / 122 / −15: rules and update moved from the bot's left to its right) | each stop's bot viewBox x, always on the bot's right (rules/team/check under the hand, hammer or lens; update 4 units further right so the built step clears the wrench handle) |
| `JOB_POP` | scale 0.6 → 1, 0.3 `back.out(1.7)` | a fresh job appears at stop 1 |
| `JOB_BEATS` | rules marks 0.55, 0.75, stamp 1.05 (was 0.7, 0.9, 1.4) · team 0.37, 1.04 (unchanged) · check 1.08 / 1.13 / 1.25 (unchanged) · update flip 0.95, rewrite 1.35 (was flip 1.96, no separate rewrite beat) | job changes, seconds after arrival; the same moments as the acts (shared with `lib/processBotActs.ts`), retimed to fit inside the 2s `RELAY_DWELL` |
| `JOB_STAMP` / `JOB_BUILD` | part 0.18 `back.out(2.5)`, job 1.08 × 0.88 0.1 `power2.out` · part 0 → 1, 0.12 `back.out(2)` (with `JOB_SQUASH`) | then `SETTLE`; job scaleX × scaleY |
| `JOB_SQUASH` / `JOB_TICK` / `JOB_GLOW` | 1.06 × 0.92, 0.05 `power2.out` · 1.3 → 1, 0.2 `power2.out` · grow 1.15, 0.5 `power1.out` | the small pop on team/check/update; tick pop; check's outline flash and fade |
| `JOB_FOLD` | = `PAGE_FLIP`, 0.35 `power2.in` (was 0.4: `PAGE_FLIP` itself shortened) | update's corner folds over its hinge, same ease and length as the page flip |
| `JOB_BOB` | lift 1.5px, 0.4 `sine.inOut` each way | one lift-and-settle while the job waits at a bot, skipped if the wait's too short — **with the 2s dwell, no stop has enough left over, so it never plays now** |
| `JOB_EXIT` / `JOB_EXIT_INSET` (**new 2026-09-28**) | speed 480px/s `power2.inOut`, min 0.35s · 14px | after bot 4: the job slides right to `JOB_EXIT_INSET` px inside the ground line's end, never quicker than `min` (0.35s at `lg`/1440, 0.46s at 4K); the inset keeps the 24px sheet on the line at the done pop's peak |
| `JOB_DONE` / `JOB_FADE` (**new 2026-09-28**) | scale 1.12, up 0.12 `power2.out` / down 0.3 `back.out(3)` · fade 0.3 `power1.in` | the job's one "done" pop at the line's end, then it fades out where it stands |
| **`JOB_LEAVE` / `JOB_ENTER` / `JOB_OUT` are removed 2026-09-28** | — | superseded by the job's own exit (`JOB_EXIT`/`JOB_DONE`/`JOB_FADE`) and the lesson's own moves (`LESSON_*`, below) |
| `LESSON_SPLIT` (**new 2026-09-28**) | from 0.6, fade 0.15, peel 10px `power2.out`, 0.35 `back.out(1.7)`, hold 0.15 | at bot 4: the lesson pops in off the job's centre, fades in, and peels 10px up off the sheet |
| `LESSON_LEAVE` / `LESSON_ENTER` (**new 2026-09-28**) | lift 4px, 0.2 `power2.in` · from 8px, 0.3 `power2.out` | leaving bot 4 (fades out, hidden while it crosses step 4's text); dropping onto the return path at R0, fading in |
| `LESSON_OUT` (**new 2026-09-28**) | scale 1.3, 0.25 `power2.out` | popping out at the arrowhead as bot 1 takes the loop back |
| `GHOST_LAG` / `GHOST_SCALE` / `GHOST_OPACITY` | 0.03 · 0.85 / 0.7 / 0.55 · 0.45 / 0.28 / 0.14 | trail: per ghost k = 1–3; in 0.1, out 0.15; runs the job's hops and its exit slide, never the return |
| `LIT_LENGTH` / `LIT_IN` / `LIT_FADE` | 128px · 0.1 · 0.5 | ground-lit segment |
| `RETURN_SPEED` / `RETURN_LIT_FADE` | 450px/s `none` · 0.6 | **the lesson's** speed along the return path (was the job's before the 2026-09-28 split); return light fade |
| `CHEVRON_PULSE` | 1.35 · 0.15 up `power2.out` / 0.3 down `power2.inOut`, colour `accent` → `cream` → `accent` | chevrons and the arrowhead |

#### Layer 10 (old §5.7): the crew relay, the job and the lesson

10. **Crew relay: the job and the lesson (revised 2026-09-28, final numbers from the lead's screen
    check).** Loops while live, after all four have landed; first run `RELAY_FIRST` after, then every
    `RELAY_EVERY` (16.4s) start to start. Each bot catches the job at its step, on the right of it
    (bots 1 and 4 included), changes it on a beat of its full act, and — for the rest of its 2s dwell —
    watches it (`RELAY_WATCH`, a glance to the right). The 2s dwell leaves too little over for the hold
    bob (`JOB_BOB`) or a watch blink (`RELAY_WATCH_BLINK`), so neither plays now (open question: see
    `../sections/05-process.md`). After bot 4's change the job is done: it slides right along the
    ground line to `JOB_EXIT_INSET` px inside the line's end, trailed as on a hop, pops once
    (`JOB_DONE`) and fades (`JOB_FADE`) — never past the line, so never a sideways scroll. At the same
    moment a small lesson card splits off the job's centre (`LESSON_SPLIT`), fades out leaving bot 4
    (`LESSON_LEAVE`, hidden the whole time so it never crosses step 4's text), drops in at the return
    path's start (`LESSON_ENTER`) and rides it alone — no ghosts — at `RETURN_SPEED`, lighting it, to
    the arrowhead, where it pops out (`LESSON_OUT`) as bot 1 takes the loop back.
    - **Waypoints (from `lg`)**, measured relative to the relay layer (the body wrapper's box, `z-1`,
      under the loop label's `lg:z-10`), refreshed with the eye centres. **J1–J4**, each bot's stop:
      x = svg left + (`JOB_AT[role]` + 30) / 170 × width, y = ground line top. K1–K3 = chevron
      centres. R0–R7 on the return path's centre line, with xr = R.right − 1, xl = R.left + 1,
      yb = R.bottom − 1: R0 (xr, R.top), R1 (xr, yb − 16), R2 (xr − 4.69, yb − 4.69), R3 (xr − 16, yb),
      R4 (xl + 16, yb), R5 (xl + 4.69, yb − 4.69), R6 (xl, yb − 16), R7 (xl, R.top).
    - **The run** (s; A1–A4 = arrival at each stop, when `arrive(i)` starts the bot's full act; a run,
      return included, is ≈13.7s at `lg`, 14.4s at 1440, 14.7s at 4K):

    | t | Job / lesson | Bot (act beat) | Lights |
    |---|---|---|---|
    | 0 | job set at J1, blank; opacity 0 → 1 (`RELAY_FADE`), `JOB_POP` | | |
    | A1 = 0.2 | | bot 1 full act (ends 1.95) | |
    | A1 + 0.55 / + 0.75 | rule 1 / rule 2 `scaleX` 0 → 1 (`MARK_WRITE`) | clipboard marks 1 / 2 re-written | |
    | A1 + 1.05 | stamp thumps in (`JOB_STAMP`), then `SETTLE` | first nod | |
    | A1 + 1.05 → 2.2 | the job holds (too little of the dwell left for `JOB_BOB` or a watch blink) | bot 1's eyes stay on it (`RELAY_WATCH`) | |
    | 2.2 → 2.9 | hop to J2 | `head(1)`: bot 2 taps a foot | ghosts, ground lit; chevron 1 at its crossing |
    | A2 = 2.9 | | bot 2 full act (ends 4.59) | |
    | A2 + 0.37 / + 1.04 | band / step grow, job pops (`JOB_BUILD` + `JOB_SQUASH`) | strike 1 / strike 2 impact | |
    | 4.9 → 5.6 | hop to J3 | `head(2)` | chevron 2 |
    | A3 = 5.6 | | bot 3 full act (ends 7.55; "found it" pop and tilt-back start 7.15) | |
    | A3 + 1.08 / 1.13 / 1.25 | tick opacity 1 / 0 / 1 + `JOB_TICK`; glow flashes full then fades (`JOB_GLOW`) | lens-lit flicker, same beats | |
    | 7.6 → 8.3 | hop to J4 | `head(3)` | chevron 3 |
    | A4 = 8.3 | | bot 4 full act (ends 10.2) | |
    | A4 + 0.95 | corner folds over its hinge (`JOB_FOLD`, 0.35s), then `JOB_SQUASH` | page flip (same ease and length); mark re-written at A4 + 1.35 | |
    | 10.3 | job slides right to the line's end (`JOB_EXIT`, 0.35s at `lg`/1440, 0.46s at 4K), ghosts and ground lit trail it; lesson splits off the job's centre, fading and peeling in (`LESSON_SPLIT`) | | |
    | 10.65 | job at the line's end, pops as done (`JOB_DONE`, settled 11.07) | | |
    | 10.8 | lesson done splitting (0.35s + 0.15s hold); `head(0)`: the loop heads back to bot 1 | | |
    | 10.8 → 11.0 | lesson fades out leaving bot 4 (`LESSON_LEAVE`, hidden — never crosses step 4's text) | | |
    | 11.07 → 11.37 | job fades out where it stands (`JOB_FADE`) | | |
    | 11.0 → 11.3 | lesson drops in at R0, fading in (`LESSON_ENTER`) | | |
    | 11.3 → 13.72 | lesson rides R0 → R7 at `RETURN_SPEED` (450px/s, linear); no ghosts | | return lit follows the lesson |
    | 13.72 → 13.97 | at R7: lesson pops out, scaling up as it fades (`LESSON_OUT`); `receive(0)`: bot 1 takes it back | | arrowhead pulse; return lit fades |

    - **Hops.** The job tweens J(i) → J(i+1) with `RELAY_HOP`; its exit slide to the ground line's end
      after bot 4 tweens the same way with `JOB_EXIT`'s own duration and ease. Ghost k repeats
      whichever tween `GHOST_LAG` × k later, at `GHOST_SCALE[k]`, fading to `GHOST_OPACITY[k]` (0.1) at
      its start and to 0 (0.15) ending at its arrival; the ghosts paint under the job and fold into it
      at each stop (and at the exit's end). They never run the return leg — the lesson rides that
      alone. The ground-lit span fades in (`LIT_IN`) at hop start, its `x` = job x − `LIT_LENGTH` on
      the same tween (head under the job's centre, the tail behind it), and fades (`LIT_FADE`) on
      arrival — also true of the exit slide. At each chevron's crossing (the existing ease-inverted
      time), its icon pulses `CHEVRON_PULSE`: scale and colour to `cream` together, then back; cream is
      read from `--color-cream` at setup (never a literal), and `clearProps: "color"` returns it to
      `text-accent`. The arrowhead does the same at R7.
    - **The job's exit and the lesson's return (revised 2026-09-28: the job no longer rides the path
      itself).** After bot 4's change, the job slides right along the ground line to
      `JOB_EXIT_INSET` px inside its right end (`JOB_EXIT`), pops once as done about its bottom centre
      (`JOB_DONE`) and fades where it stands (`JOB_FADE`) — it never reaches the return path. At the
      same moment the lesson card splits off the job's centre (`LESSON_SPLIT`: pops in, fades in,
      peels `LESSON_SPLIT.peel` px up off the sheet), then fades out leaving bot 4 (`LESSON_LEAVE`,
      hidden throughout, so it never flies across step 4's text) and drops in at R0 from above, fading
      back in (`LESSON_ENTER`), centred on the path's centre line. It then rides R0 → R7 at
      `RETURN_SPEED` alone — no ghosts — each leg timed by its length. At the ride's start the
      return-lit overlay gets opacity 1 and `clipPath` `inset(0px 0px 0px 100%)`; each leg's tween also
      moves the inset's left edge to (that waypoint's x − R.left − 2)px on the same timing, so the
      dashes turn solid violet behind the lesson. At R7 the arrowhead flashes, the overlay fades
      (`RETURN_LIT_FADE`), and the lesson scales up and fades (`LESSON_OUT`) as bot 1 takes it back
      (`receive(0)`).
    - **Beats run on the relay's clock**, at `JOB_BEATS` after each arrival, the same moments
      `catchRelay` starts the act, so the story holds even when a bot can't act. **Catch priority:**
      the relay publishes each bot's next catch (run start + A(i)); a timed act doesn't start within
      `RELAY_CLEAR` of it and a nap not within `NAP_LENGTH` max + `RELAY_CLEAR`; both retry after
      `BUSY_RETRY`. So a bot is idle at its catch unless the visitor just made it react; then it
      glances at the job (a napping one wakes), as before, and the job still changes.
    - **The job and lesson never cross the text, the label or the page edge:** J1's left edge is 4px
      inside the body, the right-hand stops end ~130px into columns of 211–360px, the job's exit stops
      `JOB_EXIT_INSET` px short of the ground line's right end, and the lit segment is clipped to the
      ground line. The job passes fully hidden behind the loop label while it crosses behind it along
      the ground line; the lesson is hidden throughout its hop off bot 4 (it never flies across step
      4's text) and, like the job before it, passes fully hidden behind the loop label along the
      return path.
    - **Below `lg`:** ~~unchanged. No job, lesson, trail or lit lines. Every `CASCADE_EVERY`, bots 1 → 4
      each catch in turn, `CASCADE_GAP` apart (full act if idle, glance if busy, wake if napping; no
      jump).~~ **Superseded 2026-09-28 by §5.9:** the same run turned vertical (no lit lines).

### Old §5.8: the relay choices (6, 12, 16–27)

6. **The canvas's lone cream job square: in (user's yes, 2026-09-28)**, as the relay's moving job,
   not as the static square at x 824. The static page still shows nothing on the ground line. Was
   "left out, add only on your yes" (2026-09-26).
12. **Relay return (revised twice 2026-09-28, final):** a lesson card drops in at the return path's
    top-right start and rides the path itself back to bot 1, splitting off the job at bot 4 rather than
    the job itself riding the path (**superseded 2026-09-28**, choice 26), which itself replaced the
    job flying down across step 4's text to reach the path, or being filed away with a separate spark
    tracing the return (both **superseded 2026-09-28**).
16. ~~**Chevron pulse is scale only.**~~ **Revised 2026-09-28:** the icon flashes `cream` with the
    scale pulse (lit = one step brighter: `line` → `accent` for lines, `accent` → `cream` for the
    accent icons). The alternative was a violet glow on the line under the chevron only; the icon
    is already violet, so that wouldn't read as lit.
17. **The job paints above the bots and below the loop label** (`z-1` in an `isolate` body, the label
    `lg:z-10` with a taller `bg-bg` backing), **superseding** the earlier "behind the bots" choice
    (`-z-10`, filed into the rulebook): painting behind let it peek from behind a bot's silhouette at
    some stops, and the user preferred it never disappear except fully, behind the label.
18. **The story continues past bot 4, not a separate spark.** With the job no longer filed away at bot
    4, something carries the loop back to bot 1: first the job itself (**superseded 2026-09-28**, see
    choice 26 — it now completes and slides off the ground line instead), now a small lesson card that
    splits off it and rides the dashed path back alone, and the return-lit overlay is its trail.
    **Supersedes** the "cream spark traces the return, no ghosts on it" choice.
19. **The return lights solid violet** (the dashes' gaps fill in), not cream: all lit lines are
    `accent`, and a 1000px cream line would outshine the job.
20. **Team strikes exactly twice on a relay catch** (`RELAY_STRIKES`), one part per strike, so the
    build is deterministic; timed acts keep 2–3. The alternative keeps 2–3 and gives the third strike
    only a squash.
21. **`RELAY_EVERY` 9 → 15 → 20 → 16 → 16.4 (final, from the lead's screen check).** Full acts alone
    take 7.8s of dwell; with three hops and the return ride the run grew to ≈17.3–18.3s once the job
    rode the path itself (rather than being filed away with a quick spark), so 15s could no longer hold
    it, and 20 gave it more room than it needed. Once the dwell dropped to 2s a side (`RELAY_DWELL`,
    choice 25) and the acts were retimed to fit inside it, the run shrank to ≈13.3–14.3s, so
    `RELAY_EVERY` came back down to 16. Splitting the return into its own lesson card (choice 26) added
    the split-off and its own leave/enter around the job's exit, growing the run to ≈13.7–14.7s, so
    `RELAY_EVERY` settled at 16.4 — about 1.7–2.7s clear before the next run starts. The phone cascade
    keeps 9s (`CASCADE_EVERY`) (**superseded 2026-09-28**, choice 27: the phone relay shares 16.4).
25. **`RELAY_DWELL` 3s → 2s, one value for every role** (was 3.0/3.0/3.0/3.0, briefly 2.0/1.6/1.8/2.4
    before that), and **`JOB_AT` moves every stop to the bot's right** (rules and update were on the
    left, under the clipboard and the rulebook; team and check were already on the right, under the
    hammer and the lens). One side for every bot reads more consistently, and update sits 4 units
    further right than the others so the built step clears the wrench. The acts' own timings
    (`RATCHET`, the rules/check/update tail tweens) and `JOB_BEATS` are retimed to land inside the
    shorter dwell; `RELAY_WATCH` becomes uniformly rightward (7/5/7/7, was −7/5/7/−7). The trade-off:
    the dwell no longer leaves enough over for the hold bob (`JOB_BOB`) or a watch blink
    (`RELAY_WATCH_BLINK`), so neither plays now — open question, see the page doc.
22. **Job beats run on the relay's clock, with catch priority** (`RELAY_CLEAR` holds timed acts and
    naps off near a catch) rather than driving the job from inside each act. It keeps one writer per
    job part and the story intact even when a visitor's tap on another bot reacts mid-run (hover/tap
    no longer interrupts an acting bot itself, 2026-09-28). The shared beat times move
    into `lib/processBotMotion.ts` (`JOB_BEATS`) so the acts and the job read the same numbers.
23. **Job is an inline SVG**, not HTML: its marks need `svgOrigin` pivots and 45° paths, like the bots.
24. **Hop time stays fixed at 0.7s,** so legs of different length (at 1440: 450, 340, 230px) move at
    different speeds; the ease hides most of it. Hop time by distance is the alternative.
26. **The job completes at bot 4 instead of riding the return (2026-09-28, final, the lead's screen
    check); a separate lesson card carries the loop back.** After bot 4's fold, the job slides right
    along the ground line to its end, pops once as done and fades there — it never reaches the return
    path, and the three trail ghosts stay with it (its hops and this exit slide), not with the return.
    A new 14px lesson card (a rulebook page: one violet line on cream) splits off the job's centre at
    that moment, fades out hidden leaving bot 4 (so it never crosses step 4's text, unlike a card that
    stayed visible the whole way), drops in at the return path's start and rides it alone — no ghosts —
    back to bot 1. **Supersedes** choice 12's and 18's "the job itself rides the return path" line and
    the `JOB_LEAVE`/`JOB_ENTER`/`JOB_OUT` constants (now `JOB_EXIT`/`JOB_DONE`/`JOB_FADE` for the job's
    exit, `LESSON_SPLIT`/`LESSON_LEAVE`/`LESSON_ENTER`/`LESSON_OUT` for the lesson's).
27. **Phone relay (2026-09-28, the user's choice of a vertical relay; §5.9).** The desktop story
    turned 90° clockwise, replacing the 9s cascade. (a) **The job sits on each bot's right at its
    feet, at 2/3 size (16px)**: the desktop seat at the bots' phone scale (88 vs 136), so each drop
    passes only the next bot's hand and tool, never its face. The alternative, the 24px job centred
    under each bot, drops across the next bot's face and body: the 88px column has no 24px lane clear
    of a bot. **Open for the user.** (b) **No track**: hops with the ghost trail only, so the static
    page is unchanged. The alternatives were a motion-only violet streak, or a static 2px `line` rail
    that would cross every row hairline and run behind every tool. **Open for the user.** (c) **The
    lesson rides up the column's left edge**, from the return row's icon (which flashes as it rises in)
    to bot 1's clipboard: the desktop return turned with the layout (below the line becomes left of the
    column). The alternative, back up the job's lane, crosses every tool again and meets the ghosts. It
    hides leaving bot 4, as on desktop, because the straight way across passes bot 4's face.
    **Superseded 2026-09-28 (user's decision):** the lesson no longer hides leaving bot 4 and rises
    in at a flashing return icon; instead it appears directly in bot 4's rulebook hand (screen
    left), he looks at it briefly (~0.6s), then it lifts off and rides straight up the column's
    left edge to bot 1's clipboard. The return icon no longer flashes. See the page doc. (d) **One
    cadence**: `RELAY_EVERY` 16.4 at every width (a phone run is ≈12.6–12.9s, built and screen-checked
    at 390); `CASCADE_EVERY` / `CASCADE_GAP` go.

### 5.9 Phone relay (below `lg`; new 2026-09-28, user's choice)

The one question stays the same: how do they work? This is the §5.7 relay turned 90° clockwise. The
ground line's left-to-right becomes the bot column's top-to-bottom, and the return (below the line on
desktop) becomes the column's left edge, running back up. It uses the same pieces, beats, 2.0s dwells
and 16.4s cadence. Motion only, full motion only, 0–1023px. **Static page unchanged**: every element
is `opacity-0` at rest, so without JS and under reduced motion nothing new shows.

**Lanes (inside the 88px bot column; the text starts at x 106, the loop label at x 32).**
- **Job lane, on the right.** Stops P1–P4 use §5.7's x formula (svg left + (`JOB_AT[role]` + 30) / 170
  × width: 78.7px, update 80.8), with y = the svg's bottom (its feet line; there is no ground line
  here). The job sits on each bot's right under its hand or tool, as on desktop. It spans x 70.7–88.8,
  ≥17px clear of the text, and ≥6px clear of every bot's body and face (strip C ends at 64.2).
- **Lesson lane, on the left.** x = svg left + (`COLUMN_LESSON_AT.x` + 30) / 170 × width = 7.8px
  (bot 1's clipboard centre). The 10px card spans 2.8–12.8, clear of bots 2 and 3's left arms (from
  13.5) and ≥19px clear of the loop label.

**Markup (web-coder; class strings and one hook, no layout change):**

| Element | Change |
|---|---|
| Relay layer (`ProcessRelay`) | `pointer-events-none absolute inset-0 z-1` (drops `hidden lg:block`) |
| Ghost ×3 | `absolute left-0 top-0 -ml-2 -mt-4 size-4 opacity-0 lg:-ml-3 lg:-mt-6 lg:size-6` |
| Job (`ProcessJob`) | `absolute left-0 top-0 -ml-2 -mt-4.75 h-4.75 w-4 overflow-visible opacity-0 lg:-ml-3 lg:-mt-7.25 lg:h-7.25 lg:w-6` (same viewBox, drawn at 0.655px per unit; the glow's stroke draws 1px) |
| Lesson (`ProcessLesson`) | `absolute left-0 top-0 -ml-1.25 -mt-1.25 size-2.5 opacity-0 lg:-ml-1.75 lg:-mt-1.75 lg:size-3.5` |
| Return row (`ProcessReturn` wrapper) | adds `data-anim="process-return-row"`, still read for the job's exit hairline (`JOB_EXIT_INSET` above its top edge). `CornerUpLeftIcon` stays its first child but plays no part in the relay: **built 2026-09-28,** R0 is bot 4's rulebook (`COLUMN_LESSON_FROM`, read live through his `arm-left` group), not the icon, and the icon never flashes |

The anchors are unchanged (job and ghosts at the bottom centre, lesson at the centre), and the margins
follow the size, so motion still owns `transform` alone. No CSS `scale`, which would scale GSAP's
translate. The ground lit, return lit and chevrons stay `lg` only.

**Layering.** The layer is `z-1` in the `isolate` body at every width: above the bots, as on desktop,
where the job already crosses in front of each catching bot's feet. Both lanes stay out of the text
column and away from the label, so nothing ever passes over or behind text, and nothing needs a mask.

**The run** (s; §5.7's clock: A1–A4 = 0.2 / 2.9 / 5.6 / 8.3, `JOB_BEATS`, acts and `RELAY_WATCH`
unchanged, because the job is on each bot's right as on desktop):

| t | Job / lesson | Bot | Lights |
|---|---|---|---|
| 0 → 10.3 | as §5.7: blank job pops in at P1; written and stamped, built, checked, folded at P1–P4 | full acts, watch looks | none |
| each hop (2.2, 4.9, 7.6; `RELAY_HOP` 0.7) | straight down the job lane P(i) → P(i+1), one row (≈140–200px). Passes in front of the next bot's hand and tool (hammer, lens, wrench) and lands under it | `head(i+1)` foot tap | ghosts trail; no lit line or chevrons |
| 10.3 → 10.65 | exit: drops down its lane to E = (P4.x, return row top − `JOB_EXIT_INSET`), ≈45–95px, `JOB_EXIT` (its 0.35s min) | | ghosts trail |
| 10.65 → 11.37 | `JOB_DONE` pop (settled 11.07), then `JOB_FADE` | | |
| 10.3 → 10.65 | **Built:** the lesson pops in and fades in (0.6 → 1) on bot 4's live rulebook, R0 = `COLUMN_LESSON_FROM` read through his `arm-left` group so it follows his breath, drift and sway (`lessonAppear`, `LESSON_SPLIT`'s pop, no peel) | | |
| 10.65 → 11.25 | bot 4 holds it, looking down-left (`COLUMN_LESSON_HOLD`: 0.3s look, held to 0.6s after the pop settled); busy the whole time, so a tap is ignored (`holdLesson`) | | |
| 11.25 | lesson lifts 4px, no fade (`LESSON_LEAVE`'s lift, via `lessonLift`); bot 4's eyes ease back to rest; bot 1's foot tap starts (`head(0)`) | `head(0)` at 11.25 | |
| 11.25 → ≈12.15–12.65 | lifts off (0.2s), then rides straight up the lesson lane at `RETURN_SPEED` (450px/s, `none`) to R1 = bot 1's clipboard centre (`COLUMN_LESSON_AT`), x easing into the lane over up to 0.3s if the live rulebook sits off it (`COLUMN_LESSON_GLIDE`). ≈421–550px, 0.9–1.2s. No ghosts | | |
| arrival | `LESSON_OUT` over the clipboard (0.25s); `receive(0)` | bot 1 squash | |

A phone run lasts ≈12.6–12.9s (360: 12.92s, 390: 12.80s, 768: 12.64s), inside `RELAY_EVERY` 16.4 with
≈3.5s clear. `RELAY_FIRST` and the `RELAY_CLEAR` catch priority are unchanged, since the arrivals are
the same. Waypoints are re-measured on the list's ResizeObserver and on ScrollTrigger refresh, because
rows reflow with the text; R0 (bot 4's rulebook) is also read live, once more, as the lesson appears.

**Tap and pointer (layer 8, unchanged).** On touch, a tap (`pointerup` within `TAP_SLOP` / `TAP_TIME`,
as built) makes an idle or napping bot jump. An active bot ignores it, with no queue: its catch and
watch, a timed act, or the `receive` squash. A reacting bot ignores it too. The layer is
`pointer-events-none`, so a tap still reaches a bot the job is crossing. Each bot is an 88 × 57 tap
area. Nothing is focusable, so there are no hover, focus-visible or active states. Fine pointers below
`lg` (narrow desktop windows) keep hover and eye follow.

**Reduced motion.** As §5.7 layer 12: the job, lesson and ghosts are never shown at any width, and the
icon never flashes. The bots fade in and keep their static pose.

**Wiring (built, bot 4's handover).** Two `gsap.matchMedia()` blocks run the relay: full + `lg` runs
`relayRun` (§5.7), and full + below `lg` runs the new `columnRun`. `wide` now picks the geometry, not
whether a relay runs. New `lib/processRelayColumn.ts` has one job: the column waypoints (P1–P4, E,
R0 = bot 4's live rulebook, R1 = bot 1's clipboard) and `columnRun`. It reuses `jobStart` / `jobBeat` /
`jobExit` and `ghostHop` from `lib/processRelayJob.ts` / `lib/processRelayTrail.ts`, and two new
`lib/processRelayLesson.ts` helpers built for the pop-in-place handover, shared with nothing on
desktop: `lessonAppear` (the pop-in-and-fade-in, factored out of `lessonSplit`, used here without the
peel) and `lessonLift` (the same 4px lift as `lessonLeave`, without the fade, since the lesson stays
visible on bot 4's hand). It does **not** reuse `lessonSplit`, `lessonLeave` or `flash` — there is no
split-and-peel, no fade-out leaving bot 4, and no icon flash below `lg`. Other changes:
- `lessonEnter` (still `lib/processRelayLesson.ts`, desktop only) never gained a side option: the
  built handover rides straight up from bot 4's hand instead of dropping onto the return path, so
  `lessonEnter` is untouched and desktop-only.
- `lib/processBotMotion.ts` adds `COLUMN_LESSON_AT` = { x −15, y 50 } (bot 1's clipboard centre, the
  lane's x and the ride's end), `COLUMN_LESSON_FROM` = { x −15, y 52 } (bot 4's rulebook centre,
  mapped live through his `arm-left` group), `COLUMN_LESSON_HOLD` (0.6s hold, look/back timings) and
  `COLUMN_LESSON_GLIDE` (0.3s ease into the lane), and drops `CASCADE_EVERY` / `CASCADE_GAP`.
- `cascadeRun` leaves `lib/processRelay.ts`.
- New `holdLesson` cue in `lib/processBotActs.ts`: while the lesson sits on bot 4's rulebook, an idle
  or watching bot 4 looks down-left and holds (busy, so taps are ignored); a busy one glances instead;
  a napping one wakes.
- `hooks/useProcessBots.ts` wires both runs and the `holdLesson` cue. The revert strip no longer needs
  the return icon (it never flashes), so it covers only the job, ghosts and lesson.

#### Sizes: phone relay

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Relay layer | shown over the 320 body | shown over the 672 body | unchanged (desktop relay) | unchanged |
| Job | 16 × 19 box (15.7 × 19 drawn), bottom on the feet line; step rises 3px | same | unchanged, 24 × 29 | unchanged |
| Job stops P1–P4 | right of every bot, x 78.7 (update 80.8) in the 88 column, 57px below each bot's top | same | unchanged (ground line, J1–J4) | unchanged |
| Hop | straight down one row, ≈165–200px, 0.7s | ≈140–165px, 0.7s | unchanged | unchanged |
| Job exit | drops ≈70–95px to 14px above the return row's hairline, pop 1.12, fade | ≈45–70px | unchanged (slides right to the line's end) | unchanged |
| Ghosts (`size-4`) | 16px, scale 0.85 / 0.7 / 0.55, opacity 0.45 / 0.28 / 0.14 | same | unchanged, 24px | unchanged |
| Lesson (`size-2.5`) | 10 × 10, lane x 7.8; pops in on bot 4's rulebook (R0), holds 0.6s, then rides up to bot 1's clipboard (R1), ≈421–550px, 0.9–1.2s | same | unchanged, 14px on the return path | unchanged |
| Return icon | unused by the relay: the lesson starts on bot 4's hand, not the icon, and it never flashes | same | hidden (unchanged) | hidden |
| Ground lit, chevrons, return lit | none | none | unchanged | unchanged |
| Bots | unchanged, 88 × 57 | unchanged | unchanged | unchanged |

**Tokens (all existing):** `fill-cream`, `fill-ink`, `fill-accent`, `fill-cream-muted`,
`stroke-accent` (job, ghosts, lesson); `text-accent` on the icon, flashing to `--color-cream` (read
at setup, never a literal). No new token, no text, no slots.
