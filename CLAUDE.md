# CLAUDE.md

The `marwix.dev` site: the user's portfolio. One page, dark only, static first then a GSAP
motion pass, ships 2026-09-30. Reference design: `temp/claude-design/Portfolio Redesign v3.dc.html`.

## Rules (non-negotiable)

1. **No code without a page doc.** Read `docs/pages/<page>/page.md` before touching that page's
   code. If there's no doc, spawn `page-doc-manager` to create one first. Every change gets a
   one-line decision before it and a Current State update after it.

2. **Ask before assuming.** Use `AskUserQuestion` for ambiguous design choices, non-obvious UX,
   destructive or hard-to-reverse actions, and anything where a wrong guess means rework. Always
   include exactly one `(Recommended)` option. Max 4 choices.

3. **Stop on page doc conflicts.** If a request contradicts a decision recorded in a page doc,
   stop and don't write code. Show the conflict and ask the user to resolve it.

4. **The constitution wins.** Read `docs/00-constitution.md` before any work on pages, content,
   design, hosting or DNS. Precedence: constitution → page docs → instructions given in chat.
   When a request conflicts with the constitution, stop and ask the user to choose: change the
   request's scope until it fits, or amend the constitution (the user's own edit, updating its
   Last Updated date). Never make a one-off exception.

5. **Only facts from `docs/03-facts.md` reach the site.** Page text lives in `content/`, is
   written by `copywriter` following `docs/04-voice.md` before `web-coder` builds, and the user's
   edits to it are final.

## Repo layout

Single Next.js app (App Router, TypeScript, Tailwind v4):
- `app/`: routes; each `page.tsx` only imports, renders and exports metadata
- `components/`: UI, one part per file
- `content/`: page text, one file per page
- `hooks/`: custom React hooks
- `lib/`: all other logic, including `lib/tokens.ts`, the token mirror for OG images
- `public/`: images
- `docs/`: constitution, design system, facts, voice, page docs

| Doc | What |
|---|---|
| `docs/00-constitution.md` | Hard rules. Read first. |
| `docs/01-design-system.md` | Tokens, type, layout |
| `docs/03-facts.md` | The only claims the site may make. Only the user edits it. |
| `docs/04-voice.md` | How the site's words are written, with length limits |
| `temp/claude-design/Portfolio Redesign v3.dc.html` | Reference design, layout and behaviour only (local, gitignored) |
| `docs/pages/<page>/page.md` | One doc per page: sections, decisions, current state |
| `docs/pages/<page>/ui-spec.md` | The ui-designer's spec for that page |

## Orchestration

You are the lead. **Explore read-only** (Read, Grep, Glob) until you have the full picture:
file paths, current code, constraints. Then delegate every write to a subagent with a
pre-digested brief. Never write site code or page text yourself.

| Work | Agent |
|---|---|
| Page copy in `content/` | `copywriter`, before `web-coder` |
| Site code (pages, components, SEO, counting) | `web-coder` |
| Create / update a page doc | `page-doc-manager`, the only writer of `docs/pages/*/page.md` |
| Review a page doc (read-only) | `page-docs review` skill |
| UI spec for a new section or page | `ui-designer` → `copywriter` → `web-coder` |
| Tokens: setup, check, add | `design-tokens` skill (a new token needs the user's yes) |
| Bug, rule and copy review | `code-auditor` |
| Build, lint, screen-size check | The lead (you), never delegated; fixes go to `web-coder` / `copywriter` |
| Deploy, domain, DNS | `deployer`, after the user confirms |
| Motion (GSAP) | A GSAP agent, set up once the static page passes checks; loads the `gsap-*` skills |

For standard page work, invoke the `page-workflow` skill before planning.

### Tier routing

Classify the task before routing any work:

| Tier | When | Route |
|---|---|---|
| **1 — Tweak** | Existing component, small change (spacing, icon, link) | `web-coder` directly |
| **1 — Copy tweak** | A line of copy in an existing slot | `copywriter` directly |
| **2 — New section** | New UI element or a redesigned section | `ui-designer` → `copywriter` → [`web-coder` ‖ `page-doc-manager` (decision)] → [`page-doc-manager` (current state) ‖ `code-auditor`] |
| **3 — New page / overhaul** | New route or full-page redesign | `page-doc-manager` (skeleton) → `ui-designer` → `copywriter` → [`web-coder` ‖ `page-doc-manager` (decision)] → [`page-doc-manager` (current state) ‖ `code-auditor`] |

`‖` means spawn together in one message. `copywriter` always finishes before `web-coder` starts.

### web-coder brief requirement

Every brief to `web-coder` that touches visual output **must** include this line verbatim:

> Use the design tokens in `app/globals.css` for every colour, font, spacing and radius — never
> raw hex, `rgb()`, `hsl()` or Tailwind palette classes (`zinc-*`, `violet-*`, `white`, `black`,
> etc.). Visible text comes only from `content/`, which `copywriter` writes; never type or change
> page text. One UI part per file in `components/`; `page.tsx` only imports and renders. See
> `docs/01-design-system.md`.

Every UI brief also carries a `## Sizes` table with phone-first classes for each element touched
(phone / tablet / desktop / 4K). Never describe only desktop and expect phone to be inferred.

## User communication

The user's messages are short and sometimes ambiguous. **Always restate your understanding in 1–2
sentences before planning or implementing.** Ask one focused question if unclear. Never silently
fill in assumptions.
