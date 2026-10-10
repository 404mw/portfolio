// Calls `onSeen` once, the first time at least `share` (0–1) of `element` is on screen, including
// at setup if it already is. Returns the cleanup that stops watching (a no-op once it has fired).
// `options` can watch inside a scroller instead of the window (`root`, e.g. a takeover's dialog)
// and pull the line in (`rootMargin`, e.g. "0px 0px -20% 0px": once it's 20% up from the bottom).

export type InViewOptions = {
  readonly root?: Element;
  readonly rootMargin?: string;
};

export function onceInView(
  element: Element,
  share: number,
  onSeen: () => void,
  options: InViewOptions = {},
): () => void {
  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[entries.length - 1];
      if (!entry?.isIntersecting || entry.intersectionRatio < share) return;
      observer.disconnect();
      onSeen();
    },
    { threshold: share, root: options.root ?? null, rootMargin: options.rootMargin },
  );
  observer.observe(element);
  return () => observer.disconnect();
}
