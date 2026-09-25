// Tilts a section's `data-anim="<name>"` element in 3D to face the pointer: the pointer's place
// across the window maps to `rotationY` (right edge of the window → turned right, up to
// `maxY` degrees) and `rotationX` (bottom edge → turned down, up to `maxX`), smoothed with
// `gsap.quickTo`, with depth from GSAP's `transformPerspective` (no parent CSS needed) and the
// origin at the centre. The element never moves: only rotation is driven, so scroll motion on
// `y`/`scale` of the same element composes with it in one transform and never fights it. It eases
// back to flat when the pointer leaves the window or the section leaves the screen, and only
// reacts while the section is on screen. Full motion on a fine pointer (mouse, trackpad) only.
import type { RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { animTargets, duration, ease, finePointerQuery, motionQuery } from "@/lib/motion";

type TiltOptions = {
  /** Degrees of `rotationX` at the window's top or bottom edge. */
  readonly maxX: number;
  /** Degrees of `rotationY` at the window's left or right edge. */
  readonly maxY: number;
  /** Perspective distance in px. */
  readonly perspective: number;
};

export function usePointerTilt(
  section: RefObject<HTMLElement | null>,
  name: string,
  { maxX, maxY, perspective }: TiltOptions,
) {
  useGSAP(
    (_context, contextSafe) => {
      const root = section.current;
      const [target] = root ? animTargets(root, name) : [];
      if (!root || !target || !contextSafe) return;

      const mm = gsap.matchMedia();

      mm.add(`${motionQuery.full} and ${finePointerQuery}`, () => {
        gsap.set(target, { transformPerspective: perspective, transformOrigin: "50% 50%" });
        const tween = { duration: duration.follow, ease: ease.follow };
        const rotateXTo = gsap.quickTo(target, "rotationX", tween);
        const rotateYTo = gsap.quickTo(target, "rotationY", tween);

        const level = () => {
          rotateXTo(0);
          rotateYTo(0);
        };

        const onScreen = ScrollTrigger.create({
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            if (!self.isActive) level();
          },
        });

        const onMove = contextSafe((event: PointerEvent) => {
          if (!onScreen.isActive) return;
          const across = (event.clientX / window.innerWidth) * 2 - 1;
          const down = (event.clientY / window.innerHeight) * 2 - 1;
          // Facing the pointer: a positive rotationY turns the face right; a negative rotationX
          // turns it down.
          rotateYTo(across * maxY);
          rotateXTo(-down * maxX);
        });
        const onLeave = contextSafe(level);

        window.addEventListener("pointermove", onMove, { passive: true });
        document.addEventListener("mouseleave", onLeave);

        return () => {
          window.removeEventListener("pointermove", onMove);
          document.removeEventListener("mouseleave", onLeave);
        };
      });

      return () => mm.revert();
    },
    { scope: section, dependencies: [name, maxX, maxY, perspective], revertOnUpdate: true },
  );
}
