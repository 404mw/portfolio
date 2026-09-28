// The proof card bots' pointer follow (ui-spec §7.7, Idle; fine pointer only): each bot's eyes look
// toward the pointer along the gap diagonal, −7…7 (rest 7, up-right), as the Process bots' eyes do,
// with the same mapping (lib/processBotPointer.ts) and the same ease. After `POINTER_IDLE` without
// movement, or when the pointer leaves the window, the eyes ease back to rest. Pointer moves are
// ignored while the bots aren't live. Each bot's eye centre is cached in page coordinates and
// re-measured by `measure` (on resize, refresh and after the rise), never inside a tween.
import { gsap } from "@/lib/gsap";
import { eyeCentre, pointerLook } from "@/lib/processBotPointer";
import { EYE_FOLLOW, FOLLOW_EASE, POINTER_IDLE, PROOF_EYE_POINT, REST_LOOK } from "@/lib/proofBotMotion";
import type { ProofBot } from "@/lib/proofBotRig";

export type ProofBotFollow = {
  /** Caches every bot's eye centre (page px). */
  readonly measure: () => void;
  /** Per frame, while live: hands the eyes back after `POINTER_IDLE` without movement. */
  readonly frame: () => void;
  /** Removes the listeners and kills the follow tweens. */
  readonly stop: () => void;
};

const seconds = () => performance.now() / 1000;

export function followPointer(bots: readonly ProofBot[], isLive: () => boolean): ProofBotFollow {
  const eyes: ({ x: number; y: number } | undefined)[] = [];
  const lookTo = bots.map((bot) => gsap.quickTo(bot.ch, "look", { duration: EYE_FOLLOW, ease: FOLLOW_EASE }));
  let client: { x: number; y: number } | null = null;
  let lastMove = -Infinity;
  let active = false;
  let raf = 0;

  const measure = () => {
    bots.forEach((bot, i) => {
      eyes[i] = eyeCentre(bot.parts.svg.getBoundingClientRect(), window.scrollX, window.scrollY, PROOF_EYE_POINT);
    });
  };

  const follow = () => {
    raf = 0;
    if (!client || !isLive()) return;
    const x = client.x + window.scrollX;
    const y = client.y + window.scrollY;
    bots.forEach((_, i) => {
      const eye = eyes[i];
      if (eye) lookTo[i]?.(pointerLook(x - eye.x, y - eye.y));
    });
    active = true;
  };
  const request = () => {
    if (!raf) raf = requestAnimationFrame(follow);
  };

  const release = () => {
    client = null;
    if (!active) return;
    active = false;
    lookTo.forEach((to) => to(REST_LOOK));
  };

  const onMove = (event: PointerEvent) => {
    if (event.pointerType === "touch" || !isLive()) return;
    client = { x: event.clientX, y: event.clientY };
    lastMove = seconds();
    request();
  };
  const onScroll = () => {
    if (active) request();
  };
  const onOut = (event: PointerEvent) => {
    if (!event.relatedTarget) release();
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("pointerout", onOut);

  return {
    measure,
    frame: () => {
      if (active && seconds() - lastMove > POINTER_IDLE) release();
    },
    stop: () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerout", onOut);
      if (raf) cancelAnimationFrame(raf);
      lookTo.forEach((to) => to.tween.kill());
    },
  };
}
