"use client";
// The nav row: transparent over the hero, a solid band once the hero (#top) has scrolled
// under the 67px header (`data-solid`), and while the phone menu is open. Children are
// the links, the menu and the Book a call pill.
import type { ReactNode } from "react";
import { nav } from "@/content/shared";
import { useScrolledPast } from "@/hooks/useScrolledPast";
import { sectionIds } from "@/lib/routes";
import { container } from "@/lib/styles";

// The fixed header's height (2px bar + 64px row + 1px border), so the switch happens as the
// hero leaves it.
const headerOffset = "-67px 0px 0px";

export function NavBar({ children }: { readonly children: ReactNode }) {
  const solid = useScrolledPast(sectionIds.top, headerOffset);

  return (
    <nav
      aria-label={nav.label}
      data-solid={solid}
      className="px-gutter border-b border-transparent data-[solid=true]:border-line data-[solid=true]:bg-band has-[details[open]]:bg-band"
    >
      <div className={`${container} flex h-16 items-center justify-between gap-4`}>
        {children}
      </div>
    </nav>
  );
}
