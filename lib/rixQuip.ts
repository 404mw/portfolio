// Rix's quip store (02a-about-options §2a.O0.1, §2a.O4): the one way to show a line in a Rix's
// quip, keyed per Rix instance: About's section id (`about` on `/`), `rix-playground` on
// /rix, or `footerRixQuipKey` for the Rix on the footer's line. The motion pass's quip (lib/rixQuipMotion.ts) calls `sayRix` for every line (pokes,
// chatter, hover lines, talk); `RixQuip` renders the current line. Saying a
// line announces nothing: announcing is lib/rixStatus.ts. Empty until something is said.
import { createLineStore } from "@/lib/lineStore";

const store = createLineStore();

/** The footer Rix's key (ui-spec/09-footer.md §9.4): he has no section id, so it lives here. */
export const footerRixQuipKey = "footer-rix";

/** The current quip line for `key`; empty if nothing has been said. */
export const rixQuipLine = store.read;

/** Shows `text` in `key`'s quip (it replaces the current line). */
export const sayRix = store.set;

/** Calls `listener` whenever `key`'s line changes; returns the unsubscribe. */
export const subscribeRixQuip = store.subscribe;
