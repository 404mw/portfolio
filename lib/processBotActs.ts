// A process bot's acts (ui-spec §5.7 layers 5, 6, 8 and the relay catch): each role's full and
// short act, the hover/tap reaction (the only jump), naps and waking. A bot does one of these at
// a time (`bot.busy`); starting one stops the idle moves in progress, and interrupting one eases
// every part it may have moved back to rest first, so no channel is left stranded. Tweens that
// share a property use `overwrite: "auto"`: whichever starts last owns it. Everything runs in the
// crew registry, so it pauses with the section.
import { gsap } from "@/lib/gsap";
import type { BotRole } from "@/lib/processBots";
import type { Crew } from "@/lib/processBotCrew";
import { blink, napLife, quietIdle } from "@/lib/processBotLife";
import {
  ACT_GAP,
  ANTICIPATE,
  BUSY_RETRY,
  JUMP_FEET,
  JUMP_UP,
  LOOK_EASE,
  LOOK_MAX,
  NAP_GAP,
  NAP_LENGTH,
  POP_SCALE,
  REACT_COOLDOWN,
  RELAY_GLANCE,
  SETTLE,
  SQUASH,
  STRETCH,
  Z_FADE_IN,
  Z_RISE,
  Z_SCALE_FROM,
  Z_STAGGER,
  Z_TRAVEL,
  type Range,
} from "@/lib/processBotMotion";
import { eyeAttr, setState, setTimer, type Bot, type BotState } from "@/lib/processBotRig";

type Length = "full" | "short";

const pick = ([min, max]: Range) => gsap.utils.random(min, max);
const timeline = () => gsap.timeline({ defaults: { overwrite: "auto" } });
const feet = (bot: Bot) => [bot.parts.footLeft, bot.parts.footRight];

// Shared moves.

/**
 * The jump, only ever the hover/tap reaction: anticipate, the body lifts first and the feet leave
 * last, the feet land first, then a squash, the settle and a hat wobble, with popped eyes. Seconds
 * from the spec's reaction timeline.
 */
function jump(bot: Bot): gsap.core.Timeline {
  const { upper, hat, eye } = bot.parts;
  const wobble = Math.random() < 0.5 ? -4 : 4;
  return timeline()
    .to(upper, { ...ANTICIPATE, duration: 0.1, ease: "power2.out" }, 0)
    .to(upper, { y: -JUMP_UP, ...STRETCH, duration: 0.22, ease: "power2.out" }, 0.1)
    .to(feet(bot), { y: -JUMP_FEET, duration: 0.2, ease: "power2.out" }, 0.16)
    .to(upper, { y: 0, duration: 0.22, ease: "power2.in" }, 0.34)
    .to(feet(bot), { y: 0, duration: 0.16, ease: "power2.in" }, 0.36)
    .to(upper, { ...SQUASH, duration: 0.06, ease: "power2.out" }, 0.56)
    .to(upper, { scaleX: 1, scaleY: 1, ...SETTLE }, 0.62)
    .to(hat, { rotation: wobble, duration: 0.05, ease: "power2.out" }, 0.56)
    .to(hat, { rotation: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" }, 0.61)
    .to(eye, { scale: POP_SCALE, duration: 0.12, ease: "power2.out" }, 0.1)
    .to(eye, { scale: 1, duration: 0.3, ease: "power2.inOut" }, 0.22);
}

/** The eyes pop wide and ease back; the feet stay planted. */
function eyePop(bot: Bot): gsap.core.Timeline {
  return timeline()
    .to(bot.parts.eye, { scale: POP_SCALE, duration: 0.1, ease: "power2.out" }, 0)
    .to(bot.parts.eye, { scale: 1, duration: 0.3, ease: "power2.inOut" }, 0.1);
}

/** A nod: the body dips and widens, then springs back. */
function nod(bot: Bot): gsap.core.Timeline {
  return timeline()
    .to(bot.parts.upper, { scaleY: 0.95, scaleX: 1.03, duration: 0.1, ease: "power2.out" })
    .to(bot.parts.upper, { scaleY: 1, scaleX: 1, duration: 0.2, ease: "power2.inOut" });
}

/** The hammer's sparks: pop out and grow about the strike point, fly along their rays, fade. */
function sparksBurst(bot: Bot): gsap.core.Timeline {
  const { sparks, spark } = bot.parts;
  const tl = timeline();
  if (!sparks) return tl;
  const rays = [
    { x: 4, y: 0 },
    { x: 2.8, y: 2.8 },
    { x: 0, y: 4 },
  ];
  tl.set(spark, { x: 0, y: 0 }, 0)
    .set(sparks, { opacity: 1, scale: 0.5 }, 0)
    .to(sparks, { scale: 1.2, duration: 0.25, ease: "power2.out" }, 0)
    .to(sparks, { opacity: 0, duration: 0.15, ease: "power1.in" }, 0.25);
  spark.forEach((part, i) => tl.to(part, { ...rays[i], duration: 0.25, ease: "power2.out" }, 0));
  return tl;
}

/** Check's lens flickers off and on, ending lit. */
function flicker(bot: Bot, tl: gsap.core.Timeline, at: number) {
  const { lensLit } = bot.parts;
  if (!lensLit) return;
  const holds = [0.08, 0.05, 0.12, 0.06];
  let t = at;
  holds.forEach((hold, i) => {
    tl.set(lensLit, { opacity: i % 2 === 0 ? 0 : 1 }, t);
    t += hold;
  });
  tl.set(lensLit, { opacity: 1 }, t);
}

// Role acts.

function rulesAct(bot: Bot, length: Length): gsap.core.Timeline {
  const { ch, parts } = bot;
  const tl = timeline();
  if (length === "short") {
    return tl
      .to(ch, { actL: 6, mixL: 0, duration: 0.3, ease: "power2.out" }, 0)
      .to(parts.marks, { scaleX: 0, duration: 0.1, ease: "power2.in" }, 0)
      .to(parts.marks, { scaleX: 1, duration: 0.3, ease: "power2.out", stagger: 0.06 }, 0.12)
      .add(nod(bot), 0.3)
      .to(ch, { actL: 0, mixL: 1, duration: 0.4, ease: "power2.inOut" }, 0.6);
  }
  return tl
    .to(ch, { look: -LOOK_MAX, duration: 0.4, ease: "power2.out" }, 0)
    .to(ch, { actL: 10, mixL: 0, duration: 0.4, ease: "power2.out" }, 0)
    .to(parts.marks, { scaleX: 0, duration: 0.12, ease: "power2.in", stagger: 0.05 }, 0.4)
    .to(parts.marks, { scaleX: 1, duration: 0.25, ease: "power2.out", stagger: 0.2 }, 0.7)
    .add(nod(bot), 1.4)
    .add(nod(bot), 1.7)
    .to(ch, { look: bot.restLook, actL: 0, mixL: 1, duration: 0.5, ease: "power2.inOut" }, 2.0);
}

function teamAct(bot: Bot, length: Length): gsap.core.Timeline {
  const { ch, parts } = bot;
  const strikes = length === "full" ? gsap.utils.random(2, 3, 1) : 1;
  const tl = timeline();
  tl.to(ch, { mixR: 0, duration: 0.2, ease: "power2.out" }, 0);
  let t = 0;
  let hit = 0;
  for (let i = 0; i < strikes; i += 1) {
    // Wind-up: the head swings back over the body.
    tl.to(parts.tool, { rotation: -45, duration: 0.28, ease: "power2.out" }, t)
      .to(parts.upper, { scaleX: 1.03, scaleY: 0.96, duration: 0.28, ease: "power2.out" }, t)
      .to(ch, { look: 5, duration: 0.28, ease: "power2.out" }, t)
      .to(parts.footRight, { x: 1.5, duration: 0.28, ease: "power2.out" }, t)
      // Strike.
      .to(parts.tool, { rotation: 30, duration: 0.09, ease: "power4.in" }, t + 0.28);
    hit = t + 0.37;
    // Impact.
    tl.to(parts.upper, { scaleX: 1.05, scaleY: 0.94, duration: 0.05, ease: "power2.out" }, hit)
      .to(parts.upper, { scaleX: 1, scaleY: 1, ...SETTLE }, hit + 0.05)
      .to(parts.footLeft, { x: -1, duration: 0.05, ease: "power2.out" }, hit)
      .to(parts.footLeft, { x: 0, duration: 0.2, ease: "power2.out" }, hit + 0.05)
      .add(sparksBurst(bot), hit);
    t = hit + 0.3;
  }
  return tl
    .to(parts.tool, { rotation: 0, duration: 0.35, ease: "back.out(1.6)" }, hit + 0.15)
    .to(parts.footRight, { x: 0, duration: 0.3, ease: "power2.inOut" }, hit + 0.15)
    .to(ch, { look: bot.restLook, mixR: 1, duration: 0.4, ease: "power2.inOut" }, hit + 0.15);
}

function checkAct(bot: Bot, length: Length): gsap.core.Timeline {
  const { ch, parts } = bot;
  const tl = timeline();
  if (length === "short") {
    tl.to(ch, { tilt: 3, duration: 0.3, ease: "power2.out" }, 0);
    flicker(bot, tl, 0.3);
    return tl.to(ch, { tilt: 0, duration: 0.4, ease: "power2.inOut" }, 0.7);
  }
  tl.to(ch, { tilt: 3, duration: 0.4, ease: "power2.out" }, 0);
  // Figure-8: x (and a matching ±4° turn) makes one loop while y makes two.
  [4, 0, -4, 0].forEach((x, i) => {
    tl.to(parts.tool, { x, rotation: x, duration: 0.35, ease: "sine.inOut" }, 0.3 + i * 0.35);
  });
  [2.5, 0, -2.5, 0, 2.5, 0, -2.5, 0].forEach((y, i) => {
    tl.to(parts.tool, { y, duration: 0.175, ease: "sine.inOut" }, 0.3 + i * 0.175);
  });
  flicker(bot, tl, 1.0);
  const found = Math.random() < 0.35;
  if (found) tl.add(eyePop(bot), 1.75);
  return tl.to(ch, { tilt: 0, duration: 0.5, ease: "power2.inOut" }, found ? 2.4 : 1.8);
}

/** One ratchet of the wrench, with a small counter-lean of the whole bot. */
function ratchet(bot: Bot, tl: gsap.core.Timeline, at: number) {
  tl.to(bot.parts.tool, { rotation: -30, duration: 0.22, ease: "power2.out" }, at)
    .to(bot.ch, { tilt: -1.5, duration: 0.22, ease: "power2.out" }, at)
    .to(bot.parts.tool, { rotation: 0, duration: 0.16, ease: "power2.in" }, at + 0.22)
    .to(bot.ch, { tilt: 0, duration: 0.16, ease: "power2.in" }, at + 0.22);
}

function updateAct(bot: Bot, length: Length): gsap.core.Timeline {
  const { ch, parts } = bot;
  const tl = timeline();
  if (length === "short") {
    tl.to(ch, { mixR: 0, duration: 0.2, ease: "power2.out" }, 0);
    ratchet(bot, tl, 0.1);
    return tl.to(ch, { mixR: 1, duration: 0.3, ease: "power2.inOut" }, 0.5);
  }
  tl.to(ch, { look: 5, duration: 0.3, ease: "power2.out" }, 0).to(ch, { mixR: 0, duration: 0.2, ease: "power2.out" }, 0);
  [0.2, 0.66, 1.12].forEach((at) => ratchet(bot, tl, at));
  tl.to(ch, { look: -LOOK_MAX, duration: 0.35, ease: "power2.inOut" }, 1.58).to(
    ch,
    { mixR: 1, duration: 0.3, ease: "power2.inOut" },
    1.58,
  );
  const { page, marks } = parts;
  if (page) {
    // The page flips over toward the spine; the mark is re-written while it's covered.
    tl.to(page, { opacity: 1, duration: 0.06, ease: "none" }, 1.9)
      .set(marks, { scaleX: 0 }, 1.96)
      .to(page, { scaleX: 0, duration: 0.4, ease: "power2.in" }, 1.96)
      .set(page, { opacity: 0, scaleX: 1 }, 2.36)
      .to(marks, { scaleX: 1, duration: 0.3, ease: "power2.out" }, 2.4);
  }
  return tl.to(ch, { look: bot.restLook, duration: 0.4, ease: "power2.inOut" }, 2.75);
}

const acts: Record<BotRole, (bot: Bot, length: Length) => gsap.core.Timeline> = {
  rules: rulesAct,
  team: teamAct,
  check: checkAct,
  update: updateAct,
};

// Naps.

/** The z's rise and fade, one after another, looping, until the bot wakes. */
function startZzz(bot: Bot, crew: Crew) {
  bot.zzz?.kill();
  const loop = gsap.timeline();
  bot.parts.z.forEach((z, i) => {
    const one = gsap.timeline({ repeat: -1 });
    one
      .fromTo(
        z,
        { x: 0, y: 0, scale: Z_SCALE_FROM },
        { ...Z_TRAVEL, scale: 1, duration: Z_RISE, ease: "sine.out" },
        0,
      )
      .fromTo(z, { opacity: 0 }, { opacity: 1, duration: Z_RISE * Z_FADE_IN, ease: "power1.out" }, 0)
      .to(z, { opacity: 0, duration: Z_RISE * (1 - Z_FADE_IN), ease: "power1.in" }, Z_RISE * Z_FADE_IN);
    loop.add(one, i * Z_STAGGER);
  });
  bot.zzz = crew.run(loop);
}

/**
 * Every part an act, nap or jump may have moved, eased back to rest, for when one is cut short:
 * tools, marks, page, sparks, lens, feet, upper, hat, eyes (open, unpopped), the act channels,
 * and breathing back from a nap. The z loop stops and its z's fade.
 */
function settleParts(bot: Bot): gsap.core.Timeline {
  const { parts, ch } = bot;
  const quick = { duration: 0.25, ease: "power2.out" };
  const tl = timeline();
  bot.zzz?.kill();
  bot.zzz = null;
  tl.to(ch, { tilt: 0, actL: 0, actR: 0, mixL: 1, mixR: 1, ...quick }, 0)
    .to(parts.tool, { rotation: 0, x: 0, y: 0, ...quick }, 0)
    .to(feet(bot), { x: 0, y: 0, ...quick }, 0)
    .to(parts.upper, { y: 0, scaleX: 1, scaleY: 1, ...quick }, 0)
    .to(parts.hat, { rotation: 0, ...quick }, 0)
    .to(parts.eye, { scale: 1, attr: eyeAttr(bot, "open"), duration: 0.08, ease: "power2.out" }, 0)
    .add(napLife(bot, false), 0);
  if (parts.marks.length > 0) tl.to(parts.marks, { scaleX: 1, ...quick }, 0);
  if (parts.page) tl.to(parts.page, { opacity: 0, duration: 0.1 }, 0).set(parts.page, { scaleX: 1 }, 0.1);
  if (parts.sparks) tl.to(parts.sparks, { opacity: 0, duration: 0.1 }, 0);
  if (parts.lensLit) tl.to(parts.lensLit, { opacity: 1, duration: 0.1 }, 0);
  if (parts.z.length > 0) tl.to(parts.z, { opacity: 0, duration: 0.15 }, 0);
  return tl;
}

/** Makes `tl` the bot's one current act, in `state`; back to idle when it finishes. */
function play(bot: Bot, crew: Crew, tl: gsap.core.Timeline, state: BotState) {
  quietIdle(bot, crew);
  bot.busy?.kill();
  bot.busy = tl;
  crew.run(setState(bot, state));
  tl.eventCallback("onComplete", () => {
    if (bot.busy !== tl) return;
    bot.busy = null;
    crew.run(setState(bot, "idle"));
  });
  crew.run(tl);
}

/** Stops whatever the bot is doing and returns the move that eases it back to rest. */
function interrupt(bot: Bot): gsap.core.Timeline | null {
  if (!bot.busy && bot.state !== "napping") return null;
  bot.busy?.kill();
  bot.busy = null;
  return settleParts(bot);
}

function nap(bot: Bot, crew: Crew) {
  const length = pick(NAP_LENGTH);
  const tl = timeline();
  tl.to(bot.ch, { look: bot.restLook, duration: 0.4, ease: "power2.inOut" }, 0)
    .to(bot.parts.eye, { attr: eyeAttr(bot, "slit"), duration: 0.3, ease: "power2.inOut" }, 0.3)
    .add(napLife(bot, true), 0.3)
    .call(() => startZzz(bot, crew), [], 0.6)
    .call(() => wake(bot, crew), [], 0.6 + length);
  play(bot, crew, tl, "napping");
}

/**
 * Wakes a napping bot: z's fade, eyes open and pop, a startle squash-and-settle with the feet
 * planted, a double blink, breathing back.
 */
function wake(bot: Bot, crew: Crew) {
  const { parts } = bot;
  bot.zzz?.kill();
  bot.zzz = null;
  const tl = timeline();
  if (parts.z.length > 0) tl.to(parts.z, { opacity: 0, duration: 0.15 }, 0);
  tl.to(parts.eye, { attr: eyeAttr(bot, "open"), duration: 0.08, ease: "power2.out" }, 0)
    .add(eyePop(bot), 0.08)
    .to(parts.upper, { ...SQUASH, duration: 0.08, ease: "power2.out" }, 0.1)
    .to(parts.upper, { scaleX: 1, scaleY: 1, ...SETTLE }, 0.18)
    .add(blink(bot, true), 0.4)
    .add(napLife(bot, false), 0);
  play(bot, crew, tl, "reacting");
}

// Entry points.

/**
 * The hover/tap reaction: a jump with popped eyes, then the short act. Interrupts idle acts and
 * naps; ignored while the bot drops in, and within `REACT_COOLDOWN` of the last one's start. The
 * next timed act comes the usual gap after it ends.
 */
export function react(bot: Bot, crew: Crew) {
  if (bot.state === "entering") return;
  const now = performance.now() / 1000;
  if (now - bot.lastReact < REACT_COOLDOWN) return;
  bot.lastReact = now;
  const tl = timeline();
  const settle = interrupt(bot);
  if (settle) tl.add(settle, 0);
  tl.add(jump(bot), 0).add(acts[bot.role](bot, "short"), ">-0.3");
  play(bot, crew, tl, "reacting");
  nextActAfter(bot, crew, tl);
}

/** Relay start: the first bot pushes the dot off with a squash (idle only). */
export function launch(bot: Bot, crew: Crew) {
  if (bot.state !== "idle") return;
  const tl = timeline()
    .to(bot.parts.upper, { ...SQUASH, duration: 0.08, ease: "power2.out" })
    .to(bot.parts.upper, { scaleX: 1, scaleY: 1, ...SETTLE });
  play(bot, crew, tl, "acting");
}

/**
 * The relay (or cascade) reaches the bot, its step: an idle bot plays its full role act (no jump)
 * and its next timed act comes the usual gap after that, a napping one wakes, a busy one (still acting, reacting or launching) glances `toward` (+1
 * up-right, −1 down-left) and back.
 */
export function catchRelay(bot: Bot, crew: Crew, toward: 1 | -1) {
  switch (bot.state) {
    case "entering":
      return;
    case "napping":
      wake(bot, crew);
      return;
    case "idle": {
      const act = acts[bot.role](bot, "full");
      play(bot, crew, act, "acting");
      nextActAfter(bot, crew, act);
      return;
    }
    default: {
      const back = bot.ch.look;
      crew.run(
        timeline()
          .to(bot.ch, { look: toward * RELAY_GLANCE, duration: 0.25, ease: LOOK_EASE })
          .to(bot.ch, { look: back, duration: 0.35, ease: "power2.inOut" }, "+=0.35"),
      );
    }
  }
}

function scheduleAct(bot: Bot, crew: Crew, delay: number) {
  setTimer(
    bot,
    "act",
    crew.after(delay, () => {
      if (bot.state !== "idle") {
        scheduleAct(bot, crew, pick(BUSY_RETRY));
        return;
      }
      const act = acts[bot.role](bot, "full");
      play(bot, crew, act, "acting");
      nextActAfter(bot, crew, act);
    }),
  );
}

/** Restarts the act scheduler so the next timed act comes the usual gap after `tl` ends. */
function nextActAfter(bot: Bot, crew: Crew, tl: gsap.core.Timeline) {
  scheduleAct(bot, crew, tl.duration() + pick(ACT_GAP));
}

function scheduleNap(bot: Bot, crew: Crew, delay: number) {
  setTimer(
    bot,
    "nap",
    crew.after(delay, () => {
      if (bot.state !== "idle") {
        scheduleNap(bot, crew, pick(BUSY_RETRY));
        return;
      }
      nap(bot, crew);
      scheduleNap(bot, crew, NAP_LENGTH[1] + pick(NAP_GAP));
    }),
  );
}

/** Starts the bot's act scheduler, and its nap scheduler if its role naps (rules and update). */
export function startActs(bot: Bot, crew: Crew) {
  scheduleAct(bot, crew, pick(ACT_GAP));
  if (bot.role === "rules" || bot.role === "update") scheduleNap(bot, crew, pick(NAP_GAP));
}
