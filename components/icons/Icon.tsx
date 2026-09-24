// The shared frame for every glyph: a 24×24 stroked SVG in `currentColor`, hidden from
// assistive tech. Each icon file passes only its paths. Size comes from `className`.
import type { ReactNode } from "react";

export type IconProps = { readonly className?: string };

export function Icon({ className = "size-5", children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  );
}
