// A takeover's screenshots (ui-spec §7.3.1 part 3, §7.6): one layout for every project. One big
// 2:1 shot, then two 4:3 details, side by side from `sm`. Each shot carries the edge its frame
// keeps (lib/proofs.ts). Shots and alts are tuples of three, so they can't drift apart. Each frame
// is the clip for the later reveal.
import { SiteImage } from "@/components/SiteImage";
import type { ProofShot, ProofShots } from "@/lib/proofs";

type TakeoverShotsProps = {
  readonly shots: ProofShots<ProofShot>;
  readonly alts: ProofShots<string>;
};

const frame = "relative overflow-hidden rounded-3xl";

export function TakeoverShots({ shots, alts }: TakeoverShotsProps) {
  const [big, ...rest] = shots;
  const details = rest.map((shot, index) => ({ ...shot, alt: alts[index + 1] }));

  return (
    <div className="flex flex-col gap-5">
      <div data-anim="takeover-shot" className={`${frame} aspect-2/1`}>
        <SiteImage
          name={big.name}
          alt={alts[0]}
          sizes="min(100vw, 1536px)"
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
