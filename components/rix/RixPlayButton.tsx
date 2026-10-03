"use client";
// A /rix playground button (ui-spec/02-playground.md §2.1): a 44px chip, `line` border and `muted`
// text; accent while its move plays (`data-playing`); the patrol toggle fills accent while pressed
// (`aria-pressed`). It renders `disabled` until hydrated, so it never meets a no-JS visitor as a dead
// control and the layout doesn't shift on hydration. `hideReduced` hides a button with no R8.1
// version under reduced motion.
import type { ReactNode } from "react";
import { useHydrated } from "@/hooks/useHydrated";
import { chip, focusRing } from "@/lib/styles";

type RixPlayButtonProps = {
  readonly onClick: () => void;
  /** Its move is playing. */
  readonly playing?: boolean;
  /** Toggle buttons only: on or off. */
  readonly pressed?: boolean;
  /** Hidden under reduced motion (no R8.1 version). */
  readonly hideReduced?: boolean;
  readonly children: ReactNode;
};

const states =
  "border-line text-muted enabled:hover:border-muted enabled:hover:text-text active:bg-band data-[playing]:border-accent data-[playing]:text-accent aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:text-on-accent";

export function RixPlayButton({ onClick, playing = false, pressed, hideReduced = false, children }: RixPlayButtonProps) {
  const hydrated = useHydrated();
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!hydrated}
      aria-pressed={pressed}
      data-playing={playing ? "" : undefined}
      className={`${chip} cursor-pointer disabled:cursor-default ${states} ${focusRing} ${hideReduced ? "motion-reduce:hidden" : ""}`}
    >
      {children}
    </button>
  );
}
