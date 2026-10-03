// The /rix playground (ui-spec/02-playground.md §2): a screen-reader heading, a no-JS line, then the
// controls around the stage: a big Rix on the floor line, the "now playing" readout, the patrol
// toggle and the button groups. The section is the motion root and the quip and status key
// (`rix-playground`). Reads straight on from the intro, with no hairline. Motion: the stage band
// reveals on load (`RixReveal`); Rix himself runs in `RixControls`.
import { RixControls } from "@/components/rix/RixControls";
import { RixReveal } from "@/components/rix/RixReveal";
import { RixStage } from "@/components/rix/RixStage";
import { playground } from "@/content/rix";
import { rixIds } from "@/lib/rixPlayground";
import { container, metaLabel } from "@/lib/styles";

export function RixPlayground() {
  return (
    <section id={rixIds.playground} aria-labelledby={rixIds.playgroundTitle} className="px-gutter">
      <div className={`${container} pt-6 pb-section md:pt-8`}>
        <h2 id={rixIds.playgroundTitle} className="sr-only">
          {playground.heading}
        </h2>
        <noscript>
          <p className={`${metaLabel} mb-6`}>{playground.noScript}</p>
        </noscript>
        <RixControls>
          <RixStage />
        </RixControls>
      </div>
      <RixReveal sectionId={rixIds.playground} />
    </section>
  );
}
