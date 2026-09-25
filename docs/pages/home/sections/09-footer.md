# Footer

**Last Updated:** 2026-09-25

**The one question:** Where else can I find/reach them?

See `../page.md` for the site-wide index. Spec: `../ui-spec/09-footer.md`.

## Current State

Footer built: email, filled socials, © + build-time year, then the full-bleed `aria-hidden`
MARWIX wordmark (M and W accent via `lib/wordmarkLetters.ts`, A R I X dim).

## Key Files

- `components/SiteFooter.tsx`, `components/FooterLinks.tsx`, `components/FooterWordmark.tsx` —
  the footer row (email, filled socials, © + build-time year) and the full-bleed `aria-hidden`
  MARWIX wordmark
- `lib/wordmarkLetters.ts` — splits the wordmark into letters, marking M and W as accent

## Decisions

- 2026-09-24 — Social links live in the footer only, as text links, each shown only once filled in
  the facts file (they are not in the nav — see `sections/01-nav.md`).
- 2026-09-24 — Footer row (v3): email on the left; LinkedIn · Instagram · Discord · WhatsApp as
  text links in the middle (each shown only once filled in the facts file); © with the build-time
  year plus the name on the right. It stacks on a phone.
- 2026-09-24 — Footer giant MARWIX wordmark (`--text-footer-mark`, Bricolage `wdth` 75, 800): the
  full word is shown, M and W violet, A R I X dim (decorative, `aria-hidden`). Must not cause
  sideways scroll. Motion (later): v3's scroll reveal (M and W appear, then A R I X slide out);
  per §5, under reduced motion the slide becomes a short opacity fade-in of the full word.
- 2026-09-24 — The nav's social names moved to `footer.social`, and `footer.copyright` became
  `footer.copyrightName`.
- 2026-09-24 — Footer built: email, filled socials, © + build-time year, then the full-bleed
  aria-hidden MARWIX wordmark (M and W accent via `lib/wordmarkLetters.ts`, A R I X dim).

## Open Questions

None.
