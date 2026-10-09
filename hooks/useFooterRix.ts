// Rix on the footer's line (ui-spec/09-footer.md §9.4 "Motion"), on his `footer-rix` row. This hook
// only wires things up; the runs live in lib/:
//
// - lib/footerRix.ts: full motion (life, the pointer follow, the calls, the beats between them, the
//   hover reaction).
// - lib/footerRixFade.ts: reduced motion, fades only (his lines; he doesn't move or look).
//
// On unmount (leaving for /rix, where the row isn't rendered) or any mode change everything is
// killed and the row goes back to its server markup exactly; coming back rigs him again. The first
// call and the lines' turn are kept per page load, so neither a mode change nor a visit to /rix
// replays the first call.
import type { RefObject } from "react";
import { footerRixFull } from "@/lib/footerRix";
import { footerRixFade } from "@/lib/footerRixFade";
import { newFooterRixMemo } from "@/lib/footerRixLines";
import { findFooterRix } from "@/lib/footerRixParts";
import { gsap, useGSAP } from "@/lib/gsap";
import { finePointerQuery, motionQuery } from "@/lib/motion";

/** Once per page load: it outlives the row, which unmounts on /rix. */
const memo = newFooterRixMemo();

export function useFooterRix(row: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = row.current;
      if (!root) return;
      const parts = findFooterRix(root);
      if (!parts) return;

      const mm = gsap.matchMedia();
      mm.add({ full: motionQuery.full, reduced: motionQuery.reduced, fine: finePointerQuery }, (context) => {
        const { full = false, fine = false } = context.conditions ?? {};
        return full ? footerRixFull({ parts, memo, fine }) : footerRixFade({ parts, memo });
      });

      return () => mm.revert();
    },
    { scope: row },
  );
}
