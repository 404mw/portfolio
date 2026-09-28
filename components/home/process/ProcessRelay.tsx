// The crew relay (ui-spec §5.7, relay job): a layer above the bots and below the loop label
// (`z-1` inside the `isolate` body; the label is `lg:z-10`) holding the three ghosts that trail the
// job, the job, which leaves right along the ground line after bot 4, and the lesson, which rides
// the dashed return path after bot 4. The layer exists at every width: below `lg` the job runs down
// the bot column and the lesson rides back up its left edge (ui-spec §5.9), with smaller pieces.
// Decorative: everything is `aria-hidden` and starts at `opacity-0`, which is also the correct
// state without JavaScript.
import { ProcessJob } from "@/components/home/process/ProcessJob";
import { ProcessLesson } from "@/components/home/process/ProcessLesson";
import { jobBase } from "@/lib/processJob";

const ghosts = [1, 2, 3] as const;

export function ProcessRelay() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-1">
      {ghosts.map((ghost) => (
        <svg
          key={ghost}
          aria-hidden="true"
          focusable="false"
          data-anim="process-relay-ghost"
          viewBox="0 0 24 24"
          className="absolute left-0 top-0 -ml-2 -mt-4 size-4 opacity-0 lg:-ml-3 lg:-mt-6 lg:size-6"
        >
          <path d={jobBase} className="fill-cream" />
        </svg>
      ))}
      <ProcessJob />
      <ProcessLesson />
    </div>
  );
}
