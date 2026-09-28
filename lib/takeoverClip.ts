// The takeover's clip box (ui-spec §7.7, Motion): the dialog's `clip-path: inset()` as plain
// numbers, so GSAP tweens numbers rather than parsing clip-path strings. A box is the px each edge
// is pulled in from the dialog's own edges, plus the corner radius.
import { proofCardSelector } from "@/lib/proofs";
import type { ScreenBox } from "@/lib/takeoverTitleMorph";

export type ClipBox = { top: number; right: number; bottom: number; left: number; radius: number };

/** No clip: the dialog at full screen with square corners. */
export function fullBox(): ClipBox {
  return { top: 0, right: 0, bottom: 0, left: 0, radius: 0 };
}

/** The `clip-path` value for `box`. */
export function clipPathOf({ top, right, bottom, left, radius }: ClipBox): string {
  return `inset(${top}px ${right}px ${bottom}px ${left}px round ${radius}px)`;
}

/** The proof card that opens `dialog`, if it's on the page. */
export function sourceCard(dialog: HTMLDialogElement): HTMLElement | null {
  return document.querySelector<HTMLElement>(proofCardSelector(dialog.id));
}

/** Where `box` sits on screen (viewport px): the part of `dialog` it shows. Reads layout. */
export function screenBoxOf(dialog: HTMLDialogElement, box: ClipBox): ScreenBox {
  const d = dialog.getBoundingClientRect();
  return { top: d.top + box.top, right: d.right - box.right, bottom: d.bottom - box.bottom, left: d.left + box.left };
}

/**
 * The box that shows only `dialog`'s source card, as the card sits on screen now (its on-screen
 * part, with its own corner radius). Null when there's no card, or it's off screen: the caller
 * falls back to a plain fade. Reads layout, so call it before a tween starts, never inside one.
 */
export function cardBox(dialog: HTMLDialogElement): ClipBox | null {
  const card = sourceCard(dialog);
  if (!card) return null;
  const c = card.getBoundingClientRect();
  const d = dialog.getBoundingClientRect();
  const onScreen =
    c.width > 0 && c.height > 0 && c.bottom > d.top && c.top < d.bottom && c.right > d.left && c.left < d.right;
  if (!onScreen) return null;
  return {
    top: Math.max(0, c.top - d.top),
    right: Math.max(0, d.right - c.right),
    bottom: Math.max(0, d.bottom - c.bottom),
    left: Math.max(0, c.left - d.left),
    radius: Number.parseFloat(getComputedStyle(card).borderTopLeftRadius) || 0,
  };
}
