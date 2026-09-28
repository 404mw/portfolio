// The relay job (ui-spec §5.7, §5.9): the cream sheet the bots pass along, 16px wide below `lg`
// (down the bot column) and 24px from `lg` (along the ground line, leaving right after bot 4).
// Drawn finished (static = final state) except the glow flash, and hidden at rest; motion sets the
// blank state before each run. Its anchor is the bottom centre (negative margins), so motion owns
// `transform` alone. Decorative: `aria-hidden`, never focusable.
import { jobBase, jobParts } from "@/lib/processJob";

export function ProcessJob() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-anim="process-relay"
      viewBox="0 -5 24 29"
      className="absolute left-0 top-0 -ml-2 -mt-4.75 h-4.75 w-4 overflow-visible opacity-0 lg:-ml-3 lg:-mt-7.25 lg:h-7.25 lg:w-6"
    >
      <path data-job="base" d={jobBase} className="fill-cream" />
      {jobParts.rules.map((d) => (
        <path key={d} data-job="rule" d={d} className="fill-ink" />
      ))}
      <path data-job="stamp" d={jobParts.stamp} className="fill-accent" />
      <path data-job="band" d={jobParts.band} className="fill-accent" />
      <path data-job="step" d={jobParts.step} className="fill-accent" />
      <path data-job="tick" d={jobParts.tick} className="fill-ink" />
      <path data-job="fold" d={jobParts.fold} className="fill-cream-muted" />
      <path
        data-job="glow"
        d={jobParts.glow}
        strokeWidth={1.5}
        className="fill-none stroke-accent opacity-0"
      />
    </svg>
  );
}
