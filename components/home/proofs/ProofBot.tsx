// A proof card's mascot (ui-spec §7.2.1): the Process bot's MW body, extruded and lit, leaning 10°
// and looking up-right, holding its project's prop in the left hand. Static, server-rendered and
// decorative. It stands on the banner floor (the SVG's bottom edge) and breaks out past the card's
// top and right; `left` shifts it in only when its right edge would come within 8px of the
// viewport. The mask fades its last 10% into the glow. Paint order: the left arm (and prop) tucks
// under the body; the right arm covers strip C's side. Every `data-bot` hook is a bare group: no
// `transform`, no `style`; the lean is a plain wrapper.
import { ProofBotDefs } from "@/components/home/proofs/ProofBotDefs";
import { ProofBotEye } from "@/components/home/proofs/ProofBotEye";
import { ProofBotProp } from "@/components/home/proofs/ProofBotProp";
import { ProofBotSolid } from "@/components/home/proofs/ProofBotSolid";
import {
  proofBotArms,
  proofBotBodyParts,
  proofBotEyes,
  proofBotGlints,
  proofBotLean,
  proofBotLook,
  proofBotViewBox,
} from "@/lib/proofBotBody";
import type { ProofProp } from "@/lib/proofBotProps";
import { proofBotIds } from "@/lib/proofs";

type ProofBotProps = {
  /** The card's takeover id; keeps the SVG's ids unique per card. */
  readonly targetId: string;
  readonly prop: ProofProp;
};

export function ProofBot({ targetId, prop }: ProofBotProps) {
  const ids = proofBotIds(targetId);
  return (
    <svg
      viewBox={proofBotViewBox}
      aria-hidden="true"
      focusable="false"
      data-anim="proof-bot"
      data-prop={prop}
      className="absolute bottom-0 left-[min(0px,calc(var(--spacing-gutter)_+_2px_-_7.6%))] aspect-[160/116] h-auto w-[112.5%] overflow-visible [mask-image:linear-gradient(to_top,transparent,var(--color-ink)_10%)]"
    >
      <ProofBotDefs ids={ids} />
      <g data-bot="rise">
        <g filter={`url(#${ids.shadow})`}>
          <g transform={proofBotLean}>
            <g data-bot="rig">
              <g data-bot="arm-left">
                <ProofBotSolid parts={[proofBotArms.left]} depth="body" ids={ids} />
                <ProofBotProp prop={prop} ids={ids} />
              </g>
              <g data-bot="body">
                <ProofBotSolid parts={proofBotBodyParts} depth="body" ids={ids} />
                <g data-bot="eyes" data-look={proofBotLook}>
                  {proofBotEyes.map((eye) => (
                    <ProofBotEye key={eye.x} x={eye.x} y={eye.y} />
                  ))}
                </g>
                <g clipPath={`url(#${ids.strips})`}>
                  {proofBotGlints.map((glint) => (
                    <ellipse
                      key={glint.cx}
                      cx={glint.cx}
                      cy={glint.cy}
                      rx={glint.rx}
                      ry={glint.ry}
                      transform={glint.transform}
                      opacity={glint.opacity}
                      fill={`url(#${ids.glint})`}
                    />
                  ))}
                </g>
              </g>
              <g data-bot="arm-right">
                <ProofBotSolid parts={[proofBotArms.right]} depth="body" ids={ids} />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
