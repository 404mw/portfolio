// Two-digit list numbers: "01", "03".

/** A number as two digits: 3 → "03". */
export function twoDigits(n: number): string {
  return String(n).padStart(2, "0");
}

/** A list row's two-digit number from its zero-based index: 0 → "01". */
export function listNumber(index: number): string {
  return twoDigits(index + 1);
}
