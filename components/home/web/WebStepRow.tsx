// One web step row (ui-spec §6.1): number, giant title, and the one line under it.
// Not interactive; hover only brightens the line.
import { rowTitle } from "@/lib/styles";

type WebStepRowProps = {
  readonly number: string;
  readonly title: string;
  readonly line: string;
};

export function WebStepRow({ number, title, line }: WebStepRowProps) {
  return (
    <li
      data-anim="web-row"
      className="group grid grid-cols-[3rem_minmax(0,1fr)] gap-x-4 gap-y-3 border-t border-line py-7"
    >
      <span className="pt-3 font-mono text-meta text-accent">{number}</span>
      <h3 className={`${rowTitle} text-text`}>{title}</h3>
      <p className="col-start-2 max-w-md text-body-lg leading-normal text-muted group-hover:text-text">
        {line}
      </p>
    </li>
  );
}
