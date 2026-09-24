"use client";
// The phone menu (below `md`): a native <details>, so it opens and closes without JS. The
// 44px <summary> is the button; the panel under the nav row holds the four jump links.
// With JS: Escape closes it and returns focus, and a link click or reaching `md` closes it.
import { CloseIcon } from "@/components/icons/CloseIcon";
import { MenuIcon } from "@/components/icons/MenuIcon";
import { nav } from "@/content/shared";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useOnMediaMatch } from "@/hooks/useOnMediaMatch";
import { navItems } from "@/lib/navItems";
import { focusRing } from "@/lib/styles";

// Tailwind's `md` breakpoint.
const mdQuery = "(min-width: 48rem)";

export function NavMenu() {
  const { open, onToggle, close, detailsRef, summaryRef } = useDisclosure();
  useOnMediaMatch(mdQuery, close);

  return (
    <details ref={detailsRef} onToggle={onToggle} className="group md:hidden">
      <summary
        ref={summaryRef}
        aria-label={open ? nav.menu.close : nav.menu.open}
        className={`inline-flex size-11 cursor-pointer list-none items-center justify-center rounded-full text-text hover:bg-band active:bg-line [&::-webkit-details-marker]:hidden ${focusRing}`}
      >
        {/* CSS picks the glyph from the open state, so it's right without JS too. */}
        <MenuIcon className="size-5 group-open:hidden" />
        <CloseIcon className="hidden size-5 group-open:block" />
      </summary>
      <div
        id="nav-menu"
        data-anim="nav-panel"
        className="absolute inset-x-0 top-full border-b border-line bg-band px-gutter"
      >
        <ul>
          {navItems.map((item) => (
            <li key={item.key} className="border-t border-line first:border-t-0">
              {/* `!` so the inset offset wins over the ring's default offset. */}
              <a
                href={item.href}
                onClick={close}
                className={`flex min-h-12 items-center text-body-lg text-text hover:text-accent active:bg-line ${focusRing} focus-visible:-outline-offset-2!`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
