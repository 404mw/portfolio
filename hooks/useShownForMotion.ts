// The "Shown for" tag's motion (ui-spec §0.6), on one tag (`details[data-anim="pick-tag"]`; the
// page has two, each with its own instance of this hook).
//
// - On open the list (`pick-tag-list`) fades in over `TAG_FADE`: opacity only, in both motion
//   modes. It stays in the flow at its full height; nothing slides. Closing is the native
//   `<details>` close, at once: nothing here delays or intercepts it.
// - The chevron (the summary's last svg) turns over the same time on open, and back on close. Its
//   `rotate` classes already set the end state, so the turn starts a half turn away from it and
//   runs to it; a toggle mid-turn carries on from where the chevron is. Reduced motion: no turn,
//   the chevron just switches.
//
// It watches the `open` attribute, not the `toggle` event: the event is a queued task, so the list
// could paint once at full opacity before its fade started, while a mutation observer runs before
// the next paint, however the tag was opened or closed. It never moves focus and never changes
// `open`. Starting states are set here, in JS; when a tween ends its inline style is cleared, so
// the classes own the resting state again. Tweens are made outside the matchMedia context (it
// would otherwise collect one per toggle) and reverted on the next toggle of their kind or on cleanup.
import type { RefObject } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { animTargets, ease, motionQuery } from "@/lib/motion";

/** Seconds the list takes to fade in, and the chevron to turn (ui-spec §0.6). */
const TAG_FADE = 0.2;
/** Degrees between the chevron's closed and open states (its `rotate` classes). */
const CHEVRON_TURN = 180;

export function useShownForMotion(details: RefObject<HTMLDetailsElement | null>) {
  useGSAP(
    () => {
      const tag = details.current;
      if (!tag) return;
      const [list] = animTargets(tag, "pick-tag-list");
      const chevron = tag.querySelector<SVGSVGElement>(":scope > summary > svg:last-child");

      const mm = gsap.matchMedia();

      mm.add({ full: motionQuery.full, reduced: motionQuery.reduced }, (context) => {
        const reduced = Boolean(context.conditions?.reduced);
        let wasOpen = tag.open;
        let fade: gsap.core.Tween | null = null;
        let turn: gsap.core.Tween | null = null;
        // Where the running turn ends, in degrees.
        let end = 0;

        const onOpenChange = () =>
          context.ignore(() => {
            const open = tag.open;
            if (open === wasOpen) return;
            wasOpen = open;

            fade?.revert();
            fade =
              open && list
                ? gsap.fromTo(
                    list,
                    { opacity: 0 },
                    { opacity: 1, duration: TAG_FADE, ease: ease.out, clearProps: "opacity" },
                  )
                : null;

            if (reduced || !chevron) return;
            // GSAP folds the class's `rotate` into the transform it draws. At rest it has just read
            // the class's new angle, so the turn starts a half turn back from it; mid-turn it still
            // holds the angle drawn, and the turn carries on from there to the new end.
            const active = turn?.isActive() ?? false;
            const drawn = Number(gsap.getProperty(chevron, "rotation")) || 0;
            const step = open ? -CHEVRON_TURN : CHEVRON_TURN;
            end = active ? end + step : drawn;
            turn?.kill();
            turn = gsap.fromTo(
              chevron,
              { rotation: active ? drawn : drawn - step },
              { rotation: end, duration: TAG_FADE, ease: ease.out, clearProps: "transform" },
            );
          });

        const observer = new MutationObserver(onOpenChange);
        observer.observe(tag, { attributes: true, attributeFilter: ["open"] });

        return () => {
          observer.disconnect();
          fade?.revert();
          turn?.kill();
          if (chevron) gsap.set(chevron, { clearProps: "transform" });
        };
      });

      return () => mm.revert();
    },
    { scope: details },
  );
}
