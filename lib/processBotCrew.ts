// The process bots' one motion registry (ui-spec §5.7 layer 11): a single paused-until-live GSAP
// timeline that every bot tween, timeline and delayed call is added to at its current time. Pausing
// it pauses everything at once (life, acts, naps, relay and every random scheduler), so nothing
// fires or piles up while the section is off screen or the tab is hidden, and resuming carries on
// where it stopped. Finished children are dropped automatically; a never-ending empty tween keeps
// the timeline from completing while it waits for work.
import { gsap } from "@/lib/gsap";

export type Crew = {
  /** Adds `animation` to the registry, starting now (plus its own delay). */
  readonly run: <T extends gsap.core.Animation>(animation: T) => T;
  /** Calls `callback` after `seconds` of live time. */
  readonly after: (seconds: number, callback: () => void) => gsap.core.Tween;
  /** Plays or pauses the whole registry. */
  readonly setLive: (live: boolean) => void;
  readonly isLive: () => boolean;
  /** Stops and drops everything in the registry. */
  readonly kill: () => void;
};

export function createCrew(): Crew {
  const timeline = gsap.timeline({ paused: true, autoRemoveChildren: true, smoothChildTiming: true });
  timeline.to({}, { duration: 1, repeat: -1 });
  let live = false;

  const run = <T extends gsap.core.Animation>(animation: T): T => {
    timeline.add(animation, timeline.time());
    return animation;
  };

  return {
    run,
    after: (seconds, callback) => run(gsap.delayedCall(seconds, callback)),
    setLive: (next) => {
      live = next;
      timeline.paused(!next);
    },
    isLive: () => live,
    kill: () => {
      live = false;
      timeline.getChildren(true, true, true).forEach((child) => child.kill());
      timeline.clear();
      timeline.kill();
    },
  };
}
