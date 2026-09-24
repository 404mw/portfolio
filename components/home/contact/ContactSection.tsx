// Section 8, Contact: how do I start? (ui-spec §8). The label, heading, lead and side links on
// the left; the brief builder on the right (stacked below `lg`).
import { BriefBuilder } from "@/components/home/contact/BriefBuilder";
import { ContactLinks } from "@/components/home/contact/ContactLinks";
import { SectionHeading } from "@/components/SectionHeading";
import { SectionLabel } from "@/components/SectionLabel";
import { contact } from "@/content/home";
import { sectionIds } from "@/lib/routes";
import { container } from "@/lib/styles";

export function ContactSection() {
  return (
    <section id={sectionIds.contact} className="scroll-mt-20 px-gutter">
      <div
        className={`${container} grid gap-10 border-t border-line py-section md:gap-12 lg:grid-cols-2 lg:items-start lg:gap-16 xl:gap-24`}
      >
        <div data-anim="reveal" className="flex flex-col gap-8">
          <SectionLabel number={contact.number} label={contact.label} />
          <SectionHeading
            lead={contact.heading.lead}
            accent={contact.heading.accent}
            size="heading-xl"
          />
          <p className="max-w-100 text-lead leading-normal text-muted">{contact.lead}</p>
          <ContactLinks />
        </div>
        <BriefBuilder />
      </div>
    </section>
  );
}
