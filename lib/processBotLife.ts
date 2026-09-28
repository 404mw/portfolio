// A process bot's living idle (ui-spec §5.7 layers 1–4): breathing (the body stretches up from the
// feet tops, arms and hat riding along), rig sway and arm drift, all out of phase and eased in when
// the bot lands; then blinks, autonomous looks and foot taps on random schedulers. Everything goes
// into the crew registry, so it all pauses together while the section isn't live. Blinks, looks and
// taps only happen while the bot is idle; a scheduler that comes due otherwise just waits for its
// next turn, so nothing queues up. The feet never move with breathing.
import { gsap } from "@/lib/gsap";
import type { Crew } from "@/lib/processBotCrew";
import {
  BLINK_CLOSE,
  BLINK_GAP,
  BLINK_OPEN,
  BREATH_HALF,
  BREATH_STRETCH,
  DOUBLE_BLINK,
  DOUBLE_GAP,
  DRIFT_DEG,
  DRIFT_HALF,
  LIFE_EASE,
  LIFE_IN,
  LOOK_EASE,
  LOOK_HOLD,
  LOOK_MAX,
  LOOK_MOVE,
  LOOK_REST_CHANCE,
  NAP_EASE_IN,
  NAP_STRETCH,
  NAP_SWAY_TIMESCALE,
  NAP_TIMESCALE,
  SWAY_DEG,
  SWAY_HALF,
  TAP_COUNT,
  TAP_DOWN,
  TAP_GAP,
  TAP_LIFT,
  TAP_UP,
  type Range,
} from "@/lib/processBotMotion";
import { clearTimer, eyeAttr, setTimer, type Bot } from "@/lib/processBotRig";

const pick = ([min, max]: Range) => gsap.utils.random(min, max);

/** A looping yoyo on one channel from −amp to +amp, started at a random point of its cycle. */
function oscillate(crew: Crew, bot: Bot, channel: "sway" | "driftL" | "driftR", amp: number, half: number) {
  const tween = crew.run(
    gsap.fromTo(
      bot.ch,
      { [channel]: -amp },
      { [channel]: amp, duration: half, ease: LIFE_EASE, repeat: -1, yoyo: true },
    ),
  );
  tween.totalTime(gsap.utils.random(0, half * 2));
  return tween;
}

/** Starts the bot's life: breath, sway, drift, then its blink, look and tap schedulers. */
export function startLife(bot: Bot, crew: Crew) {
  const { ch, role } = bot;
  const half = BREATH_HALF[role];
  const breath = crew.run(gsap.to(ch, { b: 1, duration: half, ease: LIFE_EASE, repeat: -1, yoyo: true }));
  breath.totalTime(gsap.utils.random(0, half * 2));
  bot.loops.breath = breath;
  bot.loops.sway = oscillate(crew, bot, "sway", SWAY_DEG[role], SWAY_HALF[role]);
  bot.loops.drift = [
    oscillate(crew, bot, "driftL", DRIFT_DEG, pick(DRIFT_HALF)),
    oscillate(crew, bot, "driftR", DRIFT_DEG, pick(DRIFT_HALF)),
  ];
  crew.run(gsap.to(ch, { life: 1, ...LIFE_IN }));

  scheduleBlink(bot, crew);
  scheduleLook(bot, crew, 0);
  scheduleTap(bot, crew);
}

/** Slows breathing and sway into a nap (deeper breaths), or brings them back. */
export function napLife(bot: Bot, napping: boolean): gsap.core.Timeline {
  const timeline = gsap.timeline({ defaults: { duration: NAP_EASE_IN, ease: "sine.inOut", overwrite: "auto" } });
  timeline.to(bot.ch, { stretch: napping ? NAP_STRETCH : BREATH_STRETCH }, 0);
  if (bot.loops.breath) timeline.to(bot.loops.breath, { timeScale: napping ? NAP_TIMESCALE : 1 }, 0);
  if (bot.loops.sway) timeline.to(bot.loops.sway, { timeScale: napping ? NAP_SWAY_TIMESCALE : 1 }, 0);
  return timeline;
}

/** A blink (close then open), or a double blink. */
export function blink(bot: Bot, double: boolean): gsap.core.Timeline {
  const { eye } = bot.parts;
  const timeline = gsap.timeline({ defaults: { overwrite: "auto" } });
  timeline
    .to(eye, { attr: eyeAttr(bot, "shut"), ...BLINK_CLOSE })
    .to(eye, { attr: eyeAttr(bot, "open"), ...BLINK_OPEN });
  if (double) {
    timeline
      .to(eye, { attr: eyeAttr(bot, "shut"), ...BLINK_CLOSE }, `+=${DOUBLE_GAP}`)
      .to(eye, { attr: eyeAttr(bot, "open"), ...BLINK_OPEN });
  }
  return timeline;
}

function scheduleBlink(bot: Bot, crew: Crew) {
  setTimer(
    bot,
    "blink",
    crew.after(pick(BLINK_GAP), () => {
      if (bot.state === "idle") setTimer(bot, "blinkMove", crew.run(blink(bot, Math.random() < DOUBLE_BLINK)));
      scheduleBlink(bot, crew);
    }),
  );
}

/** Eases the eyes' own look to `d` (killing any other look tween). */
export function lookTo(bot: Bot, d: number, duration: number, ease: string): gsap.core.Tween {
  return gsap.to(bot.ch, { look: d, duration, ease, overwrite: "auto" });
}

/** Autonomous looks: while idle and the pointer isn't driving, glide to a random target and hold. */
function scheduleLook(bot: Bot, crew: Crew, moving: number) {
  setTimer(
    bot,
    "look",
    crew.after(moving + pick(LOOK_HOLD), () => {
      let move = 0;
      if (bot.state === "idle" && !bot.pointer) {
        const target = Math.random() < LOOK_REST_CHANCE ? bot.restLook : gsap.utils.random(-LOOK_MAX, LOOK_MAX);
        move = pick(LOOK_MOVE);
        setTimer(bot, "lookMove", crew.run(lookTo(bot, target, move, LOOK_EASE)));
      }
      scheduleLook(bot, crew, move);
    }),
  );
}

/** One foot lifts `TAP_LIFT` (up under its strip) and taps, `TAP_COUNT` times. Idle only. */
export function tap(bot: Bot, crew: Crew, foot?: "left" | "right") {
  if (bot.state !== "idle") return;
  const side = foot ?? (Math.random() < 0.5 ? "left" : "right");
  const target = side === "left" ? bot.parts.footLeft : bot.parts.footRight;
  const timeline = gsap.timeline({ defaults: { overwrite: "auto" } });
  for (let i = 0; i < TAP_COUNT; i += 1) {
    timeline.to(target, { y: -TAP_LIFT, ...TAP_UP }).to(target, { y: 0, ...TAP_DOWN });
  }
  setTimer(bot, "tapMove", crew.run(timeline));
}

function scheduleTap(bot: Bot, crew: Crew) {
  setTimer(
    bot,
    "tap",
    crew.after(pick(TAP_GAP), () => {
      tap(bot, crew);
      scheduleTap(bot, crew);
    }),
  );
}

/**
 * Stops the idle moves in progress when the bot leaves idle: a half-closed blink opens, a lifted
 * foot comes down, a look stops where it is. The schedulers keep running and simply wait.
 */
export function quietIdle(bot: Bot, crew: Crew) {
  const { blinkMove, tapMove } = bot.timers;
  clearTimer(bot, "lookMove");
  if (blinkMove?.isActive()) {
    crew.run(gsap.to(bot.parts.eye, { attr: eyeAttr(bot, "open"), ...BLINK_OPEN, overwrite: "auto" }));
  }
  clearTimer(bot, "blinkMove");
  if (tapMove?.isActive()) {
    crew.run(gsap.to([bot.parts.footLeft, bot.parts.footRight], { y: 0, ...TAP_DOWN, overwrite: "auto" }));
  }
  clearTimer(bot, "tapMove");
}
