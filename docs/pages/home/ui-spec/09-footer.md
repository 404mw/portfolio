# §9 Footer: UI spec

Shared rules and parts (§0): [`../ui-spec.md`](../ui-spec.md). Page doc: [`../sections/09-footer.md`](../sections/09-footer.md).

## 9. Footer (the one question: where else can I find or reach them?)

### 9.1 Layout and classes

- `<footer class="overflow-hidden border-t border-line pt-10">` (full-bleed hairline).
- Row: `px-gutter` → `{container} flex flex-col items-start gap-6 text-small text-muted md:flex-row md:flex-wrap md:items-center md:justify-between`:
  1. Email: `<a href={links.email}>` `inline-flex min-h-11 items-center text-body-lg text-text hover:text-accent {focusRing}`.
  2. Socials: `<ul class="flex flex-wrap gap-x-6">`, LinkedIn · GitHub · Instagram · Discord · WhatsApp (in that order) as
     text `ExternalLink`s, `inline-flex min-h-11 items-center text-body text-text underline decoration-line underline-offset-4 hover:text-accent hover:decoration-accent active:text-accent active:decoration-accent {focusRing}`. Each shows
     only when its address passes `lib/isFilled.ts` (`lib/socialItems.ts` overwritten: text only, no icons, the user's call).
  3. `<p>`: `©`, `currentYear()` (build time, `lib/currentYear.ts`), then `footer.copyrightName`.
- Wordmark (`FooterWordmark`, `aria-hidden`, full bleed, outside the container):
  `mt-10 flex w-full justify-center whitespace-nowrap select-none font-display font-extrabold text-footer-mark leading-[0.78] tracking-[-0.05em] {condensedMark}`.
  Six `<span class="block">` letters: M and W `text-accent` (`data-anim="mark-accent"`); A R I X
  `text-line` (dim) with `max-w-[1em] overflow-x-clip` (`data-anim="mark-rest"`). The full word
  shows in static. It spans about 84vw, so it clears the edges at every width, and the footer clips as a guard.

| Element | Default | Hover | Focus-visible | Active |
|---|---|---|---|---|
| Email | `text-text` | `text-accent` | `focusRing` | `text-muted` |
| Social link | `text-text`, `underline decoration-line` | `text-accent decoration-accent` | `focusRing` | `text-accent decoration-accent` |
| © / wordmark | static | n/a | n/a | n/a |

### 9.2 Sizes

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Row | stacked, left | one row, wraps if needed | one row | one row in 1536 |
| Email / links / © | 16 / 15 / 14px, 44 tall | same | same | same |
| Wordmark (`25vw`) | 90px (~302 wide) | 192px | 360px | 960px |

### 9.3 Slots, components, images, motion

| Key (`content/shared.ts → footer`) | Meaning | Limit |
|---|---|---|
| `footer.social.linkedin` / `.instagram` / `.discord` / `.whatsapp` | Link text: the platform name | 1 word |
| `footer.social.github` | "GitHub": link text; its `links.github` address comes from docs/03-facts.md → Contact | 1 word |
| `footer.copyrightName` | "Muhammad Waqas" (facts → Name); © and year come from code | fixed |
| `footer.wordmark` `{lead, accent, tail}` | "MARWIX" (facts → Brand) as "MAR" / "W" / "IX"; `lib/wordmarkLetters.ts` splits the letters | fixed |
| `links.emailAddress`, `links.email`, `links.*` | Addresses (facts) | fixed |

- **Components:** `components/SiteFooter.tsx`, `FooterLinks.tsx`, `FooterWordmark.tsx`;
  `lib/wordmarkLetters.ts` (splits `footer.wordmark` into single letters: the first letter of
  `lead` (M) and `accent` (W) are violet, the rest dim). **Images:** none.
- **Motion (later):** when 35% of the footer is in view, M and W fade and rise from
  `translateY(18%) scale(.9)`; then A R I X open from `max-width: 0` to `1em` and fade in, staggered
  0.1s. Reduced motion: no rise, scale or opening; the full word (all six letters at full width)
  fades in on the same trigger. Without JS: the full word, still.
