# Proofs

**Last Updated:** 2026-09-25

**The one question:** Have they built something real that people use?

See `../page.md` for the site-wide index. Spec: `../ui-spec/07-proofs.md`.

## Current State

Proofs is reverted to its original layout: label, heading and hint sit above the cards (no split,
nothing pinned), and the cards run in one grid, three across from `lg`, stacked on phone; it's the
one section after the hero without a pinned title. `ProofCard`'s image `sizes` hint is back to the
original `(min-width:1536px) 500px, (min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw`.

Proofs built: three identical `ProofCard`s and one native `<dialog>` takeover per project, driven
by the hash (`:target` without JS, `showModal` with JS). Every open takeover has a page entry
beneath it (a direct load rewrites its entry to `#proofs` and pushes the project), so Back, Esc and
Close all use `history.back()`; hash parsing never decodes, so a malformed URL can't crash the
page. The takeover top bar is solid `bg-cream` with an `ink/15` hairline (the blurred 85% bar
failed contrast).

## Key Files

- `components/home/proofs/` — ProofsSection (label/heading/hint above the cards, no split, not
  pinned; cards three across from `lg`), ProofCard (all three identical), ProjectTakeovers
  (the takeover layer, rendered once after Contact), ProjectTakeover (one project's `<dialog>`),
  TakeoverController (runs `useHashTakeover`), TakeoverTopBar, TakeoverCloseLink,
  TakeoverNextLink, TakeoverInfoRows, TakeoverInfoRow, TakeoverStats (Exile's IN USE numbers),
  TakeoverShots, ProjectVisitLink
- `hooks/useHashTakeover.ts` — opens/closes the takeover `<dialog>`s from the address hash with
  `showModal()`; a direct load on a takeover hash rewrites the entry to `#proofs` and pushes the
  project once, so Esc, Close and Back all resolve through `history.back()`; hash parsing never
  decodes
- `lib/proofs.ts` — the project order/keys, each project's dialog id, image names, two-digit
  number and next-project wraparound
- `lib/takeoverLinks.ts` — Close (raises `cancel`, same path as Esc) and Next (replaces the hash,
  so Back still closes rather than stepping through projects) click handlers

## Decisions

- 2026-09-24 — Proofs: the three real projects only, Exile, Design Vault and MARWIX-SKILLS, as
  cream cards each opening a takeover. Exile's takeover shows its two numbers and is the only
  place linking exile.marwix.dev. No tech stacks, no clients.
- 2026-09-24 — Proof cards are fully identical: one card design and one set of inputs (shot, tag,
  title, card line) for all three projects, in one grid (three across from `lg`, stacked on
  phone). Cream cards (cream/ink/cream-muted), numbered label 04, heading "Work that runs"-style
  (copywriter). Exile's two numbers appear only in its takeover's IN USE row, not on the card.
- 2026-09-24 — Proofs images: the user supplies a card shot plus takeover shots for all three
  projects — Exile, Design Vault and MARWIX-SKILLS. Placeholders are used while building and none
  may ship. All images go through the image helper.
- 2026-09-24 — Proofs takeover template, the same for every project: (1) top bar "PROOF 0n / 03 ·
  tag" plus a Close button; (2) big title; (3) three info rows WHAT IT IS / BUILT / IN USE, facts
  only; (4) one summary paragraph on what it does for its users; (5) shots, one big and two
  details; (6) a Visit button (Exile: exile.marwix.dev, the only
  place it's linked; Design Vault and MARWIX-SKILLS: their GitHub links); (7) "Next project" at
  the bottom.
- 2026-09-24 — Proofs takeover address: opening sets a hash (#exile, #design-vault,
  #marwix-skills) on the same page. The link can be shared and opens straight to that takeover,
  and the browser Back button closes it. Esc and Close also close it. Focus is trapped inside
  while open and returns to the card on close. Static: it opens and closes instantly. Motion
  (later): v3's clip-path expand from the card and collapse back, content rising in, and
  next-project transition.
- 2026-09-24 — Proofs: every project gets the same image set, a card shot plus three takeover
  shots (one big, two details), MARWIX-SKILLS included. All three projects stay identical in
  structure and are kept in sync. This replaces the earlier "skipped for MARWIX-SKILLS" in the
  takeover template.
- 2026-09-24 — Proofs built: three identical `ProofCard`s and one native `<dialog>` takeover per
  project, driven by the hash (`:target` without JS, `showModal` with JS). Every open takeover
  has a page entry beneath it (a direct load rewrites its entry to #proofs and pushes the
  project), so Back, Esc and Close all use `history.back()`; hash parsing never decodes, so a
  malformed URL can't crash the page. The takeover top bar is solid `bg-cream` with an `ink/15`
  hairline (the blurred 85% bar failed contrast).
- 2026-09-24 — The user accepted that the full-screen takeover covers the nav's Book a call while
  a project is open (Close is one tap away). The user will add this to the constitution §3
  themselves; until then audits may flag it.
- 2026-09-25 — The ProofCard image `sizes` hint is back to the original
  `(min-width:1536px) 500px, (min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw` (no longer
  affected by the split/sticky-title pattern, since Proofs doesn't use it).
- 2026-09-25 — User's choice: Proofs is reverted to its original layout. Label, heading and hint
  sit above the cards, the cards are three across from `lg`, and nothing is pinned. Proofs is the
  one section after the hero without a pinned title.

## Open Questions

- **Fact:** the user is adding MARWIX-SKILLS details (BUILT / IN USE) to `docs/03-facts.md`; its
  rows show `[FILL]` until then and can't ship.
- **To build:** Proofs — Exile, Design Vault and MARWIX-SKILLS screenshots (pending from the
  user); 12 shot alt-text `[FILL]` markers (three projects × card + 3 shots) clear when the
  images arrive.
- **Note:** after Back on a direct-load takeover, focus isn't returned to the card (minor).
