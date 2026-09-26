// Shared copy: the nav and the footer on the one page.
// Source: docs/03-facts.md (Who, Brand, Contact). Voice: docs/04-voice.md.
// Slots: docs/pages/home/ui-spec.md §1.4 and §9.3.

export const nav = {
  label: "Site",
  skipLink: "Skip to content",
  links: {
    agents: "Agents",
    web: "Web",
    proofs: "Proofs",
    contact: "Contact",
  },
  menu: {
    open: "Open menu",
    close: "Close menu",
  },
  bookCall: "Book a call",
} as const;

export const a11y = {
  newTab: "(opens in a new tab)",
} as const;

// The footer copyright year is passed in at build time, not typed here (user decision).
export const footer = {
  wordmark: { lead: "MAR", accent: "W", tail: "IX" },
  copyrightName: "Muhammad Waqas",
  social: {
    linkedin: "LinkedIn",
    github: "GitHub",
    instagram: "Instagram",
    discord: "Discord",
    whatsapp: "WhatsApp",
  },
} as const;

// Addresses, not copy. Copied verbatim from docs/03-facts.md → Contact.
export const links = {
  bookCall: "https://cal.com/marwix/30min",
  linkedin: "https://www.linkedin.com/in/marwix/",
  github: "https://github.com/404mw",
  instagram: "https://www.instagram.com/marwix.dev/",
  discord: "https://discord.com/users/503890038829088788",
  whatsapp: "https://wa.me/923218966303?text=Hi%20Marwix%2C%20I%27d%20like%20to%20talk%20about%20automating%20my%20business",
  email: "mailto:hello@marwix.dev",
  emailAddress: "hello@marwix.dev",
} as const;
