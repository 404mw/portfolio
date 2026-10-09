// The action line's replay (ui-spec 04-agents-action §4.10.5): the receipt pops in at its place in
// order showing its empty box; after a drawn hold (the agent doing the job) the box hides and the
// tick pops in its place, as the Checklist's ticks do. Used by the Chat and Leads sequences
// (lib/agentDemoSequences.ts), which draw the hold from their own budgets. Every start state is
// set on the replay's timeline, so reverting it puts the receipt back to its static, ticked state
// (the empty box hidden again).
import {
  POP_FROM,
  TICK_EASE,
  TICK_FROM,
  TICK_SECONDS,
  type DemoPlayback,
} from "@/lib/agentDemoPop";
import { animTargets } from "@/lib/motion";
import type { Range } from "@/lib/processBotMotion";

/** Seconds from the receipt's pop starting to its tick: the agent doing the job. */
export const RECEIPT_HOLD: Range = [0.45, 0.9];

/** The demo's receipt, if it has one. */
export function findReceipt(parts: readonly HTMLElement[]): HTMLElement | undefined {
  return parts.find((part) => part.dataset.anim === "demo-action");
}

/**
 * Plays `receipt` on `sequence`: popping in at `at` with its empty box, then its tick popping in
 * `hold` seconds later. Returns when the tick pops.
 */
export function playReceipt(
  sequence: DemoPlayback["sequence"],
  receipt: HTMLElement,
  at: number,
  hold: number,
): number {
  const [pending] = animTargets(receipt, "demo-action-pending");
  const [tick] = animTargets(receipt, "demo-action-tick");
  const tickAt = at + hold;
  sequence.from(receipt, POP_FROM, at);
  if (!pending || !tick) return tickAt;
  const tickDisplay = getComputedStyle(tick).display;
  sequence
    .set(pending, { display: "block" }, 0)
    .set(tick, { display: "none" }, 0)
    .set(pending, { display: "none" }, tickAt)
    .set(tick, { display: tickDisplay }, tickAt)
    .from(tick, { ...TICK_FROM, duration: TICK_SECONDS, ease: TICK_EASE }, tickAt);
  return tickAt;
}
