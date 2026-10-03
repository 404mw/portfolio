// Rix's patrol (ui-spec/00-rix.md R4.8), full motion, character sheet only: when nothing holds his
// attention he ambles the shelf at `PATROL_PACE`, pausing to look around. There's no home: first
// paint and landing are unchanged (`x` 0), and the first stretch heads left `PATROL.first` after
// landing. A stretch is a leg of `PATROL.stretch` px in his heading, clamped to the shelf; with
// under `PATROL.minStretch` of room ahead he turns round. After each stretch, a pause of
// `PATROL.pause` with one look (the card below him, the pointer, or out at the visitor and a
// blink; on the playground's bare floor, `PATROL.floorLooks`: the pointer, out at the visitor, or
// down the floor to the shelf end he'll head for next); plays and nudges run in the pauses (they
// start only while he stands, R7).
//
// No stretch starts while a quip shows, Rix or a card is hovered or focused, the mood isn't
// neutral, he naps, an emotion is held or an act runs. Hovering or focusing Rix mid-stretch brakes
// it in place (the focus ring never wanders from a keyboard user); every act above it brakes it
// through its own cut. `PATROL.resume` after the last interrupt ends he resumes from where he
// stands, a pause first, keeping his heading if there's room ahead, else turning to the roomier
// side. The patrol is a crew timer, so it pauses off screen and in a hidden tab; reduced motion
// has none (lib/rixFade.ts doesn't start it).
import { gsap } from "@/lib/gsap";
import { blink } from "@/lib/processBotLife";
import { animTargets } from "@/lib/motion";
import { brake } from "@/lib/rixActs";
import { rixFeatures } from "@/lib/rixFeatures";
import type { RixLook } from "@/lib/rixLook";
import { LOOK_AT, LOOK_BACK, PATROL, PATROL_PACE } from "@/lib/rixMotion";
import type { Rix } from "@/lib/rixRig";
import { lookAt, pointerLookOf, shelfEndLook } from "@/lib/rixTargets";
import { bodyCentreAt, measureTrack, type Track } from "@/lib/rixTrack";
import { walkTo } from "@/lib/rixWalk";

export type Patrol = {
  /** Landing: the first stretch `PATROL.first` from now (if the patrol is on). */
  readonly start: () => void;
  /** The playground's toggle: on, the first stretch `PATROL.toggle` from now; off, a stretch brakes. */
  readonly setOn: (on: boolean) => void;
  readonly stop: () => void;
};

type Phase = "first" | "pause" | "walk" | "resume";

type LookKind = "card" | "pointer" | "out" | "end";

/** One roll of the pause's look, by the host's shares (B's cards, or the bare floor's). */
function rollLook(rix: Rix): LookKind {
  const roll = Math.random();
  if (rixFeatures[rix.host].stage === "cards") {
    const { card, pointer } = PATROL.looks;
    return roll < card ? "card" : roll < card + pointer ? "pointer" : "out";
  }
  const { pointer, out } = PATROL.floorLooks;
  return roll < pointer ? "pointer" : roll < pointer + out ? "out" : "end";
}

/** The cards he can look at below him: B's cards (the playground has none). */
function cardsOf(rix: Rix): Element[] {
  return animTargets(rix.root, "about-chip");
}

/** The card whose centre is nearest his body centre, sideways. */
function cardBelow(rix: Rix, track: Track): Element | null {
  const centre = bodyCentreAt(track);
  let best: Element | null = null;
  let distance = Infinity;
  cardsOf(rix).forEach((card) => {
    const box = (card.lastElementChild ?? card).getBoundingClientRect();
    if (box.width === 0) return;
    const away = Math.abs(box.left + box.width / 2 - centre);
    if (away < distance) {
      distance = away;
      best = card;
    }
  });
  return best;
}

export function patrol(rix: Rix, on: boolean): Patrol {
  const { crew, bot, button } = rix;
  let enabled = on;
  let started = false;
  let phase: Phase = "first";
  let due = 0;
  let lastBusy = -Infinity;
  let heading: -1 | 1 = PATROL.heading < 0 ? -1 : 1;
  let leg: gsap.core.Timeline | null = null;
  let timer: gsap.core.Tween | null = null;
  let look: gsap.core.Tween | null = null;
  let over = false;

  // Keyboard focus only: a mouse click leaves focus on the button without a ring (R1.4).
  const focused = () => document.activeElement === button && button.matches(":focus-visible");
  const interrupted = () => over || focused() || rix.target !== null;
  const held = () =>
    interrupted() ||
    rix.quipShowing() ||
    rix.mood !== "neutral" ||
    bot.state === "napping" ||
    rix.hold !== null ||
    (rix.act !== null && rix.act !== "patrol");
  const walking = () => leg !== null && rix.act === "patrol" && bot.busy === leg;

  const schedule = (delay: number) => {
    timer?.kill();
    timer = crew.after(Math.max(0.05, Math.min(delay, PATROL.poll)), tick);
  };

  /** The pause's one look, `PATROL.lookAt` in, held at most `PATROL.lookHold`. */
  const lookAround = () => {
    look = null;
    if (phase !== "pause" || rix.act !== null || bot.state !== "idle" || held()) return;
    const { ch } = bot;
    const track = measureTrack(rix);
    const kind = rollLook(rix);
    // The shelf end he'll head for next: his heading, or the other way if he'll turn round there.
    const end = (): RixLook => shelfEndLook(rix, roomOf(track, heading) < PATROL.minStretch ? (heading < 0 ? 1 : -1) : heading);
    // B's fallback is the card below him; the bare floor's is the shelf end.
    const fallback = (): RixLook | null => {
      if (rixFeatures[rix.host].stage === "floor") return end();
      const card = cardBelow(rix, track);
      return card ? lookAt(rix, [card]) : null;
    };
    const wanted =
      kind === "card" ? fallback() : kind === "pointer" ? (pointerLookOf(rix) ?? fallback()) : kind === "end" ? end() : { d: 0, p: 0 };
    if (!wanted) return;
    const hold = Math.min(PATROL.lookHold, Math.max(0, due - crew.now() - LOOK_AT.duration - LOOK_BACK.duration));
    const tl = gsap
      .timeline()
      .to(ch, { look: wanted.d, perp: wanted.p, ...LOOK_AT, overwrite: "auto" }, 0)
      .to(ch, { look: bot.restLook, perp: 0, ...LOOK_BACK, overwrite: "auto" }, LOOK_AT.duration + hold);
    // Out at the visitor: the look, then a blink.
    if (kind === "out") tl.add(blink(bot, false), LOOK_AT.duration);
    crew.run(tl);
  };

  const beginPause = () => {
    phase = "pause";
    leg = null;
    due = crew.now() + gsap.utils.random(PATROL.pause[0], PATROL.pause[1]);
    look?.kill();
    look = crew.after(PATROL.lookAt, lookAround);
  };

  const roomOf = (track: Track, dir: -1 | 1) => (dir < 0 ? track.x - track.minX : -track.x);

  const stretch = () => {
    const track = measureTrack(rix);
    // At an end (or resuming toward too little room) he turns round.
    if (roomOf(track, heading) < PATROL.minStretch) heading = heading < 0 ? 1 : -1;
    const room = roomOf(track, heading);
    if (room < PATROL.minStretch) {
      beginPause();
      return;
    }
    const distance = Math.min(room, gsap.utils.random(PATROL.stretch[0], PATROL.stretch[1]));
    phase = "walk";
    leg = walkTo(rix, track.x + heading * distance, {
      pace: PATROL_PACE,
      act: "patrol",
      onArrive: () => {
        if (phase === "walk") beginPause();
      },
    });
    if (!leg) beginPause();
  };

  function tick() {
    timer = null;
    if (!enabled || !started) return;
    const now = crew.now();
    if (phase === "walk") {
      if (walking()) {
        // Hovering or focusing Rix, or a card target, brakes the stretch where he is.
        if (interrupted()) {
          brake(rix);
          phase = "resume";
          lastBusy = now;
        }
        schedule(PATROL.poll);
        return;
      }
      // The stretch was cut by a higher act.
      phase = "resume";
      lastBusy = now;
      leg = null;
    }
    if (held()) {
      lastBusy = now;
      if (phase === "pause" || (phase === "first" && now >= due)) phase = "resume";
      schedule(PATROL.poll);
      return;
    }
    if (phase === "resume") {
      const left = lastBusy + PATROL.resume - now;
      if (left > 0) {
        schedule(left);
        return;
      }
      beginPause();
    }
    if (now < due) {
      schedule(due - now);
      return;
    }
    stretch();
    schedule(PATROL.poll);
  }

  /** Hover or focus on Rix: re-check at once, so a stretch brakes without waiting. */
  const recheck = () => {
    if (!enabled || !started) return;
    timer?.kill();
    tick();
  };
  const onEnter = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    over = true;
    recheck();
  };
  const onLeave = () => {
    over = false;
  };
  button.addEventListener("pointerenter", onEnter);
  button.addEventListener("pointerleave", onLeave);
  button.addEventListener("focus", recheck);

  const begin = (delay: number) => {
    started = true;
    phase = "first";
    due = crew.now() + delay;
    schedule(delay);
  };

  return {
    start: () => {
      if (started) return;
      if (enabled) begin(PATROL.first);
      else started = true;
    },
    setOn: (next) => {
      if (next === enabled) return;
      enabled = next;
      if (next) {
        begin(PATROL.toggle);
        return;
      }
      timer?.kill();
      timer = null;
      look?.kill();
      look = null;
      if (walking()) brake(rix);
      leg = null;
    },
    stop: () => {
      timer?.kill();
      look?.kill();
      button.removeEventListener("pointerenter", onEnter);
      button.removeEventListener("pointerleave", onLeave);
      button.removeEventListener("focus", recheck);
    },
  };
}
