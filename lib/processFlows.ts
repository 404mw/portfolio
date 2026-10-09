// Process' flows (ui-spec §5.10): for each set, the bot doing each step, in step order. A step's
// pose follows from its role: `check` and `flag` stand in `act` (eyes on the lens, on the flag),
// every other role in `idle`. Each set's list type is tied to `process.flows[set].steps` in
// content/home.ts, so a step can't be added or removed without its bot. The emblem step 1's bot
// holds is lib/processEmblems.ts. Which flows have the two loops and the hand-off is `hasLoops`
// (§5.3b), tied to the flow's labels in the same way. Control comes first (§5.10, 2026-10-08): in
// every flow with loops step 3 passes anything sensitive or unusual to a person before the work.
import { process } from "@/content/home";
import type { AboutSet } from "@/lib/aboutPick";
import type { BotPose, BotRole } from "@/lib/processBots";

/** One role per step, same length (a generic, so the mapping keeps the tuple). */
type RolesPer<Steps extends readonly unknown[]> = { readonly [I in keyof Steps]: BotRole };

/** Each set's bots, step 1 to the last. Step 1 is always `intake`: it holds the job. */
export const flowRoles: { readonly [S in AboutSet]: RolesPer<(typeof process.flows)[S]["steps"]> } = {
  default: ["intake", "rules", "flag", "team", "check"],
  "service-business": ["intake", "rules", "flag", "team", "check", "remind"],
  "online-store": ["intake", "rules", "flag", "team", "check"],
  discord: ["intake", "rules", "update", "ship", "host"],
  "software-builder": ["intake", "rules", "flag", "team", "check", "ship"],
};

/**
 * The labels of a flow with loops: the return between jobs, the fix loop inside one, and the
 * hand-off to a person (ui-spec §5.11).
 */
export type FlowLoops = {
  readonly loopLabel: string;
  readonly fixLabel: string;
  readonly handoffLabel: string;
};

/** `true` where the flow's copy has all three labels, `false` where it has none; some alone fit nothing. */
type LoopsOf<Flow> = Flow extends FlowLoops ? true : Extract<keyof Flow, keyof FlowLoops> extends never ? false : never;

/**
 * Which flows have loops (ui-spec §5.3b): the fix loop, the return and the hand-off. Tied to each flow's labels
 * in content/home.ts, so a label removed or added by mistake fails the type check.
 */
export const hasLoops: { readonly [S in AboutSet]: LoopsOf<(typeof process.flows)[S]> } = {
  default: true,
  "service-business": true,
  "online-store": true,
  discord: false,
  "software-builder": true,
};

/** A set's loop and hand-off labels, or null for a flow with no loops. */
export function flowLoops(set: AboutSet): FlowLoops | null {
  if (!hasLoops[set]) return null;
  const flow = process.flows[set];
  return "loopLabel" in flow && "fixLabel" in flow && "handoffLabel" in flow
    ? { loopLabel: flow.loopLabel, fixLabel: flow.fixLabel, handoffLabel: flow.handoffLabel }
    : null;
}

/**
 * The step the hand-off leaves from (ui-spec §5.11): step 3, the `flag` step in every flow with
 * loops. Each such flow's `handoffLabel` in content/home.ts is its label; a flow with no loops
 * (`hasLoops`) has no hand-off.
 */
export const HANDOFF_STEP = 2;

/**
 * The step the fix loop returns to (ui-spec §5.3a, §5.10): step 4, the `team` step in every flow
 * with loops, with the `check` step always next. Each such flow's `fixLabel` in content/home.ts is
 * its label; a flow with no loops (`hasLoops`) has no fix loop.
 */
export const FIX_STEP = 3;

/** A step's static pose, from its role. */
export function rolePose(role: BotRole): BotPose {
  return role === "check" || role === "flag" ? "act" : "idle";
}

/** One step: its copy and its bot. */
export type FlowStep = {
  readonly title: string;
  readonly line: string;
  readonly role: BotRole;
  readonly pose: BotPose;
};

/** A set's steps, each with its bot and pose. */
export function flowSteps(set: AboutSet): readonly FlowStep[] {
  const roles: readonly BotRole[] = flowRoles[set];
  return process.flows[set].steps.map((step, index) => {
    const role = roles[index] ?? "team";
    return { title: step.title, line: step.line, role, pose: rolePose(role) };
  });
}
