// The process bots' scroll-in entrance (ui-spec §5.7 layer 9), full motion: each bot drops onto
// the ground line, fading in as it falls, stretched, eyes shut; lands in a squash and settles, opens
// its eyes, glances toward the next bot (bot 4 at bot 1) and looks back. The from-state is set
// here, in JS only, just before the drop can play; the drop itself isn't in the crew registry, so
// it always finishes (a bot is never left hidden or mid-air), and teardown strips it like the rest.
import { gsap } from "@/lib/gsap";
import {
  DROP_EYES_OPEN,
  DROP_FADE,
  DROP_FALL,
  DROP_FROM,
  DROP_GLANCE,
  DROP_GLANCE_BACK,
  DROP_GLANCE_HOLD,
  DROP_SQUASH,
  DROP_SQUASH_TIME,
  DROP_STAGGER,
  DROP_STRETCH,
  LOOK_EASE,
  SETTLE,
} from "@/lib/processBotMotion";
import { diagonalSign } from "@/lib/processBotPointer";
import { eyeAttr, type Bot } from "@/lib/processBotRig";

export type DropCues = {
  /** A bot's feet touch the ground: its life starts. */
  readonly land: (bot: Bot) => void;
  /** A bot has looked back to rest: it's idle. */
  readonly settle: (bot: Bot) => void;
  /** The last bot has landed. */
  readonly done: () => void;
};

/** The drop's from-state: up, hidden, stretched, eyes shut. */
export function hideForDrop(bot: Bot) {
  const { rig, upper, eye } = bot.parts;
  gsap.set(rig, { y: DROP_FROM, opacity: 0 });
  gsap.set(upper, DROP_STRETCH);
  gsap.set(eye, { attr: eyeAttr(bot, "shut") });
  bot.state = "entering";
}

const centre = (svg: SVGSVGElement) => {
  const box = svg.getBoundingClientRect();
  return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
};

/** The drop for every bot, staggered. */
export function dropIn(bots: readonly Bot[], cues: DropCues): gsap.core.Timeline {
  const centres = bots.map((bot) => centre(bot.parts.svg));
  const tl = gsap.timeline();
  let lastLanding = 0;
  bots.forEach((bot, i) => {
    const { rig, upper, eye } = bot.parts;
    const start = i * DROP_STAGGER;
    const landing = start + DROP_FALL.duration;
    const glance = landing + 0.2;
    const back = glance + 0.3 + DROP_GLANCE_HOLD;
    const toward = diagonalSign(centres[i], centres[(i + 1) % centres.length]);
    lastLanding = landing;
    tl.to(rig, { y: 0, ...DROP_FALL }, start)
      .to(rig, { opacity: 1, duration: DROP_FADE, ease: "none" }, start)
      .call(cues.land, [bot], landing)
      .to(upper, { ...DROP_SQUASH, duration: DROP_SQUASH_TIME, ease: "power2.out" }, landing)
      .to(upper, { scaleX: 1, scaleY: 1, ...SETTLE }, landing + DROP_SQUASH_TIME)
      .to(eye, { attr: eyeAttr(bot, "open"), duration: DROP_EYES_OPEN, ease: "power2.out" }, landing + 0.05)
      .to(bot.ch, { look: toward * DROP_GLANCE, duration: 0.3, ease: LOOK_EASE, overwrite: "auto" }, glance)
      .to(bot.ch, { look: bot.restLook, duration: DROP_GLANCE_BACK, ease: "power2.inOut", overwrite: "auto" }, back)
      .call(cues.settle, [bot], back + DROP_GLANCE_BACK);
  });
  return tl.call(cues.done, [], lastLanding);
}
