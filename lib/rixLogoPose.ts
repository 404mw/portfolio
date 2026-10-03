// Rix's logo pose and wink (ui-spec/00-rix.md R6.6), an idle play, full motion: life's share goes
// to 0 and he looks ahead, his arms fold to `scaleX` 0 about the shoulders so he *is* the mark, a
// hold, a right-eye wink, then the arms come back, life comes back, and `happy`.
import { BLINK_SHUT } from "@/lib/processBotMotion";
import { cut, play, timeline } from "@/lib/rixActs";
import { emotionIn, emotionOut } from "@/lib/rixEmote";
import { LOGO_POSE } from "@/lib/rixMotion";
import type { Rix } from "@/lib/rixRig";

export function logoPose(rix: Rix) {
  const { bot, eyeRects } = rix;
  const { parts, ch } = bot;
  const { lifeOut, armsAt, arms, winkAt, wink, backAt, back, happy } = LOGO_POSE;
  const arm = [parts.armLeft, parts.armRight];
  const [, , , height] = eyeRects[1] ?? [0, 0, 0, 0];
  const y = eyeRects[1]?.[1] ?? 0;
  const right = parts.eye[1];
  const tl = timeline();
  const settle = cut(rix);
  if (settle) tl.add(settle, 0);
  tl.to(ch, { life: 0, look: bot.restLook, perp: 0, actL: 0, actR: 0, mixL: 0, mixR: 0, duration: lifeOut, ease: "power2.inOut" }, 0)
    .to(arm, { scaleX: 0, ...arms }, armsAt);
  if (right) {
    tl.to(right, { attr: { y: y + BLINK_SHUT, height: 0 }, duration: wink.shut, ease: "power2.in" }, winkAt).to(
      right,
      { attr: { y, height }, duration: wink.open, ease: "power2.out" },
      winkAt + wink.shut + wink.hold,
    );
  }
  tl.to(arm, { scaleX: 1, ...back }, backAt)
    .to(ch, { life: 1, mixL: 1, mixR: 1, ...back }, backAt)
    .add(emotionIn(rix, "happy"), backAt)
    .add(emotionOut(rix, "happy"), backAt + happy);
  play(rix, tl, "play");
}
