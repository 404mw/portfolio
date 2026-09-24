// The hero portrait, centred at the bottom, with its bottom edge fading into the page
// (ui-spec §2.1, layer 2). The outer box only positions; the inner `hero-portrait` box is
// what the motion pass animates.
import { SiteImage } from "@/components/SiteImage";
import { hero } from "@/content/home";

export function HeroPortrait() {
  return (
    <div className="absolute inset-x-0 bottom-0 mx-auto h-3/5 w-5/6 max-w-md md:h-[88%] md:w-[min(38.75rem,58vw)] md:max-w-none">
      <div data-anim="hero-portrait" className="relative size-full">
        <SiteImage
          name="portrait"
          alt={hero.portraitAlt}
          sizes="(min-width: 768px) min(620px, 58vw), 83vw"
          position="top"
          priority
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[38%] bg-linear-to-t from-bg to-transparent"
        />
      </div>
    </div>
  );
}
