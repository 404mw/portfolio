// Rix's speech bubble on the home sharing image (docs/pages/home/ui-spec.md §0.7, choice 49): the
// Agents demos' agent chat bubble (accent fill, radius 12 with the bottom-right corner 4, padding
// 14 / 18) holding one line of text. Placed by the image through `right` and `top`. No hooks or
// classes: ImageResponse only.
import { tokens } from "@/lib/tokens";

type OgSpeechBubbleProps = {
  readonly text: string;
  readonly right: number;
  readonly top: number;
  readonly fontFamily: string;
};

export function OgSpeechBubble({ text, right, top, fontFamily }: OgSpeechBubbleProps) {
  const { colors } = tokens;
  return (
    <div
      style={{
        position: "absolute",
        right,
        top,
        display: "flex",
        alignItems: "center",
        padding: "14px 18px",
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 4,
        background: colors.accent,
        color: colors.onAccent,
        fontFamily,
        maxWidth: 288,
        fontSize: 18,
        lineHeight: 1.3,
      }}
    >
      <span style={{ whiteSpace: "nowrap" }}>{text}</span>
    </div>
  );
}
