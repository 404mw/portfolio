// The /rix playground's commands and ids (docs/pages/rix/ui-spec.md §0.1, ui-spec/02-playground.md
// §2.3–§2.4): one command per button, named by its group and its content key in content/rix.ts
// `playground`, so the ids always match the labels. A command is `reduced` when it has an R8.1
// version (ui-spec/00-rix.md): talk, pick, pet and every mood; the others hide under reduced
// motion. `useRixPlayground().play` plays each one (lib/rixPlaygroundMoves.ts).
import { playground } from "@/content/rix";

/** The playground's five button groups, in order. */
export type RixPlaygroundGroup = keyof typeof playground.groups;

export const rixPlaygroundGroups: readonly RixPlaygroundGroup[] = ["emotions", "moves", "plays", "moods", "glyphs"];

/** One button's command: its group and its key in that group's labels. */
export type RixPlaygroundCommand = {
  [G in RixPlaygroundGroup]: { readonly group: G; readonly move: keyof (typeof playground)[G] & string };
}[RixPlaygroundGroup];

/** The moves with an R8.1 version (every mood has one too). */
const reducedMoves: readonly string[] = ["talk", "pick", "pet"];

/** The group's commands, in content order. */
export function rixPlaygroundCommands(group: RixPlaygroundGroup): readonly RixPlaygroundCommand[] {
  return Object.keys(playground[group]).map((move) => ({ group, move }) as RixPlaygroundCommand);
}

/** The command's button label. */
export function rixPlaygroundLabel(command: RixPlaygroundCommand): string {
  const labels: Readonly<Record<string, string>> = playground[command.group];
  return labels[command.move] ?? "";
}

/** True when the command plays under reduced motion (it has an R8.1 version). */
export function playsReduced(command: RixPlaygroundCommand): boolean {
  return command.group === "moods" || (command.group === "moves" && reducedMoves.includes(command.move));
}

/** True when any of the group's commands plays under reduced motion (else the group hides). */
export function groupPlaysReduced(group: RixPlaygroundGroup): boolean {
  return rixPlaygroundCommands(group).some(playsReduced);
}

/** True when two commands are the same button. */
export function sameRixPlaygroundCommand(a: RixPlaygroundCommand | null, b: RixPlaygroundCommand): boolean {
  return a !== null && a.group === b.group && a.move === b.move;
}

/** This page's ids: the playground section (the motion root, quip and status key), the headings. */
export const rixIds = {
  title: "rix-title",
  playground: "rix-playground",
  playgroundTitle: "rix-playground-title",
  wayBack: "rix-way-back",
  wayBackTitle: "rix-way-back-title",
} as const;

/** A group heading's id. */
export const rixGroupId = (group: RixPlaygroundGroup) => `${rixIds.playground}-${group}`;
