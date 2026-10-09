// Which line the footer Rix says next (ui-spec/09-footer.md §9.4), both motion modes. No DOM, no
// GSAP: the caller says when and how, this picks the words from content/shared.ts `footer.rixLines`,
// in turn, wrapping round (so never the same line twice in a row). The first line is the first
// call's. `FooterRixMemo` holds the turn and whether the first call has been made, per page load.
import { footer } from "@/content/shared";

/** Per page load: survives motion-mode re-runs and a visit to /rix and back. */
export type FooterRixMemo = {
  /** The first call has been made (once per load). */
  called: boolean;
  /** The next line's place in `footer.rixLines`. */
  turn: number;
};

export const newFooterRixMemo = (): FooterRixMemo => ({ called: false, turn: 0 });

const lines: readonly string[] = footer.rixLines;

/** How many lines he has: with none he never calls. */
export const footerRixLineCount = lines.length;

/** The next line, in turn; empty if he has none. */
export function nextFooterRixLine(memo: FooterRixMemo): string {
  if (lines.length === 0) return "";
  const at = memo.turn % lines.length;
  memo.turn = at + 1;
  return lines[at] ?? "";
}
