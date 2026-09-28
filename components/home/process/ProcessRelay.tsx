// The crew relay's dot (ui-spec §5.7): a 10px accent dot the motion pass carries along the ground
// line and the return path, from `lg`. Centred on its `x`/`y` by negative margins so the motion
// owns `transform` alone; the glow is built from the accent token. Decorative: hidden (opacity 0)
// until motion shows it, which is also the correct state without JavaScript.
export function ProcessRelay() {
  return (
    <span
      aria-hidden="true"
      data-anim="process-relay"
      className="pointer-events-none absolute left-0 top-0 -ml-1.25 -mt-1.25 hidden size-2.5 rounded-full bg-accent opacity-0 shadow-[0_0_12px_3px_color-mix(in_oklab,var(--color-accent)_55%,transparent)] lg:block"
    />
  );
}
