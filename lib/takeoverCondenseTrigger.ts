// One takeover's condense on its own scroll (ui-spec/07-proofs-sticky-band.md §B and §C): a
// ScrollTrigger on the dialog (`scroller: dialog`, no scrub, so the pose depends on scroll alone)
// that writes the head's pose (lib/takeoverCondense.ts) for every scroll, plus the dialog's
// `data-condense` (which makes the head sticky), `--takeover-stick` (its sticky top) and an inline
// `scroll-padding-top` (so a focused element is never scrolled under the slim strip).
// - `held`: the open (or the Next slide) still owns the band and title, so nothing is written on
//   them until `release`, which applies the pose for the scroll then, once.
// - A refresh (resize, font load) clears the pose, re-measures, writes the variable and padding
//   again and re-applies the pose for the current scroll. At progress 0 the pose is cleared, not
//   written as rest values. The title's colour is never written: it stays `text` on its band.
// - `freeze` (Next) kills the trigger and keeps the pose, the attribute and the variable, so the
//   old project slides away as it stands; `stop` kills it and clears the pose, keeping the head
//   sticky only if asked (a close measures and morphs it where it's stuck).
// The trigger is created by callbacks outside any GSAP context and killed by hand
// (hooks/useTakeoverMotion.ts).
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { animTargets } from "@/lib/motion";
import { applyBand, clearBand } from "@/lib/takeoverBand";
import {
  condenseFrame,
  condensePose,
  condenseProgress,
  type CondenseFrame,
  type CondenseParts,
  type CondensePose,
} from "@/lib/takeoverCondense";

/** Set on the dialog while its condense runs; the head's classes make it sticky with it. */
const condenseFlag = "data-condense";
/** The head's sticky top, read by its `top-(--takeover-stick)` class. */
const stickVar = "--takeover-stick";

export type Condense = {
  /** True until `release`: the pose is measured but not written. */
  readonly held: boolean;
  /** The pose for `scrollTop`, from the last measured frame. */
  poseAt(scrollTop: number): CondensePose;
  /** Writes `pose` on the head's band and title (clears them at progress 0). */
  apply(pose: CondensePose): void;
  /** Starts writing: re-measures and applies the pose for the scroll now. */
  release(): void;
  /** Kills the trigger; the pose, attribute, variable and padding stay. */
  freeze(): void;
  /** Kills the trigger and clears the pose; the attribute, variable and padding go unless `keepSticky`. */
  stop(keepSticky: boolean): void;
};

/** A CSS length for `value` px, to a hundredth. */
function px(value: number): string {
  return `${Math.round(value * 100) / 100}px`;
}

/** `dialog`'s condense parts, with any proof card's title and banner, or null if one is missing. */
function partsOf(dialog: HTMLDialogElement): CondenseParts | null {
  const head = animTargets(dialog, "takeover-head")[0];
  const column = head?.parentElement;
  const band = head ? animTargets(head, "takeover-band")[0] : undefined;
  const title = head ? animTargets(head, "takeover-title")[0] : undefined;
  const bar = animTargets(dialog, "takeover-bar")[0];
  const cardTitle = animTargets(document, "proof-card-title")[0];
  const banner = animTargets(document, "proof-banner")[0];
  if (!head || !column || !band || !title || !bar || !cardTitle || !banner) return null;
  return { bar, column, head, band, title, cardTitle, banner };
}

/** Clears every inline style the condense set on the dialog. */
function clearDialog(dialog: HTMLDialogElement): void {
  dialog.removeAttribute(condenseFlag);
  dialog.style.removeProperty(stickVar);
  dialog.style.scrollPaddingTop = "";
}

/**
 * Starts `dialog`'s condense, or returns null when it can't be measured (the head then stays
 * `relative`). The head's band and title must be at rest; with `held`, the caller's tweens may
 * write them once this returns.
 */
export function startCondense(dialog: HTMLDialogElement, options: { readonly held: boolean }): Condense | null {
  const parts = partsOf(dialog);
  const first = parts ? condenseFrame(parts) : null;
  if (!parts || !first) return null;
  const { band, title } = parts;
  let frame: CondenseFrame = first;
  let held = options.held;
  let trigger: ScrollTrigger | null = null;

  const clearPose = () => {
    clearBand(band);
    gsap.set(title, { clearProps: "transform,transformOrigin" });
  };
  const writeDialog = () => {
    dialog.setAttribute(condenseFlag, "");
    dialog.style.setProperty(stickVar, px(frame.stick));
    dialog.style.scrollPaddingTop = px(frame.scrollPadding);
  };
  const apply = (pose: CondensePose) => {
    if (pose.progress <= 0) {
      clearPose();
      return;
    }
    applyBand(band, pose.band);
    gsap.set(title, { transformOrigin: "0 0", x: pose.title.x, y: pose.title.y, scale: pose.title.scale });
  };
  const poseAt = (scrollTop: number) => condensePose(frame, condenseProgress(frame, scrollTop));
  const update = () => {
    if (!held) apply(poseAt(dialog.scrollTop));
  };
  // Runs first in every refresh (ScrollTrigger reads `start` before `end`). While held, the open's
  // inline band and title styles would skew the reads, so the last frame stands.
  const measure = () => {
    if (!held) {
      clearPose();
      frame = condenseFrame(parts) ?? frame;
    }
    writeDialog();
    return frame.start;
  };

  writeDialog();
  trigger = ScrollTrigger.create({
    scroller: dialog,
    start: measure,
    end: () => frame.start + frame.distance,
    onUpdate: update,
    onRefresh: update,
  });
  update();
  // The display face can land after the first measure and change the title's box.
  document.fonts?.ready.then(() => trigger?.refresh());

  // Killing the dialog's last trigger zeroes ScrollTrigger's recorded scroll for it (`rec` on its
  // scroll function). A reduced-motion switch kills it between the record and the refresh that
  // restores every scroller from it, which would leave the open dialog at its top. So the record
  // is kept as it was (normally already cleared; a refresh clears it at its end). Creating a
  // trigger wipes it the same way, so the hook never starts one inside such a switch.
  const kill = () => {
    if (!trigger) return;
    const memory = trigger.scroll as unknown as { rec?: number };
    const rec = memory.rec;
    trigger.kill();
    memory.rec = rec;
    trigger = null;
  };

  return {
    get held() {
      return held;
    },
    poseAt,
    apply,
    release: () => {
      if (!held || !trigger) return;
      held = false;
      trigger.refresh();
      update();
    },
    freeze: kill,
    stop: (keepSticky) => {
      kill();
      clearPose();
      if (!keepSticky) clearDialog(dialog);
    },
  };
}
