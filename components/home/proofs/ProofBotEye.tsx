// One recessed eye of a proof bot (ui-spec §7.2.1): a 14 × 14 hole at (x, y) with its back wall, a
// darker top wall, a lighter left wall and the hole itself, set in by the body's depth. The group
// is the `eye` hook (its blink); colours sit on the paths inside it, never on the hook.
import { proofBotEyeDepth } from "@/lib/proofBotBody";
import { proofBotShades } from "@/lib/proofBotShades";

type ProofBotEyeProps = {
  readonly x: number;
  readonly y: number;
};

export function ProofBotEye({ x, y }: ProofBotEyeProps) {
  const { x: inX, y: inY, size } = proofBotEyeDepth;
  const shades = proofBotShades.eye;
  return (
    <g data-bot="eye">
      <path d={`M${x} ${y}h${size}v${size}h${-size}Z`} style={{ fill: shades.wall }} />
      <path d={`M${x} ${y}H${x + size}V${y + inY}H${x + inX}Z`} style={{ fill: shades.wallTop }} />
      <path d={`M${x} ${y}L${x + inX} ${y + inY}V${y + size}H${x}Z`} style={{ fill: shades.wallLeft }} />
      <rect x={x + inX} y={y + inY} width={size - inX} height={size - inY} style={{ fill: shades.hole }} />
    </g>
  );
}
