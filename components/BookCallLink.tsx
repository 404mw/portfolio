// The one Book a call link (Cal.com, new tab). `data-track="book-call"` makes it the single
// place Book a call clicks are counted (constitution §11). Variants: `nav` (the nav pill) and
// `hero` (the hero pill).
import { ExternalLink } from "@/components/ExternalLink";
import { links, nav } from "@/content/shared";
import { pillPrimary } from "@/lib/styles";

// `!` so the nav size wins over the pill's default size, whatever the CSS order.
const variantClasses = {
  nav: `${pillPrimary} min-h-11! px-5! text-small!`,
  hero: `${pillPrimary} w-full md:w-auto`,
} as const;

type BookCallLinkProps = { readonly variant: keyof typeof variantClasses };

export function BookCallLink({ variant }: BookCallLinkProps) {
  return (
    <ExternalLink href={links.bookCall} data-track="book-call" className={variantClasses[variant]}>
      {nav.bookCall}
    </ExternalLink>
  );
}
