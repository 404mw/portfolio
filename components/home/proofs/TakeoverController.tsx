"use client";

// Runs the takeovers' hash behaviour (hooks/useHashTakeover.ts) with their motion
// (hooks/useTakeoverMotion.ts) around it. Renders nothing.
import { useHashTakeover } from "@/hooks/useHashTakeover";
import { useTakeoverMotion } from "@/hooks/useTakeoverMotion";
import { takeoverIds } from "@/lib/proofs";
import { routes } from "@/lib/routes";

export function TakeoverController() {
  // Declared first: its layout effect sets up the motion before the hash is first read.
  const transitions = useTakeoverMotion(takeoverIds);
  useHashTakeover(takeoverIds, routes.proofs, transitions);
  return null;
}
