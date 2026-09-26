// The nav's reading-progress bar (ui-spec §1.5, Motion): `data-anim="progress"` scales `scaleX`
// 0→1 over the whole document scroll (top of the page empty, bottom full), linearly. Full motion
// catches up with a light scrub; under reduced motion it still tracks, set straight from the
// scroll position with no smoothing, because it's a position indicator, not decoration (ui-spec
// §10, constitution §5 amended 2026-09-25). Without JS, or before this runs, the bar stays empty.
//
// The page grows and shrinks without a window resize (disclosures opening, images and fonts
// arriving), and ScrollTrigger only refreshes itself on resize, so a ResizeObserver on <body>
// refreshes this trigger whenever the page's height changes. The takeover's scroll lock only
// changes the body's width (the scrollbar goes), which refreshes harmlessly.
import { gsap, useGSAP } from "@/lib/gsap";
import { animTargets, ease, motionQuery } from "@/lib/motion";

/** Seconds the bar takes to catch up with the scroll, full motion only. */
const SCRUB_SMOOTHING = 0.3;

export function useScrollProgress() {
  useGSAP(() => {
    const [bar] = animTargets(document, "progress");
    if (!bar) return;

    const mm = gsap.matchMedia();

    mm.add({ full: motionQuery.full, reduced: motionQuery.reduced }, (context) => {
      const { reduced } = context.conditions ?? {};

      // GSAP folds the static `scale-x-0` (the CSS `scale` property) into its transform and
      // restores it on revert, so the bar goes back to its static empty state on unmount.
      const fill = gsap.fromTo(
        bar,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: ease.scrub,
          scrollTrigger: {
            start: 0,
            end: "max",
            scrub: reduced ? true : SCRUB_SMOOTHING,
          },
        },
      );

      const trigger = fill.scrollTrigger;
      const observer = new ResizeObserver(() => trigger?.refresh());
      observer.observe(document.body);

      return () => observer.disconnect();
    });

    return () => mm.revert();
  });
}
