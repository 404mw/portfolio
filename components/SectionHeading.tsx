// A section's big heading: the lead words, then the accent words in violet. An `h2` by default;
// a page's own title passes `as="h1"` (the /rix intro). `anim` passes a motion hook through as
// `data-anim` (the /rix reveal); without it the markup is unchanged.
import { condensed } from "@/lib/styles";

const sizeClasses = {
  "heading-sm": "text-heading-sm leading-[0.95] tracking-[-0.025em]",
  heading: "text-heading leading-[0.95] tracking-[-0.025em]",
  "heading-xl": "text-heading-xl leading-[0.9] tracking-[-0.03em]",
} as const;

type SectionHeadingProps = {
  readonly lead: string;
  readonly accent: string;
  readonly size: keyof typeof sizeClasses;
  readonly id?: string;
  /** The heading level: `h2` (a section) or `h1` (a page's title). */
  readonly as?: "h1" | "h2";
  /** A `data-anim` motion hook on the heading itself (e.g. `reveal`). */
  readonly anim?: string;
};

export function SectionHeading({ lead, accent, size, id, as: Tag = "h2", anim }: SectionHeadingProps) {
  return (
    <Tag
      id={id}
      data-anim={anim}
      className={`font-display font-semibold text-balance text-text ${condensed} ${sizeClasses[size]}`}
    >
      {lead} <span className="text-accent">{accent}</span>
    </Tag>
  );
}
