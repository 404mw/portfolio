// The four jump links inline, from `md` up.
import { navItems } from "@/lib/navItems";
import { focusRing } from "@/lib/styles";

export function NavLinks() {
  return (
    <ul className="hidden items-center gap-1 md:flex lg:gap-3">
      {navItems.map((item) => (
        <li key={item.key}>
          <a
            href={item.href}
            className={`inline-flex h-11 items-center rounded-full px-3 text-small text-muted hover:text-text active:bg-band ${focusRing}`}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
