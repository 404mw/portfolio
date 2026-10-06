# §5.9 The phone track (legacy)

**Last Updated:** 2026-10-05

**Superseded 2026-10-05, later (the user's decision, final; `05-process.md` §5.8 choice 53):** the
track is replaced below `lg` by a ledge under each bot and a dotted fix line (`05-process.md` §5.3a,
§5.9). `ProcessTrack.tsx`, `process-track` and `process-track-lit` are removed, along with the fix
marker row's `bg-bg` that masked the track. Choices 44–52 that came with it are closed in
`05-process.md` §5.8. This file keeps the track's spec as built and checked on 2026-10-05, for the
motion pass (the lane, `ontoTrack`, `COLUMN_JOB_GLIDE` and `litDrop` are still in the code). Nothing
here is current.

#### The track (`ProcessTrack`, built 2026-10-05; the user's choice 44)

The ground line turned 90°: a rail down the bot column for the job to ride. One file,
`components/home/process/ProcessTrack.tsx` (server, no props, two sibling elements), rendered by
`ProcessList` after the ground-lit overlay and before the `<ol>`. Decoration only: no text, no
slot, no image, nothing interactive or focusable (so no hover, focus-visible or active state).

```
div data-anim="process-list" class="relative"                      (ProcessList, unchanged)
├ ground line, ground-lit clip box                                 (unchanged, from lg)
├ div aria-hidden="true" data-anim="process-track" class="absolute bottom-3.5 left-19 top-15.5 w-0.5 bg-line lg:hidden"
├ div aria-hidden="true" class="pointer-events-none absolute bottom-3.5 left-19 top-15.5 w-0.5 overflow-hidden lg:hidden"
│ └ span data-anim="process-track-lit" class="absolute left-0 top-0 h-32 w-0.5 bg-linear-to-b from-accent/0 to-accent opacity-0"
└ ol class="relative grid {grid}"                                  (gains `relative`, 5.2)
```

- **Where, across.** x 76–78 of the list (`left-19 w-0.5`), centre 77: the prop slot's centre
  line (viewBox x 118, `JOB_AT.intake`, 76.6px in the 88px box), so the held emblem sits centred
  on it. Every measure is in rem, as the column and the bot are, so it holds under zoom.
- **The job's lane is the track (built 2026-10-05).** Without it the stops are measured per
  role (`JOB_AT`: x 78.7 for most, 80.8 for `flag` and `update`, 76.6 at the hand), a 4px band.
  Below `lg` stops 2…n and the exit take their x from the measured centre of `process-track`;
  the hand stays measured live, and the job eases onto the line out of the hand (`ontoTrack`
  in `lib/processRelayColumn.ts`: `y` on `RELAY_HOP`, `x` on `COLUMN_JOB_GLIDE`, 0.2s
  `power2.out`). Each stop moved 2–4px left, under an 18px job. **Tolerance:** the job's
  centre within 1px of the track's centre from step 1's feet line down; up to 3px above that,
  where the hand sways. **Measured:** 0.00px off at stops 2…n and the exit; 2.0–3.2px off at
  the hand-off instant, for about 0.05s (open choice 51). From `lg` `JOB_AT` is unchanged; it
  is also the lane below `lg` if the track or its segment is missing, and then nothing lights.
- **Where, down.** Top at 62 (`top-15.5`): 2px under the held emblem's bottom edge (viewBox
  y 50 = 60 under the list's top). Bottom 14 above the list's end (`bottom-3.5`, the built
  `JOB_EXIT_INSET`): the job's exit point. In a flow with loops the list's end is the return
  row's hairline, so the track stops 14px above it and never enters the return row; on Discord
  it stops 14px above the end of step 5's padding.
- **What it passes.** **Bots:** behind them (the `<ol>` paints after it). At viewBox x 117–121
  it is clear of every body, arm and foot (bodies end at x 94, arms at x 112); it goes behind
  the right-hand tool (emblem, hammer head, lens, pennant, bell, arrow) and shows again under
  it, down past the feet line where the job waits. Beside `rules` and `host`, which hold
  nothing on the right, it runs in the open. **Row hairlines:** it crosses each one, `line` on
  `line`. **The fix marker row:** masked for the row's height by the row's `bg-bg` (5.3a), so
  it never runs through the fix label. **Step text:** never; the text column starts at x 106,
  28px to its right, and the 18px job (x 68–86) stays inside the bot column.
- **At rest:** the track shows, 2px `bg-line` like the ground line, below `lg` only
  (`lg:hidden`), with and without JavaScript and under reduced motion. The lit segment is
  hidden (`opacity-0`). From `lg` neither exists on screen and the ground line is unchanged.
- **Motion (built 2026-10-05), the lit segment** (`litDrop` in `lib/processRelayTrail.ts`, the
  `y` twin of `litHop`): `process-ground-lit` turned 90°, on the same numbers (`LIT_LENGTH`
  128 = `h-32`, `LIT_IN` 0.1, `LIT_FADE` 0.5). On each hop it is placed with its bright lower
  end on the job's feet line, fades in, moves down (`y`) on the hop's own timing so the bright
  end stays there, and fades out behind the job on arrival. On a drop the brightest 18px is
  therefore behind the job (open choice 52). The first hop starts at the hand, so it enters
  from the track's top. **Fix rise:** turned over about its own middle (`scaleY: -1`, bright
  end up, at the job's feet), it follows the job from bot 4's feet up to bot 3's (`FIX_HOP`,
  0.8s) and fades on arrival; the drop back is a plain hop. **Exit drop:** it follows the job
  to the track's end on the exit's timing and fades as the job pops and fades. Nothing lights
  for the lesson's ride, whose lane is the column's left edge. Trigger: the relay's clock
  (5.7), full motion and below `lg` only. **Reduced motion:** no relay, so no lit segment; the
  track stays.
- **Markup the motion needs:** the segment sits in its own clip box (`overflow-hidden`, the
  track's exact box), so it never shows past either end and the animator added no element.
  Writers: `y`, `scaleY` and `opacity` on `process-track-lit` only. `process-track` is read
  (centre x, top) and never written. The strip on revert includes `process-track-lit`.
- **Ghosts: no change.** The three ghosts follow the job's own move, so they stay on the lane.
- **Must stay true:** tokens only (`line`, `accent` with a `/0` stop; no raw colour). Motion
  never writes `process-fix` or step 3's `<li>`. Nothing animates `transform` or `opacity` on
  `process-return` or its parent (the track sits in `process-list`, outside both). No sideways
  scroll at 360: the track is inside the list's box.

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Track (`absolute bottom-3.5 left-19 top-15.5 w-0.5 bg-line lg:hidden`) | 2 wide at x 76–78; ≈ 770 long (5 steps) · ≈ 930 (6) · ≈ 725 (Discord) | same x; ≈ 670 · ≈ 810 · ≈ 625 | none; the ground line | none |
| Its ends | top 2 under the emblem; bottom 14 above the return row's hairline (Discord: the list's end) | same | — | — |
| Break at the fix marker row | ≈ 20 (the row's height; more if the label wraps) | ≈ 20 | — | — |
| Lit segment (`h-32 w-0.5`) | 2 × 128, hidden at rest | same | none | none |
| Gap to step text | 28 | 28 | — | — |
