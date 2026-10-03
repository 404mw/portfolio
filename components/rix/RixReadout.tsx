// The /rix playground's "now playing" line (ui-spec/02-playground.md §2.1): a polite live region
// under the stage, naming the move under way, or idle when he's still.
import { playground } from "@/content/rix";

type RixReadoutProps = {
  /** The playing move's label; null when he's still. */
  readonly label: string | null;
};

export function RixReadout({ label }: RixReadoutProps) {
  return (
    <p aria-live="polite" className="mt-6 font-mono text-meta text-muted md:mt-8 lg:mt-10">
      {playground.nowPlaying}: {label ?? playground.idle}
    </p>
  );
}
