// The tantrum's toss (ui-spec/00-rix.md R6A.4), full motion: only if he holds a picked prop at the
// tantrum's start ("just looking" holds none). The wind-up and fling ride the tantrum's act; the
// picked ack fades out by the release; at the release the caller's deselect runs (lib/
// aboutDeselect.ts; the playground has no radios) and the emblem flies toward the roomier side of the
// shelf, spinning and shrinking, then fades. The flight runs in the crew, outside the act, so a cut
// never freezes it mid-air; at its end its inline motion is stripped and CSS `:has` (now
// unchecked) keeps it hidden. On B it falls into the gap above the cards; on the playground's bare
// floor (lib/rixFeatures.ts `stage`) it lands on the floor line, so its paint stays on the stage.
import { gsap } from "@/lib/gsap";
import { timed } from "@/lib/processBotMotion";
import { stripMotion } from "@/lib/processBotRig";
import { rixFeatures } from "@/lib/rixFeatures";
import { ACK_OUT, TOSS } from "@/lib/rixMotion";
import { propFor, type Rix } from "@/lib/rixRig";
import { measureTrack } from "@/lib/rixTrack";

/** The viewBox's left edge and width: units → px. */
const VIEW = { x: -30, width: 170 } as const;
/** The prop slot's left and right edges (viewBox x). */
const SLOT = { left: 106, right: 130 } as const;

export type TossPlan = {
  readonly prop: SVGGElement;
  readonly ack: HTMLElement | null;
  /** The flight's `x`, in viewBox units, signed toward the roomier side. */
  readonly x: number;
};

/** The toss for the prop he holds now, or null if he holds none. */
export function planToss(rix: Rix): TossPlan | null {
  if (rix.picked === null) return null;
  const prop = propFor(rix, rix.picked);
  if (!prop) return null;
  const track = measureTrack(rix);
  const unit = track.width / VIEW.width;
  const boxLeft = track.startLeft + track.x;
  const left = boxLeft + (SLOT.left - VIEW.x) * unit - track.left;
  const right = track.right - (boxLeft + (SLOT.right - VIEW.x) * unit);
  const dir = right > left ? 1 : -1;
  const px = Math.max(0, Math.min(TOSS.x * unit, Math.max(left, right) - TOSS.inset));
  return { prop, ack: rix.acks[rix.picked] ?? null, x: (dir * px) / unit };
}

/** Adds the wind-up, fling and arm back to `tl` (the tantrum, from its start); `release` at the throw. */
export function addToss(rix: Rix, tl: gsap.core.Timeline, plan: TossPlan, release: () => void) {
  const { ch } = rix.bot;
  const { windup, fling, armBack } = TOSS;
  const { prop, ack } = plan;
  tl.call(
    () => {
      gsap.set(prop, { opacity: 1 });
      rix.armed = prop;
    },
    [],
    windup.at,
  )
    .to(ch, { actR: windup.r, mixR: 0, duration: windup.duration, ease: windup.ease }, windup.at)
    .to(ch, { actR: fling.r, duration: fling.duration, ease: fling.ease }, fling.at)
    .to(ch, { actR: 40, ...timed(armBack) }, armBack.at)
    .call(() => throwProp(rix, plan, release), [], TOSS.release);
  if (ack) tl.to(ack, { opacity: 0, ...ACK_OUT }, TOSS.release - ACK_OUT.duration);
}

/** The release: the deselect, then the emblem's flight (never cut). */
function throwProp(rix: Rix, { prop, ack, x }: TossPlan, release: () => void) {
  rix.armed = null;
  release();
  if (ack) stripMotion([ack]);
  const flight = TOSS.rise.duration + TOSS.fall.duration;
  const fadeAt = TOSS.fade.at - TOSS.release;
  const spin = Math.sign(x || 1) * TOSS.spin;
  const fallTo = rixFeatures[rix.host].stage === "floor" ? TOSS.floorY : TOSS.fall.y;
  gsap.set(prop, { svgOrigin: TOSS.origin, x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 });
  rix.crew.run(
    gsap
      .timeline()
      .to(prop, { x, rotation: spin, scale: TOSS.scale, duration: flight, ease: "none" }, 0)
      .to(prop, { y: TOSS.rise.y, duration: TOSS.rise.duration, ease: TOSS.rise.ease }, 0)
      .to(prop, { y: fallTo, duration: TOSS.fall.duration, ease: TOSS.fall.ease }, TOSS.rise.duration)
      .to(prop, { opacity: 0, duration: TOSS.fade.duration, ease: TOSS.fade.ease }, fadeAt)
      .call(() => stripMotion([prop]), [], Math.max(flight, fadeAt + TOSS.fade.duration)),
  );
}
