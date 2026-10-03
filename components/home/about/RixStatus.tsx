"use client";
// Rix's live status (02a-about-options §2a.O0.1, ui-spec/00-rix.md R1.4): a sibling of
// `RixButton`'s walker, holding the line last announced for `statusKey` (the About instance's
// section id) through lib/rixStatus.ts: from the motion pass's poke ladder, a `pokeLines`,
// `annoyedLines` or `angryLines` line, or `about.rix.throwAway`. A screen
// reader announces each politely, as a whole line.
import { useKeyedLine } from "@/hooks/useKeyedLine";
import { rixStatusLine, subscribeRixStatus } from "@/lib/rixStatus";

type RixStatusProps = { readonly statusKey: string };

export function RixStatus({ statusKey }: RixStatusProps) {
  const line = useKeyedLine(rixStatusLine, subscribeRixStatus, statusKey);
  return (
    <p className="sr-only" aria-live="polite">
      {line}
    </p>
  );
}
