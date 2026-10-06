// One titled line in a takeover part (ui-spec §7.3.1): a title over its line. Part 4 (what it took)
// passes no number; part 5 (what I learned) passes its ordinal, shown beside the title and hidden
// from screen readers because the list gives the order.
import { condensed, metaLabelOnCream } from "@/lib/styles";

type TakeoverItemProps = {
  readonly title: string;
  readonly line: string;
  readonly number?: string;
};

const titleClass = `font-display text-summary leading-[1.1] font-semibold tracking-[-0.02em] text-ink ${condensed}`;

export function TakeoverItem({ title, line, number }: TakeoverItemProps) {
  return (
    <li data-anim="takeover-item" className="flex flex-col gap-2 border-t border-ink/15 pt-4">
      {number === undefined ? (
        <h4 className={titleClass}>{title}</h4>
      ) : (
        <div className="flex items-baseline gap-3">
          <span aria-hidden="true" className={`${metaLabelOnCream} shrink-0 font-medium tracking-[0.06em]`}>
            {number}
          </span>
          <h4 className={`min-w-0 ${titleClass}`}>{title}</h4>
        </div>
      )}
      <p className="text-body-lg leading-normal text-cream-muted">{line}</p>
    </li>
  );
}
