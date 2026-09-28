// Section 7, Proofs: have they built something real that people use? (ui-spec §7.1). A header
// row (label and heading left, hint right), then the shown project cards (identical), each opening
// its takeover. Each card's `li` keeps headroom for its bot's top break-out (11.2% of its width),
// the column gap holds the right break-out, and `overflow-x-clip` guarantees no sideways scroll.
// `ProofsMotion` (client) renders nothing; it adds the reveals and the cards' hover lift.
import { ProofCard } from "@/components/home/proofs/ProofCard";
import { ProofsMotion } from "@/components/home/proofs/ProofsMotion";
import { SectionHeading } from "@/components/SectionHeading";
import { SectionLabel } from "@/components/SectionLabel";
import { proofs } from "@/content/home";
import { proofGridColumns, proofNumber, proofTarget, shownProofKeys } from "@/lib/proofs";
import { sectionIds } from "@/lib/routes";
import { container, metaLabel } from "@/lib/styles";

export function ProofsSection() {
  return (
    <section id={sectionIds.proofs} className="scroll-mt-20 overflow-x-clip px-gutter">
      <div className={`${container} flex flex-col gap-12 border-t border-line py-section md:gap-16`}>
        <div
          data-anim="reveal"
          className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6"
        >
          <div className="flex flex-col gap-7">
            <SectionLabel number={proofs.number} label={proofs.label} />
            <SectionHeading lead={proofs.heading.lead} accent={proofs.heading.accent} size="heading" />
          </div>
          <p className={metaLabel}>{proofs.hint}</p>
        </div>
        <ul className={`grid gap-x-12 gap-y-8 ${proofGridColumns}`}>
          {shownProofKeys.map((key) => {
            const project = proofs.projects[key];
            return (
              <li key={key} className="pt-[11.2%]">
                <ProofCard
                  href={proofTarget(key).href}
                  project={key}
                  number={proofNumber(key)}
                  tag={project.tag}
                  title={project.title}
                  cardLine={project.cardLine}
                  proofLine={project.proofLine}
                />
              </li>
            );
          })}
        </ul>
      </div>
      <ProofsMotion />
    </section>
  );
}
