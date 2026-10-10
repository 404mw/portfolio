// A takeover's screenshots (ui-spec §7.3.1 part 3, §7.6), in the layout its shot count picks.
// It is only ever given two or three shots: a project with none (ui-spec §7.9) draws no
// TakeoverShots at all, so this never renders an empty wrapper (ProjectTakeover decides).
// Two shots: two 2:1 frames stacked, the same at every width. Three shots: one big 2:1 shot, then
// two 4:3 details, side by side from `sm`. Each shot carries the edge its frame keeps and its alt,
// paired by index in lib/proofs.ts, so they can't drift apart. Each frame is the clip for the
// later reveal.
import { SiteImage } from "@/components/SiteImage";
import type { ProofShots, ProofShotWithAlt } from "@/lib/proofs";

type TakeoverShotsProps = {
  readonly shots: ProofShots<ProofShotWithAlt>;
};

const frame = "relative overflow-hidden rounded-3xl";
const wideSizes = "min(100vw, 1536px)";

export function TakeoverShots({ shots }: TakeoverShotsProps) {
  if (shots.length === 2) {
    return (
      <div className="flex flex-col gap-5">
        {shots.map(({ name, position, alt }) => (
          <div key={name} data-anim="takeover-shot" className={`${frame} aspect-2/1`}>
            <SiteImage name={name} alt={alt} sizes={wideSizes} position={position} placeholderTone="cream" />
          </div>
        ))}
      </div>
    );
  }

  const [big, ...details] = shots;

  return (
    <div className="flex flex-col gap-5">
      <div data-anim="takeover-shot" className={`${frame} aspect-2/1`}>
        <SiteImage
          name={big.name}
          alt={big.alt}
          sizes={wideSizes}
          position={big.position}
          placeholderTone="cream"
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {details.map(({ name, position, alt }) => (
          <div key={name} data-anim="takeover-shot" className={`${frame} aspect-4/3`}>
            <SiteImage
              name={name}
              alt={alt}
              sizes="(min-width:1536px) 760px, (min-width:640px) 50vw, 100vw"
              position={position}
              placeholderTone="cream"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
