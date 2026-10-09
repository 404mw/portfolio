// The takeover's head (ui-spec/07-proofs-sticky-band.md §A): the ink title band and the project
// title, wrapped as one box so the pair can stick as one. The band (`TakeoverBand`) is absolute
// and fills the head; the title's margins are the band's padding, so the head's box is exactly the
// title plus its margins, at one line or two.
// Sticky only while the motion's condense runs: it sets `data-condense` and `--takeover-stick` on
// the dialog (hooks/useTakeoverMotion.ts). Without them (no JS, reduced motion, before setup) the
// head is `relative` and scrolls away with the content. `z-1` keeps it above later positioned
// parts and below the top bar; `pointer-events-none` keeps content under its clear part clickable
// once stuck (it holds nothing interactive).
import { TakeoverBand } from "@/components/home/proofs/TakeoverBand";

type TakeoverHeadProps = {
  readonly id: string;
  readonly title: string;
};

export function TakeoverHead({ id, title }: TakeoverHeadProps) {
  return (
    <div
      data-anim="takeover-head"
      className="pointer-events-none relative z-1 [[data-condense]_&]:sticky [[data-condense]_&]:top-(--takeover-stick)"
    >
      <TakeoverBand />
      <h2
        id={id}
        data-anim="takeover-title"
        className="relative mx-5 mt-5 mb-4 font-display text-takeover leading-none text-text md:mx-8 md:mt-7 md:mb-6 lg:mx-12 lg:mt-10 lg:mb-8"
      >
        {title}
      </h2>
    </div>
  );
}
