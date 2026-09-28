// The proof bots' extrusion (ui-spec §7.2.1): turns a solid's outlines and a depth vector into one
// continuous side face per outline edge, so the depth reads as a swept solid with no stair steps.
// An edge gets a quad `a, b, b+v, a+v` only when its outward normal faces the depth (n·v > 0); the
// front outline and these quads cover the whole swept solid, so no back cap is needed. Each quad's
// shade follows its facing: θ from straight down toward right, clamped to 0–90°, maps to
// 20–100% `sideNear` (rounded to 5). Quads come back sorted far to near, ready to paint.
import type { ProofBotDepthVector } from "@/lib/proofBotDepth";
import type { ProofBotGeometry, ProofBotRotation, ProofBotSolidPart } from "@/lib/proofBotShape";
import type { ProofBotMaterial } from "@/lib/proofBotShades";

type Point = readonly [number, number];

/** One side face: its outline (SVG points), its material and its `sideNear` share, in percent. */
export type ProofBotSideFace = {
  readonly points: string;
  readonly material: ProofBotMaterial;
  readonly near: number;
};

const arcSegments = 12;
const circleSegments = 32;

function polygonPoints(points: string): Point[] {
  const numbers = points.trim().split(/[\s,]+/).map(Number);
  const result: Point[] = [];
  for (let index = 0; index + 1 < numbers.length; index += 2) result.push([numbers[index], numbers[index + 1]]);
  return result;
}

/** A circular arc's points after `from`, sampled; only rx = ry with no axis rotation is supported. */
function arcPoints(from: Point, to: Point, radius: number, large: boolean, sweep: boolean): Point[] {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const halfX = (x1 - x2) / 2;
  const halfY = (y1 - y2) / 2;
  const halfSquared = halfX * halfX + halfY * halfY;
  const r = Math.max(radius, Math.sqrt(halfSquared));
  const sign = large !== sweep ? 1 : -1;
  const coefficient = sign * Math.sqrt(Math.max(0, (r * r - halfSquared) / halfSquared));
  const cx = coefficient * halfY + (x1 + x2) / 2;
  const cy = -coefficient * halfX + (y1 + y2) / 2;
  const start = Math.atan2(y1 - cy, x1 - cx);
  let delta = Math.atan2(y2 - cy, x2 - cx) - start;
  if (sweep && delta < 0) delta += 2 * Math.PI;
  if (!sweep && delta > 0) delta -= 2 * Math.PI;
  const result: Point[] = [];
  for (let step = 1; step < arcSegments; step += 1) {
    const angle = start + (delta * step) / arcSegments;
    result.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
  }
  result.push(to);
  return result;
}

/** A path's vertices; only M, L, H, V, h, v, A and Z are supported, anything else throws. */
function pathPoints(d: string): Point[] {
  const tokens = d.match(/[A-Za-z]|-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/g) ?? [];
  const result: Point[] = [];
  let current: Point = [0, 0];
  let index = 0;
  let command = "";
  const next = () => Number(tokens[index++]);
  const isNumber = () => index < tokens.length && !/^[A-Za-z]$/.test(tokens[index]);
  while (index < tokens.length) {
    if (!isNumber()) command = tokens[index++];
    switch (command) {
      case "M":
      case "L":
        current = [next(), next()];
        result.push(current);
        if (command === "M") command = "L";
        break;
      case "H":
        current = [next(), current[1]];
        result.push(current);
        break;
      case "V":
        current = [current[0], next()];
        result.push(current);
        break;
      case "h":
        current = [current[0] + next(), current[1]];
        result.push(current);
        break;
      case "v":
        current = [current[0], current[1] + next()];
        result.push(current);
        break;
      case "A": {
        const rx = next();
        const ry = next();
        const rotation = next();
        const large = next() === 1;
        const sweep = next() === 1;
        const to: Point = [next(), next()];
        if (rx !== ry || rotation !== 0) throw new Error(`proofBotExtrude: unsupported arc in "${d}"`);
        result.push(...arcPoints(current, to, rx, large, sweep));
        current = to;
        break;
      }
      case "Z":
        break;
      default:
        throw new Error(`proofBotExtrude: unsupported path command "${command}" in "${d}"`);
    }
  }
  return result;
}

function outlinePoints(geometry: ProofBotGeometry): Point[] {
  switch (geometry.kind) {
    case "polygon":
      return polygonPoints(geometry.points);
    case "rect": {
      const { x, y, width, height } = geometry;
      return [
        [x, y],
        [x + width, y],
        [x + width, y + height],
        [x, y + height],
      ];
    }
    case "path":
      return pathPoints(geometry.d);
    case "circle":
      return Array.from({ length: circleSegments }, (_, step): Point => {
        const angle = (2 * Math.PI * step) / circleSegments;
        return [geometry.cx + geometry.r * Math.cos(angle), geometry.cy + geometry.r * Math.sin(angle)];
      });
  }
}

function rotate(points: Point[], rotation: ProofBotRotation | undefined): Point[] {
  if (!rotation) return points;
  const radians = (rotation.angle * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return points.map(([x, y]): Point => {
    const dx = x - rotation.cx;
    const dy = y - rotation.cy;
    return [rotation.cx + dx * cos - dy * sin, rotation.cy + dx * sin + dy * cos];
  });
}

const same = (a: Point, b: Point) => Math.abs(a[0] - b[0]) < 1e-9 && Math.abs(a[1] - b[1]) < 1e-9;

/** The outline's distinct vertices, wound so the outward normal of edge a→b is (b−a) turned (y, −x). */
function vertices(part: ProofBotSolidPart): Point[] {
  const points = rotate(outlinePoints(part.geometry), part.rotation).filter(
    (point, index, all) => index === 0 || !same(point, all[index - 1]),
  );
  if (points.length > 1 && same(points[0], points[points.length - 1])) points.pop();
  let area = 0;
  points.forEach(([x1, y1], index) => {
    const [x2, y2] = points[(index + 1) % points.length];
    area += x1 * y2 - x2 * y1;
  });
  return area < 0 ? points.reverse() : points;
}

const coordinate = (value: number) => String(Math.round(value * 100) / 100);
const format = (points: readonly Point[]) => points.map(([x, y]) => `${coordinate(x)},${coordinate(y)}`).join(" ");

/** Every depth-facing side face of the parts, farthest first (ascending edge midpoint · v). */
export function proofBotSideFaces(
  parts: readonly ProofBotSolidPart[],
  depth: ProofBotDepthVector,
): readonly ProofBotSideFace[] {
  const { dx, dy } = depth;
  const faces: { face: ProofBotSideFace; order: number }[] = [];
  for (const part of parts) {
    const points = vertices(part);
    points.forEach((a, index) => {
      const b = points[(index + 1) % points.length];
      const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (length === 0) return;
      const nx = (b[1] - a[1]) / length;
      const ny = -(b[0] - a[0]) / length;
      if (nx * dx + ny * dy <= 1e-9) return;
      const theta = Math.min(90, Math.max(0, (Math.atan2(nx, ny) * 180) / Math.PI));
      const near = Math.round((20 + (80 * theta) / 90) / 5) * 5;
      faces.push({
        face: {
          points: format([a, b, [b[0] + dx, b[1] + dy], [a[0] + dx, a[1] + dy]]),
          material: part.material,
          near,
        },
        order: ((a[0] + b[0]) / 2) * dx + ((a[1] + b[1]) / 2) * dy,
      });
    });
  }
  return faces.sort((first, second) => first.order - second.order).map(({ face }) => face);
}
