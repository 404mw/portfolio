---
name: page-docs
description: Create, update, review, or audit page docs in docs/pages/ — the single entry point for the page-doc lifecycle (new doc for a page, doc update after a code or copy change, read-only accuracy/constitution review, or a coverage scan for undocumented pages and sections).
argument-hint: "[create|update|review|audit] <page>"
---

Work the page-doc request: $ARGUMENTS

---

## Step 1 — Determine the action

The first word of `$ARGUMENTS` is normally the action: `create`, `update`, `review` or `audit`.
If it isn't, infer it:

| Phrasing looks like | Action |
|---|---|
| "new doc for...", "no doc yet" | create |
| "doc is stale", "add a decision", "sync after..." | update |
| "check accuracy", "does the doc match the code" | review |
| "what's missing docs", "coverage" | audit |

If it's still ambiguous, use `AskUserQuestion` with exactly one `(Recommended)` option. Default to
`update` over `create` when a doc might already exist; a duplicate is worse than a wasted lookup.

## Step 2 — Do the action

**create**
1. Copy the template from `docs/pages/README.md` into `docs/pages/<page>/page.md`.
2. Fill in "The one question" from `docs/00-constitution.md` §2, word for word.
3. List the sections from the constitution's order (home) or the brief. Each section gets its one
   question and a `content/<page>.ts` key.
4. Current State: what exists in code now. If nothing exists, say "Not built yet."
5. First line under Decisions: today's date, why the page exists.
6. Status: `Skeleton`.

**update**
0. Section-level changes go in `docs/pages/<page>/sections/NN-<slug>.md`; site-wide ones in
   `page.md`. Keep the index's Open Questions roll-up in sync (see `docs/pages/README.md`).
1. Read every file in Key Files and re-verify Current State against the code; fix any drift.
2. Add the brief's `Decision to record:` as one line under Decisions. **Delete every older line
   it contradicts or replaces**, and fix any Current State or Sections text it made wrong.
3. Update Status: `In build`, `Facts pending` (any `[FILL:` left), `Approved` (the user approved
   the text on the live draft), or `Live`.
4. Open Questions: delete every line this update answers, and remove any field on the `Fact:` line
   that `docs/03-facts.md` now fills (rules in `docs/pages/README.md`).

**review** (read-only, never writes)
Report as HIGH / MEDIUM / LOW:
- Current State claims that the code contradicts.
- Key Files paths that don't exist.
- Sections that answer more than one question, or that contradict the constitution's order.
- Any claim recorded as a plan that isn't in `docs/03-facts.md`.
- Decisions that contradict each other, or a decision longer than one line.
- Open Questions that are already answered (a Decision, the code, or `docs/03-facts.md` settles
  them), or that have no `Fact:` / `Choice:` / `To build:` tag.

**audit** (read-only, never writes)
List every route in `app/` and every section component, then flag any without a page doc or
without a row in its page's Sections table.

## Rules for every action

- Never invent behaviour. Read the actual files first.
- Every `AskUserQuestion` has exactly one `(Recommended)` option and 2–4 choices.
- `review` and `audit` never write or edit files.
