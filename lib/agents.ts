// Agents section wiring (ui-spec §4, §4.8): the two layouts, the panel kinds, the shape of each
// kind's sample content, and which panel each offer shows, per set. `agentPanelKinds[set][i]`
// belongs to `agents.cards[set][i]` in content/home.ts. Each list's type is tied to that list:
// its length, and each kind to the shape of that row's `demo` (a row with none fails `tsc`).
// So adding or removing an offer without its panel, or giving it the wrong kind, fails `tsc`.
import { agents } from "@/content/home";
import type { AboutSet } from "@/lib/aboutPick";

export type AgentsVariant = "tabs" | "stack";

/** The demo kinds: a sample of an agent at work. */
export type AgentDemoKind = "chat" | "leads" | "report" | "sync" | "checklist" | "orchestra";

/** A panel kind: every panel is a demo. */
export type AgentPanelKind = AgentDemoKind;

/** What an agent did (past tense) and where the reader finds the result (ui-spec §4.10). */
export type DemoAction = { readonly text: string; readonly where: string };

/** One line someone says in a chat. */
type ChatLine = {
  readonly from: "them" | "agent";
  readonly text: string;
  /** A mono note under an agent line. */
  readonly meta?: string;
};

/** The job done, at its place in a chat: said by no one. */
type ChatAction = DemoAction & { readonly from: "action" };

/** One short exchange, in order; either side may open it, and one entry is the action taken. */
export type ChatDemoContent = {
  /** Screen-reader name of the other side (customer, member, visitor). */
  readonly asker: string;
  readonly messages: readonly (ChatLine | ChatAction)[];
};

/**
 * People, where each came from, and the pill before and after the agent acts. A row may carry its
 * own done-pill label (`done`); a row without one shows `statusDone`.
 */
export type LeadsDemoContent = {
  readonly rows: readonly {
    readonly initials: string;
    readonly name: string;
    readonly source: string;
    readonly done?: string;
  }[];
  readonly statusNew: string;
  readonly statusDone: string;
  /** One closing receipt under the list: where the results went. */
  readonly action?: DemoAction;
};

/** A report: its title, period, bar heights (%), hidden chart text and sent status. */
export type ReportDemoContent = {
  readonly title: string;
  readonly week: string;
  readonly bars: readonly number[];
  readonly chartAlt: string;
  readonly sent: string;
};

/** Three linked things, three events and the final status. */
export type SyncDemoContent = {
  readonly tools: readonly string[];
  readonly events: readonly { readonly kind: string; readonly result: string }[];
  readonly done: string;
};

/** Pieces of work, each with the one-word result its tick stands for, and the final status. */
export type ChecklistDemoContent = {
  readonly title: string;
  readonly meta: string;
  readonly items: readonly { readonly text: string; readonly note: string }[];
  readonly done: string;
};

/** A group of agents under the lead: its label and its three roles. */
type OrchestraTier = { readonly label: string; readonly roles: readonly string[] };

/** The six numbered step labels, in order: ① out … ⑥ pass (ui-spec §4.4, the swimlanes). */
export type OrchestraRing = {
  readonly out: string;
  readonly rules: string;
  readonly work: string;
  readonly check: string;
  readonly fix: string;
  readonly pass: string;
};

/**
 * A lead over a team and the checkers, as swimlanes: the lane titles, the six step labels, the six
 * screen-reader sentences (same order as `ring`) and the final status.
 */
export type OrchestraDemoContent = {
  readonly lead: string;
  readonly team: OrchestraTier;
  readonly checks: OrchestraTier;
  readonly ring: OrchestraRing;
  readonly steps: readonly [string, string, string, string, string, string];
  readonly done: string;
};

/** Each demo kind's content shape. */
export type AgentDemoContent = {
  readonly chat: ChatDemoContent;
  readonly leads: LeadsDemoContent;
  readonly report: ReportDemoContent;
  readonly sync: SyncDemoContent;
  readonly checklist: ChecklistDemoContent;
  readonly orchestra: OrchestraDemoContent;
};

type AgentRowText = { readonly title: string; readonly line: string };

/** One offer with its panel: a demo kind with that kind's content and slug. */
export type AgentPanel = {
  readonly [K in AgentDemoKind]: AgentRowText & {
    readonly kind: K;
    readonly slug: string;
    readonly demo: AgentDemoContent[K];
  };
}[AgentDemoKind];

/** The one kind a content row can take: the demo kind whose shape its `demo` has; none without a `demo`. */
type KindFor<Row> = Row extends { readonly demo: infer Demo }
  ? { [K in AgentDemoKind]: Demo extends AgentDemoContent[K] ? K : never }[AgentDemoKind]
  : never;

/** One kind per row of a set's list, same length (a generic, so the mapping keeps the tuple). */
type KindsPer<Rows extends readonly unknown[]> = { readonly [I in keyof Rows]: KindFor<Rows[I]> };

/** Each set's panel kinds, lead offer first (ui-spec §4.8). */
export const agentPanelKinds: { readonly [S in AboutSet]: KindsPer<(typeof agents.cards)[S]> } = {
  default: ["leads", "chat", "chat", "leads"],
  "service-business": ["leads", "chat", "chat", "leads"],
  "online-store": ["chat", "report", "sync", "leads"],
  discord: ["chat", "checklist", "leads", "report", "sync"],
  "software-builder": ["orchestra", "checklist", "checklist", "report"],
};

/**
 * A set's offers, each with its panel kind. The cast pairs a row with its kind; `KindFor` above is
 * what makes the pair true, row by row.
 */
export function agentPanels(set: AboutSet): readonly AgentPanel[] {
  const kinds: readonly AgentPanelKind[] = agentPanelKinds[set];
  return agents.cards[set].map((row, index) => ({ ...row, kind: kinds[index] }) as AgentPanel);
}

/** The ids of an offer row's number and title, so a tab and its panel are named by them only. */
export function agentRowIds(labelId: string) {
  const number = `${labelId}-number`;
  const title = `${labelId}-title`;
  return { number, title, labelledBy: `${number} ${title}` };
}
