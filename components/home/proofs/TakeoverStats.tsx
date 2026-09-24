// The IN USE numbers in a takeover (ui-spec §7.3 part 3), only for a project that has them
// (Exile). These are the only numbers in Proofs, shown exactly as in content/.
import type { ProofStat } from "@/lib/proofs";
import { condensed } from "@/lib/styles";

type TakeoverStatsProps = {
  readonly stats: readonly ProofStat[];
};

export function TakeoverStats({ stats }: TakeoverStatsProps) {
  return (
    <ul className="mt-3 flex flex-wrap gap-x-8 gap-y-3">
      {stats.map((stat) => (
        <li key={stat.label} className="flex flex-col gap-1">
          <span className={`font-display text-card leading-none font-semibold text-ink ${condensed}`}>
            {stat.value}
          </span>
          <span className="font-mono text-meta text-cream-muted uppercase">{stat.label}</span>
        </li>
      ))}
    </ul>
  );
}
