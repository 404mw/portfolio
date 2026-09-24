// The Umami Cloud settings (constitution §11: visits and Book a call clicks, no cookies).
// Counting switches on only when NEXT_PUBLIC_UMAMI_WEBSITE_ID is set at build time, and only
// visits on the live domain are counted, so local and preview builds stay out of the numbers.
export const umamiScriptSrc = "https://cloud.umami.is/script.js";

export const umamiWebsiteId: string | undefined =
  process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID?.trim() || undefined;

export const umamiDomains = "marwix.dev";
