// The /rix sharing preview (1200×630, docs/pages/rix/ui-spec.md §0.5): the wordmark, the page's
// title and its address down the left; Rix standing on a floor line on the right. Colours come
// from lib/tokens.ts, the token mirror for OG images; the font is Acosta, the display face
// (lib/ogFonts.ts).
import { ImageResponse } from "next/og";
import { OgAddress } from "@/components/og/OgAddress";
import { OgFloorLine } from "@/components/og/OgFloorLine";
import { OgWordmark } from "@/components/og/OgWordmark";
import { RixOgFigure } from "@/components/rix/RixOgFigure";
import { intro, meta } from "@/content/rix";
import { ogDisplayFamily, ogFonts } from "@/lib/ogFonts";
import { rixPath } from "@/lib/publishedRoutes";
import { siteAddress } from "@/lib/site";
import { tokens } from "@/lib/tokens";

export const alt = meta.ogAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Rix's box: 510 × 330 (1 unit = 3px), right edge at x 1120, feet on the floor at y 500. */
const rixBox = { width: 510, height: 330, right: 1120, floor: 500 };

export default async function OpengraphImage() {
  const { colors } = tokens;

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
          fontFamily: ogDisplayFamily,
          fontWeight: 400,
        }}
      >
        <OgWordmark style={{ position: "absolute", left: 80, top: 80, fontSize: 36 }} />
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 200,
            width: 480,
            display: "flex",
            flexWrap: "wrap",
            columnGap: 38,
            fontSize: 64,
            lineHeight: 1,
          }}
        >
          <span>{intro.heading.lead}</span>
          <span style={{ color: colors.accent }}>{intro.heading.accent}</span>
        </div>
        <OgAddress text={siteAddress(rixPath)} left={80} top={540} />
        <OgFloorLine left={80} right={rixBox.right} top={rixBox.floor} />
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
    { ...size, fonts: await ogFonts(["display"]) },
  );
}
