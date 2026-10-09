// The footer wordmark's reveal, "wipe in place" (docs/pages/home/sections/09-footer.md, which
// supersedes the max-width opening in ui-spec §9.3), once, when 35% of the footer is in view.
// Every letter holds its final layout position the whole time: only transform, opacity and
// clip-path move, never width, margin or spacing, so no letter's x position ever changes.
// - The accent letters (`data-anim="mark-accent"`, M and W) fade and rise in place from
//   `translateY(18%) scale(.9)`, scaled from their own centre.
// - While they settle, the dim letters (`data-anim="mark-rest"`, A R I X) wipe in left to right,
//   each through a clip that opens from its left edge on a long, soft ease-out, and fade in with
//   it. The sequence eases out too: A and R start almost together, I and X noticeably later.
// Reduced motion: no rise, scale or wipe; all six letters fade in together on the same trigger.
//
// The starting state is set here, in JS, inside the matchMedia branch, so without JS (or before
// this runs) the full word shows, still. Every tween is created at setup, so the branch reverts
// them all; inline styles are cleared once each has played. The footer's inner wrapper clips its
// content (`overflow-hidden`) and nothing changes size, so nothing scrolls sideways at any point.
import { gsap, useGSAP } from "@/lib/gsap";
import { animTargets, duration, ease, motionQuery } from "@/lib/motion";

/** How far the accents rise from, as a share of their own height, and their starting scale. */
const RISE_PERCENT = 18;
const START_SCALE = 0.9;
/** Accent rise length (s). */
const RISE_SECONDS = 0.9;
/**
 * A dim letter's clip, hidden and shown. The glyphs' ink spills a few percent past their boxes
 * (sideways at the edges, and the tight leading), so the clip reaches 50% past the top and bottom
 * and 10% past each side: fully open it cuts nothing, so clearing it at the end changes nothing.
 * Hidden, its right edge sits on its left edge (-10%), a zero-width sliver.
 */
const CLIP_HIDDEN = "inset(-50% 110% -50% -10%)";
const CLIP_SHOWN = "inset(-50% -10% -50% -10%)";
/**
 * When the first dim letter starts its wipe (s): part way through the accents' rise, when their
 * ease-out has them nearly settled, so the rise hands straight into the wipe with no pause.
 */
const WIPE_AT = 0.35;
/**
 * How long each dim letter's wipe takes (s), and its ease: a long, soft landing. The clip's 10%
 * side padding means the ink is fully shown at about 92% of the clip's travel, so only that part
 * is seen. On power4.out over 1.3s it takes about 0.6s and the edge ends at about 15% of its
 * starting speed, a clearly felt slow-down. (expo.out would show all the ink in about 0.43s and
 * spend the rest of its time on the invisible padding, so its tail would never be seen.)
 */
const WIPE_SECONDS = 1.3;
const WIPE_EASE = "power4.out";
/**
 * How long each dim letter's fade takes (s); it starts with its wipe and runs on `ease.out`.
 * Stretched to match the wipe: the letter is at about 90% opacity when its ink is fully
 * shown, so it doesn't read as fully there before the wipe finishes.
 */
const FADE_SECONDS = 0.9;
/**
 * When each dim letter (A R I X) starts, in seconds after the first. The gaps grow (0.05, 0.15,
 * 0.25; a power2.in curve over 0.45s), so the sequence itself eases out. The wipe and the fade
 * both use `letterStart`, so each letter's wipe and fade stay paired. A letter past the list
 * starts with the last one.
 * Don't use a stagger object with `ease` here: in GSAP 3.15 it also changes each tween's own ease.
 */
const LETTER_STARTS = [0, 0.05, 0.2, 0.45];
const letterStart = (index: number) => LETTER_STARTS[index] ?? LETTER_STARTS.at(-1) ?? 0;
/** The share of the footer in view that starts it: its 35% line reaching the viewport's bottom. */
const START = "35% bottom";

export function useWordmarkReveal() {
  useGSAP(() => {
    const accents = animTargets(document, "mark-accent");
    const rest = animTargets(document, "mark-rest");
    const footer = accents[0]?.closest("footer");
    if (!footer) return;
    const letters = [...accents, ...rest];

    const mm = gsap.matchMedia();

    mm.add({ full: motionQuery.full, reduced: motionQuery.reduced }, (context) => {
      const trigger = { trigger: footer, start: START, once: true };

      if (context.conditions?.reduced) {
        gsap.set(letters, { opacity: 0 });
        gsap.to(letters, {
          opacity: 1,
          duration: duration.fade,
          ease: ease.out,
          clearProps: "opacity",
          scrollTrigger: trigger,
        });
        return;
      }

      gsap.set(accents, { opacity: 0, yPercent: RISE_PERCENT, scale: START_SCALE });
      gsap.set(rest, { opacity: 0, clipPath: CLIP_HIDDEN });

      gsap
        .timeline({ scrollTrigger: trigger })
        .to(
          accents,
          {
            opacity: 1,
            yPercent: 0,
            scale: 1,
            duration: RISE_SECONDS,
            ease: ease.follow,
            clearProps: "transform,opacity",
          },
          0,
        )
        .to(
          rest,
          {
            clipPath: CLIP_SHOWN,
            duration: WIPE_SECONDS,
            ease: WIPE_EASE,
            stagger: letterStart,
            clearProps: "clipPath",
          },
          WIPE_AT,
        )
        .to(
          rest,
          {
            opacity: 1,
            duration: FADE_SECONDS,
            ease: ease.out,
            stagger: letterStart,
            clearProps: "opacity",
          },
          WIPE_AT,
        );
    });

    return () => mm.revert();
  });
}
