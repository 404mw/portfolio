// The hero network's travelling pulses, as pure data (ui-spec §2.5, Motion). Each agent sends a
// pulse about every 1.5s; a pulse walks a few links from its agent without revisiting a node,
// fading in as it leaves and out as it arrives. Nodes drift (lib/heroDrift.ts), so a pulse keeps
// only its path and its place on the current link, and every frame is placed between that link's
// current endpoints. It works on the exact network instance the static draw built. Pulse objects
// are made only when a pulse is sent; each frame reuses the same points. This file only computes;
// lib/drawHeroNetwork.ts draws, hooks/useHeroNetworkMotion.ts runs the clock.
import type { NodePositions } from "@/lib/heroDrift";
import type { HeroNetwork } from "@/lib/heroNetwork";

export type PulsePoint = {
  /** CSS pixels on the canvas. */
  readonly x: number;
  readonly y: number;
  /** 0–1: the pulse fades in and out at the ends of its walk. */
  readonly alpha: number;
};

export type PulseField = {
  /**
   * Moves every pulse on by `seconds` along the links as they are at `positions`, sends new ones
   * from the agents, and returns where they are. The returned array is reused on the next step.
   */
  step(seconds: number, positions: NodePositions): readonly PulsePoint[];
};

/** Seconds between pulses from one agent, give or take the jitter. */
const SPAWN_EVERY = 1.5;
const SPAWN_JITTER = 0.25;
/** CSS pixels per second. */
const SPEED = 110;
const MIN_HOPS = 2;
const MAX_HOPS = 4;
/** CSS pixels over which a pulse fades in at its start and out at its end. */
const FADE_LENGTH = 24;

type Pulse = {
  /** Node indexes, agent first. */
  readonly path: readonly number[];
  /** The link it's on: from `path[hop]` to `path[hop + 1]`. */
  hop: number;
  /** 0–1 along that link. */
  along: number;
  /** CSS pixels covered since it left, for the fade-in. */
  travelled: number;
};

type MutablePoint = { x: number; y: number; alpha: number };

function linkLength(positions: NodePositions, from: number, to: number): number {
  return Math.hypot(
    positions[to * 2] - positions[from * 2],
    positions[to * 2 + 1] - positions[from * 2 + 1],
  );
}

export function createPulseField(network: HeroNetwork, random: () => number = Math.random): PulseField {
  const neighbours: number[][] = network.nodes.map(() => []);
  for (const [a, b] of network.links) {
    neighbours[a].push(b);
    neighbours[b].push(a);
  }
  const agents = network.nodes.flatMap((node, index) =>
    node.agent && neighbours[index].length > 0 ? [index] : [],
  );
  // Each agent starts at a random point in its cycle, so they don't fire together.
  const untilNext = agents.map(() => random() * SPAWN_EVERY);
  const pulses: Pulse[] = [];
  const pool: MutablePoint[] = [];
  const visible: MutablePoint[] = [];

  const nextInterval = () => SPAWN_EVERY + (random() * 2 - 1) * SPAWN_JITTER;

  const walkFrom = (start: number): Pulse | null => {
    const hops = MIN_HOPS + Math.floor(random() * (MAX_HOPS - MIN_HOPS + 1));
    const path = [start];
    const seen = new Set(path);
    while (path.length <= hops) {
      const options = neighbours[path[path.length - 1]].filter((node) => !seen.has(node));
      if (options.length === 0) break;
      const next = options[Math.floor(random() * options.length)];
      path.push(next);
      seen.add(next);
    }
    return path.length < 2 ? null : { path, hop: 0, along: 0, travelled: 0 };
  };

  /** Moves the pulse `distance` px on along its path; false once it has arrived. */
  const advance = (pulse: Pulse, distance: number, positions: NodePositions): boolean => {
    const { path } = pulse;
    let left = distance;
    pulse.travelled += distance;
    while (pulse.hop < path.length - 1) {
      const length = linkLength(positions, path[pulse.hop], path[pulse.hop + 1]);
      const rest = (1 - pulse.along) * length;
      if (left < rest) {
        pulse.along += left / length;
        return true;
      }
      left -= rest;
      pulse.hop += 1;
      pulse.along = 0;
    }
    return false;
  };

  const place = (pulse: Pulse, positions: NodePositions, point: MutablePoint) => {
    const { path, hop, along, travelled } = pulse;
    const from = path[hop];
    const to = path[hop + 1];
    const length = linkLength(positions, from, to);
    let remaining = (1 - along) * length;
    for (let i = hop + 1; i < path.length - 1; i += 1) {
      remaining += linkLength(positions, path[i], path[i + 1]);
    }
    point.x = positions[from * 2] + (positions[to * 2] - positions[from * 2]) * along;
    point.y = positions[from * 2 + 1] + (positions[to * 2 + 1] - positions[from * 2 + 1]) * along;
    point.alpha = Math.max(0, Math.min(1, travelled / FADE_LENGTH, remaining / FADE_LENGTH));
  };

  return {
    step(seconds, positions) {
      let kept = 0;
      for (const pulse of pulses) {
        if (advance(pulse, SPEED * seconds, positions)) pulses[kept++] = pulse;
      }
      pulses.length = kept;

      for (let i = 0; i < agents.length; i += 1) {
        const left = untilNext[i] - seconds;
        if (left > 0) {
          untilNext[i] = left;
          continue;
        }
        untilNext[i] = nextInterval();
        const pulse = walkFrom(agents[i]);
        if (pulse) pulses.push(pulse);
      }

      while (pool.length < pulses.length) pool.push({ x: 0, y: 0, alpha: 0 });
      visible.length = 0;
      for (let i = 0; i < pulses.length; i += 1) {
        place(pulses[i], positions, pool[i]);
        visible.push(pool[i]);
      }
      return visible;
    },
  };
}
