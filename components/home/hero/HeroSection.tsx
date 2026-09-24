// Section 2, Hero: who is this? (ui-spec §2). Three layers: the grid, the portrait, and the
// text on top. `#top` is also what the Nav observes to turn solid once the hero has passed.
import { HeroActions } from "@/components/home/hero/HeroActions";
import { HeroGrid } from "@/components/home/hero/HeroGrid";
import { HeroName } from "@/components/home/hero/HeroName";
import { HeroPortrait } from "@/components/home/hero/HeroPortrait";
import { HeroSideLine } from "@/components/home/hero/HeroSideLine";
import { sectionIds } from "@/lib/routes";
import { container } from "@/lib/styles";

export function HeroSection() {
  return (
    <section
      id={sectionIds.top}
      className="relative isolate h-svh max-h-300 min-h-160 overflow-hidden"
    >
      <HeroGrid />
      <HeroPortrait />
      <div data-anim="hero-text" className="relative z-10 h-full px-gutter">
        <div
          className={`${container} grid h-full grid-rows-[auto_1fr_auto] pt-24 pb-8 md:pt-28 md:pb-10`}
        >
          <HeroSideLine />
          <HeroName />
          <HeroActions />
        </div>
      </div>
    </section>
  );
}
