---
name: design-tokens
description: Set up, check, or add marwix.dev design tokens. setup writes the frozen tokens from docs/01-design-system.md into app/globals.css and lib/tokens.ts (once); check finds raw colours and drift between the two files; add introduces a new token only after the user's yes.
argument-hint: "[setup|check|add] <details>"
---

Work the token request: $ARGUMENTS

`docs/01-design-system.md` is the source. `app/globals.css` implements it for CSS. `lib/tokens.ts`
mirrors the colour values only, for OG image generation where CSS variables don't work. **No
other file holds a colour value.**

---

## setup (once, at the start of the build)

The lead briefs `web-coder` to do these steps; this skill is the checklist.

1. **Start from a fresh `app/globals.css`**: the Tailwind import plus an empty `@theme` block.
   Remove any sample colours or fonts the Next.js starter added (for example its default
   background and foreground variables and its default font loaders).
2. **Add every colour token** from the design-system table into Tailwind v4's `@theme` block in
   `app/globals.css`, with the exact names and values. Tailwind then generates utilities such as
   `bg-bg`, `text-muted` and `bg-accent`.
3. **Add the font tokens** (`--font-display`, `--font-body`, `--font-mono`) wired to `next/font`
   loaders for Bricolage Grotesque (variable, `opsz` and `wdth` axes), Geist (400/500/600) and
   Geist Mono (400/500/800).
4. **Write `lib/tokens.ts`:** a `const` object with the same colour names and values, for OG
   images only.
5. Run **check** below. It must come back clean.
6. Report to the lead for `page-doc-manager`: "Tokens set from design system v1."

## check (read-only)

1. Search for raw colours outside the two allowed files:
   ```bash
   grep -rnE "#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|oklch\(" app components content lib --include=*.ts --include=*.tsx --include=*.css | grep -v "app/globals.css" | grep -v "lib/tokens.ts"
   grep -rnE "\b(bg|text|border|ring|fill|stroke|from|via|to|outline|decoration|divide|placeholder|caret|accent|shadow)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-[0-9]{2,3}\b|\b(bg|text|border)-(white|black)\b" app components
   ```
2. **Drift check:** every colour in `lib/tokens.ts` must match the same-named token in
   `app/globals.css`, and both must match `docs/01-design-system.md`.
3. Report each hit as `file:line`, and the drift with both values.

## add (needs the user's yes)

1. Use `AskUserQuestion`. Say what the token is for, why no existing token fits, and the proposed
   value, with one `(Recommended)` option, where reusing an existing token is recommended when it
   can work.
2. Only after a yes: add it to `docs/01-design-system.md`'s table **and** its change log (date and
   reason), then to `app/globals.css`, and to `lib/tokens.ts` if it's a colour.
3. Run **check**.
