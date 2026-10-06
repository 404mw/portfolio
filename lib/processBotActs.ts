// A process bot's acts (ui-spec §5.7 layers 5, 6, 8 and the relay catch): the builders' full and
// short acts (rules, team, check, update, host; the flows' newer roles' are in
// lib/processBotFlowActs.ts), the hover/tap reaction (the only jump), naps and waking, and the
// relay's cues (a catch, the check's find on a fix run, the lesson's hold and its return). The
// beats the relay job shares (marks, strikes, lens flicker, page flip) come from `JOB_BEATS`, so
// they line up with it. A bot does one of these at
// a time (`bot.busy`); starting one stops the idle moves in progress. The hover/tap reaction never
// cuts an act or another reaction short (a busy bot just ignores it); it only wakes a nap, easing
// every part the nap moved back to rest first, so no channel is left stranded. Tweens that
// share a property use `overwrite: "auto"`: whichever starts last owns it. Everything runs in the
// crew registry, so it pauses with the section.
import { gsap } from "@/lib/gsap";
import type { BotRole } from "@/lib/processBots";
import type { Crew } from "@/lib/processBotCrew";
import { flagAct, intakeAct, remindAct, shipAct } from "@/lib/processBotFlowActs";
import { blink, napLife, quietIdle } from "@/lib/processBotLife";
import {
  ACT_GAP,
  ANTICIPATE,
  BUSY_RETRY,
  COLUMN_LESSON_HOLD,
  JOB_BEATS,
  JUMP_FEET,
  JUMP_UP,
  LENS_FLICKER,
  LOOK_EASE,
  LOOK_MAX,
  MARK_WRITE,
  NAP_GAP,
  NAP_LENGTH,
  PAGE_FLIP,
  POP_SCALE,
  REACT_COOLDOWN,
  RELAY_CLEAR,
  RELAY_DWELL,
  RELAY_FIND,
  RELAY_GLANCE,
  RELAY_STRIKES,
  RELAY_WATCH_BLINK,
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
import { actTimeline, endLook, eyePop, nod, type Length } from "@/lib/processBotMoves";
import { eyeAttr, setState, setTimer, type Bot, type BotState } from "@/lib/processBotRig";

/** Seconds of live time until the bot's next relay catch (`Infinity` if none is due). */
export type CatchClock = (bot: Bot) => number;
const clocks = new WeakMap<Bot, CatchClock>();
/** Relay catches' watch timelines: the one busy timeline the lesson hold may cut short. */
const watches = new WeakSet<gsap.core.Timeline>();
const untilCatch = (bot: Bot) => clocks.get(bot)?.(bot) ?? Infinity;

const pick = ([min, max]: Range) => gsap.utils.random(min, max);
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
  return actTimeline()
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

/** The hammer's sparks: pop out and grow about the strike point, fly along their rays, fade. */
function sparksBurst(bot: Bot): gsap.core.Timeline {
  const { sparks, spark } = bot.parts;
  const tl = actTimeline();
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

/** Check's lens flickers off and on (`LENS_FLICKER`, shifted to start at `at`), ending lit. */
function flicker(bot: Bot, tl: gsap.core.Timeline, at: number) {
  const { lensLit } = bot.parts;
  if (!lensLit) return;
  const [first] = LENS_FLICKER;
  LENS_FLICKER.forEach((time, i) => {
    tl.set(lensLit, { opacity: i % 2 === 0 ? 0 : 1 }, at + time - first);
  });
}

// Role acts.

function rulesAct(bot: Bot, length: Length): gsap.core.Timeline {
  const { ch, parts } = bot;
  const tl = actTimeline();
  if (length === "short") {
    return tl
      .to(ch, { actL: 6, mixL: 0, duration: 0.3, ease: "power2.out" }, 0)
      .to(parts.marks, { scaleX: 0, duration: 0.1, ease: "power2.in" }, 0)
      .to(parts.marks, { scaleX: 1, duration: 0.3, ease: "power2.out", stagger: 0.06 }, 0.12)
      .add(nod(bot), 0.3)
      .to(ch, { actL: 0, mixL: 1, duration: 0.4, ease: "power2.inOut" }, 0.6);
  }
  // Fits a relay stop (`RELAY_DWELL`): done at 1.75.
  const { marks, stamp } = JOB_BEATS.rules;
  return tl
    .to(ch, { look: -LOOK_MAX, duration: 0.35, ease: "power2.out" }, 0)
    .to(ch, { actL: 10, mixL: 0, duration: 0.35, ease: "power2.out" }, 0)
    .to(parts.marks, { scaleX: 0, duration: 0.12, ease: "power2.in", stagger: 0.05 }, 0.3)
    .to(parts.marks, { scaleX: 1, ...MARK_WRITE, stagger: marks[1] - marks[0] }, marks[0])
    .add(nod(bot), stamp)
    .add(nod(bot), stamp + 0.3)
    .to(ch, { look: endLook(bot, length), actL: 0, mixL: 1, duration: 0.45, ease: "power2.inOut" }, stamp + 0.25);
}

function teamAct(bot: Bot, length: Length): gsap.core.Timeline {
  const { ch, parts } = bot;
  const strikes = length === "catch" ? RELAY_STRIKES : length === "full" ? gsap.utils.random(2, 3, 1) : 1;
  // Impacts on `JOB_BEATS.team`, evenly spaced after the second; each strike winds up 0.28 and
  // swings 0.09 before its impact.
  const [firstHit, secondHit] = JOB_BEATS.team;
  const tl = actTimeline();
  tl.to(ch, { mixR: 0, duration: 0.2, ease: "power2.out" }, 0);
  let hit = 0;
  for (let i = 0; i < strikes; i += 1) {
    hit = firstHit + i * (secondHit - firstHit);
    const t = hit - 0.37;
    // Wind-up: the head swings back over the body.
    tl.to(parts.tool, { rotation: -45, duration: 0.28, ease: "power2.out" }, t)
      .to(parts.upper, { scaleX: 1.03, scaleY: 0.96, duration: 0.28, ease: "power2.out" }, t)
      .to(ch, { look: 5, duration: 0.28, ease: "power2.out" }, t)
      .to(parts.footRight, { x: 1.5, duration: 0.28, ease: "power2.out" }, t)
      // Strike.
      .to(parts.tool, { rotation: 30, duration: 0.09, ease: "power4.in" }, t + 0.28);
    // Impact.
    tl.to(parts.upper, { scaleX: 1.05, scaleY: 0.94, duration: 0.05, ease: "power2.out" }, hit)
      .to(parts.upper, { scaleX: 1, scaleY: 1, ...SETTLE }, hit + 0.05)
      .to(parts.footLeft, { x: -1, duration: 0.05, ease: "power2.out" }, hit)
      .to(parts.footLeft, { x: 0, duration: 0.2, ease: "power2.out" }, hit + 0.05)
      .add(sparksBurst(bot), hit);
  }
  return tl
    .to(parts.tool, { rotation: 0, duration: 0.35, ease: "back.out(1.6)" }, hit + 0.15)
    .to(parts.footRight, { x: 0, duration: 0.3, ease: "power2.inOut" }, hit + 0.15)
    .to(ch, { look: endLook(bot, length), mixR: 1, duration: 0.4, ease: "power2.inOut" }, hit + 0.15);
}

/** The lens' figure-8 scan from 0.2: x (and a matching ±4° turn) makes one loop while y makes two. */
const SCAN = { x: [4, 0, -4, 0], y: [2.5, 0, -2.5, 0, 2.5, 0, -2.5, 0], leg: 0.35 } as const;

/** Adds the first `legs` x-legs of the scan (and the y-legs under them). */
function scan(bot: Bot, tl: gsap.core.Timeline, legs: number) {
  const { tool } = bot.parts;
  SCAN.x.slice(0, legs).forEach((x, i) => {
    tl.to(tool, { x, rotation: x, duration: SCAN.leg, ease: "sine.inOut" }, 0.2 + i * SCAN.leg);
  });
  SCAN.y.slice(0, legs * 2).forEach((y, i) => {
    tl.to(tool, { y, duration: SCAN.leg / 2, ease: "sine.inOut" }, 0.2 + (i * SCAN.leg) / 2);
  });
}

function checkAct(bot: Bot, length: Length): gsap.core.Timeline {
  const { ch, parts } = bot;
  const tl = actTimeline();
  if (length === "short") {
    tl.to(ch, { tilt: 3, duration: 0.3, ease: "power2.out" }, 0);
    flicker(bot, tl, 0.3);
    return tl.to(ch, { tilt: 0, duration: 0.4, ease: "power2.inOut" }, 0.7);
  }
  tl.to(ch, { tilt: 3, duration: 0.4, ease: "power2.out" }, 0);
  if (length === "find") {
    // A fix run: the scan stops short (three legs, to 1.25) and the check finds something. No
    // pass flicker: the lens comes back to rest, the eyes pop (`RELAY_FIND.pop`) with a feet-planted
    // startle, and the bot rocks back off the lens. Done at 1.98; the job leaves at `RELAY_FIND.dwell`.
    const { pop } = RELAY_FIND;
    scan(bot, tl, 3);
    return tl
      .to(parts.tool, { x: 0, y: 0, rotation: 0, duration: 0.25, ease: "power2.out" }, pop)
      .add(eyePop(bot), pop)
      .to(parts.upper, { ...SQUASH, duration: 0.08, ease: "power2.out" }, pop)
      .to(parts.upper, { scaleX: 1, scaleY: 1, ...SETTLE }, pop + 0.08)
      .to(ch, { tilt: -2, duration: 0.12, ease: "power2.out" }, pop)
      .to(ch, { tilt: 0, duration: 0.4, ease: "power2.inOut" }, pop + 0.25);
  }
  // Fits a relay stop (`RELAY_DWELL`): the scan ends at 1.6, the act at 1.95.
  scan(bot, tl, SCAN.x.length);
  flicker(bot, tl, LENS_FLICKER[0]);
  // A timed act sometimes ends on the "found it" pop. A relay catch never does: there the pop
  // means the job goes back (`find`), and a pass is the flicker alone.
  if (length === "full" && Math.random() < 0.35) tl.add(eyePop(bot), 1.55);
  // A timed act leaves the eyes where they are; a relay catch turns them onto the job.
  const back = length === "catch" ? { tilt: 0, look: endLook(bot, length) } : { tilt: 0 };
  return tl.to(ch, { ...back, duration: 0.4, ease: "power2.inOut" }, 1.55);
}

/** One ratchet of the wrench (`RATCHET.turn` then `back`), with a small counter-lean of the whole bot. */
const RATCHET = { turn: 0.14, back: 0.1 } as const;
function ratchet(bot: Bot, tl: gsap.core.Timeline, at: number) {
  const { turn, back } = RATCHET;
  tl.to(bot.parts.tool, { rotation: -30, duration: turn, ease: "power2.out" }, at)
    .to(bot.ch, { tilt: -1.5, duration: turn, ease: "power2.out" }, at)
    .to(bot.parts.tool, { rotation: 0, duration: back, ease: "power2.in" }, at + turn)
    .to(bot.ch, { tilt: 0, duration: back, ease: "power2.in" }, at + turn);
}

function updateAct(bot: Bot, length: Length): gsap.core.Timeline {
  const { ch, parts } = bot;
  const tl = actTimeline();
  if (length === "short") {
    tl.to(ch, { mixR: 0, duration: 0.2, ease: "power2.out" }, 0);
    ratchet(bot, tl, 0.1);
    return tl.to(ch, { mixR: 1, duration: 0.3, ease: "power2.inOut" }, 0.5);
  }
  // Fits a relay stop (`RELAY_DWELL`): three quick ratchets, the look to the rulebook, the flip on
  // `JOB_BEATS.update.flip` (so the job's fold settles by 1.95), done at 1.9.
  const { page, marks } = parts;
  const { flip, rewrite } = JOB_BEATS.update;
  tl.to(ch, { look: 5, duration: 0.25, ease: "power2.out" }, 0).to(ch, { mixR: 0, duration: 0.2, ease: "power2.out" }, 0);
  [0.1, 0.36, 0.62].forEach((at) => ratchet(bot, tl, at));
  tl.to(ch, { look: -LOOK_MAX, duration: 0.3, ease: "power2.inOut" }, flip - 0.3).to(
    ch,
    { mixR: 1, duration: 0.3, ease: "power2.inOut" },
    0.86,
  );
  if (page) {
    // The page flips over toward the spine; the mark is re-written while it's covered.
    tl.to(page, { opacity: 1, duration: 0.06, ease: "none" }, flip - 0.06)
      .set(marks, { scaleX: 0 }, flip)
      .to(page, { scaleX: 0, ...PAGE_FLIP }, flip)
      .set(page, { opacity: 0, scaleX: 1 }, flip + PAGE_FLIP.duration)
      .to(marks, { scaleX: 1, duration: 0.3, ease: "power2.out" }, rewrite);
  }
  return tl.to(ch, { look: endLook(bot, length), duration: 0.4, ease: "power2.inOut" }, rewrite + 0.15);
}

/**
 * The host (the Discord flow's last step, the bot itself): a nod. On a relay catch it looks at the
 * job first, and the nod's dip lands on `JOB_BEATS.host.nod`.
 */
function hostAct(bot: Bot, length: Length): gsap.core.Timeline {
  if (length !== "catch") return nod(bot);
  return actTimeline()
    .to(bot.ch, { look: endLook(bot, length), duration: 0.3, ease: "power2.out" }, 0)
    .add(nod(bot), JOB_BEATS.host.nod - 0.1);
}

/**
 * A relay catch: the act, then the bot keeps its eyes on the job (where the act left them), blinks
 * once if the wait allows, and looks back to rest as the job leaves, `dwell` after the catch (or
 * when the act ends, if that's later).
 */
function watchJob(bot: Bot, act: gsap.core.Timeline, dwell: number): gsap.core.Timeline {
  const done = act.duration();
  const leave = Math.max(done, dwell);
  const tl = actTimeline().add(act, 0);
  if (leave - done >= RELAY_WATCH_BLINK) tl.add(blink(bot, false), (done + leave) / 2);
  tl.to(bot.ch, { look: bot.restLook, duration: 0.4, ease: "power2.inOut" }, leave);
  watches.add(tl);
  return tl;
}

const acts: Record<BotRole, (bot: Bot, length: Length) => gsap.core.Timeline> = {
  rules: rulesAct,
  team: teamAct,
  check: checkAct,
  update: updateAct,
  host: hostAct,
  intake: intakeAct,
  flag: flagAct,
  remind: remindAct,
  ship: shipAct,
};

// Naps.

/** The z's rise and fade, one after another, looping, until the bot wakes (Rix's nap reuses it). */
export function startZzz(bot: Bot, crew: Crew) {
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
 * Every part an act, nap or jump may have moved, eased back to rest, for when one is cut short
 * (today only a nap, by the reaction; kept whole so no channel can be left stranded):
 * tools, marks, page, sparks, lens, feet, upper, hat, eyes (open, unpopped), the act channels,
 * and breathing back from a nap. The z loop stops and its z's fade.
 */
function settleParts(bot: Bot): gsap.core.Timeline {
  const { parts, ch } = bot;
  const quick = { duration: 0.25, ease: "power2.out" };
  const tl = actTimeline();
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
  const tl = actTimeline();
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
  const tl = actTimeline();
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
 * The hover/tap reaction: a jump with popped eyes, then the short act. Only an idle or napping bot
 * reacts (a nap is interrupted, not "active"); it's ignored while the bot drops in, while it's
 * `acting` (a timed act, a relay catch and its watch of the job, the `receive`
 * squash, the last bot's lesson hold below `lg`) or `reacting`, and within `REACT_COOLDOWN` of the last one's start. An ignored hover or
 * tap is dropped, not queued, and doesn't count toward the cooldown. The next timed act comes the
 * usual gap after it ends.
 */
export function react(bot: Bot, crew: Crew) {
  if (bot.state !== "idle" && bot.state !== "napping") return;
  const now = performance.now() / 1000;
  if (now - bot.lastReact < REACT_COOLDOWN) return;
  bot.lastReact = now;
  const tl = actTimeline();
  const settle = interrupt(bot);
  if (settle) tl.add(settle, 0);
  tl.add(jump(bot), 0).add(acts[bot.role](bot, "short"), ">-0.3");
  play(bot, crew, tl, "reacting");
  nextActAfter(bot, crew, tl);
}

/** The lesson reaches the arrowhead: the rules bot (step 2) takes the loop back with a squash (idle only). */
export function receive(bot: Bot, crew: Crew) {
  if (bot.state !== "idle") return;
  const tl = actTimeline()
    .to(bot.parts.upper, { ...SQUASH, duration: 0.08, ease: "power2.out" })
    .to(bot.parts.upper, { scaleX: 1, scaleY: 1, ...SETTLE });
  play(bot, crew, tl, "acting");
}

/**
 * The relay reaches the bot, its step: an idle bot plays its full role act (no jump; team strikes
 * exactly `RELAY_STRIKES`) and watches the job until it leaves, and its next timed act comes
 * the usual gap after that, a napping one wakes, a busy one (still acting or reacting) glances
 * `toward` (+1 up-right, where the job always sits; −1 down-left) and back. The relay's job changes on its own clock either way.
 * `kind` is `find` on a fix run's first check (only the check plays it differently: it finds
 * something); `dwell` is how long the job stays, when that isn't the role's `RELAY_DWELL`.
 */
export function catchRelay(
  bot: Bot,
  crew: Crew,
  toward: 1 | -1,
  kind: "catch" | "find" = "catch",
  dwell: number = RELAY_DWELL[bot.role],
) {
  switch (bot.state) {
    case "entering":
      return;
    case "napping":
      wake(bot, crew);
      return;
    case "idle": {
      const length: Length = bot.role === "check" ? kind : "catch";
      const act = watchJob(bot, acts[bot.role](bot, length), dwell);
      play(bot, crew, act, "acting");
      nextActAfter(bot, crew, act);
      return;
    }
    default: {
      const back = bot.ch.look;
      crew.run(
        actTimeline()
          .to(bot.ch, { look: toward * RELAY_GLANCE, duration: 0.25, ease: LOOK_EASE })
          .to(bot.ch, { look: back, duration: 0.35, ease: "power2.inOut" }, "+=0.35"),
      );
    }
  }
}

/**
 * Below `lg`, as the job leaves the last bot: the lesson pops in at its left hand for `seconds`. An
 * idle bot, or one still watching the job it just let go (its look back to rest is all that's left:
 * every catch act ends inside its role's dwell), looks down-left at the lesson and holds it,
 * `acting` so a tap is ignored, then looks back to rest.
 * A napping one wakes; one busy with anything else (a reaction, a timed act) glances down-left and
 * back, as on a busy catch, so nothing it's doing is cut short.
 */
export function holdLesson(bot: Bot, crew: Crew, seconds: number) {
  if (bot.state === "entering") return;
  if (bot.state === "napping") {
    wake(bot, crew);
    return;
  }
  const watching = bot.state === "acting" && bot.busy !== null && watches.has(bot.busy);
  if (bot.state !== "idle" && !watching) {
    catchRelay(bot, crew, -1);
    return;
  }
  const { look, back } = COLUMN_LESSON_HOLD;
  const tidy = { duration: 0.15, ease: "power2.out" };
  const tl = actTimeline()
    // Eyes open, in case the watch was cut mid-blink; and the arm, tool and body at rest, in case
    // it was cut a frame before the act's last tween finished.
    .to(bot.parts.eye, { attr: eyeAttr(bot, "open"), duration: 0.08, ease: "power2.out" }, 0)
    .to(bot.ch, { actL: 0, actR: 0, mixL: 1, mixR: 1, tilt: 0, ...tidy }, 0)
    .to(bot.parts.tool, { rotation: 0, x: 0, y: 0, ...tidy }, 0)
    .to(bot.parts.upper, { scaleX: 1, scaleY: 1, ...tidy }, 0)
    .to(bot.ch, { look: -LOOK_MAX, ...look }, 0)
    .to(bot.ch, { look: bot.restLook, ...back }, Math.max(seconds, look.duration));
  play(bot, crew, tl, "acting");
}

function scheduleAct(bot: Bot, crew: Crew, delay: number) {
  setTimer(
    bot,
    "act",
    crew.after(delay, () => {
      if (bot.state !== "idle" || untilCatch(bot) < RELAY_CLEAR) {
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
      if (bot.state !== "idle" || untilCatch(bot) < NAP_LENGTH[1] + RELAY_CLEAR) {
        scheduleNap(bot, crew, pick(BUSY_RETRY));
        return;
      }
      nap(bot, crew);
      scheduleNap(bot, crew, NAP_LENGTH[1] + pick(NAP_GAP));
    }),
  );
}

/**
 * Starts the bot's act scheduler, and its nap scheduler if its role naps (rules and update). Catch
 * priority: `clock` gives the time to the bot's next relay catch; a timed act doesn't start within
 * `RELAY_CLEAR` of it, nor a nap within `NAP_LENGTH` max + `RELAY_CLEAR`; both retry after `BUSY_RETRY`.
 */
export function startActs(bot: Bot, crew: Crew, clock: CatchClock) {
  clocks.set(bot, clock);
  scheduleAct(bot, crew, pick(ACT_GAP));
  if (bot.role === "rules" || bot.role === "update") scheduleNap(bot, crew, pick(NAP_GAP));
}
