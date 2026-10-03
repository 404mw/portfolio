// The bots' colour keys → token colour values (lib/tokens.ts), for drawing a bot where CSS classes
// can't reach: the /rix sharing image. ProcessBot uses lib/botFills.ts (classes) instead.
import type { BotColour } from "@/lib/processBots";
import { tokens } from "@/lib/tokens";

const { colors } = tokens;

export const botTokenColours: Record<BotColour, string> = {
  B: colors.accent,
  C: colors.cream,
  M: colors.muted,
  D: colors.creamMuted,
  I: colors.ink,
  L: colors.line,
  H: colors.bg,
};
