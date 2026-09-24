// One Contact side-link row (ui-spec §8.1): the label left, its kind right. New-tab rows go
// through `ExternalLink` and show an up-right arrow. `track` spreads tracking props from
// `lib/track.ts`, so the Book a call row is counted the same way as `BookCallLink`.
import { ExternalLink } from "@/components/ExternalLink";
import { ArrowUpRightIcon } from "@/components/icons/ArrowUpRightIcon";
import { focusRing } from "@/lib/styles";
import type { TrackProps } from "@/lib/track";

const rowClasses = `group flex min-h-12 items-center justify-between gap-4 border-b border-line text-body text-text active:bg-band ${focusRing}`;

type ContactRowProps = {
  readonly href: string;
  readonly label: string;
  readonly kind: string;
  readonly newTab?: boolean;
  readonly track?: TrackProps;
};

export function ContactRow({ href, label, kind, newTab = false, track }: ContactRowProps) {
  const inner = (
    <>
      <span className="min-w-0 break-words group-hover:text-accent">{label}</span>
      <span className="flex shrink-0 items-center gap-1.5 text-muted">
        {kind}
        {newTab && <ArrowUpRightIcon className="size-4" />}
      </span>
    </>
  );

  return newTab ? (
    <ExternalLink href={href} {...track} className={rowClasses}>
      {inner}
    </ExternalLink>
  ) : (
    <a href={href} {...track} className={rowClasses}>
      {inner}
    </a>
  );
}
