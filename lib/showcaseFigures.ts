// The showcase diagram's per-figure-kind class strings (ui-spec/07-proofs-spam.md, Layout per figure
// kind; `rix` from rev 2). The shared classes stay in the components; only these differ by kind.
// `image` (Eva, as built): the band's top is her overhang down from the list's top (28 / 36 / 48),
// its bottom her floor; the layer is her square box (144 / 192 / 248); the link at about 39% of her
// height. `rix` (rev 2): the band is 62 of his 84 units tall (its top at y 30), so the M's peaks
// break out (25 / 34 / 42); the layer is his height (96 / 130 / 161); the link at the held prop's
// centre, 12px after his box to 12px before the next Rix.
import type { ShowcaseFigureKind } from "@/lib/showcaseDiagram";

export type ShowcaseFigureClasses = {
  /** `ShowcaseStage`: the band's top and height from `md`. */
  readonly stage: string;
  /** The step's figure layer: its height from `md`. */
  readonly layer: string;
  /** `ShowcaseStepLink`: the link's height above the floor and its start from `md`. */
  readonly link: string;
};

export const showcaseFigureClasses: Record<ShowcaseFigureKind, ShowcaseFigureClasses> = {
  image: {
    stage: "top-7 h-29 lg:top-9 lg:h-39 xl:top-12 xl:h-50",
    layer: "md:h-36 lg:h-48 xl:h-62",
    link: "md:bottom-12.5 md:left-41 lg:bottom-17.25 lg:left-55 xl:bottom-22.75 xl:left-73",
  },
  rix: {
    stage: "top-6.25 h-17.75 lg:top-8.5 lg:h-24 xl:top-10.5 xl:h-29.75",
    layer: "md:h-24 lg:h-32.5 xl:h-40.25",
    link: "md:bottom-9.75 md:left-45 lg:bottom-13.5 lg:left-61 xl:bottom-17.25 xl:left-78",
  },
};

/**
 * Rix's drawn bounds with the prop in the showcase hold (left arm tip x −4, prop edge x 136, head
 * y 8, right foot tip y 92), so the figure's box is exactly Rix and its bottom edge is his feet.
 */
export const rixFigureViewBox = "-4 8 140 84";

/**
 * The showcase hold (rev 2, this diagram only): a nested viewport that maps the props' shared box
 * (x 106–130, y 26–50) onto a 36-unit square at x 100–136, y 35–71, so Rix grips the prop at the
 * middle of its left edge, on his arm's line, at scale 1.5. The props' own units stay valid inside.
 */
export const rixShowcaseHold = { x: 100, y: 35, size: 36, viewBox: "106 26 24 24" } as const;
