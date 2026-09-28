// The site footer (ui-spec §9): the links row, then the giant wordmark. The footer clips as a
// guard so nothing scrolls sideways. `FooterWordmarkMotion` (client) renders nothing; it reveals
// the wordmark.
import { FooterLinks } from "@/components/FooterLinks";
import { FooterWordmark } from "@/components/FooterWordmark";
import { FooterWordmarkMotion } from "@/components/FooterWordmarkMotion";

export function SiteFooter() {
  return (
    <footer className="overflow-hidden border-t border-line pt-10">
      <FooterLinks />
      <FooterWordmark />
      <FooterWordmarkMotion />
    </footer>
  );
}
