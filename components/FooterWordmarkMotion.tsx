"use client";

// The footer wordmark's motion (docs/pages/home/sections/09-footer.md, "wipe in place"): M and W
// rise in, then A R I X wipe in, every letter in its final place. It renders nothing, so
// `FooterWordmark` and `SiteFooter` stay server-rendered and unchanged.
import { useWordmarkReveal } from "@/hooks/useWordmarkReveal";

export function FooterWordmarkMotion() {
  useWordmarkReveal();
  return null;
}
