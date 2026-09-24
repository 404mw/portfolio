// Agents section wiring (ui-spec §4): the two layouts under review, and which demo each offer
// shows. `agentDemoKinds[i]` belongs to `agents.items[i]` in content/home.ts; its type is tied
// to that list's length, so adding or removing an offer without its demo fails `tsc`.
import { agents } from "@/content/home";

export type AgentsVariant = "tabs" | "stack";

export type AgentDemoKind = "chat" | "leads" | "report" | "sync";

/** One demo kind per entry of a tuple, same length (a generic, so the mapping keeps the tuple). */
type DemoPer<Items extends readonly unknown[]> = { readonly [K in keyof Items]: AgentDemoKind };

export const agentDemoKinds: DemoPer<typeof agents.items> = ["chat", "leads", "report", "sync"];

/** The ids of an offer row's number and title, so a tab and its panel are named by them only. */
export function agentRowIds(labelId: string) {
  const number = `${labelId}-number`;
  const title = `${labelId}-title`;
  return { number, title, labelledBy: `${number} ${title}` };
}
