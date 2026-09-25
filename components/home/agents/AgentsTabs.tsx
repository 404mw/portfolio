"use client";
// Agents variant A (ui-spec §4.2): a vertical tab list of the four offers beside one demo
// panel; the label and tab list stay sticky from `lg` while the panel scrolls. The panels are
// rendered on the server and passed in. Without JavaScript the tab list
// and panels hide (`noscript:`), and `fallback` (variant B's list) shows in their place.
import type { ReactNode } from "react";
import { AgentRowText } from "@/components/home/agents/AgentRowText";
import { SectionLabel } from "@/components/SectionLabel";
import { agents } from "@/content/home";
import { useRovingTabs } from "@/hooks/useRovingTabs";
import { agentRowIds } from "@/lib/agents";
import { listNumber } from "@/lib/listNumber";
import { focusRing, splitColumns, stickyTitle } from "@/lib/styles";

type AgentsTabsProps = {
  readonly idPrefix: string;
  readonly panels: readonly ReactNode[];
  readonly fallback: ReactNode;
};

export function AgentsTabs({ idPrefix, panels, fallback }: AgentsTabsProps) {
  const { selected, select, onKeyDown, tabRef } = useRovingTabs(agents.items.length);
  const labelId = `${idPrefix}-label`;
  const tabId = (index: number) => `${idPrefix}-tab-${index}`;
  const panelId = (index: number) => `${idPrefix}-panel-${index}`;
  const nameId = (index: number) => `${idPrefix}-name-${index}`;

  return (
    <div className={`${splitColumns} noscript:block lg:items-center`}>
      <div className={`flex flex-col gap-10 ${stickyTitle}`}>
        <SectionLabel as="h2" id={labelId} number={agents.number} label={agents.label} />
        <div
          role="tablist"
          aria-orientation="vertical"
          aria-labelledby={labelId}
          className="noscript:hidden"
        >
          {agents.items.map((item, index) => {
            const isSelected = index === selected;
            return (
              <button
                key={item.slug}
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
                className={`group relative block w-full cursor-pointer border-t border-line py-5 text-left ${focusRing}`}
              >
                <span
                  aria-hidden="true"
                  data-anim="agent-progress"
                  className={`absolute inset-x-0 -top-px h-px origin-left bg-accent ${isSelected ? "" : "scale-x-0"}`}
                />
                <AgentRowText
                  number={listNumber(index)}
                  title={item.title}
                  line={isSelected ? item.line : undefined}
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
      <div className="noscript:hidden">
        {panels.map((panel, index) => (
          <div
            key={panelId(index)}
            role="tabpanel"
            id={panelId(index)}
            aria-labelledby={agentRowIds(nameId(index)).labelledBy}
            tabIndex={0}
            hidden={index !== selected}
            className={`rounded-3xl ${focusRing}`}
          >
            {panel}
          </div>
        ))}
      </div>
    </div>
  );
}
