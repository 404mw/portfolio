// About's frame (02a-about-options §2a.O0, ui-spec §0.1): the section (its scoped id), then the
// `group/about` root that every show-on-pick class keys on, holding About's content and its live
// status. `AboutForParam` (client) renders nothing; it applies `?for=` to the radio group.
import type { ReactNode } from "react";
import { AboutForParam } from "@/components/home/about/AboutForParam";
import { AboutStatus } from "@/components/home/about/AboutStatus";
import type { AboutScope } from "@/lib/aboutScope";
import { container } from "@/lib/styles";

type AboutFrameProps = {
  readonly scope: AboutScope;
  readonly children: ReactNode;
};

export function AboutFrame({ scope, children }: AboutFrameProps) {
  return (
    <section id={scope.sectionId} className="scroll-mt-20 px-gutter">
      <div className={`group/about ${container} py-section`}>
        {children}
        <AboutStatus name={scope.name} />
      </div>
      <AboutForParam name={scope.name} />
    </section>
  );
}
