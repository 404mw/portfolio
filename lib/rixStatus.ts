// Rix's live-status store (ui-spec/00-rix.md R1.4): the one way to announce a line in a Rix's
// `RixStatus`, keyed like the quip (lib/rixQuip.ts) by the instance's section id. The motion
// pass's poke ladder announces `pokeLines`, `annoyedLines` and `angryLines` lines, or `throwAway`
// when the tantrum throws a pick away; on home's About the pick lock adds `lockLine` to the
// tantrum's line, says it again on a swallowed press and says `unlockLine` at the unlock (R6A.9).
// Always a whole line, never letter by letter. A line that's already there is cleared first and
// set again a moment later, so a screen reader reads the repeat. Chatter, hover lines, talk, the
// sulk and forgive lines are never announced. Empty until something is announced.
import { createLineStore } from "@/lib/lineStore";

const store = createLineStore();

/** How long (ms) the status stays empty before a repeated line is set again. */
const REPEAT_AFTER = 120;
const repeats = new Map<string, ReturnType<typeof setTimeout>>();

/** The line `key`'s status currently holds; empty if nothing has been announced. */
export const rixStatusLine = store.read;

/** Puts `text` in `key`'s status, so a screen reader announces it politely (a repeat included). */
export function announceRix(key: string, text: string) {
  const waiting = repeats.get(key);
  if (waiting !== undefined) {
    clearTimeout(waiting);
    repeats.delete(key);
  }
  if (text === "" || store.read(key) !== text) {
    store.set(key, text);
    return;
  }
  store.set(key, "");
  repeats.set(
    key,
    setTimeout(() => {
      repeats.delete(key);
      store.set(key, text);
    }, REPEAT_AFTER),
  );
}

/** Calls `listener` whenever `key`'s status changes; returns the unsubscribe. */
export const subscribeRixStatus = store.subscribe;
