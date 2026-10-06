// The Orchestra demo's replay under full motion (ui-spec §4.4, Motion): the swimlanes' rows pop in
// by `data-demo-order`, then a token carries the work down them. It leaves the first Lead card's
// bottom and rides each link in turn, down its vertical leg, then across into the next card's
// side; the card takes it in and flashes, and it comes out of that card's bottom for the next link.
// At the first checks row one role chip blinks in the accent (a finding); the token rides the two
// dashed fix links; the second checks row's ticks pop in order; the token rides the last link back
// to the Lead; then the pill pops and the token is gone. 3.74s to 5s, inside the 6s slot.
//
// Pacing (2026-10-05): no two runs are paced alike. Each link's ride and each card's hold take a
// random time from their `[min, max]` range, drawn from the run's budget (lib/demoBudget.ts) as
// the sequence is built, so a paused run resumes exactly where it stopped. The order, the flashes,
// the finding's blink and the ticks are the same every time.
//
// Which way a link runs, which cards are already in the accent and where the finding and the ticks
// sit come from lib/orchestraRows.ts, not from classes. A link's legs are measured from the DOM as
// the token reaches it (lanes are 92px at 360 and 199px at 768), so a resize mid-run is picked up
// on the next leg, and only after that link's row has finished popping, so no transform skews the
// reading. The token moves with `x`/`y` only; no link's `left`/`right` is touched.
//
// Every starting state is set here: the token has `hidden` in the markup and is shown, and taken
// out of the grid's flow, from JS. Reverting the sequence puts the panel back to its finished state.
import {
  LEAD_IN,
  POP_FROM,
  POP_SECONDS,
  newSequence,
  type DemoPlayback,
} from "@/lib/agentDemoPop";
import { spendBudget } from "@/lib/demoBudget";
import { animTargets } from "@/lib/motion";
import { orchestraRows, type OrchestraLinkFrom, type OrchestraRowSpec } from "@/lib/orchestraRows";
import type { Range } from "@/lib/processBotMotion";

const ACCENT = "var(--color-accent)";
const ON_ACCENT = "var(--color-on-accent)";
const LINE = "var(--color-line)";

/** Seconds, unless noted. */
const RUN = {
  /** Between rows popping in. */
  rowStagger: 0.04,
  /** When the token shows at the first card's bottom: after the first two rows have popped. */
  tokenAt: 0.6,
  /** The token coming out of a card, or going into one. */
  tokenPop: 0.1,
  /** A link's vertical leg, at an even pace. */
  down: 0.13,
  /** A link's horizontal leg at an even pace, by how many lanes it crosses. */
  across: { 1: 0.17, 2: 0.23 },
  /** How much of that even pace one link's ride takes (both legs alike), drawn per link. */
  pace: [0.65, 1.3],
  /** Half a card's flash (out, then back). */
  flash: 0.15,
  /** A card's scale at the top of its flash: bordered in `line`, or already in the accent. */
  pulse: { plain: 1.04, accent: 1.07 },
  /** Half a blink of the finding's chip; it blinks twice. */
  findingBlink: 0.085,
  /**
   * How long the token stays in a card, drawn per card: any card, the finding's (never shorter
   * than its two blinks), the ticks'.
   */
  dwell: { card: [0.04, 0.2], finding: [0.34, 0.5], ticks: [0.16, 0.36] },
  /** One tick popping in, and between ticks. */
  tick: 0.3,
  tickStagger: 0.08,
  /** The longest the whole run may take, the pill's pop included. */
  longest: 5,
} as const;
/** The last card: the token doesn't stay, the pill pops. */
const NO_DWELL: Range = [0, 0];

type Point = { readonly x: number; readonly y: number };
type LinkPath = { readonly start: Point; readonly corner: Point; readonly end: Point };

/**
 * A link's line, in px from the diagram's padding box (where the token's `x`/`y` start): where it
 * leaves the previous card, its corner, and where it meets its own card. The legs are the span's
 * borders, so each point sits on a border's centre line. Straight down has no corner.
 */
function linkPath(diagram: HTMLElement, link: HTMLElement, from: OrchestraLinkFrom): LinkPath {
  const box = diagram.getBoundingClientRect();
  const rect = link.getBoundingClientRect();
  const left = rect.left - box.left - diagram.clientLeft;
  const top = rect.top - box.top - diagram.clientTop;
  const right = left + rect.width;
  const bottom = top + rect.height;

  if (from === "down") {
    const x = left + rect.width / 2;
    const end = { x, y: bottom };
    return { start: { x, y: top }, corner: end, end };
  }
  // Half the bottom leg's thickness (1px, or 2px on the fix); the vertical leg is as thick.
  const half = (link.offsetHeight - link.clientHeight) / 2;
  const x = from === "left" ? left + half : right - half;
  const y = bottom - half;
  return { start: { x, y: top }, corner: { x, y }, end: { x: from === "left" ? right : left, y } };
}

/** Lead cards and the fix card are bordered in the accent already (as `OrchestraRow` draws them). */
function inAccent(spec: OrchestraRowSpec): boolean {
  return spec.lane === "lead" || Boolean(spec.fix && spec.step);
}

/**
 * A card's flash as the token reaches it: its border goes to the accent and back with a small
 * scale pulse. A card already in the accent lifts its background and pulses a little more instead.
 */
function flash(
  sequence: ReturnType<typeof newSequence>,
  card: HTMLElement,
  spec: OrchestraRowSpec,
  at: number,
) {
  const peak = inAccent(spec)
    ? { scale: RUN.pulse.accent, backgroundColor: LINE }
    : { scale: RUN.pulse.plain, borderColor: ACCENT };
  sequence.to(card, { ...peak, duration: RUN.flash, repeat: 1, yoyo: true }, at);
}

/** A link's ride at an even pace: its vertical leg, then its horizontal one unless it runs down. */
function evenRide({ from, lanes }: NonNullable<OrchestraRowSpec["link"]>): number {
  return RUN.down + (from === "down" ? 0 : RUN.across[lanes]);
}

/** Orchestra: the rows pop in, then the token runs the links, through the fix, back to the Lead. */
export function orchestra(panel: HTMLElement, parts: HTMLElement[]): DemoPlayback {
  const sequence = newSequence();
  const [diagram] = animTargets(panel, "orch-diagram");
  const [token] = animTargets(panel, "orch-token");
  const rows = parts.filter((part) => part.dataset.anim === "orch-row");
  const ticks = parts.filter((part) => part.dataset.anim === "orch-tick");
  const pill = parts.filter((part) => !rows.includes(part) && !ticks.includes(part));

  const stops = rows.flatMap((cell) => {
    const spec = orchestraRows.find((row) => row.row === Number(cell.dataset.row));
    const [card] = animTargets(cell, "orch-card");
    const [link] = animTargets(cell, "orch-link");
    return spec && card ? [{ cell, card, spec, link }] : [];
  });
  const [first, ...rest] = stops;

  // Without the drawing's parts there is nothing to ride: every part just pops in by order.
  if (!diagram || !token || !first) {
    sequence.from(parts, { ...POP_FROM, stagger: RUN.rowStagger }, LEAD_IN);
    return { sequence, loops: [] };
  }

  sequence.from(rows, { ...POP_FROM, stagger: RUN.rowStagger }, LEAD_IN);

  let at: number = RUN.tokenAt;
  sequence.set(
    token,
    {
      display: "block",
      position: "absolute",
      top: 0,
      left: 0,
      xPercent: -50,
      yPercent: -50,
      willChange: "transform, opacity",
    },
    at,
  );
  flash(sequence, first.card, first.spec, at);

  // The cards the token rides to, each with its link, and two drawn times per card: the ride
  // along its link, then the hold in it. What is fixed around them: when the token shows, its pop
  // out of each card and the pill's pop.
  const rides = rest.flatMap(({ cell, card, spec, link }) =>
    link && spec.link ? [{ cell, card, spec, link, ride: spec.link }] : [],
  );
  const times = spendBudget(
    RUN.longest - RUN.tokenAt - rides.length * RUN.tokenPop - POP_SECONDS,
    rides.flatMap(({ spec, ride }, index): Range[] => {
      const even = evenRide(ride);
      const [fast, slow] = RUN.pace;
      let dwell: Range = index < rides.length - 1 ? RUN.dwell.card : NO_DWELL;
      if (spec.ticks) dwell = RUN.dwell.ticks;
      else if (spec.roles === "checks") dwell = RUN.dwell.finding;
      return [[even * fast, even * slow], dwell];
    }),
  );

  rides.forEach(({ cell, card, spec, link, ride }, index) => {
    const { from, lanes } = ride;
    const path = () => linkPath(diagram, link, from);
    // This link's share of the even pace, and how long the token then stays in the card.
    const pace = (times[index * 2] ?? 0) / evenRide(ride);
    const dwell = times[index * 2 + 1] ?? 0;
    const down = RUN.down * pace;

    // Out of the previous card's bottom, down the vertical leg, then across into this card's side.
    sequence
      .set(token, { x: () => path().start.x, y: () => path().start.y }, at)
      .fromTo(
        token,
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: RUN.tokenPop, immediateRender: false },
        at,
      );
    at += RUN.tokenPop;
    sequence.to(
      token,
      {
        y: () => path().corner.y,
        duration: down,
        ease: from === "down" ? "power1.inOut" : "power1.in",
      },
      at,
    );
    at += down;
    if (from !== "down") {
      const seconds = RUN.across[lanes] * pace;
      sequence.to(token, { x: () => path().end.x, duration: seconds, ease: "power1.out" }, at);
      at += seconds;
    }

    // The card takes the token in and flashes.
    sequence.to(token, { opacity: 0, scale: 0, duration: RUN.tokenPop }, at);
    flash(sequence, card, spec, at);

    if (spec.ticks) {
      sequence.from(
        ticks,
        {
          opacity: 0,
          scale: 0,
          duration: RUN.tick,
          ease: "back.out(2)",
          stagger: RUN.tickStagger,
        },
        at,
      );
    } else if (spec.roles === "checks") {
      // The first checks row, no ticks yet: one chip blinks in the accent, a finding.
      const [finding] = animTargets(cell, "orch-role");
      if (finding) {
        sequence.to(
          finding,
          {
            backgroundColor: ACCENT,
            color: ON_ACCENT,
            duration: RUN.findingBlink,
            ease: "none",
            repeat: 3,
            yoyo: true,
          },
          at,
        );
      }
    }
    at += dwell;
  });

  sequence.from(pill, POP_FROM, at).set(token, { display: "none" }, at + RUN.tokenPop);
  return { sequence, loops: [] };
}
