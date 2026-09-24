// The four jump links, in order, shared by the inline list and the phone menu.
// Text from content/shared.ts, hrefs from lib/routes.ts.
import { nav } from "@/content/shared";
import { routes } from "@/lib/routes";

export const navItems = [
  { key: "agents", href: routes.agents, label: nav.links.agents },
  { key: "web", href: routes.web, label: nav.links.web },
  { key: "proofs", href: routes.proofs, label: nav.links.proofs },
  { key: "contact", href: routes.contact, label: nav.links.contact },
] as const;

export type NavItem = (typeof navItems)[number];
