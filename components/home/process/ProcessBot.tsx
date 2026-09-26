// A process mascot (ui-spec §5.6): one vector SVG holding all four frames as groups. The static
// pose shows; the others are invisible, ready for the motion pass to swap. Each frame holds the
// three breath groups (body, hand, hat), always rendered, at breath 0 (no transforms).
// `overflow-visible` lets the update wrench's jaw (x 142.89) show past the viewBox edge (140).
// Decorative: hidden from assistive tech.
import {
  botFrames,
  botParts,
  type BotColour,
  type BotFrame,
  type BotRole,
  type BotShape,
} from "@/lib/processBots";

/** Colour keys → token fill classes. Eye holes use the page background. */
const fills: Record<BotColour, string> = {
  B: "fill-accent",
  C: "fill-cream",
  M: "fill-muted",
  D: "fill-cream-muted",
  I: "fill-ink",
  L: "fill-line",
  H: "fill-bg",
};

/** Draws one part in its token fill. */
function renderShape(shape: BotShape, index: number) {
  const className = fills[shape.colour];
  switch (shape.kind) {
    case "polygon":
      return <polygon key={index} points={shape.points} className={className} />;
    case "rect":
      return (
        <rect
          key={index}
          x={shape.x}
          y={shape.y}
          width={shape.width}
          height={shape.height}
          className={className}
        />
      );
    case "path":
      return <path key={index} d={shape.d} fillRule="evenodd" className={className} />;
  }
}

type ProcessBotProps = {
  readonly role: BotRole;
  readonly pose: BotFrame;
};

export function ProcessBot({ role, pose }: ProcessBotProps) {
  return (
    <svg
      viewBox="-30 -18 170 110"
      aria-hidden="true"
      focusable="false"
      data-anim="process-bot"
      data-role={role}
      data-pose={pose}
      className="h-14.25 w-22 shrink-0 overflow-visible lg:mt-5 lg:h-22 lg:w-34"
    >
      {botFrames.map((frame) => {
        const parts = botParts(role, frame);
        return (
          <g key={frame} data-frame={frame} className={frame === pose ? undefined : "invisible"}>
            <g data-breath="body">{parts.body.map(renderShape)}</g>
            <g data-breath="hand">{parts.hand.map(renderShape)}</g>
            <g data-breath="hat">{parts.hat.map(renderShape)}</g>
          </g>
        );
      })}
    </svg>
  );
}
