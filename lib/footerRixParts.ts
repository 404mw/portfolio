// The footer Rix's parts (ui-spec/09-footer.md §9.4), both motion modes: found through his own
// hooks, in the shape the shared Rix machinery takes (lib/rixRig.ts `RixParts`), so its moves, typed
// talk, cut and teardown run on him unchanged. He is a light Rix: no walker, shelf, props, acks or
// emote glyphs. Where the shared shape names a part he doesn't have, a part of his own that nothing
// here ever moves stands in: the row is his stage (a cut clears a clip it never carries) and the link
// his walker (never walked) and his button (hover and focus-visible; a press navigates). The lists
// are empty, so no glyph shows and no prop moves. Also the share of the row that counts as "in view".
import { animTargets } from "@/lib/motion";
import { eyeRectsOf, type RixParts } from "@/lib/rixRig";

/**
 * The share of the `footer-rix` row on screen that counts as in view (the first call's trigger, and
 * the first faded line's): his eyes and arms are showing, so a line never types over an unseen Rix.
 */
export const FOOTER_RIX_VIEW = 0.75;

/** The footer Rix under `root` (the `footer-rix` row), or null if a hook is missing. */
export function findFooterRix(root: HTMLElement): RixParts | null {
  const [link] = animTargets(root, "footer-rix-link");
  const svg = link?.querySelector<SVGSVGElement>('svg[data-anim="process-bot"]') ?? null;
  const anchor = link ? animTargets(link, "about-quip-anchor")[0] : undefined;
  const quip = link ? animTargets(link, "about-quip")[0] : undefined;
  if (!link || !svg || !anchor || !quip) return null;
  return {
    root,
    stage: root,
    walker: link,
    button: link,
    svg,
    anchor,
    quip,
    props: [],
    acks: [],
    emotes: {},
    emoteParts: {},
    eyeRects: eyeRectsOf(svg),
  };
}
