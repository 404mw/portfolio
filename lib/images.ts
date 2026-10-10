// The only map from an image name to its file. Each name holds one file per theme;
// v1 is dark only, and a light version is added here later (constitution §5).
// A `null` file renders a placeholder and must not ship, like a `[FILL: …]` marker.
type ImageEntry = { readonly dark: string | null };

export const images = {
  portrait: { dark: "/images/portrait.png" },
  // Proofs (ui-spec §7.6): each project's takeover shots: none, two or three each.
  exileShot1: { dark: "/images/exile/home.webp" },
  exileShot2: { dark: "/images/exile/dashboard.webp" },
  exileShot3: { dark: "/images/exile/spam-raid.webp" },
  // The spam diagram's tiles (ui-spec §7.6.1): Exile Bot's mascot, one per step. The Exile view only.
  exileEvaWatch: { dark: "/images/exile/eva-watch.png" },
  exileEvaSpot: { dark: "/images/exile/eva-spot.png" },
  exileEvaStop: { dark: "/images/exile/eva-stop.png" },
  // Design Vault's two shots (ui-spec §7.6): light-theme screenshots; `dark` names the site's theme.
  designVaultShot1: { dark: "/images/design-vault/palettes.webp" },
  designVaultShot2: { dark: "/images/design-vault/fonts.webp" },
} as const satisfies Record<string, ImageEntry>;

export type ImageName = keyof typeof images;
export type ImageTheme = "dark";

export function imageSrc(name: ImageName, theme: ImageTheme = "dark"): string | null {
  const entry: ImageEntry = images[name];
  return entry[theme];
}
