// Section 6, Web: can they build my website end to end? (ui-spec §6). The label, heading and
// lead on the left (sticky from `lg`), the four steps as rows on the right.
import { WebStepRow } from "@/components/home/web/WebStepRow";
import { SectionHeading } from "@/components/SectionHeading";
import { SectionLabel } from "@/components/SectionLabel";
import { web } from "@/content/home";
import { listNumber } from "@/lib/listNumber";
import { sectionIds } from "@/lib/routes";
import { container } from "@/lib/styles";

export function WebSection() {
  return (
    <section id={sectionIds.web} className="scroll-mt-20 px-gutter">
      <div
        className={`${container} grid gap-10 border-t border-line py-section md:gap-12 lg:grid-cols-2 lg:items-start lg:gap-16 xl:gap-24`}
      >
        <div data-anim="reveal" className="flex flex-col gap-7 lg:sticky lg:top-30">
          <SectionLabel number={web.number} label={web.label} />
          <SectionHeading lead={web.heading.lead} accent={web.heading.accent} size="heading-sm" />
          <p className="max-w-sm text-lead leading-normal text-muted">{web.lead}</p>
        </div>
        <ol>
          {web.steps.map((step, index) => (
            <WebStepRow
              key={step.title}
              number={listNumber(index)}
              title={step.title}
              line={step.line}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}
