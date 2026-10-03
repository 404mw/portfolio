// One Rix's full-motion run (ui-spec 02a-about-options §2a.O4; ui-spec/00-rix.md R9, R10): the
// arrival, life, pointer and target looks, the perk, nudges and pick acts, and the character
// sheet's emotions and glyphs, card walks, the patrol, typed talk, plays, nap, tag, the poke
// ladder, and the pet and its love (lib/rixFeatures.ts sets the schedulers and the patrol per
// host: home's About Rix or the /rix playground). The registry and the
// per-frame channel writer run only while the instance is on screen and the tab visible
// (`watchLive`). Returns the teardown, which kills everything and puts the instance back exactly
// as server-rendered, and the playground's kit (the services its buttons drive).
//
// Tweens made later by handlers and timers live in the crew; the crew, `resetRix` and the quip's
// `stop` clean them up.
import { about } from "@/content/home";
import { deselectAbout } from "@/lib/aboutDeselect";
import { isAboutChange } from "@/lib/aboutReplies";
import type { AboutScope } from "@/lib/aboutScope";
import { gsap } from "@/lib/gsap";
import { createCrew } from "@/lib/processBotCrew";
import { startLife } from "@/lib/processBotLife";
import { announceRix } from "@/lib/rixStatus";
import { ask, happyPoke, nudge, perk, releaseHold } from "@/lib/rixActs";
import { annoyedPoke } from "@/lib/rixAnnoyed";
import { balance } from "@/lib/rixBalance";
import { calm } from "@/lib/rixCalm";
import type { Wall } from "@/lib/rixEmotions";
import { rixFeatures, type RixHost } from "@/lib/rixFeatures";
import { rixEyes } from "@/lib/rixFollow";
import { forgive } from "@/lib/rixForgive";
import { juggle } from "@/lib/rixJuggle";
import { logoPose } from "@/lib/rixLogoPose";
import { love } from "@/lib/rixLove";
import { moodLadder, type MoodLadder, type PressVerdict } from "@/lib/rixMood";
import { JUGGLE, NUDGE_MAX, NUDGE_QUIET, TALK, type PlayName } from "@/lib/rixMotion";
import { nap, wake } from "@/lib/rixNap";
import { nudgeClock, type NudgeMemo } from "@/lib/rixNudges";
import { hideForPeek, onceAtStage, peekIn } from "@/lib/rixPeek";
import { peekaboo } from "@/lib/rixPeekaboo";
import { patrol, type Patrol } from "@/lib/rixPatrol";
import { petWatch, type PetWatch } from "@/lib/rixPet";
import { pickAct, revealAck } from "@/lib/rixPick";
import { playClock } from "@/lib/rixPlays";
import { inTantrum, mayStart } from "@/lib/rixPriority";
import { quipMotion } from "@/lib/rixQuipMotion";
import { checkedIndex, createRix, resetRix, type Rix, type RixAct, type RixParts } from "@/lib/rixRig";
import { sit } from "@/lib/rixSit";
import { hmph, sulk } from "@/lib/rixSulk";
import { tagWatch, type TagWatch } from "@/lib/rixTag";
import { setQuipSide, typeLine } from "@/lib/rixTalk";
import { tantrum, type TantrumCues } from "@/lib/rixTantrum";
import { nearTargets, pickedLook, picksLook } from "@/lib/rixTargets";
import { visitorClock } from "@/lib/rixVisitor";
import { wander, type Wander } from "@/lib/rixWander";
import { watchLive } from "@/lib/watchLive";

type Flag = { current: boolean };

/** Per page load: survives motion-mode re-runs. */
export type RixMemo = {
  readonly entered: Flag;
  readonly nudges: NudgeMemo;
  /** Juggles played: the first of the page load never drops. */
  juggles: number;
};

export type RixRunOptions = {
  readonly parts: RixParts;
  /** The instance's ids (section id, radio group): home's on `/`, option B's on the playground. */
  readonly scope: AboutScope;
  readonly host: RixHost;
  readonly memo: RixMemo;
  readonly fine: boolean;
};

/** What the /rix playground's buttons drive (full motion). */
export type RixKit = {
  readonly rix: Rix;
  readonly ladder: MoodLadder;
  readonly cues: TantrumCues;
  readonly announce: (line: string) => void;
  readonly sulkAt: (wall: Wall) => void;
  readonly forgiveAt: (wall: Wall) => void;
  readonly endMood: () => void;
  /** The patrol (the playground's toggle drives it). */
  readonly patrol: Patrol | null;
  /** The love act after a pet, typing `line` (none: no line). */
  readonly love: (line: string | null) => void;
};

export type RixRun = { readonly stop: () => void; readonly kit: RixKit | null };

const seconds = () => performance.now() / 1000;
const nudgeLine = (count: number) => about.rix.nudgeLines[count % about.rix.nudgeLines.length] ?? "";
const petLine = (count: number) => about.rix.petLines[count % about.rix.petLines.length] ?? "";

/** The picked radio and its reply index, for a change on the instance's group; null otherwise. */
export function pickOf(event: Event, name: string): { input: HTMLInputElement; index: number } | null {
  if (!isAboutChange(event, name)) return null;
  const index = Number(event.target.dataset.reply);
  return Number.isInteger(index) ? { input: event.target, index } : null;
}

/** Tracks when the pointer was last over the picks or Rix, and whether focus is in the instance. */
export function watchNear(root: HTMLElement) {
  let last = -Infinity;
  const onPointer = (event: PointerEvent) => {
    if (event.target instanceof Element && event.target.closest(nearTargets)) last = seconds();
  };
  root.addEventListener("pointerover", onPointer);
  root.addEventListener("pointermove", onPointer, { passive: true });
  return {
    busy: () => seconds() - last < NUDGE_QUIET || root.contains(document.activeElement),
    stop: () => {
      root.removeEventListener("pointerover", onPointer);
      root.removeEventListener("pointermove", onPointer);
    },
  };
}

/** A press came from a fine pointer (mouse or pen), not touch or a key (a key's click has no detail). */
const fromFine = (event: MouseEvent, fine: boolean) =>
  "pointerType" in event ? event.pointerType === "mouse" || event.pointerType === "pen" : fine && event.detail > 0;

export function rixFull({ parts, scope, host, memo, fine }: RixRunOptions): RixRun {
  const { root, button } = parts;
  const { name, sectionId } = scope;
  // The playground has no radios: no deselect, and `throwAway` ("you can pick again") is never said.
  const onAbout = host !== "playground";
  const key = onAbout ? sectionId : parts.root.id;
  const features = rixFeatures[host];
  const crew = createCrew();
  const rix = createRix(parts, crew, host);
  if (!rix) {
    crew.kill();
    return { stop: () => {}, kit: null };
  }
  const { bot } = rix;
  const schedulers = features.schedulers;
  const eyes = rixEyes(rix, fine);
  const quip = quipMotion(parts.quip, key, crew, false, {
    side: () => setQuipSide(rix),
    type: (line, at) => typeLine(rix, line, at),
  });
  rix.say = quip.say;
  rix.quipOut = quip.out;
  rix.quipShowing = quip.showing;
  const near = watchNear(root);
  const announce = (line: string) => announceRix(key, line);
  rix.picked = onAbout ? checkedIndex(root, name) : null;

  const nudges = nudgeClock(crew, memo.nudges, {
    max: schedulers ? NUDGE_MAX : 0,
    // A nudge starts while he stands, or from a patrol stretch, which brakes (R2.1).
    quiet: () =>
      near.busy() ||
      quip.showing() ||
      (rix.act === "patrol" ? false : bot.state !== "idle" || rix.act !== null) ||
      rix.mood !== "neutral" ||
      rix.hold !== null,
    nudge: (count) => {
      nudge(rix, picksLook(rix));
      quip.say(nudgeLine(count), { at: TALK.afterNudge, style: "type" });
    },
  });

  // The character sheet's walks, patrol, plays, nap, tag and pet.
  const walks: Wander = wander(rix);
  const patrols: Patrol = patrol(rix, features.patrol === "auto");
  const playFor: Record<PlayName, () => void> = {
    juggle: () => {
      juggle(rix, memo.juggles > 0 && Math.random() < JUGGLE.drop);
      memo.juggles += 1;
    },
    sit: () => sit(rix),
    peekaboo: () => peekaboo(rix),
    logoPose: () => logoPose(rix),
    balance: () => balance(rix),
  };
  const plays = schedulers
    ? playClock({
        crew,
        may: () => mayStart(rix, "play"),
        quiet: () => near.busy() || quip.showing() || rix.mood !== "neutral",
        play: (play) => playFor[play](),
      })
    : null;
  const napDone = () => memo.nudges.done || memo.nudges.count >= NUDGE_MAX;
  const stopVisitor = schedulers
    ? visitorClock({
        crew,
        idle: () => {
          // Wherever he stands: in a patrol pause or idle, never mid-stretch (`mayStart`).
          if (bot.state === "napping" || !napDone() || quip.showing()) return;
          if (mayStart(rix, "play")) nap(rix);
        },
        back: () => {
          // Asleep, or still nodding off.
          if (bot.state === "napping" || rix.emotion === "sleepy") wake(rix);
        },
      })
    : () => {};
  const tag: TagWatch | null =
    schedulers && fine ? tagWatch(rix, () => mayStart(rix, "play") && bot.state === "idle") : null;

  // The pet (R6B): gated by R2.1 (rank 4), and never in a mood, a hold, a wake or before landing.
  let pets: PetWatch | null = null;
  let petCount = 0;
  const playLove = (line: string | null) =>
    love(rix, line, { resting: () => pets?.resting() ?? false, done: () => pets?.ended() });
  pets = petWatch({
    crew,
    button,
    may: () =>
      mayStart(rix, "pet") &&
      rix.mood === "neutral" &&
      rix.hold !== "annoyed" &&
      bot.state !== "napping" &&
      !(rix.act === "play" && bot.state === "reacting"),
    pet: () => playLove(petLine(petCount++)),
  });

  // A patrol stretch ending doesn't reset the play clock (R7).
  let lastAct: RixAct | null = null;
  rix.onState = () => {
    eyes.settle();
    if (rix.act !== null) {
      lastAct = rix.act;
      return;
    }
    walks.idle();
    if (lastAct !== "patrol") plays?.rest();
    lastAct = null;
  };
  if (schedulers) rix.onTarget = walks.target;

  // The poke ladder and its tantrum chain.
  const endMood = () => {
    ladder.reset();
    walks.settle();
  };
  const forgiveAt = (wall: Wall) => forgive(rix, wall, about.rix.forgiveLine, endMood);
  const sulkAt = (wall: Wall) => sulk(rix, wall, about.rix.sulkLine, () => forgiveAt(wall));
  const cues: TantrumCues = {
    announce,
    release: () => {
      rix.picked = null;
      if (!onAbout) return;
      deselectAbout(root, name);
      announce(about.rix.throwAway);
    },
    sulk: sulkAt,
  };
  const verdict = (): PressVerdict => {
    if (bot.state === "entering" || rix.act === "pick" || rix.act === "calm") return "ignore";
    if (rix.mood === "sulk") return "hmph";
    return inTantrum(rix) ? "ignore" : "count";
  };
  const ladder = moodLadder(
    crew,
    rix,
    verdict,
    {
      happy: (line, count) => {
        happyPoke(rix, count);
        quip.say(line, { at: TALK.afterPoke, style: "type" });
        announce(line);
        nudges.restart();
      },
      annoyed: (line) => {
        annoyedPoke(rix);
        quip.say(line, { at: TALK.afterAnnoyed, style: "type" });
        announce(line);
        nudges.restart();
      },
      tantrum: (line) => tantrum(rix, line, cues),
      hmph: () => hmph(rix),
      calmDown: () => {
        if (rix.hold === "annoyed") releaseHold(rix);
      },
    },
    (pressFine) => {
      rix.pressFine = pressFine;
    },
  );

  // One writer per frame for Rix's summed channels, while live.
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
  const stopWatching = watchLive(root, (live) => {
    crew.setLive(live);
    tick(live);
    // Napping out of view: he wakes with a start when the instance comes back.
    if (live && bot.state === "napping") wake(rix);
  });

  // The arrival, then life, the nudge clock and the play clock.
  const land = () => {
    startLife(bot, crew);
    bot.state = "idle";
    rix.onState();
    nudges.start();
    plays?.start();
    patrols.start();
  };
  // The playground has no arrival on load: he's there, at rest (its button replays the arrival).
  let peek: gsap.core.Timeline | null = null;
  let stopArrival = () => {};
  if (!onAbout) {
    land();
  } else {
    stopArrival = onceAtStage(parts.stage, memo.entered, {
      hide: () => hideForPeek(rix),
      play: () => {
        peek = peekIn(rix, { land, ask: () => ask(rix, picksLook(rix)) });
      },
      show: land,
    });
  }

  // The poke (click, tap, Enter or Space) and the hover perk (or, after tag, being caught).
  const onClick = (event: MouseEvent) => {
    // The click that ends a long-press pet is never a poke (R6B.1).
    if (pets?.swallow()) return;
    ladder.press(fromFine(event, fine));
  };
  const onKey = (event: KeyboardEvent) => ladder.keydown(event);
  const onEnter = (event: PointerEvent) => {
    if (!fine || event.pointerType === "touch" || !crew.isLive()) return;
    if (tag?.hover()) return;
    perk(rix);
  };
  button.addEventListener("click", onClick);
  button.addEventListener("keydown", onKey);
  button.addEventListener("pointerenter", onEnter);

  // A pick: the nudges end; a visitor's pick plays the act and reveals the ack (`?for=` doesn't).
  // The tantrum's deselect is a change with nothing checked: no pick left, nothing plays.
  const onChange = (event: Event) => {
    const pick = pickOf(event, name);
    if (!pick) return;
    const previous = rix.picked;
    rix.picked = pick.input.checked ? pick.index : null;
    nudges.end();
    if (!event.isTrusted) return;
    revealAck(parts, pick.index, false);
    if (bot.state === "entering") return;
    const look = pickedLook(rix, pick.input);
    const card = pick.input.closest('[data-anim="about-chip"]');
    const play = () => {
      pickAct(rix, pick.index, previous, look);
      walks.afterPick(card);
    };
    if (inTantrum(rix) && rix.mood !== "calm") {
      ladder.reset();
      calm(rix, look, ladder.reset, play);
      return;
    }
    ladder.reset();
    play();
  };
  root.addEventListener("change", onChange);

  return {
    kit: { rix, ladder, cues, announce, sulkAt, forgiveAt, endMood, patrol: patrols, love: playLove },
    stop: () => {
      root.removeEventListener("change", onChange);
      button.removeEventListener("click", onClick);
      button.removeEventListener("keydown", onKey);
      button.removeEventListener("pointerenter", onEnter);
      stopArrival();
      stopWatching();
      tick(false);
      near.stop();
      nudges.stop();
      plays?.stop();
      stopVisitor();
      tag?.stop();
      walks.stop();
      patrols.stop();
      pets?.stop();
      ladder.stop();
      eyes.stop();
      quip.stop();
      peek?.kill();
      crew.kill();
      resetRix(parts, bot);
    },
  };
}
