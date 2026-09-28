// The Web step rows' motion (ui-spec §6.3, Motion), on the `[data-anim="web-row"]` rows inside
// `section`:
//
// - Reveal: once, as they scroll in, the rows rise from the generic reveal's from-state,
//   staggered 0.1s (lib/revealBatch.ts). Reduced motion: a short opacity fade, no rise.
// - Hover indent, full motion on a fine pointer only: the hovered row's `padding-left` eases
//   0 → 12px and back on leave. The line's hover colour is CSS and stays in every mode.
//
// The starting state is set here, in JS, so without JS the rows show as built. Inline styles are
// cleared once a row has revealed and when a mode stops applying (the indent's tweens are reverted
// with their branch).
import type { RefObject } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { animTargets, duration, ease, finePointerQuery, motionQuery } from "@/lib/motion";
import { revealBatch } from "@/lib/revealBatch";

/** Seconds between rows that reveal together. */
const ROW_STAGGER = 0.1;
/** The hover indent, in px (ui-spec §6.3). */
const INDENT = 12;

export function useWebRows(section: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = section.current;
      if (!root) return;
      const rows = animTargets(root, "web-row");
      if (rows.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add({ full: motionQuery.full, reduced: motionQuery.reduced }, (context) => {
        revealBatch(rows, {
          each: ROW_STAGGER,
          reduced: Boolean(context.conditions?.reduced),
          context,
        });
      });

      mm.add(`${motionQuery.full} and ${finePointerQuery}`, () => {
        const listeners = rows.map((row) => {
          // One reusable tween per row (reverted with this branch), not a new one per hover.
          const indentTo = gsap.quickTo(row, "paddingLeft", { duration: duration.fade, ease: ease.out });
          const onEnter = () => indentTo(INDENT);
          const onLeave = () => indentTo(0);
          row.addEventListener("pointerenter", onEnter);
          row.addEventListener("pointerleave", onLeave);
          return () => {
            row.removeEventListener("pointerenter", onEnter);
            row.removeEventListener("pointerleave", onLeave);
          };
        });

        return () => listeners.forEach((remove) => remove());
      });

      return () => mm.revert();
    },
    { scope: section },
  );
}
