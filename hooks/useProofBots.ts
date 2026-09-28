// The proof card bots' motion (ui-spec §7.7, "Motion (later), the bot"), on the
// `[data-anim="proof-bot"]` SVGs inside `section`. This hook only wires things up; the moves live
// in lib/:
//
// - lib/proofBotRig.ts: each bot's hooks, pivots (set once with `svgOrigin`), summed channels and
//   `resetProofBot`.
// - lib/proofBotLife.ts: breathing, arm drift, blinks.
// - lib/proofBotActs.ts: the hover lean and the prop acts.
// - lib/proofBotFollow.ts: the eyes following a fine pointer.
// - lib/proofBotMotion.ts: the numbers.
//
// Full motion, two branches:
// - The rise (keyed on full motion only, like the cards' reveal, so it replays only when the cards
//   do): each bot's `rise` comes up from below the banner floor as its card reveals, in the same
//   batches and 0.12s stagger as the cards (lib/revealBatch.ts), with a soft overshoot.
// - Life (full motion; its pointer parts on a fine pointer): it breathes, drifts and blinks; its
//   eyes follow a fine pointer; hovering its card leans it and plays its prop's act. The idle
//   registry and the per-frame channel writer run only while the section is on screen, the tab
//   visible and no takeover open.
// Reduced motion: nothing here runs; the bot keeps its pose and fades in with its card (the card's
// own reveal). On unmount or any mode change what stops is killed and its hooks go back to the
// server markup exactly. The bot never follows into the takeover: it stays in its card, and pauses
// while one is open.
//
// Tweens made later by handlers, schedulers and the batch are outside the matchMedia context (it
// would otherwise collect every tween the bots ever make); the crew, the branches' cleanups and
// `resetProofBot` clean them up.
import type { RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { animTargets, finePointerQuery, motionQuery, reveal, stagger } from "@/lib/motion";
import { createCrew } from "@/lib/processBotCrew";
import { stripMotion } from "@/lib/processBotRig";
import { hoverLean, playAct } from "@/lib/proofBotActs";
import { followPointer } from "@/lib/proofBotFollow";
import { startProofLife } from "@/lib/proofBotLife";
import { RISE, RISE_FROM } from "@/lib/proofBotMotion";
import { findProofBot, resetProofBot, rigProofBot, type ProofBot } from "@/lib/proofBotRig";
import { takeoverIds } from "@/lib/proofs";
import { watchLive } from "@/lib/watchLive";
import { watchTakeovers } from "@/lib/watchTakeovers";

type Callback = { current: () => void };

/**
 * The reveal: every rise starts below the floor and comes up as its card reveals, in the cards'
 * batches and stagger. Each batch's rises are stripped back to their server markup when they land
 * (by then their cards have settled too), then `landed` runs. Returns the cleanup.
 */
function riseWithCards(bots: readonly ProofBot[], landed: Callback): () => void {
  const all = bots.map((bot) => bot.parts.rise);
  gsap.set(all, { y: RISE_FROM });
  const rising: gsap.core.Tween[] = [];
  const triggers = ScrollTrigger.batch(
    bots.map((bot) => bot.parts.card),
    {
      start: reveal.start,
      once: true,
      onEnter: (cards: Element[]) => {
        const rises = cards
          .map((card) => bots.find((bot) => bot.parts.card === card)?.parts.rise)
          .filter((rise): rise is SVGGElement => rise !== undefined);
        rising.push(
          gsap.to(rises, {
            y: 0,
            ...RISE,
            stagger: stagger.card,
            overwrite: "auto",
            onComplete: () => {
              stripMotion(rises);
              landed.current();
            },
          }),
        );
      },
    },
  );
  return () => {
    triggers.forEach((trigger) => trigger.kill());
    rising.forEach((tween) => tween.kill());
    stripMotion(all);
  };
}

/** Hover on each bot's card: lean and act on enter, lean back on leave. Returns the cleanup. */
function listenForHover(bots: readonly ProofBot[]): () => void {
  const detach = bots.map((bot) => {
    const { card } = bot.parts;
    const onEnter = () => {
      hoverLean(bot, true);
      playAct(bot);
    };
    const onLeave = () => {
      hoverLean(bot, false);
    };
    card.addEventListener("pointerenter", onEnter);
    card.addEventListener("pointerleave", onLeave);
    return () => {
      card.removeEventListener("pointerenter", onEnter);
      card.removeEventListener("pointerleave", onLeave);
    };
  });
  return () => detach.forEach((off) => off());
}

/**
 * Life: rigs, idle, and on a fine pointer the eyes' follow and the hover. `landed` is pointed at
 * the eyes' re-measure while this runs. Returns the cleanup.
 */
function lifeMotion(root: HTMLElement, bots: readonly ProofBot[], fine: boolean, landed: Callback): () => void {
  const crew = createCrew();
  bots.forEach(rigProofBot);
  bots.forEach((bot) => startProofLife(bot, crew));

  const pointer = fine ? followPointer(bots, crew.isLive) : null;
  const measure = () => pointer?.measure();
  measure();
  landed.current = measure;
  const resize = new ResizeObserver(measure);
  resize.observe(root);
  ScrollTrigger.addEventListener("refresh", measure);

  // One writer per frame for every bot's summed channels, while live.
  const frame = () => {
    pointer?.frame();
    bots.forEach((bot) => bot.apply());
  };
  let ticking = false;
  const tick = (on: boolean) => {
    if (on === ticking) return;
    ticking = on;
    if (on) gsap.ticker.add(frame);
    else gsap.ticker.remove(frame);
  };

  // Live: on screen, in a visible tab, and not covered by an open takeover.
  let seen = false;
  let covered = false;
  const update = () => {
    const live = seen && !covered;
    crew.setLive(live);
    tick(live);
  };
  const stopWatching = watchLive(root, (live) => {
    seen = live;
    update();
  });
  const stopCovering = watchTakeovers(takeoverIds, (open) => {
    covered = open;
    update();
  });

  const stopHover = fine ? listenForHover(bots) : () => {};

  return () => {
    landed.current = () => {};
    stopWatching();
    stopCovering();
    stopHover();
    pointer?.stop();
    resize.disconnect();
    ScrollTrigger.removeEventListener("refresh", measure);
    tick(false);
    crew.kill();
    bots.forEach(resetProofBot);
  };
}

export function useProofBots(section: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = section.current;
      if (!root) return;
      const bots = animTargets<SVGSVGElement>(root, "proof-bot")
        .map((svg) => findProofBot(svg))
        .filter((bot): bot is ProofBot => bot !== null);
      if (bots.length === 0) return;

      // The rise tells the life branch (if running) to re-measure once the cards have settled.
      const landed: Callback = { current: () => {} };
      const mm = gsap.matchMedia();

      // Reduced motion runs nothing: the bot keeps its pose and fades in with its card.
      mm.add(motionQuery.full, () => riseWithCards(bots, landed));
      mm.add({ full: motionQuery.full, fine: finePointerQuery }, (context) => {
        const { full = false, fine = false } = context.conditions ?? {};
        return full ? lifeMotion(root, bots, fine, landed) : undefined;
      });

      return () => mm.revert();
    },
    { scope: section },
  );
}
