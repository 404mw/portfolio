// The hero's load motion (ui-spec §2.5, Motion). Full motion: the portrait fades in, the two name
// lines rise from below inside their clips (staggered), then the side line and the bottom row fade
// up, and the side line's dot blinks while the hero is in view. Reduced motion: the same elements
// get short opacity fades only, and the dot stays fully lit. Every starting state is set here, in
// JS, so without JS (or before it runs) the static hero shows as built. Never touches the stage or
// the h1 (§2.1.1).
import type { RefObject } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { animTargets, duration, ease, motionQuery, stagger } from "@/lib/motion";

/**
 * Extra drop below the clip, as a share of the line's height: with `leading-[0.82]` the glyph tops
 * paint above the line box, so a line pushed just past the wrapper would still show them.
 */
const LINE_CLEARANCE = 0.3;

/**
 * How far down a name line starts: past the whole clip wrapper (its line box plus the `pb-[0.12em]`
 * below it) and the clearance, so no slice of a letter shows at the start of the rise. Measured
 * once, when the entrance starts.
 */
function lineStartY(line: HTMLElement): number {
  const clip = line.parentElement;
  const below = clip ? clip.clientHeight - line.offsetTop : line.offsetHeight;
  return below + line.offsetHeight * LINE_CLEARANCE;
}
/** How far below its place the side line and bottom row start, in px. */
const FADE_UP_PX = 14;
/** The dot's dimmest point in its blink. */
const DOT_DIM = 0.25;
/** The side line and bottom row start this many seconds before the name lines finish. */
const FADE_OVERLAP = 0.5;

export function useHeroEntrance(section: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = section.current;
      if (!root) return;
      const portrait = animTargets(root, "hero-portrait");
      const lines = animTargets(root, "hero-line");
      const fades = animTargets(root, "hero-fade");
      const dot = animTargets(root, "hero-dot");

      const mm = gsap.matchMedia();

      mm.add(motionQuery.full, () => {
        gsap
          .timeline({ defaults: { ease: ease.out } })
          .from(portrait, { opacity: 0, duration: duration.enter }, 0)
          .from(
            lines,
            {
              y: (_index: number, line: HTMLElement) => lineStartY(line),
              duration: duration.rise,
              ease: ease.rise,
              stagger: stagger.line,
            },
            0.1,
          )
          .from(
            fades,
            { y: FADE_UP_PX, opacity: 0, duration: duration.enter, stagger: stagger.row },
            `-=${FADE_OVERLAP}`,
          );

        // The blink runs only while the hero is on screen.
        gsap.fromTo(
          dot,
          { opacity: 1 },
          {
            opacity: DOT_DIM,
            duration: duration.blink,
            ease: ease.blink,
            repeat: -1,
            yoyo: true,
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "bottom top",
              toggleActions: "play pause resume pause",
            },
          },
        );
      });

      mm.add(motionQuery.reduced, () => {
        gsap
          .timeline({ defaults: { duration: duration.fade, ease: ease.out } })
          .from(portrait, { opacity: 0 }, 0)
          .from(lines, { opacity: 0, stagger: stagger.line }, 0.1)
          .from(fades, { opacity: 0 }, ">-0.2");
      });

      return () => mm.revert();
    },
    { scope: section },
  );
}
