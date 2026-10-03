"use client";
// The WhatsApp link (ui-spec §0.4, §2a.2), built on ExternalLink. The server markup carries the
// default message (`links.whatsapp`), so it works without JavaScript; after a pick in home's About
// group its `href` carries that pick's message. Its look is set where it's used.
import type { ComponentPropsWithoutRef } from "react";
import { ExternalLink } from "@/components/ExternalLink";
import { useAboutPick } from "@/hooks/useAboutPick";
import { aboutWhatsappHref } from "@/lib/aboutReplies";

type WhatsAppLinkProps = Omit<ComponentPropsWithoutRef<typeof ExternalLink>, "href">;

export function WhatsAppLink(props: WhatsAppLinkProps) {
  const href = aboutWhatsappHref(useAboutPick());
  return <ExternalLink {...props} href={href} />;
}
