// One process step: its rail (below `xl`), then the step label, title and line.
// `cellClassName` places it on the ring from `xl`; `alignClassName` aligns its text there.
import { ProcessRail } from "@/components/home/process/ProcessRail";
import { condensed, metaLabel } from "@/lib/styles";

type ProcessStepProps = {
  readonly index: number;
  readonly label: string;
  readonly title: string;
  readonly line: string;
  readonly cellClassName: string;
  readonly alignClassName: string;
};

export function ProcessStep({
  index,
  label,
  title,
  line,
  cellClassName,
  alignClassName,
}: ProcessStepProps) {
  return (
    <li
      className={`relative col-span-2 grid grid-cols-subgrid pb-12 last:pb-0 xl:col-span-1 xl:block xl:pb-0 ${cellClassName}`}
    >
      <ProcessRail index={index} />
      <div data-anim="reveal" className={`flex flex-col gap-2.5 ${alignClassName}`}>
        <p className={`${metaLabel} uppercase`}>{label}</p>
        <h3
          className={`font-display font-semibold text-step leading-[1.05] tracking-tight text-balance text-text ${condensed}`}
        >
          {title}
        </h3>
        <p className="max-w-70 text-body-lg leading-normal text-muted">{line}</p>
      </div>
    </li>
  );
}
