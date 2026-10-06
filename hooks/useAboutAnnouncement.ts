// The text an About status announces (ui-spec §2a.2, 02a-about-options §2a.R3): the picked reply's
// ack in group `name` (home's by default), plus the shared "set for you" line when the pick has its
// own set, as one line. Set only on a visitor's own change (a trusted event), never on load, from
// `?for=`, from the memory or from a "Shown for" tag. Empty until then.
import { useEffect, useState } from "react";
import { about } from "@/content/home";
import { pickSet } from "@/lib/aboutPick";
import { aboutReply, isAboutChange } from "@/lib/aboutReplies";
import { homeAboutName } from "@/lib/aboutScope";

export function useAboutAnnouncement(name: string = homeAboutName): string {
  const [text, setText] = useState("");
  useEffect(() => {
    const onChange = (event: Event) => {
      if (!event.isTrusted || !isAboutChange(event, name)) return;
      const reply = aboutReply(event.target.value);
      if (!reply) setText("");
      else setText(pickSet(reply.key) === "default" ? reply.ack : `${reply.ack} ${about.ackSet}`);
    };
    document.addEventListener("change", onChange);
    return () => document.removeEventListener("change", onChange);
  }, [name]);
  return text;
}
