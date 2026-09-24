// The one helper every page uses to turn its `content/<page>.ts` meta into Next metadata:
// title, description and the sharing preview (Open Graph and Twitter). The preview image
// comes from app/opengraph-image.tsx; `metadataBase` in app/layout.tsx makes URLs absolute.
import type { Metadata } from "next";
import { siteName } from "@/lib/site";

type PageMeta = {
  readonly title: string;
  readonly description: string;
  readonly path: string;
};

export function pageMetadata({ title, description, path }: PageMeta): Metadata {
  return {
    title,
    description,
    openGraph: { title, description, url: path, siteName, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}
