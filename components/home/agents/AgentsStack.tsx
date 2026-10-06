// Agents variant B (ui-spec §4.3): every offer as a row with its own demo panel beside it.
// Nothing is interactive. It ships only as variant A's no-JS fallback, so it draws the `default`
// set: without JavaScript there is no pick to follow.
import { AgentDemo } from "@/components/home/agents/AgentDemo";
import { AgentRowText } from "@/components/home/agents/AgentRowText";
import { agentPanels } from "@/lib/agents";
import { listNumber } from "@/lib/listNumber";

export function AgentsStack() {
  return (
    <ol>
      {agentPanels("default").map((panel, index) => (
        <li
          key={panel.title}
          className="grid gap-6 border-t border-line py-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-16 lg:py-14"
        >
          <AgentRowText
            number={listNumber(index)}
            title={panel.title}
            line={panel.line}
            titleAs="h3"
            active
          />
          <AgentDemo panel={panel} variant="stack" />
        </li>
      ))}
    </ol>
  );
}
