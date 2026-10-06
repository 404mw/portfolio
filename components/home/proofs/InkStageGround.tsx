// The shared "ink stage" ground (ui-spec/07-proofs-spam.md): ink with a violet glow over a faint "/"
// hatch. Used by the proof card banner and the spam diagram, so it is never forked. `glow` picks the
// glow's anchor ("floor" is the card's, "end" sits near the right end); `className` carries the
// position, radius and visibility. Decorative, so hidden from assistive tech.
import { proofBotShades } from "@/lib/proofBotShades";

const { glow: floorGlow, glowEnd, hatch } = proofBotShades.banner;

const glows = {
  floor: floorGlow,
  end: glowEnd,
} as const;

type InkStageGroundProps = {
  readonly glow: keyof typeof glows;
  readonly className: string;
};

export function InkStageGround({ glow, className }: InkStageGroundProps) {
  return (
    <div
      aria-hidden="true"
      className={`absolute overflow-hidden bg-ink ${className}`}
      style={{ backgroundImage: `${glows[glow]}, ${hatch}` }}
    />
  );
}
