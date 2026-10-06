// One offer's panel (ui-spec §4.4): picks it by the offer's kind (lib/agents.ts) and passes it its
// sample content. A demo kind is its finished-state demo inside the panel frame; `pointer` is the
// pointer panel, which is not an agent demo.
import { AgentDemoFrame } from "@/components/home/agents/AgentDemoFrame";
import { AgentPointerPanel } from "@/components/home/agents/AgentPointerPanel";
import { ChatDemo } from "@/components/home/agents/ChatDemo";
import { ChecklistDemo } from "@/components/home/agents/ChecklistDemo";
import { LeadsDemo } from "@/components/home/agents/LeadsDemo";
import { OrchestraDemo } from "@/components/home/agents/OrchestraDemo";
import { ReportDemo } from "@/components/home/agents/ReportDemo";
import { SyncDemo } from "@/components/home/agents/SyncDemo";
import type { AgentPanel, AgentsVariant } from "@/lib/agents";

function demoFor(panel: Exclude<AgentPanel, { kind: "pointer" }>) {
  switch (panel.kind) {
    case "chat":
      return <ChatDemo demo={panel.demo} />;
    case "leads":
      return <LeadsDemo demo={panel.demo} />;
    case "report":
      return <ReportDemo demo={panel.demo} />;
    case "sync":
      return <SyncDemo demo={panel.demo} />;
    case "checklist":
      return <ChecklistDemo demo={panel.demo} />;
    case "orchestra":
      return <OrchestraDemo demo={panel.demo} />;
  }
}

type AgentDemoProps = {
  readonly panel: AgentPanel;
  readonly variant: AgentsVariant;
};

export function AgentDemo({ panel, variant }: AgentDemoProps) {
  if (panel.kind === "pointer") return <AgentPointerPanel variant={variant} />;
  return (
    <AgentDemoFrame slug={panel.slug} variant={variant}>
      {demoFor(panel)}
    </AgentDemoFrame>
  );
}
