// Rix's parts and runtime state on About or the /rix playground (ui-spec 02a-about-options
// §2a.O4, ui-spec/00-rix.md R1.3, R11): finds the instance's Rix hooks (`about-rix-stage`, the
// `rix-walker`, the hydrated `about-rix` button, its host bot SVG with the emotes, the quip anchor
// and quip, the props and the acks), holds what Rix is doing, and puts everything back exactly as
// server-rendered on teardown (the pick lock's `data-locked` and `aria-disabled` included, R6A.9).
// The bot's own rig is Process's (lib/processBotRig.ts), reused. The footer's light Rix
// (ui-spec/09-footer.md §9.4) finds its own parts (lib/footerRixParts.ts) and shares the state.
import { stripPickLock } from "@/lib/aboutPickLock";
import type { gsap } from "@/lib/gsap";
import { animTargets } from "@/lib/motion";
import type { Crew } from "@/lib/processBotCrew";
import { findBot, resetBot, rigBot, stripMotion, type Bot } from "@/lib/processBotRig";
import type { EyeRect, RixEmoteName, Wall } from "@/lib/rixEmotions";
import type { GlyphLoop } from "@/lib/rixGlyphLoops";
import { rixGlyphNames } from "@/lib/rixGlyphs";
import type { RixHost } from "@/lib/rixFeatures";
import { RIX_BASE_WIDTH, type EmotionName } from "@/lib/rixMotion";

export type RixParts = {
  /** The instance's section: the scope of every query, listener and the live watch. */
  readonly root: HTMLElement;
  /** The peek's clip box, and the shelf (the walk track). */
  readonly stage: HTMLElement;
  /** The walk's only writer (its `x`); it carries the button, so the focus ring travels along. */
  readonly walker: HTMLElement;
  /** What the visitor presses: the `about-rix` button, or the footer Rix's link (lib/footerRixParts.ts). */
  readonly button: HTMLElement;
  readonly svg: SVGSVGElement;
  /** The quip's outer span: motion sets its `data-side`. */
  readonly anchor: HTMLElement;
  readonly quip: HTMLElement;
  /** `data-bot="prop"` groups, each with its `data-prop-for` reply index. */
  readonly props: readonly SVGGElement[];
  /** One per reply, in reply order (none on the playground). */
  readonly acks: readonly HTMLElement[];
  /** The emote glyphs by name (a path, or a group of parts). */
  readonly emotes: Readonly<Partial<Record<RixEmoteName, SVGElement>>>;
  /** Each multi-part glyph's `data-emote-part` paths by part name. */
  readonly emoteParts: Readonly<Partial<Record<RixEmoteName, Readonly<Record<string, SVGElement>>>>>;
  /** Each eye rect as server-rendered: `x`, `y`, `width`, `height`. */
  readonly eyeRects: readonly EyeRect[];
};

/**
 * What Rix is doing: one act at a time (R2.1). `tantrum` runs the stomp, toss, flee, sulk and
 * forgive; `calm` is the pick's calm-down (R6A.8); `play` is an idle play (R6) and `beat` an idle
 * beat (R6.8); `chatter` is an idle chatter act (R5.4; was the nudge); `hover` is one hover beat at
 * a held card (R4.9); `pet` is love after a pet (R6B); `patrol` is one stretch of the patrol (R4.8,
 * a stroll in the busy phase), or its brake.
 */
export type RixAct =
  | "ask"
  | "chatter"
  | "perk"
  | "poke"
  | "pick"
  | "walk"
  | "hover"
  | "play"
  | "beat"
  | "tantrum"
  | "calm"
  | "pet"
  | "patrol";

/** The poke ladder's mood (R6A); anything but `neutral` blocks chatter, beats and plays. */
export type RixMood = "neutral" | "annoyed" | "tantrum" | "flee" | "sulk" | "forgive" | "calm";

/** How a line is shown: typed with body talk (R5) or faded whole (R8.1). */
export type SayStyle = "type" | "fade";

export type SayOptions = {
  /** Seconds from now before the line starts. */
  readonly at?: number;
  readonly style?: SayStyle;
};

export type Rix = RixParts & {
  readonly host: RixHost;
  readonly bot: Bot;
  readonly crew: Crew;
  /** Rix's width ÷ Process size: his look radius and follow ranges scale by it. */
  scale: number;
  act: RixAct | null;
  /** A fine pointer is moving: it drives his lean, and his eyes while idle with no target. */
  following: boolean;
  /** The pick under the pointer or keyboard focus: his eyes hold on it. */
  target: Element | null;
  /** The last poke's and perk's start (`performance.now()` seconds). */
  lastPoke: number;
  lastPerk: number;
  // The character sheet.
  /** The emotion his eyes and pose show now, if any. */
  emotion: EmotionName | null;
  /** An emotion held after its act ended (hover mode's base at a card, a curious glance, the annoyed mood hold). */
  hold: EmotionName | null;
  /** The card hover mode holds him at (R4.9), while its hover or focus holds. */
  hovering: Element | null;
  mood: RixMood;
  /** The shelf end he sulks at. */
  wall: Wall | null;
  /** The reply index he holds the prop for (the checked radio; the playground's own pick). */
  picked: number | null;
  /** The playground has no radios, so `:has` never shows a prop: a held prop keeps inline opacity. */
  readonly pinProps: boolean;
  /** The fine pointer's last client position. */
  pointerAt: { x: number; y: number } | null;
  /** The last press came from a fine pointer (the flee runs from it, R6A.5). */
  pressFine: boolean;
  /** The current leg's direction (−1 left, 1 right, 0 still). */
  walkDir: -1 | 0 | 1;
  /** Props a play has out of the hand (juggle, balance); a cut sends them back (R2.2). */
  loose: SVGGElement[];
  /** A prop the tantrum is about to throw (inline opacity 1 from the wind-up). */
  armed: SVGGElement | null;
  /** The glyph showing above his head, and its loop (R3.2): one at a time. */
  glyph: RixEmoteName | null;
  glyphLoop: GlyphLoop | null;
  /** The emotion that showed the glyph: its Out takes the glyph with it. */
  glyphFor: EmotionName | null;
  /** Love's eye beat and sway (R6B.2), while love holds. */
  loveLoop: gsap.core.Timeline | null;
  /** Called whenever Rix starts or finishes an act: his eyes hand over (lib/rixFollow.ts). */
  onState: () => void;
  /** The hovered or focused target changed (after `LOOK_RELEASE` for a release). */
  onTarget: (target: Element | null) => void;
  /** Shows a line in his quip. */
  say: (text: string, options?: SayOptions) => void;
  /** Fades the current line out over `seconds`. */
  quipOut: (seconds: number) => void;
  /** A line is in, holding or going out. */
  quipShowing: () => boolean;
  /** A line is still typing out (hover beats wait for its hold, R4.9). */
  quipTyping: () => boolean;
};

/** The instance's Rix parts, or null until the button has hydrated (or if a hook is missing). */
export function findRixParts(root: HTMLElement): RixParts | null {
  const [stage] = animTargets(root, "about-rix-stage");
  const button = root.querySelector<HTMLButtonElement>('button[data-anim="about-rix"]');
  const walker = button?.closest<HTMLElement>('[data-anim="rix-walker"]') ?? null;
  const svg = button?.querySelector<SVGSVGElement>('svg[data-anim="process-bot"]') ?? null;
  const anchor = button ? animTargets(button, "about-quip-anchor")[0] : undefined;
  const quip = button ? animTargets(button, "about-quip")[0] : undefined;
  if (!stage || !walker || !button || !svg || !anchor || !quip) return null;
  const emotes: Partial<Record<RixEmoteName, SVGElement>> = {};
  const emoteParts: Partial<Record<RixEmoteName, Record<string, SVGElement>>> = {};
  svg.querySelectorAll<SVGElement>('[data-bot="emote"]').forEach((emote) => {
    const name = rixGlyphNames.find((glyph) => glyph === emote.dataset.emote);
    if (!name) return;
    emotes[name] = emote;
    const parts: Record<string, SVGElement> = {};
    emote.querySelectorAll<SVGElement>("[data-emote-part]").forEach((part) => {
      if (part.dataset.emotePart) parts[part.dataset.emotePart] = part;
    });
    if (Object.keys(parts).length > 0) emoteParts[name] = parts;
  });
  return {
    root,
    stage,
    walker,
    button,
    svg,
    anchor,
    quip,
    props: Array.from(svg.querySelectorAll<SVGGElement>('[data-bot="prop"]')),
    acks: animTargets(root, "about-ack"),
    emotes,
    emoteParts,
    eyeRects: eyeRectsOf(svg),
  };
}

/** Each eye rect of the bot in `svg` as drawn now: `x`, `y`, `width`, `height`. */
export function eyeRectsOf(svg: SVGSVGElement): EyeRect[] {
  return Array.from(svg.querySelectorAll<SVGRectElement>('[data-bot="eye"]')).map(
    (rect): EyeRect => [
      Number(rect.getAttribute("x")),
      Number(rect.getAttribute("y")),
      Number(rect.getAttribute("width")),
      Number(rect.getAttribute("height")),
    ],
  );
}

/** The reply index checked in group `name`, or null. */
export function checkedIndex(root: HTMLElement, name: string): number | null {
  const input = root.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`);
  const index = Number(input?.dataset.reply);
  return input && Number.isInteger(index) ? index : null;
}

/** Rigs Rix for full motion, or null if his bot is incomplete. */
export function createRix(parts: RixParts, crew: Crew, host: RixHost): Rix | null {
  const bot = findBot(parts.svg, 0);
  if (!bot) return null;
  rigBot(bot);
  const noop = () => {};
  return {
    ...parts,
    host,
    bot,
    crew,
    scale: measureScale(parts.svg),
    act: null,
    following: false,
    target: null,
    lastPoke: -Infinity,
    lastPerk: -Infinity,
    emotion: null,
    hold: null,
    hovering: null,
    mood: "neutral",
    wall: null,
    picked: null,
    pinProps: host === "playground",
    pointerAt: null,
    pressFine: false,
    walkDir: 0,
    loose: [],
    armed: null,
    glyph: null,
    glyphLoop: null,
    glyphFor: null,
    loveLoop: null,
    onState: noop,
    onTarget: noop,
    say: noop,
    quipOut: noop,
    quipShowing: () => false,
    quipTyping: () => false,
  };
}

export function measureScale(svg: SVGSVGElement): number {
  const width = svg.getBoundingClientRect().width;
  return width > 0 ? width / RIX_BASE_WIDTH : 1;
}

/** The prop group for reply `index`, if that reply has one. */
export function propFor(parts: RixParts, index: number): SVGGElement | undefined {
  return parts.props.find((prop) => prop.dataset.propFor === String(index));
}

/** Everything the Rix motion may have touched outside the bot's own `data-bot` hooks. */
function looseParts(parts: RixParts): Element[] {
  return [
    parts.stage,
    parts.walker,
    parts.anchor,
    parts.quip,
    ...Array.from(parts.quip.querySelectorAll("[data-quip-char]")),
    ...parts.acks,
    ...parts.props.flatMap((prop) => Array.from(prop.querySelectorAll("[data-prop-part]"))),
    ...Object.values(parts.emoteParts).flatMap((glyph) => (glyph ? Object.values(glyph) : [])),
  ];
}

/**
 * Puts the instance back exactly as server-rendered: the bot (props and emotes included, the eye
 * rects' `x`/`y`/`width`/`height`, no rotation or scale), the glyphs' parts, the walker, the quip's
 * side and characters, the acks, the stage's clip and the pick lock's attributes.
 */
export function resetRix(parts: RixParts, bot: Bot | null) {
  stripPickLock(parts.root);
  if (bot) resetBot(bot);
  else stripMotion([...parts.props, ...Object.values(parts.emotes)]);
  stripMotion(looseParts(parts));
  parts.anchor.removeAttribute("data-side");
  parts.svg.querySelectorAll<SVGRectElement>('[data-bot="eye"]').forEach((rect, i) => {
    const rest = parts.eyeRects[i];
    if (!rest) return;
    const [x, y, width, height] = rest;
    rect.setAttribute("x", String(x));
    rect.setAttribute("y", String(y));
    rect.setAttribute("width", String(width));
    rect.setAttribute("height", String(height));
  });
}
