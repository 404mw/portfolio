"use client";

// Process's motion (ui-spec §5.7, §10): the header and step text reveal on scroll, and the bots
// breathe and swap frames in stop-motion. It renders nothing, so `ProcessSection` and its markup
// stay server-rendered and unchanged.
import { useElementById } from "@/hooks/useElementById";
import { useProcessBots } from "@/hooks/useProcessBots";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { sectionIds } from "@/lib/routes";

export function ProcessMotion() {
  // Declared first: its layout effect fills the ref before the motion hooks' effects run.
  const section = useElementById<HTMLElement>(sectionIds.process);
  useScrollReveal(section);
  useProcessBots(section);
  return null;
}
