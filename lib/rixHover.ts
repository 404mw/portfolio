// Rix's hover mode (ui-spec/00-rix.md R4.9), full motion, home's About: what he does at a card while
// its hover or keyboard focus holds. The walk brings him over (lib/rixWander.ts); once he has
// stopped (at the stand spot or partway), or at once if he stands within `WALK.minDist` of it, he
// cheers the pick on and never goes still. Between beats he holds a base expression, looking at the
// card: `curious`, tilted toward it, before a pick or on a card other than the picked one; `happy`
// (no glyph) on the picked card. One hover beat every `HOVER.beatGap` from the last one's end, by
// `HOVER.beats`, never the same twice in a row, each one `hover` act (rank 5, the walk's) that ends
// back on the base expression; no beat starts while a line is still typing. The card's lines are
// lib/rixHoverLines.ts.
//
// Release (the target left, `LOOK_RELEASE` ago): the beat under way finishes, the base expression
// goes Out, and the idle clock takes over again. Any act above it (a pick, a poke, a pet, a tantrum,
// a walk to another card) cuts it through its own cut; when that act ends, lib/rixWander.ts starts
// it again if the target still holds. Not on touch (no hover; a tap is a pick), nor from the
// tantrum to the forgive's end. Timers run in the crew.
import { gsap } from "@/lib/gsap";
import { BLINK_CLOSE, BLINK_OPEN } from "@/lib/processBotMotion";
import { hop, perkUp, play, releaseHold, smallWave, timeline } from "@/lib/rixActs";
import { emotionIn, emotionOut } from "@/lib/rixEmote";
import { rixEmotions } from "@/lib/rixEmotions";
import { hoverState, type HoverLines } from "@/lib/rixHoverLines";
import { EMOTION_TIMING, HOVER, LOOK_AT, TEMPO, WALK, type HoverBeatName } from "@/lib/rixMotion";
import { inTantrum } from "@/lib/rixPriority";
import type { Rix } from "@/lib/rixRig";
import { lookAt, lookTargets, pointerLookOf, sideOf } from "@/lib/rixTargets";
import { bodyCentreAt, measureTrack } from "@/lib/rixTrack";
import { weightedPick } from "@/lib/weightedPick";

export type HoverMode = {
  /**
   * He has stopped at `card`, or stands within `WALK.minDist` of its spot: hover mode starts if the
   * card's target still holds. True if it did.
   */
  readonly begin: (card: Element) => boolean;
  /** The hovered or focused target changed (null: released). */
  readonly target: (target: Element | null) => void;
  /** Rix started or finished an act. */
  readonly state: () => void;
  readonly stop: () => void;
};

/** The base expression between beats. */
type Base = "curious" | "happy";

/** The card's centre (client px). */
const centreOf = (card: Element) => {
  const box = (card.lastElementChild ?? card).getBoundingClientRect();
  return box.left + box.width / 2;
};

export function hoverMode(rix: Rix, lines: HoverLines): HoverMode {
  const { bot, crew } = rix;
  const { ch } = bot;
  let base: Base = "curious";
  let last: HoverBeatName | null = null;
  let timer: gsap.core.Tween | null = null;
  /** The target left mid-beat: the beat finishes, then the base goes Out (or he turns to `next`). */
  let leaving = false;
  let next: Element | null = null;

  const holds = (card: Element) => rix.target?.closest(lookTargets) === card;

  /** The base expression, looking at `card`. */
  const baseIn = (card: Element) => {
    const look = lookAt(rix, [card]);
    return base === "happy" ? emotionIn(rix, "happy", { look }) : emotionIn(rix, "curious", { look, side: sideOf(rix, card) });
  };

  // The hover beats: each leaves the base expression as it found it.
  const moves: Readonly<Record<HoverBeatName, (tl: gsap.core.Timeline, card: Element) => void>> = {
    /** A hop in place, still looking at the card. */
    hop: (tl) => {
      tl.add(hop(bot), 0);
    },
    /** The small wave on the arm on the card's side: the right one for a card right of or under him. */
    point: (tl, card) => {
      const left = centreOf(card) < bodyCentreAt(measureTrack(rix)) - WALK.minDist;
      const [actL, actR] = rixEmotions[base].arms;
      tl.add(smallWave(bot, left ? "left" : "right", { act: left ? actL : actR, mix: 0 }), 0);
    },
    /** `excited` with the sparkle, a hold, then back to the base expression. */
    cheer: (tl, card) => {
      const out = EMOTION_TIMING.excited.in.duration + HOVER.cheer;
      tl.add(emotionIn(rix, "excited", { keepLook: true }), 0)
        .add(emotionOut(rix, "excited", { keepLook: true }), out)
        .add(baseIn(card), out);
    },
    /** The perk, as when he's hovered himself. */
    perk: (tl) => {
      tl.add(perkUp(bot), 0);
    },
    /** A glance at the pointer (or out at the visitor), a hold, a blink, and back to the card. */
    glance: (tl, card) => {
      const away = pointerLookOf(rix) ?? { d: 0, p: 0 };
      const back = lookAt(rix, [card]);
      const eyes = rixEmotions[base].eyes;
      const rect = (i: number) => eyes[i] ?? eyes[0];
      const blinkAt = LOOK_AT.duration + HOVER.glanceHold;
      tl.to(ch, { look: away.d, perp: away.p, ...LOOK_AT }, 0)
        .to(bot.parts.eye, { attr: { y: (i: number) => rect(i)[1] + rect(i)[3] / 2, height: 0 }, ...BLINK_CLOSE }, blinkAt)
        .to(
          bot.parts.eye,
          { attr: { y: (i: number) => rect(i)[1], height: (i: number) => rect(i)[3] }, ...BLINK_OPEN },
          blinkAt + BLINK_CLOSE.duration,
        );
      if (back) tl.to(ch, { look: back.d, perp: back.p, ...LOOK_AT }, blinkAt);
    },
  };

  /** The next beat, `HOVER.beatGap` from now. */
  const rest = () => {
    timer?.kill();
    timer = crew.after(gsap.utils.random(HOVER.beatGap[0], HOVER.beatGap[1]), beat);
  };

  function beat() {
    timer = null;
    const card = rix.hovering;
    if (card === null || leaving || rix.hold !== base) return;
    // No beat starts while a line is still typing: they resume in its hold.
    if (rix.act !== null || rix.quipTyping()) {
      timer = crew.after(TEMPO.retry, beat);
      return;
    }
    const name = weightedPick(HOVER.beats, last ? [last] : []) ?? "hop";
    last = name;
    const tl = timeline();
    moves[name](tl, card);
    play(rix, tl, "hover");
  }

  const start = (card: Element) => {
    leaving = false;
    next = null;
    rix.hovering = card;
    base = hoverState(card, rix.picked !== null) === "picked" ? "happy" : "curious";
    crew.run(baseIn(card));
    rix.hold = base;
    lines.ready(true);
    // From a standstill no walk's end hands him over: the held expression takes him out of idle.
    if (rix.act !== null) return;
    bot.state = "acting";
    rix.onState();
  };

  /** Hover mode is over: nothing of it is left pending (`turning`: he's turning to another card where he stands). */
  const end = (turning = false) => {
    timer?.kill();
    timer = null;
    leaving = false;
    next = null;
    rix.hovering = null;
    if (!turning) lines.ready(false);
  };

  /** Released: the base expression goes Out, and he's idle again. */
  const letGo = () => {
    const held = rix.hold === base;
    end();
    if (held) releaseHold(rix);
  };

  return {
    begin: (card) => {
      if (inTantrum(rix) || !holds(card)) return false;
      if (rix.hovering === card) {
        leaving = false;
        next = null;
        return true;
      }
      // A beat at the card he's leaving is still finishing: he turns to this one when it ends.
      if (rix.hovering !== null && rix.act === "hover") {
        leaving = true;
        next = card;
        return true;
      }
      start(card);
      return true;
    },
    target: (target) => {
      const card = target?.closest(lookTargets) ?? null;
      lines.hold(card);
      const at = rix.hovering;
      if (at === null) return;
      if (card === at) {
        leaving = false;
        next = null;
        return;
      }
      // Release: the current beat finishes first.
      if (rix.act === "hover") {
        leaving = true;
        timer?.kill();
        timer = null;
        return;
      }
      letGo();
    },
    state: () => {
      if (rix.hovering === null) return;
      if (rix.act !== null) {
        // A higher act took over (R2.1): its cut has already put the base expression away.
        if (rix.act !== "hover") end();
        return;
      }
      if (leaving) {
        const to = next;
        if (to && holds(to)) {
          end(true);
          start(to);
        } else {
          letGo();
        }
        return;
      }
      // Something cut the base expression without an act of its own (a brake).
      if (rix.hold !== base) {
        end();
        return;
      }
      if (!timer) rest();
    },
    stop: () => {
      timer?.kill();
      timer = null;
    },
  };
}
