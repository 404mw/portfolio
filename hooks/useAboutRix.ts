// Rix's play on home's About (ui-spec 02a-about-options §2a.O4; ui-spec/00-rix.md R9), on its
// section, with home's ids (lib/aboutScope.ts). It runs option B's Rix, the one chosen for `/`
// (lib/rixFeatures.ts host `b`), with its own crew registry, live watch, timers and nudge count. This hook only wires things up; the runs live
// in lib/:
//
// - lib/rixFull.ts: full motion, with the character sheet.
// - lib/rixFade.ts: reduced motion, fades only (R8.1).
//
// Setup waits for the hydrated `about-rix` button (`ready`). On unmount or any mode change
// everything is killed and the section goes back to its server markup exactly. The arrival, the
// nudge count and the juggles survive mode changes (once per page load).
import { useRef, type RefObject } from "react";
import { checkedAboutKey } from "@/lib/aboutReplies";
import { aboutScope } from "@/lib/aboutScope";
import { gsap, useGSAP } from "@/lib/gsap";
import { finePointerQuery, motionQuery } from "@/lib/motion";
import { rixFade } from "@/lib/rixFade";
import type { RixHost } from "@/lib/rixFeatures";
import { rixFull, type RixMemo } from "@/lib/rixFull";
import { findRixParts } from "@/lib/rixRig";

/** The Rix behaviour home runs (02a-about-options: B chosen for `/`). */
const homeRixOption: RixHost = "b";

export function useAboutRix(section: RefObject<HTMLElement | null>, ready: boolean) {
  // Once per page load: survive matchMedia re-runs (switching motion, a pointer change).
  const memo = useRef<RixMemo>({ entered: { current: false }, nudges: { count: 0, done: false }, juggles: 0 });

  useGSAP(
    () => {
      const root = section.current;
      if (!ready || !root) return;
      const parts = findRixParts(root);
      if (!parts) return;
      const scope = aboutScope();
      if (checkedAboutKey(scope.name) !== null) memo.current.nudges.done = true;

      const mm = gsap.matchMedia();
      mm.add({ full: motionQuery.full, reduced: motionQuery.reduced, fine: finePointerQuery }, (context) => {
        const { full = false, fine = false } = context.conditions ?? {};
        const run = { parts, scope, host: homeRixOption, memo: memo.current };
        return full ? rixFull({ ...run, fine }).stop : rixFade(run).stop;
      });

      return () => mm.revert();
    },
    { scope: section, dependencies: [ready], revertOnUpdate: true },
  );
}
