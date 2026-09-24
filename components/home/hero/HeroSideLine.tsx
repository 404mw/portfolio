// The hero's one-line "what I do", with a violet dot (ui-spec §2.1, row 1).
// Left-aligned on phones, right-aligned from `md`.
import { hero } from "@/content/home";

export function HeroSideLine() {
  return (
    <div data-anim="hero-fade" className="flex md:justify-end">
      <p className="flex max-w-70 gap-2.5 text-small leading-[1.55] text-muted">
        <span
          aria-hidden="true"
          data-anim="hero-dot"
          className="mt-1.5 size-2 shrink-0 rounded-full bg-accent"
        />
        {hero.sideLine}
      </p>
    </div>
  );
}
