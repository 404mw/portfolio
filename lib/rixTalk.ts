// Rix's talk (ui-spec/00-rix.md R5), full motion, character sheet only: a line types out in his
// quip. The box shows at once (no rise) and each `data-quip-char` span (React renders one per
// character) reveals in order, `TALK.char` apart plus `TALK.pause` after `, . ? !`, so the line is
// laid out from the first character and nothing re-wraps. On each word's first character his body
// talks: `upper` bobs (only while no act holds it) and the eyes squish (only while neutral). At the
// start the eyes glance toward the quip's side and back at the end (not while annoyed, angry, in
// love or turned away, nor during a hover line: he keeps looking at the card, R4.9). `QUIP_HOLD`
// counts from the last character (the timeline's `typed` label), then `QUIP_OUT`. The quip takes the
// side with room (R5.3), set on the anchor as each line starts. Talk never owns the rig, arms or
// feet. The spans are queried when the line starts (React has rendered them by then). Where the
// quip sits above him (the /rix playground, lib/rixFeatures.ts) there's no side: the anchor carries
// no `data-side` and the glance goes up, toward the quip.
import { gsap } from "@/lib/gsap";
import { LOOK_AT, LOOK_BACK, QUIP_HOLD, QUIP_OUT, TALK } from "@/lib/rixMotion";
import { rixFeatures } from "@/lib/rixFeatures";
import type { Rix } from "@/lib/rixRig";
import { measureTrack, roomLeft, roomRight } from "@/lib/rixTrack";

const chars = (rix: Rix) => Array.from(rix.quip.querySelectorAll<HTMLElement>("[data-quip-char]"));

const quipAbove = (rix: Rix) => rixFeatures[rix.host].quip === "above";

/** The talk glance toward the quip: up where it sits above him, else toward its side. */
function glanceAt(rix: Rix): { look: number; perp: number } {
  const g = TALK.glance;
  // Up is + along the gap diagonal (up-right) and − across it (up-left).
  if (quipAbove(rix)) return { look: g, perp: -g };
  const side = rix.anchor.dataset.side === "right" ? 1 : -1;
  return { look: side * g, perp: side * g };
}

/**
 * The quip's side for a line starting now (R5.3): right when his left has too little room and his
 * right has more; otherwise left, as built (so a right-side quip never hangs past the shelf's end).
 */
export function setQuipSide(rix: Rix) {
  if (quipAbove(rix)) {
    delete rix.anchor.dataset.side;
    return;
  }
  const track = measureTrack(rix);
  const left = roomLeft(track);
  rix.anchor.dataset.side = left < TALK.sideRoom && roomRight(track) > left ? "right" : "left";
}

/**
 * True while no act holds `upper` and the mood is neutral: the bobs may run. Hover mode's base
 * expression (R4.9) leaves `upper` free between its beats.
 */
function upperFree(rix: Rix): boolean {
  const { act, hold, mood, bot } = rix;
  const talking = act === null || act === "chatter" || act === "poke" || act === "ask";
  const free = hold === null || (rix.hovering !== null && act === null);
  return talking && free && mood === "neutral" && bot.state !== "napping" && !gsap.isTweening(bot.parts.upper);
}

/** True while the eyes are neutral and still (not turned away, not mid-move): the squish may run. */
const eyesNeutral = (rix: Rix) =>
  rix.emotion === null &&
  rix.wall === null &&
  rix.mood === "neutral" &&
  rix.bot.state !== "napping" &&
  !rix.bot.parts.eye.some((eye) => gsap.isTweening(eye));

/** True while the eyes may glance: not annoyed, angry, in love or turned away, nor held on a card. */
const mayGlance = (rix: Rix) =>
  rix.wall === null &&
  rix.hovering === null &&
  rix.emotion !== "annoyed" &&
  rix.emotion !== "angry" &&
  rix.emotion !== "love" &&
  rix.bot.state !== "napping";

/** A word's first character: the body talks. */
function bodyTalk(rix: Rix) {
  const { bot, crew, eyeRects } = rix;
  const { upper, eye } = bot.parts;
  if (upperFree(rix)) {
    crew.run(
      gsap
        .timeline()
        .to(upper, { y: TALK.bob, ...TALK.bobUp })
        .to(upper, { y: 0, ...TALK.bobDown }),
    );
  }
  if (eyesNeutral(rix)) {
    const { height, y, in: squishIn, out } = TALK.squish;
    const rest = (i: number) => eyeRects[i] ?? eyeRects[0] ?? [0, 0, 0, 0];
    crew.run(
      gsap
        .timeline()
        .to(eye, { attr: { y: (i: number) => rest(i)[1] + y, height }, duration: squishIn, ease: "power2.out" })
        .to(eye, { attr: { y: (i: number) => rest(i)[1], height: (i: number) => rest(i)[3] }, duration: out, ease: "power2.in" }),
    );
  }
}

/**
 * The typed line `line`, starting `at` seconds from now: the box shows, the characters reveal,
 * the body talks, then the hold and the fade out. The caller hides the box until then.
 */
export function typeLine(rix: Rix, line: string, at: number): gsap.core.Timeline {
  const { bot, quip } = rix;
  const letters = Array.from(line);
  const times: number[] = [];
  let time = at;
  letters.forEach((letter) => {
    times.push(time);
    time += TALK.char + (TALK.pauseAfter.includes(letter) ? TALK.pause : 0);
  });
  const last = times[times.length - 1] ?? at;
  let spans: HTMLElement[] = [];

  const tl = gsap.timeline();
  tl.call(
    () => {
      spans = chars(rix);
      gsap.set(spans, { opacity: 0 });
      gsap.set(quip, { opacity: 1, y: 0 });
      if (mayGlance(rix)) rix.crew.run(gsap.to(bot.ch, { ...glanceAt(rix), ...LOOK_AT, overwrite: "auto" }));
    },
    [],
    at,
  );
  letters.forEach((letter, i) => {
    const start = letter !== " " && (i === 0 || letters[i - 1] === " ");
    tl.call(
      () => {
        if (spans.length === 0) {
          spans = chars(rix);
          gsap.set(spans.slice(i), { opacity: 0 });
        }
        const span = spans[i];
        if (span) gsap.set(span, { opacity: 1 });
        if (start) bodyTalk(rix);
      },
      [],
      times[i],
    );
  });
  tl.addLabel("typed", last)
    .call(
      () => {
        if (mayGlance(rix) && bot.state === "idle" && rix.target === null) {
          rix.crew.run(gsap.to(bot.ch, { look: bot.restLook, perp: 0, ...LOOK_BACK, overwrite: "auto" }));
        }
      },
      [],
      last,
    )
    .to(quip, { opacity: 0, ...QUIP_OUT }, last + QUIP_HOLD);
  return tl;
}
