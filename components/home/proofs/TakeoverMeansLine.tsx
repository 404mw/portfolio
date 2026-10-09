"use client";
// A takeover's closing line (ui-spec §7.3.3), part 6's headline: the line for the About pick's set,
// or `default` when that card has none. The server markup and the page without JavaScript show
// `default` (`useShownSet`'s server set). It registers itself with the swap fade (ui-spec §0.5), so
// a swap that lands while the takeover is open fades like the other sections. No tag, no live
// region, no focus or scroll move.
import { useRef } from "react";
import { useShownSet } from "@/hooks/useShownSet";
import { useSwapFade } from "@/hooks/useSwapFade";
import type { ProofMeans } from "@/lib/proofProject";

type TakeoverMeansLineProps = {
  readonly id: string;
  readonly lines: ProofMeans;
};

/** What fades across a set swap: the line itself. */
const swapWrappers = (line: HTMLElement) => [line];

export function TakeoverMeansLine({ id, lines }: TakeoverMeansLineProps) {
  const set = useShownSet();
  const root = useRef<HTMLHeadingElement>(null);
  useSwapFade(root, swapWrappers);
  return (
    <h3
      ref={root}
      id={id}
      data-anim="takeover-means-line"
      data-set={set}
      className={`max-w-3xl font-display text-card leading-[1.15] text-balance text-text`}
    >
      {lines[set] ?? lines.default}
    </h3>
  );
}
