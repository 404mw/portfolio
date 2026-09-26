// The four process steps (ui-spec §5.2): the ground line the bots stand on (from `lg`), then
// the ordered list. Rows below `lg`, four across from `lg`.
import { ProcessStep } from "@/components/home/process/ProcessStep";
import { process } from "@/content/home";
import { listNumber } from "@/lib/listNumber";
import { stepBots } from "@/lib/processBots";

export function ProcessList() {
  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute inset-x-0 top-27 hidden h-0.5 bg-line lg:block" />
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
