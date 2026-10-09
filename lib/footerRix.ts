// The footer Rix's full-motion run (ui-spec/09-footer.md §9.4 "Motion"; moves and constants from
// ui-spec/00-rix.md, by name). A light Rix on the shared machinery: Process's rig and life
// (lib/processBotRig.ts, lib/processBotLife.ts), Rix's pointer follow, typed talk, cut and beats.
// - Idle: life layers 1–4 and the pointer follow, from the first time the row is live.
// - The first call, once per page load, when the row first comes into view (`FOOTER_RIX_VIEW`): the
//   perk, then the wave, with line 1 typed `TALK.afterNudge` into the wave.
// - Later calls `IDLE_TALK.settledGap` after the last line ends: the wave with the next line, in turn.
// - Between calls a glyph-less beat `TEMPO.settledGap` after the last act ends (lib/footerRixClock.ts).
// - A fine pointer entering his link, or keyboard focus on it: the perk and the small wave
//   (lib/footerRixActs.ts). A press plays nothing: it navigates.
// Not here: the arrival peek, walks, the patrol, the poke ladder, the pet, props, glyphs, the nap,
// tag, plays, hover mode, any pick logic and announcements.
//
// Every timer and tween is in the crew, which runs only while the row is on screen and the tab
// visible (`watchLive`); so does the per-frame channel writer. Returns the teardown, which kills
// everything and puts the row back exactly as server-rendered (leaving for /rix unmounts it).
import { gsap } from "@/lib/gsap";
import { footerCall, footerHover } from "@/lib/footerRixActs";
import { footerRixClock } from "@/lib/footerRixClock";
import { footerRixLineCount, nextFooterRixLine, type FooterRixMemo } from "@/lib/footerRixLines";
import { FOOTER_RIX_VIEW } from "@/lib/footerRixParts";
import { onceInView } from "@/lib/onceInView";
import { createCrew } from "@/lib/processBotCrew";
import { startLife } from "@/lib/processBotLife";
import { beat } from "@/lib/rixBeats";
import { rixEyes } from "@/lib/rixFollow";
import { idleTalk } from "@/lib/rixIdleTalk";
import { IDLE_TALK, TALK } from "@/lib/rixMotion";
import { mayStart } from "@/lib/rixPriority";
import { footerRixQuipKey } from "@/lib/rixQuip";
import { quipMotion } from "@/lib/rixQuipMotion";
import { createRix, resetRix, type RixParts } from "@/lib/rixRig";
import { setQuipSide, typeLine } from "@/lib/rixTalk";
import { watchLive } from "@/lib/watchLive";

export type FooterRixRunOptions = {
  readonly parts: RixParts;
  readonly memo: FooterRixMemo;
  /** A mouse or trackpad: the pointer follow and the hover reaction run only with one. */
  readonly fine: boolean;
};

export function footerRixFull({ parts, memo, fine }: FooterRixRunOptions): () => void {
  const { root, button: link } = parts;
  const crew = createCrew();
  const rix = createRix(parts, crew, "footer");
  if (!rix) {
    crew.kill();
    return () => {};
  }
  const { bot } = rix;
  const eyes = rixEyes(rix, fine);
  const quip = quipMotion(parts.quip, footerRixQuipKey, crew, false, {
    side: () => setQuipSide(rix),
    type: (line, at) => typeLine(rix, line, at),
  });
  rix.say = quip.say;
  rix.quipOut = quip.out;
  rix.quipShowing = quip.showing;
  rix.quipTyping = quip.typing;

  // Calls and the beats between them. The first call is due from the start; later ones by the talk
  // clock, each gap counted from the last line's end.
  const talk = idleTalk({ crew, quip, gap: () => IDLE_TALK.settledGap });
  const clock = footerRixClock({
    crew,
    may: () => mayStart(rix, "beat"),
    callDue: () => footerRixLineCount > 0 && (!memo.called || talk.due()),
    call: () => {
      const first = !memo.called;
      memo.called = true;
      const waveAt = footerCall(rix, first);
      quip.say(nextFooterRixLine(memo), { at: waveAt + TALK.afterNudge, style: "type" });
    },
    beat: (name) => beat(rix, name),
  });

  // Every act's start and end: the eyes hand over, and an act's end opens the next beat's gap.
  let acting = false;
  rix.onState = () => {
    eyes.settle();
    if (rix.act !== null) {
      acting = true;
      return;
    }
    if (!acting) return;
    acting = false;
    clock.rest();
  };

  // One writer per frame for his summed channels, while live.
  const frame = () => {
    eyes.frame();
    bot.apply();
  };
  let ticking = false;
  const tick = (on: boolean) => {
    if (on === ticking) return;
    ticking = on;
    if (on) gsap.ticker.add(frame);
    else gsap.ticker.remove(frame);
  };

  // Life starts the first time the row is live; the clock once it has also come into view. A re-run
  // in the same page load (a motion-mode change, back from /rix) makes no first call: its next call
  // comes `IDLE_TALK.first` on, and its first beat a gap from here.
  let alive = false;
  let seen = false;
  let begun = false;
  const begin = () => {
    if (begun || !seen || !crew.isLive()) return;
    begun = true;
    talk.start();
    if (memo.called) clock.rest();
    clock.start();
  };
  const stopSeen = onceInView(root, FOOTER_RIX_VIEW, () => {
    seen = true;
    begin();
  });
  const stopWatching = watchLive(root, (live) => {
    crew.setLive(live);
    tick(live);
    if (!live) return;
    // The page above him may have changed height while he was away.
    eyes.measure();
    if (!alive) {
      alive = true;
      startLife(bot, crew);
      rix.onState();
    }
    begin();
  });

  // The hover reaction. Keyboard focus may land before the row is on screen (the browser scrolls to
  // it after): the act waits in the crew and plays as he comes into view.
  const onEnter = (event: PointerEvent) => {
    if (!fine || event.pointerType === "touch" || !crew.isLive()) return;
    footerHover(rix);
  };
  const onFocus = () => {
    if (link.matches(":focus-visible")) footerHover(rix);
  };
  link.addEventListener("pointerenter", onEnter);
  link.addEventListener("focus", onFocus);

  return () => {
    link.removeEventListener("pointerenter", onEnter);
    link.removeEventListener("focus", onFocus);
    stopSeen();
    stopWatching();
    tick(false);
    clock.stop();
    talk.stop();
    eyes.stop();
    quip.stop();
    crew.kill();
    resetRix(parts, bot);
  };
}
