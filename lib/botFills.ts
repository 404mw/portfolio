// The bots' colour keys → token fill classes (ui-spec §5.6), shared by the Process mascots and
// Rix's props. Eye holes use the page background.
import type { BotColour } from "@/lib/processBots";

export const botFills: Record<BotColour, string> = {
  B: "fill-accent",
  C: "fill-cream",
  M: "fill-muted",
  D: "fill-cream-muted",
  I: "fill-ink",
  L: "fill-line",
  H: "fill-bg",
};
