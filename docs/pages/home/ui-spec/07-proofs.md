# §7 Proofs: UI spec

Shared rules and parts (§0): [`../ui-spec.md`](../ui-spec.md). Page doc: [`../sections/07-proofs.md`](../sections/07-proofs.md).

## 7. Proofs (the one question: have they built something real that people use?)

### 7.1 Section layout

- Section frame, `id="proofs"`. Inner: `flex flex-col gap-12 md:gap-16 lg:gap-20`.
- Header: `flex flex-wrap items-end justify-between gap-6`: left `flex flex-col gap-7`
  (`SectionLabel`, `SectionHeading size="heading"`); right `<p class="{metaLabel}">` with `proofs.hint`.
- Grid: `<ul class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">`, one `<li>` per project, in the
  order Exile, Design Vault, MARWIX-SKILLS. **The three cards are identical.** Phone: stacked.
  `md`: two across, and MARWIX-SKILLS starts the second row at the same card width, left-aligned.
  `lg` and up: three across.

### 7.2 Card (`ProofCard`, server; one component, one set of inputs)

- **Inputs:** `href` (the project's hash), `number`, `tag`, `title`, `cardLine`, `shot` (an image
  name) and `shotAlt`. The same for all three; no numbers and no variant on any card.
- Each card is one `<a href="#exile">` (`#design-vault`, `#marwix-skills`) with `data-proof-card`,
  `aria-labelledby="{titleId} {openId}"`, and
  `group flex h-full flex-col overflow-hidden rounded-3xl bg-cream text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-text`.
- Shot: `m-2.5 aspect-[16/10] overflow-hidden rounded-xl`, holding `SiteImage`.
- Text: `flex flex-1 flex-col gap-2.5 px-6 pt-5.5 pb-6.5`: meta row `flex justify-between {metaLabel} text-cream-muted`
  (`0n · tag` left; `proofs.open` plus `ArrowUpRightIcon` right, `id={openId}`); title
  `<h3 class="font-display font-semibold text-card leading-none tracking-[-0.03em] {condensed}">`;
  line `text-body leading-[1.45] text-cream-muted`.

| Card part | Default | Hover | Focus-visible | Active |
|---|---|---|---|---|
| Card | `bg-cream text-ink` | title `underline decoration-1 underline-offset-4`; open meta `text-ink` | 2px `outline-text`, 4px offset (on dark) | `bg-cream/90` |

### 7.3 Takeover (`ProjectTakeover`, server markup; `TakeoverController`, client)

- **Element:** one `<dialog id="exile" aria-labelledby={titleId}>` per project (ids from
  `lib/routes.ts`), `fixed inset-0 z-50 m-0 hidden h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain border-0 bg-cream p-0 text-ink open:block [:root:not([data-takeover-js])_&:target]:block`.
  `TakeoverController` sets `data-takeover-js` on `<html>`, which switches the no-JS `:target`
  display off, so with JS only the dialog's `open` state shows it.
- **Behaviour:**
  - The card link sets the hash (a real history entry). `TakeoverController` (`hooks/useHashTakeover.ts`)
    reads the hash on load and on `hashchange`: a project hash calls `showModal()` on its dialog
    (native focus containment; the page behind is inert) and adds `overflow-hidden` to `<html>`.
    The hash is compared raw against the ids, never decoded: a malformed hash means no project.
  - **Every open takeover has a page entry beneath it.** A direct load on a project hash (a shared
    link, `/#design-vault`) rewrites its entry to `#proofs` and pushes the project hash on top, once.
  - **Close** (button), **Esc** (the dialog's `cancel` event, default prevented) and the browser
    **Back** button all end in the same place: `history.back()`. The hash change then closes the
    dialog, and focus returns to that project's card.
  - **Next project** replaces the hash (`location.replace`), so Back always closes rather than
    stepping through projects. It wraps from the last project to the first.
  - Close and Next click handling lives in `lib/takeoverLinks.ts`: Close raises the dialog's
    `cancel` (the Esc path); Next replaces the hash. A modified or non-primary click (new tab, new
    window) keeps the browser default.
  - **No JS:** `:target` shows the dialog; the Close link (`href="#proofs"`) and Back close it,
    and every part is readable.
  - Static: it opens and closes instantly. Screen check: the page doesn't jump on open.
  - The open takeover covers the nav (`z-50` over the header's `z-40`): accepted by the user.
- **Template: seven parts, identical for all three projects, shots included** (inside `data-anim="takeover-content"`):
  1. **Top bar**, `TakeoverTopBar`: `sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-ink/15 bg-cream px-gutter py-3 md:py-4.5 font-mono text-nav text-cream-muted`.
     Solid `bg-cream`, no blur, so its text keeps 4.5:1 over the shots scrolling beneath.
     Left: "PROOF 0n / 03 · tag", uppercase. Right: `TakeoverCloseLink` (client),
     `<a href="#proofs">` with `inline-flex min-h-11 items-center gap-2.5 rounded-full bg-ink px-4 font-mono text-nav font-medium text-cream hover:bg-accent hover:text-on-accent active:bg-accent/80 {focusRingOnCream}`:
     `proofs.takeover.close`, `proofs.takeover.escHint` (`aria-hidden`, `hidden md:inline`), `CloseIcon`.
  2. **Title:** `<h2 class="font-display font-semibold text-takeover leading-[0.88] tracking-[-0.045em] text-ink {condensed}">`.
  3. **Info rows** (`TakeoverInfoRows`): `<dl class="grid grid-cols-[5.5rem_minmax(0,1fr)] content-start gap-x-5 gap-y-3.5 text-body">`,
     labels `<dt class="pt-0.5 font-mono text-meta uppercase text-cream-muted">`: WHAT IT IS, BUILT, IN USE.
     The IN USE `<dd>` holds its line, then `TakeoverStats` when the project has `inUseStats`
     (only Exile does): `<ul class="mt-3 flex flex-wrap gap-x-8 gap-y-3">`, each `<li class="flex flex-col gap-1">`
     with the value `font-display font-semibold text-card leading-none text-ink {condensed}` over the
     label `font-mono text-meta uppercase text-cream-muted`. These are the only numbers in Proofs.
  4. **Summary:** `<p class="text-summary leading-[1.4] tracking-[-0.01em] text-pretty text-ink">`.
     Parts 3 and 4 share `grid gap-10 border-t border-ink/15 pt-8 md:grid-cols-2`.
  5. **Shots** (`TakeoverShots`): `flex flex-col gap-5`: one big `aspect-[2/1] overflow-hidden rounded-3xl`,
     then `grid gap-5 sm:grid-cols-2` of two details `aspect-[4/3] overflow-hidden rounded-3xl`.
  6. **Visit:** `ExternalLink` styled `inline-flex min-h-12 items-center gap-2 self-start rounded-full bg-ink px-6 text-body font-semibold text-cream hover:bg-accent hover:text-on-accent active:bg-accent/80 {focusRingOnCream}`
     with `ArrowUpRightIcon`. Exile → `links.exile` (the only place exile.marwix.dev is linked);
     Design Vault and MARWIX-SKILLS → their GitHub links.
  7. **Next project**, `TakeoverNextLink` (client): `<a href="#design-vault">`,
     `group flex flex-col gap-3 border-t border-ink/15 pt-12 pb-16 {focusRingOnCream}`: label
     `{metaLabel} text-cream-muted uppercase` + `ArrowRightIcon`, then the next title
     `font-display font-semibold text-heading leading-[0.95] tracking-[-0.04em] {condensed} group-hover:text-cream-muted`.
- Content column: `px-gutter` → `{container} flex flex-col gap-10 pt-10 md:gap-14 md:pt-16 lg:gap-18 lg:pt-22`.

### 7.4 Sizes

| Element | Phone 360 | Tablet 768 | Desktop 1440 | 4K 3840 |
|---|---|---|---|---|
| Heading (`text-heading`) | 44px | 64px | 96px | 104px |
| Cards | stacked, 320 wide | 2 across, 343 each; third on row 2 | 3 across, ~429 each | 3 across, ~499 each |
| Card shot (16:10) | 300×188 | 323×202 | ~409×256 | ~479×299 |
| Card title (`text-card`) | 30px | 35px | 44px | 44px |
| Takeover title (`text-takeover`) | 56px | 91px | 148px | 168px |
| IN USE numbers (Exile, `text-card`) | 30px | 35px | 44px | 44px |
| Summary (`text-summary`) | 20px | 22.6px | 26px | 26px |
| Info rows | label col 88 + 20 gap, values 212 | 2 cols with summary | same | same |
| Big shot | 320×160 | 706×353 | 1328×664 | 1536×768 |
| Detail shots | stacked, 320×240 | 343×257 each | 654×490 each | 758×568 each |
| Close / Visit | 44 / 48 tall | same | same | same |

### 7.5 Content slots (`content/home.ts → proofs`; addresses in `content/home.ts → links`)

| Key | Meaning | Limit |
|---|---|---|
| `proofs.number` / `proofs.label` | "04" and the section label | 5 words |
| `proofs.heading.lead` / `.accent` | "Work that runs"-style heading; last word in violet | 6 words in total |
| `proofs.hint` | Tells the reader a card opens | 6 words |
| `proofs.open` | Card meta "Open" | 1 word |
| `proofs.projects.{exile,designVault,marwixSkills}.tag` | One-word kind (facts only) | 2 words |
| `.title` | The project name, as in facts | fixed |
| `.cardLine` | What it does for its users | 12 words |
| `.cardShotAlt` | What's on the card screenshot | 125 characters |
| `.rows.whatItIs` / `.built` / `.inUse` | Facts only; MARWIX-SKILLS BUILT and IN USE stay `[FILL: …]` until the facts file has them | 12 words each |
| `.rows.inUseStats[]` `{value, label}` (Exile only) | "~20" communities and "4k+" commands run, exactly as filled; shown in the takeover's IN USE row | values fixed; labels 2 words |
| `.summary` | What it does for the people who use it | 40 words |
| `.shotAlts[3]` | What's on each takeover screenshot | 125 characters each |
| `.visitLabel` | Visit button text | 3 words |
| `proofs.takeover.proof` / `.close` / `.escHint` / `.next` | "Proof", "Close", "Esc", "Next project" | 2 words each |
| `proofs.takeover.rowLabels.whatItIs` / `.built` / `.inUse` | WHAT IT IS / BUILT / IN USE | 3 words each |
| `links.exile` / `links.designVault` / `links.marwixSkills` | Addresses from facts | fixed |

### 7.6 Images (all through `SiteImage`; `null` placeholders until the user's files arrive; none may ship)

Every project has the same four images: `{project}Card`, `{project}Shot1`, `{project}Shot2` and
`{project}Shot3`, where the project is `exile`, `designVault` or `marwixSkills`.

| Name (`lib/images.ts`) | Where | Ratio | Crop | `sizes` |
|---|---|---|---|---|
| `{project}Card` | Card shot | 16:10 | `object-cover object-top` | `(min-width:1536px) 500px, (min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw` |
| `{project}Shot1` | Takeover big | 2:1 | `object-cover object-top` | `min(100vw, 1536px)` |
| `{project}Shot2`, `{project}Shot3` | Takeover details | 4:3 | `object-cover object-center` | `(min-width:1536px) 760px, (min-width:640px) 50vw, 100vw` |

### 7.7 Components and motion

- **Components:** `components/home/proofs/ProofsSection.tsx`, `ProofCard.tsx`, `ProjectTakeovers.tsx`
  (renders the three dialogs and the controller), `ProjectTakeover.tsx`,
  `TakeoverTopBar.tsx`, `TakeoverInfoRows.tsx`, `TakeoverInfoRow.tsx` (one `<dt>`/`<dd>` pair),
  `TakeoverStats.tsx`, `TakeoverShots.tsx`, `ProjectVisitLink.tsx` (the Visit pill),
  `TakeoverCloseLink.tsx` (client), `TakeoverNextLink.tsx` (client), `TakeoverController.tsx`
  (client, renders nothing); `hooks/useHashTakeover.ts`; `lib/proofs.ts` (project order, ids,
  image names, next project); `lib/takeoverLinks.ts` (Close and Next click handling).
- **Motion (later):** cards reveal on scroll (stagger 0.12s); hover lifts a card −8px. Open: the
  dialog's `clip-path` expands from the card's rect (`data-proof-card`) to full screen (0.75s), and
  `takeover-content` rises 40px and fades in after 0.35s. Close: clip back to the card (0.6s), then
  the hash change. Next: content rises 60px and fades in. Reduced motion: instant.
