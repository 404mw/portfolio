// The visitor's About pick (ui-spec §2a.2, 02a-about-options §2a.O0.2): the checked radio in home's
// About group is the one source of truth, read on every `change` on that group. Null with no pick,
// and on the server.
import { useSyncExternalStore } from "react";
import { checkedAboutKey, isAboutChange } from "@/lib/aboutReplies";
import { homeAboutName } from "@/lib/aboutScope";

const serverKey = () => null;
const read = () => checkedAboutKey(homeAboutName);

function subscribe(onStoreChange: () => void) {
  const onChange = (event: Event) => {
    if (isAboutChange(event, homeAboutName)) onStoreChange();
  };
  document.addEventListener("change", onChange);
  return () => document.removeEventListener("change", onChange);
}

export function useAboutPick(): string | null {
  return useSyncExternalStore(subscribe, read, serverKey);
}
