"use client";

// The marquee's motion (ui-spec §3.3, Motion): the strip loops sideways and pauses on hover. It
// renders nothing, so `MarqueeStrip` stays server-rendered and its markup unchanged.
import { useMarqueeLoop } from "@/hooks/useMarqueeLoop";

export function MarqueeMotion() {
  useMarqueeLoop();
  return null;
}
