# Page docs

The site is one page. There is a single page doc set: `home/`, covering the nav, every section and
the footer. It's split so agents load only what they need:

- `page.md`: the index — title, status, the one question, the Sections table (linking each row to
  its section file), and everything **site-wide**: overall Current State, site-wide Key Files,
  site-wide Decisions, and an Open Questions roll-up. Only `page-doc-manager` writes it.
- `sections/NN-<slug>.md`: one file per section (e.g. `sections/02-hero.md`), holding that
  section's Current State, Key Files, Decisions and Open Questions. Only `page-doc-manager` writes
  these too.
- `ui-spec.md`: the ui-designer's spec index, at `docs/pages/home/ui-spec.md` — shared rules (§0),
  the motion hooks summary (§10), tokens and choices. Only ui-designer writes it.
- `ui-spec/NN-<slug>.md`: one file per section (e.g. `ui-spec/02-hero.md`), using the same slugs as
  `sections/`, holding that section's spec. Only ui-designer writes these too.

No code is written for the page until `docs/pages/home/page.md` and its section files exist.

**Agents working on one section read both indexes (`page.md` and `ui-spec.md`) plus that
section's page-doc file (`sections/NN-<slug>.md`) and spec file (`ui-spec/NN-<slug>.md`) only** —
never the whole doc set.

## page.md (index) template

```markdown
# Home

**Last Updated:** YYYY-MM-DD

> **Status:** Skeleton | In build | Facts pending | Approved | Live

**The one question:** <from docs/00-constitution.md §2>

Section detail lives in `sections/`; agents working on one section read this index plus that
section's file only.

## Sections

| # | Section | The one question it answers | Facts source | Status | Doc |
|---|---|---|---|---|---|
| 1 | ... | ... | `docs/03-facts.md` → ... | Decided | `sections/01-....md` |

## Current State (site-wide)

What's true of the whole page today (overall build state, site-wide styling). No plans here.

## Key Files (site-wide)

- `app/page.tsx` — ...
- `content/home.ts` — ...

## Decisions (site-wide)

Only decisions still in force, one line each, dated. A new decision that contradicts or replaces
an older one deletes the older line; git keeps the history.

- YYYY-MM-DD — <what was decided> — <why>

## Open Questions (site-wide)

- **Fact:** waiting on `docs/03-facts.md` → <field names, e.g. Name, Book a call>
- **Choice:** <a decision the user makes, e.g. which sections this page has>
- **To build:** <something the build itself settles, e.g. an anchor with no target yet>
- **Roll-up:** <one line naming which section files still have open questions>. The pre-deploy
  check reads this roll-up and every section file.
```

## sections/NN-\<slug\>.md template

```markdown
# <Section>

**Last Updated:** YYYY-MM-DD

**The one question:** <this section's one question>

See `../page.md` for the site-wide index. Spec: `../ui-spec/NN-<slug>.md`.

## Current State

What exists in code today for this section, in plain sentences. No plans here.

## Key Files

- `components/home/<section>/...` — ...

## Decisions

Only decisions still in force, one line each, newest first, dated. A new decision that
contradicts or replaces an older one deletes the older line; git keeps the history.

- YYYY-MM-DD — <what was decided> — <why>

## Open Questions

- **Fact:** ...
- **Choice:** ...
- **To build:** ...

(Use "None." if there are no open questions for this section.)
```

## Open Questions: how they're answered

Each section's open questions live in that section's file. The index (`page.md`) keeps only
site-wide open questions plus a one-line roll-up naming which section files still have open
questions.

1. Each open question is one line with one of three tags:
   - **Fact:** a value the user fills in `docs/03-facts.md`. List only the field names; never
     copy the value or the `[FILL]` text, so the line can't go stale.
   - **Choice:** a decision for the user. The lead asks it with `AskUserQuestion` in
     page-workflow Phase 1, before any agent is briefed.
   - **To build:** settled by the build itself, with no user input.
2. When a question is answered, `page-doc-manager` deletes its line in the same update, in the
   section file it lives in (or the index, for a site-wide question). A Choice becomes a line
   under that file's Decisions. A To-build item becomes Current State once it's built. A Fact is
   removed from the `Fact:` line once `docs/03-facts.md` has the value, and the `Fact:` line goes
   when nothing is left. When a section's last open question is answered, `page-doc-manager`
   updates the index's roll-up line to drop that section, and once every section file is clear,
   removes the roll-up line entirely.
3. On every update, `page-doc-manager` re-checks every `Fact:` line against `docs/03-facts.md`
   and removes any field that's now filled.
4. The page ships with no open questions: the deploy check reads the index's roll-up and every
   section file, and every list must be empty before a production deploy.
</content>
