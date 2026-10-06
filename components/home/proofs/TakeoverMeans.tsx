// A takeover's part 6 (ui-spec §7.3.3): the ink panel. The eyebrow over the closing line (the
// part's headline, the one part that follows the About pick), then Book a call, the takeover's one
// accent button. From `lg` the line takes the left two thirds and the button the bottom right.
import { BookCallLink } from "@/components/BookCallLink";
import { TakeoverMeansLine } from "@/components/home/proofs/TakeoverMeansLine";
import type { ProofMeans } from "@/lib/proofProject";
import { metaLabel } from "@/lib/styles";

type TakeoverMeansProps = {
  readonly headlineId: string;
  readonly label: string;
  readonly lines: ProofMeans;
};

export function TakeoverMeans({ headlineId, label, lines }: TakeoverMeansProps) {
  return (
    <section
      data-anim="takeover-part"
      data-part="means"
      aria-labelledby={headlineId}
      className="grid gap-x-10 gap-y-8 rounded-3xl bg-ink px-6 py-10 text-text md:px-10 md:py-14 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-end lg:px-14 lg:py-16"
    >
      <div data-anim="takeover-part-head" className="flex min-w-0 flex-col gap-4">
        <p className={`${metaLabel} font-medium tracking-[0.06em] uppercase`}>{label}</p>
        <TakeoverMeansLine id={headlineId} lines={lines} />
      </div>
      <div data-anim="takeover-book" className="w-full md:w-auto lg:justify-self-end">
        <BookCallLink variant="hero" />
      </div>
    </section>
  );
}
