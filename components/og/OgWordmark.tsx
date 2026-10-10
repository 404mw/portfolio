// The MARWIX wordmark for the sharing images (app/opengraph-image.tsx, app/rix/opengraph-image.tsx):
// the letters from `wordmarkLetters()` (lib/wordmarkLetters.ts), one span each, with the M and W in
// the accent like the footer wordmark (ui-spec §9.1), in Acosta. Each image places it through
// `style`. No hooks or classes: ImageResponse only.
import type { CSSProperties } from "react";
import { tokens } from "@/lib/tokens";
import { wordmarkLetters } from "@/lib/wordmarkLetters";

type OgWordmarkProps = {
  readonly style: CSSProperties;
};

export function OgWordmark({ style }: OgWordmarkProps) {
  return (
    <div style={{ display: "flex", ...style }}>
      {wordmarkLetters().map(({ letter, accent }, i) => (
        <span key={i} style={accent ? { color: tokens.colors.accent } : undefined}>
          {letter}
        </span>
      ))}
    </div>
  );
}
