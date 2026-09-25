// Runs the hero network's motion (ui-spec §2.5, Motion) on `gsap.ticker`: every node drifts
// slowly on its own (lib/heroDrift.ts), so each link moves independently, and 2px accent pulses
// leave the agents about every 1.5s and ride the moving links (lib/heroPulses.ts). Each tick
// redraws the whole network at the drifted positions, then the pulses; nothing is measured per
// frame. Full motion only; under reduced motion neither starts and the static drawing stays.
// It runs only while the canvas is on screen and the tab is visible. When it stops, the canvas
// goes back to the undrifted static drawing; when it starts or resumes, the drift and the pulses
// grow in from rest so nothing jumps. A new scene from useHeroNetwork (resize or pixel-ratio
// redraw) restarts the drift and the pulses on the new network instance.
import type { RefObject } from "react";
import { drawHeroNetwork, drawHeroPulses, type HeroNetworkScene } from "@/lib/drawHeroNetwork";
import { gsap, useGSAP } from "@/lib/gsap";
import { createNetworkDrift, driftWeight, type NetworkDrift } from "@/lib/heroDrift";
import { createPulseField, type PulseField } from "@/lib/heroPulses";
import { motionQuery } from "@/lib/motion";

/** The longest step one frame may take, in seconds, so a stalled frame doesn't jump the pulses. */
const MAX_STEP = 0.1;

export function useHeroNetworkMotion(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  sceneRef: RefObject<HeroNetworkScene | null>,
) {
  useGSAP(
    () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      const mm = gsap.matchMedia();

      mm.add(motionQuery.full, () => {
        let scene: HeroNetworkScene | null = null;
        let drift: NetworkDrift | null = null;
        let pulses: PulseField | null = null;
        let startedAt = 0;
        let onScreen = false;
        let running = false;

        const tick = (time: number, deltaMs: number) => {
          const current = sceneRef.current;
          if (current !== scene) {
            scene = current;
            drift = scene ? createNetworkDrift(scene.network, scene) : null;
            pulses = scene ? createPulseField(scene.network) : null;
            startedAt = time;
          }
          if (!scene || !drift || !pulses) return;
          // The drift and the pulses both grow in from rest on start and resume.
          const weight = driftWeight(time - startedAt);
          drift.update(time, weight);
          const points = pulses.step(Math.min(deltaMs / 1000, MAX_STEP), drift.positions);
          drawHeroNetwork(ctx, scene.network, scene, drift.positions);
          drawHeroPulses(ctx, points, scene, weight);
        };

        // Back to the undrifted drawing, without pulses.
        const rest = () => {
          const current = sceneRef.current;
          if (current) drawHeroNetwork(ctx, current.network, current);
        };

        const update = () => {
          const shouldRun = onScreen && document.visibilityState === "visible";
          if (shouldRun === running) return;
          running = shouldRun;
          if (running) {
            startedAt = gsap.ticker.time;
            gsap.ticker.add(tick);
          } else {
            gsap.ticker.remove(tick);
            rest();
          }
        };

        const observer = new IntersectionObserver((entries) => {
          onScreen = entries[entries.length - 1]?.isIntersecting ?? false;
          update();
        });
        observer.observe(canvas);
        document.addEventListener("visibilitychange", update);

        return () => {
          observer.disconnect();
          document.removeEventListener("visibilitychange", update);
          gsap.ticker.remove(tick);
          if (running) rest();
          running = false;
        };
      });

      return () => mm.revert();
    },
    { dependencies: [canvasRef, sceneRef] },
  );
}
