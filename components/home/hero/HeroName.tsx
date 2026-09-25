// The hero name, the page's one h1 (ui-spec §2.1.2). Each line sits in a clipped wrapper so the
// motion pass can raise it from below. MUHAMMAD's wrapper paints behind the portrait (`z-0`) and
// WAQAS's in front (`z-20`); both lines sit flush right at every width. The h1 itself never gets a z-index, transform or opacity, or both
// lines would flatten onto one layer (§2.1.1). The `aria-label`, built from the two content keys,
// keeps the accessible name as two words even if the text space between the flex items is
// dropped; uppercase comes from CSS.
import { hero } from "@/content/home";
import { condensed } from "@/lib/styles";

const lineWrapper = "relative block overflow-hidden pb-[0.12em]";

export function HeroName() {
  return (
    <h1
      aria-label={`${hero.firstName} ${hero.lastName}`}
      className={`flex flex-col font-display text-hero leading-[0.82] font-bold tracking-[-0.015em] text-accent uppercase ${condensed}`}
    >
      <span data-anim="hero-text" className={`${lineWrapper} z-0 text-right`}>
        <span data-anim="hero-line" className="block">
          {hero.firstName}
        </span>
      </span>{" "}
      <span data-anim="hero-text" className={`${lineWrapper} z-20 text-right`}>
        <span data-anim="hero-line" className="block">
          {hero.lastName}
        </span>
      </span>
    </h1>
  );
}
