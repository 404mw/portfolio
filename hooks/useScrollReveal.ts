// The generic scroll reveal (ui-spec §10), for every `[data-anim="reveal"]` element inside
// `section`: once, when the element's top reaches `reveal.start`, it rises from `reveal.y` px below
// with opacity 0; an optional `data-anim-delay` (ms) holds it back. Reduced motion: the short
// opacity fade only. The starting state is set here, in JS, so without JS (or before this runs)
// the element shows as built. Any section can mount it through its own motion component.
import type { RefObject } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { animTargets, duration, ease, motionQuery, reveal } from "@/lib/motion";

/** An element's `data-anim-delay`, in seconds (0 if unset or not a number). */
function delayOf(element: HTMLElement): number {
  const ms = Number(element.dataset.animDelay);
  return Number.isFinite(ms) && ms > 0 ? ms / 1000 : 0;
}

export function useScrollReveal(section: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = section.current;
      if (!root) return;
      const items = animTargets(root, "reveal");
      if (items.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add({ full: motionQuery.full, reduced: motionQuery.reduced }, (context) => {
        const { reduced } = context.conditions ?? {};
        items.forEach((item) => {
          gsap.from(item, {
            opacity: 0,
            ...(reduced ? {} : { y: reveal.y }),
            duration: reduced ? duration.fade : duration.enter,
            ease: ease.out,
            delay: delayOf(item),
            scrollTrigger: { trigger: item, start: reveal.start, once: true },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: section },
  );
}
