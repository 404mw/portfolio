// The Agents tab list's motion (ui-spec §4.7, Motion; §10 generic reveal), on the tabs layout
// inside `root`. `AgentsTabs` owns the selection; this hook animates around it and advances it.
//
// - Entrance, once, when the section scrolls in: the intro (label, heading, lead) and the tab
//   rows rise from below, staggered, and the panel fades up. Reduced motion: opacity fades only.
// - Replay: the first time the section is in view, and whenever a panel shows after that, its
//   panel replays from the start (lib/agentDemoSequences.ts) and its row's
//   progress line and stepper bar fade in.
// - Auto-advance, full motion only: the selected row's line and, below `lg`, the stepper's bar
//   for that offer (§4.2a) grow scaleX 0 → 1 over 6s on one tween, so they pause and resume as
//   one; then the next row is selected (wrapping) through `select`, which never moves focus. It
//   pauses while the pointer is on the tab list or panel, while keyboard focus is in the tab list,
//   while any focus is in the panel box, the stepper included (so a focused panel is never hidden
//   under the reader, and a pressed ‹ or › holds its offer), and while the section is off screen
//   or the tab hidden; it resumes where it stopped. A pointer click on a tab doesn't count as
//   focus-within (it would otherwise freeze the loop after every click); every new selection, a
//   press of ‹ or › included, restarts the 6s for the new row, so where a tap gives no focus the
//   advance runs on from there. Reduced motion: no advance, the line and the bar stay full.
// - Stepper text: on a new selection the stepper's title and line fade in (opacity only, the same
//   under reduced motion). React has already swapped the text, so this is the new text fading in,
//   and a revert mid-fade leaves it fully shown. Not on the first paint, nor on a set change.
// - Status dots: an opacity blink loop while on screen, full motion only; solid under reduce.
// - Report bars, on a fine pointer only: the bar under the pointer turns the accent and stretches
//   up a little, and eases back (lib/agentBarHover.ts). Reduced motion: the fill's fade only. The
//   bars are put back to rest before every replay is reverted or started. The pointer's kind is
//   one of the branch's conditions, so a change of it (a mouse plugged in) re-runs the branch.
//
// Every starting state is set here, in JS, so without JS or before this runs the static layout
// shows as built. Per-selection tweens are made outside the matchMedia context and reverted here
// when the next selection plays or on cleanup, so the context doesn't collect a tween every 6s.
//
// The set (ui-spec §4.7 wiring, 2026-10-03): the tab list shows the About pick's offers, and a
// change remounts its rows and panels. The hook re-runs on a new set (`revertOnUpdate`), so the
// rows, lines, bars, panels and dots are read again from the new markup. The entrance plays once
// per page load (`entered` outlives a re-run): after it, a re-run plays the selected row at once.
import { useLayoutEffect, useRef, type RefObject } from "react";
import { bindBarHover } from "@/lib/agentBarHover";
import type { DemoPlayback } from "@/lib/agentDemoPop";
import { playDemo } from "@/lib/agentDemoSequences";
import type { AgentPanelKind } from "@/lib/agents";
import { gsap, useGSAP } from "@/lib/gsap";
import {
  animTargets,
  blinkDim,
  duration,
  ease,
  finePointerQuery,
  motionQuery,
  reveal,
  stagger,
} from "@/lib/motion";
import { watchLive } from "@/lib/watchLive";

/** Seconds each row stays selected before the next one is (ui-spec §4.7). */
const ADVANCE_SECONDS = 6;
/** Seconds after the rows start that the panel starts fading up. */
const PANEL_DELAY = 0.1;
/** Seconds the stepper's new title and line take to fade in (ui-spec §4.2a). */
const STEPPER_FADE = 0.25;

type AgentsMotionOptions = {
  /** The selected row's index. */
  readonly selected: number;
  /** Selects a row without moving focus (`useRovingTabs`). */
  readonly select: (index: number) => void;
  /** The id of the section's intro block (label, heading, lead), the first to rise. */
  readonly introId: string;
  /** The set the tab list shows; a change re-runs the hook on the new markup. */
  readonly set: string;
  /** The shown set's panel kind per row. */
  readonly kinds: readonly AgentPanelKind[];
};

export function useAgentsMotion(
  root: RefObject<HTMLElement | null>,
  { selected, select, introId, set, kinds }: AgentsMotionOptions,
) {
  // The latest selection, `select` and kinds, for GSAP callbacks that outlive a render.
  const latest = useRef({ selected, select, kinds });
  useLayoutEffect(() => {
    latest.current = { selected, select, kinds };
  });
  // Once per page load: the entrance has played. Outlives a re-run on a new set.
  const entered = useRef(false);
  // Set by the active matchMedia branch: plays a newly selected row.
  const show = useRef<((index: number) => void) | null>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const intro = document.getElementById(introId);
      const rows = animTargets(el, "agents-row");
      const [tablist] = animTargets(el, "agents-tablist");
      const [panelBox] = animTargets(el, "agents-panels");
      const panels = animTargets(el, "agent-panel");
      const lines = animTargets(el, "agent-progress");
      const bars = animTargets(el, "agent-progress-bar");
      const stepperText = [
        ...animTargets(el, "agents-stepper-title"),
        ...animTargets(el, "agents-stepper-line"),
      ];
      const dots = animTargets(el, "demo-status-dot");
      if (!tablist || !panelBox) return;
      const rising = intro ? [intro, ...rows] : rows;

      const mm = gsap.matchMedia();

      const queries = {
        full: motionQuery.full,
        reduced: motionQuery.reduced,
        fine: finePointerQuery,
      };

      mm.add(queries, (context) => {
        const reduced = Boolean(context.conditions?.reduced);
        // The Report bars' hover: no pointer to follow on a touch screen, no stretch under reduce.
        const barHover = context.conditions?.fine ? bindBarHover(el, !reduced) : null;
        let current = latest.current.selected;
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
          grow?.paused(!(live && entered.current && hovered.size === 0 && !focused));
        };

        // The bars go back to rest first, so a replay is reverted onto, and the next one starts
        // from, bars with nothing of a hover left on them.
        const stop = () => {
          barHover?.reset();
          [...playing, ...demoLoops].reverse().forEach((animation) => animation.revert());
          playing = [];
          demoLoops = [];
          grow = null;
        };

        const advance = () => latest.current.select((current + 1) % lines.length);

        // `changed`: a new selection, not the first play or a new set, so the stepper's text fades.
        const play = (index: number, changed = false) =>
          context.ignore(() => {
            stop();
            // The row's line and the stepper's bar for this offer: one clock for both.
            const fills = [lines[index], bars[index]].filter((fill) => fill !== undefined);
            const panel = panels[index];
            if (changed && stepperText.length > 0) {
              playing.push(
                gsap.from(stepperText, { opacity: 0, duration: STEPPER_FADE, ease: ease.out }),
              );
            }
            if (fills.length > 0) {
              playing.push(
                gsap.from(fills, { opacity: 0, duration: duration.fade, ease: ease.out }),
              );
              if (!reduced) {
                grow = gsap.fromTo(
                  fills,
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
            const kind = latest.current.kinds[index];
            if (panel && kind !== undefined) {
              const demo: DemoPlayback = playDemo(kind, panel, reduced);
              playing.push(demo.sequence);
              demoLoops = demo.loops;
            }
            update();
          });

        // A re-run on a new set has already played row 1 by the time the selection effect names
        // it again, so the same row is never played twice.
        show.current = (index: number) => {
          if (index === current) return;
          current = index;
          if (entered.current) play(index, true);
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

        // The entrance, once per page load; its first run also starts the selected row's replay.
        // Once it has played, a re-run (a new set) plays the selected row at once.
        if (entered.current) {
          play(current);
        } else {
          const from = reduced ? { opacity: 0 } : { opacity: 0, y: reveal.y };
          gsap
            .timeline({
              defaults: { duration: reduced ? duration.fade : duration.enter, ease: ease.out },
              scrollTrigger: {
                trigger: el,
                start: reveal.start,
                once: true,
                onEnter: () => {
                  entered.current = true;
                  play(current);
                },
              },
            })
            .from(rising, { ...from, stagger: stagger.row }, 0)
            .from(panelBox, from, PANEL_DELAY);
        }

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
          barHover?.unbind();
        };
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [set], revertOnUpdate: true },
  );

  // A new selection (click, tap, keyboard or auto-advance) replays its row from the start. A
  // layout effect, so the new panel's starting state is set before it paints.
  useLayoutEffect(() => {
    show.current?.(selected);
  }, [selected]);
}
