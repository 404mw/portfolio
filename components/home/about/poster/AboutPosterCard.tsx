// One poster card (02a-about-options §2a.B): a native radio, visually hidden, under a tall card
// with the group's emblem and a tick at the top and its label below. Checked turns the card
// accent and shows the tick, so state isn't colour alone. Motion hook: `about-chip`.
import { AboutPropGlyph } from "@/components/home/about/AboutPropGlyph";
import { CheckIcon } from "@/components/icons/CheckIcon";
import type { RixPropName } from "@/lib/rixProps";
import { condensed } from "@/lib/styles";

const cardStates =
  "border-line bg-band text-text peer-not-checked:hover:border-muted peer-not-checked:active:bg-line peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-text peer-checked:border-accent peer-checked:bg-accent peer-checked:text-on-accent";

// The pick lock (00-rix R6A.9): motion code sets `data-locked` on the board while Rix throws a
// tantrum. Unchecked cards dim and lose their hover and active feedback; checked and focus stay.
const lockedStates =
  "group-data-locked/board:peer-not-checked:opacity-60 group-data-locked/board:peer-not-checked:hover:border-line group-data-locked/board:peer-not-checked:active:bg-band";

type AboutPosterCardProps = {
  readonly index: number;
  readonly value: string;
  readonly label: string;
  readonly prop: RixPropName | null;
  /** About's radio group. */
  readonly name: string;
};

export function AboutPosterCard({ index, value, label, prop, name }: AboutPosterCardProps) {
  return (
    <label data-anim="about-chip" className="group/card block cursor-pointer group-data-locked/board:cursor-not-allowed">
      <input type="radio" name={name} data-reply={index} value={value} className="peer sr-only" />
      <span
        className={`flex h-full min-h-36 flex-col justify-between rounded-3xl border p-4 md:min-h-52 md:p-5 lg:min-h-64 lg:p-6 2xl:min-h-72 ${cardStates} ${lockedStates}`}
      >
        <span className="flex items-start justify-between">
          <AboutPropGlyph prop={prop} className="size-10 md:size-12 lg:size-14" />
          <CheckIcon className="hidden size-4 group-has-checked/card:block" />
        </span>
        <span
          className={`font-display text-summary font-semibold leading-[1.05] tracking-[-0.02em] text-balance md:text-card ${condensed}`}
        >
          {label}
        </span>
      </span>
    </label>
  );
}
