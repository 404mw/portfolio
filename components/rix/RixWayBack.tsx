// The /rix way back (ui-spec/03-way-back.md §3): a short heading, then Book a call (the shared,
// tracked pill) and a plain link back to home. Stacked on phones, a row of pills from `md`, and
// heading left, pills right from `lg`. Motion: the heading, then the actions, reveal on scroll
// (`RixReveal`).
import Link from "next/link";
import { BookCallLink } from "@/components/BookCallLink";
import { RixReveal } from "@/components/rix/RixReveal";
import { SectionHeading } from "@/components/SectionHeading";
import { wayBack } from "@/content/rix";
import { rixIds } from "@/lib/rixPlayground";
import { container, pillOutline } from "@/lib/styles";

export function RixWayBack() {
  return (
    <section id={rixIds.wayBack} aria-labelledby={rixIds.wayBackTitle} className="px-gutter">
      <div
        className={`${container} flex flex-col gap-8 border-t border-line py-section lg:flex-row lg:items-end lg:justify-between`}
      >
        <SectionHeading
          size="heading-sm"
          id={rixIds.wayBackTitle}
          lead={wayBack.heading.lead}
          accent={wayBack.heading.accent}
          anim="reveal"
        />
        <div data-anim="reveal" data-anim-delay="150" className="flex flex-col gap-3 md:flex-row lg:shrink-0">
          <BookCallLink variant="hero" />
          <Link href="/" className={`${pillOutline} w-full md:w-auto`}>
            {wayBack.home}
          </Link>
        </div>
      </div>
      <RixReveal sectionId={rixIds.wayBack} />
    </section>
  );
}
