// One extruded shape of a proof bot (ui-spec §7.2.1): a continuous extrusion. First every side face
// of all its outlines (lib/proofBotExtrude.ts: one quad per depth-facing edge, swept by the depth
// vector, flat-shaded by facing, far to near), each stroked 0.35 in its own fill so no seam shows
// the banner through; then the fronts, filled with their material's gradient and a 0.7 rim.
// Several outlines share one call, so all their sides paint before any front (the body's feet and
// strips). A rotation is applied to the outline before extruding, so depth always runs down-right.
import { ProofBotShape } from "@/components/home/proofs/ProofBotShape";
import { proofBotDepth, type ProofBotDepthKind } from "@/lib/proofBotDepth";
import { proofBotSideFaces } from "@/lib/proofBotExtrude";
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
      {proofBotSideFaces(parts, proofBotDepth[depth]).map((face, index) => {
        const colour = proofBotSide(face.material, face.near);
        return (
          <ProofBotShape
            key={index}
            geometry={{ kind: "polygon", points: face.points }}
            style={{ fill: colour, stroke: colour }}
            strokeWidth={0.35}
            strokeLinejoin="round"
          />
        );
      })}
      {parts.map((part, index) => (
        <ProofBotShape
          key={index}
          geometry={part.geometry}
          rotation={part.rotation}
          fill={`url(#${ids[part.material]})`}
          stroke={`url(#${ids.rim})`}
          strokeWidth={0.7}
        />
      ))}
    </>
  );
}
