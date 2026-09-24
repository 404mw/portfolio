// The takeover's sticky top bar (ui-spec §7.3 part 1): "PROOF 0n / 03 · tag" and the Close link.
import { TakeoverCloseLink } from "@/components/home/proofs/TakeoverCloseLink";
import { proofs } from "@/content/home";
import { proofTotal } from "@/lib/proofs";

type TakeoverTopBarProps = {
  readonly number: string;
  readonly tag: string;
};

export function TakeoverTopBar({ number, tag }: TakeoverTopBarProps) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-ink/15 bg-cream px-gutter py-3 font-mono text-nav text-cream-muted md:py-4.5">
      <p className="uppercase">
        {proofs.takeover.proof} {number} / {proofTotal} · {tag}
      </p>
      <TakeoverCloseLink />
    </div>
  );
}
