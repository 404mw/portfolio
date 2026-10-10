// A prop held in the bots' shared slot, visible at rest, in flat token fills, drawn inside a bot's
// `upper`. Process step 1 (ui-spec §5.6, §5.10): the flow's emblem (the card's, or the plain job
// sheet) in the intake bot's hand, the job, held. The MARWIX-SKILLS showcase diagram
// (ui-spec/07-proofs-spam.md): each step's prop in Rix's hand. Motion hooks: `data-bot="prop"` with
// `data-prop`, and `data-prop-part` on a flourish part (the showcase's `caret`; Process' motion
// never reads it).
import { botFills } from "@/lib/botFills";
import type { FlowEmblem } from "@/lib/processEmblems";

type ProcessEmblemProps = { readonly emblem: FlowEmblem };

export function ProcessEmblem({ emblem }: ProcessEmblemProps) {
  return (
    <g data-bot="prop" data-prop={emblem.name}>
      {emblem.parts.map((part) => (
        <path
          key={part.d}
          d={part.d}
          fillRule="evenodd"
          data-prop-part={part.hook}
          className={botFills[part.colour]}
        />
      ))}
    </g>
  );
}
