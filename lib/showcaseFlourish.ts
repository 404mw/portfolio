// Rix's prop flourish in the showcase diagram (ui-spec/07-proofs-spam.md, Motion (later) and rev
// 2), once, as his step lights: `palette` tilts −8° and back, `prompt`'s caret (`data-prop-part`)
// blinks twice, `picture` pops 0.9 → 1. It writes only on the held prop (`data-bot="prop"`) and
// its caret, never on his other hooks. Full motion only.
// Pivots come from lib/rixProps.ts in the prop's own units (118 50, the caret 121.5 40), never
// measured. The prop is drawn inside the showcase hold's nested `<svg>` (lib/showcaseFigures.ts),
// and GSAP's `svgOrigin` is read in the element's own user space (it inverts only the element's
// own `transform`, not its ancestors'), which inside that viewport is the prop's own units. So
// the shared pivots hold as they are; the figure's (118 71 / 123.25 56) would be wrong here.
import { gsap } from "@/lib/gsap";
import { rixProps, type RixPropName } from "@/lib/rixProps";
import { CARET_BLINK, PALETTE_TILT, PICTURE_POP } from "@/lib/showcaseMotion";

/** A held prop in a showcase figure: its group, its name and its caret (the `prompt` only). */
export type ShowcaseProp = {
  readonly group: SVGGElement;
  readonly name: RixPropName;
  readonly caret: SVGElement | null;
};

const isPropName = (name: string | undefined): name is RixPropName => name !== undefined && name in rixProps;

/** The prop Rix holds inside `figure`, or null (Eva's figures hold none). */
export function showcaseProp(figure: Element): ShowcaseProp | null {
  const group = figure.querySelector<SVGGElement>('[data-bot="prop"]');
  const name = group?.dataset.prop;
  if (!group || !isPropName(name)) return null;
  return { group, name, caret: group.querySelector<SVGElement>('[data-prop-part="caret"]') };
}

/** The prop's first pivot as an `svgOrigin`, in its own units. */
const pivotOf = (name: RixPropName) => (rixProps[name].pivots[0] ?? [118, 50]).join(" ");

/** Adds `prop`'s flourish to `tl` at `at`. Each one ends at rest. */
export function addFlourish(tl: gsap.core.Timeline, prop: ShowcaseProp, at: number): void {
  const { group, name, caret } = prop;
  switch (name) {
    case "palette": {
      const t = PALETTE_TILT;
      tl.set(group, { svgOrigin: pivotOf(name) }, at)
        .to(group, { rotation: t.angle, ...t.out }, at)
        .to(group, { rotation: 0, ...t.back }, at + t.out.duration);
      return;
    }
    case "prompt": {
      if (!caret) return;
      const b = CARET_BLINK;
      for (let i = 0; i < b.blinks; i += 1) {
        const off = at + i * 2 * b.beat;
        tl.to(caret, { opacity: 0, duration: b.cut, ease: "none" }, off).to(
          caret,
          { opacity: 1, duration: b.cut, ease: "none" },
          off + b.beat,
        );
      }
      return;
    }
    case "picture": {
      const p = PICTURE_POP;
      tl.set(group, { svgOrigin: pivotOf(name) }, at)
        .to(group, { scale: p.scale, ...p.down }, at)
        .to(group, { scale: 1, ...p.up }, at + p.down.duration);
      return;
    }
    default:
      return;
  }
}
