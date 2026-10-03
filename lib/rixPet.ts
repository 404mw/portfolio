// Rix's pet (ui-spec/00-rix.md R6B.1), both motion modes, character sheet only: what counts as a
// pet. A mouse resting on the Rix button for `PET.hover` (anchored where it rests: drifting more
// than `PET.drift` re-anchors and restarts the timer; leaving cancels it), or a touch or pen held on
// it for `PET.press` (moving more than `PET.slop`, a `pointercancel` or lifting early cancels it,
// so a short tap stays a poke). The click that ends a long-press is swallowed: it never counts.
// One pet per hover or press, and none until `PET.rest` after a love ends. When the timer completes
// and the caller's gate refuses (an act above the pet runs, the mood isn't neutral), it restarts,
// so a pointer still resting gets its pet once the higher act ends. Keyboard has no pet: Enter and
// Space stay pokes. Never a poke, never counted, never announced. Timers run in the crew, so they
// pause off screen and in a hidden tab.
import type { gsap } from "@/lib/gsap";
import type { Crew } from "@/lib/processBotCrew";
import { PET } from "@/lib/rixMotion";

export type PetOptions = {
  readonly crew: Crew;
  readonly button: HTMLElement;
  /** The R2.1 gate: true when a pet may play now. */
  readonly may: () => boolean;
  /** Plays the pet (love, or the faded line). */
  readonly pet: () => void;
};

export type PetWatch = {
  /** True once for the click that ends a long-press: the caller ignores that click. */
  readonly swallow: () => boolean;
  /** A mouse rests on him now (love's Out waits for it to leave). */
  readonly resting: () => boolean;
  /** A love has ended `after` seconds from now: the next pet waits `PET.rest` from then. */
  readonly ended: (after?: number) => void;
  readonly stop: () => void;
};

export function petWatch({ crew, button, may, pet }: PetOptions): PetWatch {
  let over = false;
  let anchor: { x: number; y: number } | null = null;
  let spent = false;
  let hoverTimer: gsap.core.Tween | null = null;
  let press: { x: number; y: number; id: number } | null = null;
  let pressTimer: gsap.core.Tween | null = null;
  let swallowNext = false;
  let restUntil = -Infinity;

  /** The gate and the rest: true when a pet may play now. */
  const ready = () => crew.now() >= restUntil && may();

  const startHover = () => {
    hoverTimer?.kill();
    hoverTimer = crew.after(PET.hover, () => {
      hoverTimer = null;
      if (!over || spent) return;
      if (!ready()) {
        startHover();
        return;
      }
      spent = true;
      pet();
    });
  };

  const cancelPress = () => {
    pressTimer?.kill();
    pressTimer = null;
    press = null;
  };

  const onEnter = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    over = true;
    spent = false;
    anchor = { x: event.clientX, y: event.clientY };
    startHover();
  };
  const onLeave = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    over = false;
    anchor = null;
    hoverTimer?.kill();
    hoverTimer = null;
  };
  const onMove = (event: PointerEvent) => {
    if (event.pointerType === "mouse") {
      if (!over || spent || !anchor) return;
      if (Math.hypot(event.clientX - anchor.x, event.clientY - anchor.y) > PET.drift) {
        anchor = { x: event.clientX, y: event.clientY };
        startHover();
      }
      return;
    }
    if (press && event.pointerId === press.id && Math.hypot(event.clientX - press.x, event.clientY - press.y) > PET.slop) {
      cancelPress();
    }
  };
  const onDown = (event: PointerEvent) => {
    swallowNext = false;
    if (event.pointerType === "mouse") return;
    cancelPress();
    press = { x: event.clientX, y: event.clientY, id: event.pointerId };
    pressTimer = crew.after(PET.press, () => {
      pressTimer = null;
      press = null;
      // The press was long: its click is never a poke, whether or not the pet may play.
      swallowNext = true;
      if (ready()) pet();
    });
  };
  const onUp = (event: PointerEvent) => {
    if (press && event.pointerId === press.id) cancelPress();
  };

  button.addEventListener("pointerenter", onEnter);
  button.addEventListener("pointerleave", onLeave);
  button.addEventListener("pointermove", onMove);
  button.addEventListener("pointerdown", onDown);
  button.addEventListener("pointerup", onUp);
  button.addEventListener("pointercancel", onUp);

  return {
    swallow: () => {
      const swallowed = swallowNext;
      swallowNext = false;
      return swallowed;
    },
    resting: () => over,
    ended: (after = 0) => {
      restUntil = crew.now() + after + PET.rest;
    },
    stop: () => {
      hoverTimer?.kill();
      cancelPress();
      button.removeEventListener("pointerenter", onEnter);
      button.removeEventListener("pointerleave", onLeave);
      button.removeEventListener("pointermove", onMove);
      button.removeEventListener("pointerdown", onDown);
      button.removeEventListener("pointerup", onUp);
      button.removeEventListener("pointercancel", onUp);
    },
  };
}
