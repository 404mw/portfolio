// Home copy: the one page at `/`. Hero, marquee, agents, process, web, proofs, contact.
// Source: docs/03-facts.md. Voice: docs/04-voice.md. Slots and limits: docs/pages/home/ui-spec.md.
// The Book a call label is the shared `nav.bookCall`. exile.marwix.dev is linked from the Exile
// takeover only. Agents demo content is sample illustration (constitution §7 item 5).

export const meta = {
  title: "Muhammad Waqas: AI Automation Engineer | MARWIX",
  description:
    "I build AI agents that take repetitive work off your team, and the websites around them. Book a call.",
} as const;

export const hero = {
  firstName: "Muhammad",
  lastName: "Waqas",
  sideLine: "I build AI agents that take repetitive work off your team, and the websites around them.",
  tag: "AI agents · End-to-end web",
  seeProofs: "See proofs",
  portraitAlt: "Muhammad Waqas, head and shoulders, in black and white, with glasses, a beard and a dark collared shirt, looking to one side.",
} as const;

export const marquee = {
  items: [
    "Customer messages",
    "Lead follow-up",
    "Recurring reports",
    "Connected tools",
    "Websites, end to end",
  ],
} as const;

// Offers in the present tense (constitution §7.3). No client, project or result is claimed.
export const agents = {
  number: "01",
  label: "What my agents handle",
  demoStatus: "agent running",
  items: [
    {
      title: "Customer messages",
      line: "I set up agents that answer your routine customer messages.",
      slug: "support-agent",
    },
    {
      title: "Lead follow-up",
      line: "I set up agents that follow up on your new leads.",
      slug: "lead-agent",
    },
    {
      title: "Recurring reports",
      line: "I set up reports that get built and sent on schedule.",
      slug: "report-agent",
    },
    {
      title: "Connected tools",
      line: "I make the tools you already use share their data.",
      slug: "sync-agent",
    },
  ],
  // Sample content inside the illustrations (constitution §7 item 5). No real client or result.
  demos: {
    chat: {
      customer: "Hi, has my order shipped yet?",
      reply: "Yes, it left this morning. Here's your tracking link.",
      replyMeta: "agent reply · 2s",
      thanks: "Perfect, thanks!",
    },
    leads: {
      rows: [
        { initials: "SK", name: "Sara K.", source: "website form" },
        { initials: "DR", name: "Daniel R.", source: "instagram DM" },
        { initials: "AM", name: "Aisha M.", source: "call-back request" },
      ],
      statusNew: "new",
      statusDone: "followed up",
    },
    report: {
      title: "Weekly report",
      week: "week 38",
      bars: [42, 58, 50, 72, 64, 86, 78, 95],
      chartAlt: "Bar chart of eight weeks, rising, with this week highest.",
      sent: "sent to team · Mon 09:00",
    },
    sync: {
      tools: ["Inbox", "CRM", "Sheets"],
      events: [
        { kind: "new contact", result: "Added to CRM" },
        { kind: "deal updated", result: "Row in Sheets" },
        { kind: "reply sent", result: "Logged in inbox" },
      ],
      done: "all tools in sync",
    },
  },
} as const;

// Facts → How the user works. No agent names, tools or counts.
export const process = {
  number: "02",
  label: "How I work",
  heading: { lead: "AI agents run", accent: "every job." },
  stepLabel: "Step",
  steps: [
    { title: "Written rules", line: "Every job starts as clear, written instructions." },
    { title: "Agents do the work", line: "AI agents do the work, following those rules." },
    { title: "They check themselves", line: "The agents check their own work before you see it." },
    { title: "Lessons update the rules", line: "What each job teaches goes back into the rules." },
  ],
  loopLabel: "Next job, better rules.",
} as const;

// Facts → What the user can build. An offer.
export const web = {
  number: "03",
  label: "Websites, end to end",
  heading: { lead: "Your website,", accent: "start to finish." },
  lead: "One person, from plan to launch: your website or web app, with your automations wired in from the start.",
  steps: [
    { title: "Strategy", line: "First, I plan what your site needs to do." },
    { title: "Design", line: "Layouts and visuals you review before anything is built." },
    { title: "Build", line: "Fast on phones and computers, and easy for you to update." },
    { title: "Launch & care", line: "Domain, hosting and analytics set up, then fixes after launch." },
  ],
} as const;

// Facts → Work that is live. The three real projects only; no stacks, no clients.
export const proofs = {
  number: "04",
  label: "Proofs",
  heading: { lead: "Work that", accent: "runs." },
  hint: "Open a card to see more",
  open: "Open",
  projects: {
    exile: {
      tag: "Bot platform",
      title: "Exile",
      cardLine: "Stops spam and raids in gaming communities, around the clock.",
      cardShotAlt: "[FILL: Exile card screenshot alt text]",
      rows: {
        whatItIs: "A Discord bot, its website and an owner dashboard.",
        built: "By me alone, since March 2026. I still run it.",
        inUse: "In online gaming communities, around the clock.",
        inUseStats: [
          { value: "~20", label: "Communities" },
          { value: "4k+", label: "Commands run" },
        ],
      },
      summary:
        "Exile stops spam and raid attacks in online gaming communities and handles their routine moderation around the clock. Community owners manage it from their own dashboard.",
      shotAlts: [
        "[FILL: Exile takeover screenshot 1 alt text]",
        "[FILL: Exile takeover screenshot 2 alt text]",
        "[FILL: Exile takeover screenshot 3 alt text]",
      ],
      visitLabel: "Visit Exile",
    },
    designVault: {
      tag: "Design library",
      title: "Design Vault",
      cardLine: "Keeps a designer's screens, colour palettes and fonts in one place.",
      cardShotAlt: "[FILL: Design Vault card screenshot alt text]",
      rows: {
        whatItIs: "A free, open-source library for a designer's work.",
        built: "By me alone. MIT licence.",
        inUse: "Public and free to use since September 2026.",
      },
      summary:
        "Design Vault keeps a designer's screens, colour palettes and fonts in one place, on their own computer. It's free and open source, so anyone can use it or build on it.",
      shotAlts: [
        "[FILL: Design Vault takeover screenshot 1 alt text]",
        "[FILL: Design Vault takeover screenshot 2 alt text]",
        "[FILL: Design Vault takeover screenshot 3 alt text]",
      ],
      visitLabel: "Visit Design Vault",
    },
    marwixSkills: {
      tag: "AI tools",
      title: "MARWIX-SKILLS",
      cardLine: "Free, open-source tools for people building with AI.",
      cardShotAlt: "[FILL: MARWIX-SKILLS card screenshot alt text]",
      rows: {
        whatItIs: "A free, open-source set of tools for building with AI.",
        built: "[FILL: MARWIX-SKILLS built]",
        inUse: "[FILL: MARWIX-SKILLS in use]",
      },
      summary:
        "MARWIX-SKILLS is a free, open-source set of tools for people building with AI. Anyone can use them or build on them.",
      shotAlts: [
        "[FILL: MARWIX-SKILLS takeover screenshot 1 alt text]",
        "[FILL: MARWIX-SKILLS takeover screenshot 2 alt text]",
        "[FILL: MARWIX-SKILLS takeover screenshot 3 alt text]",
      ],
      visitLabel: "Visit MARWIX-SKILLS",
    },
  },
  takeover: {
    proof: "Proof",
    close: "Close",
    escHint: "Esc",
    next: "Next project",
    rowLabels: {
      whatItIs: "What it is",
      built: "Built",
      inUse: "In use",
    },
  },
} as const;

export const contact = {
  number: "05",
  label: "Let's talk",
  heading: { lead: "What work do", accent: "you repeat?" },
  lead: "Build a short brief and send it. We'll go through it together on a call.",
  links: {
    bookCall: { kind: "Calendar" },
    email: { kind: "Email" },
    whatsapp: { label: "Message me on WhatsApp", kind: "Chat" },
  },
  brief: {
    heading: "Build your brief",
    needs: {
      legend: "01 / What do you need?",
      options: ["AI agents", "Automations", "Website", "Web app", "Not sure yet"],
    },
    timeline: {
      legend: "02 / Timeline",
      options: ["ASAP", "This month", "Exploring"],
    },
    repeat: {
      label: "03 / What do you repeat every week?",
      placeholders: [
        "Copy-pasting between tools…",
        "Chasing new leads…",
        "Answering the same questions…",
        "Monday morning reports…",
      ],
    },
    send: "Send brief",
    sendHint: "Opens your email app",
    summaryEmpty: "Pick at least one",
    // Mail subject and body labels. lib/brief.ts adds a space after the prefix, then the needs.
    mail: {
      subjectPrefix: "Project brief:",
      need: "What I need:",
      timeline: "Timeline:",
      repeat: "What we repeat every week:",
      none: "Not picked yet",
      repeatEmpty: "Left blank",
    },
  },
} as const;

// Addresses, not copy. Copied verbatim from docs/03-facts.md → Work that is live.
export const links = {
  exile: "https://exile.marwix.dev",
  designVault: "https://github.com/404mw/Design-Vault",
  marwixSkills: "https://github.com/404mw/MARWIX-SKILLS",
} as const;
