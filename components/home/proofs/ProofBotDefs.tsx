// A proof bot's definitions (ui-spec §7.2.1, §7.2.2): one front gradient per material, the rim and
// glint gradients, the strips' clip for the glints, and the drop shadow. Light comes from the top
// left. Every id comes from `proofBotIds` and starts with "proof-bot-". Colours go through
// `style` (`stopColor`, `floodColor`) from lib/proofBotShades.ts.
import { ProofBotShape } from "@/components/home/proofs/ProofBotShape";
import { strips } from "@/lib/proofBotBody";
import { proofBotShades, type ProofBotMaterial } from "@/lib/proofBotShades";
import type { ProofBotIds } from "@/lib/proofs";

const materials: readonly ProofBotMaterial[] = ["violet", "cream", "ink", "muted"];

type ProofBotDefsProps = {
  readonly ids: ProofBotIds;
};

export function ProofBotDefs({ ids }: ProofBotDefsProps) {
  const { rim, glint, shadow } = proofBotShades.light;
  return (
    <defs>
      {materials.map((material) => {
        const shades = proofBotShades.materials[material];
        return (
          <linearGradient key={material} id={ids[material]} gradientUnits="userSpaceOnUse" x1={-30} y1={0} x2={100} y2={92}>
            <stop offset={0} style={{ stopColor: shades.light }} />
            <stop offset={0.45} style={{ stopColor: shades.mid }} />
            <stop offset={1} style={{ stopColor: shades.shade }} />
          </linearGradient>
        );
      })}
      <linearGradient id={ids.rim} gradientUnits="userSpaceOnUse" x1={-20} y1={0} x2={80} y2={80}>
        <stop offset={0} stopOpacity={0.8} style={{ stopColor: rim }} />
        <stop offset={0.6} stopOpacity={0} style={{ stopColor: rim }} />
      </linearGradient>
      <radialGradient id={ids.glint}>
        <stop offset={0} stopOpacity={0.55} style={{ stopColor: glint }} />
        <stop offset={1} stopOpacity={0} style={{ stopColor: glint }} />
      </radialGradient>
      <clipPath id={ids.strips}>
        {strips.map((strip, index) => (
          <ProofBotShape key={index} geometry={strip} />
        ))}
      </clipPath>
      <filter id={ids.shadow} x="-40%" y="-40%" width="180%" height="180%">
        <feDropShadow dx={2.5} dy={5} stdDeviation={3.5} floodOpacity={0.5} style={{ floodColor: shadow }} />
      </filter>
    </defs>
  );
}
