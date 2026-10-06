# Voice: how the site's words are written

`copywriter` writes the page copy into `content/<page>.ts`, from `docs/03-facts.md` only. The user
edits it whenever they want. **The user's edits are final:** before changing any line in
`content/`, check `git log -p` for that file. If the user changed the line, leave it and ask.

## The reader

Someone who might hire the user, one of five audiences (constitution §3): a service business, an
online store, a Discord server owner, a software builder or someone who needs a website. Only the
software builder is technical. Someone sent them the link. They skim each section
for 3–5 seconds and decide whether to keep going. Every section answers **one question**, the
question in its page doc.

## Tone per card

The shared page keeps one voice, written so all five audiences follow it. A picked card's own
content (its acknowledgement, its offers and demos in Agents, its flow in Process, its WhatsApp
message, and the closing line of each project's takeover) takes that audience's tone. The rest of
a project's takeover is shared and reads the same for everyone. Every rule below still applies to
every card.

| Card | Tone |
|---|---|
| Service business | Plain and practical: customers, appointments, the day's work. |
| Online store | Plain and practical: orders, deliveries, customers. |
| Discord | Casual, in a server owner's words: members, mods, roles, channels. |
| Software builder | Peer to peer, one builder to another: app, feature, ship, review, production. No tool, model or stack names. |
| I need a website | Plain: visitors, enquiries, the site. |
| Not sure yet, or no pick | The shared voice. |

## Rules you can check

1. **Plain words.** Write what the reader would say. "Answers your customers' messages," not
   "LLM-powered support agent." No tech stack, no framework names, no vendor names.
2. **About the reader's problem first.** Say what changes for them. The user appears as the one
   who does it, not as the subject of praise.
3. **Fact, then what it means.** "Built and run alone since March 2026. It's still running."
4. **State things flatly, in the present tense.** Live work and offers alike: "I build AI
   agents that…", "I set up…". Never claim a specific client, project or result that isn't in
   the facts file (constitution §7.3).
5. **One strong claim per page at most.** Flat description is the default.
6. **No hype words:** revolutionize, transform, seamless, cutting-edge, leverage, empower,
   unlock, supercharge, game-changer, next-level, world-class, innovative, solutions, journey,
   passionate.
7. **No greetings, softeners or filler.** No "Welcome to", "I'm excited", "Feel free to".
8. **No posture.** Never "expert", "guru", "years of experience" or "seasoned".
9. **Name three things and stop.** Never "etc." or "and more".
10. **No em dashes (—).** Use a full stop, a comma or a colon.
11. **No numbers except the ones filled in `docs/03-facts.md`,** exactly as filled.
12. **First person** ("I"), in fixed sentence case. Headings in the big display face are
    uppercased by CSS, not typed in capitals.
13. **The button always says "Book a call".**
14. **Hunt for one compressed line under 12 words per page,** the line a reader would remember.

## Length

**There are no fixed length limits** (the user, 2026-10-05). A slot is as long as its idea needs
and no longer: say everything the facts and the brief ask for, in a line or paragraph a reader
finishes in a few seconds. Never cut a fact the brief asked for to hit a word count.

- A "Limit" column in any UI spec is a sizing note from when the layout was drawn, not a rule.
- Whether words fit is judged on screen, by the lead's screen check. If a line overflows its box
  or looks heavy there, cut ideas, not letters. Never shrink the type to fit words.
- Search and sharing previews cut long text: a page title near 60 characters, a description near
  155. That's how they display, so put the important words first.
- Alt text says what's in the image.

## Before you hand copy over

- Every claim traces to a line in `docs/03-facts.md`.
- None of the rules above is broken; check rules 6, 8, 10 and 11 by searching.
- No slot is longer than its idea needs.
- `[FILL: …]` markers are left as markers, never guessed.
