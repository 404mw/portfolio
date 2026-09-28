// Proofs wiring (ui-spec §7): the project order, each project's takeover id, image names and card
// bot prop, and the ids that tie a card, its bot and its takeover together.
// Words stay in content/home.ts.
import type { proofs } from "@/content/home";
import type { ImageName } from "@/lib/images";
import { listNumber, twoDigits } from "@/lib/listNumber";
import type { ProofProp } from "@/lib/proofBotProps";
import { routes, sectionIds } from "@/lib/routes";

/** Every project, in page order: Exile, Design Vault, MARWIX-SKILLS. Types and props cover all. */
export const proofKeys = ["exile", "designVault", "marwixSkills"] as const satisfies readonly (keyof typeof proofs.projects)[];

export type ProofKey = (typeof proofKeys)[number];

/**
 * TEMPORARY HIDE FLAG. Projects listed here render no card and no takeover, drop out of the
 * numbering, the total and the Next wrap, and their hash opens nothing.
 * To bring MARWIX-SKILLS back: `export const hiddenProofs: readonly ProofKey[] = [];`
 */
export const hiddenProofs: readonly ProofKey[] = ["marwixSkills"];

/** The projects on the page, in page order: every project minus the hidden ones. */
export const shownProofKeys: readonly ProofKey[] = proofKeys.filter((key) => !hiddenProofs.includes(key));

/** Every shown takeover's dialog id, for the hash controller. */
export const takeoverIds: readonly string[] = shownProofKeys.map((key) => sectionIds[key]);

/** The shown project count as a two-digit number: "02". */
export const proofTotal = twoDigits(shownProofKeys.length);

/** The card grid's columns: two from `md`; three from `lg` only when three or more are shown. */
export const proofGridColumns = shownProofKeys.length >= 3 ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2";

/** A shown project's two-digit number from its place in the shown order: "01". */
export function proofNumber(key: ProofKey): string {
  return listNumber(shownProofKeys.indexOf(key));
}

/** The shown project after this one, wrapping from the last to the first. */
export function nextProofKey(key: ProofKey): ProofKey {
  return shownProofKeys[(shownProofKeys.indexOf(key) + 1) % shownProofKeys.length];
}

/** A project's takeover address: its dialog id and matching hash. */
export function proofTarget(key: ProofKey) {
  return { id: sectionIds[key], href: routes[key] };
}

/** One IN USE number in a takeover: the value over its label. */
export type ProofStat = { readonly value: string; readonly label: string };

/** A takeover's three shots, or their alt texts, in order: the big shot, then two details. */
export type ShotTriple<T> = readonly [T, T, T];

/** A project's three images (ui-spec §7.6), all in its takeover: the big shot, then two details. */
export function proofImages(key: ProofKey) {
  return {
    shots: [`${key}Shot1`, `${key}Shot2`, `${key}Shot3`],
  } as const satisfies { shots: ShotTriple<ImageName> };
}

/** The prop a project's card bot holds (ui-spec §7.2.3). */
const proofProps = {
  exile: "phone",
  designVault: "fan",
  marwixSkills: "puzzle",
} as const satisfies Record<ProofKey, ProofProp>;

export function proofProp(key: ProofKey): ProofProp {
  return proofProps[key];
}

/** The ids inside a card bot's SVG, unique per card: `proof-bot-{targetId}-{name}`. */
export function proofBotIds(targetId: string) {
  const id = (name: string) => `proof-bot-${targetId}-${name}`;
  return {
    violet: id("violet"),
    cream: id("cream"),
    ink: id("ink"),
    muted: id("muted"),
    rim: id("rim"),
    glint: id("glint"),
    strips: id("strips"),
    shadow: id("shadow"),
  };
}

export type ProofBotIds = ReturnType<typeof proofBotIds>;

/** The ids a card's accessible name is built from: its title and its "Open" meta. */
export function proofCardIds(targetId: string) {
  const title = `${targetId}-card-title`;
  const open = `${targetId}-card-open`;
  return { title, open, labelledBy: `${title} ${open}` };
}

/** The selector for the card that opens the takeover with `targetId` (focus return, motion). */
export function proofCardSelector(targetId: string): string {
  return `[data-proof-card][href="#${targetId}"]`;
}

/** The id of a takeover's title, which names its dialog. */
export function takeoverTitleId(targetId: string): string {
  return `${targetId}-title`;
}
