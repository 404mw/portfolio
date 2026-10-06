// The job in step 1's hand (ui-spec §5.6, §5.10): the flow's emblem (the card's, or the plain job
// sheet), drawn inside the intake bot's `upper` in the prop slot, in flat token fills. Visible at
// rest: it is the job, held. Motion hook: `data-bot="prop"` with `data-prop`.
import { botFills } from "@/lib/botFills";
import type { FlowEmblem } from "@/lib/processEmblems";

type ProcessEmblemProps = { readonly emblem: FlowEmblem };

export function ProcessEmblem({ emblem }: ProcessEmblemProps) {
  return (
    <g data-bot="prop" data-prop={emblem.name}>
      {emblem.parts.map((part) => (
        <path key={part.d} d={part.d} fillRule="evenodd" className={botFills[part.colour]} />
      ))}
    </g>
  );
}
