// Brief builder (02): the single-select timeline (ui-spec §8.2). Native radios, visually hidden,
// so arrow keys move between options without script; the visible segment follows the radio's
// checked and focus states through `peer-*`. Hover and active only style an unchecked segment,
// so a checked one stays `bg-text text-bg` in every state. The radios are uncontrolled, so a
// choice made before hydration survives it (`useBriefState` reads it back). Hidden without
// JavaScript, where Send can't follow it.
import { briefFieldNames, type Timeline } from "@/lib/brief";
import { metaLabel } from "@/lib/styles";

const segment =
  "grid min-h-11 place-items-center rounded-lg px-2 text-center text-small text-muted peer-not-checked:hover:text-text peer-not-checked:active:bg-line peer-checked:bg-text peer-checked:text-bg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-text";

type TimelineSegmentsProps = {
  readonly legend: string;
  readonly options: readonly Timeline[];
  readonly defaultChecked: Timeline;
  readonly onChange: (timeline: Timeline) => void;
};

export function TimelineSegments({
  legend,
  options,
  defaultChecked,
  onChange,
}: TimelineSegmentsProps) {
  return (
    <fieldset className="noscript:hidden">
      <legend className={`${metaLabel} mb-3.5 uppercase`}>{legend}</legend>
      <div className="grid grid-cols-3 rounded-xl border border-line bg-bg p-1">
        {options.map((option) => (
          <label key={option} className="grid cursor-pointer">
            <input
              type="radio"
              name={briefFieldNames.timeline}
              value={option}
              defaultChecked={option === defaultChecked}
              onChange={() => onChange(option)}
              className="peer sr-only"
            />
            <span className={segment}>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
