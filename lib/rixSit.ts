// Rix sits on the shelf (ui-spec/00-rix.md R6.2), an idle play, full motion: the rig lowers so his
// body rests on the line and his feet hang below it, `upper` settles wide, the arms rest down, and
// the feet swing out of phase. His eyes stay with life (looks and blinks): he plays it as `idle`.
// After `SIT.length` he hops up: the rig back to 0, a squash and settle. The nap reuses the pose.
import { gsap } from "@/lib/gsap";
import { SETTLE, SQUASH } from "@/lib/processBotMotion";
import { cut, play, timeline } from "@/lib/rixActs";
import { SIT } from "@/lib/rixMotion";
import type { Rix } from "@/lib/rixRig";

/** The sitting pose from `at`; with `swing`, the feet swing for `length` seconds. */
export function sitDown(rix: Rix, tl: gsap.core.Timeline, at: number, swing: number) {
  const { parts, ch } = rix.bot;
  const [actL, actR] = SIT.arms;
  tl.to(parts.rig, { y: SIT.lower, ...SIT.in }, at)
    .to(parts.upper, { ...SIT.pose, ...SIT.in }, at)
    .to(ch, { actL, actR, mixL: 0, mixR: 0, ...SIT.in }, at);
  if (swing <= 0) return;
  const { x, y, half } = SIT.swing;
  const halves = Math.max(1, Math.floor(swing / half));
  [parts.footLeft, parts.footRight].forEach((foot, i) => {
    const side = i === 0 ? 1 : -1;
    tl.fromTo(foot, { x: -side * x }, { x: side * x, duration: half, ease: "sine.inOut", repeat: halves - 1, yoyo: true, immediateRender: false }, at + SIT.in.duration)
      .fromTo(foot, { y: -y }, { y: 0, duration: half / 2, ease: "sine.out", repeat: 2 * halves - 1, yoyo: true, immediateRender: false }, at + SIT.in.duration);
  });
}

/** Up from sitting at `at`: the rig back to 0, a squash and settle, arms and feet back. */
export function standUp(rix: Rix, tl: gsap.core.Timeline, at: number) {
  const { parts, ch } = rix.bot;
  tl.to(parts.rig, { y: 0, ...SIT.up }, at)
    .to([parts.footLeft, parts.footRight], { x: 0, y: 0, duration: SIT.up.duration, ease: "power2.out" }, at)
    .to(ch, { actL: 0, actR: 0, mixL: 1, mixR: 1, ...SIT.up }, at)
    .to(parts.upper, { ...SQUASH, duration: 0.06, ease: "power2.out" }, at + SIT.up.duration)
    .to(parts.upper, { scaleX: 1, scaleY: 1, ...SETTLE }, at + SIT.up.duration + 0.06);
}

export function sit(rix: Rix) {
  const length = gsap.utils.random(SIT.length[0], SIT.length[1]);
  const tl = timeline();
  const settle = cut(rix);
  if (settle) tl.add(settle, 0);
  sitDown(rix, tl, 0, length);
  standUp(rix, tl, SIT.in.duration + length);
  play(rix, tl, "play", "idle");
}
