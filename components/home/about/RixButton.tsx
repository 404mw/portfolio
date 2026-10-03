"use client";
// Rix, About's host mascot (02a-about-options §2a.O0.1, §2a.O4.1, ui-spec/00-rix.md R1.3): the
// full SVG box is the poke target. `children` is the server-drawn bot (ProcessBot `host`, with
// RixProps and RixEmotes). Without JavaScript (and in the server markup) the box is a decorative
// `<span>`, so no-JS visitors never meet a dead control; once hydrated it's a `<button>` named by
// `about.rix.buttonLabel`. The box sits in the walker (`rix-walker`), the walk's only writer (its
// `x`), so the focus ring travels with him; at rest it adds nothing to the layout. The quip shows
// the current line from the shared quip store (lib/rixQuip.ts, keyed by `quipKey`, the instance's
// section id); `RixStatus` (the walker's sibling, same key) announces. The motion pass owns the
// poke: its poke ladder (lib/rixMood.ts) says and announces each line. A long press opens no phone
// menu (`-webkit-touch-callout: none`), so it can be the pet (R1.4, R6B.1). Motion hooks:
// `rix-walker`, `about-rix` (the button only, so motion waits for it) and the quip's.
import type { ReactNode } from "react";
import { RixQuip } from "@/components/home/about/RixQuip";
import { RixStatus } from "@/components/home/about/RixStatus";
import { about } from "@/content/home";
import { useHydrated } from "@/hooks/useHydrated";
import { useKeyedLine } from "@/hooks/useKeyedLine";
import { rixQuipLine, subscribeRixQuip } from "@/lib/rixQuip";
import { focusRingCard } from "@/lib/styles";

type RixButtonProps = {
  /** Width and height classes (the box keeps the SVG's 170 × 110 ratio). */
  readonly size: string;
  /** `RixQuip` placement classes. */
  readonly quipPlacement: string;
  /** The quip and status store key: the instance's section id (lib/rixQuip.ts, lib/rixStatus.ts). */
  readonly quipKey: string;
  /** The quip's text-size classes (`RixQuip`'s default when absent). */
  readonly quipText?: string;
  readonly children: ReactNode;
};

const box = "relative block shrink-0 rounded-2xl";

export function RixButton({ size, quipPlacement, quipKey, quipText, children }: RixButtonProps) {
  const hydrated = useHydrated();
  const line = useKeyedLine(rixQuipLine, subscribeRixQuip, quipKey);
  const contents = (
    <>
      {children}
      <RixQuip line={line} placement={quipPlacement} text={quipText} />
    </>
  );
  return (
    <>
      <div data-anim="rix-walker" className="relative shrink-0">
        {hydrated ? (
          <button
            type="button"
            data-anim="about-rix"
            aria-label={about.rix.buttonLabel}
            className={`${box} cursor-pointer [-webkit-touch-callout:none] ${focusRingCard} ${size}`}
          >
            {contents}
          </button>
        ) : (
          <span className={`${box} ${size}`}>{contents}</span>
        )}
      </div>
      <RixStatus statusKey={quipKey} />
    </>
  );
}
