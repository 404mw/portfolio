// The brief builder's choices (ui-spec §8.2): pressed needs, the timeline and the typed text.
// Starts from `defaultBrief`, so the server markup and the first client render match. The radios
// and the textarea are uncontrolled, so React never overwrites them; on mount the hook reads what
// the reader already picked or typed before hydration from the form, so Send follows it.
import { useEffect, useState, type RefObject } from "react";
import {
  briefFieldNames,
  defaultBrief,
  isTimeline,
  toggleNeed,
  type BriefChoices,
  type Need,
  type Timeline,
} from "@/lib/brief";

function readForm(form: HTMLFormElement, prev: BriefChoices): BriefChoices {
  const timeline = form.elements.namedItem(briefFieldNames.timeline);
  const repeat = form.elements.namedItem(briefFieldNames.repeat);
  const timelineValue = timeline instanceof RadioNodeList ? timeline.value : "";
  return {
    ...prev,
    timeline: isTimeline(timelineValue) ? timelineValue : prev.timeline,
    repeat: repeat instanceof HTMLTextAreaElement ? repeat.value : prev.repeat,
  };
}

export function useBriefState(formRef: RefObject<HTMLFormElement | null>) {
  const [brief, setBrief] = useState<BriefChoices>(defaultBrief);

  useEffect(() => {
    const form = formRef.current;
    if (form) setBrief((prev) => readForm(form, prev));
  }, [formRef]);

  return {
    brief,
    toggle: (need: Need) => setBrief((prev) => ({ ...prev, needs: toggleNeed(prev.needs, need) })),
    setTimeline: (timeline: Timeline) => setBrief((prev) => ({ ...prev, timeline })),
    setRepeat: (repeat: string) => setBrief((prev) => ({ ...prev, repeat })),
  };
}
