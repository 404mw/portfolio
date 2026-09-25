// Every image on the site: looks the name up in lib/images.ts and fills its positioned parent,
// cropped with `object-cover` by default (pass `fit="contain"` to letterbox instead). Renders a
// placeholder while the file is `null`.
import Image from "next/image";
import { ImagePlaceholder, type PlaceholderTone } from "@/components/ImagePlaceholder";
import { imageSrc, type ImageName } from "@/lib/images";

const positionClasses = {
  top: "object-top",
  center: "object-center",
  bottom: "object-bottom",
} as const;

const fitClasses = {
  cover: "object-cover",
  contain: "object-contain",
} as const;

type SiteImageProps = {
  readonly name: ImageName;
  readonly alt: string;
  readonly sizes: string;
  readonly position?: keyof typeof positionClasses;
  readonly fit?: keyof typeof fitClasses;
  readonly priority?: boolean;
  readonly placeholderTone?: PlaceholderTone;
};

export function SiteImage({
  name,
  alt,
  sizes,
  position = "center",
  fit = "cover",
  priority = false,
  placeholderTone = "dark",
}: SiteImageProps) {
  const src = imageSrc(name);
  if (src === null) return <ImagePlaceholder name={name} tone={placeholderTone} />;

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`${fitClasses[fit]} ${positionClasses[position]}`}
    />
  );
}
