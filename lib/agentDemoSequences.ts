// The Agents panels' replay (ui-spec §4.7, Motion): builds one panel's sequence from its
// finished, static state (§4.4), in its `data-demo-order` order. Full motion: parts pop in
// (y 8px, scale .96 → none); Chat shows its typing dots before every agent line, then hides them
// for the line; Leads swaps each "new" pill for "followed up"; the Checklist pops its lines with
// empty boxes, then turns each box to its tick; Report grows its bars from the bottom; Sync sends
// packets along its connectors on a loop; the Orchestra runs its token down the swimlanes
// (lib/orchestraRun.ts); the pointer panel's three parts pop in order. Reduced motion: the
// finished state, its parts fading in by order with no pop, rise or scale, no typing dots, no
// swaps, no packets and no token moving. Every sequence ends well inside the 6s auto-advance slot.
//
// Pacing, full motion only (2026-10-05): the moments an agent is working are not evenly spaced.
// Each one (a chat gap or the typing dots, a lead handled, a line ticked off, a bar's turn, a sync
// event) takes a random time from its `[min, max]` range, drawn from the demo's budget
// (lib/demoBudget.ts): its `longest` time less the fixed parts around the steps. Every time is
// drawn here, as the sequence is built, so a replay is paced afresh each time its panel shows and
// a paused one resumes exactly where it stopped. The parts' first pop-in keeps its tight, even
// stagger, and the pointer panel (three pops, no agent at work) is not drawn at all.
//
// All starting states are set here, in JS: without JS, or before a replay, the panel shows its
// finished state. Reverting what this returns puts the panel back to that state.
import {
  LEAD_IN,
  POP_FROM,
  POP_SECONDS,
  newSequence,
  type DemoPlayback,
} from "@/lib/agentDemoPop";
import type { AgentPanelKind } from "@/lib/agents";
import { spendBudget } from "@/lib/demoBudget";
import { gsap } from "@/lib/gsap";
import { animTargets, duration, ease } from "@/lib/motion";
import { orchestra } from "@/lib/orchestraRun";
import type { Range } from "@/lib/processBotMotion";

export type { DemoPlayback };

/**
 * Chat: the seconds from a message to the next part (the visitor writing, or the agent starting
 * to type) and how long the typing dots show (the agent thinking; never shorter than a pop, so
 * the dots have landed before they fade), each drawn from its range; then the dots' fade, and
 * the longest the whole exchange may take. Two messages take 1.55s to 3.25s, three with one
 * agent line 1.85s to 4.35s, four with two agent lines 2.8s to 5s.
 */
const CHAT = { gap: [0.3, 1.1], typing: [0.5, 1.4], typingOut: 0.15, longest: 5 } as const;
/** Chat: the last message has nothing after it to wait for. */
const NO_WAIT: Range = [0, 0];
/**
 * Leads: seconds between rows, when the agent starts on the first person, how long it takes
 * over each one before that row's pill swaps (drawn from the range), and the longest the whole
 * list may take. Three rows take 1.73s to 3.2s.
 */
const LEADS = { rowStagger: 0.15, workAt: 0.8, handle: [0.16, 0.8], longest: 3.2 } as const;
/**
 * Checklist: seconds between lines, when the work starts, how long each line takes before its
 * box turns to its tick (drawn from the range), one tick's pop, from the last tick starting to
 * the pill, and the longest the whole list may take. Four lines take 1.95s to 3.4s.
 */
const CHECKLIST = {
  rowStagger: 0.12,
  workAt: 0.65,
  work: [0.15, 0.7],
  tick: 0.3,
  pillAfter: 0.25,
  longest: 3.4,
} as const;
/** Checklist: where a tick pops in from, in its box's place. */
const TICK_FROM = { opacity: 0, scale: 0.5 } as const;
/** Pointer: seconds between its three parts. */
const POINTER = { stagger: 0.12 } as const;
/**
 * Report: seconds each bar grows, the wait before each next bar starts (drawn from the range;
 * always left to right), how long before the last bar's end the pill pops, and the longest the
 * chart may take. Eight bars take 1.26s to 2.4s.
 */
const REPORT = { bar: 0.6, barGap: [0.03, 0.25], pillLap: 0.15, longest: 2.4 } as const;
/**
 * Sync: seconds for one packet pass and its fades, when the first event's wait starts, how long
 * each event takes to come through (drawn from the range), how long before the last event's end
 * the pill pops, and the longest the events and pill may take. Three events take 1.75s to 3s.
 */
const SYNC = {
  pass: 1.2,
  packetFade: 0.2,
  workAt: 0.6,
  event: [0.15, 0.7],
  pillLap: 0.2,
  longest: 3,
} as const;
/** Reduced motion: seconds between parts fading in. */
const FADE_STAGGER = 0.1;

/** The panel's timed parts, sorted by `data-demo-order`. */
function orderedParts(panel: ParentNode): HTMLElement[] {
  return Array.from(panel.querySelectorAll<HTMLElement>("[data-demo-order]")).sort(
    (a, b) => Number(a.dataset.demoOrder) - Number(b.dataset.demoOrder),
  );
}

/**
 * Chat: each message pops in turn; before every agent line its typing dots take the line's place,
 * then give it back (a chat that opens with the agent starts with the dots). The wait after each
 * message and each hold of the dots is drawn from the exchange's budget. The chat keeps its
 * finished height while the dots stand in, so the panel never jumps.
 */
function chat(panel: HTMLElement, parts: HTMLElement[]): DemoPlayback {
  const typings = new Set(animTargets(panel, "demo-typing"));
  const sequence = newSequence();
  const chatBox = parts[0]?.parentElement;
  // Its exact height, with the unit: the box's own min-height is `auto`, so a bare number would
  // be set unitless and ignored.
  if (chatBox) {
    sequence.set(chatBox, { minHeight: `${chatBox.getBoundingClientRect().height}px` }, 0);
  }

  // One wait per part: the dots' hold, or the gap after a message. What is fixed around them:
  // the lead-in, each dots' fade and the last message's pop.
  const fixed = LEAD_IN + typings.size * CHAT.typingOut + POP_SECONDS;
  const waits = spendBudget(
    CHAT.longest - fixed,
    parts.map((part, index) => {
      if (typings.has(part)) return CHAT.typing;
      return index < parts.length - 1 ? CHAT.gap : NO_WAIT;
    }),
  );

  let at: number = LEAD_IN;
  parts.forEach((part, index) => {
    const wait = waits[index] ?? 0;
    if (!typings.has(part)) {
      sequence.from(part, POP_FROM, at);
      at += wait;
      return;
    }
    const reply = parts[index + 1];
    const replyDisplay = reply ? getComputedStyle(reply).display : "";
    if (reply) sequence.set(reply, { display: "none" }, 0);
    sequence.set(part, { display: "flex" }, at).from(part, POP_FROM, at);
    at += wait;
    sequence
      .to(part, { opacity: 0, duration: CHAT.typingOut }, at)
      .set(part, { display: "none" }, at + CHAT.typingOut);
    at += CHAT.typingOut;
    if (reply) sequence.set(reply, { display: replyDisplay }, at);
  });

  if (chatBox) sequence.set(chatBox, { clearProps: "minHeight" });
  return { sequence, loops: [] };
}

/**
 * Leads: the rows pop in reading "new", then each swaps to "followed up" in turn, one after the
 * other, each after its own drawn time: one person takes the agent longer than another.
 */
function leads(panel: HTMLElement, parts: HTMLElement[]): DemoPlayback {
  const sequence = newSequence();
  const rows = parts.filter((part) => part.querySelector('[data-anim="demo-before"]'));
  sequence.from(rows, { ...POP_FROM, stagger: LEADS.rowStagger }, LEAD_IN);

  const swaps = rows.flatMap((row) => {
    const [before] = animTargets(row, "demo-before");
    const pill = parts.find((part) => part !== row && row.contains(part));
    return before && pill ? [{ before, pill }] : [];
  });
  const handled = spendBudget(
    LEADS.longest - LEADS.workAt - POP_SECONDS,
    swaps.map(() => LEADS.handle),
  );

  let at: number = LEADS.workAt;
  swaps.forEach(({ before, pill }, index) => {
    const pillDisplay = getComputedStyle(pill).display;
    at += handled[index] ?? 0;
    sequence
      .set(before, { display: "block" }, 0)
      .set(pill, { display: "none" }, 0)
      .set(before, { display: "none" }, at)
      .set(pill, { display: pillDisplay }, at)
      .from(pill, POP_FROM, at);
  });

  return { sequence, loops: [] };
}

/**
 * Checklist: each line pops in with its box empty, then each box turns to its tick in turn, each
 * after its own drawn time, then the pill pops. The empty box and the ticked one swap `display`
 * (same size, so the line never changes height); the tick pops in its box's place.
 */
function checklist(_panel: HTMLElement, parts: HTMLElement[]): DemoPlayback {
  const sequence = newSequence();
  const rows = parts.filter((part) => part.querySelector('[data-anim="demo-before"]'));
  const pill = parts.filter((part) => !rows.some((row) => row.contains(part)));
  sequence.from(rows, { ...POP_FROM, stagger: CHECKLIST.rowStagger }, LEAD_IN);

  const lines = rows.flatMap((row) => {
    const [box] = animTargets(row, "demo-before");
    const tick = parts.find((part) => part !== row && row.contains(part));
    return box && tick ? [{ box, tick }] : [];
  });
  const worked = spendBudget(
    CHECKLIST.longest - CHECKLIST.workAt - CHECKLIST.pillAfter - POP_SECONDS,
    lines.map(() => CHECKLIST.work),
  );

  let last: number = CHECKLIST.workAt;
  lines.forEach(({ box, tick }, index) => {
    const tickDisplay = getComputedStyle(tick).display;
    last += worked[index] ?? 0;
    sequence
      .set(box, { display: "block" }, 0)
      .set(tick, { display: "none" }, 0)
      .set(box, { display: "none" }, last)
      .set(tick, { display: tickDisplay }, last)
      .from(tick, { ...TICK_FROM, duration: CHECKLIST.tick, ease: "back.out(2)" }, last);
  });

  sequence.from(pill, POP_FROM, last + CHECKLIST.pillAfter);
  return { sequence, loops: [] };
}

/** Pointer: its heading, its steps and its link pop in order. Nothing else about the link changes. */
function pointer(_panel: HTMLElement, parts: HTMLElement[]): DemoPlayback {
  const sequence = newSequence().from(parts, { ...POP_FROM, stagger: POINTER.stagger }, LEAD_IN);
  return { sequence, loops: [] };
}

/**
 * Report: the bars grow from the chart's floor, left to right, each starting its own drawn wait
 * after the one before it, then the pill pops as the last bar lands.
 */
function report(_panel: HTMLElement, parts: HTMLElement[]): DemoPlayback {
  const bars = parts.slice(0, -1);
  const pill = parts.slice(-1);
  const sequence = newSequence();
  // What is fixed around the waits: the lead-in, the last bar's growth and the pill's pop over it.
  const fixed = LEAD_IN + REPORT.bar - REPORT.pillLap + POP_SECONDS;
  const waits = spendBudget(
    REPORT.longest - fixed,
    bars.slice(1).map(() => REPORT.barGap),
  );

  let at: number = LEAD_IN;
  bars.forEach((bar, index) => {
    if (index > 0) at += waits[index - 1] ?? 0;
    sequence.from(bar, { scaleY: 0, transformOrigin: "50% 100%", duration: REPORT.bar }, at);
  });

  sequence.from(pill, POP_FROM, at + REPORT.bar - REPORT.pillLap);
  return { sequence, loops: [] };
}

/** Half a packet's connector, in px, towards `side` (-1 its left end, 1 its right). */
function connectorEnd(side: -1 | 1) {
  return (_index: number, packet: HTMLElement) =>
    (side * (packet.parentElement?.clientWidth ?? 0)) / 2;
}

/**
 * Sync: a packet crosses each connector left to right, fading in and out at the ends, on a loop
 * (the second half a pass behind the first, so data flows along the row); the events pop in
 * meanwhile, each after its own drawn time, then the pill. The packets keep their even pace: only
 * the events are drawn. The packet sits at its connector's midpoint in static, centred by a CSS
 * translate that GSAP folds into `x`, so the travel re-centres it with `xPercent`. Connector
 * widths are re-read at each repeat, so a resize is picked up on the next pass.
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

  const sequence = newSequence();
  // What is fixed around the waits: when they start, the last event's pop and the pill's over it.
  const fixed = SYNC.workAt + POP_SECONDS - SYNC.pillLap + POP_SECONDS;
  const waits = spendBudget(
    SYNC.longest - fixed,
    events.map(() => SYNC.event),
  );

  let at: number = SYNC.workAt;
  events.forEach((event, index) => {
    at += waits[index] ?? 0;
    sequence.from(event, POP_FROM, at);
  });

  sequence.from(pill, POP_FROM, at + POP_SECONDS - SYNC.pillLap);
  return { sequence, loops: [travel] };
}

const fullMotion: Record<
  AgentPanelKind,
  (panel: HTMLElement, parts: HTMLElement[]) => DemoPlayback
> = { chat, leads, report, sync, checklist, orchestra, pointer };

/**
 * Reduced motion: the finished state, its parts fading in by order, evenly spaced (nothing is
 * drawn at random). The typing dots stay hidden.
 */
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

/** Replays the `kind` panel inside `panel` from its start. */
export function playDemo(kind: AgentPanelKind, panel: HTMLElement, reduced: boolean): DemoPlayback {
  const parts = orderedParts(panel);
  return reduced ? fadeIn(parts) : fullMotion[kind](panel, parts);
}
