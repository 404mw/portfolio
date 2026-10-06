// Remembers the About pick for the visit (ui-spec §0.5): on every `change` in group `name` (home's
// by default) it writes the checked key to session storage, and forgets it when nothing is checked
// (the tantrum's deselect). Trusted or not: a pick set by a "Shown for" tag is remembered too.
import { useEffect } from "react";
import { rememberPick } from "@/lib/aboutMemory";
import { checkedAboutKey, isAboutChange } from "@/lib/aboutReplies";
import { homeAboutName } from "@/lib/aboutScope";

export function useAboutRemember(name: string = homeAboutName) {
  useEffect(() => {
    const onChange = (event: Event) => {
      if (isAboutChange(event, name)) rememberPick(checkedAboutKey(name));
    };
    document.addEventListener("change", onChange);
    return () => document.removeEventListener("change", onChange);
  }, [name]);
}
