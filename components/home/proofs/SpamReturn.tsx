// The spam diagram's way back, from step 3 to step 1 (ui-spec/07-proofs-spam.md). Phone: a 2px
// dashed box under the bands. From `md`: a dashed U open at the top, its legs under figure 1's and
// figure 3's centres (each column's figure offset plus half the figure: 80 / 112 / 156 in at `md` /
// `lg` / `xl`), with an arrowhead on the left leg; the pill and its line centred inside.
import { monoPill } from "@/lib/styles";

type SpamReturnProps = {
  readonly label: string;
  readonly line: string;
};

export function SpamReturn({ label, line }: SpamReturnProps) {
  return (
    <div
      data-anim="spam-return"
      className="relative mt-3 flex flex-wrap items-center gap-x-4 gap-y-2.5 rounded-3xl border-2 border-dashed border-ink px-5 py-4 md:mt-7 md:mr-[calc((100%-3.5rem)/3-5rem)] md:ml-20 md:justify-center md:rounded-t-none md:border-t-0 md:px-7 md:pt-7.5 md:pb-5 md:text-center lg:mr-[calc((100%-3.5rem)/3-7rem)] lg:ml-28 xl:mr-[calc((100%-3.5rem)/3-9.75rem)] xl:ml-39"
    >
      <span
        aria-hidden="true"
        data-anim="spam-return-head"
        className="absolute -top-px -left-[5.5px] hidden size-2.25 rotate-45 border-t-2 border-l-2 border-ink md:block"
      />
      <strong data-anim="spam-pill" className={`${monoPill} bg-ink text-cream`}>
        <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-current" />
        {label}
      </strong>
      <p className="min-w-0 flex-[1_1_15rem] text-body leading-normal text-ink md:flex-initial">{line}</p>
    </div>
  );
}
