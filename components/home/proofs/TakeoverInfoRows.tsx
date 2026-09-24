// A takeover's three info rows (ui-spec §7.3 part 3): WHAT IT IS, BUILT and IN USE, with the
// IN USE numbers below their line when the project has them.
import { TakeoverInfoRow } from "@/components/home/proofs/TakeoverInfoRow";
import { TakeoverStats } from "@/components/home/proofs/TakeoverStats";
import { proofs } from "@/content/home";
import type { ProofStat } from "@/lib/proofs";

type TakeoverInfoRowsProps = {
  readonly whatItIs: string;
  readonly built: string;
  readonly inUse: string;
  readonly inUseStats?: readonly ProofStat[];
};

export function TakeoverInfoRows({ whatItIs, built, inUse, inUseStats }: TakeoverInfoRowsProps) {
  const labels = proofs.takeover.rowLabels;

  return (
    <dl className="grid grid-cols-[5.5rem_minmax(0,1fr)] content-start gap-x-5 gap-y-3.5 text-body">
      <TakeoverInfoRow label={labels.whatItIs}>{whatItIs}</TakeoverInfoRow>
      <TakeoverInfoRow label={labels.built}>{built}</TakeoverInfoRow>
      <TakeoverInfoRow label={labels.inUse}>
        {inUse}
        {inUseStats && <TakeoverStats stats={inUseStats} />}
      </TakeoverInfoRow>
    </dl>
  );
}
