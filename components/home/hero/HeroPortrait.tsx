// The hero portrait (ui-spec §2.1.2, §2.1.3), three boxes: the frame places it, the positioner
// sizes it, and the inner `hero-portrait` box is what the motion pass animates.
// - Below `lg`: the frame takes the rest of row 2 under the name. The positioner is a square
//   (the photo is near-square), 220% of the frame's height, centred on WAQAS and starting 19%
//   above the frame, so the hair meets the frame's top and the beard ends well above its bottom.
// - From `lg`: the frame is a square of side S = 1.1·min(column height, 66vw), sitting on the
//   column's bottom (growing upward; the section clips anything above), placed by the name, not the column's left: its right edge sits
//   0.68S − 0.25em in from the column's right edge (`em` is the name's, from the stage). The
//   offset grows with S because on tall sections the M sits lower on the figure, where the
//   chest is wider; fitted so only the M's lower left tucks behind the right shoulder, from
//   1024 to 4K. `right` spells out the section height H, clamp(40rem, 100svh, 75rem), because
//   a percentage there would measure the width. The photo may run past the column's left edge
//   (at 1024 and on wide screens); the section's `overflow-hidden` clips it at the section's
//   edge. The positioner fills the frame exactly. No nav clearance is taken off S: the photo has
//   ~8.6% transparent headroom above the hair, so the hair still clears the ~67px nav.
// The portrait is shown with `object-contain object-bottom`, so the image always fits without
// side cropping. The mask fades only its bottom edge; the sides are not faded.
// `sizes` follows the rendered width (the section height from `lg`), with the section's
// 40rem-height floor and 75rem cap.
// `data-network-avoid="agents"` keeps the network's agents off the frame. From `lg` that is
// exactly the photo; below `lg` the positioner overhangs the frame, so the keep-out covers only
// the part of the photo inside it (known NIT).
import { SiteImage } from "@/components/SiteImage";
import { hero } from "@/content/home";

export function HeroPortrait() {
  return (
    <div
      data-network-avoid="agents"
      className="relative z-10 mt-[-0.45em] min-h-0 flex-1 lg:absolute lg:right-[calc(0.748*min(clamp(40rem,100svh,75rem),66vw)-0.25em)] lg:bottom-0 lg:mt-0 lg:aspect-square lg:h-[min(110%,72.6vw)] lg:w-auto lg:flex-none"
    >
      <div className="absolute top-[-19%] left-[1.365em] aspect-square h-[220%] -translate-x-1/2 lg:inset-0 lg:aspect-auto lg:h-full lg:w-full lg:translate-x-0">
        <div data-anim="hero-portrait" className="relative size-full mask-b-from-75%">
          <SiteImage
            name="portrait"
            alt={hero.portraitAlt}
            sizes="(min-width: 64rem) min(max(704px, min(110vh, 1320px)), 72.6vw), (min-width: 48rem) min(1617px, max(387px, calc(220vh - 1023px))), max(375px, calc(220vh - 1035px))"
            position="bottom"
            fit="contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}
