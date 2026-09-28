// Pure mapping from the pointer to a process bot's look and lean (ui-spec §5.7 layer 7). No DOM,
// no GSAP: the hook measures, this maps. The look is the pointer's offset from the bot's eye centre
// projected onto the gaps' up-right diagonal; the lean follows the horizontal offset only.
import { LEAN_MAX, LEAN_RANGE, LOOK_MAX, POINTER_RANGE } from "@/lib/processBotMotion";

/** The bot SVG's viewBox (`-30 -18 170 110`). */
const VIEWBOX = { x: -30, y: -18, width: 170, height: 110 } as const;

/** viewBox (50, 50), the eyes' centre and the body's centre line, as a share of the SVG box. */
export const EYE_POINT = {
  x: (50 - VIEWBOX.x) / VIEWBOX.width,
  y: (50 - VIEWBOX.y) / VIEWBOX.height,
} as const;

const clamp = (limit: number, value: number) => Math.max(-limit, Math.min(limit, value));

/** Look along the gap diagonal (+ = up-right), from the pointer's offset `vx`, `vy` in page px. */
export function pointerLook(vx: number, vy: number): number {
  return clamp(LOOK_MAX, ((vx - vy) / Math.SQRT2 / POINTER_RANGE) * LOOK_MAX);
}

/** Rig lean in degrees (+ leans right) from the pointer's horizontal offset in page px. */
export function pointerLean(vx: number): number {
  return clamp(LEAN_MAX, (vx / LEAN_RANGE) * LEAN_MAX);
}

/** A box's eye centre in page coordinates, from its viewport rect and the scroll offsets. */
export function eyeCentre(rect: DOMRectReadOnly, scrollX: number, scrollY: number) {
  return {
    x: rect.left + scrollX + EYE_POINT.x * rect.width,
    y: rect.top + scrollY + EYE_POINT.y * rect.height,
  };
}

/** +1 if `to` lies up-right of `from` along the gap diagonal, else −1 (the entrance glance). */
export function diagonalSign(from: { x: number; y: number }, to: { x: number; y: number }): 1 | -1 {
  return to.x - from.x - (to.y - from.y) >= 0 ? 1 : -1;
}
