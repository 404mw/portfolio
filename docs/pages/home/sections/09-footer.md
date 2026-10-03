# Footer

**Last Updated:** 2026-10-03

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

The footer row also has the "Play with Rix" link (`footer.rixLink`, a `Link` to `/rix`, same style as
the socials), placed between the socials and ©; it is the only entry to `/rix`. The WhatsApp link
goes through `WhatsAppLink`.

The wordmark container is `pointer-events-none`, so all six footer links are clickable at 1440 and
390 (previously blocked on desktop); tracking is `-0.01em`; A R I X sit at their natural width, with
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
- 2026-09-24 — Footer giant MARWIX wordmark (`--text-footer-mark`, Bricolage `wdth` 75, 800): the
  full word is shown, M and W violet, A R I X dim (decorative, `aria-hidden`). Must not cause
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
- 2026-09-26 — The wordmark's letter spacing is loosened from `-0.05em` to `-0.01em`, the tightest
  round value with no glyph overlap: at `tracking-normal` the tightest pair (R–I) had about 0.014em
  gap, measured per letter from a screenshot. The dim letters (A R I X) lose their static
  `max-w-[1em] overflow-x-clip`, which cut R, I and X.
- 2026-09-26 — The wordmark reveal is "wipe in place": every letter holds its final position from
  the start; M and W rise and fade in, then A R I X wipe in left to right with a staggered clip,
  and nothing slides sideways — this supersedes the max-width opening in ui-spec §9.3 and the
  2026-09-26 "motion built" timing line above, because the width opening made M and W drag
  sideways as the gaps opened. Reduced motion is unchanged: the full word fades in.
- 2026-09-27 — User's choice: the dim letters' (A R I X) wipe must visibly ease out. Each letter
  lands longer and softer (about 1.2s, strong ease-out), and the gaps between letters grow across
  the word, so the reveal slows as it finishes. This refines "Wipe in place"; the accents' rise,
  the clip wipe itself and reduced motion (fade only) are unchanged.

- 2026-10-02 — The footer gets a "Play with Rix" link (`footer.rixLink`) to `/rix`; it is the only entry to the route.

## Open Questions

- **Choice:** `docs/01-design-system.md` gives display tracking as −0.015 to −0.045em; the
  wordmark's −0.01em sits just outside. The user to decide: add a wordmark exception to the design
  system, or accept −0.015em with sub-pixel overlap.
- **Choice:** the "Play with Rix" link's place in the row (between the socials and ©) needs the
  user's confirmation.
- **To build:** ui-spec `09-footer.md` §9.1/§9.3 still describe −0.05em, the max-width clip and the
  opening; superseded by this doc's decisions above.
