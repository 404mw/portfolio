// A link that opens in a new tab, with a hidden "(opens in a new tab)" suffix for screen readers.
import type { ComponentPropsWithoutRef } from "react";
import { a11y } from "@/content/shared";

type ExternalLinkProps = Omit<ComponentPropsWithoutRef<"a">, "target" | "rel">;

export function ExternalLink({ children, ...props }: ExternalLinkProps) {
  return (
    <a {...props} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="sr-only"> {a11y.newTab}</span>
    </a>
  );
}
