// The one shape every project in content/home.ts → proofs.projects has (ui-spec §7.5), and the
// lookup that checks it. Parts 4, 5 and 6 of a takeover are optional: a project either has the
// whole block or none of it. Words stay in content/home.ts.
import { proofs } from "@/content/home";
import type { AboutSet } from "@/lib/aboutPick";
import type { ProofKey, ProofShots, ProofStat } from "@/lib/proofs";
import type { SpamStepKey } from "@/lib/spamDiagram";

/** A part's headline beside its one paragraph (parts 2 and 3). */
export type ProofPartText = { readonly headline: string; readonly body: string };

/** A title over a line: one thing the project took (part 4), one lesson (part 5), one diagram step (part 6). */
export type ProofTitledLine = { readonly title: string; readonly line: string };

/** Part 4: what building and running it took. */
export type ProofTook = { readonly headline: string; readonly items: readonly ProofTitledLine[] };

/** Part 5: what building it taught, each lesson said as how the user works now. Its own name, so it can change apart from part 4. */
export type ProofLearned = { readonly headline: string; readonly items: readonly ProofTitledLine[] };

/** Part 6: the showcase, its status, its paragraph and the diagram's words. */
export type ProofShowcase = {
  readonly headline: string;
  readonly status: string;
  readonly body: string;
  readonly steps: Readonly<Record<SpamStepKey, ProofTitledLine>>;
  readonly returnLabel: string;
  readonly returnLine: string;
};

/** Part 7's closing line per set: `default` always, a card's own line when it has one. */
export type ProofMeans = { readonly default: string } & { readonly [K in AboutSet]?: string };

export type ProofProject = {
  readonly tag: string;
  readonly title: string;
  readonly cardLine: string;
  readonly proofLine: string;
  readonly rows: {
    readonly whatItIs: string;
    readonly built: string;
    readonly inUse: string;
    readonly inUseStats?: readonly ProofStat[];
  };
  readonly intro: string;
  readonly problem: ProofPartText;
  readonly whatIBuilt: ProofPartText;
  readonly whatItTook?: ProofTook;
  readonly whatILearned?: ProofLearned;
  readonly showcase?: ProofShowcase;
  readonly meansForYou: ProofMeans;
  readonly shotAlts: ProofShots<string>;
  readonly visitLabel: string;
};

/** Every project under the one shape: a project that drifts from it fails the type check here. */
const projects: Readonly<Record<ProofKey, ProofProject>> = proofs.projects;

/** A project's content, with its optional parts typed as optional. */
export function proofProject(key: ProofKey): ProofProject {
  return projects[key];
}
