// The showcase diagram's way back (ui-spec/07-proofs-spam.md), one markup for both: the outer box,
// the loop `span` holding the arrowhead and the pill, then the line. Phone, both: a 2px dashed box
// under the bands. From `md`:
// - `first` (Exile): a dashed U open at the top from step 3 back to step 1, its legs under figure
//   1's and figure 3's centres (80 / 112 / 156 in at `md` / `lg` / `xl`), the arrowhead on the left
//   leg; the pill and its line centred inside. The loop `span` is `contents`, so it adds no box.
// - `last` (MARWIX-SKILLS): a three-column grid; the loop is an open-topped dashed U exactly under
//   the last figure (160 / 216 / 268 wide), the pill inside, the arrowhead on its left leg pointing
//   back up into the last step; the line beside it under steps 1–2, ending at the gap. A fix is one
//   edit on the last step, not a start over.
import type { ShowcaseReturnTo } from "@/lib/showcaseDiagram";
import { monoPill } from "@/lib/styles";

const phoneBox =
  "relative mt-3 flex flex-wrap items-center gap-x-4 gap-y-2.5 rounded-3xl border-2 border-dashed border-ink px-5 py-4";

const variants: Record<ShowcaseReturnTo, { readonly box: string; readonly loop: string; readonly line: string }> = {
  first: {
    box: `${phoneBox} md:mt-7 md:mr-[calc((100%-3.5rem)/3-5rem)] md:ml-20 md:justify-center md:rounded-t-none md:border-t-0 md:px-7 md:pt-7.5 md:pb-5 md:text-center lg:mr-[calc((100%-3.5rem)/3-7rem)] lg:ml-28 xl:mr-[calc((100%-3.5rem)/3-9.75rem)] xl:ml-39`,
    loop: "contents",
    line: "",
  },
  last: {
    box: `${phoneBox} md:mt-7 md:grid md:grid-cols-3 md:items-center md:gap-x-7 md:rounded-none md:border-0 md:p-0`,
    loop: "contents md:relative md:col-start-3 md:row-start-1 md:ml-2 md:flex md:w-40 md:justify-center md:rounded-b-3xl md:border-2 md:border-t-0 md:border-dashed md:border-ink md:px-3 md:pt-7.5 md:pb-5 lg:ml-4 lg:w-54 xl:ml-8 xl:w-67",
    line: "md:col-span-2 md:col-start-1 md:row-start-1 md:max-w-md md:justify-self-end md:text-right",
  },
};

type ShowcaseReturnProps = {
  readonly to: ShowcaseReturnTo;
  readonly label: string;
  readonly line: string;
};

export function ShowcaseReturn({ to, label, line }: ShowcaseReturnProps) {
  const variant = variants[to];
  return (
    <div data-anim="showcase-return" data-return={to} className={variant.box}>
      <span data-anim="showcase-return-loop" className={variant.loop}>
        <span
          aria-hidden="true"
          data-anim="showcase-return-head"
          className="absolute -top-px -left-[5.5px] hidden size-2.25 rotate-45 border-t-2 border-l-2 border-ink md:block"
        />
        <strong data-anim="showcase-pill" className={`${monoPill} bg-ink text-cream`}>
          <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-current" />
          {label}
        </strong>
      </span>
      <p className={`min-w-0 flex-[1_1_15rem] text-body leading-normal text-ink md:flex-initial ${variant.line}`}>
        {line}
      </p>
    </div>
  );
}
