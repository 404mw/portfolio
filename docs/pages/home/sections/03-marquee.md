# Marquee

**Last Updated:** 2026-10-08

**The one question:** (transition, no claim)

See `../page.md` for the site-wide index. Spec: `../ui-spec/03-marquee.md`.

## Current State

Marquee is a static server component (`components/home/MarqueeStrip.tsx`, found by
`data-anim="marquee"`) with its motion wired: each of the two sets renders the seven items
(Bookings, Customer messages, Appointment reminders, New enquiries, Order questions, Sales reports,
Websites) twice, because a single run per set went empty on the right at 4K during the -50% loop
(the earlier five items measured ~3896px per set; seven are wider, not re-measured). `marquee-track` loops `xPercent` 0 to -50 at a steady 70px/s, one pass lasting one set's
width ÷ 70, re-measured (keeping position) on resize or font load; it runs in both modes (the
marquee is the one exception that keeps looping under reduced motion). It pauses on hover — eased
over 0.4s in full motion, instant under reduce — and while the strip is off screen or the tab is
hidden. Browser-verified at 360, 1440 and 3840: ~70px/s, the strip fills to the right edge at 4K,
hover stops it, no sideways scroll, same loop under reduced motion.

Placement (built 2026-10-07): the strip renders between Hero and About (`app/page.tsx`), under the
hero's 3° cut. An outer wrapper (`slantDrop`, margin-top −D, padding D/2 top and bottom,
`overflow-clip`) holds the strip, which is 110% wide, offset −5% each side and rotated −3° about
its top edge's centre (`origin-top`), so the top edge lies on the cut; D = 5.2408vw. The hooks
(`marquee`, `marquee-track`, `marquee-set`), the `sr-only` list and `useMarqueeLoop` are
unchanged. With a classic 15px scrollbar the strip's edge is ~0.4px off the cut at each end.
Lead-checked 2026-10-07 at 360, 768, 1440 and 3840 (dev server, headless Edge): no sideways scroll
(scrollWidth = clientWidth), no console errors, top edge on the cut with the loop running, About
starting just under the strip's low left end. Reduced motion and Safari/iPhone not checked.

## Key Files

- `components/home/MarqueeStrip.tsx` — the marquee strip's static markup, `data-anim="marquee"`
  (and the −3° slant inside a clipping wrapper)
- `app/page.tsx` — renders the strip between Hero and About
- `lib/styles.ts` — `slantDrop` (`[--slant-drop:5.2408vw]`), the one class that sets the slant's
  drop D, shared with the hero
- `components/home/MarqueeMotion.tsx` — client component that runs `useMarqueeLoop`, renders
  nothing
- `hooks/useMarqueeLoop.ts` — the loop (speed, resize re-measure, hover/off-screen/tab pausing)
- `components/icons/AsteriskIcon.tsx` — the marquee's drawn asterisk separator

## Decisions

- 2026-10-07 — User's call (mockup option "A1"): the strip moves to between Hero and About and sits
  directly under the hero's slanted edge, rotated −3° to match it, top edge on the hero's cut, not
  covering any of the hero; it's wider than the viewport inside a clipping wrapper so nothing
  scrolls sideways; same angle at every width; items, loop (70px/s, pause on hover/off screen,
  keeps looping under reduced motion) unchanged.

- 2026-10-08 — User's call (`../page.md`): the items are jobs: Bookings, Customer messages, Appointment reminders, New enquiries, Order questions, Sales reports, Websites; accent asterisk separators. Replaces v3's five.
- 2026-09-24 — Marquee decorative contrast: v3's dim look (`muted` at low opacity) on the band
  strip; the strip is `aria-hidden`, with a visually hidden plain list of the same items exposed
  instead.
- 2026-09-24 — Marquee static state: one clipped still row, with no sideways page scroll.
- 2026-09-24 — Marquee separator is the SVG `AsteriskIcon` (`size-8`, `text-accent`), not a typed
  `✳`, which can render as a colour emoji on Apple devices and ignore the accent colour.
- 2026-09-26 — Each marquee set renders its items twice, because a single run per set went empty
  on the right at 4K during the -50% loop.
- 2026-09-26 — Marquee loop: `marquee-track` moves `xPercent` 0 to -50 at a steady 70px/s, re-
  measured on resize or font load (keeping position); pauses on hover (eased 0.4s in full motion,
  instant under reduce) and while off screen or the tab is hidden; found by `data-anim="marquee"`.

## Open Questions

- **Review:** "Specialized agents" and "Enforced Rules" may have been the user's own words; the user confirms they are gone or restores them.
