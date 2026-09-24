// A takeover's screenshots (ui-spec §7.3 part 5, §7.6): one big 2:1 shot, then two 4:3 details,
// side by side from `sm`. Shots and alts are three-item tuples, so they can't drift apart.
import { SiteImage } from "@/components/SiteImage";
import type { ImageName } from "@/lib/images";
import type { ShotTriple } from "@/lib/proofs";

type TakeoverShotsProps = {
  readonly shots: ShotTriple<ImageName>;
  readonly alts: ShotTriple<string>;
};

const frame = "relative overflow-hidden rounded-3xl";

export function TakeoverShots({ shots, alts }: TakeoverShotsProps) {
  const details = [
    { name: shots[1], alt: alts[1] },
    { name: shots[2], alt: alts[2] },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className={`${frame} aspect-[2/1]`}>
        <SiteImage name={shots[0]} alt={alts[0]} sizes="min(100vw, 1536px)" position="top" placeholderTone="cream" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {details.map(({ name, alt }) => (
          <div key={name} className={`${frame} aspect-[4/3]`}>
            <SiteImage
              name={name}
              alt={alt}
              sizes="(min-width:1536px) 760px, (min-width:640px) 50vw, 100vw"
              position="center"
              placeholderTone="cream"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
