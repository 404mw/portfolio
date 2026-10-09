// Section 2, Hero: who is this? (ui-spec §2). The backdrop paints behind everything; the
// content layer holds three rows (side line, stage, actions). The layer and its grid carry no
// z-index, transform or opacity, so the name lines and the portrait share the section's one
// `isolate` stacking context (§2.1.1). From `lg` the grid is `relative` (position only), so
// the portrait frame is placed against the full-height site column. `#top` is also what the
// Nav observes to turn solid once the hero has passed. `HeroMotion` (client) renders nothing; it
// adds the GSAP motion to this section's `data-anim` hooks.
// The bottom edge is slanted 3°, low on the left: the content box keeps its height,
// clamp(40rem, 100svh, 75rem) (`box-content`, so the three height classes size the content, not
// the padding), and a bottom padding of `--slant-drop` (lib/styles.ts) is added under it. The
// clip-path then cuts the bottom-right triangle away, so the right side ends where the content
// box does and the left side is taller by the drop. The backdrop fills the added strip; the
// marquee strip (section 3) sits in the cut.
import { HeroActions } from "@/components/home/hero/HeroActions";
import { HeroBackdrop } from "@/components/home/hero/HeroBackdrop";
import { HeroMotion } from "@/components/home/hero/HeroMotion";
import { HeroSideLine } from "@/components/home/hero/HeroSideLine";
import { HeroStage } from "@/components/home/hero/HeroStage";
import { sectionIds } from "@/lib/routes";
import { container, slantDrop } from "@/lib/styles";

export function HeroSection() {
  return (
    <section
      id={sectionIds.top}
      className={`${slantDrop} relative isolate box-content h-svh max-h-300 min-h-160 overflow-hidden pb-(--slant-drop) [clip-path:polygon(0_0,100%_0,100%_calc(100%-var(--slant-drop)),0_100%)]`}
    >
      <HeroBackdrop />
      <div className="relative h-full px-gutter">
        <div
          className={`${container} grid h-full grid-rows-[auto_minmax(0,1fr)_auto] gap-4 pt-24 pb-8 md:pt-28 md:pb-10 lg:relative`}
        >
          <HeroSideLine />
          <HeroStage />
          <HeroActions />
        </div>
      </div>
      <HeroMotion />
    </section>
  );
}
