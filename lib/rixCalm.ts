// Rix's calm by a pick (ui-spec/00-rix.md R6A.8; a trusted pick during the tantrum, flee or sulk;
// 1.6s, then the pick), full motion. The tantrum stops where it is (a flee brakes, the shake stops;
// a sulk turns back with the rects reopening to the angry slits), and he looks at the picked card
// while the visitor's ack shows at once (the caller's). Angry, then annoyed, a sigh, neutral, then
// `happy` held to 1.6, when the caller's `done` resets the ladder and `pick` plays the normal pick.
// A toss in flight runs on to its end (R2.2).
import { gsap } from "@/lib/gsap";
import { SETTLE } from "@/lib/processBotMotion";
import { stripMotion } from "@/lib/processBotRig";
import { feet, play, timeline } from "@/lib/rixActs";
import { emotesOut, eyesTo } from "@/lib/rixEmote";
import { eyeTurn, restEyes, rixEmotions } from "@/lib/rixEmotions";
import type { RixLook } from "@/lib/rixLook";
import { CALM, LOOK_AT, TANTRUM, WALK_STOP } from "@/lib/rixMotion";
import type { Rix } from "@/lib/rixRig";
import { clampX, measureTrack, walkerX } from "@/lib/rixTrack";

export function calm(rix: Rix, look: RixLook | null, done: () => void, pick: () => void) {
  const { bot } = rix;
  const { parts, ch, loops } = bot;
  const quick = { duration: 0.25, ease: "power2.out" };
  rix.mood = "calm";
  bot.busy?.kill();
  bot.busy = null;
  const tl = timeline();
  // A flee brakes where it is.
  if (rix.walkDir !== 0) {
    tl.to(rix.walker, { x: clampX(measureTrack(rix), walkerX(rix) + rix.walkDir * WALK_STOP.brakeSlide), ...WALK_STOP.brake }, 0);
    rix.walkDir = 0;
  }
  // A wind-up cut before its release throws nothing: the prop goes back to its CSS state.
  if (rix.armed) {
    stripMotion([rix.armed]);
    rix.armed = null;
  }
  const fromSulk = rix.wall !== null;
  rix.wall = null;
  rix.hold = null;
  // 0: still angry (the sulk's rects reopen to the slits), looking at the card; the shake stops.
  eyesTo(rix, tl, rixEmotions.angry.eyes, { duration: fromSulk ? CALM.reopen : 0.06, ease: "power2.out" }, 0, eyeTurn("angry"));
  tl.call(() => {
    rix.emotion = "angry";
  })
    .to(parts.upper, { x: 0, duration: TANTRUM.shake.stop, ease: "power2.out" }, 0)
    .to(parts.upper, { scaleX: 1, scaleY: 1, y: 0, ...CALM.sulkTurn }, 0)
    .to(feet(bot), { x: 0, y: 0, ...quick }, 0)
    .to(parts.rig, { y: 0, ...quick }, 0)
    .to(ch, { tilt: 0, life: 1, ...quick }, 0)
    .to(ch, { actL: CALM.arms.l, actR: CALM.arms.r, mixL: 0, mixR: 0, duration: CALM.arms.duration, ease: "power2.out" }, 0)
    .add(emotesOut(rix, 0.1), 0);
  if (look) tl.to(ch, { look: look.d, perp: look.p, ...LOOK_AT }, 0);
  if (loops.breath) tl.to(loops.breath, { timeScale: 1, ...quick }, 0);
  // 0.35: annoyed, the slant goes.
  eyesTo(rix, tl, rixEmotions.annoyed.eyes, { duration: CALM.annoyed, ease: "power2.inOut" }, CALM.annoyedAt);
  tl.call(
    () => {
      rix.emotion = "annoyed";
    },
    [],
    CALM.annoyedAt,
  );
  // 0.6: a sigh.
  const { sigh } = CALM;
  tl.to(parts.upper, { scaleY: sigh.in, duration: sigh.inTime, ease: "sine.inOut" }, sigh.at)
    .to(parts.upper, { scaleY: sigh.out, duration: sigh.outTime, ease: "sine.inOut" }, sigh.at + sigh.inTime)
    .to(parts.upper, { scaleY: 1, ...SETTLE }, sigh.at + sigh.inTime + sigh.outTime);
  // 0.85: neutral; 1.25: happy, held to 1.6.
  eyesTo(rix, tl, restEyes, { duration: CALM.neutral, ease: "power2.inOut" }, CALM.neutralAt);
  tl.to(ch, { actL: 0, actR: 0, mixL: 1, mixR: 1, duration: CALM.neutral, ease: "power2.inOut" }, CALM.neutralAt).call(
    () => {
      rix.emotion = null;
    },
    [],
    CALM.neutralAt,
  );
  eyesTo(rix, tl, rixEmotions.happy.eyes, { duration: CALM.happy, ease: "power2.out" }, CALM.happyAt);
  tl.call(
    () => {
      rix.emotion = "happy";
    },
    [],
    CALM.happyAt,
  ).call(
    () => {
      done();
      pick();
    },
    [],
    CALM.pickAt,
  );
  gsap.set(rix.stage, { clearProps: "clipPath" });
  play(rix, tl, "calm");
}
