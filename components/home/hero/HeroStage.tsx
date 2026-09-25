// The hero's middle row (ui-spec §2.1.2, row 2): the name, then the portrait, as siblings so
// both share the section's one stacking context. Below `lg` it's a column (name above photo);
// from `lg` it's exactly the h1's box and static, so the portrait leaves the flow and is placed
// against the site column instead. `text-hero` sets the `em` the portrait's phone and tablet
// geometry is measured in, and the frame's `lg` `right` offset too. Never give this box a
// z-index, transform, opacity, filter or will-change (§2.1.1).
import { HeroName } from "@/components/home/hero/HeroName";
import { HeroPortrait } from "@/components/home/hero/HeroPortrait";

export function HeroStage() {
  return (
    <div className="relative flex min-h-0 flex-col text-hero lg:static lg:self-end">
      <HeroName />
      <HeroPortrait />
    </div>
  );
}
