// Rix's eyes and lean (ui-spec 02a-about-options §2a.O4 "Pointer follow" and "Look at a pick"),
// full motion only. Process's layer 7 pointer follow, with its ranges scaled by Rix's width; and
// the target look: while a pick is under a fine pointer or has keyboard focus
// (lib/rixTargetWatch.ts), his eyes hold on it (the perpendicular channel included) and the lean
// follows it; 0.6s after it loses both they ease back. The target wins over the pointer. While Rix
// acts, his act owns the eyes; when it ends (`rix.onState`), they go back to the target or to rest.
//
// `bot.pointer` is true while anything outside the bot drives his eyes, so Process's autonomous
// looks (lib/processBotLife.ts) wait; the pointer's share of the eyes is 1 only when idle,
// following and with no target. Everything runs in the crew, so it pauses with it. Target changes
// go to `rix.onTarget` (he walks to them), and the fine pointer's last position is kept on
// `rix.pointerAt` (the annoyed side-eye, the angry glare and the flee read it).
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { EYE_FOLLOW, FOLLOW_EASE, LEAN_FOLLOW, POINTER_IDLE } from "@/lib/processBotMotion";
import { eyeCentre } from "@/lib/processBotPointer";
import { rixLook } from "@/lib/rixLook";
import { LOOK_AT, LOOK_BACK } from "@/lib/rixMotion";
import { measureScale, type Rix } from "@/lib/rixRig";
import { watchTargets } from "@/lib/rixTargetWatch";
import { lookAt } from "@/lib/rixTargets";

export type RixEyes = {
  /**
   * Caches his eye centre (page px) and scale again. It already runs at setup, on the root's resize
   * and on a ScrollTrigger refresh; a caller whose Rix can move on the page without either (the
   * footer's, when the page above him changes height) calls it too.
   */
  readonly measure: () => void;
  /** Per frame, while live: hand the eyes back after `POINTER_IDLE` without movement. */
  readonly frame: () => void;
  /** Eyes and lean back to the target or rest (`rix.onState` by default; a caller may compose it). */
  readonly settle: () => void;
  readonly stop: () => void;
};

const seconds = () => performance.now() / 1000;

export function rixEyes(rix: Rix, fine: boolean): RixEyes {
  const { bot, crew, root, svg } = rix;
  const { ch } = bot;
  const lookTo = gsap.quickTo(ch, "pointerLook", { duration: EYE_FOLLOW, ease: FOLLOW_EASE });
  const leanTo = gsap.quickTo(ch, "lean", { duration: LEAN_FOLLOW, ease: FOLLOW_EASE });

  /** The pointer's share of the eyes, and whether Process's own looks must wait. */
  const share = () => {
    bot.pointer = rix.following || rix.target !== null;
    const mix = bot.state === "idle" && rix.following && rix.target === null ? 1 : 0;
    crew.run(gsap.to(ch, { pointerMix: mix, duration: EYE_FOLLOW, ease: "power2.inOut", overwrite: "auto" }));
  };

  /** Eyes on the target (or back to rest) while idle; the lean on the target, or let go. */
  const settle = () => {
    const look = rix.target ? lookAt(rix, [rix.target]) : null;
    if (bot.state === "idle") {
      const to = look ? { look: look.d, perp: look.p, ...LOOK_AT } : { look: bot.restLook, perp: 0, ...LOOK_BACK };
      crew.run(gsap.to(ch, { ...to, overwrite: "auto" }));
    }
    if (look) leanTo(look.lean);
    else if (!rix.following) leanTo(0);
    share();
  };
  rix.onState = settle;

  // Targets (lib/rixTargetWatch.ts): the hovered pick wins over the focused one; released
  // `LOOK_RELEASE` after both leave.
  const stopTargets = watchTargets({
    root,
    fine,
    crew,
    onChange: (next) => {
      rix.target = next;
      settle();
      rix.onTarget(next);
    },
  });

  // Pointer follow (fine pointer only): the eye centre is cached in page px, as on Process.
  let eye = { x: 0, y: 0 };
  let client: { x: number; y: number } | null = null;
  let lastMove = -Infinity;
  let raf = 0;
  const measure = () => {
    eye = eyeCentre(svg.getBoundingClientRect(), window.scrollX, window.scrollY);
    rix.scale = measureScale(svg);
  };
  const follow = () => {
    raf = 0;
    if (!client || !crew.isLive()) return;
    const look = rixLook(client.x + window.scrollX - eye.x, client.y + window.scrollY - eye.y, rix.scale);
    lookTo(look.d);
    if (!rix.target) leanTo(look.lean);
    if (!rix.following) {
      rix.following = true;
      share();
    }
  };
  const request = () => {
    if (!raf) raf = requestAnimationFrame(follow);
  };
  const letGo = () => {
    client = null;
    if (!rix.following) return;
    rix.following = false;
    if (!rix.target) leanTo(0);
    share();
  };
  const onMove = (event: PointerEvent) => {
    if (event.pointerType === "touch" || !crew.isLive()) return;
    client = { x: event.clientX, y: event.clientY };
    rix.pointerAt = client;
    lastMove = seconds();
    request();
  };
  const onScroll = () => {
    if (rix.following) request();
  };
  const onOut = (event: PointerEvent) => {
    if (!event.relatedTarget) letGo();
  };

  measure();
  const resize = new ResizeObserver(measure);
  resize.observe(root);
  ScrollTrigger.addEventListener("refresh", measure);
  if (fine) {
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerout", onOut);
  }

  return {
    measure,
    settle,
    frame: () => {
      if (rix.following && seconds() - lastMove > POINTER_IDLE) letGo();
    },
    stop: () => {
      resize.disconnect();
      ScrollTrigger.removeEventListener("refresh", measure);
      stopTargets();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerout", onOut);
      if (raf) cancelAnimationFrame(raf);
      lookTo.tween.kill();
      leanTo.tween.kill();
      rix.onState = () => {};
    },
  };
}
