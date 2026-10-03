// Rix's quip (02a-about-options §2a.O0.1, ui-spec/00-rix.md R1.3, R5): his current line, floating
// near him in mono. Never a bubble: no background, border or tail. The outer span is the anchor
// (`about-quip-anchor`): it carries the static placement (any translate lives here), and
// motion sets its `data-side` ("left" or "right") as each line starts, which the placement's
// `data-[side=right]:` classes answer (the shelf's). The motion owns the inner `about-quip`, and
// types the line by revealing its `data-quip-char` spans, one per character (plain inline spans,
// so lines still break only at spaces). Hidden until there's a line, so the server markup is
// empty. Decorative: `RixStatus` announces what's announced. `text` sets the line's size
// (`text-nav` by default; the /rix playground's big Rix passes a larger one).
type RixQuipProps = {
  readonly line: string;
  /** Placement classes, inside Rix's own free space, so a quip never moves the layout. */
  readonly placement: string;
  /** The line's text-size classes. */
  readonly text?: string;
};

export function RixQuip({ line, placement, text = "text-nav" }: RixQuipProps) {
  return (
    <span aria-hidden="true" data-anim="about-quip-anchor" className={`pointer-events-none absolute ${placement}`}>
      <span
        data-anim="about-quip"
        className={`block font-mono ${text} leading-snug text-text ${line === "" ? "opacity-0" : ""}`}
      >
        {Array.from(line).map((char, index) => (
          // Keyed by the line too, so every new line gets fresh spans (no inline motion carried over).
          <span key={`${line}:${index}`} data-quip-char="">
            {char}
          </span>
        ))}
      </span>
    </span>
  );
}
