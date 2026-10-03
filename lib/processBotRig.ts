// One process bot's rig for the motion pass (ui-spec §5.6 hook table, §5.7 channels): finds the
// bot's `data-bot` hooks, sets every pivot once with `svgOrigin` (from `botPivots`, never measured),
// and owns the summed channels. The summed and ridden properties (rig rotation = sway + lean + act
// tilt; arm rotation = drift × mix + act; the breath and its riders; the eyes' look, plus the
// host's perpendicular look) are plain numbers on `bot.ch`, tweened by the life, act and pointer
// code and written to the DOM by one `apply` per frame, so each DOM property has exactly one writer. The rest (upper, feet, tools,
// effects, eye attributes) are tweened directly, one state at a time.
//
// `resetBot` puts the SVG back exactly as server-rendered: no `transform`, `style` or
// `data-svg-origin` on any hook, the eyes' drawn `y`/`height` restored, so the `opacity-0`
// classes do their job again.
import { gsap } from "@/lib/gsap";
import { botPivots, type BotPoint, type BotRole } from "@/lib/processBots";
import { ARM_LIFT, BLINK_SHUT, BREATH_STRETCH, EYE_FOLLOW, HAT_LIFT } from "@/lib/processBotMotion";

/** What a bot is doing; blinks, looks and taps run only in `idle` (§5.7 channels). */
export type BotState = "entering" | "idle" | "acting" | "reacting" | "napping";

/** The random schedulers and the idle moves in progress a bot keeps, one of each at a time. */
export type BotTimer = "blink" | "look" | "tap" | "act" | "nap" | "blinkMove" | "lookMove" | "tapMove";

export type BotParts = {
  readonly svg: SVGSVGElement;
  readonly rig: SVGGElement;
  readonly footLeft: SVGElement;
  readonly footRight: SVGElement;
  readonly upper: SVGGElement;
  readonly body: SVGGElement;
  readonly eyes: SVGGElement;
  readonly eye: readonly SVGRectElement[];
  readonly armLeft: SVGGElement;
  readonly armRight: SVGGElement;
  readonly tool: SVGGElement;
  readonly hat: SVGGElement;
  readonly marks: readonly SVGElement[];
  readonly page: SVGElement | null;
  readonly lensLit: SVGElement | null;
  readonly sparks: SVGGElement | null;
  readonly spark: readonly SVGElement[];
  readonly z: readonly SVGElement[];
};

/** The summed channels' inputs. Degrees, viewBox units, 0–1 mixes. */
export type BotChannels = {
  /** Life's share, eased 0 → 1 when the bot lands so breath and sway never pop in. */
  life: number;
  /** Breath, 0 → 1, and the current stretch peak. */
  b: number;
  stretch: number;
  /** Rig rotation parts. */
  sway: number;
  lean: number;
  tilt: number;
  /** Arm rotation parts: drift × mix + act. */
  driftL: number;
  driftR: number;
  mixL: number;
  mixR: number;
  actL: number;
  actR: number;
  /** The eyes' look along the gap diagonal (+ = up-right), the pointer's, and the pointer's share. */
  look: number;
  pointerLook: number;
  pointerMix: number;
  /**
   * The host-only perpendicular look (+ = down-right), added to both eye axes so targets below the
   * bot read (02a-about-options §2a.O4). Process never sets it, so it stays 0 there.
   */
  perp: number;
};

export type Bot = {
  readonly index: number;
  readonly role: BotRole;
  readonly parts: BotParts;
  /** The eyes group's rest look (`data-look`). */
  readonly restLook: number;
  /** Each eye's drawn `y` and `height`, read at setup. */
  readonly eyeRest: readonly { readonly y: number; readonly height: number }[];
  readonly ch: BotChannels;
  state: BotState;
  /** A fine pointer is moving: it drives the lean always, and the eyes while idle. */
  pointer: boolean;
  /** The current act, reaction, nap or wake. */
  busy: gsap.core.Timeline | null;
  /** The last reaction's start (`performance.now()` seconds). */
  lastReact: number;
  readonly timers: Partial<Record<BotTimer, gsap.core.Animation>>;
  readonly loops: { breath: gsap.core.Tween | null; sway: gsap.core.Tween | null; drift: gsap.core.Tween[] };
  /** The nap's z loop, while napping. */
  zzz: gsap.core.Timeline | null;
  /** Writes the summed channels; a no-op until `rigBot` runs. */
  apply: () => void;
};

const restChannels = (restLook: number): BotChannels => ({
  life: 0,
  b: 0,
  stretch: BREATH_STRETCH,
  sway: 0,
  lean: 0,
  tilt: 0,
  driftL: 0,
  driftR: 0,
  mixL: 1,
  mixR: 1,
  actL: 0,
  actR: 0,
  look: restLook,
  pointerLook: restLook,
  pointerMix: 0,
  perp: 0,
});

const isRole = (value: string | undefined): value is BotRole =>
  value === "rules" || value === "team" || value === "check" || value === "update" || value === "host";

/** The bot in `svg` (a `[data-anim="process-bot"]`), or null if its rig is incomplete. */
export function findBot(svg: SVGSVGElement, index: number): Bot | null {
  const role = svg.dataset.role;
  if (!isRole(role)) return null;
  const one = <T extends Element>(hook: string) => svg.querySelector<T>(`[data-bot="${hook}"]`);
  const all = <T extends Element>(hook: string) => Array.from(svg.querySelectorAll<T>(`[data-bot="${hook}"]`));

  const rig = one<SVGGElement>("rig");
  const footLeft = one<SVGElement>("foot-left");
  const footRight = one<SVGElement>("foot-right");
  const upper = one<SVGGElement>("upper");
  const body = one<SVGGElement>("body");
  const eyes = one<SVGGElement>("eyes");
  const eye = all<SVGRectElement>("eye");
  const armLeft = one<SVGGElement>("arm-left");
  const armRight = one<SVGGElement>("arm-right");
  const tool = one<SVGGElement>("tool");
  const hat = one<SVGGElement>("hat");
  if (!rig || !footLeft || !footRight || !upper || !body || !eyes || eye.length !== 2) return null;
  if (!armLeft || !armRight || !tool || !hat) return null;

  const restLook = Number(eyes.dataset.look ?? 0) || 0;
  return {
    index,
    role,
    parts: {
      svg,
      rig,
      footLeft,
      footRight,
      upper,
      body,
      eyes,
      eye,
      armLeft,
      armRight,
      tool,
      hat,
      marks: all<SVGElement>("mark"),
      page: one<SVGElement>("page"),
      lensLit: one<SVGElement>("lens-lit"),
      sparks: one<SVGGElement>("sparks"),
      spark: all<SVGElement>("spark"),
      z: all<SVGElement>("z"),
    },
    restLook,
    eyeRest: eye.map((rect) => ({
      y: Number(rect.getAttribute("y")),
      height: Number(rect.getAttribute("height")),
    })),
    ch: restChannels(restLook),
    state: "idle",
    pointer: false,
    busy: null,
    lastReact: -Infinity,
    timers: {},
    loops: { breath: null, sway: null, drift: [] },
    zzz: null,
    apply: () => {},
  };
}

const origin = ([x, y]: BotPoint) => `${x} ${y}`;

/** Each eye's pivot (its drawn centre) for the bot's rest look. */
function eyePivots(restLook: number): readonly BotPoint[] {
  if (restLook === 7) return botPivots.eye[7];
  if (restLook === -7) return botPivots.eye[-7];
  return botPivots.eye[0];
}

/** Sets every pivot once, at rest, and wires `apply`. Full motion only. */
export function rigBot(bot: Bot) {
  const { parts, role } = bot;
  const pivot = (target: Element | null, point: BotPoint) => {
    if (target) gsap.set(target, { svgOrigin: origin(point) });
  };
  pivot(parts.rig, botPivots.rig);
  pivot(parts.footLeft, botPivots.footLeft);
  pivot(parts.footRight, botPivots.footRight);
  pivot(parts.upper, botPivots.upper);
  pivot(parts.body, botPivots.body);
  gsap.set(parts.eyes, { x: 0, y: 0 });
  eyePivots(bot.restLook).forEach((point, i) => pivot(parts.eye[i] ?? null, point));
  pivot(parts.armLeft, botPivots.armLeft);
  pivot(parts.armRight, botPivots.armRight);
  if (role !== "rules" && role !== "host") pivot(parts.tool, botPivots.tool[role]);
  pivot(parts.hat, botPivots.hat);
  if (role === "rules" || role === "update") {
    botPivots.marks[role].forEach((point, i) => pivot(parts.marks[i] ?? null, point));
  }
  pivot(parts.page, botPivots.page);
  pivot(parts.sparks, botPivots.sparks);
  parts.z.forEach((z, i) => pivot(z, botPivots.z[i] ?? botPivots.z[0]));

  bot.apply = channelWriter(bot);
}

/** One writer for the summed channels; writes a property only when its value changes. */
function channelWriter(bot: Bot): () => void {
  const { parts, ch } = bot;
  const setters = [
    gsap.quickSetter(parts.rig, "rotation", "deg"),
    gsap.quickSetter(parts.body, "scaleY"),
    gsap.quickSetter(parts.armLeft, "y", "px"),
    gsap.quickSetter(parts.armLeft, "rotation", "deg"),
    gsap.quickSetter(parts.armRight, "y", "px"),
    gsap.quickSetter(parts.armRight, "rotation", "deg"),
    gsap.quickSetter(parts.hat, "y", "px"),
    gsap.quickSetter(parts.eyes, "x", "px"),
    gsap.quickSetter(parts.eyes, "y", "px"),
  ];
  // The rest values, so nothing is written until a channel actually moves.
  const last = [0, 1, 0, 0, 0, 0, 0, 0, 0];
  const next = [...last];

  return () => {
    const breath = ch.stretch * ch.b * ch.life;
    const look = ch.look + (ch.pointerLook - ch.look) * ch.pointerMix - bot.restLook;
    next[0] = ch.sway * ch.life + ch.lean + ch.tilt;
    next[1] = 1 + breath;
    next[2] = -ARM_LIFT * breath;
    next[3] = ch.driftL * ch.mixL * ch.life + ch.actL;
    next[4] = next[2];
    next[5] = ch.driftR * ch.mixR * ch.life + ch.actR;
    next[6] = -HAT_LIFT * breath;
    next[7] = look + ch.perp;
    next[8] = -look + ch.perp;
    for (let i = 0; i < setters.length; i += 1) {
      if (Math.abs(next[i] - last[i]) > 1e-4) {
        last[i] = next[i];
        setters[i](next[i]);
      }
    }
  };
}

/** Changes state; the pointer takes the eyes only while idle, handed over smoothly. */
export function setState(bot: Bot, state: BotState): gsap.core.Tween {
  bot.state = state;
  return pointerShare(bot);
}

/** Eases the pointer's share of the eyes to match the bot's state and the pointer. */
export function pointerShare(bot: Bot): gsap.core.Tween {
  const mix = bot.state === "idle" && bot.pointer ? 1 : 0;
  return gsap.to(bot.ch, { pointerMix: mix, duration: EYE_FOLLOW, ease: "power2.inOut", overwrite: "auto" });
}

/** Stores a timer or idle move, killing the previous one of the same kind. */
export function setTimer(bot: Bot, name: BotTimer, animation: gsap.core.Animation) {
  bot.timers[name]?.kill();
  bot.timers[name] = animation;
}

export function clearTimer(bot: Bot, name: BotTimer) {
  bot.timers[name]?.kill();
  delete bot.timers[name];
}

/** Attribute vars for the eyes: open (as drawn), shut (a line at the centre) or a nap slit. */
export function eyeAttr(bot: Bot, shape: "open" | "shut" | "slit") {
  const rest = (i: number) => bot.eyeRest[i] ?? bot.eyeRest[0];
  switch (shape) {
    case "open":
      return { y: (i: number) => rest(i).y, height: (i: number) => rest(i).height };
    case "shut":
      return { y: (i: number) => rest(i).y + BLINK_SHUT, height: 0 };
    case "slit":
      return { y: 52, height: 3 };
  }
}

/** Removes every trace of motion from `elements`: inline styles, transforms, GSAP's origin. */
export function stripMotion(elements: readonly Element[]) {
  if (elements.length === 0) return;
  gsap.killTweensOf(elements);
  gsap.set(elements, { clearProps: "all" });
  elements.forEach((element) => {
    element.removeAttribute("transform");
    element.removeAttribute("style");
    element.removeAttribute("data-svg-origin");
  });
}

/** Puts the bot back exactly as server-rendered, and its channels at rest. */
export function resetBot(bot: Bot) {
  gsap.killTweensOf(bot.ch);
  Object.values(bot.timers).forEach((timer) => timer?.kill());
  (Object.keys(bot.timers) as BotTimer[]).forEach((name) => delete bot.timers[name]);
  bot.busy?.kill();
  bot.busy = null;
  bot.zzz?.kill();
  bot.zzz = null;
  bot.loops.breath = null;
  bot.loops.sway = null;
  bot.loops.drift = [];
  stripMotion(Array.from(bot.parts.svg.querySelectorAll("[data-bot]")));
  bot.parts.eye.forEach((rect, i) => {
    const rest = bot.eyeRest[i];
    if (!rest) return;
    rect.setAttribute("y", String(rest.y));
    rect.setAttribute("height", String(rest.height));
  });
  Object.assign(bot.ch, restChannels(bot.restLook));
  bot.state = "idle";
  bot.pointer = false;
  bot.lastReact = -Infinity;
  bot.apply = () => {};
}
