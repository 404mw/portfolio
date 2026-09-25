"use client";

// The hero's drawn agent network (ui-spec §2.5): one canvas. `useHeroNetwork` draws the static
// network; under full motion `useHeroNetworkMotion` makes the nodes drift and sends pulses along
// the links, on the same network instance. Without JS it stays empty, and the backdrop's CSS layers still finish the
// section.
import { useRef } from "react";
import { useHeroNetwork } from "@/hooks/useHeroNetwork";
import { useHeroNetworkMotion } from "@/hooks/useHeroNetworkMotion";

export function HeroNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useHeroNetwork(canvasRef);
  useHeroNetworkMotion(canvasRef, sceneRef);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-anim="hero-network"
      className="absolute inset-0 size-full"
    />
  );
}
