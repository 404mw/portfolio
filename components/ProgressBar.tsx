// The 2px reading-progress bar above the nav row. Static: empty (scaled to 0), its height
// always reserved. The motion pass scrubs `data-anim="progress"` with page scroll.
export function ProgressBar() {
  return (
    <div
      aria-hidden="true"
      data-anim="progress"
      className="h-0.5 origin-left scale-x-0 bg-accent"
    />
  );
}
