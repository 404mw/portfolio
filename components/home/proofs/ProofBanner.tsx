// A proof card's banner (ui-spec §7.2): the 2.2:1 "ink stage". The ground is the shared ink stage
// (`InkStageGround`, floor glow). Above it, the break-out layer holds the bot: its clip cuts
// everything below the banner floor and lets the bot out above and to the sides.
// Decorative, so hidden from assistive tech.
import { InkStageGround } from "@/components/home/proofs/InkStageGround";
import { ProofBot } from "@/components/home/proofs/ProofBot";
import type { ProofProp } from "@/lib/proofBotProps";

type ProofBannerProps = {
  readonly targetId: string;
  readonly prop: ProofProp;
};

export function ProofBanner({ targetId, prop }: ProofBannerProps) {
  return (
    <div aria-hidden="true" className="relative m-2.5 aspect-[2.2/1]">
      <InkStageGround glow="floor" anim="proof-banner" className="inset-0 rounded-xl" />
      <div
        data-anim="proof-bot-layer"
        className="pointer-events-none absolute inset-0 [clip-path:inset(-120%_-60%_0_-60%)]"
      >
        <ProofBot targetId={targetId} prop={prop} />
      </div>
    </div>
  );
}
