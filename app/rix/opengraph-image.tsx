// The /rix sharing preview (1200×630, docs/pages/rix/ui-spec.md §0.5): the wordmark, the page's
// title and its address down the left; Rix standing on a floor line on the right. Colours come
// from lib/tokens.ts, the token mirror for OG images; the font is the static Geist Mono 800 face in
// assets/fonts (OFL), read from disk when the image is built.
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { RixOgFigure } from "@/components/rix/RixOgFigure";
import { intro, meta } from "@/content/rix";
import { footer } from "@/content/shared";
import { rixPath } from "@/lib/publishedRoutes";
import { siteUrl } from "@/lib/site";
import { tokens } from "@/lib/tokens";

export const alt = meta.ogAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fontPath = join(process.cwd(), "assets", "fonts", "GeistMono-ExtraBold.ttf");

/** Rix's box: 510 × 330 (1 unit = 3px), right edge at x 1120, feet on the floor at y 500. */
const rixBox = { width: 510, height: 330, right: 1120, floor: 500 };

export default async function OpengraphImage() {
  const { colors } = tokens;
  const { lead, accent, tail } = footer.wordmark;
  const address = `${new URL(siteUrl).host}${rixPath}`;
  const geistMono = await readFile(fontPath);

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          background: colors.bg,
          color: colors.text,
          fontFamily: "Geist Mono",
          fontWeight: 800,
        }}
      >
        <div style={{ position: "absolute", left: 80, top: 80, display: "flex", fontSize: 36 }}>
          <span>{lead}</span>
          <span style={{ color: colors.accent }}>{accent}</span>
          <span>{tail}</span>
        </div>
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 200,
            width: 480,
            display: "flex",
            flexWrap: "wrap",
            columnGap: 43,
            fontSize: 72,
            lineHeight: 1,
          }}
        >
          <span>{intro.heading.lead}</span>
          <span style={{ color: colors.accent }}>{intro.heading.accent}</span>
        </div>
        <div style={{ position: "absolute", left: 80, top: 540, display: "flex", fontSize: 28, color: colors.muted }}>
          {address}
        </div>
        <div
          style={{
            position: "absolute",
            left: 80,
            top: rixBox.floor,
            width: rixBox.right - 80,
            height: 2,
            background: colors.line,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: rixBox.right - rixBox.width,
            top: rixBox.floor - rixBox.height,
            display: "flex",
          }}
        >
          <RixOgFigure width={rixBox.width} height={rixBox.height} />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Geist Mono", data: geistMono, weight: 800, style: "normal" }],
    },
  );
}
