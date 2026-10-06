// One Rix under reduced motion (ui-spec 02a-about-options §2a.O4; ui-spec/00-rix.md R8.1): fades
// only. Rix is static, in his server pose where he stands at first paint. A pick fades its prop and
// ack in. The poke ladder still counts (its gates and queue), and each step's line fades in and is
// announced (pokes, annoyed, angry); the tantrum's faded chain (lib/rixFadeTantrum.ts) throws a held
// pick away by fading it and deselecting, so the pick's state matches full motion. The pet is
// detected as in full motion (lib/rixPet.ts) and its `petLines` line fades in, never announced. No
// stomp, walk, patrol, emotion, glyph, beat, play or nap.
//
// On home's About (rev 4): a chatter line fades in `IDLE_TALK.first` after the stage shows, then
// every `IDLE_TALK.reducedGap` from the last line's end (lib/rixIdleTalk.ts), from the pool for the
// pick state; a hovered or focused card gets its hover lines (lib/rixHoverLines.ts), each fading out
// when its card's target leaves; none of them is announced, and a scheduled line never starts while
// one shows. The picks lock for the tantrum's whole window (lib/aboutPickLock.ts), so no pick ends
// it there; on the /rix playground a pick still does (any line fades out, the mood resets).
import { about } from "@/content/home";
import { deselectAbout } from "@/lib/aboutDeselect";
import { pickLock } from "@/lib/aboutPickLock";
import { duration } from "@/lib/motion";
import { createCrew } from "@/lib/processBotCrew";
import { fadeTantrum } from "@/lib/rixFadeTantrum";
import { rixFeatures } from "@/lib/rixFeatures";
import { pickOf, type RixRunOptions } from "@/lib/rixFull";
import { hoverLines } from "@/lib/rixHoverLines";
import { idleTalk } from "@/lib/rixIdleTalk";
import { chatterLine } from "@/lib/rixLines";
import { moodLadder, type MoodHolder, type MoodLadder } from "@/lib/rixMood";
import { IDLE_TALK, QUIP_HOLD } from "@/lib/rixMotion";
import { onceAtStage } from "@/lib/rixPeek";
import { petWatch } from "@/lib/rixPet";
import { fadeProp, revealAck } from "@/lib/rixPick";
import { quipMotion, type QuipMotion } from "@/lib/rixQuipMotion";
import { checkedIndex, propFor, resetRix } from "@/lib/rixRig";
import { announceRix } from "@/lib/rixStatus";
import { watchTargets } from "@/lib/rixTargetWatch";
import { watchLive } from "@/lib/watchLive";

const petLine = (count: number) => about.rix.petLines[count % about.rix.petLines.length] ?? "";
/** A faded line's life: in, hold, out (R8.1). */
const FADED_LINE = 2 * duration.fade + QUIP_HOLD;

/** What the /rix playground's buttons drive under reduced motion. */
export type RixFadeKit = {
  readonly quip: QuipMotion;
  readonly ladder: MoodLadder;
  readonly holder: MoodHolder;
  readonly announce: (line: string) => void;
  /** The faded tantrum chain with `line`; `thrown` is the held prop (and ack) to throw away. */
  readonly tantrum: (line: string, thrown: { prop: Element; ack: Element | null } | null) => void;
  /** Ends a faded chain: its line fades out, the mood resets. */
  readonly calmDown: () => void;
};

export type RixFadeRun = { readonly stop: () => void; readonly kit: RixFadeKit | null };

export function rixFade({ parts, scope, host, memo, fine }: RixRunOptions): RixFadeRun {
  const { root } = parts;
  const { name, sectionId } = scope;
  // The playground has no radios: no deselect, no pick lock, and `throwAway` is never said.
  const onAbout = host !== "playground";
  const key = onAbout ? sectionId : root.id;
  const schedulers = rixFeatures[host].schedulers;
  const crew = createCrew();
  const announce = (line: string) => announceRix(key, line);
  // The pick lock (R6A.9), home's About only; its capture listeners go on the root first.
  const lock = onAbout
    ? pickLock({ root, name, crew, lockLine: about.rix.lockLine, unlockLine: about.rix.unlockLine, announce })
    : null;
  /** The tantrum's announced line, with `lockLine` after it while the picks lock: one utterance. */
  const withLock = (line: string) => (lock ? `${line} ${about.rix.lockLine}` : line);
  const quip = quipMotion(parts.quip, key, crew, true);
  const stopWatching = watchLive(root, crew.setLive);

  let picked = onAbout ? checkedIndex(root, name) : null;
  let cancel: (() => void) | null = null;
  const holder: MoodHolder = { mood: "neutral" };

  // Chatter and hover lines (R8.1), home's About only: faded, never announced. Neither starts in a
  // mood; chatter also waits while a card holds the hover or focus (its hover lines talk instead).
  let target: Element | null = null;
  const calm = () => holder.mood === "neutral";
  const talk = schedulers ? idleTalk({ crew, quip, gap: () => IDLE_TALK.reducedGap }) : null;
  const lines = schedulers
    ? hoverLines({ crew, quip, memo: memo.lines, picked: () => picked !== null, out: duration.fade, may: calm })
    : null;
  const stopTargets = lines
    ? watchTargets({
        root,
        fine,
        crew,
        onChange: (next) => {
          target = next;
          lines.hold(next);
        },
      })
    : () => {};
  // The stage shows: live time counts from here (R7), and the lines may start.
  let shownAt: number | null = null;
  const show = () => {
    shownAt = crew.now();
    talk?.start();
    talk?.every(
      () => calm() && target === null,
      () => quip.say(chatterLine(memo.lines, picked !== null)),
    );
    lines?.ready(true);
  };
  const stopArrival = onAbout ? onceAtStage(parts.stage, memo.entered, { hide: () => {}, play: show, show }) : () => {};

  // The faded poke ladder.
  const ladder = moodLadder(
    crew,
    holder,
    () => (holder.mood === "neutral" || holder.mood === "annoyed" ? "count" : "ignore"),
    {
      happy: (line) => {
        quip.say(line);
        announce(line);
      },
      annoyed: (line) => {
        quip.say(line);
        announce(line);
      },
      tantrum: (line) => {
        const prop = picked !== null ? propFor(parts, picked) : undefined;
        tantrum(line, prop ? { prop, ack: parts.acks[picked ?? -1] ?? null } : null);
      },
      hmph: () => {},
      calmDown: () => {},
    },
  );
  const tantrum = (line: string, thrown: { prop: Element; ack: Element | null } | null) => {
    cancel?.();
    holder.mood = "sulk";
    cancel = fadeTantrum(line, {
      crew,
      say: (text) => quip.say(text),
      announce: (text) => announce(withLock(text)),
      thrown,
      release: () => {
        picked = null;
        if (!onAbout) return;
        deselectAbout(root, name);
        announce(withLock(about.rix.throwAway));
      },
      lock: lock?.lock,
      unlock: lock?.unlock,
      done: () => {
        cancel = null;
        ladder.reset();
      },
    });
  };
  const calmDown = () => {
    cancel?.();
    cancel = null;
    quip.out(duration.fade);
    ladder.reset();
  };

  // The pet: its line fades in (never announced); the next waits `PET.rest` after the line goes.
  let petCount = 0;
  const pets = petWatch({
    crew,
    button: parts.button,
    may: () => holder.mood === "neutral" && !quip.showing(),
    pet: () => {
      quip.say(petLine(petCount++));
      pets.ended(FADED_LINE);
    },
  });

  const onClick = () => {
    // The click that ends a long-press pet is never a poke (R6B.1).
    if (pets.swallow()) return;
    ladder.press(false);
  };
  const onKey = (event: KeyboardEvent) => ladder.keydown(event);
  parts.button.addEventListener("click", onClick);
  parts.button.addEventListener("keydown", onKey);

  // A pick fades its prop and ack in. On home's About none arrives during the faded chain (the lock
  // swallows it); on the playground it ends the chain (calm by a pick, R6A.8).
  const onChange = (event: Event) => {
    const pick = pickOf(event, name);
    if (!pick) return;
    picked = pick.input.checked ? pick.index : null;
    if (!event.isTrusted) return;
    if (!onAbout && holder.mood !== "neutral" && holder.mood !== "annoyed") calmDown();
    else ladder.reset();
    fadeProp(parts, pick.index);
    revealAck(parts, pick.index, true);
  };
  root.addEventListener("change", onChange);

  return {
    kit: { quip, ladder, holder, announce, tantrum, calmDown },
    stop: () => {
      root.removeEventListener("change", onChange);
      parts.button.removeEventListener("click", onClick);
      parts.button.removeEventListener("keydown", onKey);
      stopArrival();
      stopWatching();
      if (shownAt !== null) memo.live += crew.now() - shownAt;
      talk?.stop();
      lines?.stop();
      stopTargets();
      ladder.stop();
      pets.stop();
      cancel?.();
      lock?.stop();
      quip.stop();
      crew.kill();
      resetRix(parts, null);
    },
  };
}
