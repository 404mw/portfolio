// The giant decorative footer wordmark (ui-spec §9.1): full bleed, hidden from assistive tech.
// Static state is the full word; `FooterWordmarkMotion` animates the `data-anim` letters.
import { condensedMark } from "@/lib/styles";
import { wordmarkLetters } from "@/lib/wordmarkLetters";

export function FooterWordmark() {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none mt-10 flex w-full justify-center whitespace-nowrap select-none font-display font-extrabold text-footer-mark leading-[0.78] tracking-[-0.01em] ${condensedMark}`}
    >
      {wordmarkLetters().map(({ letter, accent }, i) =>
        accent ? (
          <span key={i} data-anim="mark-accent" className="block text-accent">
            {letter}
          </span>
        ) : (
          <span key={i} data-anim="mark-rest" className="block text-line">
            {letter}
          </span>
        ),
      )}
    </div>
  );
}
