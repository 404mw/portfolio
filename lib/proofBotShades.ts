// The proof bots' shade roles (ui-spec §7.2.2): every 3D shade, light and banner ground as a token
// expression, in one table, so a future token swaps a role in one place. No new tokens: each value
// is a `color-mix()` of the colour tokens in app/globals.css.

/** A colour token's name, as in `--color-{name}`. */
type ColourToken = "bg" | "band" | "text" | "muted" | "line" | "cream" | "ink" | "cream-muted" | "accent";

const token = (name: ColourToken) => `var(--color-${name})`;

/** `mix(a p%, b)`: token `a` at `p`% over token `b`, in oklab. */
const mix = (a: ColourToken, percent: number, b: ColourToken) =>
  `color-mix(in oklab, ${token(a)} ${percent}%, ${token(b)})`;

/** One material: its front gradient (light, mid, shade) and its depth ramp (near to far). */
export type ProofBotMaterialShades = {
  readonly light: string;
  readonly mid: string;
  readonly shade: string;
  readonly sideNear: string;
  readonly sideFar: string;
};

export type ProofBotMaterial = "violet" | "cream" | "ink" | "muted";

export const proofBotShades = {
  materials: {
    violet: {
      light: mix("accent", 40, "cream"),
      mid: token("accent"),
      shade: mix("accent", 75, "ink"),
      sideNear: mix("accent", 50, "ink"),
      sideFar: mix("accent", 18, "ink"),
    },
    cream: {
      light: token("text"),
      mid: token("cream"),
      shade: mix("cream", 84, "ink"),
      sideNear: mix("cream", 66, "ink"),
      sideFar: mix("cream-muted", 80, "ink"),
    },
    ink: {
      light: mix("line", 75, "muted"),
      mid: mix("band", 50, "line"),
      shade: token("ink"),
      sideNear: token("ink"),
      sideFar: token("bg"),
    },
    muted: {
      light: mix("muted", 50, "cream"),
      mid: token("muted"),
      shade: mix("muted", 76, "ink"),
      sideNear: mix("cream-muted", 85, "ink"),
      sideFar: token("line"),
    },
  } satisfies Record<ProofBotMaterial, ProofBotMaterialShades>,
  eye: {
    wall: mix("accent", 22, "ink"),
    wallTop: mix("accent", 12, "ink"),
    wallLeft: mix("accent", 30, "ink"),
    hole: token("ink"),
  },
  light: {
    rim: token("cream"),
    glint: token("cream"),
    shadow: token("bg"),
  },
  details: {
    screen: token("ink"),
    screenLit: mix("accent", 30, "ink"),
  },
  banner: {
    hatch: `repeating-linear-gradient(135deg, color-mix(in oklab, ${token("text")} 5%, transparent) 0 1px, transparent 1px 13px)`,
    glow: `radial-gradient(90% 110% at 62% 125%, color-mix(in oklab, ${token("accent")} 34%, transparent), transparent 62%)`,
  },
} as const;

/** A flat detail's fill: a named detail shade, or one stop of a material. */
export type ProofBotFill =
  | { readonly detail: keyof typeof proofBotShades.details }
  | { readonly material: ProofBotMaterial; readonly stop: "light" | "mid" };

/** The colour a flat detail's fill names. */
export function proofBotFill(fill: ProofBotFill): string {
  return "detail" in fill ? proofBotShades.details[fill.detail] : proofBotShades.materials[fill.material][fill.stop];
}

/** The depth step's side colour: `sideNear` at `near`% over `sideFar` (ui-spec §7.2.2). */
export function proofBotSide(material: ProofBotMaterial, near: number): string {
  const { sideNear, sideFar } = proofBotShades.materials[material];
  return `color-mix(in oklab, ${sideNear} ${near}%, ${sideFar})`;
}
