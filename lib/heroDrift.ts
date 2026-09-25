// The hero network's slow drift (ui-spec §2.5, Motion), as pure data. Each node loops gently
// around its place on its own x and y sine waves: 6–10px amplitude, 6–12s periods and a random
// phase per axis, all seeded so the drift is the same on every load. Links are drawn between the
// drifted positions, so each line moves on its own. A node's amplitude shrinks, per axis, near a
// keep-out it must stay out of (the text boxes plus the 16px band the static layout keeps clear
// around them, for every node; the portrait frame, for agents), so the drift never carries it in. Positions are written into one reused array: nothing is allocated per frame.
import { TEXT_PADDING, type HeroNetwork, type NetworkRect } from "@/lib/heroNetwork";
import { seededRandom } from "@/lib/seededRandom";

/** Node positions in CSS pixels: x at 2i, y at 2i + 1 for node i. */
export type NodePositions = Float32Array;

type DriftKeepOuts = {
  /** No node may drift into these. */
  readonly textRects: readonly NetworkRect[];
  /** No agent may drift into these. */
  readonly agentRects: readonly NetworkRect[];
};

export type NetworkDrift = {
  readonly positions: NodePositions;
  /** Moves every node to where it is at `time` seconds, its drift scaled by `weight` (0–1). */
  update(time: number, weight: number): void;
};

const SEED = 20260926;
const MIN_AMPLITUDE = 6;
const MAX_AMPLITUDE = 10;
const MIN_PERIOD = 6;
const MAX_PERIOD = 12;
/** CSS pixels a drifting node always keeps from the edge of a keep-out it must stay out of. */
const KEEP_OUT_MARGIN = 2;
/** Seconds the drift takes to grow from rest to full when it starts or resumes. */
const SETTLE_TIME = 1.5;

/** Every node at its resting place. */
export function restingPositions(network: HeroNetwork): NodePositions {
  const positions = new Float32Array(network.nodes.length * 2);
  network.nodes.forEach(({ x, y }, i) => {
    positions[i * 2] = x;
    positions[i * 2 + 1] = y;
  });
  return positions;
}

/** 0 → 1 over the settle time, eased, so the drift fades in rather than jumping from rest. */
export function driftWeight(elapsed: number): number {
  if (elapsed >= SETTLE_TIME) return 1;
  if (elapsed <= 0) return 0;
  return 0.5 - 0.5 * Math.cos((Math.PI * elapsed) / SETTLE_TIME);
}

/**
 * Per-axis drift room for a point outside `rect`: the axis on which it's furthest out keeps its
 * room to the rect's edge (minus the margin); the other axis is left free, since staying out on
 * one axis is enough to stay out of the rect. So a node pressed against a keep-out still moves
 * along it.
 */
function limitAgainst(x: number, y: number, rect: NetworkRect, limits: [number, number]) {
  const outX = Math.max(rect.x - x, x - (rect.x + rect.width));
  const outY = Math.max(rect.y - y, y - (rect.y + rect.height));
  const axis = outX >= outY ? 0 : 1;
  limits[axis] = Math.min(limits[axis], Math.max(outX, outY) - KEEP_OUT_MARGIN);
}

/** The rect grown by `padding` on every side. */
function grow(rect: NetworkRect, padding: number): NetworkRect {
  return {
    x: rect.x - padding,
    y: rect.y - padding,
    width: rect.width + padding * 2,
    height: rect.height + padding * 2,
  };
}

export function createNetworkDrift(
  network: HeroNetwork,
  { textRects, agentRects }: DriftKeepOuts,
): NetworkDrift {
  const random = seededRandom(SEED);
  const count = network.nodes.length;
  const amplitude = new Float32Array(count * 2);
  const speed = new Float32Array(count * 2);
  const phase = new Float32Array(count * 2);
  // The same clear band around the text that the static layout keeps.
  const textBands = textRects.map((rect) => grow(rect, TEXT_PADDING));

  network.nodes.forEach(({ x, y, agent }, i) => {
    const limits: [number, number] = [MAX_AMPLITUDE, MAX_AMPLITUDE];
    for (const rect of textBands) limitAgainst(x, y, rect, limits);
    if (agent) for (const rect of agentRects) limitAgainst(x, y, rect, limits);
    for (let axis = 0; axis < 2; axis += 1) {
      const k = i * 2 + axis;
      const wanted = MIN_AMPLITUDE + random() * (MAX_AMPLITUDE - MIN_AMPLITUDE);
      amplitude[k] = Math.max(0, Math.min(wanted, limits[axis]));
      speed[k] = (Math.PI * 2) / (MIN_PERIOD + random() * (MAX_PERIOD - MIN_PERIOD));
      phase[k] = random() * Math.PI * 2;
    }
  });

  const positions = restingPositions(network);

  return {
    positions,
    update(time, weight) {
      for (let i = 0; i < count; i += 1) {
        const node = network.nodes[i];
        const kx = i * 2;
        const ky = kx + 1;
        positions[kx] = node.x + Math.sin(time * speed[kx] + phase[kx]) * amplitude[kx] * weight;
        positions[ky] = node.y + Math.sin(time * speed[ky] + phase[ky]) * amplitude[ky] * weight;
      }
    },
  };
}
