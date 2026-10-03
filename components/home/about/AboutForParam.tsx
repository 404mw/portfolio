"use client";
// Applies `?for=<key>` after load (ui-spec §2a.2) to the radio group `name` (lib/aboutScope.ts).
// Renders nothing.
import { useAboutFor } from "@/hooks/useAboutFor";

type AboutForParamProps = { readonly name: string };

export function AboutForParam({ name }: AboutForParamProps) {
  useAboutFor(name);
  return null;
}
