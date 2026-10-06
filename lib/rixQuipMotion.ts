// Rix's quip motion (ui-spec 02a-about-options §2a.O4 `HOLD` / `OUT`; 00-rix.md R5, R8.1). The
// words are React's: a line reaches the quip through the quip store (lib/rixQuip.ts), from `say`.
// This shows the `about-quip` line, holds it and takes it out; a new line cuts the old one. Two
// styles:
// - `type` (full motion, the default): the box shows and the line types out with body talk
//   (lib/rixTalk.ts); the side is set as the line starts.
// - `fade` (reduced motion): the short fade in and out.
// Once a line has gone it's cleared from the store, so the quip is empty again, exactly as
// server-rendered. Runs in the crew, so it pauses with the instance. Scheduled lines (hover lines,
// chatter; R5.4) never cut a line: their callers ask `free`, `showing`, `typing` and `lastEnd` first.
import { gsap } from "@/lib/gsap";
import { duration, ease } from "@/lib/motion";
import type { Crew } from "@/lib/processBotCrew";
import { stripMotion } from "@/lib/processBotRig";
import { rixQuipLine, sayRix, subscribeRixQuip } from "@/lib/rixQuip";
import { IDLE_TALK, QUIP_HOLD } from "@/lib/rixMotion";
import type { SayOptions } from "@/lib/rixRig";

export type QuipMotion = {
  /** Shows a line (never announced: announcing is lib/rixStatus.ts). */
  readonly say: (text: string, options?: SayOptions) => void;
  /** Fades the current line out over `seconds`. */
  readonly out: (seconds: number) => void;
  /** A line is in, holding or going out. */
  readonly showing: () => boolean;
  /** A typed line hasn't shown its last character yet. */
  readonly typing: () => boolean;
  /** The line in the quip now; empty with none. */
  readonly line: () => string;
  /** The live time (the crew's) the last line went; null before any has. */
  readonly lastEnd: () => number | null;
  /** Empty, and `IDLE_TALK.minGap` since the last line went: a scheduled line may start (R5.4). */
  readonly free: () => boolean;
  readonly stop: () => void;
};

/** The character sheet's typed talk and side. */
export type QuipTalk = {
  /** Sets the quip's side for a line starting now. */
  readonly side: () => void;
  /**
   * The typed line's timeline, starting `at` seconds from now, ending with its fade out; its
   * `typed` label marks the last character.
   */
  readonly type: (line: string, at: number) => gsap.core.Timeline;
};

export function quipMotion(quip: HTMLElement, key: string, crew: Crew, reduced: boolean, talk?: QuipTalk): QuipMotion {
  let current: gsap.core.Animation | null = null;
  let pending: SayOptions | null = null;
  /** The current line's `typed` time in its timeline (typed lines only). */
  let typedAt: number | null = null;
  let endedAt: number | null = null;

  const clear = () => {
    current = null;
    typedAt = null;
    endedAt = crew.now();
    sayRix(key, "");
    stripMotion([quip]);
  };

  const fade = (at: number) =>
    gsap
      .timeline({ delay: at })
      .fromTo(quip, { opacity: 0 }, { opacity: 1, duration: duration.fade, ease: ease.out })
      .to(quip, { opacity: 0, duration: duration.fade, ease: "power1.in" }, `+=${QUIP_HOLD}`);

  const show = () => {
    const line = rixQuipLine(key);
    if (line === "") return;
    const options = pending ?? {};
    pending = null;
    const at = options.at ?? 0;
    const style = reduced ? "fade" : (options.style ?? "type");
    current?.kill();
    talk?.side();
    let tl: gsap.core.Timeline;
    if (style === "type" && talk) {
      gsap.set(quip, { opacity: 0, y: 0 });
      tl = talk.type(line, at);
      typedAt = tl.labels.typed ?? null;
    } else {
      tl = fade(at);
      typedAt = null;
    }
    tl.eventCallback("onComplete", clear);
    current = crew.run(tl);
  };

  const unsubscribe = subscribeRixQuip(key, show);

  return {
    say: (text, options = {}) => {
      pending = { at: options.at ?? 0, style: options.style ?? "type" };
      sayRix(key, text);
      pending = null;
    },
    out: (seconds) => {
      if (!current) return;
      current.kill();
      typedAt = null;
      current = crew.run(gsap.to(quip, { opacity: 0, duration: seconds, ease: "power1.in", onComplete: clear }));
    },
    showing: () => current !== null,
    typing: () => current !== null && typedAt !== null && current.time() < typedAt,
    line: () => (current ? rixQuipLine(key) : ""),
    lastEnd: () => endedAt,
    free: () => current === null && (endedAt === null || crew.now() - endedAt >= IDLE_TALK.minGap),
    stop: () => {
      unsubscribe();
      current?.kill();
      current = null;
      if (rixQuipLine(key) !== "") sayRix(key, "");
      stripMotion([quip]);
    },
  };
}
