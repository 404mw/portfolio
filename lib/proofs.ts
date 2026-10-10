// Proofs wiring (ui-spec §7): the project order, each project's takeover id, image names and card
// bot prop, and the ids that tie a card, its bot and its takeover (and its parts) together.
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
 * Empty since 2026-10-09 (MARWIX-SKILLS is shown again): every project is on the page.
 */
export const hiddenProofs: readonly ProofKey[] = [];

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

/**
 * The shots a takeover draws, or their alt texts, in order (ui-spec §7.3.1 part 3, §7.6): two or
 * three. Two: two 2:1 shots, stacked. Three: the big 2:1 shot, then two 4:3 details.
 */
export type ProofShots<T> = readonly [T, T] | readonly [T, T, T];

/**
 * A project's shots, or their alt texts (ui-spec §7.9): none, two or three. None means its
 * takeover's part 3 has no shots block at all.
 */
export type ProofShotSet<T> = readonly [] | ProofShots<T>;

/** The edge of a shot its frame keeps when it crops (ui-spec §7.6). */
export type ProofShotPosition = "top" | "center" | "left";

/** One shot: its image name and the edge its frame keeps. */
export type ProofShot = { readonly name: ImageName; readonly position: ProofShotPosition };

/** One shot with its alt text, as a takeover draws it. */
export type ProofShotWithAlt = ProofShot & { readonly alt: string };

/**
 * Each project's shots. A project's count must equal its `shotAlts` count in content/home.ts, so
 * shots and alts can't drift apart.
 */
const proofShotNames = {
  exile: ["exileShot1", "exileShot2", "exileShot3"],
  designVault: ["designVaultShot1", "designVaultShot2"],
  marwixSkills: [],
} as const satisfies {
  readonly [K in ProofKey]: ProofShotSet<ImageName> & {
    readonly length: (typeof proofs.projects)[K]["shotAlts"]["length"];
  };
};

/**
 * Each slot's default position, by shot count. Two: both keep their top. Three: the big shot
 * keeps its top, the details their centre.
 */
const slotPositions = {
  2: ["top", "top"],
  3: ["top", "center", "center"],
} as const satisfies { readonly [N in 2 | 3]: ProofShots<ProofShotPosition> & { readonly length: N } };

/** The projects whose shots set their own positions, one per shot; the others keep the slot defaults. */
const proofShotPositions: {
  readonly [K in ProofKey]?: ProofShots<ProofShotPosition> & {
    readonly length: (typeof proofShotNames)[K]["length"];
  };
} = {
  exile: ["center", "top", "left"],
};

/**
 * Pairs two equal-length shot tuples item by item, keeping the tuple's length in its type; two
 * empty ones pair to none. Their lengths are tied at compile time above; a mismatch that slips
 * past fails the build.
 */
function zipShots<A, B, R>(a: ProofShotSet<A>, b: ProofShotSet<B>, join: (a: A, b: B) => R): ProofShotSet<R> {
  if (a.length === 0 && b.length === 0) return [];
  if (a.length === 2 && b.length === 2) return [join(a[0], b[0]), join(a[1], b[1])];
  if (a.length === 3 && b.length === 3) return [join(a[0], b[0]), join(a[1], b[1]), join(a[2], b[2])];
  throw new Error("A project's shots, positions and alt texts must be the same length (lib/proofs.ts).");
}

/** A project's images (ui-spec §7.6), all in its takeover's part 3: none, two or three. */
export function proofImages(key: ProofKey): { readonly shots: ProofShotSet<ProofShot> } {
  const names: ProofShotSet<ImageName> = proofShotNames[key];
  if (names.length === 0) return { shots: [] };
  const positions = proofShotPositions[key] ?? slotPositions[names.length];
  return { shots: zipShots(names, positions, (name, position) => ({ name, position })) };
}

/** A takeover's shots paired with their alt texts by index (content/home.ts → `shotAlts`). */
export function proofShotsWithAlts(
  shots: ProofShotSet<ProofShot>,
  alts: ProofShotSet<string>,
): ProofShotSet<ProofShotWithAlt> {
  return zipShots(shots, alts, (shot, alt) => ({ ...shot, alt }));
}

/** A takeover's parts, in order (ui-spec §7.3): the `data-part` values. */
export type TakeoverPartKey = "intro" | "problem" | "built" | "took" | "learned" | "showcase" | "means";

/** The id of a part's headline, which names its section: `{targetId}-{part}-headline`. */
export function takeoverPartId(targetId: string, part: TakeoverPartKey): string {
  return `${targetId}-${part}-headline`;
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
