// Section 7, Proofs: have they built something real that people use? (ui-spec §7.1). The label,
// heading and hint, then the three identical project cards, each opening its takeover.
import { ProofCard } from "@/components/home/proofs/ProofCard";
import { SectionHeading } from "@/components/SectionHeading";
import { SectionLabel } from "@/components/SectionLabel";
import { proofs } from "@/content/home";
import { proofImages, proofKeys, proofNumber, proofTarget } from "@/lib/proofs";
import { sectionIds } from "@/lib/routes";
import { container, metaLabel } from "@/lib/styles";

export function ProofsSection() {
  return (
    <section id={sectionIds.proofs} className="scroll-mt-20 px-gutter">
      <div className={`${container} flex flex-col gap-12 border-t border-line py-section md:gap-16 lg:gap-20`}>
        <div data-anim="reveal" className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-7">
            <SectionLabel number={proofs.number} label={proofs.label} />
            <SectionHeading lead={proofs.heading.lead} accent={proofs.heading.accent} size="heading" />
          </div>
          <p className={metaLabel}>{proofs.hint}</p>
        </div>
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {proofKeys.map((key) => {
            const project = proofs.projects[key];
            return (
              <li key={key}>
                <ProofCard
                  href={proofTarget(key).href}
                  number={proofNumber(key)}
                  tag={project.tag}
                  title={project.title}
                  cardLine={project.cardLine}
                  shot={proofImages(key).card}
                  shotAlt={project.cardShotAlt}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
