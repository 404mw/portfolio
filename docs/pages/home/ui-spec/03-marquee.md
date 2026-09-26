# §3 Marquee: UI spec

Shared rules and parts (§0): [`../ui-spec.md`](../ui-spec.md). Page doc: [`../sections/03-marquee.md`](../sections/03-marquee.md).

## 3. Marquee (transition, no claim)

### 3.1 Layout and classes

- `<div data-anim="marquee" class="overflow-hidden border-y border-line bg-band py-5.5">`, full bleed.
- Visible strip, `aria-hidden="true"`: `<div data-anim="marquee-track" class="flex w-max">` holding
  **two identical sets**, each `<div data-anim="marquee-set" class="flex shrink-0 items-center gap-14 pr-14">`.
  Each set holds the five items **twice in a row** (ten items), so one set alone covers a 3840 viewport.
  Item: `<span class="flex items-center gap-14 font-display font-medium text-marquee leading-none tracking-[-0.02em] whitespace-nowrap text-muted/30 {condensed}">`.
  Inside each item, after the text, a separator `AsteriskIcon` (`components/icons/AsteriskIcon.tsx`, an eight-spoke
  asterisk) with `size-8 shrink-0 text-accent`, `aria-hidden`. Drawn, not a typed `✳`, which can
  show as a colour emoji on Apple devices and ignore the accent colour.
- Screen readers get `<ul class="sr-only">` of the same five items instead.
- Static: one still row starting at the left edge, clipped on the right. Never scrolls sideways.
- Contrast: the strip is decorative (`aria-hidden`), so `muted/30` is exempt; the real list is hidden text.

### 3.2 Sizes

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Strip height | 22 + 40 + 22 = 84 | 84 | 84 | 84 |
| Item text | 40px | 40px | 40px | 40px |
| One pass (5 items) | ~1948px wide | same | same | same |
| One set (2 passes) | ~3896px wide, so one set always covers 3840 and two sets loop seamlessly | same | same | same |

### 3.3 Slots, components, motion

| Key (`content/home.ts → marquee`) | Meaning | Limit |
|---|---|---|
| `marquee.items` (5) | Customer messages, lead follow-up, recurring reports, connected tools, websites end to end (facts: automation and build offers) | 4 words each |

- **Component:** `components/home/MarqueeStrip.tsx`. **Images:** none.
- **Motion (built):** `hooks/useMarqueeLoop.ts`, mounted by `components/home/MarqueeMotion.tsx`
  (renders nothing), which finds the strip by `data-anim="marquee"`. `marquee-track` loops x 0 → −50%
  linearly at a steady **70px/s**: one pass lasts one set's width ÷ 70 (about 56s), re-measured when
  the set's width changes, keeping its place. It keeps looping under reduced motion (the one exception
  in constitution §5). It pauses on hover and resumes on leave: an eased 0.4s slowdown to a stop in
  full motion, instant under reduced motion. It also pauses while the strip is off screen or the tab
  is hidden.
