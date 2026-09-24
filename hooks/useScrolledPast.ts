// True once the element with `targetId` has scrolled fully above the viewport's top edge
// (moved down by `rootMargin`, e.g. the fixed header's height). Starts `false`, matching the
// server markup. If the element isn't on the page, it does nothing and stays `false`.
import { useEffect, useState } from "react";

export function useScrolledPast(targetId: string, rootMargin: string): boolean {
  const [past, setPast] = useState(false);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setPast(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { rootMargin },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [targetId, rootMargin]);

  return past;
}
