// Option B's shelf (02a-about-options §2a.B, ui-spec/00-rix.md R9): a 2px line across the column
// with Rix at Process size on its right end, feet on the line. His quip sits in the empty shelf
// space to his left, right-aligned, at most two lines; when motion sets the quip anchor's
// `data-side="right"` (too little room on his left), it sits to his right, left-aligned. Also the
// /rix playground's stage (docs/pages/rix/ui-spec/02-playground.md), which passes a bigger Rix,
// its quip above him and a bigger quip text; every default is B's, so home is unchanged. Motion
// hook: `about-rix-stage` (the walk track and the peek's clip box).
import { Rix } from "@/components/home/about/Rix";

type AboutPosterShelfProps = {
  readonly quipKey: string;
  /** Space above the shelf; option B's by default. */
  readonly className?: string;
  /** Rix's width and height classes; B's 136 × 88 by default. */
  readonly size?: string;
  /** The quip's placement classes; B's (left of him, flipping right) by default. */
  readonly quipPlacement?: string;
  /** The quip's text-size classes; `RixQuip`'s default when absent. */
  readonly quipText?: string;
};

const bQuipPlacement =
  "top-2 w-max max-w-40 right-full mr-3 text-right data-[side=right]:right-auto data-[side=right]:left-full data-[side=right]:mr-0 data-[side=right]:ml-3 data-[side=right]:text-left";

export function AboutPosterShelf({
  quipKey,
  className = "mt-6",
  size = "h-22 w-34",
  quipPlacement = bQuipPlacement,
  quipText,
}: AboutPosterShelfProps) {
  return (
    <div data-anim="about-rix-stage" className={`relative flex justify-end border-b-2 border-line ${className}`}>
      <Rix quipKey={quipKey} size={size} quipPlacement={quipPlacement} quipText={quipText} />
    </div>
  );
}
