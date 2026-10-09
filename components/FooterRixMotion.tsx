"use client";

// The footer Rix's motion (ui-spec/09-footer.md §9.4 "Motion"): life and the pointer follow, his
// calls with their typed lines, the beats between them and the hover reaction; under reduced motion
// only his lines, faded. It renders nothing, so the row and its markup stay as built. `FooterRixLink`
// mounts it inside the row, so it doesn't exist on /rix.
import { useAnimTarget } from "@/hooks/useAnimTarget";
import { useFooterRix } from "@/hooks/useFooterRix";

export function FooterRixMotion() {
  // Declared first: its layout effect fills the ref before the motion hook's effect runs.
  const row = useAnimTarget<HTMLElement>("footer-rix");
  useFooterRix(row);
  return null;
}
