"use client";

// Process's motion (ui-spec §5.7, §10): the header and step text reveal on scroll, and the bots
// come alive (drop-in, life, acts, pointer follow, reactions, and the crew relay passing the job
// along the flow's steps). It renders nothing, so `ProcessSection` and its markup stay
// server-rendered. On a new flow (the About pick's set) the bots' motion lets go of the old bots
// and their run, and rigs the new ones. The set is `useShownSet`'s, the same one `ProcessFlow`
// draws and changed in the same commit, so the bots rigged are always the bots mounted.
import { useElementById } from "@/hooks/useElementById";
import { useProcessBots } from "@/hooks/useProcessBots";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useShownSet } from "@/hooks/useShownSet";
import { sectionIds } from "@/lib/routes";

export function ProcessMotion() {
  // Declared first: its layout effect fills the ref before the motion hooks' effects run.
  const section = useElementById<HTMLElement>(sectionIds.process);
  const set = useShownSet();
  useScrollReveal(section);
  useProcessBots(section, set);
  return null;
}
