// The four process steps as one list, placed by CSS: a column with a return line below `xl`,
// the four quarter points of the ring from `xl` (ui-spec §5.2, §5.3). One set of steps only.
import { ProcessRing } from "@/components/home/process/ProcessRing";
import { ProcessStep } from "@/components/home/process/ProcessStep";
import { process } from "@/content/home";
import { metaLabel } from "@/lib/styles";

/** Ring placement from `xl`, clockwise from the top: the grid cell, then the text alignment. */
const placements = [
  {
    cell: "xl:col-start-2 xl:row-start-1 xl:self-end",
    align: "xl:text-center xl:items-center",
  },
  {
    cell: "xl:col-start-3 xl:row-start-2 xl:self-center",
    align: "xl:text-left",
  },
  {
    cell: "xl:col-start-2 xl:row-start-3 xl:self-start",
    align: "xl:text-center xl:items-center",
  },
  {
    cell: "xl:col-start-1 xl:row-start-2 xl:self-center",
    align: "xl:text-right xl:items-end",
  },
] as const;

export function ProcessLoop() {
  return (
    <div className="relative max-w-2xl xl:max-w-none">
      <ProcessRing />
      <ol className="grid grid-cols-[3rem_minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_18rem_minmax(0,1fr)] xl:grid-rows-[1fr_18rem_1fr] xl:gap-8 2xl:grid-cols-[minmax(0,1fr)_20rem_minmax(0,1fr)] 2xl:grid-rows-[1fr_20rem_1fr]">
        {process.steps.map((step, index) => (
          <ProcessStep
            key={step.title}
            index={index}
            label={`${process.stepLabel} ${index + 1}`}
            title={step.title}
            line={step.line}
            cellClassName={placements[index].cell}
            alignClassName={placements[index].align}
          />
        ))}
      </ol>
      <p className={`pl-12 pt-4 ${metaLabel} xl:sr-only`}>{process.loopLabel}</p>
    </div>
  );
}
