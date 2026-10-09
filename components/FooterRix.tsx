// Rix on the footer's line (ui-spec/09-footer.md §9.4): hands the server-drawn host bot (static
// idle pose, every `data-bot` hook, `aria-hidden`) to `FooterRixLink`, the client link that places
// him. A light Rix: no props and no emote glyphs.
import { FooterRixLink } from "@/components/FooterRixLink";
import { ProcessBot } from "@/components/home/process/ProcessBot";

export function FooterRix() {
  return (
    <FooterRixLink>
      <ProcessBot role="host" pose="idle" className="block size-full" />
    </FooterRixLink>
  );
}
