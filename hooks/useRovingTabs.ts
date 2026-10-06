// A vertical tab list with a roving tabIndex (ui-spec §4.2). Up/Down move to the previous or
// next tab and select it (wrapping), Home/End jump to the first or last. Only the selected tab
// is in the Tab order, so Tab leaves the list and moves into the panel.
// `select` never moves focus (clicks and the motion pass's auto-advance use it); only the
// keyboard path selects and focuses. `step(delta)` selects the previous or next tab, wrapping, and
// moves no focus (the phone stepper's buttons, ui-spec §4.2a). When `resetKey` changes (the list now holds another set of
// tabs), the selection goes back to the first tab, in the same render, and focus stays where it is.
import { useRef, useState, type KeyboardEvent } from "react";

export function useRovingTabs(count: number, resetKey?: string) {
  const [selected, setSelected] = useState(0);
  const [lastKey, setLastKey] = useState(resetKey);
  const tabs = useRef<(HTMLElement | null)[]>([]);

  if (lastKey !== resetKey) {
    setLastKey(resetKey);
    setSelected(0);
  }

  function select(index: number) {
    setSelected(index);
  }

  function step(delta: 1 | -1) {
    setSelected((current) => (current + delta + count) % count);
  }

  function selectAndFocus(index: number) {
    select(index);
    tabs.current[index]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    const last = count - 1;
    const next: Record<string, number> = {
      ArrowDown: selected === last ? 0 : selected + 1,
      ArrowUp: selected === 0 ? last : selected - 1,
      Home: 0,
      End: last,
    };
    if (!(event.key in next)) return;
    event.preventDefault();
    selectAndFocus(next[event.key]);
  }

  function tabRef(index: number) {
    return (element: HTMLElement | null) => {
      tabs.current[index] = element;
    };
  }

  return { selected, select, step, onKeyDown, tabRef };
}
