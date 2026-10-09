// The site-wide sharing preview (1200×630, docs/pages/home/ui-spec.md §0.7), paired with /rix's:
// the wordmark, the name in two lines, the role line and the address down the left; Rix on a
// floor line mid-right, with a speech bubble over his head. Colours come from lib/tokens.ts, the
// token mirror for OG images. Two faces (lib/ogFonts.ts): Acosta for the wordmark and the name,
// IBM Plex Sans 400 for the body text, since Acosta has no punctuation.
import { ImageResponse } from "next/og";
import { OgAddress } from "@/components/og/OgAddress";
import { OgFloorLine } from "@/components/og/OgFloorLine";
import { OgSpeechBubble } from "@/components/og/OgSpeechBubble";
import { OgWordmark } from "@/components/og/OgWordmark";
import { RixOgFigure } from "@/components/rix/RixOgFigure";
import { hero, meta } from "@/content/home";
import { ogBodyFamily, ogDisplayFamily, ogFonts } from "@/lib/ogFonts";
import { siteAddress } from "@/lib/site";
import { tokens } from "@/lib/tokens";

export const alt = meta.ogAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Rix's box: 340 × 220 (1 unit = 2px), top-left at 620, 280, feet on the floor at y 500. */
const rixBox = { left: 620, top: 280, width: 340, height: 220 };
const floor = { left: 80, right: 1120, top: 500 };
/** The bubble's right edge and top, over Rix's head. */
const bubble = { right: 844, top: 268 };

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
        <OgWordmark style={{ position: "absolute", left: 80, top: 80, fontSize: 36, lineHeight: 1 }} />
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 168,
            display: "flex",
            flexDirection: "column",
            fontSize: 72,
            lineHeight: 1,
            textTransform: "uppercase",
            color: colors.accent,
          }}
        >
          <span style={{ display: "flex" }}>{hero.firstName}</span>
          <span style={{ display: "flex" }}>{hero.lastName}</span>
        </div>
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 360,
            width: 540,
            display: "flex",
            fontFamily: ogBodyFamily,
            fontSize: 30,
            lineHeight: 1.3,
          }}
        >
          {meta.ogLine}
        </div>
        <OgFloorLine left={floor.left} right={floor.right} top={floor.top} />
        <div style={{ position: "absolute", left: rixBox.left, top: rixBox.top, display: "flex" }}>
          <RixOgFigure width={rixBox.width} height={rixBox.height} />
        </div>
        <OgSpeechBubble
          text={meta.ogBubble}
          right={size.width - bubble.right}
          top={bubble.top}
          fontFamily={ogBodyFamily}
        />
        <OgAddress text={siteAddress()} left={80} top={522} fontFamily={ogBodyFamily} lineHeight={1} />
      </div>
    ),
    { ...size, fonts: await ogFonts(["display", "body"]) },
  );
}
