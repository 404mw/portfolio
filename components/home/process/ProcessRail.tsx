// A step's piece of the column loop below `xl`: its dot and its loop segment (ui-spec §5.2).
// The segment's right border runs through the dots (forward), its left border is the return.
// The parts are positioned against the step's `li`, so the segment also spans its bottom padding.
import { ChevronUpIcon } from "@/components/icons/ChevronUpIcon";

/** Segment classes per step: 1 turns the return into the forward line, 4 turns it back. */
const segmentClasses = [
  "top-4 bottom-0 border-2 border-b-0 rounded-tl-xl",
  "inset-y-0 border-x-2",
  "inset-y-0 border-x-2",
  "top-0 h-4 border-2 border-t-0 rounded-bl-xl",
] as const;

type ProcessRailProps = { readonly index: number };

export function ProcessRail({ index }: ProcessRailProps) {
  const isMiddle = index === 1 || index === 2;

  return (
    <div aria-hidden="true" className="xl:hidden">
      <span className={`absolute left-1.25 w-5 border-accent ${segmentClasses[index]}`} />
      {isMiddle && (
        <ChevronUpIcon className="absolute left-1.5 top-1/2 size-3 -translate-1/2 text-accent" />
      )}
      <span
        data-anim="process-dot"
        className="relative z-10 mx-auto mt-2 block size-4 rounded-full bg-accent ring-8 ring-accent/15"
      />
    </div>
  );
}
