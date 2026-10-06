// Section 5, Process: how do they work? (ui-spec §5). The label and heading stacked above the
// flow at every width (no pinning); the flow (client) is the About pick's, five or six steps and
// the loop's return to step 2. `ProcessMotion` (client) renders nothing; it adds the reveals and
// the bots' motion.
import { ProcessFlow } from "@/components/home/process/ProcessFlow";
import { ProcessMotion } from "@/components/home/process/ProcessMotion";
import { SectionHeading } from "@/components/SectionHeading";
import { SectionLabel } from "@/components/SectionLabel";
import { process } from "@/content/home";
import { sectionIds } from "@/lib/routes";
import { container } from "@/lib/styles";

export function ProcessSection() {
  return (
    <section id={sectionIds.process} className="scroll-mt-20 px-gutter">
      <div
        className={`${container} flex flex-col gap-14 border-t border-line py-section md:gap-20 lg:gap-24`}
      >
        <div data-anim="reveal" className="flex max-w-250 flex-col gap-5 lg:gap-7">
          <SectionLabel number={process.number} label={process.label} as="p" />
          <SectionHeading lead={process.heading.lead} accent={process.heading.accent} size="heading" />
        </div>
        <ProcessFlow />
      </div>
      <ProcessMotion />
    </section>
  );
}
