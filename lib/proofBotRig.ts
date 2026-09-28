// One proof card bot's rig for the motion pass (ui-spec §7.7 hook table): finds the bot's
// `data-bot` hooks, sets every pivot once with `svgOrigin` (from `botPivots` and the prop's grip,
// never measured), and owns the summed channels. Breath, arm drift and the eyes' look are plain
// numbers on `bot.ch`, tweened by the life and pointer code and written to the DOM by one `apply`
// per frame. The rest (the rise, the hover lean, blinks, the prop acts) are tweened directly, one
// writer per property.
//
// `resetProofBot` puts the rig back exactly as server-rendered: no `transform`, `style` or
// `data-svg-origin` on any hook below `rise`, so the `opacity-0` classes do their job again.
import { gsap } from "@/lib/gsap";
import { stripMotion } from "@/lib/processBotRig";
import { botPivots, type BotPoint } from "@/lib/processBots";
import { BREATH_STRETCH, REST_LOOK } from "@/lib/proofBotMotion";
import { proofBotProps, type ProofProp } from "@/lib/proofBotProps";

export type ProofBotParts = {
  readonly svg: SVGSVGElement;
  /** The card link the bot sits in; its reveal drives the rise, its hover the lean and the act. */
  readonly card: HTMLElement;
  /** The reveal's hook; only the reveal writes it. */
  readonly rise: SVGGElement;
  readonly rig: SVGGElement;
  readonly body: SVGGElement;
  readonly eyes: SVGGElement;
  readonly eye: readonly SVGGElement[];
  readonly armLeft: SVGGElement;
  readonly armRight: SVGGElement;
  readonly prop: SVGGElement;
  readonly swatches: readonly SVGGElement[];
  /** The phone's `screen-lit` or the puzzle's `puzzle-lit`; null for the fan. */
  readonly lit: SVGGElement | null;
};

/** The summed channels' inputs. 0–1 mixes, degrees, look along the gap diagonal. */
export type ProofBotChannels = {
  /** Life's share, eased 0 → 1 at start so breath and drift never pop in. */
  life: number;
  /** Breath, 0 → 1. */
  b: number;
  driftL: number;
  driftR: number;
  /** The eyes' look (+ = up-right); rest is `REST_LOOK`. */
  look: number;
};

export type ProofBot = {
  readonly prop: ProofProp;
  readonly parts: ProofBotParts;
  readonly ch: ProofBotChannels;
  /** The blink scheduler, and the prop act playing (once per enter). */
  blinkTimer: gsap.core.Tween | null;
  act: gsap.core.Timeline | null;
  /** Writes the summed channels; a no-op until `rigProofBot` runs. */
  apply: () => void;
};

const restChannels = (): ProofBotChannels => ({ life: 0, b: 0, driftL: 0, driftR: 0, look: REST_LOOK });

const isProp = (value: string | undefined): value is ProofProp =>
  value === "phone" || value === "fan" || value === "puzzle";

/** The bot in `svg` (a `[data-anim="proof-bot"]`), or null if its card or rig is incomplete. */
export function findProofBot(svg: SVGSVGElement): ProofBot | null {
  const prop = svg.dataset.prop;
  const card = svg.closest<HTMLElement>("[data-proof-card]");
  if (!isProp(prop) || !card) return null;
  const one = <T extends Element>(hook: string) => svg.querySelector<T>(`[data-bot="${hook}"]`);
  const all = <T extends Element>(hook: string) => Array.from(svg.querySelectorAll<T>(`[data-bot="${hook}"]`));

  const rise = one<SVGGElement>("rise");
  const rig = one<SVGGElement>("rig");
  const body = one<SVGGElement>("body");
  const eyes = one<SVGGElement>("eyes");
  const eye = all<SVGGElement>("eye");
  const armLeft = one<SVGGElement>("arm-left");
  const armRight = one<SVGGElement>("arm-right");
  const propGroup = one<SVGGElement>("prop");
  if (!rise || !rig || !body || !eyes || eye.length !== 2 || !armLeft || !armRight || !propGroup) return null;

  return {
    prop,
    parts: {
      svg,
      card,
      rise,
      rig,
      body,
      eyes,
      eye,
      armLeft,
      armRight,
      prop: propGroup,
      swatches: all<SVGGElement>("swatch"),
      lit: one<SVGGElement>("screen-lit") ?? one<SVGGElement>("puzzle-lit"),
    },
    ch: restChannels(),
    blinkTimer: null,
    act: null,
    apply: () => {},
  };
}

const origin = ([x, y]: BotPoint) => `${x} ${y}`;

/** Sets every pivot once, at rest (spec §7.7 table), and wires `apply`. Full motion only. */
export function rigProofBot(bot: ProofBot) {
  const { parts } = bot;
  const pivot = (target: Element | readonly Element[], point: BotPoint) =>
    gsap.set(target, { svgOrigin: origin(point) });
  pivot(parts.rig, botPivots.rig);
  pivot(parts.body, botPivots.body);
  gsap.set(parts.eyes, { x: 0, y: 0 });
  botPivots.eye[7].forEach((point, i) => {
    const eye = parts.eye[i];
    if (eye) pivot(eye, point);
  });
  pivot(parts.armLeft, botPivots.armLeft);
  pivot(parts.armRight, botPivots.armRight);
  const grip = proofBotProps[bot.prop].grip;
  pivot(parts.prop, grip);
  if (parts.swatches.length > 0) pivot(parts.swatches, grip);

  bot.apply = channelWriter(bot);
}

/** One writer for the summed channels; writes a property only when its value changes. */
function channelWriter(bot: ProofBot): () => void {
  const { parts, ch } = bot;
  const setters = [
    gsap.quickSetter(parts.body, "scaleY"),
    gsap.quickSetter(parts.armLeft, "rotation", "deg"),
    gsap.quickSetter(parts.armRight, "rotation", "deg"),
    gsap.quickSetter(parts.eyes, "x", "px"),
    gsap.quickSetter(parts.eyes, "y", "px"),
  ];
  // The rest values, so nothing is written until a channel actually moves.
  const last = [1, 0, 0, 0, 0];
  const next = [...last];

  return () => {
    const look = ch.look - REST_LOOK;
    next[0] = 1 + BREATH_STRETCH * ch.b * ch.life;
    next[1] = ch.driftL * ch.life;
    next[2] = ch.driftR * ch.life;
    next[3] = look;
    next[4] = -look;
    for (let i = 0; i < setters.length; i += 1) {
      if (Math.abs(next[i] - last[i]) > 1e-4) {
        last[i] = next[i];
        setters[i](next[i]);
      }
    }
  };
}

/**
 * Puts every hook but `rise` back exactly as server-rendered, and the channels at rest. The rise
 * belongs to the reveal, which strips it itself (hooks/useProofBots.ts).
 */
export function resetProofBot(bot: ProofBot) {
  gsap.killTweensOf(bot.ch);
  bot.blinkTimer?.kill();
  bot.blinkTimer = null;
  bot.act?.kill();
  bot.act = null;
  stripMotion(Array.from(bot.parts.svg.querySelectorAll('[data-bot]:not([data-bot="rise"])')));
  Object.assign(bot.ch, restChannels());
  bot.apply = () => {};
}
