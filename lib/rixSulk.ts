// Rix's sulk (ui-spec/00-rix.md R6A.6; back turned, ≈ 6.4s), full motion: he faces the wall (the
// shelf end he's at): the eyes slide to that side and collapse to width 0 at their wall-side edge,
// so the bare mark reads as his back; `upper` squeezes (a positive `scaleX`, never a mirror) and
// slumps, the rig tilts toward the wall, breath slows. `sulkLine` types from 0.4 (never announced).
// He holds `SULK.hold` of live time, ignoring everything; then the caller's forgive. A press
// meanwhile is a hmph: a small tilt and dip, at most one per `HMPH.gap`, with no count or line.
import { gsap } from "@/lib/gsap";
import { SETTLE, timed } from "@/lib/processBotMotion";
import { cut, play, timeline } from "@/lib/rixActs";
import { eyesTo } from "@/lib/rixEmote";
import { restEyes, sulkEyes, type Wall } from "@/lib/rixEmotions";
import { HMPH, SULK, TALK, WALK } from "@/lib/rixMotion";
import type { Rix } from "@/lib/rixRig";

/** −1 for the left wall, 1 for the right. */
export const wallSign = (wall: Wall) => (wall === "left" ? -1 : 1);

const lastHmph = new WeakMap<Rix, number>();

/** The sulk at `wall`, saying `line`; `forgive` follows the hold. */
export function sulk(rix: Rix, wall: Wall, line: string, forgive: () => void) {
  const { bot } = rix;
  const { parts, ch, loops } = bot;
  const w = wallSign(wall);
  const { slide, collapse, squeeze, slump, arms, tilt, lineAt, hold, breath } = SULK;
  rix.mood = "sulk";
  const tl = timeline();
  const settle = cut(rix);
  if (settle) tl.add(settle, 0);
  rix.wall = wall;
  eyesTo(rix, tl, restEyes, slide, 0);
  tl.to(ch, { look: w * WALK.face.d, perp: w * WALK.face.p, ...slide }, 0);
  eyesTo(rix, tl, sulkEyes(wall), timed(collapse), collapse.at);
  const [actL, actR] = arms;
  tl.to(parts.upper, { scaleX: squeeze.scaleX, scaleY: slump.scaleY, y: slump.y, duration: squeeze.duration, ease: squeeze.ease }, collapse.at)
    .to(ch, { actL, actR, mixL: 0, mixR: 0, tilt: w * tilt, duration: squeeze.duration, ease: squeeze.ease }, collapse.at);
  if (loops.breath) tl.to(loops.breath, { timeScale: breath, duration: squeeze.duration, ease: "sine.inOut" }, collapse.at);
  rix.say(line, { at: TALK.afterSulk, style: "type" });
  tl.call(forgive, [], lineAt + hold);
  play(rix, tl, "tantrum");
}

/** A press during the sulk: a small tilt and a dip, then back (no count, line or announcement). */
export function hmph(rix: Rix) {
  const now = rix.crew.now();
  if (now - (lastHmph.get(rix) ?? -Infinity) < HMPH.gap || !rix.wall) return;
  lastHmph.set(rix, now);
  const { parts, ch } = rix.bot;
  const base = wallSign(rix.wall) * SULK.tilt;
  rix.crew.run(
    gsap
      .timeline()
      .to(ch, { tilt: base + HMPH.tilt, duration: HMPH.half, ease: "sine.inOut" }, 0)
      .to(ch, { tilt: base, duration: HMPH.half, ease: "sine.inOut" }, HMPH.half)
      .to(parts.upper, { scaleY: HMPH.dip, duration: HMPH.dipTime, ease: "power2.out" }, 0)
      .to(parts.upper, { scaleY: SULK.slump.scaleY, ...SETTLE }, HMPH.dipTime),
  );
}
