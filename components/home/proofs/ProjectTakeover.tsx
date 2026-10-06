// One project's full-screen takeover (ui-spec §7.3): a native dialog named by its title, with the
// same parts in the same order for every project: what it is, the problem, what I built, what it
// took, what I learned and the showcase (only when the project has them), what this means for
// you, then Next.
// Every part is a direct child of the column, a sibling of the title, so the open, close and Next
// motion (hooks/useTakeoverMotion.ts) moves them all. Without JS, `:target` shows it; with JS,
// hooks/useHashTakeover.ts opens it as a modal from the hash and `:target` is switched off
// (`data-takeover-js` on <html>), so only the `open` state shows it.
import { ProjectVisitLink } from "@/components/home/proofs/ProjectVisitLink";
import { SpamDiagram } from "@/components/home/proofs/SpamDiagram";
import { TakeoverIntro } from "@/components/home/proofs/TakeoverIntro";
import { TakeoverLearned } from "@/components/home/proofs/TakeoverLearned";
import { TakeoverMeans } from "@/components/home/proofs/TakeoverMeans";
import { TakeoverNextLink } from "@/components/home/proofs/TakeoverNextLink";
import { TakeoverPart } from "@/components/home/proofs/TakeoverPart";
import { TakeoverShots } from "@/components/home/proofs/TakeoverShots";
import { TakeoverShowcase } from "@/components/home/proofs/TakeoverShowcase";
import { TakeoverTook } from "@/components/home/proofs/TakeoverTook";
import { TakeoverTopBar } from "@/components/home/proofs/TakeoverTopBar";
import { links, proofs } from "@/content/home";
import { proofProject } from "@/lib/proofProject";
import {
  nextProofKey,
  proofImages,
  proofNumber,
  proofTarget,
  takeoverPartId,
  takeoverTitleId,
  type ProofKey,
} from "@/lib/proofs";
import { condensed, container, takeoverText } from "@/lib/styles";

type ProjectTakeoverProps = {
  readonly projectKey: ProofKey;
};

export function ProjectTakeover({ projectKey }: ProjectTakeoverProps) {
  const project = proofProject(projectKey);
  const { id } = proofTarget(projectKey);
  const titleId = takeoverTitleId(id);
  const images = proofImages(projectKey);
  const next = nextProofKey(projectKey);
  const labels = proofs.takeover.partLabels;
  const { whatItTook, whatILearned, showcase } = project;

  return (
    <dialog
      id={id}
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 m-0 hidden h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain border-0 bg-cream p-0 text-ink open:block data-sliding:backdrop:bg-transparent [:root:not([data-takeover-js])_&:target]:block"
    >
      <div data-anim="takeover-content">
        <TakeoverTopBar number={proofNumber(projectKey)} tag={project.tag} />
        <div className="px-gutter">
          <div className={`${container} flex flex-col gap-10 pt-10 md:gap-14 md:pt-16 lg:gap-18 lg:pt-22`}>
            <h2
              id={titleId}
              data-anim="takeover-title"
              className={`font-display text-takeover leading-[0.88] font-semibold tracking-[-0.045em] text-ink ${condensed}`}
            >
              {project.title}
            </h2>
            <TakeoverIntro intro={project.intro} rows={project.rows} />
            <TakeoverPart
              part="problem"
              headlineId={takeoverPartId(id, "problem")}
              label={labels.problem}
              headline={project.problem.headline}
            >
              <p className={takeoverText}>{project.problem.body}</p>
            </TakeoverPart>
            <TakeoverPart
              part="built"
              headlineId={takeoverPartId(id, "built")}
              label={labels.whatIBuilt}
              headline={project.whatIBuilt.headline}
              wide={
                <>
                  <TakeoverShots shots={images.shots} alts={project.shotAlts} />
                  <ProjectVisitLink href={links[projectKey]} label={project.visitLabel} />
                </>
              }
            >
              <p className={takeoverText}>{project.whatIBuilt.body}</p>
            </TakeoverPart>
            {whatItTook && (
              <TakeoverPart
                part="took"
                headlineId={takeoverPartId(id, "took")}
                label={labels.whatItTook}
                headline={whatItTook.headline}
              >
                <TakeoverTook items={whatItTook.items} />
              </TakeoverPart>
            )}
            {whatILearned && (
              <TakeoverPart
                part="learned"
                headlineId={takeoverPartId(id, "learned")}
                label={labels.whatILearned}
                headline={whatILearned.headline}
              >
                <TakeoverLearned items={whatILearned.items} />
              </TakeoverPart>
            )}
            {showcase && (
              <TakeoverPart
                part="showcase"
                headlineId={takeoverPartId(id, "showcase")}
                label={labels.showcase}
                headline={showcase.headline}
                wide={
                  <SpamDiagram
                    steps={showcase.steps}
                    returnLabel={showcase.returnLabel}
                    returnLine={showcase.returnLine}
                  />
                }
              >
                <TakeoverShowcase status={showcase.status} body={showcase.body} />
              </TakeoverPart>
            )}
            <TakeoverMeans
              headlineId={takeoverPartId(id, "means")}
              label={labels.meansForYou}
              lines={project.meansForYou}
            />
            <TakeoverNextLink href={proofTarget(next).href} title={proofs.projects[next].title} />
          </div>
        </div>
      </div>
    </dialog>
  );
}
