// Proofs wiring (ui-spec §7): the project order, each project's takeover id and image names,
// and the ids that tie a card and its takeover together. Words stay in content/home.ts.
import type { proofs } from "@/content/home";
import type { ImageName } from "@/lib/images";
import { listNumber, twoDigits } from "@/lib/listNumber";
import { routes, sectionIds } from "@/lib/routes";

/** The projects, in page order: Exile, Design Vault, MARWIX-SKILLS. */
export const proofKeys = ["exile", "designVault", "marwixSkills"] as const satisfies readonly (keyof typeof proofs.projects)[];

export type ProofKey = (typeof proofKeys)[number];

/** Every takeover's dialog id, for the hash controller. */
export const takeoverIds: readonly string[] = proofKeys.map((key) => sectionIds[key]);

/** The project count as a two-digit number: "03". */
export const proofTotal = twoDigits(proofKeys.length);

/** A project's two-digit number from its place in the order: "01". */
export function proofNumber(key: ProofKey): string {
  return listNumber(proofKeys.indexOf(key));
}

/** The project after this one, wrapping from the last to the first. */
export function nextProofKey(key: ProofKey): ProofKey {
  return proofKeys[(proofKeys.indexOf(key) + 1) % proofKeys.length];
}

/** A project's takeover address: its dialog id and matching hash. */
export function proofTarget(key: ProofKey) {
  return { id: sectionIds[key], href: routes[key] };
}

/** One IN USE number in a takeover: the value over its label. */
export type ProofStat = { readonly value: string; readonly label: string };

/** A takeover's three shots, or their alt texts, in order: the big shot, then two details. */
export type ShotTriple<T> = readonly [T, T, T];

/** A project's four images (ui-spec §7.6): the card shot and the takeover's three shots. */
export function proofImages(key: ProofKey) {
  return {
    card: `${key}Card`,
    shots: [`${key}Shot1`, `${key}Shot2`, `${key}Shot3`],
  } as const satisfies { card: ImageName; shots: ShotTriple<ImageName> };
}

/** The ids a card's accessible name is built from: its title and its "Open" meta. */
export function proofCardIds(targetId: string) {
  const title = `${targetId}-card-title`;
  const open = `${targetId}-card-open`;
  return { title, open, labelledBy: `${title} ${open}` };
}

/** The id of a takeover's title, which names its dialog. */
export function takeoverTitleId(targetId: string): string {
  return `${targetId}-title`;
}
