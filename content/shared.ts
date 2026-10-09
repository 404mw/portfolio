// Shared copy: the nav and the footer on the one page, and the structured data (JSON-LD).
// Source: docs/03-facts.md (Who, Brand, Contact). Voice: docs/04-voice.md.
// Slots: docs/pages/home/ui-spec.md §1.4 and §9.3.

export const nav = {
  label: "Site",
  skipLink: "Skip to content",
  links: {
    agents: "Agents",
    web: "Web",
    proofs: "Projects",
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
  // The label of the Rix link standing on the footer's top line (docs/pages/home/ui-spec/09-footer.md §9.4):
  // Rix and this label are one link to /rix, the Rix playground. No longer a link in the footer row.
  rixLink: "Play with Rix",
  // Rix's own typed lines above his head on the footer line (ui-spec/09-footer.md §9.4). Shown in turn,
  // never announced, absent without JavaScript. He calls the visitor over to play: no claims, no ask for a pick.
  // The first is the one he says when the footer first comes into view.
  rixLines: [
    "Psst. Come play with me.",
    "Press a button. I'll do a trick.",
    "I juggle. I drop things too.",
    "I have moods. Come and meet them.",
    "End of the page. Time to play.",
  ],
} as const;

// The page's structured data (JSON-LD): read by search engines and AI models, never shown on
// screen. Third person on purpose, since it is data about a person, not page voice.
// Source: docs/03-facts.md → Who.
export const structured = {
  role: "AI Automation Engineer",
  description:
    "Muhammad Waqas is an AI Automation Engineer who works under the brand MARWIX. He builds software that runs on its own, can automate the repetitive work in a business, and helps people who build software ship it.",
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
