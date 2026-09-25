# Marquee

**Last Updated:** 2026-09-25

**The one question:** (transition, no claim)

See `../page.md` for the site-wide index. Spec: `../ui-spec/03-marquee.md`.

## Current State

Marquee is built as a static server component (`components/home/MarqueeStrip.tsx`) per ui-spec
§3, carrying every `data-anim` hook for the GSAP pass: one clipped still row, with no sideways page
scroll.

## Key Files

- `components/home/MarqueeStrip.tsx` — the marquee strip
- `components/icons/AsteriskIcon.tsx` — the marquee's drawn asterisk separator

## Decisions

- 2026-09-24 — Marquee items: v3's five — customer messages, lead follow-up, recurring reports,
  connected tools, websites end to end (facts: automation offer and build offer); copywriter may
  tighten the wording; accent asterisk separators.
- 2026-09-24 — Marquee decorative contrast: v3's dim look (`muted` at low opacity) on the band
  strip; the strip is `aria-hidden`, with a visually hidden plain list of the same items exposed
  instead.
- 2026-09-24 — Marquee static state: one clipped still row, with no sideways page scroll. Motion
  (later): the GSAP pass loops it; per §5 the marquee is the one exception that keeps looping
  under reduced motion, and it pauses on hover in both modes.
- 2026-09-24 — Marquee separator is the SVG `AsteriskIcon` (`size-8`, `text-accent`), not a typed
  `✳`, which can render as a colour emoji on Apple devices and ignore the accent colour.

## Open Questions

None.
