// The only map from an image name to its file. Each name holds one file per theme;
// v1 is dark only, and a light version is added here later (constitution §5).
// A `null` file renders a placeholder and must not ship, like a `[FILL: …]` marker.
type ImageEntry = { readonly dark: string | null };

export const images = {
  portrait: { dark: "/images/portrait.png" },
  // Proofs (ui-spec §7.6): each project's card shot, then its takeover's big shot and two details.
  exileCard: { dark: null },
  exileShot1: { dark: null },
  exileShot2: { dark: null },
  exileShot3: { dark: null },
  designVaultCard: { dark: null },
  designVaultShot1: { dark: null },
  designVaultShot2: { dark: null },
  designVaultShot3: { dark: null },
  marwixSkillsCard: { dark: null },
  marwixSkillsShot1: { dark: null },
  marwixSkillsShot2: { dark: null },
  marwixSkillsShot3: { dark: null },
} as const satisfies Record<string, ImageEntry>;

export type ImageName = keyof typeof images;
export type ImageTheme = "dark";

export function imageSrc(name: ImageName, theme: ImageTheme = "dark"): string | null {
  const entry: ImageEntry = images[name];
  return entry[theme];
}
