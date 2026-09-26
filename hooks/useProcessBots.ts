// The process bots' stop-motion (ui-spec §5.7, §10), on the `[data-anim="process-bot"]` SVGs
// inside `section`: breathing and frame swaps, stepped on one shared 125ms clock for all four
// bots (the per-bot numbers and player are in lib/processBotMotion.ts). The clock is a single
// repeating GSAP tween on nothing; it moves nothing itself, it only counts steps. It runs only
// while the section is on screen and the tab is visible, and resumes where it stopped.
//
// Full motion only. Reduced motion: no breathing and no swaps; each bot keeps its static pose at
// breath 0, exactly as server-rendered. On unmount or a switch to reduced motion, every bot goes
// back to its static pose with no transforms.
import type { RefObject } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { animTargets, motionQuery } from "@/lib/motion";
import { BOT_STEP_SECONDS, botPlayer, type BotPlayer } from "@/lib/processBotMotion";
import { watchLive } from "@/lib/watchLive";

export function useProcessBots(section: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = section.current;
      if (!root) return;
      const players = animTargets<SVGSVGElement>(root, "process-bot")
        .map(botPlayer)
        .filter((player): player is BotPlayer => player !== null);
      if (players.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add(motionQuery.full, () => {
        let tick = 0;
        const clock = gsap.to(
          {},
          {
            duration: BOT_STEP_SECONDS,
            ease: "none",
            repeat: -1,
            paused: true,
            onRepeat: () => {
              tick += 1;
              players.forEach((player) => player.step(tick));
            },
          },
        );
        const stopWatching = watchLive(root, (live) => {
          clock.paused(!live);
        });

        return () => {
          stopWatching();
          clock.kill();
          players.forEach((player) => player.reset());
        };
      });

      return () => mm.revert();
    },
    { scope: section },
  );
}
