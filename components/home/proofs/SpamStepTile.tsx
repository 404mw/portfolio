// The spam diagram's one swappable tile (ui-spec §7.3.2, §7.6.1): a rounded square with no fill
// and a 2px solid ink border, 96px and 128px from `md` with the border included, holding the
// step's image of Exile Bot's mascot. The takeover's cream shows through. The figure's flat cut
// sits on the border's inner bottom edge. Decorative: the step's heading and line say what it
// shows. Takes the step key only, so a later change replaces this file's contents and nothing else.
import { SiteImage } from "@/components/SiteImage";
import { spamStepImage, type SpamStepKey } from "@/lib/spamDiagram";

type SpamStepTileProps = {
  readonly step: SpamStepKey;
};

export function SpamStepTile({ step }: SpamStepTileProps) {
  return (
    <span className="relative block size-24 overflow-hidden rounded-xl border-2 border-ink md:size-32">
      <SiteImage
        name={spamStepImage[step]}
        alt=""
        sizes="(min-width: 768px) 128px, 96px"
        fit="contain"
        position="bottom"
      />
    </span>
  );
}
