// A proof card bot's hover (ui-spec §7.7, Hover; fine pointer, with the card's lift): the rig leans
// `HOVER_LEAN` further (10° → 14°) and back on leave, and the prop's act plays once per enter:
// the phone's `screen-lit` fades in and out; the fan's swatches spread about the rivet and close;
// the puzzle's `prop` tilts off its grip and snaps back with a small overshoot as `puzzle-lit`
// flashes. An act already playing is left to finish, never restarted mid-way. Every act ends at
// rest, and the lit parts hand their opacity back to their `opacity-0` class.
import { gsap } from "@/lib/gsap";
import { FAN, HOVER_LEAN, LEAN_IN, LEAN_OUT, PUZZLE, SCREEN_LIT, SWATCH_SPREAD } from "@/lib/proofBotMotion";
import type { ProofBot } from "@/lib/proofBotRig";

/** Eases the rig's hover lean in (`true`) or back to rest. */
export function hoverLean(bot: ProofBot, on: boolean): gsap.core.Tween {
  return gsap.to(bot.parts.rig, { rotation: on ? HOVER_LEAN : 0, ...(on ? LEAN_IN : LEAN_OUT), overwrite: "auto" });
}

function phoneAct(lit: SVGGElement): gsap.core.Timeline {
  return gsap
    .timeline()
    .to(lit, { opacity: 1, ...SCREEN_LIT.in })
    .to(lit, { opacity: 0, ...SCREEN_LIT.out }, `+=${SCREEN_LIT.hold}`)
    .set(lit, { clearProps: "opacity" });
}

function fanAct(swatches: readonly SVGGElement[]): gsap.core.Timeline {
  return gsap
    .timeline()
    .to(swatches, { rotation: (i: number) => SWATCH_SPREAD[i] ?? 0, ...FAN.open })
    .to(swatches, { rotation: 0, ...FAN.close }, `+=${FAN.hold}`);
}

function puzzleAct(prop: SVGGElement, lit: SVGGElement | null): gsap.core.Timeline {
  const timeline = gsap
    .timeline()
    .to(prop, { rotation: PUZZLE.tilt, y: PUZZLE.lift, ...PUZZLE.up })
    .addLabel("snap")
    .to(prop, { rotation: 0, y: 0, ...PUZZLE.snap });
  if (lit) {
    timeline
      .to(lit, { opacity: 1, duration: PUZZLE.flash.in, ease: "none" }, "snap")
      .to(lit, { opacity: 0, ...PUZZLE.flash.out })
      .set(lit, { clearProps: "opacity" });
  }
  return timeline;
}

/** Plays the bot's prop act once, unless one is still playing. */
export function playAct(bot: ProofBot) {
  if (bot.act?.isActive()) return;
  bot.act?.kill();
  const { parts } = bot;
  switch (bot.prop) {
    case "phone":
      bot.act = parts.lit ? phoneAct(parts.lit) : null;
      break;
    case "fan":
      bot.act = parts.swatches.length > 0 ? fanAct(parts.swatches) : null;
      break;
    case "puzzle":
      bot.act = puzzleAct(parts.prop, parts.lit);
      break;
  }
}
