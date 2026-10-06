// The spam diagram (ui-spec/07-proofs-spam.md), Exile's part 6 wide slot: real text drawn as a
// picture. Phone: three ink bands, one per step, 40px apart, Eva's head breaking out above each
// (the list's `pt-7` holds the first one's). From `md`: one ink band (`SpamStage`) behind three
// columns, Eva on its floor, the text on cream below. Then the way back from step 3 to step 1.
// One structure for both layouts. Its static state is its final state.
import { SpamReturn } from "@/components/home/proofs/SpamReturn";
import { SpamStage } from "@/components/home/proofs/SpamStage";
import { SpamStep } from "@/components/home/proofs/SpamStep";
import type { ProofShowcase } from "@/lib/proofProject";
import { spamStepKeys } from "@/lib/spamDiagram";

type SpamDiagramProps = {
  readonly steps: ProofShowcase["steps"];
  readonly returnLabel: string;
  readonly returnLine: string;
};

export function SpamDiagram({ steps, returnLabel, returnLine }: SpamDiagramProps) {
  return (
    <div data-anim="spam-diagram" className="relative min-w-0">
      <SpamStage />
      <ol className="relative grid auto-rows-fr gap-y-10 pt-7 md:grid-cols-3 md:gap-x-7 md:gap-y-0 md:pt-0">
        {spamStepKeys.map((key, index) => (
          <SpamStep key={key} step={key} index={index} title={steps[key].title} line={steps[key].line} />
        ))}
      </ol>
      <SpamReturn label={returnLabel} line={returnLine} />
    </div>
  );
}
