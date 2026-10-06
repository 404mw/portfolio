// The poke ladder's tantrum under reduced motion (ui-spec/00-rix.md R8.1), character sheet: fades
// only. The `angryLines` line fades in (announced, unless a pick is thrown away); if he holds a
// picked prop, the prop and its ack fade out (inline, `duration.fade`) and at 0.4 the caller's
// release runs (the deselect and `throwAway`), so the pick's state matches full motion. No stomp,
// shake, flee, slant, turn or hmph. The sulk window runs `TANTRUM.fleeAt` + `SULK.hold` from the
// start: presses in it do nothing (the caller's verdict), `sulkLine` fades in after the angry line
// has gone, and `forgiveLine` at the end, when `done` resets the ladder. On home's About the picks
// lock for the whole window (R6A.9): `lock` at the start, `unlock` at its end. Timers run in the crew.
import { about } from "@/content/home";
import { gsap } from "@/lib/gsap";
import { duration, ease } from "@/lib/motion";
import { stripMotion } from "@/lib/processBotRig";
import { REDUCED_SULK } from "@/lib/rixMotion";

export type FadeTantrumOptions = {
  readonly crew: { readonly run: <T extends gsap.core.Animation>(animation: T) => T };
  readonly say: (text: string) => void;
  readonly announce: (text: string) => void;
  /** The held prop and its ack, if he holds one. */
  readonly thrown: { readonly prop: Element; readonly ack: Element | null } | null;
  /** The deselect and `throwAway` (R6A.4 steps 1–5). */
  readonly release: () => void;
  /** Home's About: the picks lock at the start and unlock at the window's end (R6A.9). */
  readonly lock?: () => void;
  readonly unlock?: () => void;
  readonly done: () => void;
};

/** Plays the faded tantrum with `line`; returns its cancel. */
export function fadeTantrum(
  line: string,
  { crew, say, announce, thrown, release, lock, unlock, done }: FadeTantrumOptions,
): () => void {
  const tl = gsap.timeline();
  lock?.();
  say(line);
  if (thrown) {
    const parts = thrown.ack ? [thrown.prop, thrown.ack] : [thrown.prop];
    tl.to(parts, { opacity: 0, duration: duration.fade, ease: ease.out }, 0).call(
      () => {
        release();
        stripMotion(parts);
      },
      [],
      duration.fade,
    );
  } else {
    announce(line);
  }
  tl.call(() => say(about.rix.sulkLine), [], REDUCED_SULK.lineAt).call(
    () => {
      say(about.rix.forgiveLine);
      done();
      unlock?.();
    },
    [],
    REDUCED_SULK.end,
  );
  crew.run(tl);
  return () => tl.kill();
}
