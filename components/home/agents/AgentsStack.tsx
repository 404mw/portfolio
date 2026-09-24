// Agents variant B (ui-spec §4.3): every offer as a row with its own demo panel beside it.
// Nothing is interactive. Also the no-JS fallback for variant A.
import { AgentDemo } from "@/components/home/agents/AgentDemo";
import { AgentDemoFrame } from "@/components/home/agents/AgentDemoFrame";
import { AgentRowText } from "@/components/home/agents/AgentRowText";
import { agents } from "@/content/home";
import { agentDemoKinds } from "@/lib/agents";
import { listNumber } from "@/lib/listNumber";

export function AgentsStack() {
  return (
    <ol>
      {agents.items.map((item, index) => (
        <li
          key={item.slug}
          className="grid gap-6 border-t border-line py-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-16 lg:py-14"
        >
          <AgentRowText
            number={listNumber(index)}
            title={item.title}
            line={item.line}
            titleAs="h3"
            active
          />
          <AgentDemoFrame slug={item.slug} variant="stack">
            <AgentDemo kind={agentDemoKinds[index]} />
          </AgentDemoFrame>
        </li>
      ))}
    </ol>
  );
}
