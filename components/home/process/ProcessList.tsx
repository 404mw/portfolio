// A flow's steps (ui-spec §5.2): the ground line the bots stand on (from `lg`), then the relay's
// lit segment clipped to the line's box (hidden at rest; before the list, so each chevron's mask
// still covers it), then the ordered list. The list is `relative` with no z-index, so it doesn't
// start a stacking context. Rows below `lg`, each bot on its own ledge (ProcessStep, §5.9); five or
// six across from `lg`. Step 1's bot holds the flow's emblem; step 3 ends with the fix loop back
// from step 4 (ProcessFixReturn), in a flow that has one.
import { ProcessEmblem } from "@/components/home/process/ProcessEmblem";
import { ProcessFixReturn } from "@/components/home/process/ProcessFixReturn";
import { ProcessStep } from "@/components/home/process/ProcessStep";
import { listNumber } from "@/lib/listNumber";
import type { FlowEmblem } from "@/lib/processEmblems";
import { FIX_STEP, type FlowStep } from "@/lib/processFlows";
import type { FlowLayout } from "@/lib/processLayout";

type ProcessListProps = {
  readonly steps: readonly FlowStep[];
  readonly emblem: FlowEmblem;
  readonly layout: FlowLayout;
  /** "Step", before each two-digit number. */
  readonly stepLabel: string;
  /** The fix loop's label, at step `FIX_STEP`. A flow with no loops has none (ui-spec §5.3b). */
  readonly fixLabel?: string;
};

export function ProcessList({ steps, emblem, layout, stepLabel, fixLabel }: ProcessListProps) {
  return (
    <div data-anim="process-list" className="relative">
      <div
        aria-hidden="true"
        data-anim="process-ground"
        className="absolute inset-x-0 top-27 hidden h-0.5 bg-line lg:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-27 hidden h-0.5 overflow-hidden lg:block"
      >
        <span
          data-anim="process-ground-lit"
          className="absolute left-0 top-0 h-0.5 w-32 bg-linear-to-r from-accent/0 to-accent opacity-0"
        />
      </div>
      <ol className={`relative grid ${layout.grid}`}>
        {steps.map((step, index) => (
          <ProcessStep
            key={step.title}
            index={index}
            role={step.role}
            pose={step.pose}
            chevron={index < steps.length - 1 ? layout.chevron : undefined}
            label={`${stepLabel} ${listNumber(index)}`}
            title={step.title}
            line={step.line}
            after={
              fixLabel !== undefined && index === FIX_STEP ? (
                <ProcessFixReturn fixBox={layout.fixBox} label={fixLabel} />
              ) : undefined
            }
          >
            {index === 0 && <ProcessEmblem emblem={emblem} />}
          </ProcessStep>
        ))}
      </ol>
    </div>
  );
}
