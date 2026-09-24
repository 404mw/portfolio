// Section 3, Marquee: a transition strip, no claim (ui-spec §3). The visible strip is
// decorative (`aria-hidden`) and holds two identical sets so the motion pass can loop it by
// moving the track to -50%; screen readers get the plain list instead. Static: one still,
// clipped row that never scrolls the page sideways.
import { AsteriskIcon } from "@/components/icons/AsteriskIcon";
import { marquee } from "@/content/home";
import { condensed } from "@/lib/styles";

const sets = ["a", "b"] as const;

export function MarqueeStrip() {
  return (
    <div className="overflow-hidden border-y border-line bg-band py-5.5">
      <div aria-hidden="true" data-anim="marquee-track" className="flex w-max">
        {sets.map((set) => (
          <div
            key={set}
            data-anim="marquee-set"
            className="flex shrink-0 items-center gap-14 pr-14"
          >
            {marquee.items.map((item) => (
              <span
                key={item}
                className={`flex items-center gap-14 font-display text-marquee leading-none font-medium tracking-[-0.02em] whitespace-nowrap text-muted/30 ${condensed}`}
              >
                {item}
                <AsteriskIcon className="size-8 shrink-0 text-accent" />
              </span>
            ))}
          </div>
        ))}
      </div>
      <ul className="sr-only">
        {marquee.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
