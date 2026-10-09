"use client";
// Process' flow (ui-spec §5.1): the About pick's flow, five or six steps, `default` with no pick
// and in the server markup. The "Shown for" tag and the sample-job caption, then the body, keyed
// by set so a change remounts it inside the persistent wrapper (`data-set`, `data-count`,
// `data-loops`): the steps (step 3 holding the hand-off to a person, step 4 the fix loop back from
// step 5), the return to step 2, and the relay's layer. From `lg` the 96px gap keeps the fix and
// hand-off labels, above the row, clear of the caption. A flow with no loops (§5.3b) draws neither
// loop nor the hand-off and keeps the 48px gap. The body is
// `isolate`, so the relay layer's `z-1` stays inside it, below the loop label's `lg:z-10`. The
// swap fades (`useSwapFade`, ui-spec §0.5): the caption and the body fade out, the flow changes,
// and they fade back in; the tag stays as it is. Without JavaScript the tag hides.
import { useRef } from "react";
import { ProcessList } from "@/components/home/process/ProcessList";
import { ProcessRelay } from "@/components/home/process/ProcessRelay";
import { ProcessReturn } from "@/components/home/process/ProcessReturn";
import { ShownForTag } from "@/components/home/pick/ShownForTag";
import { process } from "@/content/home";
import { useShownSet } from "@/hooks/useShownSet";
import { useSwapFade } from "@/hooks/useSwapFade";
import { animTargets } from "@/lib/motion";
import { processEmblem } from "@/lib/processEmblems";
import { flowLoops, flowSteps } from "@/lib/processFlows";
import { flowLayouts } from "@/lib/processLayout";
import { sectionIds } from "@/lib/routes";
import { metaLabel } from "@/lib/styles";

/** What fades across a set swap: the caption and the keyed body, the flow's last child. */
const swapWrappers = (flow: HTMLElement) => [
  ...animTargets(flow, "process-caption"),
  flow.lastElementChild,
];

export function ProcessFlow() {
  const set = useShownSet();
  const root = useRef<HTMLDivElement>(null);
  useSwapFade(root, swapWrappers);
  const flow = process.flows[set];
  const steps = flowSteps(set);
  const layout = flowLayouts[flow.steps.length];
  const emblem = processEmblem(set);
  const loops = flowLoops(set);
  return (
    <div
      ref={root}
      data-anim="process-flow"
      data-set={set}
      data-count={steps.length}
      data-loops={loops ? "on" : "off"}
      className={`flex flex-col gap-8 ${loops ? "lg:gap-24" : "lg:gap-12"}`}
    >
      <div className="flex flex-col gap-3">
        <ShownForTag sectionId={sectionIds.process} />
        <p data-anim="process-caption" className={metaLabel}>
          {flow.caption}
        </p>
      </div>
      <div key={set} className="relative isolate flex max-w-2xl flex-col lg:max-w-none lg:gap-10">
        <ProcessList
          steps={steps}
          emblem={emblem}
          layout={layout}
          stepLabel={process.stepLabel}
          fixLabel={loops?.fixLabel}
          handoffLabel={loops?.handoffLabel}
        />
        {loops && <ProcessReturn layout={layout} loopLabel={loops.loopLabel} />}
        <ProcessRelay emblem={emblem} />
      </div>
    </div>
  );
}
