// The brief's rotating placeholder (ui-spec §8.5, Motion), on the `[data-anim="brief-placeholder"]`
// textarea inside `section`: every 2.4s its placeholder moves to the next of `phrases` (the
// sample phrases from content, passed in; the first is the static one), wrapping. It stops for
// good once the field is focused or holds any text (including text typed before hydration),
// keeping the phrase it's on, and it pauses while the field is off screen or the tab is hidden.
//
// Full motion only. Reduced motion: no rotation (auto-advance is off); the first phrase stays, as
// server-rendered. Only the `placeholder` attribute changes, never the value, so the field stays
// uncontrolled and `useBriefState` still reads it back. On unmount or a switch to reduced motion
// the first phrase comes back.
import type { RefObject } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { animTargets, motionQuery } from "@/lib/motion";
import { watchLive } from "@/lib/watchLive";

/** Seconds each phrase shows (ui-spec §8.5). */
const PHRASE_SECONDS = 2.4;

export function useBriefPlaceholder(
  section: RefObject<HTMLElement | null>,
  phrases: readonly string[],
) {
  useGSAP(
    () => {
      const root = section.current;
      const [field] = root ? animTargets<HTMLTextAreaElement>(root, "brief-placeholder") : [];
      const [first] = phrases;
      if (!field || first === undefined || phrases.length < 2) return;

      const mm = gsap.matchMedia();

      mm.add(motionQuery.full, () => {
        let index = 0;
        let done = false;

        // A clock on nothing: each repeat is one phrase change.
        const clock = gsap.to(
          {},
          {
            duration: PHRASE_SECONDS,
            ease: "none",
            repeat: -1,
            paused: true,
            onRepeat: () => {
              index = (index + 1) % phrases.length;
              field.placeholder = phrases[index] ?? first;
            },
          },
        );

        const stopWatching = watchLive(field, (live) => {
          clock.paused(done || !live);
        });

        const stopForGood = () => {
          if (done) return;
          done = true;
          clock.pause();
          field.removeEventListener("focus", stopForGood);
          field.removeEventListener("input", onInput);
        };
        function onInput() {
          if (field && field.value !== "") stopForGood();
        }

        field.addEventListener("focus", stopForGood);
        field.addEventListener("input", onInput);
        if (field.value !== "" || document.activeElement === field) stopForGood();

        return () => {
          stopWatching();
          field.removeEventListener("focus", stopForGood);
          field.removeEventListener("input", onInput);
          clock.kill();
          field.placeholder = first;
        };
      });

      return () => mm.revert();
    },
    { scope: section, dependencies: [phrases] },
  );
}
