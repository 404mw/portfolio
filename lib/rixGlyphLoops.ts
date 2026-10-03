// Rix's emote glyph loops (ui-spec/00-rix.md R3.2, R8), full motion, character sheet only: what each
// glyph does while it shows. `hearts` rises in turns (`HEARTS`), or plays once as the poke's single
// heart (`HEART_ONE`) or the pick's burst over the prop (`HEART_BURST`); `sparkle` twinkles
// (`TWINKLE`); `drop` slides and fades once (`DROP_SLIDE`); `dots` think in turn (`DOTS`); `vein`
// throbs (`VEIN_THROB`); `grawlix` shows random symbols in two slots by `gsap.set`, slot B `x`
// +12, while its vein throbs (`GRAWLIX`). `alert` and `question` don't loop. Every loop runs in the
// crew, so it pauses off screen and in a hidden tab; the caller (lib/rixEmote.ts) shows the glyph,
// and stops the loop and puts its parts back when the glyph goes out.
import { gsap } from "@/lib/gsap";
import { rixGlyphs, type RixGlyphName } from "@/lib/rixGlyphs";
import {
  DOTS,
  DROP_SLIDE,
  EMOTE_IN,
  GRAWLIX,
  HEART_BURST,
  HEART_ONE,
  HEARTS,
  TWINKLE,
  VEIN_THROB,
} from "@/lib/rixMotion";
import type { Rix } from "@/lib/rixRig";

/** What to show: a glyph by name, or one of the hearts' one-off plays. */
export type GlyphCue = RixGlyphName | "heart" | "burst";

/** The glyph a cue shows. */
export const glyphOf = (cue: GlyphCue): RixGlyphName => (cue === "heart" || cue === "burst" ? "hearts" : cue);

/** The cues whose parts make their own entrance (the group shows at once, with no `EMOTE_IN`). */
export const selfShown = (cue: GlyphCue) => cue === "hearts" || cue === "heart" || cue === "burst";

export type GlyphLoop = {
  /** Stops at once. */
  readonly kill: () => void;
  /** Starts nothing new; returns the seconds until what's under way has finished. */
  readonly end: () => number;
};

/** A glyph part's pivot, as `svgOrigin`. */
function pivotOf(name: RixGlyphName, part: string): string {
  const glyph = rixGlyphs[name];
  const found = "parts" in glyph ? glyph.parts.find((each) => each.part === part) : undefined;
  const [x, y] = found?.pivot ?? ("pivot" in glyph ? glyph.pivot : [0, 0]);
  return `${x} ${y}`;
}

/** A glyph's own pivot: its path's, or the centre of its parts' pivots. */
export function glyphPivot(name: RixGlyphName): string {
  const glyph = rixGlyphs[name];
  if ("pivot" in glyph) return glyph.pivot.join(" ");
  const xs = glyph.parts.map((part) => part.pivot[0]);
  const ys = glyph.parts.map((part) => part.pivot[1]);
  const mid = (values: number[]) => (Math.min(...values) + Math.max(...values)) / 2;
  return `${mid(xs)} ${mid(ys)}`;
}

/** One timeline in the crew: killed at once; a one-off reports what it has left. */
function single(rix: Rix, tl: gsap.core.Timeline, onDone?: () => void): GlyphLoop {
  if (onDone) tl.eventCallback("onComplete", onDone);
  rix.crew.run(tl);
  return {
    kill: () => tl.kill(),
    end: () => {
      tl.kill();
      return 0;
    },
  };
}

/** `HEARTS`: each part rises and sways from its drawn spot, restarting every `every`, in turns. */
function rising(rix: Rix, parts: Readonly<Record<string, SVGElement>>): GlyphLoop {
  const { crew } = rix;
  const { fadeIn, pop, rise, sway, fadeOut, stagger, every } = HEARTS;
  const halves = Math.max(1, Math.round(rise.duration / sway.half));
  const live = new Set<gsap.core.Timeline>();
  const next = new Map<string, gsap.core.Tween>();
  let stopped = false;

  const cycle = (name: string, part: SVGElement) => {
    if (stopped) return;
    const tl = gsap.timeline();
    tl.set(part, { svgOrigin: pivotOf("hearts", name), y: 0, scale: pop.from, opacity: 0 }, 0)
      .to(part, { opacity: 1, duration: fadeIn, ease: "none" }, 0)
      .to(part, { scale: 1, duration: pop.duration, ease: pop.ease }, 0)
      .to(part, { y: rise.y, duration: rise.duration, ease: rise.ease }, 0)
      .fromTo(
        part,
        { x: -sway.x },
        { x: sway.x, duration: sway.half, ease: sway.ease, repeat: halves - 1, yoyo: true, immediateRender: false },
        0,
      )
      .to(part, { opacity: 0, duration: fadeOut.duration, ease: fadeOut.ease }, rise.duration - fadeOut.duration);
    tl.eventCallback("onComplete", () => live.delete(tl));
    live.add(tl);
    crew.run(tl);
    next.set(name, crew.after(every, () => cycle(name, part)));
  };

  Object.entries(parts).forEach(([name, part], i) => {
    next.set(name, crew.after(i * stagger, () => cycle(name, part)));
  });

  const stopNext = () => {
    stopped = true;
    next.forEach((tween) => tween.kill());
    next.clear();
  };
  return {
    kill: () => {
      stopNext();
      live.forEach((tl) => tl.kill());
      live.clear();
    },
    end: () => {
      stopNext();
      let left = 0;
      live.forEach((tl) => {
        left = Math.max(left, tl.duration() - tl.time());
      });
      return left;
    },
  };
}

/** `HEART_ONE`: part 1 pops in, rises and fades, once. */
function heartOne(rix: Rix, part: SVGElement, onDone: () => void): GlyphLoop {
  const { scale, y, duration, ease } = EMOTE_IN;
  const { rise, fade } = HEART_ONE;
  const tl = gsap
    .timeline()
    .set(part, { svgOrigin: pivotOf("hearts", "1"), opacity: 0, scale, y }, 0)
    .to(part, { opacity: 1, scale: 1, y: 0, duration, ease }, 0)
    .to(part, { y: rise.y, duration: rise.duration, ease: rise.ease }, duration)
    .to(part, { opacity: 0, duration: fade, ease: "power1.in" }, duration + rise.duration - fade);
  return single(rix, tl, onDone);
}

/** `HEART_BURST`: the three parts pop from the prop's top centre and fan out, fading, once. */
function burst(rix: Rix, parts: Readonly<Record<string, SVGElement>>, onDone: () => void): GlyphLoop {
  const { from, to, scale, move, fade } = HEART_BURST;
  const tl = gsap.timeline();
  ["1", "2", "3"].forEach((name, i) => {
    const part = parts[name];
    const [fx, fy] = from[i] ?? [0, 0];
    const [tx, ty] = to[i] ?? [0, 0];
    if (!part) return;
    tl.set(part, { svgOrigin: pivotOf("hearts", name), x: fx, y: fy, scale, opacity: 1 }, 0)
      .to(part, { x: fx + tx, y: fy + ty, scale: 1, ...move }, 0)
      .to(part, { opacity: 0, duration: fade.duration, ease: fade.ease }, fade.at);
  });
  return single(rix, tl, onDone);
}

/** `TWINKLE`: big and small breathe in scale, the small one a beat behind; while held. */
function twinkle(rix: Rix, parts: Readonly<Record<string, SVGElement>>): GlyphLoop {
  const { scale, half, ease, lag } = TWINKLE;
  const tl = gsap.timeline({ delay: EMOTE_IN.duration });
  ["big", "small"].forEach((name, i) => {
    const part = parts[name];
    if (!part) return;
    gsap.set(part, { svgOrigin: pivotOf("sparkle", name) });
    tl.add(gsap.fromTo(part, { scale: 1 }, { scale, duration: half, ease, repeat: -1, yoyo: true }), i * lag);
  });
  return single(rix, tl);
}

/** `DROP_SLIDE`: the drop slides down and fades, once, after its entrance. */
function dropSlide(rix: Rix, glyph: SVGElement, onDone: () => void): GlyphLoop {
  const { y, duration, ease, fade } = DROP_SLIDE;
  const tl = gsap
    .timeline({ delay: EMOTE_IN.duration })
    .to(glyph, { y, duration, ease }, 0)
    .to(glyph, { opacity: 0, duration: fade, ease: "power1.in" }, duration - fade);
  return single(rix, tl, onDone);
}

/** `DOTS`: in one by one, out together, every `every` while held. */
function dots(rix: Rix, parts: Readonly<Record<string, SVGElement>>): GlyphLoop {
  const { fade, gap, outAt, out, every } = DOTS;
  const all = ["1", "2", "3"].map((name) => parts[name]).filter((part): part is SVGElement => part !== undefined);
  const tl = gsap.timeline({ repeat: -1 });
  all.forEach((part, i) => tl.fromTo(part, { opacity: 0 }, { opacity: 1, duration: fade, ease: "none", immediateRender: false }, i * gap));
  tl.to(all, { opacity: 0, duration: out, ease: "power1.in" }, outAt).set({}, {}, every);
  return single(rix, tl);
}

/** `VEIN_THROB`: a throb after the entrance, then every `every` while held. */
function throb(rix: Rix, glyph: SVGElement): GlyphLoop {
  const { scale, up, down, every } = VEIN_THROB;
  const tl = gsap
    .timeline({ repeat: -1, delay: EMOTE_IN.duration })
    .to(glyph, { scale, ...up }, 0)
    .to(glyph, { scale: 1, ...down }, up.duration)
    .set({}, {}, every);
  return single(rix, tl);
}

/**
 * `GRAWLIX`: each frame, slots A and B (`x` +12) each show a random symbol by `gsap.set`, never the
 * one that slot just showed and never the same as each other; the vein throbs meanwhile.
 */
function grawlix(rix: Rix, parts: Readonly<Record<string, SVGElement>>): GlyphLoop {
  const { frame, slotB, order, vein } = GRAWLIX;
  const symbols = order.map((name) => parts[name]).filter((part): part is SVGElement => part !== undefined);
  let shownA: SVGElement | null = null;
  let shownB: SVGElement | null = null;
  const pick = (not: readonly (SVGElement | null)[]) => {
    const pool = symbols.filter((symbol) => !not.includes(symbol));
    return pool.length > 0 ? (gsap.utils.random(pool) as SVGElement) : null;
  };
  const shuffle = () => {
    const a = pick([shownA, shownB]);
    const b = pick([shownB, a]);
    gsap.set(symbols, { opacity: 0 });
    if (a) gsap.set(a, { opacity: 1, x: 0 });
    if (b) gsap.set(b, { opacity: 1, x: slotB });
    shownA = a;
    shownB = b;
  };
  shuffle();
  const tl = gsap.timeline();
  tl.add(gsap.timeline({ repeat: -1 }).call(shuffle, [], frame), 0);
  const veinPart = parts.vein;
  if (veinPart) {
    gsap.set(veinPart, { svgOrigin: pivotOf("grawlix", "vein") });
    tl.add(gsap.fromTo(veinPart, { scale: 1 }, { scale: vein.scale, duration: vein.half, ease: vein.ease, repeat: -1, yoyo: true }), 0);
  }
  return single(rix, tl);
}

/**
 * Starts the loop for `cue` on its glyph (`glyph`, with its `parts`); null for a glyph that
 * doesn't loop. `onDone` runs when a one-off (one heart, the burst, the drop) has played out.
 */
export function startGlyphLoop(
  rix: Rix,
  cue: GlyphCue,
  glyph: SVGElement,
  parts: Readonly<Record<string, SVGElement>>,
  onDone: () => void,
): GlyphLoop | null {
  switch (cue) {
    case "hearts":
      return rising(rix, parts);
    case "heart":
      return parts["1"] ? heartOne(rix, parts["1"], onDone) : null;
    case "burst":
      return burst(rix, parts, onDone);
    case "sparkle":
      return twinkle(rix, parts);
    case "drop":
      return dropSlide(rix, glyph, onDone);
    case "dots":
      return dots(rix, parts);
    case "vein":
      return throb(rix, glyph);
    case "grawlix":
      return grawlix(rix, parts);
    default:
      return null;
  }
}
