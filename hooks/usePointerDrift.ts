// Drifts a section's `data-anim="<name>"` element sideways with the pointer: `distance` px left
// at the window's left edge, right at its right edge, smoothed with `gsap.quickTo`. Only `x` is
// driven, so scroll motion on `y`/`scale` of the same element never fights it. Runs only with
// full motion on a fine pointer (mouse, trackpad), and only reacts while the section is on screen.
import type { RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { animTargets, duration, ease, finePointerQuery, motionQuery } from "@/lib/motion";

export function usePointerDrift(
  section: RefObject<HTMLElement | null>,
  name: string,
  distance: number,
) {
  useGSAP(
    (_context, contextSafe) => {
      const root = section.current;
      const [target] = root ? animTargets(root, name) : [];
      if (!root || !target || !contextSafe) return;

      const mm = gsap.matchMedia();

      mm.add(`${motionQuery.full} and ${finePointerQuery}`, () => {
        const xTo = gsap.quickTo(target, "x", { duration: duration.follow, ease: ease.follow });
        const onScreen = ScrollTrigger.create({ trigger: root, start: "top bottom", end: "bottom top" });

        const onMove = contextSafe((event: PointerEvent) => {
          if (!onScreen.isActive) return;
          xTo(((event.clientX / window.innerWidth) * 2 - 1) * distance);
        });
        window.addEventListener("pointermove", onMove, { passive: true });

        return () => window.removeEventListener("pointermove", onMove);
      });

      return () => mm.revert();
    },
    { scope: section, dependencies: [name, distance], revertOnUpdate: true },
  );
}
