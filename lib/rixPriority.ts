// Rix's rules of play (ui-spec/00-rix.md R2.1), character sheet: one act at a time, by rank. A
// higher act (lower rank) cuts a lower one; the pick is never blocked (home's About locks its cards
// through the tantrum instead, R6A.9; on the playground a pick turns the tantrum into the calm); a
// walk waits for a higher act and starts when it ends, and hover beats at a held card ride its rank;
// chatter, the perk, beats and plays only start while he stands (idle; the perk also from a patrol
// stretch, which brakes; chatter waits for it), with the mood neutral. The patrol (rank 9) only
// runs when nothing else does. Arrival blocks everything until landing. Talk is an overlay, not an
// act.
import type { Rix, RixAct } from "@/lib/rixRig";

export const rixRank: Readonly<Record<RixAct, number>> = {
  pick: 1,
  calm: 1,
  tantrum: 2,
  poke: 3,
  pet: 4,
  walk: 5,
  hover: 5,
  ask: 7,
  chatter: 7,
  perk: 8,
  beat: 8,
  play: 8,
  patrol: 9,
};

/** The mood is a tantrum, flee, sulk, forgive or calm (R6A): targets, chatter, beats and plays wait. */
export const inTantrum = (rix: Rix) => rix.mood !== "neutral" && rix.mood !== "annoyed";

/** True if `act` may start now, cutting whatever runs. */
export function mayStart(rix: Rix, act: RixAct): boolean {
  if (rix.bot.state === "entering") return false;
  if (rixRank[act] > 1 && inTantrum(rix)) return false;
  const current = rix.act;
  // Chatter, the perk, beats, plays and the patrol start only while he stands, mood neutral: from
  // idle (no act, no held emotion), or the perk from a patrol stretch (it brakes first).
  if (rixRank[act] >= rixRank.ask) {
    const fromStretch = current === "patrol" && act === "perk";
    const free = current === null ? rix.bot.state === "idle" : fromStretch;
    return free && rix.hold === null && rix.mood === "neutral";
  }
  if (current === null) return true;
  // The pick, a poke and a walk cut their own kind (a re-pick, the next poke, a retarget).
  return rixRank[act] <= rixRank[current];
}
