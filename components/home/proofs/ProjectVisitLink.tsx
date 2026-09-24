// A takeover's Visit button (ui-spec §7.3 part 6): an ink pill opening the project in a new tab.
import { ArrowUpRightIcon } from "@/components/icons/ArrowUpRightIcon";
import { ExternalLink } from "@/components/ExternalLink";
import { pillInk } from "@/lib/styles";

type ProjectVisitLinkProps = {
  readonly href: string;
  readonly label: string;
};

export function ProjectVisitLink({ href, label }: ProjectVisitLinkProps) {
  return (
    <ExternalLink
      href={href}
      className={`${pillInk} min-h-12 gap-2 self-start px-6 text-body font-semibold`}
    >
      {label}
      <ArrowUpRightIcon className="size-4" />
    </ExternalLink>
  );
}
