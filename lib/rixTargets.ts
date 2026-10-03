// What Rix looks at on About (ui-spec 02a-about-options §2a.O4 adaptation table), and the
// measuring that turns a target into a look. Targets are found through About's hooks only: the
// picks (`about-chip`, the poster cards). A pick's visual box is its label's last child (the card
// span after the sr-only radio). Measuring happens in event handlers and act starts, never inside
// a tween.
import { animTargets } from "@/lib/motion";
import { eyeCentre } from "@/lib/processBotPointer";
import { rixLook, type RixLook } from "@/lib/rixLook";
import type { Rix } from "@/lib/rixRig";

/** The elements whose pointer or focus Rix looks at: the picks. */
export const lookTargets = '[data-anim="about-chip"]';

/** Where the pointer counts as "over the picks or Rix" for the nudge's quiet check. */
export const nearTargets = `${lookTargets}, [data-anim="about-rix"]`;

const visual = (element: Element) => element.lastElementChild ?? element;

/** The centre of the elements' visible boxes (client px), or null if none is showing. */
function centreOf(elements: readonly Element[]) {
  let left = Infinity;
  let top = Infinity;
  let right = -Infinity;
  let bottom = -Infinity;
  elements.forEach((element) => {
    const box = visual(element).getBoundingClientRect();
    if (box.width === 0 && box.height === 0) return;
    left = Math.min(left, box.left);
    top = Math.min(top, box.top);
    right = Math.max(right, box.right);
    bottom = Math.max(bottom, box.bottom);
  });
  return left === Infinity ? null : { x: (left + right) / 2, y: (top + bottom) / 2 };
}

/** Rix's look at the centre of `elements`, or null if none of them is showing. */
export function lookAt(rix: Rix, elements: readonly Element[]): RixLook | null {
  const centre = centreOf(elements);
  if (!centre) return null;
  const eye = eyeCentre(rix.svg.getBoundingClientRect(), 0, 0);
  return rixLook(centre.x - eye.x, centre.y - eye.y, rix.scale);
}

/** Rix's look at the fine pointer's last client position, or null if none was seen. */
export function pointerLookOf(rix: Rix): RixLook | null {
  const at = rix.pointerAt;
  if (!at) return null;
  const eye = eyeCentre(rix.svg.getBoundingClientRect(), 0, 0);
  return rixLook(at.x - eye.x, at.y - eye.y, rix.scale);
}

/** Rix's look down the floor to the shelf's left (−1) or right (1) end (the playground's stage). */
export function shelfEndLook(rix: Rix, end: -1 | 1): RixLook {
  const shelf = rix.stage.getBoundingClientRect();
  const eye = eyeCentre(rix.svg.getBoundingClientRect(), 0, 0);
  return rixLook((end < 0 ? shelf.left : shelf.right) - eye.x, shelf.bottom - eye.y, rix.scale);
}

/** The side of Rix a target sits on: −1 left of his eye centre, 1 right. */
export function sideOf(rix: Rix, element: Element): -1 | 1 {
  const box = visual(element).getBoundingClientRect();
  const eye = eyeCentre(rix.svg.getBoundingClientRect(), 0, 0);
  return box.left + box.width / 2 < eye.x ? -1 : 1;
}

/** The picks as a group: the board's centre (the ask's glance and a nudge's look). */
export function picksLook(rix: Rix): RixLook | null {
  return lookAt(rix, animTargets(rix.root, "about-chip"));
}

/** The picked control. */
export function pickedLook(rix: Rix, input: HTMLInputElement): RixLook | null {
  const control = input.closest(lookTargets);
  return control ? lookAt(rix, [control]) : null;
}
