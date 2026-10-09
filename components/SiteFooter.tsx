// The site footer (ui-spec §9): Rix on the line (§9.4, not on /rix), then the wrapper holding the
// links row and the giant wordmark. The `<footer>` itself carries no classes: Rix stands above the
// hairline, so the inner wrapper draws the hairline and clips as a guard (nothing scrolls sideways)
// without cutting him, his quip or the focus ring. `FooterWordmarkMotion` (client) renders nothing;
// it reveals the wordmark.
import { FooterLinks } from "@/components/FooterLinks";
import { FooterRix } from "@/components/FooterRix";
import { FooterWordmark } from "@/components/FooterWordmark";
import { FooterWordmarkMotion } from "@/components/FooterWordmarkMotion";

export function SiteFooter() {
  return (
    <footer>
      <FooterRix />
      <div className="overflow-hidden border-t border-line pt-10">
        <FooterLinks />
        <FooterWordmark />
        <FooterWordmarkMotion />
      </div>
    </footer>
  );
}
