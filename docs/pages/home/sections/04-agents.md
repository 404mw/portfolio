# Agents

**Last Updated:** 2026-09-25

**The one question:** What can their agents handle for my business?

See `../page.md` for the site-wide index. Spec: `../ui-spec/04-agents.md`.

## Current State

Agents ships variant A (the tab list) only; `AgentsSection` takes no props and `AgentsStack` is
its no-JS `<noscript>`-style fallback (passed as `AgentsTabs`' `fallback`). Agents pins its title
column (label + tab list) at 120px from the top from `lg` (CSS `sticky`, no JS), using the shared
`splitColumns`/`stickyTitle` helpers in `lib/styles.ts` (see `../page.md`). Because the sticky
column carries `self-start`, the Agents grid stays `lg:items-center`, so its demo panel is centred
where it's shorter than the tab list (1024). Agents pins but barely moves because its left column
is about as tall as the right one.

## Key Files

- `components/home/agents/` — AgentsSection, AgentsTabs, AgentsStack (variant A's no-JS
  fallback), AgentRowText, AgentDemoFrame, AgentDemo, ChatDemo, LeadsDemo, ReportDemo, SyncDemo,
  DemoStatusPill
- `hooks/useRovingTabs.ts` — roving-tabindex keyboard behaviour for variant A's tablist; `select`
  never moves focus, only the keyboard path does
- `lib/agents.ts` — the demo kind per offer (type-tied to `agents.items`), and the row ids a tab
  and its panel share

## Decisions

- 2026-09-24 — Agents: v3's four offers (customer messages, lead follow-up, recurring reports,
  connected tools), each with v3's demo panel. Bookings is not shown.
- 2026-09-24 — Demo panel content is kept as in v3 (sample messages, first names, times, week
  number), allowed by constitution §7 item 5.
- 2026-09-24 — Agents section label numbered like v3 ("01", from copywriter); the four offers are
  rows with a number and a big title; the active row shows its one-line description.
- 2026-09-24 — Agents interaction: two variants get built, and the user picks after seeing both.
  A: rows are an accessible tab list, first active, click or tap switches the panel (GSAP later
  adds the 6s auto-advance and progress line, paused on hover or focus, off under reduced motion).
  B: no switching, each row has its own demo panel. Both are separate components; the loser is
  deleted afterwards.
- 2026-09-24 — Agents demo panels show the finished state statically (full conversation, all
  leads followed up, report sent, all tools in sync). Motion (later): GSAP plays each sequence
  from the start when its panel shows.
- 2026-09-24 — Agents on phone: the list first, then the panel below, as in v3.
- 2026-09-24 — Agents panel header keeps v3's mono "agent running" status and slugs
  (support-agent, lead-agent, report-agent, sync-agent); this is sample content inside the
  illustration, under constitution §7 item 5, and isn't a tech-stack list.
- 2026-09-24 — The Agents demo samples keep v3's vendor names ("instagram DM", "Sheets") under
  constitution §7 item 5.
- 2026-09-24 — `agents.label` is "What my agents handle".
- 2026-09-24 — For the Agents comparison, the page temporarily renders variant A at `#agents` and
  variant B below it at `#agents-b`; the loser and the preview are deleted once the user picks.
- 2026-09-24 — Agents built statically in both layouts on the page for the user to compare: A is
  an accessible vertical tablist with one demo panel and variant B's list as the no-JS fallback;
  B is a static list with a demo per row. Demos show their finished state with `data-demo-order`
  and `data-anim` hooks for the GSAP pass.
- 2026-09-24 — Audit fixes: the demo panel's aspect ratio is a minimum (it grows instead of
  clipping; was clipping at 1024px); agent tabs and panels are named by number and title only; the
  tab hook's select no longer moves focus (only the keyboard does), so the GSAP auto-advance can't
  steal focus; demo kinds are type-tied to `agents.items`.
- 2026-09-24 — The Agents Lead follow-up line is now "I set up agents that follow up on your new
  leads.", replacing "so no new lead goes cold", which promised a result (constitution §7.3).
- 2026-09-24 — Agents ships variant A (the tab list) only; `AgentsStack` stays as its no-JS
  `<noscript>` fallback. The temporary variant-B preview at `#agents-b` is removed;
  `AgentsSection` takes no props.
- 2026-09-25 — Agents pins its left column (label + tab list) at 120px from the top from `lg` (CSS
  sticky, no JS), part of the site-wide split/sticky-title pattern (see `../page.md`). Because the
  sticky column carries `self-start`, the Agents grid stays `lg:items-center`, so its demo panel is
  centred again where it's shorter than the tab list (1024).

## Open Questions

- **Note:** `AgentsStack` ships only as A's no-JS fallback; its markup is also in the page payload
  for JS visitors (audit NIT, accepted for now).
- **Review:** Agents pins but has almost no travel (its left column is about as tall as the right
  one). The user can judge whether that's fine.
