// Measures the hero network canvas and its keep-outs (ui-spec §2.5). Every box is a layout box:
// offsets and computed sizes ignore CSS transforms, so the motion pass's fade-up and scroll
// parallax on the hero wrappers never shift the keep-outs.
import type { NetworkRect } from "@/lib/heroNetwork";

type Point = { readonly x: number; readonly y: number };

/** The element's untransformed top-left corner, relative to the page. */
function layoutOrigin(element: HTMLElement): Point {
  let x = 0;
  let y = 0;
  let current: HTMLElement | null = element;
  while (current) {
    x += current.offsetLeft;
    y += current.offsetTop;
    const parent = current.offsetParent as HTMLElement | null;
    if (parent) {
      x += parent.clientLeft;
      y += parent.clientTop;
    }
    current = parent;
  }
  return { x, y };
}

/** The canvas's untransformed size in CSS pixels. */
export function canvasLayoutSize(canvas: HTMLCanvasElement): { width: number; height: number } {
  const style = getComputedStyle(canvas);
  return { width: parseFloat(style.width) || 0, height: parseFloat(style.height) || 0 };
}

/** Untransformed boxes of every `[data-network-avoid="<kind>"]` under `root`, relative to the canvas. */
export function keepOutRects(
  root: ParentNode,
  kind: string,
  canvas: HTMLCanvasElement,
): NetworkRect[] {
  const origin = layoutOrigin(canvas);
  return Array.from(root.querySelectorAll<HTMLElement>(`[data-network-avoid="${kind}"]`))
    .filter((element) => element.offsetParent !== null)
    .map((element) => {
      const { x, y } = layoutOrigin(element);
      return {
        x: x - origin.x,
        y: y - origin.y,
        width: element.offsetWidth,
        height: element.offsetHeight,
      };
    });
}
