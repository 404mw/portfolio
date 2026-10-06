// Rix's tantrum (ui-spec/00-rix.md R6A.3; poke 6+, 1.9s), full motion: `angry` (slanted slits, a
// glare at the pointer, puffed), four stomps L R L R with a squash on each slam, `upper` shaking and
// the arms shaking about −40 / +40, the next `angryLines` line typed from 0.15, and the toss if he
// holds a prop (lib/rixToss.ts). The `grawlix` cycles from 0 through the flee, until the sulk
// turns. At 1.9 the shake stops and the flee starts (R6A.5): toward the shelf end farther from a
// fine pointer (a scramble, `FLEE`), or from himself on touch and keyboard (a stomp walk,
// `STOMP_WALK`), both stride-locked and capped at the pace's `maxDist`; with under `WALK.minDist`
// of room he sulks where he stands, at the nearer end's side. The sulk is the caller's hand-off.
// The whole chain plays as one `tantrum` act (rank 2): only a pick outranks it, and on home's About
// the picks lock as it starts (`cues.lock`, R6A.9), so nothing cuts it there.
import { gsap } from "@/lib/gsap";
import { SETTLE, SQUASH } from "@/lib/processBotMotion";
import { cut, play, timeline } from "@/lib/rixActs";
import { emotionIn } from "@/lib/rixEmote";
import { rixEmotions, type Wall } from "@/lib/rixEmotions";
import { FLEE, STOMP_WALK, TALK, TANTRUM } from "@/lib/rixMotion";
import type { Rix } from "@/lib/rixRig";
import { addToss, planToss } from "@/lib/rixToss";
import { measureTrack } from "@/lib/rixTrack";
import { walkTo } from "@/lib/rixWalk";

export type TantrumCues = {
  /** The tantrum's start on home's About: the picks lock until the forgive ends (R6A.9). */
  readonly lock?: () => void;
  /** Announces a whole line in `RixStatus`. */
  readonly announce: (line: string) => void;
  /** The toss's release: the deselect and `throwAway` (R6A.4). */
  readonly release: () => void;
  /** The flee is over (or there was none): the sulk at `wall`. */
  readonly sulk: (wall: Wall) => void;
};

/** The flee's end (R6A.5) and the wall he'll sulk at. */
function fleeEnd(rix: Rix): { x: number; wall: Wall } {
  const track = measureTrack(rix);
  const fine = rix.pressFine && rix.pointerAt !== null;
  const toLeft =
    fine && rix.pointerAt
      ? rix.pointerAt.x > (track.left + track.right) / 2
      : track.x - track.minX > -track.x;
  return toLeft ? { x: track.minX, wall: "left" } : { x: 0, wall: "right" };
}

/** The flee: a scramble (fine pointer) or a stomp walk toward the far end, then the sulk. */
export function flee(rix: Rix, cues: TantrumCues) {
  rix.mood = "flee";
  const { x, wall } = fleeEnd(rix);
  const pace = rix.pressFine && rix.pointerAt ? FLEE : STOMP_WALK;
  const leg = walkTo(rix, x, { pace, flee: true, act: "tantrum", onArrive: () => cues.sulk(wall) });
  if (leg) return;
  // No flee: he turns his back to the shelf end nearer to him.
  const track = measureTrack(rix);
  cues.sulk(track.x - track.minX < -track.x ? "left" : "right");
}

/** The tantrum, saying `line`; the chain continues through the flee to `cues.sulk`. */
export function tantrum(rix: Rix, line: string, cues: TantrumCues) {
  const { bot } = rix;
  const { parts, ch } = bot;
  const { stomps, stomp, shake, arms, fleeAt } = TANTRUM;
  const plan = planToss(rix);
  rix.mood = "tantrum";
  cues.lock?.();
  const tl = timeline();
  const settle = cut(rix);
  if (settle) tl.add(settle, 0);
  tl.add(emotionIn(rix, "angry"), 0);

  // Stomps, L R L R; each slam squashes, then settles back to the puffed pose.
  const [puffX, puffY] = [rixEmotions.angry.upper?.scaleX ?? 1, rixEmotions.angry.upper?.scaleY ?? 1];
  stomps.forEach((at, i) => {
    const foot = i % 2 === 0 ? parts.footLeft : parts.footRight;
    const slam = at + stomp.up.duration;
    tl.to(foot, { y: stomp.lift, ...stomp.up }, at)
      .to(foot, { y: 0, ...stomp.slam }, slam)
      .to(parts.upper, { ...SQUASH, duration: stomp.squash, ease: "power2.out" }, slam + stomp.slam.duration)
      .to(parts.upper, { scaleX: puffX, scaleY: puffY, ...SETTLE }, slam + stomp.slam.duration + stomp.squash);
  });

  // The shake: `upper x` and the arms (the right one only when it isn't throwing).
  const span = shake.to - shake.from;
  const halves = Math.round(span / shake.half);
  tl.fromTo(
    parts.upper,
    { x: -shake.x },
    { x: shake.x, duration: shake.half, ease: "sine.inOut", repeat: halves - 1, yoyo: true, immediateRender: false },
    shake.from,
  );
  const armHalves = Math.round(span / arms.half);
  const armFrom = plan ? { actL: arms.l - arms.shake } : { actL: arms.l - arms.shake, actR: arms.r + arms.shake };
  const armTo = plan ? { actL: arms.l + arms.shake } : { actL: arms.l + arms.shake, actR: arms.r - arms.shake };
  tl.fromTo(ch, armFrom, { ...armTo, duration: arms.half, ease: "sine.inOut", repeat: armHalves - 1, yoyo: true, immediateRender: false }, shake.from);

  if (plan) addToss(rix, tl, plan, cues.release);
  else cues.announce(line);
  rix.say(line, { at: TALK.afterAngry, style: "type" });

  // 1.9: the shake stops (outliving the act) and the flee starts.
  tl.call(
    () => {
      rix.crew.run(gsap.to(parts.upper, { x: 0, duration: shake.stop, ease: "power2.out", overwrite: "auto" }));
      flee(rix, cues);
    },
    [],
    fleeAt,
  );
  play(rix, tl, "tantrum");
}
