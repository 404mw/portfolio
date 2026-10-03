// Rix's arrival on About (ui-spec 02a-about-options §2a.O4 "Arrival"), full motion: he peeks round
// the shelf's right end in `about-rix-stage`, looks left and right, spots the visitor (eye pop,
// a small duck), then hops into place, the stage's clip cleared at the hop's peak, and lands in a
// squash; life starts on landing and the ask (the wave) follows. The from-state is set here, in JS
// only, just before the peek can play. Like Process's drop, the peek isn't in the crew registry, so
// it always finishes (Rix is never left hidden). The prompt and picks aren't held back for it: they
// arrive with the body's reveal.
//
// With the character sheet (ui-spec/00-rix.md R9) he's `surprised` at the spot (the alert emote, the
// pop kept), and lets it go as he hops.
//
// `onceAtStage` is the once-per-page-load trigger, shared by both motion modes.
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { ANTICIPATE, DROP_SQUASH, POP_SCALE, SETTLE, STRETCH } from "@/lib/processBotMotion";
import {
  ASK_AFTER_LAND,
  PEEK_EDGE,
  PEEK_HOP,
  PEEK_LAND_SQUASH,
  PEEK_OUT,
  PEEK_SEARCH,
  PEEK_SPOT,
  PEEK_START,
} from "@/lib/rixMotion";
import { emotionIn, emotionOut } from "@/lib/rixEmote";
import type { Rix } from "@/lib/rixRig";

type Flag = { current: boolean };

export type ArrivalHandlers = {
  /** The stage is still below `PEEK_START`: set the from-state. */
  readonly hide: () => void;
  /** The stage reached `PEEK_START`: play the arrival. */
  readonly play: () => void;
  /** Already passed (at setup, or on a later run): show Rix at rest. */
  readonly show: () => void;
};

/** The once-per-page-load arrival trigger on `stage`. Returns its cleanup. */
export function onceAtStage(stage: HTMLElement, entered: Flag, handlers: ArrivalHandlers): () => void {
  if (entered.current) {
    handlers.show();
    return () => {};
  }
  let setup = true;
  let fired = false;
  const fire = (skip: boolean) => {
    if (fired) return;
    fired = true;
    entered.current = true;
    if (skip) handlers.show();
    else handlers.play();
  };
  const trigger = ScrollTrigger.create({ trigger: stage, start: PEEK_START, once: true, onEnter: () => fire(setup) });
  if (trigger.scroll() >= trigger.start) fire(true);
  setup = false;
  if (fired) {
    trigger.kill();
    return () => {};
  }
  handlers.hide();
  return () => trigger.kill();
}

/** The peek's from-state: behind the stage's edge, clipped, leaning. */
export function hideForPeek(rix: Rix) {
  gsap.set(rix.stage, { clipPath: PEEK_EDGE.clip });
  gsap.set(rix.bot.parts.rig, { x: PEEK_EDGE.hidden });
  rix.bot.ch.tilt = PEEK_EDGE.tilt;
  rix.bot.state = "entering";
}

export type PeekCues = {
  /** His feet touch the floor: life starts, he's idle. */
  readonly land: () => void;
  /** Just after landing: the ask. */
  readonly ask: () => void;
};

/** The arrival timeline, from the from-state `hideForPeek` set. */
export function peekIn(rix: Rix, cues: PeekCues): gsap.core.Timeline {
  const { bot, stage } = rix;
  const { rig, upper, eye } = bot.parts;
  const { ch } = bot;
  const edge = PEEK_EDGE;
  const duck = edge.at + Math.sign(edge.hidden - edge.at) * PEEK_SPOT.duck;
  const tl = gsap.timeline({ defaults: { overwrite: "auto" } });

  // Peek out, then look left and right.
  const search = PEEK_OUT.duration;
  const right = search + PEEK_SEARCH.left.duration + PEEK_SEARCH.holdLeft;
  const spot = right + PEEK_SEARCH.right.duration + PEEK_SEARCH.holdRight;
  tl.to(rig, { x: edge.at, ...PEEK_OUT }, 0)
    .to(ch, { look: -PEEK_SEARCH.look, ...PEEK_SEARCH.left }, search)
    .to(ch, { look: PEEK_SEARCH.look, ...PEEK_SEARCH.right }, right);

  // Spots the visitor: eyes front and pop, a small duck back toward hidden.
  tl.to(ch, { look: bot.restLook, ...PEEK_SPOT.look }, spot)
    .to(eye, { scale: POP_SCALE, duration: PEEK_SPOT.popUp, ease: "power2.out" }, spot)
    .to(eye, { scale: 1, duration: PEEK_SPOT.popBack, ease: "power2.inOut" }, spot + PEEK_SPOT.popUp)
    .to(rig, { x: duck, ...PEEK_SPOT.duckMove }, spot + PEEK_SPOT.duckAt);
  const eyes = { eyesOnly: true, keepLook: true } as const;
  tl.add(emotionIn(rix, "surprised", eyes), spot).add(emotionOut(rix, "surprised", eyes), spot + PEEK_HOP.at);

  // The hop: anticipate, travel to rest with a rise and fall, lean to 0.
  const hop = spot + PEEK_HOP.at;
  const go = hop + PEEK_HOP.anticipate.duration;
  const peak = go + PEEK_HOP.up.duration;
  const land = go + PEEK_HOP.travel.duration;
  tl.to(upper, { ...ANTICIPATE, ...PEEK_HOP.anticipate }, hop);
  tl.to(rig, { x: 0, ...PEEK_HOP.travel }, go)
    .to(rig, { y: PEEK_HOP.rise, ...PEEK_HOP.up }, go)
    .to(rig, { y: 0, ...PEEK_HOP.down }, peak)
    .to(upper, { ...STRETCH, ...PEEK_HOP.up }, go)
    .to(ch, { tilt: 0, ...PEEK_HOP.lean }, go)
    .set(stage, { clearProps: "clipPath" }, peak);

  // Lands: squash and settle; life starts; the ask follows.
  return tl
    .call(cues.land, [], land)
    .to(upper, { ...DROP_SQUASH, duration: PEEK_LAND_SQUASH, ease: "power2.out" }, land)
    .to(upper, { scaleX: 1, scaleY: 1, ...SETTLE }, land + PEEK_LAND_SQUASH)
    .call(cues.ask, [], land + ASK_AFTER_LAND);
}
