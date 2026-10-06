// Orchestra demo, finished state (ui-spec §4.4): how the workflow runs, as swimlanes. Three lanes
// side by side (Lead, the team, the checks), the team's lane shaded, in one rounded outline; time
// runs down through eight rows (lib/orchestraRows.ts), one card per row, each joined to the next
// by an L-shaped link; the fix (rows 6 and 7) in dashed accent. Then the done pill, centred. One
// form at every width; only sizes change. The drawing is a picture (`aria-hidden`); the
// screen-reader list of `steps` is its text, and the pill says the outcome. Nothing is
// interactive. The `orch-*` hooks and `orch-token` are for the replay (lib/orchestraRun.ts): the
// token stays `hidden` here and is shown, and taken out of the grid's flow, from JS only.
import { DemoStatusPill } from "@/components/home/agents/DemoStatusPill";
import { OrchestraRow } from "@/components/home/agents/OrchestraRow";
import type { OrchestraDemoContent } from "@/lib/agents";
import { ORCHESTRA_PILL_ORDER, orchestraRows } from "@/lib/orchestraRows";

type OrchestraDemoProps = { readonly demo: OrchestraDemoContent };

const lanes =
  "relative mx-auto grid w-full max-w-150 grid-cols-3 gap-y-4 rounded-xl border border-line py-3 sm:gap-y-5 sm:py-4";
const shade = "absolute inset-y-0 left-1/3 w-1/3 bg-line/40";

export function OrchestraDemo({ demo }: OrchestraDemoProps) {
  return (
    <div className="flex flex-col gap-4 xl:gap-5">
      <ol className="sr-only">
        {demo.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <div aria-hidden="true" data-anim="orch-diagram" className={lanes}>
        <span data-anim="orch-lane" data-lane="team" className={shade} />
        {orchestraRows.map((spec) => (
          <OrchestraRow key={spec.row} spec={spec} demo={demo} />
        ))}
        <span data-anim="orch-token" className="hidden size-2 rounded-full bg-accent" />
      </div>
      <DemoStatusPill label={demo.done} order={ORCHESTRA_PILL_ORDER} className="self-center" />
    </div>
  );
}
