// The Book a call pill (Cal.com, new tab). It spreads `bookCallTrackProps` from `lib/track.ts`, the one
// event every Book a call link is counted under (constitution §11); the Contact row uses it too.
// Variants: `nav` (the nav pill) and `hero` (the hero pill).
import { ExternalLink } from "@/components/ExternalLink";
import { links, nav } from "@/content/shared";
import { pillPrimary } from "@/lib/styles";
import { bookCallTrackProps } from "@/lib/track";

// `!` so the nav size wins over the pill's default size, whatever the CSS order.
const variantClasses = {
  nav: `${pillPrimary} min-h-11! px-5! text-small!`,
  hero: `${pillPrimary} w-full md:w-auto`,
} as const;

type BookCallLinkProps = { readonly variant: keyof typeof variantClasses };

export function BookCallLink({ variant }: BookCallLinkProps) {
  return (
    <ExternalLink
      href={links.bookCall}
      {...bookCallTrackProps}
      className={variantClasses[variant]}
    >
      {nav.bookCall}
    </ExternalLink>
  );
}
