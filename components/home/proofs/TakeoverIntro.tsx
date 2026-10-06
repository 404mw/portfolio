// A takeover's part 1, what it is (ui-spec §7.3.1): the intro line and the info rows. No eyebrow
// and no headline: the title is its heading and the first row reads WHAT IT IS. Phone and tablet:
// intro, then rows; from `lg` the rows sit in the left rail, level with the intro.
import { TakeoverInfoRows } from "@/components/home/proofs/TakeoverInfoRows";
import type { ProofProject } from "@/lib/proofProject";

type TakeoverIntroProps = {
  readonly intro: string;
  readonly rows: ProofProject["rows"];
};

export function TakeoverIntro({ intro, rows }: TakeoverIntroProps) {
  return (
    <div
      data-anim="takeover-part"
      data-part="intro"
      className="grid gap-x-10 gap-y-8 border-t border-ink/15 pt-8 md:pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]"
    >
      <p
        data-anim="takeover-intro"
        className="max-w-2xl text-summary leading-[1.4] tracking-[-0.01em] text-pretty text-ink lg:col-start-2 lg:row-start-1"
      >
        {intro}
      </p>
      <div data-anim="takeover-rows" className="max-w-xl lg:col-start-1 lg:row-start-1">
        <TakeoverInfoRows
          whatItIs={rows.whatItIs}
          built={rows.built}
          inUse={rows.inUse}
          inUseStats={rows.inUseStats}
        />
      </div>
    </div>
  );
}
