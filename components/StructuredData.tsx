// The page's structured data as a JSON-LD script (server component). Data only, never shown.
// A native <script>, with `<` escaped, as the Next JSON-LD guide says. The data is
// lib/structuredData.ts.
import { structuredData } from "@/lib/structuredData";

export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
      }}
    />
  );
}
