// The Agents panels' replay (ui-spec §4.7, Motion): builds one panel's sequence from its
// finished, static state (§4.4), in its `data-demo-order` order. Full motion: parts pop in
// (y 8px, scale .96 → none); Chat shows its typing dots before every agent line, then hides them
// for the line; Leads swaps each "new" pill for "followed up"; a Chat's or a list's receipt (the
// action line, §4.10) pops with its box empty and ticks it off after a drawn hold
// (lib/agentDemoReceipt.ts); the Checklist pops its lines with empty boxes, then turns each box
// to its tick; Report grows its bars from the bottom; Sync runs one dot per event, from the tool
// the event starts in to the one it lands in, lights that tool and pops the event's box
// (2026-10-09); the Orchestra runs its token down the swimlanes (lib/orchestraRun.ts). Reduced
// motion: the finished state, its parts fading in by order with no pop, rise or scale, no typing
// dots, no swaps, no packets moving, no tool lit, no token moving and every receipt already
// ticked. Every sequence ends well inside the 6s auto-advance slot.
//
// Pacing, full motion only (2026-10-05): the moments an agent is working are not evenly spaced.
// Each one (a chat gap or the typing dots, a lead handled, a line ticked off, a bar's turn, a sync
// event) takes a random time from its `[min, max]` range, drawn from the demo's budget
// (lib/demoBudget.ts): its `longest` time less the fixed parts around the steps. Every time is
// drawn here, as the sequence is built, so a replay is paced afresh each time its panel shows and
// a paused one resumes exactly where it stopped. The parts' first pop-in keeps its tight, even
// stagger.
//
// All starting states are set here, in JS: without JS, or before a replay, the panel shows its
// finished state. Reverting what this returns puts the panel back to that state.
import {
  LEAD_IN,
  POP_FROM,
  POP_SECONDS,
  TICK_EASE,
  TICK_FROM,
  TICK_SECONDS,
  newSequence,
  type DemoPlayback,
} from "@/lib/agentDemoPop";
import { RECEIPT_HOLD, findReceipt, playReceipt } from "@/lib/agentDemoReceipt";
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
 * the longest the whole exchange may take: 5s, or 4.5s with a receipt (choice 46), so the receipt
 * is on screen at least 1.5s before the 6s advance. Two messages take 1.55s to 3.25s, three with
 * one agent line 1.85s to 4.35s, four with two agent lines 2.8s to 5s. A receipt adds its hold
 * and its tick (and the gap after it, when it isn't last): three messages with one agent line and
 * a receipt take 2.45s (receipt last) or 2.6s (receipt inside) to 4.5s, four with two agent lines
 * and a receipt 3.55s to 4.5s.
 */
const CHAT = {
  gap: [0.3, 1.1],
  typing: [0.5, 1.4],
  typingOut: 0.15,
  longest: 5,
  longestWithReceipt: 4.5,
} as const;
/** Chat: the last message has nothing after it to wait for. */
const NO_WAIT: Range = [0, 0];
/**
 * Leads: seconds between rows, when the agent starts on the first person, how long it takes
 * over each one before that row's pill swaps (drawn from the range), the wait from the last swap
 * to the receipt (drawn), and the longest the whole list may take: 3.2s, or 4.4s with a receipt.
 * Three rows take 1.73s to 3.2s; with a receipt, 2.23s to 4.4s.
 */
const LEADS = {
  rowStagger: 0.15,
  workAt: 0.8,
  handle: [0.16, 0.8],
  toReceipt: [0.2, 0.5],
  longest: 3.2,
  longestWithReceipt: 4.4,
} as const;
/**
 * Checklist: seconds between lines, when the work starts, how long each line takes before its
 * box turns to its tick (drawn from the range), one tick's pop, from the last tick starting to
 * the pill, and the longest the whole list may take. Four lines take 1.95s to 3.4s.
 */
const CHECKLIST = {
  rowStagger: 0.12,
  workAt: 0.65,
  work: [0.15, 0.7],
  pillAfter: 0.25,
  longest: 3.4,
} as const;
/**
 * Report: seconds each bar grows, the wait before each next bar starts (drawn from the range;
 * always left to right), how long before the last bar's end the pill pops, and the longest the
 * chart may take. Eight bars take 1.26s to 2.4s.
 */
const REPORT = { bar: 0.6, barGap: [0.03, 0.25], pillLap: 0.15, longest: 2.4 } as const;
/**
 * Sync: seconds for the dot to cross one connector, its fade in at its route's start and out at
 * its end, when the first event's dot sets off, the wait from one event's box popping to the next
 * event's dot setting off (drawn from the range), the landing tool's light coming up, holding and
 * fading, how long before the last event's pop ends the pill pops, and the longest the whole
 * sequence may take (to the pill's pop or the last light's fade, whichever ends later). Both demos
 * cross four connectors over three events: 3.2s to 4s.
 */
const SYNC = {
  cross: 0.4,
  packetFade: 0.12,
  workAt: 0.35,
  wait: [0.2, 0.7],
  litUp: 0.15,
  litHold: 0.2,
  litOut: 0.5,
  pillLap: 0.2,
  longest: 4,
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
 * then give it back (a chat that opens with the agent starts with the dots). The receipt pops in
 * its place with its box empty and ticks it off after its hold. The wait after each message, each
 * hold of the dots and the receipt's hold are drawn from the exchange's budget. The chat keeps
 * its finished height while the dots stand in, so the panel never jumps.
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

  // One wait per part: the dots' hold, or the gap after a message (after the receipt's tick, for
  // the receipt), plus the receipt's hold just before its own gap. What is fixed around them: the
  // lead-in, each dots' fade and the last part's pop (or its tick, when the receipt is last).
  const receipt = findReceipt(parts);
  const fixed =
    LEAD_IN +
    typings.size * CHAT.typingOut +
    (receipt !== undefined && parts.at(-1) === receipt ? TICK_SECONDS : POP_SECONDS);
  const steps = parts.flatMap((part, index): Range[] => {
    const after = index < parts.length - 1 ? CHAT.gap : NO_WAIT;
    if (typings.has(part)) return [CHAT.typing];
    return part === receipt ? [RECEIPT_HOLD, after] : [after];
  });
  const waits = spendBudget((receipt ? CHAT.longestWithReceipt : CHAT.longest) - fixed, steps);

  let at: number = LEAD_IN;
  let step = 0;
  parts.forEach((part, index) => {
    const wait = waits[step++] ?? 0;
    if (part === receipt) {
      at = playReceipt(sequence, part, at, wait) + (waits[step++] ?? 0);
      return;
    }
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
 * other, each after its own drawn time: one person takes the agent longer than another. A list
 * with a receipt keeps it hidden until a drawn wait after the last swap, then plays it (its pop,
 * its hold with the empty box, its tick).
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
  // With a receipt the list ends on its tick, after the wait to it and its hold; without, on the
  // last pill's pop.
  const receipt = findReceipt(parts);
  const handles = swaps.map((): Range => LEADS.handle);
  const handled = receipt
    ? spendBudget(LEADS.longestWithReceipt - LEADS.workAt - TICK_SECONDS, [
        ...handles,
        LEADS.toReceipt,
        RECEIPT_HOLD,
      ])
    : spendBudget(LEADS.longest - LEADS.workAt - POP_SECONDS, handles);

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

  if (receipt) {
    const toReceipt = handled[swaps.length] ?? 0;
    const hold = handled[swaps.length + 1] ?? 0;
    playReceipt(sequence, receipt, at + toReceipt, hold);
  }
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
      .from(tick, { ...TICK_FROM, duration: TICK_SECONDS, ease: TICK_EASE }, last);
  });

  sequence.from(pill, POP_FROM, last + CHECKLIST.pillAfter);
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

/** The index in a `data-sync-*` attribute, or -1 when it is missing or not a whole number. */
function syncIndex(value: string | undefined): number {
  if (value === undefined || value.trim() === "") return -1;
  const index = Number(value);
  return Number.isInteger(index) ? index : -1;
}

/** The elements inside `panel` under each `attribute` index: its `name` hook. */
function syncHooks(panel: HTMLElement, attribute: string, key: string, name: string) {
  const hooks = new Map<number, HTMLElement>();
  panel.querySelectorAll<HTMLElement>(`[${attribute}]`).forEach((owner) => {
    const [hook] = animTargets(owner, name);
    if (hook) hooks.set(syncIndex(owner.dataset[key]), hook);
  });
  return hooks;
}

/** One connector a dot crosses: its packet and the end it enters by (-1 its left, 1 its right). */
type Crossing = { readonly packet: HTMLElement; readonly enter: -1 | 1 };

/**
 * The connectors from tool `from` to tool `to`, in the order the dot crosses them: connector `k`
 * joins tools `k` and `k + 1`, crossed left to right when `to` is further right, right to left
 * when it is further left. Empty when the tools are the same or a connector is missing.
 */
function syncRoute(from: number, to: number, packets: ReadonlyMap<number, HTMLElement>) {
  if (from < 0 || to < 0) return [];
  const step = to > from ? 1 : -1;
  const route: Crossing[] = [];
  for (let tool = from; tool !== to; tool += step) {
    const packet = packets.get(step === 1 ? tool : tool - 1);
    if (!packet) return [];
    route.push({ packet, enter: step === 1 ? -1 : 1 });
  }
  return route;
}

/**
 * Sync: one event at a time, a dot runs from the tool the event starts in (`data-sync-from`) to
 * the one it lands in (`data-sync-to`), at an even pace, connector by connector: each connector's
 * own packet crosses it end to end, the next taking over at the middle tool with no gap and no
 * fade, so a two-connector route reads as one dot. It fades in at the route's start and out as it
 * lands, and that moment the landing tool lights up (holds, then fades) and the event's box pops
 * in. The next dot sets off a drawn wait after that pop starts; the pill pops over the last
 * event's pop. Every packet starts hidden and every light off. A packet sits at its connector's
 * midpoint in static, centred by a CSS translate that GSAP folds into `x`, so the travel
 * re-centres it with `xPercent`; each crossing reads its connector's width as it starts. Nothing
 * loops.
 */
function sync(panel: HTMLElement, parts: HTMLElement[]): DemoPlayback {
  const events = parts.slice(0, -1);
  const pill = parts.slice(-1);
  const packets = syncHooks(panel, "data-sync-link", "syncLink", "demo-packet");
  const lights = syncHooks(panel, "data-sync-tool", "syncTool", "sync-lit");
  const runs = events.map((event) => {
    const to = syncIndex(event.dataset.syncTo);
    return {
      event,
      route: syncRoute(syncIndex(event.dataset.syncFrom), to, packets),
      light: lights.get(to),
    };
  });

  const sequence = newSequence();
  // Hidden as the sequence is built, so no packet shows at its midpoint for a frame first.
  sequence.set([...packets.values(), ...lights.values()], { opacity: 0, immediateRender: true }, 0);

  // What is fixed around the waits: the first dot's start, every crossing, and what follows the
  // last landing (the pill's pop over the last event's, or the last light, whichever ends later).
  const crossings = runs.reduce((sum, { route }) => sum + route.length, 0);
  const tail = Math.max(
    POP_SECONDS - SYNC.pillLap + POP_SECONDS,
    SYNC.litUp + SYNC.litHold + SYNC.litOut,
  );
  const waits = spendBudget(
    SYNC.longest - SYNC.workAt - crossings * SYNC.cross - tail,
    runs.slice(1).map(() => SYNC.wait),
  );

  let at: number = SYNC.workAt;
  runs.forEach(({ event, route, light }, index) => {
    if (index > 0) at += waits[index - 1] ?? 0;
    route.forEach(({ packet, enter }, step) => {
      const start = at + step * SYNC.cross;
      const end = start + SYNC.cross;
      const leave = enter === -1 ? 1 : -1;
      // Several crossings over one packet: none may show its start before its own turn.
      sequence.fromTo(
        packet,
        { xPercent: -50, x: connectorEnd(enter) },
        {
          xPercent: -50,
          x: connectorEnd(leave),
          duration: SYNC.cross,
          ease: "none",
          immediateRender: false,
        },
        start,
      );
      if (step === 0) {
        sequence.fromTo(
          packet,
          { opacity: 0 },
          { opacity: 1, duration: SYNC.packetFade, ease: ease.out, immediateRender: false },
          start,
        );
      } else {
        sequence.set(packet, { opacity: 1 }, start);
      }
      if (step === route.length - 1) {
        sequence.to(
          packet,
          { opacity: 0, duration: SYNC.packetFade, ease: ease.out },
          end - SYNC.packetFade,
        );
      } else {
        sequence.set(packet, { opacity: 0 }, end);
      }
    });

    at += route.length * SYNC.cross;
    sequence.from(event, POP_FROM, at);
    if (light) {
      sequence
        .to(light, { opacity: 1, duration: SYNC.litUp, ease: ease.out }, at)
        .to(
          light,
          { opacity: 0, duration: SYNC.litOut, ease: ease.out },
          at + SYNC.litUp + SYNC.litHold,
        );
    }
  });

  sequence.from(pill, POP_FROM, at + POP_SECONDS - SYNC.pillLap);
  return { sequence, loops: [] };
}

const fullMotion: Record<
  AgentPanelKind,
  (panel: HTMLElement, parts: HTMLElement[]) => DemoPlayback
> = { chat, leads, report, sync, checklist, orchestra };

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
