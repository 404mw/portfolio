# Footer

**Last Updated:** 2026-10-07

**The one question:** Where else can I find/reach them?

See `../page.md` for the site-wide index. Spec: `../ui-spec/09-footer.md`.

## Current State

Footer built: email, filled socials, © + build-time year, then the full-bleed `aria-hidden`
MARWIX wordmark (M and W accent via `lib/wordmarkLetters.ts`, A R I X dim). Social links are
body-size (`text-body`), full text colour and underlined in the line colour
(`underline-offset-4`), turning accent on hover or press, so they read as clickable (still no
icons). Order is fixed: LinkedIn, GitHub, Instagram, Discord, WhatsApp, each shown only once its
address in `content/shared.ts` → `links` is filled; all five are now filled and show.
Browser-verified 2026-09-26 at 1440 and 360: all five links are underlined and bright, wrap
on a phone.

The footer row is email, socials, © (no Rix link in it). The WhatsApp link goes through
`WhatsAppLink`.

Rix stands on the footer's top hairline at the right end of the content width (built and
lead-checked 2026-10-07). `SiteFooter` renders `FooterRix` above an inner wrapper that carries the
hairline (`border-t`) and `overflow-hidden`, so he, his quip and the focus ring are never cut. Label
(`footer.rixLink`, underlined text link style) and bot are one `Link` to `/rix`, the only entry;
the link's name is the label alone (bot and quip `aria-hidden`); nothing renders on `/rix`. From `lg`
the row is pulled up (`lg:-mt-10 xl:-mt-20`). The quip (`max-w-40`, centred, above him) types
`footer.rixLines` (five lines, no JavaScript = empty). Motion (ui-spec §9.4, shared Rix machinery):
life and pointer follow from first live; a once-per-load first call (perk, wave, line 1 typed) when
75% of his row is on screen; later calls every `IDLE_TALK.settledGap` with the next line in turn; a
glyph-less beat (`perk`, `hop`, `look`) `TEMPO.settledGap` after each act; perk plus small wave on
hover or focus-visible that never cuts a line. Reduced motion: only whole-line fades. After a return
from `/rix` there is no second first call; the next line comes `IDLE_TALK.first` after he is in view.
Lint, tsc and the production build are green. Edge static check at 360, 768, 1440 and 3840: feet on
the hairline, label to his left, none on `/rix`. With motion at 360 and 1440: line 1 types inside
the screen (8px inside at 360), no sideways scroll (0 overflow at all four widths).

The wordmark container is `pointer-events-none`, so all six footer links are clickable at 1440 and
390 (previously blocked on desktop); tracking is normal (Acosta, 2026-10-07); A R I X sit at their natural width, with
no max-width or clip. The word's ink spans about 69–70vw.

The GSAP motion pass is built as "wipe in place" (`hooks/useWordmarkReveal.ts`): once the footer is
35% in view, M and W rise from `yPercent` 18, scale .9, 0.9s `power3.out`. From 0.35s A R I X wipe
left to right with `clip-path` `inset(-50% 110% -50% -10%)` → `inset(-50% -10% -50% -10%)` (the 10%
side margin stops anti-aliased glyph edges being cut), each on `power4.out` over 1.3s, with a 0.9s
`power2.out` fade, at growing offsets of 0, 0.05, 0.2 and 0.45s after the first letter (a function
stagger, since a stagger object with `ease` also turns each tween's own ease into an ease-in on
GSAP 3.15 — that's what had made the earlier reveal feel flat); the whole wipe lands around 1.8s in.
All inline styles are cleared once it has played. Only transform, opacity and clip-path move, and
frame sampling at 1440/360 showed no letter changing position. Reduced motion: all six letters fade
in together. No sideways scroll at 360/768/1440/3840. Verified 2026-09-27 in Chromium: fast uncover,
long settle, no leftover inline styles; reduced motion unchanged.

## Key Files

- `components/SiteFooter.tsx`, `components/FooterLinks.tsx`, `components/FooterWordmark.tsx` —
  the footer row (email, filled socials, © + build-time year) and the full-bleed `aria-hidden`
  MARWIX wordmark
- `components/FooterWordmarkMotion.tsx` — client, mounts `useWordmarkReveal`, renders nothing
- `hooks/useWordmarkReveal.ts` — the wordmark's reveal: M/W rise in, then A R I X open and fade,
  staggered; reduced motion fades all six letters together
- `components/FooterRix.tsx`, `components/FooterRixLink.tsx` — the second Rix on the top hairline
  and the "Play with Rix" label, one link to `/rix` (hidden on `/rix`); the link holds the quip
- `components/FooterRixMotion.tsx`, `hooks/useFooterRix.ts`, `hooks/useAnimTarget.ts` — client,
  renders nothing; wires the motion to the `footer-rix` row
- `lib/footerRix.ts` (full motion), `lib/footerRixFade.ts` (reduced), `lib/footerRixActs.ts`,
  `lib/footerRixClock.ts`, `lib/footerRixLines.ts` (lines' turn, kept per load),
  `lib/footerRixParts.ts`, `lib/onceInView.ts`, `lib/rixQuip.ts` (`footerRixQuipKey`) — the motion
  runs and the quip store; shared-lib additions: `perkLength`, `beatMove`, `rixEyes` `measure`, a
  `"footer"` host row, `RixParts.button` as `HTMLElement`, exported `eyeRectsOf`
- `content/shared.ts` → `footer.rixLink`, `footer.rixLines` — the label and the five quip lines
- `lib/socialItems.ts` — the fixed social order (LinkedIn, GitHub, Instagram, Discord, WhatsApp)
  and the filter that keeps only entries whose address is filled
- `lib/wordmarkLetters.ts` — splits the wordmark into letters, marking M and W as accent

## Decisions

- 2026-09-24 — Social links live in the footer only, as text links, each shown only once filled in
  the facts file (they are not in the nav — see `sections/01-nav.md`).
- 2026-09-24 — Footer row (v3): email on the left; LinkedIn · Instagram · Discord · WhatsApp as
  text links in the middle (each shown only once filled in the facts file); © with the build-time
  year plus the name on the right. It stacks on a phone.
- 2026-09-26 — Social links are body-size, full text colour and underlined in the line colour
  (turning accent on hover/press, no icons); GitHub sits after LinkedIn (order: LinkedIn, GitHub,
  Instagram, Discord, WhatsApp).
- 2026-09-24 — Footer giant MARWIX wordmark (`--text-footer-mark`, 17.5vw, Acosta since 2026-10-07,
  `leading-[0.9]`): the full word is shown, M and W violet, A R I X dim (decorative, `aria-hidden`). Must not cause
  sideways scroll.
- 2026-09-24 — The nav's social names moved to `footer.social`, and `footer.copyright` became
  `footer.copyrightName`.
- 2026-09-24 — Footer built: email, filled socials, © + build-time year, then the full-bleed
  aria-hidden MARWIX wordmark (M and W accent via `lib/wordmarkLetters.ts`, A R I X dim).
- 2026-09-26 — (superseded by the 2026-09-26 "wipe in place" line below) The GSAP motion pass is
  built (ui-spec §9.3): at 35% in view, M/W rise from `translateY(18%) scale(.9)` (0.9s), then
  A R I X open (max-width 0→1em) staggered 0.1s from 0.8s and fade in staggered from 1.8s; under
  reduced motion all six letters fade in together.
- 2026-09-26 — The footer wordmark is `pointer-events-none`: its oversized glyphs overflowed
  upward over the links row and swallowed hover/click on the footer links at desktop widths.
- 2026-09-26 — The dim letters (A R I X) have no static `max-w-[1em] overflow-x-clip`, which cut
  R, I and X. (Letter spacing is now normal, per the 2026-10-07 Acosta swap.)
- 2026-09-26 — The wordmark reveal is "wipe in place": every letter holds its final position from
  the start; M and W rise and fade in, then A R I X wipe in left to right with a staggered clip,
  and nothing slides sideways — this supersedes the max-width opening in ui-spec §9.3 and the
  2026-09-26 "motion built" timing line above, because the width opening made M and W drag
  sideways as the gaps opened. Reduced motion is unchanged: the full word fades in.
- 2026-09-27 — User's choice: the dim letters' (A R I X) wipe must visibly ease out. Each letter
  lands longer and softer (about 1.2s, strong ease-out), and the gaps between letters grow across
  the word, so the reveal slows as it finishes. This refines "Wipe in place"; the accents' rise,
  the clip wipe itself and reduced motion (fade only) are unchanged.

- 2026-10-02 — The footer gets a "Play with Rix" link (`footer.rixLink`) to `/rix`, the only entry to the route; its placement in the row is superseded by the 2026-10-07 line below.
- 2026-10-07 — User's call: the "Play with Rix" text link leaves the footer row; the entry to `/rix` is recreated on the footer's top hairline: a light second Rix stands on the line at the right end of the content width with the visible "Play with Rix" label to his left (one link to `/rix`, still the only entry); he types short rotating lines above his head (`footer.rixLines`, five lines, decorative, no claims) and, in a later motion pass, waves plus a few small existing moves; the whole unit is hidden on `/rix`. Why: the user wanted Rix himself to call the visitor to play rather than a plain text link. Spec: `../ui-spec/09-footer.md` §9.4.
- 2026-10-07 — Lead's calls on §9.4's review points: the in-flow row is pulled up from `lg` (`lg:-mt-10 xl:-mt-20`); the label is the footer's underlined text link, not a chip; the quip is `max-w-40` and centred; glyph-less beats only (no RixEmotes); the wordmark's reveal trigger stays the `<footer>`.
- 2026-10-07 — gsap-animator: the footer Rix runs on the shared Rix machinery with no forked move: a once-per-load first call, then a call every `IDLE_TALK.settledGap`, glyph-less beats between, hover/focus perk; so Rix himself calls the visitor to `/rix`.

## Open Questions

- **To build:** `docs/pages/home/ui-spec.md` index still needs §0.1 (the clip is on the footer's inner wrapper), a §10 "Footer Rix (§9.4)" bullet and a Tokens note (ui-designer).
- **Choice:** line 1 wraps to "Psst. Come play with / me." (one orphan word) at the quip's width: keep, or copywriter shortens or reshapes it.
- **To build:** browser checks not yet done for the footer Rix: hidden-tab pause, real pointer/touch/keyboard, no-JS, Safari/Firefox.
