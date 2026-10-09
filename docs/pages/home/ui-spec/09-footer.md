# §9 Footer: UI spec

**Last Updated:** 2026-10-07 (Rix on the line, §9.4; the "Play with Rix" row link removed; §9.1–§9.3 brought in line with the build).

Shared rules and parts (§0): [`../ui-spec.md`](../ui-spec.md). Page doc: [`../sections/09-footer.md`](../sections/09-footer.md). Rix's character sheet (wins wherever it and this file differ): [`00-rix.md`](00-rix.md).

## 9. Footer (the one question: where else can I find or reach them?)

### 9.1 Layout and classes

```
<footer>                                                     ← no classes of its own (was overflow-hidden border-t border-line pt-10)
  <FooterRix />                                              ← §9.4, above the hairline; not rendered on /rix
  <div class="overflow-hidden border-t border-line pt-10">   ← the full-bleed hairline, the 40px and the clip guard move here
    FooterLinks · FooterWordmark · FooterWordmarkMotion
  </div>
</footer>
```

- Row: `px-gutter` → `{container} flex flex-col items-start gap-6 text-small text-muted md:flex-row md:flex-wrap md:items-center md:justify-between`, three children (the `/rix` link is gone from it, 2026-10-07):
  1. Email: `<a href={links.email}>` `inline-flex min-h-11 items-center text-body-lg text-text hover:text-accent active:text-muted {focusRing}`.
  2. Socials: `<ul class="flex flex-wrap gap-x-6">`, LinkedIn · GitHub · Instagram · Discord · WhatsApp (in that order) as text links (`ExternalLink`; WhatsApp through `WhatsAppLink`): `inline-flex min-h-11 items-center text-body text-text underline decoration-line underline-offset-4 hover:text-accent hover:decoration-accent active:text-accent active:decoration-accent {focusRing}`. Each shows only when its address passes `lib/isFilled.ts` (`lib/socialItems.ts`; text only, no icons).
  3. `<p>`: `©`, `currentYear()` (build time), then `footer.copyrightName`.
- Wordmark (`FooterWordmark`, `aria-hidden`, full bleed, outside the container): `pointer-events-none mt-10 flex w-full justify-center whitespace-nowrap select-none font-display text-footer-mark leading-[0.9]`. Normal tracking, no weight class and no width setting (Acosta has one weight). Six `<span class="block">` letters: M and W `text-accent` (`data-anim="mark-accent"`); A R I X `text-line` (`data-anim="mark-rest"`) at their natural width, with no max-width and no clip. The full word shows in static; its ink spans about 69–70vw, and the wrapper above clips as a guard.

| Element | Default | Hover | Focus-visible | Active |
|---|---|---|---|---|
| Email | `text-text` | `text-accent` | `focusRing` | `text-muted` |
| Social link | `text-text`, `underline decoration-line` | `text-accent decoration-accent` | `focusRing` | `text-accent decoration-accent` |
| © / wordmark | static (the wordmark takes no pointer) | n/a | n/a | n/a |

### 9.2 Sizes

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Hairline → row | 40 | same | same | same |
| Row (email, socials, ©) | stacked, left, gap 24; socials wrap | one row, wraps if needed | one row, spread | one row in 1536 |
| Email / links / © | 16 / 15 / 14px, 44 tall | same | same | same |
| Wordmark (`text-footer-mark`, 17.5vw) | 63px (ink ≈ 250 wide) | 134px (≈ 535) | 252px (≈ 1000) | 672px (≈ 2670) |

### 9.3 Slots, components, images, motion

| Key (`content/shared.ts → footer`) | Meaning | Sizing note |
|---|---|---|
| `footer.social.linkedin` / `.github` / `.instagram` / `.discord` / `.whatsapp` | Link text: the platform's name (addresses in `links.*`, from docs/03-facts.md → Contact) | one word each |
| `footer.copyrightName` | The name after © (facts → Name); © and the year come from code | fixed |
| `footer.wordmark` `{lead, accent, tail}` | The brand (facts → Brand), split so `lib/wordmarkLetters.ts` can mark M and W | fixed |
| `links.emailAddress`, `links.email` | The address shown and its `mailto:` (facts) | fixed |
| `footer.rixLink`, `footer.rixLines` | §9.4 | §9.4 |

- **Components:** `components/SiteFooter.tsx` (changed, §9.1), `FooterLinks.tsx` (the `Link`, `rixPath` and `next/link` imports go), `FooterWordmark.tsx`, `FooterWordmarkMotion.tsx`; `lib/wordmarkLetters.ts`. **Images:** none.
- **Motion (built, "wipe in place", `hooks/useWordmarkReveal.ts`):** once 35% of the footer is in view, M and W rise from `yPercent` 18, scale .9 (0.9s). From 0.35s A R I X wipe in left to right by `clip-path`, 1.3s each on `power4.out` with a 0.9s fade, starting 0, 0.05, 0.2 and 0.45s after the first. Every letter holds its place; only transform, opacity and clip-path move. Reduced motion: all six letters fade in together. Without JS: the full word, still. Detail: the page doc.

### 9.4 Rix on the line (new 2026-10-07; the only entry to `/rix`)

A second, light Rix: he stands on the footer's hairline at the right end of the content width, the label to his left, and both are one link. He stands on `bg`, in flat token fills, never mirrored (R1.1).

```
div data-anim="footer-rix" class="pointer-events-none px-gutter lg:-mt-10 xl:-mt-20"   ← first child of <footer>
└ div class="{container} flex justify-end"
  └ Link href={rixPath} data-anim="footer-rix-link"
         class="group/rix pointer-events-auto inline-flex items-end gap-2 rounded-2xl {focusRing}"
    ├ span class="inline-flex min-h-11 items-center whitespace-nowrap text-body text-text underline decoration-line underline-offset-4
    │             group-hover/rix:text-accent group-hover/rix:decoration-accent group-active/rix:text-accent group-active/rix:decoration-accent"   ← footer.rixLink
    └ span class="relative block h-22 w-34 shrink-0"
      ├ ProcessBot role="host" pose="idle" className="block size-full"    ← as built: aria-hidden, every data-bot hook; no RixProps, no RixEmotes
      └ RixQuip line={the store's line; "" on the server} placement="bottom-full left-1/2 mb-1 w-max max-w-40 -translate-x-1/2 text-center"
```

- **Not clipped:** the unit is in the flow, inside `<footer>` and above the wrapper that now carries the clip, so nothing cuts him, his quip or the focus ring. His box bottom (the feet line, viewBox y 92) is the row's bottom edge, so his feet touch the hairline with no gap.
- **Room above the line:** he needs 128px: the 88px box plus 40px for a two-line quip. The row adds its 88px to the page; from `lg` it is pulled 40px, and from `xl` 80px, up into the last section's bottom padding, which is empty. The quip paints up to 40px above the row, into that same padding, and stays at least 34px clear of Contact's `band` panel at every width (40px at 360). It never covers content, and the row takes no pointer outside the link.
- **On `/rix`:** nothing is rendered: no Rix, no label, no link, no offset (`usePathname() === rixPath` in the client link, so the prerendered `/rix` page has none of it without JS either).

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Rix's box | 136×88 (1 unit = 0.8px), right end of the content width | same | same | same, in 1536 |
| Gap, feet → hairline | 0 | 0 | 0 | 0 |
| Label | 15px, one line, a 44px block at the unit's foot; 176px of room (about 23 characters) | same; room 562 | room 1184 | room 1392 |
| Link (the tap target) | about 240×88 (label + 8 + 136) | same | same | same |
| Quip | above his head, centred on his box, 4px over it; `text-nav` 13px mono, at most 160 wide (about 20 characters a line), two lines ≈ 36 tall; hangs 12px past the box each side, 8px inside the screen edge | same; 19px inside | 44px inside | far inside |
| Row offset | 0 | 0 | −80 (−40 at 1024–1279) | −80 |
| Contact's content → hairline | 168 | 180 | 168 | 168 |
| Quip's top → Contact's panel | 40 | 52 | 40 (34 at 1280) | 40 |

| Part | Default | Hover | Focus-visible | Active |
|---|---|---|---|---|
| Link (label and Rix) | one target, pointer cursor | — | `focusRing` round the whole unit (`rounded-2xl`) | — |
| Label | `text-text`, `underline decoration-line` | `text-accent decoration-accent`, from anywhere on the unit | the unit's ring | `text-accent decoration-accent` |
| Rix | rest pose: the logo silhouette | static: no change. Later: perk and small wave | as hover | no change; the press navigates |

| Key (`content/shared.ts → footer`) | Meaning | Sizing note |
|---|---|---|
| `footer.rixLink` (existing, unchanged) | The visible label and the link's whole name: an invitation to go and play with Rix | one line at 360: about 23 characters |
| `footer.rixLines` (**new**, a list of 5) | Rix's own typed lines, shown in turn above his head: he calls the visitor over to come and play. Playful, his voice as on About, no claims, no facts needed, nothing about what MARWIX does, no ask for a pick. Shown only: never announced, absent without JS, so no line may carry anything the label doesn't | two lines of about 20 characters (about 40); over that, the lead's screen check decides |

- **Accessibility:** one link, one tab stop, the first in the footer. Its name is the label's text alone (the SVG and the quip are `aria-hidden`), so the name matches what is seen. No `RixStatus` and no live region here. Contrast on `bg`: `text` above 16:1, `accent` about 8.6:1. Without JS: Rix still, the label a working link, the quip empty.
- **Components:** new `components/FooterRix.tsx` (server: hands the server-drawn `ProcessBot` to the link) and `components/FooterRixLink.tsx` (client: the `/rix` check, the row, the `Link`, the label, `RixQuip` fed by `lib/rixQuip.ts` under the key `footer-rix`). Reused as they stand: `ProcessBot`, `RixQuip`, `focusRing`, `container`. Not used: `Rix`, `RixButton`, `RixStatus`, `AboutPosterShelf` (a poke button, a walker and About's machinery). **Images:** none.
- **Tokens:** `bg`, `accent`, `text`, `line`; `font-body`, `font-mono`; `text-body`, `text-nav`; `px-gutter`; `rounded-2xl` (the ring's shape). No new token.
- **Motion (later; only moves from `00-rix.md`, constants by name).** Hooks: `footer-rix` (live watch and the first-view trigger), `footer-rix-link` (hover and focus), the bot's `process-bot` and `data-bot` hooks, and `RixQuip`'s `about-quip-anchor`, `about-quip` and `data-quip-char`. No markup change needed.
  - **Idle:** Process life layers 1–4 plus the pointer follow (R2.1 rank 10), `host` numbers, from the first time the unit is live.
  - **First call** (once per load, when `footer-rix` first comes into view): the `perk` beat (`PERK` with the eye pop, ≈ 0.5), then the `wave` beat (`LOOK_AT` look 0, `WAVE` at `BEAT.waveAt` 0.1, ≈ 1.1). Line 1 types from `TALK.afterNudge` 0.3 into the wave (`TALK.char` 0.035, `TALK.pause` 0.14, body talk as R5.2), holds `QUIP_HOLD` 2.4, then `QUIP_OUT`.
  - **Later calls:** `IDLE_TALK.settledGap` (20–30s) after the last line ends: the `wave` beat with the next line, in turn, wrapping, never the same twice in a row.
  - **Between calls:** one glyph-less R6.8 beat (`perk`, `hop` or `look`, never the same twice in a row) `TEMPO.settledGap` (10–15s) after the last act ends; a blocked beat re-checks every `TEMPO.retry` 0.5. Never two acts at once; a beat may run while a line holds.
  - **Hover (fine pointer) or focus-visible on the link:** the hover perk, then `WAVE_SMALL` (≈ 0.74), `REACT_COOLDOWN` 1.2 apart. It cuts a beat (R2.2), never a line. The press plays nothing.
  - **Budgets:** every timer is live time; `lib/watchLive.ts` on `footer-rix` pauses all of it off screen and in a hidden tab. Teardown (leaving for `/rix`) restores the server markup.
  - **Reduced motion:** Rix doesn't move or look. Each line fades whole (0.4 in, 2.4 hold, 0.4 out, R8.1): the first when the unit is first in view, then every `IDLE_TALK.reducedGap` (20–30s). Nothing on hover or focus.
  - **Not here:** the arrival peek, walking, the patrol, the poke ladder, the pet, the tantrum, props, glyphs, the nap, tag, plays, hover mode and any pick logic.

**For the lead's review (each built on the first option):**

1. **His place in the flow:** an in-flow row pulled up by scale steps from `lg` (`lg:-mt-10 xl:-mt-20`), or fully in flow at every width (simpler, but Contact → hairline grows to 248 on desktop), or one `calc()` on the section token (a constant 168, but an arbitrary section value, which §0.1 rules out).
2. **The label:** the footer's underlined text link, or a `chip`. The link was chosen: a chip's border beside the hairline reads as a second box next to him.
3. **The quip's width:** `max-w-40` centred (12px past his box each side, still inside the gutter), or `max-w-34` (never wider than him, about 17 characters a line).
4. **Glyph-less beats only,** so the footer needs no `RixEmotes`; or add it and allow all ten beats.
5. **The wordmark's trigger** stays the `<footer>`, now 88px taller on `/`, so its 35% start comes about 31px later; or move the trigger to the inner wrapper.
