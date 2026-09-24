// True only for a real value: a non-empty string with no `[FILL: …]` marker anywhere
// in it, in any case (constitution §8). Used to hide links whose address hasn't been
// supplied yet, including half-filled ones like "mailto:[FILL: …]".
const fillMarker = /\[fill/i;

export function isFilled(value: string | null | undefined): value is string {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  return trimmed.length > 0 && !fillMarker.test(trimmed);
}
