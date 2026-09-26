// The Agents demos' replay (ui-spec §4.7, Motion): builds one panel's sequence from its
// finished, static state (§4.4), in its `data-demo-order` order. Full motion: parts pop in
// (y 8px, scale .96 → none); Chat shows its typing dots, then hides them for the reply; Leads
// swaps each "new" pill for "followed up"; Report grows its bars from the bottom; Sync sends
// packets along its connectors on a loop. Reduced motion: the finished state, its parts fading in
// by order with no pop, rise or scale, no typing dots, no swaps and no packets moving. Every
// sequence ends well inside the 6s auto-advance slot.
//
// All starting states are set here, in JS: without JS, or before a replay, the demo shows its
// finished state. Reverting what this returns puts the panel back to that state.
import type { AgentDemoKind } from "@/lib/agents";
import { gsap } from "@/lib/gsap";
import { animTargets, duration, ease } from "@/lib/motion";

export type DemoPlayback = {
  /** The one-off sequence. */
  readonly sequence: gsap.core.Timeline;
  /** Loops that keep running after it (Sync's packets), for pausing off screen. */
  readonly loops: readonly gsap.core.Animation[];
};

/** Where every part pops in from. */
const POP_FROM = { opacity: 0, y: 8, scale: 0.96 } as const;
/** Seconds one part takes to pop in. */
const POP_SECONDS = 0.45;
/** Seconds from the panel showing to its first part. */
const LEAD_IN = 0.15;

/** Chat: seconds between messages, and how long the typing dots show, then fade. */
const CHAT = { gap: 0.9, typing: 1.1, typingOut: 0.2 } as const;
/** Leads: seconds between rows, when the first pill swaps, and between swaps. */
const LEADS = { rowStagger: 0.15, swapAt: 1.2, swapStagger: 0.4 } as const;
/** Report: seconds each bar grows, and between bars. */
const REPORT = { bar: 0.6, barStagger: 0.07 } as const;
/** Sync: seconds for one packet pass and its fades, when the events start, and between them. */
const SYNC = { pass: 1.2, packetFade: 0.2, eventsAt: 0.9, eventStagger: 0.15 } as const;
/** Reduced motion: seconds between parts fading in. */
const FADE_STAGGER = 0.1;

/** The panel's timed parts, sorted by `data-demo-order`. */
function orderedParts(panel: ParentNode): HTMLElement[] {
  return Array.from(panel.querySelectorAll<HTMLElement>("[data-demo-order]")).sort(
    (a, b) => Number(a.dataset.demoOrder) - Number(b.dataset.demoOrder),
  );
}

function newSequence() {
  return gsap.timeline({ defaults: { duration: POP_SECONDS, ease: ease.out } });
}

/**
 * Chat: each message pops in turn; the typing dots take the reply's place, then give it back.
 * The chat keeps its finished height while the dots stand in, so the panel never jumps.
 */
function chat(panel: HTMLElement, parts: HTMLElement[]): DemoPlayback {
  const [typing] = animTargets(panel, "demo-typing");
  const sequence = newSequence();
  const chatBox = parts[0]?.parentElement;
  if (chatBox) sequence.set(chatBox, { minHeight: chatBox.offsetHeight }, 0);

  let at = LEAD_IN;
  parts.forEach((part, index) => {
    if (part !== typing) {
      sequence.from(part, POP_FROM, at);
      at += CHAT.gap;
      return;
    }
    const reply = parts[index + 1];
    const replyDisplay = reply ? getComputedStyle(reply).display : "";
    if (reply) sequence.set(reply, { display: "none" }, 0);
    sequence.set(typing, { display: "flex" }, at).from(typing, POP_FROM, at);
    at += CHAT.typing;
    sequence
      .to(typing, { opacity: 0, duration: CHAT.typingOut }, at)
      .set(typing, { display: "none" }, at + CHAT.typingOut);
    at += CHAT.typingOut;
    if (reply) sequence.set(reply, { display: replyDisplay }, at);
  });

  if (chatBox) sequence.set(chatBox, { clearProps: "minHeight" });
  return { sequence, loops: [] };
}

/** Leads: the rows pop in reading "new", then each swaps to "followed up", staggered. */
function leads(panel: HTMLElement, parts: HTMLElement[]): DemoPlayback {
  const sequence = newSequence();
  const rows = parts.filter((part) => part.querySelector('[data-anim="demo-before"]'));
  sequence.from(rows, { ...POP_FROM, stagger: LEADS.rowStagger }, LEAD_IN);

  rows.forEach((row, index) => {
    const [before] = animTargets(row, "demo-before");
    const pill = parts.find((part) => part !== row && row.contains(part));
    if (!before || !pill) return;
    const pillDisplay = getComputedStyle(pill).display;
    const at = LEADS.swapAt + index * LEADS.swapStagger;
    sequence
      .set(before, { display: "block" }, 0)
      .set(pill, { display: "none" }, 0)
      .set(before, { display: "none" }, at)
      .set(pill, { display: pillDisplay }, at)
      .from(pill, POP_FROM, at);
  });

  return { sequence, loops: [] };
}

/** Report: the bars grow from the chart's floor, one after another, then the pill pops. */
function report(_panel: HTMLElement, parts: HTMLElement[]): DemoPlayback {
  const bars = parts.slice(0, -1);
  const pill = parts.slice(-1);
  const sequence = newSequence()
    .from(
      bars,
      {
        scaleY: 0,
        transformOrigin: "50% 100%",
        duration: REPORT.bar,
        stagger: REPORT.barStagger,
      },
      LEAD_IN,
    )
    .from(pill, POP_FROM, "-=0.15");
  return { sequence, loops: [] };
}

/** Half a packet's connector, in px, towards `side` (-1 its left end, 1 its right). */
function connectorEnd(side: -1 | 1) {
  return (_index: number, packet: HTMLElement) =>
    (side * (packet.parentElement?.clientWidth ?? 0)) / 2;
}

/**
 * Sync: a packet crosses each connector left to right, fading in and out at the ends, on a loop
 * (the second half a pass behind the first, so data flows along the row); the events and pill pop
 * in meanwhile. The packet sits at its connector's midpoint in static, centred by a CSS translate
 * that GSAP folds into `x`, so the travel re-centres it with `xPercent`. Connector widths are
 * re-read at each repeat, so a resize is picked up on the next pass.
 */
function sync(panel: HTMLElement, parts: HTMLElement[]): DemoPlayback {
  const packets = animTargets(panel, "demo-packet");
  const events = parts.slice(0, -1);
  const pill = parts.slice(-1);
  const offset = SYNC.pass / 2;

  const travel = gsap
    .timeline({ repeat: -1, repeatRefresh: true })
    .fromTo(
      packets,
      { xPercent: -50, x: connectorEnd(-1) },
      { xPercent: -50, x: connectorEnd(1), duration: SYNC.pass, ease: "none", stagger: offset },
      0,
    )
    .fromTo(
      packets,
      { opacity: 0 },
      { opacity: 1, duration: SYNC.packetFade, ease: ease.out, stagger: offset },
      0,
    )
    .to(
      packets,
      { opacity: 0, duration: SYNC.packetFade, ease: ease.out, stagger: offset },
      SYNC.pass - SYNC.packetFade,
    );

  const sequence = newSequence()
    .from(events, { ...POP_FROM, stagger: SYNC.eventStagger }, SYNC.eventsAt)
    .from(pill, POP_FROM, "-=0.2");
  return { sequence, loops: [travel] };
}

const fullMotion: Record<
  AgentDemoKind,
  (panel: HTMLElement, parts: HTMLElement[]) => DemoPlayback
> = { chat, leads, report, sync };

/** Reduced motion: the finished state, its parts fading in by order. The typing dots stay hidden. */
function fadeIn(parts: HTMLElement[]): DemoPlayback {
  const shown = parts.filter((part) => part.dataset.anim !== "demo-typing");
  const sequence = gsap
    .timeline()
    .from(
      shown,
      { opacity: 0, duration: duration.fade, ease: ease.out, stagger: FADE_STAGGER },
      LEAD_IN,
    );
  return { sequence, loops: [] };
}

/** Replays the `kind` demo inside `panel` from its start. */
export function playDemo(kind: AgentDemoKind, panel: HTMLElement, reduced: boolean): DemoPlayback {
  const parts = orderedParts(panel);
  return reduced ? fadeIn(parts) : fullMotion[kind](panel, parts);
}
