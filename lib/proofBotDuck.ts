// The proof card bots' duck (user's decision 2026-10-06, ui-spec §7.7), full motion only, on each
// bot's `rise` (the reveal's channel):
// - A plain activation of a card (a primary click with no modifier keys, or Enter, whose `click`
//   has `detail` 0) is held: the link's default is prevented, the bot drops to `RISE_FROM` (`DUCK`;
//   feet and all under the floor, hidden by the layer's clip), and when it lands the card's hash is
//   set exactly as the link would (a history entry is pushed and hooks/useHashTakeover.ts opens the
//   dialog as ever). Further plain activations of any card are ignored meanwhile. Modifier and
//   middle clicks, and a click already default-prevented, are left to the link.
// - Whenever a takeover is open, by any route (a card, a hash link or load, Next), its card's bot
//   is down: set there at once if it isn't down or ducking already. Bots left by Next stay down.
// - When no takeover is open any more (the close has ended and the dialog closed), every bot held
//   down rises back (`DUCK_RISE`, the reveal's own rise) and is stripped back to server markup.
// The reveal (hooks/useProofBots.ts) also writes `rise.y`: a duck or a drop kills a reveal still
// playing for its bot, and `owns` tells the reveal which bots to leave alone.
//
// The tweens here are made by handlers after setup, so they stay outside any GSAP context; `stop`
// kills them, strips every bot held back to server markup and, if asked, still opens the takeover
// of a duck cut short, so a mode switch never swallows the click.
import { gsap } from "@/lib/gsap";
import { stripMotion } from "@/lib/processBotRig";
import { DUCK, DUCK_RISE, RISE_FROM } from "@/lib/proofBotMotion";
import type { ProofBot } from "@/lib/proofBotRig";
import { watchOpenTakeovers } from "@/lib/watchOpenTakeovers";

export type ProofBotDuck = {
  /** True while the duck holds `bot` (ducking, down or rising back): the reveal leaves it alone. */
  readonly owns: (bot: ProofBot) => boolean;
  /**
   * Stops listening and watching, and puts every bot held back to server markup. With
   * `openPending`, a duck cut short still opens its takeover.
   */
  readonly stop: (openPending: boolean) => void;
};

/** A bot the duck holds: down (or ducking), or rising back; and the tween moving it, if any. */
type Held = { phase: "down" | "rising"; tween: gsap.core.Tween | null };

/** The takeover id a card opens (`href="#id"`), if it's one of `ids` and its dialog is here. */
function cardTarget(card: HTMLElement, ids: readonly string[]): string | null {
  const href = card.getAttribute("href");
  const id = href?.startsWith("#") ? href.slice(1) : null;
  if (id === null || !ids.includes(id)) return null;
  return document.getElementById(id) instanceof HTMLDialogElement ? id : null;
}

/** An activation the link would follow in this tab: no modifier, the primary button, not taken. */
function isPlain(event: MouseEvent): boolean {
  return (
    !event.defaultPrevented &&
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

/** Follows the card's link: the same hash change, and history entry, its click would make. */
function openTakeover(id: string) {
  window.location.hash = id;
}

/** Starts the duck for `bots`, whose cards open the takeovers `ids`. */
export function duckProofBots(bots: readonly ProofBot[], ids: readonly string[]): ProofBotDuck {
  const held = new Map<ProofBot, Held>();
  let pending: { readonly bot: ProofBot; readonly id: string } | null = null;

  /** Ends whatever moves `bot`'s rise now: the reveal, or a rise back. */
  const takeRise = (bot: ProofBot) => {
    held.get(bot)?.tween?.kill();
    gsap.killTweensOf(bot.parts.rise, "y");
  };

  const duck = (bot: ProofBot, id: string) => {
    takeRise(bot);
    const state: Held = { phase: "down", tween: null };
    held.set(bot, state);
    pending = { bot, id };
    state.tween = gsap.to(bot.parts.rise, {
      y: RISE_FROM,
      ...DUCK,
      onComplete: () => {
        state.tween = null;
        pending = null;
        openTakeover(id);
      },
    });
  };

  /** Puts `bot` down at once (its takeover is already over it), unless it's down or ducking. */
  const drop = (bot: ProofBot) => {
    if (held.get(bot)?.phase === "down") return;
    takeRise(bot);
    gsap.set(bot.parts.rise, { y: RISE_FROM });
    held.set(bot, { phase: "down", tween: null });
  };

  /** Every bot held down rises back, then goes back to server markup. */
  const riseBack = () => {
    held.forEach((state, bot) => {
      if (state.phase !== "down" || pending?.bot === bot) return;
      state.tween?.kill();
      state.phase = "rising";
      state.tween = gsap.to(bot.parts.rise, {
        y: 0,
        ...DUCK_RISE,
        onComplete: () => {
          held.delete(bot);
          stripMotion([bot.parts.rise]);
        },
      });
    });
  };

  // Each takeover id and the bot in the card that opens it.
  const byTarget = new Map<string, ProofBot>();
  bots.forEach((bot) => {
    const id = cardTarget(bot.parts.card, ids);
    if (id !== null) byTarget.set(id, bot);
  });

  const detach = Array.from(byTarget, ([id, bot]) => {
    const { card } = bot.parts;
    const onClick = (event: MouseEvent) => {
      if (!isPlain(event)) return;
      event.preventDefault();
      if (!pending) duck(bot, id);
    };
    card.addEventListener("click", onClick);
    return () => card.removeEventListener("click", onClick);
  });

  const stopWatching = watchOpenTakeovers(ids, (open) => {
    open.forEach((id) => {
      const bot = byTarget.get(id);
      if (bot) drop(bot);
    });
    if (open.length === 0) riseBack();
  });

  return {
    owns: (bot) => held.has(bot),
    stop: (openPending) => {
      stopWatching();
      detach.forEach((off) => off());
      const cut = pending;
      pending = null;
      held.forEach((state) => state.tween?.kill());
      stripMotion(Array.from(held.keys(), (bot) => bot.parts.rise));
      held.clear();
      if (cut && openPending) openTakeover(cut.id);
    },
  };
}
