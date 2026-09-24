// Click handlers for the takeover's Close and Next links (ui-spec §7.3). A modified or
// non-primary click (new tab, new window) keeps the browser's default. Without JS both are plain
// hash links; hooks/useHashTakeover.ts does the opening and closing from the hash.
import type { MouseEvent } from "react";

type LinkClick = MouseEvent<HTMLAnchorElement>;

function isPlainClick(event: LinkClick): boolean {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

/** Close: on an open dialog, raise its `cancel` event, so Close takes the same path as Esc. */
export function requestTakeoverClose(event: LinkClick): void {
  if (!isPlainClick(event)) return;
  const dialog = event.currentTarget.closest("dialog");
  if (!dialog?.open) return;
  event.preventDefault();
  dialog.dispatchEvent(new Event("cancel", { cancelable: true }));
}

/** Next: replace the hash, so Back closes the takeover rather than stepping through projects. */
export function replaceTakeoverHash(event: LinkClick): void {
  if (!isPlainClick(event)) return;
  event.preventDefault();
  window.location.replace(event.currentTarget.hash);
}
