// The site's address and name, for metadata, the sitemap and robots.txt. The name is the
// wordmark from content/shared.ts, so no brand text is typed here.
import { footer } from "@/content/shared";

export const siteUrl = "https://marwix.dev";

const { lead, accent, tail } = footer.wordmark;
export const siteName = `${lead}${accent}${tail}`;

/** An absolute URL on the site for a path such as "/" or "/exile". */
export function absoluteUrl(path: string): string {
  return new URL(path, siteUrl).toString();
}

/** The site's address as a sharing image shows it, without the scheme: "marwix.dev", "marwix.dev/rix". */
export function siteAddress(path = ""): string {
  return `${new URL(siteUrl).host}${path === "/" ? "" : path}`;
}
