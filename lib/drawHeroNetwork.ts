// Draws the hero network on a 2D canvas (ui-spec §2.5): links, nodes and agents, then the pulse
// layer on top. The static draw uses each node's resting place; the motion pass passes the
// drifted positions every frame and redraws the whole network, which is cheap (at most 96 nodes,
// one stroked path for all links). The colour is passed in (read from the `--color-accent` token
// by the caller); each layer's strength is set with `globalAlpha`, so no colour value lives here.
import { restingPositions, type NodePositions } from "@/lib/heroDrift";
import type { HeroNetwork, NetworkRect } from "@/lib/heroNetwork";
import type { PulsePoint } from "@/lib/heroPulses";

const LINK_WIDTH = 1;
const LINK_ALPHA = 0.1;
const NODE_RADIUS = 1.25;
const NODE_ALPHA = 0.3;
const AGENT_RADIUS = 2.5;
const AGENT_ALPHA = 1;
const HALO_RADIUS = 8;
const HALO_ALPHA = 0.15;
/** A 2px pulse dot. */
const PULSE_RADIUS = 1;

type DrawOptions = {
  /** The accent colour, exactly as the token gives it. */
  readonly accent: string;
  /** Backing-store pixels per CSS pixel. */
  readonly scale: number;
};

/**
 * What the last static draw used: the motion runs on this exact network, colour and scale, and
 * keeps the drift clear of the same keep-outs.
 */
export type HeroNetworkScene = DrawOptions & {
  readonly network: HeroNetwork;
  readonly textRects: readonly NetworkRect[];
  readonly agentRects: readonly NetworkRect[];
};

function dot(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Clears the canvas and draws links, then plain nodes, then agents with their halos, with every
 * node at `positions` (its resting place if none are given).
 */
export function drawHeroNetwork(
  ctx: CanvasRenderingContext2D,
  network: HeroNetwork,
  { accent, scale }: DrawOptions,
  positions: NodePositions = restingPositions(network),
) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.strokeStyle = accent;
  ctx.fillStyle = accent;

  ctx.globalAlpha = LINK_ALPHA;
  ctx.lineWidth = LINK_WIDTH;
  ctx.beginPath();
  for (const [from, to] of network.links) {
    ctx.moveTo(positions[from * 2], positions[from * 2 + 1]);
    ctx.lineTo(positions[to * 2], positions[to * 2 + 1]);
  }
  ctx.stroke();

  const { nodes } = network;
  ctx.globalAlpha = NODE_ALPHA;
  for (let i = 0; i < nodes.length; i += 1) {
    if (!nodes[i].agent) dot(ctx, positions[i * 2], positions[i * 2 + 1], NODE_RADIUS);
  }

  for (let i = 0; i < nodes.length; i += 1) {
    if (!nodes[i].agent) continue;
    ctx.globalAlpha = HALO_ALPHA;
    dot(ctx, positions[i * 2], positions[i * 2 + 1], HALO_RADIUS);
    ctx.globalAlpha = AGENT_ALPHA;
    dot(ctx, positions[i * 2], positions[i * 2 + 1], AGENT_RADIUS);
  }

  ctx.globalAlpha = 1;
}

/** Draws each pulse as a 2px accent dot at its own strength, times `strength` (0–1) for all. */
export function drawHeroPulses(
  ctx: CanvasRenderingContext2D,
  pulses: readonly PulsePoint[],
  { accent, scale }: DrawOptions,
  strength = 1,
) {
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.fillStyle = accent;
  for (const { x, y, alpha } of pulses) {
    ctx.globalAlpha = alpha * strength;
    dot(ctx, x, y, PULSE_RADIUS);
  }
  ctx.globalAlpha = 1;
}
