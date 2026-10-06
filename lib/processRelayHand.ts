// The relay's hand-off (ui-spec §5.7 "the emblem's hand-off"): the job starts in step 1's hand.
// The intake bot holds the flow's emblem on the static page (`data-bot="prop"`). On the hand-off
// beat the travelling job takes its place, at the same spot and size in the same frame, and the
// held emblem hides; it stays hidden while the job is out and comes back, popping in as a new job,
// when the next run starts. So the static page, and any teardown, always has it held (`resetBot`
// strips the emblem with the rest of the bot). The relay timeline is the only writer of the held
// emblem's `opacity` and `scale`; its `x`/`y`/`rotation` are intake's act's (the hold out).
//
// Where the hand is: measured at rest from the bot's box on setup and resize, and read once more,
// live, on the hand-off beat (one layout read, in a timeline callback, before the job's set
// renders), so the job appears exactly on the emblem wherever the bot's sway, its hold out or a
// hover jump has carried it.
import type { gsap } from "@/lib/gsap";
import { JOB_AT, JOB_POP, RELAY_FADE } from "@/lib/processBotMotion";
import { BOT_VIEWBOX } from "@/lib/processBotPointer";
import { jobStart, type JobParts, type JobSize, type Point, type PointAt } from "@/lib/processRelayJob";

/** The hand: the job's anchor there, and the scale that makes the job the held emblem's size. */
export type Hand = Point & { readonly scale: number };

/** What the hand-off needs from either geometry's parts. */
export type HandParts = {
  /** Intake's held emblem, or null if step 1's bot holds none. */
  readonly prop: SVGGElement | null;
  /** The relay layer: the job's coordinate box. */
  readonly layer: HTMLElement;
  readonly job: JobParts;
};

/** What it needs from either geometry's waypoints. */
export type HandRest = { readonly hand: Hand; readonly job: JobSize };

/** The held emblem in step 1's bot, if that bot is the intake. */
export function findProp(stop: { readonly svg: SVGSVGElement; readonly role: string } | undefined): SVGGElement | null {
  if (!stop || stop.role !== "intake") return null;
  return stop.svg.querySelector<SVGGElement>('[data-bot="prop"]');
}

/**
 * The hand at rest, in the layer's coordinates: the held emblem's anchor in the bot's box, and the
 * bot's px per viewBox unit over the job's. Layout reads only; call on setup and resize.
 */
export function measureHand(svg: SVGSVGElement, size: JobSize, layer: DOMRect): Hand {
  const box = svg.getBoundingClientRect();
  const unit = Math.min(box.width / BOT_VIEWBOX.width, box.height / BOT_VIEWBOX.height);
  return {
    x: box.left + ((JOB_AT.intake - BOT_VIEWBOX.x) / BOT_VIEWBOX.width) * box.width - layer.left,
    y: box.top + ((size.hand - BOT_VIEWBOX.y) / BOT_VIEWBOX.height) * box.height - layer.top,
    scale: size.unit > 0 && unit > 0 ? unit / size.unit : 1,
  };
}

/** The hand now: the same anchor through the held emblem's live matrix. One layout read. */
function liveHand(parts: HandParts, rest: HandRest): Hand {
  const matrix = parts.prop?.getScreenCTM();
  if (!matrix) return rest.hand;
  const layer = parts.layer.getBoundingClientRect();
  const at = new DOMPoint(JOB_AT.intake, rest.job.hand).matrixTransform(matrix);
  return { x: at.x - layer.left, y: at.y - layer.top, scale: rest.hand.scale };
}

/**
 * Run start (`t`): a new job arrives in intake's hand, fading and popping in about the hand. Not on
 * a first run, where the static emblem is already held.
 */
export function handArrive(tl: gsap.core.Timeline, prop: SVGGElement | null, first: boolean, t: number) {
  if (!prop || first) return;
  tl.set(prop, { opacity: 0, scale: JOB_POP.from }, t)
    .to(prop, { opacity: 1, duration: RELAY_FADE, ease: "none" }, t)
    .to(prop, { scale: 1, duration: JOB_POP.duration, ease: JOB_POP.ease }, t);
}

/**
 * The hand-off (`t`): the travelling job appears on the held emblem (read live) and the emblem
 * hides, in the same frame. Returns where the job started, for its trail. With no held emblem the
 * job fades in at the rest point instead.
 */
export function handOff(tl: gsap.core.Timeline, parts: HandParts, rest: () => HandRest, t: number): PointAt {
  let hand = rest().hand;
  tl.call(
    () => {
      hand = liveHand(parts, rest());
    },
    [],
    t,
  );
  jobStart(tl, parts.job, () => hand, t);
  if (parts.prop) tl.set(parts.prop, { opacity: 0 }, t);
  else tl.fromTo(parts.job.job, { opacity: 0 }, { opacity: 1, duration: RELAY_FADE, ease: "none", immediateRender: false }, t);
  return () => hand;
}
