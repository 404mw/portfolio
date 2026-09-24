// Section 4, Agents: what can their agents handle for my business? (ui-spec §4). The tab list
// (variant A), with the stacked list as its no-JS fallback. The section's heading is its label.
// No top line: the marquee's bottom line sits right above it.
import { AgentDemo } from "@/components/home/agents/AgentDemo";
import { AgentDemoFrame } from "@/components/home/agents/AgentDemoFrame";
import { AgentsStack } from "@/components/home/agents/AgentsStack";
import { AgentsTabs } from "@/components/home/agents/AgentsTabs";
import { agents } from "@/content/home";
import { agentDemoKinds } from "@/lib/agents";
import { sectionIds } from "@/lib/routes";
import { container } from "@/lib/styles";

export function AgentsSection() {
  const id = sectionIds.agents;
  return (
    <section id={id} className="scroll-mt-20 px-gutter">
      <div className={`${container} py-section`}>
        <AgentsTabs
          idPrefix={id}
          fallback={<AgentsStack />}
          panels={agents.items.map((item, index) => (
            <AgentDemoFrame key={item.slug} slug={item.slug} variant="tabs">
              <AgentDemo kind={agentDemoKinds[index]} />
            </AgentDemoFrame>
          ))}
        />
      </div>
    </section>
  );
}
