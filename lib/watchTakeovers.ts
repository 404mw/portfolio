// Watches whether any project takeover is open (its `<dialog>`'s `open` attribute), so motion on
// the page beneath can pause while one covers it. Calls `onChange` once at start and whenever that
// changes. Reads the dialogs only; opening and closing stay with hooks/useHashTakeover.ts. Returns
// the cleanup that stops watching.
export function watchTakeovers(ids: readonly string[], onChange: (open: boolean) => void): () => void {
  const dialogs = ids
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLDialogElement => el instanceof HTMLDialogElement);
  let open = dialogs.some((dialog) => dialog.open);
  onChange(open);

  const observer = new MutationObserver(() => {
    const next = dialogs.some((dialog) => dialog.open);
    if (next === open) return;
    open = next;
    onChange(open);
  });
  dialogs.forEach((dialog) => observer.observe(dialog, { attributes: true, attributeFilter: ["open"] }));

  return () => observer.disconnect();
}
