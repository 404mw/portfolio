import type { MetadataRoute } from "next";
import { publishedRoutes } from "@/lib/publishedRoutes";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return publishedRoutes.map((path) => ({ url: absoluteUrl(path) }));
}
