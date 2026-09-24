// One project's full-screen takeover (ui-spec §7.3): a native dialog named by its title, with the
// same seven parts for every project. Without JS, `:target` shows it; with JS,
// hooks/useHashTakeover.ts opens it as a modal from the hash and `:target` is switched off
// (`data-takeover-js` on <html>), so only the `open` state shows it.
import { ProjectVisitLink } from "@/components/home/proofs/ProjectVisitLink";
import { TakeoverInfoRows } from "@/components/home/proofs/TakeoverInfoRows";
import { TakeoverNextLink } from "@/components/home/proofs/TakeoverNextLink";
import { TakeoverShots } from "@/components/home/proofs/TakeoverShots";
import { TakeoverTopBar } from "@/components/home/proofs/TakeoverTopBar";
import { links, proofs } from "@/content/home";
import {
  nextProofKey,
  proofImages,
  proofNumber,
  proofTarget,
  takeoverTitleId,
  type ProofKey,
} from "@/lib/proofs";
import { condensed, container } from "@/lib/styles";

type ProjectTakeoverProps = {
  readonly projectKey: ProofKey;
};

export function ProjectTakeover({ projectKey }: ProjectTakeoverProps) {
  const project = proofs.projects[projectKey];
  const { id } = proofTarget(projectKey);
  const titleId = takeoverTitleId(id);
  const images = proofImages(projectKey);
  const next = nextProofKey(projectKey);
  const rows = project.rows;

  return (
    <dialog
      id={id}
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 m-0 hidden h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain border-0 bg-cream p-0 text-ink open:block [:root:not([data-takeover-js])_&:target]:block"
    >
      <div data-anim="takeover-content">
        <TakeoverTopBar number={proofNumber(projectKey)} tag={project.tag} />
        <div className="px-gutter">
          <div className={`${container} flex flex-col gap-10 pt-10 md:gap-14 md:pt-16 lg:gap-18 lg:pt-22`}>
            <h2
              id={titleId}
              className={`font-display text-takeover leading-[0.88] font-semibold tracking-[-0.045em] text-ink ${condensed}`}
            >
              {project.title}
            </h2>
            <div className="grid gap-10 border-t border-ink/15 pt-8 md:grid-cols-2">
              <TakeoverInfoRows
                whatItIs={rows.whatItIs}
                built={rows.built}
                inUse={rows.inUse}
                inUseStats={"inUseStats" in rows ? rows.inUseStats : undefined}
              />
              <p className="text-summary leading-[1.4] tracking-[-0.01em] text-pretty text-ink">
                {project.summary}
              </p>
            </div>
            <TakeoverShots shots={images.shots} alts={project.shotAlts} />
            <ProjectVisitLink href={links[projectKey]} label={project.visitLabel} />
            <TakeoverNextLink href={proofTarget(next).href} title={proofs.projects[next].title} />
          </div>
        </div>
      </div>
    </dialog>
  );
}
