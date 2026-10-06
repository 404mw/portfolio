// The ledge a bot stands on below `lg` (ui-spec §5.9): the ground line cut to one bot's width,
// 2px of `line` from the body's left edge to the bot column's right edge, its top on the feet.
// Placed against the step's `relative` `<li>`; from `lg` the ground line does this job. Then the
// relay's lit overlay, the ground-lit gradient cut to the ledge (hidden at rest). Decoration only.
// The motion pass writes `process-ledge-lit` only, never `process-ledge`.
export function ProcessLedge() {
  return (
    <div
      aria-hidden="true"
      data-anim="process-ledge"
      className="absolute left-4.5 top-20.25 h-0.5 w-17.5 overflow-hidden bg-line lg:hidden"
    >
      <span
        data-anim="process-ledge-lit"
        className="absolute inset-0 bg-linear-to-r from-accent/0 to-accent opacity-0"
      />
    </div>
  );
}
