// The process mascots' vector geometry (ui-spec §5.6): one rig per bot. The body is the logo's MW
// outline on a 100 grid, cut into three "/" strips; the W's two bottom points are separate feet,
// tucked 0.5 unit under the trimmed strips so the rest silhouette is exactly the logo. Eyes are
// holes filled with the page background, drawn at the pose. Each role adds a hat, hand tools and
// decorative extras. Tools are drawn at their idle geometry only; acts are rotations the motion
// adds. All strings are hardcoded from the spec; nothing is computed at render. Colours are keys;
// ProcessBot maps them to token fill classes. `botPivots` gives the motion every pivot, so it
// never measures the SVG.

/** A bot's job, one per step. */
export type BotRole = "rules" | "team" | "check" | "update";

/** A bot's static pose. */
export type BotPose = "idle" | "act";

/** Colour keys: B body, C cream, M muted, D cream-muted, I ink, L line, H eye hole (page bg). */
export type BotColour = "B" | "C" | "M" | "D" | "I" | "L" | "H";

/** Motion hooks on single shapes (`data-bot`); group hooks are in ProcessBot. */
export type BotShapeHook = "foot-left" | "foot-right" | "eye" | "mark" | "page" | "lens-lit" | "spark" | "z";

type ShapeExtras = {
  readonly colour: BotColour;
  readonly hook?: BotShapeHook;
  /** The poses the shape shows in at rest; absent = every pose. Hidden = the `opacity-0` class. */
  readonly shownIn?: readonly BotPose[];
};

/** One drawn part: a polygon, a rect or a path, with its colour key. */
export type BotShape = ShapeExtras &
  (
    | { readonly kind: "polygon"; readonly points: string }
    | {
        readonly kind: "rect";
        readonly x: number;
        readonly y: number;
        readonly width: number;
        readonly height: number;
      }
    | { readonly kind: "path"; readonly d: string }
  );

/** One bot's rig contents, group by group, each in paint order. */
export type BotRig = {
  readonly feet: readonly BotShape[];
  readonly strips: readonly BotShape[];
  /** The eyes group's `data-look` (look along the gap diagonal, + = up-right) and its two eyes. */
  readonly look: number;
  readonly eyes: readonly BotShape[];
  readonly armLeft: readonly BotShape[];
  readonly armRight: readonly BotShape[];
  readonly tool: readonly BotShape[];
  readonly hat: readonly BotShape[];
  /** Team only: the sparks group (hidden at rest) and its sparks. */
  readonly sparks: readonly BotShape[] | null;
  /** Rules and update only: the zzz group and its three z's (each hidden at rest). */
  readonly zzz: readonly BotShape[] | null;
};

const hidden: readonly BotPose[] = [];

const path = (d: string, colour: BotColour, extras?: Omit<ShapeExtras, "colour">): BotShape => ({
  kind: "path",
  d,
  colour,
  ...extras,
});

const rect = (x: number, y: number, width: number, height: number, colour: BotColour, hook?: BotShapeHook): BotShape => ({
  kind: "rect",
  x,
  y,
  width,
  height,
  colour,
  hook,
});

/** The feet: each a 14 × 7 "V", 0.5 unit up under its strip. Painted first. */
export const feet: readonly BotShape[] = [
  { kind: "polygon", points: "18.50,82.50 33.50,82.50 26.00,90.00", colour: "B", hook: "foot-left" },
  { kind: "polygon", points: "64.50,84.50 79.50,84.50 72.00,92.00", colour: "B", hook: "foot-right" },
];

/** The body's three strips; B and C trimmed 7 units above their tips (the source repeats the last vertex of A and C; kept). */
export const strips: readonly BotShape[] = [
  { kind: "polygon", points: "6.00,30.00 28.00,8.00 48.00,28.00 6.00,70.00 6.00,70.00", colour: "B" },
  { kind: "polygon", points: "74.00,10.00 90.00,26.00 33.00,83.00 19.00,83.00 10.00,74.00", colour: "B" },
  { kind: "polygon", points: "94.00,70.00 79.00,85.00 65.00,85.00 52.00,72.00 94.00,30.00 94.00,30.00", colour: "B" },
];

/** The eyes at each rest look: 0 centred, 7 up-right toward right-hand tools, −7 down-left toward left-hand ones. */
export const eyesAt = {
  0: [rect(23, 43, 14, 14, "H", "eye"), rect(63, 43, 14, 14, "H", "eye")],
  7: [rect(30, 36, 14, 14, "H", "eye"), rect(70, 36, 14, 14, "H", "eye")],
  [-7]: [rect(16, 50, 14, 14, "H", "eye"), rect(56, 50, 14, 14, "H", "eye")],
} as const satisfies Record<number, readonly BotShape[]>;

type Look = keyof typeof eyesAt;

/** Where each role looks in each pose: `act` looks toward its tool (check's pose is `act`). */
const looks: Record<BotRole, Record<BotPose, Look>> = {
  rules: { idle: 0, act: -7 },
  team: { idle: 0, act: 7 },
  check: { idle: 0, act: 7 },
  update: { idle: 0, act: -7 },
};

/** Each role's hat parts. */
const hats: Record<BotRole, readonly BotShape[]> = {
  rules: [
    path("M26 8L30 -8H70L74 8Z", "M"), // cap
    path("M46 -4h8v6h-8Z", "C"), // badge
    path("M18 4h64v6h-64Z", "D"), // brim
  ],
  team: [
    path("M26 6L34 -8H66L74 6Z", "C"), // shell
    path("M46 -10h8v16h-8Z", "D"), // ridge
    path("M16 4h68v6h-68Z", "C"), // brim
  ],
  check: [],
  update: [],
};

/** Each role's left-hand tools, after the left arm. */
const leftTools: Record<BotRole, readonly BotShape[]> = {
  rules: [
    path("M-26 34h22v32h-22Z", "C"), // clipboard
    path("M-20 30h10v7h-10Z", "M"), // clip
    path("M-21 44h12v3h-12Z", "I", { hook: "mark" }),
    path("M-21 50h16v3h-16Z", "I", { hook: "mark" }),
    path("M-21 56h9v3h-9Z", "I", { hook: "mark" }),
  ],
  team: [],
  check: [],
  update: [
    path("M-26 38h22v28h-22Z", "C"), // rulebook
    path("M-26 38h5v28h-5Z", "D"), // spine
    path("M-8 40h3v24h-3Z", "M"), // page edge
    path("M-17 46h8v3h-8Z", "I", { hook: "mark" }),
    path("M-21 40h13v24h-13Z", "D", { hook: "page", shownIn: hidden }),
  ],
};

/** Each role's right-hand tool, at its idle geometry (the `tool` group). */
const tools: Record<BotRole, readonly BotShape[]> = {
  rules: [],
  team: [
    path("M100 16h26v12h-26Z", "M"), // hammer head
    path("M110 28h5v28h-5Z", "D"), // handle
  ],
  check: [
    path("M122 18L138 34L122 50L106 34Z M122 25L113 34L122 43L131 34Z", "C"), // ring
    path("M122 25L131 34L122 43L113 34Z", "L"), // lens
    path("M122 25L131 34L122 43L113 34Z", "C", { hook: "lens-lit", shownIn: ["act"] }),
    path("M110.5 41.5L114.5 45.5L103 57L99 53Z", "M"), // handle
  ],
  update: [
    path("M101.88 50.88L123.09 29.67L127.33 33.91L106.12 55.12Z", "M"), // wrench handle (45°)
    path(
      "M117.44 26.84L130.16 14.11L134.05 18.00L128.40 23.66L133.34 28.60L139.00 22.95L142.89 26.84L130.16 39.56Z",
      "M",
    ), // wrench jaws
  ],
};

/** Team's sparks at the hammer's strike point (the group is hidden at rest). */
const sparks: readonly BotShape[] = [
  path("M143 32h7v2h-7Z", "C", { hook: "spark" }), // right
  path("M142 36L143.5 34.5L148.5 39.5L147 41Z", "C", { hook: "spark" }), // down-right
  path("M139 36h2v7h-2Z", "C", { hook: "spark" }), // down
];

/** The nap's three z's (sizes 8, 10, 12), rising up-right from the head; each hidden at rest. */
const zzz: readonly BotShape[] = [
  path("M88 -2H96V0L92 4H96V6H88V4L92 0H88Z", "M", { hook: "z", shownIn: hidden }),
  path("M100 -12H110V-10L104 -4H110V-2H100V-4L106 -10H100Z", "M", { hook: "z", shownIn: hidden }),
  path("M114 -18H126V-16L118 -8H126V-6H114V-8L122 -16H114Z", "M", { hook: "z", shownIn: hidden }),
];

/** One bot's rig at its static pose. */
export function botRig(role: BotRole, pose: BotPose): BotRig {
  const look = looks[role][pose];
  return {
    feet,
    strips,
    look,
    eyes: eyesAt[look],
    armLeft: [rect(-4, 50, 10, 6, "B"), ...leftTools[role]],
    armRight: [rect(94, 50, role === "team" ? 18 : 10, 6, "B")],
    tool: tools[role],
    hat: hats[role],
    sparks: role === "team" ? sparks : null,
    zzz: role === "rules" || role === "update" ? zzz : null,
  };
}

/** A point in viewBox units. */
export type BotPoint = readonly [x: number, y: number];

/**
 * Every pivot, in viewBox units in the element's own rest space (ui-spec §5.6 hook table); set
 * once with `svgOrigin`. `eyes` is translate only, so it has none; `lens-lit` has none.
 */
export const botPivots = {
  rig: [50, 92],
  footLeft: [26, 90],
  footRight: [72, 92],
  upper: [50, 84],
  body: [50, 84],
  /** Each eye's drawn centre, by the eyes group's rest `data-look`. */
  eye: {
    0: [
      [30, 50],
      [70, 50],
    ],
    7: [
      [37, 43],
      [77, 43],
    ],
    [-7]: [
      [23, 57],
      [63, 57],
    ],
  },
  armLeft: [6, 53],
  armRight: [94, 53],
  /** The tool's grip; rules has no tool. */
  tool: { team: [112.5, 53], check: [101, 55], update: [104, 53] },
  hat: [50, 10],
  /** Each mark's left end, centre y. */
  marks: {
    rules: [
      [-21, 45.5],
      [-21, 51.5],
      [-21, 57.5],
    ],
    update: [[-17, 47.5]],
  },
  page: [-21, 52],
  sparks: [140, 33],
  /** Each z's centre, in paint order. */
  z: [
    [92, 2],
    [105, -7],
    [120, -12],
  ],
} as const satisfies {
  readonly rig: BotPoint;
  readonly footLeft: BotPoint;
  readonly footRight: BotPoint;
  readonly upper: BotPoint;
  readonly body: BotPoint;
  readonly eye: Record<Look, readonly [BotPoint, BotPoint]>;
  readonly armLeft: BotPoint;
  readonly armRight: BotPoint;
  readonly tool: Record<"team" | "check" | "update", BotPoint>;
  readonly hat: BotPoint;
  readonly marks: Record<"rules" | "update", readonly BotPoint[]>;
  readonly page: BotPoint;
  readonly sparks: BotPoint;
  readonly z: readonly [BotPoint, BotPoint, BotPoint];
};

/** Each step's bot and its static pose, in step order. */
export const stepBots: readonly { readonly role: BotRole; readonly pose: BotPose }[] = [
  { role: "rules", pose: "idle" },
  { role: "team", pose: "idle" },
  { role: "check", pose: "act" },
  { role: "update", pose: "idle" },
];
