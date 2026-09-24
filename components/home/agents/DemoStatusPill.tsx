// The accent "done" pill inside a demo panel, with a tick so the state isn't colour alone.
// `order` is the pill's place in its demo's sequence, for the motion pass.
import { CheckIcon } from "@/components/icons/CheckIcon";

type DemoStatusPillProps = {
  readonly label: string;
  readonly order: number;
  readonly className?: string;
};

export function DemoStatusPill({ label, order, className = "" }: DemoStatusPillProps) {
  return (
    <span
      data-demo-order={order}
      className={`inline-flex items-center gap-2 rounded-full bg-accent px-3.5 py-2 font-mono text-meta font-medium whitespace-nowrap text-on-accent ${className}`}
    >
      <CheckIcon className="size-3" />
      {label}
    </span>
  );
}
