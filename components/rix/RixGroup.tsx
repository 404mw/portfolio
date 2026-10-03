// One /rix playground button group (ui-spec/02-playground.md §2.1): a labelled group, its mono
// heading, then its buttons, wrapping. `hideReduced` hides the whole group under reduced motion,
// when none of its buttons has an R8.1 version (§2.4).
import type { ReactNode } from "react";
import { monoLabel } from "@/lib/styles";

type RixGroupProps = {
  /** The heading's id, for the group's `aria-labelledby`. */
  readonly id: string;
  readonly heading: string;
  readonly hideReduced?: boolean;
  readonly children: ReactNode;
};

export function RixGroup({ id, heading, hideReduced = false, children }: RixGroupProps) {
  return (
    <div role="group" aria-labelledby={id} className={`flex flex-col gap-3 ${hideReduced ? "motion-reduce:hidden" : ""}`}>
      <h3 id={id} className={monoLabel}>
        {heading}
      </h3>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
