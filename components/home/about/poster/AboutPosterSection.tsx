// About, option B "Poster board" (02a-about-options §2a.B): the split intro, then the board title,
// Rix small at the right end of a shelf, a wall of poster cards, and the picked reply's ack.
// It takes home's ids (lib/aboutScope.ts). `RixMotion` (client, renders nothing) adds the reveal
// and Rix's play.
import { AboutAck } from "@/components/home/about/AboutAck";
import { AboutFrame } from "@/components/home/about/AboutFrame";
import { AboutIntro } from "@/components/home/about/AboutIntro";
import { AboutPrompt } from "@/components/home/about/AboutPrompt";
import { RixMotion } from "@/components/home/about/RixMotion";
import { AboutPosterBoard } from "@/components/home/about/poster/AboutPosterBoard";
import { AboutPosterShelf } from "@/components/home/about/poster/AboutPosterShelf";
import { aboutScope } from "@/lib/aboutScope";

export function AboutPosterSection() {
  const scope = aboutScope();
  return (
    <AboutFrame scope={scope}>
      <AboutIntro />
      <div data-anim="reveal" data-anim-delay="150" className="mt-14 flex flex-col md:mt-20 lg:mt-24">
        <AboutPrompt id={scope.id("prompt")} />
        <AboutPosterShelf quipKey={scope.sectionId} />
        <AboutPosterBoard scope={scope} />
        <AboutAck className="mt-8 max-w-3xl md:mt-10" />
      </div>
      <RixMotion />
    </AboutFrame>
  );
}
