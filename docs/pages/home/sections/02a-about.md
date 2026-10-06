# About

**Last Updated:** 2026-10-06 (Rix rev 4 built, pick lock look)

> **Status:** In build. Option B (poster board) is live on / with the six per-card replies, the
> two-part ack, four new emblems and the session-remembered pick (built static, 2026-10-03); the
> Rix playground is built at /rix (`docs/pages/rix/page.md`). Copy is still SAMPLE and the user's
> calls are open (see Open Questions).

**The one question:** Can he help someone like me?

See `../page.md` for the site-wide index. Spec: `../ui-spec/02a-about-options.md` (§2a.R, the
redesign; option B as built) and `../ui-spec/02a-about.md` (the old chat spec); the pick and the
tag are in `../ui-spec.md` §0.5–0.6; Rix is `../ui-spec/00-rix.md`.

## Current State

About on `/` is option B, "Poster board" (`app/page.tsx` renders `AboutPosterSection` between Hero
and Marquee, unnumbered). Sample
copy (`content/home.ts` → `about`, marked SAMPLE): local preview only, no deploy, no commit. The
six cards are `about.replies`, keyed service-business, online-store, discord, software-builder,
website and not-sure (labels: Service business, Online store, Discord, Developer or team, I need a
website, Not sure yet); each has a `label`, `ack` and `whatsappText`, and `about.ackSet` is the
shared second ack line. `about.lines` is the intro's "who I am" pair.
`AboutPosterSection` stacks `AboutIntro` (split), the prompt, the shelf with Rix, the poster-card
board and the picked reply's ack, inside `AboutFrame` with home's ids (`lib/aboutScope.ts`).
`RixMotion` (renders nothing) adds the scroll reveal and Rix's play. `RixRunOptions` carries the
scope (section id and radio name) separately from Rix's option and host. Rix now has two hosts only:
home's About (option B, `homeRixOption = "b"` in `hooks/useAboutRix.ts`, against home's ids) and the
`/rix` playground (`RixHost = AboutOption | "playground"`, `lib/rixFeatures.ts`). Home's About has the scroll reveal and Rix's full B play (`lib/rixFull.ts`;
reduced motion `lib/rixFade.ts`, fades only).

The pick is locked only while Rix throws a tantrum (see Rix rev 4 below); at every other time the
section never locks or gates on the choice, and it works fully without a choice and without
JavaScript.

Replies are six native radios grouped by `name="about-for"`, the poster cards; the picked reply's
ack shows via CSS `:has`, so picking works with no JavaScript. `AboutAck` renders one paragraph per
reply, and for the five cards that have their own set in Agents and Process it adds the shared
`about.ackSet` line, hidden without JavaScript (`noscript:hidden`). `TypingBubble` is still used by
Agents' `ChatDemo`.

Emblems: each card has one (`aboutReplyProp` in `lib/aboutReplies.ts`): calendar (service
business), parcel (online store), bubble (Discord), code (developer or team), window (website);
Not sure yet has none. The parcel, bubble, code and window geometry is in `lib/rixProps.ts`
(`RixPropName`); shield, send, report and envelope remain defined but held by no card.

Lead check 2026-10-02: `/` at 360, 768, 1440 and 3840 has 6 radios named `about-for` and Rix
present; scrollWidth equals the viewport; no tap target under 44px; the patrol moves; a pick checks
the radio and the status line updates; no console errors or warnings; lint green. Re-checked at
360, 768, 1440 and 3840 after the options A/C and chat cleanup: unchanged, no errors.

The pick is the checked radio (read by `useAboutPick`). `lib/aboutPick.ts` `pickSet` maps it to a
set (`default` for no pick, an unknown key or Not sure yet, else the card's key), which
`hooks/useShownSet.ts` hands to Agents and Process; `setAboutPick` sets the pick from outside About
(the "Shown for" tag, `?for=`, the memory) by checking the radio and dispatching an untrusted,
bubbling `change`: no focus move, no scroll, the URL is never rewritten. A pick also sets the
Contact row's and footer's WhatsApp links to that card's message, through the shared `WhatsAppLink`
(`components/WhatsAppLink.tsx`, used by `ContactRow`/`ContactLinks` and `FooterLinks`) and
`lib/aboutReplies.ts`'s `aboutWhatsappHref`/`lib/whatsapp.ts`.

Memory (`AboutForParam`, rendered by `AboutFrame`, runs `useAboutRemember` then `useAboutFor`):
every change in the group is written to session storage (`marwix:about-for`, via
`lib/aboutMemory.ts`; nothing checked forgets it). On arrival, a `?for=<card>` link wins the first
time that value differs from the last link applied this visit (`marwix:about-for-link`); otherwise
the remembered pick is applied unless one is already checked. All storage calls are in try/catch.
`useAboutAnnouncement` reacts only to a trusted `change`, so memory, `?for=` and the tag stay
silent; a visitor's own pick announces the ack, plus `ackSet` when the card has its own set, via
`AboutStatus`'s `aria-live="polite"` region.

The "Shown for" tag (`components/home/pick/ShownForTag.tsx`, in Agents and Process) is a native
`<details>` whose summary shows the picked card's emblem and label (or "Everyone"); its list is six
radios in the flow (`ShownForOption`). A choice calls `setAboutPick` inside `lib/holdInView.ts`, so
the tag stays where it was while heights above it change. A pointer choice closes the list and
focuses the summary; an arrow-key choice selects live and keeps it open. `hooks/useCloseOnLeave.ts`
closes the list on a press or focus outside it, and does not count focus falling back to an
ancestor (such as `<main tabindex="-1">` after pressing an unfocusable chip) as leaving, which had
closed the list on mousedown and swallowed pointer choices. After a change made there only the
tag's own live region speaks. It is hidden without JavaScript.

Lead check 2026-10-03 (production build): at 360, 768, 1024, 1440 and 3840 no sideways scroll, no
tap target under 44px and no console errors; `?for=` sets both sections; a tag choice by pointer and
by keyboard sets the pick everywhere; the pick survives a reload; with no JavaScript both sections
render `default` and the tags hide.

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

Rix rev 4 (`ui-spec/00-rix.md` rev 4) is built on home's About; the browser check by the lead is
pending. One idle clock (`lib/rixIdle.ts`) replaces the old play and nudge clocks: busy for the first
6 live minutes with an item every 2-4s, then settled at 10-15s. Each item is one of ten beats
(`lib/rixBeats.ts`, picked by `lib/weightedPick.ts`), a play or a stroll, or an idle chatter line
(`lib/rixIdleTalk.ts`, uncapped; `idleLines` before a pick, `afterPickLines` after one). Hover mode
(`lib/rixHover.ts`, `lib/rixHoverLines.ts`, `lib/rixTargetWatch.ts`): while a card is hovered or
focused he stays lively with in-place beats at it and says that card's `hoverLines` (or
`hoverAnyLines`); after a pick, hovering another card says a `switchLines` line. The pick lock
(`lib/aboutPickLock.ts`) runs from the tantrum's start to the forgive's end, in both motion modes:
it sets `aria-disabled="true"` on the radios (they keep their tab order and focus) and `data-locked`
on the board fieldset, swallows the visitor's own click, Space and arrow keys and any trusted
`change`, and a failsafe unlocks after `PICK_LOCK.max`; `lockLine` and `unlockLine` are announced
(screen-reader only). `AboutPosterBoard.tsx` carries `group/board`; `AboutPosterCard.tsx` dims
unchecked cards to `opacity-60` with a not-allowed cursor and turns the hover and active states off
while the fieldset has `data-locked`; the dim snaps with no transition. Untrusted changes (the
toss's deselect, `?for=`, the memory) still apply while locked. Calm by a pick runs on the `/rix`
playground only. Reduced motion: static Rix, a faded chatter line every 20-30s, faded hover lines,
and the lock still applies.

The `/rix` playground (`docs/pages/rix/`; `components/rix/*`) runs its own Rix on
`section#rix-playground` with every scheduler off (no idle clock, hover mode, nap timer, tag or
walk-to-target) but life and the real poke ladder on; `useRixPlayground` dispatches one typed
command per button (`lib/rixPlayground.ts`'s groups) to `lib/rixPlaygroundMoves.ts`. Lead-checked
2026-10-02 on the earlier `/dev` sheet: on option B a pick then 8 rapid pokes deselects the card,
announces `throwAway`, keeps focus, no sideways scroll at 360/1440.

## Key Files

- `components/home/about/` — AboutIntro, AboutPrompt, AboutAck (the two-part ack), AboutFrame,
  AboutStatus, AboutForParam (memory and `?for=`), AboutPropGlyph
- `app/page.tsx` — renders `AboutPosterSection` (option B) for About on `/`
- `components/home/process/ProcessBot.tsx` — the host mascot: the 2D Process bot with the new
  `host` role (`lib/processBots.ts`)
- `components/WhatsAppLink.tsx` — the shared WhatsApp link; its `href` follows an About pick via
  `useAboutPick`, used by Contact's side row and the footer
- `components/TypingBubble.tsx` — the shared typing-dots bubble, used by Agents' `ChatDemo`
- `lib/aboutReplies.ts` — reply ids, the `:has` show-classes, `?for=` lookups, `aboutReplyProp`
  (each card's emblem), the WhatsApp href and the checked-radio/trusted-change helpers
- `lib/aboutPick.ts` — `pickSet` (pick to set) and `setAboutPick` (set the pick from outside About)
- `lib/aboutMemory.ts` — the visit's session memory (pick and last `?for=` value)
- `lib/holdInView.ts` — keeps an element in place on screen across a swap
- `lib/rixProps.ts` — the emblems' geometry, including the four new ones
- `components/home/pick/` — `ShownForTag`, `ShownForOption`: the "Shown for" tag used by Agents and
  Process
- `hooks/useShownSet.ts` — the set Agents and Process draw (the pick through `pickSet`)
- `hooks/useAboutRemember.ts` — writes every pick change to the session memory
- `hooks/useCloseOnLeave.ts` — closes the tag's list on a press or focus outside it
- `lib/whatsapp.ts` — pure wa.me link building, shared with the site's hand-written WhatsApp links
- `hooks/useAboutPick.ts` — the checked reply, read live from the DOM (`useSyncExternalStore`)
- `hooks/useAboutFor.ts` — applies `?for=<group>` (once per value per visit) or the remembered pick
  after mount, untrusted so it never announces or scrolls
- `hooks/useAboutAnnouncement.ts` — the status text, set only on a visitor's own (trusted) pick
- `content/home.ts` → `about` — the sample copy (heading, mascot name, prompt, six replies each
  with a label/ack/WhatsApp message), marked SAMPLE pending real facts; `about.rix` — the poke-ladder
  lines (`annoyedLines`, `angryLines`, `sulkLine`, `forgiveLine`, `throwAway`) and, with rev 4,
  `idleLines`, `afterPickLines`, `hoverLines`, `hoverAnyLines`, `switchLines`, `lockLine`, `unlockLine`
- `content/rix.ts` — the `/rix` playground's copy (see `docs/pages/rix/page.md`)
- `components/home/about/{Rix,RixButton,RixQuip,RixStatus,RixEmotes,RixProps,RixMotion}.tsx`,
  `components/home/about/poster/` (option B: section, board, card, shelf; the board and card carry the
  locked look) — Rix's character-sheet
  parts (walker, quip, status, emote glyphs, props) shared by home's About and the `/rix` playground
- `components/rix/*`, `hooks/useRixPlayground.ts`, `lib/rixPlayground.ts`,
  `lib/rixPlaygroundMoves.ts` — the `/rix` playground (doc: `docs/pages/rix/`)
- `lib/rix*.ts` (`rixEmotions`, `rixStatus`, `rixQuip`, `rixMotion`,
  `rixRig`, `rixFull`, `rixFade`, `rixFadeTantrum`, `rixMood`/`rixAnnoyed`/`rixTantrum`/`rixSulk`/
  `rixForgive`/`rixCalm`/`rixToss`, `rixPeek`/`rixPeekaboo`/`rixJuggle`/`rixSit`/
  `rixBalance`/`rixLogoPose`/`rixNap`, `rixWalk`/`rixWander`/`rixFollow`/`rixTrack`/`rixStep`/
  `rixTargets`/`rixTag`, `rixTalk`/`rixQuipMotion`/`rixEmote`, `rixLines`, `rixPick`/
  `rixPriority`/`rixVisitor`/`rixFeatures`/`rixActs`/`rixLook`; rev 4 adds `rixIdle`, `rixIdleTalk`,
  `rixBeats`, `rixHover`, `rixHoverLines`, `rixTargetWatch`; `rixPlays` and `rixNudges` are gone) —
  Rix's full motion
  vocabulary from `ui-spec/00-rix.md` R1–R11, shared by home's About, the `/rix` playground and (later)
  Process
- `lib/rixGlyphs.ts`, `lib/rixGlyphLoops.ts`, `lib/rixGait.ts`, `lib/rixPatrol.ts`, `lib/rixPet.ts`,
  `lib/rixLove.ts` — built: the rev 3 pixel emote glyph geometry and their animated loops, the
  stride-locked gait, the no-home patrol, the pet detector and the love emotion
  (`ui-spec/00-rix.md` rev 3)
- `lib/weightedPick.ts` — weighted random choice for the idle beats
- `lib/aboutPickLock.ts` — the pick lock: `aria-disabled` radios, `data-locked` on the board, input
  swallowed while locked, the failsafe unlock
- `lib/lineStore.ts` — the keyed text-line store behind the quip and `RixStatus`
- `lib/aboutDeselect.ts` — unchecks an About group's radio and dispatches an untrusted `change`,
  used by the tantrum's toss
- `hooks/{useKeyedLine,useAboutRix,useAboutAnnouncement,useAboutPick,useAboutFor,
  useHydrated}.ts` — the keyed-line reader, and About's Rix/pick/announce/hydration hooks

## Decisions

- 2026-10-05 — Rix on home's About is livelier (`ui-spec/00-rix.md` rev 4, the user's): for his
  first 6 minutes of live time he does something every 2–4s (beats from existing moves, plays and
  strolls), then every 10–15s; the pointer near the cards no longer pauses him. Replaces the
  2026-10 play clock (first 8s, gap 12–20s) and its "pointer near" skips.
- 2026-10-05 — While a card is hovered or focused he stays lively and talks: in-place beats aimed
  at the card, per-card and generic hover lines encouraging a pick; after a pick, hovering another
  card gets a "switching?" line and idle chatter points at the examples and contact; once the
  tantrum's toss clears the pick, the pre-pick lines return.
- 2026-10-05 — He speaks more: the 4-per-load nudge cap (2026-10-01) is lifted; nudges fold into
  idle chatter (`idleLines`; `nudgeLines` retired).
- 2026-10-05 — Card picks are locked from the tantrum's start until the forgive ends (about
  10–12s, failsafe 16s): `aria-disabled` radios, unchecked cards dimmed to 60% with a not-allowed
  cursor with hover and active states off (the dim snaps), screen readers told at lock and unlock.
  Replaces "a pick is never blocked / calm by a
  pick" (R2.1, R6A.8) on home; calm by pick stays on the playground only.
- 2026-10-05 — Reduced motion: chatter fades in every 20–30s plus hover lines (was one nudge line,
  once); the pick lock still applies.
- 2026-10-05 — Copy (copywriter): `about.rix` gains `idleLines`, `afterPickLines`, `hoverLines`
  (keyed by card), `hoverAnyLines`, `switchLines` and screen-reader-only `lockLine` and
  `unlockLine`; `throwAway` no longer says the visitor can pick again; `pokeLines[4]` reads in both
  pick states.
- 2026-10-01 — About sits right after the Hero: a short "who I am", then the mascot (the user's
  gap-eyes MW character, the same one the Process bots are built from — never Clawd) asks the
  visitor what they do, with tap-to-answer replies plus a "Not sure yet" option. The page never
  locks or gates on the choice — it loads and works fully without a choice made and without
  JavaScript (the user turned down a full-screen chooser over the hero). **Lock clause superseded
  2026-10-05** (picks lock during a tantrum).
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
  visitors get the default view); a pick doesn't change the URL (memory: see 2026-10-03).
- 2026-10-01 — The mascot is the 2D Process bot (`lib/processBots.ts`) with a new bare `host` role
  and a wave.
- 2026-10-01 — Sample copy is written by copywriter into `content/home.ts → about`, marked SAMPLE:
  heading "Software that / runs on its own.", mascot "Rix from MARWIX", six replies, each with
  its own WhatsApp default message (the last keeps the existing default).
- 2026-10-01 — Rix speaks for the user in the third person by the brand: the acks say "MARWIX
  can…" (the user's own edit, replacing "Muhammad can…"); the "who I am" lines stay in the user's
  first person; the WhatsApp messages are in the visitor's voice.
- 2026-10-03 — The reader is one of five audiences, the About cards (constitution §3 as amended;
  `docs/04-voice.md` "The reader" matches it); only the developer is technical.
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
  (replacing the drop-in), can be poked (a giggle bounce and a rotating cheeky line), looks at the
  hovered/focused reply, and does a group-specific happy act on a pick; reduced motion keeps only
  fades. (Idle talk: see 2026-10-05.)
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
- 2026-10-02 — If a card was already picked when the tantrum starts, he throws its emblem away and
  the card is deselected: the WhatsApp links fall back to the default message, announced politely
  to screen readers, with no focus move or scroll. (A pick during anger calms him on the playground
  only; on home picks are locked, see 2026-10-05.)
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
- 2026-10-03 — The six poster cards, in order (key, radio `value` and `?for=` value): Service
  business (`service-business`); Online store (`online-store`); Discord (`discord`); Developer or
  team (`software-builder`); I need a website (`website`); Not sure yet (`not-sure`). Replaces the
  six sample groups (Online community, Agency or freelancer, Startup team, Creator, Just looking),
  including the 2026-10-01 sample-copy line above.
- 2026-10-03 — The fourth card's label is "Developer or team"; its key stays `software-builder`.
- 2026-10-03 — A pick also changes Agents (offers and demos) and Process (the flow), besides the
  ack, Rix's emblem and the WhatsApp message. Nothing else changes (Marquee, Web, Projects, Contact
  stay the same for everyone). Extends the 2026-10-01 pick decision above.
- 2026-10-03 — The ack is two parts: the card's own line, plus one shared `about.ackSet` line in
  Rix's voice (the examples below are now set for you), shown for the five real cards and hidden
  without JavaScript.
- 2026-10-03 — Four new emblems, in the bots' style: parcel (online store), speech bubble
  (Discord), code brackets (developer or team), browser window (website). Not sure yet has none.
- 2026-10-03 — The pick is remembered for the visit (session storage; gone when the tab closes). A
  `?for=` link wins the first time that value is seen in a visit; after that the visitor's own pick
  is remembered. Replaces "a pick isn't remembered across reloads" (2026-10-01) and the built "`?for=`
  is ignored when a card is already picked".
- 2026-10-03 — A "Shown for: …" tag on Agents and Process opens an in-flow list of the six cards and
  switches the pick in place; it is hidden without JavaScript, where both sections show the default
  set.
- 2026-10-03 — Rix's tantrum still deselects the card; Agents and Process then fall back to the
  default.
- 2026-10-03 — Without JavaScript the card's ack still shows via CSS; Agents and Process show the
  default.
- 2026-10-03 — "Not sure yet" and no pick both show the default mix of offers and the default flow.
- 2026-10-03 — Tone: each card's own content (ack, its Agents offers and demos, its Process flow,
  its WhatsApp message) is written in that audience's tone (`docs/04-voice.md` Tone per card); the
  rest of the page keeps one shared voice. The developer tone is peer to peer (app, feature, ship,
  review, production) with no tool, model or stack names (constitution §7.4).
- 2026-10-03 — Cheaper and faster claims for builders use the facts' words with no figure
  (constitution §7.3); the user's figures stay off the site.
- 2026-10-03 — Motion this round: no new motion; all of Rix's motion keeps running unchanged, and
  the four new emblems pop in with no flourish.

## Open Questions

- **Choice:** the intro's "who I am" lines: copywriter wrote option 1 (`about.lines`) and two
  alternatives exist; the user picks (they must speak to builders as well as business owners).
- **Choice:** the "I need a website" label is 4 words against the spec's 3-word label limit; kept
  pending the user's call.
- **Choice:** the four new emblems (parcel, speech bubble, code brackets, browser window) are
  built and need the user's look on screen.
- **To build:** motion left for the motion pass: the four new emblems' own flourishes (`lib/rixPick.ts`
  has no case for them) and the swap and tag fades.
- **Choice:** the user has not confirmed two copy changes: `throwAway` ("Rix threw your pick
  away.") and `pokeLines[4]` ("Fun. Now look down.").
- **To build:** the lead's browser check of Rix rev 4 and the pick lock on `/` (pending).
- **Fact:** the About copy (`content/home.ts` → `about`) is still SAMPLE until the user approves
  the real text.
