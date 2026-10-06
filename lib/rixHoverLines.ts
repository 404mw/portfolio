// When Rix says a hover line (ui-spec/00-rix.md R4.9, R5.4, R8.1), both motion modes, home's About.
// The timing only: the words are lib/rixLines.ts, the showing is the quip's (typed in full motion,
// faded under reduced motion), and nothing is ever announced. A hold starts when a card takes the
// hover or keyboard focus and ends when it leaves. The hold's first line waits until Rix is ready
// (full motion: he has stopped at the card; reduced motion: always) and the card has been held
// `HOVER.lineDwell`; the next comes `HOVER.lineGap` after the last one has gone; a hold gets at most
// `HOVER.lines` of them (three before a pick, one on another card after a pick, none on the picked
// card). A scheduled line never cuts one that's showing: it waits for the quip to be free. A line
// belongs to its card: when the target leaves, or hover mode is cut, a line that hasn't started is
// dropped and one that's showing fades out, so a fast scan across the board shows none. Timers run
// in the crew.
import { gsap } from "@/lib/gsap";
import type { Crew } from "@/lib/processBotCrew";
import { hoverLine, type LineMemo } from "@/lib/rixLines";
import { HOVER, TEMPO, type HoverState } from "@/lib/rixMotion";
import type { QuipMotion } from "@/lib/rixQuipMotion";

export type HoverLines = {
  /** The held card changed (null: released): the old card's line goes and a new hold starts. */
  readonly hold: (card: Element | null) => void;
  /** Rix has stopped at the held card (true), or hover mode was cut or let go (false). */
  readonly ready: (on: boolean) => void;
  readonly stop: () => void;
};

type HoverLineOptions = {
  readonly crew: Pick<Crew, "after" | "now">;
  readonly quip: Pick<QuipMotion, "say" | "out" | "free" | "line" | "lastEnd">;
  /** Where the line pools have got to, this page load. */
  readonly memo: LineMemo;
  /** A card is picked (any of them, "Not sure yet" included). */
  readonly picked: () => boolean;
  /** Seconds a showing line takes to fade when its card's target leaves. */
  readonly out: number;
  /** False while lines must wait (a mood). */
  readonly may?: () => boolean;
};

/** The card's pick state: it's the picked one, another card after a pick, or no pick yet. */
export function hoverState(card: Element, picked: boolean): HoverState {
  if (card.querySelector("input:checked")) return "picked";
  return picked ? "switch" : "before";
}

/** The card's reply key (its radio's value): its own line pool's key. */
const keyOf = (card: Element) => card.querySelector<HTMLInputElement>('input[type="radio"]')?.value ?? "";

export function hoverLines({ crew, quip, memo, picked, out, may = () => true }: HoverLineOptions): HoverLines {
  let card: Element | null = null;
  let on = false;
  /** When this hold started, and how many lines it has had. */
  let since = 0;
  let said = 0;
  /** The line of this hold in the quip, while it's still there. */
  let showing: string | null = null;
  /** The last line hasn't gone yet: `HOVER.lineGap` counts from when it does. */
  let gapDue = false;
  let nextAt = 0;
  let timer: gsap.core.Tween | null = null;

  const wait = (seconds: number) => {
    timer?.kill();
    timer = crew.after(Math.max(seconds, 0.05), check);
  };
  /** A line that hasn't started is dropped; one that's showing fades out. */
  const drop = () => {
    timer?.kill();
    timer = null;
    if (showing !== null && quip.line() === showing) quip.out(out);
    showing = null;
  };

  function check() {
    timer = null;
    if (!card || !on) return;
    const state = hoverState(card, picked());
    if (said >= HOVER.lines[state]) return;
    const now = crew.now();
    const dwell = since + HOVER.lineDwell - now;
    if (dwell > 0) {
      wait(dwell);
      return;
    }
    if (!may() || !quip.free()) {
      wait(TEMPO.retry);
      return;
    }
    if (gapDue) {
      gapDue = false;
      nextAt = (quip.lastEnd() ?? now) + gsap.utils.random(HOVER.lineGap[0], HOVER.lineGap[1]);
    }
    if (now < nextAt) {
      wait(nextAt - now);
      return;
    }
    const line = hoverLine(memo, keyOf(card), state, said, now);
    if (!line) return;
    said += 1;
    showing = line;
    gapDue = true;
    quip.say(line);
    wait(TEMPO.retry);
  }

  return {
    hold: (next) => {
      if (next === card) return;
      drop();
      card = next;
      since = crew.now();
      said = 0;
      gapDue = false;
      nextAt = 0;
      if (card && on) check();
    },
    ready: (next) => {
      if (next === on) return;
      on = next;
      if (on) check();
      else drop();
    },
    stop: () => {
      timer?.kill();
      timer = null;
    },
  };
}
