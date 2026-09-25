// A ref to the element with `id`, for motion components that render nothing inside a server
// section. It's filled in a layout effect, so hooks declared after it in the same component
// (e.g. `useGSAP`, which also runs as a layout effect) already see the element.
import { useLayoutEffect, useRef, type RefObject } from "react";

export function useElementById<T extends HTMLElement>(id: string): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  useLayoutEffect(() => {
    ref.current = document.getElementById(id) as T | null;
  }, [id]);
  return ref;
}
