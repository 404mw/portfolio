# Proofs

**Last Updated:** 2026-10-09

**The one question:** Have they built something real that people use?

See `../page.md` for the site-wide index. Spec: `../ui-spec/07-proofs.md`; the spam diagram:
`../ui-spec/07-proofs-spam.md`; the takeover title band: `../ui-spec/07-proofs-band.md` (§A
placement and §C fallbacks superseded by `../ui-spec/07-proofs-sticky-band.md`, the condensing
sticky band).

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
is tracked per dialog (`titleTweens`) and killed whole in `reset`, since a partial `killTweensOf` on
a delayed multi-target tween doesn't stop it in GSAP 3.15. Reduced motion and direct loads are
unchanged.

Closing a takeover (Close, Esc, Back) while its heading is on screen now runs the reverse morph
(2026-09-28): the heading shrinks back into its card title over 0.6s on `power4.inOut`, the same
ease and time as the clip closing. The top bar and the rest of the content fade out over 0.2s
first. A 0.15s fade-out runs at the end if the heading and the card title wrap to different line
counts. (Superseded 2026-10-08: the scrolled-off-heading close and the band landing on the banner
are gone; the condensing sticky band keeps the heading on screen, so scrolled closes morph too, see
"Built 2026-10-08" below.) `plainOut` (`hooks/useTakeoverMotion.ts`, the plain clip: content fades
over the first 0.2s, whole dialog dissolves over the last 0.15s) now runs only when the card title
is not on screen or missing, the fit check fails, or a plain open was cut off mid-rise. A close
mid-open carries on from where the open had got to, and a reopen mid-close is clean. Both ends of the morph match the card title's typography: the heading starts (open) and
ends (close) at the card title's optical size (the font's `opsz` axis) and letter spacing, keeping
`wdth 80` (Bricolage logic; Acosta has no axes since 2026-10-07, so this does nothing now, see
`../page.md` Open Questions). Both are driven from the morph's scale, so they reach the heading's own values at rest.
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
higher than its neighbours'.

Lead-verified 2026-09-28, after hiding MARWIX-SKILLS: build and lint stay green; no sideways scroll
at 360/480/600/767/768/1024/1440/3840. With only two, wider cards, the bot scales up (~620px
banner) at 1440/3840, and Exile's right arm comes within ~11px (1440) / ~3px (3840) of the Design
Vault card (open question below).

Built 2026-09-28: the card bots are animated with GSAP (ui-spec §7.7). Each bot rises with its
card's reveal — 0.9s from 84 units below the banner floor on `back.out(1.3)`, starting 0.15s after
its card, in the same `ScrollTrigger.batch` and 0.12s stagger as the cards (`stagger.card`, now
shared by `lib/motion.ts` and `useProofCards`) — and lands with its inline transform stripped. On a
fine pointer, hovering a card leans the bot's rig +4° about (50, 92) and plays its prop's act once
per enter: the phone's screen lights in and out, the fan's four swatches spread −9/−3/+3/+9° then
close with an overshoot, the puzzle tilts −14° and lifts 2 units then snaps back
(`back.out(2.6)`) as it flashes — built for MARWIX-SKILLS' puzzle bot even while it's hidden. Idle,
full motion only: the body breathes (the Process bots' 0.04 `scaleY` stretch, 1.3s half), the arms
drift ±3° out of phase, the eyes blink, and the eyes follow a fine pointer from −7 to 7 and ease
back to rest after 2.5s idle — all reusing the Process bots' numbers, registry and
`lib/processBotPointer.ts` (which gained an optional `point` arg for the proof bots' own eye
point; Process's calls are unchanged). The bots pause off screen, in a hidden tab, or while a
takeover is open (new `lib/watchTakeovers.ts`, watching the takeover dialogs' `open` attribute).
Reduced motion: nothing moves; each bot fades in with its card. Teardown strips `style`,
`transform` and `data-svg-origin` from every hook. `npm run build` and `npm run lint` are green, no
console errors; the lead confirmed in headless Chromium at 1440 that the rise plays and lands with
no inline style, the fan spreads and the phone screen lights on hover, the Exile takeover opens and
closes with Esc, reduced motion at 360 leaves no hook with inline motion, there's no sideways
scroll at 360/767/1440/3840 with motion on, and idle runs at about 120fps at 1440 (headless, not a
real-device profile). Seen: the hover lean pushes Exile's right arm to touch the Design Vault
card's edge at 1440 (open question below, sharpens the existing arm-clearance one).

Built 2026-09-28: the card bots' depth is now one continuous extrusion — each depth-facing edge
gets one flat-shaded side quad from `lib/proofBotExtrude.ts`, replacing the 6-step (body) / 5-step
(prop) stacked copies that showed stair steps and colour bands at two-across sizes.
`lib/proofBotDepth.ts` holds only the two depth vectors (body, props); `lib/proofBotShape.ts`'s
`transform?: string` is now a typed `rotation?: { angle, cx, cy }` plus `proofBotRotate()`; the
fan's swatches turn through `fanTurn(angle)` (`lib/proofBotProps.ts`). Lead-verified 2026-09-28 on
a production build: the side faces are solid with no stair steps or colour bands at 1440 and in a
3840 close-up (resolves the stair-line notes above); the motion test passes — the rise lands clean,
the hover acts work, the takeover opens and closes, no console errors; nothing scrolls sideways at
360/767/1440/3840; reduced motion leaves 0 hooks with inline motion.

Built 2026-10-06: the card bots duck before a takeover opens (full motion only;
`lib/proofBotDuck.ts`, started in `hooks/useProofBots.ts`). A plain click (primary button, no
modifier) or Enter on a card is held: its bot ducks to the banner floor (`DUCK`, 0.25s `power2.in`
to `RISE_FROM` 84), then the hash is set as the link would, so the growing clip never shows a head
above the card. Each open takeover's bot stays down by any route (`lib/watchOpenTakeovers.ts` reports
the open dialogs' ids), including bots left by Next, and once no takeover is open every held bot
rises back with the reveal's own rise (`DUCK_RISE`) and is stripped to server markup. Modifier and
middle clicks are left to the link. Reduced motion is unchanged. Lead-checked 2026-10-06: lint and
build pass; in Edge at 1440 the bot is fully down (y 84) before the dialog opens and the clip grows;
on Esc it rises only after the dialog closes and its inline style is cleared after; Enter, Back and a
page loaded on `#exile` all behave; no console errors. `ui-spec/07-proofs.md` is updated to match.

Exile Bot's card copy (2026-10-05, `content/home.ts` `proofs.projects.exile`) states its real use.
Tag: "Discord platform". Title: "Exile Bot". Visit button: "Visit Exile Bot". Card line: "Runs in-game
calculations and simulations for Idle Heroes players." In use row: "In Discord communities for Idle
Heroes, a mobile game." The `summary` slot is gone (see the takeover below).

The project takeover is rebuilt static as up to seven parts (2026-10-05), the same order for every
project, all direct children of the column beside the title so the open, close and Next motion
works unchanged (`ProjectTakeover.tsx`): (1) `TakeoverIntro` — intro plus the info rows; (2)
problem, (3) what I built (shots and the Visit button in the wide slot), (4) what it took
(`TakeoverTook`, a grid of `TakeoverItem`s; only when `whatItTook` exists, Exile Bot today), (5)
what I learned (`TakeoverLearned`: a numbered `<ol>` in one column on the `max-w-xl` measure, each
`TakeoverItem` with an `aria-hidden` ordinal from `listNumber`; only when `whatILearned` exists,
Exile Bot today, three lessons) and (6) showcase
(`TakeoverShowcase`'s status pill and paragraph, plus the `SpamDiagram` in the wide slot; only when
`showcase` exists, Exile Bot today), each in the shared `TakeoverPart` frame (mono label over a
per-project headline, body beside it from `lg`, `data-part` on the section); (7) `TakeoverMeans`,
the ink "means for you" panel: eyebrow, the closing line (`TakeoverMeansLine`, the one part that
follows the About pick, falling back to `default`) and a Book a call button, then the Next link.
The shape of every project is `ProofProject` in `lib/proofProject.ts` (a project that drifts fails
the type check). A project has two or three shots and `TakeoverShots` picks the layout from the
count (`ProofShots` is a two- or three-tuple): three is one 2:1, then two 4:3 details side by side
from `sm` (Exile Bot, MARWIX-SKILLS); two is two 2:1 frames stacked at every width (Design Vault).
Each shot carries the edge its frame keeps (`ProofShot` = name + `position`, `top | center | left`;
`lib/proofs.ts`). Shots, positions and alts are paired by index (`zipShots`); a project's shot names
must match its `shotAlts` length in `content/home.ts` (checked by `satisfies`, a mismatch fails the
type check, and `zipShots` throws at build if one slips past). Exile Bot's positions are center /
top / left (home, dashboard, spam-raid); the slot defaults are top / top for two and top / center /
center for three. `SiteImage` gained a `left` position key for this. Exile Bot's three shots load
from `public/images/exile/` (`home.webp`, `dashboard.webp`, `spam-raid.webp`) and all three alts are
written. Design Vault's two light-theme shots load from `public/images/design-vault/`
(`palettes.webp`, `fonts.webp`; 1907×947 and 1906×948 per the lead, not re-measured here) with
both alts written (Palettes view, Fonts view). Only MARWIX-SKILLS' three shots are `null`
placeholders (hidden). The spam diagram (`SpamDiagram`, `SpamStage`, `SpamStep`, `SpamStepFigure`,
`SpamStepLink`, `SpamStepDown`, `SpamReturn`; keys and the step-to-image map in `lib/spamDiagram.ts`;
spec `../ui-spec/07-proofs-spam.md`) is three numbered steps with a dashed "Temporary" return line,
drawn as an ink stage (2026-10-06). From `md` it is one ink band (`SpamStage`, hidden on phones)
behind three columns: Exile Bot's mascot Eva (`eva-watch.png`, `eva-spot.png`, `eva-stop.png`;
`SpamStepFigure`, `fit="contain"`, bottom-anchored, empty alt) stands on the band's floor, 144 / 192 /
248px at `md` / `lg` / `xl`, her head breaking out above the band's top (28 / 36 / 48px); a hairline
and chevron (`SpamStepLink`) runs inside the band between figures; the step text sits on cream below.
On a phone each `<li>` is its own ink band with Eva 148px flush at its right end, head breaking out
above, the ordinal, title and line on the band, 40px apart with a cream down chevron
(`SpamStepDown`) under steps 1 and 2. The ink ground is the shared `InkStageGround` (floor or end
glow; `lib/proofBotShades.ts` `banner.glowEnd`), which `ProofBanner` also uses, so it is never
forked. Exile Bot's in-use numbers are 18+ and 3.9K+
and the showcase status reads "Live in communities that use it"; no `[FILL:` marker is left in
Exile Bot's content. Static only; the motion pass for the parts (5 and 6 included) is not built.
`SpamStepTile.tsx` and `EyeIcon.tsx`, `AlertIcon.tsx` and `LockIcon.tsx` are imported nowhere now but
still exist.

Lead's check 2026-10-05: lint, tsc and a production build pass. On the dev server (headless
Chromium) at 360, 768, 1024, 1440 and 3840 in reduced motion, and 360 and 1440 in full motion:
Exile Bot shows all seven parts, Design Vault four; no
sideways scroll on the page or in either takeover, nothing outside the viewport, no tap target
under 44px, no console errors; open from the card, Next to Design Vault, and Esc all end in the
right state (closed, `#projects`, page scroll unlocked). The closing line shows the default set with
no pick and the Discord line with `?for=discord`. With the learned part added (reduced motion; 360,
768, 1024, 1440, 3840): no sideways scroll or overflow, the three lesson titles each sit on one line
beside their ordinal at every width, and the phone Exile Bot takeover is about 4,800px tall (was
about 4,200px). Still to do: the motion pass for parts 5 and 6, and re-testing `useTakeoverMotion`
(Next from the bottom of the taller takeover).

Lead's check 2026-10-06 on the production build: lint and build pass; at 360, 768, 1440 and 3840
the Exile Bot takeover has no sideways scroll, the three shots measure 320×160 / 320×240 (phone) up
to 1536×768 / 758×569 (4K), the tiles 96 (phone) and 128 (from tablet; since replaced by the ink stage, see above), all three screenshots and
all three Eva images load, and no placeholder shows in the Exile Bot view. Not yet done: no
code-auditor pass on this round (it runs before the push).

Lead's check 2026-10-06 on the production build, after the ink-stage rebuild of the spam diagram:
lint and build pass; at 360 three bands with Eva 148px breaking out and the step text on the band;
at 768 one band with 144px figures; at 1440 and 3840 one band with 248px figures, heads about 48px
above it; no sideways scroll at any width; the diagram is about 599 / 382 / 434 / 434px tall; the
proof card banner after the `InkStageGround` extraction looks unchanged at 1440.

Built 2026-10-07: every takeover has a permanent decorative ink band behind its title
(`TakeoverBand.tsx`, spec `../ui-spec/07-proofs-band.md`). It is the shared `InkStageGround` (floor
glow, `rounded-3xl`, `aria-hidden`, `data-anim="takeover-band"`), placed before the `<h2>` inside
`TakeoverHead` (built 2026-10-08, see below), which sits in a `flex flex-col` column; the band is the
title plus the title's margins (the title is `text-text`, its margins are the band's padding). Part 1 keeps its hairline. It shows at rest on direct loads, after
Next, without JS and under reduced motion. `InkStageGround` gained an optional `anim` prop
(`data-anim`); the card banner's ground carries `proof-banner`.

Motion (2026-10-07, `hooks/useTakeoverMotion.ts`, `lib/takeoverBand.ts`, `lib/takeoverTitleTone.ts`):
opening from a card, the card's ink banner morphs into the title band (0.75s, `power4.inOut`, one
tweened `{x, y, width, height, radius}` written as translate, width, height and border-radius, no
scale; radius 12 → 24; opaque; `zIndex 1` in flight) and back on close (0.6s, from where it stands,
opaque through the last-0.15s dissolve). The title's colour follows where it sits: `text` over the
band, ink over cream, and a `background-clip: text` gradient split while a band edge crosses it (a
function of position, not time), including during Next, where nothing is written on the band (it
rises with its content). Band and title morph together or fall back together (plain open, plain
clip). `bodyPartsOf` skips the band. The sticky bar's hold on open is the later of the title's
glyph-clear and the band's top-edge-clear progress. `reset` clears everything new. Reduced motion
and direct loads run none of it.

Lead-checked 2026-10-07: lint and `tsc --noEmit` pass (the production build was run green by
gsap-animator, not re-run by the lead). On the dev server in headless Edge, sampled every frame, full
motion at 360 and 1440: open from the Exile Bot card, Esc close, close mid-open, and Next to Design
Vault then Esc. The band is never outside the dialog's clip (max 0.0px), no sideways scroll on the
page or in the dialog at any frame, no console errors, and after every flow the band, title, bar,
content and dialog carry no leftover inline style (the band keeps only its server-rendered
background). The band starts on the card banner's rect (as lifted 8px by the hover) and rests at
320 × 85 (360) and 1328 × 202 (1440), matching the spec; the title is one line at both and rests in
`text`; on open the title goes ink → split → `text`, and back on close. Reduced motion at 360, 768
and 3840: nothing moves, no inline style is written, the band rests at 320 × 85, 707 × 132 and
1536 × 220. Screens looked at: rest at 360 and 1440, mid-open and mid-close at 1440, mid-open at 360.
Not checked: Safari, Firefox, a real phone, the split frame's descender on "Design Vault", a
two-line title, 768/1024/3840 in full motion.

Built 2026-10-07 in `hooks/useTakeoverMotion.ts`: `freezeScroll(dialog)` runs first in the full-motion
`closing`, before every read. It sets inline `overflow-y: hidden`, plus `scrollbar-gutter: stable`
only when a classic scrollbar shows (so nothing re-wraps), writes `scrollTop` back, and adds
`wheel`/`touchmove` (preventDefault, non-passive) and `scroll` (puts `scrollTop` back) listeners. The
scroll listener is needed because Chromium lands one more step of a smooth scroll after the close
starts. `reset(dialog, holdScroll)` clears all of it and is still the one cleanup point. Verified by
gsap-animator in headless Chromium at 1440 and 360 with classic scrollbars, sampling every frame. Esc
during a smooth scroll: scrollTop held, heading and band land on the card title and banner at dx/dy
0. Normal close: unchanged. Wheel, PageDown, Space and arrows don't move the dialog during a close.
Reopen mid-close and a reduced-motion switch mid-close leave no inline style or listener. No console
errors. The lead re-ran lint and `tsc --noEmit`: both pass.

Lead's check 2026-10-07 on the two-shot Design Vault takeover: `npm run build` and `npm run lint`
pass. On the dev server (headless Chromium) at 360, 768, 1440 and 3840 the two frames measure
320×160 / 707×353 / 1328×664 / 1536×768, both images load, no sideways scroll, no page errors. The
light shots' edges read on cream at 360 and 1440 (cool white and lavender against warm cream). Not
checked: Safari, Firefox, a real phone.

Built 2026-10-08: the condensing sticky band (spec `../ui-spec/07-proofs-sticky-band.md`).
`TakeoverHead` (`data-anim="takeover-head"`) wraps the band and the h2; the column is `flex flex-col`.
The head is sticky only when the dialog has `data-condense` (top `--takeover-stick` = bar − 12). A
no-scrub ScrollTrigger per dialog (`lib/takeoverCondenseTrigger.ts`, math in
`lib/takeoverCondense.ts`) shrinks the band's height H → 12 + H·s and radius 24 → 12, with the title
scaled to the card title size (`text-card`), as a pure function of scrollTop over a distance = H
starting when the head sticks; the dialog carries inline `scroll-padding-top: B+V+16`. Open: the
condense is held until the open ends, then applies once; a direct load starts at once. Next: the old
strip is frozen and slides away slim, cleared at slide end. Close from full, mid or slim: scroll is
frozen, the pose is read at the frozen scrollTop, the head stays sticky, and the card morph plus
band flight run back to the card (from slim the title is a pure slide; typography is blended over the
flight via `condensedTypeAt`). `plainOut` runs only for: card title not on screen or missing, failed
fit check, plain open cut off mid-rise. Removed: the scrolled-off-heading close, the narrow
band-window close, `bandLanding`, `plainOut`'s landing branch. Reduced motion: not sticky, no
condense. Verified in headless Chromium on a production build at 360/768/1440/3840: measured sizes
match the spec table (1440: slim strip 65 visible, slim title 35px; 360: 51.5 visible, 25px); closes
land on the card h3 within 0.03px and on the banner exactly. Not checked: real devices, Safari.

## Key Files

- `components/home/proofs/` — TakeoverBand (the title band, new; row 1 of the column's grid),
  ProofsSection (label/heading/hint above the cards, no split, not
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
  TakeoverIntro (part 1), TakeoverPart (frame of parts 2–6), TakeoverTook (part 4),
  TakeoverItem (renamed from TakeoverTookItem; the item shared by parts 4 and 5, optional
  ordinal), TakeoverLearned (part 5, new), TakeoverShowcase (part 6's status and paragraph),
  SpamDiagram, SpamStage (the shared band from `md`), SpamStep, SpamStepFigure (Eva, 148 / 144 /
  192 / 248px), SpamStepLink (the band's arrow), SpamStepDown (the phone's down chevron) and
  SpamReturn (part 6's diagram), InkStageGround (the ink ground shared with ProofBanner),
  TakeoverMeans and TakeoverMeansLine (part 7), TakeoverShots (part 3; layout from the shot count: two stacked 2:1
  frames, or one big plus two details; per-shot crop position),
  ProjectVisitLink, ProofsMotion (client, mounts the reveal, `useProofCards` and
  `useProofBots`, renders nothing); `ProofCard`'s h3 carries `data-anim="proof-card-title"`, the
  card-open morph's source
- `lib/proofProject.ts` — the `ProofProject` type every project must fit, and `proofProject(key)`
- `lib/spamDiagram.ts` — the diagram's step keys (`watch`, `spot`, `stop`), each step's Eva image
  name (`spamStepImage`) and `spamStepPointsOn`
- `lib/images.ts` — the image-name-to-file map: Exile Bot's three shots (`exileShot1–3`) and Eva
  images (`exileEvaWatch/Spot/Stop`) and Design Vault's two shots (`designVaultShot1–2`) are filled;
  only MARWIX-SKILLS' three shots (hidden) are `null`
- `components/SiteImage.tsx` — the shared image component; `position` takes `top`, `center`,
  `bottom` and `left` (new)
- `public/images/design-vault/` — `palettes.webp`, `fonts.webp` (Design Vault's two shots, light
  theme; from `temp/project-images/design-vault/DV_palettes.png`, `DV_fonts.png`)
- `public/images/exile/` — `home.webp`, `dashboard.webp`, `spam-raid.webp` (the shots) and
  `eva-watch.png`, `eva-spot.png`, `eva-stop.png` (the tiles)
- `components/home/proofs/SpamStepTile.tsx`, `components/icons/EyeIcon.tsx`, `AlertIcon.tsx`,
  `LockIcon.tsx` — unused (no longer imported), awaiting the user's delete (the project's delete hook
  lets only the user delete files)
- `docs/pages/home/ui-spec/07-proofs-spam.md` — the spam diagram's spec (ink stage); supersedes
  `07-proofs.md` §7.3.2 and §7.6.1
- `docs/pages/home/ui-spec/07-proofs-band.md` — the takeover title band's spec (built 2026-10-07;
  §A placement and §C fallbacks superseded 2026-10-08)
- `docs/pages/home/ui-spec/07-proofs-sticky-band.md` — the condensing sticky band's spec (built
  2026-10-08)
- `components/home/proofs/TakeoverHead.tsx` — wraps the band and h2 (`data-anim="takeover-head"`);
  sticky only under `data-condense`
- `lib/takeoverCondense.ts` — the condense math: band height, radius and title scale as a pure
  function of scrollTop; `condensedTypeAt` for the close flight
- `lib/takeoverCondenseTrigger.ts` — the per-dialog no-scrub ScrollTrigger that applies it
- `lib/takeoverBand.ts` — the band morph's numbers (fit check per edge, band box and radius tween
  values, top-edge-clear progress)
- `lib/takeoverTitleTone.ts` — the title's colour as a function of its position against the band
  (`text`, ink, or the `background-clip: text` split)
- `docs/pages/home/ui-spec/07-proofs-bot.md` — the spec's card-bot block (§7.2.1–§7.2.3), moved out
  of `07-proofs.md`; the §7.x numbers are unchanged
- `lib/proofBotBody.ts` — the card bot's viewBox, static pose (10° lean, look 7), arms, glints and
  eye positions, reading the MW strips/feet/eyes unchanged from `lib/processBots.ts`
- `lib/proofBotProps.ts` — the three hardcoded prop drawings (Exile's phone, Design Vault's fan,
  MARWIX-SKILLS' puzzle piece), each a list of pieces in paint order, plus each prop's `grip` point
  for the later motion pass
- `lib/proofBotShape.ts` — the shared outline/solid/detail types every card-bot file draws from
- `lib/proofBotDepth.ts` — the two depth vectors (body 3.3 × 4.2 units, props 2.75 × 3.5 units) the
  side-face extrusion sweeps
- `lib/proofBotExtrude.ts` — builds one flat-shaded side face per visible edge from a depth vector,
  shaded `sideNear` over `sideFar` by facing (right-facing 100% near, down-facing 20%)
- `lib/proofBotShades.ts` — every card-bot shade (materials, eye, light, banner ground) as a
  `color-mix()` of existing tokens only, in one table
- `lib/proofs.ts` — the project order/keys (`proofKeys`, all three), the temporary hide flag
  (`hiddenProofs`) and the shown list it derives (`shownProofKeys`), each shown project's dialog id,
  image names and crop positions (`ProofShots` is a two- or three-tuple, `proofImages`, `proofShotsWithAlts`), two-digit number and total, next-project wraparound, the grid's column count
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
- `hooks/useProofCards.ts` — the cards' staggered reveal (`lib/revealBatch.ts`, `stagger.card`) and
  fine-pointer hover lift
- `hooks/useProofBots.ts` — the card bots' motion: wires the rise (with the cards' reveal batch),
  the duck (`duckProofBots`, started before the reveal so the reveal skips bots the duck `owns`),
  the idle/pointer branch and the hover listeners; reduced motion runs none of it
- `lib/proofBotDuck.ts` — the click duck: holds a plain card click or Enter, ducks the bot to
  `RISE_FROM`, then sets the hash; keeps each open takeover's bot down and rises all back when none
  is open; `stop` strips held bots and, unless unmounting, still opens a duck cut short
- `lib/watchOpenTakeovers.ts` — reports which takeover dialogs are open (by id, via each `open`
  attribute), once at start and on every change; the duck's source, unlike `lib/watchTakeovers.ts`
  (any open or not)
- `lib/proofBotMotion.ts` — the card bots' own motion constants (rise, `DUCK`, `DUCK_RISE`, hover lean, the prop acts),
  re-exporting the Process bots' idle/pointer numbers (`lib/processBotMotion.ts`) so every proof-bot
  file reads one place
- `lib/proofBotRig.ts` — finds a bot's `data-bot` hooks, sets every pivot once with `svgOrigin`, owns
  the summed channels (breath, drift, look) and their one per-frame writer, and `resetProofBot`
- `lib/proofBotLife.ts` — the idle loop: breath, out-of-phase arm drift, blink scheduling, all
  registered on the shared crew so they pause together
- `lib/proofBotActs.ts` — the hover lean and the three prop acts (phone, fan, puzzle), each playing
  once per enter
- `lib/proofBotFollow.ts` — the eyes' pointer follow on a fine pointer, reusing
  `lib/processBotPointer.ts`'s mapping and easing back to rest after idle
- `lib/watchTakeovers.ts` — watches the takeover dialogs' `open` attribute so page motion can pause
  while one is open; used by the proof bots' idle branch
- `hooks/useTakeoverMotion.ts` — the takeover's open/Next-slide/close clip and content motion,
  handed to `useHashTakeover` as `transitions`; also owns the close morph (`cardMorphBack`,
  `morphOut`), the typography match on both ends and the close's end fade, the plain-clip close's
  content fade and dissolve (`plainOut`, now only the no-card / failed-fit / cut-off-open cases),
  the band flight's measuring helper (`bandOverBanner`), the condense hold, slim Next and close
  poses, and freezes the dialog's scroll for the close (`freezeScroll`)
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

- 2026-10-09 — User's call: Exile Bot's proof line says "standards" instead of "rules" ("written standards", landed); see `../page.md`.
- 2026-10-08 — User chose the condensing sticky band (spec `ui-spec/07-proofs-sticky-band.md`): the
  takeover's ink band and title stick under the top bar and shrink to a slim strip as you scroll, so
  every close morphs back into the card; strip hangs from the bar, slim title at the card title's
  size on phones, not sticky under reduced motion (the spec's recommended options). Built
  2026-10-08. Supersedes the scrolled-off and narrow-window plain closes and the band landing on
  the banner.
- 2026-10-07 — (superseded 2026-10-08) User's choice: on the plain-clip close (heading scrolled off screen), the card's black
  banner shows during the shrink and dissolve. The takeover's ink band is set on the card banner's
  rect and radius and fades in over the content's 0.2s fade; the bar, heading and siblings fade out
  instead of the whole content. The cream shrinks with the banner in place and dissolves onto the
  real one. Refines the plain-close fade-and-dissolve decision below.
- 2026-10-07 — (superseded 2026-10-08 for the scrolled-off and narrow-window cases; the other plain
  closes stand) User's choice (after reporting that a close from a scrolled takeover showed the
  full-screen content inside the shrinking card shape, then snapped): a close that clips back to the
  card without the title morph (heading scrolled off screen, the narrow band-window fallback, a close
  mid plain open, no card title) fades the takeover content out over the first 0.2s and dissolves the
  whole dialog over the last 0.15s, so the clip shrinks as plain cream and the card dissolves in.
  Supersedes "no morph, just the clip" for those closes. The no-card fade, the morph close and reduced
  motion are unchanged.
- 2026-10-07 — Bug fix (user report: closing a project mid-scroll looked wrong): the takeover close
  freezes the dialog's scroll where it stands for the whole close, so a close fired mid-scroll lands
  the heading and band exactly on the card; the dialog scrolls normally again once the close ends.
  Full motion only (reduced motion closes instantly).
- 2026-10-07 — Deviations from `../ui-spec/07-proofs-band.md` (recorded so audits don't flag them):
  the band fit check is per edge with a screen-cut allowance (an edge passes if inside the clip at
  both ends, or the clip sits on the screen edge at both ends); (the narrow close window's plain
  clip is superseded 2026-10-08, removed); the band has its own tween on the clip's ease and duration rather than
  reading the clip's progress; `GLYPH_OVERHANG` (0.15) is repeated in `lib/takeoverTitleTone.ts`
  because `lib/takeoverTitleMorph.ts` keeps it private.
- 2026-10-07 — The spec's two open choices were taken as recommended by the lead: the title's colour
  splits exactly at the band's edge; one gutter (`pt-gutter`) above the band.
- 2026-10-07 — The card's ink banner is part of the takeover transition (the user): on open it gets
  thinner and travels to sit behind the takeover's title, and close plays it in reverse; replaces
  the banner being covered by the dialog's cream from the first frame and popping back at the end
  of the close.
- 2026-10-07 — Every takeover has a permanent ink band behind its title, the title in a light colour
  on ink; it shows at rest on direct loads, after Next, without JS and under reduced motion (nothing
  moves there).
- 2026-10-07 — The band is the takeover's content column width with rounded corners, with the card
  banner's hatch and violet glow, built from the shared `InkStageGround` (never forked).
- 2026-10-07 — On Next, the new project's band is part of its content and slides up with it (no
  morph of its own); the existing Next title morph is kept, the title's colour changing as it lands.
- 2026-10-07 — The takeovers' website closing line is removed with the About card "I need a
  website" (user's call, see `02a-about.md`); the closing lines follow four cards plus the default.
- 2026-10-06 — Clicking a proof card first ducks its bot below the banner floor (0.25s), then opens
  the takeover; each open takeover's bot stays down by any route (hash link or load, Next), and all
  rise back with the reveal's soft bounce once no takeover is open. Replaces the break-out
  staying outside the clip at the first frame and reappearing as the clip shrinks. Reduced motion
  unchanged: no duck, no delay (the user).
- 2026-10-06 — The spam diagram is an ink stage (the user, after rejecting boxed Eva tiles as "not
  as good as everything we have built"): from `md` one ink band with three Evas rising from its floor
  and their heads breaking out above it (sample "2 · Ink stage"); on phones one ink band per step with
  Eva at its right end, head breaking out above like the big screen (phone sample "C"). Spec
  `../ui-spec/07-proofs-spam.md`. The ink ground is the shared `InkStageGround`, also used by
  `ProofBanner`.
- 2026-10-06 — `SpamReturn.tsx`'s class typo (`md:ml-16md:justify-center`) is fixed to
  `md:ml-16 md:justify-center`; lead-checked at 768 and 1440: the return line's left leg sits under
  tile 1's centre and the pill and line are centred.
- 2026-10-05 — The project's name is "Exile Bot" (the user; exile.marwix.dev is only the short
  form): the title is "Exile Bot", the visit button reads
  "Visit Exile Bot", and the tag changes from "Bot platform" to "Discord platform" so "bot" isn't
  repeated directly above the title; `rows.whatItIs` and the shot-alt markers are unchanged, and no
  key, hash (#exile) or file was renamed. `docs/03-facts.md` was updated to the name with the
  user's say. Lead's screen check done 2026-10-05: the title sits on one line at 360, 768, 1440 and
  3840, and the card open/close title morph works.
- 2026-10-05 — The project takeover is rebuilt into seven parts (the user's call; the sixth part
  grew a seventh, see below), superseding the 2026-09-24 seven-part template: (1) what it is — intro
  plus the info rows; (2) the problem; (3) what I built, with the screenshots and the Visit button;
  (4) what it took (optional; Exile Bot only today: the four capabilities from `docs/03-facts.md`);
  (5) what I learned (optional; see the next line); (6) showcase (optional; Exile Bot only: its
  spam and raid protection, live in the communities that use it, with a drawn diagram); (7) what
  this means for you — one closing line and a Book a call button. Same structure and order for
  every project; a project without the facts for an optional part doesn't render it. The single
  `summary` slot is retired.
- 2026-10-05 — New optional part 5, "What I learned", sits between "What it took" and the Showcase
  (Showcase is part 6, the closing panel part 7). Exile Bot has it: headline "Running a live app
  changed how I build yours.", three numbered lessons written as how the user works now — build the
  system first; keep only the data an app needs (EU servers, encrypted backups, deletion within 48
  hours, never stated as compliance); keep heavy pages fast (700+ images, the method never stated).
  Design Vault skips it for now (the user), so its takeover keeps four parts. The facts went into
  `docs/03-facts.md` with the user's permission ("do as you see fits"). It reuses the "What it took"
  item, renamed `TakeoverTookItem` → `TakeoverItem`, with an optional ordinal.
- 2026-10-05 — Parts 2–7 are headed by a small mono label (the same on every project) over a
  headline written per project, so a reader skimming only the headlines gets the story (the user
  chose this over the same big labels on every project).
- 2026-10-05 — The closing line is the only part of a takeover that follows the About pick (one
  line per card, falling back to the default line when a card has none); the rest reads the same
  for everyone. Constitution §3 was amended at the user's instruction, and now also says each
  takeover ends with its own Book a call button because the takeover covers the nav.
- 2026-10-06 — The spam diagram's three steps show Eva, Exile Bot's own mascot, holding each
  step's symbol, replacing the Eye, Alert and Lock icons (the user); the images are decorative
  (empty alt). This is the user's one
  exception to "no generated art on the site", covering the Exile Bot view only; the site's own
  mascot stays everywhere else.
- 2026-10-06 — The spam status pill carries no community count; it reads "Live in communities that
  use it" (the user). The user confirmed spam and raid protection is active in communities.
- 2026-10-06 — Exile Bot's in-use numbers are 18+ communities and 3.9K+ commands run, replacing ~20
  and 4k+ (the user): floors matching the live Exile Bot site's stats strip, raised only when the
  user says so, belonging to the calculations and simulations use only. `docs/03-facts.md` was
  changed with the user's permission.
- 2026-10-06 — The dashboard screenshot is used as the user supplied it, not pre-cropped; the user
  accepted that it shows the community's name, server ID, member count and credit balance ("a server
  id does no harm").
- 2026-10-07 — A takeover's shot count is per project, two or three (the user). Design Vault shows
  two light-theme shots, Palettes then Fonts, stacked full width at 2:1 (`temp/project-images/design-vault/DV_palettes.png`,
  `DV_fonts.png` → `public/images/design-vault/palettes.webp`, `fonts.webp`); `designVaultShot3` is
  removed. Light screenshots are allowed (a shot's pixels are image content, not the site's theme).
  Spec `../ui-spec/07-proofs.md` §7.3.1 part 3, §7.6, §7.8 34–37.
- 2026-10-07 — `TakeoverShots` picks its layout from the shot count (two stacked 2:1, or three),
  and shots, positions and alts are paired by index in `lib/proofs.ts`, so a length mismatch fails
  the type check or the build.
- 2026-10-06 — Exile Bot's takeover keeps the three-shot layout (one wide 2:1, two 4:3 details): the
  Exile Bot website home page, the owner dashboard's home view, and the spam and raid protection
  settings page.
- 2026-10-05 — The spam diagram is sample "D" (`temp/spam-diagram-samples.html`): three numbered
  steps (Watches, Spots, Shuts it down) and a dashed return line marked "Temporary". The figure is
  one swappable component (`SpamStepFigure`). It carries no sample names or messages.
- 2026-10-05 — `docs/03-facts.md` gained, with the user's say: the problem Exile Bot solved and what
  it changed; why Design Vault was built; that Design Vault holds UI screens and components, colour
  palettes and fonts only (never photos of real-life things, so the site never says so).
- 2026-10-05 — Copy is written to the six-part shape: Exile Bot's story is "the calculations were
  brought into the chat players already use"; spam protection appears in its showcase part and,
  from 2026-10-06, as a screenshot in the shots part, never in a closing line; Exile Bot has a closing line for all four cards plus the default, Design Vault for the default
  and software-builder only (the other three cards fall back); MARWIX-SKILLS' new slots are `[FILL]`
  markers (it stays hidden). Spec: `../ui-spec/07-proofs.md` §7.3–7.8.
- 2026-10-05 — Deviations from the six-part build (recorded so audits don't flag them): canonical
  `aspect-2/1` / `aspect-4/3` classes; the `ProofProject` type lives in `lib/proofProject.ts`, not
  `content/`; `TakeoverShots` checks `shots` or `alts` length for type narrowing; pill dots carry
  `shrink-0`.
- 2026-10-05 — No length limits (site-wide, see page.md).
- 2026-10-05 — The user confirmed all of Exile Bot's communities are Idle Heroes communities and every Exile
  calculator and simulation is for Idle Heroes.
- 2026-10-05 — Exile's card line, In use row and takeover copy state its real use (in-game calculations
  and simulations for Idle Heroes players in their Discord communities, plus routine moderation
  around the clock); spam protection appears only in the takeover (its showcase part and, from
  2026-10-06, a screenshot in the shots part), never in the card line or In use row. The page may name "Idle Heroes".
- 2026-10-05 — The user corrected the facts: Exile Bot's spam and raid protection is active in the
  communities that use it. `docs/03-facts.md` is updated and the Discord card's "never an offer"
  line about it is removed. Part 5's headline, status pill and paragraph are rewritten to say it's
  live; the layout and the diagram are unchanged.
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
- 2026-09-24 — (takeover template superseded 2026-10-05) Proofs takeover template, the same for every project: (1) top bar "PROJECT 0n / 03 ·
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
- 2026-09-24 — Proofs: MARWIX-SKILLS gets takeover shots like the others (not skipped). Projects
  keep the same structure with optional parts (2026-10-05); the shot count is per project
  (2026-10-07, see above).
- 2026-09-24 — Proofs built: three identical `ProofCard`s and one native `<dialog>` takeover per
  project, driven by the hash (`:target` without JS, `showModal` with JS). Every open takeover
  has a page entry beneath it (a direct load rewrites its entry to #projects and pushes the
  project), so Back, Esc and Close all use `history.back()`; hash parsing never decodes, so a
  malformed URL can't crash the page. The takeover top bar is solid `bg-cream` with an `ink/15`
  hairline (the blurred 85% bar failed contrast).
- 2026-09-24 — The user accepted that the full-screen takeover covers the nav's Book a call while
  a project is open (Close is one tap away). The user will add this to the constitution §3
  themselves; until then audits may flag it (done 2026-10-05: §3 now says each takeover ends with
  its own Book a call).
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
- 2026-09-28 — The card bots' motion pass is built (ui-spec §7.7): they rise with their card's
  reveal (0.9s, `back.out(1.3)`, 0.15s after the card, the cards' own batch and stagger), lean +4°
  and play their prop's act once per hover enter, and breathe/drift/blink/follow the pointer while
  idle, reusing the Process bots' idle and pointer numbers and registry. They pause off screen, in a
  hidden tab, or while a takeover is open (new `lib/watchTakeovers.ts`). Reduced motion: no
  movement, the bot fades in with its card.
- 2026-09-28 — Deviation from ui-spec §7.7's file list (recorded so audits don't flag it): six extra
  lib files — `lib/proofBotMotion.ts`, `lib/proofBotRig.ts`, `lib/proofBotLife.ts`,
  `lib/proofBotActs.ts`, `lib/proofBotFollow.ts` and `lib/watchTakeovers.ts` — keeping one purpose
  per file, matching the Process split.
- 2026-09-28 — User's choice: the card bots' depth is drawn as one flat-shaded side face per visible
  edge, swept by the depth vector (body 3.3 × 4.2 units, props 2.75 × 3.5), replacing the 6-step
  (body) / 5-step (prop) stacked offset copies — the stacked copies read as stair steps and colour
  bands at the two-across card sizes. Side shade is `sideNear` over `sideFar` by facing: right-facing
  100% near, down-facing 20%. `lib/proofBotDepth.ts` now holds only the two depth vectors; the side
  faces are built in the new `lib/proofBotExtrude.ts`. Resolves the stair-line open questions below.

## Open Questions

- **Fact:** the user is adding MARWIX-SKILLS details (BUILT / IN USE) to `docs/03-facts.md`; its
  rows show `[FILL]` until then and can't ship. MARWIX-SKILLS is hidden for now (see Decisions), so
  this doesn't block launch.
- **To build (waiting on the user):** MARWIX-SKILLS' takeover shots (hidden). Design Vault's two
  shots and alts are built in (the alts name no names, values or licences read off the shots).
- **To build (waiting on the user):** a sharper retake of the Exile home page shot (the supplied
  file is 1908×728, about 80px under the 4K slot's width after the crop).
- **To build:** delete the unused `components/home/proofs/SpamStepTile.tsx` and
  `components/icons/EyeIcon.tsx`, `AlertIcon.tsx` and `LockIcon.tsx` (waiting on the user: the delete
  hook lets only the user delete files).
- **To build:** the code-auditor pass on the Exile Bot three-shot, Eva and ink-stage round (runs
  before the push).
- **To build:** `../ui-spec/07-proofs.md` still has stale tile references in §7.3.4, the §7.6
  source-size row, the §7.7 file list and motion rows, §7.5 sizing notes and bullet, and the intro
  paragraph; the ui-designer points them to `07-proofs-spam.md`.
- **Choice:** the ui-designer's open items in ui-spec §7.8 23–33 (Eva crop, step number place, shot
  anchors, source resolution) are built with the spec's first option and await the user's review.
- **Choice:** the lead's screen check found the edges hold without a hairline; recommended: no
  hairline. Awaits the user's yes (ui-spec §7.8 38).
- **Choice:** ui-spec §7.8 39: Design Vault's Fonts alt leaves out licences (not in
  `docs/03-facts.md`); the user can add a licence fact if wanted.
- **Choice:** "no generated art on the site" is not written in the constitution or any doc; does
  the user want it added as a rule (the user's own constitution edit) with the Exile exception?
- **Choice (later):** replace the color-mix shades in `lib/proofBotShades.ts` with named tokens.
- **Note:** after Back on a direct-load takeover, focus isn't returned to the card (minor).
- **Note:** at 1440 the Design Vault proof line wraps to two lines while Exile's takes one, so its
  hairline sits ~16px higher than its neighbour's; not a blocker.
- **To build:** with two cards shown, Exile's right arm comes within ~11px (1440) / ~3px (3840) of
  the Design Vault card at rest, and the hover lean (+4°) pushes it to touch the card's edge at
  1440; fix candidates: a wider column gap, or a cap on the bot's scale when only two are shown.
- **To build:** check the bots' idle cost on a real 4K display and on a phone — each bot has a
  `feDropShadow` filter and a mask, both re-rasterised while it breathes.
- **To build:** ui-spec §7.1's grid line still reads "three across from `lg`" / "MARWIX-SKILLS
  starts row two"; needs updating to the two-shown grid (`proofGridColumns`) now that MARWIX-SKILLS
  is hidden. ui-spec §7.2.1/§7.2.2 still describe the stacked-copy depth steps; need updating to the
  side-face extrusion (`lib/proofBotExtrude.ts`). §7.2.1's "Precomputed, not computed" line is also
  stale: the side faces are now computed on the server from the outlines, not precomputed.
- **To build:** check the Next slide-up and both title morphs (Next and card-open) on a real
  Safari/iPhone before launch — only tested in headless Chromium so far; stacked-modal
  (`showModal()` under an open dialog) behaviour on Safari and Firefox is unverified.
- **To build:** check the band morph on real Safari/iPhone with the other takeover morphs, including
  the `background-clip: text` split, the "Design Vault" descender during the split, and the band's
  grid-area box in Safari.
- **Choice:** the two spec choices taken as recommended (colour split at the edge; `pt-gutter` above
  the band) await the user's review.
- **To build:** the motion pass for the new takeover parts (hooks are in the spec §7.7), parts 5 and
  6 included, then re-test `useTakeoverMotion` (Next from the bottom of the taller takeover).
- **Choice:** the tag "Discord platform" is the copywriter's pick; alternatives "Discord tools"
  and "Gaming communities". The user confirms or picks.
- **Choice:** copy calls for the user on the new takeover text — the Hosting item says "When it
  crashed"; Payments drops "usage metering"; the connections item names no kinds of service; Design
  Vault's software-builder closing line is the weakest of the set. The lead is putting these to the
  user.
- **Choice:** should spam and raid protection now become an offer on the Discord card? The facts
  list it nowhere as an offer; the user's call.
- **Fact:** Design Vault: lessons for its What I learned part (skipped for now).
- **Note:** Design Vault's card line lists "screens, colour palettes and fonts" without components,
  while the new takeover text includes components.
- **To build:** real-device check of the condensing band and the close mid-scroll: touch momentum,
  trackpad, Edge smooth wheel, Safari. At most one frame of Chromium's last smooth-scroll step may
  still show. Safari before 18.2 ignores `scrollbar-gutter`, so with classic scrollbars the content
  could widen by the scrollbar's width during the close.
- **Choice:** the slim ink strip over the spam stage and the closing panel is ink over ink, so its
  edge may read weak; the fix would be a `line` hairline.
- **Choice:** slim title contrast in the band's glow, unchecked by eye on a real screen.
- **Choice:** "Design Vault" wraps to two lines at 360 (strip 76.5px, 22.7% of 640); consider a
  one-line title.
- **Note:** GSAP keeps a permanent per-scroller wheel/scroll cache on the dialog (stable count, no
  public removal).
- **Note:** the condense kill writes ScrollTrigger's internal `rec` field to keep scroll on a
  reduced-motion switch; fragile on a GSAP upgrade.
- **Note:** pre-existing: a wheel during the opening clip scrolls the page under it after close.
- **Note:** close mid-open lands the heading and band ~5px off vertically (seen at 1440 and 360, with
  or without scrolling); not traced to whether it predates this fix.
- **To build:** at 360 with classic 15px scrollbars, the Exile Bot takeover is 9px wider than the
  dialog at rest (scrollWidth 354 vs clientWidth 345, from `li.spam-step` and its figures), so it can
  scroll sideways slightly; overlay scrollbars are fine.
