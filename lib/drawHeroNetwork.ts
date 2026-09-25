// Draws the hero network on a 2D canvas (ui-spec §2.5). The colour is passed in (read from the
// `--color-accent` token by the caller); each layer's strength is set with `globalAlpha`, so no
// colour value lives here.
import type { HeroNetwork } from "@/lib/heroNetwork";

const LINK_WIDTH = 1;
const LINK_ALPHA = 0.1;
const NODE_RADIUS = 1.25;
const NODE_ALPHA = 0.3;
const AGENT_RADIUS = 2.5;
const AGENT_ALPHA = 1;
const HALO_RADIUS = 8;
const HALO_ALPHA = 0.15;

type DrawOptions = {
  /** The accent colour, exactly as the token gives it. */
  readonly accent: string;
  /** Backing-store pixels per CSS pixel. */
  readonly scale: number;
};

function dot(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

/** Clears the canvas and draws links, then plain nodes, then agents with their halos. */
export function drawHeroNetwork(
  ctx: CanvasRenderingContext2D,
  network: HeroNetwork,
  { accent, scale }: DrawOptions,
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
    ctx.moveTo(network.nodes[from].x, network.nodes[from].y);
    ctx.lineTo(network.nodes[to].x, network.nodes[to].y);
  }
  ctx.stroke();

  ctx.globalAlpha = NODE_ALPHA;
  for (const node of network.nodes) {
    if (!node.agent) dot(ctx, node.x, node.y, NODE_RADIUS);
  }

  for (const node of network.nodes) {
    if (!node.agent) continue;
    ctx.globalAlpha = HALO_ALPHA;
    dot(ctx, node.x, node.y, HALO_RADIUS);
    ctx.globalAlpha = AGENT_ALPHA;
    dot(ctx, node.x, node.y, AGENT_RADIUS);
  }

  ctx.globalAlpha = 1;
}
