// Draws the hero network into `canvasRef` (ui-spec §2.5). Static, no animation loop. After the
// fonts load (so text keep-outs are measured at their final size), a ResizeObserver starts
// watching the canvas; its guaranteed first notification does the first draw. Later resizes and
// device pixel ratio changes (e.g. the window moves to another monitor) schedule a redraw,
// coalesced to one frame, and a draw is skipped when the CSS size and ratio match the last one
// drawn, so a notification landing just after a draw doesn't repeat it. The colour comes from
// the `--color-accent` token; if it can't be read, nothing is drawn. Measuring lives in
// lib/heroNetworkLayout.ts. It returns a ref to the scene last drawn (network, colour, scale and
// the keep-outs it was built around), or null while the canvas holds none, so the motion
// (hooks/useHeroNetworkMotion.ts) runs on the same network instance and restarts when a redraw
// swaps it.
import { useEffect, useRef, type RefObject } from "react";
import { backingScale } from "@/lib/backingScale";
import { drawHeroNetwork, type HeroNetworkScene } from "@/lib/drawHeroNetwork";
import { buildHeroNetwork } from "@/lib/heroNetwork";
import { canvasLayoutSize, keepOutRects } from "@/lib/heroNetworkLayout";

export function useHeroNetwork(
  canvasRef: RefObject<HTMLCanvasElement | null>,
): RefObject<HeroNetworkScene | null> {
  const sceneRef = useRef<HeroNetworkScene | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const root: ParentNode = canvas.closest("section") ?? document;

    let frame = 0;
    let observer: ResizeObserver | undefined;
    let resolution: MediaQueryList | undefined;
    let lastDrawn = "";
    let cancelled = false;

    const draw = () => {
      frame = 0;
      const { width, height } = canvasLayoutSize(canvas);
      if (width === 0 || height === 0) return;
      const ratio = window.devicePixelRatio;
      const key = `${width}x${height}@${ratio}`;
      if (key === lastDrawn) return;

      const accent = getComputedStyle(canvas).getPropertyValue("--color-accent").trim();
      const scale = backingScale(width, height, ratio);
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      lastDrawn = key;
      sceneRef.current = null;
      if (!accent) return;

      const textRects = keepOutRects(root, "text", canvas);
      const agentRects = keepOutRects(root, "agents", canvas);
      const network = buildHeroNetwork({ width, height, textRects, agentRects });
      drawHeroNetwork(ctx, network, { accent, scale });
      sceneRef.current = { network, accent, scale, textRects, agentRects };
    };

    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(draw);
    };

    // A resolution query matches one ratio only, so it is re-armed for the new ratio on each change.
    const onResolutionChange = () => {
      watchResolution();
      schedule();
    };
    const watchResolution = () => {
      resolution?.removeEventListener("change", onResolutionChange);
      resolution = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
      resolution.addEventListener("change", onResolutionChange);
    };

    document.fonts.ready.then(() => {
      if (cancelled) return;
      observer = new ResizeObserver(schedule);
      observer.observe(canvas);
      watchResolution();
    });

    return () => {
      cancelled = true;
      observer?.disconnect();
      resolution?.removeEventListener("change", onResolutionChange);
      if (frame !== 0) cancelAnimationFrame(frame);
      sceneRef.current = null;
    };
  }, [canvasRef]);

  return sceneRef;
}
