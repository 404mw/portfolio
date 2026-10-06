// The relay lesson's moves (ui-spec §5.7 layer 10, "The return"; §5.9 below `lg`): the small rule
// card that rides the return back to step 2, "your rules", in a flow that has the return. From `lg`
// it splits off the finished job at the last bot: it pops in off the job's centre and peels up,
// fades out as it leaves (that step's text lies between the bot and the path, so it never flies
// across the words), drops onto the dashed path at the return's start (R0), and at the end scales
// up as it fades. Below `lg` it pops in at the last bot's left hand instead, lifts off it and rides
// up the column's left edge. The rides themselves (the legs, the light, the cues) are timed in
// lib/processRelay.ts (from `lg`) and lib/processRelayColumn.ts (below). The card is anchored at its
// centre (negative margins), so every point here is where its centre goes. Only the relay timeline
// writes it; transforms and opacity only.
import type { gsap } from "@/lib/gsap";
import { LESSON_ENTER, LESSON_LEAVE, LESSON_OUT, LESSON_SPLIT } from "@/lib/processBotMotion";
import type { PointAt } from "@/lib/processRelayJob";

export type LessonParts = {
  /** The lesson SVG (`data-anim="process-lesson"`), anchored at its centre. */
  readonly lesson: SVGSVGElement;
  readonly base: SVGElement | null;
  readonly line: SVGElement | null;
};

/** The lesson's `data-lesson` parts. */
export function findLesson(lesson: SVGSVGElement): LessonParts {
  const one = (name: string) => lesson.querySelector<SVGElement>(`[data-lesson="${name}"]`);
  return { lesson, base: one("base"), line: one("line") };
}

/** Every lesson element, for the strip on revert. */
export function lessonElements(parts: LessonParts): Element[] {
  const written: (Element | null)[] = [parts.lesson, parts.base, parts.line];
  return written.filter((element): element is Element => element !== null);
}

/** Run start (`t`): the lesson is hidden until the last bot is done with the job. */
export function lessonHide(tl: gsap.core.Timeline, lesson: SVGSVGElement, t: number) {
  tl.set(lesson, { opacity: 0 }, t);
}

/**
 * From `t`: the lesson appears at `at`, popping in about its own centre (`LESSON_SPLIT`'s `from`,
 * `duration` and `ease`) as it fades in over its `fade`. Returns when the pop has settled.
 */
export function lessonAppear(tl: gsap.core.Timeline, lesson: SVGSVGElement, at: PointAt, t: number): number {
  const { from, fade, duration, ease } = LESSON_SPLIT;
  tl.set(lesson, { x: () => at().x, y: () => at().y, transformOrigin: "50% 50%", scale: from, opacity: 0 }, t)
    .to(lesson, { opacity: 1, duration: fade, ease: "none" }, t)
    .to(lesson, { scale: 1, duration, ease }, t);
  return t + duration;
}

/**
 * From `t` (from `lg`): the lesson splits off the job at `at` (the sheet's centre), popping in as
 * it peels up off the sheet. Returns the run time at which it leaves.
 */
export function lessonSplit(tl: gsap.core.Timeline, lesson: SVGSVGElement, at: PointAt, t: number): number {
  const { peel, duration, peelEase, hold } = LESSON_SPLIT;
  lessonAppear(tl, lesson, at, t);
  tl.to(lesson, { y: () => at().y - peel, duration, ease: peelEase }, t);
  return t + duration + hold;
}

/** From `t`: a small lift as it fades out, leaving the last bot. Returns when it's hidden. */
export function lessonLeave(tl: gsap.core.Timeline, lesson: SVGSVGElement, t: number): number {
  const { lift, duration, ease } = LESSON_LEAVE;
  tl.to(lesson, { y: `-=${lift}`, opacity: 0, duration, ease }, t);
  return t + duration;
}

/** From `t` (below `lg`): the same small lift, still shown, off the last bot's hand. Returns when it's up. */
export function lessonLift(tl: gsap.core.Timeline, lesson: SVGSVGElement, t: number): number {
  const { lift, duration, ease } = LESSON_LEAVE;
  tl.to(lesson, { y: `-=${lift}`, duration, ease }, t);
  return t + duration;
}

/**
 * At `t` (from `lg`): onto the return path at `at` (R0), dropping in from `LESSON_ENTER.from` px
 * above as it fades in. Returns when it's there.
 */
export function lessonEnter(tl: gsap.core.Timeline, lesson: SVGSVGElement, at: PointAt, t: number): number {
  const { from, duration, ease } = LESSON_ENTER;
  tl.set(lesson, { x: () => at().x, y: () => at().y - from }, t).to(
    lesson,
    { y: () => at().y, opacity: 1, duration, ease },
    t,
  );
  return t + duration;
}

/** At `t`, at the arrowhead (or the rules bot's clipboard): it scales up a little about its centre as it fades out. */
export function lessonOut(tl: gsap.core.Timeline, lesson: SVGSVGElement, t: number) {
  const { scale, duration, ease } = LESSON_OUT;
  tl.to(lesson, { scale, opacity: 0, duration, ease }, t);
}
