// The crew relay's clock (ui-spec §5.7, §5.3a, §5.11e): which stop the job visits when, at every
// width. A run visits the flow's stops in step order, five or six of them, each for its role's
// `RELAY_DWELL`, a `RELAY_HOP` apart. On a fix run the check (step 5) finds something: it keeps the
// job only `RELAY_FIND.dwell`, the job hops back to the work step (step 4; `FIX_HOP` from `wide`,
// `FIX_LINE_HOP` below it, the geometry's own), which does its act again, and forward to the check,
// which passes it; then the run goes on. On a send run the flag bot (step 3) sends the job to a
// person: it keeps it only `RELAY_SEND.dwell` and the run's visits end there (the geometry draws
// the job leaving the row). A run is a send run or a fix run, never both. Pure: no DOM, no GSAP. The two
// geometries (lib/processRelay.ts, lib/processRelayColumn.ts) and the bots' catch clock read the
// same plan, so the job, the acts and the catch priority can never disagree.
import type { BotRole } from "@/lib/processBots";
import {
  FIX_HOP,
  RELAY_DWELL,
  RELAY_FADE,
  RELAY_FIND,
  RELAY_HOP,
  RELAY_SEND,
  RUN_CYCLE,
  type RunKind,
} from "@/lib/processBotMotion";
import { FIX_STEP, HANDOFF_STEP } from "@/lib/processFlows";

/** One stop of a run. */
export type Visit = {
  /** The stop's index, in step order. */
  readonly stop: number;
  readonly role: BotRole;
  /** Run time the job reaches the stop: the bot's catch (stop 1: the job is in its hand already). */
  readonly at: number;
  /** Run time the job leaves it. */
  readonly leave: number;
  /**
   * `find`: the check finds something and sends the job back to the work step. `send`: the flag
   * bot sends the job to a person; it is the run's last visit.
   */
  readonly kind: "catch" | "find" | "send";
};

/**
 * The check step's index (step 5) if the flow has the fix loop's steps (the work step at
 * `FIX_STEP`, step 4, the check right after it), else null. Whether the loop is drawn is the
 * caller's to know.
 */
export function fixStop(roles: readonly BotRole[]): number | null {
  const check = FIX_STEP + 1;
  return roles[FIX_STEP] !== undefined && roles[check] === "check" ? check : null;
}

/**
 * The flag step's index (`HANDOFF_STEP`, step 3) if the flow's bot there is the flag, else null
 * (Discord). Whether the hand-off is drawn is the caller's to know.
 */
export function sendStop(roles: readonly BotRole[]): number | null {
  return roles[HANDOFF_STEP] === "flag" ? HANDOFF_STEP : null;
}

/**
 * The kind of run number `run` (0 the first after setup or a swap) on `RUN_CYCLE`, skipping
 * `send` with no send stop and `fix` with no fix stop: a flow with neither is always straight.
 */
export function runKind(run: number, send: number | null, fix: number | null): RunKind {
  const cycle = RUN_CYCLE.filter(
    (kind) => (kind !== "send" || send !== null) && (kind !== "fix" || fix !== null),
  );
  return cycle[run % cycle.length] ?? "straight";
}

/**
 * A run's visits for `roles` in step order. `fix` is the check's index on a fix run (from
 * `fixStop`), or null. `back` is the hop back's length: `FIX_HOP`'s from `wide`, the fix line's
 * (`FIX_LINE_HOP`) below it. `send` is the flag's index on a send run (from `sendStop`), or null:
 * the visits end there, and `fix` is ignored. With neither it is a straight run.
 */
export function relayPlan(
  roles: readonly BotRole[],
  fix: number | null,
  back: number = FIX_HOP.duration,
  send: number | null = null,
): readonly Visit[] {
  const order: { stop: number; kind: Visit["kind"] }[] = [];
  const fixAt = send === null ? fix : null;
  roles.forEach((_, stop) => {
    if (send !== null && stop > send) return;
    if (stop === send) {
      order.push({ stop, kind: "send" });
      return;
    }
    if (stop === fixAt && stop > 0) {
      order.push({ stop, kind: "find" }, { stop: stop - 1, kind: "catch" });
    }
    order.push({ stop, kind: "catch" });
  });

  const visits: Visit[] = [];
  let at = RELAY_FADE;
  order.forEach(({ stop, kind }, i) => {
    const role = roles[stop];
    if (role === undefined) return;
    const dwell = kind === "find" ? RELAY_FIND.dwell : kind === "send" ? RELAY_SEND.dwell : RELAY_DWELL[role];
    const leave = at + dwell;
    visits.push({ stop, role, at, leave, kind });
    const next = order[i + 1];
    at = leave + (next && next.stop < stop ? back : RELAY_HOP.duration);
  });
  return visits;
}

/**
 * The bot that takes the lesson back at the return's end: the rules bot (step 2, "your standards"), or
 * the second bot if a flow had none.
 */
export function lessonTaker(roles: readonly BotRole[]): number {
  const rules = roles.indexOf("rules");
  return rules >= 0 ? rules : Math.min(1, roles.length - 1);
}

/** Each stop's catch times in `visits` (run seconds), by stop index: the bots' catch clock. */
export function catchTimes(visits: readonly Visit[], count: number): readonly (readonly number[])[] {
  const times: number[][] = Array.from({ length: count }, () => []);
  visits.forEach((visit) => times[visit.stop]?.push(visit.at));
  return times;
}
