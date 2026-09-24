"use client";

// The takeover's Close link (ui-spec §7.3 part 1). Without JS it's a plain link to #proofs,
// which un-targets the dialog. With JS it closes the way Esc does (lib/takeoverLinks.ts).
import { CloseIcon } from "@/components/icons/CloseIcon";
import { proofs } from "@/content/home";
import { routes } from "@/lib/routes";
import { pillInk } from "@/lib/styles";
import { requestTakeoverClose } from "@/lib/takeoverLinks";

export function TakeoverCloseLink() {
  return (
    <a
      href={routes.proofs}
      onClick={requestTakeoverClose}
      className={`${pillInk} min-h-11 shrink-0 gap-2.5 px-4 font-mono text-nav font-medium`}
    >
      {proofs.takeover.close}
      <span aria-hidden="true" className="hidden md:inline">
        {proofs.takeover.escHint}
      </span>
      <CloseIcon className="size-4" />
    </a>
  );
}
