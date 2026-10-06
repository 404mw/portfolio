// Which scheduled line Rix says next (ui-spec/00-rix.md R4.9, R5.4), both motion modes, home's
// About. No DOM, no GSAP: the caller says when and how, this picks the words from
// content/home.ts `about.rix`. Chatter takes `idleLines` while nothing is picked (before any pick,
// and again after the toss) and `afterPickLines` once a card is. A hover line before a pick goes the
// card's own line, a generic one, the card's other line; a card line said within
// `HOVER.repeatAfter` is swapped for the next generic one. After a pick, another card gets a
// `switchLines` line and the picked card none. Every pool runs in turn and wraps round, carrying on
// across holds, and no line is said twice in a row. `LineMemo` holds the turns for the page load.
import { about } from "@/content/home";
import { HOVER, type HoverState } from "@/lib/rixMotion";

/** Per page load: where each pool has got to. */
export type LineMemo = {
  idle: number;
  afterPick: number;
  hoverAny: number;
  switch: number;
  /** Each card's own pool, by reply key. */
  readonly hover: Record<string, number>;
  /** The last scheduled line said. */
  last: string | null;
  /** When (live seconds) each card line was last said. */
  readonly saidAt: Record<string, number>;
};

export const newLineMemo = (): LineMemo => ({ idle: 0, afterPick: 0, hoverAny: 0, switch: 0, hover: {}, last: null, saidAt: {} });

const cardLines: Readonly<Record<string, readonly string[]>> = about.rix.hoverLines;

/** `pool`'s line at `turn` (the one after it if that was said last), and the turn after it. */
function inTurn(pool: readonly string[], turn: number, last: string | null): [line: string, next: number] {
  if (pool.length === 0) return ["", turn];
  let at = turn % pool.length;
  if (pool[at] === last && pool.length > 1) at = (at + 1) % pool.length;
  return [pool[at] ?? "", at + 1];
}

/** Takes the next line of one of the shared pools. */
function take(memo: LineMemo, pool: readonly string[], turn: "idle" | "afterPick" | "hoverAny" | "switch"): string {
  const [line, next] = inTurn(pool, memo[turn], memo.last);
  memo[turn] = next;
  memo.last = line;
  return line;
}

/** The next chatter line: `idleLines` while nothing is picked, `afterPickLines` once a card is. */
export function chatterLine(memo: LineMemo, picked: boolean): string {
  return picked ? take(memo, about.rix.afterPickLines, "afterPick") : take(memo, about.rix.idleLines, "idle");
}

/**
 * The next hover line for the card with reply key `key`, `said` lines into this hold, at live time
 * `now`; null once the hold has had its share (`HOVER.lines`).
 */
export function hoverLine(memo: LineMemo, key: string, state: HoverState, said: number, now: number): string | null {
  if (said >= HOVER.lines[state]) return null;
  if (state === "switch") return take(memo, about.rix.switchLines, "switch");
  // Before a pick: the card's line, a generic one, the card's other line.
  const own = cardLines[key] ?? [];
  if (said % 2 === 0 && own.length > 0) {
    const [line, next] = inTurn(own, memo.hover[key] ?? 0, memo.last);
    const at = memo.saidAt[line];
    // Live time starts over with each motion run: a time ahead of `now` is from an earlier one.
    if (at === undefined || at > now || now - at >= HOVER.repeatAfter) {
      memo.hover[key] = next;
      memo.saidAt[line] = now;
      memo.last = line;
      return line;
    }
  }
  return take(memo, about.rix.hoverAnyLines, "hoverAny");
}
