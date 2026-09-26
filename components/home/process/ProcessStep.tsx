// One process step (ui-spec §5.2): its bot, the chevron to the next step (from `lg`, not on the
// last step), then the step label, title and line. A row below `lg`, a column from `lg`.
import { ProcessBot } from "@/components/home/process/ProcessBot";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
import type { BotFrame, BotRole } from "@/lib/processBots";
import { condensed, metaLabel } from "@/lib/styles";

type ProcessStepProps = {
  readonly role: BotRole;
  readonly pose: BotFrame;
  readonly hasNext: boolean;
  readonly label: string;
  readonly title: string;
  readonly line: string;
};

export function ProcessStep({ role, pose, hasNext, label, title, line }: ProcessStepProps) {
  return (
    <li className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-start gap-x-4.5 border-t border-line py-6 lg:relative lg:flex lg:flex-col lg:border-t-0 lg:py-0">
      <ProcessBot role={role} pose={pose} />
      {hasNext && (
        <span
          aria-hidden="true"
          className="absolute top-27 -right-6 hidden h-0.5 w-4 items-center justify-center bg-bg lg:flex"
        >
          <ChevronRightIcon className="size-6 shrink-0 text-accent" />
        </span>
      )}
      <div data-anim="reveal" className="flex flex-col gap-2 lg:gap-2.5 lg:pt-7.5">
        <p className={`${metaLabel} uppercase tracking-[0.06em]`}>{label}</p>
        <h3
          className={`font-display font-semibold text-step leading-[1.05] tracking-[-0.02em] text-balance text-text ${condensed}`}
        >
          {title}
        </h3>
        <p className="text-body-lg leading-normal text-muted lg:max-w-65">{line}</p>
      </div>
    </li>
  );
}
