import { meta } from "@/content/home";
import { pageMetadata } from "@/lib/pageMetadata";

export const metadata = pageMetadata({ ...meta, path: "/" });

export default function Home() {
  // TEMP: removed when the hero lands
  return <div aria-hidden="true" className="min-h-[300vh]" />;
}
