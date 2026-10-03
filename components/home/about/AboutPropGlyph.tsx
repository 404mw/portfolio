// A poster card's emblem (02a-about-options §2a.B): the same prop Rix holds for that group, framed
// on its own (viewBox 104 21 28 31). Base parts are muted, marks are `band`; on the checked card
// they switch to `on-accent` and `accent`. "Just looking" (no prop) shows the logo's gap eyes.
// Decorative.
import { isBasePart, lookingGlyph, rixProps, type RixPropName } from "@/lib/rixProps";

const baseFill = "fill-muted group-has-checked/card:fill-on-accent";
const markFill = "fill-band group-has-checked/card:fill-accent";

type AboutPropGlyphProps = {
  readonly prop: RixPropName | null;
  readonly className: string;
};

export function AboutPropGlyph({ prop, className }: AboutPropGlyphProps) {
  const parts = prop === null ? lookingGlyph : rixProps[prop].parts;
  return (
    <svg viewBox="104 21 28 31" aria-hidden="true" focusable="false" className={className}>
      {parts.map((part) => (
        <path key={part.d} d={part.d} fillRule="evenodd" className={isBasePart(part) ? baseFill : markFill} />
      ))}
    </svg>
  );
}
