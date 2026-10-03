// One Rix under reduced motion (ui-spec 02a-about-options §2a.O4; ui-spec/00-rix.md R8.1): fades
// only. Rix is static, in his server pose at home. One nudge line fades in once, a pick fades its
// prop and ack in. The poke ladder still counts (its gates and queue), and each step's line fades
// in and is announced (pokes, annoyed, angry); the tantrum's faded chain
// (lib/rixFadeTantrum.ts) throws a held pick away by fading it and deselecting, so the pick's state
// matches full motion; a pick during it ends it (any line fades out, the mood resets). The pet is
// detected as in full motion (lib/rixPet.ts) and its `petLines` line fades in, never announced. No
// stomp, walk, patrol, emotion, glyph, play or nap. Any pick (`?for=` included) ends the nudges for
// good.
import { about } from "@/content/home";
import { deselectAbout } from "@/lib/aboutDeselect";
import { duration } from "@/lib/motion";
import { createCrew } from "@/lib/processBotCrew";
import { fadeTantrum } from "@/lib/rixFadeTantrum";
import { rixFeatures } from "@/lib/rixFeatures";
import { pickOf, watchNear, type RixRunOptions } from "@/lib/rixFull";
import { moodLadder, type MoodHolder, type MoodLadder } from "@/lib/rixMood";
import { NUDGE_MAX_REDUCED, QUIP_HOLD } from "@/lib/rixMotion";
import { nudgeClock } from "@/lib/rixNudges";
import { onceAtStage } from "@/lib/rixPeek";
import { petWatch } from "@/lib/rixPet";
import { fadeProp, revealAck } from "@/lib/rixPick";
import { quipMotion, type QuipMotion } from "@/lib/rixQuipMotion";
import { checkedIndex, propFor, resetRix } from "@/lib/rixRig";
import { announceRix } from "@/lib/rixStatus";
import { watchLive } from "@/lib/watchLive";

const nudgeLine = (count: number) => about.rix.nudgeLines[count % about.rix.nudgeLines.length] ?? "";
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

export function rixFade({ parts, scope, host, memo }: Omit<RixRunOptions, "fine">): RixFadeRun {
  const { root } = parts;
  const { name, sectionId } = scope;
  // The playground has no radios: no deselect, and `throwAway` is never said.
  const onAbout = host !== "playground";
  const key = onAbout ? sectionId : root.id;
  const crew = createCrew();
  const quip = quipMotion(parts.quip, key, crew, true);
  const near = watchNear(root);
  const announce = (line: string) => announceRix(key, line);
  const nudges = nudgeClock(crew, memo.nudges, {
    max: rixFeatures[host].schedulers ? NUDGE_MAX_REDUCED : 0,
    quiet: () => near.busy() || quip.showing(),
    nudge: (count) => quip.say(nudgeLine(count)),
  });
  const stopWatching = watchLive(root, crew.setLive);
  const stopArrival =
    onAbout ? onceAtStage(parts.stage, memo.entered, { hide: () => {}, play: nudges.start, show: nudges.start }) : () => {};

  // The faded poke ladder.
  let picked = onAbout ? checkedIndex(root, name) : null;
  let cancel: (() => void) | null = null;
  const holder: MoodHolder = { mood: "neutral" };
  const ladder = moodLadder(
    crew,
    holder,
    () => (holder.mood === "neutral" || holder.mood === "annoyed" ? "count" : "ignore"),
    {
      happy: (line) => {
        quip.say(line);
        announce(line);
        nudges.restart();
      },
      annoyed: (line) => {
        quip.say(line);
        announce(line);
        nudges.restart();
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
      announce,
      thrown,
      release: () => {
        picked = null;
        if (!onAbout) return;
        deselectAbout(root, name);
        announce(about.rix.throwAway);
      },
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

  const onChange = (event: Event) => {
    const pick = pickOf(event, name);
    if (!pick) return;
    picked = pick.input.checked ? pick.index : null;
    nudges.end();
    if (!event.isTrusted) return;
    if (holder.mood !== "neutral" && holder.mood !== "annoyed") calmDown();
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
      near.stop();
      nudges.stop();
      ladder.stop();
      pets.stop();
      cancel?.();
      quip.stop();
      crew.kill();
      resetRix(parts, null);
    },
  };
}
