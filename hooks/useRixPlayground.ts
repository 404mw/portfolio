// The /rix playground (docs/pages/rix/ui-spec.md §0.4, §10): runs the playground's own Rix on
// `section#rix-playground` (option B's character sheet with every scheduler off: no nudges, plays,
// nap timer, tag, walks to targets or arrival on load; life on; poking or petting him runs the real
// ladder and pet) and dispatches its buttons. `play(command)` cuts the current move and plays the
// command's own (lib/rixPlaygroundMoves.ts), its R8.1 version when the OS asks for reduced motion;
// `playing` is the move under way (the readout and the button's `data-playing`), back to null when
// it ends; `patrol` is the patrol toggle (off by default): on, the real R4.8 patrol runs (plays stay
// off); off, a running stretch brakes. Setup waits for the hydrated `about-rix` button; on unmount
// or a mode change everything is killed and the playground goes back to its server markup exactly.
import { useCallback, useEffect, useRef, useState } from "react";
import { useElementById } from "@/hooks/useElementById";
import { useHydrated } from "@/hooks/useHydrated";
import { aboutScope } from "@/lib/aboutScope";
import { gsap, useGSAP } from "@/lib/gsap";
import { finePointerQuery, motionQuery } from "@/lib/motion";
import { rixFade } from "@/lib/rixFade";
import { rixFull, type RixMemo } from "@/lib/rixFull";
import { rixIds, sameRixPlaygroundCommand, type RixPlaygroundCommand } from "@/lib/rixPlayground";
import { playgroundMoves, type PlaygroundMoves } from "@/lib/rixPlaygroundMoves";
import { findRixParts } from "@/lib/rixRig";

type RixPlayground = {
  readonly playing: RixPlaygroundCommand | null;
  readonly patrol: boolean;
  readonly play: (command: RixPlaygroundCommand) => void;
  readonly togglePatrol: () => void;
};

export function useRixPlayground(): RixPlayground {
  const [playing, setPlaying] = useState<RixPlaygroundCommand | null>(null);
  const [patrol, setPatrol] = useState(false);
  const section = useElementById<HTMLElement>(rixIds.playground);
  const hydrated = useHydrated();
  const moves = useRef<PlaygroundMoves | null>(null);
  // The toggle's latest value, for a motion run that starts after it was set.
  const patrolOn = useRef(false);
  const memo = useRef<RixMemo>({ entered: { current: true }, nudges: { count: 0, done: true }, juggles: 0 });

  useGSAP(
    () => {
      const root = section.current;
      if (!hydrated || !root) return;
      const parts = findRixParts(root);
      if (!parts) return;
      const mm = gsap.matchMedia();
      mm.add({ full: motionQuery.full, reduced: motionQuery.reduced, fine: finePointerQuery }, (context) => {
        const { full = false, fine = false } = context.conditions ?? {};
        const options = { parts, scope: aboutScope("b"), host: "playground" as const, memo: memo.current };
        const run = full ? rixFull({ ...options, fine }) : null;
        const fade = full ? null : rixFade(options);
        const dispatch = playgroundMoves(root, run?.kit ?? null, fade?.kit ?? null);
        moves.current = dispatch;
        dispatch.setPatrol(patrolOn.current);
        return () => {
          if (moves.current === dispatch) moves.current = null;
          dispatch.stop();
          run?.stop();
          fade?.stop();
        };
      });
      return () => mm.revert();
    },
    { scope: section, dependencies: [hydrated], revertOnUpdate: true },
  );

  const play = useCallback((command: RixPlaygroundCommand) => {
    const dispatch = moves.current;
    if (!dispatch) return;
    setPlaying(command);
    dispatch.play(command, () =>
      setPlaying((current) => (sameRixPlaygroundCommand(current, command) ? null : current)),
    );
  }, []);
  useEffect(() => {
    patrolOn.current = patrol;
    moves.current?.setPatrol(patrol);
  }, [patrol]);

  const togglePatrol = useCallback(() => setPatrol((on) => !on), []);
  return { playing, patrol, play, togglePatrol };
}
