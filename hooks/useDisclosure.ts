// JS enhancements for a native <details> disclosure (the phone menu), which opens and closes
// without JS. Tracks whether it's open (pass `onToggle` to the <details>), syncing from the DOM
// on mount in case it was opened before hydration, and `close` shuts it. Escape closes it
// (unless another handler already took the key) and returns focus to its <summary> only if
// focus was inside the <details> or on the page body. Focus is not trapped. No animation.
import { useCallback, useEffect, useRef, useState } from "react";

export function useDisclosure() {
  const [open, setOpen] = useState(false);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const summaryRef = useRef<HTMLElement>(null);

  const onToggle = useCallback(() => setOpen(detailsRef.current?.open ?? false), []);
  const close = useCallback(() => {
    if (detailsRef.current) detailsRef.current.open = false;
  }, []);

  // A toggle before hydration fires before React attaches `onToggle`, so read the real state.
  useEffect(() => {
    setOpen(detailsRef.current?.open ?? false);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      const active = document.activeElement;
      const focusInside = active === document.body || detailsRef.current?.contains(active);
      close();
      if (focusInside) summaryRef.current?.focus();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  return { open, onToggle, close, detailsRef, summaryRef };
}
