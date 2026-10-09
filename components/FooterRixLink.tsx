"use client";
// Rix on the footer's line (ui-spec/09-footer.md §9.4): the row above the footer's hairline, with
// the label and Rix as one link to /rix, its only entry. `children` is the server-drawn bot
// (`FooterRix`). On /rix nothing renders: no Rix, no label, no link, no offset. The row takes no
// pointer outside the link. The link's name is the label alone: the bot and the quip are
// `aria-hidden`. The quip shows the current line from the shared quip store (lib/rixQuip.ts, under
// `footerRixQuipKey`): empty on the server and until the motion pass says a line. Motion hooks:
// `footer-rix` (the row), `footer-rix-link` (the link), the bot's and the quip's own.
// `FooterRixMotion` renders nothing; it runs his motion while the row is mounted.
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FooterRixMotion } from "@/components/FooterRixMotion";
import { RixQuip } from "@/components/home/about/RixQuip";
import { footer } from "@/content/shared";
import { useKeyedLine } from "@/hooks/useKeyedLine";
import { rixPath } from "@/lib/publishedRoutes";
import { footerRixQuipKey, rixQuipLine, subscribeRixQuip } from "@/lib/rixQuip";
import { container, focusRing } from "@/lib/styles";

type FooterRixLinkProps = {
  /** The server-drawn bot, filling its box. */
  readonly children: ReactNode;
};

export function FooterRixLink({ children }: FooterRixLinkProps) {
  const pathname = usePathname();
  const line = useKeyedLine(rixQuipLine, subscribeRixQuip, footerRixQuipKey);
  if (pathname === rixPath) return null;
  return (
    <div data-anim="footer-rix" className="pointer-events-none px-gutter lg:-mt-10 xl:-mt-20">
      <div className={`${container} flex justify-end`}>
        <Link
          href={rixPath}
          data-anim="footer-rix-link"
          className={`group/rix pointer-events-auto inline-flex items-end gap-2 rounded-2xl ${focusRing}`}
        >
          <span className="inline-flex min-h-11 items-center whitespace-nowrap text-body text-text underline decoration-line underline-offset-4 group-hover/rix:text-accent group-hover/rix:decoration-accent group-active/rix:text-accent group-active/rix:decoration-accent">
            {footer.rixLink}
          </span>
          <span className="relative block h-22 w-34 shrink-0">
            {children}
            <RixQuip
              line={line}
              placement="bottom-full left-1/2 mb-1 w-max max-w-40 -translate-x-1/2 text-center"
            />
          </span>
        </Link>
      </div>
      <FooterRixMotion />
    </div>
  );
}
