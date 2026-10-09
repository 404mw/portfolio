// The footer Rix's acts (ui-spec/09-footer.md §9.4 "Motion"), full motion, built only from moves the
// character sheet already has (ui-spec/00-rix.md R6.8, R8): nothing here is a move of its own.
// - A call: the `wave` beat, with a line typed into it (the caller's). The first call of the page
//   load opens with the `perk` beat. It plays as a chatter act, so the typed line's body talk runs
//   with it (R5.2), as on About.
// - The hover reaction (a fine pointer or keyboard focus on his link): the hover perk, then the small
//   wave, `REACT_COOLDOWN` apart. It cuts whatever beat is playing (R2.2) and never touches the
//   quip, so a line types and holds on through it.
// One act at a time (`play`); between calls the idle beats are lib/rixBeats.ts's own `beat`.
import { REACT_COOLDOWN } from "@/lib/processBotMotion";
import { cut, perkLength, perkUp, play, smallWave, timeline } from "@/lib/rixActs";
import { beatMove } from "@/lib/rixBeats";
import type { Rix } from "@/lib/rixRig";

const seconds = () => performance.now() / 1000;

/**
 * A call: the wave (after the perk, on the `first` call). Returns when the wave starts, in seconds
 * from now, so the caller can type its line into it.
 */
export function footerCall(rix: Rix, first: boolean): number {
  const waveAt = first ? perkLength : 0;
  const tl = timeline();
  const settle = cut(rix);
  if (settle) tl.add(settle, 0);
  if (first) tl.add(beatMove(rix, "perk"), 0);
  tl.add(beatMove(rix, "wave"), waveAt);
  play(rix, tl, "chatter");
  return waveAt;
}

/** The hover reaction: the perk, then the small wave. Ignored inside `REACT_COOLDOWN` of the last. */
export function footerHover(rix: Rix) {
  const now = seconds();
  if (now - rix.lastPerk < REACT_COOLDOWN) return;
  rix.lastPerk = now;
  const tl = timeline();
  const settle = cut(rix);
  if (settle) tl.add(settle, 0);
  tl.add(perkUp(rix.bot), 0).add(smallWave(rix.bot), perkLength);
  play(rix, tl, "perk", "reacting");
}
