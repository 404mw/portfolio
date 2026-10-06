// Names what a section fades across a set swap (ui-spec §0.5): the wrappers `find` returns inside
// `root` fade out before the swap and in after it, on the one tween `lib/shownSet.ts` runs for
// every section (0.15s out, 0.25s in, opacity only, the same under reduced motion). `find` is read
// when each fade starts, because a swap remounts the keyed markup. It should return wrappers no
// other motion writes opacity on, so the fade never fights a section's own tweens. On unmount the
// wrappers leave the fade and their inline opacity is cleared. Pass a `find` that never changes.
import type { RefObject } from "react";
import { useGSAP } from "@/lib/gsap";
import { addSwapWrappers } from "@/lib/shownSet";

export function useSwapFade(
  root: RefObject<HTMLElement | null>,
  find: (root: HTMLElement) => readonly (Element | null)[],
) {
  useGSAP(
    () =>
      addSwapWrappers(() => {
        const element = root.current;
        return element ? find(element).filter((wrapper) => wrapper !== null) : [];
      }),
    { scope: root },
  );
}
