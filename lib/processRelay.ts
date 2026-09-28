// The crew relay (ui-spec §5.7 layer 10). From `lg`, an accent dot hops along the ground line from
// bot to bot, pulsing each chevron as it crosses it, then fades, reappears at the return path's
// right end and traces it back to step 1, where the arrowhead pulses. Below `lg` there's no dot:
// the bots react in turn (the cascade). Waypoints are measured from the DOM relative to the body
// wrapper (the dot's positioned parent) and read through a getter, so a re-measure after a resize
// reaches every tween that hasn't started yet. The bots' reactions come in through `cues`.
import { gsap } from "@/lib/gsap";
import { animTargets } from "@/lib/motion";
import {
  CASCADE_GAP,
  CHEVRON_PULSE,
  RELAY_DWELL,
  RELAY_FADE,
  RELAY_FADE_OUT,
  RELAY_HOP,
  RETURN_SPEED,
} from "@/lib/processBotMotion";
import { EYE_POINT } from "@/lib/processBotPointer";

/** Tailwind's `lg`: the ground line, chevrons, return path and dot show from here. */
export const relayQuery = "(min-width: 64rem)";

/** The return path's corner radius (16px) and its 45° point's inset, 16 × (1 − cos 45°). */
const CORNER = 16;
const CORNER_MID = CORNER * (1 - Math.SQRT1_2);

type Point = { readonly x: number; readonly y: number };

export type RelayParts = {
  readonly wrapper: HTMLElement;
  readonly dot: HTMLElement;
  readonly ground: HTMLElement;
  readonly bots: readonly SVGSVGElement[];
  readonly chevrons: readonly HTMLElement[];
  /** The icon inside each chevron span (the span masks the line, so it stays put). */
  readonly icons: readonly Element[];
  readonly returnBox: HTMLElement;
  readonly arrowhead: Element | null;
};

export type RelayWaypoints = {
  /** F1–F4: each bot's feet on the ground line. */
  readonly feet: readonly Point[];
  /** K1–K3: the chevron centres. */
  readonly chevrons: readonly Point[];
  /** R0–R7: down the right side, round the corners, along the bottom, up to the arrowhead. */
  readonly path: readonly Point[];
};

/** Whichever bot reacts at each moment of a run; bot indexes are in step order. */
export type RelayCues = {
  /** The dot sets off from this bot. */
  readonly launch: (index: number) => void;
  /** The dot heads this bot's way. */
  readonly head: (index: number) => void;
  /** The dot reaches this bot. */
  readonly arrive: (index: number) => void;
};

/** The relay's elements inside `root`, or null if any is missing. */
export function relayParts(root: HTMLElement, bots: readonly SVGSVGElement[]): RelayParts | null {
  const [dot] = animTargets(root, "process-relay");
  const [ground] = animTargets(root, "process-ground");
  const [returnBox] = animTargets(root, "process-return");
  const chevrons = animTargets(root, "process-chevron");
  const wrapper = dot?.parentElement;
  if (!dot || !ground || !returnBox || !wrapper) return null;
  return {
    wrapper,
    dot,
    ground,
    bots,
    chevrons,
    icons: chevrons.map((chevron) => chevron.firstElementChild).filter((icon): icon is Element => icon !== null),
    returnBox,
    arrowhead: returnBox.firstElementChild,
  };
}

/** Measures every waypoint relative to the wrapper. Layout reads only; call on setup and resize. */
export function measureRelay(parts: RelayParts): RelayWaypoints {
  const origin = parts.wrapper.getBoundingClientRect();
  const at = (x: number, y: number): Point => ({ x: x - origin.left, y: y - origin.top });
  const groundY = parts.ground.getBoundingClientRect().top + 1;
  const feet = parts.bots.map((svg) => {
    const box = svg.getBoundingClientRect();
    return at(box.left + EYE_POINT.x * box.width, groundY);
  });
  const chevrons = parts.chevrons.map((chevron) => {
    const box = chevron.getBoundingClientRect();
    return at(box.left + box.width / 2, box.top + box.height / 2);
  });
  const box = parts.returnBox.getBoundingClientRect();
  const right = box.right - 1;
  const left = box.left + 1;
  const bottom = box.bottom - 1;
  const path = [
    at(right, box.top),
    at(right, bottom - CORNER),
    at(right - CORNER_MID, bottom - CORNER_MID),
    at(right - CORNER, bottom),
    at(left + CORNER, bottom),
    at(left + CORNER_MID, bottom - CORNER_MID),
    at(left, bottom - CORNER),
    at(left, box.top),
  ];
  return { feet, chevrons, path };
}

/** The share of a tween's duration at which `ease` reaches `progress` (0–1), by bisection. */
function crossTime(progress: number, ease: string): number {
  const curve = gsap.parseEase(ease);
  const target = Math.min(1, Math.max(0, progress));
  let low = 0;
  let high = 1;
  for (let i = 0; i < 24; i += 1) {
    const mid = (low + high) / 2;
    if (curve(mid) < target) low = mid;
    else high = mid;
  }
  return (low + high) / 2;
}

/** A chevron or the arrowhead pulses (scale only; no brighter token exists). */
function pulse(tl: gsap.core.Timeline, icon: Element, at: number) {
  tl.to(icon, { scale: CHEVRON_PULSE.scale, transformOrigin: "50% 50%", duration: CHEVRON_PULSE.up, ease: "power2.out" }, at).to(
    icon,
    { scale: 1, duration: CHEVRON_PULSE.down, ease: "power2.inOut" },
    at + CHEVRON_PULSE.up,
  );
}

const distance = (a: Point, b: Point) => Math.hypot(b.x - a.x, b.y - a.y);

/** One relay run with the dot (from `lg`). `waypoints` returns the latest measurement. */
export function relayRun(parts: RelayParts, waypoints: () => RelayWaypoints, cues: RelayCues): gsap.core.Timeline {
  const { dot, icons, arrowhead } = parts;
  const now = waypoints();
  const count = now.feet.length;
  const tl = gsap.timeline({ defaults: { overwrite: "auto" } });
  const to = (point: () => Point | undefined) => ({
    x: () => point()?.x ?? 0,
    y: () => point()?.y ?? 0,
  });
  if (count === 0) return tl;

  tl.set(dot, { opacity: 0, ...to(() => waypoints().feet[0]) }, 0)
    .to(dot, { opacity: 1, duration: RELAY_FADE, ease: "none" }, 0)
    .call(cues.launch, [0], 0);
  let t = RELAY_FADE;
  for (let i = 0; i < count - 1; i += 1) {
    const next = i + 1;
    tl.call(cues.head, [next], t).to(dot, { ...to(() => waypoints().feet[next]), ...RELAY_HOP }, t);
    const from = now.feet[i];
    const ahead = now.feet[next];
    const chevron = now.chevrons[i];
    const icon = icons[i];
    if (from && ahead && chevron && icon && ahead.x !== from.x) {
      pulse(tl, icon, t + RELAY_HOP.duration * crossTime((chevron.x - from.x) / (ahead.x - from.x), RELAY_HOP.ease));
    }
    t += RELAY_HOP.duration;
    tl.call(cues.arrive, [next], t);
    t += RELAY_DWELL;
  }

  // Back to step 1: fade at the last bot, reappear at the path's right end, trace it.
  tl.to(dot, { opacity: 0, duration: RELAY_FADE_OUT, ease: "none" }, t);
  t += RELAY_FADE_OUT;
  tl.set(dot, to(() => waypoints().path[0]), t)
    .to(dot, { opacity: 1, duration: RELAY_FADE, ease: "none" }, t)
    .call(cues.head, [0], t);
  for (let j = 1; j < now.path.length; j += 1) {
    const from = now.path[j - 1];
    const next = now.path[j];
    const seconds = from && next ? Math.max(distance(from, next) / RETURN_SPEED, 0.01) : 0.01;
    tl.to(dot, { ...to(() => waypoints().path[j]), duration: seconds, ease: "none" }, t);
    t += seconds;
  }
  if (arrowhead) pulse(tl, arrowhead, t);
  return tl.to(dot, { opacity: 0, duration: RELAY_FADE_OUT, ease: "none" }, t).call(cues.arrive, [0], t);
}

/** Below `lg`: the bots react in turn, `CASCADE_GAP` apart. */
export function cascadeRun(count: number, arrive: (index: number) => void): gsap.core.Timeline {
  const tl = gsap.timeline();
  for (let i = 0; i < count; i += 1) tl.call(arrive, [i], i * CASCADE_GAP);
  return tl;
}
