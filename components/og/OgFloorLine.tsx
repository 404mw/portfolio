// The floor line Rix stands on in the sharing images (app/opengraph-image.tsx,
// app/rix/opengraph-image.tsx): a 2px hairline in `line`, placed by its left and right x and its
// top y. No hooks or classes: ImageResponse only.
import { tokens } from "@/lib/tokens";

type OgFloorLineProps = {
  readonly left: number;
  readonly right: number;
  readonly top: number;
};

export function OgFloorLine({ left, right, top }: OgFloorLineProps) {
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: right - left,
        height: 2,
        background: tokens.colors.line,
      }}
    />
  );
}
