// The showcase diagram's sequence (ui-spec/07-proofs-spam.md, Motion (later); ui-spec §10): its
// parts, found by their `data-anim` hooks inside the diagram's own root only; the start state, set
// in JS when its takeover opens (so without JS, or before this runs, it is the finished static
// diagram); the timeline that plays as it enters the dialog's view; and the reset that puts every
// part back exactly as server-rendered.
//
// Full motion: the wrapper fades in (the band from `md` with it). Then each step lights in order:
// its `<li>` fades in (on a phone, its band), the figure rises from below the floor (`yPercent`
// +40 → 0, the card bots' soft overshoot, cut by the layer's floor clip), its number, title and
// line fade up 16px, Rix's prop flourishes once, then the hairline draws and its chevron (or the
// phone's down chevron) fades in before the next step. After the last step the return: on a phone
// its box fades up; from `md`, `first` (the U) wipes in right to left and `last` (the loop on the
// last step) draws its right leg down, then round to the arrowhead (both `clip-path` inset); then
// the arrowhead and the pill pop. At the end every inline style is cleared.
// Reduced motion: the wrapper fades in, all of it together. Nothing moves, no flourish or blink.
import { gsap } from "@/lib/gsap";
import { animTargets } from "@/lib/motion";
import { stripMotion } from "@/lib/processBotRig";
import { addFlourish, showcaseProp, type ShowcaseProp } from "@/lib/showcaseFlourish";
import {
  CHEVRON_AT,
  CHEVRON_IN,
  FIGURE_FROM,
  FIGURE_RISE,
  FLOURISH_AT,
  HEAD_POP,
  LINK_AT,
  LINK_DRAW,
  LOOP_LEG,
  LOOP_LEG_STRIP,
  LOOP_ROUND,
  PILL_AT,
  PILL_FROM,
  PILL_POP,
  RETURN_AFTER,
  RETURN_IN,
  STEP_EVERY,
  STEP_FIRST,
  STEP_LIGHT,
  TEXT_AT,
  TEXT_IN,
  TEXT_RISE,
  U_WIPE,
  WRAPPER_IN,
} from "@/lib/showcaseMotion";

type ShowcaseStepParts = {
  readonly item: HTMLElement;
  readonly text: HTMLElement | null;
  readonly figure: HTMLElement | null;
  readonly links: readonly HTMLElement[];
  readonly chevrons: readonly HTMLElement[];
  readonly prop: ShowcaseProp | null;
};

type ShowcaseReturnParts = {
  readonly box: HTMLElement;
  readonly to: string | undefined;
  readonly loop: HTMLElement | null;
  readonly head: HTMLElement | null;
  readonly pill: HTMLElement | null;
};

export type ShowcaseParts = {
  readonly root: HTMLElement;
  readonly steps: readonly ShowcaseStepParts[];
  readonly back: ShowcaseReturnParts | null;
};

/** The diagram's parts, every one inside `root`. */
export function showcaseParts(root: HTMLElement): ShowcaseParts {
  const steps = animTargets(root, "showcase-step").map((item) => {
    const figure = animTargets(item, "showcase-figure")[0] ?? null;
    return {
      item,
      text: animTargets(item, "showcase-step-text")[0] ?? null,
      figure,
      links: animTargets(item, "showcase-link"),
      chevrons: animTargets(item, "showcase-chevron"),
      prop: figure ? showcaseProp(figure) : null,
    };
  });
  const box = animTargets(root, "showcase-return")[0];
  const back = box
    ? {
        box,
        to: box.dataset.return,
        loop: animTargets(box, "showcase-return-loop")[0] ?? null,
        head: animTargets(box, "showcase-return-head")[0] ?? null,
        pill: animTargets(box, "showcase-pill")[0] ?? null,
      }
    : null;
  return { root, steps, back };
}

const present = <T>(items: readonly (T | null | undefined)[]): T[] =>
  items.filter((item): item is T => item !== null && item !== undefined);

/** Every HTML part the sequence writes on. */
function htmlParts(parts: ShowcaseParts): HTMLElement[] {
  const { root, steps, back } = parts;
  return present<HTMLElement>([
    root,
    ...steps.flatMap((step) => [step.item, step.text, step.figure, ...step.links, ...step.chevrons]),
    back?.box,
    back?.loop,
    back?.head,
    back?.pill,
  ]);
}

/** Every SVG part a flourish writes on (Rix's props and the caret). */
function svgParts(parts: ShowcaseParts): Element[] {
  return present<Element>(parts.steps.flatMap((step) => [step.prop?.group, step.prop?.caret]));
}

/** The return's clip at its start, from `md`: `first` hidden from the left, `last` its right leg only, undrawn. */
const clipFrom = {
  first: "inset(0% 0% 0% 100%)",
  legTop: `inset(0% 0% 100% ${100 - LOOP_LEG_STRIP}%)`,
  legDown: `inset(0% 0% 0% ${100 - LOOP_LEG_STRIP}%)`,
  open: "inset(0% 0% 0% 0%)",
} as const;

/** Sets the start state. `wide` is from `md`. */
export function hideShowcase(parts: ShowcaseParts, reduced: boolean, wide: boolean): void {
  const { root, steps, back } = parts;
  gsap.set(root, { opacity: 0 });
  if (reduced) return;
  steps.forEach((step) => {
    gsap.set(step.item, { opacity: 0 });
    if (step.text) gsap.set(step.text, { opacity: 0, y: TEXT_RISE });
    if (step.figure) gsap.set(step.figure, { yPercent: FIGURE_FROM });
    if (step.links.length > 0) gsap.set(step.links, { scaleX: 0 });
    if (step.chevrons.length > 0) gsap.set(step.chevrons, { opacity: 0 });
  });
  if (!back) return;
  gsap.set(back.box, wide ? { opacity: 0 } : { opacity: 0, y: TEXT_RISE });
  if (wide && back.to === "first") gsap.set(back.box, { clipPath: clipFrom.first });
  if (wide && back.to === "last" && back.loop) gsap.set(back.loop, { clipPath: clipFrom.legTop });
  if (back.head) gsap.set(back.head, { opacity: 0, scale: 0 });
  if (back.pill) gsap.set(back.pill, { opacity: 0, scale: PILL_FROM });
}

/** Puts every part back exactly as server-rendered (also kills any tween on them). */
export function resetShowcase(parts: ShowcaseParts): void {
  const html = htmlParts(parts);
  gsap.killTweensOf(html);
  gsap.set(html, { clearProps: "opacity,transform,clipPath" });
  stripMotion(svgParts(parts));
}

/** The return's moves, from `at`. */
function addReturn(tl: gsap.core.Timeline, back: ShowcaseReturnParts, wide: boolean, at: number): void {
  const { box, to, loop, head, pill } = back;
  let popAt = at;
  if (!wide) {
    tl.to(box, { opacity: 1, y: 0, ...RETURN_IN }, at);
    popAt = at + RETURN_IN.duration * 0.6;
  } else if (to === "last" && loop) {
    tl.to(box, { opacity: 1, ...RETURN_IN }, at)
      .fromTo(loop, { clipPath: clipFrom.legTop }, { clipPath: clipFrom.legDown, ...LOOP_LEG }, at)
      .to(loop, { clipPath: clipFrom.open, ...LOOP_ROUND }, at + LOOP_LEG.duration);
    popAt = at + LOOP_LEG.duration + LOOP_ROUND.duration;
  } else {
    tl.to(box, { opacity: 1, ...RETURN_IN }, at).fromTo(
      box,
      { clipPath: clipFrom.first },
      { clipPath: clipFrom.open, ...U_WIPE },
      at,
    );
    popAt = at + U_WIPE.duration;
  }
  if (head) tl.to(head, { opacity: 1, scale: 1, ...HEAD_POP }, popAt);
  if (pill) tl.to(pill, { opacity: 1, scale: 1, ...PILL_POP }, popAt + PILL_AT);
}

/**
 * The timeline from the start state to the static diagram; at its end every inline style is
 * cleared (`resetShowcase`). Set the start state with `hideShowcase` first, with the same `wide`.
 */
export function playShowcase(parts: ShowcaseParts, reduced: boolean, wide: boolean): gsap.core.Timeline {
  const { root, steps, back } = parts;
  const tl = gsap.timeline({ onComplete: () => resetShowcase(parts) });
  tl.to(root, { opacity: 1, ...WRAPPER_IN }, 0);
  if (reduced) return tl;

  steps.forEach((step, index) => {
    const at = STEP_FIRST + index * STEP_EVERY;
    tl.to(step.item, { opacity: 1, ...STEP_LIGHT }, at);
    if (step.figure) tl.to(step.figure, { yPercent: 0, ...FIGURE_RISE }, at);
    if (step.text) tl.to(step.text, { opacity: 1, y: 0, ...TEXT_IN }, at + TEXT_AT);
    if (step.prop) addFlourish(tl, step.prop, at + FLOURISH_AT);
    if (step.links.length > 0) tl.to(step.links, { scaleX: 1, ...LINK_DRAW }, at + LINK_AT);
    if (step.chevrons.length > 0) tl.to(step.chevrons, { opacity: 1, ...CHEVRON_IN }, at + CHEVRON_AT);
  });

  if (back) addReturn(tl, back, wide, STEP_FIRST + Math.max(steps.length - 1, 0) * STEP_EVERY + RETURN_AFTER);
  return tl;
}
