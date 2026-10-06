// The crew relay's layer (ui-spec §5.7): above the bots and below the loop label (`z-1` inside the
// `isolate` body; the label is `lg:z-10`), holding the three ghosts that trail the job, the job
// (the flow's emblem, or the built sheet in `default`) and the lesson. The relay's motion
// (hooks/useProcessBots.ts) shows and moves them; the markup adds no element for it. Decorative:
// everything is `aria-hidden` and starts at `opacity-0`, which is also the correct state without
// JavaScript and under reduced motion.
import { ProcessJob } from "@/components/home/process/ProcessJob";
import { ProcessLesson } from "@/components/home/process/ProcessLesson";
import type { FlowEmblem } from "@/lib/processEmblems";
import { jobBase } from "@/lib/processJob";
import { isBasePart } from "@/lib/rixProps";

const ghosts = [1, 2, 3] as const;

/** One ghost: the job's silhouette (the sheet, or the emblem's base parts). */
function Ghost({ emblem }: { readonly emblem: FlowEmblem }) {
  if (emblem.name === "job") {
    return (
      <svg
        aria-hidden="true"
        focusable="false"
        data-anim="process-relay-ghost"
        viewBox="0 0 24 24"
        className="absolute left-0 top-0 -ml-2 -mt-4 size-4 opacity-0 lg:-ml-3 lg:-mt-6 lg:size-6"
      >
        <path d={jobBase} className="fill-cream" />
      </svg>
    );
  }
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-anim="process-relay-ghost"
      viewBox="104 21 28 31"
      className="absolute left-0 top-0 -ml-2.25 -mt-5 h-5 w-4.5 overflow-visible opacity-0 lg:-ml-3.5 lg:-mt-7.75 lg:h-7.75 lg:w-7"
    >
      {emblem.parts.filter(isBasePart).map((part) => (
        <path key={part.d} d={part.d} fillRule="evenodd" className="fill-cream" />
      ))}
    </svg>
  );
}

type ProcessRelayProps = { readonly emblem: FlowEmblem };

export function ProcessRelay({ emblem }: ProcessRelayProps) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-1">
      {ghosts.map((ghost) => (
        <Ghost key={ghost} emblem={emblem} />
      ))}
      <ProcessJob emblem={emblem} />
      <ProcessLesson />
    </div>
  );
}
