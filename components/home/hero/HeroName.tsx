// The hero name, the page's one h1 (ui-spec §2.1, row 2). Each line sits in a clipped wrapper
// so the motion pass can raise it from below. The text space between the two wrappers keeps
// the accessible name reading "Muhammad Waqas"; uppercase comes from CSS.
import { hero } from "@/content/home";
import { condensed } from "@/lib/styles";

const lineWrapper = "block overflow-hidden pb-[0.12em]";

export function HeroName() {
  return (
    <h1
      className={`flex flex-col justify-center font-display text-hero leading-[0.82] font-bold tracking-[-0.015em] text-accent uppercase ${condensed}`}
    >
      <span className={`${lineWrapper} text-right`}>
        <span data-anim="hero-line" className="block">
          {hero.firstName}
        </span>
      </span>{" "}
      <span className={`${lineWrapper} text-left`}>
        <span data-anim="hero-line" className="block">
          {hero.lastName}
        </span>
      </span>
    </h1>
  );
}
