// Calls `onSeen` once, the first time at least `share` (0–1) of `element` is on screen, including
// at setup if it already is. Returns the cleanup that stops watching (a no-op once it has fired).
export function onceInView(element: Element, share: number, onSeen: () => void): () => void {
  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[entries.length - 1];
      if (!entry?.isIntersecting || entry.intersectionRatio < share) return;
      observer.disconnect();
      onSeen();
    },
    { threshold: share },
  );
  observer.observe(element);
  return () => observer.disconnect();
}
