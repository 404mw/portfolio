// Watches which project takeovers are open (each `<dialog>`'s `open` attribute), for motion that
// needs to know which one opened, not just whether any did (that's lib/watchTakeovers.ts). Calls
// `onChange` with the open dialogs' ids, in `ids` order, once at start and whenever that set
// changes. A Next handover reports both while the old one is still open beneath the new one. Reads
// the dialogs only; opening and closing stay with hooks/useHashTakeover.ts. Returns the cleanup
// that stops watching.
export function watchOpenTakeovers(ids: readonly string[], onChange: (open: readonly string[]) => void): () => void {
  const dialogs = ids
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLDialogElement => el instanceof HTMLDialogElement);
  const openIds = () => dialogs.filter((dialog) => dialog.open).map((dialog) => dialog.id);
  let open = openIds();
  onChange(open);

  const observer = new MutationObserver(() => {
    const next = openIds();
    if (next.length === open.length && next.every((id, i) => id === open[i])) return;
    open = next;
    onChange(open);
  });
  dialogs.forEach((dialog) => observer.observe(dialog, { attributes: true, attributeFilter: ["open"] }));

  return () => observer.disconnect();
}
