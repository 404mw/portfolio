// The showcase diagram (ui-spec/07-proofs-spam.md), part 6's wide slot for every project that has
// one (lib/showcaseDiagram.ts): real text drawn as a picture. Phone: three ink bands, one per step,
// 40px apart, the figure in each (the list's `pt-7` holds the first one's break-out). From `md`:
// one ink band (`ShowcaseStage`) behind three columns, the figures on its floor, the text on cream
// below. Then the way back (`ShowcaseReturn`): to step 1, or a loop on the last step. The figure
// kind (Eva's images or Rix) belongs to the diagram. One structure for both layouts. Its static
// state is its final state; `ShowcaseMotion` (renders nothing) plays it in once per takeover open.
import { ShowcaseMotion } from "@/components/home/proofs/ShowcaseMotion";
import { ShowcaseReturn } from "@/components/home/proofs/ShowcaseReturn";
import { ShowcaseStage } from "@/components/home/proofs/ShowcaseStage";
import { ShowcaseStep } from "@/components/home/proofs/ShowcaseStep";
import type { ProofShowcase } from "@/lib/proofProject";
import { proofTarget } from "@/lib/proofs";
import {
  showcaseDiagrams,
  showcaseStepPointsOn,
  type ShowcaseDiagramData,
  type ShowcaseProject,
} from "@/lib/showcaseDiagram";

type ShowcaseDiagramProps = {
  readonly project: ShowcaseProject;
  readonly steps: ProofShowcase["steps"];
  readonly returnLabel: string;
  readonly returnLine: string;
};

export function ShowcaseDiagram({ project, steps, returnLabel, returnLine }: ShowcaseDiagramProps) {
  const diagram: ShowcaseDiagramData = showcaseDiagrams[project];
  const count = diagram.steps.length;

  return (
    <div data-anim="showcase-diagram" data-figure={diagram.figure} className="relative min-w-0">
      <ShowcaseStage figure={diagram.figure} />
      <ol className="relative grid auto-rows-fr gap-y-10 pt-7 md:grid-cols-3 md:gap-x-7 md:gap-y-0 md:pt-0">
        {diagram.steps.map((entry, index) => (
          <ShowcaseStep
            key={entry.key}
            figure={diagram.figure}
            entry={entry}
            index={index}
            pointsOn={showcaseStepPointsOn(index, count)}
            title={steps[entry.key].title}
            line={steps[entry.key].line}
          />
        ))}
      </ol>
      <ShowcaseReturn to={diagram.returnTo} label={returnLabel} line={returnLine} />
      <ShowcaseMotion dialogId={proofTarget(project).id} />
    </div>
  );
}
