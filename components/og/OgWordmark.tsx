// The MARWIX wordmark for the sharing images (app/opengraph-image.tsx, app/rix/opengraph-image.tsx):
// the three parts of `footer.wordmark` with the W in the accent, in Acosta. Each image places it
// through `style`. No hooks or classes: ImageResponse only.
import type { CSSProperties } from "react";
import { footer } from "@/content/shared";
import { tokens } from "@/lib/tokens";

type OgWordmarkProps = {
  readonly style: CSSProperties;
};

export function OgWordmark({ style }: OgWordmarkProps) {
  const { lead, accent, tail } = footer.wordmark;
  return (
    <div style={{ display: "flex", ...style }}>
      <span>{lead}</span>
      <span style={{ color: tokens.colors.accent }}>{accent}</span>
      <span>{tail}</span>
    </div>
  );
}
