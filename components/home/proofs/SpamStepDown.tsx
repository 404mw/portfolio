// The spam diagram's down arrow on a phone (ui-spec/07-proofs-spam.md): a small chevron on cream,
// centred in the 40px gap under a step's band, 20px in. Hidden from `md`, where the band's own
// arrow takes over. Decorative; the list gives the order.
import { ChevronUpIcon } from "@/components/icons/ChevronUpIcon";

export function SpamStepDown() {
  return (
    <span aria-hidden="true" data-anim="spam-chevron" className="absolute -bottom-6.5 left-5 text-cream-muted md:hidden">
      <ChevronUpIcon className="size-3 rotate-180" />
    </span>
  );
}
