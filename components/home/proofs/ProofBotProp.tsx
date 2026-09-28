// A proof bot's left-hand prop (ui-spec §7.2.3): the `prop` hook, holding each piece's solids and
// flat details in paint order. The fan's swatches are each a `swatch` group; the act parts
// (`screen-lit`, `puzzle-lit`) are groups hidden at rest. Hooks only wrap coloured shapes.
import { Fragment } from "react";
import { ProofBotShape } from "@/components/home/proofs/ProofBotShape";
import { ProofBotSolid } from "@/components/home/proofs/ProofBotSolid";
import { proofBotProps, type ProofProp } from "@/lib/proofBotProps";
import type { ProofBotDetail } from "@/lib/proofBotShape";
import { proofBotFill } from "@/lib/proofBotShades";
import type { ProofBotIds } from "@/lib/proofs";

type ProofBotPropProps = {
  readonly prop: ProofProp;
  readonly ids: ProofBotIds;
};

function Detail({ detail }: { readonly detail: ProofBotDetail }) {
  const shape = (
    <ProofBotShape geometry={detail.geometry} rotation={detail.rotation} style={{ fill: proofBotFill(detail.fill) }} />
  );
  return detail.hook ? (
    <g data-bot={detail.hook} className="opacity-0">
      {shape}
    </g>
  ) : (
    shape
  );
}

export function ProofBotProp({ prop, ids }: ProofBotPropProps) {
  return (
    <g data-bot="prop">
      {proofBotProps[prop].pieces.map((piece, index) => {
        const drawn = (
          <>
            <ProofBotSolid parts={piece.solids} depth="prop" ids={ids} />
            {piece.details.map((detail, detailIndex) => (
              <Detail key={detailIndex} detail={detail} />
            ))}
          </>
        );
        return "hook" in piece ? (
          <g key={index} data-bot={piece.hook}>
            {drawn}
          </g>
        ) : (
          <Fragment key={index}>{drawn}</Fragment>
        );
      })}
    </g>
  );
}
