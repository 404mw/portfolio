// The Report demo's bar hover (sections/04-agents, 2026-10-05), on the `[data-anim="demo-bar"]`
// bars inside `root`. The section's motion binds it on a fine pointer only (hooks/useAgentsMotion.ts),
// and a touch never lights a bar.
//
// - Pointer on a bar: its fill turns the accent and it stretches up a little from the chart's
//   floor. Pointer off: both ease back. The latest bar is the accent already, so it only stretches.
// - No bar's top passes the chart's top: a bar too tall for the full stretch takes a smaller one,
//   worked out from the height its inline style gives (no layout is read), so the hovered chart
//   stays in its own box at every width.
// - Reduced motion: the fill's short fade only, no stretch.
//
// Beside the replay (lib/agentDemoSequences.ts), which grows each bar's `scaleY`: the stretch is
// the same property, so on a bar that is still growing the fill turns at once and the stretch
// waits until the bar has landed; leaving such a bar turns only its fill back. `reset` puts every
// bar back to rest at once. The section's motion calls it before it reverts a replay or starts
// one, so a replay never starts from, or is reverted onto, a lit or stretched bar.
//
// Nothing is set until a pointer is on a bar, and a bar that has eased back has its inline fill
// and transform cleared, so its class owns the resting look. The tweens are made in the pointer
// handlers, outside any GSAP context (a context would keep one more for every hover); they are
// killed here, in `reset` and `unbind`.
import { gsap } from "@/lib/gsap";
import { animTargets, ease } from "@/lib/motion";

const ACCENT = "var(--color-accent)";

/**
 * Bar hover: how far the bar stretches (`scaleY`), the highest its top may reach as a share of
 * the chart's height (so the tallest bar, 95% tall, stretches 1.053), and the seconds its fill and
 * its stretch take, in and out.
 */
const BAR_HOVER = { stretch: 1.08, ceiling: 1, seconds: 0.25 } as const;
/** The chart's floor, which a bar stretches from: the origin the replay grows it from. */
const BAR_FLOOR = "50% 100%";
/** What a bar at rest has no inline value for. */
const HOVER_PROPS = "backgroundColor,scaleY,transformOrigin";

export type BarHover = {
  /** Puts every bar back to rest at once: its own fill, no stretch, nothing inline. */
  readonly reset: () => void;
  /** Resets, then removes the pointer listeners. */
  readonly unbind: () => void;
};

/** The stretch for `bar`, held under the ceiling by the height its inline style gives it. */
function stretchOf(bar: HTMLElement): number {
  const share = bar.style.height.endsWith("%") ? Number.parseFloat(bar.style.height) / 100 : 0;
  if (!(share > 0)) return BAR_HOVER.stretch;
  return Math.max(1, Math.min(BAR_HOVER.stretch, BAR_HOVER.ceiling / share));
}

/**
 * Seconds until every tween on `bar` has ended (the replay's growth, when the hover's own tweens
 * have been killed first); 0 when the bar has landed or nothing is playing on it. Each end is
 * read on its tween's own timeline: a replay runs at its built pace and is never paused.
 */
function landsIn(bar: HTMLElement): number {
  return gsap
    .getTweensOf(bar)
    .reduce((wait, tween) => Math.max(wait, tween.endTime() - (tween.parent?.time() ?? 0)), 0);
}

/**
 * Binds the hover to the bars inside `root`. `stretches`: full motion; false under reduced
 * motion, where only the fill fades.
 */
export function bindBarHover(root: ParentNode, stretches: boolean): BarHover {
  const tweenVars = { duration: BAR_HOVER.seconds, ease: ease.out } as const;
  // The hover's tweens still on each bar: a lit bar keeps its entry until it has eased back.
  const lit = new Map<HTMLElement, gsap.core.Tween[]>();

  const drop = (bar: HTMLElement) => {
    lit.get(bar)?.forEach((tween) => tween.kill());
    lit.delete(bar);
  };

  // Both start from wherever the bar is, so a bar re-entered on its way back turns round there.
  const light = (bar: HTMLElement) => {
    drop(bar);
    const landing = stretches ? landsIn(bar) : 0;
    const tweens = [gsap.to(bar, { backgroundColor: ACCENT, ...tweenVars })];
    if (stretches) {
      tweens.push(
        gsap.to(bar, {
          scaleY: stretchOf(bar),
          transformOrigin: BAR_FLOOR,
          delay: landing,
          ...tweenVars,
        }),
      );
    }
    lit.set(bar, tweens);
  };

  // A bar still growing in the replay was never stretched, and its `scaleY` is the replay's.
  const rest = (bar: HTMLElement, fill: string) => {
    drop(bar);
    const landed = stretches && landsIn(bar) === 0;
    lit.set(bar, [
      gsap.to(bar, {
        backgroundColor: fill,
        ...(landed ? { scaleY: 1 } : {}),
        ...tweenVars,
        clearProps: landed ? HOVER_PROPS : "backgroundColor",
        onComplete: () => lit.delete(bar),
      }),
    ]);
  };

  const reset = () => {
    const bars = [...lit.keys()];
    bars.forEach(drop);
    if (bars.length > 0) gsap.set(bars, { clearProps: HOVER_PROPS });
  };

  const listeners = animTargets(root, "demo-bar").map((bar) => {
    // The bar's own fill, from its class, read while nothing is set on it.
    const fill = getComputedStyle(bar).backgroundColor;
    const onEnter = (event: PointerEvent) => {
      if (event.pointerType !== "touch") light(bar);
    };
    const onLeave = () => {
      if (lit.has(bar)) rest(bar, fill);
    };
    bar.addEventListener("pointerenter", onEnter);
    bar.addEventListener("pointerleave", onLeave);
    return () => {
      bar.removeEventListener("pointerenter", onEnter);
      bar.removeEventListener("pointerleave", onLeave);
    };
  });

  return {
    reset,
    unbind: () => {
      reset();
      listeners.forEach((remove) => remove());
    },
  };
}
