// Section 4, Agents: what can their agents handle for my business? (ui-spec §4). The tab list
// (variant A), which shows the picked About card's offers, with the stacked list of the `default`
// set as its no-JS fallback. The section's heading is its label. No top line: the marquee's bottom
// line sits right above it.
import { AgentsStack } from "@/components/home/agents/AgentsStack";
import { AgentsTabs } from "@/components/home/agents/AgentsTabs";
import { sectionIds } from "@/lib/routes";
import { container } from "@/lib/styles";

export function AgentsSection() {
  const id = sectionIds.agents;
  return (
    <section id={id} className="scroll-mt-20 px-gutter">
      <div className={`${container} py-section`}>
        <AgentsTabs idPrefix={id} fallback={<AgentsStack />} />
      </div>
    </section>
  );
}
