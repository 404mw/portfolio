"use client";
// An About live status (ui-spec §2a.2): announces the ack after a visitor's own pick, politely,
// for the radio group `name` (lib/aboutScope.ts).
import { useAboutAnnouncement } from "@/hooks/useAboutAnnouncement";

type AboutStatusProps = { readonly name: string };

export function AboutStatus({ name }: AboutStatusProps) {
  const text = useAboutAnnouncement(name);
  return (
    <p className="sr-only" aria-live="polite">
      {text}
    </p>
  );
}
