// Section 3, Marquee: a transition strip, no claim (ui-spec §3). The visible strip is
// decorative (`aria-hidden`) and holds two identical sets, each with the items twice, so the
// motion pass can loop it by moving the track to -50%; screen readers get the plain list instead.
// Static: one still, clipped row that never scrolls the page sideways. `MarqueeMotion` (client)
// renders nothing; it finds the strip by `data-anim="marquee"` and loops the track.
// The strip sits under the hero's slanted bottom edge, at the same 3°. The wrapper is pulled up
// by `--slant-drop` (lib/styles.ts) into the triangle the hero cuts away, and pads the strip by
// half the drop above and below. The strip turns −3° about the middle of its top edge, which is
// the middle of the hero's cut, so its top edge lies along the cut and covers none of the hero;
// the bottom padding holds the strip's low left end. The strip is 110% wide so its turned ends
// stay off screen, and the wrapper clips them, so nothing scrolls sideways.
import { MarqueeMotion } from "@/components/home/MarqueeMotion";
import { AsteriskIcon } from "@/components/icons/AsteriskIcon";
import { marquee } from "@/content/home";
import { slantDrop } from "@/lib/styles";

const sets = ["a", "b"] as const;
// Each set repeats the items twice so one set is wider than a 3840px viewport.
const runs = [1, 2] as const;

export function MarqueeStrip() {
  return (
    <div
      className={`${slantDrop} -mt-(--slant-drop) overflow-clip py-[calc(var(--slant-drop)/2)]`}
    >
      <div
        data-anim="marquee"
        className="-mx-[5%] w-[110%] origin-top -rotate-3 overflow-hidden border-y border-line bg-band py-5.5"
      >
        <MarqueeMotion />
        <div aria-hidden="true" data-anim="marquee-track" className="flex w-max">
          {sets.map((set) => (
            <div
              key={set}
              data-anim="marquee-set"
              className="flex shrink-0 items-center gap-14 pr-14"
            >
              {runs.flatMap((run) =>
                marquee.items.map((item) => (
                  <span
                    key={`${run}-${item}`}
                    className={`flex items-center gap-14 font-display text-marquee leading-none whitespace-nowrap text-muted/30`}
                  >
                    {item}
                    <AsteriskIcon className="size-8 shrink-0 text-accent" />
                  </span>
                )),
              )}
            </div>
          ))}
        </div>
        <ul className="sr-only">
          {marquee.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
