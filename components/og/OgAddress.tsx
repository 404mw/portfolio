// The page's address in the sharing images (app/opengraph-image.tsx, app/rix/opengraph-image.tsx):
// one line at 28px in `muted`, placed by `left` and `top`. The face and line height are the
// image's own (home: Plex Sans, line height 1; /rix: the inherited Acosta, normal line height),
// so both are optional and inherit when not given. No hooks or classes: ImageResponse only.
import { tokens } from "@/lib/tokens";

type OgAddressProps = {
  readonly text: string;
  readonly left: number;
  readonly top: number;
  readonly fontFamily?: string;
  readonly lineHeight?: number;
};

export function OgAddress({ text, left, top, fontFamily, lineHeight }: OgAddressProps) {
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        display: "flex",
        fontSize: 28,
        color: tokens.colors.muted,
        ...(fontFamily === undefined ? {} : { fontFamily }),
        ...(lineHeight === undefined ? {} : { lineHeight }),
      }}
    >
      {text}
    </div>
  );
}
