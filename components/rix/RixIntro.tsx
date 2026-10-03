// The /rix intro (ui-spec/01-intro.md §1): the page's title (an h1) and one line. The section is
// `#top`, so the nav turns solid once it passes under the header, as on home. The top padding
// clears the 67px fixed header. Motion: the title, then the line, reveal on load (`RixReveal`).
import { RixReveal } from "@/components/rix/RixReveal";
import { SectionHeading } from "@/components/SectionHeading";
import { intro } from "@/content/rix";
import { rixIds } from "@/lib/rixPlayground";
import { sectionIds } from "@/lib/routes";
import { container } from "@/lib/styles";

export function RixIntro() {
  return (
    <section id={sectionIds.top} aria-labelledby={rixIds.title} className="px-gutter pt-17">
      <div className={`${container} flex flex-col gap-4 pt-12 md:gap-5 md:pt-16 lg:pt-20`}>
        <SectionHeading
          as="h1"
          size="heading"
          id={rixIds.title}
          lead={intro.heading.lead}
          accent={intro.heading.accent}
          anim="reveal"
        />
        <p data-anim="reveal" data-anim-delay="100" className="max-w-xl text-lead text-muted text-pretty">
          {intro.line}
        </p>
      </div>
      <RixReveal sectionId={sectionIds.top} />
    </section>
  );
}
