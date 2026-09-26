# Marquee

**Last Updated:** 2026-09-26

**The one question:** (transition, no claim)

See `../page.md` for the site-wide index. Spec: `../ui-spec/03-marquee.md`.

## Current State

Marquee is a static server component (`components/home/MarqueeStrip.tsx`, found by
`data-anim="marquee"`) with its motion wired: each of the two sets renders the five items twice
(~3896px per set), because a single run per set went empty on the right at 4K during the -50%
loop. `marquee-track` loops `xPercent` 0 to -50 at a steady 70px/s, one pass lasting one set's
width ÷ 70, re-measured (keeping position) on resize or font load; it runs in both modes (the
marquee is the one exception that keeps looping under reduced motion). It pauses on hover — eased
over 0.4s in full motion, instant under reduce — and while the strip is off screen or the tab is
hidden. Browser-verified at 360, 1440 and 3840: ~70px/s, the strip fills to the right edge at 4K,
hover stops it, no sideways scroll, same loop under reduced motion.

## Key Files

- `components/home/MarqueeStrip.tsx` — the marquee strip's static markup, `data-anim="marquee"`
- `components/home/MarqueeMotion.tsx` — client component that runs `useMarqueeLoop`, renders
  nothing
- `hooks/useMarqueeLoop.ts` — the loop (speed, resize re-measure, hover/off-screen/tab pausing)
- `components/icons/AsteriskIcon.tsx` — the marquee's drawn asterisk separator

## Decisions

- 2026-09-24 — Marquee items: v3's five — customer messages, lead follow-up, recurring reports,
  connected tools, websites end to end (facts: automation offer and build offer); copywriter may
  tighten the wording; accent asterisk separators.
- 2026-09-24 — Marquee decorative contrast: v3's dim look (`muted` at low opacity) on the band
  strip; the strip is `aria-hidden`, with a visually hidden plain list of the same items exposed
  instead.
- 2026-09-24 — Marquee static state: one clipped still row, with no sideways page scroll.
- 2026-09-24 — Marquee separator is the SVG `AsteriskIcon` (`size-8`, `text-accent`), not a typed
  `✳`, which can render as a colour emoji on Apple devices and ignore the accent colour.
- 2026-09-26 — Each marquee set renders the five items twice (~3896px), because at ~1948px per set
  the strip went empty on the right at 4K during the -50% loop.
- 2026-09-26 — Marquee loop: `marquee-track` moves `xPercent` 0 to -50 at a steady 70px/s, re-
  measured on resize or font load (keeping position); pauses on hover (eased 0.4s in full motion,
  instant under reduce) and while off screen or the tab is hidden; found by `data-anim="marquee"`.

## Open Questions

None.
