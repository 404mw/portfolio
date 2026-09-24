// Brief builder (01): the multi-select need chips (ui-spec §8.2). Each chip is a toggle button;
// a pressed chip shows a tick, so its state isn't shown by colour alone. Hidden without
// JavaScript, where the buttons can't toggle.
import { CheckIcon } from "@/components/icons/CheckIcon";
import type { Need } from "@/lib/brief";
import { focusRing, metaLabel } from "@/lib/styles";

const chipBase = `inline-flex min-h-11 items-center gap-2 rounded-full border px-4.5 text-body ${focusRing}`;
const chipPressed = "border-accent bg-accent text-on-accent";
const chipUnpressed = "border-line text-muted hover:border-muted hover:text-text active:bg-line";

type NeedChipsProps = {
  readonly legend: string;
  readonly options: readonly Need[];
  readonly pressed: readonly Need[];
  readonly onToggle: (need: Need) => void;
};

export function NeedChips({ legend, options, pressed, onToggle }: NeedChipsProps) {
  return (
    <fieldset className="noscript:hidden">
      <legend className={`${metaLabel} mb-3.5 uppercase`}>{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isPressed = pressed.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={isPressed}
              onClick={() => onToggle(option)}
              className={`${chipBase} ${isPressed ? chipPressed : chipUnpressed}`}
            >
              {isPressed && <CheckIcon className="size-3.5" />}
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
