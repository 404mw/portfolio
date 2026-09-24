// Splits the footer wordmark (content/shared.ts `footer.wordmark`) into single letters for
// FooterWordmark, marking which take the accent (ui-spec §9.1: M and W): the word's first
// letter and the `accent` part are accent; every other letter is dim.
import { footer } from "@/content/shared";

export type WordmarkLetter = { letter: string; accent: boolean };

export function wordmarkLetters(): WordmarkLetter[] {
  const { lead, accent, tail } = footer.wordmark;
  return [
    ...Array.from(lead, (letter, i) => ({ letter, accent: i === 0 })),
    ...Array.from(accent, (letter) => ({ letter, accent: true })),
    ...Array.from(tail, (letter) => ({ letter, accent: false })),
  ];
}
