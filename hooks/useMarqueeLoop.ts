// The marquee's loop (ui-spec §3.3, Motion): the strip's `marquee-track` moves `xPercent` 0 → -50,
// linearly, forever. The track holds two identical sets, each with its own trailing gap, so -50%
// lands exactly where the second set starts and the repeat is seamless. It moves at a steady speed
// in px/s, not a fixed time: one pass lasts one set's width divided by the speed, measured at
// setup and again whenever the set's width changes (resize, fonts arriving), keeping the loop's
// place. It's the one loop that keeps running under reduced motion (constitution §5, amended
// 2026-09-25).
//
// It pauses while the pointer is on the strip and resumes on leave, in both modes: full motion
// eases the loop's speed down to 0 and back; reduced motion stops and starts it directly. It also
// pauses while the strip is off screen or the tab is hidden, to save work. The strip clips the
// track (`overflow-hidden`), so the moving row never widens the page. On unmount the track goes
// back to its static, untransformed row.
import { gsap, useGSAP } from "@/lib/gsap";
import { animTargets, ease, motionQuery } from "@/lib/motion";

/** The loop's pace in px per second. */
const SPEED = 70;
/** Seconds the loop takes to slow to a stop on hover, or get back to speed on leave. */
const HOVER_SECONDS = 0.4;

export function useMarqueeLoop() {
  useGSAP((_context, contextSafe) => {
    const [strip] = animTargets(document, "marquee");
    const [track] = strip ? animTargets(strip, "marquee-track") : [];
    const [set] = track ? animTargets(track, "marquee-set") : [];
    if (!strip || !track || !set || !contextSafe) return;

    const mm = gsap.matchMedia();

    mm.add({ full: motionQuery.full, reduced: motionQuery.reduced }, (context) => {
      const { reduced } = context.conditions ?? {};

      /** Seconds one pass takes at SPEED, for a set `width` px wide. */
      const passSeconds = (width: number) => Math.max(width, 1) / SPEED;

      const loop = gsap.to(track, {
        xPercent: -50,
        duration: passSeconds(set.getBoundingClientRect().width),
        ease: "none",
        repeat: -1,
        paused: true,
      });

      let onScreen = false;

      // Runs only on screen with the tab visible; `will-change` is held only while it runs.
      const update = () => {
        const running = onScreen && document.visibilityState === "visible";
        if (running === !loop.paused()) return;
        gsap.set(track, { willChange: running ? "transform" : "auto" });
        loop.paused(!running);
      };

      // Hover sets the loop's speed; pausing for off screen stays separate, so the two never
      // fight. A touch pauses it only while the finger is down.
      const setSpeed = contextSafe((speed: number) => {
        if (reduced) {
          gsap.killTweensOf(loop);
          loop.timeScale(speed);
          return;
        }
        gsap.to(loop, {
          timeScale: speed,
          duration: HOVER_SECONDS,
          ease: ease.out,
          overwrite: true,
        });
      });
      const onEnter = () => setSpeed(0);
      const onLeave = () => setSpeed(1);

      // A new set width means a new pass length; the loop keeps its place within the pass.
      const resizer = new ResizeObserver((entries) => {
        const width = entries[entries.length - 1]?.borderBoxSize?.[0]?.inlineSize;
        if (!width) return;
        const seconds = passSeconds(width);
        if (Math.abs(seconds - loop.duration()) < 0.01) return;
        const place = loop.progress();
        loop.duration(seconds).progress(place);
      });
      resizer.observe(set);

      const observer = new IntersectionObserver((entries) => {
        onScreen = entries[entries.length - 1]?.isIntersecting ?? false;
        update();
      });
      observer.observe(strip);
      document.addEventListener("visibilitychange", update);
      strip.addEventListener("pointerenter", onEnter);
      strip.addEventListener("pointerleave", onLeave);

      return () => {
        resizer.disconnect();
        observer.disconnect();
        document.removeEventListener("visibilitychange", update);
        strip.removeEventListener("pointerenter", onEnter);
        strip.removeEventListener("pointerleave", onLeave);
        gsap.killTweensOf(loop);
      };
    });

    return () => mm.revert();
  });
}
