// One process step (ui-spec §5.2): its bot (holding the job on step 1), the ledge it stands on
// (below `lg`, ProcessLedge, §5.9), the chevron to the next step (from `lg`, not on the last
// step), then the step label, title and line. A row below `lg`, a column from `lg`. The `<li>` is
// `relative` at every width (no z-index) so the ledge, the chevron, step 3's hand-off and step 4's
// fix loop are placed against it. Nothing here is interactive.
import type { ReactNode } from "react";
import { ProcessBot } from "@/components/home/process/ProcessBot";
import { ProcessLedge } from "@/components/home/process/ProcessLedge";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
import type { BotPose, BotRole } from "@/lib/processBots";
import { metaLabel } from "@/lib/styles";

type ProcessStepProps = {
  /** Its index, for `data-step`. */
  readonly index: number;
  readonly role: BotRole;
  readonly pose: BotPose;
  /** The chevron's placement classes (lib/processLayout.ts); absent on the last step. */
  readonly chevron?: string;
  readonly label: string;
  readonly title: string;
  readonly line: string;
  /** What the bot holds (step 1: the flow's emblem). */
  readonly children?: ReactNode;
  /** The `<li>`'s last child, after the text (step 3: the hand-off; step 4: the fix loop). */
  readonly after?: ReactNode;
};

export function ProcessStep({
  index,
  role,
  pose,
  chevron,
  label,
  title,
  line,
  children,
  after,
}: ProcessStepProps) {
  return (
    <li
      data-step={index}
      className="relative grid grid-cols-[5.5rem_minmax(0,1fr)] items-start gap-x-4.5 border-t border-line py-6 lg:flex lg:min-w-0 lg:flex-col lg:border-t-0 lg:py-0"
    >
      <ProcessBot role={role} pose={pose}>
        {children}
      </ProcessBot>
      <ProcessLedge />
      {chevron !== undefined && (
        <span
          aria-hidden="true"
          data-anim="process-chevron"
          className={`absolute top-27 hidden h-0.5 w-4 items-center justify-center bg-bg lg:flex ${chevron}`}
        >
          <ChevronRightIcon className="size-6 shrink-0 text-accent" />
        </span>
      )}
      <div data-anim="reveal" className="flex flex-col gap-2 lg:gap-2.5 lg:pt-7.5">
        <p className={`${metaLabel} uppercase tracking-[0.06em]`}>{label}</p>
        <h3
          className={`font-display text-step leading-[1.15] text-balance wrap-break-word text-text`}
        >
          {title}
        </h3>
        <p className="text-body-lg leading-normal text-muted lg:max-w-65">{line}</p>
      </div>
      {after}
    </li>
  );
}
