// A staggered scroll reveal for a list of sibling items (Web rows, Proof cards), from the generic
// reveal's from-state (ui-spec §10): `reveal.y` px below with opacity 0, or opacity 0 only under
// reduced motion. Items whose top reaches `reveal.start` together rise in one staggered batch, so
// on a phone, where they're stacked, each one reveals as it arrives; each item reveals once.
//
// Call it inside a `gsap.matchMedia()` branch and pass that branch's own `context` (the argument
// `mm.add` hands its callback): the starting state is set there, in JS, so it's reverted with the
// branch and a no-JS visitor sees the items as built. The reveal tweens start later, in a
// ScrollTrigger callback, so they're recorded through `context.add` into the same branch and
// reverted with it. Don't wrap the callback in useGSAP's `contextSafe` instead: when the items are
// already in view the callback can run while the branch is the active context, which pushes
// useGSAP's context into the branch that it already contains, and the next revert recurses forever.
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { duration, ease, reveal } from "@/lib/motion";

type RevealBatchOptions = {
  /** Seconds between items that reveal together. */
  readonly each: number;
  /** Fades only, no rise. */
  readonly reduced: boolean;
  /** The calling matchMedia branch's context; the batch tweens are recorded in it. */
  readonly context: gsap.Context;
  /**
   * Inline styles to remove once an item has revealed. Default: `transform,opacity`. Pass
   * `opacity` when something else (a hover) drives the item's transform afterwards.
   */
  readonly clearProps?: string;
};

export function revealBatch(
  items: readonly HTMLElement[],
  { each, reduced, context, clearProps = "transform,opacity" }: RevealBatchOptions,
): void {
  if (items.length === 0) return;
  gsap.set(items, reduced ? { opacity: 0 } : { opacity: 0, y: reveal.y });

  ScrollTrigger.batch([...items], {
    start: reveal.start,
    once: true,
    onEnter: (batch: Element[]) => {
      context.add(() => {
        gsap.to(batch, {
          opacity: 1,
          ...(reduced ? {} : { y: 0 }),
          duration: reduced ? duration.fade : duration.enter,
          ease: ease.out,
          stagger: each,
          overwrite: "auto",
          clearProps,
        });
      });
    },
  });
}
