// A takeover's part 4 body, what it took (ui-spec §7.3.1): the items, one column, two from `sm`.
import { TakeoverItem } from "@/components/home/proofs/TakeoverItem";
import type { ProofTitledLine } from "@/lib/proofProject";

type TakeoverTookProps = {
  readonly items: readonly ProofTitledLine[];
};

export function TakeoverTook({ items }: TakeoverTookProps) {
  return (
    <ul className="grid w-full gap-x-10 gap-y-7 sm:grid-cols-2">
      {items.map((item) => (
        <TakeoverItem key={item.title} title={item.title} line={item.line} />
      ))}
    </ul>
  );
}
