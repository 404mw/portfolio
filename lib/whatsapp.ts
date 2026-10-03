// WhatsApp click-to-chat links (wa.me), pure. The number is read from an existing wa.me link
// (content/shared.ts `links.whatsapp`), so it's written in one place only.

/** The number in a wa.me link (`https://wa.me/<number>?text=…`). */
export function whatsappNumber(link: string): string {
  return new URL(link).pathname.replace(/^\//, "");
}

/**
 * A wa.me link to `number` with `text` as the default message. Apostrophes are encoded too
 * (`encodeURIComponent` leaves them), matching the hand-written links in content/.
 */
export function whatsappLink(number: string, text: string): string {
  const message = encodeURIComponent(text).replace(/'/g, "%27");
  return `https://wa.me/${number}?text=${message}`;
}
