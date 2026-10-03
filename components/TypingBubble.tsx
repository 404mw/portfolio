// The three-dot typing bubble (ui-spec §0.4), used by Agents' chat demo.
// Hidden in the static page; the motion pass shows it through its `data-anim` hook. `side` puts it
// on the speaker's side with its tail toward them. Other `data-*` hooks pass through. Decorative.
import type { ComponentPropsWithoutRef } from "react";

const sideClasses = {
  start: "self-start rounded-tl-sm",
  end: "self-end rounded-br-sm",
} as const;

const dots = ["a", "b", "c"] as const;

type TypingBubbleProps = Omit<ComponentPropsWithoutRef<"div">, "className" | "children"> & {
  readonly side: keyof typeof sideClasses;
  readonly anim: string;
};

export function TypingBubble({ side, anim, ...hooks }: TypingBubbleProps) {
  return (
    <div
      {...hooks}
      aria-hidden="true"
      data-anim={anim}
      className={`hidden items-center gap-1.5 rounded-xl bg-line/40 px-4.5 py-4 ${sideClasses[side]}`}
    >
      {dots.map((dot) => (
        <span key={dot} className="size-1.5 rounded-full bg-muted" />
      ))}
    </div>
  );
}
