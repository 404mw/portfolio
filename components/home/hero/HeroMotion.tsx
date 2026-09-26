"use client";

// The hero's motion (ui-spec §2.5, Motion): the load entrance, the scroll parallax and the
// portrait's 3D pointer tilt, on the `#top` section. It renders nothing, so the section and its
// markup stay server-rendered and unchanged. The network's travelling pulses live with their
// canvas, in `HeroNetwork`.
import { useElementById } from "@/hooks/useElementById";
import { useHeroEntrance } from "@/hooks/useHeroEntrance";
import { useHeroScroll } from "@/hooks/useHeroScroll";
import { usePointerTilt } from "@/hooks/usePointerTilt";
import { sectionIds } from "@/lib/routes";

/** The portrait's pointer tilt: degrees at the window's edges, and the perspective in px. */
const PORTRAIT_TILT = { maxX: 1, maxY: 1.5, perspective: 1100 } as const;

export function HeroMotion() {
  // Declared first: its layout effect fills the ref before the motion hooks' effects run.
  const section = useElementById<HTMLElement>(sectionIds.top);
  useHeroEntrance(section);
  useHeroScroll(section);
  usePointerTilt(section, "hero-portrait", PORTRAIT_TILT);
  return null;
}
