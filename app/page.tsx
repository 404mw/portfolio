import { AgentsSection } from "@/components/home/agents/AgentsSection";
import { ContactSection } from "@/components/home/contact/ContactSection";
import { HeroSection } from "@/components/home/hero/HeroSection";
import { MarqueeStrip } from "@/components/home/MarqueeStrip";
import { ProcessSection } from "@/components/home/process/ProcessSection";
import { ProjectTakeovers } from "@/components/home/proofs/ProjectTakeovers";
import { ProofsSection } from "@/components/home/proofs/ProofsSection";
import { WebSection } from "@/components/home/web/WebSection";
import { meta } from "@/content/home";
import { pageMetadata } from "@/lib/pageMetadata";

export const metadata = pageMetadata({ ...meta, path: "/" });

export default function Home() {
  return (
    <>
      <HeroSection />
      <MarqueeStrip />
      <AgentsSection />
      <ProcessSection />
      <WebSection />
      <ProofsSection />
      <ContactSection />
      <ProjectTakeovers />
    </>
  );
}
