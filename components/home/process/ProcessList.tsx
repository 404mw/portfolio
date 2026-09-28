// The four process steps (ui-spec §5.2): the ground line the bots stand on (from `lg`), then
// the relay's lit segment clipped to the line's box (hidden at rest; before the list, so each
// chevron's mask still covers it), then the ordered list. Rows below `lg`, four across from `lg`.
import { ProcessStep } from "@/components/home/process/ProcessStep";
import { process } from "@/content/home";
import { listNumber } from "@/lib/listNumber";
import { stepBots } from "@/lib/processBots";

export function ProcessList() {
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
      <ol className="grid lg:grid-cols-4 lg:gap-x-8">
        {process.steps.map((step, index) => (
          <ProcessStep
            key={step.title}
            role={stepBots[index].role}
            pose={stepBots[index].pose}
            hasNext={index < process.steps.length - 1}
            label={`${process.stepLabel} ${listNumber(index)}`}
            title={step.title}
            line={step.line}
          />
        ))}
      </ol>
    </div>
  );
}
