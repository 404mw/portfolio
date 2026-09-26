// Section 5, Process: how do they work? (ui-spec §5). The label and heading stacked above the
// steps at every width (no pinning), then the four steps and the loop's return. `ProcessMotion`
// (client) renders nothing; it adds the reveals and the bots' stop-motion.
import { ProcessList } from "@/components/home/process/ProcessList";
import { ProcessMotion } from "@/components/home/process/ProcessMotion";
import { ProcessReturn } from "@/components/home/process/ProcessReturn";
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
        <div className="flex max-w-2xl flex-col lg:max-w-none lg:gap-10">
          <ProcessList />
          <ProcessReturn />
        </div>
      </div>
      <ProcessMotion />
    </section>
  );
}
