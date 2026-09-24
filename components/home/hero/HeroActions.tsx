// The hero's bottom row: the mono tag, then See proofs and Book a call (ui-spec §2.1, row 3).
// DOM order is the visual order.
import { BookCallLink } from "@/components/BookCallLink";
import { hero } from "@/content/home";
import { routes } from "@/lib/routes";
import { monoLabel, pillOutline } from "@/lib/styles";

export function HeroActions() {
  return (
    <div
      data-anim="hero-fade"
      className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-end md:justify-between md:gap-5"
    >
      <p className={monoLabel}>{hero.tag}</p>
      <div className="flex flex-col gap-2.5 md:flex-row">
        <a href={routes.proofs} className={`${pillOutline} w-full md:w-auto`}>
          {hero.seeProofs}
        </a>
        <BookCallLink variant="hero" />
      </div>
    </div>
  );
}
