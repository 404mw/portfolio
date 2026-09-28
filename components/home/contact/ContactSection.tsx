// Section 8, Contact: how do I start? (ui-spec §8). The label, heading, lead and side links on
// the left (sticky from `lg`); the brief builder on the right (stacked below `lg`).
// `ContactMotion` (client) renders nothing; it adds the reveals and the placeholder rotation.
import { BriefBuilder } from "@/components/home/contact/BriefBuilder";
import { ContactLinks } from "@/components/home/contact/ContactLinks";
import { ContactMotion } from "@/components/home/contact/ContactMotion";
import { SectionHeading } from "@/components/SectionHeading";
import { SectionLabel } from "@/components/SectionLabel";
import { contact } from "@/content/home";
import { sectionIds } from "@/lib/routes";
import { container, splitGrid, stickyTitle } from "@/lib/styles";

export function ContactSection() {
  return (
    <section id={sectionIds.contact} className="scroll-mt-20 px-gutter">
      <div
        className={`${container} ${splitGrid} border-t border-line py-section`}
      >
        <div data-anim="reveal" className={`flex flex-col gap-8 ${stickyTitle}`}>
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
      <ContactMotion placeholders={contact.brief.repeat.placeholders} />
    </section>
  );
}
