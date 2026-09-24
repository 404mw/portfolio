// The loop drawn as a ring from `xl` (ui-spec §5.3): the circle, four arrowheads pointing
// clockwise, four dots at the quarter points, the loop label in the centre, and a hidden
// runner for the motion pass. Decorative: the steps themselves are the list beside it.
import { process } from "@/content/home";
import { metaLabel } from "@/lib/styles";

/** Arrowheads between the steps: position on the circle and the clockwise tangent angle. */
const arrowTransforms = [
  "translate(85.36 14.64) rotate(45)",
  "translate(85.36 85.36) rotate(135)",
  "translate(14.64 85.36) rotate(225)",
  "translate(14.64 14.64) rotate(315)",
] as const;

/** Dots at the quarter points, clockwise from the top. */
const dotPositions = [
  "left-1/2 top-0 -translate-1/2",
  "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
  "left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2",
  "left-0 top-1/2 -translate-1/2",
] as const;

export function ProcessRing() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 m-auto hidden size-72 xl:block 2xl:size-80"
    >
      <svg viewBox="0 0 100 100" className="size-full overflow-visible text-accent">
        <path
          data-anim="process-path"
          d="M50 0 A50 50 0 0 1 50 100 A50 50 0 0 1 50 0"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
        />
        {arrowTransforms.map((transform) => (
          <path key={transform} d="M-3 -3 L2.5 0 L-3 3 Z" transform={transform} fill="currentColor" />
        ))}
      </svg>
      {dotPositions.map((position) => (
        <span
          key={position}
          data-anim="process-dot"
          className={`absolute size-4 rounded-full bg-accent ring-8 ring-accent/15 ${position}`}
        />
      ))}
      <p
        className={`absolute inset-0 m-auto grid max-w-32 place-items-center text-center ${metaLabel} uppercase`}
      >
        {process.loopLabel}
      </p>
      <span
        data-anim="process-runner"
        className="absolute left-1/2 top-0 hidden size-3 -translate-1/2 rounded-full bg-text"
      />
    </div>
  );
}
