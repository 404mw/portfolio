// Rix's tag (ui-spec/00-rix.md R6.4), full motion, fine pointer only, not on the play clock. When
// the pointer comes within `TAG.near` × his scale of his eye centre, approaching at `TAG.speed` or
// more and not over him, he dodges: `surprised`, a hop away from the pointer's side along the shelf,
// then `happy`; with no room on that side, a duck. After `TAG.dodges` in one `TAG.session` he lets
// himself be caught: hovering him then plays `shy` and `happy` (in place of the perk), and he rests
// `TAG.rest` with no dodges. The pointer is read once per frame, never inside a tween.
import { SETTLE, SQUASH, STRETCH } from "@/lib/processBotMotion";
import { eyeCentre } from "@/lib/processBotPointer";
import { cut, play, timeline } from "@/lib/rixActs";
import { emotionIn, emotionOut } from "@/lib/rixEmote";
import { TAG, TALK } from "@/lib/rixMotion";
import type { Rix } from "@/lib/rixRig";
import { clampX, measureTrack } from "@/lib/rixTrack";

/** He hops `dir` (−1 left, 1 right) along the shelf, or ducks if there's no room that way. */
export function dodge(rix: Rix, dir: -1 | 1) {
  const track = measureTrack(rix);
  const to = clampX(track, track.x + dir * TAG.hop);
  if (Math.abs(to - track.x) < TAG.hop / 2) {
    duck(rix);
    return;
  }
  const { parts } = rix.bot;
  const half = TAG.hopTime / 2;
  // He moves along the shelf: the current line fades, as on a walk start (R5.3).
  rix.quipOut(TALK.walkOut);
  const tl = timeline();
  const settle = cut(rix);
  if (settle) tl.add(settle, 0);
  tl.add(emotionIn(rix, "surprised", { eyesOnly: true }), 0)
    .to(rix.walker, { x: to, duration: TAG.hopTime, ease: "power2.inOut" }, 0)
    .to(parts.upper, { y: TAG.hopLift, ...STRETCH, duration: half, ease: "power2.out" }, 0)
    .to(parts.upper, { y: 0, duration: half, ease: "power2.in" }, half)
    .to([parts.footLeft, parts.footRight], { y: TAG.hopFeet, duration: half, ease: "power2.out" }, 0)
    .to([parts.footLeft, parts.footRight], { y: 0, duration: half, ease: "power2.in" }, half)
    .to(parts.upper, { ...SQUASH, duration: 0.06, ease: "power2.out" }, TAG.hopTime)
    .to(parts.upper, { scaleX: 1, scaleY: 1, ...SETTLE }, TAG.hopTime + 0.06)
    .add(emotionOut(rix, "surprised", { eyesOnly: true }), TAG.hopTime)
    .add(emotionIn(rix, "happy"), TAG.hopTime)
    .add(emotionOut(rix, "happy"), TAG.hopTime + TAG.shy);
  play(rix, tl, "play");
}

/** The duck: down and squashed, a hold, back with `SETTLE`. */
export function duck(rix: Rix) {
  const { parts } = rix.bot;
  const tl = timeline();
  const settle = cut(rix);
  if (settle) tl.add(settle, 0);
  tl.add(emotionIn(rix, "surprised", { eyesOnly: true }), 0)
    .to(parts.upper, { y: TAG.duck, scaleY: TAG.duckScale, duration: TAG.duckIn, ease: "power2.out" }, 0)
    .to(parts.upper, { y: 0, scaleY: 1, ...SETTLE }, TAG.duckIn + TAG.duckHold)
    .add(emotionOut(rix, "surprised", { eyesOnly: true }), TAG.duckIn + TAG.duckHold);
  play(rix, tl, "play");
}

/** Caught: `shy` (with the thinking dots), then `happy` with the sparkle. */
export function caught(rix: Rix) {
  const tl = timeline();
  const settle = cut(rix);
  if (settle) tl.add(settle, 0);
  tl.add(emotionIn(rix, "shy"), 0)
    .add(emotionOut(rix, "shy"), TAG.shy)
    .add(emotionIn(rix, "happy", { emote: "sparkle" }), TAG.shy)
    .add(emotionOut(rix, "happy"), TAG.shy + TAG.shy);
  play(rix, tl, "play", "reacting");
}

export type TagWatch = {
  /** Hovering Rix: true if he let himself be caught (the caller skips the perk). */
  readonly hover: () => boolean;
  readonly stop: () => void;
};

/** Watches the fine pointer for tag; `may` says whether a dodge may start now. */
export function tagWatch(rix: Rix, may: () => boolean): TagWatch {
  const { crew, button } = rix;
  let last: { distance: number; time: number } | null = null;
  let pointer: { x: number; y: number; over: boolean; time: number } | null = null;
  let raf = 0;
  let session: number[] = [];
  let catchable = false;
  let restUntil = -Infinity;

  const check = () => {
    raf = 0;
    if (!pointer || !crew.isLive()) return;
    const eye = eyeCentre(rix.svg.getBoundingClientRect(), 0, 0);
    const distance = Math.hypot(pointer.x - eye.x, pointer.y - eye.y);
    const prev = last;
    last = { distance, time: pointer.time };
    if (!prev || pointer.over || catchable || crew.now() < restUntil) return;
    const dt = pointer.time - prev.time;
    if (dt <= 0) return;
    const approach = (prev.distance - distance) / dt;
    if (distance > TAG.near * rix.scale || approach < TAG.speed || !may()) return;
    const now = crew.now();
    session = [...session.filter((at) => now - at < TAG.session), now];
    dodge(rix, pointer.x < eye.x ? 1 : -1);
    if (session.length >= TAG.dodges) {
      catchable = true;
      session = [];
    }
  };

  const onMove = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    const over = event.target instanceof Node && button.contains(event.target);
    pointer = { x: event.clientX, y: event.clientY, over, time: event.timeStamp / 1000 };
    if (!raf) raf = requestAnimationFrame(check);
  };
  window.addEventListener("pointermove", onMove, { passive: true });

  return {
    hover: () => {
      if (!catchable) return false;
      catchable = false;
      restUntil = crew.now() + TAG.rest;
      caught(rix);
      return true;
    },
    stop: () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    },
  };
}
