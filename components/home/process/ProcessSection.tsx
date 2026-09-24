// Section 5, Process: how do they work? (ui-spec §5). The label and heading, then the loop of
// four steps: a column below `xl`, a ring beside the heading from `xl`.
import { ProcessLoop } from "@/components/home/process/ProcessLoop";
import { SectionHeading } from "@/components/SectionHeading";
import { SectionLabel } from "@/components/SectionLabel";
import { process } from "@/content/home";
import { sectionIds } from "@/lib/routes";
import { container } from "@/lib/styles";

export function ProcessSection() {
  return (
    <section id={sectionIds.process} className="scroll-mt-20 px-gutter">
      <div
        className={`${container} flex flex-col gap-14 border-t border-line py-section md:gap-20 xl:grid xl:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] xl:items-center xl:gap-16 2xl:gap-24`}
      >
        <div data-anim="reveal" className="flex flex-col gap-7">
          <SectionLabel number={process.number} label={process.label} />
          <SectionHeading lead={process.heading.lead} accent={process.heading.accent} size="heading" />
        </div>
        <ProcessLoop />
      </div>
    </section>
  );
}
