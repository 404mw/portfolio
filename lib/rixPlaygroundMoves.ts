// The /rix playground's moves (docs/pages/rix/ui-spec.md §0.4, ui-spec/02-playground.md; base
// ui-spec/00-rix.md R10), behind `useRixPlayground().play`: each button cuts the current move and
// plays its own, ignoring priority and budgets; `onEnd` fires once he's still again (the readout and
// the button's `data-playing` clear). Under reduced motion (the OS setting; there's no preview) each
// command plays its R8.1 version: only lines and props fade; the buttons with none are hidden by
// CSS. The playground has no radios, so a pick is the next prop (each press cycles, ending with the
// shrug, and plays the heart burst) and the tantrum's toss skips the deselect. The walks go the
// whole way to the shelf's left end, its centre or its right end, and `curious` looks toward the end
// he last walked to (the left end at first). `love` and the pet play the love act (the pet with its
// line); each glyph button shows one glyph on neutral eyes with its loop for `GLYPH_HOLD`, then
// `EMOTE_OUT` (the zzz runs the nap's own loop). The patrol toggle switches the real R4.8 patrol on
// and off (`setPatrol`).
import { about } from "@/content/home";
import { playground } from "@/content/rix";
import { gsap } from "@/lib/gsap";
import { duration, ease } from "@/lib/motion";
import { startZzz } from "@/lib/processBotActs";
import { eyeAttr, stripMotion } from "@/lib/processBotRig";
import { ask, cut, happyPoke, perk, play, releaseHold, timeline } from "@/lib/rixActs";
import { annoyedPoke } from "@/lib/rixAnnoyed";
import { balance } from "@/lib/rixBalance";
import { calm } from "@/lib/rixCalm";
import { emoteIn, emotesOut, emotionIn, emotionOut, slowBlink } from "@/lib/rixEmote";
import { sulkEyes, type Wall } from "@/lib/rixEmotions";
import type { RixFadeKit } from "@/lib/rixFade";
import type { RixKit } from "@/lib/rixFull";
import type { GlyphCue } from "@/lib/rixGlyphLoops";
import { juggle } from "@/lib/rixJuggle";
import { logoPose } from "@/lib/rixLogoPose";
import {
  EMOTE_OUT,
  POKE_WINDOW,
  SIT,
  SULK,
  TALK,
  WALK,
  WALK_FAR,
  type EmotionName,
  type PlayName,
} from "@/lib/rixMotion";
import { nap, wake } from "@/lib/rixNap";
import { hideForPeek, peekIn } from "@/lib/rixPeek";
import { peekaboo } from "@/lib/rixPeekaboo";
import { pickAct } from "@/lib/rixPick";
import type { RixPlaygroundCommand } from "@/lib/rixPlayground";
import { propFor, type Rix } from "@/lib/rixRig";
import { sit } from "@/lib/rixSit";
import { wallSign } from "@/lib/rixSulk";
import { dodge, duck } from "@/lib/rixTag";
import { tantrum } from "@/lib/rixTantrum";
import { shelfEndLook } from "@/lib/rixTargets";
import { measureTrack, roomLeft, roomRight, spotAt } from "@/lib/rixTrack";
import { walkTo } from "@/lib/rixWalk";

/** How long an emotion button holds its emotion. */
const EMOTION_HOLD = 1.4;
/** How long a glyph button shows its glyph. */
const GLYPH_HOLD = 2.0;
/** Each glyph button's cue (the zzz is the nap's own loop). */
const glyphCues: Readonly<Record<Exclude<keyof typeof playground.glyphs, "zzz">, GlyphCue>> = {
  alert: "alert",
  question: "question",
  heart: "heart",
  hearts: "hearts",
  burst: "burst",
  sparkle: "sparkle",
  drop: "drop",
  dots: "dots",
  vein: "vein",
  grawlix: "grawlix",
};
/** The end check's period, and its first wait (so the move has started). */
const POLL = 0.1;

/** Where a walk button goes. */
type WalkEnd = "left" | "centre" | "right";

export type PlaygroundMoves = {
  readonly play: (command: RixPlaygroundCommand, onEnd: () => void) => void;
  /** The patrol toggle (full motion only; reduced motion has no patrol). */
  readonly setPatrol: (on: boolean) => void;
  readonly stop: () => void;
};

const nth = (lines: readonly string[], i: number) => lines[i % lines.length] ?? "";

export function playgroundMoves(root: HTMLElement, full: RixKit | null, faded: RixFadeKit | null): PlaygroundMoves {
  const props = full?.rix.props ?? Array.from(root.querySelectorAll<SVGGElement>('[data-bot="prop"]'));
  let pickIndex = 0;
  let fadedPick: number | null = null;
  const said = { poke: 0, annoyed: 0, angry: 0, pet: 0 };
  /** The end he last walked toward: -1 left, 1 right (he starts at the right end). */
  let lastEnd: -1 | 1 = -1;
  let poll: gsap.core.Tween | null = null;
  let peek: gsap.core.Timeline | null = null;
  let annoyedTimer: gsap.core.Tween | null = null;

  /** The next reply index (cycling), and the next one that has a prop. */
  const nextReply = () => pickIndex++ % about.replies.length;
  const nextProp = () => {
    for (let i = 0; i < about.replies.length; i += 1) {
      const index = nextReply();
      if (props.some((prop) => prop.dataset.propFor === String(index))) return index;
    }
    return 0;
  };
  const propOf = (index: number | null) => (index === null ? undefined : props.find((prop) => prop.dataset.propFor === String(index)));

  /** Cuts whatever he's doing: still, idle, mood neutral. */
  const stopCurrent = () => {
    poll?.kill();
    annoyedTimer?.kill();
    if (!full) {
      faded?.calmDown();
      return;
    }
    const { rix } = full;
    const { bot, crew } = rix;
    // The zzz glyph button's loop (not a nap): it stops and its z's fade.
    if (bot.zzz && bot.state !== "napping") {
      bot.zzz.kill();
      bot.zzz = null;
      crew.run(gsap.to(bot.parts.z, { opacity: 0, duration: EMOTE_OUT.duration, overwrite: "auto" }));
    }
    if (peek) {
      peek.kill();
      peek = null;
      gsap.set(bot.parts.rig, { x: 0, y: 0 });
      gsap.set(rix.stage, { clearProps: "clipPath" });
      bot.ch.tilt = 0;
    }
    const settle = cut(rix);
    if (settle) crew.run(settle);
    rix.mood = "neutral";
    rix.wall = null;
    full.ladder.reset();
    bot.state = "idle";
    rix.act = null;
    rix.quipOut(TALK.walkOut);
    rix.onState();
  };

  // Full moves.
  const glyph = (rix: Rix, move: keyof typeof playground.glyphs) => {
    const { bot, crew } = rix;
    const tl = timeline();
    if (move === "zzz") {
      tl.call(() => startZzz(bot, crew), [], 0)
        .call(
          () => {
            bot.zzz?.kill();
            bot.zzz = null;
          },
          [],
          GLYPH_HOLD,
        )
        .to(bot.parts.z, { opacity: 0, ...EMOTE_OUT }, GLYPH_HOLD)
        .call(() => stripMotion(bot.parts.z), [], GLYPH_HOLD + EMOTE_OUT.duration);
    } else {
      tl.add(emoteIn(rix, glyphCues[move]), 0).add(emotesOut(rix), GLYPH_HOLD).set({}, {}, GLYPH_HOLD + EMOTE_OUT.duration);
    }
    play(rix, tl, "play");
  };

  /** Curious's target: the shelf end he last walked toward, at floor level. */
  const endLook = (rix: Rix) => ({ look: shelfEndLook(rix, lastEnd), side: lastEnd });

  const emotion = (rix: Rix, name: EmotionName) => {
    const target = name === "curious" ? endLook(rix) : {};
    const tl = timeline().add(emotionIn(rix, name, target), 0);
    if (name === "sleepy") tl.add(slowBlink(rix), EMOTION_HOLD / 2);
    tl.add(emotionOut(rix, name), EMOTION_HOLD);
    play(rix, tl, "play");
  };

  /**
   * The whole way to the shelf's left end (`minX`), its centre or its right end (`x` 0), at
   * `WALK_FAR`: the stride-locked walk with its cadence eased in and out and a push per step.
   */
  const walkEnd = (rix: Rix, where: WalkEnd) => {
    const track = measureTrack(rix);
    const x = where === "left" ? track.minX : where === "right" ? 0 : spotAt(track, (track.left + track.right) / 2);
    if (x !== track.x) lastEnd = x < track.x ? -1 : 1;
    walkTo(rix, x, { pace: WALK_FAR });
  };

  const ownPick = (rix: Rix, index: number) => {
    const previous = rix.picked;
    rix.picked = propFor(rix, index) ? index : null;
    pickAct(rix, index, previous, null);
  };

  const holdProp = (rix: Rix, index: number) => {
    const prop = propFor(rix, index);
    rix.props.forEach((each) => each !== prop && stripMotion([each]));
    rix.picked = prop ? index : null;
    if (prop) gsap.set(prop, { opacity: 1 });
  };

  const wallHere = (rix: Rix): Wall => {
    const track = measureTrack(rix);
    return track.x - track.minX < -track.x ? "left" : "right";
  };

  /** The sulk's pose, set at once (the forgive button starts from it). */
  const setSulk = (rix: Rix, wall: Wall) => {
    const { parts, ch } = rix.bot;
    const w = wallSign(wall);
    sulkEyes(wall).forEach(([x, y, width, height], i) => {
      const eye = parts.eye[i];
      if (eye) gsap.set(eye, { attr: { x, y, width, height }, rotation: 0 });
    });
    gsap.set(parts.upper, { scaleX: SULK.squeeze.scaleX, scaleY: SULK.slump.scaleY, y: SULK.slump.y });
    const [actL, actR] = SULK.arms;
    Object.assign(ch, { actL, actR, mixL: 0, mixR: 0, tilt: w * SULK.tilt, look: w * WALK.face.d, perp: w * WALK.face.p });
    rix.wall = wall;
    rix.mood = "sulk";
  };

  /** The angry pose, set at once (the calm button starts from it). */
  const setAngry = (rix: Rix) => {
    emotionIn(rix, "angry").progress(1);
    rix.emotion = "angry";
    rix.mood = "tantrum";
  };

  const playFull = (kit: RixKit, command: RixPlaygroundCommand) => {
    const { rix } = kit;
    const { bot } = rix;
    switch (command.group) {
      case "emotions":
        // Love is the love act, without a line.
        if (command.move === "love") kit.love(null);
        else emotion(rix, command.move);
        return;
      case "glyphs":
        glyph(rix, command.move);
        return;
      case "moves":
        switch (command.move) {
          case "walkLeft":
            walkEnd(rix, "left");
            return;
          case "walkCentre":
            walkEnd(rix, "centre");
            return;
          case "walkRight":
            walkEnd(rix, "right");
            return;
          case "talk":
            rix.say(playground.talkSample, { at: TALK.afterNudge, style: "type" });
            return;
          case "perk":
            rix.lastPerk = -Infinity;
            perk(rix);
            return;
          case "wave":
            ask(rix, null);
            return;
          case "pick":
            ownPick(rix, nextReply());
            return;
          case "pet":
            kit.love(nth(about.rix.petLines, said.pet++));
            return;
          case "arrive":
            hideForPeek(rix);
            peek = peekIn(rix, {
              land: () => {
                bot.state = "idle";
                rix.onState();
              },
              ask: () => ask(rix, null),
            });
            return;
        }
        return;
      case "plays": {
        const plays: Record<PlayName, () => void> = {
          juggle: () => juggle(rix, false),
          sit: () => sit(rix),
          peekaboo: () => peekaboo(rix),
          logoPose: () => logoPose(rix),
          balance: () => balance(rix),
        };
        switch (command.move) {
          case "juggleDrop":
            juggle(rix, true);
            return;
          case "nap":
            nap(rix);
            return;
          case "wake":
            if (bot.state !== "napping") {
              gsap.set(bot.parts.rig, { y: SIT.lower });
              gsap.set(bot.parts.eye, { attr: eyeAttr(bot, "slit") });
              bot.state = "napping";
              rix.emotion = "sleepy";
            }
            wake(rix);
            return;
          case "tagDodge": {
            const track = measureTrack(rix);
            dodge(rix, roomLeft(track) > roomRight(track) ? -1 : 1);
            return;
          }
          case "tagDuck":
            duck(rix);
            return;
          default:
            plays[command.move]();
        }
        return;
      }
      case "moods":
        switch (command.move) {
          case "poke": {
            const line = nth(about.rix.pokeLines, said.poke++);
            happyPoke(rix);
            rix.say(line, { at: TALK.afterPoke, style: "type" });
            kit.announce(line);
            return;
          }
          case "annoyed": {
            const line = nth(about.rix.annoyedLines, said.annoyed++);
            annoyedPoke(rix);
            rix.say(line, { at: TALK.afterAnnoyed, style: "type" });
            kit.announce(line);
            annoyedTimer = rix.crew.after(POKE_WINDOW, () => {
              if (rix.hold === "annoyed") releaseHold(rix);
            });
            return;
          }
          case "tantrum": {
            const held = propOf(rix.picked);
            if (held) stripMotion([held]);
            rix.picked = null;
            tantrum(rix, nth(about.rix.angryLines, said.angry++), kit.cues);
            return;
          }
          case "tantrumPick":
            holdProp(rix, nextProp());
            tantrum(rix, nth(about.rix.angryLines, said.angry++), kit.cues);
            return;
          case "sulk":
            kit.sulkAt(wallHere(rix));
            return;
          case "forgive": {
            const wall = rix.wall ?? wallHere(rix);
            if (!rix.wall) setSulk(rix, wall);
            kit.forgiveAt(wall);
            return;
          }
          case "calm": {
            if (rix.emotion !== "angry" && !rix.wall) setAngry(rix);
            rix.mood = "tantrum";
            const index = nextProp();
            calm(rix, null, kit.endMood, () => ownPick(rix, index));
            return;
          }
        }
    }
  };

  // Faded moves (R8.1): only lines and props fade; anything that moves is off.
  const fadeIn = (index: number | null) => {
    props.forEach((prop) => stripMotion([prop]));
    const prop = propOf(index);
    if (prop) gsap.fromTo(prop, { opacity: 0 }, { opacity: 1, duration: duration.fade, ease: ease.out });
    fadedPick = prop ? index : null;
  };

  const playFaded = (f: RixFadeKit, command: RixPlaygroundCommand) => {
    const say = (text: string) => f.quip.say(text);
    switch (command.group) {
      case "moves":
        if (command.move === "talk") say(playground.talkSample);
        if (command.move === "pick") fadeIn(nextReply());
        // The pet's line fades in, never announced.
        if (command.move === "pet") say(nth(about.rix.petLines, said.pet++));
        return;
      case "moods":
        switch (command.move) {
          case "poke": {
            const line = nth(about.rix.pokeLines, said.poke++);
            say(line);
            f.announce(line);
            return;
          }
          case "annoyed": {
            const line = nth(about.rix.annoyedLines, said.annoyed++);
            say(line);
            f.announce(line);
            return;
          }
          case "tantrum":
            f.tantrum(nth(about.rix.angryLines, said.angry++), null);
            return;
          case "tantrumPick": {
            const index = fadedPick ?? nextProp();
            const prop = propOf(index);
            if (prop) gsap.set(prop, { opacity: 1 });
            f.tantrum(nth(about.rix.angryLines, said.angry++), prop ? { prop, ack: null } : null);
            fadedPick = null;
            return;
          }
          case "sulk":
            say(about.rix.sulkLine);
            return;
          case "forgive":
            say(about.rix.forgiveLine);
            return;
          case "calm":
            f.calmDown();
            fadeIn(nextProp());
            return;
        }
        return;
      default:
    }
  };

  /** Waits until he's still again, then `onEnd`. */
  const watchEnd = (still: () => boolean, onEnd: () => void) => {
    const check = () => {
      if (still()) {
        poll = null;
        onEnd();
        return;
      }
      poll = gsap.delayedCall(POLL, check);
    };
    poll = gsap.delayedCall(POLL, check);
  };

  return {
    play: (command, onEnd) => {
      stopCurrent();
      if (faded) {
        playFaded(faded, command);
        watchEnd(() => !faded.quip.showing() && faded.holder.mood === "neutral", onEnd);
        return;
      }
      if (!full) return;
      const { rix } = full;
      playFull(full, command);
      const napping = command.group === "plays" && command.move === "nap";
      watchEnd(
        () =>
          (napping && rix.bot.state === "napping") ||
          ((rix.act === null || rix.act === "patrol") &&
            rix.hold === null &&
            rix.mood === "neutral" &&
            !rix.quipShowing() &&
            !(peek?.isActive() ?? false) &&
            rix.bot.state !== "napping"),
        onEnd,
      );
    },
    setPatrol: (on) => full?.patrol?.setOn(on),
    stop: () => {
      poll?.kill();
      annoyedTimer?.kill();
      peek?.kill();
    },
  };
}
