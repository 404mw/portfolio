// The brief builder's Send (ui-spec §8.2): a link, not a submit button. It opens the reader's
// email app with the brief filled in; nothing is posted or stored.
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { focusRing } from "@/lib/styles";

type SendBriefLinkProps = {
  readonly href: string;
  readonly label: string;
  readonly hint: string;
};

export function SendBriefLink({ href, label, hint }: SendBriefLinkProps) {
  return (
    <a
      href={href}
      className={`flex items-center justify-between gap-4 rounded-full bg-accent py-2 pr-2 pl-7 text-lead font-semibold text-on-accent hover:bg-text active:bg-muted ${focusRing}`}
    >
      <span>
        {label}
        <span className="sr-only"> {hint}</span>
      </span>
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-bg text-accent">
        <ArrowRightIcon />
      </span>
    </a>
  );
}
