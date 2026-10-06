// Rix's idle clock (ui-spec/00-rix.md R7), full motion, home's About: the one clock for what he does
// when nobody is asking anything of him. It runs one item at a time: a beat (lib/rixBeats.ts), a
// play (R6), a stroll (one patrol stretch) or a chatter act (R5.4).
//
// Two phases by live time from landing: busy for the first `TEMPO.busy` seconds, settled after. The
// first item comes `TEMPO.first` after the ask ends; then, busy, the next comes `TEMPO.busyGap`
// after the last item, act or walk ends, each gap opening with one of the patrol's looks, picked by
// `IDLE_MENU.busy`; settled, `TEMPO.settledGap` after, picked by `IDLE_MENU.settled`, while the
// patrol fills the time between (its own stretches don't restart the gap, and an item that comes
// due mid-stretch waits for the stretch's end). Chatter that's due takes the next slot in place of
// the menu's pick. Never the same item twice in a row (a stroll is one name), nor two beats running
// with the same glyph; plays stay at most `PLAY.max` per `PLAY.per` seconds, picked by
// `PLAY.weights`, and past that a beat goes instead.
//
// An item starts only when the caller's gates hold (`may`); a play, a stroll or a chatter act also
// waits for the quip to be empty, and a stroll is swapped for a beat while Rix has keyboard focus.
// A waiting item re-checks every `TEMPO.retry`, and a wait isn't an item. Hover mode, tag, the nap
// and the pet aren't on this clock. Every timer is a crew timer, so the clock and its phases stand
// still off screen and in a hidden tab.
import { gsap } from "@/lib/gsap";
import type { Crew } from "@/lib/processBotCrew";
import { beatGlyph } from "@/lib/rixBeats";
import { BEAT, IDLE_MENU, PLAY, TEMPO, type BeatName, type PlayName } from "@/lib/rixMotion";
import type { RixAct } from "@/lib/rixRig";
import { weightedPick } from "@/lib/weightedPick";

export type IdleClock = {
  /** Landing: the phases count from here, and the first item comes `TEMPO.first` after the ask. */
  readonly start: () => void;
  /** An item, act or walk ended (`ended`: the act, if one did): the next item comes a gap from now. */
  readonly rest: (ended?: RixAct | null) => void;
  /** The settled phase has begun. */
  readonly settled: () => boolean;
  /** Live seconds since landing, this page load (the caller keeps them across motion-mode re-runs). */
  readonly lived: () => number;
  readonly stop: () => void;
};

type IdleOptions = {
  readonly crew: Pick<Crew, "after" | "now">;
  /** Live seconds already spent since landing, in an earlier run of this page load. */
  readonly lived: number;
  /**
   * The gates every item shares (R7): landed, no act running, the mood neutral, no held emotion,
   * not napping, no card target, the pointer not over Rix.
   */
  readonly may: () => boolean;
  /** A quip is showing: a play, a stroll and chatter wait (a beat may run). */
  readonly talking: () => boolean;
  /** Rix has keyboard focus: no stroll, so the ring doesn't wander. */
  readonly focused: () => boolean;
  /** Chatter is due (lib/rixIdleTalk.ts). */
  readonly chatterDue: () => boolean;
  readonly beat: (name: BeatName) => void;
  readonly play: (name: PlayName) => void;
  /** One patrol stretch; false if none could start. */
  readonly stroll: () => boolean;
  /** The chatter act and its line. */
  readonly chatter: () => void;
  /** A busy gap opens: one of the patrol's looks, back within `seconds`. */
  readonly look: (seconds: number) => void;
};

/** What a slot holds, from the menu. */
type Kind = keyof typeof IDLE_MENU.busy;

const beatNames = Object.keys(BEAT.weights) as BeatName[];

export function idleClock({ crew, lived, may, talking, focused, chatterDue, beat, play, stroll, chatter, look }: IdleOptions): IdleClock {
  let timer: gsap.core.Tween | null = null;
  let landedAt: number | null = null;
  /** No item has run yet: the wait is `TEMPO.first`, not a gap. */
  let first = true;
  /** The menu's pick for this slot, while it waits for its gate. */
  let pending: Kind | null = null;
  /** The last item, beat and play, by name. */
  let last: string | null = null;
  let lastBeat: BeatName | null = null;
  let lastPlay: PlayName | null = null;
  /** When each recent play started (live time). */
  let plays: number[] = [];
  /** A stroll of this clock's is under way: its end opens a gap (the settled patrol's own don't). */
  let strolling = false;

  const total = () => lived + (landedAt === null ? 0 : crew.now() - landedAt);
  const settled = () => total() >= TEMPO.busy;

  const schedule = (delay: number) => {
    timer?.kill();
    timer = crew.after(delay, fire);
  };

  const begun = (name: string) => {
    first = false;
    last = name;
  };

  /** The menu's pick: by the phase's weights, never a second stroll running. */
  const choose = (): Kind => {
    const menu = IDLE_MENU[settled() ? "settled" : "busy"];
    const kind = weightedPick(menu, last === "stroll" ? ["stroll"] : []) ?? "beat";
    return kind === "stroll" && focused() ? "beat" : kind;
  };

  /** A beat: never the last one again, nor the glyph the beat just before it showed. */
  const runBeat = () => {
    const glyph = lastBeat !== null && last === lastBeat ? beatGlyph[lastBeat] : undefined;
    const skip = beatNames.filter((name) => name === lastBeat || (glyph !== undefined && beatGlyph[name] === glyph));
    const name = weightedPick(BEAT.weights, skip) ?? "wave";
    lastBeat = name;
    begun(name);
    beat(name);
  };

  const run = (kind: Kind) => {
    if (kind === "play") {
      const now = crew.now();
      plays = plays.filter((at) => now - at < PLAY.per);
      if (plays.length < PLAY.max) {
        const name = weightedPick(PLAY.weights, lastPlay ? [lastPlay] : []) ?? "sit";
        plays.push(now);
        lastPlay = name;
        begun(name);
        play(name);
        return;
      }
    }
    if (kind === "stroll" && stroll()) {
      strolling = true;
      begun("stroll");
      return;
    }
    // A beat, also in place of a play past its cap or a stroll with no room.
    runBeat();
  };

  function fire() {
    // The item's own end brings the next gap (`rest`); until then this only keeps watch.
    schedule(TEMPO.retry);
    if (!may()) return;
    if (chatterDue()) {
      begun("chatter");
      chatter();
      return;
    }
    pending ??= choose();
    if (pending !== "beat" && talking()) return;
    const kind = pending;
    pending = null;
    run(kind);
  }

  return {
    start: () => {
      if (landedAt !== null) return;
      landedAt = crew.now();
      schedule(TEMPO.first);
    },
    rest: (ended = null) => {
      if (landedAt === null) return;
      if (ended === "patrol" && !strolling) return;
      strolling = false;
      if (first) {
        schedule(TEMPO.first);
        return;
      }
      const busy = !settled();
      const [min, max] = busy ? TEMPO.busyGap : TEMPO.settledGap;
      const gap = gsap.utils.random(min, max);
      schedule(gap);
      if (busy) look(gap);
    },
    settled,
    lived: total,
    stop: () => {
      timer?.kill();
      timer = null;
    },
  };
}
