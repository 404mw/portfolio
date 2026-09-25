// The hero's film grain (ui-spec §2.5): an SVG noise filter over a full-size rect, painted once,
// with no colour values and no JS. Decorative only.
export function HeroGrain() {
  return (
    <svg aria-hidden="true" focusable="false" className="absolute inset-0 size-full opacity-6">
      <filter id="hero-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#hero-grain)" />
    </svg>
  );
}
