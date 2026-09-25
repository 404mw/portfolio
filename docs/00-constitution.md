# Constitution

**Last Updated:** 2026-09-25

The non-negotiable rules for `marwix.dev`. Every implementation decision is checked against them.
They exist to stop scope creep, unsupported claims and rework.

**When a request conflicts with this file, stop.** One of two things happens, and the user
chooses: the request's scope changes until it fits, or the user amends this file in its own edit,
updating its Last Updated date. Nothing is done as a one-off exception.

---

## 1. Docs stay current

A change to the page's sections, behaviour or text is reflected in its page doc
(`docs/pages/<page>/page.md`, the index, and the section's `sections/NN-<slug>.md`) before the
task counts as done. `page-doc-manager` writes the doc;
the other agents report what changed. A token change also updates `docs/01-design-system.md`.

## 2. One page

v1 is a **single page at `/`** that answers one question: **can they help me?** Every section on
it answers exactly one smaller question and reads in a 3–5 second skim. Projects open in a
full-screen takeover on the same page, not on their own routes. English only.

**Not in v1:** other routes, a blog, a services or pricing page.

## 3. The reader and the main action

The reader is a **non-technical small-business owner** who might hire the user, usually sent the
link directly. **"Book a call" is the main action** and stays visible in the nav.

- Section order lives in `docs/pages/home/page.md`; the nav and every section's content live in its
  file under `docs/pages/home/sections/`, not here.
- **`https://exile.marwix.dev` is linked from the Exile takeover only**, never from the nav.
- Booking uses **Cal.com**. The link is in `docs/03-facts.md`.

## 4. Tokens only

`app/globals.css` is the only source of colour, font, spacing and radius. `lib/tokens.ts` mirrors
the colour values for places CSS variables can't reach (OG image generation) and nothing else.
**No raw hex, `rgb()`, `hsl()` or Tailwind palette classes anywhere else.** A hook enforces this.
A new token needs the user's yes and a line in `docs/01-design-system.md`.

## 5. Look and motion

- **Reference design:** `temp/claude-design/Portfolio Redesign v3.dc.html` (local, gitignored). It
  sets layout and behaviour only. Its wording, colours and projects are samples: colours and type
  come from `docs/01-design-system.md`, words from `content/`, claims from `docs/03-facts.md`.
- **Dark only** in v1. Every image is referenced through one place that can later return a dark
  and a light version.
- **Static first, motion second.** The page is built and checked with no motion. Then a GSAP pass
  adds it. Static markup is built so the motion pass adds animation without restructuring.
- **GSAP is the only motion library** (with its plugins and `@gsap/react`). No other animation
  library, no scroll hijacking (no smooth-scroll takeover), no full-page scroll-snap on phones.
- **Reduced motion keeps fades, not movement.** Under `prefers-reduced-motion: reduce`, short
  opacity fades stay and anything that moves is off: slides, parallax, mouse drift, auto-advance
  and looping pulses. The one exception is the marquee strip, which keeps looping (it pauses on
  hover). All content is visible and usable without JavaScript and before any animation runs.

## 6. Phone first, up to 4K

Build for a 360px phone first, then scale cleanly through tablet and desktop to 3840px. Nothing
may scroll sideways at any width. Tap targets are at least 44px. Contrast is at least 4.5:1 for
body text.

## 7. Only what's in the facts file

**`docs/03-facts.md` is the allow list.** The site states only what's there, in page text, alt
text, titles, descriptions and sharing previews. Anything else stays off the site, however true
or helpful it seems. In particular:

1. **No money figures of any kind:** no prices, rates or earnings. The site takes no payment.
2. **No numbers except the ones filled in the facts file**, shown exactly as filled.
3. **Offers are stated plainly, in the present tense** ("I build AI agents that…"). No specific
   client, project or result is claimed unless it's in the facts file.
4. **Outcomes, not tech.** The reader isn't technical; no tech-stack lists.
5. **Demo panels are illustrations.** The Agents section's demo panels show what an agent could
   do, not work delivered for anyone. Their sample content (messages, first names, times, week
   numbers) is exempt from the facts file and from item 2, but never names a real client,
   business or result.

A hook blocks money amounts in site files. The rest is on `copywriter` and `code-auditor`.

## 8. Copy

`copywriter` writes the page copy into `content/`, from the facts file, following
`docs/04-voice.md`, before `web-coder` builds the section. `web-coder` and the motion pass never
write or change page text. **The user edits copy whenever they want, and the user's edits are
final.** Never overwrite a line the user changed; `git log -p content/` shows it. A `[FILL: …]`
marker means a fact the user hasn't supplied yet. It's never guessed, and **nothing ships with
one.**

## 9. One purpose per file

Each file does one job. A file that grows a second job gets split.

- **Every UI part is its own file in `components/`.** Before making one, look for an existing
  component; use it, or extend it while it still does one job. Never fork a copy.
- **`app/**/page.tsx` only imports and renders**, and exports its metadata through one shared
  helper that reads `content/`. No other logic lives in a page.
- **Custom React hooks go in `hooks/`, including animation hooks. All other logic goes in `lib/`.**

## 10. Domain and DNS

The `marwix.dev` DNS is managed on Cloudflare, and the domain carries other live services,
including email. **This site may add or change only the records its own hosting needs, for the
apex (`marwix.dev`) and `www`. Never remove or edit any other record.** Default host is Vercel;
changing hosts needs a stated reason and the user's yes.

## 11. Found and counted from day one

- The page has its own title, description and sharing preview (Open Graph).
- `sitemap.xml` and `robots.txt` exist.
- **Visits and Book a call clicks are counted from launch**, with a free tool that preferably
  needs no cookie banner.

## 12. No feature creep

Anything not in this file, the facts file or a page doc is out of v1. A new idea goes to the user
as a question, never into code. "While I'm here" changes are defects.

## 13. Done on 2026-09-30: all eight must pass

1. The page is live on `marwix.dev`.
2. It looks right on a phone and on screens up to 4K.
3. The motion pass is live, and reduced motion follows §5.
4. Book a call books a real test meeting from start to finish.
5. A test email sent to the site's contact address arrives.
6. The sharing preview and a sitemap are in place.
7. Visits and Book a call clicks are being counted.
8. The user has approved the page's text on the live draft.
