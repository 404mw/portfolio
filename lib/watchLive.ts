// Watches whether `element` is worth animating: on screen and in a visible tab. Calls `onChange`
// with that once the first observation arrives and whenever it changes, so loops and timers can
// pause while nobody can see them. Returns the cleanup that stops watching.
export function watchLive(element: Element, onChange: (live: boolean) => void): () => void {
  let onScreen = false;
  const report = () => onChange(onScreen && document.visibilityState === "visible");

  const observer = new IntersectionObserver((entries) => {
    onScreen = entries[entries.length - 1]?.isIntersecting ?? false;
    report();
  });
  observer.observe(element);
  document.addEventListener("visibilitychange", report);

  return () => {
    observer.disconnect();
    document.removeEventListener("visibilitychange", report);
  };
}
