import { HeroSection } from "@/components/home/hero/HeroSection";
import { MarqueeStrip } from "@/components/home/MarqueeStrip";
import { meta } from "@/content/home";
import { pageMetadata } from "@/lib/pageMetadata";

export const metadata = pageMetadata({ ...meta, path: "/" });

export default function Home() {
  return (
    <>
      <HeroSection />
      <MarqueeStrip />
      {/* TEMP: removed as sections land (scroll room to check the Nav's solid switch) */}
      <div aria-hidden="true" className="min-h-[150vh]" />
    </>
  );
}
