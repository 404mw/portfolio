// The site-wide sharing preview (1200×630): the MARWIX wordmark with the "W" in the accent,
// centred on the background. Colours come from lib/tokens.ts, the token mirror for OG images.
// The font is the static Geist Mono 800 face in assets/fonts (OFL), read from disk when the
// image is built.
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { footer } from "@/content/shared";
import { siteName } from "@/lib/site";
import { tokens } from "@/lib/tokens";

export const alt = siteName;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fontPath = join(process.cwd(), "assets", "fonts", "GeistMono-ExtraBold.ttf");

export default async function OpengraphImage() {
  const { colors } = tokens;
  const { lead, accent, tail } = footer.wordmark;
  const geistMono = await readFile(fontPath);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: colors.bg,
          color: colors.text,
          fontFamily: "Geist Mono",
          fontSize: 120,
          fontWeight: 800,
          letterSpacing: "0.02em",
        }}
      >
        <span>{lead}</span>
        <span style={{ color: colors.accent }}>{accent}</span>
        <span>{tail}</span>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Geist Mono", data: geistMono, weight: 800, style: "normal" }],
    },
  );
}
