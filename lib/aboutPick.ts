// The pick (ui-spec §0.5): a visitor's About card. The checked radio in About's group is the one
// source of truth (`hooks/useAboutPick.ts` reads it). `pickSet` turns a pick into the set Agents
// and Process draw; `setAboutPick` sets the pick from outside About (the "Shown for" tag, `?for=`,
// the visit's memory) by checking that radio and dispatching an untrusted, bubbling `change`, so
// Rix shows the emblem with no act and About's status stays silent. DOM only: no focus move, no
// scroll, and the URL is never rewritten.
import { aboutReply, type AboutReply } from "@/lib/aboutReplies";
import { homeAboutName } from "@/lib/aboutScope";

/** The card that keeps the shared content: "Not sure yet". */
const sharedKey = "not-sure";

/** A content set: `default` (no pick, or "Not sure yet"), or a card's own. */
export type AboutSet = "default" | Exclude<AboutReply["key"], typeof sharedKey>;

/** The set a pick draws: no pick, an unknown key or "Not sure yet" gives `default`. */
export function pickSet(key: string | null): AboutSet {
  const reply = aboutReply(key);
  if (!reply || reply.key === sharedKey) return "default";
  return reply.key;
}

/**
 * Checks the radio for `key` in About group `name` (home's by default) and dispatches its `change`.
 * Returns false if there's no such radio; a radio that's already checked is left alone.
 */
export function setAboutPick(key: string, name: string = homeAboutName): boolean {
  const input = document.querySelector(`input[name="${name}"][value="${CSS.escape(key)}"]`);
  if (!(input instanceof HTMLInputElement)) return false;
  if (input.checked) return true;
  input.checked = true;
  input.dispatchEvent(new Event("change", { bubbles: true }));
  return true;
}
