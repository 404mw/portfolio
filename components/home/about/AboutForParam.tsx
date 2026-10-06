"use client";
// The pick on arrival and its memory (ui-spec §0.5, 02a-about-options §2a.R4), for the radio group
// `name` (lib/aboutScope.ts): remembers every change for the visit, and after load applies `?for=`
// or, failing that, the remembered pick. Renders nothing.
import { useAboutFor } from "@/hooks/useAboutFor";
import { useAboutRemember } from "@/hooks/useAboutRemember";

type AboutForParamProps = { readonly name: string };

export function AboutForParam({ name }: AboutForParamProps) {
  // Declared first, so its listener is on before `useAboutFor` dispatches a change.
  useAboutRemember(name);
  useAboutFor(name);
  return null;
}
