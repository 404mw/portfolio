// The takeover layer (ui-spec §0.1): one dialog per project, in page order, and the controller
// that opens them from the hash. Rendered once, after the last section.
import { ProjectTakeover } from "@/components/home/proofs/ProjectTakeover";
import { TakeoverController } from "@/components/home/proofs/TakeoverController";
import { proofKeys } from "@/lib/proofs";

export function ProjectTakeovers() {
  return (
    <>
      {proofKeys.map((key) => (
        <ProjectTakeover key={key} projectKey={key} />
      ))}
      <TakeoverController />
    </>
  );
}
