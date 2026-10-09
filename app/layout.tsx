import type { Metadata } from "next";
import { Analytics } from "@/components/Analytics";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SkipLink } from "@/components/SkipLink";
import { acosta, displayPunct, plexMono, plexSans } from "@/lib/fonts";
import { sectionIds } from "@/lib/routes";
import { siteName, siteUrl } from "@/lib/site";
import "./globals.css";

// Makes every page's sharing-preview URL absolute, and gives the site a default title
// (the wordmark from content/shared.ts, via lib/site.ts).
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteName,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${acosta.variable} ${displayPunct.variable} ${plexSans.variable} ${plexMono.variable}`}
    >
      <body className="bg-bg text-text font-body antialiased">
        <SkipLink />
        <SiteHeader />
        <main id={sectionIds.main} tabIndex={-1} className="focus:outline-none">
          {children}
        </main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
