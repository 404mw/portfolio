"use client";
// Agents variant A (ui-spec §4.2): a vertical tab list of one set's offers beside one demo panel;
// the intro (label, heading, lead), the "Shown for" tag and the tab list stay sticky from `lg`
// while the panel scrolls. The heading is the section's h2 and names the tab list.
// The set is the About pick's (ui-spec §0.5): four or five offers, `default` with no pick and in
// the server markup. The root carries `data-set`; the rows and panels are keyed by set, so a
// change remounts them inside the two wrappers, which persist. A change puts the selection back
// on row 1 and moves no focus. The swap fades (`useSwapFade`, ui-spec §0.5): the tab list, the
// stepper and the panels fade out, the set changes, and they fade back in; the intro and the tag
// stay as they are. Below `lg` the tab list hides and `AgentsStepper` (§4.2a), the first
// child of the panels wrapper and outside the per-offer panels, moves between offers instead.
// Without JavaScript the tag, tab list and panels hide (`noscript:`),
// and `fallback` (variant B's list) shows in their place.
// Motion (entrance, auto-advance, demo replays) comes from `useAgentsMotion`, through the
// `data-anim` hooks below; the markup is the static layout either way.
import { useRef, type ReactNode } from "react";
import { AgentDemo } from "@/components/home/agents/AgentDemo";
import { AgentRowText } from "@/components/home/agents/AgentRowText";
import { AgentsStepper } from "@/components/home/agents/AgentsStepper";
import { ShownForTag } from "@/components/home/pick/ShownForTag";
import { SectionHeading } from "@/components/SectionHeading";
import { SectionLabel } from "@/components/SectionLabel";
import { agents } from "@/content/home";
import { useAgentsMotion } from "@/hooks/useAgentsMotion";
import { useRovingTabs } from "@/hooks/useRovingTabs";
import { useShownSet } from "@/hooks/useShownSet";
import { useSwapFade } from "@/hooks/useSwapFade";
import { agentPanels, agentRowIds } from "@/lib/agents";
import { listNumber } from "@/lib/listNumber";
import { animTargets } from "@/lib/motion";
import { focusRing, splitColumns, stickyTitle } from "@/lib/styles";

type AgentsTabsProps = {
  /** The section's id: the prefix of every id here, and of the tag's radio group. */
  readonly idPrefix: string;
  readonly fallback: ReactNode;
};

/** What fades across a set swap: wrappers the section's own motion writes no opacity on. */
const swapWrappers = (root: HTMLElement) =>
  ["agents-tablist", "agents-stepper", "agent-panel"].flatMap((name) => animTargets(root, name));

export function AgentsTabs({ idPrefix, fallback }: AgentsTabsProps) {
  const set = useShownSet();
  const panels = agentPanels(set);
  const { selected, select, step, onKeyDown, tabRef } = useRovingTabs(panels.length, set);
  const introId = `${idPrefix}-intro`;
  const headingId = `${idPrefix}-heading`;
  const panelsId = `${idPrefix}-panels`;
  const tabId = (index: number) => `${idPrefix}-tab-${index}`;
  const panelId = (index: number) => `${idPrefix}-panel-${index}`;
  const nameId = (index: number) => `${idPrefix}-name-${index}`;
  const root = useRef<HTMLDivElement>(null);
  useAgentsMotion(root, { selected, select, introId, set, kinds: panels.map((panel) => panel.kind) });
  useSwapFade(root, swapWrappers);

  return (
    <div ref={root} data-set={set} className={`${splitColumns} noscript:block lg:items-center`}>
      <div className={`flex flex-col gap-10 ${stickyTitle}`}>
        <div className="flex flex-col gap-5">
          <div id={introId} className="flex flex-col gap-5">
            <SectionLabel number={agents.number} label={agents.label} />
            <SectionHeading
              lead={agents.heading.lead}
              accent={agents.heading.accent}
              size="heading-sm"
              id={headingId}
            />
            <p className="max-w-sm text-lead leading-normal text-muted">{agents.lead}</p>
          </div>
          <ShownForTag sectionId={idPrefix} />
        </div>
        <div
          role="tablist"
          aria-orientation="vertical"
          aria-labelledby={headingId}
          data-anim="agents-tablist"
          className="max-lg:hidden noscript:hidden"
        >
          {panels.map((panel, index) => {
            const isSelected = index === selected;
            return (
              <button
                key={`${set}-${index}`}
                ref={tabRef(index)}
                type="button"
                role="tab"
                id={tabId(index)}
                aria-labelledby={agentRowIds(nameId(index)).labelledBy}
                aria-selected={isSelected}
                aria-controls={panelId(index)}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => select(index)}
                onKeyDown={onKeyDown}
                data-anim="agents-row"
                className={`group relative block w-full cursor-pointer border-t border-line py-5 text-left ${focusRing}`}
              >
                <span
                  aria-hidden="true"
                  data-anim="agent-progress"
                  className={`absolute inset-x-0 -top-px h-px origin-left bg-accent ${isSelected ? "" : "scale-x-0"}`}
                />
                <AgentRowText
                  number={listNumber(index)}
                  title={panel.title}
                  line={isSelected ? panel.line : undefined}
                  titleAs="span"
                  active={isSelected}
                  labelId={nameId(index)}
                />
              </button>
            );
          })}
        </div>
        <noscript>{fallback}</noscript>
      </div>
      <div id={panelsId} data-anim="agents-panels" className="noscript:hidden">
        <AgentsStepper set={set} panels={panels} selected={selected} step={step} panelsId={panelsId} />
        {panels.map((panel, index) => (
          <div
            key={`${set}-${index}`}
            role="tabpanel"
            id={panelId(index)}
            aria-labelledby={agentRowIds(nameId(index)).labelledBy}
            tabIndex={0}
            hidden={index !== selected}
            data-anim="agent-panel"
            className={`rounded-3xl max-lg:rounded-t-none ${focusRing}`}
          >
            <AgentDemo panel={panel} variant="tabs" />
          </div>
        ))}
      </div>
    </div>
  );
}
