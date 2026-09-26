// The process bots' stop-motion (ui-spec §5.6–5.7, §10): the numbers and a per-bot player. Two
// stepped layers on one 125ms tick (8fps), no tweens or easing:
//
// - Breathing: an 18-step cycle (breath 0 ×8, 1 ×2, 2 ×6, 1 ×2; 2.25s), each role offset by a few
//   steps so the crew never breathes in unison. A breath change sets the SVG `transform`
//   attribute (SVG user units, about the viewBox origin) on every `[data-breath]` group in the
//   bot, in all four frames, so a frame swap keeps the current breath. Breath 0 removes it.
// - Frame swaps: each role loops its own script of frames and holds (in ticks), mostly resting in
//   its static pose, with blinks, a stretch of its other pose (idle ↔ act) and, for two roles, a
//   nap. The scripts have different lengths, so the crew drifts out of step. A blink only ever
//   comes from `idle` (the blink frame carries idle's tools, so a blink from `act` would flicker
//   the tool too).
//
// The player only reads the bot's own `data-role` / `data-pose` and toggles classes and
// attributes the static markup already has; `reset` puts back the static pose at breath 0.
import type { BotFrame, BotRole } from "@/lib/processBots";

/** Seconds per stop-motion step (8fps). */
export const BOT_STEP_SECONDS = 0.125;

/** The breath at each of the cycle's 18 steps. */
const breathCycle: readonly number[] = [
  ...Array<number>(8).fill(0),
  ...Array<number>(2).fill(1),
  ...Array<number>(6).fill(2),
  ...Array<number>(2).fill(1),
];

/** Steps each role's breathing runs ahead of the shared tick. */
const breathOffsets: Record<BotRole, number> = { rules: 0, team: 11, check: 5, update: 14 };

/** Vertical stretch per breath: sy = 1 + 0.03 · breath. */
const STRETCH_PER_BREATH = 0.03;
/** The feet's y in the viewBox: the body stretches up from here. */
const FEET_Y = 92;
/** How far the hands and the hat ride up, per unit of stretch (sy − 1). */
const HAND_LIFT = 39;
const HAT_LIFT = 84;

type BreathPart = "body" | "hand" | "hat";

/** The §5.6 breath table: each group's `transform` attribute at `breath`, or null at rest. */
function breathTransforms(breath: number): Record<BreathPart, string> | null {
  if (breath === 0) return null;
  const stretch = STRETCH_PER_BREATH * breath;
  const sy = (1 + stretch).toFixed(2);
  const lift = (units: number) => `translate(0 ${(-units * stretch).toFixed(2)})`;
  return {
    body: `translate(0 ${FEET_Y}) scale(1 ${sy}) translate(0 ${-FEET_Y})`,
    hand: lift(HAND_LIFT),
    hat: lift(HAT_LIFT),
  };
}

/** A frame and how many steps it holds. */
type Hold = readonly [frame: BotFrame, steps: number];

/**
 * Each role's frame loop, starting in its static pose (`lib/processBots.ts → stepBots`). At 8
 * steps a second: blinks are one step, the other pose holds 1–1.5s, a nap about 4s.
 */
const frameScripts: Record<BotRole, readonly Hold[]> = {
  // Idle; looks at its clipboard once, naps once. 23.75s.
  rules: [
    ["idle", 30],
    ["blink", 1],
    ["idle", 22],
    ["act", 10],
    ["idle", 18],
    ["blink", 1],
    ["idle", 3],
    ["blink", 1],
    ["idle", 34],
    ["sleep", 32],
    ["idle", 6],
    ["blink", 1],
    ["idle", 31],
  ],
  // Idle; two quick hammer strokes. 20.5s.
  team: [
    ["idle", 18],
    ["blink", 1],
    ["idle", 26],
    ["act", 6],
    ["idle", 3],
    ["act", 6],
    ["idle", 30],
    ["blink", 1],
    ["idle", 24],
    ["blink", 1],
    ["idle", 3],
    ["blink", 1],
    ["idle", 44],
  ],
  // Acting (inspecting); looks up now and then, blinking while it does. 19.25s.
  check: [
    ["act", 36],
    ["idle", 5],
    ["blink", 1],
    ["idle", 6],
    ["act", 30],
    ["idle", 3],
    ["blink", 1],
    ["idle", 3],
    ["blink", 1],
    ["idle", 4],
    ["act", 50],
    ["idle", 8],
    ["blink", 1],
    ["idle", 5],
  ],
  // Idle; turns the wrench once, naps once. 27.25s.
  update: [
    ["idle", 24],
    ["blink", 1],
    ["idle", 30],
    ["act", 12],
    ["idle", 20],
    ["blink", 1],
    ["idle", 28],
    ["blink", 1],
    ["idle", 3],
    ["blink", 1],
    ["idle", 38],
    ["sleep", 34],
    ["idle", 5],
    ["blink", 1],
    ["idle", 19],
  ],
};

const roles = Object.keys(breathOffsets) as BotRole[];
const isRole = (value: string | undefined): value is BotRole =>
  roles.includes(value as BotRole);

/** Plays one bot: `step(tick)` shows the bot at shared tick `tick`; `reset` restores the static pose. */
export type BotPlayer = {
  readonly step: (tick: number) => void;
  readonly reset: () => void;
};

/** A player for one `[data-anim="process-bot"]` SVG, or null if it has no known role. */
export function botPlayer(svg: SVGSVGElement): BotPlayer | null {
  const role = svg.dataset.role;
  if (!isRole(role)) return null;
  const pose = (svg.dataset.pose ?? "idle") as BotFrame;
  const offset = breathOffsets[role];
  // One entry per step: the frame showing at that step of the role's loop.
  const frameAt = frameScripts[role].flatMap(([frame, steps]) => Array<BotFrame>(steps).fill(frame));

  const frames = Array.from(svg.querySelectorAll<SVGGElement>("[data-frame]"));
  const groups = (part: BreathPart) =>
    Array.from(svg.querySelectorAll<SVGGElement>(`[data-breath="${part}"]`));
  const breathGroups: Record<BreathPart, SVGGElement[]> = {
    body: groups("body"),
    hand: groups("hand"),
    hat: groups("hat"),
  };

  let shownBreath = 0;
  let shownFrame: BotFrame = pose;

  const setBreath = (breath: number) => {
    if (breath === shownBreath) return;
    shownBreath = breath;
    const transforms = breathTransforms(breath);
    (Object.keys(breathGroups) as BreathPart[]).forEach((part) => {
      breathGroups[part].forEach((group) => {
        if (transforms) group.setAttribute("transform", transforms[part]);
        else group.removeAttribute("transform");
      });
    });
  };

  const setFrame = (frame: BotFrame) => {
    if (frame === shownFrame) return;
    shownFrame = frame;
    frames.forEach((group) => {
      group.classList.toggle("invisible", group.dataset.frame !== frame);
    });
  };

  return {
    step: (tick) => {
      setBreath(breathCycle[(tick + offset) % breathCycle.length]);
      setFrame(frameAt[tick % frameAt.length]);
    },
    reset: () => {
      setBreath(0);
      setFrame(pose);
    },
  };
}
