// One Contact side-link row (ui-spec §8.1): the label left, its kind right. New-tab rows go
// through `ExternalLink` and show an up-right arrow; `whatsapp` rows go through `WhatsAppLink`
// (a new tab too), whose `href` follows an About pick. `track` spreads tracking props from
// `lib/track.ts`, so the Book a call row is counted the same way as `BookCallLink`.
import { ExternalLink } from "@/components/ExternalLink";
import { ArrowUpRightIcon } from "@/components/icons/ArrowUpRightIcon";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { focusRing } from "@/lib/styles";
import type { TrackProps } from "@/lib/track";

const rowClasses = `group flex min-h-12 items-center justify-between gap-4 border-b border-line text-body text-text active:bg-band ${focusRing}`;

type ContactRowProps = {
  readonly label: string;
  readonly kind: string;
  readonly track?: TrackProps;
} & (
  | { readonly href: string; readonly newTab?: boolean; readonly whatsapp?: false }
  | { readonly whatsapp: true; readonly href?: never; readonly newTab?: never }
);

export function ContactRow({ href, label, kind, newTab = false, whatsapp, track }: ContactRowProps) {
  const inner = (
    <>
      <span className="min-w-0 break-words group-hover:text-accent">{label}</span>
      <span className="flex shrink-0 items-center gap-1.5 text-muted">
        {kind}
        {(newTab || whatsapp) && <ArrowUpRightIcon className="size-4" />}
      </span>
    </>
  );

  if (whatsapp) {
    return (
      <WhatsAppLink {...track} className={rowClasses}>
        {inner}
      </WhatsAppLink>
    );
  }

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
