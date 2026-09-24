// Brief builder (03): "what do you repeat every week", a free-text field (ui-spec §8.2).
// The placeholder is the first sample phrase; the motion pass rotates it (`brief-placeholder`).
// Uncontrolled, so text typed before hydration survives it (`useBriefState` reads it back), and
// capped at 500 characters so the mailto stays a safe length. Hidden without JavaScript, where
// Send can't carry it.
import { useId } from "react";
import { briefFieldNames } from "@/lib/brief";
import { focusRing, metaLabel } from "@/lib/styles";

const maxLength = 500;

type RepeatFieldProps = {
  readonly label: string;
  readonly placeholder: string;
  readonly onChange: (value: string) => void;
};

export function RepeatField({ label, placeholder, onChange }: RepeatFieldProps) {
  const id = useId();
  return (
    <div className="noscript:hidden">
      <label htmlFor={id} className={`${metaLabel} mb-3.5 block uppercase`}>
        {label}
      </label>
      <textarea
        id={id}
        name={briefFieldNames.repeat}
        rows={4}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        data-anim="brief-placeholder"
        className={`min-h-30 w-full resize-y rounded-xl border border-muted/70 bg-bg px-4.5 py-4 text-body-lg leading-normal text-text placeholder:text-muted focus-visible:border-accent ${focusRing}`}
      />
    </div>
  );
}
