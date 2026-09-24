"use client";

// Runs the takeovers' hash behaviour (hooks/useHashTakeover.ts). Renders nothing.
import { useHashTakeover } from "@/hooks/useHashTakeover";
import { takeoverIds } from "@/lib/proofs";
import { routes } from "@/lib/routes";

export function TakeoverController() {
  useHashTakeover(takeoverIds, routes.proofs);
  return null;
}
