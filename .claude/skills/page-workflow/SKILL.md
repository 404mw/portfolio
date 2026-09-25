---
name: page-workflow
description: Standard end-to-end workflow for building or changing a marwix.dev page or section — investigation, planning, agent routing, doc checks, copy, audit, screen checks, and deploy confirmation.
---

## Standard page workflow

### Phase 1 — Investigate (lead, read-only)

Before planning or delegating anything:

1. Read `docs/00-constitution.md`.
2. Read the page doc index (`docs/pages/<page>/page.md`) and the section files the work
   touches (`sections/NN-<slug>.md`). If there's none, spawn `page-doc-manager` to
   create it, then invoke `page-docs review` (read-only). Resolve any HIGH findings before going
   on.
3. Read the relevant source files. Record exact paths and line numbers for everything that must
   change, and why.
4. Pin the scope: what changes, what must not change, which content slots are touched, and
   whether any facts the page needs are still `[FILL: …]` in `docs/03-facts.md`. Read the page
   doc's Open Questions (tagged per `docs/pages/README.md`): every `Choice:` line this work
   touches gets asked in step 6, before any agent is briefed, and its answer goes into the
   `page-doc-manager` brief so it becomes a Decision.

Go to Phase 2 only once you can write a complete brief without guessing.

### Phase 2 — Plan and ask

5. Classify the tier (see `CLAUDE.md`) and plan which agents run in what order.
6. Use `AskUserQuestion` for anything still ambiguous. One focused question, one
   `(Recommended)` option. Missing facts are asked for here; never let an agent guess them.

### Phase 3 — Delegate

7. **Tier 2–3:** spawn `ui-designer` with the brief below. Read its spec and raise any design
   choice it flagged with the user before any code is written.
8. Spawn `copywriter` (template below). It writes the section's words into `content/<page>.ts`
   before any code. Show the user the hero line and giant-row heading options it reported.
9. **In parallel, in one message:**
   - Spawn `web-coder` with a pre-digested brief (template below), including the verbatim tokens
     line from `CLAUDE.md` and a `## Sizes` table. It builds the section against copywriter's
     keys. If it reports a missing key, brief `copywriter`, never `web-coder`.
   - Spawn `page-doc-manager` (decision, template below) to record the decision line, sections,
     key files and open questions from the brief. It must not touch Current State or Status:
     the code isn't there yet.
10. **After `web-coder` reports:** spawn `page-doc-manager` (current state) to write Current State
    and Status from the real code, using the `Decision to record` line web-coder returned. When a
    round has several web-coder passes, do this once at the end of the round.
11. **Audit only on request or before a push.** Don't spawn `code-auditor` as a routine step.
    Run it when the user asks, and once before any `git push`, on every file changed since the
    last push (including `content/`). Fix every HIGH finding before pushing (copy findings to
    `copywriter`, code findings to `web-coder`).

**Parallel limits:** `copywriter` always finishes before `web-coder` starts. Two `web-coder`s may
run at once only on files that don't overlap, or each in its own worktree (`isolation:
"worktree"`).
12. Run the checks yourself (see **Checks** below): `build`, `lint`, `screens`. Send code
    failures to `web-coder` and overflowing words to `copywriter`, then run them again.
13. Before a production deploy, check every `docs/pages/*/page.md` and `sections/*.md` for Open Questions. If any
    list isn't empty, show the user what's left and don't deploy to production. Otherwise confirm
    with the user, then spawn `deployer`.

**Skip steps 7 and 12 for small, low-risk changes**, such as a spacing tweak, a link swap, or
a one-line copy fix with no new claim. For these, read the diff yourself. When unsure, run them.

**The user's copy edits:** the user may edit `content/` directly at any time. Those edits are
final. After one, run the `screens` check yourself for overflow with the new words, and update the page
doc via `page-doc-manager`. No agent rewrites the user's lines.

## Checks (the lead runs these)

- **build:** `npm run build` passes.
- **lint:** `npm run lint` passes.
- **screens:** render each touched route (or all five) at 360, 768, 1440 and 3840px wide, e.g.
  `npx playwright screenshot --viewport-size=<w>,900 <url> <file>` against the built site, and
  look at each shot. At every width: nothing scrolls sideways, no text overflows its box, tap
  targets are at least 44px.

---

## Brief templates

**ui-designer:**
```
Page / section: <page> → <section>
The one question this section answers: <from the page doc>
Spec output path: docs/pages/<page>/ui-spec/NN-<slug>.md (shared rules: ui-spec.md)
Constraints: <anything from the constitution or page doc that applies>
```

**copywriter:**
```
Page doc: docs/pages/<page>/page.md + sections/NN-<slug>.md
UI spec: docs/pages/<page>/ui-spec/NN-<slug>.md (or "none")
Slots: <content keys to write or change, each with its one question and length limit>
Facts: <the lines in docs/03-facts.md they draw on, and any still [FILL: …]>
User lines: <lines the user edited, to leave alone>
```

**web-coder:**
```
Page doc: docs/pages/<page>/page.md + sections/NN-<slug>.md
UI spec: docs/pages/<page>/ui-spec/NN-<slug>.md (or "none, tier 1")
Content: content/<page>.ts → <keys this section reads>

Files to change:
  - path/to/file.tsx:L42 — [what's there now] → [what needs to change and why]

<the verbatim tokens line from CLAUDE.md>

## Sizes
| Element | Phone (360) | Tablet | Desktop | 4K |
|---|---|---|---|---|

Scope: <what to build, which components to reuse or extend, and what NOT to touch>
```

**page-doc-manager (create):**
```
Doc path: docs/pages/<page>/page.md (+ sections/NN-<slug>.md for section work)
Task: create
Intent: <what this page does; the basis for Current State and the first decision line>
```

**page-doc-manager (decision, alongside web-coder):**
```
Doc path: docs/pages/<page>/page.md (+ sections/NN-<slug>.md for section work)
Task: update — decision only
Decision to record: <one line: what is being built and why>
Also: <sections, key files, open questions from the brief>
Don't touch: Current State, Status (web-coder is still building)
```

**page-doc-manager (current state, after web-coder):**
```
Doc path: docs/pages/<page>/page.md (+ sections/NN-<slug>.md for section work)
Task: update — current state
From web-coder: <its Decision to record line(s) for the round>
Verify against: <the files web-coder changed>
```

**code-auditor:**
```
Files to audit: <explicit list>
Context: <one sentence on what was built>
```

**deployer:**
```
Mode: first-time | release
Confirm: the user approved this deploy in this session
DNS snapshot: <release after a first-time run: the snapshot from that run's report>
Notes: <anything unusual>
```
