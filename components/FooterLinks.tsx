// The footer's row (ui-spec §9.1): email, the filled social links, then © year and name.
import { ExternalLink } from "@/components/ExternalLink";
import { footer, links } from "@/content/shared";
import { currentYear } from "@/lib/currentYear";
import { socialItems } from "@/lib/socialItems";
import { container, focusRing } from "@/lib/styles";

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
                <ExternalLink
                  href={item.href}
                  className={`inline-flex min-h-11 items-center hover:text-text active:text-text ${focusRing}`}
                >
                  {item.label}
                </ExternalLink>
              </li>
            ))}
          </ul>
        )}
        <p>
          © {currentYear()} {footer.copyrightName}
        </p>
      </div>
    </div>
  );
}
