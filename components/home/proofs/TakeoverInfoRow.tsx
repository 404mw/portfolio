// One takeover info row (ui-spec §7.3 part 3): the mono label and its value, as a <dt>/<dd> pair
// inside TakeoverInfoRows' <dl>.
import type { ReactNode } from "react";

type TakeoverInfoRowProps = {
  readonly label: string;
  readonly children: ReactNode;
};

export function TakeoverInfoRow({ label, children }: TakeoverInfoRowProps) {
  return (
    <>
      <dt className="pt-0.5 font-mono text-meta text-cream-muted uppercase">{label}</dt>
      <dd>{children}</dd>
    </>
  );
}
