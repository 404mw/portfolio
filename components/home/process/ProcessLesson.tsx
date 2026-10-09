// The relay lesson (ui-spec §5.7, §5.9): the cream card that leaves the last bot and rides back to
// step 2: 10px below `wide` (from the last bot's left hand up the bot column's left edge), 14px from `wide` (split off
// the job, along the dashed return path). Drawn finished and hidden at rest. Its anchor is
// the centre (negative margins), so motion owns `transform` alone. Decorative: `aria-hidden`,
// never focusable.
import { lessonBase, lessonLine } from "@/lib/processLesson";

export function ProcessLesson() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-anim="process-lesson"
      viewBox="0 0 14 14"
      className="absolute left-0 top-0 -ml-1.25 -mt-1.25 size-2.5 opacity-0 wide:-ml-1.75 wide:-mt-1.75 wide:size-3.5"
    >
      <path data-lesson="base" d={lessonBase} className="fill-cream" />
      <path data-lesson="line" d={lessonLine} className="fill-accent" />
    </svg>
  );
}
