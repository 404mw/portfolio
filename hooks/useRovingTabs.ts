// A vertical tab list with a roving tabIndex (ui-spec §4.2). Up/Down move to the previous or
// next tab and select it (wrapping), Home/End jump to the first or last. Only the selected tab
// is in the Tab order, so Tab leaves the list and moves into the panel.
// `select` never moves focus (clicks and the motion pass's auto-advance use it); only the
// keyboard path selects and focuses.
import { useRef, useState, type KeyboardEvent } from "react";

export function useRovingTabs(count: number) {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLElement | null)[]>([]);

  function select(index: number) {
    setSelected(index);
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

  return { selected, select, onKeyDown, tabRef };
}
