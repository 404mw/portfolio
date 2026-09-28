"use client";

// Contact's motion (ui-spec §8.5, §10): the left column and the brief builder reveal (the builder
// 0.15s later, from its `data-anim-delay`), and the "what do you repeat" placeholder rotates
// through `placeholders`, passed in from content. It renders nothing, so `ContactSection` and its
// markup stay server-rendered and unchanged.
import { useBriefPlaceholder } from "@/hooks/useBriefPlaceholder";
import { useElementById } from "@/hooks/useElementById";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { sectionIds } from "@/lib/routes";

type ContactMotionProps = {
  /** The placeholder's sample phrases, in order; the first is the static one. */
  readonly placeholders: readonly string[];
};

export function ContactMotion({ placeholders }: ContactMotionProps) {
  // Declared first: its layout effect fills the ref before the motion hooks' effects run.
  const section = useElementById<HTMLElement>(sectionIds.contact);
  useScrollReveal(section);
  useBriefPlaceholder(section, placeholders);
  return null;
}
