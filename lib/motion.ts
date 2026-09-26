// Shared motion settings for the GSAP pass (constitution §5, ui-spec §10): the media queries every
// section's `gsap.matchMedia()` uses, the durations, eases and staggers sections reuse, and a
// helper that finds `data-anim` hooks inside a section. Section-specific numbers stay with the
// section's hook.

/** Full motion, or fades only (constitution §5: reduced motion keeps fades, not movement). */
export const motionQuery = {
  full: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
} as const;

/** A mouse or trackpad: pointer-following motion runs only here. */
export const finePointerQuery = "(pointer: fine)";

/** Seconds. */
export const duration = {
  /** The short opacity fade that reduced motion keeps. */
  fade: 0.4,
  /** A fade-in or fade-up entrance. */
  enter: 0.8,
  /** A line rising into view from behind its clip. */
  rise: 1.1,
  /** How long a pointer-following element takes to catch up. */
  follow: 0.7,
  /** One half of a looping blink (dim, then back). */
  blink: 1.1,
} as const;

export const ease = {
  out: "power2.out",
  rise: "power4.out",
  follow: "power3.out",
  blink: "sine.inOut",
  /** Scroll-scrubbed motion maps scroll to progress one to one. */
  scrub: "none",
} as const;

/** Seconds between items in a staggered entrance. */
export const stagger = {
  line: 0.12,
  row: 0.08,
} as const;

/** A status dot's dimmest point in its blink loop. */
export const blinkDim = 0.25;

/**
 * The generic scroll reveal (ui-spec §10): from `y` px below with opacity 0, once, when the top of
 * the trigger reaches `start`. Under reduced motion it's the opacity fade only.
 */
export const reveal = {
  y: 56,
  start: "top 80%",
} as const;

/** Every `[data-anim="<name>"]` element inside `root`, in document order. */
export function animTargets<T extends Element = HTMLElement>(root: ParentNode, name: string): T[] {
  return Array.from(root.querySelectorAll<T>(`[data-anim="${name}"]`));
}
