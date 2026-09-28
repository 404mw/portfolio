// The nav band's fade (ui-spec §1.5, Motion): when `solid` turns on (the hero has scrolled under
// the header), the band's background and bottom line fade in from transparent instead of
// snapping. Kept under reduced motion (it's a fade, nothing moves). Turning solid off stays
// instant, as does the band behind an open phone menu.
//
// The colours stay tokens: while it fades, the band's inline colours are the `band` and `line`
// tokens mixed with transparent by `--nav-fade`, which GSAP tweens 0 → 1. When the fade ends, or
// `solid` changes, or on unmount, the inline styles go and the CSS state classes take over again.
import type { RefObject } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { duration, ease } from "@/lib/motion";

const fadeVar = "--nav-fade";
const band = `color-mix(in srgb, var(--color-band) calc(var(${fadeVar}) * 100%), transparent)`;
const line = `color-mix(in srgb, var(--color-line) calc(var(${fadeVar}) * 100%), transparent)`;

export function useNavBandFade(nav: RefObject<HTMLElement | null>, solid: boolean) {
  useGSAP(
    () => {
      const el = nav.current;
      // Behind an open phone menu the band is already solid.
      if (!el || !solid || el.querySelector("details[open]")) return;

      const clear = () => {
        el.style.removeProperty("background-color");
        el.style.removeProperty("border-bottom-color");
        el.style.removeProperty(fadeVar);
      };

      el.style.setProperty(fadeVar, "0");
      el.style.setProperty("background-color", band);
      el.style.setProperty("border-bottom-color", line);
      gsap.to(el, {
        [fadeVar]: 1,
        duration: duration.fade,
        ease: ease.out,
        onComplete: clear,
      });

      return clear;
    },
    { scope: nav, dependencies: [solid], revertOnUpdate: true },
  );
}
