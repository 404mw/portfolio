// The process mascots' vector geometry (ui-spec §5.6): the body is the logo's MW outline on a
// 100 grid, cut into three "/" strips; eyes are holes filled with the page background; each role
// adds a hat and hand tools. All strings are hardcoded from the canvas's Bot.dc.html (the wrench
// pre-rotated at 45° and 15° about (104,53)); nothing is computed at render. Colours are keys;
// ProcessBot maps them to token fill classes.

/** A bot's job, one per step. */
export type BotRole = "rules" | "team" | "check" | "update";

/** A bot's frames: each is a complete pose. */
export type BotFrame = "idle" | "blink" | "act" | "sleep";

/** Colour keys: B body, C cream, M muted, D cream-muted, I ink, L line, H eye hole (page bg). */
export type BotColour = "B" | "C" | "M" | "D" | "I" | "L" | "H";

/** One drawn part: a polygon, a rect or a path, with its colour key. */
export type BotShape =
  | { readonly kind: "polygon"; readonly points: string; readonly colour: BotColour }
  | {
      readonly kind: "rect";
      readonly x: number;
      readonly y: number;
      readonly width: number;
      readonly height: number;
      readonly colour: BotColour;
    }
  | { readonly kind: "path"; readonly d: string; readonly colour: BotColour };

/** One frame's three breath groups, in paint order. */
export type BotParts = {
  readonly body: readonly BotShape[];
  readonly hand: readonly BotShape[];
  readonly hat: readonly BotShape[];
};

/** Every frame, in the order the groups are drawn. */
export const botFrames: readonly BotFrame[] = ["idle", "blink", "act", "sleep"];

/** The body's three strips (the source repeats the last vertex of A and C; kept as given). */
const strips: readonly BotShape[] = [
  { kind: "polygon", points: "6.00,30.00 28.00,8.00 48.00,28.00 6.00,70.00 6.00,70.00", colour: "B" },
  { kind: "polygon", points: "74.00,10.00 90.00,26.00 26.00,90.00 10.00,74.00", colour: "B" },
  { kind: "polygon", points: "94.00,70.00 72.00,92.00 52.00,72.00 94.00,30.00 94.00,30.00", colour: "B" },
];

type Look = "idle" | "up" | "down" | "blink" | "sleep";

const eye = (x: number, y: number, height = 14): BotShape => ({
  kind: "rect",
  x,
  y,
  width: 14,
  height,
  colour: "H",
});

/** Eye rects per look: `up` toward right-hand tools, `down` toward left-hand ones. */
const eyes: Record<Look, readonly BotShape[]> = {
  idle: [eye(23, 43), eye(63, 43)],
  up: [eye(30, 36), eye(70, 36)],
  down: [eye(16, 50), eye(56, 50)],
  blink: [],
  sleep: [eye(23, 52, 3), eye(63, 52, 3)],
};

/** Where the eyes look in a frame: `act` looks toward the role's tool. */
function lookFor(role: BotRole, frame: BotFrame): Look {
  if (frame !== "act") return frame;
  return role === "team" || role === "check" ? "up" : "down";
}

const path = (d: string, colour: BotColour): BotShape => ({ kind: "path", d, colour });

/** Each role's hat parts (the same in every frame). */
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

/** Each role's hand tools, given whether the frame is `act`. */
const tools: Record<BotRole, (act: boolean) => readonly BotShape[]> = {
  rules: () => [
    path("M-26 34h22v32h-22Z", "C"), // clipboard
    path("M-20 30h10v7h-10Z", "M"), // clip
    path("M-21 44h12v3h-12Z", "I"), // marks
    path("M-21 50h16v3h-16Z", "I"),
    path("M-21 56h9v3h-9Z", "I"),
  ],
  team: (act) => [
    path(act ? "M100 6h26v12h-26Z" : "M100 16h26v12h-26Z", "M"), // hammer head
    path(act ? "M110 18h5v38h-5Z" : "M110 28h5v28h-5Z", "D"), // handle
  ],
  check: (act) => [
    path("M122 18L138 34L122 50L106 34Z M122 25L113 34L122 43L131 34Z", "C"), // ring
    path("M122 25L131 34L122 43L113 34Z", act ? "C" : "L"), // lens
    path("M110.5 41.5L114.5 45.5L103 57L99 53Z", "M"), // handle
  ],
  update: (act) => [
    path(
      act
        ? "M101.10 52.22L108.87 23.25L114.66 24.80L106.90 53.78Z"
        : "M101.88 50.88L123.09 29.67L127.33 33.91L106.12 55.12Z",
      "M",
    ), // wrench handle (15° on act, 45° otherwise)
    path(
      act
        ? "M102.55 23.62L107.21 6.24L112.52 7.66L110.45 15.39L117.22 17.20L119.29 9.47L124.60 10.90L119.94 28.28Z"
        : "M117.44 26.84L130.16 14.11L134.05 18.00L128.40 23.66L133.34 28.60L139.00 22.95L142.89 26.84L130.16 39.56Z",
      "M",
    ), // wrench jaws
    path("M-26 38h22v28h-22Z", "C"), // rulebook
    path("M-26 38h5v28h-5Z", "D"), // spine
    path("M-8 40h3v24h-3Z", "M"), // page edge
    path("M-17 46h8v3h-8Z", "I"), // mark
  ],
};

/** One frame of one bot: body (strips, eyes), hand (arms, tools), hat. */
export function botParts(role: BotRole, frame: BotFrame): BotParts {
  const armR = role === "team" ? 18 : 10;
  return {
    body: [...strips, ...eyes[lookFor(role, frame)]],
    hand: [
      { kind: "rect", x: -4, y: 50, width: 10, height: 6, colour: "B" },
      { kind: "rect", x: 94, y: 50, width: armR, height: 6, colour: "B" },
      ...tools[role](frame === "act"),
    ],
    hat: hats[role],
  };
}

/** Each step's bot and its static pose, in step order. */
export const stepBots: readonly { readonly role: BotRole; readonly pose: BotFrame }[] = [
  { role: "rules", pose: "idle" },
  { role: "team", pose: "idle" },
  { role: "check", pose: "act" },
  { role: "update", pose: "idle" },
];
