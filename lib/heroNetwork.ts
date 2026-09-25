// The hero's agent network, as pure data (ui-spec §2.5). One fixed seed gives 96 points in 0–1
// space, so every load and every width shows the same network. This file only computes; the
// drawing lives in lib/drawHeroNetwork.ts and the DOM measuring in lib/heroNetworkLayout.ts.
import { seededRandom } from "@/lib/seededRandom";

export type NetworkRect = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
};

export type NetworkNode = {
  readonly x: number;
  readonly y: number;
  readonly agent: boolean;
};

export type HeroNetwork = {
  readonly nodes: readonly NetworkNode[];
  /** Pairs of indexes into `nodes`, each pair once. */
  readonly links: readonly (readonly [number, number])[];
};

type NetworkInput = {
  /** Canvas size in CSS pixels. */
  readonly width: number;
  readonly height: number;
  /** Text boxes (`data-network-avoid="text"`): no node sits inside them. */
  readonly textRects: readonly NetworkRect[];
  /** Boxes no agent sits in (`data-network-avoid="agents"`: the portrait frame). */
  readonly agentRects: readonly NetworkRect[];
};

const SEED = 20260925;
const POINT_COUNT = 96;
const TEXT_PADDING = 16;
const LINKS_PER_NODE = 2;

/** Node and agent counts by canvas width: the first matching `below` wins. */
const TIERS = [
  { below: 768, nodes: 24, agents: 3, linkReach: 120 },
  { below: 1024, nodes: 40, agents: 4, linkReach: 160 },
  { below: 1920, nodes: 64, agents: 5, linkReach: 160 },
  { below: Infinity, nodes: 96, agents: 6, linkReach: 160 },
] as const;

const POINTS: readonly { readonly x: number; readonly y: number }[] = (() => {
  const random = seededRandom(SEED);
  return Array.from({ length: POINT_COUNT }, () => ({ x: random(), y: random() }));
})();

function isInside(x: number, y: number, rect: NetworkRect, padding: number): boolean {
  return (
    x >= rect.x - padding &&
    x <= rect.x + rect.width + padding &&
    y >= rect.y - padding &&
    y <= rect.y + rect.height + padding
  );
}

function linkNearest(
  points: readonly { readonly x: number; readonly y: number }[],
  reach: number,
): [number, number][] {
  const seen = new Set<string>();
  const links: [number, number][] = [];
  points.forEach((point, index) => {
    const nearest = points
      .map((other, otherIndex) => ({
        otherIndex,
        distance: Math.hypot(other.x - point.x, other.y - point.y),
      }))
      .filter(({ otherIndex, distance }) => otherIndex !== index && distance <= reach)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, LINKS_PER_NODE);
    for (const { otherIndex } of nearest) {
      const pair: [number, number] = [Math.min(index, otherIndex), Math.max(index, otherIndex)];
      const key = `${pair[0]}-${pair[1]}`;
      if (seen.has(key)) continue;
      seen.add(key);
      links.push(pair);
    }
  });
  return links;
}

/** Builds the network for a canvas of the given size, clear of the given keep-outs. */
export function buildHeroNetwork({
  width,
  height,
  textRects,
  agentRects,
}: NetworkInput): HeroNetwork {
  const tier = TIERS.find(({ below }) => width < below) ?? TIERS[TIERS.length - 1];

  const points = POINTS.slice(0, tier.nodes)
    .map(({ x, y }) => ({ x: x * width, y: y * height }))
    .filter(({ x, y }) => !textRects.some((rect) => isInside(x, y, rect, TEXT_PADDING)));

  // Agents in seeded order: the first points that are clear of the portrait frame.
  const agentIndexes = new Set<number>();
  points.forEach(({ x, y }, index) => {
    if (agentIndexes.size >= tier.agents) return;
    if (agentRects.some((rect) => isInside(x, y, rect, 0))) return;
    agentIndexes.add(index);
  });

  return {
    nodes: points.map(({ x, y }, index) => ({ x, y, agent: agentIndexes.has(index) })),
    links: linkNearest(points, tier.linkReach),
  };
}
