// About's intro (ui-spec §2a.1, 02a-about-options §2a.O0, §2a.B): the unnumbered label and the
// heading on the left, the lead lines on the right from `lg`, bottom-aligned.
import { SectionHeading } from "@/components/SectionHeading";
import { SectionLabel } from "@/components/SectionLabel";
import { about } from "@/content/home";
import { splitColumns } from "@/lib/styles";

export function AboutIntro() {
  return (
    <div data-anim="reveal" className={`${splitColumns} lg:items-end`}>
      <div className="flex flex-col gap-6 lg:gap-8">
        <SectionLabel label={about.label} />
        <SectionHeading lead={about.heading.lead} accent={about.heading.accent} size="heading-sm" />
      </div>
      <div className="flex flex-col gap-3 max-w-100">
        {about.lines.map((line) => (
          <p key={line} className="text-lead leading-normal text-pretty text-muted">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
