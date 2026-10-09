// A process mascot (ui-spec §5.6): one vector SVG holding one rig, in paint order: the feet, then
// `upper` (body strips and eyes, arms and tools, hat, extras). Every movable part carries a
// `data-bot` hook for the motion pass. Static = the pose, complete and visible: no transforms, no
// inline styles; only decorative extras start hidden (`opacity-0`). `overflow-visible` lets the
// update wrench's jaw (x 142.89) show past the viewBox edge (140). Decorative: hidden from
// assistive tech.
import type { ReactNode } from "react";
import { botFills } from "@/lib/botFills";
import {
  botRig,
  type BotPose,
  type BotRole,
  type BotShape,
} from "@/lib/processBots";

/** Draws one part in its token fill, with its hook, hidden if its rest pose says so. */
function renderShape(shape: BotShape, index: number, pose: BotPose) {
  const shown = shape.shownIn === undefined || shape.shownIn.includes(pose);
  const className = shown ? botFills[shape.colour] : `${botFills[shape.colour]} opacity-0`;
  switch (shape.kind) {
    case "polygon":
      return <polygon key={index} points={shape.points} data-bot={shape.hook} className={className} />;
    case "rect":
      return (
        <rect
          key={index}
          x={shape.x}
          y={shape.y}
          width={shape.width}
          height={shape.height}
          data-bot={shape.hook}
          className={className}
        />
      );
    case "path":
      return <path key={index} d={shape.d} fillRule="evenodd" data-bot={shape.hook} className={className} />;
  }
}

/** Process' size: 88 × 57 below `wide`, 136 × 88 from `wide`. */
const processSize = "h-14.25 w-22 wide:mt-5 wide:h-22 wide:w-34";

type ProcessBotProps = {
  readonly role: BotRole;
  readonly pose: BotPose;
  /** Size and placement classes; Process' size when absent. */
  readonly className?: string;
  /** Extra SVG parts drawn last inside `upper` (Rix's props on About); Process passes none. */
  readonly children?: ReactNode;
};

export function ProcessBot({ role, pose, className = processSize, children }: ProcessBotProps) {
  const rig = botRig(role, pose);
  const draw = (shapes: readonly BotShape[]) => shapes.map((shape, index) => renderShape(shape, index, pose));
  return (
    <svg
      viewBox="-30 -18 170 110"
      aria-hidden="true"
      focusable="false"
      data-anim="process-bot"
      data-role={role}
      data-pose={pose}
      className={`shrink-0 overflow-visible ${className}`}
    >
      <g data-bot="rig">
        {draw(rig.feet)}
        <g data-bot="upper">
          <g data-bot="body">
            {draw(rig.strips)}
            <g data-bot="eyes" data-look={rig.look}>
              {draw(rig.eyes)}
            </g>
          </g>
          <g data-bot="arm-left">{draw(rig.armLeft)}</g>
          <g data-bot="arm-right">
            {draw(rig.armRight)}
            <g data-bot="tool">{draw(rig.tool)}</g>
          </g>
          <g data-bot="hat">{draw(rig.hat)}</g>
          {rig.sparks && (
            <g data-bot="sparks" className="opacity-0">
              {draw(rig.sparks)}
            </g>
          )}
          {rig.zzz && <g data-bot="zzz">{draw(rig.zzz)}</g>}
          {children}
        </g>
      </g>
    </svg>
  );
}
