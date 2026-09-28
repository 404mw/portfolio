// The proof cards' motion (ui-spec §7.7, Motion), on the `[data-proof-card]` links inside
// `section`:
//
// - Reveal: once, as they scroll in, the cards rise from the generic reveal's from-state,
//   staggered 0.12s (lib/revealBatch.ts). Reduced motion: a short opacity fade, no rise.
// - Hover lift, full motion on a fine pointer only: the hovered card eases up 8px and back down on
//   leave. The lift takes over the card's transform from the reveal, so the reveal only clears
//   the card's opacity when it ends.
//
// The starting state is set here, in JS, so without JS the cards show as built. A mode that stops
// applying clears what it set. The takeover's clip reads the card where it sits, lifted or not.
import type { RefObject } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { duration, ease, finePointerQuery, motionQuery, stagger } from "@/lib/motion";
import { revealBatch } from "@/lib/revealBatch";

/** The hover lift, in px (ui-spec §7.7). */
const LIFT = -8;

export function useProofCards(section: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = section.current;
      if (!root) return;
      const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-proof-card]"));
      if (cards.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add({ full: motionQuery.full, reduced: motionQuery.reduced }, (context) => {
        revealBatch(cards, {
          each: stagger.card,
          reduced: Boolean(context.conditions?.reduced),
          context,
          clearProps: "opacity",
        });
      });

      mm.add(`${motionQuery.full} and ${finePointerQuery}`, () => {
        const listeners = cards.map((card) => {
          // One reusable tween per card (reverted with this branch), not a new one per hover.
          const liftTo = gsap.quickTo(card, "y", { duration: duration.fade, ease: ease.out });
          const onEnter = () => liftTo(LIFT);
          const onLeave = () => liftTo(0);
          card.addEventListener("pointerenter", onEnter);
          card.addEventListener("pointerleave", onLeave);
          return () => {
            card.removeEventListener("pointerenter", onEnter);
            card.removeEventListener("pointerleave", onLeave);
          };
        });

        return () => listeners.forEach((remove) => remove());
      });

      return () => mm.revert();
    },
    { scope: section },
  );
}
