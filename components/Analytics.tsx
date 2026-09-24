// The Umami counting script (lib/analytics.ts). Renders nothing until the website ID is set.
import Script from "next/script";
import { umamiDomains, umamiScriptSrc, umamiWebsiteId } from "@/lib/analytics";

export function Analytics() {
  if (!umamiWebsiteId) return null;

  return (
    <Script
      src={umamiScriptSrc}
      data-website-id={umamiWebsiteId}
      data-domains={umamiDomains}
      strategy="afterInteractive"
    />
  );
}
