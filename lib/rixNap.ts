// Rix's nap and wake (ui-spec/00-rix.md R6.3), full motion. The nap (after `NAP_AFTER` of visitor
// idle, the caller's gate; wherever he stands, never mid-stretch; the patrol stops while he
// sleeps and resumes `PATROL.resume` after the wake): `sleepy`, a yawn, two nods, then he sits
// (no swing), his eyes go to Process's nap slit, breathing slows and the zzz rise (Process's
// `startZzz`); he sleeps until the
// visitor returns. The wake with a start: the zzz fade, `surprised` with the alert emote, a hop up
// from sitting, a squash and settle, a look at the pointer (or ahead), a double blink, then `happy`.
import { blink, napLife } from "@/lib/processBotLife";
import { startZzz } from "@/lib/processBotActs";
import { SETTLE, SQUASH } from "@/lib/processBotMotion";
import { eyeAttr } from "@/lib/processBotRig";
import { cut, play, timeline } from "@/lib/rixActs";
import { emoteIn, emotesOut, emotionIn, emotionOut } from "@/lib/rixEmote";
import { rixEmotions } from "@/lib/rixEmotions";
import { LOOK_AT, NAP_SIT_AT, NOD, SIT, WAKE_START, YAWN } from "@/lib/rixMotion";
import type { Rix } from "@/lib/rixRig";
import { sitDown } from "@/lib/rixSit";
import { pointerLookOf } from "@/lib/rixTargets";

export function nap(rix: Rix) {
  const { bot, crew } = rix;
  const { parts, ch } = bot;
  const tl = timeline();
  const settle = cut(rix);
  if (settle) tl.add(settle, 0);
  tl.add(emotionIn(rix, "sleepy"), 0);
  // The yawn: tall and narrow, arms up, a hold, back down.
  const [yawnL, yawnR] = YAWN.arms;
  const [sleepyL, sleepyR] = rixEmotions.sleepy.arms;
  const down = YAWN.at + YAWN.up + YAWN.hold;
  tl.to(parts.upper, { ...YAWN.pose, duration: YAWN.up, ease: "power2.out" }, YAWN.at)
    .to(ch, { actL: yawnL, actR: yawnR, mixL: 0, mixR: 0, duration: YAWN.up, ease: "power2.out" }, YAWN.at)
    .to(parts.upper, { scaleX: 1, scaleY: 1, duration: YAWN.down, ease: "power2.inOut" }, down)
    .to(ch, { actL: sleepyL, actR: sleepyR, duration: YAWN.down, ease: "power2.inOut" }, down);
  // Two nods.
  for (let i = 0; i < NOD.count; i += 1) {
    const at = NOD.at + i * (NOD.down + NOD.snap);
    tl.to(ch, { tilt: NOD.tilt, duration: NOD.down, ease: "sine.inOut" }, at).to(
      ch,
      { tilt: 0, duration: NOD.snap, ease: "power2.out" },
      at + NOD.down,
    );
  }
  // He sits and sleeps: the slit, slow breath, the zzz.
  sitDown(rix, tl, NAP_SIT_AT, 0);
  tl.to(parts.eye, { attr: eyeAttr(bot, "slit"), duration: 0.3, ease: "power2.inOut" }, NAP_SIT_AT)
    .add(napLife(bot, true), NAP_SIT_AT)
    .call(
      () => {
        bot.state = "napping";
        startZzz(bot, crew);
      },
      [],
      NAP_SIT_AT + SIT.in.duration,
    );
  play(rix, tl, "play");
}

/** Wakes a napping Rix with a start. */
export function wake(rix: Rix) {
  const { bot } = rix;
  const { parts, ch } = bot;
  const { zzzOut, hop, up, down, lookAt, alert, blinkAt, glad, happy } = WAKE_START;
  const tl = timeline();
  const settle = cut(rix);
  if (settle) tl.add(settle, 0);
  // The emote waits for the zzz to fade: never both at once.
  tl.add(emotionIn(rix, "surprised", { eyesOnly: true, skipEmote: true }), 0)
    .add(emoteIn(rix, "alert"), zzzOut)
    .to(parts.rig, { y: hop, duration: up, ease: "power2.out" }, 0)
    .to(parts.rig, { y: 0, duration: down, ease: "power2.in" }, up)
    .to(parts.upper, { ...SQUASH, duration: 0.06, ease: "power2.out" }, up + down)
    .to(parts.upper, { scaleX: 1, scaleY: 1, ...SETTLE }, up + down + 0.06);
  const look = pointerLookOf(rix) ?? { d: 0, p: 0 };
  tl.to(ch, { look: look.d, perp: look.p, ...LOOK_AT }, lookAt)
    .add(emotesOut(rix), alert)
    .add(emotionOut(rix, "surprised", { eyesOnly: true, keepLook: true }), alert)
    .add(blink(bot, true), blinkAt)
    .add(emotionIn(rix, "happy"), glad)
    .add(emotionOut(rix, "happy"), glad + happy);
  play(rix, tl, "play", "reacting");
}
