// Keeps an element where it is on screen across a change that moves it (ui-spec §0.5): a pick made
// in a "Shown for" tag changes heights above that tag, and a swap never moves the visitor. Those
// heights change twice: About's ack at once, and Agents' list when the swap lands, after its
// fade-out (`lib/shownSet.ts`). So the element is held twice. For `change` itself it measures the
// top before, and once the change has painted scrolls the page by however far the element moved.
// For a swap that `change` set off, it measures just before the swap's commit and scrolls in the
// same frame, before the new set paints, then checks once more after the paint. Browsers with
// scroll anchoring have already held it, so the difference is 0 and nothing scrolls. Instant,
// never smooth.
import { aroundPendingSwap } from "@/lib/shownSet";

/** Measures `element`'s top now. The returned function scrolls by however far it has moved since. */
function mark(element: Element): () => void {
  const before = element.getBoundingClientRect().top;
  return () => {
    if (!element.isConnected) return;
    const moved = element.getBoundingClientRect().top - before;
    if (Math.abs(moved) >= 1) window.scrollBy({ top: moved, behavior: "instant" });
  };
}

/** Runs `settle` once the change made in this frame has painted. */
function afterPaint(settle: () => void) {
  requestAnimationFrame(() => requestAnimationFrame(settle));
}

export function holdInView(element: Element | null, change: () => void) {
  if (!element) {
    change();
    return;
  }
  const settle = mark(element);
  change();
  afterPaint(settle);
  aroundPendingSwap(() => {
    const settleSwap = mark(element);
    return () => {
      settleSwap();
      afterPaint(settleSwap);
    };
  });
}
