// The fix hop from `wide` (ui-spec §5.3a "Motion (later)"): when the check finds something, the job
// hops back to the work step in one arc that rises into the dashed fix arch and comes down at the
// work step's stop, and the arch's lit overlay (`process-fix-lit`) turns solid violet right to
// left behind it; it stays lit while the work is done again and fades as the job heads forward.
// Only `process-fix-lit` and the job are written: never `process-fix` or step 4's `<li>`, whose
// label's `z-10` a transform or an opacity would trap. The overlay is revealed with `clip-path`, as
// the return's is (lib/processRelayTrail.ts), and faded with `opacity`. Below `wide` there is no
// arch: the job goes back along the dotted fix line while it lights behind it
// (lib/processRelayColumn.ts, lib/processRelayFixLine.ts); `fixLitFade` puts that light out too.
import type { gsap } from "@/lib/gsap";
import { FIX_HOP, FIX_LIT_FADE } from "@/lib/processBotMotion";
import type { PointAt } from "@/lib/processRelayJob";
import type { Mover } from "@/lib/processRelayTrail";

/** How long the light takes to run down the arch's last leg to the arrowhead, once the job has landed. */
const LIT_LAND = 0.2;

/**
 * The hop back as one arc to `to`: `x` across the whole hop, `y` up to `apex` (the job's anchor at
 * the top, inside the arch) for the first half and down for the second.
 */
export function arc(tl: gsap.core.Timeline, to: PointAt, apex: () => number): Mover {
  const half = FIX_HOP.duration / 2;
  return (target, at) => {
    tl.to(target, { x: () => to().x, duration: FIX_HOP.duration, ease: FIX_HOP.ease }, at)
      .to(target, { y: () => Math.min(apex(), to().y), duration: half, ease: FIX_HOP.up }, at)
      .to(target, { y: () => to().y, duration: half, ease: FIX_HOP.down }, at + half);
  };
}

const inset = (left: number) => `inset(0px 0px 0px ${Math.max(0, left)}px)`;

/**
 * From `t`, over the hop back: the overlay is shown and its left clip edge runs with the job's `x`
 * (`from` → `to`, px from the overlay's left edge, on the hop's own ease), so the arch is lit only
 * behind the job; once the job lands the light runs on down the last leg to the arrowhead.
 */
export function fixLitSweep(tl: gsap.core.Timeline, lit: Element, from: () => number, to: () => number, t: number) {
  tl.set(lit, { opacity: 1, clipPath: () => inset(from()) }, t)
    .to(lit, { clipPath: () => inset(to()), duration: FIX_HOP.duration, ease: FIX_HOP.ease }, t)
    .to(lit, { clipPath: inset(0), duration: LIT_LAND, ease: "power2.out" }, t + FIX_HOP.duration);
}

/** From `t` (the job heads forward again): the overlay fades out. */
export function fixLitFade(tl: gsap.core.Timeline, lit: Element, t: number) {
  tl.to(lit, { opacity: 0, duration: FIX_LIT_FADE, ease: "none" }, t);
}
