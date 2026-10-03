// Rix's emote glyphs (ui-spec/00-rix.md R1.3, R3.2): every pixel glyph above his head, drawn last
// inside `upper` (after `RixProps`), from lib/rixGlyphs.ts. Each starts hidden; only motion shows
// one. A one-part glyph is a path; a multi-part glyph is a group of `data-emote-part` paths, some
// of them hidden too. `fill-muted`, or `fill-accent` for the hearts and the grawlix, on `bg`.
// Decorative. Motion hooks: `data-bot="emotes"`, then `data-bot="emote"` with `data-emote`, then
// `data-emote-part`.
import { rixGlyphNames, rixGlyphs, type RixGlyph } from "@/lib/rixGlyphs";

function Glyph({ name, glyph }: { readonly name: string; readonly glyph: RixGlyph }) {
  if ("d" in glyph) {
    return (
      <path d={glyph.d} fillRule="evenodd" data-bot="emote" data-emote={name} className={`${glyph.fill} opacity-0`} />
    );
  }
  return (
    <g data-bot="emote" data-emote={name} className="opacity-0">
      {glyph.parts.map(({ part, d }) => (
        <path
          key={part}
          d={d}
          fillRule="evenodd"
          data-emote-part={part}
          className={glyph.hiddenParts.includes(part) ? `${glyph.fill} opacity-0` : glyph.fill}
        />
      ))}
    </g>
  );
}

export function RixEmotes() {
  return (
    <g data-bot="emotes" aria-hidden="true">
      {rixGlyphNames.map((name) => (
        <Glyph key={name} name={name} glyph={rixGlyphs[name]} />
      ))}
    </g>
  );
}
