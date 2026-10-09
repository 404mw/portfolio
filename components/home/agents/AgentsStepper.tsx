"use client";
// The phone and tablet stepper above the Agents panel (ui-spec §4.2a): ‹ and › buttons round the
// counter and the selected offer's title, one progress bar per offer, then the offer's line. It's
// the only way between offers below `lg` (the tab list hides there) and hides itself from `lg`.
// One stepper, outside the per-offer panels, so a press never hides the focused button. The
// buttons wrap and never move focus (`step`). The visible counter is `aria-hidden`; a `sr-only`
// position reads in its place, and a live region speaks the new position and title after a press
// only: never on the auto-advance, and it clears when the set changes. Not keyed by set: only its
// bars remount. The bars mirror the selection in static; `useAgentsMotion` grows the selected one
// over the 6s advance (`agent-progress-bar`) and fades the new title and line in on a change.
import { useState } from "react";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
import { agents } from "@/content/home";
import type { AgentPanel } from "@/lib/agents";
import { fillTemplate } from "@/lib/fillTemplate";
import { listNumber } from "@/lib/listNumber";
import { focusRing } from "@/lib/styles";

type AgentsStepperProps = {
  /** The shown set; a change clears the press announcement and remounts the bars. */
  readonly set: string;
  readonly panels: readonly AgentPanel[];
  readonly selected: number;
  /** Selects the previous or next offer, wrapping, without moving focus. */
  readonly step: (delta: 1 | -1) => void;
  /** The panels wrapper's id, which the buttons control. */
  readonly panelsId: string;
};

const stepButton = `grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border border-line text-text hover:border-accent hover:text-accent active:bg-line ${focusRing}`;

export function AgentsStepper({ set, panels, selected, step, panelsId }: AgentsStepperProps) {
  const count = panels.length;
  const [message, setMessage] = useState("");
  const [lastSet, setLastSet] = useState(set);

  if (lastSet !== set) {
    setLastSet(set);
    setMessage("");
  }

  const position = (index: number) =>
    fillTemplate(agents.stepper.position, { n: index + 1, total: count });

  function press(delta: 1 | -1) {
    const next = (selected + delta + count) % count;
    step(delta);
    setMessage(`${position(next)}: ${panels[next]?.title ?? ""}`);
  }

  const panel = panels[selected];

  return (
    <div
      data-anim="agents-stepper"
      className="flex flex-col gap-3 rounded-t-3xl border-x border-t border-line bg-band p-4 lg:hidden"
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={agents.stepper.prev}
          aria-controls={panelsId}
          onClick={() => press(-1)}
          className={stepButton}
        >
          <ChevronRightIcon className="size-4 rotate-180" />
        </button>
        <div className="flex min-w-0 flex-1 flex-col items-center gap-0.5 text-center">
          <span aria-hidden="true" className="font-mono text-meta text-accent">
            {`${listNumber(selected)} / ${listNumber(count - 1)}`}
          </span>
          <span className="sr-only">{position(selected)}</span>
          <span
            data-anim="agents-stepper-title"
            className="font-display text-summary leading-[1.15] text-balance text-text"
          >
            {panel?.title}
          </span>
        </div>
        <button
          type="button"
          aria-label={agents.stepper.next}
          aria-controls={panelsId}
          onClick={() => press(1)}
          className={stepButton}
        >
          <ChevronRightIcon className="size-4" />
        </button>
      </div>
      <div aria-hidden="true" className="flex gap-1 px-14">
        {panels.map((_, index) => (
          <span
            key={`${set}-${index}`}
            className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-line"
          >
            <span
              data-anim="agent-progress-bar"
              className={`absolute inset-0 origin-left bg-accent ${index === selected ? "" : "scale-x-0"}`}
            />
          </span>
        ))}
      </div>
      <p
        data-anim="agents-stepper-line"
        className="text-center text-body leading-normal text-balance text-muted"
      >
        {panel?.line}
      </p>
      <p className="sr-only" aria-live="polite">
        {message}
      </p>
    </div>
  );
}
