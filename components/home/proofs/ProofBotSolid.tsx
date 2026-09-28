// One extruded shape of a proof bot (ui-spec §7.2.1): its depth steps, farthest first, each the
// outlines offset down-right and filled with that step's side mix; then the fronts, filled with
// their material's gradient and a 0.7 rim. Several outlines share one set of steps, so all their
// depth paints before any front (the body's feet and strips). A rotation stays on each outline,
// inside the step's translate, so depth always runs down-right.
import { ProofBotShape } from "@/components/home/proofs/ProofBotShape";
import { proofBotDepth, type ProofBotDepthKind } from "@/lib/proofBotDepth";
import type { ProofBotSolidPart } from "@/lib/proofBotShape";
import { proofBotSide } from "@/lib/proofBotShades";
import type { ProofBotIds } from "@/lib/proofs";

type ProofBotSolidProps = {
  readonly parts: readonly ProofBotSolidPart[];
  readonly depth: ProofBotDepthKind;
  readonly ids: ProofBotIds;
};

export function ProofBotSolid({ parts, depth, ids }: ProofBotSolidProps) {
  return (
    <>
      {proofBotDepth[depth].map((step) => (
        <g key={step.near} transform={`translate(${step.dx} ${step.dy})`}>
          {parts.map((part, index) => (
            <ProofBotShape
              key={index}
              geometry={part.geometry}
              transform={part.transform}
              style={{ fill: proofBotSide(part.material, step.near) }}
            />
          ))}
        </g>
      ))}
      {parts.map((part, index) => (
        <ProofBotShape
          key={index}
          geometry={part.geometry}
          transform={part.transform}
          fill={`url(#${ids[part.material]})`}
          stroke={`url(#${ids.rim})`}
          strokeWidth={0.7}
        />
      ))}
    </>
  );
}
