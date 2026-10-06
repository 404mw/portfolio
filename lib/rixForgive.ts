// Rix's forgive (ui-spec/00-rix.md R6A.7; after the sulk, ≈ 1.8s), full motion: he peeks back (the
// rects reopen from the wall edge to a narrow width with shy lids, still facing the wall), blinks
// once, turns back (the squeeze, tilt and slump go, the look to 0), turns `happy`, gives a small
// wave and types `forgiveLine` (never announced). At 1.8 `happy` goes and the caller's `done`
// resets the ladder and, on home's About, unlocks the picks (R6A.9). If no target holds, the idle
// clock resumes from where he stands (lib/rixIdle.ts; on the playground, the patrol); a target that
// still holds starts a walk and hover mode (lib/rixWander.ts).
import { BLINK_CLOSE, BLINK_OPEN, timed } from "@/lib/processBotMotion";
import { play, smallWave, timeline } from "@/lib/rixActs";
import { emotionIn, emotionOut, eyesTo } from "@/lib/rixEmote";
import { peekEyes, type Wall } from "@/lib/rixEmotions";
import { FORGIVE, POSE_BACK, TALK } from "@/lib/rixMotion";
import type { Rix } from "@/lib/rixRig";

export function forgive(rix: Rix, wall: Wall, line: string, done: () => void) {
  const { bot } = rix;
  const { parts, ch, loops } = bot;
  const { peek, blinkAt, turnAt, turn, look, happyAt, waveAt, length } = FORGIVE;
  rix.mood = "forgive";
  const tl = timeline();
  const open = peekEyes(wall, peek.width);
  eyesTo(rix, tl, open, timed(peek), 0);
  // One blink on the narrow peek.
  tl.to(parts.eye, { attr: { y: (i: number) => (open[i] ?? open[0])[1] + (open[i] ?? open[0])[3] / 2, height: 0 }, ...BLINK_CLOSE }, blinkAt).to(
    parts.eye,
    { attr: { y: (i: number) => (open[i] ?? open[0])[1], height: (i: number) => (open[i] ?? open[0])[3] }, ...BLINK_OPEN },
    blinkAt + BLINK_CLOSE.duration,
  );
  // The turn back.
  tl.to(parts.upper, { scaleX: 1, scaleY: 1, y: 0, ...turn }, turnAt)
    .to(ch, { tilt: 0, actL: 0, actR: 0, mixL: 1, mixR: 1, ...turn }, turnAt)
    .to(ch, { look: bot.restLook, perp: 0, ...look }, turnAt)
    .call(
      () => {
        rix.wall = null;
      },
      [],
      turnAt,
    );
  if (loops.breath) tl.to(loops.breath, { timeScale: 1, duration: turn.duration, ease: POSE_BACK }, turnAt);
  tl.add(emotionIn(rix, "happy"), happyAt)
    .add(smallWave(bot), waveAt)
    .call(() => rix.say(line, { style: "type" }), [], TALK.afterForgive)
    .add(emotionOut(rix, "happy"), length)
    .call(done, [], length);
  play(rix, tl, "tantrum");
}
