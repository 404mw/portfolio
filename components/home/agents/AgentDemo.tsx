// Picks the finished-state demo for an offer by its kind (lib/agents.ts).
import type { ComponentType } from "react";
import { ChatDemo } from "@/components/home/agents/ChatDemo";
import { LeadsDemo } from "@/components/home/agents/LeadsDemo";
import { ReportDemo } from "@/components/home/agents/ReportDemo";
import { SyncDemo } from "@/components/home/agents/SyncDemo";
import type { AgentDemoKind } from "@/lib/agents";

const demos: Record<AgentDemoKind, ComponentType> = {
  chat: ChatDemo,
  leads: LeadsDemo,
  report: ReportDemo,
  sync: SyncDemo,
};

export function AgentDemo({ kind }: { readonly kind: AgentDemoKind }) {
  const Demo = demos[kind];
  return <Demo />;
}
