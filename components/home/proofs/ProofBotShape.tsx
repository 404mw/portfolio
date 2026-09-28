// One outline of a proof bot (ui-spec §7.2.1) drawn as its SVG element: a polygon, rect, path or
// circle. Colour comes in through `style` (token expressions from lib/proofBotShades.ts) or as a
// `url(#…)` paint reference; never a raw value. Used by the solids, the flat details and the clip.
import type { CSSProperties } from "react";
import { proofBotRotate, type ProofBotGeometry, type ProofBotRotation } from "@/lib/proofBotShape";

type ProofBotShapeProps = {
  readonly geometry: ProofBotGeometry;
  readonly rotation?: ProofBotRotation;
  readonly style?: CSSProperties;
  /** A paint reference, `url(#…)`, for gradient fronts. */
  readonly fill?: string;
  readonly stroke?: string;
  readonly strokeWidth?: number;
  readonly strokeLinejoin?: "round";
};

export function ProofBotShape({ geometry, rotation, ...rest }: ProofBotShapeProps) {
  const paint = { ...rest, transform: rotation ? proofBotRotate(rotation) : undefined };
  switch (geometry.kind) {
    case "polygon":
      return <polygon points={geometry.points} {...paint} />;
    case "rect":
      return <rect x={geometry.x} y={geometry.y} width={geometry.width} height={geometry.height} {...paint} />;
    case "path":
      return <path d={geometry.d} {...paint} />;
    case "circle":
      return <circle cx={geometry.cx} cy={geometry.cy} r={geometry.r} {...paint} />;
  }
}
