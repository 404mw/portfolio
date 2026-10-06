// A weighted random pick (pure): each name's chance is its weight's share of the total. Names in
// `skip` and names with no weight are never picked.

/** One of `weights`' names, by weight, never one in `skip`; null if nothing is left to pick. */
export function weightedPick<Name extends string>(weights: Readonly<Record<Name, number>>, skip: readonly Name[] = []): Name | null {
  const pool = (Object.keys(weights) as Name[]).filter((name) => weights[name] > 0 && !skip.includes(name));
  const total = pool.reduce((sum, name) => sum + weights[name], 0);
  let roll = Math.random() * total;
  for (const name of pool) {
    roll -= weights[name];
    if (roll < 0) return name;
  }
  return pool[pool.length - 1] ?? null;
}
