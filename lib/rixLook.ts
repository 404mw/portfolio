// Pure mapping from a target's offset to Rix's look and lean (ui-spec 02a-about-options §2a.O4
// "Look at a pick"). No DOM, no GSAP: the caller measures, this maps. It's Process's pointer mapping
// (lib/processBotPointer.ts) with the ranges scaled by Rix's width, plus the host-only
// perpendicular channel, so a target below him still reads.
import { POINTER_RANGE } from "@/lib/processBotMotion";
import { pointerLean, pointerLook } from "@/lib/processBotPointer";
import { LOOK_PERP } from "@/lib/rixMotion";

export type RixLook = {
  /** Along the gap diagonal (+ = up-right). */
  readonly d: number;
  /** Across it (+ = down-right). */
  readonly p: number;
  /** Rig lean, degrees (+ = right). */
  readonly lean: number;
};

const clamp = (limit: number, value: number) => Math.max(-limit, Math.min(limit, value));

/** The look at an offset `vx`, `vy` (px) from Rix's eye centre, for Rix at `scale` × Process size. */
export function rixLook(vx: number, vy: number, scale: number): RixLook {
  const x = vx / scale;
  const y = vy / scale;
  return {
    d: pointerLook(x, y),
    p: clamp(LOOK_PERP, ((x + y) / Math.SQRT2 / POINTER_RANGE) * LOOK_PERP),
    lean: pointerLean(x),
  };
}

