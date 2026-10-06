// The small moves every process bot's act is built from (ui-spec §5.7 layer 5): the act timeline
// (tweens that share a property hand it to whichever starts last), an act's lengths, where an act
// leaves the eyes, the eye pop and the nod. Shared by the builders' acts (lib/processBotActs.ts)
// and the flows' newer roles' (lib/processBotFlowActs.ts).
import { gsap } from "@/lib/gsap";
import { POP_SCALE, RELAY_WATCH } from "@/lib/processBotMotion";
import type { Bot } from "@/lib/processBotRig";

/**
 * How much of its act a bot plays. `full`: the timed act. `short`: after the hover/tap jump.
 * `catch`: the full act as played on a relay catch (team strikes exactly `RELAY_STRIKES`), ending
 * with the eyes on the job (`RELAY_WATCH`) rather than back at rest. `find`: the check's catch on a
 * fix run, when it finds something and sends the job back; every other role plays its `catch`.
 */
export type Length = "full" | "catch" | "find" | "short";

/** An act's timeline: tweens that share a property use `overwrite: "auto"`. */
export const actTimeline = () => gsap.timeline({ defaults: { overwrite: "auto" } });

/** Where a full act leaves the eyes: on the job after a relay catch, otherwise at rest. */
export const endLook = (bot: Bot, length: Length) => (length === "catch" ? RELAY_WATCH[bot.role] : bot.restLook);

/** The eyes pop wide and ease back; the feet stay planted. */
export function eyePop(bot: Bot): gsap.core.Timeline {
  return actTimeline()
    .to(bot.parts.eye, { scale: POP_SCALE, duration: 0.1, ease: "power2.out" }, 0)
    .to(bot.parts.eye, { scale: 1, duration: 0.3, ease: "power2.inOut" }, 0.1);
}

/** A nod: the body dips and widens, then springs back. */
export function nod(bot: Bot): gsap.core.Timeline {
  return actTimeline()
    .to(bot.parts.upper, { scaleY: 0.95, scaleX: 1.03, duration: 0.1, ease: "power2.out" })
    .to(bot.parts.upper, { scaleY: 1, scaleX: 1, duration: 0.2, ease: "power2.inOut" });
}
