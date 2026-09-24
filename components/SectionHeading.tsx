// A section's big heading: the lead words, then the accent words in violet.
import { condensed } from "@/lib/styles";

const sizeClasses = {
  "heading-sm": "text-heading-sm leading-[0.95] tracking-[-0.04em]",
  heading: "text-heading leading-[0.95] tracking-[-0.04em]",
  "heading-xl": "text-heading-xl leading-[0.9] tracking-[-0.045em]",
} as const;

type SectionHeadingProps = {
  readonly lead: string;
  readonly accent: string;
  readonly size: keyof typeof sizeClasses;
  readonly id?: string;
};

export function SectionHeading({ lead, accent, size, id }: SectionHeadingProps) {
  return (
    <h2
      id={id}
      className={`font-display font-semibold text-balance text-text ${condensed} ${sizeClasses[size]}`}
    >
      {lead} <span className="text-accent">{accent}</span>
    </h2>
  );
}
