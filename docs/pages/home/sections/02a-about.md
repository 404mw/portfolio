# About

**Last Updated:** 2026-10-03 (the Rix sheet is now the `/rix` playground)

> **Status:** Option B live on /; the Rix playground is built at /rix (`docs/pages/rix/page.md`)

**The one question:** Can he help someone like me?

See `../page.md` for the site-wide index. Spec: `../ui-spec/02a-about.md`.

## Current State

About on `/` is option B, "Poster board" (`app/page.tsx` renders `AboutPosterSection` between Hero
and Marquee, unnumbered). Sample
copy (`content/home.ts` → `about`, marked SAMPLE): local preview only, no deploy, no commit.
`AboutPosterSection` stacks `AboutIntro` (split), the prompt, the shelf with Rix, the poster-card
board and the picked reply's ack, inside `AboutFrame` with home's ids (`lib/aboutScope.ts`).
`RixMotion` (renders nothing) adds the scroll reveal and Rix's play. `RixRunOptions` carries the
scope (section id and radio name) separately from Rix's option and host. Rix now has two hosts only:
home's About (option B, `homeRixOption = "b"` in `hooks/useAboutRix.ts`, against home's ids) and the
`/rix` playground (`RixHost = AboutOption | "playground"`, `lib/rixFeatures.ts`). Home's About has the scroll reveal and Rix's full B play (`lib/rixFull.ts`;
reduced motion `lib/rixFade.ts`, fades only).

Replies are six native radios grouped by `name="about-for"`, the poster cards; the picked reply's
ack shows via CSS `:has`, so picking works with no JavaScript. `TypingBubble` is still used by
Agents' `ChatDemo`.

Lead check 2026-10-02: `/` at 360, 768, 1440 and 3840 has 6 radios named `about-for` and Rix
present; scrollWidth equals the viewport; no tap target under 44px; the patrol moves; a pick checks
the radio and the status line updates; no console errors or warnings; lint green. Re-checked at
360, 768, 1440 and 3840 after the options A/C and chat cleanup: unchanged, no errors.

A pick (via `useAboutPick`, reading the checked radio) sets the Contact row's and footer's WhatsApp
links to that group's message, through the shared `WhatsAppLink` (`components/WhatsAppLink.tsx`,
built on `ExternalLink`, used by `ContactRow`/`ContactLinks` and `FooterLinks`) and
`lib/aboutReplies.ts`'s `aboutWhatsappHref`/`lib/whatsapp.ts`. A `?for=<group>` link is applied
client-side after load (`useAboutFor`/`AboutForParam`): it checks that reply's radio (unless one is
already picked) and dispatches an untrusted `change` event, so the WhatsApp links follow but
`useAboutAnnouncement` (which only reacts to a trusted `isTrusted` change) stays silent and nothing
scrolls. A visitor's own pick does announce the ack via `AboutStatus`'s `aria-live="polite"` region.

The GSAP motion pass for About (spec §2a.7: drop-in, wave, typing, pick pops, status-dot blink) is
not built yet; all `data-anim` hooks are in place but inert.

Rix's character sheet (`ui-spec/00-rix.md`) is built and plays on `/rix`: `RixButton` wraps the host bot
in a `rix-walker` box (its `x` is the walk's only writer, so the focus ring travels with him);
`RixQuip` types a line into one `data-quip-char` span per character inside a placement anchor whose
`data-side` the motion sets ("left"/"right", so the quip flips side on option B's shelf when the
left runs out of room); `RixEmotes` draws hidden `!`/`?` glyphs the motion shows; the host's zzz
group (`ProcessBot`'s `rig.zzz`) is the nap visual. A keyed `LineStore` (`lib/lineStore.ts`) backs
both the quip and `RixStatus`'s live region, keyed by each About instance's section id;
`lib/rixStatus.ts`'s `announceRix` is the one way anything (the flat poke, the poke ladder's
annoyed/angry lines, `throwAway`) announces a line. `lib/aboutDeselect.ts` unchecks a group's radio
and dispatches an untrusted `change`, so a tantrum's toss falls a pick back to the default WhatsApp
message with no focus move or scroll, silently to the pick act and announced once by `RixStatus`.
The motion pass (gsap-animator, built on option B and the `/rix` playground) plays every move from
`ui-spec/00-rix.md` R1–R11 — emotions, shelf walks, typed talk, idle plays, nap, tag, and the full
poke ladder (tantrum, toss plus deselect, flee, sulk, forgive, calm) — with reduced motion keeping
only line and prop fades (the pick deselect still runs under reduced motion). A move along the shelf outside a walk (a resize snap, the tag hop) fades
the current line first; at 360px the quip only goes right when the left side has too little room.

Rix rev 3 (`ui-spec/00-rix.md` rev 3) is built. Static: `RixEmotes` draws the 8 emote glyphs
(alert, question, hearts, sparkle, drop, dots, vein, grawlix) from `lib/rixGlyphs.ts` as hidden
pixel paths, fills from tokens only (`fill-accent` for hearts and grawlix, else `fill-muted`);
`RixButton` blocks the long-press callout (`-webkit-touch-callout: none`). Motion: a stride-locked
gait with no dash (`lib/rixGait.ts`); a card walk reaches at most 200px (`reach` in
`lib/rixMotion.ts`) and stops partway, curious; there is no home, so he patrols the shelf with look
pauses on a crew timer (`lib/rixPatrol.ts`, plays run in the pauses); each emotion's glyph is
animated (`lib/rixGlyphLoops.ts`), and the grawlix shows random symbols in two slots, never a
slot's last one and never the same as the other slot; love (pulsing diamond eyes, rising hearts)
plays from a mouse resting on him ~1.5s or a touch/pen long-press (`lib/rixPet.ts`,
`lib/rixLove.ts`), plus the pick's heart burst. Reduced motion keeps fades only (no patrol). On
option B, only keyboard focus (`:focus-visible`) holds the patrol; a mouse click on a card or Rix
doesn't. The playground has Symbols, Love, Pet and a patrol toggle; Walk home is gone. Status:
build, lint and tsc green. Lead screen check passed 2026-10-02 at 360 and 1440 on option B: no
console errors or warnings (the GSAP "Invalid property at" warning is fixed by `timed()` in
`lib/processBotMotion.ts`, used by eyesTo, rixSulk, rixForgive and rixToss); no sideways scroll;
patrol moves (184px range at 360, 365px at 1440); a far-card walk from standing covers exactly 200px
at about 113px/s with a planted foot slipping at most 0.09px; the pet shows the diamond eyes, hearts
and "Aw, that's nice."; the tantrum grawlix cycles random pairs. The user signed it off.

The `/rix` playground (`docs/pages/rix/`; `components/rix/*`) runs its own Rix on
`section#rix-playground` with every scheduler off (no nudges, plays, nap timer, tag or
walk-to-target) but life and the real poke ladder on; `useRixPlayground` dispatches one typed
command per button (`lib/rixPlayground.ts`'s groups) to `lib/rixPlaygroundMoves.ts`. Lead-checked
2026-10-02 on the earlier `/dev` sheet: on option B a pick then 8 rapid pokes deselects the card,
announces `throwAway`, keeps focus, no sideways scroll at 360/1440.

## Key Files

- `components/home/about/` — AboutIntro, AboutPrompt, AboutAck, AboutFrame, AboutStatus,
  AboutForParam, AboutPropGlyph
- `app/page.tsx` — renders `AboutPosterSection` (option B) for About on `/`
- `components/home/process/ProcessBot.tsx` — the host mascot: the 2D Process bot with the new
  `host` role (`lib/processBots.ts`)
- `components/WhatsAppLink.tsx` — the shared WhatsApp link; its `href` follows an About pick via
  `useAboutPick`, used by Contact's side row and the footer
- `components/TypingBubble.tsx` — the shared typing-dots bubble, used by Agents' `ChatDemo`
- `lib/aboutReplies.ts` — reply ids, the `:has` show-classes, `?for=` lookups, the WhatsApp href and
  the checked-radio/trusted-change helpers
- `lib/whatsapp.ts` — pure wa.me link building, shared with the site's hand-written WhatsApp links
- `hooks/useAboutPick.ts` — the checked reply, read live from the DOM (`useSyncExternalStore`)
- `hooks/useAboutFor.ts` — applies `?for=<group>` once after mount, untrusted so it never announces
  or scrolls
- `hooks/useAboutAnnouncement.ts` — the status text, set only on a visitor's own (trusted) pick
- `content/home.ts` → `about` — the sample copy (heading, mascot name, prompt, six replies each
  with a label/ack/WhatsApp message), marked SAMPLE pending real facts; `about.rix` — the poke-ladder
  lines (`annoyedLines`, `angryLines`, `sulkLine`, `forgiveLine`, `throwAway`)
- `content/rix.ts` — the `/rix` playground's copy (see `docs/pages/rix/page.md`)
- `components/home/about/{Rix,RixButton,RixQuip,RixStatus,RixEmotes,RixProps,RixMotion}.tsx`,
  `components/home/about/poster/` (option B: section, board, card, shelf) — Rix's character-sheet
  parts (walker, quip, status, emote glyphs, props) shared by home's About and the `/rix` playground
- `components/rix/*`, `hooks/useRixPlayground.ts`, `lib/rixPlayground.ts`,
  `lib/rixPlaygroundMoves.ts` — the `/rix` playground (doc: `docs/pages/rix/`)
- `lib/rix*.ts` (`rixEmotions`, `rixStatus`, `rixQuip`, `rixMotion`,
  `rixRig`, `rixFull`, `rixFade`, `rixFadeTantrum`, `rixMood`/`rixAnnoyed`/`rixTantrum`/`rixSulk`/
  `rixForgive`/`rixCalm`/`rixToss`, `rixPlays`/`rixPeek`/`rixPeekaboo`/`rixJuggle`/`rixSit`/
  `rixBalance`/`rixLogoPose`/`rixNap`, `rixWalk`/`rixWander`/`rixFollow`/`rixTrack`/`rixStep`/
  `rixTargets`/`rixTag`, `rixTalk`/`rixQuipMotion`/`rixEmote`, `rixPick`/
  `rixPriority`/`rixVisitor`/`rixFeatures`/`rixActs`/`rixLook`/`rixNudges`) — Rix's full motion
  vocabulary from `ui-spec/00-rix.md` R1–R11, shared by home's About, the `/rix` playground and (later)
  Process
- `lib/rixGlyphs.ts`, `lib/rixGlyphLoops.ts`, `lib/rixGait.ts`, `lib/rixPatrol.ts`, `lib/rixPet.ts`,
  `lib/rixLove.ts` — built: the rev 3 pixel emote glyph geometry and their animated loops, the
  stride-locked gait, the no-home patrol, the pet detector and the love emotion
  (`ui-spec/00-rix.md` rev 3)
- `lib/lineStore.ts` — the keyed text-line store behind the quip and `RixStatus`
- `lib/aboutDeselect.ts` — unchecks an About group's radio and dispatches an untrusted `change`,
  used by the tantrum's toss
- `hooks/{useKeyedLine,useAboutRix,useAboutAnnouncement,useAboutPick,useAboutFor,
  useHydrated}.ts` — the keyed-line reader, and About's Rix/pick/announce/hydration hooks

## Decisions

- 2026-10-01 — About sits right after the Hero: a short "who I am", then the mascot (the user's
  gap-eyes MW character, the same one the Process bots are built from — never Clawd) asks the
  visitor what they do, with tap-to-answer replies plus a "Just looking" option. The page never
  locks or gates on the choice — it loads and works fully without a choice made and without
  JavaScript (the user turned down a full-screen chooser over the hero).
- 2026-10-01 — A `?for=<group>` link can arrive with that reply already picked.
- 2026-10-01 — This round is spec + local preview only, with sample visitor groups and sample
  "who I am" text; the launch is held until About is done.
- 2026-10-01 — About sits right after the Hero, before the Marquee (Hero → About → Marquee →
  Agents). About is unnumbered; Agents–Contact keep 01–05. No nav link for About.
- 2026-10-01 — Picking a reply shows the visitor's reply and the mascot's acknowledgement, and the
  existing WhatsApp links (Contact row, footer) carry that group's default message; no new button,
  Book a call stays the main action. The replies are native radios styled as Contact's chips, working
  via CSS `:has` with no JavaScript; with no pick, the panel shows only the question and chips.
- 2026-10-01 — The intro is a heading plus 1–2 lead lines, setting up the section's skim question
  ("Can he help someone like me?") with "who I am" lines.
- 2026-10-01 — `?for=<group>` is applied client-side after load (the page stays static; no-JS
  visitors get the default view); a pick doesn't change the URL and isn't remembered across reloads.
- 2026-10-01 — The mascot is the 2D Process bot (`lib/processBots.ts`) with a new bare `host` role
  and a wave.
- 2026-10-01 — Sample copy is written by copywriter into `content/home.ts → about`, marked SAMPLE:
  heading "Software that / runs on its own.", mascot "Rix from MARWIX", six replies (small
  business, online community, startup team, agency or freelancer, creator, Just looking), each
  with its own WhatsApp default message ("Just looking" keeps the existing default).
- 2026-10-01 — Rix speaks for the user in the third person by the brand: the acks say "MARWIX
  can…" (the user's own edit, replacing "Muhammad can…"); the "who I am" lines stay in the user's
  first person; the WhatsApp messages are in the visitor's voice. The online-community ack draws
  on Exile's facts (spam, raids, routine moderation).
- 2026-10-01 — The reader is now any of: a small-business owner, a community owner, a founder, an
  agency or a creator (constitution §3 amended 2026-10-01; `docs/04-voice.md` "The reader" matches
  it).
- 2026-10-01 — Built as a static, unnumbered section between Hero and Marquee: native radios shown
  with CSS `:has` (works without JS), with a pick (or `?for=`, applied after load) setting the
  Contact and footer WhatsApp messages through a shared `WhatsAppLink`; the host mascot is the 2D
  `ProcessBot` with the new `host` role. Local preview only: no deploy, no commit.
- 2026-10-01 — About is not a chat: it won't repeat chat UI (bubbles, prompt/typing panel); the
  chatbot is a separate widget to be added later.
- 2026-10-02 — About's A, C and chat builds were removed and the Rix code narrowed to two hosts,
  home's About (option B) and the Rix playground (host `"playground"`, was "sheet"); nothing
  changes on `/` (web-coder).
- 2026-10-02 — The About copy keeps only option B's keys (prompt, `replies[].label/ack/whatsappText`,
  `rix.*`); the playground's copy is `content/rix.ts` (copywriter).
- 2026-10-02 — The user amended constitution §2 to allow one extra route, `/rix`: a public Rix
  playground with its own page doc at `docs/pages/rix/`; it replaced the temporary `/dev` sheet.
- 2026-10-01 — On option B, Rix is playful and invites the visitor to engage: peeks in on arrival
  (replacing the drop-in), can be poked (a giggle bounce and a rotating cheeky line), nudges every
  15–20s while the section is on screen and nothing is picked (stops for good after a pick), looks
  at the hovered/focused reply, and does a group-specific happy act on a pick; reduced motion keeps
  only fades.
- 2026-10-02 — The user picked option B, "Poster board", to replace About. Spec:
  `ui-spec/02a-about-options.md`.
- 2026-10-02 — Before building B's audience picker, Rix is defined once in a shared character
  sheet, `docs/pages/home/ui-spec/00-rix.md` (being written by ui-designer now), used by About
  first and Process later.
- 2026-10-02 — Rix becomes more alive and playful: talking is eyes + body talk (the line types out
  letter by letter in the quip while his body bobs and eyes squish; no mouth is ever added — the
  face stays the logo's gap eyes); in B he walks the shelf to stand above the hovered/focused card;
  idle play includes juggling the card emblems, sitting on the shelf edge with dangling feet,
  napping after long idle and waking with a start, and playing tag with a fine-pointer cursor, plus
  extra plays ui-designer proposes for the user's approval; he has a named set of emotions shown
  with eyes, body, arms and feet only. Reduced motion keeps only fades.
- 2026-10-02 — A "Rix sheet" playground (a button per emotion and move) lets the user review the
  character; it is now the public `/rix` playground.
- 2026-10-02 — User approved the extra idle plays peek-a-boo, logo pose + wink, and balance an
  emblem (foot drum turned down) (`ui-spec/00-rix.md`).
- 2026-10-02 — Rix rev 3, after the user's review of Rix on `/dev` (`ui-spec/00-rix.md` rev 3):
  emote glyphs are pixel glyphs in the mark's style — hearts and the mad grawlix in the accent, the
  rest muted, no emoji; a new 11th emotion, love (pulsing diamond eyes, floating accent hearts),
  triggered by a pet (the pointer resting on him ~1.5s, or a long-press) and by a pick (a heart
  burst over the carried emblem); the walk is a natural stride-locked gait with no dash and no foot
  slide, and a card walk goes at most 200px toward the card; there's no home any more — idle he
  slowly patrols the shelf, pausing to look, with plays during the pauses; the tantrum flee is
  capped at about 400px (stomp 120px) instead of running to the far end. Pet lines (copywriter):
  "Aw, that's nice." / "Okay, don't stop." The playground has Symbols, Love, Pet and a patrol
  toggle; Walk home is removed.
- 2026-10-02 — On option B, only keyboard focus (`:focus-visible`) holds Rix's patrol; a mouse click
  on a card or on Rix doesn't.
- 2026-10-02 — Rix's emotion set gains annoyed and angry via a poke mood ladder: pokes 1–3 happy,
  4–5 annoyed, 6+ within a short window a tantrum (the poke count resets after ~4s quiet). In a
  tantrum he stomps and shakes, runs from the cursor along the shelf, sulks with his back turned
  for about 6s ignoring interactions, then peeks back and forgives with a small wave.
- 2026-10-02 — A pick during his anger calms him down in steps, then plays his pick act. If a card
  was already picked when the tantrum starts, he throws its emblem away and the card is
  deselected: the WhatsApp links fall back to the default message, announced politely to screen
  readers, with no focus move or scroll.
- 2026-10-02 — The poke-ladder lines are sample copy in `content/home.ts` → `about.rix`
  (`annoyedLines`, `angryLines`, `sulkLine`, `forgiveLine`, `throwAway` — the last is
  screen-reader only); Rix speaks as himself, playful, mock-angry but never hostile, no claims.
  The playground's labels are in `content/rix.ts`.
- 2026-10-02 — The Rix playground (`ui-spec/00-rix.md` R10) was built in two passes: web-coder
  builds the static parts (`RixEmotes`'s `!`/`?` glyphs, the host zzz, the walker/quip/status hooks,
  the deselect helper `lib/aboutDeselect.ts`, the playground components), then gsap-animator builds
  every move.
- 2026-10-02 — The user confirmed the tantrum grawlix symbols are legible at Rix's size.
- 2026-10-02 — The user signed off Rix rev 3 and approved option B (Poster board) on `/`:
  home renders `AboutPosterSection` with home's ids, and Rix there runs B's features (`RixMotion`/
  `useAboutRix` split the scope option from the Rix host, which is "b" on home); the old chat
  `AboutSection` is no longer rendered on `/`.

## Open Questions

- **Fact:** the real "who I am" lines and the list of visitor groups (the reply options), plus the
  mascot's name — the user will supply them; until then the preview uses sample text, which must
  be replaced before shipping.
