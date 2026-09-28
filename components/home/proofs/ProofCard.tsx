// One proof card (ui-spec §7.2): a cream link to its project's takeover, with the ink-stage banner
// and its bot, the number and tag, the title, one line and the proof line. All three cards use
// this with the same inputs. No `overflow-hidden`: the bot breaks out past the card's top and
// right, and only its layer paints outside.
import { ProofBanner } from "@/components/home/proofs/ProofBanner";
import { ProofLine } from "@/components/home/proofs/ProofLine";
import { ArrowUpRightIcon } from "@/components/icons/ArrowUpRightIcon";
import { proofs } from "@/content/home";
import { proofCardIds, proofProp, type ProofKey } from "@/lib/proofs";
import { condensed, focusRingCard, metaLabelOnCream } from "@/lib/styles";

type ProofCardProps = {
  readonly href: `#${string}`;
  readonly project: ProofKey;
  readonly number: string;
  readonly tag: string;
  readonly title: string;
  readonly cardLine: string;
  readonly proofLine: string;
};

export function ProofCard({ href, project, number, tag, title, cardLine, proofLine }: ProofCardProps) {
  const targetId = href.slice(1);
  const ids = proofCardIds(targetId);

  return (
    <a
      href={href}
      data-proof-card
      aria-labelledby={ids.labelledBy}
      className={`group flex h-full flex-col rounded-3xl bg-cream text-ink active:bg-cream/90 ${focusRingCard}`}
    >
      <ProofBanner targetId={targetId} prop={proofProp(project)} />
      <div className="flex flex-1 flex-col gap-2.5 px-6 pt-5.5 pb-6.5">
        <p className={`flex justify-between gap-4 ${metaLabelOnCream}`}>
          <span>
            {number} · {tag}
          </span>
          <span id={ids.open} className="inline-flex items-center gap-1 group-hover:text-ink">
            {proofs.open}
            <ArrowUpRightIcon className="size-3.5" />
          </span>
        </p>
        <h3
          id={ids.title}
          data-anim="proof-card-title"
          className={`font-display text-card leading-none font-semibold tracking-[-0.03em] decoration-1 underline-offset-4 group-hover:underline ${condensed}`}
        >
          {title}
        </h3>
        <p className="mb-1.5 text-body leading-[1.45] text-cream-muted">{cardLine}</p>
        <ProofLine text={proofLine} />
      </div>
    </a>
  );
}
