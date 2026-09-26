// The footer's social links, in the fixed order LinkedIn, GitHub, Instagram, Discord,
// WhatsApp, keeping only those whose address is filled. Text only, no icons (ui-spec §9.1).
// Names from content/shared.ts `footer.social`, addresses from content/shared.ts `links`.
import { footer, links } from "@/content/shared";
import { isFilled } from "@/lib/isFilled";

const allSocialItems = [
  { key: "linkedin", href: links.linkedin, label: footer.social.linkedin },
  { key: "github", href: links.github, label: footer.social.github },
  { key: "instagram", href: links.instagram, label: footer.social.instagram },
  { key: "discord", href: links.discord, label: footer.social.discord },
  { key: "whatsapp", href: links.whatsapp, label: footer.social.whatsapp },
] as const;

export const socialItems = allSocialItems.filter((item) => isFilled(item.href));

export type SocialItem = (typeof allSocialItems)[number];
