// The tantrum's deselect (ui-spec/00-rix.md R6A.4): unchecks the checked radio in About group
// `name` and dispatches an untrusted, bubbling `change` on it, so `useAboutPick` re-reads (null)
// and every `WhatsAppLink` on that pick falls back to the default message. The pick act and the
// About status ignore untrusted changes, so nothing plays and nothing is announced. DOM only, no
// motion: focus and scroll don't move, and the URL's `?for` is never rewritten. Returns the radio
// it unchecked, or null if nothing in the group was checked.
export function deselectAbout(root: ParentNode, name: string): HTMLInputElement | null {
  const input = root.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`);
  if (!input) return null;
  input.checked = false;
  input.dispatchEvent(new Event("change", { bubbles: true }));
  return input;
}
