// The relay's trail and lit lines (ui-spec §5.7 layer 10, "Hops" and "The return"): the three
// ghosts that run each hop (and the job's exit slide) a little behind the job, the ground-lit
// segment under it, the chevron and arrowhead flash, and the return-lit overlay that turns the
// dashed path solid violet behind the lesson (no ghosts on the return). Transforms, opacity and (for the return) `clip-path` only; no filters. The flash
// colours are read from the tokens at setup, and `clearProps` hands the icons back to their class.
import { gsap } from "@/lib/gsap";
import {
  CHEVRON_PULSE,
  GHOST_IN,
  GHOST_LAG,
  GHOST_OPACITY,
  GHOST_OUT,
  GHOST_SCALE,
  LIT_FADE,
  LIT_IN,
  RELAY_HOP,
  RETURN_LIT_FADE,
  type Timing,
} from "@/lib/processBotMotion";
import type { PointAt } from "@/lib/processRelayJob";

/** The flash colours, from `--color-cream` and `--color-accent`. */
export type Lights = { readonly cream: string; readonly accent: string };

/** Reads the flash colours from the tokens, or null if either is missing (then scale only). */
export function readLights(): Lights | null {
  const style = getComputedStyle(document.documentElement);
  const cream = style.getPropertyValue("--color-cream").trim();
  const accent = style.getPropertyValue("--color-accent").trim();
  return cream && accent ? { cream, accent } : null;
}

/** One leg of a run: where it ends, and how long it takes. */
export type Leg = { readonly to: PointAt; readonly duration: number; readonly ease: string };

/**
 * Ghost k (1–3) runs the job's `legs` from `from`, `GHOST_LAG` × k after `t`, smaller and fainter
 * (scaled about its bottom centre on the ground line), fading in at its start and out as it
 * catches up at the end.
 */
export function ghostRun(
  tl: gsap.core.Timeline,
  ghosts: readonly Element[],
  from: PointAt,
  legs: readonly Leg[],
  t: number,
) {
  const length = legs.reduce((sum, leg) => sum + leg.duration, 0);
  ghosts.forEach((ghost, i) => {
    const start = t + GHOST_LAG * (i + 1);
    tl.set(
      ghost,
      { x: () => from().x, y: () => from().y, scale: GHOST_SCALE[i] ?? 1, transformOrigin: "50% 100%", opacity: 0 },
      start,
    )
      .to(ghost, { opacity: GHOST_OPACITY[i] ?? 0, duration: GHOST_IN, ease: "none" }, start)
      .to(ghost, { opacity: 0, duration: GHOST_OUT, ease: "none" }, start + length - GHOST_OUT);
    let at = start;
    legs.forEach((leg) => {
      tl.to(ghost, { x: () => leg.to().x, y: () => leg.to().y, duration: leg.duration, ease: leg.ease }, at);
      at += leg.duration;
    });
  });
}

/** Ghost k runs one hop (or the exit slide, with its `timing`) `from` → `to` along the ground line. */
export function ghostHop(
  tl: gsap.core.Timeline,
  ghosts: readonly Element[],
  from: PointAt,
  to: PointAt,
  t: number,
  timing: Timing = RELAY_HOP,
) {
  ghostRun(tl, ghosts, from, [{ to, ...timing }], t);
}

/**
 * The ground-lit segment across a hop (or the exit slide, with its `timing`) from `t`: `from` and
 * `to` are its `x` (head under the job's centre) in the clip box's coordinates. Fades in at the
 * start, fades behind the job on arrival.
 */
export function litHop(
  tl: gsap.core.Timeline,
  lit: Element,
  from: () => number,
  to: () => number,
  t: number,
  timing: Timing = RELAY_HOP,
) {
  tl.set(lit, { x: from }, t)
    .to(lit, { opacity: 1, duration: LIT_IN, ease: "none" }, t)
    .to(lit, { x: to, ...timing }, t)
    .to(lit, { opacity: 0, duration: LIT_FADE, ease: "none" }, t + timing.duration);
}

/** A chevron icon or the arrowhead flashes at `at`: scale and `cream` up, then back to `accent`. */
export function flash(tl: gsap.core.Timeline, icon: Element, at: number, lights: Lights | null) {
  const up: gsap.TweenVars = { scale: CHEVRON_PULSE.scale, transformOrigin: "50% 50%", ...CHEVRON_PULSE.up };
  const down: gsap.TweenVars = { scale: 1, ...CHEVRON_PULSE.down };
  tl.to(icon, lights ? { ...up, color: lights.cream } : up, at).to(
    icon,
    lights ? { ...down, color: lights.accent, clearProps: "color" } : down,
    at + CHEVRON_PULSE.up.duration,
  );
}

const inset = (left: number) => `inset(0px 0px 0px ${Math.max(0, left)}px)`;

/** At `t`, the return-lit overlay is shown, clipped to nothing (its left inset its full `width`). */
export function returnLitStart(tl: gsap.core.Timeline, lit: Element, width: () => number, t: number) {
  tl.set(lit, { opacity: 1, clipPath: () => inset(width()) }, t);
}

/** Over one return leg, the overlay's left inset moves to `left` (px), lighting it behind the lesson. */
export function returnLitTo(tl: gsap.core.Timeline, lit: Element, left: () => number, seconds: number, t: number) {
  tl.to(lit, { clipPath: () => inset(left()), duration: seconds, ease: "none" }, t);
}

/** The return light fades once the lesson reaches the arrowhead. */
export function returnLitFade(tl: gsap.core.Timeline, lit: Element, t: number) {
  tl.to(lit, { opacity: 0, duration: RETURN_LIT_FADE, ease: "none" }, t);
}
