// Rix's step cycle (ui-spec/00-rix.md R4.3), added to a walk leg's timeline from its gait
// (lib/rixGait.ts): one foot per step, the left foot swinging first on a fresh leg. In each step the
// walker moves the step's px with the step's ease, and the planted foot goes +dir·from → −dir·to
// with the same ease, so it stays fixed on the line; the swinging foot goes −dir·from → +dir·to
// (`sine.inOut`), lifting `footLift` over the first half (`power2.out`) and coming down over the
// second (`power2.in`; a stomp walk slams down in `slam` and squashes `upper` on each plant).
// `upper` bobs at the middle of each step; the arms swing, the opposite arm to the swinging foot
// (only the left one while he carries a prop; held, not swung, when the pace says so). Each step
// takes its own start and length from the gait; with a ramp (the /rix long walks) the bob grows
// with the speed, and he leans `ramp.lean` further into the speed-up and eases half of it off as
// he slows (the stop's overshoot follows).
import type { gsap } from "@/lib/gsap";
import { SETTLE, SQUASH } from "@/lib/processBotMotion";
import type { Gait } from "@/lib/rixGait";
import { GAIT, WALK, type Pace } from "@/lib/rixMotion";
import type { Rix } from "@/lib/rixRig";

export type Foot = "left" | "right";

/** A foot plant inside the leg: where a run-on leg may take over (R4.5). */
export type Plant = {
  /** Seconds into the leg's timeline. */
  readonly time: number;
  /** The walker's `x` there. */
  readonly x: number;
  /** The feet's spread there (units). */
  readonly spread: number;
  /** The foot that swings next (the trailing one). */
  readonly swing: Foot;
};

export type StepOptions = {
  /** The walker's `x` at the leg's first plant. */
  readonly x: number;
  readonly dir: -1 | 1;
  readonly pace: Pace;
  readonly carrying: boolean;
  /** The foot that swings first (the left, on a fresh leg). */
  readonly swing?: Foot;
};

const other = (foot: Foot): Foot => (foot === "left" ? "right" : "left");

/** Adds the leg's steps to `tl` from `at`; returns the plants between them (not the last). */
export function addSteps(rix: Rix, tl: gsap.core.Timeline, at: number, gait: Gait, options: StepOptions): Plant[] {
  const { parts, ch } = rix.bot;
  const { dir, pace, carrying } = options;
  const slam = pace.stomp?.slam;
  const plants: Plant[] = [];
  const footOf = (foot: Foot) => (foot === "left" ? parts.footLeft : parts.footRight);
  if (pace.arms) {
    const [actL, actR] = pace.arms;
    tl.to(ch, { actL, actR, mixL: 0, mixR: 0, duration: 0.15, ease: "power2.out" }, at);
  } else if (carrying) {
    tl.to(ch, { actR: WALK.carry, mixR: 0, duration: 0.15, ease: "power2.out" }, at);
  }

  const { ramp } = pace;
  if (ramp && gait.rampUp > 0) {
    const half = gait.rampUp / 2;
    tl.to(ch, { tilt: dir * (pace.lean + ramp.lean), duration: half, ease: "power2.out" }, at).to(
      ch,
      { tilt: dir * pace.lean, duration: half, ease: "sine.inOut" },
      at + half,
    );
  }
  if (ramp && gait.rampDownAt < gait.duration) {
    tl.to(
      ch,
      { tilt: dir * (pace.lean - ramp.lean / 2), duration: gait.duration - gait.rampDownAt, ease: "sine.inOut" },
      at + gait.rampDownAt,
    );
  }

  let x = options.x;
  let swing = options.swing ?? "left";
  gait.steps.forEach((each, i) => {
    const t = at + each.start;
    const step = each.duration;
    const half = step / 2;
    const down = slam ? slam.duration : half;
    const last = i === gait.steps.length - 1;
    const lifting = footOf(swing);
    const planted = footOf(other(swing));
    x += dir * each.move;
    tl.to(rix.walker, { x, duration: step, ease: each.ease }, t)
      .fromTo(planted, { x: dir * each.from }, { x: -dir * each.to, duration: step, ease: each.ease, immediateRender: false }, t)
      .fromTo(lifting, { x: -dir * each.from }, { x: dir * each.to, duration: step, ease: GAIT.swing, immediateRender: false }, t)
      .to(lifting, { y: -pace.footLift, duration: step - down, ease: "power2.out" }, t)
      .to(lifting, { y: 0, duration: down, ease: slam ? slam.ease : "power2.in" }, t + step - down)
      .to(parts.upper, { y: -pace.bob * each.bob, duration: half, ease: "sine.inOut" }, t)
      .to(parts.upper, { y: 0, duration: half, ease: "sine.inOut" }, t + half);
    if (pace.stomp) {
      tl.to(parts.upper, { ...SQUASH, duration: pace.stomp.squash, ease: "power2.out" }, t + step).to(
        parts.upper,
        { scaleX: 1, scaleY: 1, duration: Math.min(SETTLE.duration, step), ease: SETTLE.ease },
        t + step + pace.stomp.squash,
      );
    }
    if (!pace.arms && pace.armSwing !== 0) {
      const by = last ? 0 : (swing === "left" ? 1 : -1) * pace.armSwing;
      const arms = carrying ? { actL: by, mixL: 0 } : { actL: by, actR: by, mixL: 0, mixR: 0 };
      tl.to(ch, { ...arms, duration: step, ease: "sine.inOut" }, t);
    }
    swing = other(swing);
    if (!last) plants.push({ time: t + step, x, spread: each.to, swing });
  });
  return plants;
}
