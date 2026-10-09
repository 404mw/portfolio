// The relay job (ui-spec §5.7): what the bots pass along, hidden at rest (the relay's motion shows
// it). In `default` it's the built cream sheet, drawn finished with one mark per bot, 16px wide
// below `wide` and 24px from `wide`; in a card's flow it's that card's emblem (`data-emblem`), its base
// parts `data-job="base"`, its marks `data-job="mark"`, and the base outline again as the glow.
// Its anchor is the bottom centre (negative margins), so motion owns `transform` alone.
// Decorative: `aria-hidden`, never focusable.
import { botFills } from "@/lib/botFills";
import type { FlowEmblem } from "@/lib/processEmblems";
import { jobBase, jobParts } from "@/lib/processJob";
import { isBasePart } from "@/lib/rixProps";

function JobSheet() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-anim="process-relay"
      viewBox="0 -5 24 29"
      className="absolute left-0 top-0 -ml-2 -mt-4.75 h-4.75 w-4 overflow-visible opacity-0 wide:-ml-3 wide:-mt-7.25 wide:h-7.25 wide:w-6"
    >
      <path data-job="base" d={jobBase} className="fill-cream" />
      {jobParts.rules.map((d) => (
        <path key={d} data-job="rule" d={d} className="fill-ink" />
      ))}
      <path data-job="stamp" d={jobParts.stamp} className="fill-accent" />
      <path data-job="band" d={jobParts.band} className="fill-accent" />
      <path data-job="step" d={jobParts.step} className="fill-accent" />
      <path data-job="tick" d={jobParts.tick} className="fill-ink" />
      <path data-job="fold" d={jobParts.fold} className="fill-cream-muted" />
      <path
        data-job="glow"
        d={jobParts.glow}
        strokeWidth={1.5}
        className="fill-none stroke-accent opacity-0"
      />
    </svg>
  );
}

type ProcessJobProps = { readonly emblem: FlowEmblem };

export function ProcessJob({ emblem }: ProcessJobProps) {
  if (emblem.name === "job") return <JobSheet />;
  const base = emblem.parts.filter(isBasePart);
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-anim="process-relay"
      data-emblem={emblem.name}
      viewBox="104 21 28 31"
      className="absolute left-0 top-0 -ml-2.25 -mt-5 h-5 w-4.5 overflow-visible opacity-0 wide:-ml-3.5 wide:-mt-7.75 wide:h-7.75 wide:w-7"
    >
      {emblem.parts.map((part) => (
        <path
          key={part.d}
          data-job={isBasePart(part) ? "base" : "mark"}
          d={part.d}
          fillRule="evenodd"
          className={botFills[part.colour]}
        />
      ))}
      {base.map((part) => (
        <path
          key={`glow-${part.d}`}
          data-job="glow"
          d={part.d}
          strokeWidth={1.5}
          className="fill-none stroke-accent opacity-0"
        />
      ))}
    </svg>
  );
}
