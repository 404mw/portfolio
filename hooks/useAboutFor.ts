// `?for=<key>` (ui-spec §2a.2, 02a-about-options §2a.O0.2): once, after mount, checks that reply's
// radio in group `name` (home's by default) unless the visitor has already picked one there, then
// dispatches its `change` so the WhatsApp links follow. No scroll, focus move or announcement (the
// event is untrusted, which the status ignores). Unknown keys are ignored; the URL is never
// rewritten.
import { useEffect } from "react";
import { aboutReplyIndex, checkedAboutKey } from "@/lib/aboutReplies";
import { homeAboutName } from "@/lib/aboutScope";

export function useAboutFor(name: string = homeAboutName) {
  useEffect(() => {
    const key = new URLSearchParams(window.location.search).get("for");
    if (key === null || aboutReplyIndex(key) === -1 || checkedAboutKey(name) !== null) return;
    const input = document.querySelector(`input[name="${name}"][value="${CSS.escape(key)}"]`);
    if (!(input instanceof HTMLInputElement)) return;
    input.checked = true;
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }, [name]);
}
