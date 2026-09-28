// The relay lesson's vector geometry (ui-spec §5.7): the small card that splits off the job at bot 4
// and rides the dashed return path back to bot 1. A 14 × 14 cream card with its top-right corner cut
// at 45° by 3, echoing the job, carrying one violet line, like a page from bot 4's rulebook.
// 1 unit = 1px; the viewBox is `0 0 14 14`. Hardcoded from the spec.

/** The card's outline. */
export const lessonBase = "M0 0H11L14 3V14H0Z";

/** The card's one violet line. */
export const lessonLine = "M2.5 5.5h9v2.5h-9Z";
