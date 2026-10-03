# Rix: UI spec

**Last Updated:** 2026-10-02
**Sources:** `docs/pages/rix/page.md` and `sections/*.md`, constitution §2 (amended 2026-10-02),
§3–§6, §9, `docs/01-design-system.md`, `app/globals.css`, `docs/pages/home/ui-spec/00-rix.md` (rev 3:
R1, R4, R8.1, R10), `docs/pages/home/ui-spec.md` §0, `docs/04-voice.md`.
**Scope:** the static, final-state `/rix` page. Rix and every move he makes are defined once in
`00-rix.md`; this spec only places him, sizes him and lays out his controls. It never states page
text; it names slots in `content/rix.ts`.
**Layout:** this file is the index: shared rules (§0), the motion summary (§10), tokens and choices.
Each section's spec is its own file under `ui-spec/`; load this file plus the one section.

## Sections

| § | Section | The one question | UI spec | Page doc |
|---|---|---|---|---|
| 1 | Intro | What is this page? | [`ui-spec/01-intro.md`](ui-spec/01-intro.md) | [`sections/01-intro.md`](sections/01-intro.md) |
| 2 | Playground | How do I make Rix act? | [`ui-spec/02-playground.md`](ui-spec/02-playground.md) | [`sections/02-playground.md`](sections/02-playground.md) |
| 3 | Way back | Where do I go from here? | [`ui-spec/03-way-back.md`](ui-spec/03-way-back.md) | [`sections/03-way-back.md`](sections/03-way-back.md) |

---

## 0. Shared rules and parts

### 0.1 Page frame

- `app/layout.tsx` is unchanged: `SkipLink`, `SiteHeader` (fixed, 67px), `main#main`, `SiteFooter`.
  `app/rix/page.tsx` only imports and renders `<RixIntro />`, `<RixPlayground />`, `<RixWayBack />`,
  and exports `pageMetadata({ ...meta, path: "/rix" })` with `meta` from `content/rix.ts` (indexed:
  no `noindex`).
- **Section frame:** `<section class="px-gutter">` → `<div class="{container} …">`, with the home
  tokens (`px-gutter`, `py-section`, `--container-site` 1536px). Intro and Playground read as one
  block with no hairline between them. Only Way back opens with `border-t border-line`.
- **Ids** (`lib/rixPlayground.ts`, this page's ids; `lib/routes.ts` stays home's): the intro is
  `sectionIds.top` (`top`, see the nav note below), the playground is `rix-playground` (the motion
  root and the quip and status key; it was `rix-sheet`), and the way back is `rix-way-back`.
- **Nav solid state (approved 2026-10-02):** `NavBar` turns solid once `#top` passes under the
  header. The intro carries `id="top"`, so the nav band goes solid as it does on home. Without it,
  the nav would stay transparent over the buttons scrolling under it.
- **Nav links (approved 2026-10-02 as part of this build; home §1.5 notes it):** `lib/navItems.ts`
  hrefs were `#agents`, `#web`, `#projects` and `#contact`, which point at nothing on `/rix`. They
  become `/#agents` and so on (built as `/${routes.x}`). On `/` they still jump in place. Book a
  call and the skip link don't change.
- **Footer entry:** the only way in is a footer link. Its label is `content/shared.ts →
  footer.rixLink` (3 words, playful, no claims). Its place in the row belongs to home §9.
- **Sitemap:** `lib/publishedRoutes.ts` gains `/rix`.
- **No sideways scroll:** Rix, his quip and every bit of paint stay inside the shelf at every width
  from 360 to 3840 (§2 sizes). `body` keeps `overflow-x: clip` as a guard only.

### 0.2 Shared parts used (`lib/styles.ts` names; nothing new)

`container`, `focusRing`, `focusRingCard` (Rix), `chip`, `monoLabel`, `metaLabel`, `pillPrimary`,
`pillOutline`. Components: `SectionHeading` (extended with `as`), `BookCallLink` (`hero`),
`AboutPosterShelf` (extended), `Rix` / `RixButton` / `RixQuip` (extended with `quipText`), and
`RixStatus` as built.

### 0.3 File plan (from `/dev`; one UI part per file)

| Was | Becomes |
|---|---|
| `components/dev/DevRixSheet.tsx` | `components/rix/RixPlayground.tsx` (server, §2 section) |
| `components/dev/DevRixStage.tsx` | `components/rix/RixStage.tsx` (server: the shelf and big Rix; **slots dropped**) |
| `components/dev/DevRixControls.tsx` | `components/rix/RixControls.tsx` (client: owns the hook; lays out the stage band, toggle, note, groups) + `components/rix/RixReadout.tsx` (the "now playing" line) + `components/rix/RixGroup.tsx` (one button group) |
| `components/dev/DevRixButton.tsx` | `components/rix/RixPlayButton.tsx` (`RixButton` is taken by the mascot) |
| `components/dev/DevLabel.tsx` | not carried: replaced by `components/rix/RixIntro.tsx` (server, §1). Deleted with `/dev` |
| (new) | `components/rix/RixWayBack.tsx` (server, §3) |
| `hooks/useRixSheet.ts` | `hooks/useRixPlayground.ts` (no reduced-motion preview; the OS setting applies) |
| `lib/rixSheet.ts` | `lib/rixPlayground.ts` (groups, commands, labels, ids, and each command's `reduced` flag, §2.4) |
| `lib/rixSheetMoves.ts` | `lib/rixPlaygroundMoves.ts` (no nudge; walks to the track ends and centre; no `throwAway`) |
| `content/dev.ts → rixSheet` | `content/rix.ts` (`meta`, `intro`, `playground`, `wayBack`) |
| (new) | `app/rix/page.tsx`, `app/rix/opengraph-image.tsx` |

- **Extended:**
  - `SectionHeading`: `as` (`h1` or `h2`, default `h2`).
  - `AboutPosterShelf`: optional `size`, `quipPlacement` and `quipText`, with B's defaults.
  - `Rix`, `RixButton` and `RixQuip`: `quipText` (default `text-nav`) passed through to the quip's
    inner span.
  - `lib/rixFeatures.ts` and `lib/rixFull.ts`: the host `sheet` is renamed `playground`.
  - `lib/publishedRoutes.ts` and `lib/navItems.ts` (§0.1).
- **Retired:** `app/dev/` and all of `components/dev/`, `content/dev.ts`, and the `/dev` note in
  `00-rix.md` R10 and R11 (their owner points them here).

### 0.4 Rix on `/rix`: what runs

- **On:**
  - life (breath, blinks, looks), with the eyes following a fine pointer (`rixEyes`, as built)
  - the perk on hover
  - the real poke ladder (R6A.1: count, window, gates and queue, through the tantrum, flee, sulk
    and forgive)
  - the real pet detection and love (R6B)
- **Off:** the play clock, the nap timer, tag and nudges (`schedulers: false`), and the arrival on
  load. He stands at `x` 0 at first paint; the Replay arrival button plays it.
- **Patrol:** off by default. The toggle runs the real R4.8 patrol with plays still off. Turning it
  off brakes a running stretch. (The user's recommendation; agreed.)
- **Buttons:** each cuts the current move and plays its own, ignoring priority and budgets (R10).
- **Props** are About's emblems (`RixProps`). `/rix` has no radios, so a tossed prop has no
  deselect. `about.rix.throwAway` ("you can pick again") is never announced here: the angry line
  is announced in its place.
- **Lines** come from `content/home.ts → about.rix` (one Rix voice). That covers the poke,
  annoyed, angry, sulk, forgive and pet lines and `buttonLabel`. `nudgeLines` ask for an About
  pick, so nudges aren't on `/rix`.

### 0.5 Sharing image (`app/rix/opengraph-image.tsx`, built like `app/opengraph-image.tsx`)

- **Format:** 1200×630 PNG, `ImageResponse`. Colours come from `lib/tokens.ts`, the font is the
  Geist Mono 800 file already in `assets/fonts`, and `alt` is `meta.ogAlt`.
- **Background:** `colors.bg`. Floor line: 2px `colors.line`, x 80–1120, at y 500.
- **Rix:** the host bot's idle pose, drawn from the same geometry `ProcessBot` uses
  (`lib/processBots.ts`; never copied). The box is 510×330 (1 unit = 3px), its right edge at x 1120
  and its feet on the floor line. Body, arms and feet are `colors.accent`; the eye holes are
  `colors.bg`; he's at the rest look, so his silhouette is the logo. One glyph: `hearts` part 1
  (`lib/rixGlyphs.ts`), `colors.accent`.
- **Left column** (x 80–560, top to bottom):
  - at y 80, the wordmark (`footer.wordmark`) at 36px, `colors.text` with W in `colors.accent`
  - at y 200, `intro.heading.lead` (`colors.text`) and `intro.heading.accent` (`colors.accent`) at
    72px, line height 1.0, at most 2 lines (the 20-character limit, §1)
  - at y 540, `marwix.dev/rix` (from `siteUrl` and the path) at 28px, `colors.muted` (6.9:1)
- Nothing touches the edges: there's 80px clear on every side except the floor line's ends.

### 0.6 Page content (`content/rix.ts → meta`; copywriter; no claims)

| Key | Meaning | Limit |
|---|---|---|
| `meta.title` | Browser tab and search title: Rix's playground on MARWIX | 60 characters |
| `meta.description` | Search and sharing line: press buttons to make Rix, the MW mascot, act; poke or pet him | 155 characters |
| `meta.ogAlt` | What the sharing image shows: Rix, the violet MW mark, on a line beside the title | 125 characters |

---

## 10. Motion hooks, summary

- **Static first:** every element's static state is its final state, and Rix stands at `x` 0
  (R4.1). The hooks are as R1.3; the motion root is `section#rix-playground`.
- **Intro and Way back:** `data-anim="reveal"` (the generic reveal, home §10). The intro plays on
  load because it's in view.
- **The playground:** runs through `hooks/useRixPlayground.ts`, with `gsap.matchMedia()` full and
  reduced branches, as the sheet does. It sets up only once the `about-rix` button has hydrated.
  It pauses off screen and in a hidden tab (crew), and teardown restores the server markup exactly.
- **Reduced motion (constitution §5):** each button plays its R8.1 version, and buttons with no
  R8.1 version are hidden by CSS (§2.4). There's no patrol and no in-page preview toggle.
- **No JS:** Rix is a static span. The buttons render `disabled` until hydration, with a
  `<noscript>` line (§2).

## Tokens

None new. Every colour, size and spacing above is an existing token or a Tailwind spacing step.

## Choices

**Resolved by the user, 2026-10-02** (all as recommended):

1. **Reduced motion:** a button with no R8.1 version is hidden: all emotions, plays and glyphs, the
   walks, perk, wave and arrival, and the patrol toggle. One `reducedNote` line shows instead. No
   rule change. (The rejected option: instant emotion and glyph swaps, which would amend R8.1.)
2. **The stage:** the floor line only. (Rejected: emblems standing on the floor as props, or
   keeping the dashed slots.)
3. **Walk buttons:** they walk the whole way to the left end, the centre and the right end.
   (Rejected: R10's 200px reach, partway.)
4. **Way back:** a short visible `SectionHeading` and the two pills. (Rejected: the pills alone.)
5. **Rix at 4K:** he stays 340×220 from `lg`. (Rejected: a `2xl` step to 408×264.)

**Approved 2026-10-02, as part of this build:** the nav hrefs become `/#…` (§0.1, home §1.5), and
the intro gets `id="top"`.

**For the lead:**
- The quip sits above Rix, left-aligned, at every width (§2). At 360 the side placement can't fit
  beside a 204px Rix.
- The stage band is sticky only on viewports at least 40rem tall.
