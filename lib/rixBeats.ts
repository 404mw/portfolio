// Rix's idle beats (ui-spec/00-rix.md R6.8), full motion, home's About: ten short moments where he
// stands, built only from moves the sheet already has (the wave, the perk, the hop, the arrival's
// search, and six emotions with their own In, Out, glyph and glyph loop). `BEAT.hold` is the only
// number of their own: an emotion beat lasts its In + hold + Out. Each plays as one `beat` act
// (rank 8), so anything above it cuts it like a play (R2.2). The idle clock (lib/rixIdle.ts) says
// which and when; `beatGlyph` tells it the glyph each shows, so the same glyph never shows twice
// running.
import { gsap } from "@/lib/gsap";
import { animTargets } from "@/lib/motion";
import { blink } from "@/lib/processBotLife";
import { cut, hop, hopLength, perkUp, play, timeline, wave } from "@/lib/rixActs";
import { emotionIn, emotionOut, type EmotionOptions } from "@/lib/rixEmote";
import type { RixGlyphName } from "@/lib/rixGlyphs";
import {
  BEAT,
  EMOTION_TIMING,
  LOOK_AT,
  LOVE,
  PEEK_SEARCH,
  PEEK_SPOT,
  type BeatName,
  type EmotionName,
} from "@/lib/rixMotion";
import type { Rix } from "@/lib/rixRig";
import { lookAt, sideOf } from "@/lib/rixTargets";

/** The glyph each glyph beat shows (`fond`'s one heart is a part of `hearts`). */
export const beatGlyph: Readonly<Partial<Record<BeatName, RixGlyphName>>> = {
  sparkle: "sparkle",
  wonder: "question",
  startle: "alert",
  bashful: "dots",
  puzzle: "question",
  fond: "hearts",
};

/** Out at the visitor. */
const OUT = { look: 0, perp: 0 } as const;

/** An emotion's In, a hold, its Out; returns when the Out starts. */
function flicker(rix: Rix, tl: gsap.core.Timeline, name: EmotionName, hold: number, options: EmotionOptions = {}): number {
  const out = EMOTION_TIMING[name].in.duration + hold;
  tl.add(emotionIn(rix, name, options), 0).add(emotionOut(rix, name, { eyesOnly: options.eyesOnly }), out);
  return out;
}

const moves: Readonly<Record<BeatName, (rix: Rix, tl: gsap.core.Timeline) => void>> = {
  /** A look out at the visitor, and the wave. */
  wave: ({ bot }, tl) => {
    tl.to(bot.ch, { ...OUT, ...LOOK_AT }, 0).add(wave(bot), BEAT.waveAt);
  },
  /** The hover perk, with the eye pop. */
  perk: ({ bot }, tl) => {
    tl.add(perkUp(bot), 0);
  },
  /** `happy` (no glyph) around a hop. */
  hop: (rix, tl) => {
    const at = EMOTION_TIMING.happy.in.duration;
    tl.add(emotionIn(rix, "happy"), 0)
      .add(hop(rix.bot), at)
      .add(emotionOut(rix, "happy"), at + hopLength);
  },
  /** The arrival's search (left, hold, right, hold), then out at the visitor and a blink. */
  look: ({ bot }, tl) => {
    const { look, left, holdLeft, right, holdRight } = PEEK_SEARCH;
    const toRight = left.duration + holdLeft;
    const back = toRight + right.duration + holdRight;
    tl.to(bot.ch, { look: -look, perp: 0, ...left }, 0)
      .to(bot.ch, { look, perp: 0, ...right }, toRight)
      .to(bot.ch, { ...OUT, ...PEEK_SPOT.look }, back)
      .add(blink(bot, false), back);
  },
  /** `excited`, with its two foot taps and the twinkling sparkle. */
  sparkle: (rix, tl) => {
    flicker(rix, tl, "excited", BEAT.hold.sparkle);
  },
  /** `curious` at a random card, tilted toward it, with the `?`. */
  wonder: (rix, tl) => {
    const { ch, restLook } = rix.bot;
    const cards = animTargets(rix.root, "about-chip");
    const card = cards.length > 0 ? gsap.utils.random(cards) : null;
    const look = card ? lookAt(rix, [card]) : null;
    const side = card ? sideOf(rix, card) : 1;
    const out = flicker(rix, tl, "curious", BEAT.hold.wonder, { keepLook: true, side, emote: "question" });
    if (!look) return;
    tl.to(ch, { look: look.d, perp: look.p, ...LOOK_AT }, 0).to(ch, { look: restLook, perp: 0, ...EMOTION_TIMING.curious.out }, out);
  },
  /** `surprised`, with the pop, the squash and settle, and the `!`. */
  startle: (rix, tl) => {
    flicker(rix, tl, "surprised", BEAT.hold.startle);
  },
  /** `shy`, for one cycle of its dots. */
  bashful: (rix, tl) => {
    flicker(rix, tl, "shy", BEAT.hold.bashful);
  },
  /** `confused`, with its arm wiggle and the `?`. */
  puzzle: (rix, tl) => {
    flicker(rix, tl, "confused", BEAT.hold.puzzle);
  },
  /** `love`'s eyes only (the diamonds and one double beat; no melt, sway or foot pop), and one heart. */
  fond: (rix, tl) => {
    const { eye } = rix.bot.parts;
    const { beat } = LOVE;
    flicker(rix, tl, "love", BEAT.hold.fond, { eyesOnly: true, emote: "heart" });
    for (let i = 0; i < beat.count; i += 1) {
      const at = EMOTION_TIMING.love.in.duration + i * beat.gap;
      tl.to(eye, { scale: beat.scale, ...beat.up }, at).to(eye, { scale: 1, ...beat.down }, at + beat.up.duration);
    }
  },
};

/**
 * Beat `name`'s moves as a timeline of their own, for a caller that places them in an act it plays
 * itself (the footer Rix's calls, lib/footerRixActs.ts).
 */
export function beatMove(rix: Rix, name: BeatName): gsap.core.Timeline {
  const tl = timeline();
  moves[name](rix, tl);
  return tl;
}

/** Plays beat `name` where he stands. */
export function beat(rix: Rix, name: BeatName) {
  const tl = timeline();
  const settle = cut(rix);
  if (settle) tl.add(settle, 0);
  moves[name](rix, tl);
  play(rix, tl, "beat");
}
