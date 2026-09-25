// The hero's back layer (ui-spec §2.1.2): the light pool behind the head, the drawn network,
// the vignette and the grain. Decorative only.
// `text-hero` is set here so `em` matches the name, which the pool's position is measured in.
// - Below `lg`, the pool follows the head under WAQAS.
// - From `lg`, it's centred on the head of the portrait frame: a square of side
//   S = min(section height, 66vw) sitting on the section's bottom, its left edge at
//   CR + 0.25em − 1.68S (CR = the column's right edge), and the head's centre about 47% across
//   and 30% down it, so x = CR + 0.25em − 1.21S and y = H − 0.7S. The section's height H is
//   clamp(40rem, 100svh, 75rem) (its `h-svh min-h-160 max-h-300`), written out in `left`
//   because a horizontal percentage there would measure the width.
import { HeroGrain } from "@/components/home/hero/HeroGrain";
import { HeroNetwork } from "@/components/home/hero/HeroNetwork";

export function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 text-hero">
      <div className="absolute top-[calc(39%+2rem+0.87em)] left-[calc(var(--spacing-gutter)+1.365em)] size-[5em] -translate-1/2 rounded-full bg-radial from-accent/15 to-transparent to-70% md:top-[calc(39%+5rem+0.87em)] lg:top-[calc(100%-0.7*min(100%,66vw))] lg:left-[calc(100%-max(var(--spacing-gutter),(100%-var(--container-site))/2)+0.25em-1.21*min(clamp(40rem,100svh,75rem),66vw))]" />
      <HeroNetwork />
      <div className="absolute inset-0 bg-radial-[ellipse_at_center] from-transparent from-45% to-bg" />
      <HeroGrain />
    </div>
  );
}
