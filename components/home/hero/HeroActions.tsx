// The hero's bottom row: the mono tag, then See proofs and Book a call (ui-spec §2.1.2, row 3).
// DOM order is the visual order. The outer `hero-text` box sits above the portrait (`z-20`), so
// the photo never covers a button or its focus ring; the network keeps its nodes off the text.
import { BookCallLink } from "@/components/BookCallLink";
import { hero } from "@/content/home";
import { routes } from "@/lib/routes";
import { monoLabel, pillOutline } from "@/lib/styles";

export function HeroActions() {
  return (
    <div data-anim="hero-text" className="relative z-20">
      <div
        data-anim="hero-fade"
        className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-end md:justify-between md:gap-5"
      >
        <p data-network-avoid="text" className={monoLabel}>
          {hero.tag}
        </p>
        <div data-network-avoid="text" className="flex flex-col gap-2.5 md:flex-row">
          <a href={routes.proofs} className={`${pillOutline} w-full md:w-auto`}>
            {hero.seeProofs}
          </a>
          <BookCallLink variant="hero" />
        </div>
      </div>
    </div>
  );
}
