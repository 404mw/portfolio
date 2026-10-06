// Closes an open disclosure when the visitor leaves it (ui-spec §0.6): a press outside it, or
// focus moving outside it. Listens only while `open`. Escape and the focus return are
// `useDisclosure`'s; this hook never moves focus. Focus falling back to an ancestor of the box
// (a press on something unfocusable inside it moves focus to, say, `<main tabindex="-1">`) is not
// leaving: closing there would shut the list before the press's click lands.
import { useEffect, type RefObject } from "react";

export function useCloseOnLeave(box: RefObject<HTMLElement | null>, open: boolean, close: () => void) {
  useEffect(() => {
    if (!open) return;
    const onLeave = (event: Event) => {
      const element = box.current;
      if (!(event.target instanceof Node) || !element || element.contains(event.target)) return;
      if (event.type === "focusin" && event.target.contains(element)) return;
      close();
    };
    document.addEventListener("pointerdown", onLeave);
    document.addEventListener("focusin", onLeave);
    return () => {
      document.removeEventListener("pointerdown", onLeave);
      document.removeEventListener("focusin", onLeave);
    };
  }, [box, open, close]);
}
