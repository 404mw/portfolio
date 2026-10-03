// Rix's walk track (ui-spec/00-rix.md R4.1): the shelf (`about-rix-stage`) and his walker's place
// on it, in walker `x` px. There's no home: `x` 0 (the shelf's right end, as built) is only where he
// stands at first paint; the left end is `minX`. A card's stand spot puts his body centre over the
// card's centre; a card walk goes at most `WALK.reach` toward it, stopping partway past that.
// Measured in handlers and at each walk's start, never inside a tween. Pure reads: nothing moves.
import { gsap } from "@/lib/gsap";
import { WALK } from "@/lib/rixMotion";
import type { RixParts } from "@/lib/rixRig";

/** The body's centre as a share of the box width: viewBox x 50 in `-30 … 140`. */
const BODY_CENTRE = 80 / 170;

export type Track = {
  /** The walker's `x` now. */
  readonly x: number;
  /** The left end's `x` (≤ 0). */
  readonly minX: number;
  /** The box's left edge at `x` 0 (client px). */
  readonly startLeft: number;
  /** The box's width (px). */
  readonly width: number;
  /** The shelf's left and right edges (client px). */
  readonly left: number;
  readonly right: number;
};

export const walkerX = (parts: RixParts) => Number(gsap.getProperty(parts.walker, "x")) || 0;

export function measureTrack(parts: RixParts): Track {
  const x = walkerX(parts);
  const box = parts.walker.getBoundingClientRect();
  const shelf = parts.stage.getBoundingClientRect();
  const startLeft = box.left - x;
  return {
    x,
    minX: Math.min(0, shelf.left - startLeft),
    startLeft,
    width: box.width,
    left: shelf.left,
    right: shelf.right,
  };
}

export const clampX = (track: Track, x: number) => Math.max(track.minX, Math.min(0, x));

/** The stand spot for a card: his body centre over the card's centre, clamped to the shelf. */
export function spotFor(track: Track, element: Element): number {
  const visual = element.lastElementChild ?? element;
  const box = visual.getBoundingClientRect();
  return clampX(track, box.left + box.width / 2 - (track.startLeft + BODY_CENTRE * track.width));
}

/** The stand spot for a client x (the playground's shelf centre). */
export function spotAt(track: Track, clientX: number): number {
  return clampX(track, clientX - (track.startLeft + BODY_CENTRE * track.width));
}

/** `spot`, or the partway spot `WALK.reach` from `from` toward it if it's farther (R4.1). */
export function reachToward(track: Track, spot: number, from: number = track.x): number {
  const by = spot - from;
  return clampX(track, Math.abs(by) <= WALK.reach ? spot : from + Math.sign(by) * WALK.reach);
}

/** The body centre's client x at walker `x`. */
export const bodyCentreAt = (track: Track, x: number = track.x) => track.startLeft + x + BODY_CENTRE * track.width;

/** The room (px) left of his box at walker `x`. */
export const roomLeft = (track: Track, x: number = track.x) => track.startLeft + x - track.left;

/** The room (px) right of his box at walker `x`. */
export const roomRight = (track: Track, x: number = track.x) => track.right - (track.startLeft + x + track.width);
