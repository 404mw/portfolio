"use client";

// "Next project" at the foot of a takeover (ui-spec §7.3 part 7). With JS it replaces the hash,
// so Back always closes the takeover rather than stepping through projects
// (lib/takeoverLinks.ts); without JS it's a plain hash link.
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { proofs } from "@/content/home";
import { condensed, focusRingOnCream, metaLabelOnCream } from "@/lib/styles";
import { replaceTakeoverHash } from "@/lib/takeoverLinks";

type TakeoverNextLinkProps = {
  readonly href: `#${string}`;
  readonly title: string;
};

export function TakeoverNextLink({ href, title }: TakeoverNextLinkProps) {
  return (
    <a
      href={href}
      onClick={replaceTakeoverHash}
      className={`group flex flex-col gap-3 border-t border-ink/15 pt-12 pb-16 ${focusRingOnCream}`}
    >
      <span className={`inline-flex items-center gap-2 uppercase ${metaLabelOnCream}`}>
        {proofs.takeover.next}
        <ArrowRightIcon className="size-3.5" />
      </span>
      <span
        className={`font-display text-heading leading-[0.95] font-semibold tracking-[-0.04em] group-hover:text-cream-muted ${condensed}`}
      >
        {title}
      </span>
    </a>
  );
}
