// A proof card's banner (ui-spec §7.2): the 2.2:1 "ink stage". The ground is ink with a violet glow
// rising from the floor over a faint "/" hatch. Above it, the break-out layer holds the bot: its
// clip cuts everything below the banner floor and lets the bot out above and to the sides.
// Decorative, so hidden from assistive tech.
import { ProofBot } from "@/components/home/proofs/ProofBot";
import type { ProofProp } from "@/lib/proofBotProps";
import { proofBotShades } from "@/lib/proofBotShades";

type ProofBannerProps = {
  readonly targetId: string;
  readonly prop: ProofProp;
};

const { glow, hatch } = proofBotShades.banner;

export function ProofBanner({ targetId, prop }: ProofBannerProps) {
  return (
    <div aria-hidden="true" className="relative m-2.5 aspect-[2.2/1]">
      <div className="absolute inset-0 overflow-hidden rounded-xl bg-ink" style={{ backgroundImage: `${glow}, ${hatch}` }} />
      <div
        data-anim="proof-bot-layer"
        className="pointer-events-none absolute inset-0 [clip-path:inset(-120%_-60%_0_-60%)]"
      >
        <ProofBot targetId={targetId} prop={prop} />
      </div>
    </div>
  );
}
