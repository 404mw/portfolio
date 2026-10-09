// The About cards that have their own content set, in card order, each with its card's label:
// every reply whose pick draws a set other than `default` (so "Just exploring" is left out).
// Derived from `about.replies` through `pickSet`, so a card added later is picked up. Used by the
// hidden server-rendered lists of every set (Agents' offers, Process' flows).
import { about } from "@/content/home";
import { pickSet, type AboutSet } from "@/lib/aboutPick";

export type CardSet = Exclude<AboutSet, "default">;

export type CardSetEntry = { readonly set: CardSet; readonly label: string };

export const cardSets: readonly CardSetEntry[] = about.replies.flatMap((reply): CardSetEntry[] => {
  const set = pickSet(reply.key);
  return set === "default" ? [] : [{ set, label: reply.label }];
});
