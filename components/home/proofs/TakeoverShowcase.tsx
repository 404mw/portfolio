// A takeover's part 5 body (ui-spec §7.3.1): the status pill, which shows the showcase's live
// state at a glance before the diagram, then the showcase's paragraph.
import { monoPill, takeoverText } from "@/lib/styles";

type TakeoverShowcaseProps = {
  readonly status: string;
  readonly body: string;
};

export function TakeoverShowcase({ status, body }: TakeoverShowcaseProps) {
  return (
    <>
      <p className={`${monoPill} border border-ink/15 text-cream-muted`}>
        <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-current" />
        {status}
      </p>
      <p className={takeoverText}>{body}</p>
    </>
  );
}
