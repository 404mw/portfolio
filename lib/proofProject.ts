// The one shape every project in content/home.ts → proofs.projects has (ui-spec §7.5), and the
// lookup that checks it. Parts 4, 5 and 6 of a takeover are optional: a project either has the
// whole block or none of it. Words stay in content/home.ts.
import { proofs } from "@/content/home";
import type { AboutSet } from "@/lib/aboutPick";
import type { ProofKey, ProofShotSet, ProofStat } from "@/lib/proofs";
import type { ShowcaseProject, ShowcaseStepKey } from "@/lib/showcaseDiagram";

/** A part's headline beside its one paragraph (parts 2 and 3). */
export type ProofPartText = { readonly headline: string; readonly body: string };

/** A title over a line: one thing the project took (part 4), one lesson (part 5), one diagram step (part 6). */
export type ProofTitledLine = { readonly title: string; readonly line: string };

/** Part 4: what building and running it took. */
export type ProofTook = { readonly headline: string; readonly items: readonly ProofTitledLine[] };

/** Part 5: what building it taught, each lesson said as how the user works now. Its own name, so it can change apart from part 4. */
export type ProofLearned = { readonly headline: string; readonly items: readonly ProofTitledLine[] };

/** Part 6: the showcase, its status, its paragraph and the diagram's words, keyed by its diagram's step keys. */
export type ProofShowcase<K extends string = string> = {
  readonly headline: string;
  readonly status: string;
  readonly body: string;
  readonly steps: Readonly<Record<K, ProofTitledLine>>;
  readonly returnLabel: string;
  readonly returnLine: string;
};

/** Part 7's closing line per set: `default` always, a card's own line when it has one. */
export type ProofMeans = { readonly default: string } & { readonly [K in AboutSet]?: string };

/** A project's showcase: typed with its own diagram's step keys; a project with no diagram has none. */
type ProofShowcaseOf<P extends ProofKey> = P extends ShowcaseProject ? ProofShowcase<ShowcaseStepKey<P>> : never;

export type ProofProject<P extends ProofKey = ProofKey> = {
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
  readonly showcase?: ProofShowcaseOf<P>;
  readonly meansForYou: ProofMeans;
  readonly shotAlts: ProofShotSet<string>;
  readonly visitLabel: string;
};

/** Every project under the one shape: a project that drifts from it fails the type check here. */
const projects: { readonly [P in ProofKey]: ProofProject<P> } = proofs.projects;

/** A project's content, with its optional parts typed as optional. */
export function proofProject(key: ProofKey): ProofProject {
  return projects[key];
}
