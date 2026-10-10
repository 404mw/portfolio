// The showcase diagram's `rix` figure (ui-spec/07-proofs-spam.md, rev 2): the site's mascot, static,
// holding the step's prop (`ProcessEmblem`) in the showcase hold: a nested viewport that draws it
// 1.5x, gripped at the middle of its left edge on his arm's line. The SVG is cropped to his drawn
// bounds, so the box is exactly Rix and its bottom edge is his feet. 134 wide inside his band, 8
// from its right, on a phone; 160 / 216 / 268 at `md` / `lg` / `xl`, 8 / 16 / 32 in from the
// column, the M's peaks above the band. Decorative and not interactive: no button, quip or emotes.
import { ProcessBot } from "@/components/home/process/ProcessBot";
import { ProcessEmblem } from "@/components/home/process/ProcessEmblem";
import type { BotPose } from "@/lib/processBots";
import { rixFigureViewBox, rixShowcaseHold } from "@/lib/showcaseFigures";
import { rixProps, type RixPropName } from "@/lib/rixProps";

type ShowcaseRixFigureProps = {
  readonly prop: RixPropName;
  readonly pose: BotPose;
};

export function ShowcaseRixFigure({ prop, pose }: ShowcaseRixFigureProps) {
  return (
    <span
      data-anim="showcase-figure"
      className="absolute right-2 bottom-0 block w-33.5 md:right-auto md:left-2 md:w-40 lg:left-4 lg:w-54 xl:left-8 xl:w-67"
    >
      <ProcessBot role="host" pose={pose} viewBox={rixFigureViewBox} className="block aspect-140/84 h-auto w-full">
        <svg
          x={rixShowcaseHold.x}
          y={rixShowcaseHold.y}
          width={rixShowcaseHold.size}
          height={rixShowcaseHold.size}
          viewBox={rixShowcaseHold.viewBox}
          className="overflow-visible"
        >
          <ProcessEmblem emblem={{ name: prop, parts: rixProps[prop].parts }} />
        </svg>
      </ProcessBot>
    </span>
  );
}
