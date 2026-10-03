// Rix's live-status store (ui-spec/00-rix.md R1.4): the one way to announce a line in a Rix's
// `RixStatus`, keyed like the quip (lib/rixQuip.ts) by the instance's section id. The motion
// pass's poke ladder announces `pokeLines`, `annoyedLines` and `angryLines` lines, or `throwAway`
// when the tantrum throws a pick away. Always a whole line, never letter by letter. Nudges, talk, the sulk and forgive lines
// are never announced. Empty until something is announced.
import { createLineStore } from "@/lib/lineStore";

const store = createLineStore();

/** The line `key`'s status currently holds; empty if nothing has been announced. */
export const rixStatusLine = store.read;

/** Puts `text` in `key`'s status, so a screen reader announces it politely. */
export const announceRix = store.set;

/** Calls `listener` whenever `key`'s status changes; returns the unsubscribe. */
export const subscribeRixStatus = store.subscribe;
