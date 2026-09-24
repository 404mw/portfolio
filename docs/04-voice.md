# Voice: how the site's words are written

`copywriter` writes the page copy into `content/<page>.ts`, from `docs/03-facts.md` only. The user
edits it whenever they want. **The user's edits are final:** before changing any line in
`content/`, check `git log -p` for that file. If the user changed the line, leave it and ask.

## The reader

A small-business owner who isn't technical. Someone sent them the link. They skim each section
for 3–5 seconds and decide whether to keep going. Every section answers **one question**, the
question in its page doc.

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

## Length limits

| Slot | Limit |
|---|---|
| Hero line | 12 words |
| Section heading (giant rows) | 1–3 words |
| Section heading (other) | 6 words |
| Body under a section | 40 words |
| One automation row's short line | 12 words |
| Page title (browser tab and search) | 60 characters |
| Page description (search and sharing) | 155 characters |
| Image alt text | 125 characters, says what's in the image |

If a line won't fit, cut ideas, not letters. Never shrink the type to fit words.

## Before you hand copy over

- Every claim traces to a line in `docs/03-facts.md`.
- None of the rules above is broken; check rules 6, 8, 10 and 11 by searching.
- Every slot is within its limit.
- `[FILL: …]` markers are left as markers, never guessed.
