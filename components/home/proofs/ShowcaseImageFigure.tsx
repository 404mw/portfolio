// The showcase diagram's `image` figure (ui-spec/07-proofs-spam.md): Exile Bot's mascot holding the
// step's symbol, in a bottom-anchored square box so the file's waist cut lands on the band's floor.
// 148 flush right on a phone; 144 / 192 / 248 at `md` / `lg` / `xl`, 8 / 16 / 32 in from the column.
// Decorative: the step's heading and line say what it shows.
import { SiteImage } from "@/components/SiteImage";
import type { ImageName } from "@/lib/images";

type ShowcaseImageFigureProps = {
  readonly image: ImageName;
};

export function ShowcaseImageFigure({ image }: ShowcaseImageFigureProps) {
  return (
    <span
      data-anim="showcase-figure"
      className="absolute right-0 bottom-0 block size-37 origin-bottom md:right-auto md:left-2 md:size-36 lg:left-4 lg:size-48 xl:left-8 xl:size-62"
    >
      <SiteImage
        name={image}
        alt=""
        sizes="(min-width: 1280px) 248px, (min-width: 1024px) 192px, (min-width: 768px) 144px, 148px"
        fit="contain"
        position="bottom"
      />
    </span>
  );
}
