// The footer's row (ui-spec §9.1): email, the filled social links, the link to the /rix playground
// (its only entry, docs/pages/rix/ui-spec.md §0.1), then © year and name. The WhatsApp link goes
// through `WhatsAppLink`, so its message follows an About pick.
import Link from "next/link";
import { ExternalLink } from "@/components/ExternalLink";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { footer, links } from "@/content/shared";
import { currentYear } from "@/lib/currentYear";
import { rixPath } from "@/lib/publishedRoutes";
import { socialItems } from "@/lib/socialItems";
import { container, focusRing } from "@/lib/styles";

const socialLink = `inline-flex min-h-11 items-center text-body text-text underline decoration-line underline-offset-4 hover:text-accent hover:decoration-accent active:text-accent active:decoration-accent ${focusRing}`;

export function FooterLinks() {
  return (
    <div className="px-gutter">
      <div
        className={`${container} flex flex-col items-start gap-6 text-small text-muted md:flex-row md:flex-wrap md:items-center md:justify-between`}
      >
        <a
          href={links.email}
          className={`inline-flex min-h-11 items-center text-body-lg text-text hover:text-accent active:text-muted ${focusRing}`}
        >
          {links.emailAddress}
        </a>
        {socialItems.length > 0 && (
          <ul className="flex flex-wrap gap-x-6">
            {socialItems.map((item) => (
              <li key={item.key}>
                {item.key === "whatsapp" ? (
                  <WhatsAppLink className={socialLink}>{item.label}</WhatsAppLink>
                ) : (
                  <ExternalLink href={item.href} className={socialLink}>
                    {item.label}
                  </ExternalLink>
                )}
              </li>
            ))}
          </ul>
        )}
        <Link href={rixPath} className={socialLink}>
          {footer.rixLink}
        </Link>
        <p>
          © {currentYear()} {footer.copyrightName}
        </p>
      </div>
    </div>
  );
}
