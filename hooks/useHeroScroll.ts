// The hero's scroll motion (ui-spec §2.5, Motion), full motion only. Scrubbed to the hero leaving
// the viewport: each `hero-text` wrapper moves down at 0.35× the scroll (so it trails the page)
// and fades out by the time the page has scrolled 75% of the viewport height; the portrait's inner
// box moves at 0.15× the scroll and grows to 1.06. The M sliding off the shoulder is intended.
// Under reduced motion none of it runs: the text stays put and fully visible, the portrait still.
// The fade is plain `opacity`, so the side line, tag and buttons stay in the accessibility tree
// and the tab order; tabbing to a hero button scrolls the hero back into view, and the scrub
// brings the button back with it. Never touches the stage or the h1.
import type { RefObject } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { animTargets, ease, motionQuery } from "@/lib/motion";

const TEXT_RATE = 0.35;
const TEXT_FADE_BY = 0.75; // of the viewport height
const PORTRAIT_RATE = 0.15;
const PORTRAIT_SCALE = 1.06;

export function useHeroScroll(section: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = section.current;
      if (!root) return;
      const texts = animTargets(root, "hero-text");
      const portrait = animTargets(root, "hero-portrait");

      const mm = gsap.matchMedia();

      mm.add(motionQuery.full, () => {
        // From the hero's top at the viewport top to its bottom there: the scroll distance is the
        // hero's height, so moving by rate × height is moving at rate × the scroll.
        gsap
          .timeline({
            defaults: { ease: ease.scrub },
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          })
          .to(texts, { y: () => root.offsetHeight * TEXT_RATE }, 0)
          .to(portrait, { y: () => root.offsetHeight * PORTRAIT_RATE, scale: PORTRAIT_SCALE }, 0);

        gsap.to(texts, {
          opacity: 0,
          ease: ease.scrub,
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${window.innerHeight * TEXT_FADE_BY}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: section },
  );
}
