// Build-time stand-in for an image whose file isn't supplied yet: a dashed box with the image's
// name. It must never ship (a `null` file in lib/images.ts fails the ship check).
const toneClasses = {
  dark: "bg-band border-line text-muted",
  cream: "bg-ink/5 border-ink/20 text-cream-muted",
} as const;

export type PlaceholderTone = keyof typeof toneClasses;

type ImagePlaceholderProps = {
  readonly name: string;
  readonly tone?: PlaceholderTone;
};

export function ImagePlaceholder({ name, tone = "dark" }: ImagePlaceholderProps) {
  return (
    <div
      className={`grid size-full place-items-center border border-dashed font-mono text-meta ${toneClasses[tone]}`}
    >
      {name}
    </div>
  );
}
