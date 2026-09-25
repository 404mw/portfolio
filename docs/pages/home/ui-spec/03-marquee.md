# §3 Marquee: UI spec

Shared rules and parts (§0): [`../ui-spec.md`](../ui-spec.md). Page doc: [`../sections/03-marquee.md`](../sections/03-marquee.md).

## 3. Marquee (transition, no claim)

### 3.1 Layout and classes

- `<div class="overflow-hidden border-y border-line bg-band py-5.5">`, full bleed.
- Visible strip, `aria-hidden="true"`: `<div data-anim="marquee-track" class="flex w-max">` holding
  **two identical sets**, each `<div data-anim="marquee-set" class="flex shrink-0 items-center gap-14 pr-14">`.
  Items: `font-display font-medium text-marquee leading-none tracking-[-0.02em] whitespace-nowrap text-muted/30 {condensed}`.
  After each item, a separator `AsteriskIcon` (`components/icons/AsteriskIcon.tsx`, an eight-spoke
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
| One set | ~2400px wide, so two sets always overfill 3840 | same | same | same |

### 3.3 Slots, components, motion

| Key (`content/home.ts → marquee`) | Meaning | Limit |
|---|---|---|
| `marquee.items` (5) | Customer messages, lead follow-up, recurring reports, connected tools, websites end to end (facts: automation and build offers) | 4 words each |

- **Component:** `components/home/MarqueeStrip.tsx`. **Images:** none.
- **Motion (later):** `marquee-track` moves x 0 → −50% linearly (~28s), looping. It keeps looping
  under reduced motion (the one exception in constitution §5). In both modes it pauses while the
  strip is hovered and resumes on leave.
