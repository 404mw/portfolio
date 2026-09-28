// The phone menu panel's entrance (ui-spec §1.5, Motion), on the `[data-anim="nav-panel"]` inside
// the menu's <details>: each time the menu opens, the panel fades in and drops 8px into place.
// Reduced motion: the fade only. Closing stays instant (the native <details> hides it).
//
// It watches the <details>' `open` attribute (a MutationObserver, which runs before the next
// paint, unlike the queued `toggle` event), so it follows every open, whatever opened it.
// Nothing is hidden ahead of time: the panel only starts from transparent once it's opening, so
// without JS the menu opens as built. Inline styles are cleared when the entrance ends, when the
// menu closes mid-entrance, and on unmount.
import type { RefObject } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { animTargets, duration, ease, motionQuery } from "@/lib/motion";

/** How far above its place the panel starts (px). */
const DROP = -8;

export function useNavPanelMotion(details: RefObject<HTMLDetailsElement | null>) {
  useGSAP(
    () => {
      const el = details.current;
      const [panel] = el ? animTargets(el, "nav-panel") : [];
      if (!el || !panel) return;

      const mm = gsap.matchMedia();

      mm.add({ full: motionQuery.full, reduced: motionQuery.reduced }, (context) => {
        const reduced = Boolean(context.conditions?.reduced);
        const settle = () => {
          gsap.killTweensOf(panel);
          gsap.set(panel, { clearProps: "transform,opacity" });
        };

        // Each entrance stays outside the GSAP context (it would keep one per open); `settle`
        // kills it, and the cleanup settles the panel.
        const onToggle = () => {
          settle();
          if (!el.open) return;
          gsap.fromTo(
            panel,
            { opacity: 0, ...(reduced ? {} : { y: DROP }) },
            {
              opacity: 1,
              ...(reduced ? {} : { y: 0 }),
              duration: duration.fade,
              ease: ease.out,
              clearProps: "transform,opacity",
            },
          );
        };

        const observer = new MutationObserver(onToggle);
        observer.observe(el, { attributes: true, attributeFilter: ["open"] });
        return () => {
          observer.disconnect();
          context.ignore(settle);
        };
      });

      return () => mm.revert();
    },
    { scope: details },
  );
}
