// Rix for the /rix sharing image (docs/pages/rix/ui-spec.md §0.5): the host bot's idle pose, drawn
// from ProcessBot's own geometry (lib/processBots.ts) with token colour values (lib/tokens.ts, via
// lib/botTokenColours.ts), since the image can't read CSS. At rest look his silhouette is the logo.
// One glyph: the first of the rising hearts (lib/rixGlyphs.ts). No hooks or classes: ImageResponse
// only.
import { botTokenColours } from "@/lib/botTokenColours";
import { botRig, type BotShape } from "@/lib/processBots";
import { rixGlyphs } from "@/lib/rixGlyphs";
import { tokens } from "@/lib/tokens";

function shapeOf(shape: BotShape, key: string) {
  const fill = botTokenColours[shape.colour];
  switch (shape.kind) {
    case "polygon":
      return <polygon key={key} points={shape.points} fill={fill} />;
    case "rect":
      return <rect key={key} x={shape.x} y={shape.y} width={shape.width} height={shape.height} fill={fill} />;
    case "path":
      return <path key={key} d={shape.d} fillRule="evenodd" fill={fill} />;
  }
}

type RixOgFigureProps = {
  readonly width: number;
  readonly height: number;
};

export function RixOgFigure({ width, height }: RixOgFigureProps) {
  const rig = botRig("host", "idle");
  const shapes = [...rig.feet, ...rig.strips, ...rig.eyes, ...rig.armLeft, ...rig.armRight];
  const heart = rixGlyphs.hearts.parts.find((part) => part.part === "1");
  return (
    <svg width={width} height={height} viewBox="-30 -18 170 110">
      {shapes.map((shape, index) => shapeOf(shape, String(index)))}
      {heart && <path d={heart.d} fillRule="evenodd" fill={tokens.colors.accent} />}
    </svg>
  );
}
