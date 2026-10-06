// Home copy: the one page at `/`. Hero, marquee, agents, process, web, proofs, contact.
// Source: docs/03-facts.md. Voice: docs/04-voice.md. Slots and limits: docs/pages/home/ui-spec.md.
// The Book a call label is the shared `nav.bookCall`. exile.marwix.dev is linked from the Exile
// takeover only. Agents demo content is sample illustration (constitution §7 item 5).

export const meta = {
  title: "MARWIX: AI Automation Engineer",
  description:
    "I build AI agents that take repetitive work off your team, and the websites around them. Book a call.",
} as const;

export const hero = {
  firstName: "Muhammad",
  lastName: "Waqas",
  sideLine: "I build AI agents that take repetitive work off your team, and the websites around them.",
  tag: "AI agents · End-to-end web",
  seeProofs: "See projects",
  portraitAlt: "Muhammad Waqas, head and shoulders, in black and white, with glasses, a beard and a dark collared shirt, looking to one side.",
} as const;

// About. Facts → Who (the "who I am" lines) and What the user builds (each card's group).
// Unnumbered (user's answer). Rix speaks for the user: acks say "MARWIX" (the brand, third person), never "I".
// Each card's ack and whatsappText take that card's tone (docs/04-voice.md → Tone per card).
// whatsappText is the visitor's own default message; the address stays in content/shared.ts.
// Card keys are fixed (ui-spec §0.5): the radio value, the ?for= value and the set keys.
export const about = {
  label: "About me",
  heading: { lead: "Software that", accent: "runs on its own." },
  lines: [
    "I'm an AI Automation Engineer. I automate the work a business repeats.",
    "If you build software, I help you ship it.",
  ],
  prompt: "What do you do? Pick the closest one.",
  // Rix, the mascot (About on home and the playground on /rix). Playful, no claims.
  rix: {
    buttonLabel: "Poke Rix",
    pokeLines: [
      "Hey! That tickles.",
      "Again? Bold move.",
      "I'm not a button.",
      "You poke, I bounce.",
      "Fun. Now look down.",
    ],
    // Idle chatter (ui-spec/00-rix.md R5.4, R12.2). Shown in turn, never announced.
    // idleLines: while no card is picked. afterPickLines: once any card is picked; never asks for a pick.
    idleLines: [
      "Go on, pick one.",
      "Which one are you?",
      "Not sure counts too.",
      "Pick the closest one.",
      "One of these is you.",
      "Pick one. I'll wait.",
    ],
    afterPickLines: [
      "Examples are just below.",
      "Like it? Book a call.",
      "Scroll on. I'll be here.",
      "Stuck? Send a message.",
      "Have a look below.",
    ],
    // Hover mode (ui-spec/00-rix.md R4.9, R12.2). Shown, never announced. Recognition only, no offers.
    // hoverLines: that card hovered or focused before a pick, in the card's tone. Keys are the card keys.
    hoverLines: {
      "service-business": ["Customers to look after?", "Busy days? This one."],
      "online-store": ["Orders coming in?", "Run a shop? Pick it."],
      discord: ["Discord? Got a server?", "Server owner? That's you."],
      "software-builder": ["Shipping something?", "Building an app? Go on."],
      website: ["Need a site? That's it.", "No website yet? Pick it."],
      "not-sure": ["Not sure? That's fine.", "Still deciding? Pick it."],
    },
    // hoverAnyLines: any card hovered before a pick, between that card's own lines.
    hoverAnyLines: ["That one?", "Go on, it's yours.", "Is that you?", "Ooh, good one."],
    // switchLines: after a pick, a different card hovered.
    switchLines: ["Switching? Go ahead.", "Changed your mind?", "That one's fine too."],
    // Poke ladder (ui-spec/00-rix.md R6A, R12.1). Shown and announced: annoyed, angry.
    // Shown, never announced: sulk, forgive. throwAway is screen-reader only.
    annoyedLines: ["Okay, that's plenty.", "Easy. I'm counting pokes.", "One more and I'm off."],
    angryLines: ["That's it. I'm done!", "Hmph! No more pokes!"],
    sulkLine: "I'm not talking.",
    forgiveLine: "Fine. We're friends.",
    throwAway: "Rix threw your pick away.",
    // The pick lock (ui-spec/00-rix.md R6A.9, R12.2). Both screen-reader only, never shown.
    // lockLine follows the angry line or throwAway in one announcement; unlockLine ends the lock.
    lockLine: "Rix is in a huff. The cards are locked for a moment.",
    unlockLine: "Rix has calmed down. You can pick a card again.",
    // The pet (ui-spec/00-rix.md R6B, R12.1). Shown in turn, never announced.
    petLines: ["Aw, that's nice.", "Okay, don't stop."],
  },
  // Shown under a picked card's ack (cards 0–4 only), hidden without JavaScript (ui-spec §2a.R3).
  ackSet: "The examples below are now set for you.",
  replies: [
    {
      key: "service-business",
      label: "Service business",
      ack: "Bookings, reminders and routine messages? MARWIX can take those off your day.",
      whatsappText:
        "Hi Marwix, I run a service business and I'd like to talk about bookings and customer messages.",
    },
    {
      key: "online-store",
      label: "Online store",
      ack: "Order and delivery questions, all day? MARWIX can have an agent answer them.",
      whatsappText:
        "Hi Marwix, I run an online store and I'd like to talk about order questions and reports.",
    },
    {
      key: "discord",
      label: "Discord",
      ack: "Same questions in every channel? MARWIX can build a bot that answers your members.",
      whatsappText:
        "Hey Marwix, I run a Discord server and want a bot for member questions and moderation.",
    },
    {
      key: "software-builder",
      label: "Developer or team",
      ack: "Shipping a feature? MARWIX builds it, or sets up the workflow in your team.",
      whatsappText:
        "Hi Marwix, I'm building an app and I'd like to talk about shipping it with your workflow.",
    },
    {
      key: "website",
      label: "I need a website",
      ack: "Need a website? MARWIX can build it, with agents that answer your visitors.",
      whatsappText: "Hi Marwix, I need a website and I'd like to talk about building it.",
    },
    {
      key: "not-sure",
      label: "Not sure yet",
      ack: "Fair enough. Scroll on for a mix of what MARWIX builds.",
      whatsappText: "Hi Marwix, I'd like to talk about automating my business",
    },
  ],
} as const;

// The "Shown for: <card>" tag at the top of Agents and Process (ui-spec §0.6). Shared voice.
// The tag's value and its options reuse about.replies[i].label.
export const shownFor = {
  label: "Shown for:",
  everyone: "Everyone",
  legend: "Choose who this is for",
  announce: "Examples now set for:",
} as const;

export const marquee = {
  items: [
    "Specialized agents",
    "Enforced Rules",
    "Customer messages",
    "Lead follow-up",
    "Recurring reports",
    "Connected tools",
    "Web apps",
  ],
} as const;

// Offers in the present tense (constitution §7.3). No client, project or result is claimed.
// Facts → What the user builds, one list per About card, lead offer first (ui-spec/04-agents.md §4.8).
// cards.default is in the shared voice; each card's set is in its own tone. The panel kind per
// row lives in lib/agents.ts; each row's demo is written in the shape of its kind.
// Demo content is sample illustration (constitution §7.4, §7.5): no real client, business or result.
export const agents = {
  number: "01",
  label: "What my agents handle",
  demoStatus: "agent running",
  demoAgent: "Agent",
  // Below `lg`, the phone stepper above the panel (ui-spec §4.2a). Screen-reader and button names
  // only; `{n}` and `{total}` are filled in code. `position` also starts the press announcement.
  stepper: {
    prev: "Previous offer",
    next: "Next offer",
    position: "Offer {n} of {total}",
  },
  // The website card's last row: not an agent demo, it points to section 03 (web.steps titles).
  pointer: {
    status: "website build",
    heading: "Websites, built end to end.",
    cta: "See the website steps",
  },
  cards: {
    default: [
      {
        title: "Bookings",
        line: "I set up agents that take bookings and keep your schedule.",
        slug: "booking-agent",
        demo: {
          rows: [
            { initials: "MH", name: "Maya H.", source: "website form" },
            { initials: "OT", name: "Omar T.", source: "WhatsApp message" },
            { initials: "LP", name: "Lena P.", source: "phone message" },
          ],
          statusNew: "new",
          statusDone: "booked",
        },
      },
      {
        title: "Order questions",
        line: "I set up agents that answer order and delivery questions.",
        slug: "support-agent",
        demo: {
          asker: "Customer",
          messages: [
            { from: "them", text: "Hi, has my order shipped yet?" },
            {
              from: "agent",
              text: "Yes, it left this morning. Here's your tracking link.",
              meta: "agent reply · 2s",
            },
            { from: "them", text: "Perfect, thanks!" },
          ],
        },
      },
      {
        title: "Member questions",
        line: "I set up agents that answer Discord members' questions when they're mentioned.",
        slug: "member-agent",
        demo: {
          asker: "Member",
          messages: [
            { from: "them", text: "@bot how do I join the weekend event?" },
            {
              from: "agent",
              text: "Sign-ups are in #events, same as last time. Here's the link.",
              meta: "agent reply · 2s",
            },
            { from: "them", text: "Found it, thanks." },
          ],
        },
      },
      {
        title: "Agent workflow",
        line: "I set up my agent workflow inside your team, for building software.",
        slug: "workflow-agent",
        // Kind `orchestra` (ui-spec §4.4): swimlanes for the lead, the team and the checkers, with the fix.
        demo: {
          lead: "Lead",
          team: { label: "The team", roles: ["Plan", "Design", "Build"] },
          checks: { label: "The checkers", roles: ["Review", "Rules", "Try-out"] },
          ring: {
            out: "hands out",
            rules: "reads rules",
            work: "works, reports",
            check: "lead sends it",
            fix: "fix, recheck",
            pass: "all clear",
          },
          steps: [
            "The lead agent hands each part of the work to a specialist.",
            "Each specialist reads the written rules before starting.",
            "The specialist does the work and reports back to the lead.",
            "The lead sends the finished work to separate checkers.",
            "Problems and broken rules go back to be fixed and checked again.",
            "When every check passes, the work goes back to the lead.",
          ],
          done: "all checks passed",
        },
      },
    ],
    "service-business": [
      {
        title: "Bookings",
        line: "I set up agents that book customers in and manage your schedule.",
        slug: "booking-agent",
        demo: {
          rows: [
            { initials: "MH", name: "Maya H.", source: "website form" },
            { initials: "OT", name: "Omar T.", source: "WhatsApp message" },
            { initials: "LP", name: "Lena P.", source: "phone message" },
          ],
          statusNew: "new",
          statusDone: "booked",
        },
      },
      {
        title: "Customer messages",
        line: "I set up agents that answer your routine customer messages.",
        slug: "support-agent",
        demo: {
          asker: "Customer",
          messages: [
            { from: "them", text: "Hi, are you open on Saturday?" },
            {
              from: "agent",
              text: "Yes, 9 to 5 on Saturdays. Want me to book you in?",
              meta: "agent reply · 2s",
            },
            { from: "them", text: "Yes please, thank you!" },
          ],
        },
      },
      {
        title: "Reminders",
        line: "I set up agents that remind customers and handle a reschedule.",
        slug: "reminder-agent",
        demo: {
          asker: "Customer",
          messages: [
            {
              from: "agent",
              text: "Hi Nadia, a reminder: your appointment is tomorrow at 10:00.",
              meta: "reminder sent",
            },
            { from: "them", text: "Can we move it to Thursday?" },
            {
              from: "agent",
              text: "Done. You're booked for Thursday at 10:00.",
              meta: "rescheduled",
            },
            { from: "them", text: "Thanks!" },
          ],
        },
      },
      {
        title: "New enquiries",
        line: "I set up agents that follow up on your new enquiries.",
        slug: "lead-agent",
        demo: {
          rows: [
            { initials: "SK", name: "Sara K.", source: "website form" },
            { initials: "DR", name: "Daniel R.", source: "instagram DM" },
            { initials: "AM", name: "Aisha M.", source: "call-back request" },
          ],
          statusNew: "new",
          statusDone: "followed up",
        },
      },
    ],
    "online-store": [
      {
        title: "Order questions",
        line: "I set up agents that answer your customers' order and delivery questions.",
        slug: "support-agent",
        demo: {
          asker: "Customer",
          messages: [
            { from: "them", text: "Hi, has my order shipped yet?" },
            {
              from: "agent",
              text: "Yes, it left this morning. Here's your tracking link.",
              meta: "agent reply · 2s",
            },
            { from: "them", text: "Perfect, thanks!" },
          ],
        },
      },
      {
        title: "Sales reports",
        line: "I set up sales reports that get built and sent on schedule.",
        slug: "report-agent",
        demo: {
          title: "Weekly sales",
          week: "week 38",
          bars: [42, 58, 50, 72, 64, 86, 78, 95],
          chartAlt: "Bar chart of eight weeks, rising, with this week highest.",
          sent: "sent to team · Mon 09:00",
        },
      },
      {
        title: "Connected tools",
        line: "I connect your store's tools so their data moves between them.",
        slug: "sync-agent",
        demo: {
          tools: ["Store", "Stock", "Sheets"],
          events: [
            { kind: "new order", result: "Stock updated" },
            { kind: "order paid", result: "Row in Sheets" },
            { kind: "item shipped", result: "Customer told" },
          ],
          done: "all tools in sync",
        },
      },
      {
        title: "Returns",
        line: "My agents take return and refund requests and pass them to you.",
        slug: "returns-agent",
        demo: {
          rows: [
            { initials: "JM", name: "Jonas M.", source: "return request" },
            { initials: "PL", name: "Priya L.", source: "refund request" },
            { initials: "EC", name: "Elena C.", source: "damaged item" },
          ],
          statusNew: "new",
          statusDone: "passed on",
        },
      },
    ],
    discord: [
      {
        title: "Member questions",
        line: "I build a bot that answers members' questions when they mention it.",
        slug: "faq-bot",
        demo: {
          asker: "Member",
          messages: [
            { from: "them", text: "@bot when's the next game night?" },
            {
              from: "agent",
              text: "Friday, 8pm in #events. Same squad as last time?",
              meta: "bot reply · 2s",
            },
            { from: "them", text: "Yep, count me in!" },
          ],
        },
      },
      {
        title: "Welcome and roles",
        line: "I set up a bot that welcomes new members and gives roles.",
        slug: "welcome-bot",
        demo: {
          title: "Mika T.",
          meta: "new member",
          items: [
            { text: "Joins the server", note: "joined" },
            { text: "Sent to #rules", note: "welcomed" },
            { text: "Reacts to the rules", note: "agreed" },
            { text: "Gets the Member role", note: "added" },
          ],
          done: "role given",
        },
      },
      {
        title: "Moderation",
        line: "I set up a bot that handles routine moderation around the clock.",
        slug: "mod-bot",
        demo: {
          rows: [
            { initials: "DV", name: "Dario V.", source: "swore at a member", done: "timed out" },
            { initials: "KS", name: "Kenji S.", source: "not in English", done: "warned" },
            { initials: "TB", name: "Tess B.", source: "suspicious activity", done: "mods told" },
          ],
          statusNew: "flagged",
          statusDone: "handled",
        },
      },
      {
        title: "Activity reports",
        line: "I set up server activity reports, sent to you on schedule.",
        slug: "report-bot",
        demo: {
          title: "Server activity",
          week: "week 38",
          bars: [42, 58, 50, 72, 64, 86, 78, 95],
          chartAlt: "Bar chart of eight weeks of server activity, this week highest.",
          sent: "sent to owner · Mon 09:00",
        },
      },
      {
        title: "Custom commands",
        line: "I build custom commands and connect your server's business tools and apps.",
        slug: "command-bot",
        demo: {
          tools: ["Server", "Sheets", "Twitch"],
          events: [
            { kind: "/signup used", result: "Row in Sheets" },
            { kind: "/stock used", result: "Read from Sheets" },
            { kind: "Stream goes live", result: "Posted in #live" },
          ],
          done: "all tools in sync",
        },
      },
    ],
    "software-builder": [
      {
        title: "Workflow setup",
        line: "I set up the agent workflow I use inside your team.",
        slug: "workflow-agent",
        // Kind `orchestra` (ui-spec §4.4), in builders' words.
        demo: {
          lead: "Lead",
          team: { label: "Build team", roles: ["UI", "Backend", "Data"] },
          checks: { label: "Review gate", roles: ["Review", "Rules", "Tests"] },
          ring: {
            out: "assigns",
            rules: "reads rules",
            work: "codes, reports",
            check: "lead routes it",
            fix: "fix and rerun",
            pass: "approved",
          },
          steps: [
            "The lead splits the work and assigns each part to a specialist.",
            "Each specialist reads the written rules before building.",
            "The specialist builds its part and reports back to the lead.",
            "The lead sends the work to separate review, rules and test checks.",
            "Findings and broken rules go back to be fixed, then rechecked.",
            "When every check is green, the work goes back to the lead.",
          ],
          done: "all checks green",
        },
      },
      {
        title: "App or feature",
        line: "My workflow builds your app or feature: lower cost, faster delivery.",
        slug: "build-agent",
        demo: {
          title: "Team invites",
          meta: "feature 12",
          items: [
            { text: "Invite form", note: "built" },
            { text: "Email with a link", note: "built" },
            { text: "Accept and join", note: "built" },
            { text: "Tests for all three", note: "passed" },
          ],
          done: "reviewed, ready to ship",
        },
      },
      {
        title: "Production ready",
        line: "I make a fast, AI-built app safe to serve the public.",
        slug: "review-agent",
        demo: {
          title: "Launch review",
          meta: "4 found",
          items: [
            { text: "Secrets in the code", note: "removed" },
            { text: "Open admin page", note: "locked" },
            { text: "No rate limits", note: "added" },
            { text: "Unchecked user input", note: "fixed" },
          ],
          done: "ready for the public",
        },
      },
      {
        title: "After launch",
        line: "I keep your app running after launch: fixes, updates and scaling.",
        slug: "upkeep-agent",
        demo: {
          title: "Weekly upkeep",
          week: "week 38",
          bars: [30, 46, 38, 52, 44, 60, 48, 66],
          chartAlt: "Bar chart of eight weeks of fixes and updates, this week highest.",
          sent: "fixes shipped · Fri 17:00",
        },
      },
    ],
    website: [
      {
        title: "Visitor questions",
        line: "I set up agents that answer visitors' routine questions on your site.",
        slug: "site-agent",
        demo: {
          asker: "Visitor",
          messages: [
            { from: "them", text: "Hi, where are you based?" },
            {
              from: "agent",
              text: "We're on Mill Street, open 9 to 6. Here's the map.",
              meta: "agent reply · 2s",
            },
            { from: "them", text: "Thanks, see you Friday." },
          ],
        },
      },
      {
        title: "Form follow-up",
        line: "I set up agents that follow up on your contact-form enquiries.",
        slug: "lead-agent",
        demo: {
          rows: [
            { initials: "NB", name: "Noor B.", source: "contact form" },
            { initials: "TW", name: "Tom W.", source: "quote request" },
            { initials: "IR", name: "Ines R.", source: "contact form" },
          ],
          statusNew: "new",
          statusDone: "followed up",
        },
      },
      {
        title: "Site bookings",
        line: "I set up agents that take bookings right on your site.",
        slug: "booking-agent",
        demo: {
          rows: [
            { initials: "CD", name: "Clara D.", source: "booking page" },
            { initials: "YA", name: "Yusuf A.", source: "services page" },
            { initials: "HK", name: "Hana K.", source: "home page" },
          ],
          statusNew: "new",
          statusDone: "confirmed",
        },
      },
      {
        title: "Site reports",
        line: "I set up site reports that get built and sent on schedule.",
        slug: "report-agent",
        demo: {
          title: "Weekly visits",
          week: "week 38",
          bars: [42, 58, 50, 72, 64, 86, 78, 95],
          chartAlt: "Bar chart of eight weeks of visits, rising, this week highest.",
          sent: "sent to you · Mon 09:00",
        },
      },
      {
        // Kind `pointer`: no slug and no demo. Its panel is agents.pointer plus web.steps titles.
        title: "Custom websites",
        line: "I build your website end to end, from plan to launch.",
      },
    ],
  },
} as const;

// Facts → How the user works. One flow per About card (ui-spec/05-process.md §5.5, §5.10): the
// agent doing that visitor's job on the card's lead offer. Flows are illustrations (constitution
// §7.5). flows.default is in the shared voice; each card's flow is in its own tone.
// The loop returns to step 2. No agent names, tools or counts.
// flows.discord (user's call, 2026-10-04) is the bot's own behaviour: no check, no loop, so it
// carries no loopLabel and no fixLabel.
export const process = {
  number: "02",
  label: "How I work",
  heading: { lead: "AI agents run", accent: "every job." },
  stepLabel: "Step",
  flows: {
    default: {
      caption: "Example: one job",
      steps: [
        { title: "Job arrives", line: "A job comes in: a booking, a question, a request." },
        { title: "Your rules", line: "The agent works from rules written for your business." },
        { title: "Done", line: "The agent does the job, following those rules." },
        { title: "Second check", line: "A separate agent checks the work against your rules." },
        { title: "Flagged", line: "Anything unusual is passed to a person." },
      ],
      loopLabel: "Next job, better rules.",
      fixLabel: "Rule broken? Back to fix.",
    },
    "service-business": {
      caption: "Example: a booking",
      steps: [
        { title: "Request arrives", line: "A customer asks for an appointment." },
        { title: "Your rules", line: "The agent follows your hours, services and booking rules." },
        { title: "Booked", line: "The agent finds a free slot and books it." },
        { title: "Second check", line: "A separate agent checks the booking against your rules." },
        { title: "Reminder", line: "The customer gets a reminder, and can reschedule." },
        { title: "Flagged", line: "Anything unusual is passed to you or your staff." },
      ],
      loopLabel: "Next job, better rules.",
      fixLabel: "Breaks your rules? Redone.",
    },
    "online-store": {
      caption: "Example: an order question",
      steps: [
        { title: "Question arrives", line: "A customer asks where their order is." },
        { title: "Your rules", line: "The agent follows your delivery and returns rules." },
        { title: "Answered", line: "The agent looks up the order and replies." },
        { title: "Second check", line: "A separate agent checks the reply against your rules." },
        { title: "Flagged", line: "Refunds and complaints are passed to you." },
      ],
      loopLabel: "Next order, better rules.",
      fixLabel: "Rule broken? Reply redone.",
    },
    discord: {
      caption: "Example: a member's @mention",
      steps: [
        { title: "Mentioned", line: "A member @mentions the bot in a channel." },
        { title: "Your tone", line: "It replies in the tone you set." },
        { title: "Remembers", line: "If you want, it recalls each member's past chats." },
        { title: "Connected", line: "It pulls from and posts to your tools and apps." },
        { title: "Always on", line: "It stays in your server around the clock." },
      ],
    },
    "software-builder": {
      caption: "Example: shipping a feature",
      steps: [
        { title: "Feature asked", line: "You describe the feature you want shipped." },
        { title: "Your rules", line: "The work starts from your team's written rules." },
        { title: "Built", line: "Agents build the feature inside those rules." },
        { title: "Second check", line: "A separate agent reviews the work against your rules." },
        { title: "Flagged", line: "Anything unusual goes to a person, not an agent." },
        { title: "Shipped", line: "The feature ships to production." },
      ],
      loopLabel: "Next build, better rules.",
      fixLabel: "Breaks a rule? Rebuild.",
    },
    website: {
      caption: "Example: a visitor's enquiry",
      steps: [
        { title: "Visitor asks", line: "A visitor sends a question through your site." },
        { title: "Your rules", line: "The agent follows the rules written for your site." },
        { title: "Answered", line: "The agent replies with what the visitor needs." },
        { title: "Second check", line: "A separate agent checks the reply against your rules." },
        { title: "Flagged", line: "Anything unusual is passed to you." },
      ],
      loopLabel: "Next visit, better rules.",
      fixLabel: "Breaks site rules? Redone.",
    },
  },
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
  label: "Projects",
  heading: { lead: "Work that", accent: "runs." },
  hint: "Open a card to see more",
  open: "Open",
  projects: {
    exile: {
      tag: "Discord platform",
      title: "Exile Bot",
      cardLine: "Runs in-game calculations and simulations for Idle Heroes players.",
      proofLine: "Live since March 2026, run by me alone",
      rows: {
        whatItIs: "A Discord bot, its website and an owner dashboard.",
        built: "By me alone, since March 2026. I still run it.",
        inUse: "In Discord communities for Idle Heroes, a mobile game.",
        inUseStats: [
          { value: "18+", label: "Communities" },
          { value: "3.9K+", label: "Commands run" },
        ],
      },
      intro:
        "Exile Bot works out in-game calculations and simulations for Idle Heroes players, inside the Discord chat they already use.",
      problem: {
        headline: "To work something out, players had to leave the chat.",
        body: "Idle Heroes players had few calculators, or none at all. To work something out they saved outside links, switched tabs and opened spreadsheets and a browser.",
      },
      whatIBuilt: {
        headline: "Now the calculations run in the chat they already use.",
        body: "Players get their answer in the Discord chat where they already spend most of their time, laid out to look good. I also added new calculators and simulations. Exile Bot handles routine moderation around the clock too, and community owners manage it from their own dashboard.",
      },
      // Facts → What the user can do for a business: shown by Exile Bot, in the facts' order.
      whatItTook: {
        headline: "I built every part and I keep it running.",
        items: [
          {
            title: "Connecting your tools",
            line: "Exile Bot runs on live connections to outside services. I can connect the tools your business already uses.",
          },
          {
            title: "Payments",
            line: "I built Exile Bot's payments alone: credits, subscriptions and promo pricing, all working. I can set up yours.",
          },
          {
            title: "Hosting and upkeep",
            line: "I run Exile Bot's server, database and updates myself. When it crashed, I traced the exact cause in the logs and fixed it.",
          },
          {
            title: "Websites and web apps",
            line: "I built Exile Bot's public website alone. I build websites and web apps end to end.",
          },
        ],
      },
      // Facts → What building Exile Bot taught the user, in the facts' order. 48 hours and 700+ as filled.
      whatILearned: {
        headline: "Running a live app changed how I build yours.",
        items: [
          {
            title: "I build the system before the app",
            line: "Specialist agents, written rules, automatic checks and a review loop built Exile Bot and ran it live, with real users.",
          },
          {
            title: "I keep only the data an app needs",
            line: "Exile Bot keeps users' data on EU servers with encrypted backups, and deletes anyone's data on request within 48 hours.",
          },
          {
            title: "I keep heavy pages fast",
            line: "One public page on Exile Bot's website carries 700+ images and is built to stay fast.",
          },
        ],
      },
      // Active in the communities that use Exile Bot (facts, 2026-10-05): the automation showcase.
      showcase: {
        headline: "Spam protection that acts on its own.",
        status: "Live in communities that use it",
        body: "Spam protection runs in the communities that use Exile Bot. When a hijacked account starts spamming, it shuts that account down by itself. It's an example of automation that watches for one problem and deals with it without a person stepping in.",
        steps: {
          watch: {
            title: "Watches",
            line: "It watches messages as they arrive.",
          },
          spot: {
            title: "Spots",
            line: "It spots a hijacked account that is spamming.",
          },
          stop: {
            title: "Shuts it down",
            line: "It shuts that account down on its own.",
          },
        },
        returnLabel: "Temporary",
        returnLine: "The shutdown ends on its own, so a false alarm undoes itself.",
      },
      // The closing line. default is in the shared voice; each card's line is in its own tone.
      meansForYou: {
        default: "I can automate your repetitive work inside the tools your business already uses.",
        "service-business":
          "I can set up an agent that takes bookings and answers routine messages where your customers already message you.",
        "online-store":
          "I can set up an agent that answers order and delivery questions where your customers already ask them.",
        discord:
          "I can build custom commands for your server, so members get answers without leaving the channel.",
        "software-builder":
          "I keep Exile Bot running in production on my own, and I can do that for your app after it ships.",
        website: "I built Exile Bot's website alone, and I can build yours end to end, from plan to launch.",
      },
      shotAlts: [
        "The Exile Bot website's home page, showing a calculation result card beside its headline.",
        "The Exile Bot owner dashboard's home view, showing which systems are running and the most used commands.",
        "The owner dashboard's spam and raid protection settings page, with protection switched on.",
      ],
      visitLabel: "Visit Exile Bot",
    },
    designVault: {
      tag: "Design library",
      title: "Design Vault",
      cardLine: "Keeps a designer's screens, colour palettes and fonts in one place.",
      proofLine: "Public since September 2026, built by me alone",
      rows: {
        whatItIs: "A free, open-source library for a designer's work.",
        built: "By me alone. MIT licence.",
        inUse: "Public and free to use since September 2026.",
      },
      intro:
        "Design Vault keeps a designer's UI screens and components, colour palettes and fonts in one place, on their own computer.",
      problem: {
        headline: "You scroll past good design, then forget it.",
        body: "People scroll past a lot of design online and notice more of it around them, then forget it as soon as they move on. I built Design Vault so the ideas worth keeping have a place to go.",
      },
      whatIBuilt: {
        headline: "One place for the screens, palettes and fonts worth keeping.",
        body: "Design Vault holds UI screens and components, colour palettes and fonts in one library, on the designer's own computer. It's free and open source under the MIT licence, so anyone can use it or build on it.",
      },
      // No card line but the builder's: the other four fall back to default.
      meansForYou: {
        default: "I built Design Vault because I needed it, and I can build the custom tool you need.",
        "software-builder":
          "Design Vault is open source, so you can read my code before I build your app or feature.",
      },
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
      cardLine: "Tools that help people build with AI.",
      proofLine: "Free and open source, anyone can use it",
      rows: {
        whatItIs: "A free, open-source set of tools for building with AI.",
        built: "[FILL: MARWIX-SKILLS built]",
        inUse: "[FILL: MARWIX-SKILLS in use]",
      },
      intro: "MARWIX-SKILLS is a set of free, open-source tools for people building with AI.",
      problem: {
        headline: "[FILL: MARWIX-SKILLS problem headline]",
        body: "[FILL: MARWIX-SKILLS problem body]",
      },
      whatIBuilt: {
        headline: "[FILL: MARWIX-SKILLS what I built headline]",
        body: "[FILL: MARWIX-SKILLS what I built body]",
      },
      meansForYou: {
        default: "[FILL: MARWIX-SKILLS what this means for you]",
      },
      shotAlts: [
        "[FILL: MARWIX-SKILLS takeover screenshot 1 alt text]",
        "[FILL: MARWIX-SKILLS takeover screenshot 2 alt text]",
        "[FILL: MARWIX-SKILLS takeover screenshot 3 alt text]",
      ],
      visitLabel: "Visit MARWIX-SKILLS",
    },
  },
  takeover: {
    proof: "Project",
    close: "Close",
    escHint: "Esc",
    next: "Next project",
    rowLabels: {
      whatItIs: "What it is",
      built: "Built",
      inUse: "In use",
    },
    // The eyebrows of parts 2 to 7, the same on every project. Shown uppercase by CSS.
    partLabels: {
      problem: "The problem",
      whatIBuilt: "What I built",
      whatItTook: "What it took",
      whatILearned: "What I learned",
      showcase: "Showcase",
      meansForYou: "What this means for you",
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
