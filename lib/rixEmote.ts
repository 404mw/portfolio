// Rix's emotions (ui-spec/00-rix.md R3), full motion, character sheet only: applying one (the eye
// rects by `attr`, angry's slant and love's diamonds by `rotation` about their pivots, the look, the
// body, the arms, the feet and the emote glyph) and releasing it back to rest. The eyes ease over
// the emotion's In; the pose over max(In, `POSE_MIN`); release over Out, the pose with `POSE_BACK`.
// Each returns a timeline for the caller's act to place; `rix.emotion` follows it.
//
// The emote glyphs (R3.2) show and hide here too: one at a time (a new one cuts the old over
// `EMOTE_CUT`), never with the zzz, each with its loop (lib/rixGlyphLoops.ts). An emotion shows its
// own glyph unless the act swaps it (`emote`) or leaves the slot alone (`skipEmote`); its Out takes
// the glyph it showed with it. Going out stops the loop and puts the parts back at their drawn
// spots. Glyph changes run in the crew when the act's timeline reaches them, so a cut act never
// strands one.
import { gsap } from "@/lib/gsap";
import { BLINK_CLOSE, BLINK_OPEN, POP_SCALE, SETTLE, SQUASH, TAP_DOWN, TAP_LIFT, TAP_UP, timed } from "@/lib/processBotMotion";
import { stripMotion } from "@/lib/processBotRig";
import { eyeOrigins, eyeTurn, restEyes, rixEmotions, type EmotionShape, type EyePair, type EyeTurn } from "@/lib/rixEmotions";
import { glyphOf, glyphPivot, selfShown, startGlyphLoop, type GlyphCue } from "@/lib/rixGlyphLoops";
import { rixGlyphNames, type RixGlyphName } from "@/lib/rixGlyphs";
import type { RixLook } from "@/lib/rixLook";
import {
  CONFUSED_WIGGLE,
  EMOTE_CUT,
  EMOTE_IN,
  EMOTE_OUT,
  EMOTION_TIMING,
  POSE_BACK,
  POSE_MIN,
  SAD_SWAY,
  type EmotionName,
} from "@/lib/rixMotion";
import type { Rix } from "@/lib/rixRig";
import { pointerLookOf } from "@/lib/rixTargets";

const timeline = () => gsap.timeline({ defaults: { overwrite: "auto" } });

type Timing = { readonly duration: number; readonly ease: string };

/** A look for the eyes alone: along the gap diagonal and across it. */
type EyeLook = Pick<RixLook, "d" | "p">;

export type EmotionOptions = {
  /** The look for `curious` (the target) or an explicit look in place of the emotion's own. */
  readonly look?: EyeLook | null;
  /** Curious's tilt side: −1 toward a target on his left, 1 on his right. */
  readonly side?: -1 | 1;
  /** Skip the look (an act owns the eyes' direction). */
  readonly keepLook?: boolean;
  /** Skip the body and arms (an act owns them): the eyes, look and emote only. */
  readonly eyesOnly?: boolean;
  /** Leave the emote slot to the caller (the wake waits for the zzz; the pick shows its burst). */
  readonly skipEmote?: boolean;
  /** Show this glyph in place of the emotion's own (`null`: none, and the slot clears). */
  readonly emote?: GlyphCue | null;
  /** The eyes' own timing in place of the emotion's In (the pick's love eyes). */
  readonly timing?: Timing;
};

// The glyphs.

const partsOf = (rix: Rix, name: RixGlyphName): SVGElement[] => Object.values(rix.emoteParts[name] ?? {});

/** Glyph `name` fades over `duration` (if showing), then loses its inline motion and its parts'. */
function fadeGlyph(rix: Rix, name: RixGlyphName, duration: number) {
  const glyph = rix.emotes[name];
  if (!glyph) return;
  const parts = partsOf(rix, name);
  const clear = () => stripMotion([glyph, ...parts]);
  if (!glyph.hasAttribute("style")) return;
  if (Number(gsap.getProperty(glyph, "opacity")) === 0) {
    clear();
    return;
  }
  rix.crew.run(gsap.to(glyph, { opacity: 0, duration, ease: EMOTE_OUT.ease, overwrite: "auto", onComplete: clear }));
}

/** Shows `cue` now (`owner` is the emotion it goes with): the old glyph goes, this one comes in. */
export function showGlyph(rix: Rix, cue: GlyphCue, owner: EmotionName | null = null) {
  const name = glyphOf(cue);
  const glyph = rix.emotes[name];
  rix.glyphLoop?.kill();
  rix.glyphLoop = null;
  rixGlyphNames.forEach((other) => {
    if (other !== name) fadeGlyph(rix, other, EMOTE_CUT);
  });
  // Never with the zzz.
  if (!glyph || rix.bot.zzz) {
    rix.glyph = null;
    rix.glyphFor = null;
    return;
  }
  const parts = partsOf(rix, name);
  stripMotion([glyph, ...parts]);
  rix.glyph = name;
  rix.glyphFor = owner;
  if (selfShown(cue)) {
    gsap.set(glyph, { opacity: 1 });
  } else {
    const { scale, y, duration, ease } = EMOTE_IN;
    rix.crew.run(
      gsap.fromTo(glyph, { svgOrigin: glyphPivot(name), opacity: 0, scale, y }, { opacity: 1, scale: 1, y: 0, duration, ease }),
    );
  }
  const loop = startGlyphLoop(rix, cue, glyph, rix.emoteParts[name] ?? {}, () => {
    // A one-off has played out: the slot is free again.
    if (rix.glyphLoop !== loop) return;
    rix.glyphLoop = null;
    rix.glyph = null;
    rix.glyphFor = null;
    stripMotion([glyph, ...parts]);
  });
  rix.glyphLoop = loop;
}

/**
 * The glyph goes out now: its loop stops and it fades over `duration`. `gentle` (love's Out) lets
 * rising hearts finish instead: no new ones start, and the glyph clears once the last has faded.
 */
export function hideGlyph(rix: Rix, duration: number = EMOTE_OUT.duration, gentle = false) {
  const { glyph: name, glyphLoop: loop } = rix;
  rix.glyph = null;
  rix.glyphFor = null;
  rix.glyphLoop = null;
  if (gentle && name && loop) {
    const left = loop.end();
    const glyph = rix.emotes[name];
    const parts = partsOf(rix, name);
    rix.crew.after(left, () => {
      if (rix.glyph !== name && glyph) stripMotion([glyph, ...parts]);
    });
    return;
  }
  loop?.kill();
  rixGlyphNames.forEach((each) => fadeGlyph(rix, each, duration));
}

/** The emote `cue` comes in, as a step in the caller's timeline. */
export function emoteIn(rix: Rix, cue: GlyphCue, owner: EmotionName | null = null): gsap.core.Timeline {
  return timeline().call(() => showGlyph(rix, cue, owner));
}

/** Every emote goes out (`EMOTE_OUT`, or over `duration`), as a step in the caller's timeline. */
export function emotesOut(rix: Rix, duration: number = EMOTE_OUT.duration): gsap.core.Timeline {
  return timeline().call(() => hideGlyph(rix, duration));
}

// The eyes.

/** Tweens both eye rects to `eyes` (and their turn to `turn`, or level) in `tl` at `at`. */
export function eyesTo(rix: Rix, tl: gsap.core.Timeline, eyes: EyePair, eased: Timing, at: number, turn: EyeTurn | null = null) {
  const timing = timed(eased);
  rix.bot.parts.eye.forEach((rect, i) => {
    const target = eyes[i] ?? eyes[0];
    const [x, y, width, height] = target;
    tl.to(rect, { attr: { x, y, width, height }, ...timing }, at);
    if (turn) {
      tl.set(rect, { svgOrigin: turn.origins[i] ?? turn.origins[0] }, at).to(
        rect,
        { rotation: turn.rotation[i] ?? turn.rotation[0], ...timing },
        at,
      );
    } else {
      // Any turn goes with it; once level, the pop pivot is the rig's own again.
      tl.to(rect, { rotation: 0, ...timing }, at).set(rect, { svgOrigin: eyeOrigins[i] ?? eyeOrigins[0] }, at + timing.duration);
    }
  });
}

/** The look an emotion asks for, resolved now. */
function lookOf(rix: Rix, shape: EmotionShape, options: EmotionOptions): EyeLook | null {
  if (options.look) return options.look;
  const { look } = shape;
  if ("at" in look) {
    if (look.at === "target") return null;
    return pointerLookOf(rix) ?? { d: look.d, p: look.p };
  }
  return look;
}

/** The emotion's own extras: surprised's pop and squash, confused's wiggle, excited's taps, sad's sway. */
function extras(rix: Rix, tl: gsap.core.Timeline, name: EmotionName, pose: number) {
  const { parts, ch, loops } = rix.bot;
  switch (name) {
    case "surprised":
      tl.to(parts.eye, { scale: POP_SCALE, duration: 0.1, ease: "power2.out" }, 0)
        .to(parts.eye, { scale: 1, duration: 0.3, ease: "power2.inOut" }, 0.1)
        .to(parts.upper, { ...SQUASH, duration: 0.06, ease: "power2.out" }, 0)
        .to(parts.upper, { scaleX: 1, scaleY: 1, ...SETTLE }, 0.06);
      return;
    case "confused": {
      const { by, half, count } = CONFUSED_WIGGLE;
      const [, arm] = rixEmotions.confused.arms;
      for (let i = 0; i < count; i += 1) {
        const to = i === count - 1 ? arm : arm + (i % 2 === 0 ? by : -by);
        tl.to(ch, { actR: to, duration: half, ease: "sine.inOut" }, pose + i * half);
      }
      return;
    }
    case "excited":
      [parts.footLeft, parts.footRight].forEach((foot, i) => {
        const at = i * (TAP_UP.duration + TAP_DOWN.duration);
        tl.to(foot, { y: -TAP_LIFT, ...TAP_UP }, at).to(foot, { y: 0, ...TAP_DOWN }, at + TAP_UP.duration);
      });
      return;
    case "sad":
      if (loops.sway) tl.to(loops.sway, { timeScale: SAD_SWAY, duration: pose, ease: "sine.inOut" }, 0);
      return;
    default:
  }
}

/** Applies emotion `name`: a timeline placed at the caller's time. */
export function emotionIn(rix: Rix, name: EmotionName, options: EmotionOptions = {}): gsap.core.Timeline {
  const { bot } = rix;
  const { parts, ch } = bot;
  const shape = rixEmotions[name];
  const timing = EMOTION_TIMING[name].in;
  const pose = { duration: Math.max(timing.duration, POSE_MIN), ease: timing.ease };
  const tl = timeline().call(() => {
    rix.emotion = name;
  });
  eyesTo(rix, tl, shape.eyes, options.timing ?? timing, 0, eyeTurn(name));

  const look = options.keepLook ? null : lookOf(rix, shape, options);
  if (look) tl.to(ch, { look: look.d, perp: look.p, ...pose }, 0);

  if (!options.eyesOnly) {
    const [actL, actR] = shape.arms;
    tl.to(ch, { actL, actR, mixL: 0, mixR: 0, ...pose }, 0);
    if (shape.upper) {
      const { scaleX = 1, scaleY = 1, y = 0 } = shape.upper;
      tl.to(parts.upper, { scaleX, scaleY, y, ...pose }, 0);
    }
    if (shape.tilt !== undefined) tl.to(ch, { tilt: shape.tilt * (options.side ?? 1), ...pose }, 0);
    if (shape.footRight !== undefined) tl.to(parts.footRight, { x: shape.footRight, ...pose }, 0);
    if (shape.footRightY !== undefined) tl.to(parts.footRight, { y: shape.footRightY, ...pose }, 0);
    if (shape.life !== undefined) tl.to(ch, { life: shape.life, ...pose }, 0);
    extras(rix, tl, name, pose.duration);
  }
  // An emotion owns the emote slot: its own glyph (or the act's swap), or none.
  if (!options.skipEmote) {
    const cue = options.emote !== undefined ? options.emote : (shape.emote ?? null);
    if (cue) tl.add(emoteIn(rix, cue, name), 0);
    else
      tl.call(
        () => {
          if (rix.glyph) hideGlyph(rix);
        },
        [],
        0,
      );
  }
  return tl;
}

/** Releases emotion `name` (the current one by default) back to rest over its Out. */
export function emotionOut(rix: Rix, name: EmotionName | null = rix.emotion, options: EmotionOptions = {}): gsap.core.Timeline {
  const tl = timeline().call(() => {
    if (rix.emotion === name) rix.emotion = null;
    // The glyph this emotion showed goes with it (love's hearts finish rising).
    if (name && rix.glyph && rix.glyphFor === name) hideGlyph(rix, EMOTE_OUT.duration, name === "love");
  });
  if (!name) return tl;
  const { bot } = rix;
  const { parts, ch, loops } = bot;
  const shape = rixEmotions[name];
  const timing = EMOTION_TIMING[name].out;
  const back = { duration: timing.duration, ease: POSE_BACK };
  eyesTo(rix, tl, restEyes, timing, 0);
  if (!options.keepLook && !("at" in shape.look && shape.look.at === "target")) {
    tl.to(ch, { look: bot.restLook, perp: 0, ...timing }, 0);
  }
  if (!options.eyesOnly) {
    tl.to(ch, { actL: 0, actR: 0, mixL: 1, mixR: 1, ...back }, 0);
    if (shape.upper) tl.to(parts.upper, { scaleX: 1, scaleY: 1, y: 0, ...back }, 0);
    if (shape.tilt !== undefined) tl.to(ch, { tilt: 0, ...back }, 0);
    if (shape.footRight !== undefined) tl.to(parts.footRight, { x: 0, ...back }, 0);
    if (shape.footRightY !== undefined) tl.to(parts.footRight, { y: 0, ...back }, 0);
    if (shape.life !== undefined) tl.to(ch, { life: 1, ...timing }, 0);
    if (name === "sad" && loops.sway) tl.to(loops.sway, { timeScale: 1, ...timing }, 0);
  }
  return tl;
}

/** Sleepy's own slow blink (blinks otherwise pause while an emotion is held). */
export function slowBlink(rix: Rix): gsap.core.Timeline {
  const [left, right] = rixEmotions.sleepy.eyes;
  const shut = { y: (i: number) => (i === 0 ? left : right)[1] + (i === 0 ? left : right)[3] / 2, height: 0 };
  const open = { y: (i: number) => (i === 0 ? left : right)[1], height: (i: number) => (i === 0 ? left : right)[3] };
  return timeline()
    .to(rix.bot.parts.eye, { attr: shut, duration: BLINK_CLOSE.duration * 4, ease: BLINK_CLOSE.ease }, 0)
    .to(rix.bot.parts.eye, { attr: open, duration: BLINK_OPEN.duration * 4, ease: BLINK_OPEN.ease });
}
