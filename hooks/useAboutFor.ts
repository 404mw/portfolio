// The pick on arrival (ui-spec §0.5), once, after mount, for About group `name` (home's by
// default). A `?for=<key>` link wins the first time that link value is seen this visit: it's
// applied and stored as the visit's link. Otherwise the remembered pick is applied, unless the
// visitor has already picked. So a shared link wins on arrival, and the visitor's own later pick
// survives a reload. `setAboutPick` dispatches an untrusted `change`, so the WhatsApp links, Agents
// and Process follow with no scroll, focus move or announcement. Unknown keys are ignored; the URL
// is never rewritten.
import { useEffect } from "react";
import { rememberLink, rememberedLink, rememberedPick } from "@/lib/aboutMemory";
import { setAboutPick } from "@/lib/aboutPick";
import { aboutReplyIndex, checkedAboutKey } from "@/lib/aboutReplies";
import { homeAboutName } from "@/lib/aboutScope";

export function useAboutFor(name: string = homeAboutName) {
  useEffect(() => {
    const link = new URLSearchParams(window.location.search).get("for");
    if (link !== null && aboutReplyIndex(link) !== -1 && link !== rememberedLink()) {
      if (setAboutPick(link, name)) rememberLink(link);
      return;
    }
    const remembered = rememberedPick();
    if (remembered === null || aboutReplyIndex(remembered) === -1) return;
    if (checkedAboutKey(name) !== null) return;
    setAboutPick(remembered, name);
  }, [name]);
}
