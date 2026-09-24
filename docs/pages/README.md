# Page docs

The site is one page. There is a single page doc: `home/`, covering the nav, every section and
the footer. It holds:

- `page.md`: the page doc. Only `page-doc-manager` writes it.
- `ui-spec.md`: the ui-designer's spec, at `docs/pages/home/ui-spec.md`, once ui-designer writes
  it.

No code is written for the page until `docs/pages/home/page.md` exists.

## page.md template

```markdown
# Home

**Last Updated:** YYYY-MM-DD

> **Status:** Skeleton | In build | Facts pending | Approved | Live

**The one question:** <from docs/00-constitution.md §2>

## Sections

| # | Section | The one question it answers | Facts source | Status |
|---|---|---|---|---|
| 1 | ... | ... | `docs/03-facts.md` → ... | Decided | Open |

## Current State

What exists in code today, in plain sentences. No plans here.

## Key Files

- `app/page.tsx` — ...
- `content/home.ts` — ...

## Decisions

Only decisions still in force, one line each, newest first, dated. A new decision that
contradicts or replaces an older one deletes the older line; git keeps the history.

- YYYY-MM-DD — <what was decided> — <why>

## Open Questions

- **Fact:** waiting on `docs/03-facts.md` → <field names, e.g. Name, Book a call>
- **Choice:** <a decision the user makes, e.g. which sections this page has>
- **To build:** <something the build itself settles, e.g. an anchor with no target yet>
```

## Open Questions: how they're answered

1. Each open question is one line with one of three tags:
   - **Fact:** a value the user fills in `docs/03-facts.md`. List only the field names; never
     copy the value or the `[FILL]` text, so the line can't go stale.
   - **Choice:** a decision for the user. The lead asks it with `AskUserQuestion` in
     page-workflow Phase 1, before any agent is briefed.
   - **To build:** settled by the build itself, with no user input.
2. When a question is answered, `page-doc-manager` deletes its line in the same update. A Choice
   becomes a line under Decisions. A To-build item becomes Current State once it's built. A Fact
   is removed from the `Fact:` line once `docs/03-facts.md` has the value, and the `Fact:` line
   goes when nothing is left.
3. On every update, `page-doc-manager` re-checks every `Fact:` line against `docs/03-facts.md`
   and removes any field that's now filled.
4. The page ships with no open questions: the list must be empty before a production deploy.
</content>
