// A ref to the first `[data-anim="<name>"]` element in the document, for motion components that
// render nothing beside a part that has a hook but no id (the footer Rix's row). Like
// `useElementById`, it's filled in a layout effect, so hooks declared after it in the same component
// (e.g. `useGSAP`, which also runs as a layout effect) already see the element.
import { useLayoutEffect, useRef, type RefObject } from "react";
import { animTargets } from "@/lib/motion";

export function useAnimTarget<T extends HTMLElement>(name: string): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  useLayoutEffect(() => {
    ref.current = animTargets<T>(document, name)[0] ?? null;
  }, [name]);
  return ref;
}
