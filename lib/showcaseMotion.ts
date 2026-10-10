// The showcase diagram's motion constants (ui-spec/07-proofs-spam.md, Motion (later), both kinds
// and rev 2): seconds from the diagram's start unless marked. Nothing else lives here; the
// sequence is lib/showcaseSequence.ts, Rix's prop flourishes lib/showcaseFlourish.ts.
import type { Timing } from "@/lib/processBotMotion";
import { RISE } from "@/lib/proofBotMotion";

/** From `md` (Tailwind's 48rem) the diagram is one band with arrows and a U or loop return. */
export const showcaseWideQuery = "(min-width: 48rem)";

/** It plays once its top is this far up the dialog's view (an IntersectionObserver margin). */
export const SHOWCASE_IN_VIEW = "0px 0px -20% 0px";

/** The wrapper (and the band from `md`) fades in first; under reduced motion it's the only fade. */
export const WRAPPER_IN: Timing = { duration: 0.4, ease: "power2.out" };

/**
 * The steps light in order. A step lights at `STEP_FIRST + index × STEP_EVERY`; its link draws
 * `LINK_AT` after it lights (the spec's 0.25s), and its chevron lands just before the next step.
 */
export const STEP_FIRST = 0.15;
export const STEP_EVERY = 0.6;
/** The step's `<li>` (a phone band included) fades up from nothing: opacity only. */
export const STEP_LIGHT: Timing = { duration: 0.4, ease: "power2.out" };
/** Its number, title and line fade up this many px, this long after it lights. */
export const TEXT_RISE = 16;
export const TEXT_AT = 0.1;
export const TEXT_IN: Timing = { duration: 0.6, ease: "power2.out" };
/** The figure rises from `FIGURE_FROM`% of its own height below the floor, as the card bots rise. */
export const FIGURE_FROM = 40;
export const FIGURE_RISE: Timing = { duration: RISE.duration, ease: RISE.ease };
/** The hairline draws (`scaleX` 0 → 1), then the chevron fades in. */
export const LINK_AT = 0.25;
export const LINK_DRAW: Timing = { duration: 0.3, ease: "power2.inOut" };
export const CHEVRON_AT = 0.5;
export const CHEVRON_IN: Timing = { duration: 0.1, ease: "power1.out" };

/** Rix's prop flourish, this long after his step lights (as his rise lands). */
export const FLOURISH_AT = 0.65;
/** `palette` tilts and comes back about its grip. */
export const PALETTE_TILT = {
  angle: -8,
  out: { duration: 0.2, ease: "power2.out" },
  back: { duration: 0.45, ease: "back.out(2)" },
} as const;
/** `prompt`'s caret blinks twice: off and on, each beat this long, crisp. */
export const CARET_BLINK = { blinks: 2, beat: 0.22, cut: 0.04 } as const;
/** `picture` pops: down to 0.9 and back to 1 about its grip. */
export const PICTURE_POP = {
  scale: 0.9,
  down: { duration: 0.1, ease: "power2.in" },
  up: { duration: 0.4, ease: "back.out(3)" },
} as const;

/** The return starts this long after the last step lights. */
export const RETURN_AFTER = 0.7;
/** The return box fades in (phone: and up `TEXT_RISE`). */
export const RETURN_IN: Timing = { duration: 0.5, ease: "power2.out" };
/** `first` from `md`: the U wipes in right to left. */
export const U_WIPE: Timing = { duration: 0.6, ease: "power2.inOut" };
/** `last` from `md`: the loop draws its right leg down, then round to the arrowhead. */
export const LOOP_LEG: Timing = { duration: 0.25, ease: "power1.in" };
export const LOOP_ROUND: Timing = { duration: 0.45, ease: "power2.out" };
/** The share of the loop's width its right leg's strip shows while it draws down. */
export const LOOP_LEG_STRIP = 3;
/** Then the arrowhead and the pill pop. */
export const HEAD_POP: Timing = { duration: 0.3, ease: "back.out(2)" };
export const PILL_FROM = 0.6;
export const PILL_POP: Timing = { duration: 0.35, ease: "back.out(1.8)" };
export const PILL_AT = 0.05;
