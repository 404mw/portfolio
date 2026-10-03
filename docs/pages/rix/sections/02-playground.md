# Playground

**Last Updated:** 2026-10-03

**The one question:** How do I make Rix act?

See `../page.md` for the site-wide index. Spec: `../ui-spec/02-playground.md`.

## Current State

Built on `/rix`. `RixPlayground` (heading is screen-reader only, plus a no-JS line) wraps
`RixControls`, which owns `useRixPlayground`. The stage band (`RixStage`: the About shelf's floor
line with a big Rix at its right end, then the "now playing" readout) is sticky on screens at least
40rem tall. Below it: the "Let him wander" patrol toggle (off by default), then five button groups
(Emotions, Moves, Tricks, Moods, Symbols), one button per content key. Under reduced motion the
toggle and the buttons with no reduced version hide and a note shows. Poking or petting Rix runs the
real ladder and pet; all schedulers are off. The feature set is `rixFeatures.playground`: patrol
`toggle`, quip `above`, and `stage: "floor"` (renamed from `looks`; the other host is `"cards"`).
The band reveals on load (`RixReveal`). Far-walk buttons use `WALK_FAR` (about 1.05 / 2.59 / 4.39 /
5.29s at 360 / 768 / 1440 / 3840).

Checks: lint, tsc and `npm run build` pass. A screen check at 360/768/1440/3840 passed before the
motion pass (no sideways scroll, no targets under 44px, Rix 204×132 / 272×176 / 340×220 / 340×220,
no errors).

## Key Files

- `components/rix/RixPlayground.tsx`, `RixControls.tsx`, `RixStage.tsx`, `RixReadout.tsx`,
  `RixGroup.tsx`, `RixPlayButton.tsx`, `RixReveal.tsx` — the section
- `hooks/useRixPlayground.ts`, `lib/rixPlayground.ts`, `lib/rixPlaygroundMoves.ts` — play logic and
  the command lists
- `lib/rixFeatures.ts` — per-host features (`stage: "cards" | "floor"`)
- `lib/rixMotion.ts` (`WALK_FAR`, `TOSS`), `lib/rixGait.ts`, `lib/rixStep.ts`, `lib/rixToss.ts`,
  `lib/rixPatrol.ts` — the walk, toss and patrol motion
- `lib/botTokenColours.ts` — token colours
- `components/home/about/poster/AboutPosterShelf.tsx` — the shelf Rix stands on
- `content/rix.ts` → `playground` — button labels, group names, readout text

## Decisions

- 2026-10-03: /rix motion: sections reveal on data-anim="reveal" (fade only under reduced motion); walk buttons use a ramped, stride-locked walk (WALK_FAR: cadence eased over 3 steps at each end, speed-matched at each plant with a 12% per-step push, lean into the start, speed-scaled bob); the quip sits above with an upward glance; patrol pause looks on the bare floor are pointer / out / a shelf end; a tossed prop lands on the floor line (TOSS.floorY) so no paint leaves the stage.
- 2026-10-02 — Controls are the button groups plus a patrol toggle; a big Rix on a stage.
- 2026-10-02 — The reduced-motion preview toggle is a dev aid and is not carried over (the visitor's own setting applies, constitution §5).
- 2026-10-02 — The stage is a floor line only (no shelf, no slots).
- 2026-10-02 — The walk buttons go the full distance.
- 2026-10-02 — Under reduced motion the moving buttons and the patrol toggle are hidden and a note is shown.
- 2026-10-02 — Rix is 204×132 / 272×176 / 340×220 per breakpoint, and stays 340×220 at 4K.
- 2026-10-02 — The patrol is off by default behind "Let him wander"; nothing auto plays on load (no nap, tag, nudges or arrival); the real poke ladder and pet run.
- 2026-10-02 — The stage band is pinned in view on screens at least 40rem tall.
- 2026-10-02 — Button groups are labelled Tricks and Symbols (copywriter).

## Open Questions

- **To build:** a screen re-check at 360/768/1440/3840 after the motion pass (pending).
