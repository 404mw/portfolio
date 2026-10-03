// When Rix walks to a card (ui-spec/00-rix.md R4.1, R4.5–R4.7, R9), character sheet: a card hovered
// or focused for `WALK.dwell` sends him toward its stand spot, at most `WALK.reach` (R4.1): he
// arrives over it, or stops partway, `curious` and looking at it, and holds that while the target
// holds; a pick sends him toward the picked card once the pick act ends, carrying the prop. There's
// no home: quiet time belongs to the patrol (lib/rixPatrol.ts), which resumes on its own once
// nothing holds him. A walk waits for a higher act and starts when it ends if its target still holds
// (R2.1). Three flips of direction within 2s: he stops, `confused`, then walks on. During a
// tantrum, flee or sulk targets are ignored; after the forgive a target that still holds starts a
// walk as normal. On resize (R4.1) he's clamped to the new shelf: over a card he holds he snaps to
// its recomputed stand spot; a patrol stretch brakes; the sulk stays where it is, clamped. The legs
// themselves are lib/rixWalk.ts. Timers run in the crew.
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { brake, cut, play, releaseHold, timeline } from "@/lib/rixActs";
import { emotionIn, emotionOut } from "@/lib/rixEmote";
import { TALK, WALK, WALK_FLIPS } from "@/lib/rixMotion";
import { inTantrum, mayStart } from "@/lib/rixPriority";
import type { Rix } from "@/lib/rixRig";
import { clampX, measureTrack, reachToward, spotFor } from "@/lib/rixTrack";
import { walkTo } from "@/lib/rixWalk";

const chipHook = '[data-anim="about-chip"]';

type Goal = {
  /** The card to walk toward. */
  readonly card: Element;
  /** It's a hover or focus target: it only walks while that still holds. */
  readonly held: boolean;
};

export type Wander = {
  /** The hovered or focused target changed (null: released). */
  readonly target: (target: Element | null) => void;
  /** A visitor's pick of `card`: he walks toward it once the pick ends. */
  readonly afterPick: (card: Element | null) => void;
  /** An act ended: a waiting walk may start. */
  readonly idle: () => void;
  /** The forgive ended: a target that still holds starts a walk. */
  readonly settle: () => void;
  readonly stop: () => void;
};

export function wander(rix: Rix): Wander {
  const { crew } = rix;
  let pending: Goal | null = null;
  let goal: Goal | null = null;
  /** The last walk was aimed at the card's stand spot itself (not a partway spot). */
  let reached = false;
  let dwell: gsap.core.Tween | null = null;
  let flips: number[] = [];

  const stillHolds = (wanted: Goal) => !wanted.held || rix.target?.closest(chipHook) === wanted.card;

  /** Three flips of direction within `WALK_FLIPS.window`: stop, `confused`, then on to `next`. */
  const flipped = (dir: number): boolean => {
    if (rix.act !== "walk" || rix.walkDir === 0 || dir === rix.walkDir) return false;
    const now = crew.now();
    flips = [...flips.filter((at) => now - at < WALK_FLIPS.window), now];
    return flips.length >= WALK_FLIPS.count;
  };

  const confused = (next: Goal) => {
    flips = [];
    const tl = timeline();
    const settle = cut(rix);
    if (settle) tl.add(settle, 0);
    tl.add(emotionIn(rix, "confused"), 0)
      .add(emotionOut(rix, "confused"), WALK_FLIPS.hold)
      .call(
        () => {
          pending = next;
        },
        [],
        WALK_FLIPS.hold,
      );
    play(rix, tl, "walk");
  };

  const go = (wanted: Goal) => {
    const track = measureTrack(rix);
    const spot = spotFor(track, wanted.card);
    const x = reachToward(track, spot);
    if (Math.abs(x - track.x) >= WALK.minDist && flipped(Math.sign(x - track.x))) {
      confused(wanted);
      return;
    }
    goal = wanted;
    reached = Math.abs(x - spot) < 0.5;
    const { card } = wanted;
    walkTo(rix, x, { card, holdCurious: () => rix.target?.closest(chipHook) === card });
  };

  function request(wanted: Goal) {
    if (inTantrum(rix)) return;
    if (!mayStart(rix, "walk")) {
      pending = wanted;
      return;
    }
    pending = null;
    go(wanted);
  }

  // Resize: clamped to the new shelf. Like a walk start, a move fades the current line out first,
  // so a line never keeps a side that no longer fits (R5.3).
  const snap = () => {
    if (rix.act === "patrol" && rix.walkDir !== 0) {
      brake(rix);
      return;
    }
    if (rix.walkDir !== 0) return;
    const track = measureTrack(rix);
    let x = clampX(track, track.x);
    const card = goal?.card;
    if (!rix.wall && card && reached && rix.hold === "curious" && rix.target?.closest(chipHook) === card) {
      x = spotFor(track, card);
    }
    if (Math.abs(x - track.x) <= 0.5) return;
    rix.quipOut(TALK.walkOut);
    gsap.set(rix.walker, { x });
  };
  const resize = new ResizeObserver(snap);
  resize.observe(rix.stage);
  ScrollTrigger.addEventListener("refresh", snap);

  return {
    target: (target) => {
      dwell?.kill();
      dwell = null;
      if (inTantrum(rix)) return;
      const card = target?.closest(chipHook) ?? null;
      if (card) {
        dwell = crew.after(WALK.dwell, () => {
          dwell = null;
          if (rix.target === target) request({ card, held: true });
        });
        return;
      }
      if (pending?.held) pending = null;
      if (rix.hold === "curious") releaseHold(rix);
    },
    afterPick: (card) => {
      pending = card ? { card, held: false } : null;
    },
    idle: () => {
      if (rix.act !== null || !pending) return;
      const wanted = pending;
      if (!stillHolds(wanted)) {
        pending = null;
        return;
      }
      request(wanted);
    },
    settle: () => {
      const card = rix.target?.closest(chipHook) ?? null;
      if (card) request({ card, held: true });
    },
    stop: () => {
      dwell?.kill();
      resize.disconnect();
      ScrollTrigger.removeEventListener("refresh", snap);
    },
  };
}
