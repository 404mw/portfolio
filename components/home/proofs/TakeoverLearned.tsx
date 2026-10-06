// A takeover's part 5 body, what I learned (ui-spec §7.3.1): the lessons in order, numbered, in
// one column on the reading measure at every width.
import { TakeoverItem } from "@/components/home/proofs/TakeoverItem";
import { listNumber } from "@/lib/listNumber";
import type { ProofTitledLine } from "@/lib/proofProject";

type TakeoverLearnedProps = {
  readonly items: readonly ProofTitledLine[];
};

export function TakeoverLearned({ items }: TakeoverLearnedProps) {
  return (
    <ol className="flex w-full max-w-xl flex-col gap-6">
      {items.map((item, index) => (
        <TakeoverItem key={item.title} title={item.title} line={item.line} number={listNumber(index)} />
      ))}
    </ol>
  );
}
