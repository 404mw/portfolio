// Rix's pick act on About (ui-spec 02a-about-options §2a.O4 "Pick"), and the ack's
// reveal. Full motion: the eyes pop and look at the picked control, a happy bounce, the arm holds
// the group's prop out as it pops in (the old prop shrinks away first), the prop's own flourish,
// then the arm comes back; "just looking" has no prop and no bounce: a shrug. Reduced motion: the
// prop and the ack fade in from their CSS `:has` state, with no act.
//
// CSS `:has` shows the picked prop and ack the moment the radio changes, so their starting states
// are set at once (in JS only), before the next frame can paint them; when the act ends their
// inline styles are cleared and CSS holds the rest state. A pick cuts any act in progress. With
// the character sheet (ui-spec/00-rix.md R9, R6B.4) the eyes are `excited` until 0.6, the pop kept;
// with a prop, the hearts burst from it at 0.55 and the eyes go to `love` from 0.6 to 1.3 (the
// eyes only, no beat), with no sparkle; "just looking" lets `excited` go at 0.6, with no glyph. On
// the /rix playground (no radios, so no `:has`) the held prop keeps inline opacity 1.
import { about } from "@/content/home";
import { aboutReplyProp } from "@/lib/aboutReplies";
import { gsap } from "@/lib/gsap";
import { duration, ease } from "@/lib/motion";
import { stripMotion, type Bot } from "@/lib/processBotRig";
import { bounce, cut, eyePop, keepProp, play, timeline } from "@/lib/rixActs";
import { emoteIn, emotionIn, emotionOut } from "@/lib/rixEmote";
import type { RixLook } from "@/lib/rixLook";
import {
  ACK_IN,
  FLOURISH,
  HEART_BURST,
  LOOK_AT,
  LOVE,
  PICK_ARM,
  PICK_BOUNCE,
  PROP_IN,
  PROP_OUT,
  PROP_PIVOT,
  SHRUG,
} from "@/lib/rixMotion";
import { rixProps, type RixPropName } from "@/lib/rixProps";
import { propFor, type Rix, type RixParts } from "@/lib/rixRig";

/** The pick holds `excited` until here, then lets it go over its Out (R3.1). */
const EXCITED_UNTIL = 0.6;

const flourishParts = (prop: Element) => Array.from(prop.querySelectorAll<SVGElement>("[data-prop-part]"));
const propName = (index: number): RixPropName | null => {
  const reply = about.replies[index];
  return reply ? aboutReplyProp[reply.key] : null;
};

/** Sets a flourish's starting state now and adds its moves to `tl` (seconds from the pick). */
function flourish(bot: Bot, tl: gsap.core.Timeline, name: RixPropName, prop: SVGGElement) {
  const parts = flourishParts(prop);
  const { pivots } = rixProps[name];
  const origin = (i: number) => (pivots[i] ?? pivots[0] ?? [118, 50]).join(" ");
  switch (name) {
    case "calendar": {
      const f = FLOURISH.calendar;
      gsap.set(parts, { scale: 0, svgOrigin: origin(0) });
      tl.to(parts, { scale: 1, ...f.tick }, f.tickAt)
        .to(bot.parts.upper, { scaleY: f.nod, duration: f.down, ease: "power2.out" }, f.nodAt)
        .to(bot.parts.upper, { scaleY: 1, duration: f.up, ease: "power2.inOut" }, f.nodAt + f.down);
      return;
    }
    case "shield": {
      const f = FLOURISH.shield;
      const thump = f.at + f.back.duration;
      tl.to(prop, f.back, f.at)
        .to(prop, f.thump, thump)
        .to(prop, { x: 0, ...f.settle }, thump + f.thump.duration)
        .to(bot.ch, { tilt: f.tilt, duration: f.tiltIn, ease: "power2.out" }, f.at)
        .to(bot.ch, { tilt: 0, duration: f.tiltBack, ease: "power2.inOut" }, f.at + f.tiltIn)
        .to(bot.ch, { look: f.look, perp: 0, ...LOOK_AT }, f.at);
      return;
    }
    case "send": {
      const f = FLOURISH.send;
      tl.to(prop, { x: f.x, y: f.y, ...f.out }, f.at).to(prop, { x: 0, y: 0, ...f.back }, f.at + f.out.duration);
      return;
    }
    case "report": {
      const f = FLOURISH.report;
      parts.forEach((part, i) => gsap.set(part, { scaleY: 0, svgOrigin: origin(i) }));
      tl.to(parts, { scaleY: 1, ...f.grow, stagger: f.stagger }, f.at);
      return;
    }
    case "envelope": {
      const f = FLOURISH.envelope;
      gsap.set(parts, { scaleY: 0, svgOrigin: origin(0) });
      tl.to(parts, { scaleY: 1, ...f.fold }, f.at)
        .to(prop, { y: f.lift, ...f.up }, f.hopAt)
        .to(prop, { y: 0, ...f.down }, f.hopAt + f.up.duration);
    }
  }
}

/** "Just looking": both arms out and up, a small lift, a look up-right, then back. */
function shrug(bot: Bot, tl: gsap.core.Timeline) {
  const s = SHRUG;
  const back = s.at + s.out.duration + s.hold;
  tl.to(bot.ch, { actL: s.left, actR: s.right, mixL: 0, mixR: 0, ...s.out }, s.at)
    .to(bot.parts.upper, { y: s.lift, ...s.out }, s.at)
    .to(bot.ch, { look: s.look, perp: 0, ...LOOK_AT }, s.at)
    .to(bot.ch, { actL: 0, actR: 0, mixL: 1, mixR: 1, ...s.back }, back)
    .to(bot.parts.upper, { y: 0, ...s.back }, back)
    .to(bot.ch, { look: bot.restLook, perp: 0, ...s.lookBack }, back);
}

/**
 * The pick act for reply `index` (`previous` was picked before, if any), looking at `look`. Every
 * prop but the new and the old one loses any leftover motion first, so a quick run of picks never
 * leaves a ghost behind.
 */
export function pickAct(rix: Rix, index: number, previous: number | null, look: RixLook | null) {
  const { bot } = rix;
  const name = propName(index);
  const prop = name ? propFor(rix, index) : undefined;
  const old = previous !== null && previous !== index ? propFor(rix, previous) : undefined;
  const others = rix.props.filter((each) => each !== prop && each !== old);
  stripMotion([...others, ...others.flatMap(flourishParts)]);

  const tl = timeline();
  const settle = cut(rix);
  if (settle) tl.add(settle, 0);
  tl.add(eyePop(bot), 0);
  const eyes = { eyesOnly: true, keepLook: true } as const;
  if (name && prop) {
    tl.add(emotionIn(rix, "excited", { ...eyes, skipEmote: true }), 0)
      .add(emoteIn(rix, "burst"), HEART_BURST.at)
      .add(emotionIn(rix, "love", { ...eyes, skipEmote: true, timing: LOVE.pick.eyes }), LOVE.pick.eyesAt)
      .add(emotionOut(rix, "love", eyes), LOVE.pick.outAt);
  } else {
    tl.add(emotionIn(rix, "excited", { ...eyes, emote: null }), 0).add(emotionOut(rix, "excited", eyes), EXCITED_UNTIL);
  }
  if (look) tl.to(bot.ch, { look: look.d, perp: look.p, ...LOOK_AT }, 0);

  if (old) {
    gsap.set(old, { opacity: 1, svgOrigin: PROP_PIVOT });
    tl.to(old, { scale: PROP_OUT.to, opacity: 0, duration: PROP_OUT.duration, ease: PROP_OUT.ease }, 0).call(
      () => stripMotion([old, ...flourishParts(old)]),
      [],
      PROP_OUT.duration,
    );
  }

  if (!name || !prop) {
    shrug(bot, tl);
  } else {
    gsap.set(prop, { opacity: 0, scale: PROP_IN.from, x: 0, y: 0, svgOrigin: PROP_PIVOT });
    tl.add(bounce(bot, PICK_BOUNCE), PICK_BOUNCE.at)
      .to(bot.ch, { actR: PICK_ARM.angle, mixR: 0, ...PICK_ARM.out }, PICK_ARM.at)
      .to(prop, { opacity: 1, duration: PROP_IN.fade, ease: "none" }, PICK_ARM.at)
      .to(prop, { scale: 1, duration: PROP_IN.duration, ease: PROP_IN.ease }, PICK_ARM.at);
    flourish(bot, tl, name, prop);
    tl.to(bot.ch, { actR: 0, mixR: 1, ...PICK_ARM.back }, PICK_ARM.backAt).call(
      () => {
        stripMotion(flourishParts(prop));
        keepProp(rix, prop);
      },
      [],
      ">",
    );
  }
  play(rix, tl, "pick");
}

/** Reduced motion: the picked prop fades in from its `:has` state. */
export function fadeProp(parts: RixParts, index: number) {
  const prop = propFor(parts, index);
  if (!prop) return;
  stripMotion(parts.props);
  gsap.fromTo(prop, { opacity: 0 }, { opacity: 1, duration: duration.fade, ease: ease.out, clearProps: "opacity" });
}

/** The picked ack's reveal: a short rise and fade (full), the fade alone (reduced). */
export function revealAck(parts: RixParts, index: number, reduced: boolean): gsap.core.Tween | null {
  stripMotion(parts.acks);
  const ack = parts.acks[index];
  if (!ack) return null;
  return reduced
    ? gsap.fromTo(ack, { opacity: 0 }, { opacity: 1, duration: duration.fade, ease: ease.out, clearProps: "opacity" })
    : gsap.fromTo(
        ack,
        { opacity: 0, y: ACK_IN.y },
        { opacity: 1, y: 0, duration: ACK_IN.duration, ease: ACK_IN.ease, delay: ACK_IN.at, clearProps: "opacity,transform" },
      );
}
