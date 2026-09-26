// The Agents tab list's motion (ui-spec §4.7, Motion; §10 generic reveal), on the tabs layout
// inside `root`. `AgentsTabs` owns the selection; this hook animates around it and advances it.
//
// - Entrance, once, when the section scrolls in: the label and the tab rows rise from below,
//   staggered, and the panel fades up. Reduced motion: opacity fades only.
// - Replay: the first time the section is in view, and whenever a panel shows after that, its
//   demo replays from the start (lib/agentDemoSequences.ts) and its row's progress line fades in.
// - Auto-advance, full motion only: the selected row's line grows scaleX 0 → 1 over 6s, then the
//   next row is selected (wrapping) through `select`, which never moves focus. It pauses while the
//   pointer is on the tab list or panel, while keyboard focus is in the tab list, while any focus
//   is in the panel (so a focused panel is never hidden under the reader), and while the section
//   is off screen or the tab hidden; it resumes where it stopped. A pointer click on a tab doesn't
//   count as focus-within (it would otherwise freeze the loop after every click); the new
//   selection restarts the line for the new row. Reduced motion: no advance, the line stays full.
// - Status dots: an opacity blink loop while on screen, full motion only; solid under reduce.
//
// Every starting state is set here, in JS, so without JS or before this runs the static layout
// shows as built. Per-selection tweens are made outside the matchMedia context and reverted here
// when the next selection plays or on cleanup, so the context doesn't collect a tween every 6s.
import { useLayoutEffect, useRef, type RefObject } from "react";
import { playDemo, type DemoPlayback } from "@/lib/agentDemoSequences";
import { agentDemoKinds } from "@/lib/agents";
import { gsap, useGSAP } from "@/lib/gsap";
import {
  animTargets,
  blinkDim,
  duration,
  ease,
  motionQuery,
  reveal,
  stagger,
} from "@/lib/motion";
import { watchLive } from "@/lib/watchLive";

/** Seconds each row stays selected before the next one is (ui-spec §4.7). */
const ADVANCE_SECONDS = 6;
/** Seconds after the rows start that the panel starts fading up. */
const PANEL_DELAY = 0.1;

type AgentsMotionOptions = {
  /** The selected row's index. */
  readonly selected: number;
  /** Selects a row without moving focus (`useRovingTabs`). */
  readonly select: (index: number) => void;
  /** The section label's id (the tab list's name). */
  readonly labelId: string;
};

export function useAgentsMotion(
  root: RefObject<HTMLElement | null>,
  { selected, select, labelId }: AgentsMotionOptions,
) {
  // The latest selection and `select`, for GSAP callbacks that outlive a render.
  const latest = useRef({ selected, select });
  useLayoutEffect(() => {
    latest.current = { selected, select };
  });
  // Set by the active matchMedia branch: plays a newly selected row.
  const show = useRef<((index: number) => void) | null>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const label = document.getElementById(labelId);
      const rows = animTargets(el, "agents-row");
      const [tablist] = animTargets(el, "agents-tablist");
      const [panelBox] = animTargets(el, "agents-panels");
      const panels = animTargets(el, "agent-panel");
      const lines = animTargets(el, "agent-progress");
      const dots = animTargets(el, "demo-status-dot");
      if (!tablist || !panelBox) return;
      const rising = label ? [label, ...rows] : rows;

      const mm = gsap.matchMedia();

      mm.add({ full: motionQuery.full, reduced: motionQuery.reduced }, (context) => {
        const reduced = Boolean(context.conditions?.reduced);
        let current = latest.current.selected;
        let entered = false;
        let live = false;
        const hovered = new Set<HTMLElement>();
        let focused = false;
        let grow: gsap.core.Tween | null = null;
        let playing: gsap.core.Animation[] = [];
        let demoLoops: readonly gsap.core.Animation[] = [];

        const blink = reduced
          ? null
          : gsap.fromTo(
              dots,
              { opacity: 1 },
              {
                opacity: blinkDim,
                duration: duration.blink,
                ease: ease.blink,
                repeat: -1,
                yoyo: true,
                paused: true,
              },
            );

        // Loops run only while live; the line also waits for the entrance and for no hover or focus.
        const update = () => {
          blink?.paused(!live);
          demoLoops.forEach((loop) => loop.paused(!live));
          grow?.paused(!(live && entered && hovered.size === 0 && !focused));
        };

        const stop = () => {
          [...playing, ...demoLoops].reverse().forEach((animation) => animation.revert());
          playing = [];
          demoLoops = [];
          grow = null;
        };

        const advance = () => latest.current.select((current + 1) % lines.length);

        const play = (index: number) =>
          context.ignore(() => {
            stop();
            const line = lines[index];
            const panel = panels[index];
            if (line) {
              playing.push(
                gsap.from(line, { opacity: 0, duration: duration.fade, ease: ease.out }),
              );
              if (!reduced) {
                grow = gsap.fromTo(
                  line,
                  { scaleX: 0 },
                  {
                    scaleX: 1,
                    duration: ADVANCE_SECONDS,
                    ease: "none",
                    paused: true,
                    onComplete: advance,
                  },
                );
                playing.push(grow);
              }
            }
            if (panel) {
              const demo: DemoPlayback = playDemo(agentDemoKinds[index], panel, reduced);
              playing.push(demo.sequence);
              demoLoops = demo.loops;
            }
            update();
          });

        show.current = (index: number) => {
          current = index;
          if (entered) play(index);
        };

        // Pause triggers, full motion only (reduced motion has nothing running to pause). Focus
        // moving between the two boxes fires focusout, then focusin, so the flag ends up right.
        const onFocusIn = (event: FocusEvent) => {
          const target = event.target;
          focused =
            target instanceof Element &&
            (panelBox.contains(target) || target.matches(":focus-visible"));
          update();
        };
        const onFocusOut = () => {
          focused = false;
          update();
        };
        const listeners = reduced
          ? []
          : [tablist, panelBox].map((box) => ({
              box,
              enter: () => {
                hovered.add(box);
                update();
              },
              leave: () => {
                hovered.delete(box);
                update();
              },
            }));
        listeners.forEach(({ box, enter, leave }) => {
          box.addEventListener("pointerenter", enter);
          box.addEventListener("pointerleave", leave);
          box.addEventListener("focusin", onFocusIn);
          box.addEventListener("focusout", onFocusOut);
        });
        const stopWatching = reduced
          ? null
          : watchLive(el, (next) => {
              live = next;
              update();
            });

        // The entrance; its first run also starts the selected row's replay.
        const from = reduced ? { opacity: 0 } : { opacity: 0, y: reveal.y };
        gsap
          .timeline({
            defaults: { duration: reduced ? duration.fade : duration.enter, ease: ease.out },
            scrollTrigger: {
              trigger: el,
              start: reveal.start,
              once: true,
              onEnter: () => {
                entered = true;
                play(current);
              },
            },
          })
          .from(rising, { ...from, stagger: stagger.row }, 0)
          .from(panelBox, from, PANEL_DELAY);

        return () => {
          show.current = null;
          stopWatching?.();
          listeners.forEach(({ box, enter, leave }) => {
            box.removeEventListener("pointerenter", enter);
            box.removeEventListener("pointerleave", leave);
            box.removeEventListener("focusin", onFocusIn);
            box.removeEventListener("focusout", onFocusOut);
          });
          stop();
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  // A new selection (click, tap, keyboard or auto-advance) replays its row from the start. A
  // layout effect, so the new panel's starting state is set before it paints.
  useLayoutEffect(() => {
    show.current?.(selected);
  }, [selected]);
}
