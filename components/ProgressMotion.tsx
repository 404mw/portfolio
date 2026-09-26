"use client";

// The progress bar's motion (ui-spec §1.5, Motion): fills with page scroll. It renders nothing,
// so `ProgressBar` and `SiteHeader` stay server-rendered and their markup unchanged.
import { useScrollProgress } from "@/hooks/useScrollProgress";

export function ProgressMotion() {
  useScrollProgress();
  return null;
}
