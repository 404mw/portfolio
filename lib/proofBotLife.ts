// A proof card bot's idle (ui-spec §7.7, Idle): the body breathes (`scaleY` about the feet line),
// the arms drift out of phase, and the eyes blink on a random scheduler (`scaleY` about each eye's
// centre). Same feel and numbers as the Process bots' life (lib/processBotLife.ts), on the proof
// bot's own hooks: no sway, no looks, no taps. Everything goes into the crew registry, so it all
// pauses together while the bot isn't live.
import { gsap } from "@/lib/gsap";
import type { Crew } from "@/lib/processBotCrew";
import {
  BLINK_CLOSE,
  BLINK_GAP,
  BLINK_OPEN,
  BLINK_SCALE,
  BREATH_HALF,
  DOUBLE_BLINK,
  DOUBLE_GAP,
  DRIFT_DEG,
  DRIFT_HALF,
  LIFE_EASE,
  LIFE_IN,
  type Range,
} from "@/lib/proofBotMotion";
import type { ProofBot } from "@/lib/proofBotRig";

const pick = ([min, max]: Range) => gsap.utils.random(min, max);

/** A looping yoyo on one arm channel from −amp to +amp, started at a random point of its cycle. */
function drift(crew: Crew, bot: ProofBot, channel: "driftL" | "driftR") {
  const half = pick(DRIFT_HALF);
  const tween = crew.run(
    gsap.fromTo(
      bot.ch,
      { [channel]: -DRIFT_DEG },
      { [channel]: DRIFT_DEG, duration: half, ease: LIFE_EASE, repeat: -1, yoyo: true },
    ),
  );
  tween.totalTime(gsap.utils.random(0, half * 2));
}

/** Starts the bot's idle: breath and drift (eased in through `life`), then its blinks. */
export function startProofLife(bot: ProofBot, crew: Crew) {
  const breath = crew.run(gsap.to(bot.ch, { b: 1, duration: BREATH_HALF, ease: LIFE_EASE, repeat: -1, yoyo: true }));
  breath.totalTime(gsap.utils.random(0, BREATH_HALF * 2));
  drift(crew, bot, "driftL");
  drift(crew, bot, "driftR");
  crew.run(gsap.to(bot.ch, { life: 1, ...LIFE_IN }));
  scheduleBlink(bot, crew);
}

/** A blink (shut then open), or a double blink. */
function blink(bot: ProofBot, double: boolean): gsap.core.Timeline {
  const { eye } = bot.parts;
  const timeline = gsap.timeline({ defaults: { overwrite: "auto" } });
  timeline.to(eye, { scaleY: BLINK_SCALE, ...BLINK_CLOSE }).to(eye, { scaleY: 1, ...BLINK_OPEN });
  if (double) {
    timeline
      .to(eye, { scaleY: BLINK_SCALE, ...BLINK_CLOSE }, `+=${DOUBLE_GAP}`)
      .to(eye, { scaleY: 1, ...BLINK_OPEN });
  }
  return timeline;
}

function scheduleBlink(bot: ProofBot, crew: Crew) {
  bot.blinkTimer?.kill();
  bot.blinkTimer = crew.after(pick(BLINK_GAP), () => {
    crew.run(blink(bot, Math.random() < DOUBLE_BLINK));
    scheduleBlink(bot, crew);
  });
}
