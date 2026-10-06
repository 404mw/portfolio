// The Agents demos' pacing (ui-spec §4.7, Motion): a demo has a longest time, and its work steps
// (an agent thinking, handling one person, ticking one line off) each take a random time from
// their own `[min, max]` range. The time a step takes is deducted from what is left of the longest
// time, and the rest is passed on to the next step; a step can never take so much that the steps
// after it could not have their minimum. So no two replays are paced alike, and every one ends
// inside its longest time. No DOM and no GSAP here: seconds in, seconds out. The ranges and each
// demo's longest time sit beside the sequences that use them (lib/agentDemoSequences.ts,
// lib/orchestraRun.ts).
import type { Range } from "@/lib/processBotMotion";

/**
 * Shares `budget` seconds between `steps`, in order: one time per step, each inside its range
 * while the budget allows, their sum never over `budget`. A step draws between its minimum and
 * its maximum, or what is left less the later steps' minimums where that is lower. A budget too
 * small for every minimum gives each step its share of it, by its minimum. `random` returns 0 to 1.
 */
export function spendBudget(
  budget: number,
  steps: readonly Range[],
  random: () => number = Math.random,
): number[] {
  const least = steps.map(([min]) => Math.max(0, min));
  let left = Math.max(0, budget);
  // The minimums of the steps not drawn yet.
  let reserved = least.reduce((sum, min) => sum + min, 0);
  if (reserved > left) return least.map((min) => (min * left) / reserved);

  return steps.map(([, max], index) => {
    const min = least[index] ?? 0;
    reserved -= min;
    const most = Math.max(min, Math.min(max, left - reserved));
    const taken = min + random() * (most - min);
    left -= taken;
    return taken;
  });
}
