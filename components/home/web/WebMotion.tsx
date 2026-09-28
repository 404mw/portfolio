"use client";

// Web's motion (ui-spec §6.3, §10): the left column reveals, the step rows reveal staggered and
// indent on hover. It renders nothing, so `WebSection` and its markup stay server-rendered and
// unchanged.
import { useElementById } from "@/hooks/useElementById";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useWebRows } from "@/hooks/useWebRows";
import { sectionIds } from "@/lib/routes";

export function WebMotion() {
  // Declared first: its layout effect fills the ref before the motion hooks' effects run.
  const section = useElementById<HTMLElement>(sectionIds.web);
  useScrollReveal(section);
  useWebRows(section);
  return null;
}
