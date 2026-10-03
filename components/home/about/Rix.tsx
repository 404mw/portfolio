// Rix as the shelf places him (02a-about-options §2a.O0.1): `RixButton` around the server-drawn
// host bot (static idle pose, all §5.6 `data-bot` hooks) holding `RixProps`, then `RixEmotes`
// (00-rix.md R1.3). The caller passes only his size, quip placement, quip text size and quip key.
import { RixButton } from "@/components/home/about/RixButton";
import { RixEmotes } from "@/components/home/about/RixEmotes";
import { RixProps } from "@/components/home/about/RixProps";
import { ProcessBot } from "@/components/home/process/ProcessBot";

type RixPlacementProps = {
  readonly size: string;
  readonly quipPlacement: string;
  /** The instance's section id (home's About, or the /rix playground): its quip store key. */
  readonly quipKey: string;
  /** The quip's text-size classes (`RixQuip`'s default when absent). */
  readonly quipText?: string;
};

export function Rix({ size, quipPlacement, quipKey, quipText }: RixPlacementProps) {
  return (
    <RixButton size={size} quipPlacement={quipPlacement} quipKey={quipKey} quipText={quipText}>
      <ProcessBot role="host" pose="idle" className="block size-full">
        <RixProps />
        <RixEmotes />
      </ProcessBot>
    </RixButton>
  );
}
