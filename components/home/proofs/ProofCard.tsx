// One proof card (ui-spec §7.2): a cream link to its project's takeover, with the card shot,
// the number and tag, the title and one line. All three cards use this with the same inputs.
import { ArrowUpRightIcon } from "@/components/icons/ArrowUpRightIcon";
import { SiteImage } from "@/components/SiteImage";
import { proofs } from "@/content/home";
import type { ImageName } from "@/lib/images";
import { proofCardIds } from "@/lib/proofs";
import { condensed, focusRingCard, metaLabelOnCream } from "@/lib/styles";

type ProofCardProps = {
  readonly href: `#${string}`;
  readonly number: string;
  readonly tag: string;
  readonly title: string;
  readonly cardLine: string;
  readonly shot: ImageName;
  readonly shotAlt: string;
};

export function ProofCard({ href, number, tag, title, cardLine, shot, shotAlt }: ProofCardProps) {
  const ids = proofCardIds(href.slice(1));

  return (
    <a
      href={href}
      data-proof-card
      aria-labelledby={ids.labelledBy}
      className={`group flex h-full flex-col overflow-hidden rounded-3xl bg-cream text-ink active:bg-cream/90 ${focusRingCard}`}
    >
      <div className="relative m-2.5 aspect-[16/10] overflow-hidden rounded-xl">
        <SiteImage
          name={shot}
          alt={shotAlt}
          sizes="(min-width:1536px) 500px, (min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
          position="top"
          placeholderTone="cream"
        />
      </div>
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
          className={`font-display text-card leading-none font-semibold tracking-[-0.03em] decoration-1 underline-offset-4 group-hover:underline ${condensed}`}
        >
          {title}
        </h3>
        <p className="text-body leading-[1.45] text-cream-muted">{cardLine}</p>
      </div>
    </a>
  );
}
