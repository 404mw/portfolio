"use client";

// The hero's drawn agent network (ui-spec §2.5): one canvas, drawn once by `useHeroNetwork`.
// Without JS it stays empty, and the backdrop's CSS layers still finish the section.
import { useRef } from "react";
import { useHeroNetwork } from "@/hooks/useHeroNetwork";

export function HeroNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useHeroNetwork(canvasRef);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-anim="hero-network"
      className="absolute inset-0 size-full"
    />
  );
}
