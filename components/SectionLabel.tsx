// A section label: number, a 24px hairline, then the label, in the mono label style.
// `as="h2"` where the label is the section's heading (Agents); `p` elsewhere.
import { monoLabel } from "@/lib/styles";

type SectionLabelProps = {
  readonly number: string;
  readonly label: string;
  readonly as?: "h2" | "p";
  readonly id?: string;
};

export function SectionLabel({ number, label, as: Tag = "p", id }: SectionLabelProps) {
  return (
    <Tag id={id} className={`flex items-center gap-3 ${monoLabel}`}>
      <span>{number}</span>
      <span aria-hidden="true" className="h-px w-6 shrink-0 bg-muted" />
      <span>{label}</span>
    </Tag>
  );
}
