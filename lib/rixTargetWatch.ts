// Which pick holds Rix's attention (ui-spec 02a-about-options §2a.O4 "Look at a pick";
// ui-spec/00-rix.md R4.7, R4.9, R8.1), both motion modes: the pick under a fine pointer, or the one
// with keyboard focus. The hovered one wins over the focused one, and the target is released
// `LOOK_RELEASE` after both have left. Only keyboard focus is a target: a card a mouse clicked keeps
// focus, and would otherwise hold him there until it blurs. `onChange` hears every change; the
// release is a crew timer, so it pauses with the instance.
import type { gsap } from "@/lib/gsap";
import type { Crew } from "@/lib/processBotCrew";
import { LOOK_RELEASE } from "@/lib/rixMotion";
import { lookTargets } from "@/lib/rixTargets";

type TargetWatchOptions = {
  /** The instance's section: the listeners' root. */
  readonly root: HTMLElement;
  /** A fine pointer: hover counts (touch has none; a tap is a pick). */
  readonly fine: boolean;
  readonly crew: Pick<Crew, "after">;
  /** The target changed (null: released). */
  readonly onChange: (target: Element | null) => void;
};

/** Watches `root`'s picks for the hovered or focused one. Returns its cleanup. */
export function watchTargets({ root, fine, crew, onChange }: TargetWatchOptions): () => void {
  let hovered: Element | null = null;
  let focused: Element | null = null;
  let target: Element | null = null;
  let release: gsap.core.Tween | null = null;

  const targetOf = (node: EventTarget | null) => (node instanceof Element && root.contains(node) ? node.closest(lookTargets) : null);
  const update = () => {
    const next = hovered ?? focused;
    if (next) {
      release?.kill();
      release = null;
      if (next !== target) {
        target = next;
        onChange(next);
      }
      return;
    }
    if (target && !release) {
      release = crew.after(LOOK_RELEASE, () => {
        release = null;
        target = null;
        onChange(null);
      });
    }
  };
  const onOver = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    hovered = targetOf(event.target);
    update();
  };
  const onLeave = () => {
    hovered = null;
    update();
  };
  const keyboard = (node: EventTarget | null) => node instanceof Element && node.matches(":focus-visible");
  const onFocusIn = (event: FocusEvent) => {
    focused = keyboard(event.target) ? targetOf(event.target) : null;
    update();
  };
  const onFocusOut = () => {
    // The next card's own `focusin` sets it (its `:focus-visible` isn't known yet).
    focused = null;
    update();
  };

  root.addEventListener("focusin", onFocusIn);
  root.addEventListener("focusout", onFocusOut);
  if (fine) {
    root.addEventListener("pointerover", onOver);
    root.addEventListener("pointerleave", onLeave);
  }

  return () => {
    root.removeEventListener("focusin", onFocusIn);
    root.removeEventListener("focusout", onFocusOut);
    root.removeEventListener("pointerover", onOver);
    root.removeEventListener("pointerleave", onLeave);
    release?.kill();
  };
}
