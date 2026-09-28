# Proofs

**Last Updated:** 2026-09-28 (MARWIX-SKILLS hidden temporarily)

**The one question:** Have they built something real that people use?

See `../page.md` for the site-wide index. Spec: `../ui-spec/07-proofs.md`.

## Current State

The section is renamed Proofs → Projects in every visible word: the nav link, the section label
(`proofs.label` = "Projects"), the hero's "See projects" button and the takeover top bar ("PROJECT
0n / 03"); the page anchor is `#projects` (`lib/routes.ts` `sectionIds.proofs = "projects"`). Code,
file and content key names stay `proofs`.

Proofs is reverted to its original layout: label, heading and hint sit above the cards (no split,
nothing pinned), and the cards run in one grid, stacked on phone; it's the one section after the
hero without a pinned title. `ProofCard`'s image `sizes` hint is back to the original
`(min-width:1536px) 500px, (min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw`.

**MARWIX-SKILLS is temporarily hidden** (2026-09-28), card and takeover, behind one flag —
`hiddenProofs` in `lib/proofs.ts`. Every consumer (cards, takeovers, numbers, the "0n" total, the
Next wrap, takeover ids) reads the shown list (`shownProofKeys`), not `proofKeys`; `proofKeys`
still lists all three, and MARWIX-SKILLS' content and code stay in place, unused. `#marwix-skills`
opens nothing while hidden; its route, section id and image entries stay, unused. Un-hide by
setting `hiddenProofs` back to `[]`. With two projects shown (Exile, Design Vault), the grid is two
across from `md` up at full width, no empty third slot (`proofGridColumns`); it only goes to three
across at `lg` when three or more are shown.

Proofs built: identical `ProofCard`s and one native `<dialog>` takeover per shown project (two of
the three built today; MARWIX-SKILLS hidden, see above), driven by the hash (`:target` without JS,
`showModal` with JS). Every open takeover has a page entry beneath it (a direct load rewrites its
entry to `#projects` and pushes the project), so Back, Esc and Close all use `history.back()`; hash
parsing never decodes, so a malformed URL can't crash the page. The takeover top bar is solid
`bg-cream` with an `ink/15` hairline (the blurred 85% bar failed contrast).

The GSAP motion pass is built. `ProofsMotion` mounts the generic reveal on the heading row and
`useProofCards` on the cards: they reveal 0.12s apart via the shared `lib/revealBatch.ts`, and a
hovered card lifts 8px on a fine pointer. `useHashTakeover` takes an optional `transitions` arg
(`hooks/useHashTakeover.ts`): `opened` runs right after `showModal()`, `replacing(dialog, previous,
done)` plays the Next handover while the old dialog stays open beneath the new modal, `closing`
plays the exit once the hash has left a takeover and calls `done` to close it; `onClose` ignores a
dialog the hash has already reopened. Every takeover opens at its top: `useHashTakeover` resets a
dialog's `scrollTop` right after `showModal()` and again just before every close, while it's still
displayed, so a takeover opened right after one scrolled to the bottom (from a card, Next,
Back/Forward or a direct load) always opens at its top. `TakeoverController` wires
`useTakeoverMotion` (the transitions) into `useHashTakeover`.

Behaviour: opening clips the dialog from the card's on-screen rect to full screen (0.75s,
`lib/takeoverClip.ts`), with content rising 40px starting 0.35s in; a card that's off screen (or
absent) gets a plain fade instead. Next (full motion): the old takeover stays open (inert) under
the new modal, and `useTakeoverMotion`'s `replacing` slides the old one `yPercent` 0 → -100 while
the new dialog stays in place with a transparent background and its `takeover-content` (the cream
background) slides up by the dialog's height (`y: H → 0`), so both move the same amount and
nothing gaps or shifts sideways (0.85s, `power3.inOut`, transforms only); the old one then closes
at its top. Title morph (`lib/takeoverTitleMorph.ts`): the old Next link's title
(`data-anim="takeover-next-title"`) hides and the new heading (`data-anim="takeover-title"`) starts
exactly over its on-screen spot and size, then grows and travels to its resting place on the same
ease and duration; if the two wrap to different line counts they crossfade (0.15s) instead of
swapping; with the old Next title off screen, no morph — the heading just slides in with its
content. The new sticky top bar (`data-anim="takeover-bar"`) stays at opacity 0 while the title
flies up through it, fading in (0.3s) once its glyphs are measured clear below the bar
(`barClearProgress`), about 0.53–0.65s in depending on layout, which can push the slide's visible
end up to ~0.1s past 0.85s in typical layouts. A new hash arriving mid-slide settles it at once
(one `settle()` in `useHashTakeover`), and focus is kept in the new dialog. `ProjectTakeover`'s
dialog carries `data-sliding:backdrop:bg-transparent`; JS sets `data-sliding` on the incoming
dialog only while it slides, so the default modal backdrop doesn't dim the old project mid-slide
(open/close still dim the page). Every inline style the motion sets is cleared at the end, when
cut short (Next, Back, Esc, Close) or on a motion-mode change. Closing clips back to the card
(0.6s) or fades if the card is off screen, the content is `inert` while it closes, and focus
returns to the card once it ends. Double Esc and a new hash arriving mid-close are both guarded
against. Reduced motion: no clip, lift, rise or slide; content only fades; the new project shows at
once at its top and its content fades in (0.4s); the old one closes at once; close is instant.

Opening from a card now morphs its title too (2026-09-27): when the takeover opens in full motion
(`how === "page"`) with its card on screen, the takeover heading (`data-anim="takeover-title"`)
starts exactly over the card's title, which now carries `data-anim="proof-card-title"`
(`ProofCard.tsx`), and grows and travels to rest on the clip's own ease and duration (0.75s,
`power4.inOut`, `transformOrigin 0 0`, `zIndex 1` while it flies). `morphFits`
(`lib/takeoverTitleMorph.ts`) checks at runtime that the heading's text lies inside the card box at
the start and inside the screen at rest; if not, or there's no card title on screen, it falls back
to the whole-content fade above. If the card title and heading wrap to different line counts, the
heading fades in over 0.15s. With a morph, the content no longer fades as a whole: the top bar and
the heading's siblings (info grid, shots, visit link, Next link) rise 40px and fade in instead
(0.7s, 0.35s delay, `ease.follow`). The bar is held at opacity 0 until the title's glyphs are below
it (`barClearProgressOnOpen`, never before 0.35s), then fades in over 0.3s; if the title never
passes under it, the bar rises with the rest. While morphing, the content carries inline
`overflow-x: clip` so the scaled heading's empty box can't cause sideways scroll. Every open tween
is tracked per dialog (`openTweens`) and killed whole in `reset`, since a partial `killTweensOf` on
a delayed multi-target tween doesn't stop it in GSAP 3.15. Reduced motion and direct loads are
unchanged.

Closing a takeover (Close, Esc, Back) while its heading is on screen now runs the reverse morph
(2026-09-28): the heading shrinks back into its card title over 0.6s on `power4.inOut`, the same
ease and time as the clip closing. The top bar and the rest of the content fade out over 0.2s
first. A 0.15s fade-out runs at the end if the heading and the card title wrap to different line
counts. If the dialog is scrolled so the heading is off screen, it closes with the plain clip, no
morph. A close mid-open carries on from where the open had got to, and a reopen mid-close is
clean. Both ends of the morph match the card title's typography: the heading starts (open) and
ends (close) at the card title's optical size (the font's `opsz` axis) and letter spacing, keeping
`wdth 80`. Both are driven from the morph's scale, so they reach the heading's own values at rest.
They are skipped if they would change the heading's line count at rest size. The text boxes line
up within 1px on every edge at 360, 768 and 1440 for all three cards (before: up to 39px off on
MARWIX-SKILLS at 1440). Cause: with `font-optical-sizing: auto`, the large heading renders narrower
than the small card title. Over the last 0.15s of the close the whole dialog fades to 0
(`ease.out`), so the card's image and text dissolve in instead of popping. All takeover tweens are
tracked per dialog and killed whole on reset, and no inline styles are left after open or close.
The Next slide's morph is unchanged: element boxes, no typography change.

Built and verified 2026-09-26: build and lint are green, flow tests all pass at 360/1440 in full
and reduced motion (Next from the bottom, Next twice fast, Back/Esc/Close mid-slide, focus trap,
direct load), and the lead checked the slide frame strips — they show one title throughout —
headless Chromium only.

Verified 2026-09-27 by the lead in headless Chromium at 360 and 1440, for all three cards, full and
reduced motion: the title stays inside the clip every frame, the bar never shows over the title,
the heading is visible from frame one, opens end with no leftover inline styles at the top with
focus inside, Esc mid-open and Next mid-open clean up, the Next-slide suite still passes, and there
are no console errors.

Built 2026-09-28: each card's screenshot is replaced by a CSS "ink stage" banner
(`ProofBanner.tsx`, an ink ground with a violet floor glow and a faint "/" hatch, built only from
existing colour tokens) holding a static, server-rendered 3D SVG bot (`ProofBot.tsx`) — the Process
bot's MW geometry (`lib/processBots.ts`, re-exported by `lib/proofBotBody.ts`), extruded with a
literal 6-step depth table (`lib/proofBotDepth.ts`, 5 steps for props) and a shade table
(`lib/proofBotShades.ts`) that mixes only existing tokens. The bot breaks out past the card's top
and right, clipped at the banner floor by the bot layer's own clip-path; the card itself carries no
`overflow-hidden`. Row headroom (`pt-[11.2%]` on each card's `li`), a 48px column gap (`gap-x-12`
in `ProofsSection.tsx`), a `min()`-capped left offset on the bot's own position, and the section's
`overflow-x-clip` keep every card's break-out clear of the viewport at every width from 360 to 3840.
Each bot holds one prop in its left hand (`ProofBotProp.tsx`, `lib/proofBotProps.ts`): Exile a
generic game phone, Design Vault a colour swatch fan, MARWIX-SKILLS a puzzle piece; every outline is
hardcoded from the spec, nothing computed at render. Eye-wall paths (`ProofBotEye.tsx`), the depth
steps' `color-mix()` strings (`lib/proofBotShades.ts` `proofBotSide`) and the eyes' positions
(`lib/proofBotBody.ts`, reading `lib/processBots.ts`'s `eyesAt`) are all computed at server render;
nothing runs on the client for the still pose. Colours on non-hook elements go through `style`
(`stopColor`, `floodColor`, `fill`); gradient fronts use `fill="url(#proof-bot-…)"`; no `data-bot`
element carries a `style` or `transform` (the lean is a plain wrapper, `proofBotLean`). The body's
two glints sit in `data-bot="body"` after `data-bot="eyes"` and are clipped by a `<g clipPath>`
wrapper to the unrotated strips (`lib/proofBotBody.ts` `strips`), so they don't follow the eyes; the
glint gradient peaks at stop-opacity 0.55. The header row keeps `gap-x-10 gap-y-6` (ui-spec §7.1
calls for `gap-6`; kept wider on purpose, not a drift).

Lead-verified 2026-09-28: `npm run build` and `npm run lint` are green; no sideways scroll at
360/480/600/767/768/1024/1440/3840 (`scrollWidth === clientWidth`, headless Chromium); screens at
360/768/1440/3840 match the approved sample A. Noted, not blocking: the Design Vault proof line
wraps to two lines at 1440 while the other two cards' lines take one, so its hairline sits ~16px
higher than its neighbours'; faint stair lines are visible on the extrusion at large stacked widths
(around 767) from the 6-step depth table.

Lead-verified 2026-09-28, after hiding MARWIX-SKILLS: build and lint stay green; no sideways scroll
at 360/480/600/767/768/1024/1440/3840. With only two, wider cards, the bot scales up (~620px
banner) at 1440/3840: the extrusion's 6-step stair lines are clearly visible, and Exile's right arm
comes within ~11px (1440) / ~3px (3840) of the Design Vault card (open questions below).

## Key Files

- `components/home/proofs/` — ProofsSection (label/heading/hint above the cards, no split, not
  pinned; cards two across from `md`, three from `lg` only when three or more are shown), ProofCard
  (identical across shown projects, no `overflow-hidden` so the bot can break out), ProofBanner (the ink-stage banner and the bot's break-out clip layer),
  ProofBot (the card bot's SVG: viewBox, lean, rig, eyes, glints), ProofBotDefs (the gradients, rim,
  glint and clip-path defs, and the drop-shadow filter, one set per card), ProofBotSolid (one
  extruded shape: depth steps then its lit front), ProofBotEye (one recessed eye's walls and hole),
  ProofBotProp (a card's left-hand prop, built from its pieces), ProofBotShape (one outline as its
  SVG element — polygon, rect, path or circle), ProofLine (the card's proof-line row), ProjectTakeovers
  (the takeover layer, rendered once after Contact), ProjectTakeover (one project's `<dialog>`),
  TakeoverController (runs `useHashTakeover`), TakeoverTopBar, TakeoverCloseLink,
  TakeoverNextLink, TakeoverInfoRows, TakeoverInfoRow, TakeoverStats (Exile's IN USE numbers),
  TakeoverShots, ProjectVisitLink, ProofsMotion (client, mounts the reveal and `useProofCards`,
  renders nothing); `ProofCard`'s h3 carries `data-anim="proof-card-title"`, the card-open morph's
  source
- `lib/proofBotBody.ts` — the card bot's viewBox, static pose (10° lean, look 7), arms, glints and
  eye positions, reading the MW strips/feet/eyes unchanged from `lib/processBots.ts`
- `lib/proofBotProps.ts` — the three hardcoded prop drawings (Exile's phone, Design Vault's fan,
  MARWIX-SKILLS' puzzle piece), each a list of pieces in paint order, plus each prop's `grip` point
  for the later motion pass
- `lib/proofBotShape.ts` — the shared outline/solid/detail types every card-bot file draws from
- `lib/proofBotDepth.ts` — the literal 6-step (body) / 5-step (prop) extrusion offset-and-shade
  table
- `lib/proofBotShades.ts` — every card-bot shade (materials, eye, light, banner ground) as a
  `color-mix()` of existing tokens only, in one table
- `lib/proofs.ts` — the project order/keys (`proofKeys`, all three), the temporary hide flag
  (`hiddenProofs`) and the shown list it derives (`shownProofKeys`), each shown project's dialog id,
  image names, two-digit number and total, next-project wraparound, the grid's column count
  (`proofGridColumns`: two from `md`, three from `lg` only when three or more are shown), card bot
  prop (`proofProp`), the card bot's per-card SVG ids (`proofBotIds`) and `proofCardSelector()` (the
  card that opens a given takeover, used for focus return and the clip's source rect) — every one of
  these reads the shown list, not `proofKeys`
- `hooks/useHashTakeover.ts` — opens/closes the takeover `<dialog>`s from the address hash with
  `showModal()`, resetting each dialog's `scrollTop` right after opening and again just before
  every close so every takeover opens at its top; a direct load on a takeover hash rewrites the
  entry to `#projects` and pushes the project once, so Esc, Close and Back all resolve through
  `history.back()`; hash parsing never decodes; an optional `transitions` arg (`opened`,
  `replacing`, `closing`) lets motion play around the same path, and `onClose` ignores a dialog
  already reopened by a new hash
- `hooks/useProofCards.ts` — the cards' staggered reveal (`lib/revealBatch.ts`) and fine-pointer
  hover lift
- `hooks/useTakeoverMotion.ts` — the takeover's open/Next-slide/close clip and content motion,
  handed to `useHashTakeover` as `transitions`; also owns the close morph (`cardMorphBack`,
  `morphOut`), the typography match on both ends and the close's end fade
- `lib/takeoverTitleMorph.ts` — the Next slide, the card-open and the card-close morphs, as plain
  numbers: `titleMorph` reads the source title's offset/scale onto the new heading and whether the
  two wrap to different line counts (crossfade instead of swap), and, for the card morphs, a
  `TitleType` matching the card title's typography; `barClearProgress` (Next) and
  `barClearProgressOnOpen` (card-open) are the eased progress at which the flying title's glyphs
  clear the new sticky top bar, so it can fade in on cue; `morphFits` and `textFits` (`ScreenBox`)
  check at runtime that the heading's text stays inside the card box and the screen at both ends of
  the open and the close
- `lib/takeoverClip.ts` — the takeover's clip-path box as plain numbers (`cardBox`, `fullBox`,
  `clipPathOf`), plus `sourceCard` (the card that opens a dialog) and `screenBoxOf` (a clip box's
  on-screen rect), so GSAP tweens numbers rather than parsing clip-path strings
- `components/home/proofs/TakeoverController.tsx` — wires `useTakeoverMotion` into
  `useHashTakeover`
- `lib/takeoverLinks.ts` — Close (raises `cancel`, same path as Esc) and Next (replaces the hash,
  so Back still closes rather than stepping through projects) click handlers

## Decisions

- 2026-09-28 — User's choice: MARWIX-SKILLS is hidden temporarily, card and takeover, behind one
  flag (`hiddenProofs` in `lib/proofs.ts`); its content and code stay. With two projects shown, the
  cards sit two across from `md` up at full width, no empty third slot (three across from `lg` only
  once three or more are shown again). Un-hide: set `hiddenProofs` back to `[]`.
- 2026-09-24 — Proofs: the three real projects only, Exile, Design Vault and MARWIX-SKILLS, as
  cream cards each opening a takeover. Exile's takeover shows its two numbers and is the only
  place linking exile.marwix.dev. No tech stacks, no clients.
- 2026-09-24 — Proof cards are fully identical: one card design and one set of inputs (banner, tag,
  title, card line, proof line) for all three projects, in one grid, stacked on phone (grid column
  count superseded 2026-09-28, see above). Cream cards (cream/ink/cream-muted), numbered label 04,
  heading "Work that runs"-style (copywriter).
- 2026-09-24 — Proofs images: the user supplies takeover shots for all three projects — Exile,
  Design Vault and MARWIX-SKILLS. Placeholders are used while building and none may ship. All
  images go through the image helper. (Card shots are superseded 2026-09-28: cards no longer show
  a screenshot.)
- 2026-09-28 — Proof cards are redesigned on one template: a short banner (style A "Ink stage" —
  ink ground, faint "/" hatch, violet floor glow) replaces the 16:10 card shot, with the meta row,
  title, card line and one proof line below it. Screenshots live only in the takeover; `{project}Card`
  images and `cardShotAlt` are removed. Supersedes the card-shot part of the 2026-09-24 image
  decision and the "shot" input above.
- 2026-09-28 — Each banner holds this repo's ProcessBot (the MW mark), one per card, same body: big,
  leaning right, rising out of the banner with its feet sunk below the floor, breaking past the
  card's top and right edges; 3D on cards only (extruded depth, light, shadow) — Process' bots stay
  flat — and must still read as the MW mark. Left hand holds one prop per project: Exile a generic
  game phone (no Discord or Idle Heroes marks, those are trademarks), Design Vault a colour swatch
  fan, MARWIX-SKILLS a puzzle piece. Eyes look up-right, outward. The still pose works alone; motion
  comes later (spec §7.7).
- 2026-09-28 — Numbers stay off cards: the 2026-09-24 rule that Exile's two numbers appear only in
  its takeover's IN USE row stays. The card's proof line is an outcome in words; a month-and-year
  date from the facts is allowed on cards, stats are not.
- 2026-09-28 — Proof lines (from current facts): Exile "Live since March 2026, run by me alone";
  Design Vault "Public since September 2026, built by me alone"; MARWIX-SKILLS "Free and open
  source, anyone can use it". MARWIX-SKILLS' card line is rewritten to "Tools that help people build
  with AI." so it doesn't repeat the proof line.
- 2026-09-28 — The cards' bot shades use no new tokens: every shade is a `color-mix()` of existing
  tokens, kept in one table (`lib/proofBotShades.ts`) so real tokens can replace it later if wanted.
- 2026-09-24 — Proofs takeover template, the same for every project: (1) top bar "PROJECT 0n / 03 ·
  tag" plus a Close button; (2) big title; (3) three info rows WHAT IT IS / BUILT / IN USE, facts
  only; (4) one summary paragraph on what it does for its users; (5) shots, one big and two
  details; (6) a Visit button (Exile: exile.marwix.dev, the only
  place it's linked; Design Vault and MARWIX-SKILLS: their GitHub links); (7) "Next project" at
  the bottom.
- 2026-09-24 — Proofs takeover address: opening sets a hash (#exile, #design-vault,
  #marwix-skills) on the same page. The link can be shared and opens straight to that takeover,
  and the browser Back button closes it. Esc and Close also close it. Focus is trapped inside
  while open and returns to the card on close. Static: it opens and closes instantly. Motion
  (later): v3's clip-path expand from the card and collapse back, content rising in, and
  next-project transition.
- 2026-09-24 — Proofs: every project gets the same image set, a card shot plus three takeover
  shots (one big, two details), MARWIX-SKILLS included. All three projects stay identical in
  structure and are kept in sync. This replaces the earlier "skipped for MARWIX-SKILLS" in the
  takeover template.
- 2026-09-24 — Proofs built: three identical `ProofCard`s and one native `<dialog>` takeover per
  project, driven by the hash (`:target` without JS, `showModal` with JS). Every open takeover
  has a page entry beneath it (a direct load rewrites its entry to #projects and pushes the
  project), so Back, Esc and Close all use `history.back()`; hash parsing never decodes, so a
  malformed URL can't crash the page. The takeover top bar is solid `bg-cream` with an `ink/15`
  hairline (the blurred 85% bar failed contrast).
- 2026-09-24 — The user accepted that the full-screen takeover covers the nav's Book a call while
  a project is open (Close is one tap away). The user will add this to the constitution §3
  themselves; until then audits may flag it.
- 2026-09-25 — The ProofCard image `sizes` hint is back to the original
  `(min-width:1536px) 500px, (min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw` (no longer
  affected by the split/sticky-title pattern, since Proofs doesn't use it).
- 2026-09-25 — User's choice: Proofs is reverted to its original layout. Label, heading and hint
  sit above the cards and nothing is pinned (grid column count superseded 2026-09-28, see above).
  Proofs is the one section after the hero without a pinned title.
- 2026-09-26 — The GSAP motion pass is built (ui-spec §7.7): cards reveal (stagger 0.12s) and lift
  −8px on hover; the takeover clip-path expands from the card (0.75s) with content rising 40px
  after 0.35s, clips back on close (0.6s); under reduced motion the dialog shows at once, content
  only fades, close is instant. (Next project's motion superseded 2026-09-26, see below.)
- 2026-09-26 — Deviation from ui-spec §7.7 (recorded so audits don't flag it): the close animation
  plays after the hash has already changed, not before `history.back()`, because the browser's Back
  can't be delayed; this keeps Esc/Close/Back on one path with no double-back risk, and looks the
  same apart from the address bar updating at the start.
- 2026-09-26 — Deviation from ui-spec §7.7 (recorded so audits don't flag it): a direct load on a
  takeover hash opens with no animation, since the no-JS `:target` rule already shows it before
  scripts run.
- 2026-09-26 — Bug fix: `lib/revealBatch.ts` now runs its reveal tween through the calling
  matchMedia branch's `context.add`, not useGSAP's `contextSafe`; `contextSafe` could crash with a
  stack overflow when the page loaded already scrolled to Proofs (e.g. `/#projects`), since its
  context ended up containing itself.
- 2026-09-26 — User's choice: the section is renamed Proofs → Projects in every visible word (nav
  link, section label, the hero's "See projects" button, the takeover top bar "PROJECT 0n / 03")
  and the page anchor (`#proofs` → `#projects`; not live yet, so no shared links break). Code, file
  (`07-proofs.md` unchanged) and content key names stay `proofs`. Supersedes the takeover
  template's "PROOF 0n / 03" wording.
- 2026-09-26 — Bug fixed: `hooks/useHashTakeover.ts` resets a takeover's `scrollTop` right after
  `showModal()` and again just before every close, so every takeover opens at its top (open from a
  card, Next, Back/Forward, direct load) even right after one was scrolled to the bottom.
- 2026-09-26 — User's choice: "Next project" slides up — the current project slides up and out
  while the next one rises in from below, starting at its top, reading as scrolling on into the
  next project. Reduced motion: no slide; the next project shows at once at its top and its
  content fades in. Supersedes ui-spec §7.7's "Next: content rises 60px and fades in".
- 2026-09-26 — User's choice: Next slide shows one title, not two. Pressing Next hides the Next
  link's project title and the new takeover's heading starts at that exact spot and size, then
  grows and travels to its resting place while the takeovers slide up (same 0.85s, `power3.inOut`);
  refines the slide-up decision's mechanism — the incoming dialog stays in place with a transparent
  background and its content (on cream) slides up instead, since a moving dialog would clip the
  heading — not the slide-up itself; if the Next title is off screen, the heading just slides in
  with its content. The new top bar stays hidden while the title crosses it and fades in (0.3s)
  once the title is below it, which can push the slide's visible end ~0.1s later in typical
  layouts. Reduced motion unchanged (no slide, content fades).
- 2026-09-27 — User's choice: opening a project from its card shows one title. The card's title
  grows and travels into the takeover's heading, on the same timing as the opening shape (0.75s),
  so it's never cut off. The rest of the takeover still fades and rises in as before, and the
  sticky top bar stays hidden until the title has passed below it. This refines the open motion;
  the card-shaped opening, reduced motion (fade only) and direct loads (no animation) are all
  unchanged.
- 2026-09-27 — User's choice: closing mirrors the open. As the takeover shrinks back to its card,
  the big heading shrinks and travels back into the card's title, on the same timing as the
  shrinking shape (0.6s). The rest of the takeover fades out first. This supersedes the "no
  reverse title morph" part of the earlier 2026-09-27 card-open decision. If the heading is
  scrolled off screen when closing, it closes as before. Reduced motion (instant close) is
  unchanged.
- 2026-09-28 — The card-to-takeover title morph matches the card title's optical size and letter
  spacing at the card end and lines up the text boxes, so both hand-offs are the same glyphs within
  1px; the close ends with a 0.15s fade of the whole dialog so the card dissolves in underneath.
- 2026-09-28 — Deviations from ui-spec §7.1/§7.2 (recorded so audits don't flag them): the header
  row keeps `gap-x-10 gap-y-6`, not the spec's `gap-6`; the glints are clipped by a `<g clipPath>`
  wrapper to the unrotated strips and sit in `body` after `eyes` (so they don't follow the eyes),
  and their gradient peaks at stop-opacity 0.55; no `data-bot` element carries a `style` or
  `transform`; eye-wall paths, the depth steps' `color-mix()` strings and eye positions are all
  computed at server render, nothing on the client; the file list has two extra files beyond the
  spec's, `ProofBotShape.tsx` and `lib/proofBotShape.ts`.

## Open Questions

- **Fact:** the user is adding MARWIX-SKILLS details (BUILT / IN USE) to `docs/03-facts.md`; its
  rows show `[FILL]` until then and can't ship. MARWIX-SKILLS is hidden for now (see Decisions), so
  this doesn't block launch.
- **Fact:** the user is adding Exile facts (Idle Heroes, the mobile game it serves, and its
  in-game resource calculations) to `docs/03-facts.md`; once they land, copywriter updates Exile's
  card line, summary and rows.
- **To build:** Proofs — Exile, Design Vault and MARWIX-SKILLS takeover screenshots (pending from
  the user; cards no longer carry a screenshot); their shot alt-text `[FILL]` markers clear when
  the images arrive.
- **To build:** the proof card motion pass (spec §7.7: rise-out reveal, hover lean + prop act, idle
  breath/blink, pointer eyes) — the static card now passes checks (2026-09-28).
- **Choice (later):** replace the color-mix shades in `lib/proofBotShades.ts` with named tokens.
- **Note:** after Back on a direct-load takeover, focus isn't returned to the card (minor).
- **Note:** at 1440 the Design Vault proof line wraps to two lines while Exile's takes one, so its
  hairline sits ~16px higher than its neighbour's; not a blocker.
- **Note:** faint stair lines are visible on the card bot's extrusion at large stacked widths
  (around 767) from the 6-step depth table; not a blocker.
- **To build:** with two cards shown, the bot scales up (~620px banner) at 1440/3840, making the
  extrusion's 6-step stair lines clearly visible; fix candidates: more depth steps, or a smooth side
  fill instead of stepped bands.
- **To build:** with two cards shown, Exile's right arm comes within ~11px (1440) / ~3px (3840) of
  the Design Vault card; fix candidates: a wider column gap, or a cap on the bot's scale when only
  two are shown.
- **To build:** ui-spec §7.1's grid line still reads "three across from `lg`" / "MARWIX-SKILLS
  starts row two"; needs updating to the two-shown grid (`proofGridColumns`) now that MARWIX-SKILLS
  is hidden.
- **To build:** check the Next slide-up and both title morphs (Next and card-open) on a real
  Safari/iPhone before launch — only tested in headless Chromium so far; stacked-modal
  (`showModal()` under an open dialog) behaviour on Safari and Firefox is unverified.
