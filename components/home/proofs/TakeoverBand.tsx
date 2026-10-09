// The takeover's title band (ui-spec/07-proofs-band.md §A, placed per 07-proofs-sticky-band.md §A):
// the card's ink-stage banner grown wider and thinner, behind the project title. It is the shared
// ink stage (`InkStageGround`, floor glow, which supplies `absolute`), filling the takeover head
// (`TakeoverHead`), so its box is exactly the title plus the title's margins, at one line or two.
// Decorative, so hidden from assistive tech (`aria-hidden` comes from `InkStageGround`).
import { InkStageGround } from "@/components/home/proofs/InkStageGround";

export function TakeoverBand() {
  return (
    <InkStageGround
      glow="floor"
      anim="takeover-band"
      className="pointer-events-none inset-0 rounded-3xl"
    />
  );
}
