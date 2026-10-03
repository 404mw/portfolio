// Rix's rules of play (ui-spec/00-rix.md R2.1), character sheet: one act at a time, by rank. A
// higher act (lower rank) cuts a lower one; the pick is never blocked; the tantrum (stomp, toss,
// flee, sulk, forgive) is outranked only by the pick, which turns it into the calm; a walk waits
// for a higher act and starts when it ends; nudges, the perk and plays only start while he stands
// (idle, or for a nudge or the perk a patrol stretch, which brakes), with the mood neutral. The
// patrol (rank 9) only runs when nothing else does. Arrival blocks everything until landing. Talk
// is an overlay, not an act.
import type { Rix, RixAct } from "@/lib/rixRig";

export const rixRank: Readonly<Record<RixAct, number>> = {
  pick: 1,
  calm: 1,
  tantrum: 2,
  poke: 3,
  pet: 4,
  walk: 5,
  ask: 7,
  nudge: 7,
  perk: 8,
  play: 8,
  patrol: 9,
};

/** The mood is a tantrum, flee, sulk, forgive or calm (R6A): targets, nudges and plays wait. */
export const inTantrum = (rix: Rix) => rix.mood !== "neutral" && rix.mood !== "annoyed";

/** True if `act` may start now, cutting whatever runs. */
export function mayStart(rix: Rix, act: RixAct): boolean {
  if (rix.bot.state === "entering") return false;
  if (rixRank[act] > 1 && inTantrum(rix)) return false;
  const current = rix.act;
  // Nudges, the perk, plays and the patrol start only while he stands, mood neutral: from idle (no
  // act, no held emotion), or a nudge or the perk from a patrol stretch (it brakes first).
  if (rixRank[act] >= rixRank.ask) {
    const fromStretch = current === "patrol" && (act === "nudge" || act === "perk");
    const free = current === null ? rix.bot.state === "idle" : fromStretch;
    return free && rix.hold === null && rix.mood === "neutral";
  }
  if (current === null) return true;
  // The pick, a poke and a walk cut their own kind (a re-pick, the next poke, a retarget).
  return rixRank[act] <= rixRank[current];
}
