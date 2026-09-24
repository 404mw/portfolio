// "Skip to content": hidden until focused, then a primary pill pinned top-left, jumping to #main.
import { nav } from "@/content/shared";
import { routes } from "@/lib/routes";
import { pillPrimary } from "@/lib/styles";

export function SkipLink() {
  return (
    <a
      href={routes.main}
      // `focus:px-6!` restores the pill's side padding, which `not-sr-only` resets to 0.
      className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-60 focus:px-6! ${pillPrimary}`}
    >
      {nav.skipLink}
    </a>
  );
}
