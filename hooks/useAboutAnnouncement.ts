// The text an About status announces (ui-spec §2a.2): the picked reply's ack in group `name`
// (home's by default), set only on a visitor's own change (a trusted event), never on load or
// from `?for=`. Empty until then.
import { useEffect, useState } from "react";
import { aboutReply, isAboutChange } from "@/lib/aboutReplies";
import { homeAboutName } from "@/lib/aboutScope";

export function useAboutAnnouncement(name: string = homeAboutName): string {
  const [text, setText] = useState("");
  useEffect(() => {
    const onChange = (event: Event) => {
      if (!event.isTrusted || !isAboutChange(event, name)) return;
      setText(aboutReply(event.target.value)?.ack ?? "");
    };
    document.addEventListener("change", onChange);
    return () => document.removeEventListener("change", onChange);
  }, [name]);
  return text;
}
