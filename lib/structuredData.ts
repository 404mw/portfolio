// The home page's structured data (JSON-LD, schema.org): one graph of two nodes, the site and
// the person behind it. Every string comes from content/shared.ts or lib/site.ts; nothing beyond
// docs/03-facts.md is stated (constitution §7). Rendered by components/StructuredData.tsx.
import { footer, links, structured } from "@/content/shared";
import { siteName, siteUrl } from "@/lib/site";

const websiteId = `${siteUrl}/#website`;
const personId = `${siteUrl}/#person`;

export const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: siteUrl,
      name: siteName,
      inLanguage: "en",
      publisher: { "@id": personId },
    },
    {
      "@type": "Person",
      "@id": personId,
      name: footer.copyrightName,
      alternateName: siteName,
      jobTitle: structured.role,
      description: structured.description,
      url: siteUrl,
      email: links.emailAddress,
      sameAs: [links.linkedin, links.github, links.instagram],
    },
  ],
} as const;
