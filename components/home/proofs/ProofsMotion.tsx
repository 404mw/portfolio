"use client";

// Proofs' motion (ui-spec §7.7, §10): the heading block reveals, the cards reveal staggered and
// lift on hover. It renders nothing, so `ProofsSection` and its markup stay server-rendered and
// unchanged. The takeover's own motion runs in `TakeoverController`.
import { useElementById } from "@/hooks/useElementById";
import { useProofCards } from "@/hooks/useProofCards";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { sectionIds } from "@/lib/routes";

export function ProofsMotion() {
  // Declared first: its layout effect fills the ref before the motion hooks' effects run.
  const section = useElementById<HTMLElement>(sectionIds.proofs);
  useScrollReveal(section);
  useProofCards(section);
  return null;
}
