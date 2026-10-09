// The footer Rix under reduced motion (ui-spec/09-footer.md §9.4 "Motion"; ui-spec/00-rix.md R8.1):
// fades only. Rix doesn't move or look: he stays in his server pose, and nothing is rigged. Each of
// his lines fades in whole, holds `QUIP_HOLD` and fades out (the quip's `fade` style): the first of
// the page load when the row first comes into view (`FOOTER_RIX_VIEW`), then one every
// `IDLE_TALK.reducedGap` from the last line's end, in turn. A re-run in the same page load makes no
// first call: its next line comes `IDLE_TALK.first` on. Nothing answers hover or focus, and nothing
// is announced. The timers are crew timers, so they stand still off screen and in a hidden tab.
// Returns the teardown, which leaves the quip empty, exactly as server-rendered.
import { nextFooterRixLine, footerRixLineCount, type FooterRixMemo } from "@/lib/footerRixLines";
import { FOOTER_RIX_VIEW } from "@/lib/footerRixParts";
import { onceInView } from "@/lib/onceInView";
import { createCrew } from "@/lib/processBotCrew";
import { idleTalk } from "@/lib/rixIdleTalk";
import { IDLE_TALK } from "@/lib/rixMotion";
import { footerRixQuipKey } from "@/lib/rixQuip";
import { quipMotion } from "@/lib/rixQuipMotion";
import type { RixParts } from "@/lib/rixRig";
import { watchLive } from "@/lib/watchLive";

export type FooterRixFadeOptions = {
  readonly parts: Pick<RixParts, "root" | "quip">;
  readonly memo: FooterRixMemo;
};

export function footerRixFade({ parts, memo }: FooterRixFadeOptions): () => void {
  const { root } = parts;
  if (footerRixLineCount === 0) return () => {};
  const crew = createCrew();
  const quip = quipMotion(parts.quip, footerRixQuipKey, crew, true);
  const talk = idleTalk({ crew, quip, gap: () => IDLE_TALK.reducedGap });
  const say = () => quip.say(nextFooterRixLine(memo));

  let seen = false;
  let begun = false;
  const begin = () => {
    if (begun || !seen || !crew.isLive()) return;
    begun = true;
    talk.start();
    if (!memo.called) {
      memo.called = true;
      say();
    }
    talk.every(() => true, say);
  };
  const stopSeen = onceInView(root, FOOTER_RIX_VIEW, () => {
    seen = true;
    begin();
  });
  const stopWatching = watchLive(root, (live) => {
    crew.setLive(live);
    begin();
  });

  return () => {
    stopSeen();
    stopWatching();
    talk.stop();
    quip.stop();
    crew.kill();
  };
}
