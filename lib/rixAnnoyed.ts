// Rix's annoyed poke (ui-spec/00-rix.md R6A.2; pokes 4–5, ≈ 0.9s), full motion: `annoyed` eyes
// with a side-eye at the pointer (else +4 / −1), a stiff pose (no breath, sway or drift), a huff,
// two impatient right-foot taps; the caller types and announces the next `annoyedLines` line from
// 0.25. When the act ends the mood hold keeps the eyes and the stiff pose (`rix.hold`) until the
// ladder's window closes, or a walk or a pick replaces them.
import { TAP_DOWN, TAP_LIFT, TAP_UP } from "@/lib/processBotMotion";
import { cut, play, timeline } from "@/lib/rixActs";
import { emotionIn } from "@/lib/rixEmote";
import { ANNOYED_POKE } from "@/lib/rixMotion";
import type { Rix } from "@/lib/rixRig";

export function annoyedPoke(rix: Rix) {
  const { parts, ch } = rix.bot;
  const { stiff, arms, huff, taps, length } = ANNOYED_POKE;
  rix.lastPoke = performance.now() / 1000;
  const tl = timeline();
  const settle = cut(rix);
  if (settle) tl.add(settle, 0);
  tl.add(emotionIn(rix, "annoyed", { eyesOnly: true }), 0)
    .to(parts.upper, { scaleX: stiff.scaleX, scaleY: stiff.scaleY, duration: stiff.duration, ease: stiff.ease }, 0)
    .to(ch, { actL: arms.l, actR: arms.r, mixL: 0, mixR: 0, life: 0, duration: arms.duration, ease: arms.ease }, 0)
    .to(parts.upper, { y: huff.y, duration: huff.up, ease: "power2.out" }, huff.at)
    .to(parts.upper, { y: 0, duration: huff.down, ease: "power2.in" }, huff.at + huff.up);
  taps.forEach((at) => {
    tl.to(parts.footRight, { y: -TAP_LIFT, ...TAP_UP }, at).to(parts.footRight, { y: 0, ...TAP_DOWN }, at + TAP_UP.duration);
  });
  // The act lasts `length`; then the mood hold.
  tl.set({}, {}, length);
  rix.hold = "annoyed";
  play(rix, tl, "poke", "reacting");
}
