// The visitor's idle and return clock (ui-spec/00-rix.md R6.3), for Rix's nap, option B: visitor
// idle counts live time only (the crew's: it stands still off screen and in a hidden tab). Any
// pointer move or press, key, wheel, scroll or focus is the visitor; after `NAP_AFTER` of none,
// `idle` is called (each second, until the caller naps or activity resumes). Every activity calls
// `back`, so a napping Rix wakes; the caller also wakes him when the instance goes live again.
import type { gsap } from "@/lib/gsap";
import { NAP_AFTER } from "@/lib/rixMotion";

/** How often (live seconds) the idle time is checked. */
const CHECK = 1;
const events = ["pointermove", "pointerdown", "keydown", "wheel", "scroll", "focusin"] as const;

type VisitorOptions = {
  readonly crew: { readonly after: (seconds: number, callback: () => void) => gsap.core.Tween; readonly now: () => number };
  readonly idle: () => void;
  readonly back: () => void;
};

export function visitorClock({ crew, idle, back }: VisitorOptions): () => void {
  let lastSeen = crew.now();
  let timer: gsap.core.Tween | null = null;

  const check = () => {
    if (crew.now() - lastSeen >= NAP_AFTER) idle();
    timer = crew.after(CHECK, check);
  };
  const seen = () => {
    lastSeen = crew.now();
    back();
  };
  events.forEach((name) => window.addEventListener(name, seen, { passive: true, capture: true }));
  timer = crew.after(CHECK, check);

  return () => {
    timer?.kill();
    events.forEach((name) => window.removeEventListener(name, seen, { capture: true }));
  };
}
