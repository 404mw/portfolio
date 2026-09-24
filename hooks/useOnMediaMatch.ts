// Calls `onMatch` whenever `query` starts matching (e.g. the viewport reaches `md`).
import { useEffect } from "react";

export function useOnMediaMatch(query: string, onMatch: () => void) {
  useEffect(() => {
    const media = window.matchMedia(query);
    function onChange(event: MediaQueryListEvent) {
      if (event.matches) onMatch();
    }
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [query, onMatch]);
}
