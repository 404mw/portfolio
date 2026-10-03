"use client";

// One About instance's motion (ui-spec 02a-about-options §2a.O4, §10): the intro and body reveal on
// scroll, and Rix plays (peek-in, life, looks, poke, perk, nudges, pick acts), on home's About
// (option B's Rix). It renders nothing, so the section and its markup stay server-rendered and
// unchanged. Rix's setup waits for the hydrated `about-rix` button (it's a decorative span in the
// server markup).
import { useAboutRix } from "@/hooks/useAboutRix";
import { useElementById } from "@/hooks/useElementById";
import { useHydrated } from "@/hooks/useHydrated";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { aboutScope } from "@/lib/aboutScope";

export function RixMotion() {
  // Declared first: its layout effect fills the ref before the motion hooks' effects run.
  const section = useElementById<HTMLElement>(aboutScope().sectionId);
  const hydrated = useHydrated();
  useScrollReveal(section);
  useAboutRix(section, hydrated);
  return null;
}
