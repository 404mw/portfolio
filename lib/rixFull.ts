// One Rix's full-motion run (ui-spec 02a-about-options §2a.O4; ui-spec/00-rix.md R9, R10): the
// arrival, life, pointer and target looks, the perk and pick acts, and the character sheet's
// emotions and glyphs, card walks, the patrol, typed talk, plays, nap, tag, the poke ladder, and the
// pet and its love (lib/rixFeatures.ts sets the schedulers and the patrol per host: home's About Rix
// or the /rix playground). Home's About also gets rev 4: the idle clock (beats, strolls, plays and
// chatter, lib/rixIdle.ts), hover mode at a held card (lib/rixHover.ts) and the pick lock through
// the tantrum (lib/aboutPickLock.ts); the playground gets none of them, and keeps calm by a pick.
// The registry and the per-frame channel writer run only while the instance is on screen and the
// tab visible (`watchLive`). Returns the teardown, which kills everything and puts the instance
// back exactly as server-rendered, and the playground's kit (the services its buttons drive).
//
// Tweens made later by handlers and timers live in the crew; the crew, `resetRix` and the quip's
// `stop` clean them up.
import { about } from "@/content/home";
import { deselectAbout } from "@/lib/aboutDeselect";
import { pickLock } from "@/lib/aboutPickLock";
import { isAboutChange } from "@/lib/aboutReplies";
import type { AboutScope } from "@/lib/aboutScope";
import { gsap } from "@/lib/gsap";
import { createCrew } from "@/lib/processBotCrew";
import { startLife } from "@/lib/processBotLife";
import { announceRix } from "@/lib/rixStatus";
import { ask, chatter, happyPoke, perk, releaseHold } from "@/lib/rixActs";
import { annoyedPoke } from "@/lib/rixAnnoyed";
import { balance } from "@/lib/rixBalance";
import { beat } from "@/lib/rixBeats";
import { calm } from "@/lib/rixCalm";
import type { Wall } from "@/lib/rixEmotions";
import { rixFeatures, type RixHost } from "@/lib/rixFeatures";
import { rixEyes } from "@/lib/rixFollow";
import { forgive } from "@/lib/rixForgive";
import { hoverMode, type HoverMode } from "@/lib/rixHover";
import { hoverLines } from "@/lib/rixHoverLines";
import { idleClock, type IdleClock } from "@/lib/rixIdle";
import { idleTalk } from "@/lib/rixIdleTalk";
import { juggle } from "@/lib/rixJuggle";
import { chatterLine, type LineMemo } from "@/lib/rixLines";
import { logoPose } from "@/lib/rixLogoPose";
import { love } from "@/lib/rixLove";
import { moodLadder, type MoodLadder, type PressVerdict } from "@/lib/rixMood";
import { IDLE_TALK, JUGGLE, TALK, type PlayName } from "@/lib/rixMotion";
import { nap, wake } from "@/lib/rixNap";
import { hideForPeek, onceAtStage, peekIn } from "@/lib/rixPeek";
import { peekaboo } from "@/lib/rixPeekaboo";
import { patrol, type Patrol } from "@/lib/rixPatrol";
import { petWatch, type PetWatch } from "@/lib/rixPet";
import { pickAct, revealAck } from "@/lib/rixPick";
import { inTantrum, mayStart } from "@/lib/rixPriority";
import { quipMotion } from "@/lib/rixQuipMotion";
import { checkedIndex, createRix, resetRix, type Rix, type RixAct, type RixParts } from "@/lib/rixRig";
import { sit } from "@/lib/rixSit";
import { hmph, sulk } from "@/lib/rixSulk";
import { tagWatch, type TagWatch } from "@/lib/rixTag";
import { setQuipSide, typeLine } from "@/lib/rixTalk";
import { tantrum, type TantrumCues } from "@/lib/rixTantrum";
import { pickedLook, picksLook } from "@/lib/rixTargets";
import { visitorClock } from "@/lib/rixVisitor";
import { wander, type Wander } from "@/lib/rixWander";
import { watchLive } from "@/lib/watchLive";

type Flag = { current: boolean };

/** Per page load: survives motion-mode re-runs. */
export type RixMemo = {
  readonly entered: Flag;
  /** Where each pool of scheduled lines has got to (lib/rixLines.ts). */
  readonly lines: LineMemo;
  /** Live seconds since landing: the busy phase is the first `TEMPO.busy` of them (R7). */
  live: number;
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

const petLine = (count: number) => about.rix.petLines[count % about.rix.petLines.length] ?? "";

/** The picked radio and its reply index, for a change on the instance's group; null otherwise. */
export function pickOf(event: Event, name: string): { input: HTMLInputElement; index: number } | null {
  if (!isAboutChange(event, name)) return null;
  const index = Number(event.target.dataset.reply);
  return Number.isInteger(index) ? { input: event.target, index } : null;
}

/** A press came from a fine pointer (mouse or pen), not touch or a key (a key's click has no detail). */
const fromFine = (event: MouseEvent, fine: boolean) =>
  "pointerType" in event ? event.pointerType === "mouse" || event.pointerType === "pen" : fine && event.detail > 0;

export function rixFull({ parts, scope, host, memo, fine }: RixRunOptions): RixRun {
  const { root, button } = parts;
  const { name, sectionId } = scope;
  // The playground has no radios: no deselect, no pick lock, and `throwAway` is never said.
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
  const announce = (line: string) => announceRix(key, line);
  // The pick lock (R6A.9), home's About only. Its capture listeners go on the root first; a
  // swallowed press during the sulk gets the hmph.
  const lock = onAbout
    ? pickLock({
        root,
        name,
        crew,
        lockLine: about.rix.lockLine,
        unlockLine: about.rix.unlockLine,
        announce,
        pressed: () => {
          if (rix.mood === "sulk") hmph(rix);
        },
      })
    : null;
  /** The tantrum's announced line, with `lockLine` after it while the picks lock: one utterance. */
  const withLock = (line: string) => (lock ? `${line} ${about.rix.lockLine}` : line);
  const eyes = rixEyes(rix, fine);
  const quip = quipMotion(parts.quip, key, crew, false, {
    side: () => setQuipSide(rix),
    type: (line, at) => typeLine(rix, line, at),
  });
  rix.say = quip.say;
  rix.quipOut = quip.out;
  rix.quipShowing = quip.showing;
  rix.quipTyping = quip.typing;
  rix.picked = onAbout ? checkedIndex(root, name) : null;

  // The character sheet's walks, hover mode, patrol, plays, nap, tag and pet.
  const lines = schedulers
    ? hoverLines({ crew, quip, memo: memo.lines, picked: () => rix.picked !== null, out: TALK.walkOut })
    : null;
  const hover: HoverMode | null = lines ? hoverMode(rix, lines) : null;
  const walks: Wander = wander(rix, hover?.begin);
  const patrols: Patrol = patrol(rix, features.patrol === "auto", () => clock?.settled() ?? true);
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

  /**
   * The mouse is on him: it came in and hasn't left, and he hasn't walked out from under it (a
   * pointer that stays still gets no leave when he's the one who moves).
   */
  const pointerOnRix = () => {
    if (!(pets?.resting() ?? false)) return false;
    const at = rix.pointerAt;
    if (!at) return true;
    const box = button.getBoundingClientRect();
    return at.x >= box.left && at.x <= box.right && at.y >= box.top && at.y <= box.bottom;
  };

  // The idle clock and its talk clock (R7), home's About only: beats, strolls, plays and chatter.
  const talk = schedulers
    ? idleTalk({ crew, quip, gap: () => (clock?.settled() ? IDLE_TALK.settledGap : IDLE_TALK.busyGap) })
    : null;
  const clock: IdleClock | null = schedulers
    ? idleClock({
        crew,
        lived: memo.live,
        // He stands free (`mayStart`), no card holds him (hover mode's), and the pointer isn't on him
        // (the perk's and the pet's).
        may: () => mayStart(rix, "beat") && rix.target === null && rix.hovering === null && !pointerOnRix(),
        talking: quip.showing,
        focused: () => document.activeElement === button && button.matches(":focus-visible"),
        chatterDue: () => talk?.due() ?? false,
        beat: (name) => beat(rix, name),
        play: (name) => playFor[name](),
        stroll: patrols.stroll,
        chatter: () => {
          const picked = rix.picked !== null;
          chatter(rix, picked, picked ? null : picksLook(rix));
          quip.say(chatterLine(memo.lines, picked), { at: TALK.afterNudge, style: "type" });
        },
        look: patrols.look,
      })
    : null;
  const stopVisitor = schedulers
    ? visitorClock({
        crew,
        idle: () => {
          // In the settled phase only (R6.3), wherever he stands: in a patrol pause or idle, never
          // mid-stretch (`mayStart`).
          if (bot.state === "napping" || !clock?.settled() || quip.showing()) return;
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

  // Every act's start and end: the eyes hand over, hover mode keeps or loses its hold, a waiting
  // walk may start, and the idle clock's next gap opens.
  let lastAct: RixAct | null = null;
  rix.onState = () => {
    eyes.settle();
    hover?.state();
    if (rix.act !== null) {
      lastAct = rix.act;
      return;
    }
    const ended = lastAct;
    lastAct = null;
    walks.idle();
    clock?.rest(ended);
  };
  if (schedulers) {
    rix.onTarget = (target) => {
      walks.target(target);
      hover?.target(target);
      // Released: the idle clock resumes with its next gap (R7).
      if (target === null) clock?.rest();
    };
  }

  // The poke ladder and its tantrum chain. The forgive's end resets the ladder and unlocks the picks.
  const endMood = () => {
    ladder.reset();
    lock?.unlock();
    walks.settle();
  };
  const forgiveAt = (wall: Wall) => forgive(rix, wall, about.rix.forgiveLine, endMood);
  const sulkAt = (wall: Wall) => sulk(rix, wall, about.rix.sulkLine, () => forgiveAt(wall));
  const cues: TantrumCues = {
    lock: lock?.lock,
    announce: (line) => announce(withLock(line)),
    release: () => {
      rix.picked = null;
      if (!onAbout) return;
      deselectAbout(root, name);
      announce(withLock(about.rix.throwAway));
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
      },
      annoyed: (line) => {
        annoyedPoke(rix);
        quip.say(line, { at: TALK.afterAnnoyed, style: "type" });
        announce(line);
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

  // The arrival, then life, the idle clock, its talk clock and the patrol.
  const land = () => {
    startLife(bot, crew);
    bot.state = "idle";
    rix.onState();
    clock?.start();
    talk?.start();
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

  // A pick: a visitor's pick plays the act and reveals the ack (`?for=` doesn't). The tantrum's
  // deselect is a change with nothing checked: no pick left, nothing plays. On home's About no
  // visitor's pick arrives from the tantrum's start to the forgive's end: the lock swallows it.
  const onChange = (event: Event) => {
    const pick = pickOf(event, name);
    if (!pick) return;
    const previous = rix.picked;
    rix.picked = pick.input.checked ? pick.index : null;
    if (!event.isTrusted) return;
    revealAck(parts, pick.index, false);
    if (bot.state === "entering") return;
    const look = pickedLook(rix, pick.input);
    const card = pick.input.closest('[data-anim="about-chip"]');
    const play = () => {
      pickAct(rix, pick.index, previous, look);
      walks.afterPick(card);
    };
    // Calm by a pick (R6A.8): the playground only since rev 4.
    if (!onAbout && inTantrum(rix) && rix.mood !== "calm") {
      ladder.reset();
      calm(rix, look, ladder.reset, play);
      return;
    }
    // Past the lock's failsafe a pick may still meet the chain: it cuts it, and he faces front again.
    rix.wall = null;
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
      if (clock) memo.live = clock.lived();
      clock?.stop();
      talk?.stop();
      stopVisitor();
      tag?.stop();
      hover?.stop();
      lines?.stop();
      walks.stop();
      patrols.stop();
      pets?.stop();
      ladder.stop();
      lock?.stop();
      eyes.stop();
      quip.stop();
      peek?.kill();
      crew.kill();
      resetRix(parts, bot);
    },
  };
}
