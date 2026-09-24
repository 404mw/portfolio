// The site footer (ui-spec §9): the links row, then the giant wordmark. The footer clips as a
// guard so nothing scrolls sideways.
import { FooterLinks } from "@/components/FooterLinks";
import { FooterWordmark } from "@/components/FooterWordmark";

export function SiteFooter() {
  return (
    <footer className="overflow-hidden border-t border-line pt-10">
      <FooterLinks />
      <FooterWordmark />
    </footer>
  );
}
