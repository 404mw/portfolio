// The Contact side links (ui-spec §8.1): Book a call (Cal.com, counted), the email address
// (mailto) and WhatsApp click-to-chat.
import { ContactRow } from "@/components/home/contact/ContactRow";
import { contact } from "@/content/home";
import { links, nav } from "@/content/shared";
import { bookCallTrackProps } from "@/lib/track";

export function ContactLinks() {
  return (
    <ul className="max-w-100 border-t border-line">
      <li>
        <ContactRow
          href={links.bookCall}
          label={nav.bookCall}
          kind={contact.links.bookCall.kind}
          newTab
          track={bookCallTrackProps}
        />
      </li>
      <li>
        <ContactRow href={links.email} label={links.emailAddress} kind={contact.links.email.kind} />
      </li>
      <li>
        <ContactRow
          href={links.whatsapp}
          label={contact.links.whatsapp.label}
          kind={contact.links.whatsapp.kind}
          newTab
        />
      </li>
    </ul>
  );
}
