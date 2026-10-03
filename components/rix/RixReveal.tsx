"use client";

// One /rix section's reveal (docs/pages/rix/ui-spec.md §10): its `data-anim="reveal"` elements rise
// and fade in once, on load if they're in view (the generic reveal, hooks/useScrollReveal.ts; fades
// only under reduced motion). It renders nothing, so the section and its markup stay
// server-rendered and unchanged.
import { useElementById } from "@/hooks/useElementById";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function RixReveal({ sectionId }: { readonly sectionId: string }) {
  // Declared first: its layout effect fills the ref before the reveal's effect runs.
  const section = useElementById<HTMLElement>(sectionId);
  useScrollReveal(section);
  return null;
}
