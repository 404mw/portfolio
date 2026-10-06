// The set Agents and Process draw (ui-spec §0.5): the About pick's set, held back for the swap's
// fade. `lib/shownSet.ts` keeps the old set while its wrappers fade out, then changes it for every
// reader of this hook in one commit, so Agents' tab list, Process' flow and the bots' motion always
// agree. `default` with no pick, for "Not sure yet" and in the server markup. The callers' markup
// doesn't change for the fade; a section names what fades with `useSwapFade`.
import { useSyncExternalStore } from "react";
import type { AboutSet } from "@/lib/aboutPick";
import { serverShownSet, shownSet, subscribeShownSet } from "@/lib/shownSet";

export function useShownSet(): AboutSet {
  return useSyncExternalStore(subscribeShownSet, shownSet, serverShownSet);
}
