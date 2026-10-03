// The /rix playground's stage (ui-spec/02-playground.md §2.1–§2.2): option B's shelf, the floor line
// only, with a big Rix at its right end (204 × 132 on phones, 272 × 176 from `md`, 340 × 220 from
// `lg`). The 80px headroom holds his quip, which sits above him, left-aligned to his box and never
// wider than it, at every width (no `data-[side]` classes, so the quip side has no effect).
import { AboutPosterShelf } from "@/components/home/about/poster/AboutPosterShelf";
import { rixIds } from "@/lib/rixPlayground";

const size = "w-51 h-33 md:w-68 md:h-44 lg:w-85 lg:h-55";
const quipText = "text-nav md:text-body-lg";
const quipPlacement =
  "bottom-full left-0 mb-4 w-max max-w-40 text-left md:mb-5 md:max-w-56 lg:mb-6 lg:max-w-72";

export function RixStage() {
  return (
    <AboutPosterShelf
      className="pt-20"
      quipKey={rixIds.playground}
      size={size}
      quipText={quipText}
      quipPlacement={quipPlacement}
    />
  );
}
