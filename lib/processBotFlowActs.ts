// The acts of the roles the per-card flows added (ui-spec §5.7 "new acts"): `intake` holds the job
// out, then hands it on; `flag` raises its flag from lowered and waves it (on the relay: a look and
// a nod for a routine job, the full raise for a send, §5.11e); `remind` swings its
// bell; `ship` lifts its arrow up and to the right. Each in three lengths, like the builders' acts
// (lib/processBotActs.ts): the timed act, the short one after a hover or tap, and the relay catch,
// whose beat the relay job shares through `JOB_BEATS` and which fits inside the role's
// `RELAY_DWELL`. One writer per property: these acts write the `tool`'s `rotation` (flag, remind)
// or `x`/`y` (ship), the held emblem's `x`/`y`/`rotation` (intake; its `opacity` and `scale` are
// the relay's), `upper`'s scale, and the summed channels (`look`, `actR`, `mixR`).
import { gsap } from "@/lib/gsap";
import { JOB_BEATS, LOOK_MAX, SETTLE } from "@/lib/processBotMotion";
import { actTimeline, endLook, nod, type Length } from "@/lib/processBotMoves";
import type { Bot } from "@/lib/processBotRig";

/** Intake's held emblem at arm's length (viewBox units, degrees about its pivot) and the arm's lift. */
const HOLD_OUT = { x: 6, y: -5, rotation: 8, arm: -22 } as const;
const HELD = { x: 0, y: 0, rotation: 0 } as const;

/**
 * Intake: looks at the job in its hand, nods, holds it out, then hands it on (a relay catch: the
 * relay takes the job from the hand on `JOB_BEATS.intake.hand`, so the emblem goes back to rest
 * unseen) or brings it back (a timed act). With the job out on the relay the hand is empty: a nod.
 */
export function intakeAct(bot: Bot, length: Length): gsap.core.Timeline {
  const { ch } = bot;
  const { prop } = bot.parts;
  const held = prop !== null && (length === "catch" || Number(gsap.getProperty(prop, "opacity")) > 0.5);
  if (!prop || !held) return nod(bot);

  const { arm, ...out } = HOLD_OUT;
  const tl = actTimeline();
  if (length === "short") {
    return tl
      .to(ch, { actR: arm, mixR: 0, duration: 0.25, ease: "power2.out" }, 0)
      .to(prop, { ...out, duration: 0.25, ease: "back.out(1.6)" }, 0)
      .to(ch, { actR: 0, mixR: 1, duration: 0.35, ease: "power2.inOut" }, 0.45)
      .to(prop, { ...HELD, duration: 0.35, ease: "power2.inOut" }, 0.45);
  }

  const beats = JOB_BEATS.intake;
  tl.to(ch, { look: LOOK_MAX, duration: 0.3, ease: "power2.out" }, 0)
    .add(nod(bot), 0.12)
    .to(ch, { actR: arm, mixR: 0, duration: 0.3, ease: "power2.out" }, beats.out)
    .to(prop, { ...out, duration: 0.3, ease: "back.out(1.6)" }, beats.out);
  if (length === "full") {
    // No relay to take it: it comes back to the hand.
    return tl
      .to(ch, { actR: 0, mixR: 1, look: endLook(bot, length), duration: 0.4, ease: "power2.inOut" }, beats.hand)
      .to(prop, { ...HELD, duration: 0.4, ease: "power2.inOut" }, beats.hand);
  }
  // Handed on: a small push as the job leaves, then the arm comes down; the emblem (hidden by the
  // relay from `hand`) goes back to its place for the next job.
  return tl
    .to(ch, { actR: arm - 8, duration: 0.1, ease: "power2.out" }, beats.hand)
    .set(prop, { ...HELD }, beats.hand + 0.1)
    .to(ch, { actR: 0, mixR: 1, look: endLook(bot, length), duration: 0.4, ease: "power2.inOut" }, beats.hand + 0.1);
}

/**
 * The flag's angles about its grip (degrees, + = tipped forward, to the right): lowered, the
 * overshoot at the top of the raise, then the waves, `wave` seconds each. Lowered, the pennant's
 * far corner reaches x 154: 11px past the bot's box from `lg` (inside even the 16px gap of six
 * across at 1024) and 7px on a phone (inside the 18px gap before the text).
 */
const FLAG = { lowered: 30, over: -6, waves: [9, -7, 6, 0], wave: 0.18, short: [10, -8, 0], shortWave: 0.16 } as const;

/**
 * Flag: dips the flag, raises it (the top lands on `JOB_BEATS.flag.raise`) and waves it: the timed
 * act, and the relay's send (ui-spec §5.11e), when the job lifts off on the raise for a person. On
 * a routine relay catch it only looks at the job and nods it on, the flag staying up (the host's
 * catch; the dip lands on `JOB_BEATS.flag.nod`, inside `RELAY_DWELL.flag`).
 */
export function flagAct(bot: Bot, length: Length): gsap.core.Timeline {
  const { ch, parts } = bot;
  if (length === "catch") {
    return actTimeline()
      .to(ch, { look: endLook(bot, length), duration: 0.3, ease: "power2.out" }, 0)
      .add(nod(bot), JOB_BEATS.flag.nod - 0.1);
  }
  const tl = actTimeline();
  if (length === "short") {
    tl.to(ch, { mixR: 0, duration: 0.15, ease: "power2.out" }, 0);
    FLAG.short.forEach((rotation, i) => {
      tl.to(parts.tool, { rotation, duration: FLAG.shortWave, ease: "sine.inOut" }, 0.05 + i * FLAG.shortWave);
    });
    return tl.to(ch, { mixR: 1, duration: 0.3, ease: "power2.inOut" }, 0.05 + FLAG.short.length * FLAG.shortWave);
  }

  // The waves end at 1.27, the act at 1.7. On a send the job is gone from 0.5 (`RELAY_SEND`).
  const { raise } = JOB_BEATS.flag;
  tl.to(ch, { mixR: 0, duration: 0.2, ease: "power2.out" }, 0)
    .to(parts.tool, { rotation: FLAG.lowered, duration: 0.22, ease: "power2.inOut" }, 0)
    .to(parts.upper, { scaleX: 1.03, scaleY: 0.96, duration: 0.22, ease: "power2.out" }, 0)
    .to(ch, { look: 4, duration: 0.22, ease: "power2.out" }, 0)
    .to(parts.tool, { rotation: FLAG.over, duration: 0.2, ease: "power3.out" }, raise - 0.2)
    .to(parts.upper, { scaleX: 0.97, scaleY: 1.05, duration: 0.12, ease: "power2.out" }, raise - 0.2)
    .to(parts.upper, { scaleX: 1, scaleY: 1, ...SETTLE }, raise - 0.08)
    .to(ch, { look: LOOK_MAX, duration: 0.2, ease: "power2.out" }, raise - 0.2);
  const waving = raise + 0.05;
  FLAG.waves.forEach((rotation, i) => {
    tl.to(parts.tool, { rotation, duration: FLAG.wave, ease: "sine.inOut" }, waving + i * FLAG.wave);
  });
  return tl.to(ch, { look: endLook(bot, length), mixR: 1, duration: 0.4, ease: "power2.inOut" }, 1.3);
}

/**
 * The bell's swings about its loop (degrees, + swings the mouth toward the body) and each swing's
 * seconds; the first peaks on `JOB_BEATS.remind.ring`. At ±18° the bell stays between x 99 and
 * 137: clear of the body (x 94) and inside the bot's box.
 */
const RING = { swings: [18, -16, 12, -8, 0], times: [0.15, 0.2, 0.18, 0.16, 0.2] } as const;
const RING_SHORT = { swings: [14, -10, 0], times: [0.14, 0.18, 0.18] } as const;

/** Adds the bell's swings from `at`; returns when the bell hangs still again. */
function ring(bot: Bot, tl: gsap.core.Timeline, swings: readonly number[], times: readonly number[], at: number) {
  let t = at;
  swings.forEach((rotation, i) => {
    const duration = times[i] ?? 0.18;
    tl.to(bot.parts.tool, { rotation, duration, ease: "sine.inOut" }, t);
    t += duration;
  });
  return t;
}

/** Remind: rings the bell, with a nod on the first ring. */
export function remindAct(bot: Bot, length: Length): gsap.core.Timeline {
  const { ch } = bot;
  const tl = actTimeline();
  if (length === "short") {
    tl.to(ch, { mixR: 0, duration: 0.15, ease: "power2.out" }, 0);
    const still = ring(bot, tl, RING_SHORT.swings, RING_SHORT.times, 0.05);
    return tl.to(ch, { mixR: 1, duration: 0.3, ease: "power2.inOut" }, still);
  }

  // Fits a relay stop (`RELAY_DWELL.remind`): the bell is still at 1.04, the act done at 1.5.
  const start = JOB_BEATS.remind.ring - RING.times[0];
  tl.to(ch, { mixR: 0, look: 5, duration: 0.15, ease: "power2.out" }, 0);
  const still = ring(bot, tl, RING.swings, RING.times, start);
  return tl
    .add(nod(bot), JOB_BEATS.remind.ring - 0.1)
    .to(ch, { look: endLook(bot, length), mixR: 1, duration: 0.4, ease: "power2.inOut" }, still + 0.06);
}

/**
 * The arrow's wind-up and thrust (viewBox units; up and to the right is +x, −y) and the arm's
 * small lift with it. At the thrust's end the arrow's tip is at x 131, y 14: inside the bot's box.
 */
const SEND = { back: { x: -3, y: 3 }, out: { x: 8, y: -6 }, arm: -6 } as const;

/** Ship: pulls the arrow back, then sends it up and out (the thrust is `JOB_BEATS.ship.send`). */
export function shipAct(bot: Bot, length: Length): gsap.core.Timeline {
  const { ch, parts } = bot;
  const tl = actTimeline();
  if (length === "short") {
    return tl
      .to(ch, { mixR: 0, actR: SEND.arm, duration: 0.16, ease: "power2.out" }, 0)
      .to(parts.tool, { ...SEND.out, duration: 0.16, ease: "power3.out" }, 0.02)
      .to(parts.tool, { x: 0, y: 0, duration: 0.3, ease: "back.out(1.6)" }, 0.35)
      .to(ch, { mixR: 1, actR: 0, duration: 0.3, ease: "power2.inOut" }, 0.35);
  }

  // Fits a relay stop (`RELAY_DWELL.ship`): the arrow is back at 1.1, the act done at 1.15.
  const { send } = JOB_BEATS.ship;
  const thrust = send - 0.08;
  return tl
    .to(ch, { mixR: 0, look: LOOK_MAX, duration: 0.2, ease: "power2.out" }, 0)
    .to(parts.tool, { ...SEND.back, duration: 0.25, ease: "power2.out" }, send - 0.35)
    .to(parts.upper, { scaleX: 1.03, scaleY: 0.96, duration: 0.25, ease: "power2.out" }, send - 0.35)
    .to(parts.tool, { ...SEND.out, duration: 0.16, ease: "power3.out" }, thrust)
    .to(ch, { actR: SEND.arm, duration: 0.16, ease: "power3.out" }, thrust)
    .to(parts.upper, { scaleX: 0.97, scaleY: 1.05, duration: 0.1, ease: "power2.out" }, thrust)
    .to(parts.upper, { scaleX: 1, scaleY: 1, duration: 0.45, ease: SETTLE.ease }, thrust + 0.1)
    .to(parts.tool, { x: 0, y: 0, duration: 0.3, ease: "back.out(1.6)" }, 0.8)
    .to(ch, { actR: 0, mixR: 1, look: endLook(bot, length), duration: 0.35, ease: "power2.inOut" }, 0.8);
}
