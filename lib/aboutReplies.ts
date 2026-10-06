// About's replies (ui-spec §2a, 02a-about-options §2a.O0.2): the classes that show each reply's
// parts (its ack, its prop), the reply → prop map, and lookups by key. The replies themselves are
// content/home.ts `about.replies`; group names and part ids come from `lib/aboutScope.ts`.
import { about } from "@/content/home";
import { links } from "@/content/shared";
import { homeAboutName } from "@/lib/aboutScope";
import type { RixPropName } from "@/lib/rixProps";
import { whatsappLink, whatsappNumber } from "@/lib/whatsapp";

/**
 * Shows reply i's parts while its radio (`data-reply={i}`) is checked, through the nearest
 * `group/about` root, so it's scope-free. One list per display; written out in full for
 * i = 0–6 (7 replies max) so Tailwind sees each class. `:checked` matches inputs only, so the
 * props' `data-prop-for` never collides.
 */
export const replyShow = {
  block: [
    "group-has-[[data-reply='0']:checked]/about:block",
    "group-has-[[data-reply='1']:checked]/about:block",
    "group-has-[[data-reply='2']:checked]/about:block",
    "group-has-[[data-reply='3']:checked]/about:block",
    "group-has-[[data-reply='4']:checked]/about:block",
    "group-has-[[data-reply='5']:checked]/about:block",
    "group-has-[[data-reply='6']:checked]/about:block",
  ],
  opacity: [
    "group-has-[[data-reply='0']:checked]/about:opacity-100",
    "group-has-[[data-reply='1']:checked]/about:opacity-100",
    "group-has-[[data-reply='2']:checked]/about:opacity-100",
    "group-has-[[data-reply='3']:checked]/about:opacity-100",
    "group-has-[[data-reply='4']:checked]/about:opacity-100",
    "group-has-[[data-reply='5']:checked]/about:opacity-100",
    "group-has-[[data-reply='6']:checked]/about:opacity-100",
  ],
} as const;

export type AboutReply = (typeof about.replies)[number];

/**
 * The emblem for each card (02a-about-options §2a.R1): on the card, in Rix's hand, in the "Shown
 * for" tag and in Process' step 1. `null` is "Not sure yet": no emblem, the gap eyes, a shrug.
 */
export const aboutReplyProp: Readonly<Record<AboutReply["key"], RixPropName | null>> = {
  "service-business": "calendar",
  "online-store": "parcel",
  discord: "bubble",
  "software-builder": "code",
  website: "window",
  "not-sure": null,
};

/** The reply's index for a `?for=` key, compared raw; -1 if none matches. */
export function aboutReplyIndex(key: string | null): number {
  return key === null ? -1 : about.replies.findIndex((reply) => reply.key === key);
}

/** The reply for a key, if any. */
export function aboutReply(key: string | null): AboutReply | undefined {
  const index = aboutReplyIndex(key);
  return index === -1 ? undefined : about.replies[index];
}

/** The WhatsApp link for a pick: that group's default message, or the site default with none. */
export function aboutWhatsappHref(key: string | null): string {
  const reply = aboutReply(key);
  return reply ? whatsappLink(whatsappNumber(links.whatsapp), reply.whatsappText) : links.whatsapp;
}

/** The checked radio's key in group `name` (home's by default); null with no pick, or on the server. */
export function checkedAboutKey(name: string = homeAboutName): string | null {
  if (typeof document === "undefined") return null;
  const input = document.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`);
  return input?.value ?? null;
}

/** True when `event` is a change on one of group `name`'s radios (home's by default). */
export function isAboutChange(
  event: Event,
  name: string = homeAboutName,
): event is Event & { target: HTMLInputElement } {
  return event.target instanceof HTMLInputElement && event.target.name === name;
}
