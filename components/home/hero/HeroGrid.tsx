// The hero's faint 64px background grid (ui-spec §2.1, layer 1). Decorative only.
export function HeroGrid() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--color-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-line)_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-40"
    />
  );
}
