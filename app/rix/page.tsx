import { RixIntro } from "@/components/rix/RixIntro";
import { RixPlayground } from "@/components/rix/RixPlayground";
import { RixWayBack } from "@/components/rix/RixWayBack";
import { meta } from "@/content/rix";
import { pageMetadata } from "@/lib/pageMetadata";
import { rixPath } from "@/lib/publishedRoutes";

export const metadata = pageMetadata({ ...meta, path: rixPath });

export default function Rix() {
  return (
    <>
      <RixIntro />
      <RixPlayground />
      <RixWayBack />
    </>
  );
}
