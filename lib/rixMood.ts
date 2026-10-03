// Rix's poke ladder (ui-spec/00-rix.md R6A.1), both motion modes: counting
// presses, the window, the gates and the queue, and the mood that follows. A press (click, tap,
// Enter or Space) counts unless the instance ignores it (before landing, during a pick, a calm or a
// tantrum), answers it with a hmph (the sulk), it comes within `POKE_REPEAT` of the last counted
// one, or it's a held key's repeat. Counts 1–3 play happy, 4–5 annoyed, 6+ the tantrum. Happy and
// annoyed acts start at least `POKE_COOLDOWN` apart; a press inside it fills a one-slot queue that
// always holds the latest level and plays when the cooldown ends, so nothing is dropped. The
// tantrum ignores the cooldown and waits `ANNOYED_MIN` after this count's first annoyed act (one
// always plays first), so the warning is always seen. After `POKE_WINDOW` with no counted press the
// count resets and an annoyed mood eases back; a trusted pick, the forgive's end and the calm's end
// reset it too. Times are the crew's live time. The acts themselves are the caller's (full or
// faded), so this file only decides what plays when.
import { about } from "@/content/home";
import type { gsap } from "@/lib/gsap";
import type { Crew } from "@/lib/processBotCrew";
import { ANNOYED_MIN, POKE_COOLDOWN, POKE_LADDER, POKE_REPEAT, POKE_WINDOW } from "@/lib/rixMotion";
import type { RixMood } from "@/lib/rixRig";

type Level = "happy" | "annoyed" | "tantrum";

/** What the instance says about a press right now. */
export type PressVerdict = "count" | "ignore" | "hmph";

export type MoodActs = {
  /** A happy poke with its `pokeLines` line (announced by the act); `count` is the press count. */
  readonly happy: (line: string, count: number) => void;
  /** An annoyed poke with its `annoyedLines` line. */
  readonly annoyed: (line: string) => void;
  /** The tantrum with its `angryLines` line; the chain ends by calling `end`. */
  readonly tantrum: (line: string) => void;
  /** A press during the sulk. */
  readonly hmph: () => void;
  /** The window closed on an annoyed mood: it eases back to neutral. */
  readonly calmDown: () => void;
};

/** Where the mood lives: the full Rix, or the faded instance's own record. */
export type MoodHolder = { mood: RixMood };

export type MoodLadder = {
  /** A press on Rix (`click`); `keydown` marks held keys' repeats. */
  readonly press: (fine: boolean) => void;
  readonly keydown: (event: KeyboardEvent) => void;
  /** A trusted pick, the forgive's end or the calm's end: the count and mood reset. */
  readonly reset: () => void;
  readonly stop: () => void;
};

const nth = (lines: readonly string[], i: number) => lines[i % lines.length] ?? "";

export function moodLadder(
  crew: Crew,
  holder: MoodHolder,
  verdict: () => PressVerdict,
  acts: MoodActs,
  onPress?: (fine: boolean) => void,
): MoodLadder {
  let count = 0;
  let lastCounted = -Infinity;
  let lastAct = -Infinity;
  let firstAnnoyed: number | null = null;
  let slot: Level | null = null;
  let queue: gsap.core.Tween | null = null;
  let windowTimer: gsap.core.Tween | null = null;
  let tantrumTimer: gsap.core.Tween | null = null;
  let repeat = false;
  const said = { happy: 0, annoyed: 0, angry: 0 };

  const kill = () => {
    queue?.kill();
    windowTimer?.kill();
    tantrumTimer?.kill();
    queue = null;
    windowTimer = null;
    tantrumTimer = null;
    slot = null;
  };

  const levelOf = (n: number): Level =>
    n >= POKE_LADDER.tantrum ? "tantrum" : n >= POKE_LADDER.annoyed ? "annoyed" : "happy";

  const startTantrum = () => {
    kill();
    holder.mood = "tantrum";
    acts.tantrum(nth(about.rix.angryLines, said.angry++));
  };

  /** The tantrum's own gate: `ANNOYED_MIN` after this count's first annoyed act. */
  const tantrumWhenReady = () => {
    if (firstAnnoyed === null || tantrumTimer) return;
    const wait = firstAnnoyed + ANNOYED_MIN - crew.now();
    if (wait <= 0) startTantrum();
    else tantrumTimer = crew.after(wait, startTantrum);
  };

  const fire = (level: Level) => {
    const now = crew.now();
    if (level === "happy") {
      lastAct = now;
      acts.happy(nth(about.rix.pokeLines, said.happy++), count);
      return;
    }
    if (level === "annoyed" || firstAnnoyed === null) {
      lastAct = now;
      firstAnnoyed ??= now;
      holder.mood = "annoyed";
      acts.annoyed(nth(about.rix.annoyedLines, said.annoyed++));
      if (level === "tantrum" || count >= POKE_LADDER.tantrum) tantrumWhenReady();
      return;
    }
    tantrumWhenReady();
  };

  const flush = () => {
    queue = null;
    const level = slot;
    slot = null;
    if (level) fire(level);
  };

  const closeWindow = () => {
    windowTimer = null;
    count = 0;
    firstAnnoyed = null;
    if (holder.mood === "annoyed") {
      holder.mood = "neutral";
      acts.calmDown();
    }
  };

  return {
    press: (fine) => {
      if (repeat) {
        repeat = false;
        return;
      }
      const answer = verdict();
      if (answer === "ignore") return;
      if (answer === "hmph") {
        acts.hmph();
        return;
      }
      const now = crew.now();
      if (now - lastCounted < POKE_REPEAT) return;
      count += 1;
      lastCounted = now;
      onPress?.(fine);
      windowTimer?.kill();
      windowTimer = crew.after(POKE_WINDOW, closeWindow);
      const level = levelOf(count);
      if (level === "tantrum" && firstAnnoyed !== null) {
        tantrumWhenReady();
        return;
      }
      const wait = lastAct + POKE_COOLDOWN - now;
      if (wait <= 0 && !queue) {
        fire(level);
        return;
      }
      slot = level;
      queue ??= crew.after(Math.max(0, wait), flush);
    },
    keydown: (event) => {
      // A held Enter repeats the click; a repeat never counts.
      repeat = event.repeat && event.key === "Enter";
    },
    reset: () => {
      kill();
      count = 0;
      firstAnnoyed = null;
      lastCounted = -Infinity;
      holder.mood = "neutral";
    },
    stop: kill,
  };
}
