// The takeover layer (ui-spec §0.1): one dialog per shown project, in page order, and the controller
// that opens them from the hash. Rendered once, after the last section.
import { ProjectTakeover } from "@/components/home/proofs/ProjectTakeover";
import { TakeoverController } from "@/components/home/proofs/TakeoverController";
import { shownProofKeys } from "@/lib/proofs";

export function ProjectTakeovers() {
  return (
    <>
      {shownProofKeys.map((key) => (
        <ProjectTakeover key={key} projectKey={key} />
      ))}
      <TakeoverController />
    </>
  );
}
