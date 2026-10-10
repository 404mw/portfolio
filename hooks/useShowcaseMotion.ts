// The showcase diagram's motion (ui-spec/07-proofs-spam.md, Motion (later); ui-spec §10): once per
// open of its takeover, it plays as it enters the dialog's own view (the dialog is the scroller,
// not the window). Opening and closing stay with hooks/useHashTakeover.ts and their motion with
// hooks/useTakeoverMotion.ts; this only reads the dialog's `open` attribute
// (lib/watchOpenTakeovers.ts).
// - Opened (over the page, by Next, or already open at setup): the start state is set in JS
//   (lib/showcaseSequence.ts), then an IntersectionObserver rooted on the dialog waits for the
//   diagram's top to pass 20% up from the dialog's bottom. It reads rendered positions, so the
//   open's rise and the Next slide's travel never skew it. Then the sequence plays once.
// - Closed (Esc, Close, Back, or the old project after Next): the watch stops, the timeline is
//   killed and every part goes back exactly as server-rendered, ready for the next open.
// Every selector is inside the diagram's own root, found inside this takeover's dialog, so no
// other Rix (About, Process, the footer, /rix) is touched, and their motion never finds these.
// The per-open tweens are created in callbacks after setup, outside the matchMedia context, so
// they are killed and cleared by hand; the matchMedia cleanup (unmount or a motion-mode switch)
// does the same. Reduced motion: the wrapper fades in, all of it together; nothing moves.
import type { RefObject } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { animTargets, motionQuery } from "@/lib/motion";
import { onceInView } from "@/lib/onceInView";
import { hideShowcase, playShowcase, resetShowcase, showcaseParts } from "@/lib/showcaseSequence";
import { SHOWCASE_IN_VIEW, showcaseWideQuery } from "@/lib/showcaseMotion";
import { watchOpenTakeovers } from "@/lib/watchOpenTakeovers";

/** Runs the diagram in `dialog` for every open while `reduced` holds. Returns the cleanup. */
function runShowcase(dialog: HTMLDialogElement, root: HTMLElement, reduced: boolean): () => void {
  const parts = showcaseParts(root);
  let stopWatching: (() => void) | null = null;
  let timeline: gsap.core.Timeline | null = null;

  const stop = () => {
    stopWatching?.();
    stopWatching = null;
    timeline?.kill();
    timeline = null;
    resetShowcase(parts);
  };

  const start = () => {
    stop();
    const wide = window.matchMedia(showcaseWideQuery).matches;
    hideShowcase(parts, reduced, wide);
    stopWatching = onceInView(
      root,
      0,
      () => {
        stopWatching = null;
        timeline = playShowcase(parts, reduced, wide);
      },
      { root: dialog, rootMargin: SHOWCASE_IN_VIEW },
    );
  };

  let open = false;
  const stopOpenWatch = watchOpenTakeovers([dialog.id], (ids) => {
    const now = ids.length > 0;
    if (now === open) return;
    open = now;
    if (now) start();
    else stop();
  });

  return () => {
    stopOpenWatch();
    stop();
  };
}

export function useShowcaseMotion(dialog: RefObject<HTMLDialogElement | null>) {
  useGSAP(
    () => {
      const el = dialog.current;
      if (!(el instanceof HTMLDialogElement)) return;
      const root = animTargets(el, "showcase-diagram")[0];
      if (!root) return;

      const mm = gsap.matchMedia();
      mm.add({ full: motionQuery.full, reduced: motionQuery.reduced }, (context) => {
        const { reduced = false } = context.conditions ?? {};
        return runShowcase(el, root, reduced);
      });
      return () => mm.revert();
    },
    { scope: dialog },
  );
}
