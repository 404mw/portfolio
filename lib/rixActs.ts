// Rix's acts (ui-spec 02a-about-options §2a.O4; ui-spec/00-rix.md R2), full motion: the happy poke
// (a giggle bounce), the hover perk, the wave (the ask after landing) and the chatter acts (R5.4;
// the first was the nudge), and the shared moves the other acts use: the bounce, the hop, the
// perk's move, the two waves, `play` (one act at a time, `bot.busy`, `rix.act`), `cut` (R2.2) and
// `brake` (a cut that leaves him idle where he stands). Starting an act stops Process's idle
// moves in progress; cutting one eases every part it may have moved back to rest first, so nothing
// is left stranded. The cut also resets the character sheet: the emotion (eyes, slant and
// diamonds, love's beat and sway, the glyph and its loop), the sit and peek-a-boo (`rig y`, the
// stage clip), the shake (`upper x`), the logo pose (the arms' `scaleX`) and props out of the
// hand, wakes a nap, and brakes a walk; a held emotion (`rix.hold`) keeps the bot out of
// idle until it's released. Tweens that share a property use `overwrite: "auto"`: whichever starts
// last owns it. Everything runs in the crew, so it pauses with the instance.
import { gsap } from "@/lib/gsap";
import { napLife, quietIdle } from "@/lib/processBotLife";
import { ANTICIPATE, POP_SCALE, REACT_COOLDOWN, SETTLE, SQUASH, STRETCH } from "@/lib/processBotMotion";
import { stripMotion, type Bot, type BotState } from "@/lib/processBotRig";
import { restEyes } from "@/lib/rixEmotions";
import { emotesOut, emotionIn, emotionOut, eyesTo } from "@/lib/rixEmote";
import type { GlyphCue } from "@/lib/rixGlyphLoops";
import type { RixLook } from "@/lib/rixLook";
import {
  HOP,
  IDLE_TALK,
  LOOK_AT,
  LOOK_BACK,
  NUDGE_BOUNCE,
  PERK,
  PET,
  POKE,
  PROP_OUT,
  PROP_PIVOT,
  WALK_STOP,
  WAVE,
  WAVE_SMALL,
  type Bounce,
} from "@/lib/rixMotion";
import type { Rix, RixAct } from "@/lib/rixRig";
import { clampX, measureTrack, walkerX } from "@/lib/rixTrack";

const seconds = () => performance.now() / 1000;
export const timeline = () => gsap.timeline({ defaults: { overwrite: "auto" } });
export const feet = (bot: Bot) => [bot.parts.footLeft, bot.parts.footRight];

// Shared moves.

/** The eyes pop wide and ease back. */
export function eyePop(bot: Bot): gsap.core.Timeline {
  return timeline()
    .to(bot.parts.eye, { scale: POP_SCALE, duration: 0.1, ease: "power2.out" }, 0)
    .to(bot.parts.eye, { scale: 1, duration: 0.3, ease: "power2.inOut" }, 0.1);
}

/** A bounce with the feet planted: anticipate, lift stretched, down, squash, settle. */
export function bounce(bot: Bot, { anticipate, lift, up, down, squash }: Bounce): gsap.core.Timeline {
  const { upper } = bot.parts;
  const fall = anticipate + up;
  const land = fall + down;
  return timeline()
    .to(upper, { ...ANTICIPATE, duration: anticipate, ease: "power2.out" }, 0)
    .to(upper, { y: lift, ...STRETCH, duration: up, ease: "power2.out" }, anticipate)
    .to(upper, { y: 0, duration: down, ease: "power2.in" }, fall)
    .to(upper, { ...SQUASH, duration: squash, ease: "power2.out" }, land)
    .to(upper, { scaleX: 1, scaleY: 1, ...SETTLE }, land + squash);
}

/** The hop's length, to the end of its squash (0.5s); the settle follows. */
export const hopLength = HOP.anticipate + HOP.up + HOP.down + HOP.squash;

/** A hop in place (`HOP`; R6.8, R4.9): the bounce with the feet off the floor, as the poke lifts them. */
export function hop(bot: Bot): gsap.core.Timeline {
  const fall = HOP.anticipate + HOP.up;
  return timeline()
    .add(bounce(bot, HOP), 0)
    .to(feet(bot), { y: HOP.feet, ...HOP.feetUp }, fall - HOP.feetUp.duration)
    .to(feet(bot), { y: 0, ...HOP.feetDown }, fall);
}

/** The perk's move (`PERK`): the eyes pop and he stands tall, then `SETTLE`. */
export function perkUp(bot: Bot): gsap.core.Timeline {
  const { upper } = bot.parts;
  const { scaleX, scaleY, duration, ease } = PERK;
  return timeline()
    .add(eyePop(bot), 0)
    .to(upper, { scaleX, scaleY, duration, ease }, 0)
    .to(upper, { scaleX: 1, scaleY: 1, ...SETTLE }, duration);
}

/** The wave's length (1.0s). */
export const waveLength = WAVE.up.duration + 2 * WAVE.swing.duration + WAVE.back.duration;

/** The wave on `arm-right`: up, two swings, back (1.0s); the arm's drift steps aside meanwhile. */
export function wave(bot: Bot): gsap.core.Timeline {
  const { up, swing, back } = WAVE;
  const swings = up.duration + 2 * swing.duration;
  return timeline()
    .to(bot.ch, { actR: up.angle, mixR: 0, duration: up.duration, ease: up.ease }, 0)
    .to(bot.ch, { actR: up.angle + swing.by, duration: swing.duration, ease: swing.ease }, up.duration)
    .to(bot.ch, { actR: up.angle - swing.by, duration: swing.duration, ease: swing.ease }, up.duration + swing.duration)
    .to(bot.ch, { actR: 0, mixR: 1, ...back }, swings);
}

/** The small wave's length (≈ 0.74s). */
export const smallWaveLength = WAVE_SMALL.up.duration + 2 * WAVE_SMALL.swing.duration + WAVE_SMALL.back.duration;

/** Where an arm goes back to after a wave: at rest by default (act 0, drifting again). */
export type ArmRest = { readonly act: number; readonly mix: number };

/**
 * The small wave (`WAVE_SMALL`: the forgive, the post-pick chatter, the hover `point`) on one arm:
 * up, two swings, back to `rest`. The left arm mirrors the right (+ raises it).
 */
export function smallWave(bot: Bot, arm: "left" | "right" = "right", rest: ArmRest = { act: 0, mix: 1 }): gsap.core.Timeline {
  const { up, swing, back } = WAVE_SMALL;
  const [act, mix] = arm === "left" ? (["actL", "mixL"] as const) : (["actR", "mixR"] as const);
  const side = arm === "left" ? -1 : 1;
  const swings = up.duration;
  return timeline()
    .to(bot.ch, { [act]: side * up.angle, [mix]: 0, duration: up.duration, ease: up.ease }, 0)
    .to(bot.ch, { [act]: side * (up.angle + swing.by), duration: swing.duration, ease: swing.ease }, swings)
    .to(bot.ch, { [act]: side * (up.angle - swing.by), duration: swing.duration, ease: swing.ease }, swings + swing.duration)
    .to(bot.ch, { [act]: rest.act, [mix]: rest.mix, ...back }, swings + 2 * swing.duration);
}

/** Adds a look at `look` at `at`, eased back to rest at `back` (if given). */
export function lookFor(bot: Bot, tl: gsap.core.Timeline, look: Pick<RixLook, "d" | "p"> | null, at: number, back?: number) {
  if (!look) return;
  tl.to(bot.ch, { look: look.d, perp: look.p, ...LOOK_AT }, at);
  if (back !== undefined) tl.to(bot.ch, { look: bot.restLook, perp: 0, ...LOOK_BACK }, back);
}

// Playing and cutting.

/**
 * Makes `tl` Rix's one current act; when it finishes he's idle again (or, with an emotion held,
 * still out of idle until it's released; or asleep, after the nap's way down), and his eyes are
 * handed back.
 */
export function play(rix: Rix, tl: gsap.core.Timeline, act: RixAct, state: BotState = "acting") {
  const { bot, crew } = rix;
  quietIdle(bot, crew);
  bot.busy?.kill();
  bot.busy = tl;
  bot.state = state;
  rix.act = act;
  rix.onState();
  tl.eventCallback("onComplete", () => {
    if (bot.busy !== tl) return;
    bot.busy = null;
    if (bot.state === "napping") return;
    bot.state = rix.hold ? "acting" : "idle";
    rix.act = null;
    rix.onState();
  });
  crew.run(tl);
}

/** Releases a held emotion: back to rest, and idle (unless an act is still finishing). */
export function releaseHold(rix: Rix) {
  const { hold, bot, crew } = rix;
  if (!hold) return;
  rix.hold = null;
  crew.run(emotionOut(rix, hold));
  if (rix.act !== null || bot.busy) return;
  bot.state = "idle";
  rix.onState();
}

/** Props out of the hand (juggle, balance): back in the hand if picked, else `PROP_OUT`. */
function settleLoose(rix: Rix, tl: gsap.core.Timeline) {
  const loose = rix.loose;
  rix.loose = [];
  loose.forEach((prop) => {
    const kept = rix.picked !== null && prop.dataset.propFor === String(rix.picked);
    if (kept) {
      tl.to(prop, { x: 0, y: 0, rotation: 0, scale: 1, duration: 0.25, ease: "power2.out" }, 0).call(
        () => keepProp(rix, prop),
        [],
        0.25,
      );
    } else {
      gsap.set(prop, { svgOrigin: PROP_PIVOT });
      tl.to(prop, { scale: PROP_OUT.to, opacity: 0, x: 0, y: 0, rotation: 0, duration: PROP_OUT.duration, ease: PROP_OUT.ease }, 0).call(
        () => stripMotion([prop]),
        [],
        PROP_OUT.duration,
      );
    }
  });
}

/**
 * A prop left in the hand at rest: its inline motion goes and CSS `:has` shows it; on the sheet
 * (no radios) it keeps inline opacity 1.
 */
export function keepProp(rix: Rix, prop: SVGGElement) {
  stripMotion([prop]);
  if (rix.pinProps) gsap.set(prop, { opacity: 1 });
}

/** The character sheet's extra resets (R2.2), added to the cut at its time 0. */
function cutCharacter(rix: Rix, tl: gsap.core.Timeline, napping: boolean) {
  const { bot } = rix;
  const { parts, ch, loops } = bot;
  const quick = { duration: 0.25, ease: "power2.out" };
  if (napping) {
    bot.zzz?.kill();
    bot.zzz = null;
    if (parts.z.length > 0) tl.to(parts.z, { opacity: 0, duration: 0.15 }, 0);
    tl.add(napLife(bot, false), 0);
  }
  rix.loveLoop?.kill();
  rix.loveLoop = null;
  eyesTo(rix, tl, restEyes, { duration: napping ? 0.15 : 0.08, ease: "power2.out" }, 0);
  tl.add(emotesOut(rix, 0.1), 0)
    .to(parts.rig, { y: 0, ...quick }, 0)
    .to(parts.upper, { x: 0, ...quick }, 0)
    .to([parts.armLeft, parts.armRight], { scaleX: 1, ...quick }, 0)
    .to(ch, { life: 1, ...quick }, 0)
    .set(rix.stage, { clearProps: "clipPath" }, 0);
  if (loops.breath) tl.to(loops.breath, { timeScale: 1, ...quick }, 0);
  if (loops.sway) tl.to(loops.sway, { timeScale: 1, ...quick }, 0);
  settleLoose(rix, tl);
  if (rix.armed) {
    stripMotion([rix.armed]);
    rix.armed = null;
  }
  // A walk brakes: a short slide on in its direction, never off the shelf.
  if (rix.walkDir !== 0) {
    const track = measureTrack(rix);
    tl.to(rix.walker, { x: clampX(track, walkerX(rix) + rix.walkDir * WALK_STOP.brakeSlide), ...WALK_STOP.brake }, 0);
    rix.walkDir = 0;
  }
  rix.emotion = null;
  rix.hold = null;
}

/** Stops the current act and returns the move that eases every part back to rest (null if none). */
export function cut(rix: Rix): gsap.core.Timeline | null {
  const { bot } = rix;
  const napping = bot.state === "napping";
  const lingering = napping || rix.hold !== null || rix.emotion !== null || rix.loose.length > 0 || rix.walkDir !== 0;
  if (!bot.busy && !lingering) return null;
  bot.busy?.kill();
  bot.busy = null;
  rix.act = null;
  if (napping) bot.state = "acting";
  const { parts, ch } = bot;
  const quick = { duration: 0.25, ease: "power2.out" };
  const tl = timeline()
    .to(ch, { tilt: 0, actL: 0, actR: 0, mixL: 1, mixR: 1, duration: 0.3, ease: "power2.out" }, 0)
    .to(feet(bot), { x: 0, y: 0, ...quick }, 0)
    .to(parts.upper, { y: 0, scaleX: 1, scaleY: 1, ...quick }, 0)
    .to(parts.eye, { scale: 1, duration: 0.08, ease: "power2.out" }, 0);
  cutCharacter(rix, tl, napping);
  return tl;
}

/** Cuts the current act where he stands and leaves him idle (a stretch or walk brakes in place). */
export function brake(rix: Rix) {
  const settle = cut(rix);
  if (settle) rix.crew.run(settle);
  if (rix.bot.state !== "napping") rix.bot.state = rix.hold ? "acting" : "idle";
  rix.onState();
}

// Acts.

/**
 * The giggle bounce (O4 poke): `happy` with `cue` above his head, a hop, a squash, three quick
 * tilts, `happy` out at 0.9.
 */
function giggle(rix: Rix, tl: gsap.core.Timeline, cue: GlyphCue) {
  const { bot } = rix;
  const { upper } = bot.parts;
  tl.to(upper, { ...ANTICIPATE, duration: 0.08, ease: "power2.out" }, 0)
    .add(emotionIn(rix, "happy", { emote: cue }), 0)
    .to(upper, { y: POKE.lift, ...STRETCH, duration: 0.18, ease: "power2.out" }, 0.08)
    .to(feet(bot), { y: POKE.feet, duration: 0.14, ease: "power2.out" }, 0.12)
    .to(feet(bot), { y: 0, duration: 0.12, ease: "power2.in" }, 0.26)
    .to(upper, { y: 0, duration: 0.16, ease: "power2.in" }, 0.26)
    .to(upper, { ...SQUASH, duration: 0.06, ease: "power2.out" }, 0.42)
    .to(upper, { scaleX: 1, scaleY: 1, ...SETTLE }, 0.48);
  [POKE.tilt, -POKE.tilt, POKE.tilt, -POKE.tilt, POKE.tilt, 0].forEach((tilt, i) => {
    tl.to(bot.ch, { tilt, duration: POKE.tiltHalf, ease: "sine.inOut" }, 0.45 + i * POKE.tiltHalf);
  });
  tl.add(emotionOut(rix, "happy"), 0.9);
}

/**
 * The happy poke's act (ladder level 1–3, R6A): the giggle, with `happy` and the `sparkle`; on
 * pokes 1–2 (`count`), one in three shows a single heart instead (R6B.3). Always plays.
 */
export function happyPoke(rix: Rix, count = 1) {
  rix.lastPoke = seconds();
  const tl = timeline();
  const settle = cut(rix);
  if (settle) tl.add(settle, 0);
  const heart = count <= PET.pokeHeartMax && Math.random() < PET.pokeHeart;
  giggle(rix, tl, heart ? "heart" : "sparkle");
  play(rix, tl, "poke", "reacting");
}

/**
 * The hover perk (fine pointer, `REACT_COOLDOWN` apart): eyes pop, he stands tall. From idle, or
 * from a patrol stretch, which brakes first (R2.1).
 */
export function perk(rix: Rix) {
  const { bot } = rix;
  const stretch = rix.act === "patrol";
  if (!stretch && (bot.state !== "idle" || rix.act !== null)) return;
  const now = seconds();
  if (now - rix.lastPerk < REACT_COOLDOWN) return;
  rix.lastPerk = now;
  const tl = timeline();
  const settle = stretch ? cut(rix) : null;
  if (settle) tl.add(settle, 0);
  tl.add(perkUp(bot), 0);
  play(rix, tl, "perk", "reacting");
}

/** The ask after landing: the wave, with a glance at the picks, back once the wave ends. */
export function ask(rix: Rix, look: RixLook | null) {
  const { bot } = rix;
  if (bot.state !== "idle" || rix.act !== null) return;
  const tl = timeline().add(wave(bot), 0);
  lookFor(bot, tl, look, 0, waveLength);
  play(rix, tl, "ask");
}

/**
 * A chatter act (R5.4, R9; the line follows, the caller's). Before a pick it's the nudge as built:
 * the wave and one planted bounce, looking at `look` (the board's centre). Once a card is picked:
 * a look straight down toward the examples below, and the small wave.
 */
export function chatter(rix: Rix, picked: boolean, look: RixLook | null) {
  const { bot } = rix;
  const tl = timeline();
  const settle = cut(rix);
  if (settle) tl.add(settle, 0);
  if (picked) {
    tl.add(smallWave(bot), 0);
    lookFor(bot, tl, IDLE_TALK.lookDown, 0, smallWaveLength);
  } else {
    tl.add(wave(bot), 0).add(bounce(bot, NUDGE_BOUNCE), NUDGE_BOUNCE.at);
    lookFor(bot, tl, look, 0, waveLength);
  }
  play(rix, tl, "chatter");
}
