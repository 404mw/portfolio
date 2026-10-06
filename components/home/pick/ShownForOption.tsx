// One card in the "Shown for" tag's list (ui-spec §0.6): a native radio, visually hidden, under a
// chip. Checked turns the chip accent and shows a tick, so state isn't colour alone. The radio's
// `name` is the tag's own group, never About's.
import type { ChangeEventHandler } from "react";
import { CheckIcon } from "@/components/icons/CheckIcon";
import { chip } from "@/lib/styles";

const optionStates =
  "border-line text-muted peer-not-checked:hover:border-muted peer-not-checked:hover:text-text peer-not-checked:active:bg-band peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-text peer-checked:border-accent peer-checked:bg-accent peer-checked:font-medium peer-checked:text-on-accent";

type ShownForOptionProps = {
  /** The tag's radio group. */
  readonly name: string;
  /** The card's key. */
  readonly value: string;
  readonly label: string;
  readonly checked: boolean;
  readonly onChange: ChangeEventHandler<HTMLInputElement>;
};

export function ShownForOption({ name, value, label, checked, onChange }: ShownForOptionProps) {
  return (
    <label className="group/opt cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span className={`${chip} ${optionStates}`}>
        <CheckIcon className="hidden size-3.5 group-has-checked/opt:block" />
        {label}
      </span>
    </label>
  );
}
